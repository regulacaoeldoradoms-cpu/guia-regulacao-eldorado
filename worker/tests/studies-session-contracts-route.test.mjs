import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

for(const [label,file,cases]of [
 ['reading receipts','studies-reading-receipt-route-runner.mjs',6],
 ['private summaries','studies-session-summary-route-runner.mjs',5],
 ['question association','studies-summary-association-route-runner.mjs',2]
])test('session contract: '+label,()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const result=spawnSync(process.execPath,['--experimental-vm-modules','--test','--test-reporter=tap',fileURLToPath(new URL('./helpers/'+file,import.meta.url))],{env,encoding:'utf8',timeout:15000,maxBuffer:1024*1024});
 assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
 assert.match(result.stdout,new RegExp('# pass '+cases+'\\b'));assert.match(result.stdout,/# fail 0\b/);
});
