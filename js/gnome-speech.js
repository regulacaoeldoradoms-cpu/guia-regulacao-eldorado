import {gnomeReadingDuration} from './gnome-reading-time.js';

export class GnomeSpeech {
  constructor(catalog,storage=null,key=null,{now=Date.now,random=Math.random}={}) {
    this.now=now;this.random=random;this.storage=storage;this.key=key;this.catalog=catalog;
    this.texts=new Map(catalog.phrases.map(p=>[p.id,p.text]));this.ids=[...this.texts.keys()];
    let saved;try{saved=JSON.parse(storage?.getItem(key));}catch{}
    const valid=saved?.version===catalog.version&&Array.isArray(saved.remaining)&&new Set(saved.remaining).size===saved.remaining.length&&saved.remaining.every(id=>this.texts.has(id))&&(saved.lastId===null||this.texts.has(saved.lastId))&&!saved.remaining.includes(saved.lastId);
    this.remaining=valid?[...saved.remaining]:[];this.lastId=valid?saved.lastId:null;
    const time=now();this.nextAt=valid&&Number.isFinite(saved.nextAt)?saved.nextAt:time+25000;
    this.bubbleUntil=valid&&Number.isFinite(saved.bubbleUntil)?saved.bubbleUntil:0;
    this.pausedAt=valid&&Number.isFinite(saved.pausedAt)?saved.pausedAt:null;
    this.save();
  }
  setSuppressed(suppressed,time=this.now()) {
    if(suppressed&&this.pausedAt===null){this.pausedAt=time;this.save();}
    else if(!suppressed&&this.pausedAt!==null){const delta=Math.max(0,time-this.pausedAt);this.nextAt+=delta;if(this.bubbleUntil)this.bubbleUntil+=delta;this.pausedAt=null;this.save();}
  }
  advance(time=this.now()) {
    if(this.pausedAt!==null||time<this.nextAt||time<this.bubbleUntil)return false;
    if(!this.remaining.length){
      this.remaining=[...this.ids];for(let i=this.remaining.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.remaining[i],this.remaining[j]]=[this.remaining[j],this.remaining[i]];}
      if(this.remaining.length>1&&this.remaining[0]===this.lastId)[this.remaining[0],this.remaining[1]]=[this.remaining[1],this.remaining[0]];
    }
    this.lastId=this.remaining.shift();this.bubbleUntil=time+gnomeReadingDuration(this.texts.get(this.lastId));
    this.nextAt=this.bubbleUntil+25000+this.random()*15000;this.save();return true;
  }
  text(time=this.now()){return (this.pausedAt??time)<this.bubbleUntil?this.texts.get(this.lastId)||'':'';}
  save(){try{if(this.key)this.storage?.setItem(this.key,JSON.stringify({version:this.catalog.version,remaining:this.remaining,lastId:this.lastId,nextAt:this.nextAt,bubbleUntil:this.bubbleUntil,pausedAt:this.pausedAt}));}catch{}}
}

export async function gnomeSpeechForSession(api) {
  const catalog=await api.get('gnome-speech');
  if(!catalog?.version||!Array.isArray(catalog.phrases)||!catalog.phrases.length||catalog.phrases.some(p=>typeof p.id!=='string'||typeof p.text!=='string'||p.text.length>300)||new Set(catalog.phrases.map(p=>p.id)).size!==catalog.phrases.length)throw Error('Falas indisponíveis.');
  let storage=null,key=null;
  try{storage=sessionStorage;const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(api.token));key='portal:pets:gnome-speech:'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}catch{}
  return new GnomeSpeech(catalog,storage,key);
}
