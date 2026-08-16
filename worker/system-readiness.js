'use strict';

import { validatePortalSession } from './auth-management-flex.js';

function json(body, status, origin, allowed = true) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '600',
    'Cache-Control': 'no-store',
    Vary: 'Origin'
  };
  return new Response(null, { status: 204, headers });
}

function present(value) {
  return Boolean(String(value || '').trim());
}

function enabled(value) {
  return String(value || '').trim().toLowerCase() === 'true';
}

function normalizedDeveloperList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '.'));
}

export function isSystemReadinessApi(pathname) {
  return String(pathname || '') === '/api/admin/readiness';
}

export async function handleSystemReadinessRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405, origin);

  const user = await validatePortalSession(request, env, []);
  if (!user || user.role !== 'admin') return json({ error: 'Acesso de Desenvolvedor necessário.' }, 403, origin);

  const developerList = normalizedDeveloperList(env.AUTH_DEVELOPER_USERNAMES);
  const firebase = {
    projectId: present(env.FIREBASE_PROJECT_ID),
    clientEmail: present(env.FIREBASE_CLIENT_EMAIL),
    privateKey: present(env.FIREBASE_PRIVATE_KEY),
    webApiKey: present(env.FIREBASE_WEB_API_KEY),
    storageBucket: present(env.FIREBASE_STORAGE_BUCKET)
  };
  const firebaseReady = Object.values(firebase).every(Boolean);
  const developerProtected = developerList.includes(String(user.username || '').toLowerCase());
  const rateLimitSecretReady = present(env.AUTH_RATE_LIMIT_SECRET);
  const sessionSecretReady = present(env.AUTH_SESSION_SECRET);
  const emailVerificationRequired = enabled(env.AUTH_REQUIRE_EMAIL_VERIFICATION);
  const legacyMigrationEnabled = enabled(env.AUTH_MIGRATE_LEGACY_ADMINS);

  const checks = [
    {
      id: 'developer-list',
      label: 'Desenvolvedor identificado no Worker',
      ok: developerProtected,
      requiredBeforeDeploy: true,
      detail: developerProtected
        ? 'Sua conta consta na lista protegida de Desenvolvedores.'
        : 'Configure AUTH_DEVELOPER_USERNAMES antes de qualquer migração de administradores.'
    },
    {
      id: 'rate-secret',
      label: 'Segredo independente para rate limit',
      ok: rateLimitSecretReady,
      requiredBeforeDeploy: true,
      detail: rateLimitSecretReady
        ? 'AUTH_RATE_LIMIT_SECRET está configurado.'
        : 'Configure um segredo aleatório diferente do segredo de sessão.'
    },
    {
      id: 'firebase',
      label: 'Firebase conectado ao Worker',
      ok: firebaseReady,
      requiredBeforeDeploy: true,
      detail: firebaseReady
        ? 'As cinco referências necessárias do Firebase estão configuradas.'
        : 'Ainda faltam uma ou mais variáveis/Secrets do Firebase.'
    },
    {
      id: 'session-secret',
      label: 'Segredo de sessão do portal',
      ok: sessionSecretReady,
      requiredBeforeDeploy: true,
      detail: sessionSecretReady
        ? 'AUTH_SESSION_SECRET está disponível.'
        : 'O segredo de sessão não foi detectado no ambiente.'
    },
    {
      id: 'legacy-migration',
      label: 'Migração de administradores legados',
      ok: !legacyMigrationEnabled,
      requiredBeforeDeploy: false,
      detail: legacyMigrationEnabled
        ? 'A migração está ATIVA. Só mantenha assim durante a etapa controlada de conversão para Coordenação.'
        : 'A migração está desligada, que é o estado seguro antes dos testes.'
    },
    {
      id: 'email-gate',
      label: 'Exigência obrigatória de e-mail',
      ok: !emailVerificationRequired,
      requiredBeforeDeploy: false,
      detail: emailVerificationRequired
        ? 'A exigência está ATIVA. Use apenas após testar o envio e a confirmação real de e-mail.'
        : 'A exigência está desligada durante a fase de migração, conforme planejado.'
    }
  ];

  const blockers = checks.filter((item) => item.requiredBeforeDeploy && !item.ok).map((item) => item.id);
  return json({
    generatedAt: new Date().toISOString(),
    readyForControlledDeploy: blockers.length === 0,
    blockers,
    checks,
    firebase: {
      ...firebase,
      ready: firebaseReady
    },
    flags: {
      legacyMigrationEnabled,
      emailVerificationRequired
    }
  }, 200, origin);
}
