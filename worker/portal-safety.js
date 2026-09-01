'use strict';

import { accountProgressFor, minimumLevelMet } from './account-levels.js';

const PROFESSIONAL_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin']);
const COUNCIL_ROLES_REQUIRING_VERIFICATION = new Set(['membro', 'presidente']);
const RESERVED_CITIZEN_USERNAMES = new Set([
  'admin', 'administrador', 'administracao', 'developer', 'desenvolvedor',
  'coordenacao', 'coordenador', 'coordenadora', 'medico', 'medica', 'recepcao',
  'telemedicina', 'tecnico.telemedicina', 'tecnica.telemedicina',
  'regulacao', 'regulador', 'reguladora', 'saude', 'sms', 'sesau', 'secretaria',
  'prefeitura', 'eldorado', 'conselho', 'cms', 'presidente', 'oficial', 'sistema',
  'suporte', 'atendimento', 'moderacao', 'moderador', 'moderadora'
]);
const RESERVED_CITIZEN_PREFIXES = [
  'admin.', 'administracao.', 'conselho.', 'cms.', 'prefeitura.', 'regulacao.',
  'saude.', 'secretaria.', 'sistema.', 'suporte.', 'oficial.', 'telemedicina.'
];
const EMAIL_GATE_EXEMPT_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/me',
  '/api/auth/logout',
  '/api/auth/security',
  '/api/auth/email/send-verification',
  '/api/auth/change-password',
  '/api/auth/profile'
]);

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

function accountRequiresVerifiedEmail(user) {
  return Boolean(user && (
    PROFESSIONAL_ROLES.has(user.role)
    || COUNCIL_ROLES_REQUIRING_VERIFICATION.has(user.councilRole)
  ));
}

function json(body, status, origin, originAllowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (originAllowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export function professionalEmailVerificationEnabled(env) {
  return String(env.AUTH_REQUIRE_EMAIL_VERIFICATION || '').toLowerCase() === 'true';
}

export function portalEnvForAuthRoute(env, pathname) {
  if (pathname !== '/api/auth/login' || !professionalEmailVerificationEnabled(env)) return env;
  return { ...env, AUTH_REQUIRE_EMAIL_VERIFICATION: 'false' };
}

export async function augmentAuthResponse(response, env) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return response;

  const payload = await response.clone().json().catch(() => null);
  const user = payload?.user;
  if (!user) return response;

  const progress = accountProgressFor(user);
  payload.user = {
    ...user,
    privacyMode: user.emailVerified === true ? 'sigilosa' : 'anonima',
    accountLevel: progress.level,
    accountProgress: progress,
    emailVerificationRequired: Boolean(
      professionalEmailVerificationEnabled(env)
      && accountRequiresVerifiedEmail(user)
      && !user.emailVerified
    )
  };

  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(payload), { status: response.status, headers });
}

export async function enforceProfessionalEmailGate(request, env, validatePortalSession, origin, originAllowed = true) {
  if (!professionalEmailVerificationEnabled(env)) return null;
  if (request.method === 'OPTIONS') return null;

  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return null;
  if (EMAIL_GATE_EXEMPT_PATHS.has(url.pathname)) return null;

  const user = await validatePortalSession(request, env, []).catch(() => null);
  if (!accountRequiresVerifiedEmail(user) || user.emailVerified) return null;

  return json({
    error: 'Confirme o e-mail de segurança da sua conta para continuar.',
    code: 'EMAIL_VERIFICATION_REQUIRED',
    verificationPath: '/conta/?verificar-email=1'
  }, 403, origin, originAllowed);
}

export async function guardDeveloperSelfMutation(request, env, validatePortalSession, origin, originAllowed = true) {
  if (request.method !== 'PATCH') return null;
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/api\/admin\/users\/([a-z0-9._-]+)$/);
  if (!match) return null;

  const actor = await validatePortalSession(request, env, []).catch(() => null);
  if (!actor || actor.role !== 'admin') return null;
  const target = normalizeUsername(match[1]);
  if (target !== normalizeUsername(actor.username)) return null;

  const body = await request.clone().json().catch(() => ({}));
  if (Object.prototype.hasOwnProperty.call(body, 'role') && String(body.role || '') !== 'admin') {
    return json({
      error: 'A conta Desenvolvedor não pode remover o próprio nível técnico. A alteração deve ser feita por outro procedimento administrativo controlado.',
      code: 'DEVELOPER_SELF_DEMOTION_BLOCKED'
    }, 409, origin, originAllowed);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'active') && body.active === false) {
    return json({
      error: 'A conta Desenvolvedor não pode desativar a si própria.',
      code: 'DEVELOPER_SELF_DISABLE_BLOCKED'
    }, 409, origin, originAllowed);
  }
  return null;
}

export async function guardCitizenRegistrationBasics(request, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/register' || request.method !== 'POST') return null;
  const body = await request.clone().json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const password = String(body.password || '');

  if (!/^[a-z0-9._-]{3,40}$/.test(username)) {
    return json({ error: 'O usuário deve ter entre 3 e 40 caracteres válidos.', code: 'INVALID_USERNAME' }, 400, origin, originAllowed);
  }
  if (password.length < 8 || password.length > 160) {
    return json({ error: 'A senha deve ter entre 8 e 160 caracteres.', code: 'INVALID_PASSWORD' }, 400, origin, originAllowed);
  }
  return null;
}

export async function guardCitizenRegistrationUsername(request, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/register' || request.method !== 'POST') return null;
  const body = await request.clone().json().catch(() => ({}));
  const username = normalizeUsername(body.username);
  const reserved = RESERVED_CITIZEN_USERNAMES.has(username)
    || RESERVED_CITIZEN_PREFIXES.some((prefix) => username.startsWith(prefix));
  if (!reserved) return null;

  return json({
    error: 'Este nome de usuário é reservado para identificação institucional do portal. Escolha outro.',
    code: 'USERNAME_RESERVED'
  }, 409, origin, originAllowed);
}

export async function guardCitizenLevelMutation(request, env, validatePortalSession, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/security' || request.method !== 'PATCH') return null;

  const actor = await validatePortalSession(request, env, []).catch(() => null);
  if (!actor) return null;
  const body = await request.clone().json().catch(() => ({}));

  if (body.acceptFriendRequests === true && !minimumLevelMet(actor, 'prata')) {
    return json({
      error: 'Confirme seu e-mail para alcançar o nível Prata e desbloquear esta preferência.',
      code: 'ACCOUNT_LEVEL_REQUIRED',
      requiredLevel: 'prata'
    }, 403, origin, originAllowed);
  }
  return null;
}

export async function sanitizeCitizenRegistrationRequest(request) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/register' || request.method !== 'POST') return request;
  const body = await request.clone().json().catch(() => ({}));

  const cleanBody = {
    username: body.username,
    password: body.password
  };

  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Request(request.url, {
    method: 'POST',
    headers,
    body: JSON.stringify(cleanBody),
    redirect: request.redirect
  });
}