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

  function render(payload) {
    const checks = Array.isArray(payload?.checks) ? payload.checks : [];
    summary.className = `readiness-summary ${payload.readyForControlledDeploy ? 'ready' : 'pending'}`;
    summary.innerHTML = payload.readyForControlledDeploy
      ? '<strong>Infraestrutura mínima detectada.</strong><span>As dependências obrigatórias estão configuradas. Ainda execute os testes controlados antes de mesclar/publicar.</span>'
      : `<strong>A implantação ainda possui ${Number(payload.blockers?.length || 0)} bloqueio(s).</strong><span>Complete os itens obrigatórios abaixo antes do deploy controlado.</span>`;

    list.innerHTML = checks.map((item) => {
      const blocker = item.requiredBeforeDeploy && !item.ok;
      const css = item.ok ? 'ok' : blocker ? 'blocker' : '';
      const mark = item.ok ? '✓' : blocker ? '!' : '•';
      return `<article class="readiness-item ${css}"><span class="readiness-mark">${mark}</span><div><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.detail)}</p></div></article>`;
    }).join('') || '<div class="portal-note warning">O diagnóstico não retornou itens.</div>';

    meta.textContent = payload.generatedAt ? `Última verificação: ${formatDate(payload.generatedAt)}` : '';
  }

  async function load() {
    refresh.disabled = true;
    try {
      const payload = await auth.api('/api/admin/readiness', { method: 'GET' });
      render(payload);
    } catch (error) {
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/conta/?verificar-email=1&next=${encodeURIComponent('/admin/configuracao/')}`);
        return;
      }
      summary.className = 'readiness-summary pending';
      summary.innerHTML = '<strong>Não foi possível executar o diagnóstico.</strong><span>Confira a sessão do Desenvolvedor e tente novamente.</span>';
      list.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Falha ao verificar a configuração.')}</div>`;
    } finally {
      refresh.disabled = false;
    }
  }

  refresh.addEventListener('click', load);
  document.getElementById('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await load();
})();
