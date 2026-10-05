import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=(p)=>fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const CAP='patient-details-v2';
const record={sourceId:'synthetic-a',patient:'Paciente sintético A',requestedAt:'2026-10-01',appointmentDate:'2026-10-15',appointmentTime:'10:00',phone:'5511990000001',active:true};
const payload=(...args)=>({contactCapability:args.length?args[0]:CAP,records:args[1]||[record],summary:{active:(args[1]||[record]).length}});

function frontend(api){
 const tabs=[],opened=[],readMarks=[],messages=[];
 const state={records:[{...record}],contactCapability:CAP,justRead:new Set()};
 const context={state,CONTACT_CAPABILITY:CAP,auth:{api},formatDate:v=>v,formatDateTime:v=>v,isPastAppointment:()=>false,
  render(){},showStatus:s=>messages.push(s),markRead:r=>readMarks.push(r.sourceId),
  els:{refresh:{disabled:false},lastSync:{},syncState:{},list:{innerHTML:''}},
  window:{open(url){assert.equal(url,'about:blank');const tab={closed:false,close(){this.closed=true;},location:{replace:v=>opened.push(v)}};tabs.push(tab);return tab;}}
 };
 const src=read('js/agenda.js');
 vm.runInNewContext('let loadGeneration=0,openingContact=false;'+src.slice(src.indexOf('  function normalizedPatientPhone('),src.indexOf('  async function markRead('))
  +src.slice(src.indexOf('  function revokeContactAccess('),src.indexOf("  document.querySelectorAll('[data-agenda-scope]"))
  +'\nglobalThis.tools={load,openVerifiedContact,revokeContactAccess};',context);
 return {...context.tools,state,tabs,opened,readMarks,messages};
}

function backend(){
 const context={Date,TextEncoder,crypto:globalThis.crypto,Request,Response,URL,
  firebaseConfigured:()=>true,validatePortalSession:async()=>({username:'synthetic-operator',role:'admin'}),
  firestoreList:async()=>({documents:[]}),firestoreCommit:async()=>{},firestoreGet:async()=>null};
 vm.runInNewContext(read('worker/agenda.js').replace(/import[\s\S]*?from\s+'[^']+';/g,'').replace(/export /g,'')
  +'\nglobalThis.tools={handleAgendaRoute,publicRecord,normalizeRecord,contactState};',context);
 return context.tools;
}

test('contrato v2 é explícito nas três respostas autenticadas do Worker',async()=>{
 const w=backend();
 for(const [url,options]of [['/api/agenda',{}],['/api/agenda/contact-state',{}],['/api/agenda/sync',{method:'POST',body:JSON.stringify({records:[],totalCount:0,complete:true})}]]){
  const response=await w.handleAgendaRoute(new Request('https://portal.test'+url,options),{},'https://portal.test',true);
  assert.equal(response.status,200);assert.equal((await response.json()).contactCapability,CAP);
 }
});

test('matriz frontend novo/Worker antigo e capacidade ausente ou inválida não reaproveita telefone legado',async()=>{
 for(const cap of [undefined,null,false,{},'patient-details-v1',CAP+' ']){
  const f=frontend(async()=>payload(cap));
  assert.equal(await f.load(),false);assert.equal(f.state.contactCapability,'');assert.equal(f.state.records[0].phone,'');
  await f.openVerifiedContact(record);assert.equal(f.tabs.length,0);assert.equal(f.opened.length,0);
 }
 const w=backend();
 const legacy=w.publicRecord({...record},'',new Map());
 assert.equal(legacy.phone,''); // Both previous and current frontend see no destination with Worker v2.
 const valid=w.normalizeRecord({...record,contactVersion:CAP,contactSourceId:record.sourceId});
 const f=frontend(async()=>payload(CAP,[w.publicRecord(valid,'',new Map())]));
 assert.equal(await f.load(),true);await f.openVerifiedContact(record);assert.equal(new URL(f.opened[0]).pathname,'/5511990000001');
});

test('clique revalida capacidade, revogação, expiração e associação sem navegar com estado anterior',async()=>{
 const w=backend(),valid=w.normalizeRecord({...record,contactVersion:CAP,contactSourceId:record.sourceId});
 const expired=w.publicRecord({...valid,contactVerifiedAt:new Date(Date.now()-25*3600000).toISOString()},'',new Map());
 for(const next of [payload(undefined),payload(CAP,[]),payload(CAP,[{...record,phone:''}]),payload(CAP,[expired]),
  payload(CAP,[{...record,patient:'Paciente sintético B'}]),payload(CAP,[{...record,phone:'5521990000002'}]),
  payload(CAP,[{...record,appointmentTime:'11:00'}]),payload(CAP,[{...record,active:false}])]){
  const f=frontend(async()=>next);await f.openVerifiedContact(record);
  assert.equal(f.opened.length,0);assert.equal(f.readMarks.length,0);assert.ok(f.tabs.every(t=>t.closed));
 }
});

