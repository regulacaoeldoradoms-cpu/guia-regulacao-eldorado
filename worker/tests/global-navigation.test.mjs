import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

test('Barra Global usa a camada comum do Portal e sessão existente', () => {
  const interactions = read('js/portal-interactions.js');
  const bootstrap = read('js/portal-global-navigation.js');
  assert.match(interactions, /portal-global-navigation\.js\?v=20261009-pets-1/);
  assert.match(bootstrap, /\.portal-topbar, \.site-header/);
  assert.match(bootstrap, /AUTH_CONFIG/);
  assert.match(bootstrap, /AUTH_CLIENT/);
  assert.match(bootstrap, /storedToken/);
  assert.match(bootstrap, /enforcementEnabled && !auth\.getToken/);
  assert.match(bootstrap, /PortalSocialNavigation/);
  assert.match(bootstrap, /navigationIsCurrent/);
  assert.match(bootstrap, /force: !navigationIsCurrent/);
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
  assert.match(navigation, /version: '20261009-pets-1'/);
  assert.match(navigation, /has-global-user-search/);
  assert.match(navigation, /portal-user > a\.portal-button\[href="\/"\]/);
  assert.match(navigation, /portal-user > a\.portal-button\[href="\/ferramentas\/"\]/);
  assert.match(navigation, /\.portal-topbar, \.site-header/);
  assert.match(navigation, /\.site-header \[data-portal-home\]/);
});

test('Service Worker aquece a versão nova sem alterar os endpoints sociais', () => {
  const sw = read('portal-sw.js');
  assert.match(sw, /CACHE_VERSION = '20261009-pets-3'/);
  assert.match(sw, /portal-global-navigation\.js\?v=20261009-pets-1/);
  assert.match(sw, /social-navigation\.js\?v=20261009-pets-1/);
  assert.match(sw, /social-api\.js\?v=20260910-4/);
});


test('cabeçalhos próprios do Guia Médico e Fontes técnicas entram na cobertura global', () => {
  const medico = read('medico/index.html');
  const protocolo = read('protocolo/index.html');
  assert.match(medico, /class="site-header"/);
  assert.match(medico, /portal-interactions\.js/);
  assert.match(protocolo, /class="site-header"/);
  assert.match(protocolo, /portal-interactions\.js/);
});


test('Telemedicina carrega a Barra Global diretamente e renova a camada comum', () => {
  const html = read('telemedicina/index.html');
  assert.match(html, /portal-interactions\.js\?v=20260923-2/);
  assert.match(html, /portal-global-navigation\.js\?v=20261009-pets-1/);
  assert.equal((html.match(/portal-global-navigation\.js\?v=20261009-pets-1/g) || []).length, 1);
});
