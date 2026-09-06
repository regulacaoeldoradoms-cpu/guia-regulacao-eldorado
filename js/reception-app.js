'use strict';

(async () => {
  const DATA_SOURCE = 'https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html';
  const auth = window.RegulationAuth;
  const user = await auth.requireRole(['recepcao', 'admin']);
  if (!user) return;

  const listElement = document.getElementById('receptionProtocolList');
  const searchInput = document.getElementById('receptionSearch');
  const detail = document.getElementById('receptionDetail');
  const resultCount = document.getElementById('receptionResultCount');
  const userName = document.getElementById('portalUserName');
  const userRole = document.getElementById('portalUserRole');
  const logout = document.getElementById('portalLogout');
  const printArea = document.getElementById('printReceptionArea');
  let protocols = [];
  let selectedProtocol = null;
  let selectedSubprotocolIndex = -1;

  const arr = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));

  if (userName) userName.textContent = user.name || user.username || 'Usuário';
  if (userRole) userRole.textContent = user.preview ? 'modo de configuração' : (user.role === 'admin' ? 'Administrador' : 'Recepção');
  logout?.addEventListener('click', async () => { await auth.logout(); location.replace('/login/'); });

  function extractProtocolArray(source) {
    const start = source.indexOf('const PROTOCOLOS');
    if (start < 0) throw new Error('Base de protocolos não localizada.');
    const arrayStart = source.indexOf('[', start);
    const endings = ['];\n  const FOOTER_IMG', '];\r\n  const FOOTER_IMG', '];\nconst FOOTER_IMG', '];\r\nconst FOOTER_IMG'];
    let arrayEnd = -1;
    for (const ending of endings) {
      const position = source.indexOf(ending, arrayStart);
      if (position >= 0 && (arrayEnd < 0 || position < arrayEnd)) arrayEnd = position;
    }
    if (arrayEnd < 0) throw new Error('Final da base de protocolos não localizado.');
    return source.slice(arrayStart, arrayEnd + 1);
  }

  function routeFor(protocol) {
    const systems = protocol.sistemas || {};
    const routes = [];
    if (systems.sisreg) routes.push('SISREG/CORE');
    if (systems.digsus && systems.digsusStatus === 'disponivel') routes.push('DigSaúde MS');
    if (systems.digsus && systems.digsusStatus === 'assincrona') routes.push('Discussão de conduta');
    return routes.join(' · ') || 'Conferir fluxo';
  }

  function displayName(protocol) {
    const text = normalize(`${protocol.id || ''} ${protocol.nome || ''}`);
    return text.includes('neurologia pediatrica') || text.includes('neuroped') ? 'Neuropediatria' : protocol.nome;
  }

  function searchable(protocol) {
    return normalize([
      displayName(protocol), protocol.categoria, protocol.faixaEtaria, protocol.resumo,
      ...arr(protocol.tags), ...arr(protocol.examesObrigatorios), ...arr(protocol.examesCondicionais),
      ...arr(protocol.complementares), ...arr(protocol.informacoesObrigatorias),
      ...arr(protocol.subprotocolos).flatMap((sub) => [sub.titulo, ...arr(sub.obrigatorias), ...arr(sub.examesObrigatorios), ...arr(sub.condicionais), ...arr(sub.complementares)])
    ].join(' '));
  }

  const documentaryPattern = /(relat[oó]rio|laudo|imagem|radiograf|raio\s*-?\s*x|resson[aâ]ncia|tomografia|ultrasson|ecg|eletrocard|holter|mapa\b|audiometr|snellen|exame|resultado|parecer|question[aá]rio|escala\b|m-chat|bi-rads|encaminhamento|documento|foto|fotografia|caderneta|receita|teste)/i;
  const conditionalPattern = /(se houver|se tiver|quando dispon[ií]vel|se dispon[ií]vel|quando realizado|se realizado|caso tenha|conforme o caso|se necess[aá]rio|quando indicado|se poss[ií]vel)/i;
  const notRequiredPattern = /(n[aã]o retardar|n[aã]o aguardar|n[aã]o h[aá] exame obrigat[oó]rio|sem exame obrigat[oó]rio|n[aã]o exige exame)/i;

  function cleanItem(value) {
    return String(value || '').replace(new RegExp(`^[-\\u2022\\u2714\\s]+`), '').replace(/\s+/g, ' ').trim();
  }

  function uniqueItems(items) {
    const seen = new Set();
    return items.map(cleanItem).filter(Boolean).filter((item) => {
      const key = normalize(item).replace(/[^a-z0-9]+/g, ' ').trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function distribute(target, item, fallbackType) {
    const text = cleanItem(item);
    if (!text || notRequiredPattern.test(text)) return;
    const type = conditionalPattern.test(text) ? 'conditional' : fallbackType;
    target[type].push(text);
  }

  function materialChecklist(protocol, subprotocol) {
    const groups = { mandatory: [], conditional: [], available: [] };
    arr(protocol.examesObrigatorios).forEach((item) => distribute(groups, item, 'mandatory'));
    arr(protocol.examesCondicionais).forEach((item) => distribute(groups, item, 'conditional'));
    arr(protocol.complementares).forEach((item) => distribute(groups, item, 'available'));
    arr(protocol.informacoesObrigatorias)
      .filter((item) => documentaryPattern.test(item))
      .forEach((item) => distribute(groups, item, 'mandatory'));

    if (subprotocol) {
      arr(subprotocol.examesObrigatorios).forEach((item) => distribute(groups, item, 'mandatory'));
      arr(subprotocol.condicionais).forEach((item) => distribute(groups, item, 'conditional'));
      arr(subprotocol.complementares).forEach((item) => distribute(groups, item, 'available'));
      arr(subprotocol.obrigatorias)
        .filter((item) => documentaryPattern.test(item))
        .forEach((item) => distribute(groups, item, 'mandatory'));
    }

    groups.mandatory = uniqueItems(groups.mandatory);
    groups.conditional = uniqueItems(groups.conditional).filter((item) => !groups.mandatory.some((m) => normalize(m) === normalize(item)));
    groups.available = uniqueItems(groups.available).filter((item) => ![...groups.mandatory, ...groups.conditional].some((m) => normalize(m) === normalize(item)));
    return groups;
  }

  function statusOptions(type) {
    if (type === 'mandatory') return '<option value="pending">Não conferido</option><option value="ok">Trouxe / está anexado</option><option value="missing">Faltando</option>';
    if (type === 'conditional') return '<option value="pending">Verificar se aplica</option><option value="na">Não se aplica</option><option value="ok">Trouxe / está anexado</option><option value="missing">Aplica-se e está faltando</option>';
    return '<option value="pending">Não conferido</option><option value="ok">Trouxe / está disponível</option><option value="na">Não possui / não disponível</option>';
  }

  function groupHtml(title, description, items, type) {
    if (!items.length) return '';
    return `
      <section class="reception-group" data-group="${type}">
        <header><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></header>
        <div class="reception-items">
          ${items.map((item, index) => `
            <div class="reception-item" data-type="${type}" data-index="${index}" data-item="${escapeHtml(item)}">
              <div class="reception-item-text">${escapeHtml(item)}${type === 'conditional' ? '<small>Somente quando esta condição se aplicar ao caso.</small>' : type === 'available' ? '<small>Não tratar como obrigatório quando o protocolo indicar apenas disponibilidade.</small>' : ''}</div>
              <select class="reception-status" aria-label="Situação do item">${statusOptions(type)}</select>
            </div>`).join('')}
        </div>
      </section>`;
  }

  function renderDetail() {
    const protocol = selectedProtocol;
    if (!protocol) return;
    const subprotocols = arr(protocol.subprotocolos);
    const subprotocol = selectedSubprotocolIndex >= 0 ? subprotocols[selectedSubprotocolIndex] : null;
    const groups = materialChecklist(protocol, subprotocol);
    const hasItems = groups.mandatory.length || groups.conditional.length || groups.available.length;

    detail.innerHTML = `
      <span class="reception-kicker">Conferência documental</span>
      <h1 class="reception-title">${escapeHtml(displayName(protocol))}</h1>
      <div class="reception-meta">
        <span class="reception-badge">${escapeHtml(routeFor(protocol))}</span>
        ${protocol.faixaEtaria ? `<span class="reception-badge">${escapeHtml(protocol.faixaEtaria)}</span>` : ''}
      </div>

      ${subprotocols.length ? `
        <div class="reception-controls">
          <div class="portal-field" style="margin:0">
            <label for="receptionSubprotocol">Motivo / condição do encaminhamento</label>
            <select id="receptionSubprotocol">
              <option value="-1">Requisitos gerais da especialidade</option>
              ${subprotocols.map((item, index) => `<option value="${index}" ${index === selectedSubprotocolIndex ? 'selected' : ''}>${escapeHtml(item.titulo || `Condição ${index + 1}`)}</option>`).join('')}
            </select>
          </div>
          <button class="portal-button secondary" id="clearReceptionChecklist" type="button">Limpar conferência</button>
        </div>` : '<div style="height:4px"></div>'}

      ${hasItems ? `
        <div class="reception-check-groups">
          ${groupHtml('Itens que devem acompanhar a solicitação', 'Confira se o paciente trouxe ou se o documento/exame já está anexado.', groups.mandatory, 'mandatory')}
          ${groupHtml('Conforme o caso', 'Primeiro confirme se o item se aplica. Se não se aplicar, marque “Não se aplica”.', groups.conditional, 'conditional')}
          ${groupHtml('Quando já disponível', 'Itens úteis ou recomendados quando existentes; não devem ser tratados automaticamente como obrigatórios.', groups.available, 'available')}
        </div>
        <div class="reception-summary" id="receptionSummary">
          <div><strong id="receptionSummaryTitle">Conferência em andamento</strong><span id="receptionSummaryText">Marque cada item conforme o que foi apresentado.</span></div>
          <div class="reception-actions">
            <button class="portal-button secondary" id="clearReceptionChecklistBottom" type="button">Limpar</button>
            <button class="portal-button primary" id="printMissingItems" type="button" disabled>Imprimir orientação do que falta</button>
          </div>
        </div>` : `
        <div class="portal-note success">Não foi identificado, na base protocolar cadastrada, um material físico específico para conferência da recepção neste protocolo. A avaliação clínica continua sendo responsabilidade do profissional solicitante/regulador.</div>`}

      <div class="reception-scope-note"><strong>Limite da recepção:</strong> este checklist serve para conferir documentos, laudos, imagens, relatórios e exames. Não cabe à recepção concluir exame físico ou neurológico, hipótese diagnóstica, interpretação de exames, indicação cirúrgica, estado mental ou classificação de risco.</div>`;

    document.getElementById('receptionSubprotocol')?.addEventListener('change', (event) => {
      selectedSubprotocolIndex = Number(event.target.value);
      renderDetail();
    });
    detail.querySelectorAll('.reception-status').forEach((select) => {
      select.addEventListener('change', () => {
        select.dataset.state = select.value;
        updateSummary();
      });
    });
    const clear = () => { detail.querySelectorAll('.reception-status').forEach((select) => { select.value = 'pending'; select.dataset.state = ''; }); updateSummary(); };
    document.getElementById('clearReceptionChecklist')?.addEventListener('click', clear);
    document.getElementById('clearReceptionChecklistBottom')?.addEventListener('click', clear);
    document.getElementById('printMissingItems')?.addEventListener('click', printMissing);
    updateSummary();
  }

  function currentRows() {
    return [...detail.querySelectorAll('.reception-item')].map((row) => ({
      type: row.dataset.type,
      item: row.dataset.item,
      state: row.querySelector('.reception-status')?.value || 'pending'
    }));
  }

  function updateSummary() {
    const rows = currentRows();
    const missing = rows.filter((row) => row.state === 'missing');
    const checked = rows.filter((row) => row.state !== 'pending').length;
    const summary = document.getElementById('receptionSummary');
    const title = document.getElementById('receptionSummaryTitle');
    const text = document.getElementById('receptionSummaryText');
    const button = document.getElementById('printMissingItems');
    if (!summary) return;
    summary.classList.toggle('has-missing', missing.length > 0);
    if (missing.length) {
      title.textContent = `${missing.length} item(ns) faltando`;
      text.textContent = `${checked} de ${rows.length} itens conferidos. Imprima somente o que precisa ser providenciado.`;
    } else {
      title.textContent = checked === rows.length && rows.length ? 'Conferência concluída' : 'Conferência em andamento';
      text.textContent = checked === rows.length && rows.length ? 'Nenhum item foi marcado como faltando.' : `${checked} de ${rows.length} itens conferidos.`;
    }
    if (button) button.disabled = missing.length === 0;
  }

  function printMissing() {
    const missing = currentRows().filter((row) => row.state === 'missing');
    if (!missing.length || !selectedProtocol) return;
    const subprotocols = arr(selectedProtocol.subprotocolos);
    const subprotocol = selectedSubprotocolIndex >= 0 ? subprotocols[selectedSubprotocolIndex] : null;
    const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
    printArea.innerHTML = `
      <article class="reception-print-doc">
        <header class="reception-print-header">
          <img src="/assets/app-icon.svg" alt="">
          <div><h1>ORIENTAÇÃO PARA COMPLEMENTAÇÃO DE DOCUMENTOS</h1><p>Setor de Regulação de Saúde · Eldorado/MS</p></div>
        </header>
        <p><strong>Especialidade/exame:</strong> ${escapeHtml(displayName(selectedProtocol))}</p>
        ${subprotocol ? `<p><strong>Motivo/condição selecionada:</strong> ${escapeHtml(subprotocol.titulo || '')}</p>` : ''}
        <p><strong>Data da orientação:</strong> ${today}</p>
        <h2>Itens que precisam ser providenciados</h2>
        <ul>${missing.map((row) => `<li>${escapeHtml(row.item)}</li>`).join('')}</ul>
        <div class="reception-print-note">Apresente os itens acima para continuidade da solicitação. Este documento pode ser mostrado na tela do celular ou impresso. Ele não substitui avaliação médica nem autoriza procedimento ou consulta.</div>
        <footer class="reception-print-footer">
          <strong>Setor de Regulação de Saúde</strong><br>
          Bairro Jardim das Grevílias, Rua Irmã Aristela, nº 836 · Eldorado/MS<br>
          Atendimento: segunda a sexta-feira, das 07:00 às 11:00.<br><br>
          Fonte: requisitos documentais/exames da base protocolar cadastrada no Guia Médico de Encaminhamentos Regulados.
        </footer>
      </article>`;
    window.print();
  }

  function renderList(filtered = protocols) {
    resultCount.textContent = `${filtered.length} protocolo(s)`;
    listElement.innerHTML = filtered.map((protocol) => `
      <button type="button" data-id="${escapeHtml(protocol.id || displayName(protocol))}" class="${selectedProtocol === protocol ? 'active' : ''}">
        <strong>${escapeHtml(displayName(protocol))}</strong>
        <span>${escapeHtml(protocol.categoria || routeFor(protocol))}</span>
      </button>`).join('');
    listElement.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        selectedProtocol = protocols.find((protocol) => (protocol.id || displayName(protocol)) === button.dataset.id) || null;
        selectedSubprotocolIndex = -1;
        renderList(filtered);
        renderDetail();
      });
    });
  }

  searchInput?.addEventListener('input', () => {
    const term = normalize(searchInput.value.trim());
    const filtered = term ? protocols.filter((protocol) => searchable(protocol).includes(term)) : protocols;
    renderList(filtered);
  });

  try {
    const response = await fetch(`${DATA_SOURCE}?reception-guide=1.0`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Falha ao carregar protocolos (${response.status}).`);
    const source = await response.text();
    protocols = JSON.parse(extractProtocolArray(source))
      .map((protocol) => ({ ...protocol, _search: searchable(protocol) }))
      .sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99) || displayName(a).localeCompare(displayName(b), 'pt-BR'));
    renderList(protocols);
    detail.innerHTML = '<div class="reception-empty"><div><strong>Selecione uma especialidade ou exame.</strong><p>O sistema mostrará somente o que a recepção pode conferir materialmente antes de protocolar a solicitação.</p></div></div>';
  } catch (error) {
    listElement.innerHTML = '';
    detail.innerHTML = `<div class="portal-note warning">${escapeHtml(error.message || 'Não foi possível carregar a base técnica.')}</div>`;
    resultCount.textContent = 'Erro ao carregar';
  }
})();
