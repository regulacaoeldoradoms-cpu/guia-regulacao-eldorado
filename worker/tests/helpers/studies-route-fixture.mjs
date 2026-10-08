import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { sqliteD1 } from './studies-sqlite.mjs';

// O código real do roteador e do serviço é carregado sem reescrever seu texto.
// Apenas identidade autenticada e catálogo são fixtures; persistência usa SQLite.
export async function fixture(t, options = {}) {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  t.after(() => sql.close());
  const db = sqliteD1(sql);
  const lesson = { id:'fixture.lesson', topicId:'fixture.lesson', contentVersion:2, order:1, xp:100,
    title:'Leitura de teste', kind:'lesson', sourceIds:[], sections:[], recall:[],
    questions:Array.from({length:4},(_,i)=>({id:`lesson.${i}`,prompt:'Teste',options:['A','B'],answer:0,explanation:'Comentário de teste'})) };
  const boss = { ...lesson, id:'banking.sfn.boss', topicId:'banking.sfn.boss', kind:'boss', order:2, passScore:75, xp:220,
    questions:lesson.questions.map((q,i)=>({...q,id:`boss.${i}`})) };
  const missions=options.missions || [lesson,boss];
  const sources=options.sources || [];
  let identity={username:'wellyton',name:'Estudante sintético'};
  const context=vm.createContext({ Request,Response,URL,crypto,console });
  const auth=new vm.SyntheticModule(['validatePortalSession'], function () {
    this.setExport('validatePortalSession', async () => identity);
  }, {context});
  const exports={
    STUDY_SOURCES:sources, PUBLISHED_MISSIONS:missions, PLANNED_MISSIONS:options.planned || missions,
    missionById:(id)=>missions.find((m)=>m.id===id)||null,
    missionByTopicId:(id)=>missions.find((m)=>m.topicId===id)||null,
    questionById:(id)=>{for(const mission of missions){const question=mission.questions.find((q)=>q.id===id);if(question)return {mission,question};}return null;},
    sourceMap:()=>new Map(sources.map(source=>[source.id,source])),
    publicationSnapshot:options.publicationSnapshot || (()=>({
      baselineReleaseSequence:1,currentRelease:'fixture-r1',currentReleaseSequence:1,
      newCount:0,newMissionIds:[],revisionRecommendedCount:0,revisionRecommendedIds:[]
    }))
  };
  const catalog=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context});
  const curriculum=new vm.SyntheticModule(['curriculumSnapshot'],function(){
    this.setExport('curriculumSnapshot',options.curriculumSnapshot || (()=>({
      version:1,basis:'fixture',totalAreas:0,startedAreas:0,completedAreas:0,
      totalBlocks:0,publishedBlocks:0,completedBlocks:0,availabilityPercent:0,progressPercent:0,
      readiness:{status:'not_measured',label:'Ainda não medida',explanation:'fixture'},areas:[]
    })));
  },{context});
  const rounds=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-rounds.js',import.meta.url),'utf8'),{context});
  await rounds.link(()=>{throw new Error('Import não esperado no serviço de rodadas');});await rounds.evaluate();
  const assessmentContent=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies-assessment-content/sfn-foundation-v1.js',import.meta.url),'utf8'),{context});
  await assessmentContent.link(()=>{throw new Error('Import não esperado no conteúdo de avaliação');});await assessmentContent.evaluate();
  const assessments=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-assessments.js',import.meta.url),'utf8'),{context});
  await assessments.link((specifier)=>{
    if(specifier==='./studies-assessment-content/sfn-foundation-v1.js')return assessmentContent;
    throw new Error(`Import não previsto na avaliação: ${specifier}`);
  });await assessments.evaluate();
  const questionFeedback=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies-content/question-feedback-v1.js',import.meta.url),'utf8'),{context});
  await questionFeedback.link(()=>{throw new Error('Import não esperado no feedback de questões');});await questionFeedback.evaluate();
  const confirmedFeedback=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-feedback.js',import.meta.url),'utf8'),{context});
  await confirmedFeedback.link(specifier=>{
    if(specifier==='./study-rounds.js')return rounds;
    if(specifier==='./studies-content/question-feedback-v1.js')return questionFeedback;
    throw new Error('Import não previsto no feedback confirmado: '+specifier);
  });await confirmedFeedback.evaluate();
  const readingReceipts=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-reading-receipts.js',import.meta.url),'utf8'),{context});
  await readingReceipts.link(specifier=>{
    if(specifier==='./study-rounds.js')return rounds;
    throw new Error('Import não previsto na confirmação de leitura: '+specifier);
  });await readingReceipts.evaluate();
  const route=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies.js',import.meta.url),'utf8'),{context});
  await route.link((specifier)=>{
    if(specifier==='./auth-management-flex.js')return auth;
    if(specifier==='./studies-content/manifest.js')return catalog;
    if(specifier==='./studies-content/curriculum-v1.js')return curriculum;
    if(specifier==='./studies-content/question-feedback-v1.js')return questionFeedback;
    if(specifier==='./study-rounds.js')return rounds;
    if(specifier==='./study-feedback.js')return confirmedFeedback;
    if(specifier==='./study-reading-receipts.js')return readingReceipts;
    if(specifier==='./study-assessments.js')return assessments;
    throw new Error(`Import não previsto: ${specifier}`);
  });
  await route.evaluate();
  async function call(path,body, options={}) {
    identity=Object.prototype.hasOwnProperty.call(options,'identity')?options.identity:{username:'wellyton',name:'Estudante sintético'};
    const request=new Request('https://study.test/api/studies/'+path,{method:options.method||(body===undefined?'GET':'POST'),...(body!==undefined?{body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}:{})});
    const response=await route.namespace.handleStudiesRoute(request,{AUTH_DB:db},'https://study.test',options.originAllowed!==false);
    return {status:response.status,body:response.status===204?null:await response.json(),headers:response.headers};
  }
  async function start(m=lesson,reviewId=null){const r=await call('sessions',{missionId:m.id,reviewId});assert.equal(r.status,201);return r.body.sessionId;}
  async function answer(m,id, choices=[]){for(let i=0;i<m.questions.length;i++){const r=await call('attempts',{sessionId:id,questionId:m.questions[i].id,selectedOption:choices[i]??0});assert.equal(r.status,200);}}
  return {sql,db,call,start,answer,lesson,boss};
}

