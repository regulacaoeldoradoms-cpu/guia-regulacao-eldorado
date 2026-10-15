'use strict';

// Private registration data must never enter auth_users, tokens, public profiles
// or logs. Gender is stored for future functions and grants no permission.
export const validRegistrationGender = value => value === 'masculino' || value === 'feminino';
export function privateRegistrationStatement(db, username, gender) {
  return db.prepare('INSERT INTO account_private_registration(auth_username,gender) VALUES(?,?)').bind(username, gender);
}
export async function legacyBirthDateAllowed(db, username) {
  try {
    const row = await db.prepare(`SELECT legacy_birth_date_allowed FROM account_private_registration WHERE auth_username=?`).bind(username).first();
    return row?.legacy_birth_date_allowed === 1;
  } catch {
    return false;
  }
}
