import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'js', 'home.js'), 'utf8');
const loadingCss = fs.readFileSync(path.join(root, 'css', 'home-loading.css'), 'utf8');
const openingVideo = fs.readFileSync(path.join(root, 'assets', 'portal-opening-v1.mp4'));

test('o binário oficial da abertura é exatamente o arquivo aprovado', () => {
  assert.equal(openingVideo.byteLength, 2393970);
  assert.equal(
    crypto.createHash('sha256').update(openingVideo).digest('hex'),
    '98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766'
  );
});

test('a abertura pós-login mantém o loader legado como fallback', () => {
  assert.match(index, /__PORTAL_POST_LOGIN_OPENING_PENDING__/);
  assert.ok(index.includes("source.origin === location.origin && /^\\/login\\/?$/.test(source.pathname)"));
  assert.match(index, /id="homeLoading"/);
  assert.match(index, /home-loading-spinner/);
  assert.match(loadingCss, /\.home-loading-spinner/);
  assert.match(index, /\/js\/home\.js\?v=20260917-1/);
});

test('o vídeo oficial abre em tela cheia, com som e sem corte por temporizador', () => {
  assert.match(home, /\/assets\/portal-opening-v1\.mp4\?v=20260917-1/);
  assert.match(home, /object-fit:\s*cover/);
  assert.match(home, /video\.muted\s*=\s*false/);
  assert.match(home, /video\.defaultMuted\s*=\s*false/);
  assert.match(home, /video\.volume\s*=\s*1/);
  assert.doesNotMatch(home, /video\.muted\s*=\s*true/);
  assert.match(home, /video\.addEventListener\('ended'/);
  assert.match(home, /Iniciar abertura com som/);
  assert.match(home, /NotAllowedError/);
});

test('a abertura usa Cache Storage e volta ao carregamento tradicional se a mídia falhar', () => {
  assert.match(index, /media-src 'self' blob:/);
  assert.match(home, /portal-opening-media-v1/);
  assert.match(home, /caches\.open\(OPENING_CACHE\)/);
  assert.match(home, /cache\.match\(OPENING_ASSET\)/);
  assert.match(home, /URL\.createObjectURL\(blob\)/);
  assert.match(home, /cache\.put\(OPENING_ASSET, response\.clone\(\)\)/);
  assert.match(home, /deleteOldOpeningCaches/);
  assert.match(home, /evictOpeningCache/);
  assert.match(home, /video\.addEventListener\('error'/);
  assert.match(home, /document\.body\.classList\.remove\('portal-opening-active', 'post-login-opening-pending'\)/);
});
