'use strict';

(async () => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  let user = auth.getCachedUser?.() || null;
  if (!user) user = await auth.me({ allowCached: true }).catch(() => null);
  if (!user) return;

  const brands = {
    cidadao: {
      icon: '/assets/canal-cidadao-icon.png',
      type: 'image/png',
      subtitle: 'Canal do Cidadão · Conselho Municipal de Saúde · Eldorado/MS',
      title: 'Minha conta | Canal do Cidadão'
    },
    medico: {
      icon: '/assets/app-icon.svg',
      type: 'image/svg+xml',
      subtitle: 'Guia Médico de Encaminhamentos · Eldorado/MS',
      title: 'Minha conta | Guia Médico'
    },
    recepcao: {
      icon: '/assets/recepcao-icon.png',
      type: 'image/png',
      subtitle: 'Conferência da Recepção · Portal da Regulação · Eldorado/MS',
      title: 'Minha conta | Recepção'
    },
    coordenacao: {
      icon: '/assets/portal-regulacao-header.png',
      type: 'image/png',
      subtitle: 'Portal da Regulação de Saúde · Eldorado/MS',
      title: 'Minha conta | Portal da Regulação'
    },
    admin: {
      icon: '/assets/portal-regulacao-header.png',
      type: 'image/png',
      subtitle: 'Portal da Regulação de Saúde · Eldorado/MS',
      title: 'Minha conta | Portal da Regulação'
    }
  };

  const brand = brands[user.role] || brands.admin;
  const icon = document.getElementById('accountBrandIcon');
  const subtitle = document.getElementById('accountBrandSubtitle');
  const favicon = document.getElementById('accountFavicon') || document.querySelector('link[rel="icon"]');

  if (icon) {
    icon.src = brand.icon;
    icon.alt = user.role === 'cidadao'
      ? 'Canal do Cidadão'
      : user.role === 'medico'
        ? 'Guia Médico de Encaminhamentos'
        : user.role === 'recepcao'
          ? 'Recepção'
          : 'Portal da Regulação de Saúde';
    icon.style.objectFit = 'contain';
  }

  if (subtitle) subtitle.textContent = brand.subtitle;
  if (favicon) {
    favicon.href = brand.icon;
    favicon.type = brand.type;
  }
  document.title = brand.title;
  document.documentElement.dataset.accountRole = user.role || '';
})();
