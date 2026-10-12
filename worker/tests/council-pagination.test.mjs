import test from 'node:test';import assert from 'node:assert/strict';import {generateKeyPairSync} from 'node:crypto';
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {ensureAuthSchema,handlePortalRoute} from '../auth-management-v2.js';
import {handleCouncilRoute} from '../council.js';

test('institutional cursor keeps bounded pages, privacy and fresh Council authorization',async()=>{
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-council-cursor-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-rate-key'};
 const originalFetch=globalThis.fetch,requests=[];
 try{
  await ensureAuthSchema(env);
  const registered=await handlePortalRoute(new Request('https://synthetic.test/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.88'},body:JSON.stringify({username:'synthetic.council.cursor',password:'Synthetic-Registration-2026'})}),env,'',true);assert.equal(registered.status,201);const {token}=await registered.json();
  await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='presidente' WHERE username=?").bind('synthetic.council.cursor').run();
  const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});Object.assign(env,{FIREBASE_PROJECT_ID:'synthetic-council-pagination',FIREBASE_CLIENT_EMAIL:'synthetic@fixture.invalid',FIREBASE_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'})});
  globalThis.fetch=async input=>{
   const url=new URL(typeof input==='string'?input:input.url||String(input));
   if(url.hostname==='oauth2.googleapis.com')return new Response(JSON.stringify({access_token:'synthetic-local-token',expires_in:3600}),{status:200,headers:{'Content-Type':'application/json'}});
   assert.equal(url.hostname,'firestore.googleapis.com','only synthetic mocked provider requests');requests.push(url);
   return new Response(JSON.stringify({documents:[{name:'projects/synthetic/databases/(default)/documents/council_manifestations/CMS-2026-000001',fields:{protocol:{stringValue:'CMS-2026-000001'},privacyMode:{stringValue:'anonima'},authorUsername:{stringValue:'raw.synthetic.owner'},subject:{stringValue:'Manifestação inteiramente fictícia.'}}}],nextPageToken:'opaque-next+/='}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  const call=query=>handleCouncilRoute(new Request('https://synthetic.test/api/council/all'+query,{headers:{Authorization:`Bearer ${token}`}}),env,'',true);
  const first=await call('');assert.equal(first.status,200);const data=await first.json();assert.equal(data.nextPageToken,'opaque-next+/=');assert(!('authorUsername' in data.manifestations[0]));assert.equal(requests[0].searchParams.get('pageSize'),'100');assert.equal(requests[0].searchParams.get('pageToken'),null);
  const next=await call('?'+new URLSearchParams({pageToken:data.nextPageToken}));assert.equal(next.status,200);assert.equal(requests[1].searchParams.get('pageToken'),'opaque-next+/=');assert(requests.every(url=>url.pathname.endsWith('/documents/council_manifestations')));
  const before=requests.length;assert.equal((await call('?'+new URLSearchParams({pageToken:'x'.repeat(4097)}))).status,400);assert.equal(requests.length,before);
  await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='' WHERE username=?").bind('synthetic.council.cursor').run();assert.equal((await call('?pageToken=opaque')).status,403);assert.equal(requests.length,before);
 }finally{globalThis.fetch=originalFetch;env.AUTH_DB.database.close();}
});
