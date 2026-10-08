// Preparação offline. Não importar este módulo Node no Worker ou no catálogo ativo.
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import {
  PUBLISHED_MISSIONS, STUDY_SOURCES, validateTeachingCatalog
} from '../studies-content/manifest.js';
import { validateQuestionFeedback } from '../studies-content/question-feedback-v1.js';
import { DP_MISSIONS, DP_SOURCES } from '../studies-content/banking-digital-payments-v1.js';
import { LP_MISSIONS, LP_SOURCES } from '../studies-content/portuguese-reading-v1.js';
import { PT_MISSIONS, PT_SOURCES } from '../studies-content/portuguese-text-v1.js';
import { OA_MISSIONS, OA_SOURCES } from '../studies-content/portuguese-accentuation-v1.js';
import { OL_MISSIONS, OL_SOURCES } from '../studies-content/portuguese-spelling-letters-v1.js';
import { HF_MISSIONS, HF_SOURCES } from '../studies-content/portuguese-hyphen-v1.js';
import { RE_MISSIONS, RE_SOURCES } from '../studies-content/portuguese-rewriting-v1.js';
import { CP_MISSIONS, CP_SOURCES } from '../studies-content/portuguese-pronouns-v1.js';
import { SM_MISSIONS, SM_SOURCES } from '../studies-content/portuguese-semantics-v1.js';
import { CR_MISSIONS, CR_SOURCES } from '../studies-content/portuguese-crase-v1.js';
import { RG_MISSIONS, RG_SOURCES } from '../studies-content/portuguese-regency-v1.js';
import { CN_MISSIONS, CN_SOURCES } from '../studies-content/portuguese-concordance-v1.js';
import { PU_MISSIONS, PU_SOURCES } from '../studies-content/portuguese-punctuation-v1.js';
import { CF_MISSIONS, CF_SOURCES } from '../studies-content/portuguese-syntax-foundation-v1.js';
import { compilePresentation } from './studies-mp-presentation.mjs';

// Preparação local desativada: Institucional CAIXA vem após Português comum. Não ativar nesta etapa.
// Preparação desativada. Conteúdo revisado; autorização de ativação/publicação pendente.
export const IS_PLAN = Object.freeze([
  ['is01','pis'], ['is02','abono'], ['is03','fgts'], ['is04','saque'],
  ['is05','crf'], ['is06','grf'], ['is07','seguro'], ['is08','bolsa'],
  ['isr','revisao'], ['ischefe','boss']
].map(([unit, suffix], index) => Object.freeze({
  unit, id: 'banking.is.' + suffix, order: index + 132,
  prerequisiteId: index === 0 ? 'portuguese.meaning.rewriting.boss' : null
})));

export async function loadIsEditorial() {
  return Promise.all(IS_PLAN.map(async ({ unit }) => {
    const module = await import(`../../docs/missao-bancaria/rascunhos/is-${unit.slice(2)}-v1.mjs`);
    return { unit, draft: module[`${unit.toUpperCase()}_DRAFT`], sources: module.SOURCES };
  }));
}

export function compileIsCandidate(editorial) {
  const baselineMissions = [...new Map([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS, ...OA_MISSIONS, ...OL_MISSIONS, ...HF_MISSIONS, ...CF_MISSIONS, ...PU_MISSIONS, ...CN_MISSIONS, ...RG_MISSIONS, ...CR_MISSIONS, ...SM_MISSIONS, ...CP_MISSIONS, ...RE_MISSIONS].map(mission => [mission.id, mission])).values()].filter(mission => mission.order < IS_PLAN[0].order);
  const baselineSources = [...new Map([...STUDY_SOURCES, ...DP_SOURCES, ...LP_SOURCES, ...PT_SOURCES, ...OA_SOURCES, ...OL_SOURCES, ...HF_SOURCES, ...CF_SOURCES, ...PU_SOURCES, ...CN_SOURCES, ...RG_SOURCES, ...CR_SOURCES, ...SM_SOURCES, ...CP_SOURCES, ...RE_SOURCES].map(source => [source.id, source])).values()];
  const byUnit = new Map(editorial.map(entry => [entry.unit, entry]));
  if (byUnit.size !== IS_PLAN.length || editorial.length !== IS_PLAN.length) {
    throw new Error('O pacote IS requer as dez unidades, sem duplicatas.');
  }
  const idMap = new Map(IS_PLAN.map(plan => [`draft.${plan.unit}`, plan.id]));
  const remap = id => {
    if (!idMap.has(id)) throw new Error(`Referência editorial desconhecida: ${id}`);
    return idMap.get(id);
  };
  const sources = [];
  const feedback = [];
  const readingRequirements = [];
  const missions = IS_PLAN.map((plan, index) => {
    const entry = byUnit.get(plan.unit);
    if (!entry || entry.draft.id !== `draft.${plan.unit}` || entry.draft.publication.status !== 'draft') {
      throw new Error(`${plan.unit}: origem deve permanecer draft.`);
    }
    const draft = structuredClone(entry.draft);
    // Texto editorial de rascunho preservado integralmente; nenhuma alteração de status dentro das aulas.
    const presentation = text => compilePresentation(text, href => {
      const match = href.match(/^is-(0[1-8]|r|chefe)-v1\.md(?:#([\w-]+))?$/);
      if (!match) return null;
      const unit = `is${match[1]}`;
      const target = IS_PLAN.find(item => item.unit === unit);
      const sectionId = match[2] || byUnit.get(unit)?.draft.sections[0]?.id;
      if (!target || target.order > plan.order || !byUnit.get(unit)?.draft.sections.some(section => section.id === sectionId)) return null;
      return { missionId: target.id, sectionId, wholeLesson: !match[2] };
    });
    const rich = text => /```|^\||\[[^\]]+\]\([^)]+\)/m.test(text) ? { presentation: presentation(text) } : {};
    const sourceIds = new Map(entry.sources.map(source => [source.id, `is.${plan.unit}.${source.id}`]));
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
      publication: { status: 'draft', releaseId: 'institutional-caixa-intro-r1', releaseSequence: 19, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource), ...rich(section.body) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : IS_PLAN[index - 1].id,
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
  if (baselineMissions.at(-1)?.id !== IS_PLAN[0].prerequisiteId || baselineMissions.at(-1)?.order !== 131) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato IS inválido: ${errors.join(', ')}`);
  return { status: 'draft', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileIsCandidate(await loadIsEditorial());
  if (process.argv.includes('--write') || process.argv.includes('--check-generated')) {
    const target = new URL('../studies-content/banking-institution-specific-v1.js', import.meta.url);
    const output = '// Gerado por node worker/scripts/studies-is-candidate.mjs --write. Não editar.\n'
      + '// Rascunhos IS locais. Desativado; sem autorização de ativação/publicação.\n'
      + `export const IS_MISSIONS = Object.freeze(${JSON.stringify(candidate.missions, null, 2)});\n`
      + `export const IS_SOURCES = Object.freeze(${JSON.stringify(candidate.sources, null, 2)});\n`;
    if (process.argv.includes('--write')) await writeFile(target, output);
    else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== output) throw new Error('Artefato IS desatualizado; regenere sem editar o conteúdo de rascunho.');
    console.log('Artefato IS: ' + (process.argv.includes('--write') ? 'gerado' : 'conferido'));
  }
  // Resumo da preparação; não há opção de ativação via CLI ou ambiente.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: false
  }, null, 2));
}
