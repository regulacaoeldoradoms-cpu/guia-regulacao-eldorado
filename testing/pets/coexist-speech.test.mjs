import test from 'node:test';import assert from 'node:assert/strict';import {PetSpeechCoordinator} from '../../js/pet-speech-coordinator.js';
const entry=(text,until,extra={})=>({active:true,neutralAllowed:true,text,until,alert:'',due:false,...extra});
test('one bubble lease holds full reading duration and enforces a small reciprocal gap',()=>{
 let now=1000;const c=new PetSpeechCoordinator({now:()=>now});assert.equal(c.present('primary',entry('Frase do gato.',8000)),'Frase do gato.');assert.equal(c.present('gnome',entry('Frase do Gnomo.',15000)),'');now=7999;assert.equal(c.present('gnome',entry('Frase do Gnomo.',15000)),'');now=8000;assert.equal(c.present('gnome',entry('Frase do Gnomo.',15000)),'');now=8800;assert.equal(c.present('gnome',entry('Frase do Gnomo.',15000)),'Frase do Gnomo.');assert.equal(c.present('primary',entry('Frase do gato.',20000)),'');
});
test('blocked neutral cycles cannot advance or consume phrases; simultaneous due speakers alternate',()=>{
 let now=0;const c=new PetSpeechCoordinator({now:()=>now});const due=entry('',0,{due:true});c.present('primary',due);c.present('gnome',due);assert.equal(c.canAdvance('primary'),true);assert.equal(c.canAdvance('gnome'),false);c.present('primary',entry('Gato falando.',7000));assert.equal(c.canAdvance('gnome'),false);now=7000;c.present('gnome',due);now=7800;assert.equal(c.canAdvance('gnome'),true);assert.equal(c.canAdvance('primary'),false);
});
test('alerts take priority without overlap or a queue of stale needs, and resolved alerts are discarded',()=>{
 let now=0;const c=new PetSpeechCoordinator({now:()=>now});c.present('primary',entry('Gato falando.',7000));c.present('gnome',entry('',0,{alert:'Estou com sede. Água é gratuita.'}));assert.equal(c.present('gnome',entry('',0,{alert:'Estou com fome. Comida é gratuita.'})), '');now=7000;c.present('primary',entry('',0));now=7800;assert.equal(c.present('gnome',entry('',0,{alert:'Estou com fome. Comida é gratuita.'})),'Estou com fome. Comida é gratuita.');assert.equal(c.present('primary',entry('',0,{alert:'Hora de um banho. Higiene básica é gratuita.'})), '');c.present('gnome',entry('',0));now=8600;assert.equal(c.present('primary',entry('',0,{alert:'Hora de um banho. Higiene básica é gratuita.'})),'Hora de um banho. Higiene básica é gratuita.');
});
test('hidden pages pause reading and resume the same owner, not an old backlog',()=>{
 let now=0;const c=new PetSpeechCoordinator({now:()=>now});c.present('gnome',entry('Gnomo falando.',12000));now=1000;c.suspend();now=31000;c.resume();assert.equal(c.present('primary',entry('',0)), '');assert.equal(c.present('gnome',entry('',0)),'Gnomo falando.');now=41999;assert.equal(c.present('gnome',entry('',0)),'Gnomo falando.');now=42000;assert.equal(c.present('gnome',entry('',0)), '');
});
test('closing/removing an actor drops its lease, and session cleanup stops all speech without timers',()=>{
 let now=0;const c=new PetSpeechCoordinator({now:()=>now});c.present('gnome',entry('Gnomo falando.',12000));c.remove('gnome');now=800;assert.equal(c.present('primary',entry('Gato falando.',8000)),'Gato falando.');c.close();assert.equal(c.entries.size,0);assert.equal(c.present('gnome',entry('Não mostrar.',30000)), '');assert.equal(c.canAdvance('primary'),false);
});
