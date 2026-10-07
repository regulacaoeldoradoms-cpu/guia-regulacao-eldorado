'use strict';
// Isolated browser regression: real client + native WebSocket, synthetic HTTP/WS server.
// All outgoing requests are intercepted. No credentials, real accounts or conversations.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = process.env.CHAT_SOURCE_ROOT || path.resolve(__dirname, '../../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const endpoint = 'https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const csp = read('index.html').match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*>/i)?.[0] || '';
const evidence=process.env.PORTAL_CHAT_EVIDENCE_DIR||path.resolve('chat-live-evidence');
fs.mkdirSync(evidence,{recursive:true});
const results = [], delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser;
async function pair({theme='light', mobile=false, holdInitial=false, realtime=true}={}) {
  let sequence=10, drop=false, silent=false, release=null;
  const stored=[], clients=new Map(), contexts=[], reads=[], errors=[], requests=[];
  async function make(username, peer) {
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},serviceWorkers:'block',colorScheme:theme,timezoneId:'America/Campo_Grande'});
    contexts.push(context); const page=await context.newPage(); page.setDefaultTimeout(3500);
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*', async route=>{
      const url=new URL(route.request().url()), method=route.request().method();
      if(url.hostname==='portal-chat.test') return route.fulfill({contentType:'text/html',body:`<!doctype html><html data-portal-theme="${theme}"><head><meta charset="utf-8">${csp}<style>${read('css/portal-chat.css')}</style></head><body></body></html>`});
      if(url.origin!==endpoint) return route.abort();
      requests.push({username,path:url.pathname,query:url.search,method});
      let body={ok:true};
      if(url.pathname.endsWith('/users')) body={users:[{username:peer,name:'Perfil Fictício '+peer,role:'recepcao',online:true,unread:0,avatarDataUrl:'',lastMessageAt:''}]};
      else if(url.pathname.endsWith('/ticket')) {if(!realtime)return route.fulfill({status:503,json:{error:'No realtime in fixture'}}); body={ticket:'fixture',protocol:'portal-chat-v1'};}
      else if(url.pathname.endsWith('/messages')&&method==='GET') {
        const after=Number(url.searchParams.get('after')||0);
        const messages=stored.filter(m=>(m.toUser===username&&m.fromUser===peer)||(m.toUser===peer&&m.fromUser===username)).filter(m=>m.id>after).map(m=>({...m}));
        body={messages:after?messages.slice(0,120):messages.slice(-120),pageSize:120,receipt:{}};
        if(holdInitial&&username==='beta'&&after===0&&!release) await new Promise(resolve=>{release=resolve;});
      } else if(url.pathname.endsWith('/read')) {reads.push({username,...JSON.parse(route.request().postData()||'{}')});}
      else if(url.pathname.endsWith('/messages')&&method==='POST') {
        const p=JSON.parse(route.request().postData()); body={message:save(username,p.to||peer,p.body,p.clientId)};
      }
      return route.fulfill({json:body});
    });
    await page.routeWebSocket(endpoint.replace('https:','wss:')+'/api/chat/realtime', ws=>{
      clients.set(username,ws);
      ws.onMessage(raw=>{
        if(raw==='ping'){if(!silent) ws.send('pong'); return;}
        const p=JSON.parse(raw);
        if(p.type==='send') {const message=save(username,p.to,p.body,p.clientId);ws.send(JSON.stringify({type:'send-ack',clientId:p.clientId,message}));if(!drop)clients.get(p.to)?.send(JSON.stringify({type:'message',message}));}
      });
    });
    await page.goto('https://portal-chat.test/');
    await page.clock.install({time:new Date('2026-10-07T22:30:00Z')});
    await page.clock.pauseAt(new Date('2026-10-07T22:30:00Z'));
    await page.evaluate(({username,endpoint})=>{
      delete Navigator.prototype.serviceWorker; delete window.Notification;
      let hidden=false;
      Object.defineProperty(document,'hidden',{get:()=>hidden,configurable:true});
      window.fixtureVisibility=value=>{hidden=!value;document.dispatchEvent(new Event('visibilitychange'));};
      window.REGULATION_AUTH_CONFIG={endpoint};
      window.RegulationAuth={me:async()=>({username,name:username,role:'recepcao'}),authorizationHeader:()=>({}),getToken:()=>''};
    },{username,endpoint});
    await page.addScriptTag({content:read('js/portal-chat.js')});
    await page.addScriptTag({content:read('js/portal-chat-switch-optimizer.js')});
    await page.waitForSelector('[data-chat-user]',{state:'attached'});
    await page.locator('#portalChatLauncher').click();
    await page.locator(`[data-chat-user="${peer}"]`).click();
    if(realtime)await page.waitForFunction(()=>!document.getElementById('portalChatAttention').disabled);
    return page;
  }
  function save(fromUser,toUser,body,clientId='') {const message={id:++sequence,fromUser,toUser,body,clientId,sentAt:'2026-10-07 22:30:00'};stored.push(message);return message;}
  const alpha=await make('alpha','beta'), beta=await make('beta','alpha');
  await delay(80);
  return {alpha,beta,stored,reads,errors,requests,clients,
    drop:value=>{drop=value;}, silent:value=>{silent=value;},
    release:()=>{holdInitial=false;release?.();},
    send:async body=>{await alpha.locator('#portalChatInput').fill(body);await alpha.locator('#portalChatSend').click();await delay(80);return stored.at(-1);},
    inject:message=>clients.get('beta').send(JSON.stringify({type:'message',message})),
    save,
    close:async()=>{holdInitial=false;release?.();for(const c of contexts)await c.close();}
  };
}
async function check(name,run,options={}) {let p;try{p=await pair(options);await run(p);assert.deepEqual(p.errors,[]);results.push({name,ok:true});}catch(error){results.push({name,ok:false,error:error.message});}finally{await p?.close();}}
(async()=>{
  browser=await chromium.launch({headless:true,...(process.env.CHAT_BROWSER_CHANNEL?{channel:process.env.CHAT_BROWSER_CHANNEL}:{})});
  try{
    for(const theme of ['light','dark'])for(const mobile of [false,true])await check(`live-${theme}-${mobile?'mobile':'desktop'}`,async p=>{
      const m=await p.send('Mensagem sintética ao vivo');
      await p.beta.waitForSelector(`[data-message-id="${m.id}"]`);
      assert.equal(await p.beta.locator('[data-chat-date-divider] > span').textContent(),'Hoje');
    },{theme,mobile});
    await check('hidden-receipt-restored-without-reopening',async p=>{
      await p.beta.evaluate(()=>window.fixtureVisibility(false)); const before=p.reads.length;
      const m=await p.send('Chegou com a aba oculta'); assert.equal(p.reads.length,before,'Hidden messages cannot be marked read');
      await p.beta.evaluate(()=>window.fixtureVisibility(true));
      await p.beta.waitForSelector(`[data-message-id="${m.id}"]`);
    });
    await check('slow-initial-response-does-not-erase-live-message',async p=>{
      const m=await p.send('Nova durante a resposta antiga');await p.beta.waitForSelector(`[data-message-id="${m.id}"]`);
      p.release();await delay(180);assert.equal(await p.beta.locator(`[data-message-id="${m.id}"]`).count(),1);
    },{holdInitial:true});
    await check('missed-event-is-reconciled-despite-later-message',async p=>{
      p.drop(true);const first=await p.send('Evento deliberadamente perdido');p.drop(false);
      const second=await p.send('Evento seguinte recebido');await p.beta.waitForSelector(`[data-message-id="${second.id}"]`);
      await p.beta.clock.runFor(31000);await delay(250);
      assert.equal(await p.beta.locator(`[data-message-id="${first.id}"]`).count(),1);
      const ids=await p.beta.locator('.portal-chat-message').evaluateAll(nodes=>nodes.map(el=>Number(el.dataset.messageId)));
      assert.deepEqual(ids,[first.id,second.id]);
    });
    await check('duplicate-event-does-not-inflate-unread',async p=>{
      await p.beta.locator('#portalChatClose').click();const m=await p.send('Uma mensagem, duas entregas');p.inject(m);await delay(100);
      assert.equal(await p.beta.locator('#portalChatUnread').textContent(),'1');
    });
    await check('http-fallback-receives-without-reopening',async p=>{
      p.save('alpha','beta','Mensagem no canal HTTP');await p.beta.clock.runFor(4600);await delay(200);
      assert.equal(await p.beta.locator('.portal-chat-message.theirs').count(),1);
    },{realtime:false});
    await check('hidden-inflight-history-does-not-mark-read',async p=>{
      await p.beta.evaluate(()=>window.fixtureVisibility(false));const before=p.reads.length;
      const m=await p.send('Mensagem oculta durante carregamento');p.release();await delay(180);
      assert.equal(p.reads.length,before);await p.beta.evaluate(()=>window.fixtureVisibility(true));
      await p.beta.waitForSelector('[data-message-id="' + m.id + '"]');
      await delay(80);assert.ok(p.reads.some(r=>r.username==='beta'&&r.throughId===m.id));
    },{holdInitial:true});
    await check('visibility-burst-coalesces-inflight-history',async p=>{
      const count=()=>p.requests.filter(r=>r.username==='beta'&&r.path.endsWith('/messages')).length;
      const before=count();await p.beta.evaluate(()=>{for(let n=0;n<3;n++)window.fixtureVisibility(true);});
      await delay(100);assert.equal(count(),before);p.release();
    },{holdInitial:true});
    await check('reconciliation-pauses-with-chat-closed-or-hidden',async p=>{
      const count=()=>p.requests.filter(r=>r.username==='beta'&&r.path.endsWith('/messages')).length;
      await p.beta.evaluate(()=>window.fixtureVisibility(false));const hidden=count();
      await p.beta.clock.runFor(31000);await delay(80);assert.equal(count(),hidden);
      await p.beta.evaluate(()=>window.fixtureVisibility(true));await delay(100);
      await p.beta.locator('#portalChatClose').click();const closed=count();
      await p.beta.clock.runFor(31000);await delay(100);assert.equal(count(),closed);
    });
    const report={browser:browser.version(),results};
    fs.writeFileSync(path.join(evidence,(process.env.CHAT_REPORT_NAME||'live-results')+'.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));if(results.some(r=>!r.ok))process.exitCode=1;
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
