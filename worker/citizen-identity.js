'use strict';

import { validatePortalSession } from './auth-management-flex.js';

const HANDLE_CHANGE_DAYS = 30;
const RESERVED_HANDLES = new Set([
  'admin', 'administrador', 'administracao', 'developer', 'desenvolvedor',
  'coordenacao', 'coordenador', 'coordenadora', 'medico', 'medica', 'recepcao',
  'regulacao', 'regulador', 'reguladora', 'saude', 'sms', 'sesau', 'secretaria',
  'prefeitura', 'eldorado', 'conselho', 'cms', 'presidente', 'oficial', 'sistema',
  'suporte', 'atendimento', 'moderacao', 'moderador', 'moderadora'
]);
const RESERVED_PREFIXES = [
  'admin.', 'administracao.', 'conselho.', 'cms.', 'prefeitura.', 'regulacao.',
  'saude.', 'secretaria.', 'sistema.', 'suporte.', 'oficial.'
];

function headers(origin, allowed = true) {
  const result = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    result['Access-Control-Allow-Origin'] = origin;
    result.Vary = 'Origin';
  }
  return result;
}

function json(body, status, origin, allowed = true) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers(origin, allowed), 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const h = headers(origin, true);
  h['Access-Control-Allow-Methods'] = 'GET, PATCH, OPTIONS';
  h['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  h['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: h });
}

function normalizeHandle(value) {
  return String(value || '')
    .replace(/^@+/, '')
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

function handleValid(value) {
  return /^[a-z0-9._-]{3,40}$/.test(value);
}

function handleReserved(value) {
  return RESERVED_HANDLES.has(value) || RESERVED_PREFIXES.some((prefix) => value.startsWith(prefix));
}

function cleanDisplayName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
}

async function authUsersExists(env) {
  if (!env.AUTH_DB) return false;
  const row = await env.AUTH_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='auth_users'").first();
  return Boolean(row?.name);
}

async function ensureIdentitySchema(env) {
  if (!(await authUsersExists(env))) return false;
  const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
  const names = new Set((columns.results || []).map((item) => String(item.name || '')));
  if (!names.has('public_handle')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN public_handle TEXT NOT NULL DEFAULT ''").run();
  }
  if (!names.has('handle_changed_at')) {
    await env.AUTH_DB.prepare("ALTER TABLE auth_users ADD COLUMN handle_changed_at TEXT").run();
  }
  await env.AUTH_DB.prepare("UPDATE auth_users SET public_handle = username WHERE role = 'cidadao' AND (public_handle IS NULL OR public_handle = '')").run();
  await env.AUTH_DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_public_handle ON auth_users(public_handle) WHERE public_handle <> ''").run();
  return true;
}

