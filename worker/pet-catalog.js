'use strict';
export const PET_VERSION = 'pets-v1-proposal-1';
export const PET_TYPES = Object.freeze([
 { id: 'cat', name: 'Gato', achievement: 'Cuidar de 7 vidas não é fácil', variants: ['ginger','gray'] }
]);
export const PET_ITEMS = Object.freeze([
 { id:'bed-cloud', name:'Caminha nuvem', kind:'bed', price:30, unique:true },
 { id:'bed-moss', name:'Caminha jardim', kind:'bed', price:40, unique:true },
 { id:'collar-blue', name:'Coleira azul', kind:'accessory', price:20, unique:true },
 { id:'bath-special', name:'Banho de espuma especial', kind:'bath', price:5, unique:false }
]);
// Economic/need defaults are proposals. No money, paid APIs or productivity telemetry.
const integer = (value, fallback, min, max) => {
 const n=Number(value); return Number.isInteger(n)&&n>=min&&n<=max?n:fallback;
};
export function petRules(env={}) {
 return {
  proposed:true, secondsPerCoin:integer(env.PETS_SECONDS_PER_COIN,300,60,3600),
  dailyCap:integer(env.PETS_DAILY_CAP,12,0,100),
  idleSeconds:60, sampleSeconds:60, leaseSeconds:90,
  hungerHours:integer(env.PETS_HUNGER_HOURS,4,1,24),
  thirstHours:integer(env.PETS_THIRST_HOURS,3,1,24),
  dirtHours:integer(env.PETS_DIRT_HOURS,6,1,48),
  sleepAfterSeconds:2700, sleepSeconds:45, dayTimezone:'America/Campo_Grande'
 };
}
export function petCatalog(env={}) {
 const multiplier=integer(env.PETS_PRICE_PERCENT,100,0,1000);
 return {version:PET_VERSION,types:PET_TYPES,items:PET_ITEMS.map(i=>({...i,price:Math.ceil(i.price*multiplier/100)})),rules:petRules(env)};
}
