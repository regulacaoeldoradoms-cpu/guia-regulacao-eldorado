import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  FIXED, REVISION, PUBLIC_NAMES, SECRET_NAMES, UPLOAD_MESSAGE, UPLOAD_TAG,
  SafeError, parseJson, productionSnapshot, validateHistoricalSnapshot, sameProduction,
  inspectProductionDependencies, buildConfig, verifyVersion, requireLatest, inspectMultipart,
  validatePriorAttempt, validateWindow, CONTROL_SQL, verifyUploadedAlias, uploadedId,
  runWrangler, archivePriorAttempt, markUploadAttempt, executeRelease, reportOutcome,
  fingerprintSource, priorAttemptSummary, verifyOnly,
} from './liberar-escrita-preview-4d-v3.mjs';
const DB = '11111111-1111-4111-8111-111111111111';
const NEW = '22222222-2222-4222-8222-222222222222';
const OTHER = '33333333-3333-4333-8333-333333333333';
const HIST = { deploymentId: OTHER, versionId: FIXED.historicalProduction, percentage: 100 };
const copy = x => structuredClone(x);
const vars = {
  ALLOWED_ORIGINS: FIXED.pages, AUTH_DEVELOPER_USERNAMES: 'synthetic-operator',
  DOCUMENTS_DRIVE_WRITE_ENABLED: 'false', DOCUMENTS_HOMOLOGATION_CONTROL_ID: FIXED.control,
  DOCUMENTS_HOMOLOGATION_DIAGNOSTICS: 'true', DOCUMENTS_HOMOLOGATION_ORIGIN: FIXED.pages,
  DOCUMENTS_HOMOLOGATION_RELEASE: FIXED.source, DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN: FIXED.origin,
  GOOGLE_DRIVE_OAUTH_CLIENT_ID: 'synthetic-client.apps.googleusercontent.com',
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI: 'https://synthetic.invalid/callback',
};
function base() {
  return { id: FIXED.preview, resources: {
    bindings: [...Object.entries(vars).map(([name,text]) => ({name,type:'plain_text',text})),
      ...SECRET_NAMES.map(name => ({name,type:'secret_text'})), {name:'AUTH_DB',type:'d1',id:DB}],
    script_runtime: {compatibility_date:'2026-08-25',compatibility_flags:[]},
  }};
}
function prod() { const v=base();v.id=FIXED.production;
  v.resources.bindings.push({name:'UNRELATED_SECRET',type:'secret_text'});return v; }
function deployment() { return { id: FIXED.deployment, versions: [{version_id:FIXED.production,percentage:100}] }; }
function list(id=FIXED.production, predecessor=FIXED.preview) { return [
  {id,metadata:{created_on:'2026-09-17T18:30:00Z'}},
  {id:predecessor,metadata:{created_on:'2026-09-17T18:00:00Z'}},
]; }
function windowResult() { const expires_at = Date.parse(FIXED.deadline)/1000;
  return [{success:true,results:[{enabled:1,expires_at,now_epoch:expires_at-2400,
    same_scope:1,one_file:1,other_active_controls:0,upload_sessions:0}]}]; }
function config(entry='/tmp/homologation-4d.js') { return buildConfig(base(),entry); }
function newVersion(c=config()) {
  const v=base();v.id=NEW;v.annotations={'workers/alias':FIXED.alias};
  for(const b of v.resources.bindings) if(b.type==='plain_text') b.text=c.vars[b.name];return v;
}
function previous() { return {sourceCommit:FIXED.source,basePreviewVersionId:FIXED.preview,
  controlId:FIXED.control,deadline:FIXED.deadline,uploadAttempted:false,uploaded:false,
  newPreviewVersionId:null,configurationVerified:false}; }
