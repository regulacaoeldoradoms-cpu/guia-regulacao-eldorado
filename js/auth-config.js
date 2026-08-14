'use strict';

// Compatibilidade com validações legadas: enforcement: false era usado durante a fase de configuração.
window.REGULATION_AUTH_CONFIG = Object.freeze({
  endpoint: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev',
  enforcement: true,
  tokenStorageKey: 'regulacao.portal.session',
  userStorageKey: 'regulacao.portal.user',
  loginPath: '/login/',
  homePath: '/'
});