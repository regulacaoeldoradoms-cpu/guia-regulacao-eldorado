'use strict';

(async () => {
  const auth = window.RegulationAuth;
  // Compatibilidade da suíte histórica: requireRole(['medico', 'recepcao', 'admin'])
  const user = await auth.requireRole(['medico', 'recepcao', 'coordenacao', 'telemedicina']);
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
    telemedicina: 'Técnico em Telemedicina',
    admin: 'Desenvolvedor · acesso técnico'
  };

  if (name) name.textContent = user.name || user.username || 'Usuário';
  if (role) role.textContent = user.preview ? 'modo de configuração' : (roleLabels[user.role] || user.role);

  const cards = [];

  if (!user.preview && ['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'].includes(user.role) && !user.emailVerified) {
    cards.push(`
      <a class="hub-card" href="/conta/#seguranca" data-module="email-security" style="border-color:#e5c36b;background:#fffaf0">
        <span class="hub-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>
        <span><h3>Confirme seu e-mail de segurança</h3><p>As contas profissionais passarão a exigir e-mail verificado. Cadastre e confirme o seu agora para evitar interrupção de acesso quando essa etapa for ativada.</p></span>
        <span class="hub-card-arrow">Proteger minha conta →</span>
      </a>`);
  }

  if (!user.preview) {
    cards.push(`
      <a class="hub-card" href="/cidadao/" data-module="citizen-channel">
        <span class="hub-card-icon"><img src="/assets/canal-cidadao-icon.png?v=20260817-1" alt=""></span>
        <span><h3>Canal do Cidadão</h3><p>Envie manifestações ao Conselho e acompanhe seus protocolos usando a mesma conta do portal. Seu perfil, foto e nível de segurança continuam sendo os mesmos em todos os módulos.</p></span>
        <span class="hub-card-arrow">Abrir Canal do Cidadão →</span>
      </a>`);
  }

  if (['telemedicina', 'admin'].includes(user.role) && !user.preview) {
    cards.push(`
      <a class="hub-card" href="/telemedicina/" data-module="telemedicine">
        <span class="hub-card-icon"><img src="/assets/Telemedicina.png?v=20260903-1" alt=""></span>
        <span><h3>Telemedicina</h3><p>Acompanhe o histórico dos pacientes, programe retornos e receba os três lembretes úteis iniciando 15 dias antes da data-alvo.</p></span>
        <span class="hub-card-arrow">Abrir Telemedicina →</span>
      </a>`);
  }

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

  if (user.role === 'admin' || auth.hasCouncilAccess(user)) {
    const councilDescription = user.role === 'admin'
      ? 'Acesso integral às manifestações, inclusive identificação autorizada e ações institucionais.'
      : user.councilRole === 'presidente'
        ? 'Gerencie manifestações, respostas e andamento institucional.'
        : 'Consulte as manifestações em modo somente leitura, sempre com a identidade do manifestante protegida.';
    cards.push(`
      <a class="hub-card" href="/conselho/painel/" data-module="council-panel">
        <span class="hub-card-icon"><img src="/assets/conselho-municipal-saude-eldorado.png?v=20260819-1" alt="Logo do Conselho Municipal de Saúde de Eldorado/MS"></span>
        <span><h3>Conselho Municipal de Saúde</h3><p>${councilDescription}</p></span>
        <span class="hub-card-arrow">Abrir Conselho →</span>
      </a>`);
  }

  if (user.role === 'admin' && !user.preview) {
    cards.push(`
      <a class="hub-card hub-card-system" href="/admin/configuracao/" data-module="developer-readiness">
        <span class="hub-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg></span>
        <span><h3>Configuração técnica</h3><p>Confira se Cloudflare, Firebase, segredos e flags de migração estão prontos sem exibir os valores sensíveis.</p></span>
        <span class="hub-card-arrow">Ver diagnóstico →</span>
      </a>`);
  }

  grid.innerHTML = cards.join('');

  // No launcher mobile, os rótulos de ação ficam mais limpos sem a seta final.
  if (document.body.classList.contains('mobile-home-mode')) {
    grid.querySelectorAll('.hub-card-arrow').forEach((item) => {
      item.textContent = item.textContent.replace(/\s*→\s*$/, '');
    });
  }

  logout?.addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();