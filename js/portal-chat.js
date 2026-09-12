'use strict';

(() => {
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
  const unreadSnapshot = new Map();
  const messageCache = new Map();
  const messagePreloadRequests = new Map();
  let messageCacheGeneration = 0;
  let messagePreloadSweep = null;
  const MESSAGE_PRELOAD_CONCURRENCY = 3;
  const MESSAGE_HISTORY_PAGE_SIZE = 120;
  const MESSAGE_PRELOAD_PAGE_GUARD = 100;
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

  function messageCacheKey(username) {
    return String(username || '').trim().toLowerCase();
  }

  function clearMessageMemory() {
    messageCacheGeneration += 1;
    messageCache.clear();
    messagePreloadRequests.clear();
  }

  function normalizeMessageList(messages) {
    const byId = new Map();
    for (const message of Array.isArray(messages) ? messages : []) {
      const id = Number(message?.id || 0);
      if (!id) continue;
      byId.set(id, message);
    }
    return Array.from(byId.values()).sort((first, second) => Number(first.id || 0) - Number(second.id || 0));
  }

  function replaceCachedMessages(username, messages, lastMessageAt = '') {
    const key = messageCacheKey(username);
    if (!key) return null;
    const entry = {
      messages: normalizeMessageList(messages),
      lastMessageAt: String(lastMessageAt || ''),
      loadedAt: Date.now()
    };
    messageCache.set(key, entry);
    return entry;
  }

  function mergeCachedMessages(username, messages, lastMessageAt = '') {
    const key = messageCacheKey(username);
    if (!key) return null;
    const previous = messageCache.get(key);
    return replaceCachedMessages(
      key,
      [...(previous?.messages || []), ...(Array.isArray(messages) ? messages : [])],
      lastMessageAt || previous?.lastMessageAt || ''
    );
  }

  async function preloadConversation(contact) {
    const username = String(contact?.username || '').trim();
    const key = messageCacheKey(username);
    if (!key) return [];

    const lastMessageAt = String(contact?.lastMessageAt || '');
    const cached = messageCache.get(key);
    if (!lastMessageAt) {
      if (!cached) replaceCachedMessages(key, [], '');
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
        mergeCachedMessages(key, Array.isArray(payload.messages) ? payload.messages : [], lastMessageAt);
        return messageCache.get(key)?.messages || [];
      }

      let allMessages = [];
      let before = 0;
      let pageCount = 0;
      const seenFirstIds = new Set();

      while (pageCount < MESSAGE_PRELOAD_PAGE_GUARD) {
        const beforeSuffix = before > 0 ? `&before=${before}` : '';
        const payload = await api(
          `/api/chat/messages?with=${encodeURIComponent(username)}&after=0&peek=1${beforeSuffix}`,
          { method: 'GET' }
        );
        const page = Array.isArray(payload.messages) ? payload.messages : [];
        if (!page.length) break;

        allMessages = before > 0 ? [...page, ...allMessages] : page;
        const pageSize = Math.max(1, Number(payload.pageSize || MESSAGE_HISTORY_PAGE_SIZE));
        if (page.length < pageSize) break;

        const firstId = Number(page[0]?.id || 0);
        if (!firstId || seenFirstIds.has(firstId)) break;
        seenFirstIds.add(firstId);
        before = firstId;
        pageCount += 1;
      }

      if (generation !== messageCacheGeneration) return [];
      replaceCachedMessages(key, allMessages, lastMessageAt);
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
    const cached = messageCache.get(messageCacheKey(contact?.username));
    if (!cached) return false;
    lastMessageId = 0;
    appendMessages(cached.messages, true);
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
    time.textContent = formatTime(message.sentAt);
    element.append(text, time);
    return element;
  }

  function appendMessages(messages, replace = false) {
    const box = document.getElementById('portalChatMessages');
    if (!box) return;
    const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    if (replace) box.innerHTML = '';
    messages.forEach((message) => {
      if (box.querySelector(`[data-message-id="${message.id}"]`)) return;
      const element = messageElement(message);
      element.dataset.messageId = String(message.id || '');
      box.appendChild(element);
      lastMessageId = Math.max(lastMessageId, Number(message.id || 0));
    });
    if (replace || nearBottom) box.scrollTop = box.scrollHeight;
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
      if (initial) replaceCachedMessages(username, messages, contact?.lastMessageAt || '');
      else mergeCachedMessages(username, messages, contact?.lastMessageAt || '');
      appendMessages(messages, initial);
      if (contact) {
        contact.unread = 0;
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
    messageTimer = window.setInterval(() => {
      if (!document.hidden && activeContact && document.getElementById('portalChatRoot')?.classList.contains('open')) loadMessages(false);
    }, 3500);
  }

  function openConversation(contact) {
    activeContact = contact;
    lastMessageId = 0;
    document.getElementById('portalChatRoot')?.classList.add('open');
    document.getElementById('portalChatContactsView')?.classList.remove('active');
    document.getElementById('portalChatConversationView')?.classList.add('active');
    document.getElementById('portalChatBack').hidden = false;
    updateConversationHeader();
    const renderedFromMemory = renderCachedConversation(contact);
    void loadMessages(!renderedFromMemory);
    startMessagePolling();
    document.getElementById('portalChatInput')?.focus();
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
    activeContact = null;
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
    loadContacts();
  }

  async function sendMessage() {
    const input = document.getElementById('portalChatInput');
    const send = document.getElementById('portalChatSend');
    const body = String(input?.value || '').trim();
    if (!body || !activeContact) return;
    if (send) send.disabled = true;
    try {
      const payload = await api('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({ to: activeContact.username, body })
      });
      if (input) input.value = '';
      if (payload.message) {
        appendMessages([payload.message], false);
        mergeCachedMessages(activeContact.username, [payload.message], payload.message.sentAt || activeContact.lastMessageAt || '');
      }
      window.PortalInteractions?.notify?.('success', 'Mensagem enviada.', send);
      loadContacts();
    } catch (error) {
      showStatus(error.message || 'Não foi possível enviar a mensagem.');
    } finally {
      if (send) send.disabled = false;
      input?.focus();
    }
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
          <div class="portal-chat-header-main"><strong id="portalChatHeaderName">Chat interno</strong><span id="portalChatHeaderStatus">Comunicação entre usuários do portal</span><a class="portal-chat-profile-link" id="portalChatProfileLink" href="/perfil/" hidden>Ver perfil</a></div>
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
      updateNotificationUi();
      if (notificationSupported() && Notification.permission === 'default') requestNotificationPermission();
      loadContacts();
    });
    document.getElementById('portalChatClose')?.addEventListener('click', () => {
      root.classList.remove('open');
      closeConversation();
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
    document.getElementById('portalChatSend')?.addEventListener('click', sendMessage);
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
    if (notificationSupported() && Notification.permission === 'granted') {
      await ensureNotificationWorker();
      window.PortalPWA?.syncPush?.({ createIfPermitted: true });
    }
    await heartbeat(true);
    await loadContacts();

    heartbeatTimer = window.setInterval(() => heartbeat(false), 25000);
    contactsTimer = window.setInterval(loadContacts, 12000);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        heartbeat(false);
        loadContacts();
        if (activeContact) loadMessages(false);
      }
    });

    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'OPEN_PORTAL_CHAT' && event.data.chatUser) {
        openChatByUsername(event.data.chatUser);
      }
    });

    const params = new URLSearchParams(location.search);
    const chatFromUrl = params.get('chat');
    const chatHandleFromUrl = params.get('chatHandle');
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

  window.addEventListener('pagehide', clearMessageMemory);
  window.addEventListener('portal:session-cleared', clearMessageMemory);

  window.PortalChat = Object.freeze({
    openByUsername: openChatByUsername,
    openByHandle: openChatByHandle,
    refreshContacts: loadContacts
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
