import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {GroupTestD1} from './helpers/chat-group-fixture.mjs';
import {ensureAuthSchema,handlePortalRoute} from '../auth-management-v2.js';
import {privateRegistrationStatement} from '../account-private-registration.js';
import {canDeclarePrivatePetAge} from '../private-pet-age-store.js';
const sql=file=>fs.readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8');
const request=path=>new Request('https://synthetic.test'+path);
async function fixture(t){const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-rollout-secret'};await ensureAuthSchema(env);env.AUTH_DB.database.exec(sql('pets-private-age.sql'));t.after(()=>env.AUTH_DB.database.close());return env;}
const insertOld=(env,username)=>env.AUTH_DB.prepare("INSERT INTO auth_users(username,name,role,password_hash,password_salt,self_registered) VALUES(?,?,'cidadao','synthetic-hash','synthetic-salt',1)").bind(username,username).run();
test('a registration accepted by the previous Worker during rollout retains legacy completion',async t=>{
 const env=await fixture(t);env.AUTH_DB.database.exec(sql('account-private-registration.sql'));await insertOld(env,'synthetic.old-worker-inflight');
 assert.equal(await canDeclarePrivatePetAge(env.AUTH_DB,'synthetic.old-worker-inflight'),true);
});
test('new application creation overrides only its provisional row and remains non-legacy after migration replay',async t=>{
 const env=await fixture(t);env.AUTH_DB.database.exec(sql('account-private-registration.sql'));await insertOld(env,'synthetic.v2-new');await privateRegistrationStatement(env.AUTH_DB,'synthetic.v2-new',null).run();
 const row=env.AUTH_DB.database.prepare('SELECT gender,legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?').get('synthetic.v2-new');assert.deepEqual({...row},{gender:null,legacy_birth_date_allowed:0});
 env.AUTH_DB.database.exec(sql('account-private-registration.sql'));assert.equal(await canDeclarePrivatePetAge(env.AUTH_DB,'synthetic.v2-new'),false);
});
test('public capabilities fail closed until the complete additive schema is ready',async t=>{
 const env=await fixture(t);assert.equal((await handlePortalRoute(request('/api/auth/registration-capabilities'),env,'')).status,503);
 env.AUTH_DB.database.exec(sql('account-private-registration.sql'));const response=await handlePortalRoute(request('/api/auth/registration-capabilities'),env,'');assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.deepEqual(await response.json(),{version:3,birthDateRequired:true,genderRequired:false});
});

test('old-worker registrations during schema preparation are covered before the cutover marker',async t=>{
 const env=await fixture(t),migration=sql('account-private-registration.sql'),snapshot=migration.indexOf('INSERT INTO account_private_registration(auth_username,legacy_birth_date_allowed)\nSELECT');
 assert(snapshot>0);env.AUTH_DB.database.exec(migration.slice(0,snapshot));await insertOld(env,'synthetic.during-schema');env.AUTH_DB.database.exec(migration.slice(snapshot));
 assert.equal(await canDeclarePrivatePetAge(env.AUTH_DB,'synthetic.during-schema'),true);
});

test('capabilities do not announce the optional five-choice contract over the old enum schema',async t=>{
 const env=await fixture(t);env.AUTH_DB.database.exec(sql('account-private-registration.sql'));
 env.AUTH_DB.database.exec("DROP TABLE account_private_registration; CREATE TABLE account_private_registration(auth_username TEXT PRIMARY KEY,gender TEXT CHECK(gender IN ('masculino','feminino')),legacy_birth_date_allowed INTEGER DEFAULT 0)");
 assert.equal((await handlePortalRoute(request('/api/auth/registration-capabilities'),env,'')).status,503);
});
