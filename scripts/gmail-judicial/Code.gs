'use strict';

const PONTE_JUDICIAL = Object.freeze({
  endpoint: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev/api/integrations/gmail-judicial',
  labelAlerta: 'PORTAL_JUDICIAL_ALERTA',
  labelEnviado: 'PORTAL_JUDICIAL_ENVIADO',
  maxPorExecucao: 30,
  handler: 'sincronizarJudiciaisComPortal'
});

function garantirEtiquetas_() {
  if (!GmailApp.getUserLabelByName(PONTE_JUDICIAL.labelAlerta)) {
    GmailApp.createLabel(PONTE_JUDICIAL.labelAlerta);
  }
  if (!GmailApp.getUserLabelByName(PONTE_JUDICIAL.labelEnviado)) {
    GmailApp.createLabel(PONTE_JUDICIAL.labelEnviado);
  }
}

function propriedadeObrigatoria_(nome) {
  const valor = String(PropertiesService.getScriptProperties().getProperty(nome) || '').trim();
  if (!valor) throw new Error('Propriedade obrigatoria ausente: ' + nome);
  return valor;
}

function gmailApi_(caminho, opcoes) {
  const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + caminho;
  const base = opcoes || {};
  const headers = Object.assign({}, base.headers || {}, {
    Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
  });
  const resposta = UrlFetchApp.fetch(url, Object.assign({}, base, {
    headers: headers,
    muteHttpExceptions: true
  }));
  const codigo = resposta.getResponseCode();
  const texto = resposta.getContentText() || '';
  if (codigo < 200 || codigo >= 300) {
    throw new Error('Gmail API HTTP ' + codigo + ': ' + texto.slice(0, 500));
  }
  return texto ? JSON.parse(texto) : {};
}

function labelsPorNome_() {
  const payload = gmailApi_('/labels', { method: 'get' });
  const mapa = {};
  (payload.labels || []).forEach(function(label) {
    mapa[String(label.name || '')] = String(label.id || '');
  });
  return mapa;
}

function cabecalho_(mensagem, nome) {
  const headers = (((mensagem || {}).payload || {}).headers || []);
  const alvo = String(nome || '').toLowerCase();
  const encontrado = headers.find(function(item) {
    return String(item.name || '').toLowerCase() === alvo;
  });
  return encontrado ? String(encontrado.value || '').trim() : '';
}

function listarMensagensPendentes_() {
  const query = 'label:' + PONTE_JUDICIAL.labelAlerta + ' -label:' + PONTE_JUDICIAL.labelEnviado;
  const payload = gmailApi_(
    '/messages?q=' + encodeURIComponent(query) + '&maxResults=' + PONTE_JUDICIAL.maxPorExecucao,
    { method: 'get' }
  );
  return payload.messages || [];
}

function lerMetadadosMensagem_(messageId) {
  const path = '/messages/' + encodeURIComponent(messageId)
    + '?format=metadata'
    + '&metadataHeaders=' + encodeURIComponent('From')
    + '&metadataHeaders=' + encodeURIComponent('Subject')
    + '&metadataHeaders=' + encodeURIComponent('Date');
  return gmailApi_(path, { method: 'get' });
}

function enviarAoPortal_(payload) {
  const secret = propriedadeObrigatoria_('PORTAL_BRIDGE_SECRET');
  if (secret.length < 32) throw new Error('PORTAL_BRIDGE_SECRET precisa ter pelo menos 32 caracteres.');

  const resposta = UrlFetchApp.fetch(PONTE_JUDICIAL.endpoint, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'X-Portal-Bridge-Secret': secret
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const codigo = resposta.getResponseCode();
  const texto = resposta.getContentText() || '';
  let json = {};
  try { json = texto ? JSON.parse(texto) : {}; } catch (_) {}

  if (codigo < 200 || codigo >= 300) {
    throw new Error('Portal HTTP ' + codigo + ': ' + (json.error || texto.slice(0, 500)));
  }
  return json;
}

function marcarComoEnviado_(messageId, sentLabelId) {
  gmailApi_('/messages/' + encodeURIComponent(messageId) + '/modify', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ addLabelIds: [sentLabelId] })
  });
}

function instalarPonteJudicial() {
  garantirEtiquetas_();
  propriedadeObrigatoria_('PORTAL_BRIDGE_SECRET');

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === PONTE_JUDICIAL.handler) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger(PONTE_JUDICIAL.handler)
    .timeBased()
    .everyMinutes(5)
    .create();

  const teste = testarPonteJudicial();
  Logger.log('PONTE_JUDICIAL_INSTALADA');
  Logger.log(JSON.stringify(teste));
  return teste;
}

function testarPonteJudicial() {
  garantirEtiquetas_();
  const resultado = enviarAoPortal_({ dryRun: true });
  Logger.log(JSON.stringify(resultado));
  return resultado;
}

function sincronizarJudiciaisComPortal() {
  garantirEtiquetas_();

  const labels = labelsPorNome_();
  const sentLabelId = labels[PONTE_JUDICIAL.labelEnviado];
  if (!sentLabelId) throw new Error('Etiqueta de controle nao encontrada no Gmail.');

  const pendentes = listarMensagensPendentes_();
  let enviados = 0;
  let incompletos = 0;
  let falhas = 0;

  pendentes.forEach(function(item) {
    try {
      const mensagem = lerMetadadosMensagem_(item.id);
      const internalDate = Number(mensagem.internalDate || 0);
      const receivedAt = Number.isFinite(internalDate) && internalDate > 0
        ? new Date(internalDate).toISOString()
        : new Date().toISOString();

      const resultado = enviarAoPortal_({
        messageId: String(mensagem.id || item.id),
        threadId: String(mensagem.threadId || ''),
        sender: cabecalho_(mensagem, 'From'),
        subject: cabecalho_(mensagem, 'Subject') || '(sem assunto)',
        receivedAt: receivedAt
      });

      if (resultado.complete === true) {
        marcarComoEnviado_(item.id, sentLabelId);
        enviados += 1;
      } else {
        incompletos += 1;
        console.warn('Ponte incompleta para ' + item.id + ': ' + JSON.stringify(resultado));
      }
    } catch (error) {
      falhas += 1;
      console.error('Falha na ponte judicial para ' + item.id + ': ' + error.message);
    }
  });

  const resumo = {
    encontrados: pendentes.length,
    enviados: enviados,
    incompletos: incompletos,
    falhas: falhas
  };
  Logger.log(JSON.stringify(resumo));
  return resumo;
}
