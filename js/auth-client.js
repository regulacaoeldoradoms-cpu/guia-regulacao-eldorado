'use strict';

(() => {
  const CONFIG = window.REGULATION_AUTH_CONFIG || {};
  const endpoint = String(CONFIG.endpoint || '').replace(/\/$/, '');
  const tokenKey = CONFIG.tokenStorageKey || 'regulacao.portal.session';
  const userKey = CONFIG.userStorageKey || 'regulacao.portal.user';
  const validationKey = `${userKey}.validatedAt`;
  const SESSION_RECHECK_MS = 45000;
  let backgroundValidation = null;

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

  function sessionEvent(type, user = null) {
    try {
      window.dispatchEvent(new CustomEvent(type, { detail: user ? { user } : {} }));
    } catch (_) {}
    if (user) window.PortalPerformance?.warmForUser?.(user);
  }

  function clearSession(options = {}) {
    try {
      sessionStorage.removeItem(tokenKey);
      sessionStorage.removeItem(userKey);
      sessionStorage.removeItem(validationKey);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      localStorage.removeItem(validationKey);
    } catch (_) {}
    if (options.notify !== false) sessionEvent('portal:session-cleared');
  }

  function saveSession(token, user, persistent = false) {
    clearSession({ notify: false });
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(tokenKey, token);
    storage.setItem(userKey, JSON.stringify(user));
    storage.setItem(validationKey, String(Date.now()));
    sessionEvent('portal:session-ready', user);
  }

  function sessionValidationAge() {
    try {
      const value = sessionStorage.getItem(validationKey) || localStorage.getItem(validationKey);
      const checkedAt = Number(value || 0);
      return checkedAt > 0 ? Math.max(0, Date.now() - checkedAt) : Number.POSITIVE_INFINITY;
    } catch (_) {
      return Number.POSITIVE_INFINITY;
    }
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
      area.href = '/perfil/';
      area.setAttribute('aria-label', 'Abrir meu perfil');
      area.title = 'Meu perfil';
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
    accountArea.setAttribute('aria-label', `Abrir meu perfil: ${user.name || user.username || 'usuário'}`);
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
    const previous = getCachedUser();
    const payload = await api('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ username: String(username || '').trim(), password: String(password || '') })
    });
    if (!payload?.token || !payload?.user) throw new Error('Resposta de autenticação inválida.');
    const sameUser = previous?.username === payload.user.username;
    const user = {
      ...payload.user,
      avatarDataUrl: sameUser ? String(previous.avatarDataUrl || '') : '',
      avatarVersion: sameUser ? String(previous.avatarVersion || '') : ''
    };
    saveSession(payload.token, user, persistent);
    return user;
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
      const fresh = payload?.user || null;
      let user = fresh;
      if (fresh) {
        const cached = getCachedUser();
        const sameUser = cached?.username === fresh.username;
        const hasAvatar = Object.prototype.hasOwnProperty.call(fresh, 'avatarDataUrl');
        const level = fresh.accountLevel || (fresh.emailVerified ? 'prata' : 'bronze');
        user = {
          ...fresh,
          accountLevel: level,
          avatarDataUrl: hasAvatar ? String(fresh.avatarDataUrl || '') : (sameUser ? String(cached.avatarDataUrl || '') : ''),
          avatarVersion: hasAvatar ? String(fresh.avatarVersion || '') : (sameUser ? String(cached.avatarVersion || '') : ''),
          profilePhotoLocked: accountRank({ ...fresh, accountLevel: level }) < 2,
          profilePhotoRequiredLevel: accountRank({ ...fresh, accountLevel: level }) < 2 ? 'prata' : ''
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

  async function revalidateSession(options = {}) {
    if (!getToken()) return null;
    if (backgroundValidation) return backgroundValidation;
    backgroundValidation = me({ allowCached: false })
      .catch((error) => {
        if (error.status === 401 && options.redirectOnInvalid === true && !location.pathname.startsWith('/login')) {
          const next = encodeURIComponent(location.pathname + location.search + location.hash);
          location.replace(`${CONFIG.loginPath || '/login/'}?next=${next}`);
        }
        return error.status === 401 ? null : getCachedUser();
      })
      .finally(() => {
        backgroundValidation = null;
      });
    return backgroundValidation;
  }

  async function logout() {
    try { if (getToken()) await window.PortalPWA?.detachCurrentSubscription?.(); }
    catch (_) {}
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
      avatarVersion: String(previous.avatarVersion || ''),
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
    const user = {
      ...current,
      avatarDataUrl: String(payload.avatarDataUrl || ''),
      avatarVersion: String(payload.avatarVersion || ''),
      profilePhotoLocked: false,
      profilePhotoRequiredLevel: ''
    };
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
        interfaceSoundsEnabled: Boolean(security.interfaceSoundsEnabled),
        interfaceSoundVolume: Math.min(100, Math.max(0, Number(security.interfaceSoundVolume ?? current.interfaceSoundVolume ?? 32))),
        interfaceSoundsMuted: Boolean(security.interfaceSoundsMuted),
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
    return `/seguranca/?verificar-email=1&next=${next}`;
  }

  function accessAllowed(user, allowedRoles, options = {}) {
    if (!user) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(`${CONFIG.loginPath || '/login/'}?next=${next}`);
      return false;
    }
    const securityRoute = location.pathname === '/seguranca/' || location.pathname.startsWith('/seguranca/') || location.pathname === '/conta/' || location.pathname.startsWith('/conta/');
    if (user.emailVerificationRequired && !securityRoute) {
      location.replace(verificationDestination());
      return false;
    }
    if (!roleAllowed(user, allowedRoles)) {
      location.replace(options.deniedPath || (user.role === 'cidadao' ? '/cidadao/' : CONFIG.homePath || '/'));
      return false;
    }
    return true;
  }

  async function requireRole(allowedRoles, options = {}) {
    if (CONFIG.enforcement !== true) {
      const preview = getCachedUser() || { username: 'configuracao', name: 'Modo de configuração', role: 'admin', councilRole: 'membro', preview: true };
      mountPortalAvatar(preview);
      sessionEvent('portal:session-ready', preview);
      return preview;
    }

    let user = getToken() ? getCachedUser() : null;
    if (!user) user = await me({ allowCached: false }).catch(() => null);
    if (!accessAllowed(user, allowedRoles, options)) return null;

    mountPortalAvatar(user);
    sessionEvent('portal:session-ready', user);

    if (sessionValidationAge() > SESSION_RECHECK_MS) {
      revalidateSession({ redirectOnInvalid: true }).then((fresh) => {
        if (fresh) accessAllowed(fresh, allowedRoles, options);
      });
    }
    return user;
  }

  function hasCouncilAccess(user) {
    return Boolean(user && (user.councilRole === 'membro' || user.councilRole === 'presidente'));
  }

  function authorizationHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  window.addEventListener('portal:background-refresh', () => {
    if (getToken() && getCachedUser() && sessionValidationAge() > SESSION_RECHECK_MS) {
      revalidateSession({ redirectOnInvalid: true });
    }
  });

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
    revalidateSession,
    sessionValidationAge,
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
