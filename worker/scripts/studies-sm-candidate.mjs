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
import { CF_MISSIONS, CF_SOURCES } from '../studies-content/portuguese-syntax-foundation-v1.js';
import { PU_MISSIONS, PU_SOURCES } from '../studies-content/portuguese-punctuation-v1.js';
import { CN_MISSIONS, CN_SOURCES } from '../studies-content/portuguese-concordance-v1.js';
import { RG_MISSIONS, RG_SOURCES } from '../studies-content/portuguese-regency-v1.js';
import { CR_MISSIONS, CR_SOURCES } from '../studies-content/portuguese-crase-v1.js';
import { compilePresentation } from './studies-mp-presentation.mjs';

// Preparação local desativada: Português comum antecede Institucional CAIXA. Não ativar nesta etapa.
// Preparação desativada. Parecer independente favorável, sem correções; ativação/publicação não autorizadas.
export const SM_PLAN = Object.freeze([
  ['sm01','contexto'],   ['sm02','relacoes'],   ['sm03','clareza'],   ['smr','revisao'],   ['smchefe','boss']
].map(([unit, suffix], index) => Object.freeze({
  unit, id: 'portuguese.meaning.semantics.' + suffix, order: index + 117,
  prerequisiteId: index === 0 ? 'portuguese.syntax.crase.boss' : null
})));

export async function loadSmEditorial() {
  return Promise.all(SM_PLAN.map(async ({ unit }) => {
    const module = await import(`../../docs/missao-bancaria/rascunhos/sm-${unit.slice(2)}-v1.mjs`);
    const draft = structuredClone(module[`${unit.toUpperCase()}_DRAFT`]);
    const id = `authorial.${unit}`;
    const sources = [...structuredClone(module.SOURCES), { id, label: `Material autoral da Missão Bancária — ${draft.editorialKey} (rascunho local)`, url: 'https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado', version: 'Texto e exercícios autorais v1', checkedAt: '2026-10-04', locator: `docs/missao-bancaria/rascunhos/sm-${unit.slice(2)}-v1.mjs`, provenance: 'project-authored', remoteArtifactAvailable: false }];
    draft.sourceIds.push(id);
    return { unit, draft, sources };
  }));
}

export function compileSmCandidate(editorial) {
  const baselineMissions = [...new Map([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS, ...OA_MISSIONS, ...OL_MISSIONS, ...HF_MISSIONS, ...CF_MISSIONS, ...PU_MISSIONS, ...CN_MISSIONS, ...RG_MISSIONS, ...CR_MISSIONS].map(mission => [mission.id, mission])).values()].filter(mission => mission.order < SM_PLAN[0].order);
  const baselineSources = [...new Map([...STUDY_SOURCES, ...DP_SOURCES, ...LP_SOURCES, ...PT_SOURCES, ...OA_SOURCES, ...OL_SOURCES, ...HF_SOURCES, ...CF_SOURCES, ...PU_SOURCES, ...CN_SOURCES, ...RG_SOURCES, ...CR_SOURCES].map(source => [source.id, source])).values()];
  const byUnit = new Map(editorial.map(entry => [entry.unit, entry]));
  if (byUnit.size !== SM_PLAN.length || editorial.length !== SM_PLAN.length) {
    throw new Error('O pacote SM requer as cinco unidades, sem duplicatas.');
  }
  const idMap = new Map(SM_PLAN.map(plan => [`draft.${plan.unit}`, plan.id]));
  const remap = id => {
    if (!idMap.has(id)) throw new Error(`Referência editorial desconhecida: ${id}`);
    return idMap.get(id);
  };
  const sources = [];
  const feedback = [];
  const readingRequirements = [];
  const missions = SM_PLAN.map((plan, index) => {
    const entry = byUnit.get(plan.unit);
    if (!entry || entry.draft.id !== `draft.${plan.unit}` || entry.draft.publication.status !== 'draft') {
      throw new Error(`${plan.unit}: origem deve permanecer draft.`);
    }
    const draft = structuredClone(entry.draft);
    // Texto editorial de rascunho preservado integralmente; nenhuma alteração de status dentro das aulas.
    const presentation = text => compilePresentation(text, href => {
      const match = href.match(/^sm-(0[1-3]|r|chefe)-v1\.md(?:#([\w-]+))?$/);
      if (!match) {
        const prior = href.match(/^(cf-03|cn-01)-v1\.md#([\w-]+)$/);
        if (!prior) return null;
        const target = prior[1] === 'cf-03' ? CF_MISSIONS.find(m => m.shortTitle === 'CF-03') : CN_MISSIONS.find(m => m.shortTitle === 'CN-01');
        if (!target || !target.sections.some(section => section.id === prior[2])) return null;
        return { missionId: target.id, sectionId: prior[2], wholeLesson: false };
      }
      const unit = `sm${match[1]}`;
      const target = SM_PLAN.find(item => item.unit === unit);
      const sectionId = match[2] || byUnit.get(unit)?.draft.sections[0]?.id;
      if (!target || target.order > plan.order || !byUnit.get(unit)?.draft.sections.some(section => section.id === sectionId)) return null;
      return { missionId: target.id, sectionId, wholeLesson: !match[2] };
    });
    const rich = text => /```|^\||\[[^\]]+\]\([^)]+\)/m.test(text) ? { presentation: presentation(text) } : {};
    const sourceIds = new Map(entry.sources.map(source => [source.id, `sm.${plan.unit}.${source.id}`]));
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
      publication: { status: 'draft', releaseId: 'meaning-sm-intro-r1', releaseSequence: 16, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource), ...rich(section.body) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : SM_PLAN[index - 1].id,
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
  if (baselineMissions.at(-1)?.id !== SM_PLAN[0].prerequisiteId || baselineMissions.at(-1)?.order !== 116) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato SM inválido: ${errors.join(', ')}`);
  return { status: 'draft', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileSmCandidate(await loadSmEditorial());
  if (process.argv.includes('--write') || process.argv.includes('--check-generated')) {
    const target = new URL('../studies-content/portuguese-semantics-v1.js', import.meta.url);
    const output = '// Gerado por node worker/scripts/studies-sm-candidate.mjs --write. Não editar.\n'
      + '// Rascunhos SM locais. Desativado; sem autorização de ativação/publicação.\n'
      + `export const SM_MISSIONS = Object.freeze(${JSON.stringify(candidate.missions, null, 2)});\n`
      + `export const SM_SOURCES = Object.freeze(${JSON.stringify(candidate.sources, null, 2)});\n`;
    if (process.argv.includes('--write')) await writeFile(target, output);
    else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== output) throw new Error('Artefato SM desatualizado; regenere sem editar o conteúdo de rascunho.');
    console.log('Artefato SM: ' + (process.argv.includes('--write') ? 'gerado' : 'conferido'));
  }
  // Resumo da preparação; não há opção de ativação via CLI ou ambiente.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: false
  }, null, 2));
}
