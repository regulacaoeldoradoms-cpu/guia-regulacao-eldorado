'use strict';
import {validatePortalSession} from './auth-management-v2.js';
import {petCatalog} from './pet-catalog.js';
import {PetError} from './pet-domain.js';
import {readPetAccount,persistPetCommand} from './pet-store.js';
export const isPetsApi=path=>path==='/api/pets'||path.startsWith('/api/pets/');
const fields={
 adopt:['operationId','typeId','variant','expectedPetRevision'],
 preferences:['operationId','expectedRevision','visible','motionEnabled','needsPaused','schedule'],
 care:['operationId','action','expectedPetRevision','itemId'],
 purchase:['operationId','itemId','catalogVersion'],
 placement:['operationId','itemId','x','y','expectedPetRevision','expectedPlacementRevision'],
 activity:['operationId','tabId','leaseToken','sequence','visible','focused','recentlyInteracted']
};
export function createPetRouter({validateSession=validatePortalSession}={}){
 return async function handle(request,env,origin='',allowed=true){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(origin&&allowed){headers['Access-Control-Allow-Origin']=origin;headers.Vary='Origin';}
  const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(!allowed)return json({code:'ORIGIN_DENIED',error:'Origem não autorizada.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600'}});
  if(String(env.PETS_ENABLED||'').toLowerCase()!=='true')return json({code:'PETS_DISABLED',error:'Mascotes ainda não disponíveis.'},503);
  try{
   const user=await validateSession(request,env,[]);
   if(!user)return json({code:'SESSION_REQUIRED',error:'Sessão inválida ou expirada.'},401);
   if(user.mustChangePassword)return json({code:'FIRST_ACCESS_REQUIRED',error:'Conclua a etapa de segurança.'},403);
   const part=new URL(request.url).pathname.replace(/^\/api\/pets\/?/,'');
   if(request.method==='GET'){
    if(part==='catalog')return json(petCatalog(env));
    if(part==='me')return json({state:await readPetAccount(env.AUTH_DB,user.username,env)});
    if(part==='achievements'){
     const result=await env.AUTH_DB.prepare('SELECT type_id AS typeId,title,unlocked_at AS unlockedAt FROM pet_achievements WHERE auth_username=? ORDER BY unlocked_at').bind(user.username).all();
     return json({achievements:result.results||[]});
    }
   }
   if(request.method==='POST'&&fields[part]){
    const raw=await request.text();if(raw.length>4096)throw new PetError('PAYLOAD_LIMIT','Pedido muito grande.',413);
    let input;try{input=JSON.parse(raw);}catch{throw new PetError('PAYLOAD_INVALID','Pedido inválido.');}
    if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>!fields[part].includes(k)))throw new PetError('PAYLOAD_INVALID','Campos inválidos.');
    const result=await persistPetCommand(env.AUTH_DB,user,part,input,env);
    return json({...result,...(!result.receipt.ok?{code:result.receipt.code,error:result.receipt.error}: {})},result.receipt.ok?200:result.receipt.status||409);
   }
   return json({code:'PET_ROUTE_NOT_FOUND',error:'Ação não encontrada.'},404);
  }catch(error){
   if(error instanceof PetError)return json({code:error.code,error:error.message},error.status);
   // Fail closed if the explicit migration has not been applied. Never log private state.
   return json({code:'PETS_UNAVAILABLE',error:'Mascotes temporariamente indisponíveis.'},503);
  }
 };
}
export const handlePetsRoute=createPetRouter();
