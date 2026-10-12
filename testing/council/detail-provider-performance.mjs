import {generateKeyPairSync} from 'node:crypto';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {GroupTestD1} from '../../worker/tests/helpers/chat-group-fixture.mjs';import {ensureAuthSchema,handlePortalRoute} from '../../worker/auth-management-v2.js';
import {handleCouncilRoute as after} from '../../worker/council-access-policy.js';
import path from 'node:path';import {pathToFileURL} from 'node:url';
const baselineRoot=process.env.COUNCIL_DETAIL_BASELINE_ROOT;if(!baselineRoot)throw new Error('Defina COUNCIL_DETAIL_BASELINE_ROOT com um checkout da versão anterior.');
const {handleCouncilRoute:before}=await import(pathToFileURL(path.resolve(baselineRoot,'worker/council-access-policy.js')));
const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048}),env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-provider-perf',AUTH_RATE_LIMIT_SECRET:'synthetic-provider-rate',FIREBASE_PROJECT_ID:'synthetic-provider-performance',FIREBASE_CLIENT_EMAIL:'synthetic@fixture.invalid',FIREBASE_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'})};
await ensureAuthSchema(env);const reg=await handlePortalRoute(new Request('https://synthetic.test/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.98'},body:JSON.stringify({username:'synthetic.provider',password:'Synthetic-Registration-2026'})}),env,'',true);const {token}=await reg.json();await env.AUTH_DB.prepare("UPDATE auth_users SET council_role='presidente' WHERE username=?").bind('synthetic.provider').run();
const originalFetch=globalThis.fetch,samples=[];let activeChildren=0,maxChildren=0;
const doc={protocol:{stringValue:'CMS-2026-000001'},subject:{stringValue:'Teste exclusivamente sintético.'},privacyMode:{stringValue:'anonima'},createdAt:{stringValue:'2026-10-12T12:00:00Z'},updatedAt:{stringValue:'2026-10-12T12:00:00Z'}};
try{
 globalThis.fetch=async input=>{const url=new URL(String(input));if(url.hostname==='oauth2.googleapis.com')return Response.json({access_token:'synthetic-only-token',expires_in:3600});assert.equal(url.hostname,'firestore.googleapis.com');const child=!url.pathname.endsWith('CMS-2026-000001');if(child)maxChildren=Math.max(maxChildren,++activeChildren);await new Promise(r=>setTimeout(r,20));if(child)activeChildren--;return Response.json(child?{documents:[]}:{name:url.pathname,fields:doc});};
 const call=(handler,tail='')=>handler(new Request('https://synthetic.test/api/council/manifestations/CMS-2026-000001'+tail,{headers:{Authorization:'Bearer '+token}}),env,'',true);
 for(let repeat=0;repeat<5;repeat++)for(const mode of ['baseline-cold','new-cold','new-prefetched']){
  const handler=mode==='baseline-cold'?before:after;let revision='';if(mode==='new-prefetched')revision=(await (await call(after,'/prefetch')).json()).detailRevision;
  maxChildren=0;const start=performance.now();const response=await call(handler,revision?'?'+new URLSearchParams({cacheRevision:revision}):'');assert.equal(response.status,200);const body=await response.text();samples.push({repeat,mode,elapsedMs:performance.now()-start,bytes:Buffer.byteLength(body),maxChildReads:maxChildren});
 }
 const summary=Object.fromEntries(['baseline-cold','new-cold','new-prefetched'].map(mode=>{const list=samples.filter(s=>s.mode===mode).sort((a,b)=>a.elapsedMs-b.elapsedMs);return[mode,{medianMs:list[2].elapsedMs,maxParallelChildReads:Math.max(...list.map(s=>s.maxChildReads)),bytes:list[2].bytes}];}));
 await fs.mkdir('.local/detail-provider-performance',{recursive:true});await fs.writeFile('.local/detail-provider-performance/results.json',JSON.stringify({conditions:{syntheticOnly:true,realWorkerHandlers:true,realLocalD1:true,mockedProviderDelayMs:20,networkTransferLatency:'not modeled'},samples,summary},null,2));console.log(JSON.stringify(summary));
}finally{globalThis.fetch=originalFetch;env.AUTH_DB.database.close();}
