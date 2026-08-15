'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['medico', 'recepcao', 'coordenacao']);
  if (!user) return;

  if (user.mustChangePassword) {
    location.replace('/conta/?primeiro-acesso=1');
    return;
  }

  const name = document.getElementById('portalUserName');
  const role = document.getElementById('portalUserRole');
  const grid = document.getElementById('hubGrid');
  const logout = document.getElementById('portalLogout');
  const roleLabels = {
    medico: 'Médico',
    recepcao: 'Recepção',
    coordenacao: 'Coordenação',
    admin: 'Desenvolvedor · acesso técnico'
  };

  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) role.textContent = user.preview ? 'modo de configuração' : (roleLabels[user.role] || user.role);

  const cards = [];
  if (['medico', 'coordenacao', 'admin'].includes(user.role) || user.preview) {
    cards.push(`
      <a class="hub-card" href="/medico/" data-module="medical-guide">
        <span class="hub-card-icon"><img src="/assets/app-icon.svg" alt=""></span>
        <span><h3>Guia Médico de Encaminhamentos</h3><p>Protocolos completos, requisitos clínicos e pré-regulação conversacional com Gemini.</p></span>
        <span class="hub-card-arrow">Abrir guia médico →</span>
      </a>`);
  }

  if (['recepcao', 'coordenacao', 'admin'].includes(user.role) || user.preview) {
    cards.push(`
      <a class="hub-card" href="/recepcao/" data-module="reception-check">
        <span class="hub-card-icon"><img src="/assets/recepcao-icon.png" alt="Ícone da Conferência da Recepção"></span>
        <span><h3>Conferência da Recepção</h3><p>Checklist operacional de documentos, relatórios, laudos, imagens e exames necessários para protocolar solicitações.</p></span>
        <span class="hub-card-arrow">Abrir conferência →</span>
      </a>`);
  }

  if (['coordenacao', 'admin'].includes(user.role) && !user.preview) {
    cards.push(`
      <a class="hub-card" href="/admin/usuarios/" data-module="user-management">
        <span class="hub-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-4 2.4-6 5.5-6s5 2 5.5 6M17 8v6M14 11h6"/></svg></span>
        <span><h3>Usuários e acessos</h3><p>${user.role === 'admin' ? 'Gerencie perfis do portal e funções institucionais.' : 'Gerencie acessos de médicos e recepção subordinados à Coordenação.'}</p></span>
        <span class="hub-card-arrow">Gerenciar acessos →</span>
      </a>`);

    cards.push(`
      <a class="hub-card" href="/admin/monitoramento/" data-module="usage-monitoring">
        <span class="hub-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/><path d="M2 19h22"/></svg></span>
        <span><h3>Monitoramento de uso</h3><p>Acompanhe médicos online, último acesso e histórico de utilização do Guia.</p></span>
        <span class="hub-card-arrow">Abrir monitoramento →</span>
      </a>`);
  }

  if (auth.hasCouncilAccess(user)) {
    cards.push(`
      <a class="hub-card" href="/conselho/painel/" data-module="council-panel">
        <span class="hub-card-icon" aria-hidden="true">🏛️</span>
        <span><h3>Conselho Municipal de Saúde</h3><p>${user.councilRole === 'presidente' ? 'Gerencie manifestações, respostas e andamento institucional.' : 'Acompanhe manifestações e registre observações internas do Conselho.'}</p></span>
        <span class="hub-card-arrow">Abrir Conselho →</span>
      </a>`);
  }

  if (user.role === 'admin' && !user.preview) {
    cards.push(`
      <section class="hub-card hub-card-system" data-module="developer-access" aria-label="Acesso de desenvolvimento">
        <span class="hub-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg></span>
        <span><h3>Perfil de Desenvolvimento</h3><p>Administração técnica do Portal da Regulação. Esse nível não é utilizado para funções de coordenação.</p></span>
        <span class="hub-card-arrow">Acesso técnico</span>
      </section>`);
  }

  grid.innerHTML = cards.join('');
  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();
