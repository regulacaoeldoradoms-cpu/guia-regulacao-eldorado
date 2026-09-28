'use strict';

// Tempo da aula visível, não medida de atenção. Sem armazenamento local ou XP.
(() => {
  const MAX_SECONDS = 21600;
  const MAX_SAMPLE_GAP_MS = 5000;
  const SAVE_EVERY_MS = 30000;

  function createAccumulator(now = () => performance.now()) {
    let last = now(), milliseconds = 0, running = false, stopped = false;
    function sample() {
      const current = now();
      const delta = current - last;
      // Suspensão do navegador não vira uma longa sessão fictícia.
      if (!stopped && running && Number.isFinite(delta) && delta >= 0 && delta <= MAX_SAMPLE_GAP_MS) {
        milliseconds = Math.min(MAX_SECONDS * 1000, milliseconds + delta);
      }
      last = current;
      return Math.floor(milliseconds / 1000);
    }
    return Object.freeze({
      sample,
      setRunning(value) { sample(); running = !stopped && value === true; },
      stop() { const seconds = sample(); stopped = true; running = false; return seconds; }
    });
  }

  function format(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function create({ root, send, now = () => performance.now() } = {}) {
    if (!root || typeof send !== 'function') return null;
    const doc = root.ownerDocument;
    const win = doc.defaultView;
    const find = id => root.querySelector(`#${id}`);
    const timer = find('studyTimer'), stateLabel = find('studyTimerStatus');
    const syncLabel = find('studyTimeSync'), button = find('pauseStudy');
    if (!timer || !stateLabel || !syncLabel || !button) return null;
    let current = null, pageHidden = false;

    function paint(record) {
      if (record !== current || record.closed) return;
      timer.textContent = format(record.clock.sample());
      button.disabled = record.ended;
      button.textContent = record.paused ? 'Retomar tempo' : 'Pausar tempo';
      button.setAttribute('aria-pressed', String(record.paused));
      stateLabel.textContent = record.ended ? 'Sessão encerrada' : record.paused ? 'Pausado por você'
        : (doc.hidden || pageHidden) ? 'Pausado em segundo plano' : 'Contando com a aula visível';
      syncLabel.textContent = !record.supported ? 'Salvamento parcial indisponível nesta versão do servidor.'
        : record.error ? 'Tempo ainda não confirmado. Nova tentativa na próxima sincronização.'
        : record.busy ? 'Salvando tempo…'
        : record.saved > 0 ? `Tempo salvo até ${format(record.saved)}` : 'Salvamento periódico a cada 30 s';
    }

    async function sendWithTimeout(record, seconds) {
      let timeout;
      try {
        return await Promise.race([
          Promise.resolve().then(() => send(record.id, seconds)),
          new Promise((_, reject) => { timeout = win.setTimeout(() => reject(new Error('Tempo sem confirmação')), 10000); })
        ]);
      } finally { win.clearTimeout(timeout); }
    }

    function flush(record = current) {
      if (!record || record.closed || record.ended || !record.supported) return Promise.resolve(false);
      record.wanted = Math.max(record.wanted, record.clock.sample());
      if (record.busy) return record.busy;
      if (record.wanted <= record.saved) return Promise.resolve(true);
      record.busy = (async () => {
        try {
          // Coalesce novas amostras sem enviar incrementos que seriam duplicados.
          while (!record.closed && !record.ended && record.wanted > record.saved) {
            const sent = record.wanted;
            const receipt = await sendWithTimeout(record, sent);
            if (!receipt || receipt.checkpointed !== true || receipt.timeProtocol !== 1
              || receipt.sessionId !== record.id || !Number.isInteger(receipt.durationSeconds)
              || receipt.durationSeconds < 0 || receipt.durationSeconds > MAX_SECONDS) {
              throw new Error('Confirmação de tempo inválida');
            }
            record.saved = Math.max(record.saved, receipt.durationSeconds);
            record.error = false;
            if (receipt.finished) { record.ended = true; record.clock.setRunning(false); }
            // Um limite do servidor não deve provocar repetição infinita.
            if (record.saved < sent) { record.error = true; break; }
          }
          return !record.error;
        } catch (_) { record.error = true; return false; }
        finally { record.busy = null; paint(record); }
      })();
      paint(record);
      return record.busy;
    }

    function visibilityChanged() {
      const record = current;
      if (!record || record.closed) return;
      record.clock.setRunning(!record.paused && !record.ended && !doc.hidden && !pageHidden);
      paint(record);
      // Melhor esforço com autenticação normal. Não promete envio ao encerrar o app.
      void flush(record);
    }

    function pause(value) {
      const record = current;
      if (!record || record.closed || record.ended) return;
      record.paused = value === true;
      visibilityChanged();
    }

    function stop() {
      if (!current) return { durationSeconds: 0, savedSeconds: 0 };
      const record = current;
      const durationSeconds = record.clock.stop();
      record.closed = true;
      win.clearInterval(record.interval);
      current = null;
      button.disabled = true;
      return { durationSeconds, savedSeconds: record.saved, sessionId: record.id };
    }

    function reset() {
      stop();
      timer.textContent = '00:00';
      stateLabel.textContent = 'Aguardando início da sessão';
      syncLabel.textContent = '';
      button.textContent = 'Pausar tempo';
      button.setAttribute('aria-pressed', 'false');
      button.disabled = true;
    }

    function start(sessionId, supported = false) {
      reset();
      if (typeof sessionId !== 'string' || !sessionId) return false;
      const record = { id: sessionId, clock: createAccumulator(now), supported: supported === true,
        paused: false, closed: false, ended: false, saved: 0, wanted: 0, busy: null, error: false,
        lastSave: now(), interval: null };
      current = record;
      record.clock.setRunning(!doc.hidden && !pageHidden);
      record.interval = win.setInterval(() => {
        if (record !== current || record.closed) return;
        record.clock.sample();
        paint(record);
        if (now() - record.lastSave >= SAVE_EVERY_MS) {
          record.lastSave = now();
          void flush(record);
        }
      }, 1000);
      paint(record);
      return true;
    }

    button.addEventListener('click', () => { if (current) pause(!current.paused); });
    doc.addEventListener('visibilitychange', visibilityChanged);
    win.addEventListener('pagehide', () => { pageHidden = true; visibilityChanged(); });
    win.addEventListener('pageshow', () => { pageHidden = false; visibilityChanged(); });
    win.addEventListener('online', () => { void flush(); });
    reset();
    return Object.freeze({ start, stop, reset, pause, flush,
      snapshot: () => ({ sessionId: current?.id || '', durationSeconds: current?.clock.sample() || 0,
        savedSeconds: current?.saved || 0, paused: current?.paused || false }) });
  }

  window.StudyClock = Object.freeze({ create, createAccumulator });
})();
