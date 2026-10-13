import {gnomeReadingDuration} from './gnome-reading-time.js';
// One current lease and the latest state of each speaker. No queue of old phrases.
export class PetSpeechCoordinator {
 constructor({now=Date.now,gapMs=800}={}){this.now=now;this.gapMs=gapMs;this.entries=new Map();this.current=null;this.lastSpeaker=null;this.gapUntil=0;this.pausedAt=null;this.closed=false;}
 expire(time){if(this.current&&time>=this.current.until){this.lastSpeaker=this.current.id;this.current=null;this.gapUntil=time+this.gapMs;}}
 suspend(time=this.now()){if(this.pausedAt===null)this.pausedAt=time;}
 resume(time=this.now()){if(this.pausedAt!==null){const delta=Math.max(0,time-this.pausedAt);if(this.current)this.current.until+=delta;this.gapUntil+=delta;this.pausedAt=null;}}
 remove(id){this.entries.delete(id);if(this.current?.id===id){this.current=null;this.gapUntil=this.now()+this.gapMs;}}
 close(){this.closed=true;this.entries.clear();this.current=null;this.pausedAt=null;}
 next(entries){return entries.find(entry=>entry.id!==this.lastSpeaker)||entries[0];}
 present(id,entry,time=this.now()){
  if(this.closed)return '';
  this.entries.set(id,{...entry,id});
  if(this.current?.kind==='alert'&&this.current.id===id&&entry.alert!==this.current.text){this.current=null;this.gapUntil=time+this.gapMs;}
  if(!entry.active){if(![...this.entries.values()].some(item=>item.active))this.suspend(time);return '';}
  if(this.pausedAt!==null)this.resume(time);
  this.expire(time);
  if(this.current)return this.current.id===id?this.current.text:'';
  if(time<this.gapUntil)return '';
  const alerts=[...this.entries.values()].filter(item=>item.active&&item.alert);
  const speaker=alerts.length?this.next(alerts):this.next([...this.entries.values()].filter(item=>item.active&&item.neutralAllowed&&item.text&&item.until>time));
  if(!speaker||speaker.id!==id)return '';
  const text=alerts.length?speaker.alert:speaker.text,kind=alerts.length?'alert':'neutral';
  const duration=kind==='alert'?Math.max(7000,gnomeReadingDuration(text)):Math.max(0,speaker.until-time);
  this.current={id,text,kind,until:time+duration};return text;
 }
 keepReading(id,time=this.now()){if(this.current?.id===id)this.current.until=Math.max(this.current.until,time+1000);}
 canAdvance(id,time=this.now()){
  if(this.closed||this.pausedAt!==null)return false;this.expire(time);
  if(this.current||time<this.gapUntil)return false;
  if([...this.entries.values()].some(entry=>entry.active&&entry.alert))return false;
  const due=[...this.entries.values()].filter(entry=>entry.active&&entry.neutralAllowed&&entry.due);
  return this.next(due)?.id===id;
 }
 blocked(id,time=this.now()){this.expire(time);return Boolean(this.pausedAt!==null||this.current&&this.current.id!==id||time<this.gapUntil);}
}
