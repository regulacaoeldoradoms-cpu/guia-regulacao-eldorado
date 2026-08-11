'use strict';

(() => {
  if (window.__REGULATION_AUTH_FETCH_BRIDGE__) return;
  const aiEndpoint = String(window.REGULATION_AI_CONFIG?.endpoint || '');
  if (!aiEndpoint) return;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = function authenticatedPortalFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url;
    if (url !== aiEndpoint) return nativeFetch(input, init);
    const token = window.RegulationAuth?.getToken?.();
    if (!token) return nativeFetch(input, init);
    const headers = new Headers(init.headers || (typeof input !== 'string' ? input?.headers : undefined) || {});
    headers.set('Authorization', `Bearer ${token}`);
    return nativeFetch(input, { ...init, headers });
  };

  Object.defineProperty(window, '__REGULATION_AUTH_FETCH_BRIDGE__', { value: true, enumerable: false });
})();
