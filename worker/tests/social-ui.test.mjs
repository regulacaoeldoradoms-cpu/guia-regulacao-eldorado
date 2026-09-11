import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(new URL('../../', import.meta.url).pathname);
const read = (filename) => fs.readFileSync(path.join(root, filename), 'utf8');
const socialPages = [
  'index.html',
  'ferramentas/index.html',
  'perfil/index.html',
  'amigos/index.html',
  'notificacoes/index.html',
  'admin/social/index.html'
];

function toolsRuntime() {
  const window = {
    RegulationAuth: {
      hasCouncilAccess(user) {
        return ['membro', 'presidente'].includes(user?.councilRole);
      }
    }
  };
  vm.runInNewContext(read('js/tools-catalog.js'), { window });
  return window.PortalTools;
}

test('rotas sociais usam assets locais versionados e permanecem não indexáveis quando dedicadas', () => {
  for (const filename of socialPages) {
    const html = read(filename);
    assert.match(html, /portal-interactions\.css\?v=20260906-2/);
    assert.match(html, /portal-interactions\.js\?v=20260910-2/);
    assert.match(html, /social\.css\?v=20260911-1/);
    assert.match(html, /social-notification-panel\.css\?v=20260910-1/);
    assert.match(html, /social-api\.js\?v=20260910-4/);
    assert.match(html, /social-navigation\.js\?v=20260911-2/);
    if (filename === 'index.html') assert.match(html, /home-desktop-scale\.css\?v=20260910-2/);
    if (filename !== 'index.html') assert.match(html, /name="robots" content="noindex,nofollow"/);
    assert.doesNotMatch(html, /https:\/\/(?:www\.)?(?:facebook|firebaseio|googleapis)\./i);
  }
});

