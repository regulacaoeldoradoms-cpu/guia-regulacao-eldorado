import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadCeEditorial, compileCeCandidate, CE_PLAN } from '../scripts/studies-ce-candidate.mjs';
import { PUBLISHED_MISSIONS, PLANNED_MISSIONS, STUDY_SOURCES } from '../studies-content/manifest.js';
import { publishedCatalog, publicationSnapshot } from '../studies-content/publication-registry.js';
import { curriculumSnapshot, EXAM_PROFILES } from '../studies-content/curriculum-v1.js';
import { questionFeedbackById } from '../studies-content/question-feedback-v1.js';

const editorial = await loadCeEditorial();
const before = structuredClone(editorial);
const candidate = compileCeCandidate(editorial);

test('CE desativado preserva exatamente catálogo, fontes e planejamento SFN/MP/PC', () => {
  const digest = crypto.createHash('sha256').update(JSON.stringify({
    missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES, planned: PLANNED_MISSIONS
  })).digest('hex');
  // Baseline capturada em 2bbbb0a4, antes da importação do candidato.
  assert.equal(digest, 'bbec004e3e3bc149006b5fb7ee4f7981831f323f07db3f40002b34951ff010f7');
  assert.equal(PUBLISHED_MISSIONS.length,37);
  assert.equal(PUBLISHED_MISSIONS.flatMap(m=>m.questions).length,266);
  assert.deepEqual(publishedCatalog([...PUBLISHED_MISSIONS,...candidate.missions]),PUBLISHED_MISSIONS);
  assert.deepEqual(publicationSnapshot([...PUBLISHED_MISSIONS,...candidate.missions]),publicationSnapshot(PUBLISHED_MISSIONS));
  assert.ok(candidate.sources.every(s=>!STUDY_SOURCES.some(active=>active.id===s.id)));
  const map=curriculumSnapshot(PUBLISHED_MISSIONS);
  assert.equal(map.publishedBlocks,3); assert.equal(map.totalBlocks,43);
  assert.equal(map.readiness.status,'not_measured');
  assert.ok(EXAM_PROFILES.every(p=>p.referenceOnly));
  assert.equal(candidate.status,'draft');
  assert.ok(candidate.missions.every(m=>m.publication.status==='draft' && m.publication.releaseSequence===4 && !m.candidate.parametersApproved));
});

test('conversão CE preserva textos e respostas, remapeia IDs e não modifica a fonte editorial', () => {
  assert.deepEqual(editorial,before);
  assert.equal(candidate.missions.length,13);
  assert.equal(candidate.feedback.length,108);
  assert.equal(candidate.feedback.reduce((n,q)=>n+q.optionReasons.length,0),432);
  for(const [index,m] of candidate.missions.entries()){
    const {draft,sources}=editorial[index];
    assert.equal(m.id,CE_PLAN[index].id); assert.equal(m.topicId,m.id);
    assert.equal(m.order,index+38);
    assert.equal(m.xp,m.kind==='boss'?220:100);
    assert.equal(m.passScore,m.kind==='boss'?75:0);
    assert.equal(m.candidate.prerequisiteId,index?candidate.missions[index-1].id:'banking.pc.boss');
    assert.deepEqual(m.sections.map(s=>[s.id,s.type,s.heading,s.body]),draft.sections.map(s=>[s.id,s.type,s.heading,s.body]));
    assert.deepEqual(m.recall,draft.recall);
    for(const [qi,q] of m.questions.entries()){
      const original=draft.questions[qi];
      assert.equal(q.id,'q.'+original.id);
      for(const key of ['prompt','options','answer','explanation','optionRationales']) assert.deepEqual(q[key],original[key]);
      assert.deepEqual(questionFeedbackById(q.id,q).optionReasons,original.optionRationales);
      for(const ref of original.originRefs||[]){
        const target=CE_PLAN.find(p=>p.unit===ref.unit);
        assert.ok(m.teaching.questionCoverage[q.id].some(r=>r.missionId===target.id && r.sectionId===ref.sectionId));
      }
    }
    for(const source of sources){
      const actual=candidate.sources.find(s=>s.id==='ce.'+CE_PLAN[index].unit+'.'+source.id);
      assert.deepEqual({...actual,id:source.id},source);
    }
  }
});

