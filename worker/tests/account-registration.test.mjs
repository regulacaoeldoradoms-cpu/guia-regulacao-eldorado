// Production routing/SQL with synthetic identities, no network or production D1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
// Node lacks the Workers base class; no Durable Object is instantiated here.
const hook=registerHooks({resolve(specifier,context,next){
 if(specifier==='cloudflare:workers')return {url:'data:text/javascript,export class DurableObject {}',shortCircuit:true};
 return next(specifier,context);
}});
const {default:worker}=await import('../index.js');hook.deregister();
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {ensureAuthSchema,handlePortalRoute} from '../auth-management-v2.js';
import {prepareRegistrationFixture,syntheticRegistrationDetails} from './helpers/private-registration-fixture.mjs';
import {createPetRouter} from '../pets.js';
import {declarePrivatePetAge} from '../private-pet-age-store.js';
import {persistPetCommand,readPetAccount} from '../pet-store.js';
import {fixture as petFixture} from '../../testing/pets/fixture.mjs';

const password='Synthetic-Registration-2026';
let ip=10;
const request=(path,body,token,method=body===undefined?'GET':'POST')=>new Request('https://synthetic.test'+path,{
 method,headers:{'Content-Type':'application/json','CF-Connecting-IP':`127.0.1.${ip++}`,...(token?{Authorization:`Bearer ${token}`}:{})},
 ...(body===undefined?{}:{body:JSON.stringify(body)})
});
async function fixture(t){
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-registration-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-registration-rate',PETS_ENABLED:'true',SOCIAL_BACKEND_ENABLED:'true'};
 await prepareRegistrationFixture(env);t.after(()=>env.AUTH_DB.database.close());return env;
}
const migration=(db,file)=>db.exec(fs.readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
const storedUser=(db,name)=>db.prepare('SELECT * FROM auth_users WHERE username=?').get(name);

test('server requires a calendar date and explicit valid gender for every new self registration',async t=>{
 const env=await fixture(t);
 const cases=[
  {birthDate:undefined},{birthDate:null},{birthDate:''},{birthDate:'2000-2-01'},{birthDate:'2000-02-30'},
  {birthDate:'1900-02-29'},{birthDate:'1899-12-31'},{birthDate:'0000-01-01'},{birthDate:'2100-01-01'},
  {birthDate:'2000-01-01T00:00:00Z'},{birthDate:{}},{gender:undefined},{gender:null},{gender:''},
  {gender:'outro'},{gender:'Feminino'},{gender:[]},{gender:{}}
 ];
 for(const [index,extra] of cases.entries()){
  const username='synthetic.invalid.'+index;
  const response=await worker.fetch(request('/api/auth/register',{...syntheticRegistrationDetails,username,password,...extra}),env,{});
  assert.equal(response.status,400,JSON.stringify(extra));assert.equal(storedUser(env.AUTH_DB.database,username),undefined);
 }
 for(const body of [null,[],{}])assert.equal((await worker.fetch(request('/api/auth/register',body),env,{})).status,400);
});

test('signup/login/me preserve credentials and permissions, and omit private fields in public/social/chat responses and JWT',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,logs=[];
 const originalError=console.error,originalLog=console.log;
 console.error=(...args)=>logs.push(args.join(' '));console.log=(...args)=>logs.push(args.join(' '));
 try{
  for(const [index,gender]of ['masculino','feminino'].entries()){
   const username='synthetic.person.'+index;
   const signup=await worker.fetch(request('/api/auth/register',{username,password,birthDate:'1993-07-19',gender,role:'admin',adultEligible:true,legacy_birth_date_allowed:1}),env,{});
   assert.equal(signup.status,201);const payload=await signup.json();assert.equal(payload.user.role,'cidadao');assert.equal(payload.user.accountLevel,'bronze');
   const {token}=payload;
   const jwt=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());
   const privateRow=db.prepare('SELECT * FROM account_private_registration WHERE auth_username=?').get(username);
   assert.equal(privateRow.gender,gender);assert.equal(privateRow.legacy_birth_date_allowed,0);
   assert.equal(db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get(username).birth_date,'1993-07-19');
   const responses=[payload,jwt];
   for(const [path,body]of [['/api/auth/login',{username,password}],['/api/auth/me'],['/api/auth/security'],['/api/auth/profile'],['/api/social/me'],['/api/chat/users'],['/api/pets/age'],['/api/pets/catalog']]){
    const response=await worker.fetch(request(path,body,token),env,{});assert.equal(response.status,200,path);responses.push(await response.json());
   }
   const profile=responses.find(value=>value.profile)?.profile;
   if(profile?.handle){const response=await worker.fetch(request('/api/social/profiles/'+profile.handle,undefined,token),env,{});assert.equal(response.status,200);responses.push(await response.json());}
   for(const value of responses){const serialized=JSON.stringify(value);assert(!/1993-07-19|birth_date|birthDate|gender|masculino|feminino/.test(serialized),serialized);}
   const ownAge=responses.find(value=>value.ageStatus);assert.equal(ownAge.ageStatus,'adult');assert.equal(ownAge.canDeclareBirthDate,false);
   const cat=responses.find(value=>Array.isArray(value.types));assert(cat.types.some(type=>type.id==='gnome'));
   // Generic profile/security/admin payloads must not change the declaration.
   await worker.fetch(request('/api/auth/security',{birthDate:'2015-01-01',gender:'masculino'},token,'PATCH'),env,{});
   assert.equal(db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get(username).birth_date,'1993-07-19');
  }
  assert(!/1993-07-19|birthDate|gender|masculino|feminino/.test(JSON.stringify(logs)));
 }finally{console.error=originalError;console.log=originalLog;}
});

