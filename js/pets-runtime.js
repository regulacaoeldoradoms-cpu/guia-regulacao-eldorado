'use strict';
import {drawCat,drawBed} from './pet-cat-frames.js';
const phrases=['Uma pausa também faz bem.','Miau. Que bom estar por aqui.','Minha água está sempre por perto.','Vou cuidar da minha patinha.'];
export class PetRuntime{
 constructor(api,state,onChange=()=>{}){
  this.api=api;this.state=state;this.onChange=onChange;this.closed=false;this.action='idle';this.queue=[];this.until=0;this.x=150;this.y=innerHeight-130;
  this.tabId=crypto.randomUUID();this.sequence=0;this.leaseToken='';this.lastInteraction=0;this.eligibleBefore=false;this.frame=0;this.lastPaint=0;this.nextBubble=performance.now()+45000;
  this.root=document.createElement('div');this.root.className='pet-stage';this.root.setAttribute('aria-hidden','true');
  this.cat=document.createElement('canvas');this.cat.width=64;this.cat.height=48;this.cat.className='pet-cat';
  this.bed=document.createElement('canvas');this.bed.width=80;this.bed.height=30;this.bed.className='pet-bed';
  this.bubble=document.createElement('span');this.bubble.className='pet-bubble';this.root.append(this.bed,this.cat,this.bubble);document.body.append(this.root);
  this.controller=new AbortController();const signal=this.controller.signal;
  const mark=event=>{if(event.isTrusted)this.lastInteraction=performance.now();};
  for(const event of ['pointerdown','keydown','wheel','touchstart'])document.addEventListener(event,mark,{passive:true,signal});
  window.addEventListener('resize',()=>this.layout(),{signal});window.visualViewport?.addEventListener('resize',()=>this.layout(),{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.frame);this.sample(false);}else{this.lastPaint=0;this.refresh();this.start();}},{signal});
  window.addEventListener('pagehide',()=>{this.sample(false);cancelAnimationFrame(this.frame);},{signal});
  window.addEventListener('pageshow',()=>{this.start();this.refresh();},{signal});
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.reduced.addEventListener('change',()=>{this.render();this.start();},{signal});
  this.timer=setInterval(()=>this.sample(),60000);this.layout();this.start();
 }
 update(s){this.state=s;this.onChange(s);this.layout();this.render();if(s.pet&&s.preferences.visible&&!document.hidden)this.start();}
 close(){this.closed=true;cancelAnimationFrame(this.frame);clearInterval(this.timer);this.controller.abort();this.root.remove();}
 safeRect(){
  const view=window.visualViewport;const width=view?.width||innerWidth,height=view?.height||innerHeight;
  const nav=document.querySelector('.social-mobile-nav');
  const bottom=nav&&getComputedStyle(nav).display!=='none'?Math.max(20,height-nav.getBoundingClientRect().top):20;
  return {left:88,right:Math.max(88,width-88),top:130,bottom:Math.max(130,height-bottom-24)};
 }
 layout(){
  const r=this.safeRect();this.bounds=r;this.x=Math.max(r.left,Math.min(r.right,this.x));this.y=Math.max(r.top,Math.min(r.bottom,this.y));
  const placement=this.previewPlacement||this.state.placement;
  this.bedPoint=placement?{x:r.left+(r.right-r.left)*placement.x,y:r.top+(r.bottom-r.top)*placement.y}:null;
  this.bed.hidden=!placement; if(placement){
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
  const routines=[['walk'],['run','idle'],['sit','lick','idle'],['lie','roll','belly','roll','wake'],['stretch','idle'],['idle']];
  this.queue=routines[Math.floor(Math.random()*routines.length)].slice();this.advance(now);
 }
 advance(now){
  this.action=this.queue.shift()||'idle';
  const durations={walk:7000,run:3500,sit:1100,lick:6000,lie:1200,roll:1200,belly:6000,wake:1400,stretch:3000,idle:5000};
  this.until=now+(durations[this.action]||5000);
  if(['walk','run'].includes(this.action)){
   const r=this.bounds;this.target={x:Math.max(r.left,Math.min(r.right,this.x+(Math.random()-.5)*300)),y:this.y};
  }
 }
 async rest(){
  if(this.resting||this.closed)return;this.resting=true;
  try{const result=await this.api.command('care',{action:'rest',expectedPetRevision:this.state.petRevision});if(!this.closed)this.update(result.state);}
  catch{}finally{this.resting=false;}
 }
 async refresh(){try{const p=await this.api.get('me');if(!this.closed)this.update(p.state);}catch{}}
 async sample(force){
  if(this.closed||!this.state.pet||this.sampling)return;
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
  const s=this.state;this.root.hidden=!s.pet||!s.preferences.visible;
  const motion=s.preferences.motionEnabled&&!this.reduced.matches;
  const alert=s.thirst>=70?'Estou com sede. Água é gratuita.':s.hunger>=70?'Estou com fome. Comida é gratuita.':s.dirt>=70?'Hora de um banho. Higiene básica é gratuita.':'';
  this.root.dataset.alert=s.thirst>=70?'thirst':s.hunger>=70?'hunger':'';
  this.bubble.textContent=alert||(performance.now()<this.bubbleUntil?this.phrase:'');
  this.bubble.hidden=!this.bubble.textContent;
  const action=motion?this.action:(s.awakeSeconds>=s.rules.sleepAfterSeconds?'sleep':'idle');
  drawCat(this.cat.getContext('2d'),action,motion?performance.now()/160:0,s.pet?.variant,s.collar);
  this.cat.style.left=(this.x-64)+'px';this.cat.style.top=(this.y-88)+'px';
  this.cat.style.transform=this.facing===-1?'scaleX(-1)':'';
  this.bubble.style.left=Math.max(8,Math.min(innerWidth-240,this.x-110))+'px';this.bubble.style.top=Math.max(12,this.y-126)+'px';
 }
 start(){
  cancelAnimationFrame(this.frame);if(this.closed||document.hidden||!this.state.pet||!this.state.preferences.visible)return;
  const tick=now=>{
   if(this.closed||document.hidden||!this.state.preferences.visible)return;
   if(now-this.lastPaint>=80){
    const dt=Math.min(.12,(now-this.lastPaint)/1000||.08);this.lastPaint=now;
    if(this.state.preferences.motionEnabled&&!this.reduced.matches){
     if(!this.until||now>=this.until){if(this.queue.length)this.advance(now);else this.choose(now);}
     if(['walk','run'].includes(this.action)&&this.target){
      const dx=this.target.x-this.x,dy=this.target.y-this.y,d=Math.hypot(dx,dy),speed=this.action==='run'?85:42;
      if(d>2){this.x+=dx/d*Math.min(d,speed*dt);this.y+=dy/d*Math.min(d,speed*dt);this.facing=dx<0?-1:1;}
      else if(this.goingToBed){this.goingToBed=false;this.action='sleep';this.until=now+45000;this.rest();}
     }
     if(now>=this.nextBubble){this.phrase=phrases[Math.floor(Math.random()*phrases.length)];this.bubbleUntil=now+4500;this.nextBubble=now+45000+Math.random()*30000;}
    }
    this.render();
   }
   if(this.state.preferences.motionEnabled&&!this.reduced.matches)this.frame=requestAnimationFrame(tick);
  };
  this.frame=requestAnimationFrame(tick);
 }
}
