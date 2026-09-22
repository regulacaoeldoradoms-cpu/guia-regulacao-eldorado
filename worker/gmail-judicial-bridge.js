'use strict';

import { notifyUserPush } from './push-notifications.js';
import { ensureJudicialNotificationSchema, syncSocialUser } from './social-schema.js';

const BRIDGE_PATH = '/api/integrations/gmail-judicial';
const DEFAULT_RECIPIENTS = Object.freeze(['wellyton', 'josiane', 'lorrana']);
const MAX_MESSAGE_ID = 240;
const MAX_THREAD_ID = 240;
const MAX_SENDER = 320;
const MAX_SUBJECT = 500;
const MIN_SECRET_LENGTH = 32;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

function cleanText(value, maximum) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, maximum);
}

function normalizedRecipient(value) {
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

function randomId(prefix) {
  const value = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${value}`;
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value || ''))));
}

async function constantTimeEqual(left, right) {
  const [a, b] = await Promise.all([sha256(left), sha256(right)]);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

async function authorized(request, env) {
  const configured = String(env?.GMAIL_BRIDGE_SECRET || '');
  if (configured.length < MIN_SECRET_LENGTH) return { ok: false, configured: false };
  const supplied = String(request.headers.get('X-Portal-Bridge-Secret') || '');
  if (supplied.length < MIN_SECRET_LENGTH) return { ok: false, configured: true };
  return { ok: await constantTimeEqual(configured, supplied), configured: true };
}

export function bridgeRecipients(value) {
  const source = String(value || '').trim();
  const items = (source ? source.split(',') : DEFAULT_RECIPIENTS)
    .map(normalizedRecipient)
    .filter(Boolean);
  const unique = [...new Set(items)].slice(0, 12);
  return unique.length ? unique : [...DEFAULT_RECIPIENTS];
}

export function normalizeBridgePayload(body) {
  const dryRun = body?.dryRun === true;
  if (dryRun) return { dryRun: true };

  const messageId = cleanText(body?.messageId, MAX_MESSAGE_ID);
  const threadId = cleanText(body?.threadId, MAX_THREAD_ID);
  const sender = cleanText(body?.sender, MAX_SENDER);
  const subject = cleanText(body?.subject, MAX_SUBJECT) || '(sem assunto)';
  const received = new Date(String(body?.receivedAt || ''));

  if (!messageId) return { error: 'MESSAGE_ID_REQUIRED' };
  if (Number.isNaN(received.getTime())) return { error: 'RECEIVED_AT_INVALID' };

  return {
    dryRun: false,
    messageId,
    threadId,
    sender,
    subject,
    receivedAt: received.toISOString()
  };
}

export function recipientNameTarget(value) {
  return normalizedRecipient(value).replace(/[._-]+/g, ' ').trim();
}

async function authUserForRecipient(env, requested) {
  const normalized = normalizedRecipient(requested);
  const nameTarget = recipientNameTarget(requested);
  if (!normalized || !nameTarget) return null;

  const result = await env.AUTH_DB.prepare(`SELECT username,
      CASE
        WHEN LOWER(username) = ? THEN 0
        WHEN LOWER(COALESCE(public_handle, '')) = ? THEN 1
        WHEN LOWER(TRIM(COALESCE(name, ''))) = ? THEN 2
        WHEN LOWER(TRIM(COALESCE(name, ''))) LIKE ? THEN 3
        ELSE 9
      END AS matchRank
    FROM auth_users
    WHERE active = 1
      AND (
        LOWER(username) = ?
        OR LOWER(COALESCE(public_handle, '')) = ?
        OR LOWER(TRIM(COALESCE(name, ''))) = ?
        OR LOWER(TRIM(COALESCE(name, ''))) LIKE ?
      )
    ORDER BY matchRank, LOWER(username)
    LIMIT 6`)
    .bind(
      normalized,
      normalized,
      nameTarget,
      nameTarget + ' %',
      normalized,
      normalized,
      nameTarget,
      nameTarget + ' %'
    )
    .all();

  const rows = result.results || [];
  if (!rows.length) return null;
  const bestRank = Number(rows[0].matchRank);
  const best = rows.filter((row) => Number(row.matchRank) === bestRank);
  return best.length === 1 ? { username: best[0].username } : null;
}

async function resolveRecipients(env) {
  const requested = bridgeRecipients(env.GMAIL_JUDICIAL_RECIPIENTS);
  const recipients = [];
  const missingRecipients = [];

  for (const target of requested) {
    const auth = await authUserForRecipient(env, target);
    if (!auth?.username) {
      missingRecipients.push(target);
      continue;
    }
    const social = await syncSocialUser(env, auth.username);
    if (!social?.social_user_id) {
      missingRecipients.push(target);
      continue;
    }
    recipients.push({
      requested: target,
      username: auth.username,
      socialUserId: social.social_user_id
    });
  }

  return { requested, recipients, missingRecipients };
}

async function upsertAlert(env, payload) {
  const existing = await env.AUTH_DB.prepare(
    'SELECT id FROM portal_judicial_alerts WHERE gmail_message_id = ? LIMIT 1'
  ).bind(payload.messageId).first();

  const id = existing?.id || randomId('judicial');
  if (!existing?.id) {
    await env.AUTH_DB.prepare(`INSERT INTO portal_judicial_alerts
      (id, gmail_message_id, gmail_thread_id, sender, subject, received_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(gmail_message_id) DO UPDATE SET
        gmail_thread_id = excluded.gmail_thread_id,
        sender = excluded.sender,
        subject = excluded.subject,
        received_at = excluded.received_at`)
      .bind(id, payload.messageId, payload.threadId, payload.sender, payload.subject, payload.receivedAt)
      .run();
  }

  const row = await env.AUTH_DB.prepare(
    'SELECT id FROM portal_judicial_alerts WHERE gmail_message_id = ? LIMIT 1'
  ).bind(payload.messageId).first();

  if (!row?.id) throw new Error('JUDICIAL_ALERT_NOT_PERSISTED');
  return { id: row.id, duplicate: Boolean(existing?.id) };
}

export function isGmailJudicialBridgeApi(pathname) {
  return String(pathname || '') === BRIDGE_PATH;
}

export async function handleGmailJudicialBridge(request, env, executionContext = null) {
  if (request.method !== 'POST') {
    return json({ error: 'Método não permitido.' }, 405);
  }

  const authorization = await authorized(request, env);
  if (!authorization.configured) {
    return json({ error: 'Ponte Gmail ainda não configurada.', code: 'GMAIL_BRIDGE_NOT_CONFIGURED' }, 503);
  }
  if (!authorization.ok) {
    return json({ error: 'Credencial da ponte inválida.', code: 'GMAIL_BRIDGE_UNAUTHORIZED' }, 401);
  }

  if (!(await ensureJudicialNotificationSchema(env))) {
    return json({ error: 'Banco social indisponível.', code: 'SOCIAL_DATABASE_UNAVAILABLE' }, 503);
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'Payload inválido.', code: 'INVALID_JSON' }, 400);
  }

  const payload = normalizeBridgePayload(body);
  if (payload.error) {
    return json({ error: 'Payload inválido.', code: payload.error }, 400);
  }

  const resolved = await resolveRecipients(env);
  const completeRecipients = resolved.missingRecipients.length === 0
    && resolved.recipients.length === resolved.requested.length;

  if (payload.dryRun) {
    return json({
      ok: true,
      dryRun: true,
      complete: completeRecipients,
      recipients: resolved.recipients.map((item) => item.username),
      missingRecipients: resolved.missingRecipients
    });
  }

  const alert = await upsertAlert(env, payload);
  const notifiedRecipients = [];
  const pushTasks = [];

  for (const recipient of resolved.recipients) {
    const inserted = await env.AUTH_DB.prepare(`INSERT OR IGNORE INTO social_notifications
      (recipient_id, type, actor_id, entity_type, entity_id)
      VALUES (?, 'judicial_alert', NULL, 'judicial_email', ?)`)
      .bind(recipient.socialUserId, alert.id)
      .run();

    notifiedRecipients.push(recipient.username);
    if (Number(inserted.meta?.changes || 0) > 0) {
      const task = notifyUserPush(env, recipient.username).catch(() => ({ attempted: 0, accepted: 0 }));
      if (executionContext?.waitUntil) executionContext.waitUntil(task);
      else pushTasks.push(task);
    }
  }

  if (pushTasks.length) await Promise.allSettled(pushTasks);

  const complete = completeRecipients && notifiedRecipients.length === resolved.requested.length;
  return json({
    ok: true,
    complete,
    duplicate: alert.duplicate,
    alertId: alert.id,
    notifiedRecipients,
    missingRecipients: resolved.missingRecipients
  });
}

export const GMAIL_JUDICIAL_BRIDGE = Object.freeze({
  path: BRIDGE_PATH,
  defaultRecipients: DEFAULT_RECIPIENTS,
  minimumSecretLength: MIN_SECRET_LENGTH
});
