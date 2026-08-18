'use strict';

(async () => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const user = await auth.me({ allowCached: false }).catch(() => auth.getCachedUser());
  if (!user || user.councilRole !== 'presidente') return;

  const createButton = document.getElementById('openNewManifestation');
  if (createButton) {
    createButton.hidden = true;
    createButton.disabled = true;
  }

  const notice = document.getElementById('citizenContextNotice');
  if (notice) {
    notice.innerHTML = '<strong>Presidência do Conselho:</strong> esta conta pode acompanhar manifestações próprias já existentes, mas não pode abrir uma nova manifestação enquanto estiver exercendo a função de Presidente do Conselho.';
    notice.hidden = false;
  }
})();
