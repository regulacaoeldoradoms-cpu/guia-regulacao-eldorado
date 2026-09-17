import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const homeIndex = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const loginIndex = fs.readFileSync(path.join(root, 'login', 'index.html'), 'utf8');
const loginOpening = fs.readFileSync(path.join(root, 'js', 'login-opening.js'), 'utf8');
const loadingCss = fs.readFileSync(path.join(root, 'css', 'home-loading.css'), 'utf8');
const openingVideo = fs.readFileSync(path.join(root, 'assets', 'portal-opening-v1.mp4'));

test('o binário oficial da abertura é exatamente o arquivo aprovado', () => {
  assert.equal(openingVideo.byteLength, 2393970);
  assert.equal(
    crypto.createHash('sha256').update(openingVideo).digest('hex'),
    '98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766'
  );
});

test('o login inicia bloqueado e só referencia a abertura pré-carregada', () => {
  assert.match(loginIndex, /portal-opening-v1\.mp4\?v=20260917-1/);
  assert.match(loginIndex, /as="video"/);
  assert.match(loginIndex, /id="loginSubmit"[^>]*disabled[^>]*aria-disabled="true"/);
  assert.match(loginIndex, /Preparando abertura\.\.\./);
  assert.match(loginIndex, /\/js\/login-opening\.js\?v=20260917-1/);
});

test('a abertura é preparada integralmente antes de liberar o login', () => {
  assert.match(loginOpening, /OPENING_EXPECTED_BYTES\s*=\s*2393970/);
  assert.match(loginOpening, /response\.blob\(\)/);
  assert.match(loginOpening, /blob\.size\s*!==\s*OPENING_EXPECTED_BYTES/);
  assert.match(loginOpening, /URL\.createObjectURL\(blob\)/);
  assert.match(loginOpening, /await waitForMediaReady\(video\)/);
  assert.match(loginOpening, /submit\.disabled\s*=\s*false/);
  assert.match(loginOpening, /portal-opening-media-v1/);
  assert.match(loginOpening, /caches\.open\(OPENING_CACHE\)/);
});

test('o mesmo clique de login prepara áudio e a abertura não cria botão adicional', () => {
  assert.match(loginOpening, /primeOpeningPlayback/);
  assert.match(loginOpening, /submit\.addEventListener\('pointerdown'/);
  assert.match(loginOpening, /video\.muted\s*=\s*false/);
  assert.match(loginOpening, /video\.defaultMuted\s*=\s*false/);
  assert.match(loginOpening, /video\.volume\s*=\s*1/);
  assert.match(loginOpening, /video\.addEventListener\('ended'/);
  assert.match(loginOpening, /object-fit:cover/);
  assert.doesNotMatch(loginOpening, /Iniciar abertura com som/);
  assert.doesNotMatch(loginOpening, /portalOpeningStartWithSound/);
});

test('a autenticação aguarda a abertura e aquece o Portal em paralelo', () => {
  assert.match(loginOpening, /const originalLogin = auth\.login\.bind\(auth\)/);
  assert.match(loginOpening, /auth\.login = async/);
  assert.match(loginOpening, /await playOpeningForAuthenticatedUser\(user\)/);
  assert.match(loginOpening, /PortalPerformance\?\.warmForUser\?\.\(user, \{ immediate: true \}\)/);
});

test('a Home não dispara uma segunda abertura e preserva o loader legado', () => {
  assert.doesNotMatch(homeIndex, /__PORTAL_POST_LOGIN_OPENING_PENDING__/);
  assert.match(homeIndex, /id="homeLoading"/);
  assert.match(homeIndex, /home-loading-spinner/);
  assert.match(loadingCss, /\.home-loading-spinner/);
});

test('falha excepcional de reprodução não exige gesto extra e cai para o fluxo normal', () => {
  assert.match(loginOpening, /catch \(_\) \{\n      \/\/ Não exibe botão extra/);
  assert.match(loginOpening, /return finish\(false\)/);
  assert.match(loginOpening, /sessionStorage\.setItem\('portal-opening-played-v2', '1'\)/);
});
