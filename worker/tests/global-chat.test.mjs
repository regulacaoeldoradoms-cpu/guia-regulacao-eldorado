import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

const authenticatedModules = [
  'index.html',
  'ferramentas/index.html',
  'amigos/index.html',
  'notificacoes/index.html',
  'perfil/index.html',
  'seguranca/index.html',
  'configuracoes/index.html',
  'conquistas/index.html',
  'estudos/index.html',
  'medico/index.html',
  'protocolo/index.html',
  'recepcao/index.html',
  'telemedicina/index.html',
  'documentos/index.html',
  'agenda/index.html',
  'agenda/sync/index.html',
  'cidadao/index.html',
  'conselho/painel/index.html',
  'admin/usuarios/index.html',
  'admin/monitoramento/index.html',
  'admin/configuracao/index.html',
  'admin/social/index.html'
];

test('chat global aparece em todos os módulos autenticados sem carga manual duplicada', () => {
  for (const path of authenticatedModules) {
    const html = read(path);
    assert.match(html, /portal-global-chat\.js\?v=20261002-emotes-attention-1/, path);
    assert.doesNotMatch(html, /<script[^>]+portal-chat\.js\?v=/, path);
    assert.doesNotMatch(html, /<script[^>]+portal-chat-switch-optimizer\.js\?v=/, path);
  }
});

test('superfícies públicas permanecem sem chat global', () => {
  for (const path of ['login/index.html', 'cadastro/index.html', 'conselho/index.html']) {
    assert.doesNotMatch(read(path), /portal-global-chat\.js/, path);
  }
});

test('bootstrap global exige sessão e preserva primeiro acesso', () => {
  const source = read('js/portal-global-chat.js');
  assert.match(source, /regulacao\.portal\.session/);
  assert.match(source, /if \(!storedToken\(\)\) return null/);
  assert.match(source, /user\.mustChangePassword/);
  assert.match(source, /portal-chat\.css\?v=20261002-emotes-attention-1/);
  assert.match(source, /portal-chat\.js\?v=20261002-emotes-attention-1/);
  assert.match(source, /portal-chat-switch-optimizer\.js\?v=20260928-global-1/);
});

test('componente global mantém autorização atual por cargo e amizade', () => {
  const client = read('js/portal-chat.js');
  const worker = read('worker/portal-chat-v2.js');
  assert.match(client, /CHAT_ROLES = new Set\(\['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin', 'cidadao'\]\)/);
  assert.match(worker, /PROFESSIONAL_ROLES = new Set\(\['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'\]\)/);
  assert.match(worker, /relationship\.state = 'friends'/);
});

test('chat e otimizador têm guarda de versão global', () => {
  assert.match(read('js/portal-chat.js'), /PortalChat\?\.version === '20261002-emotes-attention-1'/);
  assert.match(read('js/portal-chat.js'), /version: '20261002-emotes-attention-1'/);
  assert.match(read('js/portal-chat-switch-optimizer.js'), /PortalChatSwitchOptimizer\?\.version === '20260928-global-1'/);
});


test('chat expõe recibos de recebimento e visualização sem antecipar leitura', () => {
  const client = read('js/portal-chat.js');
  const worker = read('worker/portal-chat-v2.js');
  const css = read('css/portal-chat.css');
  assert.match(worker, /delivered_at TEXT/);
  assert.match(worker, /\/api\/chat\/delivery/);
  assert.match(worker, /SET delivered_at = COALESCE\(delivered_at, CURRENT_TIMESTAMP\),\s*read_at = CURRENT_TIMESTAMP/);
  assert.match(worker, /peekOnly/);
  assert.match(client, /function receiptSvg\(double\)/);
  assert.match(client, /createElementNS\('http:\/\/www\.w3\.org\/2000\/svg', 'svg'\)/);
  assert.match(client, /applyReceiptState\(payload\.receipt\)/);
  assert.match(css, /portal-chat-message-receipt\.read/);
});


test('chat usa envio otimista, reenvio idempotente e continuidade privada entre módulos', () => {
  const client = read('js/portal-chat.js');
  const worker = read('worker/portal-chat-v2.js');
  const sw = read('portal-sw.js');
  const css = read('css/portal-chat.css');

  assert.match(client, /pendingMessages = new Map\(\)/);
  assert.match(client, /keepalive: true/);
  assert.match(client, /clientId/);
  assert.match(client, /data\.chatRetry|dataset\.chatRetry/);
  assert.match(client, /loadOlderMessages/);
  assert.match(client, /PORTAL_CHAT_SESSION_PUT/);
  assert.match(client, /PORTAL_CHAT_SESSION_GET/);
  assert.match(client, /CHAT_FALLBACK_POLL_MS = 4500/);
  assert.match(worker, /client_id TEXT/);
  assert.match(worker, /idx_chat_client_message/);
  assert.match(worker, /duplicate: !created/);
  assert.match(sw, /const chatSessionSnapshots = new Map\(\)/);
  assert.match(sw, /PORTAL_CHAT_SESSION_PUT/);
  assert.match(sw, /PORTAL_CHAT_SESSION_GET/);
  assert.match(sw, /CHAT_SESSION_MAX_MESSAGES_PER_CONVERSATION = 360/);
  assert.doesNotMatch(sw.match(/const CHAT_SESSION_TTL_MS[\s\S]*?function registerDocumentStream/)?.[0] || '', /localStorage|sessionStorage|indexedDB|caches\.open/);
  assert.match(css, /portal-chat-message-send-state\.pending/);
  assert.match(css, /portal-chat-message-send-state\.failed/);
});


