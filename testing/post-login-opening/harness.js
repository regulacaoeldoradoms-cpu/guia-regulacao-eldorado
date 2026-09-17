'use strict';

window.REGULATION_AUTH_CONFIG = { homePath: '/opening/complete.html' };
window.__LAB_LOGIN_CALLS__ = 0;
window.__LAB_WARMED__ = false;

window.RegulationAuth = {
  enforcementEnabled: true,
  getToken: () => '',
  getCachedUser: () => null,
  sessionValidationAge: () => 999999,
  me: async () => null,
  async login(username, password) {
    window.__LAB_LOGIN_CALLS__ += 1;
    if (!String(username || '').trim() || !String(password || '').trim()) {
      const error = new Error('Credenciais fictícias obrigatórias.');
      error.status = 400;
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 80));
    return {
      name: 'Usuário fictício',
      username: 'usuario.teste',
      role: 'admin',
      preview: true,
      mustChangePassword: false,
      emailVerificationRequired: false
    };
  }
};

window.PortalPerformance = {
  warmForUser() {
    window.__LAB_WARMED__ = true;
    return Promise.resolve(true);
  }
};
