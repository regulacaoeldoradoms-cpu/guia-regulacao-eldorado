import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPetState} from '../pet-domain.js';
import {PET_LIFE_RULES as rules} from '../pet-life-rules.js';
import {initializePetLives,advancePetLives,feedPetLives,waterPetLives,fillPetWaterBowl} from '../pet-lives.js';
const ticks = (start,count) => Array.from({length:count},(_,i)=>start+i+1);
function pet() {
 const state=initialPetState();state.pet={typeId:'cat',variant:'gray'};state.petRevision=1;
 initializePetLives(state,100);return state;
}

test('legacy cat starts with seven lives without retroactive damage or changing its appearance',()=>{
 const s=initialPetState();s.pet={typeId:'cat',variant:'gray'};s.hunger=100;s.thirst=100;s.petRevision=4;
 initializePetLives(s,10000);advancePetLives(s,ticks(100,9000));
 assert.equal(s.life.lives,7);assert.equal(s.life.deadAt,null);assert.equal(s.petRevision,4);assert.equal(s.pet.variant,'gray');
});
test('food empties in eight accepted hours and only then loses one life per critical hour',()=>{
 const s=pet();s.life.waterBowl='water-bowl';fillPetWaterBowl(s);
 advancePetLives(s,ticks(100,rules.foodSeconds));assert.equal(s.hunger,100);assert.equal(s.life.lives,7);
 advancePetLives(s,ticks(s.life.lastCareAt,rules.hungerLifeSeconds-1));assert.equal(s.life.lives,7);
 advancePetLives(s,ticks(s.life.lastCareAt,1));assert.equal(s.life.lives,6);
 feedPetLives(s);assert.equal(s.hunger,0);assert.equal(s.life.lives,6);
});
test('water empties in four accepted hours and critical thirst costs one life per thirty minutes',()=>{
 const s=pet();advancePetLives(s,ticks(100,rules.waterSeconds));assert.equal(s.thirst,100);assert.equal(s.life.lives,7);
 advancePetLives(s,ticks(s.life.lastCareAt,rules.thirstLifeSeconds));assert.equal(s.life.lives,6);
 waterPetLives(s);assert.equal(s.thirst,0);assert.equal(s.life.lives,6);
});
test('equipped, filled bowl protects 48 accepted hours, then ordinary four-hour depletion resumes',()=>{
 const s=pet();s.life.waterBowl='water-bowl';fillPetWaterBowl(s);
 for(let i=0;i<6;i++){advancePetLives(s,ticks(s.life.lastCareAt,8*3600));feedPetLives(s);}
 assert.equal(s.life.bowlProtectionSeconds,0);assert.equal(s.thirst,0);assert.equal(s.life.lives,7);
 advancePetLives(s,ticks(s.life.lastCareAt,rules.waterSeconds));assert.equal(s.thirst,100);
 fillPetWaterBowl(s);assert.equal(s.life.bowlProtectionSeconds,rules.bowlProtectionSeconds);assert.equal(s.thirst,0);
});
test('duplicate accepted ticks never consume twice, and absence of ticks pauses all decay',()=>{
 const s=pet(),accepted=ticks(100,60);advancePetLives(s,accepted);const before=structuredClone(s);
 advancePetLives(s,accepted);advancePetLives(s,[]);assert.deepEqual(s,before);
});
test('death remains permanent, causes are additive and lives never go below zero',()=>{
 const s=pet();s.hunger=100;s.thirst=100;s.life.foodSeconds=rules.foodSeconds;s.life.waterSeconds=rules.waterSeconds;
 s.life.hungerCriticalSeconds=rules.hungerLifeSeconds-1;s.life.thirstCriticalSeconds=rules.thirstLifeSeconds-1;s.life.lives=1;
 advancePetLives(s,[101]);assert.equal(s.life.lives,0);assert.equal(s.life.deadAt,101);assert.equal(s.petRevision,2);
 assert.equal(feedPetLives(s),false);assert.equal(waterPetLives(s),false);assert.equal(fillPetWaterBowl(s),false);
 const before=structuredClone(s);advancePetLives(s,[102,103]);assert.deepEqual(s,before);
});
