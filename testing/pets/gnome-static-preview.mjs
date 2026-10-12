// Read-only anonymous probes of the exact head's isolated Cloudflare Pages preview.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {GNOME_PHRASE_CATALOG,GNOME_PHRASE_VERSION} from '../../_server/gnome-phrases.js';
const head=process.env.GNOME_PREVIEW_HEAD,repository=process.env.GITHUB_REPOSITORY;
assert(/^[a-f0-9]{40}$/.test(head||''));assert.equal(repository,'regulacaoeldoradoms-cpu/guia-regulacao-eldorado');
let preview;
for(let attempt=0;attempt<10;attempt++){
 const response=await fetch(`https://api.github.com/repos/${repository}/commits/${head}/check-runs?per_page=100`,{headers:{Accept:'application/vnd.github+json','User-Agent':'portal-gnome-static-verification'},signal:AbortSignal.timeout(10000)});assert.equal(response.status,200);
 const checks=(await response.json()).check_runs,check=checks.find(c=>c.name==='Cloudflare Pages'&&c.head_sha===head&&c.conclusion==='success');
 const match=check?.output?.summary?.match(/https:\/\/[a-f0-9]+\.portal-regulacao-central-staging\.pages\.dev/);if(match){preview=match[0];break;}if(attempt<9)await new Promise(resolve=>setTimeout(resolve,3000));
}
assert(preview,'Exact-head isolated Pages deployment must be successful before probing');
const probes=[];
for(const path of ['/mascotes/','/404.html','/_server/gnome-phrases.js','/_server/gnome-phrases.js?gnome-static-check=1']){
 const response=await fetch(preview+path,{redirect:'error',signal:AbortSignal.timeout(15000)}),body=await response.text();
 if(path==='/mascotes/'){assert.equal(response.status,200);if(!body.includes('petGallery')){console.log(JSON.stringify({head,preview,path,status:response.status,contentType:response.headers.get('Content-Type'),bytes:body.length,title:body.match(/<title[^>]*>([^<]*)/i)?.[1],bodyStart:body.slice(0,600)}));}assert(body.includes('petGallery'));}
 else if(path.startsWith('/_server/')){assert([200,404].includes(response.status));assert(!body.includes('GNOME_PHRASE_CATALOG'));assert(!body.includes(GNOME_PHRASE_VERSION));assert(GNOME_PHRASE_CATALOG.every(p=>!body.includes(p.text)));assert(!/javascript/i.test(response.headers.get('Content-Type')||''));}
 probes.push({path,status:response.status,contentType:response.headers.get('Content-Type'),sha256:createHash('sha256').update(body).digest('hex')});
}
assert.equal(probes[2].sha256,probes[1].sha256,'Server-source path must receive the native 404 document');assert.equal(probes[3].sha256,probes[1].sha256,'Query strings must not expose the server repertoire');
await fs.mkdir('.local/gnome-static-preview',{recursive:true});await fs.writeFile('.local/gnome-static-preview/results.json',JSON.stringify({head,preview,anonymous:true,productionMutation:false,probes},null,2));console.log(JSON.stringify({head,preview,serverRepertoireAbsent:true,probes:probes.length}));
