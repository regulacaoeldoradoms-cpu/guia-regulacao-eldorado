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
      if (payload.user) {
        const persistent = Boolean(localStorage.getItem(tokenKey));
        saveSession(token, payload.user, persistent);
      }
      return payload.user || null;
    } catch (error) {
      if (error.status === 401 || error.status === 403) clearSession();
      if (allowCached && error.status !== 401 && error.status !== 403) return getCachedUser();
      throw error;
    }
  }

  async function logout() {
    try { if (getToken()) await api('/api/auth/logout', { method: 'POST', body: '{}' }); }
    catch (_) {}
    clearSession();
  }

  function roleAllowed(user, allowedRoles) {
    if (!user) return false;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return allowed.includes(user.role) || user.role === 'admin';
  }

  async function requireRole(allowedRoles, options = {}) {
    const enforce = CONFIG.enforcement === true;
    if (!enforce) {
      return getCachedUser() || { username: 'configuracao', name: 'Modo de configuração', role: 'admin', preview: true };
    }
    const user = await me({ allowCached: false }).catch(() => null);
    if (!user) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${CONFIG.loginPath || '/login/'}?next=${next}`);
      return null;
    }
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
    enforcementEnabled: CONFIG.enforcement === true
  });
})();
