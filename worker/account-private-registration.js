'use strict';
import {validBirthDate,portalCalendarDate} from './private-pet-age.js';

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

export class RegistrationDetailsError extends Error {
  constructor(code,message,status=400){super(message);this.code=code;this.status=status;}
}
async function activeOwner(db,user){
  const row=await db.prepare('SELECT username,self_registered FROM auth_users WHERE username=? AND active=1 AND session_version=? AND must_change_password=0').bind(user.username,user.sessionVersion).first();
  if(!row)throw new RegistrationDetailsError('SESSION_REQUIRED','Sessão inválida ou primeiro acesso pendente.',401);
  return row;
}
async function privateRows(db,username){
  const [birth,registration]=await Promise.all([
    db.prepare('SELECT birth_date FROM pet_private_age WHERE auth_username=?').bind(username).first(),
    db.prepare('SELECT gender FROM account_private_registration WHERE auth_username=?').bind(username).first()
  ]);
  return {birthDate:birth?.birth_date,gender:registration?.gender};
}
const statusFor=rows=>({birthDateRecorded:rows.birthDate!==undefined,genderRecorded:validRegistrationGender(rows.gender)});
async function initialBirthCompletionAllowed(db,owner) {
  // A self-registered account already declared its date at creation. If that
  // row disappears, only authorized recovery may restore it, not a new claim.
  return Number(owner.self_registered)!==1 || await legacyBirthDateAllowed(db,owner.username);
}
export async function privateRegistrationStatus(db,user){
  const owner=await activeOwner(db,user),rows=await privateRows(db,user.username);
  return {...statusFor(rows),canCompleteBirthDate:rows.birthDate===undefined && await initialBirthCompletionAllowed(db,owner)};
}
export async function completePrivateRegistration(db,user,input,today=portalCalendarDate()){
  if(!input||typeof input!=='object'||Array.isArray(input)||!Object.keys(input).length||Object.keys(input).some(key=>!['birthDate','gender'].includes(key)))
    throw new RegistrationDetailsError('PAYLOAD_INVALID','Informe somente seus dados privados.');
  const ownerRow=await activeOwner(db,user);
  const prior=await privateRows(db,user.username);
  if(prior.birthDate===undefined && !(await initialBirthCompletionAllowed(db,ownerRow)))throw new RegistrationDetailsError('BIRTH_DATE_LOCKED','A declaração do cadastro precisa de recuperação autorizada. Ela não pode ser substituída por este formulário.',409);
  const birthDate=Object.hasOwn(input,'birthDate')?input.birthDate:prior.birthDate;
  const gender=Object.hasOwn(input,'gender')?input.gender:prior.gender;
  if(!validBirthDate(birthDate)||birthDate>today)throw new RegistrationDetailsError('BIRTH_DATE_INVALID','Informe uma data de nascimento válida.');
  if(!validRegistrationGender(gender))throw new RegistrationDetailsError('GENDER_INVALID','Escolha Masculino ou Feminino.');
  const assertUnchanged=rows=>{
    if(rows.birthDate!==undefined&&rows.birthDate!==birthDate)throw new RegistrationDetailsError('BIRTH_DATE_LOCKED','A data já foi registrada. Este formulário não altera dados salvos.',409);
    if(rows.gender!=null&&rows.gender!==gender)throw new RegistrationDetailsError('GENDER_LOCKED','O gênero já foi registrado. Este formulário não altera dados salvos.',409);
  };
  assertUnchanged(prior);
  // Both writes recheck the owner/session and both immutable values inside the
  // transaction. A competing declaration cannot partially save the other field.
  const compatible=`NOT EXISTS(SELECT 1 FROM pet_private_age WHERE auth_username=? AND birth_date<>?)
    AND NOT EXISTS(SELECT 1 FROM account_private_registration WHERE auth_username=? AND gender IS NOT NULL AND gender<>?)`;
  const owner=`username=? AND active=1 AND session_version=? AND must_change_password=0 AND ${compatible}`;
  const args=[user.username,user.sessionVersion,user.username,birthDate,user.username,gender];
  await db.batch([
    db.prepare(`INSERT INTO pet_private_age(auth_username,birth_date) SELECT username,? FROM auth_users WHERE ${owner}
      ON CONFLICT(auth_username) DO NOTHING`).bind(birthDate,...args),
    db.prepare(`INSERT INTO account_private_registration(auth_username,gender) SELECT username,? FROM auth_users WHERE ${owner}
      ON CONFLICT(auth_username) DO UPDATE SET gender=COALESCE(account_private_registration.gender,excluded.gender)`).bind(gender,...args)
  ]);
  await activeOwner(db,user);
  const saved=await privateRows(db,user.username);assertUnchanged(saved);
  if(saved.birthDate!==birthDate||saved.gender!==gender)throw new RegistrationDetailsError('REGISTRATION_DETAILS_UNAVAILABLE','Não foi possível salvar os dados privados.',503);
  return {...statusFor(saved),canCompleteBirthDate:false};
}
