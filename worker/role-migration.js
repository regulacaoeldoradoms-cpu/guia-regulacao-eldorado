'use strict';

let lastRun = 0;

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

export async function enforceDeveloperSeparation(env) {
  if (!env.AUTH_DB || !migrationEnabled(env)) return;
  const developers = developerUsernames(env);
  if (!developers.length) return;
  if (Date.now() - lastRun < 60000) return;
  lastRun = Date.now();

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
