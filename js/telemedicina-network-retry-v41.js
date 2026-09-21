'use strict';

(() => {
  const DASHBOARD_PATH = '/api/telemedicina/dashboard';
  const DEFAULT_RETRY_DELAYS_MS = Object.freeze([350, 900]);

  function isTransientNetworkError(error) {
    if (!error) return false;
    if (Number(error.status || 0) > 0) return false;

    const name = String(error.name || '');
    const message = String(error.message || '');
    if (name !== 'TypeError') return false;

    return /failed to fetch|network\s*error|networkerror|load failed|fetch failed/i.test(message);
  }

  function safeDelays(delays) {
    const source = Array.isArray(delays) ? delays : DEFAULT_RETRY_DELAYS_MS;
    return source.slice(0, 2).map((value) => Math.min(2000, Math.max(0, Number(value) || 0)));
  }

  async function wait(ms) {
    if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function withNetworkRetry(operation, options = {}) {
    if (typeof operation !== 'function') throw new TypeError('Operação de leitura inválida.');
    const delays = safeDelays(options.delaysMs);
    let lastError = null;

    for (let attempt = 0; attempt <= delays.length; attempt += 1) {
      try {
        return await operation(attempt + 1);
      } catch (error) {
        lastError = error;
        if (!isTransientNetworkError(error) || attempt >= delays.length) throw error;
        await wait(delays[attempt]);
      }
    }

    throw lastError || new Error('Falha temporária de rede.');
  }

  async function readDashboard(auth, options = {}) {
    if (!auth || typeof auth.api !== 'function') {
      throw new TypeError('Cliente de autenticação indisponível.');
    }

    return withNetworkRetry(
      () => auth.api(DASHBOARD_PATH, { method: 'GET' }),
      options
    );
  }

  window.TelemedicineNetworkRetry = Object.freeze({
    dashboardPath: DASHBOARD_PATH,
    retryDelaysMs: DEFAULT_RETRY_DELAYS_MS,
    isTransientNetworkError,
    withNetworkRetry,
    readDashboard
  });
})();
