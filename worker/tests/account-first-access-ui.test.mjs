import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('primeiro acesso deixa a troca de senha inequívoca sem alterar a regra de autenticação', () => {
  const loader = read('js/citizen-identity-ui.js');
  const ui = read('js/account-first-access.js');
  const account = read('js/account.js');
  const worker = read('worker/auth-management-v2.js');

  assert.match(loader, /account-first-access\.js\?v=20260909-2/);
  assert.match(ui, /user\?\.mustChangePassword === true/);
  assert.match(ui, /Defina sua nova senha para continuar\./);
  assert.match(ui, /Seu acesso ainda não foi concluído\./);
  assert.match(ui, /Senha temporária atual/);
  assert.match(ui, /Salvar nova senha e continuar/);
  assert.match(ui, /Pelo menos 8 caracteres/);
  assert.match(ui, /Diferente da senha temporária/);
  assert.match(ui, /Confirmação igual à nova senha/);
  assert.match(ui, /accountHomeLink/);
  assert.match(ui, /aria-disabled/);
  assert.match(ui, /first-access-password-card/);
  assert.match(ui, /first-access-mode/);

  // A proteção continua sendo a existente: o frontend só melhora a comunicação.
  assert.match(account, /user\.mustChangePassword === true/);
  assert.match(worker, /must_change_password = 0/);
  assert.match(worker, /session_version = session_version \+ 1/);
});

test('o modo de primeiro acesso ganha contraste por camadas sem perder a hierarquia', () => {
  const ui = read('js/account-first-access.js');
  assert.match(ui, /linear-gradient\(180deg,#dfeaf2 0%,#edf4f8 50%,#e3edf3 100%\)/);
  assert.match(ui, /linear-gradient\(135deg,#e6f1f9 0%,#dff3ef 100%\)/);
  assert.match(ui, /background:linear-gradient\(135deg,#dceff5 0%,#e4f4f1 100%\)/);
  assert.match(ui, /background:linear-gradient\(180deg,#fbfdff 0%,#f3f8fb 100%\)/);
  assert.match(ui, /border:1px solid #9fb8cc!important/);
  assert.match(ui, /background:#eaf2f7/);
  assert.match(ui, /#changePasswordButton/);
});

test('o modo de primeiro acesso oculta conteúdo secundário e preserva saída', () => {
  const ui = read('js/account-first-access.js');
  assert.match(ui, /#accountLevelPanel/);
  assert.match(ui, /\.account-layout/);
  assert.match(ui, /#emailVerificationNotice/);
  assert.match(ui, /portalLogout|Sair|accountHomeLink/);
  assert.doesNotMatch(ui, /location\.replace\(['"]\/login\//);
});

test('cache do portal é renovado para entregar a nova experiência', () => {
  const sw = read('portal-sw.js');
  assert.match(sw, /const CACHE_VERSION = '20260909-3'/);
});