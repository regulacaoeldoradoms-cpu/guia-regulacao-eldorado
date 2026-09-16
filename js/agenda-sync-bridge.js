'use strict';

(async () => {
  const DIGSAUDE_ORIGIN = 'https://teleatendimento.saude.ms.gov.br';
  const auth = window.RegulationAuth;
  const status = document.getElementById('syncBridgeStatus');
  const agendaLink = document.getElementById('syncBridgeAgendaLink');

  const user = await auth.requireRole(['telemedicina'], { deniedPath: '/ferramentas/' });
  if (!user) return;

  let busy = false;
  let completed = false;
  status.textContent = 'Aguardando os agendamentos enviados pelo DigSaúde…';

  function reply(message) {
    try {
      if (window.opener && !window.opener.closed) window.opener.postMessage(message, DIGSAUDE_ORIGIN);
    } catch (_) {}
  }

  window.addEventListener('message', async (event) => {
    if (event.origin !== DIGSAUDE_ORIGIN) return;
    if (event.source !== window.opener) return;
    if (event.data?.type !== 'PORTAL_AGENDA_DIGSAUDE_SYNC') return;
    if (busy || completed) return;

    const snapshot = event.data?.snapshot;
    if (!snapshot || !Array.isArray(snapshot.records)) {
      status.textContent = 'O DigSaúde enviou uma estrutura inválida.';
      reply({ type: 'PORTAL_AGENDA_DIGSAUDE_RESULT', ok: false, error: 'Estrutura inválida.' });
      return;
    }

    busy = true;
    status.textContent = `Sincronizando ${snapshot.records.length} agendamentos…`;
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
      completed = true;
      status.textContent = `Agenda atualizada: ${result.created || 0} novo(s), ${result.changed || 0} alterado(s) e ${result.unchanged || 0} sem mudança.`;
      agendaLink.hidden = false;
      reply({
        type: 'PORTAL_AGENDA_DIGSAUDE_RESULT',
        ok: true,
        created: Number(result.created || 0),
        changed: Number(result.changed || 0),
        unchanged: Number(result.unchanged || 0),
        deactivated: Number(result.deactivated || 0),
        complete: result.complete === true
      });
      window.setTimeout(() => {
        try {
          if (window.opener && !window.opener.closed) window.close();
        } catch (_) {}
      }, 1800);
    } catch (error) {
      status.textContent = error.message || 'Não foi possível sincronizar a Agenda.';
      agendaLink.hidden = false;
      reply({ type: 'PORTAL_AGENDA_DIGSAUDE_RESULT', ok: false, error: 'Falha na sincronização.' });
    } finally {
      busy = false;
    }
  });

  reply({ type: 'PORTAL_AGENDA_DIGSAUDE_READY' });
})();