test('Ferramentas mantém uma única matriz de autorização compartilhada', () => {
  const catalog = toolsRuntime();
  const ids = (user) => Array.from(catalog.cardsFor(user), (card) => card.id);
  assert.deepEqual(ids({ role: 'cidadao' }), ['citizen-channel']);
  assert.deepEqual(ids({ role: 'cidadao', councilRole: 'membro' }), ['council-panel']);
  assert.ok(ids({ role: 'medico', emailVerified: true }).includes('medical-guide'));
  assert.ok(!ids({ role: 'medico', emailVerified: true }).includes('reception-check'));
  assert.ok(ids({ role: 'recepcao', emailVerified: true }).includes('reception-check'));
  assert.ok(ids({ role: 'coordenacao', emailVerified: true }).includes('user-management'));
  assert.ok(ids({ role: 'telemedicina', emailVerified: true }).includes('telemedicine'));
  assert.ok(ids({ role: 'admin', emailVerified: true }).includes('social-moderation'));

  for (const filename of ['index.html', 'ferramentas/index.html']) {
    assert.match(read(filename), /tools-catalog\.js\?v=20260910-2/);
  }
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
  assert.match(index, /\/js\/home\.js\?v=20260910-2/);
  assert.equal((index.match(/\/js\/home\.js\?v=20260910-2/g) || []).length, 1);
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
  const friends = read('js/social-friends.js');

  for (const source of [navigation, friends]) {
    assert.match(source, /function optimisticFriendRequest/);
    assert.match(source, /buttonLabel\(button, 'Pedido enviado'\)/);
    assert.match(source, /profile\.relationship = 'sent'/);
    assert.match(source, /void social\.api\('\/api\/social\/relationships'/);
    assert.match(source, /PortalInteractions\?\.notify\?\.\('success', 'Pedido de amizade enviado\.'/);
    assert.match(source, /PortalInteractions\?\.notify\?\.\('error'/);
  }

  assert.match(navigation, /if \(action === 'request'\) \{\s*optimisticFriendRequest\(profile, button\);\s*return;/);
  assert.match(friends, /if \(action === 'request' && !confirmation\)/);
  assert.match(friends, /relationshipLists\.set\('outgoing', optimisticOutgoing\)/);
});

test('Notificações abrem painel acessível na própria tela e preservam histórico completo', () => {
  const navigation = read('js/social-navigation.js');
  const panelCss = read('css/social-notification-panel.css');
  assert.match(navigation, /aria-haspopup/);
  assert.match(navigation, /aria-expanded/);
  assert.match(navigation, /aria-controls/);
  assert.match(navigation, /event\.key === 'Escape'/);
  assert.match(navigation, /document\.addEventListener\('pointerdown'/);
  assert.match(navigation, /social\.api\('\/api\/social\/notifications'/);
  assert.match(navigation, /method: 'PATCH'/);
  assert.match(navigation, /Ver histórico completo/);
  assert.match(navigation, /Nenhuma notificação no momento/);
  assert.match(panelCss, /overflow-y:\s*auto/);
  assert.match(panelCss, /data-mobile="true"/);
  assert.match(panelCss, /safe-area-inset-bottom/);
  assert.match(panelCss, /prefers-reduced-motion/);
  assert.match(panelCss, /forced-colors/);
});

test('chat profissional continua por cargo e chat social exige amizade aceita', () => {
  const client = read('js/portal-chat.js');
  const backend = read('worker/portal-chat-v2.js');
  const policy = read('worker/social-policy.js');
  assert.match(client, /CHAT_ROLES = new Set\(\['medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin', 'cidadao'\]\)/);
  assert.match(client, /openChatByHandle/);
  assert.match(client, /window\.PortalChat = Object\.freeze/);
  assert.match(client, /portalChatProfileLink/);
  assert.match(client, /socialHandle/);
  assert.match(client, /const messageCache = new Map\(\)/);
  assert.match(client, /const messagePreloadRequests = new Map\(\)/);
  assert.match(client, /function preloadConversationsInBackground/);
  assert.match(client, /requestIdleCallback/);
  assert.match(client, /MESSAGE_PRELOAD_CONCURRENCY = 3/);
  assert.match(client, /MESSAGE_HISTORY_PAGE_SIZE = 120/);
  assert.match(client, /MESSAGE_PRELOAD_PAGE_GUARD = 100/);
  assert.match(client, /&peek=1/);
  assert.match(client, /&before=/);
  assert.match(client, /seenFirstIds/);
  assert.match(client, /renderCachedConversation\(contact\)/);
  assert.match(client, /void loadMessages\(!renderedFromMemory\)/);
  assert.match(client, /portal:session-cleared/);
  assert.doesNotMatch(client, /sessionStorage.*message|localStorage.*message/s);
  assert.match(backend, /const peekOnly = url\.searchParams\.get\('peek'\) === '1'/);
  assert.match(backend, /const beforeId = Math\.max/);
  assert.match(backend, /MESSAGE_HISTORY_PAGE_SIZE = 120/);
  assert.match(backend, /if \(!peekOnly\) \{/);
  assert.match(backend, /PROFESSIONAL_ROLES = new Set/);
  assert.match(backend, /socialFriendContacts/);
  assert.match(backend, /socialFriendContact/);
  assert.match(backend, /relationship\.state = 'friends'/);
  assert.match(backend, /const institutional = await professionalContact/);
  assert.match(backend, /return socialFriendContact\(env, currentUser\.username, targetUsername\)/);
  assert.match(policy, /target\.profile_visibility === 'portal'/);
  assert.doesNotMatch(policy, /isSocialProfessional\(viewer\) === isSocialProfessional\(target\)/);
});

test('Amigos pré-carrega a lista completa, deduplica páginas e usa paginação local', async () => {
  const html = read('amigos/index.html');
  const client = read('js/social-friends.js');
  const navigation = read('js/social-navigation.js');
  const apiSource = read('js/social-api.js');

  assert.doesNotMatch(html, /id="relationshipMore"/);
  assert.match(html, /id="relationshipPageSize"/);
  assert.match(html, /value="10">10 por página/);
  assert.match(html, /value="20">20 por página/);
  assert.match(html, /value="30">30 por página/);
  assert.match(html, /value="all">Todos/);
  assert.match(html, /id="relationshipPageButtons"/);
  assert.match(html, /social-friends\.js\?v=20260911-1/);

  assert.match(navigation, /preloadRelationshipList\?\.\('friends'\)/);
  assert.match(apiSource, /fetchAllRelationshipPages/);
  assert.match(apiSource, /seenHandles/);
  assert.match(apiSource, /SOCIAL_RELATIONSHIP_CURSOR_REPEAT/);
  assert.match(client, /preloadOtherRelationshipLists/);
  assert.match(client, /relationshipPageSize/);
  assert.match(client, /pageTokens/);
  assert.doesNotMatch(client, /listCursor|relationshipMore/);

  const store = new Map();
  const sessionStorage = {
    get length() { return store.size; },
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
    key(index) { return Array.from(store.keys())[index] || null; }
  };
  const calls = [];
  const window = {
    RegulationAuth: {
      api: async (path) => {
        calls.push(path);
        if (path.includes('cursor=cursor-2')) {
          return { profiles: [{ handle: 'bruno' }, { handle: 'carla' }], nextCursor: '' };
        }
        return { profiles: [{ handle: 'ana' }, { handle: 'bruno' }], nextCursor: 'cursor-2' };
      },
      getCachedUser: () => ({ username: 'teste.amigos' })
    },
    REGULATION_AUTH_CONFIG: {},
    addEventListener() {},
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(apiSource, {
    window,
    sessionStorage,
    URL,
    AbortController,
    setTimeout,
    clearTimeout
  });

  const profiles = await window.PortalSocial.refreshRelationshipList('friends');
  assert.deepEqual(Array.from(profiles, (profile) => profile.handle), ['ana', 'bruno', 'carla']);
  assert.equal(calls.length, 2);
  assert.equal(window.PortalSocial.getCachedRelationshipList('friends').profiles.length, 3);
});

test('avatar social reutiliza Cache Storage e baixa novamente somente quando a versão muda', async () => {
  const source = read('js/social-api.js');
  const stored = new Map();
  let networkRequests = 0;
  let objectUrlSequence = 0;

  const cache = {
    async match(request) {
      const response = stored.get(request.url);
      return response ? response.clone() : undefined;
    },
    async put(request, response) {
      stored.set(request.url, response.clone());
    },
    async keys() {
      return Array.from(stored.keys(), (url) => new Request(url));
    },
    async delete(request) {
      return stored.delete(typeof request === 'string' ? request : request.url);
    }
  };

  function runtime() {
    const eventListeners = new Map();
    class TestURL extends URL {}
    TestURL.createObjectURL = () => `blob:avatar-${++objectUrlSequence}`;
    TestURL.revokeObjectURL = () => {};

    const window = {
      RegulationAuth: {
        api: async () => ({}),
        getToken: () => 'sessao-teste',
        authorizationHeader: () => ({ Authorization: 'Bearer sessao-teste' }),
        getCachedUser: () => ({ username: 'visualizador.teste' })
      },
      REGULATION_AUTH_CONFIG: { endpoint: 'https://worker.test' },
      location: { origin: 'https://portal.test' },
      caches: {
        open: async () => cache,
        delete: async () => { stored.clear(); return true; }
      },
      addEventListener(type, callback) { eventListeners.set(type, callback); },
      setTimeout,
      clearTimeout
    };
    const context = {
      window,
      document: { getElementById: () => null },
      sessionStorage: {
        get length() { return 0; },
        getItem: () => null,
        setItem() {},
        removeItem() {},
        key: () => null
      },
      localStorage: {
        getItem: () => null,
        setItem() {},
        removeItem() {}
      },
      fetch: async () => {
        networkRequests += 1;
        return new Response(new Blob(['imagem'], { type: 'image/png' }), {
          status: 200,
          headers: { 'Content-Type': 'image/png' }
        });
      },
      Request,
      Response,
      Blob,
      URL: TestURL,
      AbortController,
      FormData,
      setTimeout,
      clearTimeout
    };
    vm.runInNewContext(source, context, { filename: 'js/social-api.js' });
    return window.PortalSocial;
  }

  function element() {
    return {
      textContent: '',
      style: {},
      isConnected: true,
      setAttribute() {}
    };
  }

  const v1 = { handle: 'pessoa.teste', name: 'Pessoa Teste', avatarAvailable: true, avatarVersion: 'versao-1' };
  const firstRuntime = runtime();
  await firstRuntime.mountAvatar(element(), v1);
  assert.equal(networkRequests, 1);
  assert.equal(stored.size, 1);

  const secondRuntime = runtime();
  await secondRuntime.mountAvatar(element(), v1);
  assert.equal(networkRequests, 1, 'nova página deve reutilizar o avatar persistido localmente');

  await secondRuntime.mountAvatar(element(), { ...v1, avatarVersion: 'versao-2' });
  assert.equal(networkRequests, 2, 'uma versão nova deve baixar a foto nova uma única vez');
  assert.equal(stored.size, 1, 'a versão antiga deve ser removida após a atualização');
});

test('cliente social renderiza texto do usuário sem interpolação HTML', () => {
  const files = ['js/social-feed.js', 'js/social-friends.js', 'js/social-profile.js', 'js/social-notifications.js', 'js/social-moderation.js'];
  for (const filename of files) {
    const source = read(filename);
    assert.doesNotMatch(source, /innerHTML\s*=\s*`[^`]*\$\{/s, `${filename}: conteúdo interpolado em HTML`);
    assert.doesNotMatch(source, /insertAdjacentHTML|document\.write/);
  }
});

test('Perfil permite foto somente ao próprio titular e mantém identidade cidadã na própria tela', () => {
  const html = read('perfil/index.html');
  const client = read('js/social-profile.js');
  const accountCss = read('css/account-sections.css');
  const backend = read('worker/profile-photo.js');
  assert.match(html, /id="profilePhotoCamera"[^>]*hidden/);
  assert.match(html, /id="profilePhotoDialog"/);
  assert.match(html, /id="profilePhotoInput"[^>]*accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(html, /id="profileIdentityEditor"/);
  assert.match(html, /id="profileIdentityForm"/);
  assert.doesNotMatch(html, /href="\/conta\//);
  assert.match(accountCss, /\.profile-photo-camera\[hidden\]\{display:none!important\}/);
  assert.match(client, /photoCamera\.hidden = !self/);
  assert.match(client, /photoCamera\.disabled = !self/);
  assert.match(client, /if \(!profile\?\.isSelf\) return;/);
  assert.match(client, /if \(!profile\?\.isSelf \|\| !accountPhotoUnlocked\(\)\) return;/);
  assert.match(client, /auth\.updateProfilePhoto/);
  assert.match(backend, /WHERE username = \?/);
  assert.doesNotMatch(backend, /targetUsername|targetHandle|profileUsername/);
  assert.match(client, /\/api\/citizen\/identity/);
  assert.match(client, /\/seguranca\/\?primeiro-acesso=1/);
});

test('V1 é textual, responsiva e respeita preferências de acessibilidade', () => {
  const home = read('index.html');
  const feed = read('js/social-feed.js');
  const css = read('css/social.css');
  const homeMobileCss = read('css/home-mobile.css');
  const homeDesktopScaleCss = read('css/home-desktop-scale.css');
  assert.doesNotMatch(home, /type="file"|accept="image/);
  assert.match(feed, /ordem é cronológica|ordem cronológica/i);
  assert.match(css, /@media \(max-width: 360px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /body\.mobile-home-mode \.social-layout\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /body\.mobile-home-mode \.social-global-nav\s*\{\s*display:\s*none/);
  assert.match(css, /body\.mobile-home-mode \.social-shortcuts \.portal-grid\s*\{[^}]*repeat\(3/s);
  assert.match(css, /body\.mobile-home-mode \.social-shell\s*\{[^}]*font-size:\s*clamp\(21px,\s*3\.225vw,\s*31\.5px\)/s);
  assert.match(css, /body\.mobile-home-mode \.social-mobile-nav\s*\{[^}]*min-height:\s*clamp\(96px,\s*13\.5vw,\s*132px\)/s);
  assert.match(css, /body\.mobile-home-mode \.social-mobile-nav-link \.social-nav-icon\s*\{[^}]*clamp\(40px,\s*5\.55vw,\s*54px\)/s);
  assert.match(homeMobileCss, /body\.mobile-home-mode #toolsFallback \.hub-card\s*\{/);
  assert.doesNotMatch(homeMobileCss, /body\.mobile-home-mode \.hub-card\s*\{/);
  assert.match(homeDesktopScaleCss, /@media \(min-width: 1240px\)/);
  assert.match(homeDesktopScaleCss, /body:not\(\.mobile-home-mode\) #socialHome\.social-shell/);
  assert.match(homeDesktopScaleCss, /width:\s*min\(1298px,\s*calc\(100% - 32px\)\)/);
  assert.match(homeDesktopScaleCss, /grid-template-columns:\s*242px minmax\(0, 704px\) minmax\(253px, 308px\)/);
  assert.match(homeDesktopScaleCss, /#socialHome \.social-comment \.social-avatar\s*\{[^}]*width:\s*38px;[^}]*height:\s*38px/s);
  assert.doesNotMatch(homeDesktopScaleCss, /\.social-global-nav(?:-inner)?\s*\{/);
  assert.match(home, /social-profile-rail/);
  assert.match(home, /social-feed-column/);
  assert.match(home, /social-tools-rail/);
  for (const filename of socialPages) assert.match(read(filename), /http-equiv="Content-Security-Policy"/);
});

test('painel técnico expõe apenas o estado seguro dos flags sociais', () => {
  const readiness = read('worker/system-readiness.js');
  assert.match(readiness, /socialBackendEnabled/);
  assert.match(readiness, /socialHomeEnabled/);
  assert.match(readiness, /socialFlagsCoherent/);
  assert.match(readiness, /Configuração inválida: a Home social não pode ser ativada/);
});

test('Home social é universal e preferências sociais vivem em Configurações', () => {
  const settings = read('configuracoes/index.html');
  const levels = read('js/account-levels.js');
  const policy = read('worker/social-policy.js');
  const backendLevels = read('worker/account-levels.js');
  const home = read('js/home.js');
  const login = read('js/login.js');
  const signup = read('js/signup.js');
  assert.match(settings, /id="socialPreferencesCard"/);
  assert.match(settings, /id="socialProfileVisibility"/);
  assert.match(settings, /id="socialDefaultAudience"/);
  assert.doesNotMatch(settings, /id="socialHomePreference"/);
  assert.match(levels, /Home social liberada/);
  assert.doesNotMatch(policy, /ACCOUNT_LEVEL_REQUIRED/);
  assert.match(backendLevels, /socialFeed:\s*true/);
  assert.match(backendLevels, /socialPublishing:\s*true/);
  assert.doesNotMatch(home, /location\.replace\('\/ferramentas\/'\)/);
  assert.match(login, /return '\/';/);
  assert.match(signup, /location\.replace\('\/'\)/);
});
