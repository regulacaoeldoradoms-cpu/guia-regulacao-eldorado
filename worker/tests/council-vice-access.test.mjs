'use strict';

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  councilViceOfficeName,
  councilViceUnderlyingRole
} from '../council-vice-access.js';
import {
  isCouncilMemberReadOnly,
  protectMemberPayload
} from '../council-access-policy.js';

test('vice-presidência usa papel-base de membro', () => {
  assert.equal(councilViceOfficeName(), 'vice_presidente');
  assert.equal(councilViceUnderlyingRole(), 'membro');
  assert.equal(isCouncilMemberReadOnly({ role: 'cidadao', councilRole: councilViceUnderlyingRole() }, true), true);
});

test('vice-presidente não recebe identidade mesmo em manifestação identificada', () => {
  const payload = protectMemberPayload({
    manifestation: {
      protocol: 'CMS-2026-000999',
      privacyMode: 'identificada',
      authorUsername: 'manifestante',
      authorLabel: 'Pessoa Identificada',
      authorIdentity: {
        displayName: 'Pessoa Identificada',
        handle: 'manifestante',
        jobTitle: 'Cargo informado'
      }
    },
    messages: [{ senderType: 'citizen', senderLabel: 'Pessoa Identificada', body: 'Mensagem' }],
    events: [{ actorType: 'user', actorLabel: 'Pessoa Identificada', detail: 'Criação' }],
    internalNotes: [{ body: 'Nota interna' }],
    attachments: [{ id: 'anexo_1', displayName: 'arquivo.pdf' }]
  });

  assert.equal(payload.manifestation.privacyMode, 'anonima');
  assert.equal(payload.manifestation.authorLabel, 'Manifestante anônimo');
  assert.equal('authorUsername' in payload.manifestation, false);
  assert.equal('authorIdentity' in payload.manifestation, false);
  assert.equal(payload.messages[0].senderLabel, 'Manifestante anônimo');
  assert.equal(payload.events[0].actorLabel, 'Manifestante anônimo');
  assert.deepEqual(payload.internalNotes, []);
  assert.deepEqual(payload.attachments, []);
  assert.equal(payload.accessPolicy.canIdentifyAuthor, false);
  assert.equal(payload.accessPolicy.canInteract, false);
  assert.equal(payload.accessPolicy.canViewAttachments, false);
  assert.equal(payload.accessPolicy.canViewInternalNotes, false);
});
