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
    const type = typeInfo();
    const praise = type.key === 'elogio';
    button.textContent = praise ? 'Carta de elogio (PDF)' : 'Salvar manifestação em PDF';
    button.classList.toggle('is-praise', praise);
    const hint = document.getElementById('exportManifestationHint');
    if (hint) {
      hint.textContent = praise
        ? 'Gera uma carta institucional de reconhecimento pronta para entregar ao profissional ou serviço elogiado.'
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

  function buildDocument() {
    const type = typeInfo();
    const praise = type.key === 'elogio';
    const protocol = text('detailProtocol');
    const metaParts = text('detailMeta').split('·').map((part) => part.trim()).filter(Boolean);
    const receivedAt = metaParts[1] || '';
    const status = text('detailStatus');
    const privacy = text('detailPrivacy');
    const subject = text('detailSubject') || type.label;
    const service = stripService(text('detailService'));
    const description = text('detailDescription');
    const generatedAt = formatNow();
    const logo = `${location.origin}/assets/Conselho-de-saude-contornado.png?v=20260821-2`;

    const palette = praise
      ? { accent:'#9a7418', accent2:'#d6b44f', soft:'#fff9e6', border:'#e5d59f', title:'#5d4814' }
      : type.key === 'denuncia'
        ? { accent:'#a4444d', accent2:'#cf7780', soft:'#fff4f5', border:'#eccbd0', title:'#74333a' }
        : type.key === 'reclamacao'
          ? { accent:'#9d701e', accent2:'#d3a44a', soft:'#fff8ea', border:'#ead6aa', title:'#694b14' }
          : { accent:'#246f91', accent2:'#56a5c4', soft:'#eef8fc', border:'#c9e0ea', title:'#1d536d' };

    const heading = praise ? 'Carta Institucional de Reconhecimento' : `Registro Institucional de ${type.label}`;
    const kicker = praise ? 'RECONHECIMENTO RECEBIDO PELO CANAL DO CIDADÃO' : 'MANIFESTAÇÃO RECEBIDA PELO CANAL DO CIDADÃO';
    const intro = praise
      ? 'O Conselho Municipal de Saúde de Eldorado/MS registra, por meio desta carta, uma manifestação de elogio recebida em seu Canal do Cidadão. Este documento tem a finalidade de dar ciência e valorizar o reconhecimento dirigido ao atendimento, profissional, equipe ou serviço mencionado no relato.'
      : `O Conselho Municipal de Saúde de Eldorado/MS registra abaixo uma manifestação do tipo ${type.label.toLowerCase()}, recebida por meio do Canal do Cidadão, para fins de encaminhamento, ciência e acompanhamento institucional.`;
    const privacyNote = praise
      ? 'A identidade do manifestante não é reproduzida nesta carta, preservando sua privacidade. O protocolo permite a rastreabilidade institucional do registro.'
      : 'A identidade do manifestante não é reproduzida neste documento. Dados de autenticação, conversa institucional e observações internas do Conselho também foram omitidos.';
    const circulation = type.key === 'denuncia'
      ? '<div class="restricted">DOCUMENTO DE CIRCULAÇÃO INSTITUCIONAL — conteúdo sujeito a tratamento reservado conforme o caso.</div>'
      : '';

    return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(heading)} - ${esc(protocol)}</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:#edf2f5;color:#233b4e;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .screen-actions{position:sticky;top:0;z-index:5;display:flex;gap:10px;justify-content:center;padding:12px;background:#163650}
  .screen-actions button{border:0;border-radius:10px;padding:11px 17px;font-size:15px;font-weight:800;cursor:pointer}.screen-actions .primary{background:#fff;color:#173b5d}.screen-actions .close{background:#dfe7ec;color:#35536a}
  .page{width:210mm;min-height:297mm;margin:18px auto;background:#fff;padding:18mm 18mm 16mm;box-shadow:0 12px 40px rgba(20,45,65,.15);position:relative}
  .topline{height:7px;border-radius:99px;background:linear-gradient(90deg,${palette.accent},${palette.accent2})}
  .header{display:flex;align-items:center;gap:16px;padding:18px 0 16px;border-bottom:1px solid #dce5ea}.header img{width:76px;height:76px;object-fit:contain}.org strong{display:block;font-size:20px;color:#173b5d}.org span{display:block;margin-top:4px;font-size:12px;color:#6a7d8b;letter-spacing:.02em}
  .kicker{margin-top:28px;color:${palette.accent};font-size:11px;font-weight:900;letter-spacing:.14em}.title{margin:8px 0 0;color:${palette.title};font-size:30px;line-height:1.14}.subtitle{margin:8px 0 0;color:#6a7e8d;font-size:13px}
  .intro{margin:22px 0 0;padding:18px;border:1px solid ${palette.border};border-left:6px solid ${palette.accent};border-radius:12px;background:${palette.soft};font-size:14px;line-height:1.65}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.meta .cell{padding:12px;border:1px solid #dce5ea;border-radius:10px;background:#fbfdfe}.meta label{display:block;color:#788a97;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.meta strong{display:block;margin-top:5px;color:#28485f;font-size:13px;line-height:1.35}
  .section{margin-top:24px}.section h2{margin:0 0 10px;color:#173b5d;font-size:18px}.subject{font-size:20px;font-weight:900;color:${palette.title};margin-bottom:12px}.quote{padding:18px 20px;border-radius:12px;background:${palette.soft};border:1px solid ${palette.border};font-size:15px;line-height:1.7;white-space:pre-wrap}.quote::before{content:'“';font-size:32px;line-height:.4;color:${palette.accent};font-family:Georgia,serif}.privacy{margin-top:24px;padding:13px 15px;border-radius:10px;background:#f2f6f8;color:#627887;font-size:11px;line-height:1.55}.restricted{margin-top:18px;padding:11px 13px;border:1px solid #e3bfc3;border-radius:9px;background:#fff4f5;color:#853c44;font-size:10px;font-weight:900;letter-spacing:.04em}
  .recognition{margin-top:26px;text-align:center;padding:20px 16px;border-top:1px solid ${palette.border};border-bottom:1px solid ${palette.border};color:${palette.title};font-size:14px;line-height:1.65}.recognition strong{display:block;margin-bottom:5px;font-size:17px}
  .signature{margin-top:34px;text-align:center}.signature .line{width:260px;max-width:80%;height:1px;margin:0 auto 8px;background:#8294a0}.signature strong{display:block;color:#29485f;font-size:13px}.signature span{display:block;margin-top:3px;color:#718490;font-size:11px}
  .footer{position:absolute;left:18mm;right:18mm;bottom:12mm;display:flex;justify-content:space-between;gap:18px;padding-top:9px;border-top:1px solid #dfe7eb;color:#81919b;font-size:9px}.footer span:last-child{text-align:right}
  @media(max-width:820px){.page{width:auto;min-height:0;margin:0;padding:28px 22px 80px;box-shadow:none}.meta{grid-template-columns:1fr}.footer{position:static;margin-top:40px}.header img{width:64px;height:64px}.title{font-size:26px}}
  @media print{body{background:#fff}.screen-actions{display:none!important}.page{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}.footer{bottom:0}@page{size:A4;margin:16mm 17mm 15mm}}
</style>
</head>
<body>
<div class="screen-actions"><button class="primary" onclick="window.print()">Salvar / imprimir PDF</button><button class="close" onclick="window.close()">Fechar</button></div>
<main class="page">
  <div class="topline"></div>
  <header class="header"><img src="${esc(logo)}" alt="Conselho Municipal de Saúde"><div class="org"><strong>Conselho Municipal de Saúde</strong><span>Eldorado/MS · Controle social e participação cidadã</span></div></header>
  <div class="kicker">${kicker}</div>
  <h1 class="title">${esc(heading)}</h1>
  <p class="subtitle">Protocolo ${esc(protocol)}</p>
  <div class="intro">${esc(intro)}</div>
  <section class="meta">
    <div class="cell"><label>Protocolo</label><strong>${esc(protocol)}</strong></div>
    <div class="cell"><label>Data do registro</label><strong>${esc(receivedAt || 'Não informada')}</strong></div>
    <div class="cell"><label>Tipo</label><strong>${esc(type.label)}</strong></div>
    <div class="cell"><label>Status no Conselho</label><strong>${esc(status || 'Não informado')}</strong></div>
    ${service ? `<div class="cell" style="grid-column:1/-1"><label>Serviço / unidade relacionada</label><strong>${esc(service)}</strong></div>` : ''}
  </section>
  <section class="section"><h2>${praise ? 'Reconhecimento registrado' : 'Conteúdo da manifestação'}</h2><div class="subject">${esc(subject)}</div><div class="quote">${esc(description || 'Conteúdo não informado.')}</div></section>
  ${praise ? '<div class="recognition"><strong>Reconhecer também é cuidar.</strong>O Conselho Municipal de Saúde valoriza o registro de experiências positivas e o reconhecimento do trabalho desenvolvido em benefício da população.</div>' : ''}
  ${circulation}
  <div class="privacy">${esc(privacyNote)}${privacy ? ` Modo de privacidade registrado no sistema: ${esc(privacy)}.` : ''}</div>
  <div class="signature"><div class="line"></div><strong>Presidência do Conselho Municipal de Saúde</strong><span>Eldorado/MS</span></div>
  <footer class="footer"><span>Documento emitido em ${esc(generatedAt)}</span><span>${esc(protocol)} · Canal do Cidadão</span></footer>
</main>
<script>setTimeout(function(){window.print()},700);<\/script>
</body></html>`;
  }

  function openPdfView() {
    if (!text('detailProtocol') || byId('detailContent')?.hidden) return;
    const popup = window.open('', '_blank');
    if (!popup) {
      window.alert('Não foi possível abrir a visualização do PDF. Verifique se o navegador está bloqueando novas janelas.');
      return;
    }
    popup.document.open();
    popup.document.write(buildDocument());
    popup.document.close();
  }

  button.addEventListener('click', openPdfView);
  new MutationObserver(syncButton).observe(meta, { childList:true, characterData:true, subtree:true });
  syncButton();
})();
