'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['admin'], { deniedPath: '/' });
  if (!user || user.role !== 'admin') return;

  const byId = (id) => document.getElementById(id);
  const task = byId('jevTask');
  const evaluate = byId('jevEvaluate');
  const clear = byId('jevClear');
  const copy = byId('jevCopy');
  const status = byId('jevStatus');
  const results = byId('jevResults');
  const prompt = byId('jevPrompt');

  byId('portalUserName').textContent = user.name || user.username;

  const labels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    critical: 'Crítica',
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Full stack',
    infrastructure: 'Infraestrutura',
    xhigh: 'Extra alto'
  };

  function label(value) {
    return labels[value] || String(value || '—');
  }

  function setStatus(message, kind = '') {
    status.className = `jev-status ${kind}`.trim();
    status.textContent = message || '';
  }

  function setBusy(busy) {
    evaluate.disabled = busy;
    clear.disabled = busy;
    evaluate.textContent = busy ? 'Avaliando…' : 'Avaliar com Jev';
  }

  function render(payload) {
    const routing = payload?.routing || {};
    byId('jevModel').textContent = routing.modelLabel || '—';
    byId('jevComplexity').textContent = label(routing.complexity);
    byId('jevRisk').textContent = label(routing.risk);
    byId('jevScope').textContent = label(routing.scope);
    byId('jevEffort').textContent = label(routing.reasoningEffort);
    byId('jevTests').textContent = routing.testLabel || label(routing.testScope);
    byId('jevConfidence').textContent = Number.isFinite(routing.confidence)
      ? `${Math.round(routing.confidence * 100)}%`
      : '—';
    prompt.textContent = payload?.preparedPrompt || '';
    const usage = payload?.usage || {};
    const astraPct = Number.isFinite(routing.astraProbability)
      ? ` · probabilidade de escalonamento para Astra: ${Math.round(routing.astraProbability * 100)}%`
      : '';
    byId('jevUsage').textContent = `Jev: ${Number(usage.inputTokens || 0).toLocaleString('pt-BR')} tokens de entrada + ${Number(usage.outputTokens || 0).toLocaleString('pt-BR')} de saída${astraPct}.`;
    results.classList.add('visible');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function run() {
    const value = task.value.trim();
    if (!value) {
      setStatus('Descreva a tarefa antes de avaliar.', 'error');
      task.focus();
      return;
    }

    setBusy(true);
    setStatus('Jev está classificando a tarefa…');
    try {
      const payload = await auth.api('/api/admin/jev/evaluate', {
        method: 'POST',
        body: JSON.stringify({ task: value })
      });
      render(payload);
      setStatus('Triagem concluída. Escolha o modelo sugerido no Codex e use o prompt preparado.', 'success');
      window.PortalInteractions?.notify?.('loaded', 'Triagem Jev concluída.', results);
    } catch (error) {
      setStatus(error?.message || 'Não foi possível avaliar a tarefa com Jev.', 'error');
      window.PortalInteractions?.notify?.('error', 'Falha ao consultar Jev.', task);
    } finally {
      setBusy(false);
      window.PortalInteractions?.endTask?.(evaluate);
    }
  }

  evaluate.addEventListener('click', run);
  task.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      run();
    }
  });

  clear.addEventListener('click', () => {
    task.value = '';
    prompt.textContent = '';
    results.classList.remove('visible');
    setStatus('');
    task.focus();
  });

  copy.addEventListener('click', async () => {
    const value = prompt.textContent || '';
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      copy.textContent = 'Copiado';
      setTimeout(() => { copy.textContent = 'Copiar prompt'; }, 1400);
      window.PortalInteractions?.notify?.('saved', 'Prompt copiado.', prompt);
    } catch (_) {
      setStatus('O navegador não permitiu copiar automaticamente. Selecione o prompt manualmente.', 'error');
    }
  });

  byId('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });
})();