function metadata(c=config()) { return {
  main_module:'homologation-4d.js',compatibility_date:c.compatibility_date,compatibility_flags:[],
  keep_bindings:[],annotations:{'workers/alias':FIXED.alias,'workers/tag':UPLOAD_TAG,'workers/message':UPLOAD_MESSAGE},
  bindings:[...Object.entries(c.vars).map(([name,text])=>({name,type:'plain_text',text})),
    ...SECRET_NAMES.map(name=>({name,type:'inherit'})),{name:'AUTH_DB',type:'d1',id:DB}],
}; }
async function multipart(m=metadata(), extra=false, code='export default { fetch() {} };') {
  const form=new FormData();form.append('metadata',JSON.stringify(m));
  form.append('homologation-4d.js',new File([code],'homologation-4d.js',{type:'application/javascript+module'}));
  if(extra) form.append('unexpected','not-allowed');
  return Buffer.from(await new Response(form).arrayBuffer());
}
const rejects = (fn, code) => assert.throws(fn, e => e instanceof SafeError && (!code || e.message===code));

test('original JSON parsing strips ANSI and BOM',()=>assert.deepEqual(parseJson('\u001b[32m\ufeff{"a":1}\u001b[0m'),{a:1}));
test('current exact production passes',()=>assert.equal(productionSnapshot(deployment()).versionId,FIXED.production));
test('historical production is not accepted as current',()=>{const v=deployment();v.versions[0].version_id=FIXED.historicalProduction;rejects(()=>productionSnapshot(v));});
test('a different deployment of the same version blocks',()=>{const v=deployment();v.id=OTHER;rejects(()=>productionSnapshot(v));});
test('split traffic blocks',()=>{const v=deployment();v.versions.push({version_id:OTHER,percentage:0});rejects(()=>productionSnapshot(v));});
test('string percentage blocks',()=>{const v=deployment();v.versions[0].percentage='100';rejects(()=>productionSnapshot(v));});
test('historical snapshot is preserved independently',()=>assert.deepEqual(validateHistoricalSnapshot(HIST),HIST));
test('current production cannot masquerade as original historical snapshot',()=>rejects(()=>validateHistoricalSnapshot({...HIST,versionId:FIXED.production})));
test('same production is fieldwise, not key-order-dependent',()=>sameProduction(HIST,{percentage:100,versionId:HIST.versionId,deploymentId:HIST.deploymentId}));
test('build switches only gate and narrows inheritance',()=>{const c=config();assert.equal(c.vars.DOCUMENTS_DRIVE_WRITE_ENABLED,'true');
  assert.deepEqual(c.unsafe.metadata.keep_bindings,[]);assert.deepEqual(c.secrets.required,SECRET_NAMES);
  assert.equal(c.dependencies_instrumentation.enabled,false);assert.equal(c.upload_source_maps,false);
  assert.equal(Object.keys(c.vars).length,10);});
for(const [label, mutate] of [
  ['armed base',v=>v.resources.bindings.find(b=>b.name==='DOCUMENTS_DRIVE_WRITE_ENABLED').text='true'],
  ['different scope',v=>v.resources.bindings.find(b=>b.name==='DOCUMENTS_HOMOLOGATION_CONTROL_ID').text='other'],
  ['production origin',v=>v.resources.bindings.find(b=>b.name==='ALLOWED_ORIGINS').text='https://production.invalid'],
  ['missing secret',v=>v.resources.bindings=v.resources.bindings.filter(b=>b.name!==SECRET_NAMES[0])],
  ['extra secret',v=>v.resources.bindings.push({name:'MORE',type:'secret_text'})],
  ['duplicate binding',v=>v.resources.bindings.push(v.resources.bindings[0])],
  ['unknown runtime',v=>v.resources.script_runtime.compatibility_date='2026-01-01'],
]) test('base rejects '+label,()=>{const v=base();mutate(v);rejects(()=>buildConfig(v,'/tmp/homologation-4d.js'));});
test('production entrypoint cannot be used',()=>rejects(()=>buildConfig(base(),'/tmp/index.js')));
test('production extras are not inherited',()=>assert.equal(inspectProductionDependencies(prod(),{db:DB,vars}).requiredSecretsPresent,6));
test('secret values never read by dependency inspection',()=>{const v=prod();for(const b of v.resources.bindings.filter(b=>b.type==='secret_text'))
  Object.defineProperty(b,'text',{get(){throw new Error('SECRET_VALUE_READ');}});
  inspectProductionDependencies(v,{db:DB,vars});});
