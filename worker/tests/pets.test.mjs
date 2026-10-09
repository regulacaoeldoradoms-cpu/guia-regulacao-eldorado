import test from 'node:test';import assert from 'node:assert/strict';
import {fixture} from '../../testing/pets/fixture.mjs';
import {persistPetCommand,readPetAccount} from '../pet-store.js';
import {applyPetCommand,initialPetState,withinSchedule} from '../pet-domain.js';
import {createPetRouter,handlePetsRoute} from '../pets.js';
import {PET_VERSION,petRules} from '../pet-catalog.js';
const id=()=>crypto.randomUUID(),adoption=(variant='ginger',expectedPetRevision=0)=>({operationId:id(),typeId:'cat',variant,expectedPetRevision});
const adopt=async f=>persistPetCommand(f.db,f.user,'adopt',adoption());
test('adoption/replay preserve one active cat and exact achievement',async()=>{
 const f=fixture(),input=adoption();const a=await persistPetCommand(f.db,f.user,'adopt',input),b=await persistPetCommand(f.db,f.user,'adopt',input);
 assert.equal(a.state.pet.typeId,'cat');assert.deepEqual(a.receipt,b.receipt);assert.equal(a.state.revision,b.state.revision);
 const rows=f.sql.prepare('SELECT * FROM pet_achievements').all();assert.equal(rows.length,1);assert.equal(rows[0].title,'Cuidar de 7 vidas não é fácil');f.close();
});
test('payload conflict and a second live adoption cannot reset the cat or achievements',async()=>{
 const f=fixture(),input=adoption();await persistPetCommand(f.db,f.user,'adopt',input);
 await assert.rejects(persistPetCommand(f.db,f.user,'adopt',{...input,variant:'gray'}),{code:'IDEMPOTENCY_CONFLICT'});
 const switched=await persistPetCommand(f.db,f.user,'adopt',adoption('gray',1));
 assert.equal(switched.receipt.code,'PET_ALREADY_ADOPTED');assert.equal(switched.state.pet.variant,'ginger');assert.equal(switched.state.petRevision,1);assert.equal(f.sql.prepare('SELECT count(*) AS n FROM pet_achievements').get().n,1);
 const stale=await persistPetCommand(f.db,f.user,'care',{operationId:id(),action:'food',expectedPetRevision:0});assert.equal(stale.receipt.code,'PET_REVISION_CONFLICT');f.close();
});
test('no adoption means no shop/care; basics do not cost coins',async()=>{
 const f=fixture();const denied=await persistPetCommand(f.db,f.user,'purchase',{operationId:id(),itemId:'bed-cloud',catalogVersion:PET_VERSION});assert.equal(denied.receipt.code,'PET_REQUIRED');
 await adopt(f);for(const action of ['food','water','wash'])assert.equal((await persistPetCommand(f.db,f.user,'care',{operationId:id(),action,expectedPetRevision:1})).state.balance,0);f.close();
});
test('account isolation, including same operation id',async()=>{
 const f=fixture(),input=adoption();await persistPetCommand(f.db,f.user,'adopt',input);
 assert.equal((await readPetAccount(f.db,'demo-b')).pet,null);
 await persistPetCommand(f.db,{username:'demo-b',sessionVersion:1},'adopt',{...input,variant:'gray'});
 assert.equal((await readPetAccount(f.db,'demo-a')).pet.variant,'ginger');assert.equal((await readPetAccount(f.db,'demo-b')).pet.variant,'gray');f.close();
});
function fund(f,balance){f.sql.prepare('UPDATE pet_accounts SET balance=? WHERE auth_username=?').run(balance,f.user.username);}
test('purchase/replay and unique bed never duplicate debit or delivery',async()=>{
 const f=fixture();await adopt(f);fund(f,40);const input={operationId:id(),itemId:'bed-cloud',catalogVersion:PET_VERSION};
 const first=await persistPetCommand(f.db,f.user,'purchase',input),replay=await persistPetCommand(f.db,f.user,'purchase',input);
 assert.equal(first.state.balance,10);assert.equal(replay.state.balance,10);assert.equal(replay.state.inventory['bed-cloud'],1);
 const second=await persistPetCommand(f.db,f.user,'purchase',{...input,operationId:id()});assert.equal(second.receipt.code,'ITEM_ALREADY_OWNED');f.close();
});
test('concurrent purchases do not produce negative balances',async()=>{
 const f=fixture();await adopt(f);fund(f,30);
 await Promise.all(['bed-cloud','collar-blue'].map(itemId=>persistPetCommand(f.db,f.user,'purchase',{operationId:id(),itemId,catalogVersion:PET_VERSION})));
 const state=await readPetAccount(f.db,'demo-a');assert.ok(state.balance>=0);assert.equal(Object.values(state.inventory).reduce((a,b)=>a+b,0),1);f.close();
});
test('batch failure rolls back debit, receipt and inventory',async()=>{
 const f=fixture();await adopt(f);fund(f,40);const input={operationId:id(),itemId:'bed-cloud',catalogVersion:PET_VERSION};f.failNextBatch(2);
 await assert.rejects(persistPetCommand(f.db,f.user,'purchase',input));
 assert.equal((await readPetAccount(f.db,'demo-a')).balance,40);assert.equal(f.sql.prepare('SELECT * FROM pet_operations WHERE operation_id=?').get(input.operationId),undefined);
 assert.equal((await persistPetCommand(f.db,f.user,'purchase',input)).state.balance,10);f.close();
});
test('inactive or revoked session cannot mutate, including race after validation',async()=>{
 const f=fixture();await adopt(f);f.sql.exec("UPDATE auth_users SET session_version=2 WHERE username='demo-a'");
 await assert.rejects(persistPetCommand(f.db,f.user,'care',{operationId:id(),action:'water',expectedPetRevision:1}),{code:'SESSION_REQUIRED'});f.close();
});
test('placement requires ownership, normal coordinates and monotonic revisions',async()=>{
 const f=fixture();await adopt(f);fund(f,30);await persistPetCommand(f.db,f.user,'purchase',{operationId:id(),itemId:'bed-cloud',catalogVersion:PET_VERSION});
 let p=await persistPetCommand(f.db,f.user,'placement',{operationId:id(),itemId:'bed-cloud',x:.5,y:.9,expectedPetRevision:1,expectedPlacementRevision:0});assert.equal(p.state.placement.revision,1);
 p=await persistPetCommand(f.db,f.user,'placement',{operationId:id(),itemId:null,expectedPetRevision:1,expectedPlacementRevision:1});assert.equal(p.state.placementRevision,2);assert.equal(p.state.inventory['bed-cloud'],1);
 const stale=await persistPetCommand(f.db,f.user,'placement',{operationId:id(),itemId:'bed-cloud',x:.2,y:.5,expectedPetRevision:1,expectedPlacementRevision:0});assert.equal(stale.receipt.code,'PLACEMENT_CONFLICT');f.close();
});
test('active credit uses server clock, caps per day and rejects extra tabs/replays',async()=>{
 let now=1791540000;const f=fixture({clock:()=>now});await adopt(f);
 const tabId=id();let leaseToken='',sequence=0;
 const sample=async(extra={})=>{const r=await persistPetCommand(f.db,f.user,'activity',{operationId:id(),tabId,sequence:++sequence,leaseToken,visible:true,focused:true,recentlyInteracted:true,...extra});leaseToken=r.receipt.leaseToken||leaseToken;return r;};
 assert.equal((await sample()).receipt.delta,0);
 const busy=await persistPetCommand(f.db,f.user,'activity',{operationId:id(),tabId:id(),sequence:1,visible:true,focused:true,recentlyInteracted:true});assert.equal(busy.receipt.code,'ACTIVITY_LEASE_BUSY');
 for(let i=0;i<80;i++){now+=60;await sample();}
 assert.equal((await readPetAccount(f.db,'demo-a')).balance,12);
 const before=await readPetAccount(f.db,'demo-a');now+=7200;assert.equal((await sample()).receipt.acceptedSeconds,0);
 assert.equal((await readPetAccount(f.db,'demo-a')).balance,before.balance);
 const stale=await sample({sequence:sequence-1});assert.equal(stale.receipt.code,'ACTIVITY_SEQUENCE_STALE');f.close();
});
test('inactive sample, daily boundary and backward clock do not credit time',()=>{
 let s=initialPetState();s.pet={typeId:'cat',variant:'ginger'};const tabId=id(),base={tabId,sequence:1,visible:true,focused:true,recentlyInteracted:true,sessionVersion:1};
 let r=applyPetCommand(s,0,'activity',base,1791540000);const token=r.result.leaseToken;
 r=applyPetCommand(r.state,0,'activity',{...base,sequence:2,leaseToken:token,focused:false},1791540060);assert.equal(r.result.acceptedSeconds,0);
 r=applyPetCommand(r.state,0,'activity',{...base,sequence:3,leaseToken:token},1791540050);assert.equal(r.result.acceptedSeconds,0);
});
test('needs are paused by default, outside schedule and on leave; no offline catchup',()=>{
 let s=initialPetState();s.pet={typeId:'cat',variant:'ginger'};const tabId=id(),base={tabId,sequence:1,visible:true,focused:true,recentlyInteracted:true,sessionVersion:1};
 let r=applyPetCommand(s,0,'activity',base,1791540000);r=applyPetCommand(r.state,0,'activity',{...base,sequence:2,leaseToken:r.result.leaseToken},1791540060);assert.equal(r.state.hunger,0);
 s=r.state;s.preferences.needsPaused=false;s.preferences.schedule={timezone:'Etc/UTC',days:[0,1,2,3,4,5,6],start:0,end:1440};
 r=applyPetCommand(s,0,'activity',{...base,sequence:3,leaseToken:r.result.leaseToken},1791540120);assert.ok(r.state.hunger>0);
 const hunger=r.state.hunger;r=applyPetCommand(r.state,0,'activity',{...base,sequence:4,leaseToken:r.result.leaseToken},1791640120);assert.equal(r.state.hunger,hunger);
 assert.equal(withinSchedule(1791540000,{timezone:'Etc/UTC',days:[],start:0,end:1440}),false);
});
test('sleep/collar/special bath and configurable proposals',()=>{
 let s=initialPetState();s.pet={typeId:'cat',variant:'ginger'};s.awakeSeconds=2700;s.dirt=90;s.inventory['bath-special']=1;
 let r=applyPetCommand(s,0,'care',{action:'rest',expectedPetRevision:0},1000);assert.equal(r.state.sleepUntil,1045);
 r=applyPetCommand(r.state,0,'care',{action:'special-bath',expectedPetRevision:0},1001);assert.equal(r.state.dirt,0);assert.equal(r.state.inventory['bath-special'],0);
 assert.equal(petRules({PETS_DAILY_CAP:'2'}).dailyCap,2);assert.equal(petRules().proposed,true);
});
test('router denies anonymous, origin, owner injection and missing migration',async()=>{
 const f=fixture(),env={PETS_ENABLED:'true',AUTH_DB:f.db};
 assert.equal((await handlePetsRoute(new Request('https://example/api/pets/me'),env)).status,401);
 const router=createPetRouter({validateSession:async()=>f.user});
 assert.equal((await router(new Request('https://example/api/pets/me'),env,'https://evil',false)).status,403);
 const denied=await router(new Request('https://example/api/pets/adopt',{method:'POST',body:JSON.stringify({...adoption(),username:'demo-b'})}),env);
 assert.equal(denied.status,400);const missing=await router(new Request('https://example/api/pets/me'),{...env,AUTH_DB:{prepare(){throw Error('no such table');}}});assert.equal(missing.status,503);f.close();
});
