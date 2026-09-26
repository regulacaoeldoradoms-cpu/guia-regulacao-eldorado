'use strict';

import {
  STUDY_SOURCES as BASE_SOURCES,
  PUBLISHED_MISSIONS as BASE_MISSIONS,
  PLANNED_MISSIONS
} from './banking-sfn.js';
import { INTRODUCTION_SOURCES, INTRODUCTION_V2 } from './sfn-introducao-v2.js';

// Publicação editorial isolada: mesmos IDs, ordem, questões, gabaritos e XP.
export const STUDY_SOURCES = Object.freeze([...BASE_SOURCES, ...INTRODUCTION_SOURCES]);
export const PUBLISHED_MISSIONS = Object.freeze(BASE_MISSIONS.map((mission) =>
  mission.id === 'banking.sfn.introducao'
    ? Object.freeze({ ...mission, ...INTRODUCTION_V2 })
    : mission
));
export { PLANNED_MISSIONS };

// Todas as rotas resolvem a mesma versão pedagógica publicada.
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
