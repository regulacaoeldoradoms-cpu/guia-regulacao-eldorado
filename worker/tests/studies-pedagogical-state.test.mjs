import test from 'node:test';
import assert from 'node:assert/strict';
import { derivePedagogicalState } from '../studies.js';

const mission={id:'fixture.lesson',topicId:'fixture.lesson'};

test('estados pedagógicos distinguem leitura, prática, revisão e consolidação sem virar prontidão',()=>{
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
  assert.equal(consolidated.label,'Consolidado');
  assert.match(consolidated.explanation,/não mede prontidão de prova/i);
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
