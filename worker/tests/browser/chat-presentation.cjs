'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('playwright');
const repo = path.resolve(__dirname, '../../..');
const read = file => fs.readFileSync(path.join(repo, file), 'utf8');
const index = read('index.html');
const links = [...index.matchAll(/<link\b[^>]*>/gi)].filter(m => /rel="stylesheet"/.test(m[0])).map(m => m[0].match(/href="([^"]+)"/)?.[1]?.split('?')[0]?.replace(/^\//, '')).filter(file => file && fs.existsSync(path.join(repo, file)));
const styles = [...new Set([...links, 'css/portal-chat.css', 'css/portal-chat-profile-link.css'])].map(read).join('\n');
const csp = index.match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*>/i)?.[0] || '';
const endpoint = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const output = process.env.PORTAL_CHAT_EVIDENCE_DIR || path.join(require('node:os').tmpdir(), 'portal-chat-presentation-evidence'); fs.mkdirSync(output, { recursive: true });
const source = read('js/portal-chat.js').replace('  window.PortalChat = Object.freeze({', `
  window.presentationFixture = { appendMessages, prependMessages, syncMessageDateDividers, scheduleMessageDayRefresh,
    acknowledge(message) { replacePendingMessage(message.clientId, message, activeContact.username); },
    pending() { return Array.from(pendingMessages.values()).map(e => e.message); }
  };
  window.PortalChat = Object.freeze({`);
