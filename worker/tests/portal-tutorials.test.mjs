import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createPortalTutorialRouter,CITIZEN_TUTORIAL_STEPS} from '../portal-tutorials.js';
function fixture(user={username:'synthetic.a',active:true,sessionVersion:1}){
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../migrations/portal-tutorials-v1.sql',import.meta.url),'utf8'));
 db.exec("CREATE TABLE auth_users (username TEXT PRIMARY KEY,active INTEGER,session_version INTEGER,must_change_password INTEGER);INSERT INTO auth_users VALUES ('synthetic.a',1,1,0),('synthetic.b',1,1,0);");
 let writes=0;
 const env={PORTAL_TUTORIAL_COMPLETION_ENABLED:'true',AUTH_DB:{prepare(sql){return {bind(...values){return {async run(){writes++;return db.prepare(sql).run(...values);},async first(){return db.prepare(sql).get(...values)||null;}};}};}}};
 const handle=createPortalTutorialRouter({validateSession:async()=>user});
 const request=(body={version:1,steps:[...CITIZEN_TUTORIAL_STEPS]},options={})=>new Request('https://example.invalid/api/portal-tutorials/citizen'+(options.method==='GET'?'':'/complete'),{method:options.method||'POST',headers:{'Content-Type':'application/json',Origin:'https://portal.example.invalid'},...(options.method!=='GET'?{body:JSON.stringify(body)}:{})});
 return {db,env,handle,request,get writes(){return writes;}};
}
test('complete ordered metadata awards once for the authenticated account; cross-account isolated',async()=>{
 const f=fixture();const first=await f.handle(f.request(),f.env,'https://portal.example.invalid',true);assert.equal(first.status,200);assert.equal((await first.json()).completion.version,1);
 await f.handle(f.request(),f.env,'https://portal.example.invalid',true);assert.equal(f.db.prepare('SELECT count(*) AS n FROM portal_tutorial_completions').get().n,1);
 const other=createPortalTutorialRouter({validateSession:async()=>({username:'synthetic.b',sessionVersion:1})});const response=await other(f.request(null,{method:'GET'}),f.env,'https://portal.example.invalid',true);assert.equal((await response.json()).completion,null);f.db.close();
});
for(const [name,body]of [
 ['skipped',{version:1,steps:[]}],['missing',{version:1,steps:CITIZEN_TUTORIAL_STEPS.slice(1)}],['duplicate',{version:1,steps:CITIZEN_TUTORIAL_STEPS.map(()=> 'open')}],['reordered',{version:1,steps:[...CITIZEN_TUTORIAL_STEPS].reverse()}],['unknown-version',{version:2,steps:[...CITIZEN_TUTORIAL_STEPS]}],['user-text',{version:1,steps:[...CITIZEN_TUTORIAL_STEPS],description:'synthetic only'}],['forged-account',{version:1,steps:[...CITIZEN_TUTORIAL_STEPS],username:'synthetic.b',sessionVersion:1}],['array',[]],['null',null]
])test(`${name} fails without any write`,async()=>{const f=fixture();const r=await f.handle(f.request(body),f.env,'https://portal.example.invalid',true);assert.equal(r.status,422);assert.equal(f.writes,0);f.db.close();});
test('origin, first-access and session barriers preserve authorization',async()=>{
 for(const [user,origin,allowed,status]of [[null,'https://portal.example.invalid',true,401],[{username:'synthetic.a',mustChangePassword:true},'https://portal.example.invalid',true,403],[{username:'synthetic.a'},'https://evil.invalid',false,403],[{username:'synthetic.a'},'',true,400]]){const f=fixture(user);assert.equal((await f.handle(f.request(),f.env,origin,allowed)).status,status);assert.equal(f.writes,0);f.db.close();}
});
test('bounded payload, missing explicit migration and read-only GET fail safely',async()=>{
 const f=fixture();assert.equal((await f.handle(f.request({version:1,steps:['x'.repeat(2000)]}),f.env,'https://portal.example.invalid',true)).status,413);assert.equal(f.writes,0);
 assert.equal((await f.handle(f.request(null,{method:'GET'}),f.env,'https://portal.example.invalid',true)).status,200);assert.equal(f.writes,0);f.db.exec('DROP TABLE portal_tutorial_completions');const r=await f.handle(f.request(),f.env,'https://portal.example.invalid',true);assert.equal(r.status,503);assert(!JSON.stringify(await r.json()).includes('SQLITE'));f.db.close();
});

test('real completion is disabled by default, including preview builds',async()=>{const f=fixture();delete f.env.PORTAL_TUTORIAL_COMPLETION_ENABLED;const response=await f.handle(f.request(),f.env,'https://portal.example.invalid',true);assert.equal(response.status,503);assert.equal(f.writes,0);f.db.close();});

test('revocation between validation and INSERT does not award',async()=>{for(const sql of ["UPDATE auth_users SET active=0","UPDATE auth_users SET session_version=2","UPDATE auth_users SET must_change_password=1"]){const f=fixture();f.db.exec(sql);const r=await f.handle(f.request(),f.env,'https://portal.example.invalid',true);assert.equal(r.status,401);assert.equal(f.db.prepare('SELECT count(*) AS n FROM portal_tutorial_completions').get().n,0);f.db.close();}});