for(const [label,mutate] of [
  ['missing dependency',v=>v.resources.bindings=v.resources.bindings.filter(b=>b.name!==SECRET_NAMES[0])],
  ['wrong secret type',v=>v.resources.bindings.find(b=>b.name===SECRET_NAMES[0]).type='plain_text'],
  ['different D1',v=>v.resources.bindings.find(b=>b.name==='AUTH_DB').id=OTHER],
  ['different public dependency',v=>v.resources.bindings.find(b=>b.name==='GOOGLE_DRIVE_OAUTH_CLIENT_ID').text='other'],
]) test('production rejects '+label,()=>{const v=prod();mutate(v);rejects(()=>inspectProductionDependencies(v,{db:DB,vars}));});
test('latest defaults to current production, not preview',()=>requireLatest(list()));
test('another upload blocks',()=>rejects(()=>requireLatest(list(OTHER))));
test('ambiguous order blocks',()=>{const v=list();v[1].metadata.created_on=v[0].metadata.created_on;rejects(()=>requireLatest(v));});
test('concurrent predecessor blocks after upload',()=>rejects(()=>requireLatest(list(NEW,OTHER),NEW,FIXED.production)));
test('correct returned predecessor passes',()=>requireLatest(list(NEW,FIXED.production),NEW,FIXED.production));
test('new version and alias confirmed',()=>verifyVersion(newVersion(),config()));
test('missing alias blocks',()=>{const v=newVersion();delete v.annotations;rejects(()=>verifyVersion(v,config()));});
test('unchanged base cannot pretend to be uploaded',()=>rejects(()=>verifyVersion(base(),config())));
test('multipart accepts only the intended bindings',async()=>{const r=await inspectMultipart(await multipart(),config());assert.equal(r.inheritedSecrets,6);assert.equal(r.publicBindings,10);});
test('multipart fingerprint ignores randomized boundary',async()=>{assert.equal((await inspectMultipart(await multipart(),config())).fingerprint,(await inspectMultipart(await multipart(),config())).fingerprint);});
for(const [label,mutate] of [
  ['broad secret inheritance',m=>m.keep_bindings=['secret_text']],
  ['additional resource',m=>m.assets={jwt:'fake'}],
  ['logpush',m=>m.logpush=true],
  ['dependency instrumentation',m=>m.package_dependencies=[{name:'x',version:'1'}]],
  ['wrong main',m=>m.main_module='index.js'],
  ['secret value',m=>{const b=m.bindings.find(b=>b.type==='inherit');b.type='secret_text';b.text='FAKE_SECRET';}],
  ['secret origin field',m=>m.bindings.find(b=>b.type==='inherit').old_name='OTHER'],
  ['extra binding',m=>m.bindings.push({name:'MORE',type:'inherit'})],
  ['wrong D1',m=>m.bindings.find(b=>b.type==='d1').id=OTHER],
  ['wrong origin',m=>m.bindings.find(b=>b.name==='ALLOWED_ORIGINS').text='https://evil.invalid'],
]) test('multipart rejects '+label,async()=>{const m=metadata();mutate(m);await assert.rejects(()=>multipart(m).then(b=>inspectMultipart(b,config())),SafeError);});
test('additional multipart part blocks',async()=>await assert.rejects(()=>multipart(metadata(),true).then(b=>inspectMultipart(b,config())),SafeError));
test('truncated multipart blocks',async()=>{const b=await multipart();await assert.rejects(()=>inspectMultipart(b.subarray(0,b.length-10),config()),SafeError);});
test('valid original D1 window passes',()=>assert.equal(validateWindow(windowResult()).fileCount,1));
for(const [field,value] of [['enabled',0],['same_scope',0],['one_file',0],['other_active_controls',1],['upload_sessions',1],['expires_at',0],['now_epoch','123']])
  test('D1 blocks invalid '+field,()=>{const w=windowResult();w[0].results[0][field]=value;rejects(()=>validateWindow(w));});
