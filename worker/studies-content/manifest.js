'use strict';

import {
  STUDY_SOURCES as BASE_SOURCES,
  PUBLISHED_MISSIONS as BASE_MISSIONS,
  PLANNED_MISSIONS
} from './banking-sfn.js';
import { INTRODUCTION_SOURCES, INTRODUCTION_V2 } from './sfn-introducao-v2.js';
import { SFN_LESSONS_V2 } from './sfn-aulas-v2.js';
import { FUNDAMENTALS_SOURCES, FUNDAMENTALS_REVIEW, reviseFundamentalsSections } from './sfn-fundamentos-revisados.js';

export const STUDY_SOURCES = Object.freeze([...BASE_SOURCES, ...INTRODUCTION_SOURCES, ...FUNDAMENTALS_SOURCES]);
export { PLANNED_MISSIONS };

const INTRO_IDS = Object.freeze([
  'nome', 'cotidiano', 'vocabulario', 'intermediacao', 'juros',
  'regras', 'cmn', 'bcb', 'operadores', 'analogia',
  'exemplo-operador', 'exemplo-conselho', 'alternativas', 'consulta', 'autoavaliacao'
]);
const INTRO_QUESTION_SECTIONS = Object.freeze({
  'q.sfn.01': ['regras', 'cmn'],
  'q.sfn.02': ['intermediacao', 'operadores'],
  'q.sfn.03': ['cmn', 'bcb', 'exemplo-conselho']
});
const BOSS_ORIGINS = Object.freeze({
  'q.boss.01': ['banking.sfn.cmn', 'papel'],
  'q.boss.02': ['banking.sfn.bacen', 'politicas'],
  'q.boss.03': ['banking.sfn.copom', 'meta'],
  'q.boss.04': ['banking.sfn.cvm', 'mercado'],
  'q.boss.05': ['banking.sfn.operadores', 'multiplo'],
  'q.boss.06': ['banking.sfn.seguros-previdencia', 'susep'],
  'q.boss.07': ['banking.sfn.seguros-previdencia', 'previdencia-fechada'],
  'q.boss.08': ['banking.sfn.pagamentos-consorcios', 'instituicao'],
  'q.boss.09': ['banking.sfn.pagamentos-consorcios', 'spi'],
  'q.boss.10': ['banking.sfn.pagamentos-consorcios', 'consorcio'],
  'q.boss.11': ['banking.sfn.seguros-previdencia', 'previdencia-aberta'],
  'q.boss.12': ['banking.sfn.operadores', 'papel']
});

function introductionSections() {
  return Object.freeze(INTRODUCTION_V2.sections.map((section, index) => {
    const type = [3, 9, 10, 11].includes(index) ? 'worked-example'
      : [2, 12].includes(index) ? 'glossary'
      : [13, 14].includes(index) ? 'summary' : 'explanation';
    return Object.freeze({ ...section, id: INTRO_IDS[index], type });
  }));
}

