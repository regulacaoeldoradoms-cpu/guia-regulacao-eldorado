'use strict';

(() => {
  if (window.PortalInteractions) return;

  const VERSION = '1.0.0';
  const STORAGE_PREFIX = 'regulacao.portal.interactions.v1';
  const SOUND_BASE = '/assets/sounds/';
  const DEFAULT_PREFERENCES = Object.freeze({
    soundsEnabled: false,
    volume: 0.32,
    muted: false
  });

  const TOKENS = Object.freeze({
    motionFast: 110,
    motionStandard: 180,
    resultDuration: 720,
    taskTimeout: 30000,
    preferenceDebounce: 500
  });

  const SOUND_FILES = Object.freeze({
    click: 'ui-click.wav',
    open: 'ui-open.wav',
    close: 'ui-close.wav',
    transition: 'ui-transition.wav',
    success: 'ui-success.wav',
    warning: 'ui-warning.wav',
    error: 'ui-error.wav',
    notification: 'ui-notification.wav',
    destructive: 'ui-destructive.wav',
    complete: 'ui-complete.wav'
  });

  const SOUND_COOLDOWNS = Object.freeze({
    click: 85,
    open: 150,
    close: 150,
    transition: 130,
    success: 260,
    warning: 320,
    error: 420,
    notification: 550,
    destructive: 360,
    complete: 420
  });

  const SOUND_PRIORITIES = Object.freeze({
    click: 1,
    transition: 1,
    open: 2,
    close: 2,
    notification: 3,
    warning: 4,
    success: 4,
    complete: 5,
    destructive: 5,
    error: 6
  });

  const FEEDBACK_TYPES = Object.freeze({
    click: { sound: 'click', visual: 'press' },
    primary: { sound: 'click', visual: 'primary' },
    open: { sound: 'open', visual: 'open' },
    close: { sound: 'close', visual: 'close' },
    transition: { sound: 'transition', visual: 'transition' },
    filter: { sound: 'transition', visual: 'transition' },
    selection: { sound: 'transition', visual: 'selection' },
    expand: { sound: 'open', visual: 'open' },
    collapse: { sound: 'close', visual: 'close' },
    loading: { sound: '', visual: 'loading' },
    loaded: { sound: 'transition', visual: 'loaded' },
    save: { sound: 'success', visual: 'success' },
    confirm: { sound: 'success', visual: 'success' },
    success: { sound: 'success', visual: 'success' },
    warning: { sound: 'warning', visual: 'warning' },
    error: { sound: 'error', visual: 'error' },
    destructive: { sound: 'destructive', visual: 'destructive' },
    notification: { sound: 'notification', visual: 'notification' },
    'state-change': { sound: 'transition', visual: 'selection' },
    'task-complete': { sound: 'complete', visual: 'success' },
    'navigation-enter': { sound: 'transition', visual: 'transition' },
    'navigation-exit': { sound: 'close', visual: 'close' },
    copy: { sound: 'success', visual: 'success' }
  });

  const INLINE_ICONS = Object.freeze({
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h4l5 4V6l-5 4H5Z"/><path d="M17 9.5c.8.7 1.2 1.5 1.2 2.5s-.4 1.8-1.2 2.5"/><path d="M19.5 7c1.4 1.4 2.1 3 2.1 5s-.7 3.6-2.1 5"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h4l5 4V6l-5 4H5Z"/><path d="m17 10 4 4m0-4-4 4"/></svg>'
  });

  const GLOBAL_CLICK_RULES = [
    ['[data-portal-interaction]', null],
    ['#portalChatLauncher,.portal-chat-launcher,#aiLauncher', 'open'],
    ['#portalChatClose,#aiClose', 'close'],
    ['#portalChatBack,.portal-chat-contact,.ai-suggestion,[data-ai-prefill]', 'transition'],
    ['#portalChatSend,#aiForm button[type="submit"]', 'primary'],
    ['#portalChatEnableNotifications', 'primary'],
    ['[data-close-modal],.portal-modal-close,.citizen-modal-close', 'close'],
    ['.council-delete-confirm,.council-row-delete,.council-delete-selected,.portal-button.danger', 'destructive'],
    ['.council-delete-cancel', 'close']
  ];

  const ROUTE_RULES = [
    {
      path: /^\/$/,
      click: [
        ['.hub-card', 'navigation-enter', '.portal-grid'],
        ['#portalLogout', 'navigation-exit']
      ]
    },
    {
      path: /^\/login\/?$/,
      click: [
        ['#loginSubmit', 'primary'],
        ['a[href^="/cadastro/"]', 'navigation-enter']
      ]
    },
    {
      path: /^\/cadastro\/?$/,
      click: [
        ['#signupSubmit', 'primary'],
        ['a[href^="/login/"]', 'navigation-exit']
      ]
    },
    {
      path: /^\/medico\/?$/,
      click: [
        ['[data-filter],#generalBtn', 'filter', '#protocolList,#detailPanel'],
        ['.protocol-card', 'selection', '#detailPanel'],
        ['#copyModelButton,#copyModelInlineButton,#copyChecklistButton', 'click'],
        ['#printGuidanceButton', 'primary'],
        ['#clearChecklistButton', 'warning'],
        ['a[href^="/protocolo/"]', 'navigation-enter']
      ],
      change: [
        ['#categoryFilter', 'filter', '#protocolList,#detailPanel'],
        ['.medical-checklist input[type="checkbox"]', 'selection']
      ]
    },
    {
      path: /^\/protocolo\/?$/,
      click: [
        ['[data-filter]', 'filter', '#protocolList,#detailPanel'],
        ['.protocol-card', 'selection', '#detailPanel'],
        ['a[href^="/medico/"]', 'navigation-exit']
      ],
      change: [['#categoryFilter', 'filter', '#protocolList,#detailPanel']]
    },
    {
      path: /^\/recepcao\/?$/,
      click: [
        ['#receptionProtocolList button', 'selection', '#receptionDetail'],
        ['#clearReceptionChecklist,#clearReceptionChecklistBottom', 'warning', '#receptionDetail'],
        ['#printMissingItems', 'primary'],
        ['a[href="/"]', 'navigation-exit']
      ],
      change: [
        ['#receptionSubprotocol', 'filter', '#receptionDetail'],
        ['.reception-item input,.fast-check input', 'selection']
      ]
    },
    {
      path: /^\/telemedicina\/?$/,
      click: [
        ['[data-status-filter]', 'filter', '#followupList'],
        ['[data-telemedicine-view]', 'filter', '#followupList'],
        ['#openConsultation,#openImport', 'open'],
        ['[data-action="patient"],[data-action="schedule"]', 'open'],
        ['[data-action="requested"]', 'open'],
        ['[data-action="copy-justification"]', 'click'],
        ['#consultationForm button[type="submit"],#scheduleForm button[type="submit"],#requestedForm button[type="submit"],#importForm button[type="submit"],#telemedicineEditForm button[type="submit"],.tm-inline-form button[type="submit"]', 'primary'],
        ['#enableNotifications', 'primary'],
        ['#normalizeSpecialties', 'warning'],
        ['#portalLogout,a[href="/"]', 'navigation-exit']
      ],
      change: [
        ['#statusFilter', 'filter', '#followupList'],
        ['input[name="consultOutcome"],#consultConditionType', 'state-change', '#consultFollowupFields']
      ]
    },
    {
      path: /^\/cidadao\/?$/,
      click: [
        ['#openNewManifestation', 'open'],
        ['#refreshManifestations', 'loading', '#manifestationList'],
        ['#markNotificationsRead', 'primary', '#notificationList'],
        ['.manifestation-item,.notification,.attachment-link', 'open'],
        ['.citizen-mobile-tab', 'filter', '.citizen-grid'],
        ['.privacy-help-button', 'expand'],
        ['#portalLogout,#professionalHomeLink', 'navigation-exit'],
        ['#accountEvolutionLink', 'navigation-enter']
      ],
      change: [
        ['input[name="manifestationPrivacy"],input[name="manifestationType"]', 'selection'],
        ['#manifestationPriorContact', 'selection']
      ]
    },
    {
      path: /^\/conselho\/?$/,
      click: [
        ['a[href^="/cadastro/"]', 'navigation-enter'],
        ['a[href^="/login/"]', 'navigation-enter']
      ]
    },
    {
      path: /^\/conselho\/painel\/?$/,
      click: [
        ['#refreshCouncil', 'loading', '#councilRows'],
        ['#councilRows tr[data-protocol]', 'open'],
        ['#exportManifestationPdf', 'open'],
        ['#cancelPraiseRecipient', 'close'],
        ['#praiseRecipientForm .generate', 'primary'],
        ['#saveStatus,#officialReplyButton,#internalNoteForm button[type="submit"]', 'primary'],
        ['#portalLogout,#backHome', 'navigation-exit']
      ],
      change: [
        ['#councilType,#councilStatus', 'filter', '#councilRows'],
        ['#statusSelect', 'selection'],
        ['#councilSelectVisible,.council-row-select input', 'selection']
      ]
    },
    {
      path: /^\/conta\/?$/,
      click: [
        ['#chooseProfilePhoto,#sendEmailVerification', 'primary'],
        ['#removeProfilePhoto', 'destructive'],
        ['[data-level-next-action]', 'navigation-enter'],
        ['#portalLogout,#accountHomeLink', 'navigation-exit']
      ],
      change: [['#acceptFriendRequests', 'selection']]
    },
    {
      path: /^\/admin\/usuarios\/?$/,
      click: [
        ['[data-action="edit"]', 'open'],
        ['[data-action="reset"]', 'warning'],
        ['#portalLogout,a[href="/"]', 'navigation-exit']
      ],
      change: [['#newRole,#newCouncilRole,#editRole,#editCouncilRole,#editActive', 'selection']]
    },
    {
      path: /^\/admin\/monitoramento\/?$/,
      click: [
        ['[data-period]', 'filter', '#usageHistoryBody'],
        ['[data-doctor]', 'selection', '#usageDetail'],
        ['#portalLogout,a[href^="/"]', 'navigation-exit']
      ]
    },
    {
      path: /^\/admin\/configuracao\/?$/,
      click: [
        ['#refreshReadiness', 'loading', '#readinessList'],
        ['#portalLogout,a[href="/"]', 'navigation-exit']
      ]
    }
  ];

  const STATUS_SELECTOR = [
    '[role="status"]',
    '[role="alert"]',
    '.account-status',
    '.login-status',
    '.toast',
    '.council-delete-toast',
    '.portal-chat-status',
    '.tm-inline-status'
  ].join(',');

  const LAYER_SELECTOR = '.modal-backdrop,.citizen-modal,.council-delete-dialog-backdrop,.portal-auxiliary-dialog,.ai-chat,.portal-chat';
  const customRules = { click: [], change: [] };
  const statusSnapshots = new WeakMap();
  const layerSnapshots = new WeakMap();
  const taskStates = new WeakMap();
  const layerFocus = new WeakMap();
  const lastFeedbackAt = new Map();
  const mediaReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;

  let currentUserKey = 'public';
  let preferences = { ...DEFAULT_PREFERENCES };
  let preferenceTimer = 0;
  let observer = null;
  let gestureSeen = false;
  let started = false;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function booleanValue(value, fallback = false) {
    if (typeof value === 'boolean') return value;
    if (value === 1 || value === '1' || value === 'true') return true;
    if (value === 0 || value === '0' || value === 'false') return false;
    return fallback;
  }

  function normalizeVolume(value, fallback = DEFAULT_PREFERENCES.volume) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp(parsed > 1 ? parsed / 100 : parsed, 0, 1);
  }

  function normalizePreferences(input = {}, fallback = DEFAULT_PREFERENCES) {
    const enabledValue = Object.prototype.hasOwnProperty.call(input, 'soundsEnabled')
      ? input.soundsEnabled
      : input.interfaceSoundsEnabled;
    const volumeValue = Object.prototype.hasOwnProperty.call(input, 'volume')
      ? input.volume
      : input.interfaceSoundVolume;
    const mutedValue = Object.prototype.hasOwnProperty.call(input, 'muted')
      ? input.muted
      : input.interfaceSoundsMuted;
    return {
      soundsEnabled: booleanValue(enabledValue, fallback.soundsEnabled),
      volume: normalizeVolume(volumeValue, fallback.volume),
      muted: booleanValue(mutedValue, fallback.muted)
    };
  }

  function storageKey(userKey = currentUserKey) {
    return `${STORAGE_PREFIX}:${String(userKey || 'public').toLowerCase()}`;
  }

  function loadStoredPreferences(userKey = currentUserKey) {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey(userKey)) || '{}');
      return normalizePreferences(parsed);
    } catch (_) {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  function saveStoredPreferences() {
    try { localStorage.setItem(storageKey(), JSON.stringify(preferences)); }
    catch (_) {}
  }

  function remotePreferencePayload() {
    return {
      interfaceSoundsEnabled: preferences.soundsEnabled,
      interfaceSoundVolume: Math.round(preferences.volume * 100),
      interfaceSoundsMuted: preferences.muted
    };
  }

  function hasRemotePreferences(value) {
    return Boolean(value && (
      Object.prototype.hasOwnProperty.call(value, 'interfaceSoundsEnabled') ||
      Object.prototype.hasOwnProperty.call(value, 'interfaceSoundVolume') ||
      Object.prototype.hasOwnProperty.call(value, 'interfaceSoundsMuted')
    ));
  }

  function cachedUser() {
    try { return window.RegulationAuth?.getCachedUser?.() || null; }
    catch (_) { return null; }
  }

  function setCurrentUser(user) {
    const nextKey = String(user?.username || 'public').toLowerCase();
    if (nextKey === currentUserKey) return;
    currentUserKey = nextKey;
    preferences = loadStoredPreferences(currentUserKey);
    soundManager.update();
    syncSoundStateAttribute();
    renderPreferenceControls();
  }

  function syncSoundStateAttribute() {
    document.documentElement.dataset.portalSounds = preferences.soundsEnabled
      ? (preferences.muted || preferences.volume <= 0 ? 'muted' : 'enabled')
      : 'disabled';
  }

  const soundManager = (() => {
    const rawFiles = new Map();
    const buffers = new Map();
    const loading = new Map();
    const active = new Set();
    const lastPlayed = new Map();
    let context = null;
    let masterGain = null;
    let preloadStarted = false;

    function audioContext() {
      if (context) return context;
      const Constructor = window.AudioContext || window.webkitAudioContext;
      if (!Constructor || !gestureSeen) return null;
      try {
        context = new Constructor({ latencyHint: 'interactive' });
        masterGain = context.createGain();
        masterGain.gain.value = preferences.volume;
        masterGain.connect(context.destination);
      } catch (_) {
        context = null;
        masterGain = null;
      }
      return context;
    }

    function update() {
      if (masterGain && context) {
        masterGain.gain.setTargetAtTime(preferences.muted || !preferences.soundsEnabled ? 0 : preferences.volume, context.currentTime, 0.012);
      }
      if (preferences.soundsEnabled && !preferences.muted) preload();
    }

    async function load(name) {
      if (!SOUND_FILES[name]) return null;
      if (buffers.has(name)) return buffers.get(name);
      if (loading.has(name)) return loading.get(name);
      const operation = (async () => {
        try {
          let bytes = rawFiles.get(name);
          if (!bytes) {
            const response = await fetch(`${SOUND_BASE}${SOUND_FILES[name]}`, { cache: 'force-cache' });
            if (!response.ok) return null;
            bytes = await response.arrayBuffer();
            rawFiles.set(name, bytes);
          }
          const audio = audioContext();
          if (!audio) return null;
          const decoded = await audio.decodeAudioData(bytes.slice(0));
          buffers.set(name, decoded);
          return decoded;
        } catch (_) {
          return null;
        } finally {
          loading.delete(name);
        }
      })();
      loading.set(name, operation);
      return operation;
    }

    function preload() {
      if (preloadStarted || !preferences.soundsEnabled || preferences.muted) return;
      preloadStarted = true;
      const run = () => {
        Object.entries(SOUND_FILES).forEach(([name, file]) => {
          fetch(`${SOUND_BASE}${file}`, { cache: 'force-cache' })
            .then((response) => response.ok ? response.arrayBuffer() : null)
            .then((bytes) => { if (bytes) rawFiles.set(name, bytes); })
            .catch(() => {});
        });
      };
      if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1800 });
      else window.setTimeout(run, 160);
    }

    function stopLowerPriority(priority) {
      active.forEach((entry) => {
        if (entry.priority >= priority || active.size < 2) return;
        try { entry.source.stop(); }
        catch (_) {}
      });
    }

    function fallbackTone(name, audio) {
      const patterns = {
        click: [[540, 0, 0.055, 0.12]],
        open: [[480, 0, 0.09, 0.09], [690, 0.035, 0.085, 0.075]],
        close: [[620, 0, 0.075, 0.08], [410, 0.028, 0.075, 0.065]],
        transition: [[430, 0, 0.09, 0.07], [555, 0.025, 0.09, 0.06]],
        success: [[520, 0, 0.12, 0.075], [780, 0.055, 0.13, 0.08]],
        warning: [[390, 0, 0.12, 0.075], [330, 0.07, 0.11, 0.065]],
        error: [[245, 0, 0.105, 0.075], [195, 0.065, 0.115, 0.075]],
        notification: [[640, 0, 0.1, 0.065], [850, 0.05, 0.11, 0.07]],
        destructive: [[280, 0, 0.1, 0.07], [180, 0.055, 0.12, 0.075]],
        complete: [[460, 0, 0.12, 0.06], [620, 0.045, 0.13, 0.07], [790, 0.09, 0.14, 0.075]]
      };
      const pattern = patterns[name];
      if (!pattern || !masterGain) return false;
      const start = audio.currentTime;
      pattern.forEach(([frequency, delay, duration, gainValue]) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start + delay);
        gain.gain.setValueAtTime(0.0001, start + delay);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + delay + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + duration);
        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start(start + delay);
        oscillator.stop(start + delay + duration + 0.01);
      });
      return true;
    }

    function playDecoded(name, buffer, audio) {
      if (!buffer || !masterGain) return false;
      const source = audio.createBufferSource();
      const priority = SOUND_PRIORITIES[name] || 1;
      source.buffer = buffer;
      source.connect(masterGain);
      const entry = { source, priority };
      active.add(entry);
      source.addEventListener('ended', () => active.delete(entry), { once: true });
      stopLowerPriority(priority);
      source.start();
      return true;
    }

    function unlock() {
      gestureSeen = true;
      const audio = audioContext();
      if (audio?.state === 'suspended') audio.resume().catch(() => {});
      if (preferences.soundsEnabled && !preferences.muted) preload();
      return Boolean(audio);
    }

    function play(name, options = {}) {
      if (!SOUND_FILES[name] || !preferences.soundsEnabled || preferences.muted || preferences.volume <= 0) return false;
      if (document.visibilityState === 'hidden') return false;
      const now = performance.now();
      const cooldown = Number(options.cooldown ?? SOUND_COOLDOWNS[name] ?? 150);
      if (!options.force && now - Number(lastPlayed.get(name) || 0) < cooldown) return false;
      const audio = audioContext();
      if (!audio) return false;
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      lastPlayed.set(name, now);
      const buffered = buffers.get(name);
      if (buffered) return playDecoded(name, buffered, audio);
      fallbackTone(name, audio);
      load(name).catch(() => {});
      return true;
    }

    return Object.freeze({ play, preload, unlock, update, files: SOUND_FILES });
  })();

  function prefersReducedMotion() {
    return Boolean(mediaReducedMotion?.matches);
  }

  function visibleStatus(element) {
    if (!element || !element.isConnected || element.hidden || element.getAttribute('aria-hidden') === 'true') return false;
    const classes = element.classList;
    if ((classes.contains('account-status') || classes.contains('login-status')) && !classes.contains('visible')) return false;
    return true;
  }

  function semanticClassName(element) {
    return String(element?.className || '')
      .split(/\s+/)
      .filter((name) => name && !name.startsWith('portal-feedback-') && name !== 'portal-content-updating')
      .sort()
      .join(' ');
  }

  function classifyStatus(element) {
    const text = String(element?.textContent || '').trim().toLowerCase();
    const classes = semanticClassName(element).toLowerCase();
    if (!text) return '';
    if (/error|danger|falha|erro|inválid|nao foi|não foi|bloquead|expirad/.test(`${classes} ${text}`)) return 'error';
    if (/warning|aviso|atenção|atencao|pendente|aguarde antes/.test(`${classes} ${text}`)) return 'warning';
    if (/carregando|salvando|enviando|processando|entrando|criando|preparando|unificando|reconectando/.test(text)) return 'loading';
    if (/success|sucesso|salv[ao]|conclu[íi]|registrad|programad|copiad|criad[ao]|atualizad|enviad[ao]|confirmad[ao]|exclu[íi]d/.test(`${classes} ${text}`)) return 'success';
    return '';
  }

  function resolveElement(value) {
    if (!value) return null;
    if (value instanceof Element) return value;
    if (typeof value === 'string') return document.querySelector(value);
    return null;
  }

  function resultContext(element) {
    return element?.closest?.('form,.portal-modal,.citizen-modal-panel,.account-card,.portal-section,.telemedicine-row,.ai-chat,.portal-chat-panel') || element;
  }

  function pulse(element, visual) {
    const target = resolveElement(element);
    if (!target || !visual) return;
    const className = `portal-feedback-${visual}`;
    target.classList.remove(className);
    void target.offsetWidth;
    target.classList.add(className);
    window.setTimeout(() => target.classList.remove(className), prefersReducedMotion() ? 40 : TOKENS.resultDuration);
  }

  function emit(type, options = {}) {
    const definition = FEEDBACK_TYPES[type] || FEEDBACK_TYPES.click;
    const source = resolveElement(options.source);
    const now = performance.now();
    const previous = Number(lastFeedbackAt.get(type) || 0);
    const duplicate = !options.force && now - previous < Number(options.debounce ?? 180);
    lastFeedbackAt.set(type, now);
    pulse(source, options.visual || definition.visual);
    if (!duplicate && options.sound !== false && definition.sound) soundManager.play(options.sound || definition.sound, options);
    if (options.announce) announce(options.announce, options.assertive);
    try {
      document.dispatchEvent(new CustomEvent('portal:interaction-feedback', {
        detail: { type, source, version: VERSION, duplicate }
      }));
    } catch (_) {}
    return !duplicate;
  }

  function announce(message, assertive = false) {
    const region = document.getElementById('portalInteractionAnnouncer');
    if (!region || !message) return;
    region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    region.textContent = '';
    window.setTimeout(() => { region.textContent = String(message); }, 20);
  }

  function beginTask(element, options = {}) {
    const target = resolveElement(element);
    if (!target || taskStates.has(target)) return () => endTask(target);
    const originalBusy = target.getAttribute('aria-busy');
    target.classList.add('portal-feedback-pending');
    target.setAttribute('aria-busy', 'true');
    const timeout = window.setTimeout(() => endTask(target), Number(options.timeout || TOKENS.taskTimeout));
    taskStates.set(target, { timeout, originalBusy });
    emit('loading', { source: target, sound: false });
    return (resultType, resultOptions = {}) => {
      endTask(target);
      if (resultType) emit(resultType, { ...resultOptions, source: resultOptions.source || target });
    };
  }

  function endTask(element) {
    const target = resolveElement(element);
    const state = target ? taskStates.get(target) : null;
    if (!target || !state) return;
    window.clearTimeout(state.timeout);
    target.classList.remove('portal-feedback-pending');
    if (state.originalBusy === null) target.removeAttribute('aria-busy');
    else target.setAttribute('aria-busy', state.originalBusy);
    taskStates.delete(target);
  }

  function finishVisibleTasks(type, statusElement) {
    document.querySelectorAll('.portal-feedback-pending').forEach((element) => endTask(element));
    const context = resultContext(statusElement);
    if (context && type !== 'loading') pulse(context, type === 'error' ? 'context-error' : type === 'success' ? 'context-success' : type);
  }

  function processStatus(element) {
    if (!(element instanceof Element) || !element.matches(STATUS_SELECTOR)) return;
    const text = String(element.textContent || '').trim();
    const visible = visibleStatus(element);
    const snapshot = `${visible ? 1 : 0}:${semanticClassName(element)}:${text}`;
    if (statusSnapshots.get(element) === snapshot) return;
    statusSnapshots.set(element, snapshot);
    if (!visible || !text) return;
    const type = classifyStatus(element);
    if (!type) return;
    finishVisibleTasks(type, element);
    emit(type, { source: element, debounce: type === 'error' ? 360 : 240 });
  }

  function layerOpen(element) {
    if (element.classList.contains('portal-chat')) return element.classList.contains('open');
    if (element.classList.contains('ai-chat')) return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
    return !element.hidden && element.classList.contains('open') && element.getAttribute('aria-hidden') !== 'true';
  }

  function focusableIn(layer) {
    return layer.querySelector('[data-portal-initial-focus],input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),a[href]');
  }

  function processLayer(element, initialize = false) {
    if (!(element instanceof Element) || !element.matches(LAYER_SELECTOR)) return;
    const open = layerOpen(element);
    const previous = layerSnapshots.get(element);
    layerSnapshots.set(element, open);
    if (initialize || previous === undefined || previous === open) return;
    if (open) {
      layerFocus.set(element, document.activeElement instanceof Element ? document.activeElement : null);
      element.classList.add('portal-layer-entering');
      window.setTimeout(() => element.classList.remove('portal-layer-entering'), TOKENS.motionStandard + 40);
      emit('open', { source: element, debounce: 250 });
      if (element.matches('[role="dialog"],.modal-backdrop,.citizen-modal,.council-delete-dialog-backdrop,.portal-auxiliary-dialog,.ai-chat')) {
        window.setTimeout(() => focusableIn(element)?.focus?.({ preventScroll: true }), prefersReducedMotion() ? 0 : 35);
      }
    } else {
      emit('close', { source: element, debounce: 250 });
      const prior = layerFocus.get(element);
      if (prior?.isConnected) window.setTimeout(() => prior.focus?.({ preventScroll: true }), 0);
      layerFocus.delete(element);
    }
  }

  function scanNode(node) {
    if (!(node instanceof Element)) return;
    if (node.matches(STATUS_SELECTOR)) processStatus(node);
    node.querySelectorAll?.(STATUS_SELECTOR).forEach(processStatus);
    if (node.matches(LAYER_SELECTOR)) processLayer(node);
    node.querySelectorAll?.(LAYER_SELECTOR).forEach((layer) => processLayer(layer, true));
  }

  function startObserver() {
    document.querySelectorAll(STATUS_SELECTOR).forEach((element) => {
      statusSnapshots.set(element, `${visibleStatus(element) ? 1 : 0}:${semanticClassName(element)}:${String(element.textContent || '').trim()}`);
    });
    document.querySelectorAll(LAYER_SELECTOR).forEach((element) => processLayer(element, true));
    observer = new MutationObserver((mutations) => {
      const statuses = new Set();
      const layers = new Set();
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(scanNode);
        }
        const element = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
        const status = element?.matches?.(STATUS_SELECTOR) ? element : element?.closest?.(STATUS_SELECTOR);
        const layer = element?.matches?.(LAYER_SELECTOR) ? element : element?.closest?.(LAYER_SELECTOR);
        if (status) statuses.add(status);
        if (layer) layers.add(layer);
      });
      statuses.forEach(processStatus);
      layers.forEach((layer) => processLayer(layer));
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-hidden']
    });
  }

  function ruleDescriptor(entry, element) {
    const type = entry[1] || element.dataset.portalInteraction || 'click';
    return { type, updateSelector: entry[2] || element.dataset.portalUpdate || '' };
  }

  function findRule(target, eventType) {
    if (!(target instanceof Element)) return null;
    const rules = [];
    const route = ROUTE_RULES.find((candidate) => candidate.path.test(location.pathname));
    if (route?.[eventType]) rules.push(...route[eventType]);
    rules.push(...customRules[eventType]);
    if (eventType === 'click') rules.push(...GLOBAL_CLICK_RULES);
    for (const entry of rules) {
      const element = target.closest(entry[0]);
      if (element) return { element, ...ruleDescriptor(entry, element) };
    }
    return null;
  }

  function animateContent(selector) {
    if (!selector) return;
    selector.split(',').map((value) => value.trim()).filter(Boolean).forEach((value) => {
      const element = document.querySelector(value);
      if (!element) return;
      element.classList.remove('portal-content-updating');
      void element.offsetWidth;
      element.classList.add('portal-content-updating');
      window.setTimeout(() => element.classList.remove('portal-content-updating'), prefersReducedMotion() ? 40 : TOKENS.motionStandard + 60);
    });
  }

  function markPress(element) {
    if (!element || element.matches(':disabled,[aria-disabled="true"]')) return;
    element.classList.add('portal-interaction-target', 'portal-interaction-pressing');
    window.setTimeout(() => element.classList.remove('portal-interaction-pressing'), prefersReducedMotion() ? 35 : TOKENS.motionFast + 40);
  }

  function handleClick(event) {
    const rule = findRule(event.target, 'click');
    if (!rule || rule.element.closest('[data-portal-interaction-ignore]')) return;
    if (rule.element.matches(':disabled,[aria-disabled="true"]')) return;
    markPress(rule.element);
    animateContent(rule.updateSelector);
    if (rule.type === 'loading') beginTask(rule.element);
    else emit(rule.type, { source: rule.element });
  }

  function handleChange(event) {
    const rule = findRule(event.target, 'change');
    if (!rule || rule.element.closest('[data-portal-interaction-ignore]')) return;
    markPress(rule.element.closest('label') || rule.element);
    animateContent(rule.updateSelector);
    emit(rule.type, { source: rule.element });
  }

  function handleSubmit(event) {
    const submitter = event.submitter || event.target.querySelector?.('[type="submit"]');
    if (!submitter || submitter.closest('[data-portal-interaction-ignore]')) return;
    markPress(submitter);
    beginTask(submitter);
  }

  function handleToggle(event) {
    const details = event.target;
    if (!(details instanceof Element) || details.tagName !== 'DETAILS' || !details.matches('[data-portal-interaction],.privacy-help-panels details')) return;
    emit(details.open ? 'expand' : 'collapse', { source: details, debounce: 120 });
  }

  async function persistPreferences() {
    const auth = window.RegulationAuth;
    if (!auth?.getToken?.() || !auth?.updateSecurity) return { localOnly: true };
    const security = await auth.updateSecurity(remotePreferencePayload());
    return { localOnly: false, security };
  }

  function schedulePreferencePersistence() {
    window.clearTimeout(preferenceTimer);
    preferenceTimer = window.setTimeout(() => persistPreferences().catch(() => {
      const status = document.getElementById('interfaceSoundsStatus');
      if (status) setPreferenceStatus('A preferência funciona neste dispositivo, mas não foi possível sincronizá-la com a conta.', 'error');
    }), TOKENS.preferenceDebounce);
  }

  function applyPreferences(next, options = {}) {
    preferences = normalizePreferences({ ...preferences, ...next }, preferences);
    saveStoredPreferences();
    soundManager.update();
    renderPreferenceControls();
    syncSoundStateAttribute();
    try { document.dispatchEvent(new CustomEvent('portal:interaction-preferences', { detail: { ...preferences } })); }
    catch (_) {}
    if (options.persist === true) return persistPreferences();
    if (options.persist === 'debounced') schedulePreferencePersistence();
    return Promise.resolve({ localOnly: true });
  }

  function getPreferences() {
    return { ...preferences };
  }

  function setPreferenceStatus(message, type = 'success') {
    const status = document.getElementById('interfaceSoundsStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `account-status visible ${type}`;
  }

  function renderPreferenceControls() {
    const enabled = document.getElementById('interfaceSoundsEnabled');
    const volume = document.getElementById('interfaceSoundVolume');
    const output = document.getElementById('interfaceSoundVolumeValue');
    const mute = document.getElementById('interfaceSoundsMute');
    if (enabled) enabled.checked = preferences.soundsEnabled;
    if (volume) {
      volume.value = String(Math.round(preferences.volume * 100));
      volume.disabled = !preferences.soundsEnabled;
    }
    if (output) output.textContent = `${Math.round(preferences.volume * 100)}%`;
    if (mute) {
      mute.disabled = !preferences.soundsEnabled;
      mute.setAttribute('aria-pressed', preferences.muted ? 'true' : 'false');
      mute.innerHTML = `${preferences.muted ? INLINE_ICONS.muted : INLINE_ICONS.sound}<span>${preferences.muted ? 'Ativar som' : 'Silenciar agora'}</span>`;
    }
    const quick = document.getElementById('portalSoundQuickToggle');
    if (quick) {
      quick.hidden = !preferences.soundsEnabled;
      quick.setAttribute('aria-pressed', preferences.muted ? 'true' : 'false');
      quick.setAttribute('aria-label', preferences.muted ? 'Reativar sons da interface' : 'Silenciar sons da interface');
      quick.title = preferences.muted ? 'Reativar sons da interface' : 'Silenciar sons da interface';
      quick.classList.toggle('is-muted', preferences.muted);
      quick.innerHTML = preferences.muted ? INLINE_ICONS.muted : INLINE_ICONS.sound;
    }
  }

  function bindPreferencePanel() {
    const enabled = document.getElementById('interfaceSoundsEnabled');
    const volume = document.getElementById('interfaceSoundVolume');
    const mute = document.getElementById('interfaceSoundsMute');
    if (!enabled || !volume || !mute) return;
    enabled.closest('[data-portal-sound-settings]')?.setAttribute('data-portal-interaction-ignore', '');
    enabled.addEventListener('change', async () => {
      if (enabled.checked) soundManager.unlock();
      try {
        await applyPreferences({ soundsEnabled: enabled.checked, muted: enabled.checked ? preferences.muted : false }, { persist: true });
        setPreferenceStatus(enabled.checked ? 'Sons da interface ativados nesta conta.' : 'Sons da interface desativados nesta conta.');
        if (enabled.checked) emit('success', { source: enabled.closest('.interface-sound-toggle'), force: true });
      } catch (_) {
        setPreferenceStatus('A preferência foi aplicada neste dispositivo, mas não pôde ser sincronizada com a conta.', 'error');
      }
    });
    volume.addEventListener('input', () => {
      applyPreferences({ volume: Number(volume.value) / 100 });
    });
    volume.addEventListener('change', async () => {
      try {
        await applyPreferences({ volume: Number(volume.value) / 100 }, { persist: true });
        setPreferenceStatus(`Volume ajustado para ${Math.round(preferences.volume * 100)}%.`, 'info');
        emit('notification', { source: volume, force: true });
      } catch (_) {
        setPreferenceStatus('O volume foi aplicado neste dispositivo, mas não pôde ser sincronizado com a conta.', 'error');
      }
    });
    mute.addEventListener('click', async () => {
      const nextMuted = !preferences.muted;
      if (nextMuted) soundManager.play('close', { force: true });
      try {
        await applyPreferences({ muted: nextMuted }, { persist: true });
        setPreferenceStatus(nextMuted ? 'Portal silenciado.' : 'Sons da interface reativados.', 'info');
        if (!nextMuted) emit('open', { source: mute, force: true });
      } catch (_) {
        setPreferenceStatus('O silêncio rápido foi aplicado neste dispositivo, mas não pôde ser sincronizado com a conta.', 'error');
      }
    });
    renderPreferenceControls();
  }

  function mountUtilityUi() {
    if (!document.getElementById('portalInteractionAnnouncer')) {
      const announcer = document.createElement('div');
      announcer.id = 'portalInteractionAnnouncer';
      announcer.className = 'portal-interaction-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    if (!document.getElementById('portalSoundQuickToggle')) {
      const quick = document.createElement('button');
      quick.id = 'portalSoundQuickToggle';
      quick.className = 'portal-sound-quick-toggle';
      quick.type = 'button';
      quick.hidden = true;
      quick.setAttribute('data-portal-interaction-ignore', '');
      quick.addEventListener('click', async () => {
        const nextMuted = !preferences.muted;
        if (nextMuted) soundManager.play('close', { force: true });
        await applyPreferences({ muted: nextMuted }, { persist: true }).catch(() => {});
        announce(nextMuted ? 'Sons da interface silenciados.' : 'Sons da interface reativados.');
        if (!nextMuted) soundManager.play('open', { force: true });
      });
      document.body.appendChild(quick);
    }
    renderPreferenceControls();
  }

  async function hydrateAccountPreferences() {
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    const auth = window.RegulationAuth;
    const user = cachedUser();
    setCurrentUser(user);
    if (!auth?.getToken?.()) return;
    const refreshed = cachedUser();
    if (hasRemotePreferences(refreshed)) {
      preferences = normalizePreferences(refreshed, preferences);
      saveStoredPreferences();
      soundManager.update();
      syncSoundStateAttribute();
      renderPreferenceControls();
      return;
    }
    try {
      const security = await auth.getSecurity();
      if (!hasRemotePreferences(security)) return;
      preferences = normalizePreferences(security, preferences);
      saveStoredPreferences();
      soundManager.update();
      syncSoundStateAttribute();
      renderPreferenceControls();
    } catch (_) {}
  }

  function register(input) {
    const eventType = input?.event === 'change' ? 'change' : 'click';
    const selector = String(input?.selector || '').trim();
    if (!selector) throw new TypeError('Informe um seletor para registrar a interação.');
    const type = FEEDBACK_TYPES[input.type] ? input.type : 'click';
    customRules[eventType].push([selector, type, String(input.updateSelector || '')]);
    return () => {
      const index = customRules[eventType].findIndex((entry) => entry[0] === selector && entry[1] === type);
      if (index >= 0) customRules[eventType].splice(index, 1);
    };
  }

  function transition(update, options = {}) {
    if (typeof update !== 'function') return Promise.resolve();
    if (prefersReducedMotion() || typeof document.startViewTransition !== 'function') {
      update();
      animateContent(options.updateSelector || '');
      return Promise.resolve();
    }
    const viewTransition = document.startViewTransition(update);
    return viewTransition.finished.catch(() => {});
  }

  function notify(type, message, source) {
    const normalized = FEEDBACK_TYPES[type] ? type : 'notification';
    return emit(normalized, { source, announce: message, assertive: normalized === 'error' });
  }

  function start() {
    if (started || !document.body) return;
    started = true;
    document.documentElement.dataset.portalInteractions = 'v1';
    preferences = loadStoredPreferences();
    syncSoundStateAttribute();
    mountUtilityUi();
    bindPreferencePanel();
    startObserver();
    document.addEventListener('click', handleClick, { capture: true, signal });
    document.addEventListener('change', handleChange, { capture: true, signal });
    document.addEventListener('submit', handleSubmit, { capture: true, signal });
    document.addEventListener('toggle', handleToggle, { capture: true, signal });
    document.addEventListener('pointerdown', () => {
      gestureSeen = true;
      if (preferences.soundsEnabled && !preferences.muted) soundManager.unlock();
    }, { capture: true, passive: true, signal });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      gestureSeen = true;
      if (preferences.soundsEnabled && !preferences.muted) soundManager.unlock();
    }, { capture: true, signal });
    window.addEventListener('storage', (event) => {
      if (event.key !== storageKey()) return;
      preferences = loadStoredPreferences();
      soundManager.update();
      syncSoundStateAttribute();
      renderPreferenceControls();
    }, { signal });
    hydrateAccountPreferences();
  }

  function destroy() {
    controller.abort();
    observer?.disconnect();
    observer = null;
    started = false;
  }

  window.PortalInteractions = Object.freeze({
    version: VERSION,
    tokens: TOKENS,
    sounds: soundManager,
    emit,
    notify,
    announce,
    beginTask,
    endTask,
    transition,
    register,
    getPreferences,
    setPreferences: applyPreferences,
    prefersReducedMotion,
    start,
    destroy,
    __test: Object.freeze({
      normalizePreferences,
      classifyStatus,
      semanticClassName,
      feedbackTypes: FEEDBACK_TYPES,
      routeRules: ROUTE_RULES,
      defaultPreferences: DEFAULT_PREFERENCES
    })
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
