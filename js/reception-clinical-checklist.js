'use strict';

(() => {
  const DATA_SOURCE = 'https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html';
  const detail = document.getElementById('receptionDetail');
  if (!detail) return;

  const PSYCHOLOGY_EXTRA = [
    'O encaminhamento informa um breve histórico clínico do paciente.',
    'O encaminhamento informa há quanto tempo os sintomas começaram e como evoluíram.',
    'O encaminhamento descreve os sintomas e o estado emocional atual.',
    'O encaminhamento informa o nível de impacto dos sintomas na qualidade de vida.',
    'O encaminhamento informa se há diagnóstico psiquiátrico ou transtorno mental prévio e, se houver, qual.',
    'O encaminhamento informa se o paciente faz ou já fez uso de medicações e, se sim, quais.',
    'O encaminhamento informa se há histórico de uso de substâncias psicoativas.'
  ];

  let protocolsPromise = null;
  let applying = false;
  let queued = false;

  const arr = (value) => Array.isArray(value) ? value : (value ? [value] : []);
  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const clean = (value) => String(value || '').replace(/^[-•✔\s]+/, '').replace(/\s+/g, ' ').trim();
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function unique(values) {
    const seen = new Set();
    return arr(values).flat().map(clean).filter(Boolean).filter((item) => {
      const key = normalize(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

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

  function loadProtocols() {
    if (!protocolsPromise) {
      protocolsPromise = fetch(`${DATA_SOURCE}?reception-clinical-checklist=2.0`, { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error(`Falha ao carregar protocolos (${response.status}).`);
          return response.text();
        })
        .then((source) => JSON.parse(extractProtocolArray(source)));
    }
    return protocolsPromise;
  }

  function displayName(protocol) {
    const text = normalize(`${protocol?.id || ''} ${protocol?.nome || ''}`);
    return text.includes('neurologia pediatrica') || text.includes('neuroped') ? 'neuropediatria' : normalize(protocol?.nome);
  }

  function isPsychology(protocol) {
    const text = normalize(`${protocol?.id || ''} ${protocol?.nome || ''} ${protocol?.categoria || ''}`);
    return text.includes('psicologia') || text.includes('psicologo');
  }

  function findProtocol(protocols) {
    const activeId = document.querySelector('#receptionProtocolList button.active')?.dataset.id || '';
    const title = detail.querySelector('.reception-title')?.textContent?.trim() || '';
    return protocols.find((item) => String(item.id || '') === activeId)
      || protocols.find((item) => displayName(item) === normalize(title))
      || null;
  }

  function clinicalItems(protocol, subprotocol) {
    const official = unique([
      arr(protocol.informacoesObrigatorias),
      arr(subprotocol?.obrigatorias)
    ]);
    const extras = isPsychology(protocol) ? PSYCHOLOGY_EXTRA : [];
    const existing = new Set([...detail.querySelectorAll('.reception-item:not([data-clinical-requirement="1"])')]
      .map((row) => normalize(row.dataset.item || row.textContent))
      .filter(Boolean));

    return unique([official, extras]).filter((item) => !existing.has(normalize(item)));
  }

  function rowHtml(item, index) {
    return `
      <div class="reception-item" data-type="mandatory" data-index="clinical-${index}" data-item="${escapeHtml(item)}" data-clinical-requirement="1" data-reception-ux-ready="1">
        <div class="reception-item-text">${escapeHtml(item)}</div>
        <select class="reception-status fast-check-hidden" aria-label="Situação da informação">
          <option value="missing" selected>Não consta</option>
          <option value="ok">Consta no encaminhamento</option>
        </select>
        <div class="fast-check-controls">
          <label class="fast-check fast-check-primary" title="Marcar quando esta informação consta no encaminhamento">
            <input type="checkbox" aria-label="Marcar quando esta informação consta no encaminhamento">
            <span class="fast-check-mark" aria-hidden="true"></span>
          </label>
        </div>
      </div>`;
  }

  function ensureSummary(afterElement) {
    let summary = detail.querySelector('.reception-summary');
    if (summary) return summary;
    summary = document.createElement('div');
    summary.className = 'reception-summary';
    summary.id = 'receptionSummary';
    summary.innerHTML = `
      <div><strong id="receptionSummaryTitle">Pode imprimir a lista completa</strong><span id="receptionSummaryText">Nenhuma caixa marcada. A impressão mostrará os requisitos desta solicitação.</span></div>
      <div class="reception-actions">
        <button class="portal-button primary" id="printMissingItems" type="button">Imprimir orientação completa</button>
      </div>`;
    afterElement.insertAdjacentElement('afterend', summary);
    return summary;
  }

  function updateInstructions() {
    const scope = detail.querySelector('.reception-scope-note');
    if (scope) {
      const html = '<strong>Importante:</strong> a recepção confere se as informações exigidas estão escritas no encaminhamento e se os documentos, exames, laudos ou imagens foram apresentados. <strong>Não cabe à recepção interpretar o conteúdo, realizar avaliação clínica, concluir diagnóstico ou definir urgência.</strong> Se houver dúvida, peça ajuda ao Setor de Regulação.';
      if (scope.innerHTML !== html) scope.innerHTML = html;
    }

    const guide = detail.querySelector('.reception-simple-guide');
    if (guide) {
      const html = '<strong>Como usar:</strong> 1) escolha a especialidade e, quando houver, o motivo do encaminhamento; 2) marque o que já consta no encaminhamento e o que o paciente apresentou; 3) se faltar alguma informação ou documento, imprima a orientação.';
      if (guide.innerHTML !== html) guide.innerHTML = html;
    }
  }

  function refreshSummary() {
    const summary = detail.querySelector('.reception-summary');
    if (!summary) return;
    const rows = [...detail.querySelectorAll('.reception-item')];
    const principal = rows.filter((row) => row.dataset.type === 'mandatory');
    const marked = rows.filter((row) => row.querySelector('.fast-check input')?.checked);
    const missing = principal.filter((row) => !row.querySelector('.fast-check input')?.checked);
    const title = detail.querySelector('#receptionSummaryTitle');
    const text = detail.querySelector('#receptionSummaryText');
    const button = detail.querySelector('#printMissingItems');

    summary.classList.toggle('has-missing', marked.length > 0 && missing.length > 0);
    if (!marked.length) {
      if (title) title.textContent = 'Pode imprimir a lista completa';
      if (text) text.textContent = 'Nenhuma caixa marcada. A impressão mostrará tudo que precisa ser conferido para esta solicitação.';
      if (button) { button.disabled = false; button.textContent = 'Imprimir orientação completa'; }
      return;
    }
    if (missing.length) {
      if (title) title.textContent = `${missing.length} item(ns) ainda não conferido(s)`;
      if (text) text.textContent = `${principal.length - missing.length} de ${principal.length} item(ns) principais já constam ou foram apresentados.`;
      if (button) { button.disabled = false; button.textContent = 'Imprimir o que falta'; }
      return;
    }
    if (title) title.textContent = 'Tudo certo';
    if (text) text.textContent = 'Todas as informações e itens principais foram marcados como presentes.';
    if (button) { button.disabled = true; button.textContent = 'Nada faltando'; }
  }

  function bindClinicalRows(section) {
    section.querySelectorAll('.reception-item').forEach((row) => {
      const checkbox = row.querySelector('.fast-check input');
      const select = row.querySelector('.reception-status');
      checkbox?.addEventListener('change', () => {
        if (select) {
          select.value = checkbox.checked ? 'ok' : 'missing';
          select.dataset.state = select.value;
        }
        refreshSummary();
      });
    });
  }

  async function ensureClinicalChecklist() {
    if (applying || !detail.querySelector('.reception-title')) return;
    applying = true;
    try {
      const protocols = await loadProtocols();
      const protocol = findProtocol(protocols);
      if (!protocol) return;

      const select = detail.querySelector('#receptionSubprotocol');
      const subIndex = select ? Number(select.value) : -1;
      const subprotocol = Number.isInteger(subIndex) && subIndex >= 0 ? arr(protocol.subprotocolos)[subIndex] || null : null;
      const signature = `${protocol.id || protocol.nome}:${subIndex}`;
      const current = detail.querySelector('[data-clinical-checklist="1"]');
      if (current?.dataset.signature === signature) {
        updateInstructions();
        return;
      }
      current?.remove();

      const items = clinicalItems(protocol, subprotocol);
      if (!items.length) {
        updateInstructions();
        return;
      }

      const section = document.createElement('section');
      section.className = 'reception-group reception-clinical-checklist';
      section.dataset.group = 'clinical';
      section.dataset.clinicalChecklist = '1';
      section.dataset.signature = signature;
      section.innerHTML = `
        <header>
          <h3>O que precisa estar escrito no encaminhamento</h3>
          <p>Marque a caixinha quando a informação já estiver registrada. A recepção confere a presença da informação, sem interpretar ou avaliar clinicamente.</p>
        </header>
        <div class="reception-items">${items.map(rowHtml).join('')}</div>`;

      let groups = detail.querySelector('.reception-check-groups');
      if (!groups) {
        groups = document.createElement('div');
        groups.className = 'reception-check-groups';
        const scope = detail.querySelector('.reception-scope-note');
        if (scope) scope.insertAdjacentElement('beforebegin', groups);
        else detail.appendChild(groups);
      }
      groups.insertAdjacentElement('afterbegin', section);

      detail.querySelectorAll('.portal-note.success').forEach((note) => {
        if (/material f[ií]sico espec[ií]fico/i.test(note.textContent || '')) note.remove();
      });

      ensureSummary(groups);
      bindClinicalRows(section);
      updateInstructions();
      refreshSummary();
    } catch (error) {
      console.warn('Não foi possível montar o checklist clínico da recepção.', error);
    } finally {
      applying = false;
    }
  }

  function scheduleEnsure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureClinicalChecklist();
    });
  }

  const observer = new MutationObserver(scheduleEnsure);
  observer.observe(detail, { childList: true, subtree: true });
  scheduleEnsure();
})();
