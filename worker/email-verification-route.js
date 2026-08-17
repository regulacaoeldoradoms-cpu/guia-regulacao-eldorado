'use strict';

import { validatePortalSession } from './auth-management-v2.js';
import {
  firebaseConfigured,
  ensureFirebaseEmailIdentity,
  sendFirebaseVerificationEmail
} from './firebase-gateway.js';

function json(body, status, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function isFirebaseThrottle(error) {
  const message = String(error?.message || '').toUpperCase();
  return message.includes('TOO_MANY_ATTEMPTS_TRY_LATER') ||
    message.includes('TOO_MANY_REQUESTS') ||
    message.includes('TOO MANY ATTEMPTS');
}

export function isEmailVerificationRoute(pathname) {
  return String(pathname || '') === '/api/auth/email/send-verification';
}

export async function handleEmailVerificationRoute(request, env, origin) {
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405, origin);

  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (!user.email) return json({ error: 'Adicione um e-mail antes de solicitar a verificação.' }, 400, origin);
  if (!firebaseConfigured(env) || !env.FIREBASE_WEB_API_KEY) {
    return json({
      error: 'A verificação por e-mail está preparada, mas o Firebase ainda precisa ser conectado pelo desenvolvedor.',
      code: 'FIREBASE_PENDING'
    }, 503, origin);
  }

  try {
    const identity = await ensureFirebaseEmailIdentity(env, user.username, user.email);

    await env.AUTH_DB.prepare(
      'UPDATE auth_users SET firebase_uid = ?, email_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?'
    ).bind(identity.localId || '', identity.emailVerified ? 1 : 0, user.username).run();

    if (identity.emailVerified) {
      return json({ ok: true, alreadyVerified: true, message: 'E-mail já confirmado.' }, 200, origin);
    }

    // Usa a senha temporária acabada de gerar pela própria sincronização da identidade.
    // Isso evita uma segunda troca de senha e uma segunda sequência desnecessária de operações no Firebase.
    await sendFirebaseVerificationEmail(env, user.email, identity.verificationPassword || '');

    return json({ ok: true, alreadyVerified: false, message: 'E-mail de verificação enviado.' }, 200, origin);
  } catch (error) {
    if (isFirebaseThrottle(error)) {
      return json({
        error: 'O Firebase aplicou uma proteção temporária por excesso de tentativas. Aguarde alguns minutos antes de solicitar outro e-mail.',
        code: 'FIREBASE_TEMPORARY_THROTTLE'
      }, 429, origin);
    }
    throw error;
  }
}
