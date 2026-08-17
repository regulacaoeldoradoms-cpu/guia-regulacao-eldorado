'use strict';

(() => {
  if (window.__REGULATION_PROTOCOL_SOURCE_RESILIENCE__) return;

  const COMMIT = '3c09e13f343ddb4995910d02b349fb164dc08256';
  const REPOSITORY = 'regulacaoeldoradoms-cpu/guia-regulacao-eldorado';
  const LOCAL_SOURCE = '/data/protocol-source.html';
  const RAW_SOURCE = `https://raw.githubusercontent.com/${REPOSITORY}/${COMMIT}/index.html`;
  const CDN_SOURCE = `https://cdn.jsdelivr.net/gh/${REPOSITORY}@${COMMIT}/index.html`;
  const API_SOURCE = `https://api.github.com/repos/${REPOSITORY}/contents/index.html?ref=${COMMIT}`;
  const CACHE_KEY = `regulacao.protocol-source.${COMMIT}`;
  const nativeFetch = window.fetch.bind(window);

  function requestedUrl(input) {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.href;
    return input?.url || '';
  }

  function isProtocolRequest(input) {
    const requested = String(requestedUrl(input) || '');
    if (requested.startsWith(RAW_SOURCE)) return true;
    try {
      const url = new URL(requested, window.location.origin);
      return url.origin === window.location.origin && url.pathname === LOCAL_SOURCE;
    } catch (_) {
      return false;
    }
  }

  function validSource(text) {
    return typeof text === 'string' && text.includes('const PROTOCOLOS') && text.includes('const FOOTER_IMG');
  }

  function cachedSource() {
    try {
      const text = localStorage.getItem(CACHE_KEY) || '';
      return validSource(text) ? text : '';
    } catch (_) {
      return '';
    }
  }

  function saveSource(text) {
    if (!validSource(text)) return;
    try { localStorage.setItem(CACHE_KEY, text); }
    catch (_) {}
  }

  function sourceResponse(text, source) {
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Regulation-Protocol-Source': source
      }
    });
  }

  async function fetchWithTimeout(url, init = {}, timeoutMs = 9000) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await nativeFetch(url, { ...init, cache: 'no-store', signal: controller.signal });
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function tryTextSource(url, label, timeoutMs = 9000) {
    const response = await fetchWithTimeout(url, { headers: { Accept: 'text/html,*/*;q=0.8' } }, timeoutMs);
    if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
    const text = await response.text();
    if (!validSource(text)) throw new Error(`${label}: conteúdo inválido`);
    saveSource(text);
    return sourceResponse(text, label);
  }

  async function tryGitHubApi() {
    const response = await fetchWithTimeout(API_SOURCE, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response.ok) throw new Error(`GitHub API: HTTP ${response.status}`);
    const payload = await response.json();
    const encoded = String(payload?.content || '').replace(/\s+/g, '');
    if (!encoded) throw new Error('GitHub API: arquivo sem conteúdo');

    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    const text = new TextDecoder('utf-8').decode(bytes);
    if (!validSource(text)) throw new Error('GitHub API: conteúdo inválido');
    saveSource(text);
    return sourceResponse(text, 'github-api');
  }

  async function resilientProtocolFetch() {
    const failures = [];

    try {
      return await tryTextSource(LOCAL_SOURCE, 'site-local', 5000);
    } catch (error) {
      failures.push(error?.message || String(error));
    }

    const cached = cachedSource();
    if (cached) return sourceResponse(cached, 'browser-cache');

    for (const candidate of [
      () => tryTextSource(CDN_SOURCE, 'jsdelivr'),
      () => tryTextSource(RAW_SOURCE, 'github-raw'),
      () => tryGitHubApi()
    ]) {
      try {
        return await candidate();
      } catch (error) {
        failures.push(error?.message || String(error));
      }
    }

    throw new TypeError(`Não foi possível carregar a base de protocolos. Fontes tentadas: ${failures.join(' | ')}`);
  }

  window.fetch = function regulationProtocolSourceFetch(input, init = {}) {
    if (!isProtocolRequest(input)) return nativeFetch(input, init);
    return resilientProtocolFetch();
  };

  Object.defineProperty(window, '__REGULATION_PROTOCOL_SOURCE_RESILIENCE__', {
    value: true,
    enumerable: false
  });
})();
