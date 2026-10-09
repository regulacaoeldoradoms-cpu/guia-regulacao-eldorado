import test from 'node:test';
import assert from 'node:assert/strict';
import {PET_PHRASES,PET_PHRASE_CATALOG,PET_PHRASE_VERSION,PET_SPEECH_TIMING,PetPhraseCycle,PetSpeech,petSpeechForSession,nextPetPhrase} from '../../js/pet-phrases.js';
const memory=()=>{const values=new Map();return {values,getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};};
const random=()=>{let seed=1;return()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};};
test('67 distinct short phrases keep original care/incentive and add 25 humor lines',()=>{
 assert.equal(PET_PHRASES.length,67);assert.equal(new Set(PET_PHRASES).size,67);assert.equal(new Set(PET_PHRASE_CATALOG.map(p=>p.id)).size,67);
 for(const phrase of ['Uma pausa também faz bem.','Miau. Que bom estar por aqui.','Minha água está sempre por perto.','Vou cuidar da minha patinha.','Seu valor vai além da lista de tarefas.'])assert(PET_PHRASES.includes(phrase));
 assert(PET_PHRASES.every(phrase=>phrase.length<=55));
});
test('older cached runtime still resolves its export safely during an update',()=>{const recent=PET_PHRASES.slice(0,5);assert(PET_PHRASES.includes(nextPetPhrase(recent,()=>0)));assert(!recent.includes(nextPetPhrase(recent,()=>0)));});
test('each shuffled cycle visits every phrase once and never repeats across its boundary',()=>{
 const cycle=new PetPhraseCycle(null,random());let last=null;
 for(let round=0;round<5;round++){
  const seen=new Set();for(let i=0;i<67;i++){const phrase=cycle.next();assert.notEqual(phrase.id,last);assert(!seen.has(phrase.id));assert.equal(phrase.text,PET_PHRASE_CATALOG.find(p=>p.id===phrase.id).text);seen.add(phrase.id);last=phrase.id;}
  assert.equal(seen.size,67);
 }
 const seam=new PetPhraseCycle({version:PET_PHRASE_VERSION,remaining:[],lastId:'phrase-002'},()=>0);assert.notEqual(seam.next().id,'phrase-002');
});
test('reload continues remaining IDs; changed catalog and malformed snapshots start a safe cycle',()=>{
 const first=new PetPhraseCycle(null,random()),used=Array.from({length:20},()=>first.next().id),saved=first.snapshot(),restored=new PetPhraseCycle(saved,random());
 for(let i=0;i<47;i++)assert(!used.includes(restored.next().id));
 for(const bad of [{...saved,version:'old'},{...saved,remaining:['unknown']},{...saved,remaining:[saved.lastId]},{...saved,remaining:['phrase-001','phrase-001']}]){
  const fresh=new PetPhraseCycle(bad,random());assert.equal(fresh.snapshot().lastId,null);assert.equal(new Set(Array.from({length:67},()=>fresh.next().id)).size,67);
 }
});
test('first and subsequent deadlines stay at 25–40 seconds; bubble lasts exactly seven seconds',()=>{
 assert.deepEqual(PET_SPEECH_TIMING,{minDelayMs:25000,maxDelayMs:40000,bubbleMs:7000});let now=1000;
 const speech=new PetSpeech(null,null,{now:()=>now,random:()=>0});assert.equal(speech.nextAt,26000);assert.equal(speech.advance(25999),false);now=26000;assert.equal(speech.advance(),true);assert(speech.text());assert.equal(speech.text(32999).length>0,true);assert.equal(speech.text(33000),'');assert.equal(speech.nextAt,51000);
 const late=new PetSpeech(null,null,{now:()=>now,random:()=>.999999});assert(late.nextAt-now>=25000&&late.nextAt-now<=40000);
 now=999999;assert(speech.advance());assert.equal(speech.nextAt,now+25000);assert.equal(speech.cycle.snapshot().remaining.length,65);
});
test('technical-only storage preserves an active bubble, deadline and cycle across modules',()=>{
 let now=1000;const storage=memory(),first=new PetSpeech(storage,'owner',{now:()=>now,random:()=>0});now=26000;first.advance();const text=first.text(),nextAt=first.nextAt;now=28000;
 const second=new PetSpeech(storage,'owner',{now:()=>now,random:()=>0});assert.equal(second.text(),text);assert.equal(second.nextAt,nextAt);assert.equal(second.cycle.snapshot().remaining.length,66);
 const payload=JSON.parse(storage.values.get('owner'));assert.deepEqual(Object.keys(payload).sort(),['bubbleUntil','lastId','nextAt','remaining','version']);assert(!JSON.stringify(payload).includes(text));
 now=100000;const resumed=new PetSpeech(storage,'owner',{now:()=>now,random:()=>0});assert.equal(resumed.text(),'');assert.equal(resumed.nextAt,now+25000);assert.equal(resumed.cycle.snapshot().remaining.length,66);
});
test('session scopes never store raw credentials/names or inherit another account cycle',async()=>{
 const storage=memory();globalThis.sessionStorage=storage;
 try{const a=await petSpeechForSession('synthetic-session-a'),b=await petSpeechForSession('synthetic-session-b');a.advance(a.nextAt);assert.notEqual(a.key,b.key);assert.equal(b.cycle.snapshot().remaining.length,0);const restored=await petSpeechForSession('synthetic-session-a');assert.equal(restored.cycle.snapshot().remaining.length,66);assert(!JSON.stringify([...storage.values]).includes('synthetic-session'));
 }finally{delete globalThis.sessionStorage;}
});
test('unavailable storage and corrupt timing cannot break the companion or increase cadence',()=>{
 const failing={getItem(){throw Error('unavailable');},setItem(){throw Error('unavailable');}};const speech=new PetSpeech(failing,'owner',{now:()=>1000,random:()=>0});assert.equal(speech.nextAt,26000);assert(speech.advance(26000));
 const storage=memory();storage.setItem('owner',JSON.stringify({...speech.cycle.snapshot(),nextAt:Infinity,bubbleUntil:999999}));const safe=new PetSpeech(storage,'owner',{now:()=>1000,random:()=>0});assert.equal(safe.nextAt,26000);assert.equal(safe.text(),'');
});
