import test from 'node:test';
import assert from 'node:assert/strict';

import { GMAIL_JUDICIAL_BRIDGE, bridgeRecipients, isGmailJudicialBridgeApi, normalizeBridgePayload, recipientNameTarget } from '../gmail-judicial-bridge.js';

test('rota da ponte judicial e estrita', () => {
  assert.equal(isGmailJudicialBridgeApi('/api/integrations/gmail-judicial'), true);
  assert.equal(isGmailJudicialBridgeApi('/api/integrations/gmail-judicial/extra'), false);
});

test('destinatarios padrao', () => {
  assert.deepEqual(bridgeRecipients(''), ['wellyton', 'josiane', 'lorrana']);
  assert.deepEqual(bridgeRecipients(' Wellyton, JOSIANE, lorrana, josiane '), ['wellyton', 'josiane', 'lorrana']);
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
