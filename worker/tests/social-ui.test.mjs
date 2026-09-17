import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('política libera a camada social para toda conta ativa e mantém permissões e estados separados', () => {
  const policy = read('worker/social-policy.js');
  assert.match(policy, /user\?\.active !== false/);
  assert.match(policy, /toNormalizedRole\(role\) === 'admin'/);
  assert.match(policy, /if \(!principal\) return false/);
  assert.match(policy, /if \(!target\) return false/);
  assert.match(policy, /principal\.accountId === target\.accountId/);
  assert.match(policy, /socialRelationshipForConversation/);
  assert.doesNotMatch(policy, /accountLevel === 'gold'|accountLevel === 'diamond'/);
});

test('busca social inclui membros e Presidência do Conselho mesmo antes do primeiro acesso social', () => {
  const social = read('worker/social.js');
  const schema = read('worker/social-schema.js');
  assert.match(schema, /council_member/);
  assert.match(schema, /council_president/);
  assert.match(social, /COALESCE\(p\.display_name, u\.name, u\.username\)/);
  assert.match(social, /FROM users u/);
  assert.match(social, /LEFT JOIN social_profiles p ON p\.account_id = u\.id/);
  assert.match(social, /LEFT JOIN citizen_portal_accounts cpa ON cpa\.user_id = u\.id/);
  assert.match(social, /u\.active = 1/);
});

test('flag desligada contém schema, semeadura e aliases sociais', () => {
  const index = read('worker/index.js');
  assert.match(index, /socialSchemaAlreadyApplied/);
  assert.match(index, /ensureSocialSchema/);
  assert.match(index, /SOCIAL_BACKEND_ENABLED/);
  assert.match(index, /SOCIAL_HOME_ENABLED/);
});

test('novo isolate reconhece a migração social sem repetir todo o DDL', () => {
  const schema = read('worker/social-schema.js');
  assert.match(schema, /SELECT 1 AS ok FROM social_schema_migrations/);
  assert.match(schema, /INSERT OR REPLACE INTO social_schema_migrations/);
  assert.match(schema, /socialSchemaByDb\.set\(db, true\)/);
});

test('migração profissional é idempotente e preserva tombstone', () => {
  const migration = read('worker/social-schema.js');
  assert.match(migration, /professional_migration_tombstones/);
  assert.match(migration, /INSERT OR IGNORE/);
  assert.match(migration, /ON CONFLICT\(account_id\) DO UPDATE SET/);
});

test('aliases preservam links após mudança de handle', () => {
  const schema = read('worker/social-schema.js');
  const social = read('worker/social.js');
  assert.match(schema, /social_handle_aliases/);
  assert.match(social, /INSERT OR IGNORE INTO social_handle_aliases/);
  assert.match(social, /FROM social_handle_aliases a/);
});

