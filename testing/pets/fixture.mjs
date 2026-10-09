import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function fixture({filename=':memory:',clock=()=>Math.floor(Date.now()/1000)}={}){
 const sql=new DatabaseSync(filename);
 sql.exec(`PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS auth_users(
 username TEXT PRIMARY KEY,active INTEGER DEFAULT 1,session_version INTEGER DEFAULT 1,must_change_password INTEGER DEFAULT 0);
 INSERT OR IGNORE INTO auth_users(username) VALUES('demo-a'),('demo-b');`);
 sql.exec(fs.readFileSync(new URL('../../worker/migrations/pets-v1.sql',import.meta.url),'utf8'));
 let failAt=-1;
 const prepare=(query,params=[])=>({
  query,params,bind(...next){return prepare(query,next);},
  async first(){if(query==='SELECT unixepoch() AS now')return {now:clock()};return sql.prepare(query).get(...params)||null;},
  async all(){return {results:sql.prepare(query).all(...params)};},
  async run(){const r=sql.prepare(query).run(...params);return {success:true,meta:{changes:Number(r.changes)}};}
 });
 const db={prepare,async batch(statements){
  sql.exec('BEGIN IMMEDIATE');
  try{const r=statements.map((s,i)=>{if(i===failAt){failAt=-1;throw Error('Injected failure');}const result=sql.prepare(s.query).run(...s.params);return {success:true,meta:{changes:Number(result.changes)}};});sql.exec('COMMIT');return r;}
  catch(e){sql.exec('ROLLBACK');throw e;}
 }};
 return {sql,db,user:{username:'demo-a',sessionVersion:1},failNextBatch(index){failAt=index;},close(){sql.close();}};
}
