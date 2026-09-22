'use strict';

const PONTE_JUDICIAL = Object.freeze({
  endpoint: 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev/api/integrations/gmail-judicial',
  labelAlerta: 'PORTAL_JUDICIAL_ALERTA',
  labelEnviado: 'PORTAL_JUDICIAL_ENVIADO',
  propertyEnviados: 'PORTAL_JUDICIAL_SENT_IDS_V1',
  maxPorExecucao: 30,
  maxIdsPersistidos: 300,
  handler: 'sincronizarJudiciaisComPortal'
});

function garantirEtiquetas_() {
  let alerta = GmailApp.getUserLabelByName(PONTE_JUDICIAL.labelAlerta);
  if (!alerta) alerta = GmailApp.createLabel(PONTE_JUDICIAL.labelAlerta);

  let enviado = GmailApp.getUserLabelByName(PONTE_JUDICIAL.labelEnviado);
  if (!enviado) enviado = GmailApp.createLabel(PONTE_JUDICIAL.labelEnviado);

  return { alerta: alerta, enviado: enviado };
}

function propriedadeObrigatoria_(nome) {
  const valor = String(PropertiesService.getScriptProperties().getProperty(nome) || '').trim();
  if (!valor) throw new Error('Propriedade obrigatoria ausente: ' + nome);
  return valor;
}

function idsEnviados_() {
  const raw = String(
    PropertiesService.getScriptProperties().getProperty(PONTE_JUDICIAL.propertyEnviados) || '[]'
  );
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean).slice(0, PONTE_JUDICIAL.maxIdsPersistidos);
  } catch (_) {
    return [];
  }
}

function salvarIdsEnviados_(ids) {
  const normalizados = Array.from(new Set((ids || []).map(String).filter(Boolean)))
    .slice(0, PONTE_JUDICIAL.maxIdsPersistidos);
  PropertiesService.getScriptProperties().setProperty(
    PONTE_JUDICIAL.propertyEnviados,
    JSON.stringify(normalizados)
  );
}

function listarMensagensPendentes_() {
  const processados = new Set(idsEnviados_());
  const query = 'label:' + PONTE_JUDICIAL.labelAlerta;
  const threads = GmailApp.search(query, 0, PONTE_JUDICIAL.maxPorExecucao);
  const pendentes = [];

  threads.forEach(function(thread) {
    const mensagens = thread.getMessages();
    if (!mensagens.length) return;

    // O monitor aplica a etiqueta quando detecta o alerta; para conversas,
    // processamos a mensagem mais recente e usamos o ID dela para idempotência.
    const mensagem = mensagens[mensagens.length - 1];
    const messageId = String(mensagem.getId() || '');
    if (!messageId || processados.has(messageId)) return;

    pendentes.push({
      messageId: messageId,
      threadId: String(thread.getId() || ''),
      sender: String(mensagem.getFrom() || '').trim(),
      subject: String(mensagem.getSubject() || '').trim() || '(sem assunto)',
      receivedAt: mensagem.getDate().toISOString(),
      thread: thread
    });
  });

  return {
    pendentes: pendentes,
    processados: Array.from(processados)
  };
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
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    const ocupado = { encontrados: 0, enviados: 0, incompletos: 0, falhas: 0, ocupado: true };
    Logger.log(JSON.stringify(ocupado));
    return ocupado;
  }

  try {
    const etiquetas = garantirEtiquetas_();
    const fila = listarMensagensPendentes_();
    const pendentes = fila.pendentes;
    const ids = fila.processados.slice();

    let enviados = 0;
    let incompletos = 0;
    let falhas = 0;

    pendentes.forEach(function(item) {
      try {
        const resultado = enviarAoPortal_({
          messageId: item.messageId,
          threadId: item.threadId,
          sender: item.sender,
          subject: item.subject,
          receivedAt: item.receivedAt
        });

        if (resultado.complete === true) {
          etiquetas.enviado.addToThread(item.thread);
          ids.unshift(item.messageId);
          enviados += 1;
        } else {
          incompletos += 1;
          console.warn('Ponte incompleta para ' + item.messageId + ': ' + JSON.stringify(resultado));
        }
      } catch (error) {
        falhas += 1;
        console.error('Falha na ponte judicial para ' + item.messageId + ': ' + error.message);
      }
    });

    if (enviados > 0) salvarIdsEnviados_(ids);

    const resumo = {
      encontrados: pendentes.length,
      enviados: enviados,
      incompletos: incompletos,
      falhas: falhas
    };
    Logger.log(JSON.stringify(resumo));
    return resumo;
  } finally {
    lock.releaseLock();
  }
}
