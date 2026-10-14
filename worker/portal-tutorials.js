import {validatePortalSession} from './auth-management-flex.js';
export const CITIZEN_TUTORIAL_STEPS=Object.freeze(['open','sugestao','reclamacao','elogio','denuncia','report','details','files','preview','remove','identified','protected','send','track','reply','notice']);
export const isPortalTutorialApi=path=>path==='/api/portal-tutorials/citizen'||path==='/api/portal-tutorials/citizen/complete';
export function createPortalTutorialRouter({validateSession=validatePortalSession}={}){
 return async function handle(request,env,origin='',allowed=true){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  if(origin&&allowed){headers['Access-Control-Allow-Origin']=origin;headers.Vary='Origin';}
  const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(!allowed)return json({code:'ORIGIN_DENIED',error:'Origem não autorizada.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type'}});
  if(String(env.PORTAL_TUTORIAL_COMPLETION_ENABLED||'').toLowerCase()!=='true')return json({code:'TUTORIAL_DISABLED',error:'Registro de conclusão ainda não ativado.'},503);
  try{
   const user=await validateSession(request,env,[]);
   if(!user)return json({code:'SESSION_REQUIRED',error:'Sessão inválida ou expirada.'},401);
   if(user.mustChangePassword)return json({code:'FIRST_ACCESS_REQUIRED',error:'Conclua a etapa de segurança da conta.'},403);
   const path=new URL(request.url).pathname;
   if(!isPortalTutorialApi(path))return json({code:'ROUTE_NOT_FOUND',error:'Ação não encontrada.'},404);
   if(request.method==='POST'&&path.endsWith('/complete')){
    // CORS alone is insufficient for mutations. Use the existing allowlisted
    // Origin decision, session validation and an exact, bounded metadata body.
    if(!origin||request.headers.get('Content-Type')?.split(';')[0]!=='application/json')return json({code:'INVALID_REQUEST',error:'Pedido inválido.'},400);
    const raw=await request.text();if(raw.length>1024)return json({code:'PAYLOAD_LIMIT',error:'Pedido muito grande.'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({code:'INVALID_REQUEST',error:'Pedido inválido.'},400);}
    if(!body||Array.isArray(body)||Object.keys(body).some(k=>!['version','steps'].includes(k))||body.version!==1||!Array.isArray(body.steps)||body.steps.length!==CITIZEN_TUTORIAL_STEPS.length||!body.steps.every((s,i)=>s===CITIZEN_TUTORIAL_STEPS[i]))return json({code:'INCOMPLETE_TUTORIAL',error:'Conclua todas as etapas do tutorial.'},422);
    await env.AUTH_DB.prepare('INSERT OR IGNORE INTO portal_tutorial_completions (auth_username,tutorial_id,version) SELECT username, ?, ? FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0').bind('citizen',1,user.username,Number(user.sessionVersion||0)).run();
   }else if(request.method!=='GET'||path.endsWith('/complete'))return json({code:'METHOD_NOT_ALLOWED',error:'Método não permitido.'},405);
   const completion=await env.AUTH_DB.prepare('SELECT c.version,c.completed_at AS completedAt FROM portal_tutorial_completions c JOIN auth_users u ON u.username=c.auth_username WHERE c.auth_username=? AND c.tutorial_id=? AND c.version=? AND u.active=1 AND u.session_version=? AND u.must_change_password=0').bind(user.username,'citizen',1,Number(user.sessionVersion||0)).first();
   if(request.method==='POST'&&!completion)return json({code:'SESSION_REQUIRED',error:'Sessão inválida ou expirada.'},401);
   return json({completion:completion||null});
  }catch(_){
   // An explicit migration is required. No runtime schema creation or fallback
   // writes; never log private/session data or raw database errors.
   return json({code:'TUTORIAL_UNAVAILABLE',error:'Registro de conclusão temporariamente indisponível.'},503);
  }
 };
}
export const handlePortalTutorialRoute=createPortalTutorialRouter();
