'use strict';
// Session memory only. An authorized foreground read always precedes disclosure.
(() => {
  window.createCouncilDetailCache = ({request, valid, canPrefetch = () => true, onDenied = () => {}}) => {
    const entries = new Map(), background = new Map(), foreground = new Map(), failures = new Map();
    const limit = 8, byteLimit = 1024 * 1024, ttl = 30_000;
    let queue = [], bytes = 0, enabled = false, closed = false, timer = null, epoch = 0;
    const path = protocol => '/api/council/manifestations/' + encodeURIComponent(protocol);
    const usable = () => !closed && valid();
    const remove = protocol => { const entry = entries.get(protocol); if (entry) bytes -= entry.bytes; entries.delete(protocol); };
    const remember = (protocol, payload) => {
      remove(protocol);
      if (!payload?.detailRevision || payload.manifestation?.protocol !== protocol) return;
      const size = new TextEncoder().encode(JSON.stringify(payload)).byteLength;
      if (size > byteLimit) return;
      while (entries.size >= limit || bytes + size > byteLimit) remove(entries.keys().next().value);
      entries.set(protocol, {payload, bytes:size, at:Date.now()}); bytes += size;
    };
    const schedule = () => {
      if (timer || !enabled || !usable()) return;
      timer = setTimeout(() => { timer = null; pump(); }, 80);
    };
    const pump = () => {
      if (!enabled || !usable() || foreground.size || !canPrefetch()) return;
      while (background.size < 2 && queue.length) {
        const protocol = queue.shift(), entry = entries.get(protocol);
        if (background.has(protocol) || (entry && Date.now() - entry.at < ttl) || Date.now() - (failures.get(protocol) || 0) < ttl) continue;
        const controller = new AbortController(), generation = epoch;
        background.set(protocol, controller);
        request(path(protocol) + '?prefetch=1', {method:'GET', signal:controller.signal})
          .then(payload => { if (usable() && generation === epoch && !controller.signal.aborted) remember(protocol, payload); })
          .catch(error => {
            if (generation !== epoch || controller.signal.aborted) return;
            failures.set(protocol, Date.now());
            if (error.status === 401 || error.status === 403) { clear(); enabled = false; onDenied(error); }
          })
          .finally(() => { if (background.get(protocol) === controller) background.delete(protocol); schedule(); });
      }
    };
    const clear = () => {
      epoch++;
      for (const controller of background.values()) controller.abort();
      for (const flight of foreground.values()) flight.controller.abort();
      background.clear(); foreground.clear(); entries.clear(); failures.clear(); queue = []; bytes = 0;
      clearTimeout(timer); timer = null;
    };
    return {
      enable(value) { enabled = value === true; if (enabled) schedule(); else clear(); },
      prioritize(protocols) {
        if (!usable()) return;
        queue = [...new Set(protocols)].filter(value => /^CMS-\d{4}-\d{6}$/.test(value)).slice(0, limit);
        for (const [key, controller] of background) if (!queue.includes(key)) { controller.abort(); background.delete(key); }
        // Forget far-away cooldowns as well as payloads: even navigation through
        // many thousands of cases cannot grow session maps without a bound.
        for (const key of failures.keys()) if (!queue.includes(key)) failures.delete(key);
        schedule();
      },
      async open(protocol) {
        if (!usable()) throw new DOMException('Sessão encerrada.', 'AbortError');
        if (foreground.has(protocol)) return foreground.get(protocol).promise;
        // Opening never waits behind speculative downloads, including its own.
        for (const controller of background.values()) controller.abort();
        background.clear();
        const cached = entries.get(protocol), controller = new AbortController(), generation = epoch;
        const revision = cached?.payload.detailRevision;
        const promise = request(path(protocol) + (revision ? '?' + new URLSearchParams({cacheRevision:revision}) : ''), {method:'GET', signal:controller.signal})
          .then(payload => {
            if (!usable() || generation !== epoch || controller.signal.aborted) throw new DOMException('Sessão alterada.', 'AbortError');
            if (payload?.notModified) {
              if (!cached || payload.detailRevision !== revision || payload.protocol !== protocol) throw new Error('A manifestação precisa ser consultada novamente.');
              entries.delete(protocol); entries.set(protocol, cached); cached.at = Date.now();
              return cached.payload;
            }
            if (payload?.manifestation?.protocol !== protocol) throw new Error('O servidor retornou outra manifestação.');
            remember(protocol, payload); return payload;
          })
          .catch(error => { if (generation === epoch && !controller.signal.aborted) { remove(protocol); if (error.status === 401 || error.status === 403) { clear(); onDenied(error); } } throw error; })
          .finally(() => { if (foreground.get(protocol)?.controller === controller) foreground.delete(protocol); schedule(); });
        foreground.set(protocol, {promise, controller});
        return promise;
      },
      cancelOpening() { for (const flight of foreground.values()) flight.controller.abort(); foreground.clear(); schedule(); },
      invalidate(protocol) { remove(protocol); failures.delete(protocol); },
      clear,
      close() { clear(); closed = true; },
      resume:schedule
    };
  };
})();
