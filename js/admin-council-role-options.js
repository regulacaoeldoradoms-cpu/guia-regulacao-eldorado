'use strict';

(async () => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const currentUser = await auth.me({ allowCached: false }).catch(() => null);
  if (!currentUser || currentUser.role !== 'admin') return;

  const VIRTUAL_COUNCIL_ROLES = Object.freeze({
    conselho_presidente: {
      role: 'cidadao',
      councilRole: 'presidente',
      label: 'Presidente do Conselho — gestão completa das manifestações',
      defaultJobTitle: 'Presidente do Conselho Municipal de Saúde'
    },
    conselho_membro: {
      role: 'cidadao',
      councilRole: 'membro',
      label: 'Membro do Conselho — leitura protegida das manifestações',
      defaultJobTitle: 'Membro do Conselho Municipal de Saúde'
    }
  });

  const newRole = document.getElementById('newRole');
  const newCouncilWrap = document.getElementById('newCouncilWrap');
  const newCouncilRole = document.getElementById('newCouncilRole');
  const newJobTitle = document.getElementById('newJobTitle');
  const createForm = document.getElementById('createUserForm');

  const editRole = document.getElementById('editRole');
  const editCouncilWrap = document.getElementById('editCouncilWrap');
  const editCouncilRole = document.getElementById('editCouncilRole');
  const editJobTitle = document.getElementById('editJobTitle');
  const editForm = document.getElementById('editUserForm');
  const usersList = document.getElementById('usersList');

  function addCouncilOptions(select) {
    if (!select || select.querySelector('option[value="conselho_presidente"]')) return;

    const group = document.createElement('optgroup');
    group.label = 'Conselho Municipal de Saúde';

    Object.entries(VIRTUAL_COUNCIL_ROLES).forEach(([value, config]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = config.label;
      group.appendChild(option);
    });

    select.appendChild(group);
  }

  function isVirtualCouncilRole(value) {
    return Object.prototype.hasOwnProperty.call(VIRTUAL_COUNCIL_ROLES, value);
  }

  function syncCreateCouncilUi() {
    if (!newRole) return;
    const config = VIRTUAL_COUNCIL_ROLES[newRole.value];

    if (config) {
      if (newCouncilRole) newCouncilRole.value = config.councilRole;
      if (newCouncilWrap) newCouncilWrap.hidden = true;
      if (newJobTitle && !newJobTitle.value.trim()) newJobTitle.placeholder = config.defaultJobTitle;
      return;
    }

    if (newCouncilWrap) newCouncilWrap.hidden = false;
    if (newJobTitle) newJobTitle.placeholder = 'ex.: Médica ESF Centro';
  }

  function syncEditCouncilUi() {
    if (!editRole) return;
    const config = VIRTUAL_COUNCIL_ROLES[editRole.value];

    if (config) {
      if (editCouncilRole) editCouncilRole.value = config.councilRole;
      if (editCouncilWrap) editCouncilWrap.hidden = true;
      return;
    }

    if (editCouncilWrap) editCouncilWrap.hidden = false;
  }

  function mapVirtualSelection(select, councilSelect, jobTitleInput) {
    if (!select) return;
    const config = VIRTUAL_COUNCIL_ROLES[select.value];
    if (!config) return;

    select.value = config.role;
    if (councilSelect) councilSelect.value = config.councilRole;
    if (jobTitleInput && !jobTitleInput.value.trim()) jobTitleInput.value = config.defaultJobTitle;
  }

  function selectedCouncilRoleFromRow(row) {
    if (!row) return '';
    const badges = [...row.querySelectorAll('.user-badge')].map((item) => item.textContent.trim());
    if (badges.includes('Presidente do Conselho') && badges.includes('Cidadão')) return 'conselho_presidente';
    if (badges.includes('Membro do Conselho') && badges.includes('Cidadão')) return 'conselho_membro';
    return '';
  }

  addCouncilOptions(newRole);
  syncCreateCouncilUi();

  const profileLabel = document.querySelector('label[for="newRole"]');
  if (profileLabel) profileLabel.textContent = 'Perfil de acesso / função';

  const councilHelp = document.createElement('div');
  councilHelp.className = 'password-meter';
  councilHelp.style.marginTop = '7px';
  councilHelp.textContent = 'Presidente e Membro do Conselho podem ser criados diretamente nesta lista. Essas permissões só podem ser concedidas pelo Desenvolvedor.';
  newRole?.insertAdjacentElement('afterend', councilHelp);

  newRole?.addEventListener('change', syncCreateCouncilUi);

  createForm?.addEventListener('submit', () => {
    mapVirtualSelection(newRole, newCouncilRole, newJobTitle);
  }, true);

  usersList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="edit"]');
    const row = event.target.closest('[data-username]');
    if (!button || !row) return;

    const virtualRole = selectedCouncilRoleFromRow(row);
    setTimeout(() => {
      addCouncilOptions(editRole);
      if (virtualRole && editRole) editRole.value = virtualRole;
      syncEditCouncilUi();
    }, 0);
  }, true);

  editRole?.addEventListener('change', syncEditCouncilUi);

  editForm?.addEventListener('submit', () => {
    mapVirtualSelection(editRole, editCouncilRole, editJobTitle);
  }, true);

  // O script principal recria as opções do campo de edição a cada abertura.
  // Mantemos as funções do Conselho presentes mesmo após essa reconstrução.
  if (editRole) {
    const observer = new MutationObserver(() => {
      if (!editRole.querySelector('option[value="conselho_presidente"]')) addCouncilOptions(editRole);
    });
    observer.observe(editRole, { childList: true });
  }
})();
