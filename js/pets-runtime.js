'use strict';
import {gnomeCompanionState} from './pet-companions.js?v=20261012-gnome-coexist-1';
import {PetSpeechCoordinator} from './pet-speech-coordinator.js?v=20261012-gnome-coexist-1';
import {drawCat,drawBed} from './pet-cat-frames.js';
import {PetSpeech} from './pet-phrases.js?v=pet-phrases-20261009-cycle-1';
import {drawGnome,loadGnomeFrames} from './gnome-frames.js?v=20261012-gnome-2';
import {gnomeSpeechForSession} from './gnome-speech.js?v=20261012-gnome-2';
function compatiblePetState(state){if(state.gnomeCompanion&&state.rules?.gnomeCompanionSlots!==1){const {gnomeCompanion,...compatible}=state;return compatible;}return state;}
export class PetRuntime{
 constructor(api,state,onChange=()=>{},speech=new PetSpeech(),options={}){
  this.secondary=Boolean(options.secondary);this.speaker=this.secondary?'gnome':'primary';this.coordinator=options.coordinator||null;this.gnomeRuntime=null;
  this.api=api;this.state=compatiblePetState(state);this.onChange=onChange;this.closed=false;this.action='idle';this.queue=[];this.until=0;this.x=150;this.y=innerHeight-130;
  this.tabId=crypto.randomUUID();this.sequence=0;this.leaseToken='';this.lastInteraction=0;this.eligibleBefore=false;this.frame=0;this.lastPaint=0;this.speech=speech;this.catSpeech=speech;this.speechEpoch=0;
  this.root=document.createElement('div');this.root.className='pet-stage';if(this.secondary)this.root.classList.add('pet-stage-secondary');if(this.secondary)this.root.setAttribute('data-pet-pair-present','');this.root.setAttribute('aria-hidden','true');
  this.cat=document.createElement('canvas');this.cat.width=64;this.cat.height=48;this.cat.className='pet-cat';
  this.bed=document.createElement('canvas');this.bed.width=80;this.bed.height=30;this.bed.className='pet-bed';
  this.bubble=document.createElement('span');this.bubble.className='pet-bubble';this.root.append(this.bed,this.cat,this.bubble);
  this.habitat=document.getElementById('petHabitat');this.ownsHabitat=!this.habitat;
  if(this.ownsHabitat){
   // A companion follows the viewport on every module. Only the care page owns an inline habitat.
   this.root.classList.add('pet-stage-global');this.habitat=this.root;document.body.append(this.root);
  }else this.habitat.append(this.root);
  this.controller=new AbortController();const signal=this.controller.signal;
  const mark=event=>{if(event.isTrusted)this.lastInteraction=performance.now();};
  for(const event of ['pointerdown','keydown','wheel','touchstart'])document.addEventListener(event,mark,{passive:true,signal});
  window.addEventListener('resize',()=>this.layout(),{signal});window.visualViewport?.addEventListener('resize',()=>this.layout(),{signal});
  window.visualViewport?.addEventListener('scroll',()=>this.layout(),{signal});
  this.observer=new ResizeObserver(()=>this.layout());this.observer.observe(this.root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.coordinator?.suspend();this.speech.setSuppressed?.(true);cancelAnimationFrame(this.frame);this.sample(false);}else{this.coordinator?.resume();this.lastPaint=0;this.refresh();this.start();}},{signal});
  window.addEventListener('pagehide',()=>{this.coordinator?.suspend();this.sample(false);cancelAnimationFrame(this.frame);},{signal});
  window.addEventListener('pageshow',()=>{this.coordinator?.resume();this.start();this.refresh();},{signal});
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.reduced.addEventListener('change',()=>{this.layout();this.start();},{signal});
  this.timer=this.secondary?null:setInterval(()=>this.sample(),60000);this.syncSpecies();this.layout();this.start();if(!this.secondary)this.syncCompanion();
 }
 syncCompanion(){
  const child=gnomeCompanionState(this.state),present=Boolean(child?.pet&&child.life?.deadAt==null);
  this.root.toggleAttribute('data-pet-pair-present',present);
  if(!present){if(this.gnomeRuntime){this.coordinator?.remove('gnome');this.gnomeRuntime.close();this.gnomeRuntime=null;}this.coordinator?.close();this.coordinator=null;if(!this.ownsHabitat)this.habitat.removeAttribute('data-pet-pair');return;}
  if(!this.coordinator){this.coordinator=new PetSpeechCoordinator();this.render();}
  if(!this.ownsHabitat)this.habitat.dataset.petPair='true';
  if(this.gnomeRuntime){this.gnomeRuntime.update(child);return;}
  const parent=this,api={token:this.api.token,valid:()=>parent.api.valid(),get:path=>parent.api.get(path),command:async(kind,input,options)=>{const result=await parent.api.command(kind,{...input,petTarget:'gnome'},options);if(!parent.closed)parent.update(result.state);return {...result,state:gnomeCompanionState(result.state)};}};
  this.gnomeRuntime=new PetRuntime(api,child,()=>{},this.catSpeech,{secondary:true,coordinator:this.coordinator});
  this.gnomeRuntime.x=this.gnomeRuntime.bounds.right;this.gnomeRuntime.y=this.y-140;this.gnomeRuntime.layout();
 }
 syncSpecies(){
  const generation=++this.speechEpoch,gnome=this.state.pet?.typeId==='gnome';
  this.root.dataset.petType=gnome?'gnome':'cat';this.cat.height=gnome?64:48;
  if(!gnome){this.speech=this.catSpeech;return;}
  this.speech={text:()=>'',advance:()=>false};
  Promise.all([loadGnomeFrames(),gnomeSpeechForSession(this.api)]).then(([,speech])=>{if(!this.closed&&generation===this.speechEpoch&&this.state.pet?.typeId==='gnome'){this.speech=speech;this.render();}}).catch(()=>{});
 }
 update(s){
  s=compatiblePetState(s);
  if(s.revision<this.state.revision)return; // A delayed response cannot revive an older life state.
  if(s.petRevision!==this.state.petRevision){this.queue=[];this.until=0;this.goingToBed=false;this.target=null;this.action='idle';}
  const changed=s.pet?.typeId!==this.state.pet?.typeId;
  this.state=s;if(changed)this.syncSpecies();if(!this.secondary)this.syncCompanion();this.onChange(s);this.layout();this.render();if(s.pet&&s.preferences.visible&&!document.hidden)this.start();
 }
 attachHabitat(habitat){
  if(this.closed)return;
  this.ownsHabitat=!habitat;this.habitat=habitat||this.root;
  this.root.classList.toggle('pet-stage-global',this.ownsHabitat);
  for(const property of ['left','top','width','height'])this.root.style.removeProperty(property);
  (habitat||document.body).append(this.root);this.previewPlacement=null;if(habitat&&!this.secondary&&this.gnomeRuntime)habitat.dataset.petPair='true';this.layout();if(!this.secondary&&this.gnomeRuntime){this.gnomeRuntime.attachHabitat(habitat);if(habitat){this.x=this.bounds.left;this.y=this.bounds.bottom;this.gnomeRuntime.x=this.gnomeRuntime.bounds.right;this.gnomeRuntime.y=this.gnomeRuntime.x-this.x>=136?this.y:this.gnomeRuntime.bounds.top;this.gnomeRuntime.layout();this.render();}}
 }
 close(){if(!this.secondary){this.gnomeRuntime?.close();this.coordinator?.close();}else this.coordinator?.remove(this.speaker);this.closed=true;this.speech.setSuppressed?.(true);cancelAnimationFrame(this.frame);clearInterval(this.timer);this.controller.abort();this.observer.disconnect();this.root.remove();if(this.ownsHabitat)this.habitat.remove();else if(!this.secondary)this.habitat.hidden=true;}
 safeRect(){
  // Both scenes use the same logical grid and scale; the global scene follows the viewport.
  const width=this.root.clientWidth||176,height=this.root.clientHeight||224;
  if(this.ownsHabitat){
   let ceiling=0;const sceneTop=this.root.getBoundingClientRect().top;
   for(const header of document.querySelectorAll('.portal-topbar,.site-header,.social-global-nav')){
    const rect=header.getBoundingClientRect();
    if(rect.width&&rect.height&&rect.top<=sceneTop+120&&rect.bottom>sceneTop)ceiling=Math.max(ceiling,rect.bottom-sceneTop);
   }
   const bottom=Math.max(104,height-24);
   return {left:88,right:Math.max(88,width-88),top:Math.min(bottom,ceiling+(this.state.pet?.typeId==='gnome'?136:104)),bottom};
  }
  return {left:88,right:Math.max(88,width-88),top:164,bottom:Math.max(164,height-24)};
 }
 layout(){
  if(this.ownsHabitat){
   const viewport=window.visualViewport;
   const width=viewport?.width||innerWidth,height=viewport?.height||innerHeight;
   const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0;
   let floor=top+height-12;
   for(const nav of document.querySelectorAll('.social-mobile-nav')){
    const rect=nav.getBoundingClientRect();
    if(rect.width&&rect.height&&rect.top<floor&&rect.bottom>=top+height-20)floor=rect.top-12;
   }
   this.root.style.left=left+'px';this.root.style.top=top+'px';this.root.style.width=width+'px';this.root.style.height=Math.max(104,floor-top)+'px';
  }
  const r=this.safeRect();this.bounds=r;this.x=Math.max(r.left,Math.min(r.right,this.x));this.y=Math.max(r.top,Math.min(r.bottom,this.y));
  const placement=this.previewPlacement||this.state.placement;
  if(!this.ownsHabitat&&this.root.hasAttribute('data-pet-pair-present')&&!placement&&(!this.state.preferences.motionEnabled||this.reduced.matches)){this.x=this.secondary?r.right:r.left;this.y=this.secondary&&r.right-r.left<136?r.top:r.bottom;}
  this.bedPoint=placement?{x:r.left+(r.right-r.left)*placement.x,y:r.top+(r.bottom-r.top)*placement.y}:null;
  if(this.bedPoint&&this.action==='sleep'){this.x=this.bedPoint.x;this.y=this.bedPoint.y-12;}
  if(this.bedPoint&&this.goingToBed)this.target={x:this.bedPoint.x,y:this.bedPoint.y-12};
  else if(this.target)this.target={x:Math.max(r.left,Math.min(r.right,this.target.x)),y:Math.max(r.top,Math.min(r.bottom,this.target.y))};
  this.bed.hidden=this.ownsHabitat||!placement; if(placement){
   this.bed.style.left=(this.bedPoint.x-80)+'px';this.bed.style.top=(this.bedPoint.y-40)+'px';drawBed(this.bed.getContext('2d'),placement.itemId);
  }
  this.render();
 }
 preview(p){this.previewPlacement=p;this.layout();}
 choose(now){
  const tired=this.state.awakeSeconds>=this.state.rules.sleepAfterSeconds;
  if(tired){
   if(this.bedPoint&&Math.hypot(this.x-this.bedPoint.x,this.y-this.bedPoint.y+12)>8){
    this.target={x:this.bedPoint.x,y:this.bedPoint.y-12};this.action='walk';this.goingToBed=true;this.until=now+45000;return;
   }
   this.action='sleep';this.until=now+45000;this.rest();return;
  }
  const routines=this.state.pet?.typeId==='gnome'?[['walk'],['run','idle'],['scratch','idle'],['walk','trip','idle'],['laugh','idle'],['dance','idle'],['nap','idle']]:[['walk'],['run','idle'],['sit','lick','idle'],['lie','roll','belly','roll','wake'],['stretch','idle'],['idle']];
  this.queue=routines[Math.floor(Math.random()*routines.length)].slice();this.advance(now);
 }
 advance(now){
  this.action=this.queue.shift()||'idle';
  this.actionStarted=now;
  const durations={walk:7000,run:3500,sit:1100,lick:6000,lie:1200,roll:1200,belly:6000,wake:1400,stretch:3000,idle:5000,scratch:4500,trip:2000,laugh:4000,dance:6000,nap:8000};
  this.until=now+(durations[this.action]||5000);
  if(['walk','run'].includes(this.action)){
   const r=this.bounds;this.target=this.ownsHabitat?{x:r.left+(r.right-r.left)*Math.random(),y:r.top+(r.bottom-r.top)*Math.random()}:{x:Math.max(r.left,Math.min(r.right,this.x+(Math.random()-.5)*300)),y:this.y};
  }
 }
 async rest(){
  if(this.resting||this.closed||this.state.life?.deadAt!=null)return;this.resting=true;
  try{const result=await this.api.command('care',{action:'rest',expectedPetRevision:this.state.petRevision});if(!this.closed)this.update(result.state);}
  catch{}finally{this.resting=false;}
 }
 async refresh(){if(this.secondary)return;try{const p=await this.api.get('me');if(!this.closed)this.update(p.state);}catch{}}
 async sample(force){
  if(this.secondary||this.closed||!this.state.pet||this.sampling)return;
  const eligible=force!==false&&!document.hidden&&document.hasFocus()&&performance.now()-this.lastInteraction<=60000&&this.lastInteraction>0;
  if(!eligible&&!this.eligibleBefore)return;
  this.sampling=true;this.eligibleBefore=eligible;
  try{
   const result=await this.api.command('activity',{tabId:this.tabId,sequence:++this.sequence,leaseToken:this.leaseToken,visible:eligible,focused:eligible,recentlyInteracted:eligible},{keepalive:force===false});
   if(!this.closed){this.leaseToken=result.receipt.leaseToken||this.leaseToken;this.update(result.state);}
  }catch(e){if(e.code==='ACTIVITY_LEASE_BUSY')this.leaseToken='';}
  finally{this.sampling=false;}
 }
 render(){
  const modalOpen=this.ownsHabitat&&[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0;});
  const s=this.state;this.root.hidden=!s.pet||s.life?.deadAt!=null||!s.preferences.visible||modalOpen;if(this.ownsHabitat)this.habitat.hidden=this.root.hidden;else if(!this.secondary)this.habitat.hidden=this.root.hidden&&!(s.gnomeCompanion?.pet&&s.gnomeCompanion.life?.deadAt==null&&s.preferences.visible);
  const motion=s.preferences.motionEnabled&&!this.reduced.matches;
  const alert=s.thirst>=70?'Estou com sede. Água é gratuita.':s.hunger>=70?'Estou com fome. Comida é gratuita.':s.dirt>=70?'Hora de um banho. Higiene básica é gratuita.':'';
  this.needsAlert=alert;
  this.root.dataset.alert=s.thirst>=70?'thirst':s.hunger>=70?'hunger':'';
  const time=Date.now();if(this.root.hidden&&(!s.pet||s.life?.deadAt!=null))this.coordinator?.remove(this.speaker);this.bubble.dataset.speaker=s.pet?.typeId==='gnome'?'Gnomo':'Gato';this.bubble.textContent=this.coordinator?this.coordinator.present(this.speaker,{active:!this.root.hidden&&!document.hidden,neutralAllowed:motion,alert,text:this.speech.text(),until:this.speech.bubbleUntil||0,due:time>=this.speech.nextAt},time):alert||this.speech.text();
  this.bubble.hidden=!this.bubble.textContent;
  const action=motion?this.action:(s.awakeSeconds>=s.rules.sleepAfterSeconds?'sleep':'idle');
  this.speech.setSuppressed?.(this.root.hidden||document.hidden||!motion||Boolean(alert)||Boolean(this.coordinator?.blocked(this.speaker)));
  if(s.pet?.typeId==='gnome'){const elapsed=Math.max(0,(performance.now()-(this.actionStarted||0))/160);drawGnome(this.cat.getContext('2d'),action,motion?(action==='trip'?Math.min(7,elapsed):elapsed):0);}
  else drawCat(this.cat.getContext('2d'),action,motion?performance.now()/160:0,s.pet?.variant,s.collar);
  this.cat.style.left=(this.x-64)+'px';this.cat.style.top=(this.y-(s.pet?.typeId==='gnome'?120:88))+'px';
  this.cat.style.transform=this.facing===-1?'scaleX(-1)':'';
  if(!this.secondary)this.gnomeRuntime?.render();
  this.bubble.style.left=Math.max(8,Math.min(this.root.clientWidth-this.bubble.offsetWidth-8,this.x-110))+'px';this.bubble.style.top=(this.ownsHabitat?Math.max(8,this.y-150):12)+'px';
 }
 start(){
  cancelAnimationFrame(this.frame);if(this.closed||document.hidden||!this.state.pet||this.state.life?.deadAt!=null||!this.state.preferences.visible)return;
  const tick=now=>{
   if(this.closed||document.hidden||!this.state.preferences.visible)return;
   if(now-this.lastPaint>=80){
    if(this.ownsHabitat&&(!this.lastLayout||now-this.lastLayout>=500)){this.lastLayout=now;this.layout();}
    const dt=Math.min(.12,(now-this.lastPaint)/1000||.08);this.lastPaint=now;
    if(this.state.preferences.motionEnabled&&!this.reduced.matches){
     if(!this.until||now>=this.until){if(this.queue.length)this.advance(now);else this.choose(now);}
     if(['walk','run'].includes(this.action)&&this.target){
      const dx=this.target.x-this.x,dy=this.target.y-this.y,d=Math.hypot(dx,dy),speed=this.action==='run'?85:42;
      if(d>2){this.x+=dx/d*Math.min(d,speed*dt);this.y+=dy/d*Math.min(d,speed*dt);this.facing=dx<0?-1:1;}
      else if(this.goingToBed){this.goingToBed=false;this.action='sleep';this.until=now+45000;this.rest();}
     }
    }
    this.render();
    if(this.state.preferences.motionEnabled&&!this.reduced.matches&&!this.root.hidden&&!this.needsAlert&&(!this.coordinator||this.coordinator.canAdvance(this.speaker))&&this.speech.advance())this.render();
   }
   if(this.state.preferences.motionEnabled&&!this.reduced.matches)this.frame=requestAnimationFrame(tick);
  };
  this.frame=requestAnimationFrame(tick);
 }
}
