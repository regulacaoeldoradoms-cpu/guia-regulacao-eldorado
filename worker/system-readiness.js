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

function integer(value) {
  const number = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(number) ? number : 0;
}

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

function normalizedDeveloperList(value) {
  return String(value || '')
    .split(',')
    .map(normalizeUsername)
    .filter(Boolean);
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
  const currentDeveloperUsername = normalizeUsername(user.username);
  const firebase = {
    projectId: present(env.FIREBASE_PROJECT_ID),
    clientEmail: present(env.FIREBASE_CLIENT_EMAIL),
    privateKey: present(env.FIREBASE_PRIVATE_KEY),
    webApiKey: present(env.FIREBASE_WEB_API_KEY),
    storageBucket: present(env.FIREBASE_STORAGE_BUCKET)
  };
  const firebaseReady = Object.values(firebase).every(Boolean);
  const developerProtected = developerList.includes(currentDeveloperUsername);
  const rateLimitSecretReady = present(env.AUTH_RATE_LIMIT_SECRET);
  const sessionSecretReady = present(env.AUTH_SESSION_SECRET);
  const emailVerificationRequired = enabled(env.AUTH_REQUIRE_EMAIL_VERIFICATION);
  const legacyMigrationEnabled = enabled(env.AUTH_MIGRATE_LEGACY_ADMINS);
  const gemini = {
    apiKey: present(env.GEMINI_API_KEY),
    primaryModel: present(env.GEMINI_MODEL),
    fallbackModels: present(env.GEMINI_FALLBACK_MODELS),
    requestTimeoutMs: integer(env.GEMINI_REQUEST_TIMEOUT_MS),
    totalTimeoutMs: integer(env.GEMINI_TOTAL_TIMEOUT_MS)
  };
  const geminiTimeoutsReady = gemini.requestTimeoutMs >= 1000
    && gemini.requestTimeoutMs <= 15000
    && gemini.totalTimeoutMs >= gemini.requestTimeoutMs
    && gemini.totalTimeoutMs <= 40000;
  const cloudflareAi = {
    binding: Boolean(env.AI && typeof env.AI.run === 'function'),
    enabled: enabled(env.CLOUDFLARE_AI_FALLBACK_ENABLED),
    model: present(env.CLOUDFLARE_AI_MODEL),
    timeoutMs: integer(env.CLOUDFLARE_AI_TIMEOUT_MS)
  };
  const cloudflareAiReady = cloudflareAi.binding
    && cloudflareAi.enabled
    && cloudflareAi.model
    && cloudflareAi.timeoutMs >= 1000
    && cloudflareAi.timeoutMs <= 20000;

  const checks = [
    {
      id: 'developer-list',
      label: 'Desenvolvedor identificado no Worker',
      ok: developerProtected,
      requiredBeforeDeploy: true,
      detail: developerProtected
        ? 'Sua conta consta na lista protegida de Desenvolvedores.'
        : developerList.length
          ? `A lista está configurada, mas não corresponde ao usuário atual (${currentDeveloperUsername || 'não identificado'}).`
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
      id: 'gemini-key',
      label: 'Chave do Gemini no Worker',
      ok: gemini.apiKey,
      requiredBeforeDeploy: true,
      detail: gemini.apiKey
        ? 'GEMINI_API_KEY está configurada como segredo.'
        : 'Configure GEMINI_API_KEY como segredo no painel da Cloudflare.'
    },
    {
      id: 'gemini-resilience',
      label: 'Limites de tempo e modelo de contingência da IA',
      ok: gemini.primaryModel && gemini.fallbackModels && geminiTimeoutsReady,
      requiredBeforeDeploy: true,
      detail: gemini.primaryModel && gemini.fallbackModels && geminiTimeoutsReady
        ? `Tentativas limitadas a ${gemini.requestTimeoutMs} ms, com orçamento total de ${gemini.totalTimeoutMs} ms e modelo alternativo.`
        : 'Configure modelo primário, modelo alternativo e limites de tempo seguros para a IA.'
    },
    {
      id: 'cloudflare-ai-fallback',
      label: 'Segundo provedor independente de IA',
      ok: cloudflareAiReady,
      requiredBeforeDeploy: true,
      detail: cloudflareAiReady
        ? `Workers AI está conectado como contingência, com limite de ${cloudflareAi.timeoutMs} ms.`
        : 'Configure o binding AI, o modelo e o limite de tempo da contingência Cloudflare.'
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
    gemini,
    cloudflareAi,
    flags: {
      legacyMigrationEnabled,
      emailVerificationRequired
    }
  }, 200, origin);
}
