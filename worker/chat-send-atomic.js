'use strict';

const MESSAGE_LIMIT = 2000;
const CLIENT_ID_PATTERN = /^chat-[a-z0-9-]{12,90}$/i;
const PROFESSIONAL_ROLE_SQL = "'medico','recepcao','coordenacao','telemedicina','admin'";

function normalizeUsername(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    .replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '').replace(/[._-]{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '').slice(0, 40);
}

function serverTimestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function socialBackendEnabled(env) {
  return String(env?.SOCIAL_BACKEND_ENABLED || '').trim().toLowerCase() === 'true';
}

function requireProfessionalEmail(env) {
  return String(env?.AUTH_REQUIRE_EMAIL_VERIFICATION || '').trim().toLowerCase() === 'true';
}

export function validateAtomicChatSendInput(input = {}) {
  const fromUser = normalizeUsername(input.fromUser);
  const toUser = normalizeUsername(input.toUser);
  const body = String(input.body || '').trim();
  const clientId = String(input.clientId || '').trim().slice(0, 96);
  const sessionVersion = Math.max(0, Number.parseInt(String(input.sessionVersion || '0'), 10) || 0);

  if (!fromUser || !toUser || fromUser === toUser) {
    return { ok: false, code: 'CHAT_TARGET_INVALID', message: 'Contato não disponível para chat.' };
  }
  if (!body) return { ok: false, code: 'CHAT_MESSAGE_EMPTY', message: 'Digite uma mensagem.' };
  if (body.length > MESSAGE_LIMIT) {
    return { ok: false, code: 'CHAT_MESSAGE_TOO_LONG', message: `A mensagem pode ter no máximo ${MESSAGE_LIMIT} caracteres.` };
  }
  if (!CLIENT_ID_PATTERN.test(clientId)) {
    return { ok: false, code: 'CHAT_CLIENT_ID_INVALID', message: 'Identificador de envio inválido.' };
  }
  if (!sessionVersion) {
    return { ok: false, code: 'CHAT_SESSION_STALE', message: 'A sessão do chat precisa ser renovada.' };
  }
  return { ok: true, fromUser, toUser, body, clientId, sessionVersion };
}

function institutionalInsertSql() {
  return `INSERT OR IGNORE INTO portal_chat_messages
    (from_user, to_user, body, client_id, sent_at)
    SELECT sender.username, target.username, ?, ?, ?
    FROM auth_users sender
    JOIN auth_users target ON target.username = ?
    WHERE sender.username = ?
      AND sender.active = 1
      AND sender.session_version = ?
      AND target.active = 1
      AND (? = 0
        OR sender.email_verified = 1
        OR (
          sender.role NOT IN (${PROFESSIONAL_ROLE_SQL})
          AND COALESCE(sender.council_role, '') NOT IN ('membro','presidente')
        )
      )
      AND sender.role IN (${PROFESSIONAL_ROLE_SQL})
      AND target.role IN (${PROFESSIONAL_ROLE_SQL})`;
}

function socialAwareInsertSql() {
  return `INSERT OR IGNORE INTO portal_chat_messages
    (from_user, to_user, body, client_id, sent_at)
    SELECT sender.username, target.username, ?, ?, ?
    FROM auth_users sender
    JOIN auth_users target ON target.username = ?
    WHERE sender.username = ?
      AND sender.active = 1
      AND sender.session_version = ?
      AND target.active = 1
      AND (? = 0
        OR sender.email_verified = 1
        OR (
          sender.role NOT IN (${PROFESSIONAL_ROLE_SQL})
          AND COALESCE(sender.council_role, '') NOT IN ('membro','presidente')
        )
      )
      AND (
        (
          sender.role IN (${PROFESSIONAL_ROLE_SQL})
          AND target.role IN (${PROFESSIONAL_ROLE_SQL})
        )
        OR EXISTS (
          SELECT 1
          FROM social_users viewer
          JOIN social_relationships relationship
            ON relationship.state = 'friends'
            AND (
              relationship.pair_low = viewer.social_user_id
              OR relationship.pair_high = viewer.social_user_id
            )
          JOIN social_users friend
            ON friend.social_user_id = CASE
              WHEN relationship.pair_low = viewer.social_user_id
                THEN relationship.pair_high
              ELSE relationship.pair_low
            END
          WHERE viewer.auth_username = sender.username
            AND friend.auth_username = target.username
            AND viewer.suspended_at IS NULL
            AND friend.suspended_at IS NULL
        )
      )`;
}

async function runAuthorizedInsert(env, validated, sentAt, allowSocial) {
  const sql = allowSocial ? socialAwareInsertSql() : institutionalInsertSql();
  return env.AUTH_DB.prepare(sql).bind(
    validated.body,
    validated.clientId,
    sentAt,
    validated.toUser,
    validated.fromUser,
    validated.sessionVersion,
    requireProfessionalEmail(env) ? 1 : 0
  ).run();
}

async function duplicateMessage(env, fromUser, clientId) {
  return env.AUTH_DB.prepare(`SELECT id, from_user AS fromUser, to_user AS toUser, body,
      client_id AS clientId, sent_at AS sentAt, delivered_at AS deliveredAt, read_at AS readAt
    FROM portal_chat_messages
    WHERE from_user = ? AND client_id = ?
    LIMIT 1`).bind(fromUser, clientId).first();
}

function confirmedMessage(validated, id, sentAt) {
  return {
    id,
    fromUser: validated.fromUser,
    toUser: validated.toUser,
    body: validated.body,
    clientId: validated.clientId,
    sentAt,
    deliveredAt: null,
    readAt: null
  };
}

export async function persistAtomicChatMessage(env, input = {}) {
  if (!env?.AUTH_DB) {
    return { ok: false, status: 503, code: 'CHAT_DB_UNAVAILABLE', message: 'Banco do chat indisponível.' };
  }

  const validated = validateAtomicChatSendInput(input);
  if (!validated.ok) return { ...validated, status: validated.code === 'CHAT_SESSION_STALE' ? 401 : 400 };

  const sentAt = serverTimestamp();
  let inserted;
  const allowSocial = socialBackendEnabled(env);
  try {
    inserted = await runAuthorizedInsert(env, validated, sentAt, allowSocial);
  } catch (error) {
    if (!allowSocial || !/no such table:\s*social_/i.test(String(error?.message || error))) throw error;
    // Falha defensiva: o chat institucional continua disponível se o schema social
    // estiver temporariamente ausente; o canal social permanece bloqueado.
    inserted = await runAuthorizedInsert(env, validated, sentAt, false);
  }

  const changed = Number(inserted?.meta?.changes || 0);
  const id = Number(inserted?.meta?.last_row_id || 0);
  if (changed > 0 && id > 0) {
    return {
      ok: true,
      status: 201,
      created: true,
      duplicate: false,
      message: confirmedMessage(validated, id, sentAt)
    };
  }

  const existing = await duplicateMessage(env, validated.fromUser, validated.clientId);
  if (existing?.id) {
    return {
      ok: true,
      status: 200,
      created: false,
      duplicate: true,
      message: existing
    };
  }

  return {
    ok: false,
    status: 403,
    code: 'CHAT_SEND_NOT_ALLOWED',
    message: 'A sessão ou a autorização desta conversa mudou. Atualize o chat e tente novamente.'
  };
}

export const CHAT_ATOMIC_SEND_TEST = Object.freeze({
  messageLimit: MESSAGE_LIMIT,
  normalizeUsername,
  socialBackendEnabled,
  requireProfessionalEmail
});
