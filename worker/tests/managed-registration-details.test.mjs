// Real creation, login, password/session and self-completion routes. Synthetic SQL only.
import test from 'node:test';import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const hook=registerHooks({resolve(specifier,context,next){if(specifier==='cloudflare:workers')return {url:'data:text/javascript,export class DurableObject {}',shortCircuit:true};return next(specifier,context);}});
const {default:worker}=await import('../index.js');hook.deregister();
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {prepareRegistrationFixture,syntheticRegistrationDetails} from './helpers/private-registration-fixture.mjs';
import {completePrivateRegistration} from '../account-private-registration.js';
import {handlePortalRoute} from '../auth-management-v2.js';

const password='Synthetic-Initial-Password-2026',changed='Synthetic-Changed-Password-2026';let ip=1;
export const request=(path,{body,token,method=body===undefined?'GET':'POST',origin}={})=>new Request('https://synthetic.test'+path,{method,headers:{'Content-Type':'application/json','CF-Connecting-IP':`127.1.0.${ip++}`,...(token?{Authorization:`Bearer ${token}`} : {}),...(origin?{Origin:origin}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
async function fixture(t){const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-managed-secret',AUTH_RATE_LIMIT_SECRET:'synthetic-managed-rate',PETS_ENABLED:'true'};await prepareRegistrationFixture(env);t.after(()=>env.AUTH_DB.database.close());return env;}
const call=(env,path,options={})=>worker.fetch(request(path,options),env,{});
const detailsPath='/api/auth/registration-details';
async function administrator(env){const r=await call(env,'/api/auth/register',{body:{...syntheticRegistrationDetails,username:'synthetic.manager',password}});assert.equal(r.status,201);env.AUTH_DB.database.exec("UPDATE auth_users SET role='admin' WHERE username='synthetic.manager'");const login=await call(env,'/api/auth/login',{body:{username:'synthetic.manager',password}});assert.equal(login.status,200);return (await login.json()).token;}
async function createManaged(env,token,extra={}){const response=await call(env,'/api/admin/users',{token,body:{username:'synthetic.managed',name:'Pessoa Fictícia',jobTitle:'Teste',role:'medico',password,...extra}});assert.equal(response.status,201);return response.json();}
async function login(env,username='synthetic.managed',pass=password){const response=await call(env,'/api/auth/login',{body:{username,password:pass}});assert.equal(response.status,200);return response.json();}
const params=(token,body,method='PATCH')=>({token,body,method});

test('administrator creates no third-party declaration; the owner completes after first-access password change',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,admin=await administrator(env);
 const created=await createManaged(env,admin,{birthDate:'1990-01-01',gender:'mulher',legacy_birth_date_allowed:1});
 assert.equal(created.user.mustChangePassword,true);assert(!/birthDate|gender|1990-01-01|mulher/.test(JSON.stringify(created)));
 assert.deepEqual({...db.prepare('SELECT gender,legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?').get('synthetic.managed')},{gender:null,legacy_birth_date_allowed:0});
 assert.equal(db.prepare('SELECT * FROM pet_private_age WHERE auth_username=?').get('synthetic.managed'),undefined);
 const initial=await login(env);assert.equal((await call(env,detailsPath,{token:initial.token})).status,403);
 assert.equal((await call(env,detailsPath,params(initial.token,{birthDate:'1990-01-01',gender:'mulher'}))).status,403);
 const change=await call(env,'/api/auth/change-password',{token:initial.token,body:{currentPassword:password,newPassword:changed}});assert.equal(change.status,200);const {token}=await change.json();
 assert.equal((await call(env,detailsPath,{token:initial.token})).status,401);
 assert.deepEqual(await(await call(env,detailsPath,{token})).json(),{birthDateRecorded:false,genderRecorded:false,gender:null,canCompleteBirthDate:true});
 assert.deepEqual(await(await call(env,'/api/pets/age',{token})).json(),{ageStatus:'unknown',canDeclareBirthDate:false});
 assert.equal((await call(env,'/api/pets/age',{token,body:{birthDate:'1990-01-01'}})).status,403);
 const saved=await call(env,detailsPath,params(token,{birthDate:'2015-01-01',gender:'homem'}));assert.equal(saved.status,200);assert.deepEqual(await saved.json(),{birthDateRecorded:true,genderRecorded:true,gender:'homem',canCompleteBirthDate:false});
 assert.equal(db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get('synthetic.managed').birth_date,'2015-01-01');
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'homem'}))).status,409);
 assert.equal((await call(env,'/api/pets/gnome-speech',{token})).status,403);
 assert.equal(db.prepare('SELECT role,session_version FROM auth_users WHERE username=?').get('synthetic.managed').role,'medico');
});

