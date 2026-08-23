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

/*
 * Contas criadas especificamente para o Conselho não pertencem ao Canal do Cidadão.
 * O redirecionamento é feito já no início do carregamento para impedir que Presidente
 * ou Membro visualizem a tela de registro/acompanhamento de manifestações pessoais.
 *
 * Perfis profissionais que também acumulam função no Conselho continuam livres para
 * usar os demais módulos do Portal; esta regra vale apenas para contas-base "cidadao"
 * vinculadas institucionalmente ao Conselho.
 */
(() => {
  if (!location.pathname.startsWith('/cidadao')) return;

  const config = window.REGULATION_AUTH_CONFIG || {};
  const userKey = config.userStorageKey || 'regulacao.portal.user';
  let user = null;

  try {
    const raw = sessionStorage.getItem(userKey) || localStorage.getItem(userKey);
    user = raw ? JSON.parse(raw) : null;
  } catch (_) {
    user = null;
  }

  const exclusiveCouncilAccount = user?.role === 'cidadao'
    && (user?.councilRole === 'presidente' || user?.councilRole === 'membro');

  if (exclusiveCouncilAccount) {
    location.replace('/conselho/painel/');
  }
})();