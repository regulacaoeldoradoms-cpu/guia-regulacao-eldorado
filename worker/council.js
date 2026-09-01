'use strict';

import { validatePortalSession } from './auth-management-flex.js';
import { validateAttachmentFile, extensionForAttachment } from './attachment-safety.js';
import {
  firebaseConfigured,
  firestoreCreate,
  firestoreGet,
  firestorePatch,
  firestoreList,
  storageUpload,
  storageDownload
} from './firebase-gateway.js';

const NEW_MANIFESTATION_INTERVAL_SECONDS = 2 * 60 * 60;
const MAX_TEXT = 8000;
const MAX_SUBJECT = 180;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const TYPES = new Set(['sugestao', 'reclamacao', 'elogio', 'denuncia']);
const STATUSES = new Set(['recebida', 'em_analise', 'aguardando_cidadao', 'encaminhada', 'aguardando_retorno', 'respondida', 'concluida', 'arquivada']);
const ATTACHMENT_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const ROLE_LABELS = Object.freeze({
  medico: 'Médico',
  recepcao: 'Recepção',
  coordenacao: 'Coordenação',
  admin: 'Desenvolvedor',
  cidadao: 'Cidadão'
});

function headers(origin, allowed = true) {
  const result = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
  if (allowed && origin) {
    result['Access-Control-Allow-Origin'] = origin;
    result.Vary = 'Origin';
  }
  return result;
}

function json(body, status, origin, allowed = true, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers(origin, allowed), 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders }
  });
}