test('both private migrations are required; missing tables roll back account/date/gender atomically',async t=>{
 for(const missing of ['pet_private_age','account_private_registration']){
  const env=await fixture(t),db=env.AUTH_DB.database;db.exec('DROP TABLE '+missing);
  await assert.rejects(handlePortalRoute(request('/api/auth/register',{...syntheticRegistrationDetails,username:'synthetic.rollback',password}),env,''));
  assert.equal(storedUser(db,'synthetic.rollback'),undefined);
  if(missing!=='pet_private_age')assert.equal(db.prepare('SELECT count(*) AS n FROM pet_private_age').get().n,0);
 }
});

test('migration snapshots only existing missing-date accounts; client flags cannot create legacy eligibility',async t=>{
 const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-legacy-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-legacy-rate'};
 t.after(()=>env.AUTH_DB.database.close());await ensureAuthSchema(env);const db=env.AUTH_DB.database;
 for(const name of ['old.missing','old.saved'])await env.AUTH_DB.prepare(`INSERT INTO auth_users(username,name,role,password_hash,password_salt) VALUES(?,?,'cidadao','synthetic-hash','synthetic-salt')`).bind(name,name).run();
 migration(db,'pets-private-age.sql');db.prepare('INSERT INTO pet_private_age(auth_username,birth_date) VALUES(?,?)').run('old.saved','2015-01-01');
 migration(db,'account-private-registration.sql');
 assert.equal(db.prepare('SELECT legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?').get('old.missing').legacy_birth_date_allowed,1);
 assert.equal(db.prepare('SELECT * FROM account_private_registration WHERE auth_username=?').get('old.saved'),undefined);
 const router=createPetRouter({validateSession:async()=>({username:'old.missing',sessionVersion:1})}),petEnv={AUTH_DB:env.AUTH_DB,PETS_ENABLED:'true'};
 assert.deepEqual(await(await router(request('/api/pets/age'),petEnv)).json(),{ageStatus:'unknown',canDeclareBirthDate:true});
 assert.equal((await router(request('/api/pets/age',{birthDate:'1990-01-01',legacy:true}),petEnv)).status,400);
 assert.equal((await router(request('/api/pets/age',{birthDate:'2015-01-01'}),petEnv)).status,200);
 assert.deepEqual(await(await router(request('/api/pets/age'),petEnv)).json(),{ageStatus:'underage',canDeclareBirthDate:false});
 assert.equal((await router(request('/api/pets/age',{birthDate:'1990-01-01'}),petEnv)).status,409);
 // After the snapshot, even a later managed account without date is not legacy.
 db.prepare("INSERT INTO auth_users(username,name,role,password_hash,password_salt) VALUES('later.managed','Synthetic','cidadao','h','s')").run();
 migration(db,'account-private-registration.sql');
 assert.equal(db.prepare("SELECT * FROM account_private_registration WHERE auth_username='later.managed'").get(),undefined);
 await assert.rejects(declarePrivatePetAge(env.AUTH_DB,{username:'later.managed',sessionVersion:1},'1990-01-01'),{code:'BIRTH_DATE_REGISTRATION_REQUIRED'});
});

test('new minor cannot redeclare via pet API even if the stored date disappears; server does not trust the UI',async t=>{
 const env=await fixture(t);const signup=await handlePortalRoute(request('/api/auth/register',{...syntheticRegistrationDetails,birthDate:'2015-01-01',username:'synthetic.minor',password}),env,'');assert.equal(signup.status,201);
 const {token}=await signup.json();
 const post=body=>worker.fetch(request('/api/pets/age',body,token),env,{});
 assert.equal((await post({birthDate:'1990-01-01'})).status,403);
 assert.equal((await worker.fetch(request('/api/pets/gnome-speech',undefined,token),env,{})).status,403);
 env.AUTH_DB.database.exec("DELETE FROM pet_private_age WHERE auth_username='synthetic.minor'");
 assert.equal((await post({birthDate:'1990-01-01'})).status,403);
 const age=await(await worker.fetch(request('/api/pets/age',undefined,token),env,{})).json();assert.deepEqual(age,{ageStatus:'unknown',canDeclareBirthDate:false});
 const catalog=await(await worker.fetch(request('/api/pets/catalog',undefined,token),env,{})).json();assert(!catalog.types.some(type=>type.id==='gnome'));
});

