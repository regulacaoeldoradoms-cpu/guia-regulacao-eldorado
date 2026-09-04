'use strict';

(async () => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const currentUser = await auth.me({ allowCached: false }).catch(() => null);
  if (!currentUser || currentUser.role !== 'admin') return;

  const VICE_OFFICE = 'vice_presidente';
  const VIRTUAL_COUNCIL_ROLES = Object.freeze({
    conselho_presidente: {
      role: 'cidadao',
      councilRole: 'presidente',
      label: 'Presidente do Conselho — gestão completa das manifestações',
      defaultJobTitle: 'Presidente do Conselho Municipal de Saúde'
    },
    conselho_vice_presidente: {
      role: 'cidadao',
      councilRole: VICE_OFFICE,
      label: 'Vice-Presidente do Conselho — leitura anônima, como Membro',
      defaultJobTitle: 'Vice-Presidente do Conselho Municipal de Saúde'
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
  let viceUsernames = new Set();
  let refreshTimer = 0;

  function ensureViceCouncilOption(select) {
    if (!select || select.querySelector(`option[value="${VICE_OFFICE}"]`)) return;
    const option = document.createElement('option');
    option.value = VICE_OFFICE;
    option.textContent = 'Vice-Presidente do Conselho';
    const president = select.querySelector('option[value="presidente"]');
    if (president?.nextSibling) select.insertBefore(option, president.nextSibling);
    else select.appendChild(option);
  }

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

  function syncCouncilSelectOptions() {
    ensureViceCouncilOption(newCouncilRole);
    ensureViceCouncilOption(editCouncilRole);
  }

  function syncCreateCouncilUi() {
    if (!newRole) return;
    syncCouncilSelectOptions();
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
    syncCouncilSelectOptions();
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
    if (badges.includes('Vice-Presidente do Conselho') && badges.includes('Cidadão')) return 'conselho_vice_presidente';
    if (badges.includes('Membro do Conselho') && badges.includes('Cidadão')) return 'conselho_membro';
    return '';
  }

  function decorateViceRows() {
    if (!usersList) return;
    usersList.querySelectorAll('[data-username]').forEach((row) => {
      const username = String(row.dataset.username || '').trim().toLowerCase();
      if (!viceUsernames.has(username)) return;
      const badge = [...row.querySelectorAll('.user-badge')]
        .find((item) => item.textContent.trim() === 'Membro do Conselho');
      if (badge && badge.textContent !== 'Vice-Presidente do Conselho') {
        badge.textContent = 'Vice-Presidente do Conselho';
      }
    });
  }

  async function refreshViceUsers() {
    const users = await auth.listUsers().catch(() => []);
    viceUsernames = new Set(users
      .filter((user) => user.councilOffice === VICE_OFFICE)
      .map((user) => String(user.username || '').trim().toLowerCase())
      .filter(Boolean));
    decorateViceRows();
  }

  function scheduleViceRefresh() {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(refreshViceUsers, 80);
  }

  addCouncilOptions(newRole);
  syncCouncilSelectOptions();
  syncCreateCouncilUi();

  const profileLabel = document.querySelector('label[for="newRole"]');
  if (profileLabel) profileLabel.textContent = 'Perfil de acesso / função';

  const councilHelp = document.createElement('div');
  councilHelp.className = 'password-meter';
  councilHelp.style.marginTop = '7px';
  councilHelp.textContent = 'Presidente, Vice-Presidente e Membro do Conselho podem ser criados diretamente nesta lista. O Vice-Presidente usa as mesmas permissões de leitura anônima do Membro: não vê identidade, anexos ou observações internas e não pode interagir. Essas funções só podem ser concedidas pelo Desenvolvedor.';
  newRole?.insertAdjacentElement('afterend', councilHelp);

  newRole?.addEventListener('change', syncCreateCouncilUi);

  createForm?.addEventListener('submit', () => {
    mapVirtualSelection(newRole, newCouncilRole, newJobTitle);
  }, true);

  usersList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="edit"]');
    const row = event.target.closest('[data-username]');
    if (!button || !row) return;

    const username = String(row.dataset.username || '').trim().toLowerCase();
    const isVice = viceUsernames.has(username);
    const virtualRole = selectedCouncilRoleFromRow(row);
    setTimeout(() => {
      addCouncilOptions(editRole);
      syncCouncilSelectOptions();
      if (virtualRole && editRole) {
        editRole.value = virtualRole;
      } else if (isVice && editCouncilRole) {
        editCouncilRole.value = VICE_OFFICE;
      }
      syncEditCouncilUi();
    }, 0);
  }, true);

  editRole?.addEventListener('change', syncEditCouncilUi);

  editForm?.addEventListener('submit', () => {
    mapVirtualSelection(editRole, editCouncilRole, editJobTitle);
  }, true);

  if (editRole) {
    const observer = new MutationObserver(() => {
      if (!editRole.querySelector('option[value="conselho_presidente"]')) addCouncilOptions(editRole);
      syncCouncilSelectOptions();
    });
    observer.observe(editRole, { childList: true });
  }

  if (usersList) {
    const observer = new MutationObserver(scheduleViceRefresh);
    observer.observe(usersList, { childList: true, subtree: true });
  }

  await refreshViceUsers();
})();