function preflight(origin, allowed) {
  if (!allowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const h = headers(origin, true);
  h['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS';
  h['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  h['Access-Control-Max-Age'] = '600';
  return new Response(null, { status: 204, headers: h });
}

function nowIso() {
  return new Date().toISOString();
}

function randomId(prefix = 'id') {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Date.now().toString(36)}_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

async function ensureSchema(env) {
  if (!env.AUTH_DB) return false;
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS council_protocol_counter (
    year INTEGER PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
  )`).run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS council_manifestation_index (
    protocol TEXT PRIMARY KEY,
    author_username TEXT NOT NULL,
    privacy_mode TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_council_author_created ON council_manifestation_index(author_username, created_at DESC)').run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS portal_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    category TEXT NOT NULL,
    protocol TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TEXT
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_portal_notifications_user ON portal_notifications(username, read_at, id DESC)').run();
  await env.AUTH_DB.prepare(`CREATE TABLE IF NOT EXISTS council_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_username TEXT NOT NULL,
    action TEXT NOT NULL,
    protocol TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_council_audit_protocol ON council_audit_log(protocol, created_at DESC)').run();
  await env.AUTH_DB.prepare('CREATE INDEX IF NOT EXISTS idx_council_audit_actor ON council_audit_log(actor_username, created_at DESC)').run();
  return true;
}

function councilAccess(user) {
  return user && (user.councilRole === 'membro' || user.councilRole === 'presidente');
}

function presidentAccess(user) {
  return user && user.councilRole === 'presidente';
}

function citizenContext(url) {
  return String(url?.searchParams?.get('as') || '').toLowerCase() === 'citizen';
}

export function manifestationPrivacyMode(user, requestedMode = '') {
  const mode = String(requestedMode || '').toLowerCase();
  if (mode === 'identificada') return 'identificada';
  return user?.emailVerified === true ? 'sigilosa' : 'anonima';
}

function safeAuthorIdentity(identity) {
  if (!identity || typeof identity !== 'object') return null;
  const role = clean(identity.role, 30);
  return {
    displayName: clean(identity.displayName, 80),
    handle: clean(identity.handle, 40),
    role,
    roleLabel: clean(identity.roleLabel || ROLE_LABELS[role] || 'Usuário', 80),
    jobTitle: clean(identity.jobTitle, 120)
  };
}

async function identifiedAuthorSnapshot(env, user) {
  let row = null;
  try {
    const columns = await env.AUTH_DB.prepare('PRAGMA table_info(auth_users)').all();
    const names = new Set((columns.results || []).map((item) => String(item.name || '')));
    if (names.has('public_handle')) {
      row = await env.AUTH_DB.prepare(`SELECT name, job_title AS jobTitle, role,
        COALESCE(public_handle, '') AS publicHandle
        FROM auth_users WHERE username = ?`).bind(user.username).first();
    } else {
      row = await env.AUTH_DB.prepare(`SELECT name, job_title AS jobTitle, role
        FROM auth_users WHERE username = ?`).bind(user.username).first();
    }
  } catch (_) {}

  const role = clean(row?.role || user?.role, 30);
  return safeAuthorIdentity({
    displayName: row?.name || user?.name || user?.username,
    handle: row?.publicHandle || user?.username,
    role,
    roleLabel: ROLE_LABELS[role] || 'Usuário',
    jobTitle: row?.jobTitle || user?.jobTitle || ''
  });
}

function protectedManifestation(doc) {
  if (!doc) return null;
  const { authorUsername, authorIdentity, ...safe } = doc;
  if (safe.privacyMode === 'identificada' && authorIdentity) {
    const identity = safeAuthorIdentity(authorIdentity);
    return {
      ...safe,
      authorIdentity: identity,
      authorLabel: identity?.displayName || 'Usuário identificado'
    };
  }
  return {
    ...safe,
    authorLabel: safe.privacyMode === 'anonima' ? 'Usuário anônimo' : 'Usuário · identidade protegida'
  };
}

function protectedAttachment(doc) {
  if (!doc) return null;
  const { objectName, fileName, ...safe } = doc;
  return {
    ...safe,
    displayName: `Anexo ${String(doc.id || '').slice(-6).toUpperCase() || ''}`.trim()
  };
}

function protectedInternalNote(doc) {
  if (!doc) return null;
  const { authorUsername, ...safe } = doc;
  return safe;
}

async function nextProtocol(env) {
  const year = new Date().getFullYear();
  const row = await env.AUTH_DB.prepare(`INSERT INTO council_protocol_counter(year, value) VALUES (?, 1)
    ON CONFLICT(year) DO UPDATE SET value = value + 1
    RETURNING value`).bind(year).first();
  return `CMS-${year}-${String(Number(row?.value || 1)).padStart(6, '0')}`;
}

async function ownership(env, protocol, username) {
  const row = await env.AUTH_DB.prepare('SELECT protocol, author_username AS authorUsername, privacy_mode AS privacyMode FROM council_manifestation_index WHERE protocol = ?')
    .bind(protocol).first();
  return row && row.authorUsername === username ? row : null;
}

async function notify(env, username, protocol, title, category = 'conselho') {
  if (!username) return;
  await env.AUTH_DB.prepare('INSERT INTO portal_notifications(username, category, protocol, title) VALUES (?, ?, ?, ?)')
    .bind(username, category, protocol || '', clean(title, 180)).run();
}

async function audit(env, user, action, protocol = '') {
  if (!env.AUTH_DB || !user?.username) return;
  await env.AUTH_DB.prepare('INSERT INTO council_audit_log(actor_username, action, protocol) VALUES (?, ?, ?)')
    .bind(user.username, clean(action, 80), clean(protocol, 32))
    .run()
    .catch(() => null);
}

async function addEvent(env, protocol, event) {
  const id = randomId('evt');
  await firestoreCreate(env, `council_manifestations/${protocol}/events`, id, {
    id,
    type: event.type,
    actorType: event.actorType || 'system',
    actorLabel: event.actorLabel || '',
    fromStatus: event.fromStatus || '',
    toStatus: event.toStatus || '',
    detail: event.detail || '',
    createdAt: nowIso()
  });
}

async function createManifestation(request, env, user, origin) {
  if (presidentAccess(user)) {
    return json({
      error: 'A Presidência do Conselho não pode abrir manifestação enquanto estiver exercendo essa função institucional.',
      code: 'COUNCIL_PRESIDENT_CANNOT_SUBMIT'
    }, 403, origin);
  }

  if (!firebaseConfigured(env)) return json({ error: 'O módulo do Conselho está pronto, mas o Firebase ainda precisa ser conectado pelo desenvolvedor.', code: 'FIREBASE_PENDING' }, 503, origin);

  await ensureSchema(env);
  const last = await env.AUTH_DB.prepare("SELECT created_at AS createdAt FROM council_manifestation_index WHERE author_username = ? AND created_at >= datetime('now', '-2 hours') ORDER BY created_at DESC LIMIT 1")
    .bind(user.username).first();
  if (last) {
    const created = new Date(`${String(last.createdAt).replace(' ', 'T')}Z`).getTime();
    const retry = Math.max(60, NEW_MANIFESTATION_INTERVAL_SECONDS - Math.floor((Date.now() - created) / 1000));
    return json({ error: 'É permitido abrir uma nova manifestação a cada 2 horas. Você pode continuar respondendo normalmente às manifestações já existentes.', retryAfterSeconds: retry }, 429, origin, true, { 'Retry-After': String(retry) });
  }

  const body = await request.json().catch(() => ({}));
  const type = clean(body.type, 30);
  const subject = clean(body.subject, MAX_SUBJECT);
  const description = clean(body.description, MAX_TEXT);
  const service = clean(body.service, 160);
  const requestedPrivacyMode = clean(body.privacyMode, 20);
  if (!TYPES.has(type)) return json({ error: 'Escolha um tipo de manifestação válido.' }, 400, origin);
  if (subject.length < 3) return json({ error: 'Informe um assunto para a manifestação.' }, 400, origin);
  if (description.length < 10) return json({ error: 'Descreva a situação com um pouco mais de detalhe.' }, 400, origin);

  const protocol = await nextProtocol(env);
  const createdAt = nowIso();
  const privacyMode = manifestationPrivacyMode(user, requestedPrivacyMode);
  const authorIdentity = privacyMode === 'identificada' ? await identifiedAuthorSnapshot(env, user) : null;
  const doc = {
    protocol,
    privacyMode,
    type,
    service,
    subject,
    description,
    status: 'recebida',
    createdAt,
    updatedAt: createdAt,
    lastActivityAt: createdAt,
    attachmentCount: 0
  };
  if (authorIdentity) doc.authorIdentity = authorIdentity;

  await firestoreCreate(env, 'council_manifestations', protocol, doc);
  await env.AUTH_DB.prepare('INSERT INTO council_manifestation_index(protocol, author_username, privacy_mode) VALUES (?, ?, ?)')
    .bind(protocol, user.username, privacyMode).run();
  await addEvent(env, protocol, { type: 'created', actorType: 'user', detail: 'Manifestação recebida pelo Conselho.' });
  return json({ manifestation: doc }, 201, origin);
}

async function citizenList(env, user, origin) {
  await ensureSchema(env);
  const result = await env.AUTH_DB.prepare('SELECT protocol FROM council_manifestation_index WHERE author_username = ? ORDER BY created_at DESC LIMIT 100')
    .bind(user.username).all();
  const manifestations = [];
  for (const row of result.results || []) {
    const doc = await firestoreGet(env, `council_manifestations/${row.protocol}`).catch(() => null);
    if (doc) {
      const { authorUsername, ...safe } = doc;
      manifestations.push(safe);
    }
  }
  return json({ manifestations }, 200, origin);
}

async function councilList(env, user, origin) {
  if (!councilAccess(user)) return json({ error: 'Acesso restrito aos membros autorizados do Conselho.' }, 403, origin);
  if (!firebaseConfigured(env)) return json({ error: 'Firebase do Conselho ainda não configurado.', code: 'FIREBASE_PENDING' }, 503, origin);
  const result = await firestoreList(env, 'council_manifestations', { pageSize: 100, orderBy: 'createdAt desc' });
  return json({ manifestations: result.documents.map(protectedManifestation), nextPageToken: result.nextPageToken }, 200, origin);
}

async function detail(env, user, protocol, origin, asCitizen = false) {
  const own = await ownership(env, protocol, user.username);
  const isCouncil = !asCitizen && councilAccess(user);
  if (asCitizen && !own) return json({ error: 'Manifestação não encontrada ou sem permissão de acesso.' }, 404, origin);
  if (!isCouncil && !own) return json({ error: 'Manifestação não encontrada ou sem permissão de acesso.' }, 404, origin);
  const doc = await firestoreGet(env, `council_manifestations/${protocol}`);
  if (!doc) return json({ error: 'Manifestação não encontrada.' }, 404, origin);
  const [messages, events, attachments] = await Promise.all([
    firestoreList(env, `council_manifestations/${protocol}/messages`, { pageSize: 100, orderBy: 'createdAt asc' }),
    firestoreList(env, `council_manifestations/${protocol}/events`, { pageSize: 100, orderBy: 'createdAt asc' }),
    firestoreList(env, `council_manifestations/${protocol}/attachments`, { pageSize: 20, orderBy: 'createdAt asc' }).catch(() => ({ documents: [] }))
  ]);
  let notes = [];
  if (isCouncil) {
    notes = (await firestoreList(env, `council_manifestations/${protocol}/internal_notes`, { pageSize: 100, orderBy: 'createdAt asc' }).catch(() => ({ documents: [] }))).documents
      .map(protectedInternalNote);
    await audit(env, user, 'manifestation.view', protocol);
  }
  const safeDoc = isCouncil ? protectedManifestation(doc) : (() => { const { authorUsername, ...safe } = doc; return safe; })();
  return json({
    manifestation: safeDoc,
    messages: messages.documents,
    events: events.documents,
    internalNotes: notes,
    attachments: attachments.documents.map(protectedAttachment)
  }, 200, origin);
}

async function addMessage(request, env, user, protocol, origin, asCitizen = false) {
  const own = await ownership(env, protocol, user.username);
  const isCouncil = !asCitizen && councilAccess(user);
  if (asCitizen && !own) return json({ error: 'Sem permissão para responder a esta manifestação.' }, 403, origin);
  if (!isCouncil && !own) return json({ error: 'Sem permissão para responder a esta manifestação.' }, 403, origin);
  if (isCouncil && !presidentAccess(user)) return json({ error: 'Na V1, somente a Presidência registra respostas oficiais ao usuário.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const text = clean(body.body, MAX_TEXT);
  if (!text) return json({ error: 'Digite a mensagem.' }, 400, origin);
  const createdAt = nowIso();
  const message = {
    id: randomId('msg'),
    body: text,
    senderType: isCouncil ? 'council' : 'citizen',
    senderLabel: isCouncil ? 'Conselho Municipal de Saúde' : 'Usuário',
    createdAt
  };
  await firestoreCreate(env, `council_manifestations/${protocol}/messages`, message.id, message);
  await firestorePatch(env, `council_manifestations/${protocol}`, { updatedAt: createdAt, lastActivityAt: createdAt });
  await addEvent(env, protocol, { type: 'message', actorType: isCouncil ? 'council' : 'user', actorLabel: message.senderLabel, detail: isCouncil ? 'Nova resposta oficial registrada.' : 'Nova resposta do usuário.' });
  const index = await env.AUTH_DB.prepare('SELECT author_username AS authorUsername FROM council_manifestation_index WHERE protocol = ?').bind(protocol).first();
  if (isCouncil && index?.authorUsername) {
    await notify(env, index.authorUsername, protocol, 'O Conselho respondeu à sua manifestação.');
    await audit(env, user, 'manifestation.official_reply', protocol);
  }
  return json({ message }, 201, origin);
}

async function addInternalNote(request, env, user, protocol, origin) {
  if (!councilAccess(user)) return json({ error: 'Acesso restrito ao Conselho.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const text = clean(body.body, MAX_TEXT);
  if (!text) return json({ error: 'Digite a observação interna.' }, 400, origin);
  const note = { id: randomId('note'), body: text, authorUsername: user.username, authorLabel: user.name || user.username, createdAt: nowIso() };
  await firestoreCreate(env, `council_manifestations/${protocol}/internal_notes`, note.id, note);
  await addEvent(env, protocol, { type: 'internal_note', actorType: 'council', actorLabel: user.name || user.username, detail: 'Observação interna registrada.' });
  await audit(env, user, 'manifestation.internal_note', protocol);
  return json({ note: protectedInternalNote(note) }, 201, origin);
}

async function changeStatus(request, env, user, protocol, origin) {
  if (!presidentAccess(user)) return json({ error: 'Somente a Presidência pode alterar o andamento oficial.' }, 403, origin);
  const body = await request.json().catch(() => ({}));
  const status = clean(body.status, 40);
  if (!STATUSES.has(status)) return json({ error: 'Status inválido.' }, 400, origin);
  const doc = await firestoreGet(env, `council_manifestations/${protocol}`);
  if (!doc) return json({ error: 'Manifestação não encontrada.' }, 404, origin);
  if (doc.status === status) return json({ manifestation: protectedManifestation(doc) }, 200, origin);
  const updatedAt = nowIso();
  const updated = await firestorePatch(env, `council_manifestations/${protocol}`, { status, updatedAt, lastActivityAt: updatedAt });
  await addEvent(env, protocol, {
    type: 'status_changed', actorType: 'council', actorLabel: user.name || 'Presidência',
    fromStatus: doc.status || '', toStatus: status, detail: clean(body.detail, 500)
  });
  const index = await env.AUTH_DB.prepare('SELECT author_username AS authorUsername FROM council_manifestation_index WHERE protocol = ?').bind(protocol).first();
  if (index?.authorUsername) await notify(env, index.authorUsername, protocol, 'O andamento da sua manifestação foi atualizado.');
  await audit(env, user, `manifestation.status.${status}`, protocol);
  return json({ manifestation: protectedManifestation(updated) }, 200, origin);
}

async function notifications(request, env, user, origin) {
  await ensureSchema(env);
  if (request.method === 'GET') {
    const result = await env.AUTH_DB.prepare(`SELECT id, category, protocol, title, created_at AS createdAt, read_at AS readAt
      FROM portal_notifications WHERE username = ? ORDER BY id DESC LIMIT 100`).bind(user.username).all();
    return json({ notifications: result.results || [] }, 200, origin);
  }
  const body = await request.json().catch(() => ({}));
  const id = Number(body.id || 0);
  if (id > 0) await env.AUTH_DB.prepare('UPDATE portal_notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ? AND username = ?').bind(id, user.username).run();
  else await env.AUTH_DB.prepare('UPDATE portal_notifications SET read_at = CURRENT_TIMESTAMP WHERE username = ? AND read_at IS NULL').bind(user.username).run();
  return json({ ok: true }, 200, origin);
}

async function attachmentCount(env, protocol) {
  const result = await firestoreList(env, `council_manifestations/${protocol}/attachments`, { pageSize: 20 }).catch(() => ({ documents: [] }));
  return result.documents.length;
}

async function uploadAttachment(request, env, user, protocol, origin, asCitizen = false) {
  const own = await ownership(env, protocol, user.username);
  const isCouncil = !asCitizen && councilAccess(user);
  if (asCitizen && !own) return json({ error: 'Sem permissão para anexar arquivo.' }, 403, origin);
  if (!isCouncil && !own) return json({ error: 'Sem permissão para anexar arquivo.' }, 403, origin);
  if ((await attachmentCount(env, protocol)) >= MAX_ATTACHMENTS) return json({ error: `Cada manifestação pode ter no máximo ${MAX_ATTACHMENTS} anexos.` }, 400, origin);
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'Selecione um arquivo.' }, 400, origin);
  if (file.type && !ATTACHMENT_TYPES.has(file.type)) return json({ error: 'Use arquivo JPG, PNG ou PDF.' }, 400, origin);
  if (file.size > MAX_ATTACHMENT_BYTES) return json({ error: 'Cada arquivo pode ter no máximo 5 MB.' }, 400, origin);

  let validated;
  try {
    validated = await validateAttachmentFile(file, MAX_ATTACHMENT_BYTES);
  } catch (error) {
    const message = error?.message === 'ATTACHMENT_TOO_LARGE'
      ? 'Cada arquivo pode ter no máximo 5 MB.'
      : error?.message || 'O arquivo enviado não é válido.';
    return json({ error: message }, 400, origin);
  }

  const id = randomId('att');
  const objectName = `conselho/${protocol}/${id}.${validated.extension}`;
  const stored = await storageUpload(env, objectName, validated.buffer, validated.contentType);
  const attachment = {
    id,
    contentType: validated.contentType,
    size: file.size,
    objectName: stored.name || objectName,
    senderType: isCouncil ? 'council' : 'citizen',
    createdAt: nowIso()
  };
  await firestoreCreate(env, `council_manifestations/${protocol}/attachments`, id, attachment);
  await firestorePatch(env, `council_manifestations/${protocol}`, { attachmentCount: (await attachmentCount(env, protocol)), updatedAt: nowIso() });
  await addEvent(env, protocol, { type: 'attachment', actorType: isCouncil ? 'council' : 'user', detail: 'Novo anexo incluído.' });
  if (isCouncil) await audit(env, user, 'attachment.upload', protocol);
  return json({ attachment: protectedAttachment(attachment) }, 201, origin);
}

async function downloadAttachment(env, user, protocol, attachmentId, origin, asCitizen = false) {
  const own = await ownership(env, protocol, user.username);
  const isCouncil = !asCitizen && councilAccess(user);
  if (asCitizen && !own) return json({ error: 'Sem permissão para acessar o anexo.' }, 403, origin);
  if (!isCouncil && !own) return json({ error: 'Sem permissão para acessar o anexo.' }, 403, origin);
  const attachment = await firestoreGet(env, `council_manifestations/${protocol}/attachments/${attachmentId}`);
  if (!attachment?.objectName) return json({ error: 'Anexo não encontrado.' }, 404, origin);
  const upstream = await storageDownload(env, attachment.objectName);
  if (!upstream.ok) return json({ error: 'Não foi possível carregar o anexo.' }, upstream.status, origin);
  if (isCouncil) await audit(env, user, 'attachment.view', protocol);
  const h = headers(origin, true);
  h['Content-Type'] = attachment.contentType || 'application/octet-stream';
  const disposition = attachment.contentType === 'application/pdf' ? 'attachment' : 'inline';
  const extension = extensionForAttachment(attachment.contentType);
  h['Content-Disposition'] = `${disposition}; filename="anexo-${String(attachmentId).slice(-6)}.${extension}"`;
  return new Response(upstream.body, { status: 200, headers: h });
}

export function isCouncilApi(pathname) {
  return String(pathname || '').startsWith('/api/council/');
}

export async function handleCouncilRoute(request, env, origin, originAllowed = true) {
  if (request.method === 'OPTIONS') return preflight(origin, originAllowed);
  if (!originAllowed) return json({ error: 'Origem não autorizada.' }, 403, origin, false);
  const user = await validatePortalSession(request, env, []);
  if (!user) return json({ error: 'Sessão inválida ou expirada.' }, 401, origin);
  if (!env.AUTH_DB) return json({ error: 'Banco do portal ainda não disponível.' }, 503, origin);
  await ensureSchema(env);
  const url = new URL(request.url);
  const asCitizen = citizenContext(url);

  if (url.pathname === '/api/council/config' && request.method === 'GET') {
    return json({
      enabled: firebaseConfigured(env),
      councilRole: user.councilRole || '',
      role: user.role,
      citizenAccess: true,
      canCreateManifestation: !presidentAccess(user),
      canIdentifyManifestation: true,
      canUseConfidentialManifestation: user.emailVerified === true,
      newManifestationIntervalSeconds: NEW_MANIFESTATION_INTERVAL_SECONDS
    }, 200, origin);
  }
  if (url.pathname === '/api/council/manifestations' && request.method === 'POST') return createManifestation(request, env, user, origin);
  if (url.pathname === '/api/council/my' && request.method === 'GET') return citizenList(env, user, origin);
  if (url.pathname === '/api/council/all' && request.method === 'GET') {
    if (asCitizen) return json({ error: 'A listagem institucional do Conselho não está disponível na área de acompanhamento das próprias manifestações.' }, 403, origin);
    return councilList(env, user, origin);
  }
  if (url.pathname === '/api/council/notifications' && (request.method === 'GET' || request.method === 'PATCH')) return notifications(request, env, user, origin);

  let match = url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})$/);
  if (match && request.method === 'GET') return detail(env, user, match[1], origin, asCitizen);
  if (match && request.method === 'PATCH') {
    if (asCitizen) return json({ error: 'Ações institucionais não estão disponíveis na área de acompanhamento das próprias manifestações.' }, 403, origin);
    return changeStatus(request, env, user, match[1], origin);
  }

  match = url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})\/messages$/);
  if (match && request.method === 'POST') return addMessage(request, env, user, match[1], origin, asCitizen);

  match = url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})\/internal-notes$/);
  if (match && request.method === 'POST') {
    if (asCitizen) return json({ error: 'Observações internas pertencem ao painel institucional do Conselho.' }, 403, origin);
    return addInternalNote(request, env, user, match[1], origin);
  }

  match = url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})\/attachments$/);
  if (match && request.method === 'POST') return uploadAttachment(request, env, user, match[1], origin, asCitizen);

  match = url.pathname.match(/^\/api\/council\/manifestations\/(CMS-\d{4}-\d{6})\/attachments\/([A-Za-z0-9_-]+)$/);
  if (match && request.method === 'GET') return downloadAttachment(env, user, match[1], match[2], origin, asCitizen);

  return json({ error: 'Rota do Conselho não encontrada.' }, 404, origin);
}