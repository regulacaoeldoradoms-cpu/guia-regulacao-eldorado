import test from 'node:test';
import assert from 'node:assert/strict';
import {PET_PHRASES,nextPetPhrase} from '../../js/pet-phrases.js';

test('fixed companionship phrases retain original care lines and offer varied short copy',()=>{
 assert.equal(PET_PHRASES.length,30);
 assert.equal(new Set(PET_PHRASES).size,30);
 for(const phrase of ['Uma pausa também faz bem.','Miau. Que bom estar por aqui.','Minha água está sempre por perto.','Vou cuidar da minha patinha.'])assert(PET_PHRASES.includes(phrase));
 assert(PET_PHRASES.every(phrase=>phrase.length<=55));
});

test('selection excludes the five recent phrases without losing eligible choices',()=>{
 const recent=PET_PHRASES.slice(0,5),choices=PET_PHRASES.slice(5);
 for(let i=0;i<choices.length;i++)assert.equal(nextPetPhrase(recent,()=> (i+.5)/choices.length),choices[i]);
 let history=[];
 for(let i=0;i<100;i++){
  const phrase=nextPetPhrase(history,()=> (i%17)/17);
  assert(!history.includes(phrase));history=[...history,phrase].slice(-5);
 }
});
