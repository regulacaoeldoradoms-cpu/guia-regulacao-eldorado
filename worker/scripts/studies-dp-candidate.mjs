// Preparação offline. Não importar este módulo Node no Worker ou no catálogo ativo.
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import {
  PUBLISHED_MISSIONS, STUDY_SOURCES, validateTeachingCatalog
} from '../studies-content/manifest.js';
import { validateQuestionFeedback } from '../studies-content/question-feedback-v1.js';
import { compilePresentation } from './studies-mp-presentation.mjs';

// Preparação desativada. Revisão pedagógica e autorização de ativação/publicação pendentes.
export const DP_PLAN = Object.freeze([
  ['dp01','canais'], ['dp02','transformacao'], ['dp03','empresas'], ['dp04','intermediacao'],
  ['dp05','arranjos'], ['dp06','pix'], ['dp07','open-finance'], ['dp08','blockchain'],
  ['dp09','cbdc'], ['dp10','correspondentes'], ['dp11','marketplace'], ['dp12','segmentacao'],
  ['dpr','revisao'], ['dpchefe','boss']
].map(([unit, suffix], index) => Object.freeze({
  unit, id: 'banking.dp.' + suffix, order: index + 51,
  prerequisiteId: index === 0 ? 'banking.ce.boss' : null
})));

export async function loadDpEditorial() {
  return Promise.all(DP_PLAN.map(async ({ unit }) => {
    const module = await import(`../../docs/missao-bancaria/rascunhos/dp-${unit.slice(2)}-v1.mjs`);
    return { unit, draft: module[`${unit.toUpperCase()}_DRAFT`], sources: module.SOURCES };
  }));
}

export function compileDpCandidate(editorial) {
  const baselineMissions = PUBLISHED_MISSIONS.filter(mission => mission.order < DP_PLAN[0].order);
  const baselineSources = [...STUDY_SOURCES];
  const byUnit = new Map(editorial.map(entry => [entry.unit, entry]));
  if (byUnit.size !== DP_PLAN.length || editorial.length !== DP_PLAN.length) {
    throw new Error('O pacote DP requer as quatorze unidades, sem duplicatas.');
  }
  const idMap = new Map(DP_PLAN.map(plan => [`draft.${plan.unit}`, plan.id]));
  const remap = id => {
    if (!idMap.has(id)) throw new Error(`Referência editorial desconhecida: ${id}`);
    return idMap.get(id);
  };
  const sources = [];
  const feedback = [];
  const readingRequirements = [];
  const missions = DP_PLAN.map((plan, index) => {
    const entry = byUnit.get(plan.unit);
    if (!entry || entry.draft.id !== `draft.${plan.unit}` || entry.draft.publication.status !== 'draft') {
      throw new Error(`${plan.unit}: origem deve permanecer draft.`);
    }
    const draft = structuredClone(entry.draft);
    // Texto editorial de rascunho preservado integralmente; nenhuma alteração de status dentro das aulas.
    const presentation = text => compilePresentation(text, href => {
      const match = href.match(/^dp-(0[1-9]|1[0-2]|r|chefe)-v1\.md(?:#([\w-]+))?$/);
      if (!match) return null;
      const unit = `dp${match[1]}`;
      const target = DP_PLAN.find(item => item.unit === unit);
      const sectionId = match[2] || byUnit.get(unit)?.draft.sections[0]?.id;
      if (!target || target.order > plan.order || !byUnit.get(unit)?.draft.sections.some(section => section.id === sectionId)) return null;
      return { missionId: target.id, sectionId, wholeLesson: !match[2] };
    });
    const rich = text => /```|^\||\[[^\]]+\]\([^)]+\)/m.test(text) ? { presentation: presentation(text) } : {};
    const sourceIds = new Map(entry.sources.map(source => [source.id, `dp.${plan.unit}.${source.id}`]));
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
        optionRationales: question.optionRationales, ...rich(question.prompt)
      };
    });
    // Conserva o texto de rascunho e o inventário dos locais convertidos em apresentação.
    // A apresentação não altera o ensino de rascunho.
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
      // Parâmetros propostos, seguindo a sequência e o XP existentes.
      xp: draft.kind === 'boss' ? 220 : 100,
      passScore: draft.kind === 'boss' ? 75 : 0,
      // Estimativa didática, não limite: leitura a 150 palavras/min + 2 min por questão,
      // arredondada para o próximo múltiplo de 5. Não controla cronômetro ou conclusão.
      estimatedMinutes: Math.ceil((draft.sections.reduce((sum, section) => sum + section.body.split(/\s+/).length, 0) / 150 + questions.length * 2) / 5) * 5,
      publication: { status: 'draft', releaseId: 'digital-payments-intro-r1', releaseSequence: 5, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource), ...rich(section.body) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : DP_PLAN[index - 1].id,
        parametersApproved: false
      }
    };
  });
  const catalog = [...baselineMissions, ...missions];
  const allSources = [...baselineSources, ...sources];
  const errors = [
    ...validateTeachingCatalog(catalog, allSources),
    ...validateQuestionFeedback(missions, feedback)
  ];
  const questionIds = catalog.flatMap(mission => mission.questions.map(question => question.id));
  const topics = catalog.map(mission => mission.topicId);
  if (new Set(questionIds).size !== questionIds.length) errors.push('duplicate-question-id');
  if (new Set(topics).size !== topics.length) errors.push('duplicate-topic-id');
  if (new Set(allSources.map(source => source.id)).size !== allSources.length) errors.push('duplicate-source-id');
  if (baselineMissions.at(-1)?.id !== DP_PLAN[0].prerequisiteId || baselineMissions.at(-1)?.order !== 50) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato DP inválido: ${errors.join(', ')}`);
  return { status: 'draft', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileDpCandidate(await loadDpEditorial());
  if (process.argv.includes('--write') || process.argv.includes('--check-generated')) {
    const target = new URL('../studies-content/banking-digital-payments-v1.js', import.meta.url);
    const output = '// Gerado por node worker/scripts/studies-dp-candidate.mjs --write. Não editar.\n'
      + '// Rascunhos DP locais. Desativado; sem autorização de ativação/publicação.\n'
      + `export const DP_MISSIONS = Object.freeze(${JSON.stringify(candidate.missions, null, 2)});\n`
      + `export const DP_SOURCES = Object.freeze(${JSON.stringify(candidate.sources, null, 2)});\n`;
    if (process.argv.includes('--write')) await writeFile(target, output);
    else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== output) throw new Error('Artefato DP desatualizado; regenere sem editar o conteúdo de rascunho.');
    console.log('Artefato DP: ' + (process.argv.includes('--write') ? 'gerado' : 'conferido'));
  }
  // Resumo da preparação; não há opção de ativação via CLI ou ambiente.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: false
  }, null, 2));
}
