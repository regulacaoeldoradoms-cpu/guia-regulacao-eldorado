'use strict';
import {privatePetAgeStatus, validBirthDate, portalCalendarDate} from './private-pet-age.js';
import {PetError} from './pet-domain.js';

export function ageDeclarationStatement(db, username, birthDate) {
  return db.prepare('INSERT INTO pet_private_age(auth_username,birth_date) VALUES(?,?)').bind(username,birthDate);
}

export async function readPrivatePetAge(db, username, today = portalCalendarDate()) {
  try {
    const row = await db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').bind(username).first();
    return privatePetAgeStatus(row?.birth_date, today);
  } catch {
    // An unapplied migration never unlocks adult content or breaks existing cats.
    return 'unknown';
  }
}

export async function declarePrivatePetAge(db, user, birthDate, today = portalCalendarDate()) {
  if (!validBirthDate(birthDate) || birthDate > today) throw new PetError('BIRTH_DATE_INVALID','Informe uma data de nascimento válida.');
  const active = await db.prepare('SELECT username FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0').bind(user.username,user.sessionVersion).first();
  if (!active) throw new PetError('SESSION_REQUIRED','Sessão inválida ou expirada.',401);
  await db.prepare(`INSERT INTO pet_private_age(auth_username,birth_date)
    SELECT username,? FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0
    ON CONFLICT(auth_username) DO NOTHING`).bind(birthDate,user.username,user.sessionVersion).run();
  const row = await db.prepare(`SELECT birth_date FROM pet_private_age WHERE auth_username=?
    AND EXISTS(SELECT 1 FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0)`)
    .bind(user.username,user.username,user.sessionVersion).first();
  if (!row) throw new PetError('SESSION_REQUIRED','Sessão inválida ou expirada.',401);
  if (row.birth_date !== birthDate) throw new PetError('BIRTH_DATE_LOCKED','A data de nascimento já foi registrada e não pode ser alterada por este formulário.',409);
  return {ageStatus:privatePetAgeStatus(row.birth_date,today)};
}
