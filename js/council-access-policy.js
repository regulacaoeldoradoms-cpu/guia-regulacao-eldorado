'use strict';

(() => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const originalMe = typeof auth.me === 'function' ? auth.me.bind(auth) : null;
  const originalHasCouncilAccess = typeof auth.hasCouncilAccess === 'function'
    ? auth.hasCouncilAccess.bind(auth)
    : null;

  // Dentro do painel institucional, o Desenvolvedor recebe acesso integral
  // sem precisar acumular formalmente o cargo de Presidente do Conselho.
  if (originalMe) {
    auth.me = async (...args) => {
      const user = await originalMe(...args);
      if (user?.role === 'admin' && user.councilRole !== 'presidente') {
        return { ...user, councilRole: 'presidente', developerCouncilOverride: true };
      }
      return user;
    };
  }

  auth.hasCouncilAccess = (user) => Boolean(
    user?.role === 'admin'
    || (originalHasCouncilAccess ? originalHasCouncilAccess(user) : ['membro', 'presidente'].includes(user?.councilRole))
  );

  function attachmentHeading() {
    const list = document.getElementById('attachmentList');
    if (!list) return null;
    let node = list.previousElementSibling;
    while (node) {
      if (node.matches?.('.detail-section-title')) return node;
      node = node.previousElementSibling;
    }
    return null;
  }

  function ensureMemberNotice() {
    if (document.getElementById('councilMemberReadOnlyNotice')) return;
    const hero = document.querySelector('.portal-hero');
    if (!hero?.parentNode) return;
    const notice = document.createElement('div');
    notice.id = 'councilMemberReadOnlyNotice';
    notice.className = 'portal-note info';
    notice.style.marginTop = '12px';
    notice.style.fontSize = '1rem';
    notice.style.lineHeight = '1.55';
    notice.innerHTML = '<strong>Acesso de leitura.</strong> Como Membro do Conselho, você pode consultar o conteúdo e o histórico das manifestações. Para este perfil, todas as manifestações são apresentadas como anônimas: nome, @, cargo e demais dados de identidade do manifestante não são exibidos. O membro também não pode responder, alterar status, registrar observações internas ou acessar anexos.';
    hero.insertAdjacentElement('afterend', notice);
  }

  function applyMemberUi() {
    document.body.classList.add('council-member-readonly');

    const userRole = document.getElementById('portalUserRole');
    if (userRole) userRole.textContent = 'Membro do Conselho · somente leitura';
    const badge = document.getElementById('councilRoleBadge');
    if (badge) {
      badge.classList.remove('is-president-image');
      badge.textContent = 'Membro · somente leitura';
      badge.removeAttribute('aria-label');
    }
    const heroText = document.querySelector('.portal-hero-copy p');
    if (heroText) {
      heroText.textContent = 'Consulte o conteúdo e acompanhe o histórico das manifestações. Para membros, todas as manifestações são apresentadas como anônimas e não há permissão para responder ou alterar o andamento.';
    }
    ensureMemberNotice();

    document.querySelectorAll('.president-only').forEach((element) => {
      element.hidden = true;
      element.style.display = 'none';
    });

    const side = document.querySelector('#detailContent .council-side');
    if (side) {
      side.hidden = true;
      side.style.display = 'none';
    }
    const detailGrid = document.getElementById('detailContent');
    if (detailGrid) detailGrid.style.gridTemplateColumns = 'minmax(0, 1fr)';

    const privacy = document.getElementById('detailPrivacy');
    if (privacy) {
      privacy.textContent = 'Anônima';
      privacy.classList.remove('identified');
    }
    const identity = document.getElementById('detailIdentity');
    if (identity) {
      identity.textContent = 'Manifestante anônimo';
      identity.classList.remove('identified');
    }

    const list = document.getElementById('attachmentList');
    const heading = attachmentHeading();
    if (heading) heading.textContent = 'Anexos protegidos';
    if (list) {
      list.hidden = true;
      list.style.display = 'none';
      if (!document.getElementById('memberAttachmentRestriction')) {
        const note = document.createElement('div');
        note.id = 'memberAttachmentRestriction';
        note.className = 'portal-note info';
        note.style.margin = '6px 0 18px';
        note.textContent = 'Os anexos não são exibidos para membros, pois podem conter dados capazes de identificar o manifestante.';
        list.insertAdjacentElement('afterend', note);
      }
    }
  }

  function applyDeveloperUi() {
    document.body.classList.add('council-developer-access');
    const userRole = document.getElementById('portalUserRole');
    if (userRole) userRole.textContent = 'Desenvolvedor · acesso integral ao Conselho';
    const badge = document.getElementById('councilRoleBadge');
    if (badge) {
      badge.classList.remove('is-president-image');
      badge.textContent = 'Desenvolvedor';
      badge.removeAttribute('aria-label');
    }
  }

  async function applyPolicyUi() {
    if (!originalMe) return;
    const realUser = await originalMe({ allowCached: false }).catch(() => null);
    if (!realUser) return;

    if (realUser.role === 'admin') {
      applyDeveloperUi();
      return;
    }
    if (realUser.councilRole === 'membro') {
      applyMemberUi();
    }
  }

  if (document.readyState === 'complete') applyPolicyUi();
  else window.addEventListener('load', applyPolicyUi, { once: true });
})();