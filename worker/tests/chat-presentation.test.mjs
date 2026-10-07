import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Exercise the real client helpers without network, accounts, messages or a database.
const read = file => readFileSync(new URL('../../' + file, import.meta.url), 'utf8');
const source = read('js/portal-chat.js').replace('  window.PortalChat = Object.freeze({', `
  window.presentationFixture = { parseServerDate, messageDayKey, messageDayLabel, avatarMarkup };
  window.PortalChat = Object.freeze({`);
const window = { REGULATION_AUTH_CONFIG: { endpoint: 'https://fixture.invalid' }, RegulationAuth: {}, addEventListener() {} };
runInNewContext(source, { window, document: { readyState: 'loading', addEventListener() {} }, Date });
const ui = window.presentationFixture;

test('timestamps SQL are UTC; ISO Z and offsets are not given a second timezone', () => {
  assert.equal(ui.parseServerDate('2026-10-07 04:00:00').toISOString(), '2026-10-07T04:00:00.000Z');
  assert.equal(ui.parseServerDate('2026-10-07T04:00:00.125Z').toISOString(), '2026-10-07T04:00:00.125Z');
  assert.equal(ui.parseServerDate('2026-10-07T00:00:00-04:00').toISOString(), '2026-10-07T04:00:00.000Z');
  for (const value of ['', null, 'unknown', '2026-13-77 99:99:99']) assert.equal(ui.parseServerDate(value), null);
});

test('Hoje/Ontem use local calendar days and old messages display DD/MM/AAAA', () => {
  const now = new Date(2026, 9, 7, 0, 1);
  assert.equal(ui.messageDayLabel(new Date(2026, 9, 7, 0, 0), now), 'Hoje');
  assert.equal(ui.messageDayLabel(new Date(2026, 9, 6, 23, 59), now), 'Ontem');
  assert.equal(ui.messageDayLabel(new Date(2026, 8, 30, 12), now), '30/09/2026');
  assert.equal(ui.messageDayKey(new Date(2026, 0, 2)), '2026-01-02');
  assert.equal(ui.messageDayLabel(null, now), 'Data não disponível');
});

test('calendar boundaries handle a new month, year and a leap day', () => {
  for (const [today, yesterday] of [[new Date(2027, 0, 1), new Date(2026, 11, 31)], [new Date(2026, 10, 1), new Date(2026, 9, 31)], [new Date(2028, 2, 1), new Date(2028, 1, 29)]]) {
    assert.equal(ui.messageDayLabel(yesterday, today), 'Ontem');
  }
});

test('the same message changes from Hoje to Ontem without changing sentAt', () => {
  const sentAt = '2026-10-07 16:00:00';
  const date = ui.parseServerDate(sentAt);
  const sameDay = new Date(date.getTime());
  const nextDay = new Date(date.getTime()); nextDay.setDate(nextDay.getDate() + 1);
  assert.equal(ui.messageDayLabel(date, sameDay), 'Hoje');
  assert.equal(ui.messageDayLabel(date, nextDay), 'Ontem');
  assert.equal(date.toISOString(), '2026-10-07T16:00:00.000Z');
});

test('avatars use img content with escaped initials and the profile API allowlist', () => {
  const photo = 'data:image/png;base64,aGVsbG8=';
  const markup = ui.avatarMarkup({ name: 'Pessoa Exemplo', avatarDataUrl: photo });
  assert.match(markup, /<img class="portal-chat-avatar-image"/);
  assert.ok(markup.includes('src="' + photo + '"'));
  assert.match(markup, />PE<\/span>/);
  assert.doesNotMatch(markup, /background-image/);
  for (const avatarDataUrl of ['https://external.invalid/photo.png', 'data:image/svg+xml;base64,PHN2Zz4=', 'data:image/png;base64,x" onerror="alert(1)', 'data:image/png;base64,' + 'a'.repeat(220000)]) {
    assert.doesNotMatch(ui.avatarMarkup({ name: 'Sem Foto', avatarDataUrl }), /<img/);
  }
  assert.match(ui.avatarMarkup({ name: '< &' }), /&lt;&amp;/);
});

test('date separators are distinct from unread separators and cover every render path', () => {
  const client = read('js/portal-chat.js'), css = read('css/portal-chat.css');
  assert.match(client, /dataset\.chatSentAt = String\(message\.sentAt \|\| ''\)/);
  assert.match(client, /dataset\.chatDateDivider = day/);
  assert.match(client, /previous\?\.hasAttribute\('data-chat-unread-divider'\)/);
  assert.match(client, /function appendMessages[\s\S]*?syncMessageDateDividers\(\);/);
  assert.match(client, /function prependMessages[\s\S]*?syncMessageDateDividers\(\);/);
  assert.match(client, /existing\.replaceWith\(replacement\);\s+syncMessageDateDividers\(\);/);
  assert.match(client, /id="portalChatHeaderAvatar"/);
  assert.match(css, /portal-chat-header-avatar\[hidden\]/);
  assert.match(css, /html\[data-portal-theme="dark"\] \.portal-chat-date-divider/);
});
