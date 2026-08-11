'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['medico', 'recepcao', 'admin']);
  if (!user) return;

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const grid = document.getElementById('hubGrid');
  const logout = document.getElementById('portalLogout');

  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) {
    role.textContent = user.preview
      ? 'modo de configuração'
      : ({ medico: 'Médico', recepcao: 'Recepção', admin: 'Desenvolvedor · acesso total' }[user.role] || user.role);
  }

  const cards = [];
  if (user.role === 'medico' || user.role === 'admin' || user.preview) {
    cards.push(`
      <a class="hub-card" href="/" data-module="medical-guide">
        <span class="hub-card-icon"><img src="/assets/app-icon.svg" alt=""></span>
        <span>
          <h3>Guia Médico de Encaminhamentos</h3>
          <p>Protocolos completos, requisitos clínicos e pré-regulação conversacional com Gemini.</p>
        </span>
        <span class="hub-card-arrow">Abrir guia médico →</span>
      </a>`);
  }

  if (user.role === 'recepcao' || user.role === 'admin' || user.preview) {
    cards.push(`
      <a class="hub-card" href="/recepcao/" data-module="reception-check">
        <span class="hub-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h5M8 18h4"/></svg>
        </span>
        <span>
          <h3>Conferência da Recepção</h3>
          <p>Checklist operacional de documentos, relatórios, laudos, imagens e exames que o paciente precisa apresentar.</p>
        </span>
        <span class="hub-card-arrow">Abrir conferência →</span>
      </a>`);
  }

  if (user.role === 'admin' && !user.preview) {
    cards.push(`
      <section class="hub-card hub-card-system" data-module="developer-access" aria-label="Acesso de desenvolvimento">
        <span class="hub-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>
        </span>
        <span>
          <h3>Perfil de Desenvolvimento</h3>
          <p>Conta com acesso integral aos módulos existentes e preparada para receber automaticamente novos módulos administrativos no HUB.</p>
        </span>
        <span class="hub-card-arrow">Acesso total</span>
      </section>`);
  }

  grid.innerHTML = cards.join('');
  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();