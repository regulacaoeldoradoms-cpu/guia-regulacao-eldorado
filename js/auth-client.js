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

  function saveSession(token, user, persistent = false) {
    clearSession();
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(tokenKey, token);
    storage.setItem(userKey, JSON.stringify(user));
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(tokenKey);
      sessionStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    } catch (_) {}
  }

  function initialsFor(user) {
    const source = String(user?.name || user?.username || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  function mountPortalAvatar(user) {
    const container = document.querySelector('.portal-user');
    if (!container || !user) return;
    let avatar = container.querySelector('.portal-profile-avatar');
    if (!avatar) {
      avatar = document.createElement('div');
      avatar.className = 'portal-profile-avatar';
      avatar.setAttribute('aria-label', `Foto de perfil de ${user.name || user.username || 'usuário'}`);
      avatar.style.cssText = 'width:40px;height:40px;flex:0 0 40px;border-radius:50%;display:grid;place-items:center;overflow:hidden;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.55);box-shadow:0 4px 12px rgba(0,0,0,.16);font-size:.78rem;font-weight:900;color:#fff;background-size:cover;background-position:center;';
      const meta = container.querySelector('.portal-user-meta');
      if (meta) container.insertBefore(avatar, meta);
      else container.prepend(avatar);
    }
    const photo = String(user.avatarDataUrl || '');
    avatar.textContent = photo ? '' : initialsFor(user);
    avatar.style.backgroundImage = photo ? `url("${photo}")` : 'none';
  }

  async function api(path, options = {}) {
    if (!endpoint) throw new Error('Servidor de autenticação não configurado.');
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${endpoint}${path}`, { ...options, headers, cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Falha de autenticação (${response.status}).`);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  async function login(username, password, persistent = false) {
    const payload = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: String(username || '').trim(), password: String(password || '') })
    });
    if (!payload.token || !payload.user) throw new Error('Resposta de autenticação inválida.');
    saveSession(payload.token, payload.user, persistent);
    return payload.user;
  }

  async function me({ allowCached = true } = {}) {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = await api('/api/auth/me', { method: 'GET' });
      let user = payload.user || null;
      if (user) {
        const profile = await api('/api/auth/profile', { method: 'GET' }).catch(() => null);
        if (profile && Object.prototype.hasOwnProperty.call(profile, 'avatarDataUrl')) {
          user = { ...user, avatarDataUrl: String(profile.avatarDataUrl || '') };
        } else {
          user = { ...user, avatarDataUrl: String(getCachedUser()?.avatarDataUrl || '') };
        }
        saveSession(token, user, persistentSession());
        mountPortalAvatar(user);
      }
      return user;
    } catch (error) {
      if (error.status === 401 || error.status === 403) clearSession();
      if (allowCached && error.status !== 401 && error.status !== 403) {
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
    const payload = await api('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!payload.token || !payload.user) throw new Error('Não foi possível renovar a sessão após a troca de senha.');
    const user = { ...payload.user, avatarDataUrl: String(previous.avatarDataUrl || '') };
    saveSession(payload.token, user, persistentSession());
    mountPortalAvatar(user);
    return user;
  }

  async function updateProfilePhoto(avatarDataUrl) {
    const payload = await api('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ avatarDataUrl: String(avatarDataUrl || '') })
    });
    const current = getCachedUser();
    if (!current) return payload;
    const user = { ...current, avatarDataUrl: String(payload.avatarDataUrl || '') };
    saveSession(getToken(), user, persistentSession());
    mountPortalAvatar(user);
    return user;
  }

  async function listUsers() {
    const payload = await api('/api/admin/users', { method: 'GET' });
    return Array.isArray(payload.users) ? payload.users : [];
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
      method: 'POST',
      body: JSON.stringify({ password, mustChangePassword })
    });
  }

  function roleAllowed(user, allowedRoles) {
    if (!user) return false;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return allowed.includes(user.role) || user.role === 'admin';
  }

  async function requireRole(allowedRoles, options = {}) {
    const enforce = CONFIG.enforcement === true;
    if (!enforce) {
      const preview = getCachedUser() || { username: 'configuracao', name: 'Modo de configuração', role: 'admin', preview: true };
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
    if (!roleAllowed(user, allowedRoles)) {
      location.replace(options.deniedPath || CONFIG.homePath || '/home/');
      return null;
    }
    return user;
  }

  function authorizationHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  window.RegulationAuth = Object.freeze({
    login,
    logout,
    me,
    requireRole,
    roleAllowed,
    getToken,
    getCachedUser,
    clearSession,
    authorizationHeader,
    changePassword,
    updateProfilePhoto,
    mountPortalAvatar,
    listUsers,
    createUser,
    updateUser,
    resetUserPassword,
    enforcementEnabled: CONFIG.enforcement === true
  });
})();