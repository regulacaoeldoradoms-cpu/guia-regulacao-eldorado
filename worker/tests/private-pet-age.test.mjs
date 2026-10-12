import test from 'node:test';
import assert from 'node:assert/strict';
import {validBirthDate, portalCalendarDate, privatePetAgeStatus} from '../private-pet-age.js';
import {gnomeReadingDuration} from '../../js/gnome-reading-time.js';
import {GNOME_PHRASE_CATALOG} from '../../_server/gnome-phrases.js';

test('private age policy rejects missing, future and impossible dates', () => {
  for (const value of [null, undefined, '', '2008-2-01', '2008-02-30', '1900-02-29', '2026-10-13', '2008-00-01', {}, '2008-01-01T00:00:00Z']) {
    assert.equal(privatePetAgeStatus(value, '2026-10-12'), 'unknown');
  }
  assert(validBirthDate('2000-02-29'));
});
test('access starts on the eighteenth calendar birthday', () => {
  assert.equal(privatePetAgeStatus('2008-10-13', '2026-10-12'), 'underage');
  assert.equal(privatePetAgeStatus('2008-10-12', '2026-10-12'), 'adult');
  assert.equal(privatePetAgeStatus('2008-10-11', '2026-10-12'), 'adult');
  assert.equal(privatePetAgeStatus('2008-02-29', '2026-02-28'), 'underage');
  assert.equal(privatePetAgeStatus('2008-02-29', '2026-03-01'), 'adult');
});
test('portal calendar prevents UTC midnight granting early access', () => {
  const before = portalCalendarDate(new Date('2026-10-12T03:59:59Z'));
  const after = portalCalendarDate(new Date('2026-10-12T04:00:00Z'));
  assert.equal(before, '2026-10-11');
  assert.equal(after, '2026-10-12');
  assert.equal(privatePetAgeStatus('2008-10-12', before), 'underage');
  assert.equal(privatePetAgeStatus('2008-10-12', after), 'adult');
});
test('each phrase gets reading time, including long phrases without a cap', () => {
  assert.equal(gnomeReadingDuration('Olá.'), 6000);
  assert.equal(gnomeReadingDuration(Array(30).fill('palavra').join(' ')), 12000);
  assert.equal(gnomeReadingDuration(Array(600).fill('palavra').join(' ')), 202000);
  assert(gnomeReadingDuration(Array(40).fill('palavra').join(' ')) > gnomeReadingDuration(Array(30).fill('palavra').join(' ')));
  assert.equal(gnomeReadingDuration('Olá.', {wordsPerMinute:0, marginMs:-1, minimumMs:Infinity}), 6000);
});
test('approved repertoire has 54 unique phrases and distinct stable identifiers', () => {
  assert.equal(GNOME_PHRASE_CATALOG.length, 54);
  assert.equal(new Set(GNOME_PHRASE_CATALOG.map(p => p.id)).size, 54);
  assert.equal(new Set(GNOME_PHRASE_CATALOG.map(p => p.text)).size, 54);
  for (const {text} of GNOME_PHRASE_CATALOG) assert(gnomeReadingDuration(text) >= 6000);
});
