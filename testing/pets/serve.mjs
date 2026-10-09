import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
import {fixture} from './fixture.mjs';import {createPetRouter} from '../../worker/pets.js';
const root=decodeURIComponent(path.resolve(new URL('../../',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')));
const previewDB=process.env.PETS_PREVIEW_DB||path.join(root,'.local/pets-preview.sqlite');
fs.mkdirSync(path.dirname(previewDB),{recursive:true});
const f=fixture({filename:previewDB});
const env={PETS_ENABLED:'true',AUTH_DB:f.db};
const router=createPetRouter({validateSession:async request=>{
 const token=request.headers.get('Authorization')||'';const username=token==='Bearer pet-demo-a'?'demo-a':token==='Bearer pet-demo-b'?'demo-b':null;
 return username?{username,sessionVersion:1,mustChangePassword:false}:null;
}});
const userFor=req=>({username:req.headers.authorization==='Bearer pet-demo-b'?'demo-b':'demo-a',name:'Conta sintética de teste',role:'cidadao',active:true,emailVerified:true,sessionVersion:1});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:8793');let body='';for await(const chunk of req){body+=chunk;if(body.length>10000)throw Error('payload limit');}
  if(url.pathname.startsWith('/api/pets/')){
   const request=new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body})});
   const result=await router(request,env);res.writeHead(result.status,Object.fromEntries(result.headers));return res.end(await result.text());
  }
  if(url.pathname==='/api/auth/me'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({user:userFor(req)}));}
  if(url.pathname==='/api/auth/logout'){res.setHeader('Content-Type','application/json');return res.end('{"ok":true}');}
  if(url.pathname==='/api/social/config'){res.setHeader('Content-Type','application/json');return res.end('{"backendEnabled":false,"available":false,"homeEnabled":false}');}
  // Fixture administration exists only in this loopback server, never in Worker sources.
  if(url.pathname==='/__fixture'&&req.method==='POST'){
   const v=JSON.parse(body),owner=v.account==='b'?'demo-b':'demo-a';
   if(v.reset){f.sql.exec('DELETE FROM pet_operations; DELETE FROM pet_achievements; DELETE FROM pet_accounts;');return res.end('reset synthetic data');}
   const row=f.sql.prepare('SELECT state_json FROM pet_accounts WHERE auth_username=?').get(owner);
   if(!row)throw Error('adopt first');const s=JSON.parse(row.state_json);
   for(const key of ['hunger','thirst','dirt','awakeSeconds'])if(Number.isFinite(v[key]))s[key]=v[key];
   f.sql.prepare('UPDATE pet_accounts SET state_json=?,balance=COALESCE(?,balance) WHERE auth_username=?').run(JSON.stringify(s),v.balance??null,owner);
   return res.end('ok');
  }
  if(url.pathname==='/js/auth-config.js'){
   res.setHeader('Content-Type','text/javascript');
   return res.end(`window.REGULATION_AUTH_CONFIG={endpoint:location.origin,enforcement:true};const account=new URLSearchParams(location.search).get('demo');if(account){sessionStorage.clear();localStorage.removeItem('regulacao.portal.session');sessionStorage.setItem('regulacao.portal.session','pet-demo-'+(account==='b'?'b':'a'));}if(!sessionStorage.getItem('regulacao.portal.session'))sessionStorage.setItem('regulacao.portal.session','pet-demo-a');`);
  }
  let route=decodeURIComponent(url.pathname);if(route.endsWith('/'))route+='index.html';if(route==='/')route='/index.html';
  const target=path.resolve(root,'.'+route);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end('Not found');}
  const data=fs.readFileSync(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch(e){res.writeHead(500);res.end('Synthetic preview error: '+e.message);}
});
server.listen(8793,'127.0.0.1',()=>console.log('Synthetic persistent preview http://127.0.0.1:8793/mascotes/?demo=a — only loopback, no production credentials'));
