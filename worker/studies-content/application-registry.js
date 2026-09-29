'use strict';

import { INTRO_APPLICATIONS } from './sfn-aplicacao-v1.js';
import { MONETARY_APPLICATIONS } from './sfn-aplicacao-cmn-bcb-v1.js';
import { MARKET_APPLICATIONS } from './sfn-aplicacao-copom-cvm-v1.js';
import { OPERATORS_INSURANCE_APPLICATIONS } from './sfn-aplicacao-operadores-seguros-v1.js';
import { PAYMENTS_REVIEW_APPLICATIONS } from './sfn-aplicacao-pagamentos-revisao-v1.js';

const definition = (missionId, anchorSectionId, tasks, options = {}) => Object.freeze({
  missionId,
  anchorSectionId,
  tasks,
  applicationVersion: 1,
  extendSources: options.extendSources === true,
  requireLessonSources: options.requireLessonSources !== false
});

const mappedDefinitions = (catalog, options = {}) => Object.entries(catalog).map(([missionId, tasks]) =>
  definition(missionId, options.anchorSectionId || 'resumo', tasks, options)
);

// Catálogo declarativo: o motor conhece somente o contrato abaixo. Novas unidades
// adicionam dados ao catálogo; não exigem uma nova função attach* específica por aula.
export const APPLICATION_DEFINITIONS = Object.freeze([
  definition('banking.sfn.introducao', 'autoavaliacao', INTRO_APPLICATIONS, { requireLessonSources: false }),
  ...mappedDefinitions(MONETARY_APPLICATIONS),
  ...mappedDefinitions(MARKET_APPLICATIONS),
  ...mappedDefinitions(OPERATORS_INSURANCE_APPLICATIONS, { extendSources: true }),
  ...mappedDefinitions(PAYMENTS_REVIEW_APPLICATIONS, { extendSources: true })
]);

export function attachApplicationDefinition(mission, item) {
  if (!mission || !item || mission.id !== item.missionId || !Array.isArray(mission.sections)) return mission;
  const anchor = mission.sections.find((section) => section.id === item.anchorSectionId);
  if (!anchor || anchor.applicationTasks === item.tasks) return mission;
  if (anchor.applicationTasks !== undefined) return mission;

  const sourceIds = item.extendSources
    ? Object.freeze([...new Set([...(mission.sourceIds || []), ...item.tasks.flatMap((task) => task.sourceIds || [])])])
    : mission.sourceIds;

  return Object.freeze({
    ...mission,
    ...(sourceIds === mission.sourceIds ? {} : { sourceIds }),
    sections: Object.freeze(mission.sections.map((section) => section !== anchor ? section :
      Object.freeze({
        ...section,
        applicationVersion: item.applicationVersion,
        applicationTasks: item.tasks
      })))
  });
}

export function attachApplications(mission, definitions = APPLICATION_DEFINITIONS) {
  const item = definitions.find((entry) => entry.missionId === mission?.id);
  return item ? attachApplicationDefinition(mission, item) : mission;
}

export function validateApplicationCatalog(missions, sources, definitions = APPLICATION_DEFINITIONS) {
  const errors = [];
  const missionCatalog = new Map((missions || []).map((mission) => [mission.id, mission]));
  const definitionIds = new Set();
  const taskIds = new Set();

  for (const item of definitions || []) {
    if (definitionIds.has(item.missionId)) errors.push(`${item.missionId}:duplicate-application-definition`);
    definitionIds.add(item.missionId);

    const mission = missionCatalog.get(item.missionId);
    if (!mission) {
      errors.push(`${item.missionId}:missing-mission`);
      continue;
    }

    const anchor = mission.sections?.find((section) => section.id === item.anchorSectionId);
    if (!anchor) {
      errors.push(`${item.missionId}:missing-anchor:${item.anchorSectionId}`);
      continue;
    }
    if (anchor.applicationTasks !== item.tasks) errors.push(`${item.missionId}:not-attached`);

    for (const task of item.tasks || []) {
      if (taskIds.has(task.id)) errors.push(`${task.id}:duplicate-id`);
      taskIds.add(task.id);

      for (const field of ['title', 'prompt', 'model']) {
        if (typeof task[field] !== 'string' || !task[field].trim()) errors.push(`${task.id}:empty-${field}`);
      }
      if (!Array.isArray(task.criteria) || !task.criteria.length || task.criteria.some((value) => !String(value || '').trim())) {
        errors.push(`${task.id}:missing-criteria`);
      }
      if (!Array.isArray(task.sectionIds) || !task.sectionIds.length) errors.push(`${task.id}:missing-teaching`);
      for (const sectionId of task.sectionIds || []) {
        if (!mission.sections.some((section) => section.id === sectionId && section.body?.trim())) {
          errors.push(`${task.id}:unknown-teaching:${sectionId}`);
        }
      }

      if (!Array.isArray(task.sourceIds) || !task.sourceIds.length) errors.push(`${task.id}:missing-source`);
      for (const sourceId of task.sourceIds || []) {
        if (!sources?.has(sourceId)) errors.push(`${task.id}:unknown-source:${sourceId}`);
        if (item.requireLessonSources && !mission.sourceIds?.includes(sourceId)) {
          errors.push(`${task.id}:source-outside-lesson:${sourceId}`);
        }
      }

      const originRefs = Array.isArray(task.originRefs) ? task.originRefs : [];
      if (mission.kind === 'boss' && !originRefs.length) errors.push(`${task.id}:missing-origin`);
      for (const ref of originRefs) {
        const origin = missionCatalog.get(ref.missionId);
        if (!origin?.sections?.some((section) => section.id === ref.sectionId && section.body?.trim())) {
          errors.push(`${task.id}:unknown-origin:${ref.missionId}:${ref.sectionId}`);
        }
        if (origin && origin.order >= mission.order) errors.push(`${task.id}:origin-not-earlier:${ref.missionId}`);
      }
    }
  }
  return errors;
}