test('erro, resposta antiga e popup fechado não recuperam acesso nem abrem destino',async()=>{
 const failure=frontend(async()=>{throw Error('synthetic network error');});await failure.openVerifiedContact(record);
 assert.equal(failure.state.contactCapability,'');assert.equal(failure.state.records[0].phone,'');assert.equal(failure.opened.length,0);
 let finish;let calls=0;
 const f=frontend(()=>++calls===1?new Promise(resolve=>{finish=resolve;}):Promise.resolve(payload(undefined)));
 const old=f.openVerifiedContact(record);await f.load();finish(payload());await old;
 assert.equal(f.state.contactCapability,'');assert.equal(f.opened.length,0);assert.ok(f.tabs[0].closed);
 const closed=frontend(async()=>payload());const pending=closed.openVerifiedContact(record);closed.tabs[0].close();await pending;assert.equal(closed.opened.length,0);
});

async function bridge(api){
 const replies=[];let receive;const opener={closed:false,postMessage:m=>replies.push(m)};
 const context={Date,document:{getElementById:()=>({textContent:'',hidden:true})},window:{opener,RegulationAuth:{requireRole:async()=>({role:'admin'}),api},addEventListener:(_n,fn)=>{receive=fn;}}};
 await vm.runInNewContext(read('js/agenda-sync-bridge.js'),context);
 return {replies,send:(id='synthetic-sync')=>receive({origin:'https://teleatendimento.saude.ms.gov.br',source:opener,data:{type:'PORTAL_AGENDA_DIGSAUDE_SYNC',syncId:id,snapshot:{records:[record]}}})};
}

test('ponte recusa backend antigo/erro antes de POST e não repete sucesso após rollback',async()=>{
 for(const mode of ['legacy','invalid','error']){
  let posts=0;const b=await bridge(async(p)=>{if(p.endsWith('/sync')){posts++;return {contactCapability:CAP};}if(mode==='error')throw Error('synthetic');return {contactCapability:mode==='invalid'?{}:undefined,knownSourceIds:['synthetic-a']};});
  assert.equal(b.replies[0].contactCapability,'');await b.send();assert.equal(posts,0);assert.equal(b.replies.at(-1).ok,false);
 }
 let cap=CAP,posts=0;const b=await bridge(async(p)=>{if(p.endsWith('/sync')){posts++;return {contactCapability:cap};}return {contactCapability:cap,knownSourceIds:[]};});
 await b.send();assert.equal(posts,1);assert.equal(b.replies.at(-1).ok,true);
 cap=undefined;await b.send();assert.equal(posts,1);assert.equal(b.replies.at(-1).ok,false);assert.equal(b.replies.at(-1).contactCapability,'');
});

test('ponte exige capacidade no ACK e no estado posterior à escrita',async()=>{
 for(const lostAt of ['ack','after']){
  let checks=0;const b=await bridge(async(p)=>p.endsWith('/sync')?{contactCapability:lostAt==='ack'?undefined:CAP}:{contactCapability:++checks>=3&&lostAt==='after'?undefined:CAP});
  await b.send();assert.equal(b.replies.at(-1).ok,false);assert.equal(b.replies.at(-1).contactCapability,'');
 }
});

function producer(){
 const listeners=new Map(),sent=[];const frame={closed:false,postMessage:m=>sent.push(m)};
 const window={location:new URL('https://source.test/synthetic/consultas'),open:()=>frame,addEventListener:(n,f)=>listeners.set(n,f),setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){}};
 const context={window,URL,Date,Map,Set,document:{getElementById:()=>null,addEventListener(){}}};
 const src=read('agenda/digsaude-agenda-sync.user.js');
 vm.runInNewContext(src.slice(0,src.indexOf('  function mountWidget()'))+`
  portalWindow=window.open();
  globalThis.tools={prime(){autoEnabled=true;contactCapabilityVerified=true;pendingSyncId='synthetic-sync';pendingSnapshot={records:[]};contactCache.set('synthetic',{});knownContactIds.add('synthetic-a');},
  state:()=>({autoEnabled,contactCapabilityVerified,cache:contactCache.size,known:knownContactIds.size,pendingSyncId}),retry:sendSnapshot,run:runAutomaticSync};})();`,context);
 return {...context.tools,sent,reply:data=>listeners.get('message')({origin:'https://regulacaoeldoradoms.com.br',source:frame,data})};
}

test('coletor perde capacidade, cancela entrega e limpa cache/IDs; READY antigo não autoriza nova coleta',async()=>{
 for(const type of ['PORTAL_AGENDA_DIGSAUDE_READY','PORTAL_AGENDA_DIGSAUDE_RESULT'])for(const cap of [undefined,{},'patient-details-v1']){
  const p=producer();p.prime();p.reply({type,contactCapability:cap,syncId:'synthetic-sync',ok:true,knownSourceIds:['synthetic-a']});
  assert.deepEqual(JSON.parse(JSON.stringify(p.state())),{autoEnabled:false,contactCapabilityVerified:false,cache:0,known:0,pendingSyncId:''});
  p.retry();await p.run();assert.equal(p.sent.length,0);
  p.reply({type:'PORTAL_AGENDA_DIGSAUDE_READY',contactCapability:CAP,knownSourceIds:[]});p.retry();assert.equal(p.sent.length,0);assert.equal(p.state().cache,0);
 }
});
