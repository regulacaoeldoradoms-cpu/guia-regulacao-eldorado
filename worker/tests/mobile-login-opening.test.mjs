import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = name => readFileSync(new URL('../../' + name, import.meta.url), 'utf8');
const html = read('login/index.html');
const mobileSource = read('js/login-opening-mobile.js');
const desktopSource = read('js/login-opening.js');
const detection = html.match(/<script id="portalOpeningDevice">([\s\S]*?)<\/script>/)?.[1];

function detect({ ua = 'Mozilla/5.0 Windows NT 10.0', touches = 0, width = 1366, height = 768, coarse = false, uaMobile = false } = {}) {
  const links = [];
  const document = { documentElement:{ dataset:{} }, createElement:() => ({}), head:{ appendChild:link => links.push(link) } };
  vm.runInNewContext(detection, { document, navigator:{userAgent:ua,maxTouchPoints:touches,userAgentData:{mobile:uaMobile}},
    screen:{width,height}, window:{matchMedia:() => ({matches:coarse})} });
  return { mode:document.documentElement.dataset.portalOpeningMode, links };
}

for (const [name, options] of [
  ['Android portrait',{ua:'Mozilla Android Mobile',touches:5,width:390,height:844,coarse:true}],
  ['Android landscape',{ua:'Mozilla Android Mobile',touches:5,width:932,height:430,coarse:true}],
  ['iPhone',{ua:'Mozilla iPhone Safari',touches:5,width:390,height:844,coarse:true}],
  ['mobile UA hint',{uaMobile:true}],
  ['compact touch tablet',{touches:5,width:820,height:1180,coarse:true}]
]) test(name + ' preloads only the mobile logo, never the MP4', () => {
  const result = detect(options);
  assert.equal(result.mode, 'mobile');
  assert.equal(result.links.length, 1);
  assert.equal(result.links[0].as, 'image');
  assert.equal(result.links[0].type, 'image/webp');
  assert.match(result.links[0].href, /portal-opening-mobile-v1\.webp\?v=20261015-1$/);
});

for (const [name, options] of [
  ['normal desktop',{}], ['narrow desktop',{width:600,height:800}],
  ['touchscreen laptop with mouse',{touches:10,width:1366,height:768,coarse:false}]
]) test(name + ' retains the existing desktop video', () => {
  const result = detect(options);
  assert.equal(result.mode, 'desktop');
  assert.equal(result.links[0].href, '/assets/portal-opening-v1.mp4?v=20260918-1');
  assert.equal(result.links[0].as, 'video');
});

test('mobile dispatcher exits before desktop preparation, even when the optional script failed', async () => {
  for (const available of [true, false]) {
    const api = { beforeNavigate:async () => ({handled:true}) };
    const window = available ? {PortalMobileLoginOpening:api} : {};
    vm.runInNewContext(desktopSource, { window,
      document:{getElementById:() => ({}),documentElement:{dataset:{portalOpeningMode:'mobile'}}} });
    if (available) assert.equal(window.PortalLoginOpening, api);
    else assert.equal(await window.PortalLoginOpening.beforeNavigate(), false);
  }
});

test('mobile module has no desktop side effects', () => {
  const original = {};
  const window = {PortalLoginOpening:original};
  vm.runInNewContext(mobileSource, {window,document:{documentElement:{dataset:{portalOpeningMode:'desktop'}}}});
  assert.equal(window.PortalLoginOpening, original);
  assert.equal(window.PortalMobileLoginOpening, undefined);
});

test('Home starts before drawing and its readiness, not the eight-second loop, controls reveal', () => {
  assert.ok(mobileSource.indexOf('const homeReady = Promise.resolve(home.mount(cover))') < mobileSource.indexOf('stopAnimation = animate('));
  assert.match(mobileSource, /Promise\.race\(\[homeReady, interrupted\]\)/);
  assert.match(mobileSource, /HOME_LIMIT_MS = 21000/);
  assert.match(mobileSource, /home\.reveal\(\)/);
  assert.doesNotMatch(mobileSource, /await image\.decode|await prepare|setTimeout\([^\n]*(?:PERIOD|8000)/);
  assert.doesNotMatch(mobileSource, /RegulationAuth|localStorage|sessionStorage|fetch\(|createElement\('video'\)|new Audio/);
});

test('production integration has cleanup, static fallback and no preview keyboard/replay controls', () => {
  assert.match(mobileSource, /observer\?\.disconnect\(\)/);
  assert.match(mobileSource, /removeEventListener\('visibilitychange'/);
  assert.match(mobileSource, /removeEventListener\('portal:session-cleared'/);
  assert.match(mobileSource, /cancelAnimationFrame\(state\.resizeFrame\)/);
  assert.match(mobileSource, /prefers-reduced-motion:reduce/);
  assert.match(mobileSource, /image\.src = FALLBACK/);
  assert.doesNotMatch(mobileSource, /keydown|pointerup|PortalIntro|\bseek\(/);
});

test('versioned mobile assets are referenced in order and old desktop cache is preserved', () => {
  const mobile = html.indexOf('src="/js/login-opening-mobile.js?v=20261015-mobile-opening-1"');
  const dispatcher = html.indexOf('src="/js/login-opening.js?v=20261015-mobile-opening-1"');
  const login = html.indexOf('src="/js/login.js?');
  assert.ok(mobile > 0 && mobile < dispatcher && dispatcher < login);
  const sw = read('portal-sw.js');
  assert.match(sw, /'\/js\/login-opening-mobile\.js\?v=20261015-mobile-opening-1'/);
  assert.match(sw, /'\/assets\/portal-opening-mobile-v1\.webp\?v=20261015-1'/);
  assert.match(sw, /CACHE_VERSION = '20261009-pets-combined-8'/);
  assert.doesNotMatch(sw, /caches\.delete\(['"]portal-opening-media-v1/);
  const asset = readFileSync(new URL('../../assets/portal-opening-mobile-v1.webp', import.meta.url));
  assert.equal(asset.toString('ascii', 8, 12), 'WEBP');
  assert.ok(asset.length > 10000 && asset.length < 80000);
});
