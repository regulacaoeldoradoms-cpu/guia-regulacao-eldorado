import {prepareRegistrationFixture,syntheticRegistrationDetails} from './helpers/private-registration-fixture.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import {generateKeyPairSync} from 'node:crypto';
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {handlePortalRoute} from '../auth-management-v2.js';
import {handleCouncilRoute} from '../council-access-policy.js';
const fields=value=>Object.fromEntries(Object.entries(value).map(([key,item])=>[key,typeof item==='object'?{mapValue:{fields:fields(item)}}:{stringValue:String(item)}]));
test('speculative details have no view effects; every opening revalidates live permissions and all child data',async()=>{
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-detail-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-detail-rate'},protocol='CMS-2026-000001';
 const originalFetch=globalThis.fetch,reads=[];let note='Observação sintética privada.';
 const doc={protocol,subject:'Caso inteiramente sintético.',privacyMode:'identificada',authorUsername:'synthetic.owner',authorLabel:'Pessoa fictícia',authorIdentity:{displayName:'Pessoa fictícia'},createdAt:'2026-10-12T12:00:00Z',updatedAt:'2026-10-12T12:00:00Z'};
 try{
  await prepareRegistrationFixture(env);
  const registration=await handlePortalRoute(new Request('https://synthetic.test/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.93'},body:JSON.stringify({...syntheticRegistrationDetails,username:'synthetic.detail',password:'Synthetic-Registration-2026'})}),env,'',true);assert.equal(registration.status,201);const {token}=await registration.json();
  await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='presidente' WHERE username=?").bind('synthetic.detail').run();
  const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});Object.assign(env,{FIREBASE_PROJECT_ID:'synthetic-detail-prefetch',FIREBASE_CLIENT_EMAIL:'synthetic@fixture.invalid',FIREBASE_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'})});
  globalThis.fetch=async(input,options={})=>{
   const url=new URL(typeof input==='string'?input:input.url||String(input));
   if(url.hostname==='oauth2.googleapis.com')return Response.json({access_token:'synthetic-only-token',expires_in:3600});
   assert.equal(url.hostname,'firestore.googleapis.com');assert.equal(options.method||'GET','GET','prefetch/open must never mutate provider data');reads.push(url.pathname);
   const item=url.pathname.endsWith('/internal_notes')?{id:'note1',body:note,authorLabel:'Responsável fictício'}:url.pathname.endsWith('/attachments')?{id:'attachment1',contentType:'application/pdf',objectName:'private-fixture.pdf',size:'1024'}:{id:'event1',actorType:'user',actorLabel:'Pessoa fictícia',detail:'Criação sintética'};
   return url.pathname.endsWith('/'+protocol)?Response.json({name:url.pathname,fields:fields(doc)}):Response.json({documents:[{name:url.pathname+'/'+item.id,fields:fields(item)}]});
  };
  const call=query=>handleCouncilRoute(new Request('https://synthetic.test/api/council/manifestations/'+protocol+query,{headers:{Authorization:`Bearer ${token}`}}),env,'',true);
  const auditCount=()=>env.AUTH_DB.database.prepare("SELECT count(*) AS count FROM council_audit_log WHERE action='manifestation.view'").get().count;
  const prefetch=await call('/prefetch');assert.equal(prefetch.status,200);assert.equal(prefetch.headers.get('Cache-Control'),'no-store');const cached=await prefetch.json();assert.match(cached.detailRevision,/^[a-f0-9]{64}$/);assert.equal(cached.internalNotes[0].body,note);assert.equal(auditCount(),0);assert(reads.every(path=>!path.includes('storage')));
  const unchanged=await call('?'+new URLSearchParams({cacheRevision:cached.detailRevision}));assert.equal(unchanged.status,200);assert.deepEqual(await unchanged.json(),{notModified:true,detailRevision:cached.detailRevision,protocol});assert.equal(auditCount(),1,'only real opening records a view');
  await call('?prefetch=1');assert.equal(auditCount(),2,'ordinary detail reads retain view auditing even with a legacy query flag');
  assert.equal((await call('/prefetch?as=citizen')).status,403);assert.equal(auditCount(),2);
  note='Outra nota fictícia, sem alteração do documento pai.';const changed=await (await call('?'+new URLSearchParams({cacheRevision:cached.detailRevision}))).json();assert.equal(changed.internalNotes[0].body,note);assert.notEqual(changed.detailRevision,cached.detailRevision,'child changes cannot reuse the previous snapshot');
  await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='membro' WHERE username=?").bind('synthetic.detail').run();
  const member=await (await call('?'+new URLSearchParams({cacheRevision:changed.detailRevision}))).json();assert.equal(member.notModified,undefined);assert.equal(member.manifestation.authorIdentity,undefined);assert.equal(member.manifestation.authorUsername,undefined);assert.deepEqual(member.internalNotes,[]);assert.deepEqual(member.attachments,[]);assert.equal(member.accessPolicy.canInteract,false);assert.notEqual(member.detailRevision,changed.detailRevision);
  const before=auditCount();await call('/prefetch');assert.equal(auditCount(),before,'read-only member prefetch is also effect free');
  await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='' WHERE username=?").bind('synthetic.detail').run();assert.equal((await call('/prefetch')).status,403);assert.equal((await call('?'+new URLSearchParams({cacheRevision:cached.detailRevision}))).status,404);assert.equal(auditCount(),before);
  await env.AUTH_DB.prepare('UPDATE auth_users SET active=0 WHERE username=?').bind('synthetic.detail').run();assert.equal((await call('/prefetch')).status,401);
 }finally{globalThis.fetch=originalFetch;env.AUTH_DB.database.close();}
});