function nextHandleChangeAt(changedAt) {
  if (!changedAt) return null;
  const parsed = new Date(`${String(changedAt).replace(' ', 'T')}Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getTime() + HANDLE_CHANGE_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

function canChangeHandle(changedAt) {
  const next = nextHandleChangeAt(changedAt);
  return !next || Date.now() >= new Date(next).getTime();
}

async function identityFor(env, username) {
  await ensureIdentitySchema(env);
  const row = await env.AUTH_DB.prepare(`SELECT username, name, role,
      COALESCE(public_handle, '') AS publicHandle,
      handle_changed_at AS handleChangedAt
    FROM auth_users WHERE username = ?`).bind(username).first();
  if (!row) return null;
  const handle = normalizeHandle(row.publicHandle || row.username);
  return {
    displayName: row.name || handle,
    handle,
    handleChangedAt: row.handleChangedAt || null,
    nextHandleChangeAt: nextHandleChangeAt(row.handleChangedAt),
    canChangeHandle: canChangeHandle(row.handleChangedAt)
  };
}

async function handleAvailable(env, proposed, currentUsername) {
  const publicOwner = await env.AUTH_DB.prepare('SELECT username FROM auth_users WHERE public_handle = ? AND username <> ? LIMIT 1')
    .bind(proposed, currentUsername).first();
  if (publicOwner) return false;

  // Contas profissionais continuam entrando pelo identificador interno; por isso seus usuários
  // também ficam reservados e não podem virar @ de cidadão.
  const professionalOwner = await env.AUTH_DB.prepare("SELECT username FROM auth_users WHERE username = ? AND username <> ? AND role <> 'cidadao' LIMIT 1")
    .bind(proposed, currentUsername).first();
  return !professionalOwner;
}

export function isCitizenIdentityApi(pathname) {
  return String(pathname || '') === '/api/citizen/identity';
}

export async function handleCitizenIdentityRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  if (!env.AUTH_DB) return json({ error: 'Banco de usuários ainda não disponível.' }, 503, origin);

  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (user.role !== 'cidadao') {
    return json({ error: 'A identidade social editável está disponível para contas de cidadão.' }, 403, origin);
  }
  await ensureIdentitySchema(env);

  if (request.method === 'GET') {
    return json({ identity: await identityFor(env, user.username) }, 200, origin);
  }

  if (request.method === 'PATCH') {
    const body = await request.json().catch(() => ({}));
    const current = await identityFor(env, user.username);
    if (!current) return json({ error: 'Conta não encontrada.' }, 404, origin);
    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(body, 'displayName')) {
      const displayName = cleanDisplayName(body.displayName);
      if (displayName.length < 1) return json({ error: 'Informe um nome de exibição.' }, 400, origin);
      fields.push('name = ?');
      values.push(displayName);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'handle')) {
      const handle = normalizeHandle(body.handle);
      if (!handleValid(handle)) {
        return json({ error: 'O nome de usuário deve ter de 3 a 40 caracteres e pode usar letras, números, ponto, hífen e sublinhado.' }, 400, origin);
      }
      if (handleReserved(handle)) {
        return json({ error: 'Este nome de usuário é reservado para identificação institucional do portal.' }, 409, origin);
      }
      if (handle !== current.handle) {
        if (!current.canChangeHandle) {
          return json({
            error: 'O nome de usuário pode ser alterado uma vez a cada 30 dias.',
            code: 'HANDLE_COOLDOWN',
            nextHandleChangeAt: current.nextHandleChangeAt
          }, 429, origin);
        }
        if (!(await handleAvailable(env, handle, user.username))) {
          return json({ error: 'Este nome de usuário já está em uso.' }, 409, origin);
        }
        fields.push('public_handle = ?', 'handle_changed_at = CURRENT_TIMESTAMP');
        values.push(handle);
      }
    }

    if (fields.length) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(user.username);
      try {
        await env.AUTH_DB.prepare(`UPDATE auth_users SET ${fields.join(', ')} WHERE username = ?`).bind(...values).run();
      } catch (error) {
        if (/unique/i.test(String(error?.message || ''))) return json({ error: 'Este nome de usuário já está em uso.' }, 409, origin);
        throw error;
      }
    }

    return json({ identity: await identityFor(env, user.username) }, 200, origin);
  }

  return json({ error: 'Método não permitido.' }, 405, origin);
}

export async function prepareCitizenHandleLogin(request, env, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/login' || request.method !== 'POST' || !env.AUTH_DB) return request;
  if (!(await ensureIdentitySchema(env))) return request;

  const body = await request.clone().json().catch(() => null);
  if (!body || typeof body !== 'object') return request;
  const identifier = normalizeHandle(body.username);
  if (!identifier) return request;

  // O @ atual tem prioridade. Assim, depois de uma troca, o cidadão passa a entrar com o novo @
  // sem alterar a chave técnica usada internamente pelas manifestações, notificações e auditoria.
  const byHandle = await env.AUTH_DB.prepare("SELECT username FROM auth_users WHERE role = 'cidadao' AND public_handle = ? LIMIT 1")
    .bind(identifier).first();
  if (byHandle?.username) {
    const headersCopy = new Headers(request.headers);
    headersCopy.set('Content-Type', 'application/json; charset=utf-8');
    return new Request(request.url, {
      method: 'POST',
      headers: headersCopy,
      body: JSON.stringify({ ...body, username: byHandle.username }),
      redirect: request.redirect
    });
  }

  const byInternal = await env.AUTH_DB.prepare("SELECT username, role, COALESCE(public_handle, '') AS publicHandle FROM auth_users WHERE username = ? LIMIT 1")
    .bind(identifier).first();
  if (byInternal?.role === 'cidadao' && byInternal.publicHandle && normalizeHandle(byInternal.publicHandle) !== identifier) {
    return json({ error: 'Usuário ou senha inválidos.' }, 401, origin, originAllowed);
  }
  return request;
}
