'use strict';

// Private metadata lives only in this tab. Every reuse requires a live access check.
(() => {
  function create({ getSession, request, onClear = () => {}, now = Date.now,
    ttlMs = 20000, maxEntries = 12, maxItems = 200 }) {
    const entries = new Map();
    const pending = new Map();
    let scope = getSession();
    let generation = 0;
    let accessPending = null;
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const stale = () => Object.assign(new Error('A leitura pertence a uma sessão ou navegação anterior.'),
      { code: 'DOCUMENTS_STALE_READ' });
    const stable = (value) => JSON.stringify(value, (_, item) => {
      if (!item || Array.isArray(item) || typeof item !== 'object') return item;
      return Object.fromEntries(Object.keys(item).sort().map((key) => [key, item[key]]));
    });
    const keyFor = (path, options) => path + '\u0000' + stable(JSON.parse(options.body || '{}'));

    function clear(reason = 'mutation') {
      generation += 1;
      entries.clear();
      pending.clear();
      accessPending = null;
      onClear(reason);
    }

    function syncSession() {
      const next = getSession();
      if (scope !== next) {
        scope = next;
        clear('session');
      }
      return scope;
    }

    function context() {
      return { scope: syncSession(), generation };
    }

    function isCurrent(ticket) {
      return Boolean(ticket && syncSession() && ticket.scope === scope && ticket.generation === generation);
    }

    function assertCurrent(ticket) {
      if (!isCurrent(ticket)) throw stale();
    }

    function canView(access) {
      return access?.capabilities?.view === true && access?.drive?.connected === true;
    }

    async function authorize() {
      const ticket = context();
      if (!ticket.scope) throw stale();
      if (accessPending) return accessPending;
      const operation = (async () => {
        try {
          const access = await request('/api/documents/access', { method: 'GET' });
          assertCurrent(ticket);
          if (!canView(access)) {
            clear('denied');
            return { ...context(), access };
          }
          return { ...ticket, access };
        } catch (error) {
          if (isCurrent(ticket)) clear('access-error');
          throw error;
        }
      })();
      accessPending = operation;
      try { return await operation; }
      finally { if (accessPending === operation) accessPending = null; }
    }

    function requireView(ticket) {
      assertCurrent(ticket);
      if (!canView(ticket.access)) throw Object.assign(new Error('Acesso documental indisponível.'),
        { status: 403, code: 'DOCUMENTS_ACCESS_DENIED' });
    }

    function put(key, payload, ageMs = 0) {
      if (!Array.isArray(payload?.items) || payload.items.length > maxItems || ageMs >= ttlMs) return;
      const expiresAt = now() + ttlMs - Math.max(0, ageMs);
      entries.delete(key);
      entries.set(key, { payload: clone(payload), expiresAt });
      let count = [...entries.values()].reduce((sum, entry) => sum + entry.payload.items.length, 0);
      while (entries.size > maxEntries || count > maxItems) {
        const oldest = entries.keys().next().value;
        count -= entries.get(oldest).payload.items.length;
        entries.delete(oldest);
      }
    }

    function seed(path, options, payload, ticket, ageMs = 0) {
      requireView(ticket);
      put(keyFor(path, options), payload, ageMs);
    }

    async function read(path, options, { ticket = null, force = false } = {}) {
      if (!['/api/documents/drive/list', '/api/documents/drive/search'].includes(path)) {
        throw new TypeError('Somente listagens e pesquisas podem ser reutilizadas.');
      }
      const gate = ticket || await authorize();
      requireView(gate);
      const key = keyFor(path, options);
      const entry = entries.get(key);
      if (!force && entry && entry.expiresAt > now()) {
        entries.delete(key);
        entries.set(key, entry);
        return { ...clone(entry.payload), timing: {}, navigationCacheState: 'hit', navigationExpiresAt: entry.expiresAt };
      }
      if (entry && entry.expiresAt <= now()) entries.delete(key);
      if (pending.has(key)) return pending.get(key);
      const operation = (async () => {
        try {
          const payload = await request(path, options);
          assertCurrent(gate);
          put(key, payload);
          return { ...clone(payload), navigationCacheState: 'miss', navigationExpiresAt: now() + ttlMs };
        } catch (error) {
          if (isCurrent(gate) && [401, 403].includes(Number(error.status))) clear('denied');
          throw error;
        }
      })();
      pending.set(key, operation);
      try { return await operation; }
      finally { if (pending.get(key) === operation) pending.delete(key); }
    }

    return Object.freeze({ authorize, read, seed, clear, syncSession, context, isCurrent, assertCurrent, ttlMs });
  }

  window.PortalDocumentNavigation = Object.freeze({ create });
})();
