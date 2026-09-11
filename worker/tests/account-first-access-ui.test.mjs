import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('primeiro acesso usa Segurança como etapa obrigatória sem enfraquecer autenticação', () => {
  const securityPage = read('seguranca/index.html');
  const security = read('js/security.js');
  const login = read('js/login.js');
  const auth = read('js/auth-client.js');
  const worker = read('worker/auth-management-v2.js');

  assert.match(securityPage, /id="changePasswordForm"/);
  assert.match(securityPage, /id="currentPassword"/);
  assert.match(securityPage, /id="newPassword"[^>]*minlength="8"/);
  assert.match(securityPage, /id="confirmPassword"[^>]*minlength="8"/);
  assert.match(securityPage, /id="firstAccessNotice"/);
  assert.match(security, /user\.mustChangePassword === true/);
  assert.match(security, /security-first-access/);
  assert.match(security, /Senha alterada com sucesso\. Abrindo seu ambiente/);
  assert.match(login, /\/seguranca\/\?primeiro-acesso=1/);
  assert.match(auth, /\/seguranca\/\?verificar-email=1/);
  assert.match(worker, /must_change_password = 0/);
  assert.match(worker, /session_version = session_version \+ 1/);
});

test('confirmação de e-mail também permanece concentrada em Segurança', () => {
  const page = read('seguranca/index.html');
  const client = read('js/security.js');
  const safety = read('worker/portal-safety.js');
  const firebase = read('worker/firebase-gateway.js');

  assert.match(page, /id="securityEmailForm"/);
  assert.match(page, /id="sendEmailVerification"/);
  assert.match(client, /email-verificado/);
  assert.match(client, /verificar-email/);
  assert.match(safety, /verificationPath: '\/seguranca\/\?verificar-email=1'/);
  assert.match(firebase, /regulacaoeldoradoms\.com\.br\/seguranca\/\?email-verificado=1/);
});

test('/conta/ é somente compatibilidade e redistribui para rotas especializadas', () => {
  const legacy = read('conta/index.html');
  assert.match(legacy, /destination = '\/perfil\/'/);
  assert.match(legacy, /destination = '\/seguranca\/'/);
  assert.match(legacy, /destination = `\/configuracoes\//);
  assert.match(legacy, /destination = '\/conquistas\/'/);
  assert.doesNotMatch(legacy, /id="(?:changePasswordForm|securityEmailForm|profilePhotoInput|socialPreferencesCard)"/);
});

test('cache do portal é renovado para entregar as novas rotas', () => {
  const sw = read('portal-sw.js');
  assert.match(sw, /const CACHE_VERSION = '20260911-8'/);
  assert.match(sw, /'\/seguranca\/'/);
  assert.match(sw, /'\/configuracoes\/'/);
  assert.match(sw, /'\/conquistas\/'/);
});
