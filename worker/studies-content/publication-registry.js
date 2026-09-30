'use strict';

export const BASELINE_RELEASE_ID = 'sfn-foundation-r1';
export const BASELINE_RELEASE_SEQUENCE = 1;

const VALID_STATUS = new Set(['draft','published']);
const VALID_IMPACT = new Set(['baseline','new','editorial','conceptual']);

function publicationFor(mission) {
  const raw = mission?.publication || {};
  const releaseSequence = Number.isInteger(Number(raw.releaseSequence)) && Number(raw.releaseSequence) > 0
    ? Number(raw.releaseSequence)
    : BASELINE_RELEASE_SEQUENCE;
  const releaseId = String(raw.releaseId || (releaseSequence === BASELINE_RELEASE_SEQUENCE ? BASELINE_RELEASE_ID : `release-${releaseSequence}`));
  const status = VALID_STATUS.has(raw.status) ? raw.status : 'published';
  const changeImpact = VALID_IMPACT.has(raw.changeImpact)
    ? raw.changeImpact
    : releaseSequence === BASELINE_RELEASE_SEQUENCE ? 'baseline' : 'new';
  return Object.freeze({
    status,
    releaseId,
    releaseSequence,
    changeImpact
  });
}

export function attachPublication(mission) {
  return Object.freeze({
    ...mission,
    publication: publicationFor(mission)
  });
}

export function publishedCatalog(missions = []) {
  const source = Array.isArray(missions) ? missions : [];
  const errors = validatePublicationCatalog(source);
  if (errors.length) {
    throw new Error(`Catálogo de publicação inválido: ${errors.join(', ')}`);
  }
  return Object.freeze(source
    .map(attachPublication)
    .filter((mission) => mission.publication.status === 'published'));
}

export function validatePublicationCatalog(missions = []) {
  const errors = [];
  const ids = new Set();
  for (const mission of Array.isArray(missions) ? missions : []) {
    const raw = mission?.publication || {};
    const publication = publicationFor(mission);
    if (!mission?.id || ids.has(mission.id)) errors.push(`${mission?.id || 'mission'}:duplicate-or-missing-id`);
    ids.add(mission?.id);
    if (raw.status !== undefined && !VALID_STATUS.has(raw.status)) errors.push(`${mission.id}:invalid-publication-status`);
    if (raw.changeImpact !== undefined && !VALID_IMPACT.has(raw.changeImpact)) errors.push(`${mission.id}:invalid-change-impact`);
    if (raw.releaseId !== undefined && !String(raw.releaseId).trim()) errors.push(`${mission.id}:missing-release-id`);
    if (
      raw.releaseSequence !== undefined
      && (!Number.isInteger(Number(raw.releaseSequence)) || Number(raw.releaseSequence) <= 0)
    ) {
      errors.push(`${mission.id}:invalid-release-sequence`);
    }
    if (!publication.releaseId.trim()) errors.push(`${mission.id}:missing-release-id`);
  }
  return errors;
}

export function publicationSnapshot(missions = [], progress = {}, baselineSequence = BASELINE_RELEASE_SEQUENCE) {
  const published = publishedCatalog(missions);
  const newMissionIds = [];
  const revisionRecommendedIds = [];

  for (const mission of published) {
    const publication = mission.publication;
    const state = progress?.[mission.topicId] || {};
    const coverage = Math.max(0, Number(state.coverageState || 0));
    const seenVersion = Math.max(0, Number(state.contentVersionSeen || 0));
    const started = coverage > 0 || Boolean(state.startedAt) || seenVersion > 0;

    if (publication.releaseSequence > baselineSequence && publication.changeImpact === 'new' && !started) {
      newMissionIds.push(mission.id);
    }

    if (
      publication.changeImpact === 'conceptual'
      && seenVersion > 0
      && Number(mission.contentVersion || 0) > seenVersion
    ) {
      revisionRecommendedIds.push(mission.id);
    }
  }

  const currentReleaseSequence = published.reduce(
    (max, mission) => Math.max(max, Number(mission.publication.releaseSequence || 0)),
    baselineSequence
  );
  const currentRelease = [...published]
    .sort((a,b)=>b.publication.releaseSequence-a.publication.releaseSequence)[0]?.publication.releaseId
    || BASELINE_RELEASE_ID;

  return Object.freeze({
    baselineReleaseSequence: baselineSequence,
    currentRelease,
    currentReleaseSequence,
    newCount: newMissionIds.length,
    newMissionIds: Object.freeze(newMissionIds),
    revisionRecommendedCount: revisionRecommendedIds.length,
    revisionRecommendedIds: Object.freeze(revisionRecommendedIds)
  });
}
