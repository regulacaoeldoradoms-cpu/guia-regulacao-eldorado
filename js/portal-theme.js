'use strict';

(() => {
  if (window.PortalTheme) return;

  const VERSION = '1.0.0';
  const STORAGE_KEY = 'regulacao.portal.theme.active.v1';
  const LIGHT = 'light';
  const DARK = 'dark';
  const CHOICE_PREFIX = 'regulacao.portal.theme.choice.v1:';
  let choiceSequence = 0;
  let applying = false;

  function currentAccount() {
    try {
      const config = window.REGULATION_AUTH_CONFIG || {};
      const user = window.RegulationAuth?.getCachedUser?.() || JSON.parse(sessionStorage.getItem(config.userStorageKey || 'regulacao.portal.user') || localStorage.getItem(config.userStorageKey || 'regulacao.portal.user') || 'null');
      return { user, key: String(user?.username || 'public').toLowerCase() };
    } catch (_) { return {user:null,key:'public'}; }
  }
  function choice(key = currentAccount().key) {
    try { return JSON.parse(localStorage.getItem(CHOICE_PREFIX + key) || 'null'); } catch (_) { return null; }
  }
  function preferred() {
    const account = currentAccount(), local = choice(account.key);
    if (local) return normalize(local.theme);
    if (account.user?.interfaceTheme) return normalize(account.user.interfaceTheme);
    return stored();
  }
  function select(value) {
    const theme = normalize(value), key = currentAccount().key, revision = Date.now() + ':' + ++choiceSequence;
    try {localStorage.setItem(CHOICE_PREFIX + key,JSON.stringify({theme,revision,pending:true}));}catch(_){}
    apply(theme);return {key,revision,theme};
  }
  function confirm(selection) {
    const saved = choice(selection.key);
    if(saved?.revision !== selection.revision)return false;
    try {localStorage.setItem(CHOICE_PREFIX + selection.key,JSON.stringify({...saved,pending:false}));}catch(_){}
    return true;
  }
  function pending() {return Boolean(choice()?.pending);}
  function syncFrames(theme) {
    document.querySelectorAll('iframe').forEach(frame=>{try {
      const target=frame.contentDocument;if(!target?.documentElement)return;
      if(frame.contentWindow?.PortalTheme)frame.contentWindow.PortalTheme.apply(theme,{persist:false});
      else{target.documentElement.dataset.portalTheme=theme;target.documentElement.style.colorScheme=theme;if(target.body)target.body.dataset.portalTheme=theme;}
    }catch(_) {}});
  }

  function normalize(value, fallback = LIGHT) {
    const theme = String(value || '').trim().toLowerCase();
    return theme === DARK || theme === LIGHT ? theme : fallback;
  }

  function stored() {
    try { return normalize(localStorage.getItem(STORAGE_KEY) || LIGHT); }
    catch (_) { return LIGHT; }
  }

  function store(theme) {
    try { localStorage.setItem(STORAGE_KEY, normalize(theme)); }
    catch (_) {}
  }

  function updateMeta(theme) {
    const meta = document.querySelector?.('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === DARK ? '#081a29' : '#0d3157');
  }

  function apply(value, options = {}) {
    const theme = normalize(value);
    document.documentElement.dataset.portalTheme = theme;
    document.documentElement.style.colorScheme = theme;
    if (document.body) document.body.dataset.portalTheme = theme;
    updateMeta(theme);
    if (options.persist !== false) store(theme);
    if(!applying){applying=true;syncFrames(theme);applying=false;}
    window.dispatchEvent(new CustomEvent('portal:theme-changed',{detail:{theme}}));
    return theme;
  }

  function hydrateCachedAccount() {
    apply(preferred(),{persist:false});
  }

  const initial = apply(preferred(), { persist: false });

  window.addEventListener('storage', (event) => {
    const key=CHOICE_PREFIX+currentAccount().key;
    if(event.key===key) {const local=choice();if(local)apply(local.theme,{persist:false});}
    else if(event.key===STORAGE_KEY)apply(preferred(),{persist:false});
  });

  const onReady = () => {
    if (document.body) document.body.dataset.portalTheme = document.documentElement.dataset.portalTheme || initial;
    updateMeta(document.documentElement.dataset.portalTheme || initial);
    hydrateCachedAccount();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, { once: true });
  else onReady();

  window.addEventListener('portal:session-ready', event => {
    const user = event.detail?.user;
    const key = String(user?.username || 'public').toLowerCase();
    const local = choice(key);
    // A fresh authenticated account response may update a confirmed preference.
    // An unsynchronized local choice remains authoritative until its write succeeds.
    if (local && !local.pending && user?.interfaceTheme && local.theme !== normalize(user.interfaceTheme)) {
      try { localStorage.setItem(CHOICE_PREFIX + key, JSON.stringify({...local, theme:normalize(user.interfaceTheme)})); } catch (_) {}
    }
    hydrateCachedAccount();
  });
  window.addEventListener('portal:session-cleared',hydrateCachedAccount);
  window.addEventListener('portal:citizen-route',()=>apply(document.documentElement.dataset.portalTheme || preferred(),{persist:false}));
  document.addEventListener('load',event=>{if(event.target?.tagName==='IFRAME')syncFrames(document.documentElement.dataset.portalTheme || preferred());},true);

  window.PortalTheme = Object.freeze({
    version: VERSION,
    key: STORAGE_KEY,
    normalize,
    get: () => normalize(document.documentElement.dataset.portalTheme || stored()),
    apply,
    hydrateCachedAccount,
    preferred, select, confirm, pending, hasChoice: () => Boolean(choice())
  });
})();
