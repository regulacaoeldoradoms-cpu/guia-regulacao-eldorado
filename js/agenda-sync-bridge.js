'use strict';

(async () => {
  const DIGSAUDE_ORIGIN = 'https://teleatendimento.saude.ms.gov.br';
  const auth = window.RegulationAuth;
  const status = document.getElementById('syncBridgeStatus');
  const agendaLink = document.getElementById('syncBridgeAgendaLink');

  const user = await auth.requireRole(['telemedicina'], { deniedPath: '/ferramentas/' });
  if (!user) return;

  let busy = false;
  let activeSyncId = '';
  let lastSyncId = '';
  let lastResult = null;

  status.textContent = 'Sincronização automática conectada. Mantenha esta janela aberta; você pode minimizá-la.';

  function reply(message) {
    try {
      if (window.opener && !window.opener.closed) window.opener.postMessage(message, DIGSAUDE_ORIGIN);
    } catch (_) {}
  }

  window.addEventListener('message', async (event) => {
    if (event.origin !== DIGSAUDE_ORIGIN) return;
    if (event.source !== window.opener) return;
    if (event.data?.type !== 'PORTAL_AGENDA_DIGSAUDE_SYNC') return;

    const syncId = String(event.data?.syncId || '').trim();
    const snapshot = event.data?.snapshot;

    if (!syncId || !snapshot || !Array.isArray(snapshot.records)) {
      status.textContent = 'O DigSaúde enviou uma estrutura inválida.';
      reply({
        type: 'PORTAL_AGENDA_DIGSAUDE_RESULT',
        syncId,
        ok: false,
        error: 'Estrutura inválida.'
      });
      return;
    }

    if (syncId === lastSyncId && lastResult) {
      reply(lastResult);
      return;
    }

    if (busy) return;

    busy = true;
    activeSyncId = syncId;
    status.textContent = `Sincronizando ${snapshot.records.length} agendamento(s)…`;

    try {
      const result = await auth.api('/api/agenda/sync', {
        method: 'POST',
        body: JSON.stringify({
          records: snapshot.records,
          totalCount: snapshot.totalCount,
          complete: snapshot.complete === true,
          capturedAt: snapshot.capturedAt
        })
      });

      const message = {
        type: 'PORTAL_AGENDA_DIGSAUDE_RESULT',
        syncId,
        ok: true,
        created: Number(result.created || 0),
        changed: Number(result.changed || 0),
        unchanged: Number(result.unchanged || 0),
        deactivated: Number(result.deactivated || 0),
        complete: result.complete === true
      };

      lastSyncId = syncId;
      lastResult = message;
      status.textContent = `Automático ativo · última sincronização: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${message.created} novo(s), ${message.changed} alterado(s).`;
      agendaLink.hidden = false;
      reply(message);
    } catch (error) {
      const message = {
        type: 'PORTAL_AGENDA_DIGSAUDE_RESULT',
        syncId,
        ok: false,
        error: 'Falha na sincronização.'
      };
      lastSyncId = syncId;
      lastResult = message;
      status.textContent = error.message || 'Não foi possível sincronizar a Agenda. A próxima tentativa automática poderá tentar novamente.';
      agendaLink.hidden = false;
      reply(message);
    } finally {
      if (activeSyncId === syncId) activeSyncId = '';
      busy = false;
    }
  });

  reply({ type: 'PORTAL_AGENDA_DIGSAUDE_READY' });
})();