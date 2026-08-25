'use strict';

(() => {
  let logoSequence = 0;

  function createGeminiLogo(className) {
    logoSequence += 1;
    const clipId = `gemini-spark-clip-${logoSequence}`;
    const wrapper = document.createElement('span');
    wrapper.className = className;
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
      <svg viewBox="0 0 100 100" focusable="false">
        <defs>
          <clipPath id="${clipId}">
            <path d="M50 4C56 26 69 43 96 49C69 55 56 72 50 96C44 72 31 55 4 49C31 43 44 26 50 4Z"/>
          </clipPath>
          <radialGradient id="${clipId}-red" cx="50%" cy="0%" r="73%">
            <stop offset="0" stop-color="#ff454d"/><stop offset="1" stop-color="#ff454d" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="${clipId}-blue" cx="100%" cy="48%" r="82%">
            <stop offset="0" stop-color="#3984f7"/><stop offset="1" stop-color="#3984f7" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="${clipId}-green" cx="50%" cy="100%" r="72%">
            <stop offset="0" stop-color="#00b56e"/><stop offset="1" stop-color="#00b56e" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="${clipId}-yellow" cx="0%" cy="50%" r="78%">
            <stop offset="0" stop-color="#fbbc04"/><stop offset="1" stop-color="#fbbc04" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <g clip-path="url(#${clipId})">
          <rect width="100" height="100" fill="#4b82eb"/>
          <rect width="100" height="100" fill="url(#${clipId}-red)"/>
          <rect width="100" height="100" fill="url(#${clipId}-blue)"/>
          <rect width="100" height="100" fill="url(#${clipId}-green)"/>
          <rect width="100" height="100" fill="url(#${clipId}-yellow)"/>
        </g>
      </svg>`;
    return wrapper;
  }

  function applyGeminiTheme() {
    const launcher = document.getElementById('aiLauncher');
    const title = document.getElementById('aiChatTitle');
    const titleContainer = document.querySelector('.ai-chat-title');
    const mode = document.getElementById('aiMode');
    const header = document.querySelector('.ai-chat-header');

    if (!launcher || !title || !titleContainer || !mode || !header) return false;
    if (launcher.dataset.geminiThemeApplied === 'true') return true;

    launcher.querySelector('svg')?.remove();
    launcher.prepend(createGeminiLogo('ai-gemini-launcher-logo'));
    launcher.setAttribute('aria-label', 'Abrir pré-regulação com Gemini');

    titleContainer.querySelector('svg')?.remove();
    titleContainer.prepend(createGeminiLogo('ai-gemini-header-logo'));
    title.textContent = 'Pré-regulação com Gemini';

    const subtitle = titleContainer.querySelector('p');
    if (subtitle) subtitle.textContent = 'Simulação baseada em protocolo + prática regulatória';

    const provider = document.createElement('span');
    provider.className = 'ai-provider-status';
    provider.id = 'aiProviderStatus';
    provider.dataset.state = window.REGULATION_AI_CONFIG?.endpoint ? 'configured' : 'offline';
    const providerDot = document.createElement('span');
    providerDot.setAttribute('aria-hidden', 'true');
    const providerLabel = document.createElement('span');
    providerLabel.className = 'ai-provider-label';
    providerLabel.textContent = window.REGULATION_AI_CONFIG?.endpoint ? 'Gemini configurado' : 'Consulta local';
    provider.append(providerDot, providerLabel);
    header.appendChild(provider);

    mode.textContent = 'Assistente com base nos protocolos';
    mode.classList.add('connected', 'ai-protocol-seal');

    launcher.dataset.geminiThemeApplied = 'true';
    return true;
  }

  function initialize() {
    if (applyGeminiTheme()) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (applyGeminiTheme() || attempts >= 100) window.clearInterval(timer);
    }, 50);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
