'use strict';
// Deterministic, narrow repair of the reviewed 146fabd4 baseline. No network or secrets.
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const root=process.env.PORTAL_CHAT_REPO||path.join(__dirname,'repo');
const changed=new Set();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
function write(file,text){fs.writeFileSync(path.join(root,file),text);changed.add(file);}
function patch(file,before,after,count=1){const text=read(file);if(text.split(before).length-1!==count)throw new Error('Unexpected baseline: '+file+' / '+before.slice(0,80));write(file,text.split(before).join(after));}
const client='js/portal-chat.js';
const bytes=fs.readFileSync(path.join(root,client));
if(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')!=='7575f35616b66048cc5bd98d8b692dcfd465fbfd')throw new Error('Client baseline changed; reconcile before applying');
patch(client,'  const messageCache = new Map();',`  const messageCache = new Map();
  // Only HTTP pages advance this cursor; a later WS event must not hide a missing ID.
  const messageSyncCursors = new Map();
  const messageSyncRequests = new Map();
  const messageReadThrough = new Map();
  const messageReadRequests = new Map();`);
patch(client,'  const CHAT_FALLBACK_POLL_MS = 4500;',`  const CHAT_FALLBACK_POLL_MS = 4500;
  const CHAT_RECONCILE_MS = 30000;`);
patch(client,`    if (realtimeConnected) stopMessagePolling();
    else if (activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) startMessagePolling();`,`    if (activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) startMessagePolling();
    else stopMessagePolling();`);
patch(client,'    messageCache.clear();',`    messageCache.clear();
    messageSyncCursors.clear();
    messageSyncRequests.clear();
    messageReadThrough.clear();
    messageReadRequests.clear();`);
patch(client,`    if (!id || !sender || sender === currentUser?.username) return;`,`    if (!Number.isInteger(id) || id <= 0 || !sender || sender === currentUser?.username) return;
    if (message?.toUser && messageCacheKey(message.toUser) !== currentUser?.username) return;
    if (messageCache.get(sender)?.messages?.some((item) => Number(item.id) === id)) return;`);
patch(client,`      appendMessages([message], false);
      contact.unread = 0;
      contact.firstUnreadId = 0;
      unreadSnapshot.set(sender, 0);
      renderContacts();
      api('/api/chat/read', {
        method: 'POST',
        body: JSON.stringify({ with: sender, throughId: id })
      }).catch(() => loadMessages(false));`,`      syncVisibleConversation();`);
patch(client,`    if (root?.classList.contains('open')) void markChatDelivered(true);`,`    if (!document.hidden && root?.classList.contains('open')) void markChatDelivered(true);`);
patch(client,`      replaceCachedMessages(key, page, lastMessageAt, { hasOlder: page.length >= pageSize });`,`      mergeCachedMessages(key, page, lastMessageAt, {
        hasOlder: Boolean(messageCache.get(key)?.hasOlder) || page.length >= pageSize
      });`);
patch(client,`      appendUnreadDividerBefore(box, null, id);
      box.appendChild(element);`,`      const before = id > 0 ? Array.from(box.querySelectorAll?.('.portal-chat-message[data-message-id]') || [])
        .find((item) => Number(item.dataset.messageId || 0) > id) : null;
      appendUnreadDividerBefore(box, before, id);
      box.insertBefore(element, before || null);`);
patch(client,`    const cached = messageCache.get(key);
    if (!cached?.hasOlder || !cached.messages?.length) return;`,`    const cached = messageCache.get(key);
    const generation = messageCacheGeneration;
    if (!cached?.hasOlder || !cached.messages?.length) return;`);
patch(client,`        if (!activeContact || activeContact.username !== username) return;
        const page = Array.isArray(payload.messages) ? payload.messages : [];`,`        if (generation !== messageCacheGeneration || !activeContact || activeContact.username !== username) return;
        const page = Array.isArray(payload.messages) ? payload.messages : [];`);
patch(client,`          [...page, ...(cached.messages || [])],`,`          [...page, ...(messageCache.get(key)?.messages || [])],`);
const start=read(client).indexOf('  async function loadMessages(initial = false) {');
const end=read(client).indexOf('  function stopMessagePolling() {',start);
if(start<0||end<start)throw new Error('Missing synchronization boundaries');
write(client,read(client).slice(0,start)+`  function conversationIsVisible(username = activeContact?.username) {
    return Boolean(username && !document.hidden && activeContact?.username === username
      && document.getElementById('portalChatRoot')?.classList.contains('open'));
  }

  function markVisibleConversationRead() {
    const username = activeContact?.username;
    if (!conversationIsVisible(username)) return;
    const throughId = (messageCache.get(username)?.messages || []).reduce((highest, message) =>
      message.fromUser === username ? Math.max(highest, Number(message.id || 0)) : highest, 0);
    if (!throughId) return;
    const contact = contacts.find((item) => item.username === username);
    if (contact) { contact.unread = 0; contact.firstUnreadId = 0; }
    unreadSnapshot.set(username, 0);
    renderContacts();
    if (Number(messageReadThrough.get(username) || 0) >= throughId || messageReadRequests.has(username)) return;
    const generation = messageCacheGeneration;
    const request = api('/api/chat/read', {
      method: 'POST', body: JSON.stringify({ with: username, throughId })
    }).then(() => {
      if (generation === messageCacheGeneration) messageReadThrough.set(username, throughId);
      return true;
    }).catch(() => false).then((acknowledged) => {
      if (messageReadRequests.get(username) !== request) return;
      messageReadRequests.delete(username);
      // A newer message may have arrived while its predecessor was being acknowledged.
      if (acknowledged && generation === messageCacheGeneration && conversationIsVisible(username)) {
        markVisibleConversationRead();
      }
    });
    messageReadRequests.set(username, request);
  }

  function syncVisibleConversation() {
    if (!conversationIsVisible()) return;
    const cached = messageCache.get(activeContact.username);
    if (cached) appendMessages(cached.messages, false);
    markVisibleConversationRead();
  }

  async function loadMessages(initial = false) {
    if (!activeContact) return;
    const username = activeContact.username;
    if (messageSyncRequests.has(username)) return messageSyncRequests.get(username);
    const generation = messageCacheGeneration;
    // WS IDs are not a contiguous history checkpoint. An independent HTTP watermark
    // recovers a lost event even after a later message (or our own ACK) was rendered.
    const after = initial ? 0 : Number(messageSyncCursors.get(username) || 0);
    const request = (async () => {
      try {
        const payload = await api('/api/chat/messages?with=' + encodeURIComponent(username) + '&after=' + after + '&peek=1', { method: 'GET' });
        if (generation !== messageCacheGeneration || activeContact?.username !== username) return;
        const messages = Array.isArray(payload.messages) ? payload.messages : [];
        const contact = contacts.find((item) => item.username === username);
        const pageSize = Math.max(1, Number(payload.pageSize || MESSAGE_HISTORY_PAGE_SIZE));
        if (initial && !activeUnreadBoundaryId && contact) activeUnreadBoundaryId = unreadBoundaryFor(contact, messages);
        // Merge with the CURRENT memory, never a snapshot captured before the request.
        // Initial loads and reconnects cannot erase a newer WS message or older history.
        mergeCachedMessages(username, messages, contact?.lastMessageAt || '', {
          hasOlder: Boolean(messageCache.get(username)?.hasOlder) || (after === 0 && messages.length >= pageSize)
        });
        messageSyncCursors.set(username, messages.reduce((highest, message) =>
          Math.max(highest, Number(message.id || 0)), Number(messageSyncCursors.get(username) || 0)));
        syncVisibleConversation();
        applyReceiptState(payload.receipt);
        renderContacts();
      } catch (error) {
        if (generation === messageCacheGeneration && conversationIsVisible(username)) {
          showStatus(error.message || 'Não foi possível carregar as mensagens.');
        }
      } finally {
        if (messageSyncRequests.get(username) === request) messageSyncRequests.delete(username);
      }
    })();
    messageSyncRequests.set(username, request);
    return request;
  }

`+read(client).slice(end));
patch(client,`    if (realtimeConnected) return;
    messageTimer = window.setInterval(() => {
      if (!realtimeConnected && !document.hidden && activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) {
        loadMessages(false);
      }
    }, CHAT_FALLBACK_POLL_MS);`,`    const interval = realtimeConnected ? CHAT_RECONCILE_MS : CHAT_FALLBACK_POLL_MS;
    messageTimer = window.setInterval(() => {
      if (conversationIsVisible()) void loadMessages(false);
    }, interval);`);
patch(client,`    const renderedFromMemory = renderCachedConversation(contact);
    void loadMessages(!renderedFromMemory);
    if (!realtimeConnected) startMessagePolling();`,`    const renderedFromMemory = renderCachedConversation(contact);
    if (!renderedFromMemory) appendMessages([], true);
    syncVisibleConversation();
    void loadMessages(!renderedFromMemory);
    startMessagePolling();`);
patch(client,`        if (activeContact && !realtimeConnected) loadMessages(false);`,`        syncVisibleConversation();
        if (conversationIsVisible()) void loadMessages(false);`);
patch(client,`    window.addEventListener('online', () => {
      realtimeStopped = false;
      void connectRealtime();
    });`,`    window.addEventListener('online', () => {
      realtimeStopped = false;
      void connectRealtime();
      syncVisibleConversation();
      if (conversationIsVisible()) void loadMessages(false);
    });
    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      syncVisibleConversation();
      if (conversationIsVisible()) void loadMessages(false);
    });`);
const oldVersion='20261007-chat-avatar-timeline-1',newVersion='20261007-chat-live-recovery-1';
function walk(directory='') {for(const item of fs.readdirSync(path.join(root,directory),{withFileTypes:true})){
  if(['.git','node_modules','vendor'].includes(item.name))continue;
  const file=path.posix.join(directory,item.name);
  if(item.isDirectory())walk(file);
  else if(/\.(html|js|mjs|yml|cjs)$/.test(file)) {const text=read(file);if(text.includes(oldVersion))write(file,text.split(oldVersion).join(newVersion));}
}}
walk();
patch('docs/CHAT-PROFISSIONAL.md',`atualização anterior. Quando o canal em tempo real retorna, o polling de mensagens é
interrompido automaticamente.`,`atualização anterior. Quando o canal em tempo real retorna, o polling rápido dá lugar
à reconciliação leve da conversa visível, descrita na correção de 07/10/2026 abaixo.`);
write('docs/CHAT-PROFISSIONAL.md',read('docs/CHAT-PROFISSIONAL.md')+`
## Recebimento sem reabrir a conversa — 07/10/2026

O cliente deve apresentar mensagens novas na conversa já aberta, inclusive ao voltar
à aba. O canal WebSocket continua primário e imediato. Foram reproduzidas duas falhas:
mensagens recebidas com a aba oculta ficavam só na memória e uma resposta HTTP antiga
podia substituir uma mensagem WebSocket mais nova. A foto e a linha do tempo não são
a origem desses caminhos; ambos já existiam antes da alteração de apresentação.

Regras da correção:

- voltar à aba, recuperar a internet ou restaurar uma página pelo histórico reconcilia
  os balões em memória imediatamente e busca o delta autorizado, sem fechar o painel;
- respostas HTTP/preload/histórico são combinadas com a memória atual, não substituem
  mensagens novas; os IDs preservam ordem e eliminam eventos duplicados;
- um cursor por conversa avança somente por páginas HTTP confirmadas: um evento
  WebSocket posterior ou ACK próprio não pode fazer a consulta pular um evento perdido;
- com WebSocket conectado há uma consulta leve a cada 30 segundos somente para a
  conversa aberta e a aba visível; desconectado permanece o fallback de 4,5 segundos;
- leituras simultâneas da mesma conversa são agrupadas. Não há novo polling global do
  diretório, nova persistência de conteúdo ou alteração do backend/D1;
- sincronização usa peek=1 e só confirma leitura por throughId depois de apresentar os
  balões na conversa visível; aba oculta não gera visualização. Recibos são agrupados
  e uma mensagem nova durante um ACK pendente recebe confirmação posterior;
- encerrar a sessão limpa cursores/estado e respostas antigas não repovoam a memória.

Testes de recebimento usam duas sessões fictícias, cliente real e HTTP/WebSocket
interceptados. Cobrem os dois temas e tamanhos desktop/mobile, recebimento em aba
oculta, resposta inicial atrasada, perda de evento seguida de outro ID, duplicação e
fallback. Isso não equivale a uma conversa real autenticada em produção.
`);
patch('.github/workflows/validate-portal-chat.yml',"      - uses: actions/upload-artifact@v4\n","      - name: Recebimento ao vivo e recuperação sem reabrir a conversa\n        run: |\n          NODE_PATH=\"$RUNNER_TEMP/chat-browser/node_modules\" PORTAL_CHAT_EVIDENCE_DIR=\"$RUNNER_TEMP/chat-presentation-evidence\" node worker/tests/browser/chat-live-reception.cjs\n      - uses: actions/upload-artifact@v4\n");
console.log(JSON.stringify({changed:[...changed].sort()},null,2));
