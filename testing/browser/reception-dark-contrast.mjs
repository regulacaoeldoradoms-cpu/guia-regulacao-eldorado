import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = await import(process.env.RECEPTION_PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../..', import.meta.url));
const output = path.resolve(root, 'testing/browser/test-results-reception-contrast');
await mkdir(output, { recursive: true });
const read = file => readFile(path.join(root, file), 'utf8');
const cssFiles = ['css/portal.css', 'css/profile-account-link.css', 'css/reception.css', 'css/reception-fast-checklist.css', 'css/portal-interactions.css'];
const styles = await Promise.all(cssFiles.map(read));
const baseCss = process.env.RECEPTION_BASE_CSS_FILE
  ? await readFile(process.env.RECEPTION_BASE_CSS_FILE, 'utf8')
  : execFileSync('git', ['show', `${process.env.RECEPTION_BASE || 'HEAD^'}:css/reception.css`], { cwd: root, encoding: 'utf8' });
const html = (await read('recepcao/index.html')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<link\b[^>]*>/gi, '');
const scripts = await Promise.all(['js/reception-app.js', 'js/reception-ux.js', 'js/reception-clinical-checklist.js', 'js/reception-print-v6.js', 'js/reception-substance-guidance.js'].map(read));
const protocol = { id:'reception-contrast-synthetic', nome:'PROTOCOLO FICTÍCIO DE CONTRASTE', categoria:'Teste sintético', faixaEtaria:'Faixa fictícia', sistemas:{sisreg:true,digsus:false}, prioridade:1,
  informacoesObrigatorias:['Identificação fictícia para conferência de presença.'], examesObrigatorios:['Exame obrigatório fictício.'], examesCondicionais:['Laudo condicional fictício.'], complementares:['Documento complementar fictício.'],
  subprotocolos:[{titulo:'Condição fictícia',obrigatorias:['Informação fictícia da condição.'],examesObrigatorios:['Exame fictício da condição.'],condicionais:[],complementares:[]}] };
const source = '<script>const PROTOCOLOS = ' + JSON.stringify([protocol]) + ';\nconst FOOTER_IMG = "";</script>';
const browser = await chromium.launch({headless:true,channel:'chromium', ...(process.env.RECEPTION_CHROMIUM ? {executablePath:process.env.RECEPTION_CHROMIUM} : {}), args:['--disable-background-networking','--disable-component-update','--disable-sync','--no-pings']});
const results = [];
async function render(theme, width, baseline = false) {
  const context = await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
  // In-memory UI: no remote navigation, authentication, patients or backend.
  await context.route('**/*', route => route.abort('blockedbyclient'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const css = styles.map((text,i) => baseline && cssFiles[i] === 'css/reception.css' ? baseCss : text).join('\n');
  await page.setContent(html.replace('<html lang="pt-BR">', `<html lang="pt-BR" data-portal-theme="${theme}">`).replace('</head>', `<style>${css}</style></head>`));
  await page.evaluate(({source,theme}) => {
    window.RegulationAuth = {requireRole:async()=>({id:'synthetic',name:'PESSOA FICTÍCIA',role:'admin',interfaceTheme:theme}),logout:async()=>{}};
    window.fetch = async input => {
      const url = String(input?.url || input);
      if (!url.startsWith('https://raw.githubusercontent.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html')) throw new Error('Unmodeled synthetic request');
      return new Response(source,{status:200,headers:{'Content-Type':'text/html'}});
    };
    window.print = () => {};
    window.open = () => ({
      document: { open() {}, write(html) { window.syntheticPrintHtml = html; }, close() {}, querySelectorAll() { return []; } },
      focus() {}, print() {}, closed: false
    });
  }, {source,theme});
  for (const script of scripts) await page.addScriptTag({content:script});
  await page.locator('#receptionProtocolList button').first().click();
  await page.locator('.reception-group[data-group="clinical"] .fast-check').waitFor();
  await page.waitForFunction(() => document.querySelectorAll('#receptionDetail .reception-group').length === 4);
  return {context,page,errors};
}
async function printDocument(page) {
  await page.locator('#receptionSubprotocol').selectOption('0');
  await page.locator('#printCompleteOrientation').click();
  await page.waitForFunction(() => Boolean(window.syntheticPrintHtml));
  return page.evaluate(() => window.syntheticPrintHtml);
}
async function snapshot(page) {
  // A click leaves hover/focus and a finite button transition in flight.
  // Let the real animation finish; retain exact geometry/style comparison.
  await page.mouse.move(0, 0);
  await page.evaluate(async () => {
    document.activeElement?.blur();
    await new Promise(requestAnimationFrame);
    const panel = document.getElementById('receptionDetail');
    await Promise.all(panel.getAnimations({subtree:true})
      .filter(animation => Number.isFinite(animation.effect.getComputedTiming().endTime))
      .map(animation => animation.finished.catch(() => {})));
    await new Promise(requestAnimationFrame);
  });
  return page.locator('#receptionDetail').evaluate(el => [...el.querySelectorAll('*')].map(node => {
    const style = getComputedStyle(node), rect = node.getBoundingClientRect();
    return [node.tagName,node.className,style.color,style.backgroundColor,style.borderColor,style.display,rect.width,rect.height];
  }));
}
function luminance(rgb) {
  const c = rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(x => x/255).map(x => x<=0.04045 ? x/12.92 : ((x+0.055)/1.055)**2.4);
  return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722;
}
try {
  for (const width of [1440,412]) {
    const current = await render('dark',width);
    const {page} = current;
    const details = await page.locator('#receptionDetail').evaluate(el => ({
      headers:[...el.querySelectorAll('.reception-group > header')].map(n=>getComputedStyle(n).backgroundColor),
      text:[...el.querySelectorAll('.reception-group > header h3,.reception-group > header p,.reception-item-text,#receptionSummaryTitle,#receptionSummaryText')].map(n=>getComputedStyle(n).color),
      legend:[...el.querySelectorAll('.reception-checklist-legend span')].map(n=>[getComputedStyle(n).backgroundColor,getComputedStyle(n).color]),
      marks:[...el.querySelectorAll('.fast-check-mark')].map(n=>getComputedStyle(n).backgroundColor)
    }));
    assert.equal(details.headers.length,4);
    assert.ok(details.headers.every(color=>luminance(color)<0.1));
    assert.ok(details.text.length>=14 && details.text.every(color=>color==='rgb(255, 255, 255)'));
    assert.equal(new Set(details.legend.map(pair=>pair[0])).size,3);
    for (const [bg,fg] of details.legend) assert.ok((luminance(fg)+0.05)/(luminance(bg)+0.05)>=4.5);
    assert.ok(details.marks.every(color=>luminance(color)<0.1));
    await page.locator('#receptionDetail').screenshot({path:path.join(output,`dark-${width}.png`)});
    const control=page.locator('.reception-item[data-type="mandatory"] .fast-check').first();
    await control.click();
    assert.equal(await control.locator('input').isChecked(),true);
    await page.waitForFunction(() => { const mark = document.querySelector('.reception-item[data-type="mandatory"] input:checked + .fast-check-mark'); return mark && getComputedStyle(mark).backgroundColor === 'rgb(7, 134, 111)'; });
    await page.locator('#clearReceptionChecklistBottom').click();
    assert.equal(await page.locator('.fast-check input:checked').count(),0);
    await page.locator('#receptionSubprotocol').selectOption('0');
    await page.waitForFunction(()=>document.querySelectorAll('.reception-item-text').length>=6);
    assert.ok((await page.locator('.reception-item-text').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).color))).every(c=>c==='rgb(255, 255, 255)'));
    assert.deepEqual(current.errors,[]);
    results.push({width,check:'dark headers, text, legends, check/uncheck and subprotocol',passed:true});
    await current.context.close();
    for (const [theme,media] of [['light','screen'],['dark','print']]) {
      const after=await render(theme,width), before=await render(theme,width,true);
      // Compare the actual generated orientation, not only the hidden screen UI.
      assert.equal(await printDocument(after.page), await printDocument(before.page));
      await after.page.emulateMedia({media});await before.page.emulateMedia({media});
      assert.deepEqual(await snapshot(after.page),await snapshot(before.page));
      assert.deepEqual(after.errors,[]);assert.deepEqual(before.errors,[]);
      results.push({width,check:`unchanged ${theme}/${media} styles, layout and generated print document`,passed:true});
      await after.context.close();await before.context.close();
    }
  }
  await writeFile(path.join(output,'results.json'),JSON.stringify({syntheticOnly:true,authenticationMocked:true,networkForwarding:false,results},null,2));
  console.log(JSON.stringify({passed:results.length,failed:0,results},null,2));
} catch (error) {
  await writeFile(path.join(output,'failure.json'), JSON.stringify({message:error.message,completed:results},null,2));
  throw error;
} finally {await browser.close();}
