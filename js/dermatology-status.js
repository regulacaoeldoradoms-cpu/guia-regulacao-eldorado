'use strict';

function normalizeDermatologyStatus(value) {
  return (value ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function dermatologyStatusArray(value) {
  return Array.isArray(value) ? value : (value ? [value] : []);
}

function isDermatologyProtocol(protocol) {
  const text = normalizeDermatologyStatus(`${protocol?.id || ''} ${protocol?.nome || ''} ${dermatologyStatusArray(protocol?.tags).join(' ')}`);
  return text.includes('dermatologia') && !text.includes('reumatologia');
}

function applyDermatologyTeleconsultStatus() {
  if (typeof state === 'undefined' || !Array.isArray(state.protocols) || state.protocols.length === 0) return false;

  const protocol = state.protocols.find(isDermatologyProtocol);
  if (!protocol) return false;
  if (protocol._dermatologyTeleconsultUpdated) return true;

  protocol.sistemas = {
    ...(protocol.sistemas || {}),
    digsus: true,
    digsusStatus: 'indisponivel_local'
  };

  const currentSummary = (protocol.resumo || '').replace(/^Teleconsulta de Dermatologia indisponível no momento\.\s*/i, '');
  protocol.resumo = `Teleconsulta de Dermatologia indisponível no momento. ${currentSummary}`.trim();
  protocol.fluxoLocal = 'A teleconsulta de Dermatologia está indisponível no momento. Quando houver indicação de avaliação especializada, utilizar o fluxo presencial regulado pelo SISREG/CORE, conforme disponibilidade.';
  protocol.ultimaConferencia = '28/07/2026';
  protocol.fontes = [...new Set([...dermatologyStatusArray(protocol.fontes), 'Atualização operacional do Setor de Regulação de Eldorado/MS — 28/07/2026'])];
  protocol._dermatologyTeleconsultUpdated = true;

  if (typeof buildSearchText === 'function') protocol._searchText = buildSearchText(protocol);
  if (typeof renderList === 'function') renderList({ preserveUrl: true });
  if (state.selected?.id === protocol.id && typeof renderProtocol === 'function') renderProtocol(protocol, { preserveUrl: true });

  return true;
}

if (!applyDermatologyTeleconsultStatus()) {
  const dermatologyStatusTimer = window.setInterval(() => {
    if (applyDermatologyTeleconsultStatus()) window.clearInterval(dermatologyStatusTimer);
  }, 100);
  window.setTimeout(() => window.clearInterval(dermatologyStatusTimer), 10000);
}
