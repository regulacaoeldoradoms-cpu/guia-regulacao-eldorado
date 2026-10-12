import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
const source=fs.readFileSync(new URL('../../js/council-detail-cache.js',import.meta.url),'utf8');
const protocol=index=>'CMS-2026-'+String(index).padStart(6,'0');
function fixture(){
 const timers=[],calls=[];let valid=true;
 const window={};vm.runInNewContext(source,{window,TextEncoder,AbortController,DOMException,URLSearchParams,Map,Date,setTimeout:callback=>{timers.push(callback);return callback;},clearTimeout:callback=>{const i=timers.indexOf(callback);if(i>=0)timers.splice(i,1);}});
 const cache=window.createCouncilDetailCache({valid:()=>valid,request:(path,options)=>new Promise((resolve,reject)=>calls.push({path,options,resolve,reject}))});
 const flush=async()=>{await new Promise(resolve=>setImmediate(resolve));const pending=timers.splice(0);for(const callback of pending)callback();await new Promise(resolve=>setImmediate(resolve));};
 const payload=index=>({manifestation:{protocol:protocol(index)},messages:[],detailRevision:'rev'+index});
 return{cache,calls,flush,payload,revoke(){valid=false;}};
}
test('speculation is deduplicated, bounded to two requests and remembers at most eight session snapshots',async()=>{
 const f=fixture();f.cache.prioritize(Array.from({length:20},(_,i)=>protocol(i+1)));f.cache.enable(true);await f.flush();assert.equal(f.calls.length,2);
 let completed=0;while(completed<8){const call=f.calls[completed];assert(call);const index=Number(call.path.match(/CMS-2026-(\d+)/)[1]);call.resolve(f.payload(index));completed++;await f.flush();assert(f.calls.length-completed<=2);}assert.equal(f.calls.length,8);
 const a=f.cache.open(protocol(1)),b=f.cache.open(protocol(1));assert.equal(f.calls.length,9,'two rapid openings share one authorized foreground read');assert(f.calls[8].path.includes('cacheRevision=rev1'));f.calls[8].resolve({notModified:true,detailRevision:'rev1',protocol:protocol(1)});assert.deepEqual(await a,await b);
 f.cache.prioritize([protocol(9)]);await f.flush();f.calls[9].resolve(f.payload(9));await f.flush();const older=f.cache.open(protocol(2));assert(!f.calls[10].path.includes('cacheRevision='),'least recently used entry is evicted at the eighth-snapshot limit');f.calls[10].resolve(f.payload(2));await older;f.cache.close();
});
test('oversized payloads cannot fill the cache; background failures leave ordinary opening available',async()=>{
 const f=fixture();f.cache.prioritize([protocol(1),protocol(2)]);f.cache.enable(true);await f.flush();f.calls[0].resolve({...f.payload(1),messages:[{body:'x'.repeat(1024*1024)}]});f.calls[1].reject(Object.assign(new Error('Synthetic failure'),{status:503}));await f.flush();
 const open=f.cache.open(protocol(1));assert(!f.calls[2].path.includes('cacheRevision='));f.calls[2].resolve(f.payload(1));await open;const failed=f.cache.open(protocol(2));f.calls[3].resolve(f.payload(2));assert.equal((await failed).manifestation.protocol,protocol(2));f.cache.close();
});
test('cached content remains withheld until fresh validation; denied, wrong-case and late logout results are discarded',async()=>{
 const f=fixture();f.cache.prioritize([protocol(1)]);f.cache.enable(true);await f.flush();f.calls[0].resolve(f.payload(1));await f.flush();let exposed=false;const denied=f.cache.open(protocol(1));denied.then(()=>exposed=true,()=>{});await f.flush();assert.equal(exposed,false);f.calls[1].reject(Object.assign(new Error('Synthetic permission revoked'),{status:403}));await assert.rejects(denied,/revoked/);assert.equal(exposed,false);
 const wrong=f.cache.open(protocol(2));f.calls[2].resolve(f.payload(3));await assert.rejects(wrong,/outra manifestação/);
 const late=f.cache.open(protocol(1));f.cache.close();f.calls[3].resolve(f.payload(1));await assert.rejects(late,{name:'AbortError'});await assert.rejects(f.cache.open(protocol(1)),{name:'AbortError'});
});
