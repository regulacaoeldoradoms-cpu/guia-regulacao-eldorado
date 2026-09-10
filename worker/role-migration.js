'use strict';

import { ensureTelemedicineAccessSchema } from './telemedicine-access.js';

let developerLastRun = 0;
let telemedicineInvariantChecked = false;
let telemedicineInvariantPromise = null;

function normalizeUsername(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 40);
}

function developerUsernames(env) {
  return String(env.AUTH_DEVELOPER_USERNAMES || '')
    .split(',')
    .map(normalizeUsername)
    .filter(Boolean);
}

function migrationEnabled(env) {
  return String(env.AUTH_MIGRATE_LEGACY_ADMINS || '').toLowerCase() === 'true';
}

async function ensureTelemedicineUnderlyingRoleInvariant(env) {
  if (!env.AUTH_DB || telemedicineInvariantChecked) return;
  if (telemedicineInvariantPromise) return telemedicineInvariantPromise;

  telemedicineInvariantPromise = (async () => {
    const authUsersTable = await env.AUTH_DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'auth_users'"
    ).first();
    if (!authUsersTable) return;
    if (!(await ensureTelemedicineAccessSchema(env))) return;

    // V34.1: um papel legado explicitamente salvo como `telemedicina` já é uma
    // autorização técnica histórica. Recuperamos somente esse marcador forte.
    // INSERT OR IGNORE preserva revogações explícitas já registradas (enabled=0).
    await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO auth_telemedicine_access
      (username, enabled, created_by)
      SELECT username, 1, 'system-legacy-role-migration'
      FROM auth_users
      WHERE role = 'telemedicina'`).run();

    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET role = 'recepcao', updated_at = CURRENT_TIMESTAMP
      WHERE role <> 'admin'
        AND role <> 'recepcao'
        AND (
          role = 'telemedicina'
          OR username IN (
            SELECT username FROM auth_telemedicine_access WHERE enabled = 1
          )
        )`).run();
    telemedicineInvariantChecked = true;
  })().catch(() => {
    telemedicineInvariantChecked = false;
  }).finally(() => {
    telemedicineInvariantPromise = null;
  });

  return telemedicineInvariantPromise;
}

export async function enforceDeveloperSeparation(env) {
  if (!env.AUTH_DB) return;

  // V34/V34.1: reconcilia a função lógica Técnico em Telemedicina com o
  // papel-base `recepcao` e recupera apenas marcadores legados explícitos.
  // A verificação roda uma única vez por isolate aquecido.
  await ensureTelemedicineUnderlyingRoleInvariant(env);

  if (!migrationEnabled(env)) return;
  const developers = developerUsernames(env);
  if (!developers.length) return;
  if (Date.now() - developerLastRun < 60000) return;
  developerLastRun = Date.now();

  try {
    const table = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='auth_users'").first();
    if (!table) return;
    const placeholders = developers.map(() => '?').join(',');
    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET role = 'coordenacao', session_version = session_version + 1, updated_at = CURRENT_TIMESTAMP
      WHERE role = 'admin' AND lower(username) NOT IN (${placeholders})`)
      .bind(...developers)
      .run();
  } catch (_) {
    // A migração nunca deve impedir o restante do portal de responder.
  }
}
