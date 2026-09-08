'use strict';

(() => {
  if (window.PortalSocial) return;

  const auth = window.RegulationAuth;
  const config = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(config.endpoint || '').replace(/\/$/, '');
  const objectUrls = new Set();

  const icons = Object.freeze({
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>',
    friends: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.4-4.2 2.4-6.4 6-6.4s5.6 2.2 6 6.4M15 14c3.3 0 5.2 1.8 5.6 5"/></svg>',
    tools: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 8H3c0-1 3-1 3-8Z"/><path d="M10 21h4"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3m0 11V10l4-7c2 0 3 1 3 3l-1 4h6a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2H7Z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v13H8l-4 4V4Z"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c.6-5 3.2-7.5 8-7.5s7.4 2.5 8 7.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.2 8 8 10 4.8-2 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-5"/></svg>'
  });

  function api(path, options = {}) {
    return auth.api(path, options);
  }

  async function getConfig(timeoutMs = 5000) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await api('/api/social/config', { signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted) {
        const timeoutError = new Error('A Camada Social demorou para responder. As Ferramentas continuam disponíveis.');
        timeoutError.code = 'SOCIAL_CONFIG_TIMEOUT';
        throw timeoutError;
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function initials(profile) {
    const source = String(profile?.name || profile?.handle || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function profileUrl(handle) {
    return `/perfil/?u=${encodeURIComponent(String(handle || '').replace(/^@/, ''))}`;
  }

  function formatDate(value) {
    const normalized = String(value || '').includes('T') ? String(value) : `${String(value || '').replace(' ', 'T')}Z`;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function status(message, type = 'info', target = document.getElementById('socialStatus')) {
    if (!target) return;
    target.textContent = message || '';
    target.className = `social-status ${type}`;
    target.hidden = !message;
    if (message) window.PortalInteractions?.emit?.(type === 'error' ? 'error' : type === 'success' ? 'success' : 'loaded', { target });
  }

  async function avatarBlob(handle) {
    if (!endpoint || !auth?.getToken?.()) return '';
    const response = await fetch(`${endpoint}/api/social/avatars/${encodeURIComponent(String(handle || '').replace(/^@/, ''))}`, {
      headers: auth.authorizationHeader(), cache: 'no-store'
    });
    if (!response.ok) return '';
    const url = URL.createObjectURL(await response.blob());
    objectUrls.add(url);
    return url;
  }

  async function mountAvatar(element, profile) {
    if (!element || !profile) return;
    element.textContent = initials(profile);
    element.style.backgroundImage = 'none';
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', `Foto de ${profile.name || `@${profile.handle}`}`);
    if (!profile.avatarAvailable) return;
    try {
      const url = await avatarBlob(profile.handle);
      if (!url || !element.isConnected) return;
      element.textContent = '';
      element.style.backgroundImage = `url("${url}")`;
    } catch (_) {}
  }

  function button(label, className = 'social-button', icon = '') {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    if (icon) {
      const visual = document.createElement('span');
      visual.className = 'social-button-icon';
      visual.innerHTML = icon;
      element.appendChild(visual);
    }
    const text = document.createElement('span');
    text.textContent = label;
    element.appendChild(text);
    return element;
  }

  function ensureDialog() {
    let dialog = document.getElementById('socialConfirmDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'socialConfirmDialog';
    dialog.className = 'social-dialog';
    dialog.setAttribute('aria-labelledby', 'socialConfirmTitle');
    dialog.innerHTML = '<form method="dialog"><div class="social-dialog-icon" aria-hidden="true"></div><h2 id="socialConfirmTitle"></h2><p></p><div class="social-dialog-actions"><button value="cancel" class="social-button secondary">Cancelar</button><button value="confirm" class="social-button primary">Confirmar</button></div></form>';
    document.body.appendChild(dialog);
    return dialog;
  }

  function confirmAction({ title, message, confirmLabel = 'Confirmar', danger = false }) {
    const dialog = ensureDialog();
    dialog.querySelector('h2').textContent = title;
    dialog.querySelector('p').textContent = message;
    dialog.querySelector('.social-dialog-icon').innerHTML = danger ? icons.shield : icons.user;
    const confirm = dialog.querySelector('[value="confirm"]');
    confirm.textContent = confirmLabel;
    confirm.className = `social-button ${danger ? 'danger' : 'primary'}`;
    dialog.returnValue = '';
    dialog.showModal();
    return new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true });
    });
  }

  function ensureReportDialog() {
    let dialog = document.getElementById('socialReportDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'socialReportDialog';
    dialog.className = 'social-dialog';
    dialog.setAttribute('aria-labelledby', 'socialReportTitle');
    const form = document.createElement('form');
    form.method = 'dialog';
    const title = document.createElement('h2');
    title.id = 'socialReportTitle';
    title.textContent = 'Denunciar conteúdo social';
    const description = document.createElement('p');
    description.textContent = 'A denúncia será analisada pelo Desenvolvedor e não afeta automaticamente a conta profissional. Não inclua dados de pacientes ou manifestações.';
    const label = document.createElement('label');
    label.textContent = 'Motivo';
    const select = document.createElement('select');
    select.id = 'socialReportReason';
    label.htmlFor = select.id;
    select.name = 'reason';
    select.required = true;
    [['spam', 'Spam'], ['assedio', 'Assédio'], ['falsidade', 'Falsidade de identidade'], ['inadequado', 'Conteúdo inadequado'], ['privacidade', 'Privacidade'], ['outro', 'Outro']]
      .forEach(([value, text]) => select.add(new Option(text, value)));
    const detailsLabel = document.createElement('label');
    detailsLabel.textContent = 'Detalhes opcionais';
    const details = document.createElement('textarea');
    details.id = 'socialReportDetails';
    detailsLabel.htmlFor = details.id;
    details.name = 'details';
    details.maxLength = 500;
    details.rows = 4;
    const actions = document.createElement('div');
    actions.className = 'social-dialog-actions';
    const cancel = button('Cancelar', 'social-button secondary');
    cancel.type = 'submit';
    cancel.value = 'cancel';
    cancel.formNoValidate = true;
    const send = button('Enviar denúncia', 'social-button danger');
    send.type = 'submit';
    send.value = 'confirm';
    actions.append(cancel, send);
    form.append(title, description, label, select, detailsLabel, details, actions);
    dialog.appendChild(form);
    document.body.appendChild(dialog);
    return dialog;
  }

  async function report(targetType, target) {
    const dialog = ensureReportDialog();
    dialog.querySelector('form').reset();
    dialog.returnValue = '';
    dialog.showModal();
    const confirmed = await new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true });
    });
    if (!confirmed) return false;
    const form = new FormData(dialog.querySelector('form'));
    await api('/api/social/reports', {
      method: 'POST',
      body: JSON.stringify({ targetType, target, reason: form.get('reason'), details: form.get('details') })
    });
    return true;
  }

  window.addEventListener('pagehide', () => {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
  });

  window.PortalSocial = Object.freeze({
    api,
    button,
    confirmAction,
    formatDate,
    getConfig,
    icons,
    initials,
    mountAvatar,
    profileUrl,
    report,
    status
  });
})();
