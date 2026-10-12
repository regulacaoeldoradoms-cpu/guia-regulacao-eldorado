import test from 'node:test';
import assert from 'node:assert/strict';
import {GnomeSpeech} from '../../js/gnome-speech.js';
import {GNOME_PHRASE_CATALOG,GNOME_PHRASE_VERSION} from '../../_server/gnome-phrases.js';
import {gnomeReadingDuration} from '../../js/gnome-reading-time.js';
import {PET_SPEECH_TIMING} from '../../js/pet-phrases.js';
const catalog={version:GNOME_PHRASE_VERSION,phrases:GNOME_PHRASE_CATALOG};
test('two complete cycles deliver every approved phrase without immediate repetition',()=>{
 let now=0;const speech=new GnomeSpeech(catalog,null,null,{now:()=>now,random:()=>0.25});let last;
 for(let cycle=0;cycle<2;cycle++){
  const seen=new Set();for(let i=0;i<55;i++){now=speech.nextAt;assert(speech.advance());assert.notEqual(speech.lastId,last);seen.add(speech.lastId);last=speech.lastId;assert.equal(speech.bubbleUntil-now,gnomeReadingDuration(speech.text()));assert(!speech.advance(now+1));}
  assert.equal(seen.size,55);
 }
 assert.equal(PET_SPEECH_TIMING.bubbleMs,7000);
});
test('hidden tabs and urgent needs pause the current bubble and next deadline',()=>{
 let now=0;const storage=new Map(),saved={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)};
 const speech=new GnomeSpeech(catalog,saved,'synthetic',{now:()=>now,random:()=>0});now=speech.nextAt;speech.advance();const text=speech.text(),until=speech.bubbleUntil,next=speech.nextAt;
 now+=1000;speech.setSuppressed(true);now+=300000;assert(!speech.advance());assert.equal(speech.text(),text);
 const restored=new GnomeSpeech(catalog,saved,'synthetic',{now:()=>now,random:()=>0});restored.setSuppressed(false);assert.equal(restored.bubbleUntil,until+300000);assert.equal(restored.nextAt,next+300000);assert.equal(restored.text(),text);
 const payload=JSON.parse(storage.get('synthetic'));assert(!('text' in payload));assert(!storage.get('synthetic').includes(text));
 now=restored.bubbleUntil-1;assert.equal(restored.text(),text);now=restored.bubbleUntil;assert.equal(restored.text(),'');
});
