import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(new URL('../../',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));const cwd=decodeURIComponent(root);
function change(file,fn){const full=path.join(cwd,file),before=fs.readFileSync(full,'utf8'),after=fn(before);if(after===before)throw Error('No change '+file);fs.writeFileSync(full,after);}
function replace(source,from,to){if(!source.includes(from))throw Error('Missing integration anchor '+from.slice(0,80));return source.replace(from,to);}
change('worker/index.js',s=>replace(replace(replace(s,"import aiWorker from './gemini-assistant.js';","import aiWorker from './gemini-assistant.js';\nimport {handlePetsRoute,isPetsApi} from './pets.js';"),
"    const originAllowed = !origin || allowedOrigins(env).includes(origin);","    const originAllowed = !origin || allowedOrigins(env).includes(origin);\n    if(request.method==='OPTIONS' && isPetsApi(url.pathname)) return handlePetsRoute(request,env,origin,originAllowed);"),
"    if (emailGate) return emailGate;","    if (emailGate) return emailGate;\n    if(isPetsApi(url.pathname)) return handlePetsRoute(request,env,origin,originAllowed);"));
change('index.html',s=>replace(s,'<a href="/conquistas/">Conquistas</a>','<a href="/conquistas/">Conquistas</a>\n            <a href="/mascotes/">Adotar mascote</a>'));
change('js/social-navigation.js',s=>{
 s=s.replaceAll('20260928-2','20261009-pets-1');
 return replace(s,'    bottom.append(...mobileLinks);','    mobileLinks.push(navLink(\'/mascotes/\', \'Mascotes\', \'<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16" rx="6" ry="4"/><circle cx="5" cy="8" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="20" cy="8" r="2"/></svg>\', { mobile:true }));\n    bottom.append(...mobileLinks);');
});
change('js/portal-global-navigation.js',s=>s.replaceAll('20260928-2','20261009-pets-1'));
for(const file of ['portal-sw.js','js/portal-performance.js'])change(file,s=>replace(s,"'/conquistas/', '/conta/'","'/conquistas/', '/mascotes/', '/conta/'"));
change('worker/wrangler.toml',s=>replace(s,'[vars]','[vars]\n# Mascotes V1: local-only until an explicit release; migration is never automatic.\nPETS_ENABLED = "false"'));
change('conquistas/index.html',s=>replace(s,'<div class="account-achievement-categories">','<div class="account-achievement-categories">\n<section id="petAchievementsSection" class="account-achievement-category" hidden><header><h2>Mascotes</h2></header><div id="petAchievementsGrid" class="achievement-grid"></div></section>'));
const pages=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(['.git','node_modules','vendor','assets','testing','worker','data','docs'].includes(entry.name))continue;
 const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.html')){
  let s=fs.readFileSync(full,'utf8');if(!s.includes('/js/auth-client.js')||/[/\\](login|cadastro)[/\\]/.test(full)||full.endsWith(path.join('mascotes','index.html')))continue;
  s=s.replace(/social-navigation\.js\?v=[^"]+/g,'social-navigation.js?v=20261009-pets-1');
  s=replace(s,'</body>','<script type="module" src="/js/pets-bootstrap.js"></script>\n'+(full.endsWith(path.join('conquistas','index.html'))?'<script type="module" src="/js/pets-achievements.js"></script>\n':'')+'</body>');
  fs.writeFileSync(full,s);pages.push(path.relative(cwd,full));
 }
}}
walk(cwd);console.log(JSON.stringify({integratedPages:pages},null,2));
// Preserve a monotonically increasing placement revision even when a bed is removed.
change('worker/pet-domain.js',s=>s.replace('inventory:{},placement:null,collar:null,','inventory:{},placement:null,placementRevision:0,collar:null,').replace("input.expectedPlacementRevision!==(s.placement?.revision||0)","input.expectedPlacementRevision!==s.placementRevision").replace("if(input.itemId===null){s.placement=null;}","if(input.itemId===null){s.placement=null;s.placementRevision++;}").replace("revision:(s.placement?.revision||0)+1","revision:++s.placementRevision"));
change('js/pets-page.js',s=>s.replace('s.placement?.revision||0','s.placementRevision'));
change('js/pets-runtime.js',s=>s.replace("()=>this.render(),{signal}","()=>{this.render();this.start();},{signal}").replace('left:70,right:Math.max(70,width-70)','left:88,right:Math.max(88,width-88)'));
