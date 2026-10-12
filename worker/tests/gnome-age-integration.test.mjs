import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fixture} from '../../testing/pets/fixture.mjs';
import {createPetRouter} from '../pets.js';
import {declarePrivatePetAge,readPrivatePetAge} from '../private-pet-age-store.js';
import {persistPetCommand} from '../pet-store.js';
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {ensureAuthSchema,handlePortalRoute} from '../auth-management-v2.js';
import {sanitizeCitizenRegistrationRequest} from '../portal-safety.js';
const migration=fs.readFileSync(new URL('../migrations/pets-private-age.sql',import.meta.url),'utf8');
const setup=()=>{const f=fixture();f.sql.exec(migration);return f;};
const adoption=()=>({operationId:crypto.randomUUID(),typeId:'gnome',variant:'garden',expectedPetRevision:0});

test('missing migration and unknown age never expose the gnome or adult speech',async()=>{
 const f=fixture(),route=createPetRouter({validateSession:async()=>f.user}),env={AUTH_DB:f.db,PETS_ENABLED:'true'};
 try{
  const catalog=await (await route(new Request('https://synthetic.test/api/pets/catalog'),env)).json();
  assert.deepEqual(catalog.types.map(t=>t.id),['cat']);
  const response=await route(new Request('https://synthetic.test/api/pets/gnome-speech'),env);
  assert.equal(response.status,403);assert(!JSON.stringify(await response.json()).includes('perereca'));
  await assert.rejects(persistPetCommand(f.db,f.user,'adopt',adoption()),{code:'ADULT_AGE_REQUIRED'});
 }finally{f.close();}
});
test('minor cannot unlock adoption, speech or forge a second declaration',async()=>{
 const f=setup();try{
  const result=await declarePrivatePetAge(f.db,f.user,'2015-01-01');assert.equal(result.ageStatus,'underage');assert.deepEqual(Object.keys(result),['ageStatus']);
  await assert.rejects(persistPetCommand(f.db,f.user,'adopt',adoption()),{code:'ADULT_AGE_REQUIRED'});
  await assert.rejects(declarePrivatePetAge(f.db,f.user,'1990-01-01'),{code:'BIRTH_DATE_LOCKED'});
  assert.equal(await readPrivatePetAge(f.db,f.user.username),'underage');
  const route=createPetRouter({validateSession:async()=>f.user}),env={AUTH_DB:f.db,PETS_ENABLED:'true'};
  const bad=await route(new Request('https://synthetic.test/api/pets/age',{method:'POST',body:JSON.stringify({birthDate:'1990-01-01',adultEligible:true})}),env);assert.equal(bad.status,400);
  const catalog=await (await route(new Request('https://synthetic.test/api/pets/catalog'),env)).json();assert.deepEqual(catalog.types.map(t=>t.id),['cat']);
 }finally{f.close();}
});
test('adult gate requires current owner, adoption and fresh session; replay preserves one active pet',async()=>{
 const f=setup();try{
  await declarePrivatePetAge(f.db,f.user,'1990-01-01');
  const route=createPetRouter({validateSession:async()=>f.user}),env={AUTH_DB:f.db,PETS_ENABLED:'true'};
  const speech=()=>route(new Request('https://synthetic.test/api/pets/gnome-speech'),env);
  assert.equal((await speech()).status,403);
  const input=adoption();const adopted=await persistPetCommand(f.db,f.user,'adopt',input),replay=await persistPetCommand(f.db,f.user,'adopt',input);assert.equal(adopted.state.pet.typeId,'gnome');assert.deepEqual(adopted.receipt,replay.receipt);
  const data=await (await speech()).json();assert.equal(data.phrases.length,54);assert(!JSON.stringify(data).includes('1990-01-01'));
  await assert.rejects(persistPetCommand(f.db,{username:'demo-b',sessionVersion:1},'adopt',adoption()),{code:'ADULT_AGE_REQUIRED'});
  const second=await persistPetCommand(f.db,f.user,'adopt',{...adoption(),expectedPetRevision:1});assert.equal(second.receipt.code,'PET_ALREADY_ADOPTED');
  f.sql.exec("UPDATE auth_users SET session_version=2 WHERE username='demo-a'");
  await assert.rejects(declarePrivatePetAge(f.db,f.user,'1990-01-01'),{code:'SESSION_REQUIRED'});
 }finally{f.close();}
});
test('simultaneous declarations cannot replace a stored minor date',async()=>{
 const f=setup();try{
  await declarePrivatePetAge(f.db,f.user,'2015-01-01');
  const results=await Promise.allSettled([declarePrivatePetAge(f.db,f.user,'2015-01-01'),declarePrivatePetAge(f.db,f.user,'1990-01-01')]);
  assert.equal(results[0].status,'fulfilled');assert.equal(results[1].reason.code,'BIRTH_DATE_LOCKED');
 }finally{f.close();}
});
test('registration stores birth date atomically and omits it from public user and session',async()=>{
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-session-key-private-age',AUTH_RATE_LIMIT_SECRET:'synthetic-rate-key'};
 try{
  await ensureAuthSchema(env);env.AUTH_DB.database.exec(migration);
  const request=new Request('https://synthetic.test/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.99'},body:JSON.stringify({username:'synthetic.birth',password:'Synthetic-Registration-2026',birthDate:'1990-01-01',role:'admin',adultEligible:true})});
  const sanitized=await sanitizeCitizenRegistrationRequest(request);
  assert.deepEqual(Object.keys(await sanitized.clone().json()).sort(),['birthDate','password','username']);
  const response=await handlePortalRoute(sanitized,env,'',true);assert.equal(response.status,201);const data=await response.json();assert.equal(data.user.role,'cidadao');assert(!JSON.stringify(data).includes('1990-01-01'));assert(!('birthDate' in data.user));
  assert.equal(await readPrivatePetAge(env.AUTH_DB,'synthetic.birth'),'adult');
 }finally{env.AUTH_DB.database.close();}
});
test('an unapplied private migration rolls registration back instead of creating a partial account',async()=>{
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-session-key-private-age',AUTH_RATE_LIMIT_SECRET:'synthetic-rate-key'};
 try{
  await ensureAuthSchema(env);
  const request=new Request('https://synthetic.test/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.98'},body:JSON.stringify({username:'synthetic.rollback',password:'Synthetic-Registration-2026',birthDate:'1990-01-01'})});
  await assert.rejects(handlePortalRoute(request,env,'',true));
  assert.equal(env.AUTH_DB.database.prepare('SELECT count(*) AS n FROM auth_users WHERE username=?').get('synthetic.rollback').n,0);
 }finally{env.AUTH_DB.database.close();}
});
