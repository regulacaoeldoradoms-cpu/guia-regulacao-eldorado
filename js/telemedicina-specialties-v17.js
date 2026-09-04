'use strict';

(() => {
  const button = document.getElementById('normalizeSpecialties');
  const auth = window.RegulationAuth;
  if (!button || !auth) return;

  let running = false;
  const defaultLabel = button.textContent;

  function plural(value, singular, pluralForm) {
    return `${value} ${value === 1 ? singular : pluralForm}`;
  }

  function auditMessage(audit) {
    const groups = Array.isArray(audit?.followups?.groups) ? audit.followups.groups : [];
    const lines = groups.map((group) =>
      `• ${group.previous} → ${group.canonical} (${group.count})`
    );
    const followups = Number(audit?.followups?.needsNormalization || 0);
    const events = Number(audit?.events?.needsNormalization || 0);
    return [
      'Esta operação padronizará as especialidades já registradas.',
      '',
      ...lines,
      '',
      `${plural(followups, 'acompanhamento', 'acompanhamentos')} e ${plural(events, 'evento histórico', 'eventos históricos')} serão revisados.`,
      'Quando o mesmo paciente tiver cadastros equivalentes, eles serão unificados e o acompanhamento mais recente será preservado.',
      '',
      'Deseja continuar?'
    ].join('\n');
  }

  async function readAudit() {
    return auth.api('/api/telemedicina/maintenance/specialties', { method: 'GET' });
  }

  async function run() {
    if (running) return;

    try {
      const initial = await readAudit();
      if (initial.complete) {
        window.alert('As especialidades já estão padronizadas.');
        return;
      }
      if (!window.confirm(auditMessage(initial))) return;

      running = true;
      button.disabled = true;
      let changed = 0;
      let merged = 0;
      let eventsChanged = 0;
      let attempts = 0;

      while (attempts < 1000) {
        attempts += 1;
        button.textContent = `Unificando… ${changed + eventsChanged}`;
        const batch = await auth.api('/api/telemedicina/maintenance/specialties', {
          method: 'POST',
          body: JSON.stringify({ limit: 1 })
        });
        const errors = Array.isArray(batch.errors) ? batch.errors : [];
        if (errors.length) {
          throw new Error(errors.map((item) =>
            `${item.previous} → ${item.canonical}: ${item.error}`
          ).join('\n'));
        }

        const batchChanged = Number(batch.changed || 0);
        const batchEventsChanged = Number(batch.eventsChanged || 0);
        changed += batchChanged;
        merged += Number(batch.merged || 0);
        eventsChanged += batchEventsChanged;

        if (batch.complete) break;
        if (batchChanged + batchEventsChanged === 0) {
          throw new Error('A operação não avançou. Nenhum dado adicional foi alterado.');
        }
      }

      if (attempts >= 1000) {
        throw new Error('A operação excedeu o limite seguro de lotes.');
      }

      const finalAudit = await readAudit();
      if (!finalAudit.complete) {
        throw new Error('A conferência final ainda encontrou especialidades pendentes.');
      }

      window.alert([
        'Especialidades padronizadas com sucesso.',
        `${plural(changed, 'acompanhamento corrigido', 'acompanhamentos corrigidos')}.`,
        `${plural(merged, 'duplicidade unificada', 'duplicidades unificadas')}.`,
        `${plural(eventsChanged, 'evento histórico adicional corrigido', 'eventos históricos adicionais corrigidos')}.`
      ].join('\n'));
      window.location.reload();
    } catch (error) {
      window.alert(error?.message || 'Não foi possível unificar as especialidades.');
    } finally {
      running = false;
      button.disabled = false;
      button.textContent = defaultLabel;
    }
  }

  button.addEventListener('click', run);
})();
