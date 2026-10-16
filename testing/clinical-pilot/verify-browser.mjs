// Local, deterministic browser verification. No production login or AI calls.
// CLINICAL_PILOT_PLAYWRIGHT may name an already-installed Playwright package.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.CLINICAL_PILOT_PLAYWRIGHT || 'playwright');
const output = path.resolve(process.argv[2] || path.join(root, '.local/clinical-pilot'));
fs.mkdirSync(output, { recursive: true });
const base = '380a40b1a5e58c309151b066fef0b79ec9313489';
const record = JSON.parse(fs.readFileSync(path.join(root, 'data/clinical-conditions/convulsao-epilepsia-20261016.json')));
const source = fs.readFileSync(path.join(root, 'data/protocol-source.html'));
const baselineFiles = new Map();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
function baseline(file) {
  if (!baselineFiles.has(file)) baselineFiles.set(file, execFileSync('git', ['--no-optional-locks', '-c', 'safe.directory=' + root.replace(/\\/g, '/').replace(/\/$/, ''), 'show', base + ':' + file], { cwd: root, maxBuffer: 20 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }));
  return baselineFiles.get(file);
}
function server(before = false) {
  return http.createServer((req, res) => {
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    let file = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '');
    if (!file || file.endsWith('/')) file += 'index.html';
    const resolved = path.resolve(root, file);
    if (!resolved.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
    try {
      const body = before ? baseline(file) : fs.readFileSync(resolved);
      res.writeHead(200, { 'Content-Type': (mime[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(body);
    } catch { res.writeHead(404); res.end('Local fixture: absent'); }
  });
}
const servers = [server(), server(true)];
await Promise.all(servers.map(s => new Promise(resolve => s.listen(0, '127.0.0.1', resolve))));
const origins = servers.map(s => 'http://127.0.0.1:' + s.address().port);
const report = { base, recordRevision: record.revision, externalRequestsSent: 0, serviceWorkers: 'blocked; separate VM cache tests', scenarios: [], legacyComparisons: [], interceptedAiPayloads: [], errors: [], blockedExternalRequests: [] };
const browser = await chromium.launch({ headless: true });
async function pageFor(route, { before = false, width = 1365, theme = 'light', failedRecord = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push({ route, before, message: error.message }));
  await page.addInitScript(theme => {
    localStorage.setItem('regulacao.portal.theme.active.v1', theme);
    const user = { name: 'Verificação sintética', username: 'piloto-local', role: location.pathname.startsWith('/recepcao/') ? 'recepcao' : 'medico', interfaceTheme: theme };
    window.RegulationAuth = { enforcementEnabled: false, requireRole: async () => user, getCachedUser: () => user, getToken: () => null, logout: async () => {} };
  }, theme);
  await page.route('**/*', async requestRoute => {
    const request = requestRoute.request(), url = new URL(request.url());
    if (['/js/auth-config.js', '/js/auth-client.js', '/js/auth-fetch-bridge.js', '/js/portal-global-chat.js', '/js/pets-bootstrap.js', '/js/portal-performance.js', '/js/portal-observability.js', '/js/portal-pwa.js'].includes(url.pathname)) return requestRoute.fulfill({ contentType: 'text/javascript', body: '' });
    if (url.pathname === '/js/ai-config.js') return requestRoute.fulfill({ contentType: 'text/javascript', body: 'window.REGULATION_AI_CONFIG={endpoint:location.origin+"/__mock-ai",maxQuestionLength:3000};' });
    if (url.pathname === '/__mock-ai' && request.postDataJSON()?.clinicalConditionProbe) {
      const ids=request.postDataJSON().clinicalConditionProbe,registry=fs.readdirSync(path.join(root,'data/clinical-conditions')).filter(name=>name.endsWith('.json')).map(name=>JSON.parse(fs.readFileSync(path.join(root,'data/clinical-conditions',name),'utf8')));
      (report.compatibilityProbes ||= []).push(ids);return requestRoute.fulfill({contentType:'application/json',body:JSON.stringify({clinicalConditionProbe:true,records:ids.map(id=>registry.find(record=>record.id===id))})});
    }
    if (url.pathname === '/__mock-ai') {
      const payload = request.postDataJSON(); report.interceptedAiPayloads.push(payload);
      return requestRoute.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Indisponibilidade simulada localmente' }) });
    }
    if (url.pathname.startsWith('/data/clinical-conditions/') && failedRecord) return requestRoute.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
    if (url.hostname === 'raw.githubusercontent.com') return requestRoute.fulfill({ contentType: 'text/html', body: source });
    if (!origins.includes(url.origin)) { report.blockedExternalRequests.push(url.origin + url.pathname); return requestRoute.abort('blockedbyclient'); }
    return requestRoute.continue();
  });
  await page.goto(origins[before ? 1 : 0] + route, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#protocolList .protocol-card, #receptionProtocolList button[data-id]'));
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}
async function choose(page, route, query) {
  await page.locator(route === '/recepcao/' ? '#receptionSearch' : '#sideSearchInput').fill(query);
  await page.locator('[data-pilot-system]').click();
  await page.locator('[data-clinical-condition-id]').waitFor();
}
async function capture(page, name) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true, animations: 'disabled' });
  await page.evaluate(() => {
    const root = document.querySelector('[data-clinical-condition-id]');
    const header = document.querySelector('header');
    window.scrollTo({ top: scrollY + root.getBoundingClientRect().top - (header?.getBoundingClientRect().height || 0) - 20, behavior: 'instant' });
  });
  await page.screenshot({ path: path.join(output, name + '-viewport.png'), animations: 'disabled' });
}
async function stableDetail(page, reception) {
  await page.waitForFunction(reception => {
    const html = document.querySelector(reception ? '#receptionDetail' : '#detailPanel').innerHTML;
    const state = window.__clinicalPilotStableDetail || { html: '', frames: 0 };
    state.frames = state.html === html ? state.frames + 1 : 0;
    state.html = html; window.__clinicalPilotStableDetail = state;
    return state.frames >= 6;
  }, reception, { polling: 'raf' });
}
try {
  for (const route of ['/medico/', '/protocolo/', '/recepcao/']) {
    for (const settings of [{ width: 1365, theme: 'light' }, { width: 390, theme: 'dark' }]) {
      const { page, context } = await pageFor(route, settings);
      await choose(page, route, 'convulsão infantil 17 anos');
      const rootLocator = page.locator('[data-clinical-condition-id]');
      const ids = await rootLocator.locator('[data-clinical-rule]').evaluateAll(nodes => nodes.map(n => n.dataset.clinicalRule));
      assert.deepEqual(ids.sort(), record.rules.map(r => r.id).sort());
      await page.locator('[data-pilot-age-notice]').getByText(record.contextualAlerts[0].title, { exact: true }).waitFor();
      const text = await rootLocator.innerText();
      assert.match(text, /anexados ou descritos/); assert.match(text, /exame neurológico/i); assert.match(text, /Familiar ou responsável/);
      assert.doesNotMatch(text, /BERA|M-CHAT|SNAP-IV|Relatório Escolar/);
      assert.equal(await page.locator('.clinical-pilot .official-protocol-summary, .clinical-pilot .reception-group').count(), 0);
      const fullContext = await page.evaluate(() => window.ClinicalConditionPilot.protocolContext());
      assert.deepEqual(fullContext.clinicalConditionRecord, record);
      const printBefore = await page.evaluate(() => window.ClinicalConditionPilot.printDocument());
      assert.equal([...printBefore.matchAll(/data-clinical-rule=/g)].length, 15);
      if (route === '/recepcao/') {
        assert.equal(await rootLocator.locator('input[type=checkbox]').count(), 3);
        await rootLocator.locator('input[type=checkbox]').first().check();
        assert.equal(await page.evaluate(() => window.ClinicalConditionPilot.printDocument()), printBefore);
      }
      await rootLocator.locator('[data-pilot-age]').fill('16 anos 11 meses 29 dias');
      assert.equal((await page.locator('[data-pilot-age-notice]').innerText()).trim(), '');
      await rootLocator.locator('[data-pilot-age]').fill('17 anos');
      const metrics = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, pilot: document.querySelector('.clinical-pilot').getBoundingClientRect().width, font: getComputedStyle(document.querySelector('.clinical-pilot')).fontSize }));
      assert.equal(metrics.document <= metrics.viewport + 1, true, JSON.stringify({ route, settings, metrics }));
      const name = route.replaceAll('/', '') + '-' + settings.width + '-' + settings.theme;
      await capture(page, name);
      report.scenarios.push({ route, ...settings, ruleIds: ids, metrics, printComplete: true, alternativePreserved: true, seventeenVisible: true });
      if (route !== '/recepcao/') {
        await page.locator('#sideSearchInput').fill('autismo');
        assert.equal(await page.locator('[data-clinical-condition-id]').count(), 0);
        assert.equal(new URL(page.url()).searchParams.has('condicao'), false);
        await page.locator('#sideSearchInput').fill('convulsão no SISREG');
        assert.equal(await page.locator('[data-pilot-system]').count(), 0);
      }
      console.log('OK ' + name);
      await context.close();
    }
  }
  {
    const { page, context } = await pageFor('/medico/', { width: 320 });
    await choose(page, '/medico/', 'convulsão febril simples');
    assert.match(await page.locator('.clinical-pilot').innerText(), /excluída do critério de episódios/);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('.clinical-pilot')).fontSize) >= 36);
    const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, font: getComputedStyle(document.querySelector('.clinical-pilot')).fontSize }));
    assert.equal(metrics.scrollWidth <= metrics.width + 1, true, JSON.stringify(metrics));
    assert.equal(parseFloat(metrics.font) >= 36, true, JSON.stringify(metrics));
    await capture(page, 'medico-320-texto200');
    report.scenarios.push({ route: '/medico/', width: 320, textZoom: '200%', febrileExclusion: true, metrics });
    await context.close();
  }
  {
    const { page, context } = await pageFor('/medico/');
    await choose(page, '/medico/', 'convulsão infantil 17 anos');
    await page.locator('#aiLauncher').click();
    await page.locator('#aiInput').fill('Quais exames são obrigatórios para esta condição?');
    await page.locator('#aiSend').click();
    await page.waitForFunction(() => document.querySelector('.ai-message.contingency'));
    const reply = await page.locator('.ai-message.contingency').last().innerText();
    assert.match(reply, /não são pré-requisitos documentais obrigatórios/);
    assert.match(reply, /17 anos: faixa não explicitada/);
    assert.match(reply, /anexados ou descritos/);
    assert.doesNotMatch(reply, /BERA|M-CHAT|SNAP-IV/);
    const sent = report.interceptedAiPayloads.at(-1);
    assert.equal(sent.contextCompression, 'clinical_condition_integral_v1');
    assert.deepEqual(sent.protocols[0].clinicalConditionRecord, record);
    await page.screenshot({ path: path.join(output, 'medico-ia-contingencia.png'), fullPage: true });
    await page.locator('#aiClose').click();
    // Actual popup path; print itself is stubbed to avoid a system dialog.
    await context.addInitScript(() => { window.print = () => { window.__printCalled = true; }; });
    const popupPromise = page.waitForEvent('popup');
    await page.locator('[data-pilot-print]').click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    assert.equal(await popup.locator('[data-clinical-rule]').count(), 15);
    assert.match(await popup.locator('body').innerText(), /Pendências de confirmação/);
    await popup.pdf({ path: path.join(output, 'impressao-piloto-local.pdf'), format: 'A4' });
    report.scenarios.push({ route: '/medico/', simulatedAi503: true, completePayload: true, localContingency: true, printPopupRules: 15 });
    await context.close();
  }
  {
    const { page, context } = await pageFor('/medico/', { failedRecord: true });
    await page.locator('#sideSearchInput').fill('convulsão infantil');
    await page.locator('[data-pilot-system]').click();
    await page.getByText(/Nenhuma lista geral foi usada como substituta/).waitFor();
    const requestsBefore = report.interceptedAiPayloads.length;
    await page.locator('#aiLauncher').click();
    await page.locator('#aiInput').fill('Quais exames são obrigatórios?');
    await page.locator('#aiSend').click();
    await page.locator('.ai-message.assistant').filter({ hasText: /registro integral desta condição-piloto está indisponível/ }).waitFor();
    assert.equal(report.interceptedAiPayloads.length, requestsBefore);
    await page.locator('#aiClose').click();
    await page.locator('#sideSearchInput').fill('cardiologia');
    await page.locator('.protocol-card[data-id=cardiologia]').click();
    assert.match(await page.locator('#detailPanel').innerText(), /Cardiologia/);
    report.scenarios.push({ route: '/medico/', failedRecord: true, explicitError: true, noAiRequestWithMissingRecord: true, unrelatedProtocolStillWorks: true });
    await context.close();
  }
  for (const route of ['/medico/', '/protocolo/', '/recepcao/']) {
    const old = await pageFor(route, { before: true }), next = await pageFor(route);
    for (const id of ['cardiologia', 'endocrinologia']) {
      const snapshots = [];
      for (const { page } of [old, next]) {
        const reception = route === '/recepcao/';
        const card = page.locator((reception ? '#receptionProtocolList button' : '#protocolList .protocol-card') + '[data-id="' + id + '"]');
        await card.click();
        await stableDetail(page, reception);
        const panel = page.locator(reception ? '#receptionDetail' : '#detailPanel');
        snapshots.push({ html: await panel.innerHTML(), png: await panel.screenshot({ animations: 'disabled' }) });
      }
      if (snapshots[1].html !== snapshots[0].html) {
        fs.writeFileSync(path.join(output, 'legacy-before.html'), snapshots[0].html);
        fs.writeFileSync(path.join(output, 'legacy-after.html'), snapshots[1].html);
        assert.fail(route + id + ' DOM changed; inspect legacy-before.html and legacy-after.html');
      }
      assert.equal(snapshots[1].png.equals(snapshots[0].png), true, route + id + ' pixels changed');
      report.legacyComparisons.push({ route, id, identicalDom: true, identicalPixels: true });
    }
    await old.context.close(); await next.context.close();
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.failure = { message: error.message, stack: error.stack };
  const lastPage = browser.contexts().at(-1)?.pages().at(-1);
  if (lastPage) {
    report.failure.metrics = await lastPage.evaluate(() => {
      const pilot = document.querySelector('.clinical-pilot'), rules = [];
      const visit = list => { for (const rule of list) { if (rule.cssRules) visit(rule.cssRules); else if (pilot && rule.selectorText && rule.style && (rule.style.font || rule.style.fontSize) && pilot.matches(rule.selectorText)) rules.push(rule.cssText); } };
      for (const sheet of document.styleSheets) { try { visit(sheet.cssRules); } catch {} }
      return { rootFont: getComputedStyle(document.documentElement).fontSize, inlineRoot: document.documentElement.style.fontSize, pilotFont: pilot ? getComputedStyle(pilot).font : null, inlinePilot: pilot?.getAttribute('style'), rules, overflow: [...document.querySelectorAll('body *')].map(el => ({ tag: el.tagName, id: el.id, class: el.className, right: el.getBoundingClientRect().right, width: el.getBoundingClientRect().width })).filter(el => el.width && el.right > innerWidth + 1).slice(0, 25) };
    }).catch(() => null);
    await lastPage.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  report.interceptedAiPayloads = report.interceptedAiPayloads.map(payload => ({ protocolCount: payload.protocols.length, recordRevision: payload.protocols[0]?.clinicalConditionRecord?.revision, ruleIds: payload.protocols[0]?.clinicalConditionRecord?.rules.map(rule => rule.id), contextCompression: payload.contextCompression }));
  fs.writeFileSync(path.join(output, 'browser-verification.json'), JSON.stringify(report, null, 2));
  await browser.close();
  await Promise.all(servers.map(s => new Promise(resolve => s.close(resolve))));
  console.log(JSON.stringify({ passed: report.passed, scenarios: report.scenarios.length, legacyComparisons: report.legacyComparisons.length, errors: report.errors, output }));
}
