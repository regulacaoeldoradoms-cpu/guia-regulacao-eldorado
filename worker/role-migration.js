'use strict';

let lastRun = 0;

function developerUsernames(env) {
  return String(env.AUTH_DEVELOPER_USERNAMES || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function enforceDeveloperSeparation(env) {
  if (!env.AUTH_DB) return;
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
    // Migração defensiva: nunca deve impedir o restante do portal de responder.
  }
}
