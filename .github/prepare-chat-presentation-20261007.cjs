'use strict';
// One-shot authoring on a pinned feature branch; removed before review/merge.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = process.cwd();
const backup = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'chat-presentation-'));
const changes = new Map();
const read = file => changes.get(file) ?? fs.readFileSync(path.join(root, file), 'utf8');
const put = (file, text) => changes.set(file, text);
const replace = (file, from, to, expected = 1) => {
  const text = read(file), count = text.split(from).length - 1;
  if (count !== expected) throw new Error(`${file}: expected ${expected} matches, found ${count}: ${from.slice(0, 80)}`);
  put(file, text.split(from).join(to));
};
const blob = file => { const b = fs.readFileSync(path.join(root, file)); return crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'); };
if (blob('js/portal-chat.js') !== '0c29c4ac3e2ba58ecfd46b2704873b5c2c0e5b6d' || blob('css/portal-chat.css') !== '1db22a18bc5119b48ba6a38a2ac98f25d628d209') throw new Error('Baseline changed: stop and review.');
const js = 'js/portal-chat.js';
replace(js, '  let historyLoadPending = null;', '  let historyLoadPending = null;\n  let messageDayTimer = null;');
replace(js, `    const parsed = new Date(\x60\x24{String(value).replace(' ', 'T')}Z\x60);`, `    const text = String(value).trim().replace(' ', 'T');
    if (!/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d+)?)?(?:Z|[+-]\\d{2}:?\\d{2})?$/i.test(text)) return null;
    const parsed = new Date(/(?:Z|[+-]\\d{2}:?\\d{2})$/i.test(text) ? text : \x60\x24{text}Z\x60);`);
replace(js, `  function avatarStyle(contact) {
    const photo = String(contact?.avatarDataUrl || '');
    return photo ? \x60background-image:url('\x24{photo.replace(/'/g, '%27')}')\x60 : '';
  }`, `  function avatarMarkup(contact) {
    const fallback = initials(contact?.name || contact?.username).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const photo = String(contact?.avatarDataUrl || '');
    // Match the profile API's raster-only data URL contract; never load arbitrary URLs.
    const valid = photo.length <= 220000 && /^data:image\\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo);
    return \x60<span class="portal-chat-avatar-initials">\x24{fallback}</span>\x24{valid ? \x60<img class="portal-chat-avatar-image" src="\x24{photo}" alt="" decoding="async">\x60 : ''}\x60;
  }

  function updateHeaderAvatar() {
    const avatar = document.getElementById('portalChatHeaderAvatar');
    if (!avatar) return;
    avatar.hidden = !activeContact;
    const markup = activeContact ? avatarMarkup(activeContact) : '';
    if (avatar._portalChatMarkup !== markup) {
      avatar._portalChatMarkup = markup;
      avatar.innerHTML = markup;
    }
  }

  function messageDayKey(date) {
    if (!date || Number.isNaN(date.getTime())) return '';
    return [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function messageDayLabel(date, now = new Date()) {
    const key = messageDayKey(date);
    if (!key) return 'Data não disponível';
    if (key === messageDayKey(now)) return 'Hoje';
    const yesterday = new Date(now.getTime());
    yesterday.setDate(yesterday.getDate() - 1);
    if (key === messageDayKey(yesterday)) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function syncMessageDateDividers() {
    const box = document.getElementById('portalChatMessages');
    if (!box?.querySelectorAll) return;
    const dividers = Array.from(box.querySelectorAll('[data-chat-date-divider]'));
    const now = new Date();
    let previousDay = '', used = 0;
    // Reconcile separators only. Message nodes, receipts and the unread boundary stay intact.
    for (const message of box.querySelectorAll('.portal-chat-message')) {
      const date = parseServerDate(message.dataset.chatSentAt);
      const day = messageDayKey(date) || 'unknown';
      if (day === previousDay) continue;
      previousDay = day;
      const divider = dividers[used++] || document.createElement('div');
      divider.className = 'portal-chat-date-divider';
      divider.dataset.chatDateDivider = day;
      divider.setAttribute('role', 'separator');
      const label = messageDayLabel(date, now);
      divider.setAttribute('aria-label', label);
      divider.title = date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : label;
      let text = divider.querySelector('span');
      if (!text) { text = document.createElement('span'); divider.appendChild(text); }
      if (text.textContent !== label) text.textContent = label;
      const previous = message.previousElementSibling;
      const reference = previous?.hasAttribute('data-chat-unread-divider') ? previous : message;
      if (divider.nextElementSibling !== reference) box.insertBefore(divider, reference);
    }
    for (const stale of dividers.slice(used)) stale.remove();
  }

  function scheduleMessageDayRefresh() {
    window.clearTimeout(messageDayTimer);
    messageDayTimer = null;
    if (!activeContact || document.hidden) return;
    const now = new Date(), nextDay = new Date(now.getTime());
    nextDay.setHours(24, 0, 0, 50);
    messageDayTimer = window.setTimeout(() => {
      syncMessageDateDividers();
      scheduleMessageDayRefresh();
    }, Math.max(50, nextDay.getTime() - now.getTime()));
  }`);
replace(js, `<span class="portal-chat-avatar" style="\x24{avatarStyle(contact)}">\x24{contact.avatarDataUrl ? '' : initials(contact.name || contact.username)}</span>`, `<span class="portal-chat-avatar" aria-hidden="true">\x24{avatarMarkup(contact)}</span>`);
replace(js, `  function updateConversationHeader() {
    const name`, `  function updateConversationHeader() {
    updateHeaderAvatar();
    const name`);
replace(js, `    element.className = \x60portal-chat-message \x24{mine ? 'mine' : 'theirs'}\x60;`, `    element.className = \x60portal-chat-message \x24{mine ? 'mine' : 'theirs'}\x60;
    element.dataset.chatSentAt = String(message.sentAt || '');`);
replace(js, `    if (replace || nearBottom) box.scrollTop = box.scrollHeight;`, `    syncMessageDateDividers();
    if (replace || nearBottom) box.scrollTop = box.scrollHeight;`);
replace(js, `    const previousHeight = box.scrollHeight;
    const fragment`, `    const previousHeight = box.scrollHeight;
    const previousTop = box.scrollTop;
    const fragment`);
replace(js, `    box.scrollTop += Math.max(0, box.scrollHeight - previousHeight);`, `    syncMessageDateDividers();
    box.scrollTop = previousTop + Math.max(0, box.scrollHeight - previousHeight);`);
replace(js, `    updateConversationHeader();
    const renderedFromMemory`, `    updateConversationHeader();
    scheduleMessageDayRefresh();
    const renderedFromMemory`);
replace(js, `    activeContact = null;
    activeUnreadBoundaryId = 0;`, `    activeContact = null;
    updateHeaderAvatar();
    scheduleMessageDayRefresh();
    activeUnreadBoundaryId = 0;`);
replace(js, `      existing.replaceWith(replacement);
      lastMessageId`, `      const box = document.getElementById('portalChatMessages');
      const nearBottom = box && box.scrollHeight - box.scrollTop - box.clientHeight < 80;
      existing.replaceWith(replacement);
      syncMessageDateDividers();
      if (nearBottom) box.scrollTop = box.scrollHeight;
      lastMessageId`);
replace(js, `          <div class="portal-chat-header-main"><strong id="portalChatHeaderName">`, `          <span class="portal-chat-avatar portal-chat-header-avatar" id="portalChatHeaderAvatar" aria-hidden="true" hidden></span>
          <div class="portal-chat-header-main"><strong id="portalChatHeaderName">`);
replace(js, `    document.body.appendChild(root);
`, `    document.body.appendChild(root);
    root.addEventListener('error', (event) => {
      if (event.target?.classList?.contains('portal-chat-avatar-image')) event.target.remove();
    }, true);
`);
replace(js, `      window.setTimeout(() => {
        if (!document.hidden) void loadContacts(true);
      }, 10000);`, `      // Restore immediately, then refresh the authorized contacts/photos without the old 10s delay.
      void loadContacts(true);`);
replace(js, `    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {`, `    document.addEventListener('visibilitychange', () => {
      scheduleMessageDayRefresh();
      if (!document.hidden) {
        syncMessageDateDividers();`);
replace(js, `  window.addEventListener('portal:session-cleared', () => {
    realtimeStopped`, `  window.addEventListener('portal:session-cleared', () => {
    window.clearTimeout(messageDayTimer);
    messageDayTimer = null;
    const avatar = document.getElementById('portalChatHeaderAvatar');
    if (avatar) { avatar.hidden = true; avatar.innerHTML = ''; avatar._portalChatMarkup = ''; }
    realtimeStopped`);
const css = `
/* Photos are content, not a CSS background: theme rules cannot erase them. */
.portal-chat-avatar{position:relative;flex-shrink:0}
.portal-chat-avatar-image{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;border-radius:inherit}
.portal-chat-header .portal-chat-header-avatar{width:40px;height:40px;min-width:40px;border-color:rgba(255,255,255,.4)}
.portal-chat-header .portal-chat-header-avatar[hidden]{display:none!important}
.portal-chat-header .portal-chat-icon-button{flex-shrink:0}
body.mobile-home-mode .portal-chat-header .portal-chat-header-avatar{width:42px!important;height:42px!important;min-width:42px}
.portal-chat-date-divider{width:100%;flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0;color:#45677e;font-size:.73rem;font-weight:800;line-height:1.4}
.portal-chat-date-divider::before,.portal-chat-date-divider::after{content:"";height:1px;flex:1;background:#c9dbe7}
.portal-chat-date-divider>span{padding:4px 10px;border:1px solid #cfdee8;border-radius:999px;background:#e6eff5;white-space:nowrap}
html[data-portal-theme="dark"] .portal-chat-date-divider{color:#c3d6e4}
html[data-portal-theme="dark"] .portal-chat-date-divider::before,html[data-portal-theme="dark"] .portal-chat-date-divider::after{background:#2b4759}
html[data-portal-theme="dark"] .portal-chat-date-divider>span{background:#142c3c;border-color:#355466}
body.mobile-home-mode .portal-chat-date-divider{font-size:13px}
.portal-chat-panel{grid-template-columns:minmax(0,1fr)}
.portal-chat-header,.portal-chat-body,.portal-chat-view{min-width:0}
`;
put('css/portal-chat.css', read('css/portal-chat.css') + css);
const oldVersion = '20261002-attention-fix-1', version = '20261007-chat-avatar-timeline-1';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => ['node_modules','.git'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
for (const absolute of walk(root)) {
  const file = path.relative(root, absolute).replaceAll('\\', '/');
  if (!(file.endsWith('.html') || file === js || file === 'js/portal-global-chat.js' || file === 'portal-sw.js' || file.startsWith('worker/tests/') || file === '.github/workflows/validate-portal-chat.yml')) continue;
  const text = read(file);
  if (text.includes(oldVersion)) put(file, text.replaceAll(oldVersion, version));
}
replace('portal-sw.js', "// Renova a Central para carregar a navegação privada em RAM.\nconst CACHE_VERSION = '20261003-documents-navigation-1';", "// Renova os assets do chat para fotos nos dois temas e divisores por data.\nconst CACHE_VERSION = '20261007-chat-avatar-timeline-1';");
for (const file of ['portal-performance.test.mjs','documents-ui.test.mjs','account-first-access-ui.test.mjs','global-navigation.test.mjs']) {
  replace('worker/tests/' + file, '20261003-documents-navigation-1', version);
}
const wf = '.github/workflows/validate-portal-chat.yml';
replace(wf, `          grep -Fq "background-image:url('" js/portal-chat.js\n          ! grep -Fq 'background-image:url("\x24{photo' js/portal-chat.js`, `          grep -q 'portal-chat-avatar-image' js/portal-chat.js
          grep -q 'portalChatHeaderAvatar' js/portal-chat.js
          grep -q 'syncMessageDateDividers' js/portal-chat.js
          grep -q 'portal-chat-date-divider' css/portal-chat.css`);
replace(wf, '          node --test worker/tests/chat-attention*.test.mjs', '          node --test worker/tests/chat-attention*.test.mjs\n          node --test worker/tests/chat-presentation.test.mjs');
const doc = `
## Fotos e divisão cronológica da conversa — 07/10/2026

Decisão aprovada: o cabeçalho da conversa aberta mostra a foto do interlocutor ao
lado do nome. A lista e o cabeçalho usam a foto já autorizada por /api/chat/users,
com iniciais como alternativa quando não existe foto ou o arquivo não pode ser
exibido. A foto é um elemento img, separado do fundo: o degradê importante do tema
escuro não pode apagá-la. Só são aceitos os mesmos data URLs raster JPEG, PNG e WebP
limitados a 220000 caracteres da API de perfil. Não há novas URLs externas,
permissões, upload ou requisições por avatar. Ao voltar à lista o avatar do cabeçalho
é ocultado e ao encerrar a sessão é limpo. Snapshots privados continuam sem fotos;
a revalidação de contatos ocorre em segundo plano imediatamente após restauração,
sem o antigo atraso fixo de dez segundos.

O histórico exibe uma divisão central no início de cada dia com mensagens:
**Hoje**, **Ontem**, ou a data completa **DD/MM/AAAA**. Usa o mesmo fuso local do
navegador já empregado no horário das mensagens; timestamps SQL sem fuso são UTC,
e timestamps ISO com Z/offset mantêm seu fuso explícito. Datas inválidas não viram
Hoje: recebem Data não disponível. As etiquetas relativas se atualizam na virada
do dia e ao voltar à aba, sem buscar mensagens só para recalcular o texto.

O marcador **Novas mensagens** permanece independente. Quando os dois coincidem,
a ordem é data, Novas mensagens, primeiro balão não lido. Os divisores são
reconciliados sem recriar os balões ao receber mensagens, confirmar envio otimista,
reabrir a conversa ou carregar páginas antigas. A junção de duas páginas do mesmo
dia não duplica o divisor e preserva a posição de leitura.

Alteração somente de apresentação: não modifica corpo, sent_at, ordem armazenada,
recibos, transporte, autorização ou banco. Testes de datas/avatares integram o gate
de chat; a conferência visual usa somente perfis e mensagens fictícios em navegador
isolado, com temas claro/escuro e tamanhos desktop/mobile.
`;
put('docs/CHAT-PROFISSIONAL.md', read('docs/CHAT-PROFISSIONAL.md') + doc);
put(wf, read(wf) + "\n  browser-chat-presentation:\n    needs: validate-chat\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '24'\n      - name: Preparar navegador isolado\n        run: |\n          npm install --prefix \"$RUNNER_TEMP/chat-browser\" --no-save --ignore-scripts --no-audit --no-fund playwright@1.56.1\n          node \"$RUNNER_TEMP/chat-browser/node_modules/playwright/cli.js\" install --with-deps chromium\n      - name: Fotos, temas, datas e paginação com dados fictícios\n        run: |\n          NODE_PATH=\"$RUNNER_TEMP/chat-browser/node_modules\" PORTAL_CHAT_EVIDENCE_DIR=\"$RUNNER_TEMP/chat-presentation-evidence\" node worker/tests/browser/chat-presentation.cjs\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: chat-presentation-synthetic\n          path: ${{ runner.temp }}/chat-presentation-evidence\n          if-no-files-found: ignore\n");
for (const [file, text] of changes) {
  const oldPath = path.join(backup, file); fs.mkdirSync(path.dirname(oldPath), { recursive: true });
  fs.copyFileSync(path.join(root, file), oldPath);
  fs.writeFileSync(path.join(root, file), text, 'utf8');
}
fs.writeFileSync(path.join(process.env.RUNNER_TEMP || require('node:os').tmpdir(), 'presentation-changed.json'), JSON.stringify([...changes.keys()], null, 2));
console.log(JSON.stringify({ files: [...changes.keys()], total: changes.size }, null, 2));
