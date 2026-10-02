'use strict';

(() => {
  if (window.PortalChat?.version === '20261002-realtime-1') return;
  const auth = window.RegulationAuth;
  const config = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(config.endpoint || '').replace(/\/$/, '');
  if (!auth || !endpoint) return;

  let currentUser = null;
  let contacts = [];
  let activeContact = null;
  let lastMessageId = 0;
  let messageTimer = null;
  let contactsTimer = null;
  let heartbeatTimer = null;
  let mounted = false;
  let contactsInitialized = false;
  let notificationWorker = null;
  let deliverySyncPending = null;
  let lastDeliverySyncAt = 0;
  let chatSessionPersistTimer = null;
  let restoredChatSession = null;
  let historyLoadPending = null;
  let pendingSequence = 0;
  let activeUnreadBoundaryId = 0;
  let realtimeSocket = null;
  let realtimeConnected = false;
  let realtimeStopped = false;
  let realtimeReconnectTimer = null;
  let realtimePingTimer = null;
  let realtimeRotateTimer = null;
  let realtimeBackoffMs = 1000;
  let typingLastSentAt = 0;
  let typingStopTimer = null;
  let remoteTypingTimer = null;
  let remoteTypingUsername = '';
  const unreadSnapshot = new Map();
  const messageCache = new Map();
  const messagePreloadRequests = new Map();
  const pendingMessages = new Map();
  const draftCache = new Map();
  let messageCacheGeneration = 0;
  let messagePreloadSweep = null;
  const MESSAGE_PRELOAD_CONCURRENCY = 3;
  const MESSAGE_HISTORY_PAGE_SIZE = 120;
  const MESSAGE_PRELOAD_PAGE_GUARD = 100;
  const CHAT_FALLBACK_POLL_MS = 4500;
  const CHAT_CONTACTS_REALTIME_REFRESH_MS = 30000;
  const CHAT_CONTACTS_FALLBACK_REFRESH_MS = 12000;
  const CHAT_SESSION_GET_TIMEOUT_MS = 550;
  const CHAT_REALTIME_PROTOCOL = 'portal-chat-v1';
  const CHAT_REALTIME_ROTATE_MS = 300000;
  const CHAT_REALTIME_PING_MS = 25000;
  const CHAT_TYPING_RESEND_MS = 1400;
  const CHAT_TYPING_STOP_MS = 2200;
  const CHAT_TYPING_REMOTE_TTL_MS = 4200;
  const CHAT_ROLES = new Set(['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin', 'cidadao']);

  const escapeText = (value) => String(value || '');
  const ICONS = Object.freeze({
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"></path><path d="M7.5 9.5h9M7.5 13h6"></path></svg>',
    notification: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"></path><path d="M10 20h4"></path></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path><path d="M9 12h10"></path></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"></path></svg>'
  });

  function initials(value) {
    const parts = String(value || '?').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function api(path, options = {}) {
    return fetch(`${endpoint}${path}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...auth.authorizationHeader(),
        ...(options.headers || {})
      }
    }).then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Falha no chat (${response.status}).`);
      return payload;
    });
  }

  function realtimeEndpoint() {
    try {
      const url = new URL(endpoint);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      url.pathname = '/api/chat/realtime';
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch (_) {
      return '';
    }
  }

  function clearRealtimeTimers() {
    window.clearTimeout(realtimeReconnectTimer);
    window.clearInterval(realtimePingTimer);
    window.clearTimeout(realtimeRotateTimer);
    realtimeReconnectTimer = null;
    realtimePingTimer = null;
    realtimeRotateTimer = null;
  }

  function updateRealtimeMode(connected) {
    realtimeConnected = Boolean(connected);
    if (realtimeConnected) stopMessagePolling();
    else if (activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) startMessagePolling();
    if (!realtimeStopped) restartContactsTimer();
  }

  function scheduleRealtimeReconnect() {
    if (realtimeStopped || realtimeReconnectTimer || document.hidden) return;
    const delay = realtimeBackoffMs;
    realtimeBackoffMs = Math.min(15000, Math.max(1000, realtimeBackoffMs * 2));
    realtimeReconnectTimer = window.setTimeout(() => {
      realtimeReconnectTimer = null;
      void connectRealtime();
    }, delay);
  }

  function closeRealtime({ permanent = false } = {}) {
    if (permanent) realtimeStopped = true;
    clearRealtimeTimers();
    const socket = realtimeSocket;
    realtimeSocket = null;
    updateRealtimeMode(false);
    if (socket && socket.readyState < WebSocket.CLOSING) {
      try { socket.close(1000, 'portal-navigation'); } catch (_) {}
    }
  }

  async function connectRealtime() {
    if (realtimeStopped || document.hidden || !('WebSocket' in window)) return false;
    if (realtimeSocket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(realtimeSocket.readyState)) return true;
    const url = realtimeEndpoint();
    if (!url) return false;

    let ticketPayload;
    try {
      ticketPayload = await api('/api/chat/realtime/ticket', { method: 'POST', body: '{}' });
    } catch (_) {
      updateRealtimeMode(false);
      scheduleRealtimeReconnect();
      return false;
    }
    const ticket = String(ticketPayload?.ticket || '');
    const protocol = String(ticketPayload?.protocol || CHAT_REALTIME_PROTOCOL);
    if (!ticket || protocol !== CHAT_REALTIME_PROTOCOL) {
      updateRealtimeMode(false);
      scheduleRealtimeReconnect();
      return false;
    }

    let socket;
    try {
      socket = new WebSocket(url, [CHAT_REALTIME_PROTOCOL, ticket]);
    } catch (_) {
      updateRealtimeMode(false);
      scheduleRealtimeReconnect();
      return false;
    }

    realtimeSocket = socket;
    socket.addEventListener('open', () => {
      if (realtimeSocket !== socket) return;
      realtimeBackoffMs = 1000;
      updateRealtimeMode(true);
      window.clearInterval(realtimePingTimer);
      realtimePingTimer = window.setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          try { socket.send('ping'); } catch (_) {}
        }
      }, CHAT_REALTIME_PING_MS);
      window.clearTimeout(realtimeRotateTimer);
      realtimeRotateTimer = window.setTimeout(() => {
        if (realtimeSocket === socket && socket.readyState === WebSocket.OPEN) {
          try { socket.close(1000, 'revalidate'); } catch (_) {}
        }
      }, CHAT_REALTIME_ROTATE_MS);
      void loadContacts();
      if (activeContact) void loadMessages(false);
    });

    socket.addEventListener('message', (event) => {
      if (realtimeSocket !== socket || typeof event.data !== 'string') return;
      let payload;
      try { payload = JSON.parse(event.data); } catch (_) { return; }
      handleRealtimeEvent(payload);
    });

    socket.addEventListener('error', () => {
      if (realtimeSocket !== socket) return;
      try { socket.close(); } catch (_) {}
    });

    socket.addEventListener('close', () => {
      if (realtimeSocket === socket) realtimeSocket = null;
      clearRealtimeTimers();
      updateRealtimeMode(false);
      scheduleRealtimeReconnect();
    });

    return true;
  }

  function updateContactPresence(username, online, lastSeen = '') {
    const contact = contacts.find((item) => item.username === username);
    if (!contact) return false;
    contact.online = Boolean(online);
    if (lastSeen) contact.lastSeen = lastSeen;
    renderContacts();
    if (activeContact?.username === username) {
      activeContact = { ...activeContact, ...contact };
      updateConversationHeader();
    }
    return true;
  }

  function clearRemoteTyping() {
    window.clearTimeout(remoteTypingTimer);
    remoteTypingTimer = null;
    remoteTypingUsername = '';
    const typing = document.getElementById('portalChatTyping');
    if (typing) typing.hidden = true;
  }

  function setRemoteTyping(username, active, expiresAt = 0) {
    if (!active) {
      if (remoteTypingUsername === username) clearRemoteTyping();
      return;
    }
    if (activeContact?.username !== username) return;
    remoteTypingUsername = username;
    const typing = document.getElementById('portalChatTyping');
    if (typing) typing.hidden = false;
    window.clearTimeout(remoteTypingTimer);
    const ttl = Math.max(350, Math.min(CHAT_TYPING_REMOTE_TTL_MS, Number(expiresAt || 0) - Date.now() || CHAT_TYPING_REMOTE_TTL_MS));
    remoteTypingTimer = window.setTimeout(clearRemoteTyping, ttl);
  }

  function handleRealtimeMessage(message) {
    const id = Number(message?.id || 0);
    const sender = messageCacheKey(message?.fromUser);
    if (!id || !sender || sender === currentUser?.username) return;

    const contact = contacts.find((item) => item.username === sender);
    if (!contact) {
      void loadContacts();
      return;
    }

    mergeCachedMessages(sender, [message], message.sentAt || contact.lastMessageAt || '', {
      hasOlder: messageCache.get(sender)?.hasOlder || false
    });
    contact.lastMessageAt = message.sentAt || contact.lastMessageAt || '';

    const root = document.getElementById('portalChatRoot');
    const conversationVisible = !document.hidden
      && root?.classList.contains('open')
      && activeContact?.username === sender;

    if (conversationVisible) {
      appendMessages([message], false);
      contact.unread = 0;
      contact.firstUnreadId = 0;
      unreadSnapshot.set(sender, 0);
      renderContacts();
      api('/api/chat/read', {
        method: 'POST',
        body: JSON.stringify({ with: sender, throughId: id })
      }).catch(() => loadMessages(false));
      return;
    }

    const previousUnread = Number(contact.unread || 0);
    contact.unread = previousUnread + 1;
    if (!Number(contact.firstUnreadId || 0)) contact.firstUnreadId = id;
    unreadSnapshot.set(sender, contact.unread);
    renderContacts();
    window.PortalInteractions?.emit?.('notification', { debounce: 900 });
    void showMessageNotification(contact, 1);
    if (root?.classList.contains('open')) void markChatDelivered(true);
  }

  function handleRealtimeEvent(payload) {
    const type = String(payload?.type || '');
    if (type === 'ready' || type === 'pong') return;
    if (type === 'message') {
      handleRealtimeMessage(payload.message);
      return;
    }
    if (type === 'receipt') {
      const username = messageCacheKey(payload.with);
      if (username) applyReceiptStateFor(username, payload);
      return;
    }
    if (type === 'typing') {
      const username = messageCacheKey(payload.username);
      if (username) setRemoteTyping(username, Boolean(payload.active), Number(payload.expiresAt || 0));
      return;
    }
    if (type === 'presence') {
      const username = messageCacheKey(payload.username);
      if (username && !updateContactPresence(username, Boolean(payload.online), String(payload.lastSeen || ''))) {
        void loadContacts();
      }
      return;
    }
    if (type === 'contact-refresh') void loadContacts();
  }

  function sendTypingState(active) {
    if (!activeContact) return;
    const username = activeContact.username;
    if (!username) return;
    api('/api/chat/typing', {
      method: 'POST',
      body: JSON.stringify({ with: username, active: Boolean(active) })
    }).catch(() => {});
  }

  function noteLocalTyping() {
    const input = document.getElementById('portalChatInput');
    const hasText = Boolean(String(input?.value || '').trim());
    window.clearTimeout(typingStopTimer);
    if (!hasText || !activeContact) {
      typingLastSentAt = 0;
      sendTypingState(false);
      return;
    }
    const now = Date.now();
    if (now - typingLastSentAt >= CHAT_TYPING_RESEND_MS) {
      typingLastSentAt = now;
      sendTypingState(true);
    }
    typingStopTimer = window.setTimeout(() => {
      typingLastSentAt = 0;
      sendTypingState(false);
    }, CHAT_TYPING_STOP_MS);
  }

  function stopLocalTyping() {
    window.clearTimeout(typingStopTimer);
    typingStopTimer = null;
    typingLastSentAt = 0;
    sendTypingState(false);
  }

  function messageCacheKey(username) {
    return String(username || '').trim().toLowerCase();
  }

  function clearMessageMemory() {
    messageCacheGeneration += 1;
    messageCache.clear();
    messagePreloadRequests.clear();
    pendingMessages.clear();
    draftCache.clear();
    restoredChatSession = null;
  }

  function normalizeMessageList(messages) {
    const byId = new Map();
    for (const message of Array.isArray(messages) ? messages : []) {
      const id = Number(message?.id || 0);
      if (!Number.isInteger(id) || id <= 0) continue;
      byId.set(id, message);
    }
    return Array.from(byId.values()).sort((first, second) => Number(first.id || 0) - Number(second.id || 0));
  }

  function chatAuthorization() {
    const token = String(auth.getToken?.() || '');
    return token ? `Bearer ${token}` : '';
  }

  function activeServiceWorker(registration) {
    return navigator.serviceWorker?.controller
      || registration?.active
      || registration?.waiting
      || registration?.installing
      || null;
  }

  function snapshotForServiceWorker() {
    const root = document.getElementById('portalChatRoot');
    const input = document.getElementById('portalChatInput');
    if (activeContact && input) {
      const draft = String(input.value || '');
      if (draft) draftCache.set(activeContact.username, draft);
      else draftCache.delete(activeContact.username);
    }
    const messagesBox = document.getElementById('portalChatMessages');
    const activeScrollFromBottom = messagesBox
      ? Math.max(0, messagesBox.scrollHeight - messagesBox.scrollTop - messagesBox.clientHeight)
      : 0;
    return {
      panelOpen: Boolean(root?.classList.contains('open')),
      activeUsername: activeContact?.username || '',
      activeScrollFromBottom,
      conversations: Array.from(messageCache.entries()).map(([username, entry]) => ({
        username,
        lastMessageAt: entry?.lastMessageAt || '',
        loadedAt: Number(entry?.loadedAt || 0),
        hasOlder: Boolean(entry?.hasOlder),
        messages: entry?.messages || []
      })),
      drafts: Array.from(draftCache.entries()).map(([username, body]) => ({ username, body }))
    };
  }

  function postChatSessionSnapshot(worker) {
    const authorization = chatAuthorization();
    if (!worker || !authorization) return false;
    try {
      worker.postMessage({
        type: 'PORTAL_CHAT_SESSION_PUT',
        authorization,
        snapshot: snapshotForServiceWorker()
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  function persistChatSessionSnapshotNow() {
    return postChatSessionSnapshot(navigator.serviceWorker?.controller || null);
  }

  async function persistChatSessionSnapshot() {
    if (!('serviceWorker' in navigator)) return false;
    if (persistChatSessionSnapshotNow()) return true;
    try {
      const registration = await ensureNotificationWorker();
      return postChatSessionSnapshot(activeServiceWorker(registration));
    } catch (_) {
      return false;
    }
  }

  function queueChatSessionPersist(delay = 140) {
    window.clearTimeout(chatSessionPersistTimer);
    chatSessionPersistTimer = window.setTimeout(() => {
      chatSessionPersistTimer = null;
      persistChatSessionSnapshot().catch(() => false);
    }, Math.max(0, Number(delay || 0)));
  }

  async function getChatSessionSnapshot() {
    if (!('serviceWorker' in navigator) || typeof MessageChannel !== 'function') return null;
    const authorization = chatAuthorization();
    if (!authorization) return null;
    try {
      const registration = await ensureNotificationWorker();
      const worker = activeServiceWorker(registration);
      if (!worker) return null;
      return await new Promise((resolve) => {
        const channel = new MessageChannel();
        let settled = false;
        const finish = (snapshot) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          try { channel.port1.close(); } catch (_) {}
          resolve(snapshot || null);
        };
        const timer = window.setTimeout(() => finish(null), CHAT_SESSION_GET_TIMEOUT_MS);
        channel.port1.onmessage = (event) => finish(event.data?.ok === true ? event.data.snapshot : null);
        try {
          worker.postMessage({
            type: 'PORTAL_CHAT_SESSION_GET',
            authorization
          }, [channel.port2]);
        } catch (_) {
          finish(null);
        }
      });
    } catch (_) {
      return null;
    }
  }

  function clearChatSessionSnapshot() {
    window.clearTimeout(chatSessionPersistTimer);
    chatSessionPersistTimer = null;
    ensureNotificationWorker()
      .then((registration) => activeServiceWorker(registration)?.postMessage?.({ type: 'PORTAL_CHAT_SESSION_CLEAR' }))
      .catch(() => {});
  }

  function hydrateChatSessionSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return;
    restoredChatSession = snapshot;
    for (const conversation of Array.isArray(snapshot.conversations) ? snapshot.conversations : []) {
      const key = messageCacheKey(conversation?.username);
      if (!key) continue;
      messageCache.set(key, {
        messages: normalizeMessageList(conversation?.messages),
        lastMessageAt: String(conversation?.lastMessageAt || ''),
        loadedAt: Number(conversation?.loadedAt || Date.now()),
        hasOlder: Boolean(conversation?.hasOlder)
      });
    }
    for (const draft of Array.isArray(snapshot.drafts) ? snapshot.drafts : []) {
      const key = messageCacheKey(draft?.username);
      const body = String(draft?.body || '');
      if (key && body) draftCache.set(key, body);
    }
  }

  function replaceCachedMessages(username, messages, lastMessageAt = '', options = {}) {
    const key = messageCacheKey(username);
    if (!key) return null;
    const entry = {
      messages: normalizeMessageList(messages),
      lastMessageAt: String(lastMessageAt || ''),
      loadedAt: Date.now(),
      hasOlder: Boolean(options.hasOlder)
    };
    messageCache.set(key, entry);
    queueChatSessionPersist();
    return entry;
  }

  function mergeCachedMessages(username, messages, lastMessageAt = '', options = {}) {
    const key = messageCacheKey(username);
    if (!key) return null;
    const previous = messageCache.get(key);
    return replaceCachedMessages(
      key,
      [...(previous?.messages || []), ...(Array.isArray(messages) ? messages : [])],
      lastMessageAt || previous?.lastMessageAt || '',
      { hasOlder: options.hasOlder ?? previous?.hasOlder ?? false }
    );
  }

  async function preloadConversation(contact) {
    const username = String(contact?.username || '').trim();
    const key = messageCacheKey(username);
    if (!key) return [];

    const lastMessageAt = String(contact?.lastMessageAt || '');
    const cached = messageCache.get(key);
    if (!lastMessageAt) {
      if (!cached) replaceCachedMessages(key, [], '', { hasOlder: false });
      return [];
    }
    if (cached?.lastMessageAt === lastMessageAt) return cached.messages;
    if (messagePreloadRequests.has(key)) return messagePreloadRequests.get(key);

    const generation = messageCacheGeneration;
    const request = (async () => {
      if (cached?.messages?.length) {
        const after = Number(cached.messages.at(-1)?.id || 0);
        const payload = await api(
          `/api/chat/messages?with=${encodeURIComponent(username)}&after=${after}&peek=1`,
          { method: 'GET' }
        );
        if (generation !== messageCacheGeneration) return [];
        mergeCachedMessages(
          key,
          Array.isArray(payload.messages) ? payload.messages : [],
          lastMessageAt,
          { hasOlder: cached.hasOlder }
        );
        return messageCache.get(key)?.messages || [];
      }

      const payload = await api(
        `/api/chat/messages?with=${encodeURIComponent(username)}&after=0&peek=1`,
        { method: 'GET' }
      );
      if (generation !== messageCacheGeneration) return [];
      const page = Array.isArray(payload.messages) ? payload.messages : [];
      const pageSize = Math.max(1, Number(payload.pageSize || MESSAGE_HISTORY_PAGE_SIZE));
      replaceCachedMessages(key, page, lastMessageAt, { hasOlder: page.length >= pageSize });
      return messageCache.get(key)?.messages || [];
    })()
      .catch(() => cached?.messages || [])
      .finally(() => {
        messagePreloadRequests.delete(key);
      });

    messagePreloadRequests.set(key, request);
    return request;
  }

  function preloadConversationsInBackground() {
    if (messagePreloadSweep) return;
    const run = async () => {
      const queue = contacts.slice();
      const workers = Array.from(
        { length: Math.min(MESSAGE_PRELOAD_CONCURRENCY, Math.max(1, queue.length)) },
        async () => {
          while (queue.length) {
            const contact = queue.shift();
            if (contact) await preloadConversation(contact);
          }
        }
      );
      await Promise.all(workers);
    };
    const launch = () => {
      messagePreloadSweep = run().finally(() => {
        messagePreloadSweep = null;
      });
    };
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(launch, { timeout: 1200 });
    } else {
      window.setTimeout(launch, 0);
    }
  }

  function renderCachedConversation(contact) {
    const username = messageCacheKey(contact?.username);
    const cached = messageCache.get(username);
    const transient = Array.from(pendingMessages.values())
      .filter((entry) => messageCacheKey(entry?.username) === username)
      .map((entry) => entry.message);
    if (!cached && !transient.length) return false;
    lastMessageId = 0;
    appendMessages([...(cached?.messages || []), ...transient], true);
    return true;
  }

  function parseServerDate(value) {
    if (!value) return null;
    const parsed = new Date(`${String(value).replace(' ', 'T')}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatTime(value) {
    const parsed = parseServerDate(value);
    if (!parsed) return '';
    return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function localServerTimestamp() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  function createClientMessageId() {
    if (globalThis.crypto?.randomUUID) return `chat-${globalThis.crypto.randomUUID()}`;
    pendingSequence += 1;
    return `chat-${Date.now().toString(36)}-${pendingSequence.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function receiptLabel(message) {
    if (message?.readAt) return { title: 'Visualizada', state: 'read', double: true };
    if (message?.deliveredAt) return { title: 'Recebida no chat', state: 'delivered', double: false };
    return null;
  }

  function receiptSvg(double) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 18 12');
    svg.setAttribute('aria-hidden', 'true');
    const first = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    first.setAttribute('d', double ? 'M1.5 6.3 4.5 9.3 10.7 2.7' : 'M3.5 6.3 6.5 9.3 12.7 2.7');
    svg.appendChild(first);
    if (double) {
      const second = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      second.setAttribute('d', 'M6.6 6.3 9.6 9.3 16.5 1.8');
      svg.appendChild(second);
    }
    return svg;
  }

  function updateMessageReceiptElement(element, message) {
    if (!element) return;
    const time = element.querySelector('.portal-chat-message-time');
    let receipt = element.querySelector('.portal-chat-message-receipt');
    let sendState = element.querySelector('.portal-chat-message-send-state');

    element.classList.toggle('pending', Boolean(message?.pending));
    element.classList.toggle('failed', Boolean(message?.failed));

    if (message?.pending || message?.failed) {
      receipt?.remove();
      receipt = null;
      if (!sendState) {
        sendState = message.failed ? document.createElement('button') : document.createElement('span');
        sendState.className = 'portal-chat-message-send-state';
        time?.appendChild(sendState);
      }
      if (message.failed && sendState.tagName !== 'BUTTON') {
        const replacement = document.createElement('button');
        sendState.replaceWith(replacement);
        sendState = replacement;
      } else if (message.pending && sendState.tagName === 'BUTTON') {
        const replacement = document.createElement('span');
        sendState.replaceWith(replacement);
        sendState = replacement;
      }

      if (message.failed) {
        sendState.type = 'button';
        sendState.className = 'portal-chat-message-send-state failed';
        sendState.dataset.chatRetry = String(message.clientId || '');
        sendState.textContent = 'Reenviar';
        sendState.title = 'Falha ao enviar. Clique para tentar novamente.';
        sendState.setAttribute('aria-label', 'Falha ao enviar. Reenviar mensagem.');
      } else {
        sendState.className = 'portal-chat-message-send-state pending';
        sendState.textContent = '';
        sendState.title = 'Enviando...';
        sendState.setAttribute('aria-label', 'Enviando mensagem');
      }
      return;
    }

    sendState?.remove();
    const state = receiptLabel(message);
    if (!state) {
      receipt?.remove();
      return;
    }
    if (!receipt) {
      receipt = document.createElement('span');
      receipt.className = 'portal-chat-message-receipt';
      time?.appendChild(receipt);
    }
    receipt.className = `portal-chat-message-receipt ${state.state}`;
    receipt.replaceChildren(receiptSvg(state.double));
    receipt.title = state.title;
    receipt.setAttribute('aria-label', state.title);
  }

  function applyReceiptStateFor(username, receiptState) {
    const key = messageCacheKey(username);
    if (!key || !receiptState) return;
    const deliveredThroughId = Number(receiptState.deliveredThroughId || 0);
    const readThroughId = Number(receiptState.readThroughId || 0);
    const cached = messageCache.get(key);
    if (!cached?.messages?.length) return;

    cached.messages.forEach((message) => {
      if (message.fromUser !== currentUser?.username) return;
      const id = Number(message.id || 0);
      if (id && id <= deliveredThroughId && !message.deliveredAt) message.deliveredAt = 'ack';
      if (id && id <= readThroughId && !message.readAt) message.readAt = 'ack';
      if (activeContact?.username === key) {
        const element = document.querySelector(`#portalChatMessages [data-message-id="${id}"]`);
        updateMessageReceiptElement(element, message);
      }
    });
    queueChatSessionPersist();
  }

  function applyReceiptState(receiptState) {
    if (!activeContact) return;
    applyReceiptStateFor(activeContact.username, receiptState);
  }

  async function markChatDelivered(force = false) {
    const root = document.getElementById('portalChatRoot');
    if (!root?.classList.contains('open')) return;
    const now = Date.now();
    if (!force && now - lastDeliverySyncAt < 2000) return;
    if (deliverySyncPending) return deliverySyncPending;
    deliverySyncPending = api('/api/chat/delivery', { method: 'POST', body: '{}' })
      .then((payload) => {
        lastDeliverySyncAt = Date.now();
        return payload;
      })
      .catch(() => null)
      .finally(() => {
        deliverySyncPending = null;
      });
    return deliverySyncPending;
  }

  function formatLastSeen(value) {
    const parsed = parseServerDate(value);
    if (!parsed) return 'ainda não esteve online';

    const now = new Date();
    const time = parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const today = now.toLocaleDateString('pt-BR');
    const date = parsed.toLocaleDateString('pt-BR');
    if (date === today) return `visto hoje às ${time}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date === yesterday.toLocaleDateString('pt-BR')) return `visto ontem às ${time}`;

    return `visto em ${date} às ${time}`;
  }

  function roleLabel(role) {
    return ({ medico: 'Médico(a)', recepcao: 'Recepção', coordenacao: 'Coordenação', telemedicina: 'Técnico em Telemedicina', admin: 'Desenvolvedor', cidadao: 'Cidadão' })[role] || role || '';
  }

  function avatarStyle(contact) {
    const photo = String(contact?.avatarDataUrl || '');
    return photo ? `background-image:url('${photo.replace(/'/g, '%27')}')` : '';
  }

  function showStatus(message) {
    const box = document.getElementById('portalChatStatus');
    if (!box) return;
    box.textContent = message;
    box.classList.add('visible');
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(() => box.classList.remove('visible'), 3200);
  }

  function notificationSupported() {
    return 'Notification' in window;
  }

  async function ensureNotificationWorker() {
    if (!('serviceWorker' in navigator)) return null;
    if (notificationWorker) return notificationWorker;
    try {
      notificationWorker = await navigator.serviceWorker.register('/portal-sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      return notificationWorker;
    } catch (_) {
      return null;
    }
  }

  function updateNotificationUi() {
    const card = document.getElementById('portalChatNotificationCard');
    const text = document.getElementById('portalChatNotificationText');
    const button = document.getElementById('portalChatEnableNotifications');
    if (!card || !text || !button) return;

    if (!notificationSupported()) {
      card.hidden = true;
      return;
    }

    if (Notification.permission === 'granted') {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    if (Notification.permission === 'denied') {
      card.classList.add('blocked');
      text.textContent = 'As notificações estão bloqueadas neste navegador. Para receber alertas, permita notificações nas configurações deste site.';
      button.hidden = true;
      return;
    }

    card.classList.remove('blocked');
    text.textContent = 'Ative para receber avisos de novas mensagens mesmo quando o Portal estiver fechado.';
    button.hidden = false;
  }

  async function requestNotificationPermission() {
    if (!notificationSupported()) return 'unsupported';
    if (Notification.permission === 'granted') {
      await ensureNotificationWorker();
      await window.PortalPWA?.enablePush?.({ requestPermission: false });
      updateNotificationUi();
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      updateNotificationUi();
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await ensureNotificationWorker();
        await window.PortalPWA?.enablePush?.({ requestPermission: false });
        showStatus('Notificações de mensagens ativadas.');
      } else if (permission === 'denied') {
        showStatus('Notificações bloqueadas pelo navegador.');
      }
      updateNotificationUi();
      return permission;
    } catch (_) {
      updateNotificationUi();
      return 'default';
    }
  }

  async function showMessageNotification(contact, amount) {
    if (!notificationSupported() || Notification.permission !== 'granted') return;
    if (window.PortalPWA?.hasActivePush?.()) return;

    const root = document.getElementById('portalChatRoot');
    const conversationVisible = !document.hidden
      && root?.classList.contains('open')
      && activeContact?.username === contact.username;
    if (conversationVisible) return;

    const title = `Nova mensagem de ${contact.name || contact.username}`;
    const body = amount > 1
      ? `${amount} novas mensagens no chat interno.`
      : 'Você recebeu uma nova mensagem no chat interno.';
    const options = {
      body,
      icon: '/assets/app-icon.svg',
      tag: `portal-chat-${contact.username}`,
      renotify: true,
      data: { chatUser: contact.username, url: `/home/?chat=${encodeURIComponent(contact.username)}` }
    };

    try {
      const registration = await ensureNotificationWorker();
      if (registration?.showNotification) {
        await registration.showNotification(title, options);
        return;
      }
    } catch (_) {}

    try {
      const notification = new Notification(title, options);
      notification.onclick = () => {
        window.focus();
        openChatByUsername(contact.username);
        notification.close();
      };
    } catch (_) {}
  }

  function processUnreadChanges(nextContacts) {
    const firstLoad = !contactsInitialized;
    const seen = new Set();

    nextContacts.forEach((contact) => {
      const username = contact.username;
      const unread = Number(contact.unread || 0);
      const previous = unreadSnapshot.has(username) ? Number(unreadSnapshot.get(username) || 0) : unread;
      seen.add(username);
      unreadSnapshot.set(username, unread);
      if (!firstLoad && unread > previous) {
        window.PortalInteractions?.emit?.('notification', { debounce: 900 });
        showMessageNotification(contact, unread - previous);
      }
    });

    Array.from(unreadSnapshot.keys()).forEach((username) => {
      if (!seen.has(username)) unreadSnapshot.delete(username);
    });
    contactsInitialized = true;
  }

  function totalUnread() {
    return contacts.reduce((sum, item) => sum + Number(item.unread || 0), 0);
  }

  function updateLauncher() {
    const badge = document.getElementById('portalChatUnread');
    if (!badge) return;
    const total = totalUnread();
    badge.textContent = total > 99 ? '99+' : String(total);
    badge.classList.toggle('visible', total > 0);
  }

  function contactHtml(contact) {
    const unread = Number(contact.unread || 0);
    const presenceText = contact.online ? 'online' : formatLastSeen(contact.lastSeen);
    return `<button class="portal-chat-contact" type="button" data-chat-user="${encodeURIComponent(contact.username)}">
      <span class="portal-chat-avatar" style="${avatarStyle(contact)}">${contact.avatarDataUrl ? '' : initials(contact.name || contact.username)}</span>
      <span class="portal-chat-contact-main">
        <strong>${escapeText(contact.name || contact.username).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</strong>
        <small>${escapeText(contact.jobTitle || roleLabel(contact.role)).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</small>
        <span class="portal-chat-presence ${contact.online ? 'online' : ''}"><span class="portal-chat-presence-dot"></span>${escapeText(presenceText)}</span>
      </span>
      ${unread ? `<span class="portal-chat-unread">${unread > 99 ? '99+' : unread}</span>` : '<span></span>'}
    </button>`;
  }

  function renderContacts() {
    const list = document.getElementById('portalChatList');
    const search = document.getElementById('portalChatSearch');
    const summary = document.getElementById('portalChatSummary');
    if (!list) return;
    const term = String(search?.value || '').trim().toLowerCase();
    const filtered = contacts.filter((item) => !term || `${item.name} ${item.username} ${item.jobTitle} ${roleLabel(item.role)}`.toLowerCase().includes(term));
    const online = contacts.filter((item) => item.online).length;
    if (summary) summary.textContent = `${online} online · ${contacts.length} usuário(s)`;
    list.innerHTML = filtered.length ? filtered.map(contactHtml).join('') : '<div class="portal-chat-empty">Nenhum usuário encontrado.</div>';
    updateLauncher();
    updateNotificationUi();
  }

  async function loadContacts() {
    try {
      const payload = await api('/api/chat/users', { method: 'GET' });
      const nextContacts = Array.isArray(payload.users) ? payload.users : [];
      processUnreadChanges(nextContacts);
      contacts = nextContacts;
      if (activeContact) {
        const refreshed = contacts.find((item) => item.username === activeContact.username);
        if (refreshed) {
          activeContact = refreshed;
          updateConversationHeader();
        }
      }
      renderContacts();
      preloadConversationsInBackground();
      if (document.getElementById('portalChatRoot')?.classList.contains('open')) void markChatDelivered();
    } catch (error) {
      showStatus(error.message || 'Não foi possível atualizar o chat.');
    }
  }

  function updateConversationHeader() {
    const name = document.getElementById('portalChatHeaderName');
    const status = document.getElementById('portalChatHeaderStatus');
    const profile = document.getElementById('portalChatProfileLink');
    if (name) name.textContent = activeContact?.name || activeContact?.username || 'Conversa';
    if (status) status.textContent = activeContact?.online ? 'online agora' : formatLastSeen(activeContact?.lastSeen);
    if (profile) {
      const profileHandle = activeContact?.socialHandle || activeContact?.username || '';
      profile.href = `/perfil/?u=${encodeURIComponent(profileHandle)}`;
      profile.hidden = !profileHandle;
    }
  }

  function messageElement(message) {
    const mine = message.fromUser === currentUser?.username;
    const element = document.createElement('div');
    element.className = `portal-chat-message ${mine ? 'mine' : 'theirs'}`;
    const text = document.createElement('span');
    text.textContent = message.body || '';
    const time = document.createElement('span');
    time.className = 'portal-chat-message-time';
    time.append(document.createTextNode(formatTime(message.sentAt)));
    element.append(text, time);
    if (mine) updateMessageReceiptElement(element, message);
    return element;
  }

  function unreadBoundaryFor(contact, messages = []) {
    const exact = Number(contact?.firstUnreadId || 0);
    if (exact > 0) return exact;
    const unread = Number(contact?.unread || 0);
    if (!unread) return 0;
    const incoming = (Array.isArray(messages) ? messages : [])
      .filter((message) => message.fromUser === contact?.username && Number(message?.id || 0) > 0);
    const explicit = incoming.filter((message) => !message.readAt);
    const candidates = explicit.length ? explicit : incoming.slice(-unread);
    return Number(candidates[0]?.id || 0);
  }

  function unreadDividerElement() {
    const divider = document.createElement('div');
    divider.className = 'portal-chat-unread-divider';
    divider.dataset.chatUnreadDivider = 'true';
    const label = document.createElement('span');
    label.textContent = 'Novas mensagens';
    divider.appendChild(label);
    return divider;
  }

  function appendUnreadDividerBefore(container, reference, messageId) {
    if (!activeUnreadBoundaryId || Number(messageId || 0) !== activeUnreadBoundaryId) return;
    if (container.querySelector?.('[data-chat-unread-divider]')) return;
    const divider = unreadDividerElement();
    container.insertBefore(divider, reference || null);
  }

  function appendMessages(messages, replace = false) {
    const box = document.getElementById('portalChatMessages');
    if (!box) return;
    const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    if (replace) box.innerHTML = '';
    messages.forEach((message) => {
      const id = Number(message?.id || 0);
      const clientId = String(message?.clientId || '');
      if (id && box.querySelector(`[data-message-id="${id}"]`)) return;
      if (clientId) {
        const pending = box.querySelector(`[data-client-id="${clientId}"]`);
        if (pending) {
          if (id > 0 && pendingMessages.has(clientId)) {
            replacePendingMessage(clientId, message, message.toUser || activeContact?.username || '');
          }
          return;
        }
      }
      const element = messageElement(message);
      element.dataset.messageId = String(message.id || '');
      if (clientId) element.dataset.clientId = clientId;
      appendUnreadDividerBefore(box, null, id);
      box.appendChild(element);
      lastMessageId = Math.max(lastMessageId, id);
    });
    if (replace && activeContact) {
      for (const entry of pendingMessages.values()) {
        if (entry?.username !== activeContact.username) continue;
        const clientId = String(entry.message?.clientId || '');
        if (!clientId || box.querySelector(`[data-client-id="${clientId}"]`)) continue;
        const element = messageElement(entry.message);
        element.dataset.messageId = String(entry.message?.id || '');
        element.dataset.clientId = clientId;
        box.appendChild(element);
      }
    }
    if (replace || nearBottom) box.scrollTop = box.scrollHeight;
  }

  function prependMessages(messages) {
    const box = document.getElementById('portalChatMessages');
    if (!box || !Array.isArray(messages) || !messages.length) return;
    const previousHeight = box.scrollHeight;
    const fragment = document.createDocumentFragment();
    messages.forEach((message) => {
      const id = Number(message?.id || 0);
      if (!id || box.querySelector(`[data-message-id="${id}"]`)) return;
      const element = messageElement(message);
      element.dataset.messageId = String(id);
      if (message.clientId) element.dataset.clientId = String(message.clientId);
      if (activeUnreadBoundaryId && id === activeUnreadBoundaryId && !box.querySelector('[data-chat-unread-divider]')) {
        fragment.appendChild(unreadDividerElement());
      }
      fragment.appendChild(element);
    });
    box.insertBefore(fragment, box.firstChild);
    box.scrollTop += Math.max(0, box.scrollHeight - previousHeight);
  }

  async function loadOlderMessages() {
    if (!activeContact || historyLoadPending) return;
    const username = activeContact.username;
    const key = messageCacheKey(username);
    const cached = messageCache.get(key);
    if (!cached?.hasOlder || !cached.messages?.length) return;
    const before = Number(cached.messages[0]?.id || 0);
    if (!before) return;

    historyLoadPending = (async () => {
      try {
        const payload = await api(
          `/api/chat/messages?with=${encodeURIComponent(username)}&after=0&before=${before}&peek=1`,
          { method: 'GET' }
        );
        if (!activeContact || activeContact.username !== username) return;
        const page = Array.isArray(payload.messages) ? payload.messages : [];
        const pageSize = Math.max(1, Number(payload.pageSize || MESSAGE_HISTORY_PAGE_SIZE));
        replaceCachedMessages(
          username,
          [...page, ...(cached.messages || [])],
          cached.lastMessageAt || '',
          { hasOlder: page.length >= pageSize }
        );
        prependMessages(page);
      } catch (_) {
        // Histórico antigo é um carregamento auxiliar; a conversa atual continua utilizável.
      }
    })().finally(() => {
      historyLoadPending = null;
    });
    return historyLoadPending;
  }

  async function loadMessages(initial = false) {
    if (!activeContact) return;
    const username = activeContact.username;
    try {
      const after = initial ? 0 : lastMessageId;
      const payload = await api(`/api/chat/messages?with=${encodeURIComponent(username)}&after=${after}`, { method: 'GET' });
      if (!activeContact || activeContact.username !== username) return;
      const messages = Array.isArray(payload.messages) ? payload.messages : [];
      const contact = contacts.find((item) => item.username === username);
      const pageSize = Math.max(1, Number(payload.pageSize || MESSAGE_HISTORY_PAGE_SIZE));
      if (initial && !activeUnreadBoundaryId && contact) {
        activeUnreadBoundaryId = unreadBoundaryFor(contact, messages);
      }
      if (initial) {
        replaceCachedMessages(username, messages, contact?.lastMessageAt || '', { hasOlder: messages.length >= pageSize });
      } else {
        mergeCachedMessages(username, messages, contact?.lastMessageAt || '', {
          hasOlder: messageCache.get(messageCacheKey(username))?.hasOlder || false
        });
      }
      appendMessages(messages, initial);
      applyReceiptState(payload.receipt);
      if (contact) {
        contact.unread = 0;
        contact.firstUnreadId = 0;
        unreadSnapshot.set(username, 0);
      }
      renderContacts();
    } catch (error) {
      showStatus(error.message || 'Não foi possível carregar as mensagens.');
    }
  }

  function stopMessagePolling() {
    if (messageTimer) window.clearInterval(messageTimer);
    messageTimer = null;
  }

  function startMessagePolling() {
    stopMessagePolling();
    if (realtimeConnected) return;
    messageTimer = window.setInterval(() => {
      if (!realtimeConnected && !document.hidden && activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) {
        loadMessages(false);
      }
    }, CHAT_FALLBACK_POLL_MS);
  }

  function restartContactsTimer() {
    if (contactsTimer) window.clearInterval(contactsTimer);
    const interval = realtimeConnected ? CHAT_CONTACTS_REALTIME_REFRESH_MS : CHAT_CONTACTS_FALLBACK_REFRESH_MS;
    contactsTimer = window.setInterval(() => {
      if (!document.hidden) loadContacts();
    }, interval);
  }

  function saveActiveDraft() {
    const input = document.getElementById('portalChatInput');
    if (!activeContact || !input) return;
    const value = String(input.value || '');
    if (value) draftCache.set(activeContact.username, value);
    else draftCache.delete(activeContact.username);
  }

  function openConversation(contact, options = {}) {
    saveActiveDraft();
    stopLocalTyping();
    clearRemoteTyping();
    activeContact = contact;
    const cachedForBoundary = messageCache.get(messageCacheKey(contact?.username));
    activeUnreadBoundaryId = unreadBoundaryFor(contact, cachedForBoundary?.messages || []);
    lastMessageId = 0;
    document.getElementById('portalChatRoot')?.classList.add('open');
    void markChatDelivered(true);
    document.getElementById('portalChatContactsView')?.classList.remove('active');
    document.getElementById('portalChatConversationView')?.classList.add('active');
    document.getElementById('portalChatBack').hidden = false;
    updateConversationHeader();
    const renderedFromMemory = renderCachedConversation(contact);
    void loadMessages(!renderedFromMemory);
    if (!realtimeConnected) startMessagePolling();
    const input = document.getElementById('portalChatInput');
    if (input) input.value = draftCache.get(contact.username) || '';
    queueChatSessionPersist();
    if (options.focus !== false) input?.focus();
  }

  async function openChatByUsername(username) {
    const normalized = String(username || '').trim();
    if (!normalized) return;
    if (!contacts.length) await loadContacts();
    const contact = contacts.find((item) => item.username === normalized);
    if (contact) openConversation(contact);
  }

  async function openChatByHandle(handle) {
    const normalized = String(handle || '').replace(/^@/, '').trim().toLowerCase();
    if (!normalized) return false;
    await loadContacts();
    const contact = contacts.find((item) => {
      const socialHandle = String(item.socialHandle || '').replace(/^@/, '').trim().toLowerCase();
      const username = String(item.username || '').trim().toLowerCase();
      return socialHandle === normalized || username === normalized;
    });
    if (!contact) {
      showStatus('A conversa ainda não está disponível. Confirme a amizade e tente novamente.');
      return false;
    }
    openConversation(contact);
    return true;
  }

  function closeConversation() {
    saveActiveDraft();
    stopLocalTyping();
    clearRemoteTyping();
    activeContact = null;
    activeUnreadBoundaryId = 0;
    lastMessageId = 0;
    stopMessagePolling();
    document.getElementById('portalChatConversationView')?.classList.remove('active');
    document.getElementById('portalChatContactsView')?.classList.add('active');
    document.getElementById('portalChatBack').hidden = true;
    const name = document.getElementById('portalChatHeaderName');
    const status = document.getElementById('portalChatHeaderStatus');
    const profile = document.getElementById('portalChatProfileLink');
    if (name) name.textContent = 'Chat interno';
    if (status) status.textContent = 'Comunicação entre usuários do portal';
    if (profile) profile.hidden = true;
    queueChatSessionPersist();
    loadContacts();
  }

  function pendingElement(clientId) {
    if (!clientId) return null;
    return document.querySelector(`#portalChatMessages [data-client-id="${clientId}"]`);
  }

  function replacePendingMessage(clientId, confirmed, username) {
    pendingMessages.delete(clientId);
    const existing = pendingElement(clientId);
    const confirmedId = Number(confirmed?.id || 0);
    if (existing) {
      const replacement = messageElement(confirmed);
      replacement.dataset.messageId = String(confirmedId || '');
      if (confirmed.clientId) replacement.dataset.clientId = String(confirmed.clientId);
      existing.replaceWith(replacement);
      lastMessageId = Math.max(lastMessageId, confirmedId);
    } else if (activeContact?.username === username) {
      appendMessages([confirmed], false);
    }
    const contact = contacts.find((item) => item.username === username);
    mergeCachedMessages(
      username,
      [confirmed],
      confirmed.sentAt || contact?.lastMessageAt || '',
      { hasOlder: messageCache.get(messageCacheKey(username))?.hasOlder || false }
    );
  }

  function updatePendingMessage(clientId, values = {}) {
    const entry = pendingMessages.get(clientId);
    if (!entry) return null;
    Object.assign(entry.message, values);
    const element = pendingElement(clientId);
    if (element) updateMessageReceiptElement(element, entry.message);
    return entry;
  }

  async function transmitPendingMessage(clientId) {
    const entry = pendingMessages.get(clientId);
    if (!entry) return false;
    const { username, message } = entry;
    updatePendingMessage(clientId, { pending: true, failed: false });

    try {
      const payload = await api('/api/chat/messages', {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({
          to: username,
          body: message.body,
          clientId
        })
      });
      if (!payload.message) throw new Error('O servidor não confirmou a mensagem.');
      replacePendingMessage(clientId, payload.message, username);
      queueChatSessionPersist();
      loadContacts();
      return true;
    } catch (error) {
      updatePendingMessage(clientId, { pending: false, failed: true });
      showStatus(error.message || 'Não foi possível enviar a mensagem. Você pode tentar novamente.');
      return false;
    }
  }

  function retryPendingMessage(clientId) {
    const normalized = String(clientId || '');
    if (!pendingMessages.has(normalized)) return;
    void transmitPendingMessage(normalized);
  }

  function sendMessage() {
    stopLocalTyping();
    const input = document.getElementById('portalChatInput');
    const body = String(input?.value || '').trim();
    const username = activeContact?.username || '';
    if (!body || !username) return;

    pendingSequence += 1;
    const clientId = createClientMessageId();
    const message = {
      id: -(Date.now() * 100 + pendingSequence),
      clientId,
      fromUser: currentUser?.username || '',
      toUser: username,
      body,
      sentAt: localServerTimestamp(),
      deliveredAt: null,
      readAt: null,
      pending: true,
      failed: false
    };

    pendingMessages.set(clientId, { username, message });
    if (input) input.value = '';
    draftCache.delete(username);
    appendMessages([message], false);
    queueChatSessionPersist();
    void transmitPendingMessage(clientId);
    input?.focus();
  }

  function restoreChatUiFromSession(snapshot) {
    if (!snapshot?.panelOpen) return;
    const root = document.getElementById('portalChatRoot');
    root?.classList.add('open');
    void markChatDelivered(true);
    const username = String(snapshot.activeUsername || '');
    const contact = contacts.find((item) => item.username === username);
    if (contact) {
      openConversation(contact, { focus: false });
      const offset = Math.max(0, Number(snapshot.activeScrollFromBottom || 0));
      window.requestAnimationFrame(() => {
        const box = document.getElementById('portalChatMessages');
        if (!box || activeContact?.username !== contact.username) return;
        box.scrollTop = Math.max(0, box.scrollHeight - box.clientHeight - offset);
      });
      return;
    }
    document.getElementById('portalChatConversationView')?.classList.remove('active');
    document.getElementById('portalChatContactsView')?.classList.add('active');
    document.getElementById('portalChatBack').hidden = true;
    queueChatSessionPersist();
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    if (!document.querySelector('link[data-portal-chat-profile]')) {
      const styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = '/css/portal-chat-profile-link.css?v=20260906-2';
      styles.dataset.portalChatProfile = 'true';
      document.head.appendChild(styles);
    }
    const root = document.createElement('div');
    root.className = 'portal-chat';
    root.id = 'portalChatRoot';
    root.innerHTML = `
      <button class="portal-chat-launcher" id="portalChatLauncher" type="button" aria-label="Abrir chat interno">
        <span class="portal-chat-launcher-icon">${ICONS.chat}</span><span class="chat-launcher-text">Chat</span><span class="chat-online-dot" aria-hidden="true"></span><span class="portal-chat-count" id="portalChatUnread">0</span>
      </button>
      <section class="portal-chat-panel" aria-label="Chat interno do portal">
        <header class="portal-chat-header">
          <button class="portal-chat-icon-button" id="portalChatBack" type="button" aria-label="Voltar para usuários" hidden>${ICONS.back}</button>
          <div class="portal-chat-header-main"><strong id="portalChatHeaderName">Chat interno</strong><span id="portalChatHeaderStatus">Comunicação entre usuários do portal</span><span class="portal-chat-typing" id="portalChatTyping" hidden>digitando…</span><a class="portal-chat-profile-link" id="portalChatProfileLink" href="/perfil/" hidden>Ver perfil</a></div>
          <button class="portal-chat-icon-button" id="portalChatClose" type="button" aria-label="Recolher chat">${ICONS.close}</button>
        </header>
        <div class="portal-chat-body">
          <div class="portal-chat-view portal-chat-contacts active" id="portalChatContactsView">
            <div class="portal-chat-search-wrap">
              <input class="portal-chat-search" id="portalChatSearch" type="search" placeholder="Procurar usuário" autocomplete="off">
              <div class="portal-chat-note" id="portalChatSummary">Carregando usuários...</div>
              <div class="portal-chat-notification-card" id="portalChatNotificationCard" hidden>
                <span class="portal-chat-notification-icon">${ICONS.notification}</span><div><strong>Notificações de mensagens</strong><span id="portalChatNotificationText"></span></div>
                <button type="button" id="portalChatEnableNotifications">Ativar notificações</button>
              </div>
            </div>
            <div class="portal-chat-list" id="portalChatList"><div class="portal-chat-empty">Carregando...</div></div>
          </div>
          <div class="portal-chat-view portal-chat-conversation" id="portalChatConversationView">
            <div class="portal-chat-messages" id="portalChatMessages"></div>
            <div><div class="portal-chat-compose"><textarea class="portal-chat-input" id="portalChatInput" maxlength="2000" rows="1" placeholder="Digite uma mensagem"></textarea><button class="portal-chat-send" id="portalChatSend" type="button">Enviar</button></div><div class="portal-chat-note">Uso interno do portal. Evite compartilhar dados sensíveis além do necessário.</div></div>
          </div>
        </div>
        <div class="portal-chat-status" id="portalChatStatus"></div>
      </section>`;
    document.body.appendChild(root);

    document.getElementById('portalChatLauncher')?.addEventListener('click', () => {
      root.classList.add('open');
      void markChatDelivered(true);
      queueChatSessionPersist();
      updateNotificationUi();
      if (notificationSupported() && Notification.permission === 'default') requestNotificationPermission();
      loadContacts();
    });
    document.getElementById('portalChatClose')?.addEventListener('click', () => {
      root.classList.remove('open');
      closeConversation();
      queueChatSessionPersist(0);
    });
    document.getElementById('portalChatBack')?.addEventListener('click', closeConversation);
    document.getElementById('portalChatEnableNotifications')?.addEventListener('click', requestNotificationPermission);
    document.getElementById('portalChatSearch')?.addEventListener('input', renderContacts);
    document.getElementById('portalChatList')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-chat-user]');
      if (!button) return;
      const username = decodeURIComponent(button.dataset.chatUser || '');
      const contact = contacts.find((item) => item.username === username);
      if (contact) openConversation(contact);
    });
    document.getElementById('portalChatMessages')?.addEventListener('scroll', (event) => {
      if (Number(event.currentTarget?.scrollTop || 0) < 120) void loadOlderMessages();
    }, { passive: true });
    document.getElementById('portalChatMessages')?.addEventListener('click', (event) => {
      const retry = event.target.closest?.('[data-chat-retry]');
      if (retry?.dataset.chatRetry) retryPendingMessage(retry.dataset.chatRetry);
    });
    document.getElementById('portalChatSend')?.addEventListener('click', sendMessage);
    document.getElementById('portalChatInput')?.addEventListener('input', () => {
      saveActiveDraft();
      noteLocalTyping();
      queueChatSessionPersist();
    });
    document.getElementById('portalChatInput')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  async function heartbeat(visit = false) {
    try {
      await api('/api/chat/presence', {
        method: 'POST',
        body: JSON.stringify({
          path: location.pathname || '/',
          visit: Boolean(visit),
          active: !document.hidden
        })
      });
    } catch (_) {}
  }

  async function start() {
    currentUser = await auth.me({ allowCached: true }).catch(() => auth.getCachedUser?.() || null);
    if (!currentUser || !CHAT_ROLES.has(currentUser.role)) return;
    mount();

    const params = new URLSearchParams(location.search);
    const chatFromUrl = params.get('chat');
    const chatHandleFromUrl = params.get('chatHandle');
    const snapshotPromise = getChatSessionSnapshot();
    const heartbeatPromise = heartbeat(true);

    if (notificationSupported() && Notification.permission === 'granted') {
      await ensureNotificationWorker();
      window.PortalPWA?.syncPush?.({ createIfPermitted: true });
    }

    const snapshot = await snapshotPromise;
    hydrateChatSessionSnapshot(snapshot);
    await heartbeatPromise;
    await loadContacts();

    if (!chatFromUrl && !chatHandleFromUrl) restoreChatUiFromSession(snapshot);

    realtimeStopped = false;
    void connectRealtime();
    heartbeatTimer = window.setInterval(() => heartbeat(false), 25000);
    restartContactsTimer();

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        realtimeStopped = false;
        void connectRealtime();
        heartbeat(false);
        loadContacts();
        if (activeContact && !realtimeConnected) loadMessages(false);
      }
    });

    window.addEventListener('online', () => {
      realtimeStopped = false;
      void connectRealtime();
    });

    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'OPEN_PORTAL_CHAT' && event.data.chatUser) {
        openChatByUsername(event.data.chatUser);
      }
    });

    if (chatFromUrl || chatHandleFromUrl) {
      if (chatHandleFromUrl) openChatByHandle(chatHandleFromUrl);
      else openChatByUsername(chatFromUrl);
      try {
        const url = new URL(location.href);
        url.searchParams.delete('chat');
        url.searchParams.delete('chatHandle');
        history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      } catch (_) {}
    }
  }

  window.addEventListener('pagehide', () => {
    saveActiveDraft();
    if (!persistChatSessionSnapshotNow()) void persistChatSessionSnapshot();
  });
  window.addEventListener('portal:session-cleared', () => {
    realtimeStopped = true;
    closeRealtime({ permanent: true });
    stopLocalTyping();
    clearRemoteTyping();
    stopMessagePolling();
    if (contactsTimer) window.clearInterval(contactsTimer);
    if (heartbeatTimer) window.clearInterval(heartbeatTimer);
    contactsTimer = null;
    heartbeatTimer = null;
    clearMessageMemory();
    clearChatSessionSnapshot();
  });

  window.PortalChat = Object.freeze({
    version: '20261002-realtime-1',
    openByUsername: openChatByUsername,
    openByHandle: openChatByHandle,
    refreshContacts: loadContacts
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
