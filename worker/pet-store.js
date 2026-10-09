'use strict';
import {initialPetState,applyPetCommand,publicPetState,PetError} from './pet-domain.js';
const OPERATION=/^[a-z0-9-]{16,96}$/i;
async function hash(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');}
function canonical(value){
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
 return JSON.stringify(value);
}
export async function readPetAccount(db,username,env={}){
 const now=Number((await db.prepare('SELECT unixepoch() AS now').first()).now);
 const row=await db.prepare('SELECT state_json,balance,revision FROM pet_accounts WHERE auth_username=?').bind(username).first();
 return publicPetState(row?JSON.parse(row.state_json):initialPetState(),row?.balance||0,row?.revision||0,now,env);
}
export async function persistPetCommand(db,user,kind,input,env={}){
 if(!OPERATION.test(input.operationId||''))throw new PetError('OPERATION_INVALID','Identificador inválido.');
 const requestHash=await hash(canonical({kind,input}));
 const nonce=crypto.randomUUID();
 const now=Number((await db.prepare('SELECT unixepoch() AS now').first()).now);
 // A user row comes only from the validated session. No caller-selected owner.
 await db.prepare(`INSERT INTO pet_accounts(auth_username,state_json)
 SELECT username,? FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0
 ON CONFLICT(auth_username) DO NOTHING`).bind(JSON.stringify(initialPetState()),user.username,user.sessionVersion).run();
 const row=await db.prepare('SELECT state_json,balance,revision FROM pet_accounts WHERE auth_username=?').bind(user.username).first();
 if(!row)throw new PetError('SESSION_REQUIRED','Sessão inválida.',401);
 let transition,error;
 try{transition=applyPetCommand(JSON.parse(row.state_json),row.balance,kind,{...input,actualRevision:row.revision,sessionVersion:user.sessionVersion},now,env);}
 catch(e){if(!(e instanceof PetError))throw e;error=e;}
 const proposed=error?{ok:false,code:error.code,error:error.message,status:error.status}:transition.result;
 const statements=[db.prepare(`INSERT INTO pet_operations
 (auth_username,operation_id,request_hash,kind,execution_nonce,status,result_json,created_at)
 SELECT username,?,?,?,?, 'pending',?,? FROM auth_users
 WHERE username=? AND active=1 AND session_version=? AND must_change_password=0
 ON CONFLICT(auth_username,operation_id) DO NOTHING`)
 .bind(input.operationId,requestHash,kind,nonce,JSON.stringify(proposed),now,user.username,user.sessionVersion)];
 const owned=`EXISTS(SELECT 1 FROM pet_operations WHERE auth_username=? AND operation_id=? AND execution_nonce=? AND status='pending')`;
 if(transition){
  statements.push(db.prepare(`UPDATE pet_accounts SET state_json=?,balance=?,revision=revision+1,last_nonce=?
   WHERE auth_username=? AND revision=? AND ${owned}`)
   .bind(JSON.stringify(transition.state),transition.balance,nonce,user.username,row.revision,user.username,input.operationId,nonce));
  if(transition.achievement)statements.push(db.prepare(`INSERT INTO pet_achievements(auth_username,type_id,title,unlocked_at)
   SELECT auth_username,?,?,? FROM pet_accounts WHERE auth_username=? AND last_nonce=?
   ON CONFLICT(auth_username,type_id) DO NOTHING`).bind(transition.achievement.typeId,transition.achievement.title,now,user.username,nonce));
  statements.push(db.prepare(`UPDATE pet_operations SET
   status=CASE WHEN EXISTS(SELECT 1 FROM pet_accounts WHERE auth_username=? AND last_nonce=?) THEN 'ok' ELSE 'conflict' END,
   result_json=CASE WHEN EXISTS(SELECT 1 FROM pet_accounts WHERE auth_username=? AND last_nonce=?) THEN result_json ELSE ? END
   WHERE auth_username=? AND operation_id=? AND execution_nonce=? AND status='pending'`)
   .bind(user.username,nonce,user.username,nonce,JSON.stringify({ok:false,code:'PET_REVISION_CONFLICT',error:'Outra aba alterou o mascote. Atualize e tente novamente.',status:409}),user.username,input.operationId,nonce));
 }else{
  statements.push(db.prepare(`UPDATE pet_operations SET status='rejected'
   WHERE auth_username=? AND operation_id=? AND execution_nonce=? AND status='pending'`).bind(user.username,input.operationId,nonce));
 }
 await db.batch(statements);
 const receipt=await db.prepare('SELECT request_hash,result_json,status FROM pet_operations WHERE auth_username=? AND operation_id=?').bind(user.username,input.operationId).first();
 if(!receipt)throw new PetError('SESSION_REQUIRED','Sessão revogada ou primeiro acesso pendente.',401);
 if(receipt.request_hash!==requestHash)throw new PetError('IDEMPOTENCY_CONFLICT','O identificador já foi usado para outro pedido.',409);
 if(receipt.status==='pending')throw new PetError('PET_TRANSACTION_INCOMPLETE','Operação indisponível.',503);
 return {receipt:JSON.parse(receipt.result_json),state:await readPetAccount(db,user.username,env)};
}
