'use strict';

(async () => {
  const DIGSAUDE_ORIGIN = 'https://teleatendimento.saude.ms.gov.br';
  const CONTACT_CAPABILITY = 'patient-details-v2';
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

  async function loadContactState() {
    try {
      const state = await auth.api('/api/agenda/contact-state', { method: 'GET' });
      const contactCapability = state?.contactCapability === CONTACT_CAPABILITY ? CONTACT_CAPABILITY : '';
      return {
        contactCapability,
        active: Number(state?.active || 0),
        known: Number(state?.known || 0),
        missing: Number(state?.missing || 0),
        knownSourceIds: contactCapability && Array.isArray(state?.knownSourceIds)
          ? state.knownSourceIds.map((value) => String(value || '')).filter(Boolean)
          : []
      };
    } catch (_) {
      return { contactCapability: '', active: 0, known: 0, missing: 0, knownSourceIds: [] };
    }
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

    if (busy) return;

    busy = true;
    activeSyncId = syncId;
    status.textContent = `Sincronizando ${snapshot.records.length} agendamento(s)…`;

    try {
      const before = await loadContactState();
      if (before.contactCapability !== CONTACT_CAPABILITY) {
        lastSyncId = '';
        lastResult = null;
        throw new Error('O Portal precisa confirmar a atualização dos contatos antes de sincronizar.');
      }
      if (syncId === lastSyncId && lastResult) {
        reply(lastResult);
        return;
      }
      const result = await auth.api('/api/agenda/sync', {
        method: 'POST',
        body: JSON.stringify({
          records: snapshot.records,
          totalCount: snapshot.totalCount,
          complete: snapshot.complete === true,
          capturedAt: snapshot.capturedAt
        })
      });
      if (result?.contactCapability !== CONTACT_CAPABILITY) {
        throw new Error('A atualização dos contatos não foi confirmada pelo Portal.');
      }
      const contactState = await loadContactState();
      if (contactState.contactCapability !== CONTACT_CAPABILITY) {
        throw new Error('A atualização dos contatos não foi confirmada pelo Portal.');
      }
      const message = {
        contactCapability: CONTACT_CAPABILITY,
        type: 'PORTAL_AGENDA_DIGSAUDE_RESULT',
        syncId,
        ok: true,
        created: Number(result.created || 0),
        changed: Number(result.changed || 0),
        unchanged: Number(result.unchanged || 0),
        deactivated: Number(result.deactivated || 0),
        phoneReceived: Number(result.phoneReceived || 0),
        received: Number(result.received || 0),
        complete: result.complete === true,
        contactsAvailable: contactState.known,
        contactsMissing: contactState.missing,
        knownSourceIds: contactState.knownSourceIds
      };

      lastSyncId = syncId;
      lastResult = message;
      status.textContent = `Automático ativo · ${message.contactsAvailable}/${message.contactsAvailable + message.contactsMissing} contato(s) disponíveis · última sincronização: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
      agendaLink.hidden = false;
      reply(message);
    } catch (error) {
      const message = {
        contactCapability: '',
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

  const initialContactState = await loadContactState();
  if (!initialContactState.contactCapability) {
    status.textContent = 'O Portal precisa confirmar a atualização dos contatos antes de sincronizar.';
  }
  reply({
    contactCapability: initialContactState.contactCapability,
    type: 'PORTAL_AGENDA_DIGSAUDE_READY',
    contactsAvailable: initialContactState.known,
    contactsMissing: initialContactState.missing,
    knownSourceIds: initialContactState.knownSourceIds
  });
})();
