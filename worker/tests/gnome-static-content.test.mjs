import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
test('adult repertoire stays outside browser assets and is excluded from both static hosts',()=>{
 assert(!fs.existsSync(path.join(root,'worker/gnome-phrases.js')));
 assert.match(fs.readFileSync(path.join(root,'_config.yml'),'utf8'),/exclude:\s*\n\s*- _server/);
 assert(!fs.existsSync(path.join(root,'.nojekyll')),'Pages must retain the exclusion build');
 assert.match(fs.readFileSync(path.join(root,'_redirects'),'utf8'),/^\/_server\/\* \/404\.html 200$/m);
 for(const file of fs.readdirSync(path.join(root,'js')).filter(n=>n.endsWith('.js'))){
  const source=fs.readFileSync(path.join(root,'js',file),'utf8');assert(!source.includes('_server/'),file+' cannot import server-only content');assert(!source.includes('perereca molhada'),file+' cannot contain the adult repertoire');
 }
 assert.match(fs.readFileSync(path.join(root,'worker/pets.js'),'utf8'),/readPrivatePetAge[\s\S]*GNOME_PHRASE_CATALOG/);
});
