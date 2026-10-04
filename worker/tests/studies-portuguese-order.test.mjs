import test from 'node:test';
import assert from 'node:assert/strict';
import {PUBLISHED_MISSIONS,STUDY_SOURCES} from '../studies-content/manifest.js';
import {COURSE_AREAS,curriculumSnapshot} from '../studies-content/curriculum-v1.js';
import {DP_MISSIONS} from '../studies-content/banking-digital-payments-v1.js';
import {LP_MISSIONS} from '../studies-content/portuguese-reading-v1.js';
import {PT_MISSIONS} from '../studies-content/portuguese-text-v1.js';
import {OA_MISSIONS} from '../studies-content/portuguese-accentuation-v1.js';
import {OL_MISSIONS} from '../studies-content/portuguese-spelling-letters-v1.js';
import {HF_MISSIONS} from '../studies-content/portuguese-hyphen-v1.js';
import {RE_MISSIONS} from '../studies-content/portuguese-rewriting-v1.js';
import {CP_MISSIONS} from '../studies-content/portuguese-pronouns-v1.js';
import {SM_MISSIONS} from '../studies-content/portuguese-semantics-v1.js';
import {CR_MISSIONS} from '../studies-content/portuguese-crase-v1.js';
import {RG_MISSIONS} from '../studies-content/portuguese-regency-v1.js';
import {CN_MISSIONS} from '../studies-content/portuguese-concordance-v1.js';
import {PU_MISSIONS} from '../studies-content/portuguese-punctuation-v1.js';
import {CF_MISSIONS} from '../studies-content/portuguese-syntax-foundation-v1.js';
import {IS_MISSIONS} from '../studies-content/banking-institution-specific-v1.js';
const groups=[LP_MISSIONS,PT_MISSIONS,OA_MISSIONS,OL_MISSIONS,HF_MISSIONS,CF_MISSIONS,PU_MISSIONS,CN_MISSIONS,RG_MISSIONS,CR_MISSIONS,SM_MISSIONS,CP_MISSIONS,RE_MISSIONS,IS_MISSIONS];
test('Português comum antecede Institucional no motor linear, com releases e pré-requisitos coerentes',()=>{
 const chain=[...PUBLISHED_MISSIONS,...DP_MISSIONS,...groups.flat()];
 assert.equal(chain.length,141);
 assert.equal(new Set(chain.map(m=>m.id)).size,141);
 assert.deepEqual(chain.map(m=>m.order),Array.from({length:141},(_,i)=>i+1));
 for(const [i,g] of groups.entries()){
  assert.equal(g[0].candidate.prerequisiteId,i?groups[i-1].at(-1).id:DP_MISSIONS.at(-1).id);
  assert.equal(g[0].publication.releaseSequence,i+6);
  for(let j=1;j<g.length;j++)assert.equal(g[j].candidate.prerequisiteId,g[j-1].id);
  assert(g.every(m=>m.publication.status==='draft'&&m.candidate.parametersApproved===false));
 }
 assert(IS_MISSIONS[0].order>RE_MISSIONS.at(-1).order);
});
test('perfis históricos comuns BB/CAIXA e Institucional somente CAIXA permanecem distintos',()=>{
 const blocks=COURSE_AREAS.flatMap(a=>a.blocks);
 assert.deepEqual(blocks.find(b=>b.id==='banking.institution-specific').examIds,['caixa.tbn.2024-nm']);
 for(const id of ['portuguese.reading','portuguese.text','portuguese.spelling','portuguese.syntax','portuguese.meaning-writing'])assert.deepEqual(blocks.find(b=>b.id===id).examIds,['bb.agente-comercial.2022-001','caixa.tbn.2024-nm']);
});
test('ajuste draft não expõe missões/fontes nem altera cobertura publicada ou prontidão',()=>{
 const drafts=new Set(groups.flat().map(m=>m.id));
 assert(PUBLISHED_MISSIONS.every(m=>!drafts.has(m.id)));
 assert.equal(PUBLISHED_MISSIONS.length,50);
 assert.equal(PUBLISHED_MISSIONS.reduce((n,m)=>n+m.questions.length,0),374);
 assert(STUDY_SOURCES.every(s=>!/^(?:re|cp|sm|cr|rg|cn|pu|cf|hf|is)\./.test(s.id)));
 const map=curriculumSnapshot(PUBLISHED_MISSIONS);assert.equal(map.publishedBlocks,4);assert.equal(map.readiness.status,'not_measured');
});
