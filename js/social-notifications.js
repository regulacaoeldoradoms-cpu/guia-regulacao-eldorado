'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const judicialIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v17M7 21h10M5 7h14"/><path d="m7 7-4 7h8L7 7Zm10 0-4 7h8l-4-7Z"/></svg>';
  const user = await auth.requireRole([]);
  if (!user) return;
  if (user.mustChangePassword) { location.replace('/seguranca/?primeiro-acesso=1'); return; }
  document.getElementById('portalUserName').textContent = user.name || user.username || 'Usuário';
  document.getElementById('portalUserRole').textContent = window.PortalTools?.roleLabels?.[user.role] || user.role || '';
  document.getElementById('portalLogout')?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });
  let config;
  try { config = await social.getConfig(); }
  catch (error) { social.status(error.message || 'Camada Social indisponível.', 'error'); return; }
  window.PortalSocialNavigation?.mount(user, config);
  if (!config.available) { social.status(config.gate?.message || 'Notificações sociais indisponíveis para esta conta.', 'error'); return; }

  let cursor = '';
  const list = document.getElementById('socialNotificationList');
  const more = document.getElementById('socialNotificationMore');

  function render(items, append) {
    if (!append) list.innerHTML = '';
    if (!items.length && !append) {
      const empty = document.createElement('div');
      empty.className = 'social-empty';
      empty.innerHTML = social.icons.bell;
      const title = document.createElement('h2'); title.textContent = 'Tudo em dia';
      const text = document.createElement('p'); text.textContent = 'Novos pedidos de amizade, aceitações, comentários e alertas judiciais aparecerão aqui.';
      empty.append(title, text); list.appendChild(empty); return;
    }
    items.forEach((item) => {
      const row = document.createElement('article');
      row.className = `social-notification${item.read ? '' : ' unread'}`;
      const judicial = item.type === 'judicial_alert';
      if (judicial) row.classList.add('judicial');
      const avatar = document.createElement('div'); avatar.className = 'social-avatar';
      if (item.actor) social.mountAvatar(avatar, item.actor);
      else if (judicial) {
        avatar.innerHTML = judicialIcon;
        avatar.setAttribute('aria-label', 'Alerta judicial');
      } else avatar.innerHTML = social.icons.bell;
      const copy = document.createElement('div');
      const message = document.createElement('p');
      if (item.actor) {
        const link = document.createElement('a'); link.href = social.profileUrl(item.actor.handle); link.textContent = item.actor.name || `@${item.actor.handle}`;
        link.style.fontWeight = '900'; link.style.color = 'inherit';
        message.append(link, document.createTextNode(` ${item.text}.`));
      } else message.textContent = item.text;
      const displayedAt = judicial ? (item.judicial?.receivedAt || item.createdAt) : item.createdAt;
      const time = document.createElement('time');
      time.dateTime = displayedAt;
      time.textContent = judicial ? `Recebido no Gmail: ${social.formatDate(displayedAt)}` : social.formatDate(displayedAt);
      copy.append(message, time); row.append(avatar, copy); list.appendChild(row);
    });
  }

  async function load(append = false) {
    if (!append) cursor = '';
    more.disabled = true;
    try {
      const payload = await social.api(`/api/social/notifications${append && cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
      render(payload.notifications || [], append);
      cursor = payload.nextCursor || '';
      more.hidden = !cursor;
    } catch (error) { social.status(error.message || 'Não foi possível carregar notificações.', 'error'); }
    finally { more.disabled = false; }
  }

  more.addEventListener('click', () => load(true));
  document.getElementById('markSocialRead').addEventListener('click', async () => {
    try {
      await social.api('/api/social/notifications', { method: 'PATCH', body: '{}' });
      document.querySelectorAll('.social-notification.unread').forEach((item) => item.classList.remove('unread'));
      document.querySelectorAll('.social-nav-badge').forEach((badge) => { badge.textContent = '0'; badge.hidden = true; });
      social.status('Notificações sociais marcadas como lidas.', 'success');
    } catch (error) { social.status(error.message || 'Não foi possível atualizar notificações.', 'error'); }
  });
  await load(false);
})();
