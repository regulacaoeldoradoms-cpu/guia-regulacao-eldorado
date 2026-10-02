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
    assert.match(html, /portal-global-chat\.js\?v=20261002-realtime-1/, path);
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
  assert.match(source, /portal-chat\.css\?v=20261002-realtime-1/);
  assert.match(source, /portal-chat\.js\?v=20261002-realtime-1/);
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
  assert.match(read('js/portal-chat.js'), /PortalChat\?\.version === '20261002-realtime-1'/);
  assert.match(read('js/portal-chat.js'), /version: '20261002-realtime-1'/);
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
  assert.match(client, /CHAT_CONTACTS_REALTIME_REFRESH_MS = 30000/);
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
