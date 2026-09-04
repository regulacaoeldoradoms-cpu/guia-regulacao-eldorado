'use strict';

(() => {
  const CONFIG = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(CONFIG.endpoint || '').replace(/\/$/, '');
  const tokenKey = CONFIG.tokenStorageKey || 'regulacao.portal.session';
  const userKey = CONFIG.userStorageKey || 'regulacao.portal.user';

  function getToken() {
    try { return sessionStorage.getItem(tokenKey) || localStorage.getItem(tokenKey) || ''; }
    catch (_) { return ''; }
  }

  function getCachedUser() {
    try {
      const raw = sessionStorage.getItem(userKey) || localStorage.getItem(userKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function persistentSession() {
    try { return Boolean(localStorage.getItem(tokenKey)); }
    catch (_) { return false; }
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(tokenKey);
      sessionStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    } catch (_) {}
  }

  function saveSession(token, user, persistent = false) {
    clearSession();
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(tokenKey, token);
    storage.setItem(userKey, JSON.stringify(user));
  }

  function initialsFor(user) {
    const source = String(user?.name || user?.username || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function accountRank(user) {
    const level = String(user?.accountLevel || user?.accountProgress?.level || (user?.emailVerified ? 'prata' : 'bronze')).toLowerCase();
    return level === 'ouro' ? 3 : level === 'prata' ? 2 : 1;
  }

  function ensurePortalAccountArea(container) {
    let area = container.querySelector('.portal-account-area');
    const meta = container.querySelector('.portal-user-meta');
    if (!area) {
      area = document.createElement('a');
      area.className = 'portal-account-area';
      area.href = '/conta/';
      area.setAttribute('aria-label', 'Abrir minha conta');
      area.title = 'Minha conta';
      if (meta) {
        container.insertBefore(area, meta);
        area.appendChild(meta);
      } else {
        const logout = container.querySelector('#portalLogout');
        if (logout) container.insertBefore(area, logout);
        else container.prepend(area);
      }
    } else if (meta && meta.parentElement !== area) {
      area.appendChild(meta);
    }
    return area;
  }

  function mountPortalAvatar(user) {
    const container = document.querySelector('.portal-user');
    if (!container || !user) return;
    const accountArea = ensurePortalAccountArea(container);
    let avatar = container.querySelector('.portal-profile-avatar');
    if (!avatar) {
      avatar = document.createElement('div');
      avatar.className = 'portal-profile-avatar';
      avatar.style.cssText = 'width:40px;height:40px;flex:0 0 40px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.55);box-shadow:0 4px 12px rgba(0,0,0,.16);font-size:.78rem;font-weight:900;color:#fff;background-size:cover;background-position:center;';
    }
    avatar.setAttribute('aria-hidden', 'true');
    if (avatar.parentElement !== accountArea) accountArea.insertBefore(avatar, accountArea.querySelector('.portal-user-meta'));
    const photo = String(user.avatarDataUrl || '');
    avatar.textContent = photo ? '' : initialsFor(user);
    avatar.style.backgroundImage = photo ? `url("${photo}")` : 'none';
    accountArea.setAttribute('aria-label', `Abrir minha conta: ${user.name || user.username || 'usuário'}`);
  }

  async function api(path, options = {}) {
    if (!endpoint) throw new Error('Servidor do portal não configurado.');
    const token = getToken();
    const headers = { ...(options.headers || {}) };
    if (!(options.body instanceof FormData) && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${endpoint}${path}`, { ...options, headers, cache: 'no-store' });
    const contentType = response.headers.get('Content-Type') || '';
    const payload = contentType.includes('application/json') ? await response.json().catch(() => ({})) : null;
    if (!response.ok) {
      const error = new Error(payload?.error || `Falha no portal (${response.status}).`);
      error.status = response.status;
      error.code = payload?.code || '';
      error.verificationPath = payload?.verificationPath || '';
      error.requiredLevel = payload?.requiredLevel || '';
      error.retryAfterSeconds = Number(payload?.retryAfterSeconds || 0);
      throw error;
    }
    return payload;
  }

  async function login(username, password, persistent = false) {
    const payload = await api('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ username: String(username || '').trim(), password: String(password || '') })
    });
    if (!payload?.token || !payload?.user) throw new Error('Resposta de autenticação inválida.');
    saveSession(payload.token, payload.user, persistent);
    return payload.user;
  }

  async function registerCitizen(username, password) {
    const payload = await api('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ username: String(username || '').trim(), password: String(password || '') })
    });
    if (!payload?.token || !payload?.user) throw new Error('Não foi possível concluir o cadastro.');
    saveSession(payload.token, payload.user, false);
    return payload.user;
  }

  async function me({ allowCached = true } = {}) {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = await api('/api/auth/me', { method: 'GET' });
      let user = payload?.user || null;
      if (user) {
        const profile = await api('/api/auth/profile', { method: 'GET' }).catch(() => null);
        user = {
          ...user,
          accountLevel: profile?.accountLevel || user.accountLevel || (user.emailVerified ? 'prata' : 'bronze'),
          avatarDataUrl: profile && Object.prototype.hasOwnProperty.call(profile, 'avatarDataUrl')
            ? String(profile.avatarDataUrl || '')
            : String(getCachedUser()?.avatarDataUrl || ''),
          profilePhotoLocked: Boolean(profile?.locked),
          profilePhotoRequiredLevel: profile?.requiredLevel || ''
        };
        saveSession(token, user, persistentSession());
        mountPortalAvatar(user);
      }
      return user;
    } catch (error) {
      if (error.status === 401) clearSession();
      if (allowCached && error.status !== 401) {
        const cached = getCachedUser();
        if (cached) mountPortalAvatar(cached);
        return cached;
      }
      throw error;
    }
  }

  async function logout() {
    try { if (getToken()) await api('/api/auth/logout', { method: 'POST', body: '{}' }); }
    catch (_) {}
    clearSession();
  }

  async function changePassword(currentPassword, newPassword) {
    const previous = getCachedUser() || {};
    const payload = await api('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
    if (!payload?.token || !payload?.user) throw new Error('Não foi possível renovar a sessão após a troca de senha.');
    const user = {
      ...payload.user,
      avatarDataUrl: String(previous.avatarDataUrl || ''),
      profilePhotoLocked: Boolean(previous.profilePhotoLocked),
      profilePhotoRequiredLevel: previous.profilePhotoRequiredLevel || '',
      accountLevel: payload.user.accountLevel || previous.accountLevel || (payload.user.emailVerified ? 'prata' : 'bronze'),
      accountProgress: payload.user.accountProgress || previous.accountProgress || null,
      emailVerificationRequired: Boolean(previous.emailVerificationRequired && !payload.user.emailVerified)
    };
    saveSession(payload.token, user, persistentSession());
    mountPortalAvatar(user);
    return user;
  }

  async function updateProfilePhoto(avatarDataUrl) {
    const current = getCachedUser();
    if (current && accountRank(current) < 2) {
      const error = new Error('Confirme seu e-mail para alcançar o nível Prata e desbloquear a foto de perfil.');
      error.code = 'ACCOUNT_LEVEL_REQUIRED';
      error.requiredLevel = 'prata';
      throw error;
    }
    const payload = await api('/api/auth/profile', { method: 'PATCH', body: JSON.stringify({ avatarDataUrl: String(avatarDataUrl || '') }) });
    if (!current) return payload;
    const user = { ...current, avatarDataUrl: String(payload.avatarDataUrl || ''), profilePhotoLocked: false, profilePhotoRequiredLevel: '' };
    saveSession(getToken(), user, persistentSession());
    mountPortalAvatar(user);
    return user;
  }

  async function getSecurity() {
    const payload = await api('/api/auth/security', { method: 'GET' });
    return payload?.security || {};
  }

  async function updateSecurity(input) {
    const payload = await api('/api/auth/security', { method: 'PATCH', body: JSON.stringify(input || {}) });
    const security = payload?.security || {};
    const current = getCachedUser();
    if (current) {
      const level = current.accountLevel === 'ouro'
        ? 'ouro'
        : (security.emailVerified ? 'prata' : 'bronze');
      const user = {
        ...current,
        emailConfigured: Boolean(security.email),
        emailVerified: Boolean(security.emailVerified),
        emailVerificationRequired: Boolean(current.emailVerificationRequired && !security.emailVerified),
        privacyMode: security.privacyMode || current.privacyMode,
        acceptFriendRequests: Boolean(security.acceptFriendRequests),
        accountLevel: level
      };
      saveSession(getToken(), user, persistentSession());
    }
    return security;
  }

  async function sendEmailVerification() {
    return api('/api/auth/email/send-verification', { method: 'POST', body: '{}' });
  }

  async function listUsers() {
    const payload = await api('/api/admin/users', { method: 'GET' });
    return Array.isArray(payload?.users) ? payload.users : [];
  }

  async function createUser(input) {
    const payload = await api('/api/admin/users', { method: 'POST', body: JSON.stringify(input) });
    return payload.user;
  }

  async function updateUser(username, input) {
    const payload = await api(`/api/admin/users/${encodeURIComponent(username)}`, { method: 'PATCH', body: JSON.stringify(input) });
    return payload.user;
  }

  async function resetUserPassword(username, password, mustChangePassword = true) {
    return api(`/api/admin/users/${encodeURIComponent(username)}/reset-password`, {
      method: 'POST', body: JSON.stringify({ password, mustChangePassword })
    });
  }

  function roleAllowed(user, allowedRoles) {
    if (!user) return false;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!allowed.length) return true;
    if (user.role === 'admin') return true;
    if (allowed.includes(user.role)) return true;
    return user.role === 'coordenacao' && allowed.some((role) => role === 'medico' || role === 'recepcao');
  }

  function verificationDestination() {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    return `/conta/?verificar-email=1&next=${next}`;
  }

  async function requireRole(allowedRoles, options = {}) {
    if (CONFIG.enforcement !== true) {
      const preview = getCachedUser() || { username: 'configuracao', name: 'Modo de configuração', role: 'admin', councilRole: 'membro', preview: true };
      mountPortalAvatar(preview);
      return preview;
    }
    const user = await me({ allowCached: false }).catch(() => null);
    if (!user) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${CONFIG.loginPath || '/login/'}?next=${next}`);
      return null;
    }
    mountPortalAvatar(user);
    if (user.emailVerificationRequired && location.pathname !== '/conta/' && !location.pathname.startsWith('/conta/')) {
      location.replace(verificationDestination());
      return null;
    }
    if (!roleAllowed(user, allowedRoles)) {
      location.replace(options.deniedPath || (user.role === 'cidadao' ? '/cidadao/' : CONFIG.homePath || '/'));
      return null;
    }
    return user;
  }

  function hasCouncilAccess(user) {
    return Boolean(user && ['membro', 'presidente', 'vice_presidente'].includes(user.councilRole));
  }

  function authorizationHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  window.RegulationAuth = Object.freeze({
    api,
    login,
    registerCitizen,
    logout,
    me,
    requireRole,
    roleAllowed,
    hasCouncilAccess,
    getToken,
    getCachedUser,
    clearSession,
    authorizationHeader,
    changePassword,
    updateProfilePhoto,
    getSecurity,
    updateSecurity,
    sendEmailVerification,
    mountPortalAvatar,
    listUsers,
    createUser,
    updateUser,
    resetUserPassword,
    enforcementEnabled: CONFIG.enforcement === true
  });
})();
