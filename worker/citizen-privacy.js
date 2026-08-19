'use strict';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 254);
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

export async function guardSecurityEmailRemoval(request, env, validatePortalSession, origin, originAllowed = true) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/auth/security' || request.method !== 'PATCH') return null;
  const body = await request.clone().json().catch(() => ({}));
  if (!Object.prototype.hasOwnProperty.call(body, 'email')) return null;

  const requestedEmail = normalizeEmail(body.email);
  if (requestedEmail) return null;

  const user = await validatePortalSession(request, env, []).catch(() => null);
  if (!user?.email || !user.emailVerified) return null;

  // Depois de confirmado, o e-mail passa a compor a segurança permanente da conta.
  // A remoção simples poderia reduzir a proteção e criar ambiguidade sobre a identidade já verificada.
  return json({
    error: 'Depois de confirmado, o e-mail de segurança não pode ser simplesmente removido. Você pode substituí-lo por outro endereço e confirmá-lo.',
    code: 'SECURITY_EMAIL_REMOVAL_BLOCKED'
  }, 409, origin, originAllowed);
}

export async function normalizeSecurityPrivacyResponse(response) {
  if (!response?.ok) return response;
  const type = response.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return response;

  const payload = await response.clone().json().catch(() => null);
  if (!payload?.security) return response;

  // Este campo mantém o estado-base da conta por compatibilidade. A modalidade efetiva
  // de cada nova manifestação é decidida no endpoint do Conselho no momento do envio.
  payload.security.privacyMode = payload.security.emailVerified ? 'sigilosa' : 'anonima';
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(payload), { status: response.status, headers });
}

export async function syncCitizenPrivacyAfterSecurityPatch(requestSnapshot, response) {
  if (!requestSnapshot) return normalizeSecurityPrivacyResponse(response);

  // O rótulo de privacidade é fixado no momento em que cada manifestação é criada.
  // Adicionar ou confirmar e-mail depois não converte retroativamente protocolos anônimos.
  // A partir da confirmação, novas manifestações podem ser enviadas como sigilosas ou identificadas.
  return normalizeSecurityPrivacyResponse(response);
}
