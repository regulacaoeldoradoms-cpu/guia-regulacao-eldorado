import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

test('Barra Global usa a camada comum do Portal e sessão existente', () => {
  const interactions = read('js/portal-interactions.js');
  const bootstrap = read('js/portal-global-navigation.js');
  assert.match(interactions, /portal-global-navigation\.js\?v=20260928-1/);
  assert.match(bootstrap, /portalLogout/);
  assert.match(bootstrap, /enforcementEnabled && !auth\.getToken/);
  assert.match(bootstrap, /PortalSocialNavigation/);
  assert.match(bootstrap, /PortalSocial\.getConfig/);
  assert.match(bootstrap, /data-portal-global-navigation="off"/);
});

test('desktop mantém os seis elementos definidos para a Barra Global', () => {
  const navigation = read('js/social-navigation.js');
  for (const label of ['Início','Amigos','Ferramentas','Notificações','Perfil','Pesquisar usuários']) {
    assert.match(navigation, new RegExp(label));
  }
  assert.match(navigation, /if \(socialAvailable\)/);
  assert.doesNotMatch(navigation, /if \(active\('\/'\) && socialAvailable\)/);
  assert.match(navigation, /has-global-user-search/);
  assert.match(navigation, /portal-user > a\.portal-button\[href="\/"\]/);
  assert.match(navigation, /portal-user > a\.portal-button\[href="\/ferramentas\/"\]/);
});

test('Service Worker aquece a versão nova sem alterar os endpoints sociais', () => {
  const sw = read('portal-sw.js');
  assert.match(sw, /CACHE_VERSION = '20260928-1'/);
  assert.match(sw, /portal-global-navigation\.js\?v=20260928-1/);
  assert.match(sw, /social-navigation\.js\?v=20260928-1/);
  assert.match(sw, /social-api\.js\?v=20260910-4/);
});
