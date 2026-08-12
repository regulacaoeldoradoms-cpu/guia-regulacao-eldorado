'use strict';

(() => {
  const conversationCache = new Map();
  let currentUsername = '';

  function messagesBox() {
    return document.getElementById('portalChatMessages');
  }

  function snapshotCurrentConversation() {
    if (!currentUsername) return;
    const box = messagesBox();
    if (!box || !box.querySelector('.portal-chat-message')) return;
    conversationCache.set(currentUsername, box.innerHTML);
  }

  function showConversationImmediately(username) {
    const box = messagesBox();
    if (!box) return;

    snapshotCurrentConversation();
    currentUsername = username;

    const cached = conversationCache.get(username);
    if (cached) {
      box.innerHTML = cached;
      box.scrollTop = box.scrollHeight;
      return;
    }

    box.innerHTML = '<div class="portal-chat-empty" data-chat-switch-loading>Carregando conversa...</div>';
    box.scrollTop = 0;
  }

  document.addEventListener('click', (event) => {
    const contactButton = event.target.closest?.('.portal-chat-contact[data-chat-user]');
    if (contactButton) {
      const username = decodeURIComponent(contactButton.dataset.chatUser || '');
      if (username) showConversationImmediately(username);
      return;
    }

    if (event.target.closest?.('#portalChatBack, #portalChatClose')) {
      snapshotCurrentConversation();
    }
  }, true);

  window.addEventListener('message', (event) => {
    if (event.data?.type !== 'OPEN_PORTAL_CHAT' || !event.data.chatUser) return;
    showConversationImmediately(String(event.data.chatUser));
  });
})();
