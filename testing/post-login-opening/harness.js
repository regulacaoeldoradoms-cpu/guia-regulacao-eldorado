'use strict';

window.__PORTAL_POST_LOGIN_OPENING_PENDING__ = true;

document.body?.classList.add('post-login-opening-pending');

window.RegulationAuth = {
  requireRole: async () => ({
    name: 'Usuário fictício',
    username: 'usuario.ficticio',
    role: 'admin',
    preview: true,
    mustChangePassword: false
  }),
  logout: async () => {}
};

window.PortalSocial = {
  getConfig() {
    return new Promise(() => {});
  }
};

window.PortalSocialNavigation = { mount() {} };
window.PortalSocialHome = { mount: async () => {} };
window.PortalTools = {
  roleLabels: { admin: 'Desenvolvedor' },
  render() {}
};