(async () => {
  const browser = await chromium.launch({ channel: process.env.PORTAL_CHAT_BROWSER_CHANNEL || undefined, headless: true });
  const results = [];
  try {
    for (const mobile of [false, true]) for (const theme of ['light', 'dark']) for (const viewer of ['alpha', 'beta']) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, serviceWorkers: 'block', colorScheme: theme, timezoneId: 'America/Campo_Grande' });
      const page = await context.newPage(); const other = viewer === 'alpha' ? 'beta' : 'alpha';
      const own = `avatar.${viewer}`, peer = `avatar.${other}`;
      const messages = [
        { id: 3, sentAt: '2026-10-05 16:00:00' },
        { id: 4, sentAt: '2026-10-06 16:00:00' },
        { id: 5, sentAt: '2026-10-07 03:59:59' },
        { id: 6, sentAt: '2026-10-07 04:00:00' },
        { id: 7, sentAt: '2026-10-07T15:59:00Z' }
      ].map((m, i) => ({ ...m, fromUser: peer, toUser: own, body: ['Exemplo de conversa de um dia anterior.', 'Mensagem de ontem para conferir a separação.', 'Enviada ontem às 23:59, no horário local.', 'Primeira mensagem de hoje, à meia-noite.', 'Mensagem fictícia mais recente.'][i] }));
      let apiCount = 0;
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname === 'portal-avatar.test') {
          if (url.pathname.startsWith('/css/')) return route.fulfill({ contentType: 'text/css', body: read(url.pathname.slice(1)) });
          return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html data-portal-theme="${theme}"><head><meta charset="utf-8">${csp}<style>${styles}</style></head><body class="${mobile ? 'mobile-home-mode' : ''}"><main><h1>Conferência local — dados fictícios</h1></main></body></html>` });
        }
        if (url.origin === endpoint) {
          apiCount++;
          let body = { ok: true };
          if (url.pathname === '/api/chat/users') body = { users: [
            { username: peer, socialHandle: `social-${other}`, name: `Perfil ${other} Exemplo`, role: 'recepcao', avatarDataUrl: await page.evaluate(() => window.__fixtureAvatar), online: true, unread: 2, firstUnreadId: 6 },
            { username: 'avatar.empty', name: 'Sem Foto', role: 'recepcao', avatarDataUrl: '', online: false },
            { username: 'avatar.broken', name: 'Foto Inválida', role: 'recepcao', avatarDataUrl: 'data:image/png;base64,aGVsbG8=', online: false }
          ] };
          else if (url.pathname === '/api/chat/messages') {
            if (route.request().method() === 'POST') return route.fulfill({ status: 503, json: { error: 'Falha sintética para manter envio pendente' } });
            body = { messages: url.searchParams.get('with') === peer && url.searchParams.get('after') === '0' ? messages : [], pageSize: 120 };
          } else if (url.pathname === '/api/chat/realtime/ticket') return route.fulfill({ status: 503, json: { error: 'Sem realtime neste teste isolado' } });
          return route.fulfill({ json: body });
        }
        return route.abort();
      });
      await page.goto('https://portal-avatar.test/');
      await page.clock.install({ time: new Date('2026-10-07T16:00:00Z') });
      await page.clock.pauseAt(new Date('2026-10-07T16:00:00Z'));
      await page.evaluate(({ own, endpoint }) => {
        delete Navigator.prototype.serviceWorker; delete window.Notification; delete window.WebSocket;
        const canvas = document.createElement('canvas'); canvas.width = 48; canvas.height = 48;
        const ctx = canvas.getContext('2d'); ctx.fillStyle = own.endsWith('alpha') ? '#fa633c' : '#236bc9'; ctx.fillRect(0,0,48,48); ctx.fillStyle = '#f5dc60'; ctx.fillRect(12,12,24,24);
        window.__fixtureAvatar = canvas.toDataURL('image/png');
        window.REGULATION_AUTH_CONFIG = { endpoint };
        window.RegulationAuth = { me: async () => ({ username: own, name: own, role: 'recepcao' }), authorizationHeader: () => ({}), getToken: () => '' };
      }, { own, endpoint });
      await page.addScriptTag({ content: source });
      await page.waitForSelector(`[data-chat-user="${peer}"]`, { state: 'attached' });
      await page.locator('#portalChatLauncher').click();
      const photo = page.locator(`[data-chat-user="${peer}"] .portal-chat-avatar-image`);
      assert.equal(await photo.evaluate(el => el.complete && el.naturalWidth > 0), true);
      await page.locator(`[data-chat-user="${peer}"]`).click();
      await page.waitForSelector('[data-chat-date-divider="2026-10-07"]');
      const dates = () => page.locator('[data-chat-date-divider] > span').allTextContents();
      assert.deepEqual(await dates(), ['05/10/2026', 'Ontem', 'Hoje']);
      assert.equal(await page.locator('#portalChatHeaderAvatar .portal-chat-avatar-image').evaluate(el => el.complete && el.naturalWidth > 0), true);
      assert.equal(await page.locator('[data-message-id="5"] .portal-chat-message-time').textContent(), '23:59');
      assert.equal(await page.locator('[data-message-id="6"] .portal-chat-message-time').textContent(), '00:00');
      assert.equal(await page.locator('[data-chat-unread-divider]').count(), 1);
      assert.equal(await page.locator('[data-chat-unread-divider]').evaluate(el => el.previousElementSibling.dataset.chatDateDivider === '2026-10-07' && el.nextElementSibling.dataset.messageId === '6'), true);
      await page.screenshot({ path: path.join(output, `${theme}-${mobile ? 'mobile' : 'desktop'}-${viewer}.png`) });
      const checkBounds = async () => {
        const result = await page.evaluate(() => {
          const panel = document.querySelector('.portal-chat-panel').getBoundingClientRect();
          return ['portalChatClose', 'portalChatBack', 'portalChatSend', 'portalChatHeaderAvatar'].every(id => {
            const b = document.getElementById(id).getBoundingClientRect();
            return b.width > 0 && b.left >= panel.left && b.right <= panel.right;
          });
        });
        assert.equal(result, true, 'Controls must fit inside the chat panel');
      };
      await checkBounds();
      if (mobile) {
        await page.setViewportSize({ width: 320, height: 740 }); await checkBounds();
        await page.screenshot({ path: path.join(output, `${theme}-narrow-${viewer}.png`) });
        await page.setViewportSize({ width: 390, height: 844 });
      }
      // A theme switch cannot replace or conceal the actual img content.
      await page.evaluate(() => { document.documentElement.dataset.portalTheme = document.documentElement.dataset.portalTheme === 'dark' ? 'light' : 'dark'; });
      assert.equal(await page.locator('#portalChatHeaderAvatar .portal-chat-avatar-image').isVisible(), true);
      await page.evaluate(theme => { document.documentElement.dataset.portalTheme = theme; }, theme);
      // Load an older page of the SAME day; keep the old message anchored in the viewport.
      const anchored = await page.evaluate(({ peer, own }) => {
        const box = document.getElementById('portalChatMessages'); box.scrollTop = 25;
        const first = box.querySelector('[data-message-id="3"]'), before = first.getBoundingClientRect().top;
        window.__sameMessageNode = first;
        window.presentationFixture.prependMessages([1,2].map(id => ({ id, sentAt: '2026-10-05 15:00:00', fromUser: peer, toUser: own, body: `Mensagem antiga fictícia ${id}.` })));
        return { delta: first.getBoundingClientRect().top - before, same: first === box.querySelector('[data-message-id="3"]') };
      }, { peer, own });
      assert.ok(Math.abs(anchored.delta) < 2, 'Position preserved when prepending: ' + anchored.delta); assert.equal(anchored.same, true);
      assert.deepEqual(await dates(), ['05/10/2026', 'Ontem', 'Hoje']);
      await page.evaluate(({ peer, own }) => window.presentationFixture.appendMessages([{ id: 8, sentAt: '2026-10-07 16:05:00', fromUser: peer, toUser: own, body: 'Nova mensagem fictícia de hoje.' }]), { peer, own });
      assert.deepEqual(await dates(), ['05/10/2026', 'Ontem', 'Hoje']);
      assert.equal(await page.evaluate(() => window.__sameMessageNode === document.querySelector('[data-message-id="3"]')), true);
      // Actual send path: optimistic timestamp then server confirmation across midnight.
      await page.clock.setSystemTime(new Date('2026-10-08T03:59:59Z'));
      await page.evaluate(() => window.presentationFixture.scheduleMessageDayRefresh());
      await page.locator('#portalChatInput').fill('Envio sintético perto da meia-noite');
      await page.locator('#portalChatSend').click();
      const sent = await page.evaluate(() => window.presentationFixture.pending().at(-1)); assert.ok(sent.clientId);
      await page.clock.runFor(2100);
      assert.deepEqual(await dates(), ['05/10/2026', '06/10/2026', 'Ontem']);
      await page.evaluate(({ sent, own, peer }) => window.presentationFixture.acknowledge({ ...sent, id: 9, fromUser: own, toUser: peer, pending: false, failed: false, sentAt: '2026-10-08 04:00:01' }), { sent, own, peer });
      assert.deepEqual(await dates(), ['05/10/2026', '06/10/2026', 'Ontem', 'Hoje']);
      assert.equal(await page.locator('[data-message-id="9"]').count(), 1);
      await page.locator('#portalChatBack').click();
      assert.equal(await page.locator('#portalChatHeaderAvatar').isHidden(), true);
      await page.locator('[data-chat-user="avatar.empty"]').click();
      assert.equal(await page.locator('#portalChatHeaderAvatar').textContent(), 'SF');
      assert.equal(await page.locator('#portalChatHeaderAvatar img').count(), 0);
      await page.locator('#portalChatBack').click();
      await page.locator('[data-chat-user="avatar.broken"]').click();
      await page.waitForFunction(() => !document.querySelector('#portalChatHeaderAvatar img'));
      assert.equal(await page.locator('#portalChatHeaderAvatar').textContent(), 'FI');
      await page.evaluate(() => window.dispatchEvent(new Event('portal:session-cleared')));
      assert.equal(await page.locator('#portalChatHeaderAvatar').isHidden(), true);
      results.push({ theme, mobile, viewer, photo: true, header: true, timeline: true, unread: true, paginationAnchorDelta: anchored.delta, midnight: true, sendAck: true, missingAndBrokenPhotoFallback: true, apiCount });
      await context.close();
    }
    const result = { browser: browser.version(), scenarios: results.length, results };
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
