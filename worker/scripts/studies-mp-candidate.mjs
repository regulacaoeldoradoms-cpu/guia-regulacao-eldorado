// Preparação offline. Não importar este módulo Node no Worker ou no catálogo ativo.
import { pathToFileURL } from 'node:url';
import {
  PUBLISHED_MISSIONS, STUDY_SOURCES, validateTeachingCatalog
} from '../studies-content/manifest.js';
import { validateQuestionFeedback } from '../studies-content/question-feedback-v1.js';

// Proposta de IDs estáveis e sequência; a aprovação de publicação ainda está pendente.
export const MP_PLAN = Object.freeze([
  ['mp01', 'mercados'], ['mp02', 'moeda'], ['mp03', 'inflacao'],
  ['mp04', 'politica-monetaria'], ['mp05', 'instrumentos'], ['mp06', 'qe-depositos'],
  ['mp07', 'divida-publica'], ['mp08', 'interbancario'], ['mp09', 'curva-juros'],
  ['mpr', 'revisao'], ['mpchefe', 'boss']
].map(([unit, suffix], index) => Object.freeze({
  unit, id: `banking.mp.${suffix}`, order: index + 10,
  prerequisiteId: index === 0 ? 'banking.sfn.boss' : null
})));

export async function loadMpEditorial() {
  return Promise.all(MP_PLAN.map(async ({ unit }) => {
    const module = await import(`../../docs/missao-bancaria/rascunhos/mp-${unit.slice(2)}-v1.mjs`);
    return { unit, draft: module[`${unit.toUpperCase()}_DRAFT`], sources: module.SOURCES };
  }));
}

export function compileMpCandidate(editorial) {
  const byUnit = new Map(editorial.map(entry => [entry.unit, entry]));
  if (byUnit.size !== MP_PLAN.length || editorial.length !== MP_PLAN.length) {
    throw new Error('O pacote MP requer as onze unidades, sem duplicatas.');
  }
  const idMap = new Map(MP_PLAN.map(plan => [`draft.${plan.unit}`, plan.id]));
  const remap = id => {
    if (!idMap.has(id)) throw new Error(`Referência editorial desconhecida: ${id}`);
    return idMap.get(id);
  };
  const sources = [];
  const feedback = [];
  const readingRequirements = [];
  const missions = MP_PLAN.map((plan, index) => {
    const entry = byUnit.get(plan.unit);
    if (!entry || entry.draft.id !== `draft.${plan.unit}` || entry.draft.publication.status !== 'draft') {
      throw new Error(`${plan.unit}: origem deve permanecer draft.`);
    }
    const draft = structuredClone(entry.draft);
    const sourceIds = new Map(entry.sources.map(source => [source.id, `mp.${plan.unit}.${source.id}`]));
    if (sourceIds.size !== entry.sources.length) throw new Error(`${plan.unit}: fonte duplicada.`);
    const remapSource = id => {
      if (!sourceIds.has(id)) throw new Error(`${plan.unit}: fonte desconhecida: ${id}`);
      return sourceIds.get(id);
    };
    sources.push(...entry.sources.map(source => ({ ...source, id: remapSource(source.id) })));
    const questionCoverage = {};
    const questions = draft.questions.map(question => {
      const id = `q.${question.id}`;
      const refs = [
        ...(draft.teaching.questionCoverage[question.id] || []).map(ref => ({
          missionId: remap(ref.missionId), sectionId: ref.sectionId
        })),
        ...(question.originRefs || []).map(ref => ({
          missionId: remap(`draft.${ref.unit}`), sectionId: ref.sectionId
        }))
      ];
      questionCoverage[id] = [...new Map(refs.map(ref => [`${ref.missionId}:${ref.sectionId}`, ref])).values()];
      feedback.push({ questionId: id, optionReasons: [...question.optionRationales] });
      // Somente o endpoint pós-resposta usa estes campos; publicMission mantém sua projeção explícita.
      return {
        id, topicId: plan.id, prompt: question.prompt, options: question.options,
        answer: question.answer, explanation: question.explanation,
        optionRationales: question.optionRationales
      };
    });
    // Não remover Markdown/Mermaid silenciosamente: conserva a fonte aprovada e enumera
    // os pontos que ainda precisam de adaptação de apresentação antes de publicar.
    for (const [location, text] of [
      ...draft.sections.map(section => [`section:${section.id}`, section.body]),
      ...draft.questions.map(question => [`question:q.${question.id}`, question.prompt])
    ]) {
      const formats = [
        /```mermaid/.test(text) && 'diagram',
        /^\|/m.test(text) && 'table',
        /\[[^\]]+\]\([^)]+\.md(?:#[^)]+)?\)/.test(text) && 'lesson-link'
      ].filter(Boolean);
      if (formats.length) readingRequirements.push({ missionId: plan.id, location, formats });
    }
    return {
      id: plan.id, topicId: plan.id, contentVersion: draft.contentVersion,
      order: plan.order, title: draft.title, shortTitle: draft.editorialKey,
      kind: draft.kind, objective: draft.objective,
      // Valores de simulação, sujeitos à decisão agrupada; nada é publicado por este script.
      xp: draft.kind === 'boss' ? 220 : 100,
      passScore: draft.kind === 'boss' ? 75 : 0,
      publication: { status: 'draft', releaseId: 'markets-policy-intro-r1', releaseSequence: 2, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : MP_PLAN[index - 1].id,
        parametersApproved: false
      }
    };
  });
  const catalog = [...PUBLISHED_MISSIONS, ...missions];
  const allSources = [...STUDY_SOURCES, ...sources];
  const errors = [
    ...validateTeachingCatalog(catalog, allSources),
    ...validateQuestionFeedback(missions, feedback)
  ];
  const questionIds = catalog.flatMap(mission => mission.questions.map(question => question.id));
  const topics = catalog.map(mission => mission.topicId);
  if (new Set(questionIds).size !== questionIds.length) errors.push('duplicate-question-id');
  if (new Set(topics).size !== topics.length) errors.push('duplicate-topic-id');
  if (new Set(allSources.map(source => source.id)).size !== allSources.length) errors.push('duplicate-source-id');
  if (PUBLISHED_MISSIONS.at(-1)?.id !== MP_PLAN[0].prerequisiteId || PUBLISHED_MISSIONS.at(-1)?.order !== 9) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato MP inválido: ${errors.join(', ')}`);
  return { status: 'draft', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileMpCandidate(await loadMpEditorial());
  // Resumo, sem emitir um arquivo importável acidentalmente como conteúdo publicado.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: false
  }, null, 2));
}
