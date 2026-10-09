// Accepted care time only: active use, care schedule and unpaused needs. No offline catchup.
export const PET_LIFE_RULES = Object.freeze({
 lives: 7,
 foodSeconds: 8 * 60 * 60,
 waterSeconds: 4 * 60 * 60,
 hungerLifeSeconds: 60 * 60,
 thirstLifeSeconds: 30 * 60,
 bowlProtectionSeconds: 48 * 60 * 60,
 bowlPrice: 20,
});
