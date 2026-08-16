'use strict';

import { validatePortalSession } from './auth-management-flex.js';

const ONLINE_WINDOW_SECONDS = 75;
const MAX_HISTORY_DAYS = 730;
const ELDORADO_UTC_OFFSET_HOURS = -4;

function baseHeaders(origin, allowed = true) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), { status, headers: { ...baseHeaders(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' } });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = baseHeaders(origin, true);
  headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  headers['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers });
}

function localDateString(date = new Date()) {
  const shifted = new Date(date.getTime() + ELDORADO_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

function utcSqlDateString(date = new Date()) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function parseSqlUtc(value) {
  if (!value) return null;
  const parsed = new Date(`${String(value).replace(' ', 'T')}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function safePath(value) {
  const path = String(value || '/').trim().slice(0, 180);
  return path.startsWith('/') ? path : '/';
}

function isMedicalGuidePath(path) {
  const normalized = safePath(path).replace(/\?.*$/, '').replace(/#.*$/, '');
  return ['/medico', '/medico/', '/medico/index.html'].includes(normalized);
}

export async function ensureUsageSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_chat_presence (
    username TEXT PRIMARY KEY, last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_usage_daily (
    username TEXT NOT NULL,
    usage_date TEXT NOT NULL,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    last_path TEXT NOT NULL DEFAULT '',
    visits INTEGER NOT NULL DEFAULT 0,
    guide_visits INTEGER NOT NULL DEFAULT 0,
    active_seconds INTEGER NOT NULL DEFAULT 0,
    heartbeat_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(username, usage_date)
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_portal_usage_date ON portal_usage_daily(usage_date, username)').run();
  return true;
}

export async function recordUsageHeartbeat(env, username, input = {}) {
  if (!(await ensureUsageSchema(env))) return;
  const now = new Date();
  const usageDate = localDateString(now);
  const nowSql = utcSqlDateString(now);
  const path = safePath(input.path);
  const visit = input.visit === true;
  const guideVisit = visit && isMedicalGuidePath(path);
  const previous = await env.AUTH_DB.prepare('SELECT last_seen AS lastSeen FROM portal_usage_daily WHERE username = ? AND usage_date = ?')
    .bind(username, usageDate).first();
  if (!previous) {
    await env.AUTH_DB.prepare(`INSERT INTO portal_usage_daily
      (username, usage_date, first_seen, last_seen, last_path, visits, guide_visits, active_seconds, heartbeat_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)`)
      .bind(username, usageDate, nowSql, nowSql, path, visit ? 1 : 0, guideVisit ? 1 : 0).run();
    return;
  }
  const previousDate = parseSqlUtc(previous.lastSeen);
  const elapsed = previousDate ? Math.max(0, Math.round((now.getTime() - previousDate.getTime()) / 1000)) : 0;
  const activeIncrement = elapsed > 0 && elapsed <= 90 ? elapsed : 0;
  await env.AUTH_DB.prepare(`UPDATE portal_usage_daily SET last_seen = ?, last_path = ?, visits = visits + ?,
      guide_visits = guide_visits + ?, active_seconds = active_seconds + ?, heartbeat_count = heartbeat_count + 1
    WHERE username = ? AND usage_date = ?`)
    .bind(nowSql, path, visit ? 1 : 0, guideVisit ? 1 : 0, activeIncrement, username, usageDate).run();
}

async function overview(env, days) {
  await ensureUsageSchema(env);
  const doctorsResult = await env.AUTH_DB.prepare(`SELECT
      u.username, u.name, u.job_title AS jobTitle, u.active,
      p.last_seen AS lastSeen,
      CASE WHEN p.last_seen IS NOT NULL AND p.last_seen >= datetime('now', '-' || ? || ' seconds') THEN 1 ELSE 0 END AS online
    FROM auth_users u
    LEFT JOIN portal_chat_presence p ON p.username = u.username
    WHERE u.role = 'medico'
    ORDER BY u.active DESC, lower(u.name), u.username`).bind(ONLINE_WINDOW_SECONDS).all();
  const doctors = doctorsResult.results || [];
  if (!doctors.length) return [];

  const start = new Date(Date.now() + ELDORADO_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  start.setUTCDate(start.getUTCDate() - Math.max(0, days - 1));
  const startDate = start.toISOString().slice(0, 10);
  const placeholders = doctors.map(() => '?').join(',');
  const historyResult = await env.AUTH_DB.prepare(`SELECT username, usage_date AS usageDate, first_seen AS firstSeen,
      last_seen AS lastSeen, last_path AS lastPath, visits, guide_visits AS guideVisits,
      active_seconds AS activeSeconds, heartbeat_count AS heartbeatCount
    FROM portal_usage_daily WHERE usage_date >= ? AND username IN (${placeholders})
    ORDER BY usage_date DESC, username`).bind(startDate, ...doctors.map((item) => item.username)).all();
  const byUser = new Map();
  for (const row of historyResult.results || []) {
    if (!byUser.has(row.username)) byUser.set(row.username, []);
    byUser.get(row.username).push({
      usageDate: row.usageDate,
      firstSeen: row.firstSeen,
      lastSeen: row.lastSeen,
      lastPath: row.lastPath || '',
      visits: Number(row.visits || 0),
      guideVisits: Number(row.guideVisits || 0),
      activeSeconds: Number(row.activeSeconds || 0),
      heartbeatCount: Number(row.heartbeatCount || 0)
    });
  }
  return doctors.map((doctor) => ({
    username: doctor.username,
    name: doctor.name || doctor.username,
    jobTitle: doctor.jobTitle || '',
    active: Number(doctor.active) !== 0,
    online: Number(doctor.online) === 1,
    lastSeen: doctor.lastSeen || null,
    history: byUser.get(doctor.username) || []
  }));
}

export function isUsageApi(pathname) {
  return String(pathname || '') === '/api/admin/usage';
}

export async function handleUsageRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405, origin);
  const user = await validatePortalSession(request, env, ['coordenacao']);
  if (!user || !['coordenacao', 'admin'].includes(user.role)) return json({ error: 'Acesso de coordenação necessário.' }, 403, origin);
  if (!env.AUTH_DB) return json({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);
  const url = new URL(request.url);
  const requestedDays = Number.parseInt(url.searchParams.get('days') || '370', 10);
  const days = Math.min(MAX_HISTORY_DAYS, Math.max(1, Number.isFinite(requestedDays) ? requestedDays : 370));
  return json({ generatedAt: new Date().toISOString(), timezone: 'America/Campo_Grande', days, doctors: await overview(env, days) }, 200, origin);
}
