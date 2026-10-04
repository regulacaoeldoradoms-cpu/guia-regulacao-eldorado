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
import { compilePresentation } from './studies-mp-presentation.mjs';

// Preparação local desativada: Português comum antecede Institucional CAIXA. Não ativar nesta etapa.
// Preparação desativada. Parecer de conteúdo concluído; ativação/publicação não autorizadas.
export const OA_PLAN = Object.freeze([
  ['oa01','tonicidade'], ['oa02','oxitonas'], ['oa03','paroxitonas'],
  ['oa04','encontros'], ['oar','revisao'], ['oachefe','boss']
].map(([unit, suffix], index) => Object.freeze({
  unit, id: 'portuguese.spelling.' + suffix, order: index + 76,
  prerequisiteId: index === 0 ? 'portuguese.text.boss' : null
})));

export async function loadOaEditorial() {
  return Promise.all(OA_PLAN.map(async ({ unit }) => {
    const module = await import(`../../docs/missao-bancaria/rascunhos/oa-${unit.slice(2)}-v1.mjs`);
    return { unit, draft: structuredClone(module[`${unit.toUpperCase()}_DRAFT`]), sources: structuredClone(module.SOURCES) };
  }));
}

export function compileOaCandidate(editorial) {
  const baselineMissions = [...new Map([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS].map(mission => [mission.id, mission])).values()].filter(mission => mission.order < OA_PLAN[0].order);
  const baselineSources = [...new Map([...STUDY_SOURCES, ...DP_SOURCES, ...LP_SOURCES, ...PT_SOURCES].map(source => [source.id, source])).values()];
  const byUnit = new Map(editorial.map(entry => [entry.unit, entry]));
  if (byUnit.size !== OA_PLAN.length || editorial.length !== OA_PLAN.length) {
    throw new Error('O pacote OA requer as seis unidades, sem duplicatas.');
  }
  const idMap = new Map(OA_PLAN.map(plan => [`draft.${plan.unit}`, plan.id]));
  const remap = id => {
    if (!idMap.has(id)) throw new Error(`Referência editorial desconhecida: ${id}`);
    return idMap.get(id);
  };
  const sources = [];
  const feedback = [];
  const readingRequirements = [];
  const missions = OA_PLAN.map((plan, index) => {
    const entry = byUnit.get(plan.unit);
    if (!entry || entry.draft.id !== `draft.${plan.unit}` || entry.draft.publication.status !== 'draft') {
      throw new Error(`${plan.unit}: origem deve permanecer draft.`);
    }
    const draft = structuredClone(entry.draft);
    // Texto editorial de rascunho preservado integralmente; nenhuma alteração de status dentro das aulas.
    const presentation = text => compilePresentation(text, href => {
      const match = href.match(/^oa-(0[1-4]|r|chefe)-v1\.md(?:#([\w-]+))?$/);
      if (!match) return null;
      const unit = `oa${match[1]}`;
      const target = OA_PLAN.find(item => item.unit === unit);
      const sectionId = match[2] || byUnit.get(unit)?.draft.sections[0]?.id;
      if (!target || target.order > plan.order || !byUnit.get(unit)?.draft.sections.some(section => section.id === sectionId)) return null;
      return { missionId: target.id, sectionId, wholeLesson: !match[2] };
    });
    const rich = text => /```|^\||\[[^\]]+\]\([^)]+\)/m.test(text) ? { presentation: presentation(text) } : {};
    const sourceIds = new Map(entry.sources.map(source => [source.id, `oa.${plan.unit}.${source.id}`]));
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
      publication: { status: 'draft', releaseId: 'accentuation-intro-r1', releaseSequence: 8, changeImpact: 'new' },
      sourceIds: draft.sourceIds.map(remapSource),
      sections: draft.sections.map(section => ({ ...section, sourceIds: section.sourceIds.map(remapSource), ...rich(section.body) })),
      recall: draft.recall, questions,
      teaching: { ...draft.teaching, questionCoverage },
      candidate: {
        editorialId: draft.id, blockId: draft.candidateBlockId,
        prerequisiteId: index === 0 ? plan.prerequisiteId : OA_PLAN[index - 1].id,
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
  if (baselineMissions.at(-1)?.id !== OA_PLAN[0].prerequisiteId || baselineMissions.at(-1)?.order !== 75) {
    errors.push('published-prerequisite-changed');
  }
  if (errors.length) throw new Error(`Candidato OA inválido: ${errors.join(', ')}`);
  return { status: 'draft', missions, sources, feedback, readingRequirements };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const candidate = compileOaCandidate(await loadOaEditorial());
  if (process.argv.includes('--write') || process.argv.includes('--check-generated')) {
    const target = new URL('../studies-content/portuguese-accentuation-v1.js', import.meta.url);
    const output = '// Gerado por node worker/scripts/studies-oa-candidate.mjs --write. Não editar.\n'
      + '// Rascunhos OA locais. Desativado; sem autorização de ativação/publicação.\n'
      + `export const OA_MISSIONS = Object.freeze(${JSON.stringify(candidate.missions, null, 2)});\n`
      + `export const OA_SOURCES = Object.freeze(${JSON.stringify(candidate.sources, null, 2)});\n`;
    if (process.argv.includes('--write')) await writeFile(target, output);
    else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== output) throw new Error('Artefato OA desatualizado; regenere sem editar o conteúdo de rascunho.');
    console.log('Artefato OA: ' + (process.argv.includes('--write') ? 'gerado' : 'conferido'));
  }
  // Resumo da preparação; não há opção de ativação via CLI ou ambiente.
  console.log(JSON.stringify({
    status: candidate.status, missions: candidate.missions.length,
    questions: candidate.feedback.length, optionReasons: candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0),
    sources: candidate.sources.length, readingRequirements: candidate.readingRequirements,
    publicationReady: false
  }, null, 2));
}
