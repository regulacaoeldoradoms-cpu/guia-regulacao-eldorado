'use strict';
import {petCatalog} from './pet-catalog.js';
export class PetError extends Error {
 constructor(code,message,status=400){super(message);this.code=code;this.status=status;}
}
const fail=(code,message,status=400)=>{throw new PetError(code,message,status);};
export function initialPetState(){
 return {pet:null,petRevision:0,hunger:0,thirst:0,dirt:0,awakeSeconds:0,sleepUntil:0,
  inventory:{},placement:null,placementRevision:0,collar:null,
  preferences:{visible:true,motionEnabled:true,needsPaused:true,schedule:null},
  daily:{key:'',seconds:0,coins:0},activity:null};
}
function revision(actual,expected){
 if(!Number.isInteger(expected)||expected!==actual)fail('PET_REVISION_CONFLICT','O mascote mudou em outra aba. Atualize e tente novamente.',409);
}
function requirePet(s){if(!s.pet)fail('PET_REQUIRED','Adote um mascote primeiro.',403);}
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
export function applyPetCommand(current,balance,kind,input,now,env={}){
 const s=structuredClone(current),catalog=petCatalog(env),rules=catalog.rules;
 let nextBalance=balance,delta=0,achievement=null,detail={};
 if(kind==='adopt'){
  revision(s.petRevision,input.expectedPetRevision);
  const type=catalog.types.find(t=>t.id===input.typeId);
  if(!type||!type.variants.includes(input.variant))fail('PET_TYPE_UNAVAILABLE','Mascote indisponível.');
  if(s.pet?.typeId!==type.id||s.pet?.variant!==input.variant){
   s.pet={typeId:type.id,variant:input.variant};s.petRevision++;s.activity=null;
  }
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
  detail={itemId:item.id,price:item.price};
 }else if(kind==='placement'){
  requirePet(s);revision(s.petRevision,input.expectedPetRevision);
  if(input.expectedPlacementRevision!==s.placementRevision)fail('PLACEMENT_CONFLICT','A cama foi movida em outra aba.',409);
  if(input.itemId===null){s.placement=null;s.placementRevision++;}
  else{
   const item=catalog.items.find(i=>i.id===input.itemId&&i.kind==='bed');
   if(!item||!s.inventory[item.id])fail('ITEM_NOT_OWNED','Compre esta cama antes de colocá-la.',403);
   if(!Number.isFinite(input.x)||!Number.isFinite(input.y)||input.x<0||input.x>1||input.y<0||input.y>1)fail('POSITION_INVALID','Posição inválida.');
   s.placement={itemId:item.id,x:input.x,y:input.y,revision:++s.placementRevision};
  }
 }else if(kind==='care'){
  requirePet(s);revision(s.petRevision,input.expectedPetRevision);
  if(input.action==='food')s.hunger=0;
  else if(input.action==='water')s.thirst=0;
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
  let needsSeconds=0;
  if(!s.preferences.needsPaused&&s.preferences.schedule)
   for(let t=now-elapsed+1;t<=now;t++)if(withinSchedule(t,s.preferences.schedule))needsSeconds++;
  s.hunger=Math.min(100,s.hunger+needsSeconds*70/(rules.hungerHours*3600));
  s.thirst=Math.min(100,s.thirst+needsSeconds*70/(rules.thirstHours*3600));
  s.dirt=Math.min(100,s.dirt+needsSeconds*70/(rules.dirtHours*3600));
  if(s.sleepUntil){
   if(now>=s.sleepUntil){s.awakeSeconds=0;s.sleepUntil=0;}
  }else s.awakeSeconds=Math.min(rules.sleepAfterSeconds,s.awakeSeconds+elapsed);
  const token=owns?previous.token:crypto.randomUUID();
  s.activity={tabId:input.tabId,token,sessionVersion:input.sessionVersion,sequence:input.sequence,at:now,eligible,expiresAt:eligible?now+rules.leaseSeconds:now};
  detail={acceptedSeconds:credited,leaseToken:token};
 }else fail('PET_ACTION_INVALID','Ação inválida.');
 return {state:s,balance:nextBalance,achievement,result:{ok:true,delta,...detail}};
}
export function publicPetState(state,balance,revision,now,env={}){
 const {activity,...safe}=structuredClone(state);
 return {...safe,balance,revision,serverTime:now,rules:petCatalog(env).rules};
}