test('chat realtime usa WebSocket como canal primário com fallback resiliente', () => {
  const client = read('js/portal-chat.js');
  const backend = read('worker/portal-chat-v2.js');
  const realtime = read('worker/chat-realtime.js');
  const durable = read('worker/chat-realtime-do.js');
  const css = read('css/portal-chat.css');

  assert.match(client, /new WebSocket\(url, \[CHAT_REALTIME_PROTOCOL, ticket\]\)/);
  assert.match(client, /\/api\/chat\/realtime\/ticket/);
  assert.match(client, /realtimeConnected/);
  assert.match(client, /scheduleRealtimeReconnect/);
  assert.match(client, /CHAT_FALLBACK_POLL_MS = 4500/);
  assert.match(client, /CHAT_CONTACTS_REALTIME_REFRESH_MS = 120000/);
  assert.match(client, /\/api\/chat\/typing/);
  assert.match(client, /portalChatTyping/);
  assert.match(client, /Novas mensagens/);
  assert.match(client, /firstUnreadId/);
  assert.match(client, /applyReceiptStateFor/);
  assert.match(backend, /\/api\/chat\/realtime/);
  assert.match(backend, /\/api\/chat\/typing/);
  assert.match(backend, /\/api\/chat\/read/);
  assert.match(realtime, /AUTH_SESSION_SECRET/);
  assert.match(durable, /acceptWebSocket/);
  assert.match(durable, /setWebSocketAutoResponse/);
  assert.match(css, /portal-chat-unread-divider/);
  assert.match(css, /portal-chat-typing/);
});


