'use strict';
import {petSession} from './pets-bootstrap.js';
import {drawCat} from './pet-cat-frames.js';
const $=id=>document.getElementById(id);
const message=(text,error=false)=>{$('petMessage').textContent=text;$('petMessage').dataset.error=String(error);};
let session,selected=null,busy=false,initializing=false,bound=false,pageEpoch=0,pageToken=null;
function resetPage(){
 pageEpoch++;session=null;selected=null;busy=false;pageToken=null;
 for(const id of ['petHome','petShop','petSettings'])$(id).hidden=true;
 for(const id of ['petNeeds','petItems','petGallery','petDays'])$(id).replaceChildren();
 for(const id of ['petWallet','petAchievement','petProposal'])$(id).textContent='';
 $('petPlacement').hidden=true;$('petPreferences').reset();delete $('petPreferences').dataset.editing;
 $('petAdopt').disabled=true;message('Entre na sua conta para carregar o mascote.');
}
const node=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text||'';if(cls)n.className=cls;return n;};
async function command(kind,input,success){
 if(busy||!session||!session.api.valid())return;const owner=session,generation=pageEpoch;busy=true;document.querySelectorAll('.pet-page button').forEach(b=>b.disabled=true);
 try{const result=await owner.api.command(kind,input);if(session!==owner||generation!==pageEpoch)return;owner.runtime.update(result.state);message(success);}
 catch(e){if(session!==owner||generation!==pageEpoch)return;message(e.message,true);await owner.runtime.refresh();}
 finally{if(session===owner&&generation===pageEpoch){busy=false;render();if(selected)$('petAdopt').disabled=false;}}
}
function render(){
 if(!session||!session.api.valid())return;const s=session.runtime.state,c=session.catalog;
 for(const id of ['petHome','petShop','petSettings'])$(id).hidden=!s.pet;
 $('petNeeds').replaceChildren();
 for(const [key,label] of [['hunger','Fome'],['thirst','Sede'],['dirt','Sujeira']]){
  const block=node('div',label+': '+Math.round(s[key])+'%'),meter=node('meter');meter.min=0;meter.max=100;meter.value=s[key];meter.setAttribute('aria-label',label);block.append(meter);$('petNeeds').append(block);
 }
 $('petAchievement').textContent='Conquista: Cuidar de 7 vidas não é fácil';
 $('petWallet').textContent=s.balance+' moedas · '+s.daily.coins+'/'+s.rules.dailyCap+' moedas obtidas hoje';
 $('petItems').replaceChildren();
 for(const item of c.items){
  const owned=s.inventory[item.id]||0,card=node('article','', 'pet-item');
  card.append(node('h3',item.name),node('p',item.price+' moedas · '+(owned?'No inventário: '+owned:'Ainda não adquirido')));
  const buy=node('button','Comprar');buy.disabled=busy||s.balance<item.price||Boolean(item.unique&&owned);
  buy.addEventListener('click',()=>command('purchase',{itemId:item.id,catalogVersion:c.version},'Item comprado.'));card.append(buy);
  if(owned&&item.kind==='bed'){
   const place=node('button','Colocar caminha');place.disabled=busy;place.addEventListener('click',()=>command('placement',{itemId:item.id,x:.25,y:.85,expectedPetRevision:s.petRevision,expectedPlacementRevision:s.placementRevision},'Caminha colocada.'));card.append(place);
  }
  if(owned&&item.kind==='accessory'){
   const wear=node('button',s.collar===item.id?'Guardar coleira':'Usar coleira');wear.disabled=busy;
   wear.addEventListener('click',()=>command('care',{action:'collar',itemId:s.collar===item.id?null:item.id,expectedPetRevision:s.petRevision},'Acessório atualizado.'));card.append(wear);
  }
  $('petItems').append(card);
 }
 $('petPlacement').hidden=!s.placement;
 if(s.placement){$('bedX').value=s.placement.x;$('bedY').value=s.placement.y;}
 // Do not overwrite an unfinished preferences edit on every activity response.
 if(!$('petPreferences').dataset.editing){
  $('petVisible').checked=s.preferences.visible;$('petMotion').checked=s.preferences.motionEnabled;$('petPaused').checked=s.preferences.needsPaused;
  const schedule=s.preferences.schedule;
  if(schedule){$('petTimezone').value=schedule.timezone;for(const input of $('petDays').querySelectorAll('input'))input.checked=schedule.days.includes(Number(input.value));
   const time=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');$('petStart').value=time(schedule.start);$('petEnd').value=time(schedule.end);}
 }
 $('petProposal').textContent='Proposta inicial configurável: 1 moeda por '+s.rules.secondsPerCoin/60+' minutos de uso ativo, até '+s.rules.dailyCap+' por dia. A aba aberta sem interação não conta. Preços da loja também são propostas.';
 document.querySelectorAll('[data-care]').forEach(b=>b.disabled=busy||(b.dataset.care==='special-bath'&&!s.inventory['bath-special']));
 $('petAdopt').disabled=busy||!selected;
 $('petGallery').querySelectorAll('button').forEach(b=>b.disabled=busy);
 $('petPreferences').querySelector('button').disabled=busy;
 $('petPlacement').querySelectorAll('button').forEach(b=>b.disabled=busy);
}
async function initialize(){
 if(initializing)return;initializing=true;const generation=pageEpoch;pageToken=window.RegulationAuth?.getToken?.()||null;
 try{
 const user=await window.PortalAccountSection?.mount();if(!user||generation!==pageEpoch)return;
 const next=await petSession();if(generation!==pageEpoch)return;session=next;if(!session){message('Mascotes ainda não disponíveis neste ambiente.',true);return;}
 $('petGallery').replaceChildren();$('petDays').replaceChildren();
 for(const type of session.catalog.types)for(const variant of type.variants){
  const button=node('button',variant==='ginger'?'Gato dourado':'Gato cinza','pet-choice'),canvas=document.createElement('canvas');canvas.width=64;canvas.height=48;drawCat(canvas.getContext('2d'),'idle',0,variant);button.prepend(canvas);button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{selected={typeId:type.id,variant};for(const b of $('petGallery').children)b.setAttribute('aria-pressed',String(b===button));$('petAdopt').disabled=busy;message('Selecionado. Confirme no botão Adotar.');});$('petGallery').append(button);
 }
 for(const [i,label] of ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].entries()){const l=node('label',label),input=document.createElement('input');input.type='checkbox';input.value=i;input.checked=i>=1&&i<=5;l.prepend(input);$('petDays').append(l);}
 if(!bound){bound=true;
 $('petAdopt').addEventListener('click',()=>{if(selected)command('adopt',{...selected,expectedPetRevision:session.runtime.state.petRevision},'Adoção confirmada. Cuidar de 7 vidas não é fácil');});
 for(const button of document.querySelectorAll('[data-care]'))button.addEventListener('click',()=>command('care',{action:button.dataset.care,expectedPetRevision:session.runtime.state.petRevision},'Cuidado realizado.'));
 const position=()=>{const s=session.runtime.state;return {...s.placement,x:Number($('bedX').value),y:Number($('bedY').value)};};
 for(const id of ['bedX','bedY'])$(id).addEventListener('input',()=>session.runtime.preview(position()));
 $('petPlacement').addEventListener('submit',event=>{event.preventDefault();const s=session.runtime.state,p=position();session.runtime.preview(null);command('placement',{itemId:p.itemId,x:p.x,y:p.y,expectedPetRevision:s.petRevision,expectedPlacementRevision:s.placement.revision},'Posição salva.');});
 $('removeBed').addEventListener('click',()=>{const s=session.runtime.state;session.runtime.preview(null);command('placement',{itemId:null,expectedPetRevision:s.petRevision,expectedPlacementRevision:s.placement.revision},'Caminha guardada no inventário.');});
 $('petPreferences').addEventListener('input',()=>{$('petPreferences').dataset.editing='true';});
 $('petPreferences').addEventListener('submit',event=>{
  event.preventDefault();const minutes=id=>{const [h,m]=$(id).value.split(':').map(Number);return h*60+m;};
  const input={expectedRevision:session.runtime.state.revision,visible:$('petVisible').checked,motionEnabled:$('petMotion').checked,needsPaused:$('petPaused').checked,
   schedule:{timezone:$('petTimezone').value,days:[...$('petDays').querySelectorAll('input:checked')].map(x=>Number(x.value)),start:minutes('petStart'),end:minutes('petEnd')}};
  delete $('petPreferences').dataset.editing;command('preferences',input,'Preferências salvas.');
 });
 window.addEventListener('portal:pets-updated',render);
 }
 render();message('Escolha seu companheiro.');
 }finally{initializing=false;if(generation!==pageEpoch&&window.RegulationAuth?.getToken?.())initialize();}
}
window.addEventListener('portal:session-cleared',resetPage);
window.addEventListener('portal:session-ready',()=>{
 if(window.RegulationAuth?.getToken?.()!==pageToken){resetPage();if(!initializing)initialize();}
 else if(!session&&!initializing)initialize();
});
window.addEventListener('portal:background-refresh',()=>{if(!session&&!initializing)initialize();});
initialize();
