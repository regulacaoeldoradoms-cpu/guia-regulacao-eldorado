import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../../testing/pets/fixture.mjs';
import {initialPetState,applyPetCommand} from '../pet-domain.js';
import {persistPetCommand,readPetAccount} from '../pet-store.js';
import {initializePetLives} from '../pet-lives.js';
import {PET_LIFE_RULES as rules} from '../pet-life-rules.js';
import {PET_VERSION} from '../pet-catalog.js';
import {createPetRouter} from '../pets.js';
const id=()=>crypto.randomUUID();
const allDay={timezone:'Etc/UTC',days:[0,1,2,3,4,5,6],start:0,end:1440};
const adopt=(revision=0,variant='ginger')=>({operationId:id(),typeId:'cat',variant,expectedPetRevision:revision});
const sample=(tabId,sequence,leaseToken='')=>({operationId:id(),tabId,sequence,leaseToken,visible:true,focused:true,recentlyInteracted:true});
const put=(f,s)=>f.sql.prepare('UPDATE pet_accounts SET state_json=? WHERE auth_username=?').run(JSON.stringify(s),f.user.username);
const stored=f=>JSON.parse(f.sql.prepare('SELECT state_json FROM pet_accounts WHERE auth_username=?').get(f.user.username).state_json);

test('legacy GET is a read-only seven-life projection; first mutation cannot charge prelaunch time',async()=>{
 let now=1791540000;const f=fixture({clock:()=>now});try{
  const old=initialPetState();delete old.life;delete old.deathHistory;old.pet={typeId:'cat',variant:'gray'};old.petRevision=4;old.hunger=100;old.thirst=100;old.inventory={'bed-cloud':1};old.preferences.needsPaused=false;old.preferences.schedule=allDay;
  const tab=id();old.activity={tabId:tab,token:'old-token',sessionVersion:1,sequence:1,at:now-60,eligible:true,expiresAt:now+30};
  f.sql.prepare('INSERT INTO pet_accounts(auth_username,state_json,balance) VALUES(?,?,?)').run(f.user.username,JSON.stringify(old),33);
  const before=f.sql.prepare('SELECT state_json,revision FROM pet_accounts').get();
  let view=await readPetAccount(f.db,f.user.username);assert.equal(view.life.lives,7);assert.equal(view.life.thirstCriticalSeconds,0);assert.equal(view.pet.variant,'gray');assert.equal(view.balance,33);
  now+=10;await readPetAccount(f.db,f.user.username);assert.deepEqual(f.sql.prepare('SELECT state_json,revision FROM pet_accounts').get(),before);
  let r=await persistPetCommand(f.db,f.user,'activity',sample(tab,2,'old-token'));assert.equal(r.state.life.lives,7);assert.equal(r.state.life.thirstCriticalSeconds,0);assert.equal(r.state.petRevision,4);
  now+=60;r=await persistPetCommand(f.db,f.user,'activity',sample(tab,3,r.receipt.leaseToken));assert.equal(r.state.life.thirstCriticalSeconds,60);assert.equal(r.state.life.lives,7);assert.deepEqual(r.state.inventory,old.inventory);
 }finally{f.close();}
});
test('accepted schedule ticks alone consume life clocks; paused, unfocused and offline time do not',()=>{
 const t=1791540000,tab=id();let s=initialPetState();s.pet={typeId:'cat',variant:'gray'};initializePetLives(s,t);s.preferences.needsPaused=false;s.preferences.schedule=allDay;
 let r=applyPetCommand(s,0,'activity',{...sample(tab,1),sessionVersion:1},t);const token=r.result.leaseToken;
 r=applyPetCommand(r.state,0,'activity',{...sample(tab,2,token),sessionVersion:1},t+60);assert.equal(r.state.life.foodSeconds,60);
 let next=structuredClone(r.state);next.preferences.needsPaused=true;r=applyPetCommand(next,0,'activity',{...sample(tab,3,token),sessionVersion:1},t+120);assert.equal(r.state.life.foodSeconds,60);
 next=structuredClone(r.state);next.preferences.needsPaused=false;next.preferences.schedule={...allDay,days:[]};r=applyPetCommand(next,0,'activity',{...sample(tab,4,token),sessionVersion:1},t+180);assert.equal(r.state.life.foodSeconds,60);
 next=structuredClone(r.state);next.preferences.schedule=allDay;r=applyPetCommand(next,0,'activity',{...sample(tab,5,token),focused:false,sessionVersion:1},t+240);assert.equal(r.state.life.foodSeconds,60);
 r=applyPetCommand(r.state,0,'activity',{...sample(tab,6,token),sessionVersion:1},t+10000);assert.equal(r.state.life.foodSeconds,60);
});
test('manual feeding cuts off only food time before that care; water continues independently',()=>{
 const t=1791540000,tab=id();let s=initialPetState();s.pet={typeId:'cat',variant:'gray'};initializePetLives(s,t);s.preferences.needsPaused=false;s.preferences.schedule=allDay;
 let r=applyPetCommand(s,0,'activity',{...sample(tab,1),sessionVersion:1},t);const token=r.result.leaseToken;
 r=applyPetCommand(r.state,0,'care',{action:'food',expectedPetRevision:0},t+40);
 r=applyPetCommand(r.state,0,'activity',{...sample(tab,2,token),sessionVersion:1},t+60);
 assert.equal(r.state.life.foodSeconds,20);assert.equal(r.state.life.waterSeconds,60);assert.equal(r.state.life.lives,7);
});
test('giving ordinary water never suspends the independent pot protection clock',()=>{
 const t=1791540000,tab=id();let s=initialPetState();s.pet={typeId:'cat',variant:'gray'};s.inventory['water-bowl']=1;initializePetLives(s,t);s.life.bowlProtectionSeconds=rules.bowlProtectionSeconds;s.preferences.needsPaused=false;s.preferences.schedule=allDay;
 let r=applyPetCommand(s,0,'activity',{...sample(tab,1),sessionVersion:1},t);const token=r.result.leaseToken;
 r=applyPetCommand(r.state,0,'care',{action:'water',expectedPetRevision:0},t+40);
 r=applyPetCommand(r.state,0,'activity',{...sample(tab,2,token),sessionVersion:1},t+60);
 assert.equal(r.state.life.bowlProtectionSeconds,rules.bowlProtectionSeconds-60);assert.equal(r.state.thirst,0);
});
test('pot purchase equips/fills once; free refill replays cannot reset protection twice',async()=>{
 let now=1791540000;const f=fixture({clock:()=>now});try{
  await persistPetCommand(f.db,f.user,'adopt',adopt());f.sql.prepare('UPDATE pet_accounts SET balance=50').run();
  const buy={operationId:id(),itemId:'water-bowl',catalogVersion:PET_VERSION};let r=await persistPetCommand(f.db,f.user,'purchase',buy);assert.equal(r.state.balance,30);assert.equal(r.state.life.bowlProtectionSeconds,rules.bowlProtectionSeconds);
  let s=stored(f);s.life.bowlProtectionSeconds=123;s.life.lives=6;put(f,s);r=await persistPetCommand(f.db,f.user,'purchase',buy);assert.equal(r.state.balance,30);assert.equal(r.state.life.bowlProtectionSeconds,123);
  const fill={operationId:id(),action:'fill-bowl',expectedPetRevision:1};r=await persistPetCommand(f.db,f.user,'care',fill);assert.equal(r.state.life.bowlProtectionSeconds,rules.bowlProtectionSeconds);assert.equal(r.state.life.lives,6);assert.equal(r.state.balance,30);
  s=stored(f);s.life.bowlProtectionSeconds=321;put(f,s);now+=30;r=await persistPetCommand(f.db,f.user,'care',fill);assert.equal(r.state.life.bowlProtectionSeconds,321);assert.equal(r.state.inventory['water-bowl'],1);
 }finally{f.close();}
});
test('failed pot transaction rolls back coins, ownership, protection and receipt together',async()=>{
 const f=fixture();try{
  await persistPetCommand(f.db,f.user,'adopt',adopt());f.sql.prepare('UPDATE pet_accounts SET balance=50').run();const before=await readPetAccount(f.db,f.user.username),buy={operationId:id(),itemId:'water-bowl',catalogVersion:PET_VERSION};f.failNextBatch(2);
  await assert.rejects(persistPetCommand(f.db,f.user,'purchase',buy));const after=await readPetAccount(f.db,f.user.username);assert.equal(after.balance,50);assert.deepEqual(after.life,before.life);assert.deepEqual(after.inventory,before.inventory);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM pet_operations WHERE operation_id=?').get(buy.operationId).n,0);
 }finally{f.close();}
});
test('death is recorded once, cannot be resurrected by care/replay, and adoption preserves history/inventory',async()=>{
 let now=1791540000;const f=fixture({clock:()=>now});try{
  const original=adopt();await persistPetCommand(f.db,f.user,'adopt',original);let s=stored(f);s.inventory={'bed-cloud':1,'water-bowl':1};s.preferences.needsPaused=false;s.preferences.schedule=allDay;s.life.foodSeconds=rules.foodSeconds;s.life.waterSeconds=rules.waterSeconds;s.life.hungerCriticalSeconds=rules.hungerLifeSeconds-1;s.life.thirstCriticalSeconds=rules.thirstLifeSeconds-1;s.life.lives=2;put(f,s);
  const tab=id();let r=await persistPetCommand(f.db,f.user,'activity',sample(tab,1));now++;const death=sample(tab,2,r.receipt.leaseToken);r=await persistPetCommand(f.db,f.user,'activity',death);assert.equal(r.state.life.lives,0);assert.equal(r.state.life.deadAt,now);assert.equal(r.state.petRevision,2);assert.equal(r.state.deathHistory.length,1);
  r=await persistPetCommand(f.db,f.user,'activity',death);assert.equal(r.state.deathHistory.length,1);
  for(const action of ['food','water','fill-bowl','wash','rest'])assert.equal((await persistPetCommand(f.db,f.user,'care',{operationId:id(),action,expectedPetRevision:2})).receipt.code,'PET_DEAD');
  r=await persistPetCommand(f.db,f.user,'adopt',original);assert.equal(r.state.life.lives,0);
  const rebirth=adopt(2,'gray');r=await persistPetCommand(f.db,f.user,'adopt',rebirth);assert.equal(r.state.life.lives,7);assert.equal(r.state.life.deadAt,null);assert.equal(r.state.life.bowlProtectionSeconds,0);assert.equal(r.state.pet.variant,'gray');assert.equal(r.state.petRevision,3);assert.equal(r.state.deathHistory.length,1);assert.equal(r.state.inventory['bed-cloud'],1);assert.equal(r.state.inventory['water-bowl'],1);
  await persistPetCommand(f.db,f.user,'adopt',rebirth);assert.equal((await readPetAccount(f.db,f.user.username)).petRevision,3);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM pet_achievements').get().n,1);assert.equal((await readPetAccount(f.db,'demo-b')).pet,null);
 }finally{f.close();}
});
test('concurrent pot purchases deliver/debit once and separate owners do not share protection',async()=>{
 const f=fixture();try{
  await persistPetCommand(f.db,f.user,'adopt',adopt());f.sql.prepare('UPDATE pet_accounts SET balance=50').run();const rs=await Promise.all([1,2].map(()=>persistPetCommand(f.db,f.user,'purchase',{operationId:id(),itemId:'water-bowl',catalogVersion:PET_VERSION})));assert.equal(rs.filter(r=>r.receipt.ok).length,1);const s=await readPetAccount(f.db,f.user.username);assert.equal(s.balance,30);assert.equal(s.inventory['water-bowl'],1);assert.equal((await readPetAccount(f.db,'demo-b')).life,null);
 }finally{f.close();}
});
test('router accepts owned free refill, rejects caller life injection and premature readoption',async()=>{
 const f=fixture();try{
  await persistPetCommand(f.db,f.user,'adopt',adopt());const router=createPetRouter({validateSession:async()=>f.user}),env={PETS_ENABLED:'true',AUTH_DB:f.db};
  const post=(part,input)=>router(new Request('https://example/api/pets/'+part,{method:'POST',body:JSON.stringify(input)}),env);
  let r=await post('care',{operationId:id(),action:'fill-bowl',expectedPetRevision:1});assert.equal(r.status,403);
  r=await post('care',{operationId:id(),action:'food',expectedPetRevision:1,lives:7});assert.equal(r.status,400);
  r=await post('adopt',adopt(1,'gray'));assert.equal(r.status,409);assert.equal((await r.json()).code,'PET_ALREADY_ADOPTED');
 }finally{f.close();}
});
