'use strict';
import {validBirthDate,portalCalendarDate} from './private-pet-age.js';

// Private registration data must never enter auth_users, tokens, public profiles
// or logs. Gender is stored for future functions and grants no permission.
export const REGISTRATION_GENDERS = Object.freeze(['mulher','homem','pessoa_nao_binaria','outra_identidade','prefiro_nao_informar']);
export const validRegistrationGender = value => REGISTRATION_GENDERS.includes(value);
export const validOptionalRegistrationGender = value => value == null || value === '' || validRegistrationGender(value);
export const normalizedRegistrationGender = value => value == null || value === '' ? null : value;
export function privateRegistrationStatement(db, username, gender) {
  return db.prepare(`INSERT INTO account_private_registration(auth_username,gender) VALUES(?,?)
    ON CONFLICT(auth_username) DO UPDATE SET gender=excluded.gender,legacy_birth_date_allowed=0`).bind(username, gender);
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
// Only this authenticated own-account endpoint returns the editable gender.
// Birth date is never read back; neither field enters public user projections.
const statusFor=rows=>({birthDateRecorded:rows.birthDate!==undefined,genderRecorded:validRegistrationGender(rows.gender),gender:validRegistrationGender(rows.gender)?rows.gender:null});
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
  const ownerRow=await activeOwner(db,user),prior=await privateRows(db,user.username);
  const birthGiven=Object.hasOwn(input,'birthDate'),genderGiven=Object.hasOwn(input,'gender');
  const birthDate=input.birthDate,gender=normalizedRegistrationGender(input.gender);
  if(birthGiven){
    if(!validBirthDate(birthDate)||birthDate>today)throw new RegistrationDetailsError('BIRTH_DATE_INVALID','Informe uma data de nascimento válida.');
    if(prior.birthDate!==undefined&&prior.birthDate!==birthDate)throw new RegistrationDetailsError('BIRTH_DATE_LOCKED','A data já foi registrada. A correção exige o processo autorizado da conta.',409);
    if(prior.birthDate===undefined&&!(await initialBirthCompletionAllowed(db,ownerRow)))throw new RegistrationDetailsError('BIRTH_DATE_LOCKED','A declaração do cadastro precisa de recuperação autorizada.',409);
  }
  if(genderGiven&&!validOptionalRegistrationGender(input.gender))throw new RegistrationDetailsError('GENDER_INVALID','Selecione uma opção válida de gênero ou deixe em branco.');
  // Recheck session, birth immutability and initial-declaration authority inside
  // every write. A competing birthday cannot partially commit a gender edit.
  let owner='username=? AND active=1 AND session_version=? AND must_change_password=0';
  const args=[user.username,user.sessionVersion];
  if(birthGiven){
    owner+=` AND NOT EXISTS(SELECT 1 FROM pet_private_age WHERE auth_username=? AND birth_date<>?)
      AND (COALESCE(self_registered,0)<>1
        OR EXISTS(SELECT 1 FROM account_private_registration WHERE auth_username=auth_users.username AND legacy_birth_date_allowed=1)
        OR EXISTS(SELECT 1 FROM pet_private_age WHERE auth_username=auth_users.username AND birth_date=?))`;
    args.push(user.username,birthDate,birthDate);
  }
  const statements=[];
  if(birthGiven)statements.push(db.prepare(`INSERT INTO pet_private_age(auth_username,birth_date)
    SELECT username,? FROM auth_users WHERE ${owner} ON CONFLICT(auth_username) DO NOTHING`).bind(birthDate,...args));
  if(genderGiven)statements.push(db.prepare(`INSERT INTO account_private_registration(auth_username,gender)
    SELECT username,? FROM auth_users WHERE ${owner}
    ON CONFLICT(auth_username) DO UPDATE SET gender=excluded.gender`).bind(gender,...args));
  await db.batch(statements);
  await activeOwner(db,user);
  const saved=await privateRows(db,user.username);
  if(birthGiven&&saved.birthDate!==birthDate)throw new RegistrationDetailsError(saved.birthDate===undefined?'REGISTRATION_DETAILS_UNAVAILABLE':'BIRTH_DATE_LOCKED','Não foi possível salvar a data informada.',saved.birthDate===undefined?503:409);
  return {...statusFor(saved),canCompleteBirthDate:saved.birthDate===undefined&&await initialBirthCompletionAllowed(db,ownerRow)};
}

// Technical schema checks only: never inspect a person's values for readiness.
export async function privateRegistrationSchemaReady(db) {
  if(!db)return false;
  try {
    const schema=await db.prepare(`SELECT count(*) AS count,MAX(CASE WHEN name='account_private_registration' THEN sql END) AS registration_sql FROM sqlite_schema WHERE
      (type='table' AND name IN ('pet_private_age','account_private_registration','account_private_registration_cutover'))
      OR (type='trigger' AND name='account_private_registration_legacy_bridge')`).first();
    const cutover=await db.prepare('SELECT singleton FROM account_private_registration_cutover WHERE singleton=1').first();
    return Number(schema?.count)===4 && cutover?.singleton===1 && REGISTRATION_GENDERS.every(value=>String(schema.registration_sql).includes("\'"+value+"\'"));
  }catch{return false;}
}