test('less than 20 minutes blocks',()=>{const w=windowResult();w[0].results[0].now_epoch=w[0].results[0].expires_at-1199;rejects(()=>validateWindow(w));});
test('expired window blocks',()=>{const w=windowResult();w[0].results[0].now_epoch=w[0].results[0].expires_at+1;rejects(()=>validateWindow(w));});
test('SQL is SELECT-only, without returned identities',()=>{assert.match(CONTROL_SQL,/^SELECT/);assert.doesNotMatch(CONTROL_SQL,/\b(?:INSERT|UPDATE|DELETE|REPLACE|DROP|ALTER|CREATE)\b/i);
  assert.doesNotMatch(CONTROL_SQL,/SELECT\s+n\.(?:allowed_username|allowed_file_ids_json)/i);});
test('prior pre-upload failure may be archived',()=>validatePriorAttempt(previous()));
for(const [label,mutate] of [['attempted',p=>p.uploadAttempted=true],['unknown',p=>delete p.uploadAttempted],['uploaded',p=>p.uploaded=true],['foreign scope',p=>p.controlId='foreign']])
  test('ledger blocks '+label,()=>{const p=previous();mutate(p);rejects(()=>validatePriorAttempt(p));});
test('archive preserves exact bytes and does not delete original',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-archive-'));try{
  const p=path.join(dir,'ultimo-preview-escrita.json');const bytes=JSON.stringify(previous(),null,2);fs.writeFileSync(p,bytes);
  archivePriorAttempt(dir,p);assert.equal(fs.readFileSync(p,'utf8'),bytes);assert.equal(fs.readdirSync(dir).length,2);
}finally{fs.rmSync(dir,{recursive:true,force:true});}});
test('write-once marker prevents re-entry even without ledger',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-marker-'));try{
  const r={uploadAttempted:false};markUploadAttempt(dir,r);assert.equal(r.uploadAttempted,true);rejects(()=>archivePriorAttempt(dir,path.join(dir,'absent')));
}finally{fs.rmSync(dir,{recursive:true,force:true});}});
test('Wrangler command uses fixed version, quoted args and no shell interpolation',()=>{let observed;
  runWrangler(['versions','list','--json'],'/tmp',(bin,args,opts)=>{observed={bin,args,opts};return {status:0,stdout:'[]'};});
  assert.equal(observed.bin,'powershell.exe');assert.equal(observed.opts.shell,false);assert.match(observed.args.at(-1),/wrangler@4\.133\.0/);
  assert.equal(observed.opts.env.WRANGLER_SEND_METRICS,'false');});
test('Wrangler errors do not expose raw stderr',()=>rejects(()=>runWrangler([],'.',()=>({status:1,stderr:'FAKE_SECRET'}))));
test('upload parser and alias are exact',()=>{assert.equal(uploadedId('Worker Version ID: '+NEW),NEW);verifyUploadedAlias('Version Preview Alias URL: '+FIXED.origin);});
test('ambiguous returned IDs block',()=>rejects(()=>uploadedId('Worker Version ID: '+NEW+'\nWorker Version ID: '+OTHER)));

