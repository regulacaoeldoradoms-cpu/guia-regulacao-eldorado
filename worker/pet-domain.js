'use strict';
import {petCatalog} from './pet-catalog.js';
import {petSlot,gnomeCompanionState} from '../js/pet-companions.mjs';
import {initializePetLives,advancePetLives,feedPetLives,waterPetLives,fillPetWaterBowl} from './pet-lives.js';
export class PetError extends Error {
 constructor(code,message,status=400){super(message);this.code=code;this.status=status;}
}
const fail=(code,message,status=400)=>{throw new PetError(code,message,status);};
export function initialPetState(){
 return {pet:null,petRevision:0,life:null,deathHistory:[],hunger:0,thirst:0,dirt:0,awakeSeconds:0,sleepUntil:0,
  inventory:{},placement:null,placementRevision:0,collar:null,
  preferences:{visible:true,motionEnabled:true,needsPaused:true,schedule:null},
  daily:{key:'',seconds:0,coins:0},activity:null};
}
function revision(actual,expected){
 if(!Number.isInteger(expected)||expected!==actual)fail('PET_REVISION_CONFLICT','O mascote mudou em outra aba. Atualize e tente novamente.',409);
}
function requirePet(s){if(!s.pet)fail('PET_REQUIRED','Adote um mascote primeiro.',403);}
function requireLiving(s){requirePet(s);if(s.life.deadAt!==null)fail('PET_DEAD','Seu gato perdeu as sete vidas. Você pode adotar outro na galeria.',409);}
function dayKey(now,tz){
 return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now*1000));
}
export function withinSchedule(now,schedule){
 if(!schedule)return false;
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:schedule.timezone,weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date(now*1000));
 const values=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(values.weekday);
 const minute=Number(values.hour)*60+Number(values.minute);
 return schedule.days.includes(day)&&minute>=schedule.start&&minute<schedule.end;
}
export function validateSchedule(v){
 if(v===null)return null;
 if(!v||typeof v!=='object')fail('SCHEDULE_INVALID','Configure o expediente.');
 try{new Intl.DateTimeFormat('en',{timeZone:v.timezone}).format();}catch{fail('SCHEDULE_INVALID','Fuso horário inválido.');}
 if(!Array.isArray(v.days)||!v.days.length||v.days.some(d=>!Number.isInteger(d)||d<0||d>6)
  ||!Number.isInteger(v.start)||!Number.isInteger(v.end)||v.start<0||v.end>1440||v.start>=v.end)
  fail('SCHEDULE_INVALID','Selecione dias e um intervalo válido de expediente.');
 return {timezone:v.timezone,days:[...new Set(v.days)].sort(),start:v.start,end:v.end};
}
function applySinglePetCommand(current,balance,kind,input,now,env={},eligibility={}){
 const s=structuredClone(current),catalog=petCatalog(env,eligibility),rules=catalog.rules;
 if(s.pet)initializePetLives(s,now);
 let nextBalance=balance,delta=0,achievement=null,detail={};
 if(kind==='adopt'){
  revision(s.petRevision,input.expectedPetRevision);
  const type=catalog.types.find(t=>t.id===input.typeId);
  if(!type||!type.variants.includes(input.variant))fail('PET_TYPE_UNAVAILABLE','Mascote indisponível.');
  if(s.pet&&s.life.deadAt===null)fail('PET_ALREADY_ADOPTED','Você já tem um gato. Uma nova adoção fica disponível depois que ele perder as sete vidas.',409);
  s.pet={typeId:type.id,variant:input.variant};s.petRevision++;s.activity=null;
  s.hunger=0;s.thirst=0;s.dirt=0;s.awakeSeconds=0;s.sleepUntil=0;s.life=null;
  initializePetLives(s,now);
  achievement={typeId:type.id,title:type.achievement};
 }else if(kind==='preferences'){
  if(input.expectedRevision!==input.actualRevision)fail('PET_REVISION_CONFLICT','Preferências alteradas em outra aba.',409);
  for(const key of ['visible','motionEnabled','needsPaused']){
   if(typeof input[key]!=='boolean')fail('PREFERENCES_INVALID','Preferências inválidas.');
   s.preferences[key]=input[key];
  }
  s.preferences.schedule=validateSchedule(input.schedule);
  if(!s.preferences.needsPaused&&!s.preferences.schedule)fail('SCHEDULE_REQUIRED','Configure o expediente antes de ativar necessidades.');
  s.activity=null;
 }else if(kind==='purchase'){
  requirePet(s);
  if(input.catalogVersion!==catalog.version)fail('CATALOG_CHANGED','Atualize os preços antes de comprar.',409);
  const item=catalog.items.find(i=>i.id===input.itemId);
  if(!item)fail('ITEM_UNAVAILABLE','Item indisponível.');
  if(item.unique&&s.inventory[item.id])fail('ITEM_ALREADY_OWNED','Este item já está no seu inventário.',409);
  if(nextBalance<item.price)fail('INSUFFICIENT_COINS','Você ainda não tem moedas suficientes.',409);
  if((s.inventory[item.id]||0)>=99)fail('INVENTORY_LIMIT','Limite de itens atingido.',409);
  nextBalance-=item.price;delta=-item.price;s.inventory[item.id]=(s.inventory[item.id]||0)+1;
  if(item.kind==='water-bowl'&&s.life.deadAt===null){s.life.waterBowl=item.id;fillPetWaterBowl(s,now);}
  detail={itemId:item.id,price:item.price};
 }else if(kind==='placement'){
  requireLiving(s);revision(s.petRevision,input.expectedPetRevision);
  if(input.expectedPlacementRevision!==s.placementRevision)fail('PLACEMENT_CONFLICT','A cama foi movida em outra aba.',409);
  if(input.itemId===null){s.placement=null;s.placementRevision++;}
  else{
   const item=catalog.items.find(i=>i.id===input.itemId&&i.kind==='bed');
   if(!item||!s.inventory[item.id])fail('ITEM_NOT_OWNED','Compre esta cama antes de colocá-la.',403);
   if(!Number.isFinite(input.x)||!Number.isFinite(input.y)||input.x<0||input.x>1||input.y<0||input.y>1)fail('POSITION_INVALID','Posição inválida.');
   s.placement={itemId:item.id,x:input.x,y:input.y,revision:++s.placementRevision};
  }
 }else if(kind==='care'){
  requireLiving(s);revision(s.petRevision,input.expectedPetRevision);
  if(input.action==='food')feedPetLives(s,now);
  else if(input.action==='water')waterPetLives(s,now);
  else if(input.action==='equip-bowl'){
   const item=catalog.items.find(item=>item.id===input.itemId&&item.kind==='water-bowl');
   if(!item||!s.inventory[item.id])fail('ITEM_NOT_OWNED','Compre o potinho antes de usá-lo.',403);
   s.life.waterBowl=item.id;fillPetWaterBowl(s,now);
  }
  else if(input.action==='fill-bowl'){
   if(!fillPetWaterBowl(s,now))fail('ITEM_NOT_OWNED','Compre e use o potinho antes de enchê-lo.',403);
  }
  else if(input.action==='wash')s.dirt=0;
  else if(input.action==='rest'){
   if(s.awakeSeconds>=rules.sleepAfterSeconds&&!s.sleepUntil)s.sleepUntil=now+rules.sleepSeconds;
  }else if(input.action==='special-bath'){
   if(!(s.inventory['bath-special']>0))fail('ITEM_NOT_OWNED','Você não tem banho especial no inventário.',403);
   s.inventory['bath-special']--;s.dirt=0;
  }else if(input.action==='collar'){
   if(input.itemId!==null&&!(s.inventory[input.itemId]>0&&catalog.items.some(i=>i.id===input.itemId&&i.kind==='accessory')))fail('ITEM_NOT_OWNED','Acessório indisponível.',403);
   s.collar=input.itemId;
  }else fail('CARE_INVALID','Cuidado inválido.');
 }else if(kind==='activity'){
  requirePet(s);
  if(!/^[a-z0-9-]{16,80}$/i.test(input.tabId||'')||!Number.isInteger(input.sequence)||input.sequence<1
   ||['visible','focused','recentlyInteracted'].some(k=>typeof input[k]!=='boolean'))
   fail('ACTIVITY_INVALID','Amostra inválida.');
  const eligible=input.visible&&input.focused&&input.recentlyInteracted;
  const previous=s.activity;
  const owns=previous&&previous.tabId===input.tabId&&previous.token===input.leaseToken&&previous.sessionVersion===input.sessionVersion;
  if(previous&&previous.expiresAt>now&&!owns)fail('ACTIVITY_LEASE_BUSY','Outra aba está contando o tempo ativo.',409);
  if(owns&&input.sequence<=previous.sequence)fail('ACTIVITY_SEQUENCE_STALE','Amostra já processada.',409);
  const elapsed=owns&&previous.eligible&&eligible&&now>=previous.at&&now-previous.at<=rules.leaseSeconds
    ?Math.min(rules.sampleSeconds,now-previous.at):0;
  const key=dayKey(now,rules.dayTimezone);
  if(s.daily.key!==key)s.daily={key,seconds:0,coins:0};
  // A boundary interval is deliberately discarded; no time crosses daily buckets.
  const credited=previous&&dayKey(previous.at,rules.dayTimezone)===key?elapsed:0;
  const before=Math.floor(s.daily.seconds/rules.secondsPerCoin);
  s.daily.seconds=Math.min(rules.dailyCap*rules.secondsPerCoin,s.daily.seconds+credited);
  delta=Math.max(0,Math.min(rules.dailyCap-s.daily.coins,Math.floor(s.daily.seconds/rules.secondsPerCoin)-before));
  s.daily.coins+=delta;nextBalance+=delta;
  const careTicks=[];
  if(!s.preferences.needsPaused&&s.preferences.schedule)
   for(let t=now-elapsed+1;t<=now;t++)if(withinSchedule(t,s.preferences.schedule))careTicks.push(t);
  advancePetLives(s,careTicks);
  if(s.life.deadAt===null)s.dirt=Math.min(100,s.dirt+careTicks.length*70/(rules.dirtHours*3600));
  if(s.sleepUntil){
   if(now>=s.sleepUntil){s.awakeSeconds=0;s.sleepUntil=0;}
  }else s.awakeSeconds=Math.min(rules.sleepAfterSeconds,s.awakeSeconds+elapsed);
  const token=owns?previous.token:crypto.randomUUID();
  s.activity={tabId:input.tabId,token,sessionVersion:input.sessionVersion,sequence:input.sequence,at:now,eligible,expiresAt:eligible?now+rules.leaseSeconds:now};
  detail={acceptedSeconds:credited,leaseToken:token};
 }else fail('PET_ACTION_INVALID','Ação inválida.');
 return {state:s,balance:nextBalance,achievement,result:{ok:true,delta,...detail}};
}
export function applyPetCommand(current,balance,kind,input,now,env={},eligibility={}){
 const target=Object.prototype.hasOwnProperty.call(input,'petTarget')?input.petTarget:'primary';
 if(!['primary','gnome'].includes(target))fail('PET_TARGET_INVALID','Escolha o mascote que receberá o cuidado.');
 if(kind==='adopt'&&input.typeId==='gnome'&&current.pet?.typeId==='cat'){
  revision(current.petRevision,input.expectedPetRevision);
  if(!eligibility.adultEligible)fail('ADULT_AGE_REQUIRED','Este mascote está disponível somente para maiores de 18 anos.',403);
  if(current.gnomeCompanion?.pet&&current.gnomeCompanion.life?.deadAt==null)fail('PET_ALREADY_ADOPTED','Você já adotou o Gnomo.',409);
  const fresh=initialPetState();fresh.petRevision=current.gnomeCompanion?.petRevision||0;fresh.deathHistory=structuredClone(current.gnomeCompanion?.deathHistory||[]);
  const adopted=applySinglePetCommand(fresh,balance,'adopt',{...input,expectedPetRevision:fresh.petRevision},now,env,eligibility);
  const state=structuredClone(current);
  state.gnomeCompanion={...petSlot(adopted.state),adoptedAt:now};
  return {...adopted,state};
 }
 if(kind==='adopt'&&input.typeId==='cat'&&current.pet?.typeId==='gnome'){
  revision(current.petRevision,input.expectedPetRevision);
  if(!eligibility.adultEligible)fail('ADULT_AGE_REQUIRED','Este mascote está disponível somente para maiores de 18 anos.',403);
  if(current.gnomeCompanion?.pet)fail('PET_ALREADY_ADOPTED','A conta já tem um Gnomo guardado.',409);
  const fresh=initialPetState();fresh.petRevision=current.petRevision;
  const adopted=applySinglePetCommand(fresh,balance,'adopt',input,now,env,eligibility),state=structuredClone(current);
  const companion={...petSlot(current),adoptedAt:current.life?.startedAt||now};
  Object.assign(state,petSlot(adopted.state));state.gnomeCompanion=companion;
  return {...adopted,state};
 }
 if(target==='gnome'){
  if(!['care','placement','purchase'].includes(kind))fail('PET_TARGET_INVALID','Esta ação pertence à conta, não a um mascote específico.');
  if(!eligibility.adultEligible)fail('ADULT_AGE_REQUIRED','Este mascote está disponível somente para maiores de 18 anos.',403);
  const companion=gnomeCompanionState(current);if(!companion)fail('PET_REQUIRED','Adote o Gnomo primeiro.',403);
  const result=applySinglePetCommand(companion,balance,kind,input,now,env,eligibility),state=structuredClone(current);
  state.gnomeCompanion={...current.gnomeCompanion,...petSlot(result.state)};
  state.inventory=result.state.inventory;
  return {...result,state};
 }
 const result=applySinglePetCommand(current,balance,kind,input,now,env,eligibility);
 if(kind==='activity'&&result.state.gnomeCompanion?.pet){
  if(!eligibility.adultEligible){result.state.gnomeCompanion.ageClockEligible=false;return result;}
  const s=result.state,g=s.gnomeCompanion,rules=petCatalog(env).rules,previous=current.activity;
  const owns=previous&&previous.tabId===input.tabId&&previous.token===input.leaseToken&&previous.sessionVersion===input.sessionVersion;
  const eligible=input.visible&&input.focused&&input.recentlyInteracted;
  const elapsed=owns&&previous.eligible&&eligible&&now>=previous.at&&now-previous.at<=rules.leaseSeconds?Math.min(rules.sampleSeconds,now-previous.at):0;
  const activeSeconds=g.ageClockEligible===false?0:Math.min(elapsed,Math.max(0,now-(g.adoptedAt??now)));g.ageClockEligible=true;
  if(current.life?.startedAt>previous?.at){
   const bornSeconds=Math.min(elapsed,Math.max(0,now-current.life.startedAt));
   if(!current.sleepUntil)s.awakeSeconds=Math.min(rules.sleepAfterSeconds,current.awakeSeconds+bornSeconds);
   if(!s.preferences.needsPaused&&s.preferences.schedule&&s.life.deadAt===null){let bornTicks=0;for(let t=now-bornSeconds+1;t<=now;t++)if(withinSchedule(t,s.preferences.schedule))bornTicks++;s.dirt=Math.min(100,current.dirt+bornTicks*70/(rules.dirtHours*3600));}
  }
  initializePetLives(g,now);const ticks=[];
  if(!s.preferences.needsPaused&&s.preferences.schedule)for(let t=now-activeSeconds+1;t<=now;t++)if(withinSchedule(t,s.preferences.schedule))ticks.push(t);
  advancePetLives(g,ticks);
  if(g.life.deadAt===null)g.dirt=Math.min(100,g.dirt+ticks.length*70/(rules.dirtHours*3600));
  if(g.sleepUntil){if(now>=g.sleepUntil){g.awakeSeconds=0;g.sleepUntil=0;}}
  else g.awakeSeconds=Math.min(rules.sleepAfterSeconds,g.awakeSeconds+activeSeconds);
 }
 return result;
}
export function publicPetState(state,balance,revision,now,env={}){
 const {activity,...safe}=structuredClone(state);
 if(safe.gnomeCompanion?.pet){initializePetLives(safe.gnomeCompanion,now);delete safe.gnomeCompanion.ageClockEligible;}
 if(safe.pet)initializePetLives(safe,now); // Read-only projection; persistence happens only in an accepted command.
 return {...safe,balance,revision,serverTime:now,rules:petCatalog(env).rules};
}
