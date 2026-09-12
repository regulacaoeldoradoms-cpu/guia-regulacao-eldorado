'use strict';

(() => {
  if (window.PortalAccountSection) return;

  const roleLabels = Object.freeze({
    medico: 'Médico(a)',
    recepcao: 'Recepção',
    coordenacao: 'Coordenação',
    telemedicina: 'Técnico em Telemedicina',
    cidadao: 'Cidadão',
    admin: 'Desenvolvedor · Acesso Técnico'
  });

  async function mount(options = {}) {
    const auth = window.RegulationAuth;
    if (!auth) return null;
    const onSecurityRoute = location.pathname === '/seguranca/' || location.pathname.startsWith('/seguranca/');
    const user = onSecurityRoute
      ? await auth.me({ allowCached: false }).catch(() => null)
      : await auth.requireRole([]);
    if (!user) {
      if (onSecurityRoute) location.replace(`/login/?next=${encodeURIComponent(location.pathname + location.search)}`);
      return null;
    }

    if (user.mustChangePassword && !options.allowFirstAccess) {
      location.replace('/seguranca/?primeiro-acesso=1');
      return null;
    }

    const name = document.getElementById('portalUserName');
    const role = document.getElementById('portalUserRole');
    if (name) name.textContent = user.name || user.username || 'Usuário';
    if (role) {
      const council = user.councilRole ? ` · Conselho: ${user.councilRole === 'presidente' ? 'Presidente' : 'Membro'}` : '';
      role.textContent = `${roleLabels[user.role] || user.role || ''}${council}`;
    }

    const logout = document.getElementById('portalLogout');
    if (logout && logout.dataset.accountSectionBound !== 'true') {
      logout.dataset.accountSectionBound = 'true';
      logout.addEventListener('click', async () => {
        await auth.logout();
        location.replace('/login/');
      });
    }

    if (options.navigation !== false && !user.mustChangePassword) {
      let socialConfig = {};
      try { socialConfig = await window.PortalSocial?.getConfig?.() || {}; }
      catch (_) { socialConfig = {}; }
      window.PortalSocialNavigation?.mount?.(user, socialConfig);
    }

    return user;
  }

  window.PortalAccountSection = Object.freeze({ mount, roleLabels });
})();