function teachMission(mission) {
  const introduction = mission.id === 'banking.sfn.introducao';
  const patch = introduction ? INTRODUCTION_V2 : SFN_LESSONS_V2[mission.id];
  // Futuras missões sem material não recebem conformidade artificial.
  // A validação do catálogo no CI deve recusá-las até que haja ensino real.
  if (!patch) return mission;
  const initialSections = introduction ? introductionSections() : patch.sections;
  const sections = reviseFundamentalsSections(mission.id, initialSections);
  const sectionMap = introduction ? INTRO_QUESTION_SECTIONS : patch.questionSections;
  const questionCoverage = {};
  for (const [questionId, sectionIds] of Object.entries(sectionMap)) {
    const references = sectionIds.map((sectionId) => Object.freeze({ missionId: mission.id, sectionId }));
    if (mission.kind === 'boss' && BOSS_ORIGINS[questionId]) {
      const [missionId, sectionId] = BOSS_ORIGINS[questionId];
      references.push(Object.freeze({ missionId, sectionId }));
    }
    questionCoverage[questionId] = Object.freeze(references);
  }
  const sourceIds = Object.freeze([...new Set([
    ...(patch.sourceIds || mission.sourceIds),
    ...(mission.id === 'banking.sfn.cmn' ? ['fazenda.cmn.apresentacao'] : []),
    ...(FUNDAMENTALS_REVIEW[mission.id]?.sourceIds || [])
  ])]);
  return Object.freeze({
    ...mission,
    ...(introduction ? INTRODUCTION_V2 : {}),
    contentVersion: 2,
    sections,
    sourceIds,
    teaching: Object.freeze({
      contractVersion: 1,
      questionCoverage: Object.freeze(questionCoverage),
      editorialPass: FUNDAMENTALS_REVIEW[mission.id] ? 'fundamentos-r1' : 'draft-v2',
      reviewStatus: 'human-review-pending'
    })
  });
}

export const PUBLISHED_MISSIONS = Object.freeze(BASE_MISSIONS.map(teachMission));

export function missionById(id) {
  return PUBLISHED_MISSIONS.find((mission) => mission.id === String(id || '')) || null;
}
export function missionByTopicId(topicId) {
  return PUBLISHED_MISSIONS.find((mission) => mission.topicId === String(topicId || '')) || null;
}
export function questionById(id) {
  for (const mission of PUBLISHED_MISSIONS) {
    const question = mission.questions.find((item) => item.id === String(id || ''));
    if (question) return { mission, question };
  }
  return null;
}
export function sourceMap() {
  return new Map(STUDY_SOURCES.map((source) => [source.id, source]));
}

// Validação editorial usada nos testes, não como exceção no boot da produção.
// Existência/ligação de material é verificável; clareza exige revisão humana.
export function validateTeachingCatalog(missions = PUBLISHED_MISSIONS) {
  const errors = [];
  const catalog = new Map(missions.map((mission) => [mission.id, mission]));
  const sources = sourceMap();
  if (catalog.size !== missions.length) errors.push('duplicate-mission-id');
  for (const mission of missions) {
    const sections = Array.isArray(mission.sections) ? mission.sections : [];
    const sectionIds = new Set(sections.map((section) => section.id));
    if (sectionIds.size !== sections.length) errors.push(`${mission.id}:duplicate-section-id`);
    if (mission.teaching?.contractVersion !== 1) errors.push(`${mission.id}:missing-teaching-contract`);
    for (const type of ['explanation', 'worked-example', 'glossary', 'summary']) {
      if (!sections.some((section) => section.type === type)) errors.push(`${mission.id}:missing-${type}`);
    }
    for (const section of sections) {
      if (!section.id || !section.heading?.trim() || !section.body?.trim()) errors.push(`${mission.id}:empty-teaching-block`);
    }
    if (!mission.sourceIds?.length) errors.push(`${mission.id}:missing-sources`);
    for (const sourceId of mission.sourceIds || []) {
      if (!sources.has(sourceId)) errors.push(`${mission.id}:unknown-source:${sourceId}`);
    }
    for (const question of mission.questions || []) {
      const refs = mission.teaching?.questionCoverage?.[question.id];
      if (!Array.isArray(refs) || !refs.length) {
        errors.push(`${question.id}:missing-teaching-reference`);
        continue;
      }
      for (const ref of refs) {
        const target = catalog.get(ref.missionId);
        if (!target?.sections?.some((section) => section.id === ref.sectionId)) errors.push(`${question.id}:broken-teaching-reference`);
        if (target && target.order > mission.order) errors.push(`${question.id}:future-prerequisite`);
      }
      if (mission.kind === 'boss' && !refs.some((ref) => ref.missionId !== mission.id)) {
        errors.push(`${question.id}:missing-origin-lesson`);
      }
    }
  }
  return errors;
}