async function flow(options={}) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-flow-')); const events=[];let statusReads=0, lists=0, windows=0,dry=0,inspect=0,saved=[];
 const entry=path.join(dir,'homologation-4d.js');fs.writeFileSync(entry,'export default {};');
 const cp=path.join(dir,'config.json');fs.writeFileSync(cp,'{}');
 const local={base:dir,entry,config:config(entry),productionBefore:HIST};
 const query=args=>{events.push(args.slice(0,3).join(' '));
  if(args[0]==='deployments'){statusReads++;const d=deployment();if(options.initialMismatch)d.versions[0].version_id=OTHER;if(options.productionChanged && statusReads>=2)d.id=OTHER;return d;}
  if(args[0]==='d1'){windows++;const w=windowResult();if(options.expiredAfterConfirm && windows>=2)w[0].results[0].now_epoch=w[0].results[0].expires_at;return w;}
  if(args[1]==='list'){lists++;return lists<=2?list():list(NEW,options.concurrent?OTHER:FIXED.production);}
  if(args[1]==='view'){if(args[2]===FIXED.preview)return base();if(args[2]===FIXED.production)return prod();if(args[2]===NEW)return newVersion(config(entry));}
  throw new Error('unexpected query');
 };
 const wrangler=args=>{if(args.includes('--dry-run')){dry++;events.push('dry-run');return '';}
  events.push('UPLOAD');if(options.uploadError)throw new Error('FAKE_SECRET');return 'Worker Version ID: '+NEW+'\nVersion Preview Alias URL: '+FIXED.origin;};
 try{const outcome=await executeRelease({local,configPath:cp,query,wrangler,save:r=>{events.push('save:'+r.uploadAttempted);saved.push(copy(r));},
   confirmHuman:async()=>{events.push('CONFIRM');if(options.cancel)throw new SafeError('CANCELADO_PELO_OPERADOR');},
   markAttempt:r=>{events.push('MARK');r.uploadAttempted=true;},
   inspectPayload:async()=>{inspect++;if(options.badPayload)throw new SafeError('HERANCA_AMPLA_BLOQUEADA');
    return {fingerprint:options.payloadChanged && inspect===2?'changed':'same',moduleBytes:3,publicBindings:10,inheritedSecrets:6};},
   sourceFingerprint:()=>options.sourceChanged && events.includes('CONFIRM')?'changed':'same',log:()=>{},
 });return {outcome,events,saved,dry};}finally{fs.rmSync(dir,{recursive:true,force:true});}
}
test('full mocked flow: confirm, repeat dry-run, durable marker, one upload, checks',async()=>{const {outcome,events,dry}=await flow();assert.equal(outcome.ok,true);
 assert.equal(events.filter(e=>e==='UPLOAD').length,1);assert.equal(dry,2);assert(events.indexOf('CONFIRM')<events.indexOf('MARK'));assert(events.indexOf('MARK')<events.indexOf('UPLOAD'));
 assert.equal(outcome.record.homologationApproved,false);assert.equal(outcome.record.controlDataModified,false);});
for(const [label,option] of [['cancel',{cancel:true}],['production changed',{productionChanged:true}],['expired after confirmation',{expiredAfterConfirm:true}],
 ['broad multipart',{badPayload:true}],['payload changed',{payloadChanged:true}],['source changed',{sourceChanged:true}]])
 test('mocked pre-upload '+label+' makes zero upload calls',async()=>{const {outcome,events}=await flow(option);assert.equal(outcome.ok,false);assert.equal(outcome.record.uploadAttempted,false);assert(!events.includes('UPLOAD'));});
test('upload failure remains uncertain and does not retry',async()=>{const {outcome,events}=await flow({uploadError:true});assert.equal(outcome.ok,false);assert.equal(outcome.record.uploadAttempted,true);
 assert.equal(events.filter(e=>e==='UPLOAD').length,1);assert.equal(outcome.record.errorCode,'ERRO_LOCAL_NAO_DETALHADO');});
test('concurrent predecessor is rejected after upload',async()=>{const {outcome}=await flow({concurrent:true});assert.equal(outcome.ok,false);assert.equal(outcome.record.uploadAttempted,true);assert.equal(outcome.record.errorCode,'UPLOAD_CONCORRENTE_DETECTADO');});
test('operator output is sanitized and not false success',async()=>{const {outcome}=await flow({uploadError:true});let out=[];reportOutcome(outcome,s=>out.push(s));const text=out.join('\n');
 assert.match(text,/NAO repita/);assert.doesNotMatch(text,/FAKE_SECRET|synthetic-operator|Controle:|PREVIEW_COM_ESCRITA_LIBERADA/);});
