// Preparação offline. Não importar este módulo Node no Worker ou no catálogo ativo.
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import {
  PUBLISHED_MISSIONS, STUDY_SOURCES, validateTeachingCatalog
} from '../studies-content/manifest.js';
import { validateQuestionFeedback } from '../studies-content/question-feedback-v1.js';
import { compilePresentation } from './studies-mp-presentation.mjs';

// IDs, sequência, XP e limiar aprovados pelo usuário em 30/09/2026 às 19:42 UTC.
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
  const baselineMissions = PUBLISHED_MISSIONS.filter(mission => !mission.id.startsWith('banking.mp.'));
  const baselineSources = STUDY_SOURCES.filter(source => !source.id.startsWith('mp.'));
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
    // Retirada autorizada de avisos de status; fontes editoriais permanecem intactas.
    const notice = {
      mpr: ['acesso', 'Hoje o conjunto inteiro continua em rascunho, fora do aplicativo.'],
      mpchefe: ['preparacao', 'Hoje todos esses materiais são rascunhos fora do aplicativo.']
    }[plan.unit];
    if (notice) {
      const section = draft.sections.find(item => item.id === notice[0]);
      if (!section?.body.includes(notice[1])) throw new Error(`${plan.unit}: aviso editorial esperado ausente.`);
      section.body = section.body.replace(notice[1], '').trim();
    }
    const presentation = text => compilePresentation(text, href => {
      if (href === '../71-MP-BLOCO-RASCUNHO-E-REVISAO.md') return {
        href: 'https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/36a8f9c688a44faf13bf3de287f74e291402a182/docs/missao-bancaria/71-MP-BLOCO-RASCUNHO-E-REVISAO.md'
      };
      const match = href.match(/^mp-(0[1-9]|r|chefe)-v1\.md(?:#([\w-]+))?$/);
      if (!match) return null;
      const unit = `mp${match[1]}`;
      const target = MP_PLAN.find(item => item.unit === unit);
      const sectionId = match[2] || byUnit.get(unit)?.draft.sections[0]?.id;
      if (!target || target.order > plan.order || !byUnit.get(unit)?.draft.sections.some(section => section.id === sectionId)) return null;
      return { missionId: target.id, sectionId, wholeLesson: !match[2] };
    });
    const rich = text => /```|^\||\[[^\]]+\]\([^)]+\)/m.test(text) ? { presentation: presentation(text) } : {};
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
        optionRationales: question.optionRationales, ...rich(question.prompt)
      };
    });
    // Conserva o texto aprovado e o inventário dos locais convertidos em apresentação.
    // A publicação foi autorizada; renderização não altera os demais textos.
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
      // Parâmetros da aprovação agrupada, usando as regras de conclusão existentes.
      xp: draft.kind === 'boss' ? 220 : 100,
      passScore: draft.kind === 'boss' ? 75 : 0,
      // Estimativa didática, não limite: leitura a 150 palavras/min + 2 min por questão,
      // arredondada para o próximo múltiplo de 5. Não controla cronômetro ou conclusão.
      estimatedMinutes: Math.ceil((draft.sections.reduce((sum, section) => sum + section.body.split(/\s+/).length, 0) / 150 + questions.length * 2) / 5) * 5,
      publication: { status: 'published', releaseId: 'markets-policy-intro-r1', releaseSequence: 2, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource), ...rich(section.body) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : MP_PLAN[index - 1].id,
        parametersApproved: true
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
  if (baselineMissions.at(-1)?.id !== MP_PLAN[0].prerequisiteId || baselineMissions.at(-1)?.order !== 9) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato MP inválido: ${errors.join(', ')}`);
  return { status: 'published', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileMpCandidate(await loadMpEditorial());
  if (process.argv.includes('--write') || process.argv.includes('--check-generated')) {
    const target = new URL('../studies-content/banking-markets-policy-v1.js', import.meta.url);
    const output = '// Gerado por node worker/scripts/studies-mp-candidate.mjs --write. Não editar.\n'
      + '// Fonte editorial #563; publicação e parâmetros aprovados em 30/09/2026 às 19:42 UTC.\n'
      + `export const MP_MISSIONS = Object.freeze(${JSON.stringify(candidate.missions, null, 2)});\n`
      + `export const MP_SOURCES = Object.freeze(${JSON.stringify(candidate.sources, null, 2)});\n`;
    if (process.argv.includes('--write')) await writeFile(target, output);
    else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== output) throw new Error('Artefato MP desatualizado; regenere sem editar o conteúdo aprovado.');
    console.log('Artefato MP autorizado: ' + (process.argv.includes('--write') ? 'gerado' : 'conferido'));
  }
  // Resumo da release aprovada; deploy permanece sujeito ao gate separado.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: true
  }, null, 2));
}
