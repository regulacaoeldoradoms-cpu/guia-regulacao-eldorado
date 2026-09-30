import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { PUBLISHED_MISSIONS, sourceMap } from '../studies-content/manifest.js';
import {
  CURRICULUM_VERSION, EXAM_PROFILES, COURSE_AREAS,
  validateCurriculum, curriculumSnapshot
} from '../studies-content/curriculum-v1.js';

test('mapa curricular tem duas bases oficiais e 12 áreas sem fingir edital novo', () => {
  assert.equal(CURRICULUM_VERSION, 1);
  assert.deepEqual(EXAM_PROFILES.map((item) => item.id), [
    'bb.agente-comercial.2022-001',
    'caixa.tbn.2024-nm'
  ]);
  assert.equal(COURSE_AREAS.length, 12);
  assert.equal(COURSE_AREAS.flatMap((item) => item.blocks).length, 43);
  for (const profile of EXAM_PROFILES) {
    assert.equal(profile.referenceOnly, true);
    assert.equal(profile.verifiedAt, '2026-09-27');
    assert.ok(sourceMap().has(profile.sourceId), profile.sourceId);
  }
  assert.deepEqual(validateCurriculum(PUBLISHED_MISSIONS), []);
});

test('pesos e quantidade de questões reproduzem os editais-base adotados', () => {
  const bb = EXAM_PROFILES.find((item) => item.id.startsWith('bb.'));
  assert.equal(bb.totalObjectiveQuestions, 70);
  assert.equal(bb.totalObjectivePoints, 100);
  assert.equal(bb.disciplines.reduce((sum, item) => sum + item.questions, 0), 70);
  assert.equal(bb.disciplines.reduce((sum, item) => sum + item.points, 0), 100);
  assert.equal(bb.disciplines.find((item) => item.areaId === 'informatics').points, 22.5);
  assert.equal(bb.disciplines.find((item) => item.areaId === 'sales-service').points, 22.5);

  const caixa = EXAM_PROFILES.find((item) => item.id.startsWith('caixa.'));
  assert.equal(caixa.totalObjectiveQuestions, 60);
  assert.equal(caixa.totalObjectivePoints, 60);
  assert.equal(caixa.disciplines.reduce((sum, item) => sum + item.questions, 0), 60);
  assert.equal(caixa.disciplines.find((item) => item.areaId === 'banking').questions, 15);
  assert.equal(caixa.disciplines.find((item) => item.areaId === 'sales-service').questions, 10);
});

test('vinte missões publicadas significam dois blocos disponíveis, não curso concluído', () => {
  const snapshot = curriculumSnapshot(PUBLISHED_MISSIONS, {});
  assert.equal(PUBLISHED_MISSIONS.length, 20);
  assert.equal(snapshot.totalAreas, 12);
  assert.equal(snapshot.totalBlocks, 43);
  assert.equal(snapshot.startedAreas, 1);
  assert.equal(snapshot.completedAreas, 0);
  assert.equal(snapshot.publishedBlocks, 2);
  assert.equal(snapshot.completedBlocks, 0);
  assert.equal(snapshot.availabilityPercent, 4.7);
  assert.equal(snapshot.progressPercent, 0);
  assert.equal(snapshot.readiness.status, 'not_measured');
  assert.match(snapshot.readiness.explanation, /simulados representativos/);
  const banking = snapshot.areas.find((item) => item.id === 'banking');
  assert.equal(banking.started, true);
  assert.equal(banking.publishedBlocks, 2);
  assert.equal(banking.totalBlocks, 6);
  assert.equal(banking.completed, false);
});

test('concluir todo o primeiro bloco não marca Conhecimentos Bancários nem o curso como completos', () => {
  const progress = Object.fromEntries(PUBLISHED_MISSIONS.filter(m => m.id.startsWith('banking.sfn.')).map((mission) => [
    mission.topicId, { coverageState: 3 }
  ]));
  const snapshot = curriculumSnapshot(PUBLISHED_MISSIONS, progress);
  assert.equal(snapshot.completedBlocks, 1);
  assert.equal(snapshot.completedAreas, 0);
  assert.equal(snapshot.progressPercent, 2.3);
  assert.equal(snapshot.areas.find((item) => item.id === 'banking').completed, false);
  assert.equal(snapshot.readiness.status, 'not_measured');
});

test('XP usa títulos de jogo neutros e não se apresenta como previsão de aprovação', () => {
  const backend = fs.readFileSync(new URL('../studies.js', import.meta.url), 'utf8');
  for (const forbidden of ['Pré-aprovação', 'Competitivo', 'Reta final']) {
    assert.doesNotMatch(backend, new RegExp(forbidden, 'i'));
  }
  for (const expected of ['Explorador', 'Praticante', 'Estrategista', 'Maratonista', 'Veterano']) {
    assert.match(backend, new RegExp(expected));
  }
});

test('dashboard separa bloco atual, mapa do curso e prontidão', () => {
  const html = fs.readFileSync(new URL('../../estudos/index.html', import.meta.url), 'utf8');
  const client = fs.readFileSync(new URL('../../js/studies.js', import.meta.url), 'utf8');
  assert.match(html, /Bloco atual publicado/);
  assert.match(html, /Cobertura curricular/);
  assert.match(html, /Prontidão de prova/);
  assert.match(client, /renderCurriculum/);
  assert.match(client, /missões deste bloco publicadas/);
  assert.match(client, /Ainda não medida/);
});
