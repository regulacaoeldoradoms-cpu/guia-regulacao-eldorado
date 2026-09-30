import test from 'node:test';
import assert from 'node:assert/strict';
import { derivePedagogicalState, summarizeRetentionEvidence } from '../studies.js';

const mission={id:'fixture.lesson',topicId:'fixture.lesson'};

test('estados pedagógicos distinguem leitura, prática, revisão e ciclos concluídos sem virar prontidão',()=>{
  assert.equal(derivePedagogicalState(mission).id,'not_started');

  assert.equal(derivePedagogicalState(
    mission,{}, {}, {missionId:mission.id,mode:'lesson',answeredQuestionIds:[]}
  ).id,'reading');

  assert.equal(derivePedagogicalState(
    mission,{coverageState:1}, {}, null
  ).id,'reading_complete');

  assert.equal(derivePedagogicalState(
    mission,{coverageState:1}, {}, {missionId:mission.id,mode:'lesson',answeredQuestionIds:[]}
  ).id,'practice');

  assert.equal(derivePedagogicalState(
    mission,{coverageState:2}, {}, null
  ).id,'practice');

  assert.equal(derivePedagogicalState(
    mission,{coverageState:3}, {status:'collecting'}, null
  ).id,'review');

  const consolidated=derivePedagogicalState(
    mission,{coverageState:3}, {status:'schedule_observed'}, null
  );
  assert.equal(consolidated.id,'consolidated');
  assert.equal(consolidated.label,'Ciclos concluídos');
  assert.match(consolidated.explanation,/não comprova domínio nem prontidão de prova/i);
});

test('três revisões com nota zero mantêm o contrato de ciclos sem afirmar domínio',()=>{
  const progress=Object.freeze({coverageState:3,masteryScore:0,contentVersionSeen:2});
  const evidence=summarizeRetentionEvidence([1,2,3].map(cycle=>({
    cycle,score:0,completed_at:`2026-09-30 12:0${cycle}:00`
  })));
  const state=derivePedagogicalState(mission,progress,evidence);
  assert.equal(state.id,'consolidated');
  assert.equal(state.label,'Ciclos concluídos');
  assert.match(state.explanation,/independentemente da nota/);
  assert.match(state.explanation,/não comprova domínio nem prontidão/);
  assert.equal(evidence.latestScore,0);
  assert.deepEqual(progress,{coverageState:3,masteryScore:0,contentVersionSeen:2});
});

test('conteúdo já coberto não regride de estado ao ser reaberto',()=>{
  const reopened=derivePedagogicalState(
    mission,
    {coverageState:3},
    {status:'collecting'},
    {missionId:mission.id,mode:'lesson',answeredQuestionIds:[]}
  );
  assert.equal(reopened.id,'review');
});
