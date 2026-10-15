// Synthetic registration setup for integration suites which use real auth tokens.
import fs from 'node:fs';
import {ensureAuthSchema} from '../../auth-management-v2.js';
export const syntheticRegistrationDetails = Object.freeze({birthDate:'1990-01-01',gender:'feminino'});
export async function prepareRegistrationFixture(env) {
  await ensureAuthSchema(env);
  for (const file of ['pets-private-age.sql','account-private-registration.sql']) {
    const sql = fs.readFileSync(new URL('../../migrations/'+file,import.meta.url),'utf8').replace(/--[^\n]*/g,'');
    for (const statement of sql.split(';').map(s=>s.trim()).filter(Boolean)) await env.AUTH_DB.prepare(statement).run();
  }
}
