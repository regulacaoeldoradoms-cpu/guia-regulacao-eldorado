import {PET_LIFE_RULES as rules} from './pet-life-rules.js';

const need = value => Math.max(0, Math.min(100, Number(value) || 0));
export function initializePetLives(state, now) {
 if (state.life?.version === 1) return false;
 state.life = {
  version: 1, lives: rules.lives, deadAt: null, startedAt: now, lastCareAt: now,
  foodAfter: now, waterAfter: now,
  foodSeconds: Math.round(need(state.hunger) * rules.foodSeconds / 100),
  waterSeconds: Math.round(need(state.thirst) * rules.waterSeconds / 100),
  hungerCriticalSeconds: 0, thirstCriticalSeconds: 0,
  waterBowl: state.inventory?.['water-bowl'] ? 'water-bowl' : null, bowlProtectionSeconds: 0,
 };
 return true;
}

// Caller supplies only server-accepted active seconds inside the owner's care schedule.
// Initialization and lastCareAt prevent retroactive or duplicated time consumption.
export function advancePetLives(state, careTicks) {
 const life = state.life;
 if (!life || life.version !== 1) throw new TypeError('Initialize life state first.');
 for (const tick of careTicks) {
  if (!Number.isInteger(tick) || tick <= life.lastCareAt || life.deadAt !== null) continue;
  life.lastCareAt = tick;
  let lost = 0;
  if (tick > life.foodAfter && life.foodSeconds >= rules.foodSeconds) {
   life.hungerCriticalSeconds++;
   if (life.hungerCriticalSeconds >= rules.hungerLifeSeconds) {
    life.hungerCriticalSeconds -= rules.hungerLifeSeconds; lost++;
   }
  } else if (tick > life.foodAfter) life.foodSeconds++;
  if (tick <= life.waterAfter) { /* Do not charge an earlier interval against a fresh refill. */ }
  else if (life.waterBowl && life.bowlProtectionSeconds > 0) {
   life.bowlProtectionSeconds--; life.waterSeconds = 0; life.thirstCriticalSeconds = 0;
  } else if (life.waterSeconds >= rules.waterSeconds) {
   life.thirstCriticalSeconds++;
   if (life.thirstCriticalSeconds >= rules.thirstLifeSeconds) {
    life.thirstCriticalSeconds -= rules.thirstLifeSeconds; lost++;
   }
  } else life.waterSeconds++;
  // Independent critical clocks: simultaneous causes add, always clamped at zero.
  life.lives = Math.max(0, life.lives - lost);
  state.hunger = Math.min(100, life.foodSeconds * 100 / rules.foodSeconds);
  state.thirst = Math.min(100, life.waterSeconds * 100 / rules.waterSeconds);
  if (life.lives === 0) {
   life.deadAt = tick; state.petRevision++;
   state.deathHistory ||= [];
   state.deathHistory.push({pet: structuredClone(state.pet), startedAt: life.startedAt, deadAt: tick});
   state.sleepUntil = 0;
  }
 }
 return state;
}

export function feedPetLives(state, now = state.life.lastCareAt) {
 if (state.life.deadAt !== null) return false;
 state.life.foodSeconds = 0; state.life.hungerCriticalSeconds = 0; state.hunger = 0;
 state.life.foodAfter = Math.max(state.life.foodAfter, state.life.lastCareAt, now);
 return true;
}
export function waterPetLives(state, now = state.life.lastCareAt) {
 if (state.life.deadAt !== null) return false;
 state.life.waterSeconds = 0; state.life.thirstCriticalSeconds = 0; state.thirst = 0;
 state.life.waterAfter = Math.max(state.life.waterAfter, state.life.lastCareAt, now);
 return true;
}
export function fillPetWaterBowl(state, now = state.life.lastCareAt) {
 if (!state.life.waterBowl || !waterPetLives(state, now)) return false;
 state.life.bowlProtectionSeconds = rules.bowlProtectionSeconds;
 return true;
}
