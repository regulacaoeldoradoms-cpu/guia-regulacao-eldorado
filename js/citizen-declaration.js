'use strict';

(() => {
  const auth = window.RegulationAuth;
  if (!auth) return;

  const typeLabels = {
    sugestao: 'Sugestão',
    reclamacao: 'Reclamação',
    elogio: 'Elogio',
    denuncia: 'Denúncia'
  };
  const statusLabels = {
    recebida: 'Recebida',
    em_analise: 'Em análise',
    aguardando_cidadao: 'Aguardando resposta do cidadão',
    encaminhada: 'Encaminhada',
    aguardando_retorno: 'Aguardando retorno',
    respondida: 'Respondida',
    concluida: 'Concluída',
    arquivada: 'Arquivada'
  };
  const privacyLabels = {
    anonima: 'Anônima',
    sigilosa: 'Sigilosa',
    identificada: 'Identificada'
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Campo_Grande',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function currentProtocol() {
    const value = String(document.getElementById('detailProtocol')?.textContent || '').trim();
    return /^CMS-\d{4}-\d{6}$/.test(value) ? value : '';
  }

  function identityBlock(item) {
    if (item?.privacyMode !== 'identificada' || !item.authorIdentity) return '';
    const identity = item.authorIdentity;
    const profileParts = [];
    if (identity.handle) profileParts.push(`@${identity.handle}`);
    if (identity.jobTitle) profileParts.push(identity.jobTitle);
    else if (identity.roleLabel) profileParts.push(identity.roleLabel);
    return `
      <div class="field full"><span>Identificação declarada</span><strong>${escapeHtml(identity.displayName || 'Usuário identificado')}</strong>${profileParts.length ? `<small>${escapeHtml(profileParts.join(' · '))}</small>` : ''}</div>`;
  }

  function declarationHtml(item) {
    const issuedAt = formatDate(new Date().toISOString());
    const service = String(item.service || '').trim();
    const identity = identityBlock(item);
    const title = `Declaração ${item.protocol}`;
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root{font-family:Arial,Helvetica,sans-serif;color:#17364f;background:#eef3f7}
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#eef3f7}.actions{max-width:820px;margin:0 auto 14px;display:flex;gap:10px;justify-content:flex-end}.actions button{border:1px solid #b9c9d6;border-radius:9px;padding:10px 14px;background:#fff;color:#17364f;font-weight:700;cursor:pointer}.actions .primary{background:#146da3;color:#fff;border-color:#146da3}.paper{width:100%;max-width:820px;min-height:1120px;margin:0 auto;background:#fff;padding:52px 58px;box-shadow:0 12px 36px rgba(22,53,77,.14);border:1px solid #dce5ec}.head{display:flex;align-items:center;gap:20px;padding-bottom:22px;border-bottom:2px solid #174f78}.head img{width:96px;height:96px;object-fit:contain;flex:0 0 96px}.head strong{display:block;font-size:18px;color:#174f78}.head span{display:block;margin-top:4px;font-size:12px;color:#60778a}.kicker{text-align:center;margin-top:48px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:800;color:#52758e}.paper h1{text-align:center;font-size:22px;line-height:1.25;margin:8px 0 28px;color:#17364f}.intro{font-size:14px;line-height:1.7;text-align:justify;color:#334f63;margin:0 0 26px}.protocol{border:2px solid #174f78;background:#f5f9fc;border-radius:12px;text-align:center;padding:20px;margin:20px 0 26px}.protocol span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#668095;font-weight:800}.protocol strong{display:block;font-size:27px;letter-spacing:.04em;color:#123f62;margin-top:5px}.grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #dce5ec;border-radius:12px;overflow:hidden}.field{padding:15px 17px;border-right:1px solid #e1e8ee;border-bottom:1px solid #e1e8ee;min-height:76px}.field:nth-child(even){border-right:0}.field.full{grid-column:1/-1;border-right:0}.field span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.07em;font-weight:800;color:#708797;margin-bottom:6px}.field strong{display:block;font-size:14px;color:#213f55;line-height:1.4}.field small{display:block;margin-top:4px;color:#63798a;line-height:1.35}.note{margin-top:28px;border-left:4px solid #7395ad;background:#f7f9fb;padding:14px 16px;color:#526a7b;font-size:12px;line-height:1.55}.issued{margin-top:46px;text-align:right;color:#536a7b;font-size:12px;line-height:1.6}.signature{margin:28px auto 0;text-align:center;color:#536a7b;break-inside:avoid;page-break-inside:avoid}.signature img{display:block;width:auto;max-width:210px;height:auto;max-height:64px;object-fit:contain;margin:0 auto -2px}.signature .line{width:250px;max-width:76%;border-top:1px solid #8da1af;margin:0 auto 7px}.signature strong{display:block;font-size:12px;color:#35546a;line-height:1.3}.signature span{display:block;margin-top:2px;font-size:10px;color:#738896}.footer{margin-top:24px;padding-top:14px;border-top:1px solid #dce5ec;text-align:center;color:#718493;font-size:10px;line-height:1.55}.footer strong{display:block;color:#4e687b;font-size:11px;margin-bottom:3px}@media(max-width:650px){body{padding:0}.actions{padding:12px;margin:0;background:#eef3f7;position:sticky;top:0}.actions button{flex:1}.paper{min-height:0;border:0;box-shadow:none;padding:34px 24px}.head{gap:14px}.head img{width:72px;height:72px;flex-basis:72px}.grid{grid-template-columns:1fr}.field,.field:nth-child(even){border-right:0}.field.full{grid-column:auto}.paper h1{font-size:19px}.protocol strong{font-size:22px}.signature img{max-width:190px;max-height:58px}}
    @media print{
      @page{size:A4;margin:8mm}
      html,body{width:auto;height:auto;margin:0;padding:0;background:#fff}
      .actions{display:none}
      .paper{max-width:none;min-height:0;height:auto;margin:0;border:0;box-shadow:none;padding:0;overflow:visible}
      .head{gap:14px;padding:0 0 12px}
      .head img{width:72px;height:72px;flex-basis:72px}
      .head strong{font-size:15px}
      .head span{font-size:10px}
      .kicker{margin-top:20px;font-size:9px}
      .paper h1{font-size:18px;line-height:1.2;margin:5px 0 15px}
      .intro{font-size:11px;line-height:1.45;margin:0 0 14px}
      .protocol{padding:10px;margin:12px 0 14px;border-radius:8px}
      .protocol span{font-size:9px}
      .protocol strong{font-size:22px;margin-top:3px}
      .grid{break-inside:avoid;page-break-inside:avoid}
      .field{padding:9px 11px;min-height:52px}
      .field span{font-size:8px;margin-bottom:3px}
      .field strong{font-size:11px;line-height:1.25}
      .field small{font-size:9px}
      .note{break-inside:avoid;page-break-inside:avoid;margin-top:14px;padding:9px 11px;font-size:9.5px;line-height:1.4}
      .issued{break-inside:avoid;page-break-inside:avoid;margin-top:14px;font-size:9.5px;line-height:1.45}
      .signature{margin-top:13px}
      .signature img{max-width:170px;max-height:44px;margin-bottom:-2px}
      .signature .line{width:210px;margin-bottom:5px}
      .signature strong{font-size:9px}
      .signature span{font-size:8px;margin-top:1px}
      .footer{break-inside:avoid;page-break-inside:avoid;margin-top:10px;padding-top:8px;font-size:8.5px;line-height:1.35}
      .footer strong{font-size:9px;margin-bottom:2px}
    }
  </style>
</head>
<body>
  <div class="actions">
    <button type="button" onclick="window.close()">Fechar</button>
    <button class="primary" type="button" onclick="window.print()">Imprimir / salvar em PDF</button>
  </div>
  <main class="paper">
    <header class="head">
      <img src="/assets/conselho-municipal-saude-eldorado.png?v=20260819-1" alt="Conselho Municipal de Saúde de Eldorado/MS">
      <div><strong>Conselho Municipal de Saúde de Eldorado/MS</strong><span>Canal do Cidadão · registro eletrônico de manifestação</span></div>
    </header>

    <div class="kicker">Documento de comprovação</div>
    <h1>DECLARAÇÃO DE REGISTRO DE MANIFESTAÇÃO</h1>

    <p class="intro">Declaramos, para fins de comprovação, que foi registrada no Canal do Cidadão do Conselho Municipal de Saúde de Eldorado/MS a manifestação identificada abaixo, permanecendo seu acompanhamento vinculado ao respectivo protocolo eletrônico.</p>

    <div class="protocol"><span>Protocolo</span><strong>${escapeHtml(item.protocol)}</strong></div>

    <section class="grid">
      <div class="field"><span>Data e hora do registro</span><strong>${escapeHtml(formatDate(item.createdAt))}</strong></div>
      <div class="field"><span>Tipo de manifestação</span><strong>${escapeHtml(typeLabels[item.type] || item.type || 'Não informado')}</strong></div>
      <div class="field full"><span>Assunto</span><strong>${escapeHtml(item.subject || 'Não informado')}</strong></div>
      ${service ? `<div class="field full"><span>Serviço ou unidade relacionada</span><strong>${escapeHtml(service)}</strong></div>` : ''}
      <div class="field"><span>Privacidade registrada</span><strong>${escapeHtml(privacyLabels[item.privacyMode] || item.privacyMode || 'Não informada')}</strong></div>
      <div class="field"><span>Situação na emissão</span><strong>${escapeHtml(statusLabels[item.status] || item.status || 'Não informada')}</strong></div>
      ${identity}
    </section>

    <div class="note"><strong>Finalidade deste documento.</strong> Esta declaração comprova exclusivamente o registro da manifestação e a existência do protocolo acima. Não representa decisão, deferimento, parecer, conclusão ou resposta de mérito do Conselho Municipal de Saúde.</div>

    <div class="issued">Documento emitido eletronicamente em <strong>${escapeHtml(issuedAt)}</strong>.<br>O protocolo pode ser conferido pelo titular, mediante autenticação, na área <strong>Minhas manifestações</strong> do portal.</div>

    <div class="signature">
      <img src="/assets/assinatura-elizabete-menezes.png?v=20260828-1" alt="Assinatura da Presidência do Conselho Municipal de Saúde">
      <div class="line"></div>
      <strong>Presidência do Conselho Municipal de Saúde</strong>
      <span>Eldorado/MS</span>
    </div>

    <footer class="footer"><strong>Conselho Municipal de Saúde · Eldorado/MS</strong>Canal do Cidadão · regulacaoeldoradoms.com.br<br>Documento gerado eletronicamente a partir dos dados registrados no protocolo.</footer>
  </main>
</body>
</html>`;
  }

  function loadingHtml(protocol) {
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gerando declaração</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#eef3f7;font-family:Arial,sans-serif;color:#294a62}.box{background:#fff;border:1px solid #dbe5ec;border-radius:14px;padding:28px;max-width:420px;text-align:center;box-shadow:0 12px 36px rgba(22,53,77,.12)}strong{display:block;font-size:18px;margin-bottom:8px}span{font-size:13px;color:#6a8091}</style></head><body><div class="box"><strong>Gerando declaração...</strong><span>Protocolo ${escapeHtml(protocol)}</span></div></body></html>`;
  }

  function errorHtml(message) {
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Declaração indisponível</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#eef3f7;font-family:Arial,sans-serif;color:#294a62}.box{background:#fff;border:1px solid #e0caca;border-radius:14px;padding:28px;max-width:460px;text-align:center}button{margin-top:16px;border:1px solid #b9c9d6;border-radius:9px;padding:10px 14px;background:#fff;color:#17364f;font-weight:700}</style></head><body><div class="box"><strong>Não foi possível gerar a declaração.</strong><p>${escapeHtml(message)}</p><button type="button" onclick="window.close()">Fechar</button></div></body></html>`;
  }

  function writeDocument(target, html) {
    target.document.open();
    target.document.write(html);
    target.document.close();
  }

  function declarationButtonHtml(label = 'Emitir declaração') {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/><path d="M9 12h6M9 15h6M9 18h4"/></svg><span>${escapeHtml(label)}</span>`;
  }

  function ensureDeclarationButtonStyle() {
    if (document.getElementById('declarationButtonStyle')) return;
    const style = document.createElement('style');
    style.id = 'declarationButtonStyle';
    style.textContent = `
      #issueManifestationDeclaration{
        margin-left:auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        background:#465a3a;
        border-color:#394b30;
        color:#fff;
        box-shadow:0 4px 12px rgba(52,68,45,.20);
        font-weight:800;
      }
      #issueManifestationDeclaration:hover:not(:disabled){
        background:#35462d;
        border-color:#2f3e28;
        color:#fff;
        box-shadow:0 6px 16px rgba(45,59,39,.26);
      }
      #issueManifestationDeclaration:focus-visible{
        outline:3px solid rgba(70,90,58,.32);
        outline-offset:2px;
      }
      #issueManifestationDeclaration:disabled{
        background:#778273;
        border-color:#697466;
        color:#fff;
        opacity:.78;
      }
      #issueManifestationDeclaration svg{
        width:18px;
        height:18px;
        flex:0 0 18px;
        fill:none;
        stroke:currentColor;
        stroke-width:1.8;
        stroke-linecap:round;
        stroke-linejoin:round;
      }
      @media(max-width:560px){
        #issueManifestationDeclaration{margin-left:0;width:100%;}
      }
    `;
    document.head.appendChild(style);
  }

  async function issueDeclaration(button) {
    const protocol = currentProtocol();
    if (!protocol) return;

    const target = window.open('', '_blank');
    if (!target) {
      window.alert('O navegador bloqueou a abertura da declaração. Permita pop-ups para este site e tente novamente.');
      return;
    }
    writeDocument(target, loadingHtml(protocol));

    const originalHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = declarationButtonHtml('Gerando declaração...');
    try {
      const payload = await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}?as=citizen`, { method: 'GET' });
      if (!payload?.manifestation) throw new Error('Manifestação não encontrada.');
      writeDocument(target, declarationHtml(payload.manifestation));
      target.focus();
    } catch (error) {
      writeDocument(target, errorHtml(error.message || 'Não foi possível consultar os dados do protocolo.'));
    } finally {
      button.disabled = false;
      button.innerHTML = originalHtml;
    }
  }

  function ensureDeclarationButton() {
    const chips = document.querySelector('#manifestationDetailModal .detail-chips');
    if (!chips) return;
    ensureDeclarationButtonStyle();
    let button = document.getElementById('issueManifestationDeclaration');
    if (!button) {
      button = document.createElement('button');
      button.id = 'issueManifestationDeclaration';
      button.type = 'button';
      button.className = 'portal-button declaration-action';
      button.innerHTML = declarationButtonHtml();
      button.addEventListener('click', () => issueDeclaration(button));
      chips.appendChild(button);
    }
    button.hidden = !currentProtocol();
  }

  const protocolNode = document.getElementById('detailProtocol');
  if (protocolNode) {
    new MutationObserver(ensureDeclarationButton).observe(protocolNode, { childList: true, characterData: true, subtree: true });
  }
  const detailContent = document.getElementById('detailContent');
  if (detailContent) {
    new MutationObserver(ensureDeclarationButton).observe(detailContent, { attributes: true, attributeFilter: ['hidden'] });
  }
  ensureDeclarationButton();
})();