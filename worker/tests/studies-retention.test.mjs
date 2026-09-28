import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { summarizeRetentionEvidence } from '../studies.js';

test('sem revisão posterior não é tratado como retenção', () => {
  assert.deepEqual(summarizeRetentionEvidence([]), {
    totalCycles: 3,
    completedCycles: 0,
    scoredCycles: 0,
    latestScore: null,
    latestCycle: null,
    lastReviewAt: '',
    status: 'not_observed',
    label: 'Sem revisão posterior'
  });
});

test('revisões antigas sem rodada pontuada são preservadas sem inventar nota', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: null, completed_at: '2026-09-01 12:00:00' },
    { cycle: 2, score: null, completed_at: '2026-09-07 12:00:00' }
  ]);
  assert.equal(result.completedCycles, 2);
  assert.equal(result.scoredCycles, 0);
  assert.equal(result.latestScore, null);
  assert.equal(result.status, 'historical_unscored');
  assert.match(result.label, /histórica/i);
});

test('resultado posterior é evidência em coleta e não recebe rótulo de domínio', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: 66.666, completed_at: '2026-09-01 12:00:00' },
    { cycle: 2, score: 83.333, completed_at: '2026-09-07 12:00:00' }
  ]);
  assert.equal(result.completedCycles, 2);
  assert.equal(result.scoredCycles, 2);
  assert.equal(result.latestCycle, 2);
  assert.equal(result.latestScore, 83.3);
  assert.equal(result.status, 'collecting');
  assert.equal(result.label, 'Evidência em coleta');
  assert.doesNotMatch(JSON.stringify(result), /dominado|aprovado|pronto/i);
});

test('três ciclos observados ainda não viram prontidão de prova', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: 100, completed_at: '2026-09-01 12:00:00' },
    { cycle: 2, score: 100, completed_at: '2026-09-07 12:00:00' },
    { cycle: 3, score: 100, completed_at: '2026-09-30 12:00:00' }
  ]);
  assert.equal(result.status, 'schedule_observed');
  assert.equal(result.label, 'Ciclos previstos observados');
  assert.equal(result.latestScore, 100);
  assert.doesNotMatch(result.label, /domínio|prontidão|aprovação/i);
});

test('uma repetição do mesmo ciclo usa o registro mais recente sem contar duas revisões', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: 50, completed_at: '2026-09-01 12:00:00' },
    { cycle: 1, score: 75, completed_at: '2026-09-01 13:00:00' },
    { cycle: 2, score: 80, completed_at: '2026-09-07 12:00:00' }
  ]);
  assert.equal(result.completedCycles, 2);
  assert.equal(result.scoredCycles, 2);
  assert.equal(result.latestCycle, 2);
  assert.equal(result.latestScore, 80);
});

test('última revisão segue o horário concluído mesmo se os ciclos forem finalizados fora de ordem', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: 90, completed_at: '2026-09-01 12:00:00' },
    { cycle: 3, score: 85, completed_at: '2026-09-30 12:00:00' },
    { cycle: 2, score: 70, completed_at: '2026-10-02 09:30:00' }
  ]);
  assert.equal(result.completedCycles, 3);
  assert.equal(result.scoredCycles, 3);
  assert.equal(result.latestCycle, 2);
  assert.equal(result.latestScore, 70);
  assert.equal(result.lastReviewAt, '2026-10-02 09:30:00');
  assert.equal(result.status, 'schedule_observed');
});

test('revisão cronologicamente mais recente sem score não herda nota de ciclo anterior', () => {
  const result = summarizeRetentionEvidence([
    { cycle: 1, score: 92, completed_at: '2026-09-01 12:00:00' },
    { cycle: 2, score: null, completed_at: '2026-09-08 12:00:00' }
  ]);
  assert.equal(result.completedCycles, 2);
  assert.equal(result.scoredCycles, 1);
  assert.equal(result.latestCycle, 2);
  assert.equal(result.latestScore, null);
  assert.equal(result.lastReviewAt, '2026-09-08 12:00:00');
  assert.equal(result.status, 'collecting');
});

test('frontend mostra retenção como evidência distinta de acerto nas tentativas', () => {
  const source = fs.readFileSync(new URL('../../js/studies.js', import.meta.url), 'utf8');
  assert.match(source, /Acerto nas tentativas/);
  assert.match(source, /Retenção: sem revisão posterior/);
  assert.match(source, /revisões com resultado/);
  assert.doesNotMatch(source, /Retenção: dominad[oa]/i);
});
