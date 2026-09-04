'use strict';

(() => {
  const button = document.getElementById('normalizeSpecialties');
  const auth = window.RegulationAuth;
  if (!button || !auth) return;

  let running = false;
  const defaultLabel = button.textContent;
  const TRANSIENT_RETRY_LIMIT = 5;
  const RETRY_BASE_DELAY_MS = 800;
  const BATCH_PAUSE_MS = 120;

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

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function isTransientError(error) {
    const status = Number(error?.status || 0);
    if (status) return status === 408 || status === 425 || status === 429 || status >= 500;
    const message = String(error?.message || '');
    return error?.name === 'TypeError'
      || error?.name === 'AbortError'
      || /failed to fetch|network error|networkerror|load failed/i.test(message);
  }

  async function withTransientRetry(operation, onRetry) {
    let lastError = null;
    for (let attempt = 0; attempt <= TRANSIENT_RETRY_LIMIT; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (!isTransientError(error) || attempt === TRANSIENT_RETRY_LIMIT) throw error;
        const delay = Math.min(8000, RETRY_BASE_DELAY_MS * (2 ** attempt));
        if (typeof onRetry === 'function') onRetry(attempt + 1, delay);
        await wait(delay);
      }
    }
    throw lastError || new Error('Não foi possível concluir a comunicação com o portal.');
  }

  async function readAudit(onRetry) {
    return withTransientRetry(
      () => auth.api('/api/telemedicina/maintenance/specialties', { method: 'GET' }),
      onRetry
    );
  }

  async function runBatch(onRetry) {
    return withTransientRetry(
      () => auth.api('/api/telemedicina/maintenance/specialties', {
        method: 'POST',
        body: '{}'
      }),
      onRetry
    );
  }

  async function run() {
    if (running) return;

    let changed = 0;
    let merged = 0;
    let eventsChanged = 0;

    try {
      running = true;
      button.disabled = true;
      button.textContent = 'Conferindo…';

      const showReconnect = (attempt) => {
        button.textContent = `Reconectando… ${attempt}/${TRANSIENT_RETRY_LIMIT}`;
      };
      const initial = await readAudit(showReconnect);
      if (initial.complete) {
        window.alert('As especialidades já estão padronizadas.');
        return;
      }
      if (!window.confirm(auditMessage(initial))) return;

      let attempts = 0;
      let completed = false;
      const totalDocuments = Number(initial?.followups?.total || 0)
        + Number(initial?.events?.total || 0);
      const safetyLimit = Math.max(200, totalDocuments + 100);

      while (attempts < safetyLimit) {
        attempts += 1;
        button.textContent = `Unificando… ${changed + eventsChanged}`;
        const batch = await runBatch(showReconnect);
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

        if (batch.complete) {
          completed = true;
          break;
        }
        if (batchChanged + batchEventsChanged === 0) {
          throw new Error('A operação não avançou. Nenhum dado adicional foi alterado.');
        }
        await wait(BATCH_PAUSE_MS);
      }

      if (!completed) {
        throw new Error('A operação excedeu o limite seguro de lotes.');
      }

      button.textContent = 'Conferindo resultado…';
      const finalAudit = await readAudit(showReconnect);
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
      if (isTransientError(error)) {
        const completed = changed + eventsChanged;
        window.alert([
          'A conexão foi interrompida, mas nenhuma alteração concluída foi perdida.',
          completed ? `${plural(completed, 'registro concluído nesta tentativa', 'registros concluídos nesta tentativa')}.` : '',
          'Atualize a página e toque em “Unificar especialidades” para continuar exatamente dos registros restantes.'
        ].filter(Boolean).join('\n\n'));
      } else {
        window.alert(error?.message || 'Não foi possível unificar as especialidades.');
      }
    } finally {
      running = false;
      button.disabled = false;
      button.textContent = defaultLabel;
    }
  }

  button.addEventListener('click', run);
})();
