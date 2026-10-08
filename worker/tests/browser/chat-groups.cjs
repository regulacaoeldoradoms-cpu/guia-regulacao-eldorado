'use strict';
// Browser UI + production group routes + real SQLite, with an intercepted private
// network and synthetic WebSocket recipients. Never uses real accounts or traffic.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const evidence=process.env.PORTAL_CHAT_EVIDENCE_DIR||path.resolve('chat-groups-evidence');fs.mkdirSync(evidence,{recursive:true});
const endpoint='https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev';
const csp=read('index.html').match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*>/i)?.[0]||'';
const delay=ms=>new Promise(r=>setTimeout(r,ms));const results=[];
const links=[...read('index.html').matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi)].map(m=>m[1].split('?')[0].replace(/^\//,'')).filter(f=>fs.existsSync(path.join(root,f)));
const styles=[...new Set([...links,'css/portal-chat.css','css/portal-chat-profile-link.css'])].map(read).join('\n');
async function until(test){for(let n=0;n<50;n++){if(test())return;await delay(30);}throw Error('Synthetic response was not held');}
(async()=>{
 const {groupFixture}=await import(pathToFileURL(path.join(root,'worker/tests/helpers/chat-group-fixture.mjs')));
 const browser=await chromium.launch({headless:true,...(process.env.CHAT_BROWSER_CHANNEL?{channel:process.env.CHAT_BROWSER_CHANNEL}:{})});
 try{
 for(const theme of ['light','dark'])for(const mobile of [false,true]){
  const f=await groupFixture(),contexts=[],sockets=new Map(),pages={},errors=[];const name=theme+'-'+(mobile?'mobile':'desktop');
  await f.addFriends(301);
  let failNextSend=false, failAvatarFor='beta', holdPath='', releaseReply=null; const avatarReads=[],memberAvatarReads=[];
  f.onEvent=(username,event)=>sockets.get(username)?.send(JSON.stringify(event));
  try{
   for(const username of ['alpha','beta','gamma']){
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},serviceWorkers:'block',timezoneId:'America/Campo_Grande',colorScheme:theme});contexts.push(context);
    const page=await context.newPage();pages[username]=page;page.setDefaultTimeout(5000);page.on('pageerror',e=>errors.push(e.message));page.on('dialog',dialog=>dialog.accept());
    await page.route('**/*',async route=>{
     const url=new URL(route.request().url()),method=route.request().method();
     if(url.hostname==='group-fixture.test')return route.fulfill({contentType:'text/html',body:`<!doctype html><html data-portal-theme="${theme}"><head><meta charset="utf-8">${csp}<style>${styles}</style></head><body class="${mobile?'mobile-home-mode':''}"></body></html>`});
     if(url.origin!==endpoint)return route.abort();
     if(url.pathname.startsWith('/api/chat/groups')){
      if(url.pathname.endsWith('/member-avatar'))memberAvatarReads.push({username,path:url.pathname,member:url.searchParams.get('username')});
      if(url.pathname.endsWith('/avatar')){
       avatarReads.push({username,path:url.pathname});
       if(username===failAvatarFor){failAvatarFor='';return route.fulfill({status:503,json:{error:'Falha sintética de foto'}});}
      }
      if(method==='POST'&&url.pathname.endsWith('/messages')&&failNextSend){failNextSend=false;return route.fulfill({status:503,json:{error:'Falha sintética de rede'}});}
      const body=method==='GET'?undefined:JSON.parse(route.request().postData()||'{}');
      const response=await f.call(username,url.pathname.slice('/api/chat/groups'.length)+url.search,body);
      const responseText=await response.text();
      if(holdPath&&method==='GET'&&url.pathname.slice('/api/chat/groups'.length)+url.search===holdPath){holdPath='';await new Promise(resolve=>releaseReply=resolve);}
      return route.fulfill({status:response.status,contentType:'application/json',body:responseText});
     }
     let data={ok:true};
     if(url.pathname.endsWith('/users'))data={users:Object.values(f.users).filter(u=>u.username!==username).map(u=>({...u,online:true,unread:0,avatarDataUrl:f.users[u.username].avatarDataUrl||'',lastMessageAt:''}))};
     if(url.pathname.endsWith('/ticket'))data={ticket:'synthetic',protocol:'portal-chat-v1'};
     if(url.pathname.endsWith('/messages'))data={messages:[],pageSize:120,receipt:{}};
     return route.fulfill({json:data});
    });
    await page.routeWebSocket(endpoint.replace('https:','wss:')+'/api/chat/realtime',ws=>{sockets.set(username,ws);ws.onMessage(value=>{if(value==='ping')ws.send('pong');});});
    await page.goto('https://group-fixture.test/');
    await page.evaluate(({username,endpoint,user})=>{
     delete Navigator.prototype.serviceWorker;delete window.Notification;let hidden=false;
     Object.defineProperty(document,'hidden',{get:()=>hidden,configurable:true});
     window.fixtureVisible=visible=>{hidden=!visible;document.dispatchEvent(new Event('visibilitychange'));};
     window.REGULATION_AUTH_CONFIG={endpoint};window.RegulationAuth={me:async()=>user,authorizationHeader:()=>({}),getToken:()=>''};
    },{username,endpoint,user:f.users[username]});
    const avatar=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');x.fillStyle='#287ca3';x.fillRect(0,0,48,48);x.fillStyle='#fff';x.fillRect(12,12,24,24);return c.toDataURL('image/png');});
    f.users[username].avatarDataUrl=avatar;await f.env.AUTH_DB.prepare('UPDATE auth_users SET avatar_data=? WHERE username=?').bind(avatar,username).run();
    await page.evaluate(value=>window.RegulationAuth.me=async()=>value,f.users[username]);
    await page.addScriptTag({content:read('js/portal-chat-groups.js')});await page.addScriptTag({content:read('js/portal-chat.js')});await page.addScriptTag({content:read('js/portal-chat-switch-optimizer.js')});
    await page.locator('#portalChatLauncher').click();await page.waitForSelector('#portalGroupCreate');
   }
   const a=pages.alpha,b=pages.beta,c=pages.gamma;
   await a.locator('#portalGroupCreate').click();await a.locator('#portalGroupForm input[name=name]').fill('Grupo <sintético>');
   await a.locator('#portalGroupForm textarea[name=description]').fill('Equipe de teste isolada');
   await a.locator('input[name=photo]').setInputFiles({name:'synthetic-group.png',mimeType:'image/png',buffer:Buffer.from(f.users.alpha.avatarDataUrl.split(',')[1],'base64')});
   await a.locator('input[name=members][value=beta]').check();await a.locator('input[name=members][value=gamma]').check();
   await a.locator('[data-friend-more]').click();
   await a.waitForSelector('input[name=members][value="page.friend.300"]');
   assert.equal(await a.locator('input[name=members][value=beta]').isChecked(),true,'Pagination preserves selected invitations');
   assert.equal(await a.locator('[data-friend-more]').isVisible(),false,'Last page completes the candidate list');
   await a.locator('[data-friend-search]').fill('ZZ Pessoa Fictícia 300');
   await a.locator('input[name=members][value="page.friend.300"]').check();
   await a.locator('input[name=members][value="page.friend.300"]').uncheck();
   await a.locator('[data-friend-search]').fill('');
   assert.equal(await a.locator('input[name=members][value=delta]').count(),0,'Only founder friends are selectable');
   await a.screenshot({path:path.join(evidence,'groups-create-'+name+'.png')});
   await a.locator('#portalGroupForm button[type=submit]').click();
   await a.waitForSelector('#portalChatGroupView.active');
   const id=(await f.json('alpha')).groups[0].id;
   await a.waitForFunction(()=>document.querySelector('#portalChatHeaderAvatar img')?.naturalWidth>0);
   for(const page of [b,c]){
    await page.waitForSelector(`[data-group-open="${id}"]`);await page.locator(`[data-group-open="${id}"]`).click();
    await page.locator('[data-accept]').click();await page.waitForSelector('#portalChatGroupView.active');
   }
   await b.waitForFunction(()=>document.querySelector('#portalChatHeaderAvatar img')?.naturalWidth>0);
   assert.equal(avatarReads.filter(r=>r.username==='beta').length,2,'Transient avatar failure retries the same version');
   for(const [username,page] of Object.entries(pages)){
    await page.locator('#portalGroupInput').fill('Mensagem sintética de '+username);await page.locator('#portalGroupSend').click();
    for(const peer of Object.values(pages))await peer.waitForFunction(text=>document.getElementById('portalGroupMessages').textContent.includes(text),'Mensagem sintética de '+username);
   }
   for(const page of Object.values(pages))assert.equal(await page.locator('#portalGroupMessages [data-group-message]').count(),3,'One shared ordered history');
   await a.waitForFunction(()=>[...document.querySelectorAll('#portalGroupMessages .portal-chat-avatar-image')].filter(img=>img.naturalWidth>0).length===3);
   const senderReads=memberAvatarReads.filter(r=>r.username==='alpha').length;
   assert.equal(senderReads,3,'Sender photos are fetched once per version');
   await a.locator('#portalGroupInput').fill('<img src=x onerror="window.fixtureXSS=true">');await a.locator('#portalGroupSend').click();
   await b.waitForFunction(()=>document.getElementById('portalGroupMessages').textContent.includes('onerror='));assert.equal(await b.evaluate(()=>window.fixtureXSS),undefined);
   await a.waitForFunction(()=>[...document.querySelectorAll('#portalGroupMessages .portal-chat-avatar-image')].filter(img=>img.naturalWidth>0).length>=3);
   assert.equal(memberAvatarReads.filter(r=>r.username==='alpha').length,senderReads,'Incremental history reuses sender photos');
   await a.screenshot({path:path.join(evidence,'groups-chat-'+name+'.png')});
   const geometry=await a.locator('.portal-chat-panel').boundingBox();assert.ok(geometry.x>=0&&geometry.width<=(mobile?390:1440));
   assert.equal(avatarReads.filter(r=>r.username==='alpha').length,1,'Message refreshes reuse the same private avatar');
   await a.locator('#portalGroupEmojiButton').click();await a.locator('#portalGroupInput').fill('ab');
   await a.locator('#portalGroupInput').evaluate(input=>input.setSelectionRange(1,1));
   await a.locator('[data-group-emoji="20"]').click();assert.equal(await a.locator('#portalGroupInput').inputValue(),'a👍b');
   await a.locator('#portalGroupInput').fill('Teste de erro e reenvio');failNextSend=true;await a.locator('#portalGroupSend').click();
   await a.waitForSelector('#portalGroupMessages [data-send-state="failed"]');
   await a.locator('#portalGroupMessages [data-send-state="failed"] button').click();
   await b.waitForFunction(()=>document.getElementById('portalGroupMessages').textContent.includes('Teste de erro e reenvio'));
   assert.equal((await f.env.AUTH_DB.prepare("SELECT COUNT(*) AS n FROM portal_chat_group_messages WHERE body='Teste de erro e reenvio'").first()).n,1);
   await a.locator('#portalChatBack').click();await a.locator('[data-group-filter="groups"]').click();
   assert.equal(await a.locator('#portalChatList').isVisible(),false);
   assert.ok((await a.locator('#portalChatGroupsSection').boundingBox()).height>180,'Groups-only view uses available height');
   await a.locator('[data-group-open="'+id+'"]').click();await a.waitForSelector('#portalGroupMessages [data-send-state="sent"]');
   const firstMessage=(await f.json('alpha','/'+id+'/messages')).messages[0].id;
   holdPath='/'+id+'/info?messageId='+firstMessage;releaseReply=null;
   await a.locator('#portalGroupMessages [data-group-message="'+firstMessage+'"] button').click();await until(()=>Boolean(releaseReply));
   await a.locator('[data-group-sheet-close]').click();
   await a.locator('#portalGroupInfo').click();await a.waitForSelector('[data-member=beta][data-member-action=promote]');
   releaseReply();await delay(150);
   assert.equal(await a.locator('#portalGroupSheet header strong').textContent(),'Dados do grupo');
   assert.ok((await a.locator('#portalGroupSheet').textContent()).includes('Médico(a)'));
   await a.waitForFunction(()=>[...document.querySelectorAll('#portalGroupSheet [data-member-avatar] img')].filter(img=>img.naturalWidth>0).length===3);
   const memberReads=memberAvatarReads.filter(r=>r.username==='alpha').length;
   assert.equal(memberReads,3,'Details load each profile separately once');
   await a.locator('[data-group-sheet-close]').click();await a.locator('#portalGroupInfo').click();
   await a.waitForSelector('[data-member=beta][data-member-action=promote]');
   await a.waitForFunction(()=>[...document.querySelectorAll('#portalGroupSheet [data-member-avatar] img')].filter(img=>img.naturalWidth>0).length===3);
   assert.equal(memberAvatarReads.filter(r=>r.username==='alpha').length,memberReads,'Reopening details reuses authorized version metadata and memory photos');
   await a.screenshot({path:path.join(evidence,'groups-members-'+name+'.png')});
   await a.locator('[data-member=beta][data-member-action=promote]').click();await delay(100);
   await a.locator('[data-group-sheet-close]').click();
   await b.locator('#portalGroupInfo').click();await b.waitForSelector('[data-action=invite]');await b.locator('[data-action=invite]').click();
   await b.waitForSelector('input[name=members][value="page.friend.000"]');
   assert.equal(await b.locator('input[name=members][value=delta]').count(),0,'Other admin cannot invite own friend');
   await b.locator('[data-group-sheet-close]').click();
   await c.evaluate(()=>window.fixtureVisible(false));
   await a.locator('#portalGroupInput').fill('Mensagem com aba oculta');await a.locator('#portalGroupSend').click();await delay(150);
   assert.ok(!(await c.locator('#portalGroupMessages').textContent()).includes('Mensagem com aba oculta'));
   await c.evaluate(()=>window.fixtureVisible(true));await c.waitForFunction(()=>document.getElementById('portalGroupMessages').textContent.includes('Mensagem com aba oculta'));
   await a.locator('#portalGroupInfo').click();await a.waitForSelector('[data-member=beta][data-member-action=remove]');await a.locator('[data-member=beta][data-member-action=remove]').click();
   await b.waitForFunction(()=>!document.getElementById('portalChatGroupView').classList.contains('active'));
   assert.equal(await b.locator('#portalGroupMessages [data-group-message]').count(),0,'Revoked history cleared');
   await c.evaluate(()=>window.dispatchEvent(new Event('portal:session-cleared')));
   assert.equal(await c.locator('#portalGroupMessages [data-group-message]').count(),0,'Logout clears content');
   f.env.CHAT_GROUPS_ENABLED='false';sockets.get('alpha').send(JSON.stringify({type:'group-refresh',groupId:id}));
   await a.waitForFunction(()=>document.getElementById('portalGroupTabs').hidden&&!document.getElementById('portalChatGroupView').classList.contains('active'));
   assert.equal(await a.locator('#portalGroupMessages [data-group-message]').count(),0,'Disabled feature clears old group content');
   assert.deepEqual(errors,[]);assert.deepEqual(f.env.AUTH_DB.errors,[]);
   results.push({name,ok:true,participants:3,scenarios:['create','accepted-friends','invitation','live-three-way','sender-identification','safe-text','date-divider','admin-founder-rule','hidden-tab-recovery','removal','logout','real-raster-photos','emoji-cursor','failed-send-retry','stale-dialog-response','groups-filter-height','feature-disabled-cleanup']});
  }catch(error){results.push({name,ok:false,error:error.message,sqlErrors:f.env.AUTH_DB.errors});for(const [user,page]of Object.entries(pages))await page.screenshot({path:path.join(evidence,'groups-failure-'+name+'-'+user+'.png')}).catch(()=>{});}
  finally{for(const context of contexts)await context.close();f.close();}
 }
 }finally{await browser.close();}
 const report={results};fs.writeFileSync(path.join(evidence,'groups-browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(results.some(r=>!r.ok))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
