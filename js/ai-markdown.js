'use strict';

(() => {
  const STYLE_ID = 'ai-rich-response-styles';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .ai-message.assistant.ai-message-rich { white-space: normal; }
      .ai-message-rich h3 {
        margin: 0 0 10px;
        color: #12304d;
        font-size: .94rem;
        line-height: 1.35;
      }
      .ai-message-rich p { margin: 0 0 10px; }
      .ai-message-rich p:last-child,
      .ai-message-rich ul:last-child,
      .ai-message-rich ol:last-child { margin-bottom: 0; }
      .ai-message-rich ul,
      .ai-message-rich ol {
        margin: 0 0 11px;
        padding-left: 20px;
      }
      .ai-message-rich li { margin: 0 0 5px; }
      .ai-message-rich strong { color: #0f2740; font-weight: 800; }
    `;
    document.head.appendChild(style);
  }

  function appendInlineFormatting(parent, value) {
    const text = String(value || '');
    const boldPattern = /\*\*(.+?)\*\*/g;
    let cursor = 0;
    let match;

    while ((match = boldPattern.exec(text)) !== null) {
      if (match.index > cursor) parent.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      const strong = document.createElement('strong');
      strong.textContent = match[1];
      parent.appendChild(strong);
      cursor = match.index + match[0].length;
    }

    if (cursor < text.length) parent.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function renderAssistantMessage(element) {
    if (!(element instanceof HTMLElement)) return;
    if (!element.matches('.ai-message.assistant')) return;
    if (element.classList.contains('loading') || element.dataset.richTextRendered === 'true') return;

    const source = element.textContent || '';
    const lines = source.replace(/\r/g, '').split('\n');
    const fragment = document.createDocumentFragment();
    let paragraphLines = [];
    let activeList = null;
    let activeListType = '';

    function flushParagraph() {
      if (!paragraphLines.length) return;
      const paragraph = document.createElement('p');
      appendInlineFormatting(paragraph, paragraphLines.join(' '));
      fragment.appendChild(paragraph);
      paragraphLines = [];
    }

    function resetList() {
      activeList = null;
      activeListType = '';
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        resetList();
        continue;
      }

      const heading = line.match(/^#{1,3}\s+(.+)$/);
      if (heading) {
        flushParagraph();
        resetList();
        const title = document.createElement('h3');
        appendInlineFormatting(title, heading[1]);
        fragment.appendChild(title);
        continue;
      }

      const unorderedItem = line.match(/^[-*]\s+(.+)$/);
      const orderedItem = line.match(/^\d+[.)]\s+(.+)$/);
      if (unorderedItem || orderedItem) {
        flushParagraph();
        const type = orderedItem ? 'ol' : 'ul';
        if (!activeList || activeListType !== type) {
          activeList = document.createElement(type);
          activeListType = type;
          fragment.appendChild(activeList);
        }
        const item = document.createElement('li');
        appendInlineFormatting(item, (orderedItem || unorderedItem)[1]);
        activeList.appendChild(item);
        continue;
      }

      resetList();
      paragraphLines.push(line);
    }

    flushParagraph();
    element.replaceChildren(fragment);
    element.classList.add('ai-message-rich');
    element.dataset.richTextRendered = 'true';
  }

  function processMessages(root = document) {
    root.querySelectorAll?.('.ai-message.assistant').forEach(renderAssistantMessage);
    if (root instanceof HTMLElement && root.matches('.ai-message.assistant')) renderAssistantMessage(root);
  }

  function initialize() {
    addStyles();
    processMessages();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) processMessages(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
