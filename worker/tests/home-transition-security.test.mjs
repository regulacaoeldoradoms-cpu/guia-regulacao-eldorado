import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
const source = readFileSync(new URL('../../js/login-home-transition.js', import.meta.url), 'utf8');
const required = ['/js/social-api.js', '/js/social-home.js', '/js/home.js'];
function harness({ extraScript='', inlineHandler=false, embedded=false } = {}) {
  const state = { requests:0, appended:0 };
  const content = {
    querySelector(selector) { if (selector === '#homeLoading' || selector === '#socialHome') return {}; return embedded ? {} : null; },
    querySelectorAll() { return inlineHandler ? [{ attributes:[{name:'onclick'}] }] : []; }
  };
  const parsed = { body:{ dataset:{portalHomeBootstrap:'1'} }, querySelector:()=>content,
    querySelectorAll(selector) { return selector === 'script[src]' ? [...required, ...(extraScript ? [extraScript] : [])].map(src=>({getAttribute:()=>src})) : []; } };
  const window = {setTimeout:()=>1,clearTimeout(){},addEventListener(){},removeEventListener(){}};
  vm.runInNewContext(source, {window,location:{origin:'https://portal.example.invalid'},
    DOMParser:class {parseFromString(){return parsed;}},
    document:{head:{appendChild(){state.appended++; throw Error('unexpected execution');}}},
    URL,AbortController, fetch:async()=>{state.requests++; return {ok:true,headers:{get:()=> 'text/html'},text:async()=>'<synthetic>'};}});
  return {state,prepare:window.PortalHomeTransition.prepare};
}
test('the transition authorizes only the existing exact script map plus the global chat bootstrap', () => {
  const entries = vm.runInNewContext(source.match(/const SCRIPT_GLOBALS = (new Map\(\[[\s\S]*?\]\));/)[1]);
  assert.deepEqual(Array.from(entries, ([path,name])=>[path,name]), [
    ['/js/portal-performance.js','PortalPerformance'], ['/js/portal-global-chat.js','PortalGlobalChat'],
    ['/js/portal-global-navigation.js','PortalGlobalNavigation'],
    ['/js/auth-config.js','REGULATION_AUTH_CONFIG'], ['/js/auth-client.js','RegulationAuth'],
    ['/js/portal-theme.js','PortalTheme'], ['/js/portal-interactions.js','PortalInteractions'],
    ['/js/tools-catalog.js','PortalTools'], ['/js/social-api.js','PortalSocial'],
    ['/js/social-navigation.js','PortalSocialNavigation'], ['/js/citizen-mobile-shell.js','PortalCitizenShell'], ['/js/social-feed.js','PortalSocialFeed'],
    ['/js/social-home.js','PortalSocialHome'], ['/js/home.js','PortalHomeReady']
  ]);
});
test('the real Home shell keeps every script inside the existing exact allowlist', () => {
  const entries = vm.runInNewContext(source.match(/const SCRIPT_GLOBALS = (new Map\(\[[\s\S]*?\]\));/)[1]);
  const home = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
  const scripts = Array.from(home.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g), ([, src]) => new URL(src, 'https://portal.example.invalid'));
  assert.ok(scripts.length > 0);
  for (const script of scripts) {
    assert.equal(script.origin, 'https://portal.example.invalid');
    assert.ok(entries.has(script.pathname), script.pathname);
  }
});
for (const [name, options] of [
  ['external origin with an otherwise allowed path',{extraScript:'https://external.invalid/js/portal-global-chat.js'}],
  ['same-origin script outside the map',{extraScript:'/js/unapproved.js'}],
  ['transitive chat script inserted directly into the Home shell',{extraScript:'/js/portal-chat.js'}],
  ['inline event handler in the shell',{inlineHandler:true}],
  ['embedded active content in the shell',{embedded:true}]
]) test('rejects '+name+' before mounting or executing assets', async()=>{
  const h=harness(options), transition=h.prepare('/');
  assert.equal(await transition.mount({isConnected:true}),false);
  assert.equal(h.state.requests,1);
  assert.equal(h.state.appended,0);
});
for (const destination of ['https://external.invalid/','/seguranca/','/documentos/','/conselho/painel/','javascript:alert(1)']) test('rejects destination '+destination+' without fetching', ()=>{
  const h=harness();
  assert.equal(h.prepare(destination),null);
  assert.equal(h.state.requests,0);
  assert.equal(h.state.appended,0);
});
