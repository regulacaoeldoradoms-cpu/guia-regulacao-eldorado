import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { GMAIL_JUDICIAL_BRIDGE, bridgeRecipients, isGmailJudicialBridgeApi, normalizeBridgePayload, recipientNameTarget } from '../gmail-judicial-bridge.js';

test('rota da ponte judicial e estrita', () => {
  assert.equal(isGmailJudicialBridgeApi('/api/integrations/gmail-judicial'), true);
  assert.equal(isGmailJudicialBridgeApi('/api/integrations/gmail-judicial/extra'), false);
});

test('destinatarios padrao', () => {
  assert.deepEqual(bridgeRecipients(''), ['wellyton', 'josiane', 'lorrana.galindo']);
  assert.deepEqual(bridgeRecipients(' Wellyton, JOSIANE, lorrana.galindo, josiane '), ['wellyton', 'josiane', 'lorrana.galindo']);
});

test('converte identificador configurado em alvo de nome', () => {
  assert.equal(recipientNameTarget('Lorrana'), 'lorrana');
  assert.equal(recipientNameTarget('Wellyton.Ritter'), 'wellyton ritter');
  assert.equal(recipientNameTarget('  Josiane-Gomes  '), 'josiane gomes');
});

test('normaliza payload sem conteudo integral do email', () => {
  const value = normalizeBridgePayload({
    messageId: 'abc123',
    threadId: 'thread456',
    sender: 'Origem Judicial',
    subject: 'Comunicacao processual',
    receivedAt: '2026-09-22T13:00:00.000Z',
    body: 'ignorado'
  });
  assert.equal(value.messageId, 'abc123');
  assert.equal(value.receivedAt, '2026-09-22T13:00:00.000Z');
  assert.equal('body' in value, false);
});

test('dry run e validacao', () => {
  assert.deepEqual(normalizeBridgePayload({ dryRun: true }), { dryRun: true });
  assert.equal(normalizeBridgePayload({ receivedAt: '2026-09-22T13:00:00Z' }).error, 'MESSAGE_ID_REQUIRED');
  assert.equal(normalizeBridgePayload({ messageId: 'x', receivedAt: 'invalida' }).error, 'RECEIVED_AT_INVALID');
  assert.equal(GMAIL_JUDICIAL_BRIDGE.minimumSecretLength, 32);
});


test('Apps Script usa GmailApp nativo sem depender da Gmail API avancada', () => {
  const source = fs.readFileSync(new URL('../../scripts/gmail-judicial/Code.gs', import.meta.url), 'utf8');
  assert.match(source, /GmailApp\.search/);
  assert.match(source, /GmailApp\.getUserLabelByName/);
  assert.match(source, /LockService\.getScriptLock/);
  assert.match(source, /PORTAL_JUDICIAL_SENT_IDS_V1/);
  assert.doesNotMatch(source, /gmail\.googleapis\.com/);
  assert.doesNotMatch(source, /ScriptApp\.getOAuthToken/);
});
