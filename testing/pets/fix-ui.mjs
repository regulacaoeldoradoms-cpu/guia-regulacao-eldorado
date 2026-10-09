import fs from 'node:fs';import path from 'node:path';const root=decodeURIComponent(path.resolve(new URL('../../',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')));
for(const [file,from,to] of [
 ['js/pets-page.js',"$('petAdopt').disabled=busy||!selected;","$('petAdopt').disabled=busy||!selected;\n $('petGallery').querySelectorAll('button').forEach(b=>b.disabled=busy);"],
 ['js/pets-runtime.js',"if(this.closed||document.hidden||!this.state.preferences.visible)return;","if(this.closed||document.hidden||!this.state.preferences.visible)return;"],
 ]){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(!s.includes(from))throw Error(file);fs.writeFileSync(p,s.replace(from,to));}
const p=path.join(root,'.gitignore');fs.appendFileSync(p,'\n# Mascotes local synthetic preview and evidence\n.local/\ntesting/pets/artifacts/\ntesting/pets/install.mjs\ntesting/pets/integrate.mjs\ntesting/pets/fix-ui.mjs\n');
