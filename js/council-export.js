'use strict';

(() => {
  const button = document.getElementById('exportManifestationPdf');
  const meta = document.getElementById('detailMeta');
  if (!button || !meta) return;

  const byId = (id) => document.getElementById(id);
  const text = (id) => (byId(id)?.textContent || '').trim();
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function typeInfo() {
    const raw = text('detailMeta').split('·')[0].trim();
    const normalized = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (normalized.includes('elogio')) return { key: 'elogio', label: 'Elogio' };
    if (normalized.includes('reclam')) return { key: 'reclamacao', label: 'Reclamação' };
    if (normalized.includes('sugest')) return { key: 'sugestao', label: 'Sugestão' };
    if (normalized.includes('denunc')) return { key: 'denuncia', label: 'Denúncia' };
    return { key: 'manifestacao', label: raw || 'Manifestação' };
  }

  function syncButton() {
    const praise = typeInfo().key === 'elogio';
    button.textContent = praise ? 'Carta de elogio (PDF)' : 'Salvar manifestação em PDF';
    button.classList.toggle('is-praise', praise);
    const hint = document.getElementById('exportManifestationHint');
    if (hint) {
      hint.textContent = praise
        ? 'Gera uma carta de reconhecimento em uma página. Antes de emitir, informe a quem ela será entregue.'
        : 'Gera um registro institucional da manifestação sem expor a identidade protegida do cidadão.';
    }
  }

  function stripService(value) {
    return String(value || '')
      .replace(/^Serviço\/unidade informado:\s*/i, '')
      .replace(/^Serviço\/unidade não informado\.?$/i, '')
      .trim();
  }

  function formatNow() {
    return new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Campo_Grande',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function dateOnly(value) {
    const match = String(value || '').match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    return match ? match[0] : String(value || '').trim();
  }

  function parsePraiseDescription(value) {
    const raw = String(value || '').replace(/\r/g, '').trim();
    const infoMarker = /\n?\s*Informações complementares:\s*/i;
    const desiredMarker = /\n?\s*O que espera do Conselho:\s*/i;
    const infoMatch = infoMarker.exec(raw);
    const desiredMatch = desiredMarker.exec(raw);

    let endMain = raw.length;
    if (infoMatch) endMain = Math.min(endMain, infoMatch.index);
    if (desiredMatch) endMain = Math.min(endMain, desiredMatch.index);
    const quote = raw.slice(0, endMain).trim();

    let complement = '';
    if (infoMatch) {
      const start = infoMatch.index + infoMatch[0].length;
      const end = desiredMatch && desiredMatch.index > start ? desiredMatch.index : raw.length;
      complement = raw.slice(start, end).trim();
    }

    const factDate = (complement.match(/Data do fato:\s*([^\n]+)/i)?.[1] || '').trim();
    const location = (complement.match(/Local específico:\s*([^\n]+)/i)?.[1] || '').trim();
    return { quote, factDate, location };
  }

  function openDocument(html) {
    const popup = window.open('', '_blank');
    if (!popup) {
      window.alert('Não foi possível abrir a visualização do PDF. Verifique se o navegador está bloqueando novas janelas.');
      return;
    }
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  }

  function buildPraiseDocument(recipient) {
    const protocol = text('detailProtocol');
    const metaParts = text('detailMeta').split('·').map((part) => part.trim()).filter(Boolean);
    const registeredDate = dateOnly(metaParts[1] || '');
    const subject = text('detailSubject') || 'Reconhecimento recebido';
    const service = stripService(text('detailService'));
    const parsed = parsePraiseDescription(text('detailDescription'));
    const quote = parsed.quote || 'Reconhecimento registrado pelo Canal do Cidadão.';
    const eventDate = parsed.factDate || registeredDate;
    const locationLabel = parsed.location;
    const generatedAt = formatNow();
    const logo = `${location.origin}/assets/Conselho-de-saude-contornado.png?v=20260821-2`;
    const density = quote.length > 1400 ? 'dense' : quote.length > 700 ? 'compact' : 'regular';

    const contextParts = [];
    if (service) contextParts.push(`<div><span>Serviço / unidade</span><strong>${esc(service)}</strong></div>`);
    if (locationLabel) contextParts.push(`<div><span>Local mencionado</span><strong>${esc(locationLabel)}</strong></div>`);
    if (eventDate) contextParts.push(`<div><span>Data do fato</span><strong>${esc(eventDate)}</strong></div>`);

    return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Carta Institucional de Reconhecimento - ${esc(protocol)}</title>
<style>
  *{box-sizing:border-box}
  :root{--blue:#173b5d;--gold:#9a7418;--gold2:#d6b44f;--gold-soft:#fff9e8;--gold-border:#e5d59f;--text:#263e50;--muted:#6b7f8d;--line:#dce5ea}
  body{margin:0;background:#edf2f5;color:var(--text);font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .screen-actions{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:12px;background:#163650}
  .screen-actions button{border:0;border-radius:10px;padding:11px 17px;font-size:15px;font-weight:800;cursor:pointer}
  .screen-actions .primary{background:#fff;color:#173b5d}.screen-actions .close{background:#dfe7ec;color:#35536a}
  .page{width:210mm;min-height:297mm;margin:18px auto;background:#fff;padding:12mm 15mm 14mm;box-shadow:0 12px 40px rgba(20,45,65,.15);position:relative;overflow:hidden}
  .topline{height:5px;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--gold2))}
  .header{display:flex;align-items:center;gap:13px;padding:11px 0 10px;border-bottom:1px solid var(--line)}
  .header img{width:58px;height:58px;object-fit:contain}.org strong{display:block;font-size:18px;color:var(--blue)}.org span{display:block;margin-top:3px;font-size:10.5px;color:#71828f}
  .title-zone{text-align:center;padding:13px 0 8px}.kicker{color:var(--gold);font-size:9.5px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.title{margin:5px 0 0;color:#5d4814;font-size:26px;line-height:1.12}.protocol{margin-top:4px;color:#7a8993;font-size:9.5px}
  .recipient{margin:7px 0 10px;padding:9px 12px;border-left:4px solid var(--gold);background:#fbfcfd;border-radius:0 8px 8px 0}.recipient span{display:block;color:#7a8790;font-size:8.5px;font-weight:900;text-transform:uppercase;letter-spacing:.09em}.recipient strong{display:block;margin-top:3px;color:var(--blue);font-size:16px;line-height:1.2}.recipient em{display:block;margin-top:2px;color:#657987;font-size:10.5px;font-style:normal}
  .intro{margin:0 0 11px;color:#41596a;font-size:11.3px;line-height:1.45;text-align:justify}
  .recognition-label{margin-bottom:5px;color:var(--gold);font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.11em}.subject{margin:0 0 7px;color:#5d4814;font-size:20px;line-height:1.18;font-weight:900}
  .quote{position:relative;padding:13px 15px 13px 25px;border:1px solid var(--gold-border);border-radius:11px;background:var(--gold-soft);color:#2f4657;font-size:15px;line-height:1.52;white-space:pre-wrap;overflow-wrap:anywhere}
  .quote::before{content:'“';position:absolute;left:9px;top:11px;color:var(--gold);font:700 27px/1 Georgia,serif}
  .context{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px}.context div{padding:7px 9px;border:1px solid var(--line);border-radius:8px;background:#fbfdfe}.context span{display:block;color:#83919a;font-size:7.8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.context strong{display:block;margin-top:3px;color:#34536a;font-size:9.7px;line-height:1.25}
  .recognition{margin-top:12px;padding:10px 13px;text-align:center;border-top:1px solid var(--gold-border);border-bottom:1px solid var(--gold-border);color:#634d16;font-size:10.5px;line-height:1.4}.recognition strong{display:block;margin-bottom:2px;font-size:14px}
  .signature{margin-top:15px;text-align:center}.signature .line{width:225px;max-width:72%;height:1px;margin:0 auto 6px;background:#8798a4}.signature strong{display:block;color:#29485f;font-size:11.5px}.signature span{display:block;margin-top:2px;color:#718490;font-size:9.5px}
  .footer{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;gap:18px;padding-top:6px;border-top:1px solid var(--line);color:#87959e;font-size:7.5px}.footer span:last-child{text-align:right}
  .compact .header{padding:8px 0}.compact .header img{width:52px;height:52px}.compact .title-zone{padding:9px 0 6px}.compact .title{font-size:23px}.compact .recipient{margin:5px 0 7px;padding:7px 10px}.compact .intro{margin-bottom:8px;font-size:10.5px}.compact .subject{font-size:18px}.compact .quote{padding:10px 13px 10px 23px;font-size:13.5px;line-height:1.43}.compact .context{margin-top:7px}.compact .recognition{margin-top:8px;padding:7px 10px}.compact .signature{margin-top:10px}
  .dense .header{padding:6px 0}.dense .header img{width:46px;height:46px}.dense .org strong{font-size:16px}.dense .title-zone{padding:7px 0 4px}.dense .title{font-size:21px}.dense .recipient{margin:4px 0 6px;padding:6px 9px}.dense .recipient strong{font-size:14px}.dense .intro{margin-bottom:6px;font-size:9.7px;line-height:1.35}.dense .subject{font-size:16.5px}.dense .quote{padding:9px 12px 9px 22px;font-size:12px;line-height:1.36}.dense .context{margin-top:6px}.dense .context div{padding:5px 7px}.dense .recognition{margin-top:6px;padding:6px 9px;font-size:9.4px}.dense .recognition strong{font-size:12.5px}.dense .signature{margin-top:8px}
  @media(max-width:820px){.page{width:auto;min-height:0;margin:0;padding:24px 20px 70px;box-shadow:none;overflow:visible}.footer{position:static;margin-top:30px}.context{grid-template-columns:1fr}.header img{width:54px;height:54px}}
  @media print{body{background:#fff}.screen-actions{display:none!important}.page{width:210mm;min-height:297mm;margin:0;padding:12mm 15mm 14mm;box-shadow:none;overflow:hidden;page-break-after:avoid}.footer{bottom:7mm}@page{size:A4;margin:0}}
</style>
</head>
<body>
<div class="screen-actions"><button class="primary" onclick="window.print()">Salvar / imprimir PDF</button><button class="close" onclick="window.close()">Fechar</button></div>
<main class="page ${density}">
  <div class="topline"></div>
  <header class="header"><img src="${esc(logo)}" alt="Conselho Municipal de Saúde"><div class="org"><strong>Conselho Municipal de Saúde</strong><span>Eldorado/MS · Controle social e participação cidadã</span></div></header>
  <section class="title-zone"><div class="kicker">Reconhecimento recebido pelo Canal do Cidadão</div><h1 class="title">Carta Institucional de Reconhecimento</h1><div class="protocol">Protocolo ${esc(protocol)}</div></section>
  <section class="recipient"><span>Destinatário</span><strong>${esc(recipient.name)}</strong>${recipient.role ? `<em>${esc(recipient.role)}</em>` : ''}</section>
  <p class="intro">O Conselho Municipal de Saúde de Eldorado/MS encaminha este reconhecimento recebido por meio do Canal do Cidadão, em valorização ao atendimento e ao trabalho prestado à população.</p>
  <section>
    <div class="recognition-label">Reconhecimento recebido</div>
    <h2 class="subject">${esc(subject)}</h2>
    <div class="quote">${esc(quote)}</div>
    ${contextParts.length ? `<div class="context">${contextParts.join('')}</div>` : ''}
  </section>
  <div class="recognition"><strong>Reconhecer também é cuidar.</strong>O Conselho Municipal de Saúde valoriza profissionais, equipes e serviços que contribuem positivamente para o atendimento à população.</div>
  <div class="signature"><div class="line"></div><strong>Presidência do Conselho Municipal de Saúde</strong><span>Eldorado/MS</span></div>
  <footer class="footer"><span>Emitido em ${esc(generatedAt)}</span><span>${esc(protocol)} · Canal do Cidadão</span></footer>
</main>
<script>setTimeout(function(){window.print()},700);<\/script>
</body></html>`;
  }

  function buildGeneralDocument() {
    const type = typeInfo();
    const protocol = text('detailProtocol');
    const metaParts = text('detailMeta').split('·').map((part) => part.trim()).filter(Boolean);
    const receivedAt = metaParts[1] || '';
    const status = text('detailStatus');
    const subject = text('detailSubject') || type.label;
    const service = stripService(text('detailService'));
    const description = text('detailDescription');
    const generatedAt = formatNow();
    const logo = `${location.origin}/assets/Conselho-de-saude-contornado.png?v=20260821-2`;
    const palette = type.key === 'denuncia'
      ? { accent:'#a4444d', accent2:'#cf7780', soft:'#fff4f5', border:'#eccbd0', title:'#74333a' }
      : type.key === 'reclamacao'
        ? { accent:'#9d701e', accent2:'#d3a44a', soft:'#fff8ea', border:'#ead6aa', title:'#694b14' }
        : { accent:'#246f91', accent2:'#56a5c4', soft:'#eef8fc', border:'#c9e0ea', title:'#1d536d' };
    const heading = `Registro Institucional de ${type.label}`;
    const circulation = type.key === 'denuncia'
      ? '<div class="restricted">DOCUMENTO DE CIRCULAÇÃO INSTITUCIONAL — conteúdo sujeito a tratamento reservado conforme o caso.</div>'
      : '';

    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(heading)} - ${esc(protocol)}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#edf2f5;color:#233b4e;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}.screen-actions{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:12px;background:#163650}.screen-actions button{border:0;border-radius:10px;padding:11px 17px;font-size:15px;font-weight:800;cursor:pointer}.screen-actions .primary{background:#fff;color:#173b5d}.screen-actions .close{background:#dfe7ec;color:#35536a}.page{width:210mm;min-height:297mm;margin:18px auto;background:#fff;padding:18mm 18mm 16mm;box-shadow:0 12px 40px rgba(20,45,65,.15);position:relative}.topline{height:7px;border-radius:99px;background:linear-gradient(90deg,${palette.accent},${palette.accent2})}.header{display:flex;align-items:center;gap:16px;padding:18px 0 16px;border-bottom:1px solid #dce5ea}.header img{width:76px;height:76px;object-fit:contain}.org strong{display:block;font-size:20px;color:#173b5d}.org span{display:block;margin-top:4px;font-size:12px;color:#6a7d8b}.kicker{margin-top:28px;color:${palette.accent};font-size:11px;font-weight:900;letter-spacing:.14em}.title{margin:8px 0 0;color:${palette.title};font-size:30px}.subtitle{margin:8px 0 0;color:#6a7e8d;font-size:13px}.intro{margin:22px 0 0;padding:18px;border:1px solid ${palette.border};border-left:6px solid ${palette.accent};border-radius:12px;background:${palette.soft};font-size:14px;line-height:1.65}.meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.meta .cell{padding:12px;border:1px solid #dce5ea;border-radius:10px;background:#fbfdfe}.meta label{display:block;color:#788a97;font-size:10px;font-weight:900;text-transform:uppercase}.meta strong{display:block;margin-top:5px;color:#28485f;font-size:13px}.section{margin-top:24px}.section h2{margin:0 0 10px;color:#173b5d;font-size:18px}.subject{font-size:20px;font-weight:900;color:${palette.title};margin-bottom:12px}.quote{padding:18px 20px;border-radius:12px;background:${palette.soft};border:1px solid ${palette.border};font-size:15px;line-height:1.7;white-space:pre-wrap}.restricted{margin-top:18px;padding:11px 13px;border:1px solid #e3bfc3;border-radius:9px;background:#fff4f5;color:#853c44;font-size:10px;font-weight:900}.privacy{margin-top:24px;padding:13px 15px;border-radius:10px;background:#f2f6f8;color:#627887;font-size:11px;line-height:1.55}.signature{margin-top:34px;text-align:center}.signature .line{width:260px;max-width:80%;height:1px;margin:0 auto 8px;background:#8294a0}.signature strong{display:block;color:#29485f;font-size:13px}.signature span{display:block;margin-top:3px;color:#718490;font-size:11px}.footer{position:absolute;left:18mm;right:18mm;bottom:12mm;display:flex;justify-content:space-between;padding-top:9px;border-top:1px solid #dfe7eb;color:#81919b;font-size:9px}@media(max-width:820px){.page{width:auto;min-height:0;margin:0;padding:28px 22px 80px;box-shadow:none}.meta{grid-template-columns:1fr}.footer{position:static;margin-top:40px}}@media print{body{background:#fff}.screen-actions{display:none!important}.page{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}@page{size:A4;margin:16mm 17mm 15mm}}
    </style></head><body><div class="screen-actions"><button class="primary" onclick="window.print()">Salvar / imprimir PDF</button><button class="close" onclick="window.close()">Fechar</button></div><main class="page"><div class="topline"></div><header class="header"><img src="${esc(logo)}" alt="Conselho Municipal de Saúde"><div class="org"><strong>Conselho Municipal de Saúde</strong><span>Eldorado/MS · Controle social e participação cidadã</span></div></header><div class="kicker">MANIFESTAÇÃO RECEBIDA PELO CANAL DO CIDADÃO</div><h1 class="title">${esc(heading)}</h1><p class="subtitle">Protocolo ${esc(protocol)}</p><div class="intro">O Conselho Municipal de Saúde de Eldorado/MS registra abaixo uma manifestação do tipo ${esc(type.label.toLowerCase())}, recebida por meio do Canal do Cidadão, para fins de encaminhamento, ciência e acompanhamento institucional.</div><section class="meta"><div class="cell"><label>Protocolo</label><strong>${esc(protocol)}</strong></div><div class="cell"><label>Data do registro</label><strong>${esc(receivedAt || 'Não informada')}</strong></div><div class="cell"><label>Tipo</label><strong>${esc(type.label)}</strong></div><div class="cell"><label>Status no Conselho</label><strong>${esc(status || 'Não informado')}</strong></div>${service ? `<div class="cell" style="grid-column:1/-1"><label>Serviço / unidade relacionada</label><strong>${esc(service)}</strong></div>` : ''}</section><section class="section"><h2>Conteúdo da manifestação</h2><div class="subject">${esc(subject)}</div><div class="quote">${esc(description || 'Conteúdo não informado.')}</div></section>${circulation}<div class="privacy">A identidade do manifestante não é reproduzida neste documento. Dados de autenticação, conversa institucional e observações internas do Conselho também foram omitidos.</div><div class="signature"><div class="line"></div><strong>Presidência do Conselho Municipal de Saúde</strong><span>Eldorado/MS</span></div><footer class="footer"><span>Documento emitido em ${esc(generatedAt)}</span><span>${esc(protocol)} · Canal do Cidadão</span></footer></main><script>setTimeout(function(){window.print()},700);<\/script></body></html>`;
  }

  function ensureRecipientDialog() {
    let overlay = document.getElementById('praiseRecipientDialog');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'praiseRecipientDialog';
    overlay.className = 'portal-auxiliary-dialog';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <style>
        #praiseRecipientDialog{position:fixed;inset:0;z-index:10050;display:grid;place-items:center;padding:18px;background:rgba(12,31,47,.62);backdrop-filter:blur(4px);visibility:hidden;opacity:0;pointer-events:none;transition:opacity var(--portal-motion-standard,180ms) ease,visibility 0s linear var(--portal-motion-standard,180ms)}
        #praiseRecipientDialog.open{visibility:visible;opacity:1;pointer-events:auto;transition-delay:0s}
        #praiseRecipientDialog .praise-dialog{width:min(560px,100%);max-height:calc(100dvh - 36px);overflow:auto;padding:24px;border:1px solid #d8e2e8;border-radius:20px;background:#fff;box-shadow:0 22px 60px rgba(13,42,61,.28);opacity:.96;transform:translateY(8px) scale(.985);transition:opacity var(--portal-motion-standard,180ms) ease,transform var(--portal-motion-standard,180ms) var(--portal-motion-ease-out,ease)}
        #praiseRecipientDialog.open .praise-dialog{opacity:1;transform:none}
        #praiseRecipientDialog .praise-kicker{display:block;color:#8b6918;font-size:12px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}
        #praiseRecipientDialog h3{margin:6px 0 8px;color:#173b5d;font-size:25px;line-height:1.15}
        #praiseRecipientDialog p{margin:0 0 18px;color:#607687;font-size:15px;line-height:1.5}
        #praiseRecipientDialog label{display:block;margin:14px 0 6px;color:#29495f;font-size:14px;font-weight:850}
        #praiseRecipientDialog input{width:100%;min-height:52px;padding:12px 14px;border:1.5px solid #cbdbe4;border-radius:12px;background:#fff;color:#233e52;font:inherit;font-size:16px;outline:none}
        #praiseRecipientDialog input:focus{border-color:#2684ae;box-shadow:0 0 0 4px rgba(38,132,174,.13)}
        #praiseRecipientDialog .praise-suggestion{margin-top:8px;padding:9px 11px;border-radius:10px;background:#f5f8fa;color:#647986;font-size:13px;line-height:1.4}
        #praiseRecipientDialog .praise-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:10px;margin-top:20px}
        #praiseRecipientDialog button{min-height:52px;border-radius:12px;font:inherit;font-size:15px;font-weight:850;cursor:pointer}
        #praiseRecipientDialog .cancel{border:1px solid #d5dfe5;background:#fff;color:#405a6d}
        #praiseRecipientDialog .generate{border:0;background:#8e6b18;color:#fff;box-shadow:0 7px 16px rgba(142,107,24,.2)}
        @media(max-width:600px){#praiseRecipientDialog{padding:10px;align-items:end}#praiseRecipientDialog .praise-dialog{padding:20px 16px 18px;border-radius:20px 20px 12px 12px}#praiseRecipientDialog h3{font-size:24px}#praiseRecipientDialog label{font-size:16px}#praiseRecipientDialog input{min-height:58px;font-size:18px}#praiseRecipientDialog .praise-actions{grid-template-columns:1fr}#praiseRecipientDialog button{min-height:58px;font-size:17px}}
      </style>
      <form class="praise-dialog" id="praiseRecipientForm" role="dialog" aria-modal="true" aria-labelledby="praiseRecipientTitle">
        <span class="praise-kicker">Carta de reconhecimento</span>
        <h3 id="praiseRecipientTitle">Para quem será entregue?</h3>
        <p>Informe o profissional, equipe ou serviço que deve aparecer como destinatário. O sistema não tenta adivinhar o nome a partir do relato.</p>
        <label for="praiseRecipientName">Nome do profissional, equipe ou serviço</label>
        <input id="praiseRecipientName" maxlength="160" required autocomplete="off" placeholder="Ex.: Maria da Silva ou Equipe do Núcleo de Saúde">
        <label for="praiseRecipientRole">Cargo / função <span style="font-weight:500;color:#7b8d98">(opcional)</span></label>
        <input id="praiseRecipientRole" maxlength="160" autocomplete="off" placeholder="Ex.: Técnica de Enfermagem">
        <div class="praise-suggestion" id="praiseServiceSuggestion" hidden></div>
        <div class="praise-actions"><button type="button" class="cancel" id="cancelPraiseRecipient">Cancelar</button><button type="submit" class="generate">Gerar carta em PDF</button></div>
      </form>`;
    document.body.appendChild(overlay);

    const closeDialog = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    };
    overlay.closeDialog = closeDialog;
    overlay.querySelector('#cancelPraiseRecipient').addEventListener('click', closeDialog);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDialog(); });
    overlay.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeDialog();
    });
    return overlay;
  }

  function requestPraiseRecipient() {
    const overlay = ensureRecipientDialog();
    const form = overlay.querySelector('#praiseRecipientForm');
    const name = overlay.querySelector('#praiseRecipientName');
    const role = overlay.querySelector('#praiseRecipientRole');
    const suggestion = overlay.querySelector('#praiseServiceSuggestion');
    const service = stripService(text('detailService'));

    form.reset();
    if (service) {
      suggestion.hidden = false;
      suggestion.textContent = `Serviço informado no relato: ${service}`;
    } else {
      suggestion.hidden = true;
      suggestion.textContent = '';
    }
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => overlay.classList.add('open'));
    setTimeout(() => name.focus(), 30);

    form.onsubmit = (event) => {
      event.preventDefault();
      const recipientName = name.value.trim();
      if (!recipientName) {
        name.focus();
        return;
      }
      overlay.closeDialog();
      window.PortalInteractions?.endTask?.(event.submitter || form.querySelector('.generate'));
      openDocument(buildPraiseDocument({ name: recipientName, role: role.value.trim() }));
    };
  }

  function openPdfView() {
    if (!text('detailProtocol') || byId('detailContent')?.hidden) return;
    if (typeInfo().key === 'elogio') {
      requestPraiseRecipient();
      return;
    }
    openDocument(buildGeneralDocument());
  }

  button.addEventListener('click', openPdfView);
  new MutationObserver(syncButton).observe(meta, { childList:true, characterData:true, subtree:true });
  syncButton();
})();
