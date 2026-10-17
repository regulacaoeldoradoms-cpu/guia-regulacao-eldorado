(() => {
'use strict';

const initializeCitizenArea = (context) => {
  const window = context?.window || globalThis;
  const document = context?.document || globalThis.document;
  const auth = window.RegulationAuth;
  const levels = window.AccountLevels;
  if (!auth || !levels) return;
  const compact = globalThis.matchMedia('screen and (max-width: 900px)').matches;
  let pendingRender = false;
  let lastRender = 0;
  let lastAccountState = '', pendingAccountState = '', renderAgain = false;
  const token = auth.getToken();
  const accountState = user => JSON.stringify([user?.id,user?.username,user?.role,user?.jobTitle,user?.councilRole,levels.levelFor(user),user?.emailVerified,user?.privacyMode]);

  const roleLabels = {
    medico: 'Médico(a)', recepcao: 'Recepção', coordenacao: 'Coordenação', admin: 'Desenvolvedor', cidadao: 'Cidadão'
  };

  async function resolvedUser() {
    let user = auth.getCachedUser();
    try {
      await auth.getSecurity();
      user = await auth.me({ allowCached: false }) || user;
    } catch (_) {}
    return user;
  }

  function syncIdentity(user) {
    const roleNode = document.getElementById('portalUserRole');
    if (roleNode) {
      const role = roleLabels[user.role] || user.role || 'Usuário';
      const job = user.role !== 'cidadao' && user.jobTitle ? ` · ${user.jobTitle}` : '';
      const council = user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : '';
      roleNode.textContent = `${role}${job}${council}`;
    }

    const createButton = document.getElementById('openNewManifestation');
    if (createButton && user.councilRole === 'presidente') {
      createButton.hidden = true;
      createButton.disabled = true;
    }
  }

  async function render(options = {}) {
    if (context?.disposed || auth.getToken() !== token) return;
    const cachedState = accountState(auth.getCachedUser());
    if (compact && pendingRender) { if (cachedState !== pendingAccountState) renderAgain = true; return; }
    if (compact && options.force !== true && cachedState === lastAccountState && Date.now() - lastRender < 30000) return;
    pendingRender = true;
    pendingAccountState = cachedState;
    try {
      const user = await resolvedUser();
      if (!user || context?.disposed || auth.getToken() !== token) return;
      lastRender = Date.now();
      lastAccountState = accountState(user);

      const badge = document.getElementById('accountLevelBadge');
      const notice = document.getElementById('accountEvolutionNotice');
      const actionText = document.getElementById('accountActionText');
      const actionTitle = document.getElementById('accountActionTitle');
      const meta = levels.metaFor(user);

      syncIdentity(user);

      if (badge) {
        badge.hidden = false;
        levels.renderMiniBadge(badge, user);
      }
      if (actionTitle) actionTitle.textContent = 'Segurança da conta';
      if (actionText) {
        actionText.textContent = meta.level === 'bronze'
          ? 'Conta Bronze: confirme o e-mail para avançar ao Prata.'
          : meta.level === 'prata'
            ? 'Conta Prata: e-mail de segurança confirmado.'
            : 'Conta Ouro: nível máximo de proteção.';
      }

      if (!notice) return;
      notice.hidden = false;
      notice.innerHTML = meta.level === 'bronze'
        ? '<strong>Sua conta está no nível Bronze.</strong> Você pode usar o Canal do Cidadão. Sem e-mail verificado, novas manifestações são registradas como anônimas; após a confirmação, você poderá escolher entre envio sigiloso ou identificado.'
        : meta.level === 'prata'
          ? '<strong>Conta Prata.</strong> Seu e-mail de segurança está confirmado. Em cada nova manifestação, você pode manter sua identidade sigilosa ou optar por se identificar ao Conselho. O endereço de e-mail continua protegido.'
          : '<strong>Conta Ouro.</strong> Sua conta atingiu o nível máximo de proteção previsto no portal.';
    } finally {
      pendingRender = false;
      if (renderAgain) { renderAgain = false; void render({force:true}); }
    }
  }

  const initialRender = render();
  if (!compact) {
    window.setTimeout(render, 0);
    window.setTimeout(render, 500);
  } else {
    // Returning to this area fetches fresh account data. Session authorization
    // is owned by auth; prewarming other areas also emits session-ready.
    window.addEventListener('portal:citizen-route', render);
  }
  window.addEventListener('pageshow', render);
  return initialRender;
};
if (window.PortalCitizenShell) window.PortalCitizenShell.register('citizen-account-level', initializeCitizenArea);
else initializeCitizenArea();
})();
