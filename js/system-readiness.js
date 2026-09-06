'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['admin'], { deniedPath: '/' });
  if (!user || user.role !== 'admin') return;

  document.getElementById('portalUserName').textContent = user.name || user.username;
  const list = document.getElementById('readinessList');
  const summary = document.getElementById('readinessSummary');
  const meta = document.getElementById('readinessMeta');
  const refresh = document.getElementById('refreshReadiness');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR', { timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function readinessIcon(state) {
    const icons = {
      ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.6 2.6L16.5 9"></path></svg>',
      blocker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 19h18.4L12 3Z"></path><path d="M12 9v4M12 16.5h.01"></path></svg>',
      info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>'
    };
    return icons[state] || icons.info;
  }

  function render(payload) {
    const checks = Array.isArray(payload?.checks) ? payload.checks : [];
    summary.className = `readiness-summary ${payload.readyForControlledDeploy ? 'ready' : 'pending'}`;
    summary.innerHTML = payload.readyForControlledDeploy
      ? '<strong>Infraestrutura mínima detectada.</strong><span>As dependências obrigatórias estão configuradas. Ainda execute os testes controlados antes de mesclar/publicar.</span>'
      : `<strong>A implantação ainda possui ${Number(payload.blockers?.length || 0)} bloqueio(s).</strong><span>Complete os itens obrigatórios abaixo antes do deploy controlado.</span>`;

    list.innerHTML = checks.map((item) => {
      const blocker = item.requiredBeforeDeploy && !item.ok;
      const css = item.ok ? 'ok' : blocker ? 'blocker' : '';
      const state = item.ok ? 'ok' : blocker ? 'blocker' : 'info';
      return `<article class="readiness-item ${css}"><span class="readiness-mark">${readinessIcon(state)}</span><div><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.detail)}</p></div></article>`;
    }).join('') || '<div class="portal-note warning">O diagnóstico não retornou itens.</div>';

    meta.textContent = payload.generatedAt ? `Última verificação: ${formatDate(payload.generatedAt)}` : '';
  }

  async function load(withFeedback = false) {
    refresh.disabled = true;
    try {
      const payload = await auth.api('/api/admin/readiness', { method: 'GET' });
      render(payload);
      if (withFeedback) window.PortalInteractions?.notify?.('loaded', 'Diagnóstico atualizado.', summary);
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/conta/?verificar-email=1&next=${encodeURIComponent('/admin/configuracao/')}`);
        return;
      }
      summary.className = 'readiness-summary pending';
      summary.innerHTML = '<strong>Não foi possível executar o diagnóstico.</strong><span>Confira a sessão do Desenvolvedor e tente novamente.</span>';
      list.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Falha ao verificar a configuração.')}</div>`;
      if (withFeedback) window.PortalInteractions?.notify?.('error', 'Não foi possível atualizar o diagnóstico.', summary);
    } finally {
      refresh.disabled = false;
      window.PortalInteractions?.endTask?.(refresh);
    }
  }

  refresh.addEventListener('click', () => load(true));
  document.getElementById('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await load();
})();