test('completion checks origin, current session, payload, dates, explicit gender and owner; no admin target parameter',async t=>{
 const env=await fixture(t),admin=await administrator(env);await createManaged(env,admin,{mustChangePassword:false});const {token}=await login(env);
 assert.equal((await call(env,detailsPath)).status,401);
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'mulher'},'POST'))).status,405);
 assert.equal((await call(env,detailsPath,{token,origin:'https://evil.invalid'})).status,403);
 for(const body of [null,[],{}, {gender:false}, {gender:[]},{birthDate:'1900-02-29',gender:'mulher'},{birthDate:'2100-01-01',gender:'mulher'},{birthDate:'1990-01-01',gender:'outro'},{birthDate:'1990-01-01',gender:'mulher',username:'synthetic.manager'},{birthDate:'1990-01-01',gender:'mulher',adultEligible:true}])assert.equal((await call(env,detailsPath,params(token,body))).status,400,JSON.stringify(body));
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'mulher'}))).status,200);
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'mulher'}))).status,200);
 const snapshot=env.AUTH_DB.database.prepare('SELECT * FROM account_private_registration WHERE auth_username=?').get('synthetic.managed');
 assert.equal(snapshot.legacy_birth_date_allowed,0);
 env.AUTH_DB.database.exec("UPDATE auth_users SET session_version=session_version+1 WHERE username='synthetic.managed'");
 assert.equal((await call(env,detailsPath,params(token,{gender:'homem'}))).status,401);
});

test('legacy adoption remains usable and private completion fills only the missing gender',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,admin=await administrator(env);await createManaged(env,admin,{mustChangePassword:false});
 // A pre-cutover account is represented by the server-owned legacy snapshot.
 db.prepare('UPDATE account_private_registration SET legacy_birth_date_allowed=1 WHERE auth_username=?').run('synthetic.managed');
 const {token}=await login(env);assert.equal((await call(env,'/api/pets/age',{token,body:{birthDate:'1990-01-01'}})).status,200);
 assert.deepEqual(await(await call(env,detailsPath,{token})).json(),{birthDateRecorded:true,genderRecorded:false,gender:null,canCompleteBirthDate:false});
 assert.equal((await call(env,detailsPath,params(token,{gender:'mulher'}))).status,200);
 assert.equal(db.prepare('SELECT legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?').get('synthetic.managed').legacy_birth_date_allowed,1);
 assert.equal(db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get('synthetic.managed').birth_date,'1990-01-01');
 assert.equal((await call(env,'/api/pets/age',{token,body:{birthDate:'2015-01-01'}})).status,409);
});

test('competing self completions cannot mix date and gender, and a failed batch saves neither',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,admin=await administrator(env);await createManaged(env,admin,{mustChangePassword:false});
 const owner={username:'synthetic.managed',sessionVersion:1};
 db.exec(`CREATE TRIGGER synthetic_fail_gender BEFORE UPDATE OF gender ON account_private_registration BEGIN SELECT RAISE(ABORT,'Synthetic failure'); END;`);
 await assert.rejects(completePrivateRegistration(env.AUTH_DB,owner,{birthDate:'2015-01-01',gender:'mulher'}));
 assert.equal(db.prepare('SELECT * FROM pet_private_age WHERE auth_username=?').get(owner.username),undefined);assert.equal(db.prepare('SELECT gender FROM account_private_registration WHERE auth_username=?').get(owner.username).gender,null);
 db.exec('DROP TRIGGER synthetic_fail_gender');
 const results=await Promise.allSettled([completePrivateRegistration(env.AUTH_DB,owner,{birthDate:'2015-01-01',gender:'mulher'}),completePrivateRegistration(env.AUTH_DB,owner,{birthDate:'1990-01-01',gender:'homem'})]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.status,409);
 const birth=db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get(owner.username).birth_date,gender=db.prepare('SELECT gender FROM account_private_registration WHERE auth_username=?').get(owner.username).gender;
 assert(['2015-01-01|mulher','1990-01-01|homem'].includes(birth+'|'+gender));
});

