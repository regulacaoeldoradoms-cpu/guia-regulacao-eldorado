// Real SQLite and the production group handler; synthetic identities only.
import { DatabaseSync } from 'node:sqlite';
import { ensureAuthSchema, handlePortalRoute } from '../../auth-management-v2.js';
import { ensureSocialSchema, syncSocialUser } from '../../social-schema.js';
import { handleGroupRoute, ensureGroupSchema } from '../../chat-groups.js';
import { handleChatRoute } from '../../portal-chat-v2.js';

class Statement {
  constructor(owner,sql,values=[]){Object.assign(this,{owner,sql,values});}
  bind(...values){return new Statement(this.owner,this.sql,values);}
  execute(kind){
    this.owner.beforeQuery?.(this.sql,this.values);
    try {
      const stmt=this.owner.database.prepare(this.sql);
      if(kind==='all')return {results:stmt.all(...this.values)};
      if(kind==='first')return stmt.get(...this.values)||null;
      const result=stmt.run(...this.values);return {success:true,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)}};
    } catch(error){this.owner.errors.push(error.message);throw error;}
  }
  async all(){return this.execute('all');}
  async first(){return this.execute('first');}
  async run(){return this.execute('run');}
}
export class GroupTestD1 {
  constructor(database=new DatabaseSync(':memory:')){this.database=database;this.errors=[];this.beforeQuery=null;}
  prepare(sql){return new Statement(this,sql);}
  async batch(statements){this.database.exec('BEGIN IMMEDIATE');try{const results=statements.map(s=>s.execute('run'));this.database.exec('COMMIT');return results;}catch(error){this.database.exec('ROLLBACK');throw error;}}
}
export async function groupFixture({enabled=true}={}){
  const env={AUTH_DB:new GroupTestD1(),AUTH_SESSION_SECRET:'synthetic-session-key-for-isolated-tests',AUTH_RATE_LIMIT_SECRET:'synthetic-rate-key',SOCIAL_BACKEND_ENABLED:'true',CHAT_GROUPS_ENABLED:String(enabled)};
  await ensureAuthSchema(env);await ensureSocialSchema(env);
  const users={};const events=[];
  for(const [name,role] of [['alpha','cidadao'],['beta','medico'],['gamma','recepcao'],['delta','admin'],['outsider','cidadao']]){
    await env.AUTH_DB.prepare(`INSERT INTO auth_users(username,name,job_title,role,password_hash,password_salt,active,must_change_password,session_version,created_by,self_registered)
      VALUES (?,?,?,?,'synthetic-hash','synthetic-salt',1,0,1,'test',1)`).bind(name,'Perfil Fictício '+name,role,role).run();
    await syncSocialUser(env,name);users[name]={username:name,name:'Perfil Fictício '+name,role,sessionVersion:1,active:true};
  }
  async function friend(a,b,state='friends'){
    const ids=await env.AUTH_DB.prepare('SELECT social_user_id FROM social_users WHERE auth_username IN (?,?) ORDER BY social_user_id').bind(a,b).all();
    await env.AUTH_DB.prepare(`INSERT INTO social_relationships(pair_low,pair_high,state) VALUES (?,?,?) ON CONFLICT(pair_low,pair_high) DO UPDATE SET state=excluded.state`).bind(...ids.results.map(r=>r.social_user_id),state).run();
  }
  await friend('alpha','beta');await friend('alpha','gamma');await friend('beta','delta');
  env.CHAT_REALTIME={getByName(username){return {async fetch(url,options){if(url.endsWith('/event')){const event=JSON.parse(options.body);events.push({username,event});fixture.onEvent?.(username,event);return Response.json({ok:true,sent:1});}return new Response(null,{status:204});}};}};
  async function call(username,path='',body,overrides={}){
    const method=body===undefined?'GET':'POST';
    return handleGroupRoute(new Request('https://portal.test/api/chat/groups'+path,{method,...(body===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}),env,{...users[username],...overrides},'https://portal.test');
  }
  async function json(username,path='',body,overrides){const response=await call(username,path,body,overrides);return {status:response.status,...await response.json()};}
  async function create(invited=['beta','gamma'],extra={}){const result=await json('alpha','',{name:'Grupo sintético',description:'Somente testes',members:invited,clientId:'group-'+crypto.randomUUID(),...extra});if(!result.group)throw Error(JSON.stringify({result,sqlErrors:env.AUTH_DB.errors}));return result.group.id;}
  async function addFriends(count){
    const names=[];
    for(let index=0;index<count;index++){
      const username='page.friend.'+String(index).padStart(3,'0');names.push(username);
      await env.AUTH_DB.prepare(`INSERT INTO auth_users(username,name,job_title,role,password_hash,password_salt,active,must_change_password,session_version,created_by,self_registered)
        VALUES (?,?,'Teste','cidadao','synthetic-hash','synthetic-salt',1,0,1,'test',1)`).bind(username,'ZZ Pessoa Fictícia '+String(index).padStart(3,'0')).run();
      await syncSocialUser(env,username);await friend('alpha',username);
    }
    return names;
  }
  const fixture={env,users,events,friend,call,json,create,addFriends,onEvent:null,close:()=>env.AUTH_DB.database.close()};
  await ensureGroupSchema(env);env.AUTH_DB.errors=[];
  return fixture;
}
export {handleChatRoute,handlePortalRoute};