test('candidato incompleto, origem publicada, fonte, duplicação e referência futura são rejeitados',()=>{
  assert.throws(()=>compileCeCandidate(editorial.slice(1)),/treze unidades/);
  const duplicateUnit=structuredClone(editorial); duplicateUnit[1]=duplicateUnit[0];
  assert.throws(()=>compileCeCandidate(duplicateUnit),/treze unidades/);
  const published=structuredClone(editorial);published[0].draft.publication.status='published';
  assert.throws(()=>compileCeCandidate(published),/origem deve permanecer draft/);
  const source=structuredClone(editorial);source[0].draft.sourceIds.push('ausente');
  assert.throws(()=>compileCeCandidate(source),/fonte desconhecida/);
  const future=structuredClone(editorial);
  future[0].draft.teaching.questionCoverage[future[0].draft.questions[0].id].push({missionId:'draft.ce11',sectionId:'inicio'});
  assert.throws(()=>compileCeCandidate(future),/future-prerequisite/);
  const duplicate=structuredClone(editorial);duplicate[0].draft.questions.push(duplicate[0].draft.questions[0]);
  assert.throws(()=>compileCeCandidate(duplicate),/duplicate-question-id/);
  for(const href of ['ce-11-v1.md','mp-01-v1.md#nao-existe','https://example.invalid/']){
    const bad=structuredClone(editorial);bad[0].draft.sections[0].body+='\n\n[Destino]('+href+')';
    assert.throws(()=>compileCeCandidate(bad),/Link de aula não resolvido/);
  }
  const invalid=structuredClone(candidate.missions);invalid[0].publication.status='typo';
  assert.throws(()=>publishedCatalog([...PUBLISHED_MISSIONS,...invalid]),/publication/i);
});

test('artefato reproduz o candidato e cada retomada resolve para aula anterior ou atual',async()=>{
  const {CE_MISSIONS,CE_SOURCES}=await import('../studies-content/banking-capital-exchange-v1.js');
  assert.deepEqual(CE_MISSIONS,candidate.missions);assert.deepEqual(CE_SOURCES,candidate.sources);
  const all=new Map([...PUBLISHED_MISSIONS,...candidate.missions].map(m=>[m.id,m]));
  let links=0,originRefs=0;
  for(const m of candidate.missions){
    for(const item of [...m.sections,...m.questions]) for(const b of item.presentation||[]){
      assert.equal(b.type,'paragraph'); // O conteúdo aprovado não contém tabelas/diagramas.
      for(const run of b.runs||[]) if(run.missionId){
        links++;const target=all.get(run.missionId);
        assert.ok(target && target.order<=m.order);
        assert.ok(target.sections.some(s=>s.id===run.sectionId));
      }
    }
    for(const refs of Object.values(m.teaching.questionCoverage))for(const r of refs){
      originRefs++;const target=all.get(r.missionId);
      assert.ok(target && target.order<=m.order && target.sections.some(s=>s.id===r.sectionId));
    }
  }
  const originalLinks=editorial.reduce((total,{draft})=>total+draft.sections.reduce((n,s)=>n+[...s.body.matchAll(/\[[^\]]+\]\([^)]+\)/g)].length,0),0);
  assert.equal(links,originalLinks);
  assert.ok(originRefs>200);
  assert.ok(candidate.missions[0].sections[0].presentation.flatMap(b=>b.runs).some(r=>r.missionId==='banking.mp.mercados' && r.sectionId==='capitais'));
});

test('CE: seis cenários do roteador real em memória, incluindo autorização e preservação',()=>{
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const result=spawnSync(process.execPath,['--experimental-vm-modules','--test','--test-reporter=tap',
    fileURLToPath(new URL('./helpers/studies-ce-route-runner.mjs',import.meta.url))],{
    env,encoding:'utf8',timeout:15000,maxBuffer:1024*1024
  });
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
  assert.match(result.stdout,/# pass 6\b/);assert.match(result.stdout,/# fail 0\b/);
});
