'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['medico', 'recepcao', 'admin']);
  if (!user) return;

  if (user.mustChangePassword) {
    location.replace('/conta/?primeiro-acesso=1');
    return;
  }

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const grid = document.getElementById('hubGrid');
  const logout = document.getElementById('portalLogout');
  const userBar = logout?.parentElement;

  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) {
    role.textContent = user.preview
      ? 'modo de configuração'
      : ({ medico: 'Médico', recepcao: 'Recepção', admin: 'Desenvolvedor · acesso total' }[user.role] || user.role);
  }

  if (userBar && !document.getElementById('portalAccountLink')) {
    const account = document.createElement('a');
    account.id = 'portalAccountLink';
    account.className = 'portal-button ghost';
    account.href = '/conta/';
    account.style.textDecoration = 'none';
    account.textContent = 'Minha conta';
    userBar.insertBefore(account, logout);
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
        <span class="hub-card-icon">
          <img src="/assets/recepcao-icon.png" alt="Ícone da Conferência da Recepção">
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
      <a class="hub-card" href="/admin/usuarios/" data-module="user-management">
        <span class="hub-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-4 2.4-6 5.5-6s5 2 5.5 6M17 8v6M14 11h6"/></svg>
        </span>
        <span>
          <h3>Usuários e acessos</h3>
          <p>Crie contas, defina o perfil profissional, desative acessos e redefina senhas sem usar o painel da Cloudflare.</p>
        </span>
        <span class="hub-card-arrow">Gerenciar acessos →</span>
      </a>`);

    cards.push(`
      <section class="hub-card hub-card-system" data-module="developer-access" aria-label="Acesso de desenvolvimento">
        <span class="hub-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>
        </span>
        <span>
          <h3>Perfil de Desenvolvimento</h3>
          <p>Conta com acesso integral aos módulos atuais e futuros do Portal da Regulação.</p>
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