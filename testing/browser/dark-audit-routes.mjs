import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const excluded=new Set(['.git','.github','assets','css','data','docs','firebase','js','node_modules','scripts','testing','vendor','worker','dist-staging']);
function discover(dir=root) {
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    if(entry.isDirectory())return excluded.has(entry.name)?[]:discover(path.join(dir,entry.name));
    if(!entry.name.endsWith('.html'))return [];
    const relative=path.relative(root,path.join(dir,entry.name)).replaceAll('\\','/');
    return ['/'+relative.replace(/index\.html$/,'')];
  });
}
export const auditRoutes=discover();
export const aliasDestinations={'/home/':'/','/conta/':'/perfil/','/protocolo.html':'/protocolo/'};
export const selectedAuditRoutes=process.env.DARK_AUDIT_ROUTES?auditRoutes.filter(route=>process.env.DARK_AUDIT_ROUTES.split(',').includes(route)):auditRoutes;
