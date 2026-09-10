'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await auth.requireRole(['admin']);
  if (!user) return;
  if (user.mustChangePassword) { location.replace('/seguranca/?primeiro-acesso=1'); return; }
  document.getElementById('portalUserName').textContent = user.name || user.username || 'Desenvolvedor';
  document.getElementById('portalUserRole').textContent = 'Desenvolvedor · moderação social';
  document.getElementById('portalLogout')?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });
  let config;
  try { config = await social.getConfig(); }
  catch (error) { social.status(error.message || 'Camada Social indisponível.', 'error'); return; }
  window.PortalSocialNavigation?.mount(user, config);
  if (!config.moderation || !config.available) { social.status(config.gate?.message || 'Acesso de moderação indisponível.', 'error'); return; }

  let cursor = '';
  const list = document.getElementById('moderationList');
  const more = document.getElementById('moderationMore');

  async function resolve(report, status, action) {
    const actionLabel = action === 'hide_content' ? 'ocultar o conteúdo' : action === 'suspend_user' ? 'suspender a participação social' : 'encerrar sem medida';
    const confirmed = await social.confirmAction({
      title: 'Confirmar decisão de moderação?',
      message: `A denúncia será marcada como ${status === 'dismissed' ? 'descartada' : 'resolvida'} e a medida será: ${actionLabel}. A conta profissional não será desativada.`,
      confirmLabel: 'Registrar decisão',
      danger: action !== 'none'
    });
    if (!confirmed) return;
    try {
      await social.api(`/api/social/moderation/reports/${encodeURIComponent(report.id)}`, {
        method: 'PATCH', body: JSON.stringify({ status, action })
      });
      social.status('Decisão registrada na auditoria social.', 'success');
      await load(false);
    } catch (error) { social.status(error.message || 'Não foi possível registrar a decisão.', 'error'); }
  }

  function reportNode(report) {
    const article = document.createElement('article');
    article.className = 'social-admin-report';
    const title = document.createElement('h3');
    title.textContent = `${report.targetType} · ${report.reason}`;
    const reporter = document.createElement('p');
    reporter.textContent = `Denunciante: ${report.reporter.name} (@${report.reporter.handle}) · ${social.formatDate(report.createdAt)}`;
    const target = document.createElement('p');
    target.textContent = `Alvo técnico: ${report.targetId}`;
    const reported = document.createElement('blockquote');
    reported.className = 'social-report-target';
    const author = report.target?.author;
    const authorLabel = author ? `${author.name || `@${author.handle}`} (@${author.handle})` : 'Conteúdo não disponível';
    reported.textContent = `${authorLabel} · ${report.target?.status || 'indisponível'}${report.target?.text ? ` — ${report.target.text}` : ''}`;
    const details = document.createElement('p');
    details.textContent = report.details || 'Sem detalhes complementares.';
    const actions = document.createElement('div');
    actions.className = 'social-row-actions';
    if (report.status === 'open') {
      const dismiss = social.button('Descartar', 'social-button secondary');
      dismiss.addEventListener('click', () => resolve(report, 'dismissed', 'none'));
      actions.appendChild(dismiss);
      if (report.targetType === 'post' || report.targetType === 'comment') {
        const hide = social.button('Ocultar conteúdo', 'social-button danger');
        hide.addEventListener('click', () => resolve(report, 'resolved', 'hide_content'));
        actions.appendChild(hide);
      }
      const suspend = social.button('Suspender social', 'social-button danger');
      suspend.addEventListener('click', () => resolve(report, 'resolved', 'suspend_user'));
      actions.appendChild(suspend);
    }
    article.append(title, reporter, target, reported, details, actions);
    return article;
  }

  function render(reports, append) {
    if (!append) list.innerHTML = '';
    if (!reports.length && !append) {
      const empty = document.createElement('div'); empty.className = 'social-empty'; empty.innerHTML = social.icons.shield;
      const title = document.createElement('h2'); title.textContent = 'Nenhuma denúncia neste estado';
      const text = document.createElement('p'); text.textContent = 'A fila será atualizada quando houver uma denúncia social.';
      empty.append(title, text); list.appendChild(empty); return;
    }
    reports.forEach((report) => list.appendChild(reportNode(report)));
  }

  async function load(append = false) {
    if (!append) cursor = '';
    more.disabled = true;
    try {
      const status = document.getElementById('moderationStatus').value;
      const payload = await social.api(`/api/social/moderation/reports?status=${status}${append && cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      render(payload.reports || [], append);
      cursor = payload.nextCursor || '';
      more.hidden = !cursor;
    } catch (error) { social.status(error.message || 'Não foi possível carregar a fila.', 'error'); }
    finally { more.disabled = false; }
  }

  async function loadMigrations() {
    try {
      const payload = await social.api('/api/social/migrations/status');
      const box = document.getElementById('socialMigrationStatus');
      box.innerHTML = '';
      (payload.migrations || []).forEach((migration) => {
        const line = document.createElement('div');
        line.textContent = `${migration.version} · aplicada em ${social.formatDate(migration.appliedAt)}`;
        box.appendChild(line);
      });
    } catch (_) { document.getElementById('socialMigrationStatus').textContent = 'Não foi possível consultar o estado agora.'; }
  }

  document.getElementById('moderationStatus').addEventListener('change', () => load(false));
  more.addEventListener('click', () => load(true));
  await Promise.all([load(false), loadMigrations()]);
})();
