'use strict';

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
    const tables = await env.AUTH_DB.prepare(`SELECT name FROM sqlite_master
      WHERE type = 'table' AND name IN ('auth_users', 'auth_telemedicine_access')`).all();
    const names = new Set((tables.results || []).map((row) => String(row.name || '')));
    if (!names.has('auth_users') || !names.has('auth_telemedicine_access')) return;

    await env.AUTH_DB.prepare(`UPDATE auth_users
      SET role = 'recepcao', updated_at = CURRENT_TIMESTAMP
      WHERE role <> 'admin'
        AND role <> 'recepcao'
        AND username IN (
          SELECT username FROM auth_telemedicine_access WHERE enabled = 1
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

  // V34: repara uma eventual divergência histórica entre o perfil lógico
  // Técnico em Telemedicina e o papel-base `recepcao`. A verificação roda
  // uma única vez por isolate aquecido; novas concessões já mantêm o
  // invariante no momento em que o acesso é salvo.
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
