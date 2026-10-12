// Per-pet state only. Wallet, inventory, schedule and activity lease belong to the account.
export const PET_SLOT_FIELDS=Object.freeze(['pet','petRevision','life','deathHistory','hunger','thirst','dirt','awakeSeconds','sleepUntil','placement','placementRevision','collar']);
export function petSlot(state){return Object.fromEntries(PET_SLOT_FIELDS.map(key=>[key,structuredClone(state[key])]));}
export function gnomeCompanionState(account){
 if(!account.gnomeCompanion?.pet)return null;
 const state={...account,...account.gnomeCompanion};delete state.gnomeCompanion;return state;
}