test('source fingerprint does not read credential paths',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-source-'));try{
 const entry=path.join(dir,'homologation-4d.js');fs.writeFileSync(entry,'export default {};');
 const first=fingerprintSource(entry);fs.writeFileSync(path.join(dir,'.env'),'FAKE_SECRET');assert.equal(first,fingerprintSource(entry));
 fs.writeFileSync(entry,'export default {x:1};');assert.notEqual(first,fingerprintSource(entry));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}});

test('first production mismatch is sanitized and makes no upload call',async()=>{const {outcome,events}=await flow({initialMismatch:true});assert.equal(outcome.ok,false);assert.equal(outcome.record.observedProduction.versions[0].versionId,OTHER);assert.equal(outcome.record.uploadAttempted,false);assert(!events.includes('UPLOAD'));});
test('source fingerprint ignores arbitrary JSON including credentials.json',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-privacy-'));try{const e=path.join(dir,'homologation-4d.js');fs.writeFileSync(e,'export default {};');const before=fingerprintSource(e);fs.writeFileSync(path.join(dir,'credentials.json'),'{"not":"read"}');assert.equal(fingerprintSource(e),before);}finally{fs.rmSync(dir,{recursive:true,force:true});}});

function readOnlyFixture(){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'4d-read-'));const local={base:dir,entry:path.join(dir,'homologation-4d.js'),config:config()};const queries=[];const query=a=>{queries.push(a);if(a[0]==='deployments')return deployment();if(a[0]==='d1')return windowResult();if(a[1]==='list')return list();if(a[1]==='view')return base();throw new Error('UNEXPECTED');};return {dir,local,queries,query};}
test('read-only inspection never calls upload or modifies ledger',()=>{const f=readOnlyFixture();try{const p=path.join(f.dir,'ultimo-preview-escrita.json');const bytes=JSON.stringify(previous());fs.writeFileSync(p,bytes);const r=verifyOnly(f);assert.equal(r.readOnly,true);assert.equal(r.uploadAttemptedByThisRun,false);assert.equal(r.matchesReviewedProduction,true);assert.equal(r.windowPasses,true);assert.equal(fs.readFileSync(p,'utf8'),bytes);assert.equal(f.queries.filter(a=>a.includes('upload')).length,0);assert.equal(fs.readdirSync(f.dir).length,1);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('read-only reports prior attempted upload instead of treating it as absent',()=>{const f=readOnlyFixture();try{fs.writeFileSync(path.join(f.dir,'ultimo-preview-escrita.json'),JSON.stringify({...previous(),uploadAttempted:true}));const r=verifyOnly(f);assert.equal(r.priorAttempt.uploadAttempted,true);assert.equal(r.uploadAttemptedByThisRun,false);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('read-only flags a lock from another revision',()=>{const f=readOnlyFixture();try{fs.writeFileSync(path.join(f.dir,'v2-r1.lock'),'');assert.equal(priorAttemptSummary(f.dir).lockFileDetected,true);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('read-only preserves unknown prior state as null',()=>{const f=readOnlyFixture();try{fs.writeFileSync(path.join(f.dir,'ultimo-preview-escrita.json'),'{broken');assert.equal(priorAttemptSummary(f.dir).uploadAttempted,null);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('read-only reports a changed production without approving it',()=>{const f=readOnlyFixture();try{const orig=f.query;f.query=a=>{const r=orig(a);if(a[0]==='deployments')r.versions[0].version_id=OTHER;return r;};const r=verifyOnly(f);assert.equal(r.matchesReviewedProduction,false);assert.equal(r.production.versions[0].versionId,OTHER);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
test('read-only errors never leak raw exception messages',()=>{const f=readOnlyFixture();try{f.query=()=>{throw new Error('FAKE_SECRET');};const r=verifyOnly(f);assert.equal(r.errors.length,5);assert.doesNotMatch(JSON.stringify(r),/FAKE_SECRET/);}finally{fs.rmSync(f.dir,{recursive:true,force:true});}});
