import test from 'node:test';
import assert from 'node:assert/strict';
import { computeRecencyDomain } from '../studies.js';

test('domínio recente permanece não medido sem tentativas',()=>{
  const result=computeRecencyDomain([],{});
  assert.equal(result.score,null);
  assert.equal(result.immediateScore,null);
  assert.equal(result.retentionScore,null);
  assert.equal(result.status,'not_observed');
});

test('tentativas recentes pesam mais e sem revisão o domínio fica provisório',()=>{
  const result=computeRecencyDomain([
    {correct:0,recencyRank:1},
    {correct:1,recencyRank:2},
    {correct:1,recencyRank:3}
  ],{});
  assert.equal(result.immediateScore,61.1);
  assert.equal(result.score,42.8);
  assert.equal(result.retentionScore,null);
  assert.equal(result.status,'provisional');
  assert.match(result.explanation,/30% de retenção permanecem sem evidência/i);
});

test('revisão posterior entra com 30% sem virar prontidão',()=>{
  const result=computeRecencyDomain([
    {correct:1,recencyRank:1},
    {correct:1,recencyRank:2},
    {correct:0,recencyRank:3}
  ],{latestScore:80,status:'collecting'});
  assert.equal(result.immediateScore,71.9);
  assert.equal(result.retentionScore,80);
  assert.equal(result.score,74.3);
  assert.equal(result.status,'review_observed');
  assert.match(result.explanation,/não mede prontidão de prova/i);
});

test('três ciclos observados alteram o rótulo, não a fórmula',()=>{
  const attempts=[
    {correct:1,recencyRank:1},
    {correct:0,recencyRank:2},
    {correct:1,recencyRank:3},
    {correct:1,recencyRank:4}
  ];
  const collecting=computeRecencyDomain(attempts,{latestScore:70,status:'collecting'});
  const observed=computeRecencyDomain(attempts,{latestScore:70,status:'schedule_observed'});
  assert.equal(observed.score,collecting.score);
  assert.equal(observed.status,'retention_observed');
  assert.equal(observed.label,'Com ciclos de revisão observados');
});
