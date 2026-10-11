import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../../js/social-api.js',import.meta.url),'utf8');
function fixture(){
 let now=100000,user={username:'citizen-a'},calls=0;const storage=new Map(),listeners=new Map();
 const window={RegulationAuth:{getCachedUser:()=>user,api:async()=>({profile:{handle:user.username},sequence:++calls})},REGULATION_AUTH_CONFIG:{},setTimeout,clearTimeout,addEventListener:(name,fn)=>listeners.set(name,fn),dispatchEvent:()=>{}};
 const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k),key:i=>[...storage.keys()][i],get length(){return storage.size;}};
 vm.runInNewContext(source,{window,sessionStorage,Date:{now:()=>now},AbortController,CustomEvent:class{constructor(type,init){this.type=type;Object.assign(this,init);}},URL,document:{getElementById:()=>null}});
 return{social:window.PortalSocial,advance:ms=>{now+=ms;},switchUser:username=>{user={username};},logout:()=>listeners.get('portal:session-cleared')(),calls:()=>calls};
}
test('startup reuses fresh own configuration for at most five seconds; default and forced calls revalidate',async()=>{
 const f=fixture();await f.social.getConfig();assert.equal(f.calls(),1);
 await f.social.getConfig(5000,{reuseFreshMs:5000});assert.equal(f.calls(),1);
 f.advance(4999);await f.social.getConfig(5000,{reuseFreshMs:60000});assert.equal(f.calls(),1);
 f.advance(2);await f.social.getConfig(5000,{reuseFreshMs:60000});assert.equal(f.calls(),2);
 await new Promise(r=>setImmediate(r));await f.social.getConfig();assert.equal(f.calls(),3);
 await new Promise(r=>setImmediate(r));const fresh=await f.social.getConfig({force:true,reuseFreshMs:5000});assert.equal(f.calls(),4);assert.equal(fresh.sequence,4);
});
test('fresh configuration stays keyed to the account and is removed on logout',async()=>{
 const f=fixture();await f.social.getConfig();f.switchUser('citizen-b');
 const b=await f.social.getConfig(5000,{reuseFreshMs:5000});assert.equal(b.profile.handle,'citizen-b');assert.equal(f.calls(),2);
 f.logout();await f.social.getConfig(5000,{reuseFreshMs:5000});assert.equal(f.calls(),3);
});