test('existing gnome and cat survive missing eligibility, remain blocked, and resume after authorized correction',async t=>{
 const f=petFixture();t.after(()=>f.close());migration(f.sql,'pets-private-age.sql');migration(f.sql,'account-private-registration.sql');
 await declarePrivatePetAge(f.db,f.user,'1990-01-01');
 const adopt=typeId=>({operationId:crypto.randomUUID(),typeId,variant:typeId==='gnome'?'garden':'gray',expectedPetRevision:0});
 // A primary gnome must also fail closed; its stored state is never rewritten.
 await persistPetCommand(f.db,f.user,'adopt',adopt('gnome'));
 const before=f.sql.prepare('SELECT * FROM pet_accounts WHERE auth_username=?').get(f.user.username);
 f.sql.prepare('UPDATE pet_private_age SET birth_date=? WHERE auth_username=?').run('2015-01-01',f.user.username);
 const route=createPetRouter({validateSession:async()=>f.user}),env={AUTH_DB:f.db,PETS_ENABLED:'true'};
 assert.equal((await route(request('/api/pets/me'),env)).status,403);
 await assert.rejects(persistPetCommand(f.db,f.user,'care',{operationId:crypto.randomUUID(),action:'food',expectedPetRevision:1}),{code:'ADULT_AGE_REQUIRED'});
 assert.deepEqual(f.sql.prepare('SELECT * FROM pet_accounts WHERE auth_username=?').get(f.user.username),before);
 // Simulated authorized storage correction: no self-service endpoint added.
 f.sql.prepare('UPDATE pet_private_age SET birth_date=? WHERE auth_username=?').run('1990-01-01',f.user.username);
 assert.equal((await route(request('/api/pets/me'),env)).status,200);assert.equal((await readPetAccount(f.db,f.user.username)).pet.typeId,'gnome');
});

test('pet declaration keeps origin, session and first-access gates and never exposes private data',async t=>{
 const env=await fixture(t);
 const unauth=createPetRouter({validateSession:async()=>null});assert.equal((await unauth(request('/api/pets/age',{birthDate:'1990-01-01'}),env)).status,401);
 const first=createPetRouter({validateSession:async()=>({username:'synthetic',mustChangePassword:true})});assert.equal((await first(request('/api/pets/age',{birthDate:'1990-01-01'}),env)).status,403);
 assert.equal((await first(request('/api/pets/age'),env,'https://evil.invalid',false)).status,403);
});

test('actual pet routes release exactly at the eighteenth birthday in Eldorado, including Feb 29',async t=>{
 t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-15T03:59:59Z')});
 const f=petFixture();t.after(()=>f.close());migration(f.sql,'pets-private-age.sql');migration(f.sql,'account-private-registration.sql');
 await declarePrivatePetAge(f.db,f.user,'2008-10-15');
 const route=createPetRouter({validateSession:async()=>f.user}),env={AUTH_DB:f.db,PETS_ENABLED:'true'};
 const catalog=async()=> (await (await route(request('/api/pets/catalog'),env)).json()).types.map(type=>type.id);
 const adoption={operationId:crypto.randomUUID(),typeId:'gnome',variant:'garden',expectedPetRevision:0};
 assert.deepEqual(await catalog(),['cat']);assert.equal((await route(request('/api/pets/adopt',adoption),env)).status,403);
 t.mock.timers.setTime(new Date('2026-10-15T04:00:00Z').getTime());
 assert.deepEqual(await catalog(),['cat','gnome']);assert.equal((await route(request('/api/pets/adopt',adoption),env)).status,200);
 f.sql.prepare('UPDATE pet_private_age SET birth_date=? WHERE auth_username=?').run('2008-02-29',f.user.username);
 t.mock.timers.setTime(new Date('2026-03-01T03:59:59Z').getTime());assert.deepEqual(await catalog(),['cat']);
 t.mock.timers.setTime(new Date('2026-03-01T04:00:00Z').getTime());assert.deepEqual(await catalog(),['cat','gnome']);
});

test('registration accepts the minimum year, leap day and today, and rejects tomorrow in the Portal calendar',async t=>{
 t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-15T03:59:59Z')});
 const env=await fixture(t);
 for(const [index,birthDate]of ['1900-01-01','2000-02-29','2026-10-14'].entries()){
  const response=await worker.fetch(request('/api/auth/register',{...syntheticRegistrationDetails,username:'synthetic.calendar.'+index,password,birthDate}),env,{});
  assert.equal(response.status,201,birthDate);
 }
 const future=await worker.fetch(request('/api/auth/register',{...syntheticRegistrationDetails,username:'synthetic.tomorrow',password,birthDate:'2026-10-15'}),env,{});
 assert.equal(future.status,400);
});