test('chat reduz amplificação de leitura D1 no diretório e no preload', () => {
  const client = read('js/portal-chat.js');
  const worker = read('worker/portal-chat-v2.js');
  const realtime = read('worker/chat-realtime.js');
  const durable = read('worker/chat-realtime-do.js');
  const sw = read('portal-sw.js');

  assert.match(worker, /LEFT JOIN social_users social ON social\.auth_username = u\.username/);
  assert.doesNotMatch(worker, /function socialHandleForUsername/);
  assert.match(worker, /citizenOnlyClause/);
  assert.match(worker, /socialFriendContacts\(env, currentUser\.username, \{ citizenOnly: true \}\)/);
  assert.match(worker, /const chatSchemaPromises = new WeakMap\(\)/);
  assert.match(worker, /await configureChatRealtimeContacts\(env, username, users\.map/);
  assert.doesNotMatch(worker, /const realtimeContacts = await contacts/);
  assert.match(realtime, /upgradeChatRealtime\(request, env, username, sessionVersion\)/);
  const upgradeBlock = realtime.slice(
    realtime.indexOf('export async function upgradeChatRealtime'),
    realtime.indexOf('export const CHAT_REALTIME_TEST')
  );
  assert.doesNotMatch(upgradeBlock, /configureChatRealtimeContacts/);
  assert.match(client, /MESSAGE_PRELOAD_CONTACT_LIMIT = 2/);
  assert.match(client, /CHAT_CONTACTS_REALTIME_REFRESH_MS = 120000/);
  assert.match(client, /CHAT_CONTACTS_FALLBACK_REFRESH_MS = 30000/);
  assert.match(client, /CHAT_HEARTBEAT_MS = 60000/);
  assert.match(client, /CHAT_CONTACTS_MIN_REFRESH_MS = 15000/);
  assert.match(client, /realtimeSocket\.send\(JSON\.stringify/);
  assert.match(durable, /payload\?\.type !== 'typing'/);
  assert.match(sw, /CHAT_SESSION_MAX_CONTACTS = 80/);
  assert.match(client, /restoredContactsFresh/);
});


test('Worker distingue esgotamento diário do D1 de falha própria da Camada Social', () => {
  const workerIndex = read('worker/index.js');
  assert.match(workerIndex, /function isD1DailyReadLimitError/);
  assert.match(workerIndex, /D1_DAILY_READ_LIMIT_EXCEEDED/);
  assert.match(workerIndex, /isD1DailyReadLimitError\(error\).*d1DailyReadLimitResponse/s);
});


test('ACK do envio evita decorators globais e confirma após uma única escrita D1 no caso comum', () => {
  const backend = read('worker/portal-chat-v2.js');
  const workerIndex = read('worker/index.js');
  const client = read('js/portal-chat.js');

  assert.match(backend, /verifyPortalSessionToken/);
  assert.match(backend, /function validateChatSession/);
  assert.doesNotMatch(backend, /validatePortalSession\(request/);
  assert.match(backend, /function chatSchemaReady/);
  assert.match(backend, /WHERE 0/);
  assert.match(backend, /function chatContactAllowed/);
  assert.match(backend, /INSERT OR IGNORE INTO portal_chat_messages/);
  assert.match(backend, /X-Portal-Chat-Ack-Ms/);
  assert.match(backend, /Server-Timing/);

  const postStart = backend.indexOf("if (url.pathname === '/api/chat/messages' && request.method === 'POST')");
  const postEnd = backend.indexOf("return json({ error: 'Rota do chat não encontrada.'", postStart);
  const postBlock = backend.slice(postStart, postEnd);
  const insertAt = postBlock.indexOf('INSERT OR IGNORE INTO portal_chat_messages');
  const retrySelectAt = postBlock.indexOf('FROM portal_chat_messages WHERE from_user = ? AND client_id = ?');
  assert.ok(insertAt >= 0);
  assert.ok(retrySelectAt > insertAt, 'a leitura idempotente só acontece depois de tentativa de insert');
  assert.doesNotMatch(postBlock.slice(0, insertAt), /FROM portal_chat_messages WHERE from_user = \? AND client_id = \?/);

  const earlyChat = workerIndex.indexOf('if (isChatApi(url.pathname))');
  const globalMigration = workerIndex.indexOf('await enforceDeveloperSeparation(env)');
  assert.ok(earlyChat >= 0 && globalMigration >= 0 && earlyChat < globalMigration,
    'chat precisa ser roteado antes das migrações/guards globais');

  const transmitStart = client.indexOf('async function transmitPendingMessage');
  const transmitEnd = client.indexOf('function retryPendingMessage', transmitStart);
  assert.doesNotMatch(client.slice(transmitStart, transmitEnd), /loadContacts\(\)/,
    'ACK confirmado não deve disparar nova consulta de diretório');
});


test('envio principal usa WebSocket e conserva POST apenas como fallback idempotente', () => {
  const client = read('js/portal-chat.js');
  const durable = read('worker/chat-realtime-do.js');
  const atomic = read('worker/chat-send-atomic.js');

  assert.match(client, /CHAT_REALTIME_SEND_ACK_TIMEOUT_MS = 1800/);
  assert.match(client, /type: 'send'/);
  assert.match(client, /type === 'send-ack'/);
  assert.match(client, /type === 'send-error'/);
  assert.match(client, /transport: '', fallbackTimer: null/);
  assert.match(client, /forceHttp: true/);

  const transmitStart = client.indexOf('async function transmitPendingMessage');
  const transmitEnd = client.indexOf('function retryPendingMessage', transmitStart);
  const transmit = client.slice(transmitStart, transmitEnd);
  const socketSendAt = transmit.indexOf("type: 'send'");
  const httpFallbackAt = transmit.indexOf("api('/api/chat/messages'");
  assert.ok(socketSendAt >= 0 && httpFallbackAt > socketSendAt,
    'WebSocket deve ser tentado antes do POST fallback');
  assert.match(transmit, /realtimeConnected/);
  assert.match(transmit, /realtimeSocket\?\.readyState === WebSocket\.OPEN/);

  assert.match(durable, /handleRealtimeSend/);
  assert.match(durable, /persistAtomicChatMessage/);
  assert.match(durable, /type: 'send-ack'/);
  assert.match(atomic, /INSERT OR IGNORE INTO portal_chat_messages/);
  assert.match(atomic, /sender\.session_version = \?/);
  assert.match(atomic, /CASE\s+WHEN sender\.role IN/s);
  assert.match(atomic, /duplicateMessage/);
});


test('chat oferece emoticons e chamar atenção sem persistência no D1', () => {
  const client = read('js/portal-chat.js');
  const css = read('css/portal-chat.css');
  const durable = read('worker/chat-realtime-do.js');

  assert.match(client, /CHAT_EMOJIS = Object\.freeze/);
  assert.match(client, /id="portalChatEmojiButton"/);
  assert.match(client, /id="portalChatEmojiPicker"/);
  assert.match(client, /data-chat-emoji/);
  assert.match(client, /function insertEmoji/);
  assert.match(client, /setRangeText/);

  assert.match(client, /id="portalChatAttention"/);
  assert.match(client, /Chamar atenção/);
  assert.match(client, /type: 'attention'/);
  assert.match(client, /type === 'attention'/);
  assert.match(client, /type === 'attention-ack'/);
  assert.match(client, /type === 'attention-cooldown'/);
  assert.match(client, /CHAT_ATTENTION_COOLDOWN_MS = 5000/);
  assert.match(client, /CHAT_ATTENTION_EFFECT_MS = 1800/);
  assert.match(client, /id="portalChatAttentionLive"/);
  assert.match(client, /aria-live="assertive"/);

  assert.match(css, /portal-chat-launcher\.attention-hit/);
  assert.match(css, /portal-chat-panel\.attention-hit/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /portal-chat-emoji-grid/);

  const attentionStart = durable.indexOf("if (payload?.type === 'attention')");
  const attentionEnd = durable.indexOf("if (payload?.type !== 'typing')", attentionStart);
  const attentionBlock = durable.slice(attentionStart, attentionEnd);
  assert.doesNotMatch(attentionBlock, /AUTH_DB|portal_chat_messages/);
});
