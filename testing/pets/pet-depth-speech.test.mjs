import {PetSpeechCoordinator} from '../../js/pet-speech-coordinator.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {frontPet} from '../../js/pet-depth.mjs';
import {alphaBounds,spriteRect,speechPosition} from '../../js/pet-speech-position.mjs';
test('Ground crossing switches front actor in both directions and equal feet retain previous order',()=>{
 let front='gnome';for(const [p,g,want]of [[100,101,'gnome'],[102,101,'primary'],[101,101,'primary'],[100,101,'gnome'],[100,100,'gnome']]){front=frontPet(p,g,front);assert.equal(front,want);}
});
test('Visible alpha bounds exclude transparent padding and mirror around the same ground anchor',()=>{
 const data=new Uint8ClampedArray(4*10*10);data[(2*10+3)*4+3]=16;data[(7*10+8)*4+3]=255;data[(0*10+0)*4+3]=15;
 const bounds=alphaBounds(data,10,10);assert.deepEqual(bounds,{left:3,top:2,right:9,bottom:8});
 const geometry={width:100,height:100,x:50,y:90},a=spriteRect(bounds,{width:10,height:10},geometry,200,300),b=spriteRect(bounds,{width:10,height:10},geometry,200,300,-1);
 assert.equal(a.top,b.top);assert.equal(a.bottom,b.bottom);assert.equal(a.left,400-b.right);assert.equal(a.right,400-b.left);
});
test('Speech sits above actual head, then chooses a clear side at top edge, without using body as fallback',()=>{
 const scene={width:390,height:700},bubble={width:130,height:80};
 assert.deepEqual(speechPosition({left:100,right:200,top:200,bottom:340},bubble,scene),{left:85,top:108,side:'above'});
 const side=speechPosition({left:100,right:200,top:10,bottom:150},bubble,scene);assert.equal(side.side,'right');assert.equal(side.left,212);assert(side.top>=8);
 const narrow=speechPosition({left:120,right:250,top:10,bottom:650},{width:260,height:600},scene);assert.equal(narrow.side,'right');assert.equal(narrow.maxWidth,120);
});

test('Near the top, a full-width bubble may fit wholly below the visible body when neither side fits',()=>{const p=speechPosition({left:80,right:190,top:40,bottom:180},{width:250,height:100},{width:268,height:320});assert.equal(p.side,'below');assert.equal(p.top,192);assert(p.top+100<=312);});

test('Reading extends only the visible owner lease and does not create another bubble or backlog',()=>{let now=0;const c=new PetSpeechCoordinator({now:()=>now});c.present('gnome',{active:true,neutralAllowed:true,text:'Texto sintético.',until:1000});now=5000;c.keepReading('primary',now);assert.equal(c.current.until,1000);c.keepReading('gnome',now);assert.equal(c.current.until,6000);assert.equal(c.present('primary',{active:true,neutralAllowed:true,text:'Outro.',until:20000}), '');assert.equal(c.current.id,'gnome');c.remove('gnome');assert.equal(c.current,null);});