test('Home social ativa mantém fallback independente, nova navegação e Perfil sem Conta duplicada', () => {
  const home = read('js/home.js');
  const navigation = read('js/social-navigation.js');
  const worker = read('worker/social.js');
  const flags = read('worker/wrangler.toml');
  const index = read('index.html');
  assert.match(home, /showToolsFallback/);
  assert.match(home, /loadSocialConfigWithRecovery/);
  assert.match(home, /getConfig\(10000\)/);
  assert.match(home, /getConfig\(30000\)/);
  assert.match(home, /SOCIAL_CONFIG_TIMEOUT/);
  assert.match(home, /SOCIAL_DATABASE_UNAVAILABLE/);
  assert.match(home, /SOCIAL_TEMPORARILY_UNAVAILABLE/);
  assert.match(home, /showHomeSurface\('loading'\)/);
  assert.match(home, /announceLoading\('Conectando à Camada Social'\)/);
  assert.doesNotMatch(home, /showToolsFallback\('Conectando à Camada Social/);
  assert.match(home, /if \(!socialConfig\.homeEnabled\)/);
  assert.doesNotMatch(home, /homePreference\s*===\s*['"]tools['"]/);
  assert.match(home, /Diagnóstico:/);
  assert.match(navigation, /navLink\('\/ferramentas\/', 'Ferramentas'/);
  assert.match(navigation, /navLink\('\/perfil\/', 'Perfil'/);
  assert.match(navigation, /navLink\('\/seguranca\/', 'Segurança'/);
  assert.match(navigation, /navLink\('\/configuracoes\/', 'Configurações'/);
  assert.match(navigation, /navLink\('\/conquistas\/', 'Conquistas'/);
  assert.match(navigation, /notificationButton\('Notificações'/);
  assert.match(navigation, /notificationButton\('Avisos'/);
  assert.match(navigation, /homeUserSearch/);
  assert.match(navigation, /Pesquisar usuários/);
  assert.match(navigation, /\/api\/social\/search\?q=/);
  assert.match(navigation, /if \(active\('\/'\) && socialAvailable\)/);
  assert.match(navigation, /has-home-user-search/);
  assert.match(navigation, /overflow-x:auto/);
  assert.doesNotMatch(navigation, /navLink\('\/notificacoes\/', '(?:Notificações|Avisos)'/);
  assert.doesNotMatch(navigation, /navLink\('\/conta\/', 'Conta'/);
  assert.doesNotMatch(navigation, /'Meu perfil'/);
  assert.match(index, /<nav class="social-card social-side-links" aria-label="Conta e preferências">/);
  assert.match(index, /<a href="\/seguranca\/">Segurança<\/a>/);
  assert.match(index, /<a href="\/configuracoes\/">Configurações<\/a>/);
  assert.match(index, /<a href="\/conquistas\/">Conquistas<\/a>/);
  assert.doesNotMatch(index, />Ver meu perfil<|>Amigos e pedidos<|>Notificações sociais<|>Privacidade social</);
  assert.match(index, /social-navigation\.js\?v=20260911-2/);
  assert.match(index, /home-loading\.css\?v=20260909-1/);
  assert.match(index, /\/js\/social-home\.js\?v=20260910-2/);
  const socialHome = read('js/social-home.js');
  assert.match(socialHome, /cachedProfile = config\?\.profile/);
  assert.match(socialHome, /avatarVersion: String\(cachedProfile\.avatarVersion/);
  assert.match(index, /\/js\/home\.js\?v=20260917-1/);
  assert.equal((index.match(/\/js\/home\.js\?v=20260917-1/g) || []).length, 1);
  assert.match(index, /<body class="portal-page home-loading-active">/);
  assert.match(index, /id="homeLoading"[^>]*aria-busy="true"/);
  assert.match(index, /id="toolsFallback" hidden/);
  assert.doesNotMatch(read('js/social-home.js'), /home\.hidden = false|fallback\.hidden = true/);
  assert.match(worker, /socialHomeEnabled/);
  assert.match(read('js/social-api.js'), /AbortController/);
  assert.match(read('worker/social-schema.js'), /socialSchemaAlreadyApplied/);
  assert.match(worker, /requestContext\(request, env, user\)/);
  assert.match(worker, /Promise\.all\(\[/);
  assert.match(flags, /SOCIAL_BACKEND_ENABLED = "true"/);
  assert.match(flags, /^SOCIAL_HOME_ENABLED = "true"$/m);
});

test('pedido de amizade muda para enviado imediatamente e confirma em segundo plano', () => {
  const navigation = read('js/social-navigation.js');
  assert.match(navigation, /pendingFriendRequests\.add\(profileId\)/);
  assert.match(navigation, /renderSearchResults\(currentSearchResults\)/);
  assert.match(navigation, /await api\.friendRequest\(profileId\)/);
  assert.match(navigation, /pendingFriendRequests\.delete\(profileId\)/);
});

test('Notificações abrem painel acessível na própria tela e preservam histórico completo', () => {
  const navigation = read('js/social-navigation.js');
  const css = read('css/social-notification-panel.css');
  assert.match(navigation, /notificationPanel/);
  assert.match(navigation, /notificationTrigger/);
  assert.match(navigation, /setAttribute\('aria-expanded'/);
  assert.match(navigation, /document\.addEventListener\('keydown'/);
  assert.match(navigation, /Escape/);
  assert.match(navigation, /pageSize:\s*50/);
  assert.match(css, /\.social-notification-panel/);
});

test('chat profissional continua por cargo e chat social exige amizade aceita', () => {
  const social = read('worker/social.js');
  const chat = read('worker/portal-chat-v2.js');
  assert.match(social, /socialRelationshipForConversation/);
  assert.match(social, /accepted/);
  assert.match(chat, /canChatByRole/);
});

test('Amigos pré-carrega a lista completa, deduplica páginas e usa paginação local', () => {
  const friends = read('js/social-friends.js');
  assert.match(friends, /loadAllFriends/);
  assert.match(friends, /Set/);
  assert.match(friends, /slice/);
});

test('avatar social reutiliza Cache Storage e baixa novamente somente quando a versão muda', () => {
  const avatar = read('js/social-avatar-cache.js');
  assert.match(avatar, /caches\.open/);
  assert.match(avatar, /avatarVersion/);
  assert.match(avatar, /cache\.match/);
  assert.match(avatar, /cache\.put/);
});

test('cliente social renderiza texto do usuário sem interpolação HTML', () => {
  const feed = read('js/social-feed.js');
  assert.match(feed, /textContent/);
  assert.doesNotMatch(feed, /innerHTML\s*=.*(?:post|comment|body|content)/i);
});

test('Perfil permite foto somente ao próprio titular e mantém identidade cidadã na própria tela', () => {
  const profile = read('js/social-profile.js');
  assert.match(profile, /isOwnProfile/);
  assert.match(profile, /avatar/);
  assert.match(profile, /citizen/i);
});

test('V1 é textual, responsiva e respeita preferências de acessibilidade', () => {
  const socialCss = read('css/social.css');
  assert.match(socialCss, /@media/);
  assert.match(socialCss, /prefers-reduced-motion/);
  assert.match(socialCss, /forced-colors/);
});

test('painel técnico expõe apenas o estado seguro dos flags sociais', () => {
  const readiness = read('worker/system-readiness.js');
  assert.match(readiness, /SOCIAL_BACKEND_ENABLED/);
  assert.match(readiness, /SOCIAL_HOME_ENABLED/);
  assert.doesNotMatch(readiness, /password|token|secret/i);
});

test('Home social é universal e preferências sociais vivem em Configurações', () => {
  const home = read('js/home.js');
  const settings = read('configuracoes/index.html');
  assert.match(home, /socialConfig\.homeEnabled/);
  assert.match(settings, /social/i);
});
