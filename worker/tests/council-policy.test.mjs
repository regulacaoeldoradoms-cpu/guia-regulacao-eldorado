'use strict';

import assert from 'node:assert/strict';
import test from 'node:test';

import { manifestationPrivacyMode } from '../council.js';
import {
  canDeleteManifestations,
  isCouncilMemberReadOnly,
  protectMemberPayload
} from '../council-access-policy.js';

test('conta sem e-mail verificado escolhe entre anônima e identificada', () => {
  const user = { emailVerified: false };
  assert.equal(manifestationPrivacyMode(user, ''), 'anonima');
  assert.equal(manifestationPrivacyMode(user, 'valor-invalido'), 'anonima');
  assert.equal(manifestationPrivacyMode(user, 'sigilosa'), 'anonima');
  assert.equal(manifestationPrivacyMode(user, 'identificada'), 'identificada');
});

test('conta verificada usa sigilosa como padrão e pode optar por identificada', () => {
  const user = { emailVerified: true };
  assert.equal(manifestationPrivacyMode(user, ''), 'sigilosa');
  assert.equal(manifestationPrivacyMode(user, 'valor-invalido'), 'sigilosa');
  assert.equal(manifestationPrivacyMode(user, 'sigilosa'), 'sigilosa');
  assert.equal(manifestationPrivacyMode(user, 'identificada'), 'identificada');
});

test('membro recebe payload anônimo e sem conteúdo restrito', () => {
  const payload = protectMemberPayload({
    manifestation: {
      protocol: 'CMS-2026-000001',
      privacyMode: 'identificada',
      authorUsername: 'pessoa',
      authorLabel: 'Pessoa',
      authorIdentity: { displayName: 'Pessoa', handle: 'pessoa' }
    },
    messages: [{ senderType: 'citizen', senderLabel: 'Pessoa', text: 'Relato' }],
    events: [{ actorType: 'user', actorLabel: 'Pessoa', detail: 'Criação' }],
    internalNotes: [{ text: 'Nota interna' }],
    attachments: [{ id: 'arquivo_1', displayName: 'documento.pdf' }]
  });

  assert.equal(payload.manifestation.privacyMode, 'anonima');
  assert.equal(payload.manifestation.authorLabel, 'Manifestante anônimo');
  assert.equal('authorUsername' in payload.manifestation, false);
  assert.equal('authorIdentity' in payload.manifestation, false);
  assert.equal(payload.messages[0].senderLabel, 'Manifestante anônimo');
  assert.equal(payload.events[0].actorLabel, 'Manifestante anônimo');
  assert.deepEqual(payload.internalNotes, []);
  assert.deepEqual(payload.attachments, []);
  assert.deepEqual(payload.accessPolicy, {
    mode: 'read_only_anonymous',
    canIdentifyAuthor: false,
    canInteract: false,
    canViewAttachments: false,
    canViewInternalNotes: false
  });
});

test('somente membro não técnico fica sujeito ao modo de leitura', () => {
  assert.equal(isCouncilMemberReadOnly({ role: 'cidadao', councilRole: 'membro' }, true), true);
  assert.equal(isCouncilMemberReadOnly({ role: 'admin', councilRole: 'membro' }, true), false);
  assert.equal(isCouncilMemberReadOnly({ role: 'cidadao', councilRole: 'membro' }, false), false);
});

test('exclusão institucional permanece restrita à Presidência e ao Desenvolvedor', () => {
  assert.equal(canDeleteManifestations({ role: 'cidadao', councilRole: 'presidente' }, true), true);
  assert.equal(canDeleteManifestations({ role: 'admin', councilRole: 'membro' }, true), true);
  assert.equal(canDeleteManifestations({ role: 'cidadao', councilRole: 'membro' }, true), false);
  assert.equal(canDeleteManifestations({ role: 'admin', councilRole: '' }, false), false);
});
