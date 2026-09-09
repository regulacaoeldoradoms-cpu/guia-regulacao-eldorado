'use strict';

(() => {
  if (window.PortalTools) return;

  const ICONS = Object.freeze({
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-4 2.4-6 5.5-6s5 2 5.5 6M17 8v6M14 11h6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/><path d="M2 19h22"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg>'
  });

  const roleLabels = Object.freeze({
    medico: 'Médico',
    recepcao: 'Recepção',
    coordenacao: 'Coordenação',
    telemedicina: 'Técnico em Telemedicina',
    admin: 'Desenvolvedor · acesso técnico',
    cidadao: 'Cidadão'
  });

  function image(src, alt = '') {
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" fetchpriority="low">`;
  }

  function authorized(user, roles) {
    if (user?.preview) return true;
    return roles.includes(user?.role);
  }

  function cardsFor(user) {
    const cards = [];
    if (!user?.preview && ['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'].includes(user?.role) && !user.emailVerified) {
      cards.push({
        id: 'email-security', href: '/conta/#seguranca', title: 'Confirme seu e-mail de segurança',
        description: 'Proteja o acesso profissional e prepare sua conta para os recursos sociais.',
        action: 'Proteger minha conta', icon: ICONS.lock, warning: true
      });
    }
    const councilOnlyCitizen = user?.role === 'cidadao' && window.RegulationAuth?.hasCouncilAccess?.(user);
    if (!user?.preview && !councilOnlyCitizen) {
      cards.push({
        id: 'citizen-channel', href: '/cidadao/', title: 'Canal do Cidadão',
        description: 'Envie manifestações ao Conselho e acompanhe seus protocolos com a mesma conta.',
        action: 'Abrir Canal do Cidadão',
        icon: image('/assets/canal-cidadao-icon.png?v=20260817-1', '')
      });
    }
    if (authorized(user, ['telemedicina', 'admin']) && !user?.preview) {
      cards.push({
        id: 'telemedicine', href: '/telemedicina/', title: 'Telemedicina',
        description: 'Acompanhe históricos, retornos e lembretes operacionais do módulo.',
        action: 'Abrir Telemedicina', icon: image('/assets/Telemedicina.png?v=20260903-1', '')
      });
    }
    if (authorized(user, ['medico', 'coordenacao', 'admin'])) {
      cards.push({
        id: 'medical-guide', href: '/medico/', title: 'Guia Médico de Encaminhamentos',
        description: 'Protocolos completos, requisitos clínicos e pré-regulação conversacional.',
        action: 'Abrir guia médico', icon: image('/assets/app-icon.svg', '')
      });
    }
    if (authorized(user, ['recepcao', 'coordenacao', 'admin'])) {
      cards.push({
        id: 'reception-check', href: '/recepcao/', title: 'Conferência da Recepção',
        description: 'Checklist operacional para protocolar solicitações com os documentos necessários.',
        action: 'Abrir conferência', icon: image('/assets/recepcao-icon.png', '')
      });
    }
    if (authorized(user, ['coordenacao', 'admin']) && !user?.preview) {
      cards.push({
        id: 'user-management', href: '/admin/usuarios/', title: 'Usuários e acessos',
        description: user?.role === 'admin' ? 'Gerencie perfis e funções institucionais.' : 'Gerencie acessos subordinados à Coordenação.',
        action: 'Gerenciar acessos', icon: ICONS.users
      });
      cards.push({
        id: 'usage-monitoring', href: '/admin/monitoramento/', title: 'Monitoramento de uso',
        description: 'Acompanhe presença, último acesso e histórico de utilização do Guia.',
        action: 'Abrir monitoramento', icon: ICONS.chart
      });
    }
    if (user?.role === 'admin' || window.RegulationAuth?.hasCouncilAccess?.(user)) {
      const description = user?.role === 'admin'
        ? 'Acesso técnico integral às manifestações e ações institucionais.'
        : user?.councilRole === 'presidente'
          ? 'Gerencie manifestações, respostas e andamento institucional.'
          : 'Consulte manifestações em modo de leitura com identidade protegida.';
      cards.push({
        id: 'council-panel', href: '/conselho/painel/', title: 'Conselho Municipal de Saúde',
        description, action: 'Abrir Conselho',
        icon: image('/assets/conselho-municipal-saude-eldorado.png?v=20260819-1', '')
      });
    }
    if (user?.role === 'admin' && !user?.preview) {
      cards.push({
        id: 'social-moderation', href: '/admin/social/', title: 'Moderação social',
        description: 'Analise denúncias e aplique medidas restritas à participação social.',
        action: 'Abrir moderação', icon: ICONS.users
      });
      cards.push({
        id: 'developer-readiness', href: '/admin/configuracao/', title: 'Configuração técnica',
        description: 'Confira integrações e flags sem exibir valores sensíveis.',
        action: 'Ver diagnóstico', icon: ICONS.settings, system: true
      });
    }
    return cards;
  }

  function cardHtml(card, compact = false) {
    const classes = ['hub-card'];
    if (card.warning) classes.push('hub-card-warning');
    if (card.system) classes.push('hub-card-system');
    if (compact) classes.push('hub-card-compact');
    return `<a class="${classes.join(' ')}" href="${card.href}" data-module="${card.id}">
      <span class="hub-card-icon" aria-hidden="true">${card.icon}</span>
      <span><h3>${card.title}</h3><p>${card.description}</p></span>
      <span class="hub-card-arrow">${card.action}</span>
    </a>`;
  }

  function render(container, user, options = {}) {
    if (!container) return [];
    const cards = cardsFor(user);
    const selected = Number.isFinite(options.limit) ? cards.slice(0, options.limit) : cards;
    container.innerHTML = selected.length
      ? selected.map((card) => cardHtml(card, Boolean(options.compact))).join('')
      : '<div class="portal-note info">Nenhuma ferramenta adicional está vinculada a este perfil.</div>';
    return selected;
  }

  window.PortalTools = Object.freeze({ cardsFor, render, roleLabels });
})();
