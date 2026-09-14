'use strict';

(() => {
  const ICONS = Object.freeze({
    history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
    current: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-4"/></svg>',
    consultation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v4a6 6 0 0 0 12 0V3"/><path d="M6 3H4m14 0h2M12 13v2a4 4 0 0 0 4 4h1"/><circle cx="19" cy="19" r="2"/></svg>',
    request: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9 17l11-11"/><path d="M4 6h7M4 19h7"/></svg>',
    schedule: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M12 13v4l3 1"/></svg>',
    correction: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7h-6V1"/><path d="M20 7a8 8 0 1 0 1 8"/><path d="m9 12 2 2 4-4"/></svg>',
    absence: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-7 3 5 5m0-5-5 5"/></svg>',
    discharge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.4-8.35C.55 9.22 2.1 5 6.15 5c2.08 0 3.22 1.22 3.85 2.18C10.63 6.22 11.77 5 13.85 5c4.05 0 5.6 4.22 3.55 7.65C15 16.65 12 21 12 21Z"/><path d="m8.2 12.1 2.15 2.15 4.1-4.35"/></svg>',
    inPerson: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/><path d="M2 21h20M8 7h2m3 0h2M8 11h2m3 0h2M8 15h2m3 0h2"/></svg>',
    withdrawn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8"/><path d="M4 3v5h5M9 12h6"/></svg>',
    due: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  });

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function formatDate(value) {
    const text = String(value || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return text || 'Data não informada';
    const [year, month, day] = text.split('-');
    return `${day}/${month}/${year}`;
  }

  function eventSortKey(event) {
    return `${String(event?.eventDate || '').padEnd(10, '0')}|${String(event?.createdAt || '')}`;
  }

  function orderedEvents(events) {
    return [...(Array.isArray(events) ? events : [])]
      .sort((a, b) => eventSortKey(b).localeCompare(eventSortKey(a)));
  }

  function eventMeta(event = {}) {
    const type = String(event.eventType || '').toLowerCase();
    const resolution = normalize(event.resolution);
    if (type === 'falta' || resolution === 'FALTA DO PACIENTE' || resolution === 'FALTA') {
      return { tone: 'absence', title: 'Falta registrada', icon: ICONS.absence };
    }
    if (event.discharged === true || resolution === 'ALTA DO EPISODIO') {
      return { tone: 'discharge', title: 'Alta registrada', icon: ICONS.discharge };
    }
    if (resolution === 'PACIENTE DESISTIU DO TRATAMENTO') {
      return { tone: 'withdrawn', title: 'Desistência registrada', icon: ICONS.withdrawn };
    }
    if (resolution === 'ENCAMINHADO PARA ATENDIMENTO PRESENCIAL') {
      return { tone: 'in-person', title: 'Encaminhado para presencial', icon: ICONS.inPerson };
    }
    if (type === 'solicitacao') return { tone: 'request', title: 'Solicitação registrada', icon: ICONS.request };
    if (type === 'programacao') return { tone: 'schedule', title: 'Retorno programado', icon: ICONS.schedule };
    if (type === 'correcao_situacao') return { tone: 'correction', title: 'Situação atualizada', icon: ICONS.correction };
    return { tone: 'consultation', title: 'Teleconsulta', icon: ICONS.consultation };
  }

  function statusClass(status) {
    const key = normalize(status).toLowerCase().replace(/\s+/g, '-');
    return key || 'sem-status';
  }

  function currentDetail(item = {}) {
    if (item.returnDueDate) return `Retorno em ${formatDate(item.returnDueDate)}`;
    const status = normalize(item.status);
    if (status === 'CONCLUIDO') return 'Acompanhamento encerrado';
    if (status === 'SOLICITADO') return 'Solicitação já registrada';
    if (status === 'SOLICITAR') return 'Nova solicitação necessária';
    if (status === 'ATRASADO') return 'Retorno pendente e atrasado';
    if (status === 'EM AGUARDO') return 'Aguardando a data de retorno';
    return 'Sem data-alvo definida';
  }

  function renderCurrent(followups, inline = false) {
    const items = Array.isArray(followups) ? followups : [];
    if (!items.length) return '';
    const wrapperClass = inline ? 'tm-inline-current tm-history-current' : 'telemedicine-current tm-history-current';
    const gridClass = inline ? 'tm-inline-current-grid tm-history-current-grid' : 'telemedicine-current-grid tm-history-current-grid';
    const cards = items.map((item) => {
      const status = item.status || 'Sem situação';
      return `<article class="tm-history-current-card status-${escapeHtml(statusClass(status))}">
        <div class="tm-history-current-card-top"><span class="tm-history-current-icon" aria-hidden="true">${ICONS.current}</span><span class="tm-history-specialty">${escapeHtml(item.specialty || 'Especialidade')}</span></div>
        <strong class="tm-history-current-status">${escapeHtml(status)}</strong>
        <span class="tm-history-current-detail">${escapeHtml(currentDetail(item))}</span>
      </article>`;
    }).join('');
    return `<section class="${wrapperClass}" aria-label="Situação atual">
      <div class="tm-history-section-heading"><span class="tm-history-heading-icon" aria-hidden="true">${ICONS.current}</span><div><strong>Situação atual</strong><span>Estado mais recente de cada acompanhamento</span></div></div>
      <div class="${gridClass}">${cards}</div>
    </section>`;
  }

  function renderEvent(event, index, total) {
    const meta = eventMeta(event);
    const date = formatDate(event.eventDate || String(event.createdAt || '').slice(0, 10));
    const specialty = event.specialty || 'Especialidade não informada';
    const latest = index === 0;
    const observation = event.notes ? `<p class="tm-history-note"><strong>Observação:</strong> ${escapeHtml(event.notes)}</p>` : '';
    const due = event.returnDueDate
      ? `<div class="tm-history-due"><span aria-hidden="true">${ICONS.due}</span><strong>Retorno-alvo</strong><span>${escapeHtml(formatDate(event.returnDueDate))}</span></div>`
      : '';
    return `<article class="telemedicine-event tm-history-event tone-${meta.tone}${latest ? ' is-latest' : ''}" data-history-event="${escapeHtml(meta.tone)}" role="listitem">
      <div class="tm-history-marker" aria-hidden="true">${meta.icon}</div>
      <div class="tm-history-event-card">
        <div class="tm-history-event-top"><time datetime="${escapeHtml(event.eventDate || '')}">${escapeHtml(date)}</time><span class="tm-history-specialty">${escapeHtml(specialty)}</span>${latest ? '<span class="tm-history-latest">Mais recente</span>' : ''}</div>
        <h4>${escapeHtml(meta.title)}</h4>
        <p class="tm-history-resolution">${escapeHtml(event.resolution || 'Sem descrição registrada')}</p>
        ${observation}${due}
      </div>
      ${index < total - 1 ? '<span class="tm-history-rail" aria-hidden="true"></span>' : ''}
    </article>`;
  }

  function renderTimeline(events, inline = false) {
    const items = orderedEvents(events);
    if (!items.length) {
      return `<section class="tm-history-timeline-section"><div class="tm-history-section-heading"><span class="tm-history-heading-icon" aria-hidden="true">${ICONS.history}</span><div><strong>Linha do tempo</strong><span>Nenhum evento registrado</span></div></div><div class="${inline ? 'tm-inline-loading' : 'telemedicine-empty'}">Nenhum evento histórico encontrado.</div></section>`;
    }
    const timelineClass = inline ? 'tm-inline-timeline tm-history-timeline' : 'telemedicine-timeline tm-history-timeline';
    return `<section class="tm-history-timeline-section" aria-label="Linha do tempo do acompanhamento">
      <div class="tm-history-section-heading"><span class="tm-history-heading-icon" aria-hidden="true">${ICONS.history}</span><div><strong>Linha do tempo</strong><span>${items.length} ${items.length === 1 ? 'registro' : 'registros'} em ordem cronológica</span></div></div>
      <div class="${timelineClass}" role="list">${items.map((event, index) => renderEvent(event, index, items.length)).join('')}</div>
    </section>`;
  }

  function render({ followups = [], events = [], inline = false } = {}) {
    return `<div class="tm-history-v40${inline ? ' tm-history-inline' : ' tm-history-modal'}">${renderCurrent(followups, inline)}${renderTimeline(events, inline)}</div>`;
  }

  window.TelemedicineHistoryV40 = Object.freeze({ render, orderedEvents, eventMeta });
})();