test('professional email gate remains in force and missing migration returns no SQL/private data',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,admin=await administrator(env);await createManaged(env,admin,{mustChangePassword:false});const {token}=await login(env);
 env.AUTH_REQUIRE_EMAIL_VERIFICATION='true';
 assert.equal((await call(env,detailsPath,{token})).status,403);assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'mulher'}))).status,403);
 db.exec("UPDATE auth_users SET email_verified=1 WHERE username='synthetic.managed'");assert.equal((await call(env,detailsPath,{token})).status,200);
 db.exec('DROP TABLE account_private_registration');const response=await call(env,detailsPath,{token});assert.equal(response.status,503);assert.deepEqual(await response.json(),{code:'REGISTRATION_DETAILS_UNAVAILABLE',error:'Dados privados temporariamente indisponíveis.'});
});

test('bootstrap-created accounts also defer personal declarations to the authenticated owner',async t=>{
 const env=await fixture(t);env.AUTH_USERS_JSON=JSON.stringify([{username:'synthetic.bootstrap',name:'Pessoa Fictícia',role:'recepcao',password,birthDate:'1990-01-01',gender:'homem'}]);
 const response=await handlePortalRoute(request('/api/auth/login',{body:{username:'synthetic.bootstrap',password}}),env,'');assert.equal(response.status,200);const {token}=await response.json();
 assert.deepEqual(await(await call(env,detailsPath,{token})).json(),{birthDateRecorded:false,genderRecorded:false,gender:null,canCompleteBirthDate:true});
 assert.equal(env.AUTH_DB.database.prepare('SELECT legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?').get('synthetic.bootstrap').legacy_birth_date_allowed,0);
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'mulher'}))).status,200);
});


test('owner can edit or clear optional gender before or after birth completion without changing birth, role or another account',async t=>{
 const env=await fixture(t),db=env.AUTH_DB.database,admin=await administrator(env);await createManaged(env,admin,{mustChangePassword:false});const {token}=await login(env);
 const saved=await call(env,detailsPath,params(token,{gender:'pessoa_nao_binaria'}));assert.equal(saved.status,200);assert.deepEqual(await saved.json(),{birthDateRecorded:false,genderRecorded:true,gender:'pessoa_nao_binaria',canCompleteBirthDate:true});
 const birthOnly=await call(env,detailsPath,params(token,{birthDate:'2015-01-01'}));assert.equal(birthOnly.status,200);assert.equal((await birthOnly.json()).gender,'pessoa_nao_binaria');
 for(const gender of ['mulher','homem','pessoa_nao_binaria','outra_identidade','prefiro_nao_informar',null]){
  const response=await call(env,detailsPath,params(token,{gender}));assert.equal(response.status,200);const data=await response.json();assert.equal(data.gender,gender);assert.equal(data.birthDateRecorded,true);assert(!JSON.stringify(data).includes('2015-01-01'));
  assert.equal((await call(env,'/api/pets/gnome-speech',{token})).status,403);
 }
 assert.equal(db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').get('synthetic.managed').birth_date,'2015-01-01');
 assert.equal(db.prepare('SELECT role FROM auth_users WHERE username=?').get('synthetic.managed').role,'medico');
 assert.equal(db.prepare('SELECT gender FROM account_private_registration WHERE auth_username=?').get('synthetic.manager').gender,'mulher');
 assert.equal((await call(env,detailsPath,params(token,{birthDate:'1990-01-01',gender:'homem'}))).status,409);
 assert.equal(db.prepare('SELECT gender FROM account_private_registration WHERE auth_username=?').get('synthetic.managed').gender,null,'failed birthday change cannot partially edit gender');
});
