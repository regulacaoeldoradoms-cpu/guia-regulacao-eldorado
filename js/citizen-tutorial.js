// No user text, files, tokens or API responses enter tutorial persistence.
(() => {
'use strict';
if (globalThis.PortalCitizenTutorial?.launcherVersion === 3) return;
const VERSION=1;
const STEPS=Object.freeze(['open','sugestao','reclamacao','elogio','denuncia','report','details','files','preview','remove','identified','protected','send','track','reply','notice']);
const EXAMPLE={subject:'Exemplo fictício: mural com informações a apurar',description:'Exemplo inteiramente fictício: um mural da Unidade Modelo teria exposto dados pessoais inventados de usuários do serviço. Relato essa possível irregularidade para apuração, sem reproduzir esses dados. Não descreve pessoa ou atendimento real.'};
const PROTOCOL='DEMO-FICTICIO-001';
const lessons=[
 ['Vamos praticar','Clique em Nova manifestação. Aqui nada será enviado.','#openNewManifestation'],
 ['Sugestão melhora o serviço','Selecione Sugestão. Exemplo fictício: propor placas de orientação.','input[value="sugestao"]'],
 ['Reclamação aponta um problema','Selecione Reclamação. Exemplo fictício: placas difíceis de entender.','input[value="reclamacao"]'],
 ['Elogio reconhece o que foi bom','Selecione Elogio. Exemplo fictício: agradecer uma boa orientação.','input[value="elogio"]'],
 ['Denúncia pede apuração','Selecione Denúncia. Relate fatos, sem expor dados pessoais.','input[value="denuncia"]'],
 ['Conte um fato inventado','Preencha assunto e relato; saia do campo ao terminar. Ou use o exemplo, sem dados pessoais.','#composeReport'],
 ['Detalhes são opcionais','Abra Adicionar detalhes, preencha um campo fictício e saia dele. Ou use o exemplo.','#composeDetails'],
 ['Anexe um exemplo','Em Anexar arquivos, clique em Escolher arquivos. Só adicionamos uma imagem fictícia. JPG, PNG ou PDF: até 5 arquivos de 5 MB.','#composeAttachments'],
 ['Confira antes de enviar','Abra a miniatura e feche a imagem para continuar.','#manifestationFileList'],
 ['Um arquivo pode identificar você','Clique em Remover anexo. Revise também nomes, imagens e PDFs.','#manifestationFileList'],
 ['Você escolhe se identificar','Selecione Me identificar: o Conselho vê seu perfil, mas não o e-mail.','input[value="identificada"]'],
 ['Proteja seu perfil','Selecione a opção protegida: o Conselho não vê seu perfil. Sigiloso ou “anônimo”, o protocolo segue ligado à conta; o sistema pode identificar você.','.compose-privacy'],
 ['Simule o envio','Revise o aviso, marque a confirmação e clique em Enviar manifestação. Sem envio ou upload real. O Canal não agenda nem atende urgências.','.compose-privacy'],
 ['Veja o andamento','Clique no protocolo fictício em Minhas manifestações.','#manifestationList'],
 ['Converse pelo protocolo','Escreva uma resposta inventada ou use o exemplo. Clique em Enviar resposta.','#replyForm'],
 ['Abra o aviso','Clique no aviso fictício em Notificações. Só este exemplo será marcado como lido.','#notificationList']
];
function identity(user){return String(user?.id||'')+'|'+String(user?.username||'');}
function keyFor(user){return 'portal.citizen.tutorial.v1:'+encodeURIComponent(identity(user));}
function readProgress(storage,user){
 try{const p=JSON.parse(storage.getItem(keyFor(user))||'null');if(p?.version===VERSION&&Array.isArray(p.steps)&&p.steps.length<=STEPS.length&&p.steps.every((s,i)=>s===STEPS[i]))return p.steps.slice();}catch(_){}
 return [];
}
// This adapter has no reference to fetch, auth.api, storage or an endpoint.
// Even a retained handler or late Promise can only update synthetic memory.
function demoAdapter({verified,valid,onAction,allowAction}){
 let submitted=false,read=false;
 const messages=[{senderType:'council',body:'Resposta fictícia: informe qual placa poderia ajudar. Nenhuma análise real foi realizada.',createdAt:'2026-01-02T12:00:00Z'}];
 const item={protocol:PROTOCOL,type:'denuncia',subject:EXAMPLE.subject,description:EXAMPLE.description,createdAt:'2026-01-01T12:00:00Z',status:'aguardando_cidadao',privacyMode:verified?'sigilosa':'anonima'};
 const user=Object.freeze({id:'demo-only',username:'perfil.ficticio',name:'Perfil fictício',role:'cidadao',emailVerified:verified});
 const check=()=>{if(!valid())throw new DOMException('Demonstração encerrada','AbortError');};
 return Object.freeze({getToken:()=> 'demo-only',requireRole:async()=>{check();return user;},hasCouncilAccess:()=>false,getSecurity:async()=>({emailVerified:verified}),authorizationHeader:()=>({}),
  async api(path,options={}){
   check();const url=new URL(path,'https://example.invalid'),method=options.method||'GET',p=url.pathname;
   if(p==='/api/council/my'&&method==='GET')return {manifestations:submitted?[{...item}]:[]};
   if(p==='/api/council/notifications'&&method==='GET')return {notifications:submitted?[{id:1,protocol:PROTOCOL,title:'Aviso fictício: resposta disponível',createdAt:item.createdAt,readAt:read?item.createdAt:null}]:[]};
   if(p==='/api/council/notifications'&&method==='PATCH'){if(allowAction('notice')){read=true;onAction('notice');}return {ok:true};}
   if(p==='/api/council/manifestations'&&method==='POST'){
    if(!allowAction('send'))throw new Error('Siga a orientação do tutorial antes de simular o envio.');
    submitted=true;item.privacyMode=JSON.parse(options.body).privacyMode;onAction('send');return {manifestation:{...item}};
   }
   if(p===`/api/council/manifestations/${PROTOCOL}`&&method==='GET'){
    onAction('track');return {manifestation:{...item},messages:messages.map(m=>({...m})),events:[{type:'status_changed',fromStatus:'recebida',toStatus:'aguardando_cidadao',detail:'Histórico fictício',createdAt:item.createdAt}],attachments:[]};
   }
   if(p===`/api/council/manifestations/${PROTOCOL}/messages`&&method==='POST'){
    if(!allowAction('reply'))throw new Error('Escreva uma resposta fictícia na etapa indicada.');
    // Discard entered text; it never becomes a fixture or a persisted message.
    messages.push({senderType:'citizen',body:'Resposta fictícia simulada. Nenhum conteúdo foi transmitido.',createdAt:item.createdAt});onAction('reply');return {ok:true};
   }
   if(p===`/api/council/manifestations/${PROTOCOL}/attachments`&&method==='POST')return {ok:true};
   throw new Error('Ação fora da demonstração.');
  },seed(){submitted=true;}
 });
}
// Global controllers (chat presence, mascots and technical telemetry) also
// share this document. Block their effects while demonstrating. The normal
// authenticated implementations remain intact and are restored on every exit.
function lockEffects(){
 let locked=true;
 const nativeSocket=globalThis.WebSocket;
 const fetch=globalThis.fetch,xhr=XMLHttpRequest.prototype.send,beacon=navigator.sendBeacon,send=globalThis.WebSocket?.prototype.send,submit=HTMLFormElement.prototype.submit;
 const guardedFetch=function(input,options){
  const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);
  const method=String(options?.method||input?.method||'GET').toUpperCase();
  if(locked&&(url.pathname.startsWith('/api/')||!['GET','HEAD'].includes(method)))return Promise.reject(new DOMException('Rede pausada durante demonstração','AbortError'));
  return fetch.call(this,input,options);
 };
 const guardedXHR=function(...args){if(locked)throw new DOMException('Rede pausada durante demonstração','AbortError');return xhr.apply(this,args);};
 const guardedBeacon=function(...args){return locked?false:beacon.apply(this,args);};
 const guardedSend=function(...args){if(!locked)return send.apply(this,args);};
 const guardedSubmit=function(...args){if(locked){this.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return;}return submit.apply(this,args);};
 globalThis.fetch=guardedFetch;XMLHttpRequest.prototype.send=guardedXHR;
 if(beacon)navigator.sendBeacon=guardedBeacon;if(send)WebSocket.prototype.send=guardedSend;
 const guardedSocket=nativeSocket?new Proxy(nativeSocket,{construct(target,args){if(locked)throw new DOMException('Rede pausada durante demonstração','AbortError');return Reflect.construct(target,args);}}):null;
 if(guardedSocket)globalThis.WebSocket=guardedSocket;HTMLFormElement.prototype.submit=guardedSubmit;
 return ()=>{locked=false;if(guardedSocket&&globalThis.WebSocket===guardedSocket)globalThis.WebSocket=nativeSocket;if(globalThis.fetch===guardedFetch)globalThis.fetch=fetch;if(XMLHttpRequest.prototype.send===guardedXHR)XMLHttpRequest.prototype.send=xhr;if(navigator.sendBeacon===guardedBeacon)navigator.sendBeacon=beacon;if(send&&WebSocket.prototype.send===guardedSend)WebSocket.prototype.send=send;if(HTMLFormElement.prototype.submit===guardedSubmit)HTMLFormElement.prototype.submit=submit;};
}
function scopeDocument(root,signal){
 return new Proxy(globalThis.document,{get(target,property){
  if(property==='getElementById')return id=>root.querySelector('#'+CSS.escape(id))||root.querySelector('#demo-'+CSS.escape(id));
  if(property==='querySelector')return selector=>root.querySelector(selector);
  if(property==='querySelectorAll')return selector=>root.querySelectorAll(selector);
  if(property==='addEventListener')return (name,handler,options)=>root.addEventListener(name,handler,{...(typeof options==='object'?options:{capture:Boolean(options)}),signal});
  const value=Reflect.get(target,property,target);return typeof value==='function'?value.bind(target):value;
 }});
}
function cloneWorkspace(document){
 const root=globalThis.document.createElement('div');root.className='tutorial-workspace';
 for(const selector of ['.citizen-actions','.citizen-grid','#newManifestationModal','#composeFilePreview','#manifestationDetailModal']){
  const source=document.querySelector(selector);if(!source)throw new Error('Componentes do Canal indisponíveis.');root.append(source.cloneNode(true));
 }
 root.querySelectorAll('script,[data-citizen-tutorial-entry]').forEach(n=>n.remove());
 root.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes])if(/^on/i.test(a.name))n.removeAttribute(a.name);});
 // Sanitize all dynamic data before mounting; keep the original nodes untouched.
 root.querySelectorAll('input,textarea,select').forEach(n=>{if(n.type==='radio'||n.type==='checkbox'){n.checked=false;n.defaultChecked=false;}else{n.value='';n.defaultValue='';n.removeAttribute('value');}n.disabled=false;});
 root.querySelector('input[name="manifestationPrivacy"]:not([value="identificada"])').checked=true;
 root.querySelectorAll('details').forEach(n=>n.open=false);
 for(const id of ['manifestationList','notificationList','manifestationFileList','newManifestationStatus','composeDraftNotice','replyStatus','attachmentList','messageThread','timeline','detailProtocol','detailMeta','detailSubject','detailDescription','detailStatus','detailPrivacy'])root.querySelector('#'+id)?.replaceChildren();
 root.querySelectorAll('.citizen-modal').forEach(n=>{n.classList.remove('open');n.setAttribute('aria-hidden','true');n.setAttribute('aria-modal','false');n.setAttribute('role','dialog');if(n.querySelector('h2')?.id)n.setAttribute('aria-labelledby',n.querySelector('h2').id);n.inert=false;
  // The outer tutorial owns modal focus. Embedded native dialogs must keep
  // the guide available to assistive technology, including image previews.
  const set=n.setAttribute.bind(n);n.setAttribute=(name,value)=>set(name,name==='aria-modal'?'false':value);});
 root.querySelectorAll('a').forEach(n=>{n.removeAttribute('href');n.removeAttribute('download');});
 // The real controller's context header lookups stay within this synthetic root.
 root.querySelector('#composeFilePreview img')?.removeAttribute('src');
 root.querySelector('#openNewManifestation').hidden=false;
 for(const id of ['portalUserName','portalUserRole','professionalHomeLink','citizenContextNotice','privacyChip','firebaseNotice']){const n=globalThis.document.createElement('span');n.id='demo-'+id;n.hidden=true;root.append(n);}
 return root;
}
function mount({document,window,context,user,isBusy,initialize}){
 const host=document.querySelector('.portal-hero');if(!host)return;
 const existing=host.querySelector('[data-citizen-tutorial-entry]');if(existing&&!existing.hasAttribute('data-tutorial-bootstrap'))return;
 const token=window.RegulationAuth.getToken(),owner=identity(user),entry=existing||globalThis.document.createElement('details');entry.dataset.citizenTutorialEntry='';entry.className='citizen-tutorial-entry';
 entry.innerHTML='<summary data-tutorial-options aria-label="Ajuda: tutorial do Canal do Cidadão" title="Ajuda do Canal"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" focusable="false"><path d="M8 8a4 4 0 0 1 8 0c0 3-4 3-4 6"/><circle cx="12" cy="18" r="1"/></svg></span><span class="tutorial-help-label">Ajuda</span></summary><div class="tutorial-entry-panel"><button type="button" class="portal-button secondary" data-tutorial-start>Aprender usando o Canal</button><button type="button" class="portal-button secondary" data-tutorial-restart hidden>Refazer tutorial</button><button type="button" class="portal-button secondary" data-tutorial-close-options>Fechar ajuda</button><p role="status" data-tutorial-status></p></div>';
 entry.removeAttribute('data-tutorial-bootstrap');host.append(entry);
 let completed=readProgress(window.localStorage,user),session=null,disposed=false,starting=false,awarding=false,logoutInProgress=false;
 const status=entry.querySelector('[data-tutorial-status]'),start=entry.querySelector('[data-tutorial-start]'),restart=entry.querySelector('[data-tutorial-restart]');
 const current=()=>!disposed&&!context?.disposed&&window.RegulationAuth.getToken()===token&&identity(window.RegulationAuth.getCachedUser())===owner;
 function entryLabel(){start.textContent=completed.length===STEPS.length?'Registrar conclusão do tutorial':completed.length?'Retomar tutorial':'Aprender usando o Canal';restart.hidden=!completed.length;}
 function persist(){try{window.localStorage.setItem(keyFor(user),JSON.stringify({version:VERSION,steps:completed}));}catch(_){status.textContent='Progresso disponível nesta aba; armazenamento local indisponível.';}entryLabel();}
 function stop({save=true,focus=true}={}){
  const s=session;if(!s)return;session=null;starting=false;s.valid=false;s.abort.abort();cancelAnimationFrame(s.advanceFrame);s.timers?.forEach(id=>clearTimeout(id));s.controllers.forEach(c=>c.dispose?.());s.dialog?.close();s.dialog?.remove();s.savedNodes?.forEach(([node,marker])=>marker.replaceWith(node));s.unlock?.();
  if(save&&current()){persist();if(status.textContent.startsWith('Preparando a demonstração'))status.textContent='Tutorial pausado. Você pode retomar.';}if(focus&&current()&&start.isConnected){entry.open=true;start.focus({preventScroll:true});}
 }
 async function award(){
  if(awarding||!current()||session||completed.length!==STEPS.length)return;
  awarding=true;start.disabled=true;restart.disabled=true;status.textContent='Registrando a conclusão integral…';
  try{const receipt=await window.RegulationAuth.api('/api/portal-tutorials/citizen/complete',{method:'POST',body:JSON.stringify({version:VERSION,steps:completed})});if(receipt?.completion?.version!==VERSION)throw new Error('Conclusão não registrada');if(current()){status.textContent='Tutorial concluído. Conquista Canal do Cidadão em Exploração do Portal.';start.textContent='Tutorial concluído';}}
  catch(_){if(current())status.textContent='Tutorial concluído neste dispositivo. O registro da conquista está indisponível; use este botão para tentar novamente.';}
  finally{awarding=false;start.disabled=false;restart.disabled=false;}
 }
 function setValues(root,values){for(const [id,value]of Object.entries(values)){const n=root.querySelector('#'+id);n.value=value;n.dispatchEvent(new Event('input',{bubbles:true}));}}
 async function begin(){
  if(!current()||session||starting||awarding)return;
  if(completed.length===STEPS.length)return award();
  if(isBusy()){status.textContent='Aguarde a ação em andamento no Canal para iniciar o tutorial.';return;}
  starting=true;
  const s={valid:true,controllers:[],abort:new AbortController(),index:completed.length,epoch:0,pending:false,preparing:true,timers:new Set(),advanceFrame:0};
  session=s;
  try{
   if(!window.RegulationAuth.whenNetworkIdle)throw new Error('Abra uma nova aba do Portal para iniciar o tutorial com segurança.');
   s.unlock=lockEffects();
   status.textContent='Preparando a demonstração; aguardando ações já iniciadas. Você pode cancelar.';start.textContent='Cancelar preparação';
   let idleTimer;
   try{await Promise.race([window.RegulationAuth.whenNetworkIdle(),new Promise((_,reject)=>{idleTimer=setTimeout(()=>reject(new Error('Ações ainda em andamento')),8000);})]);}finally{clearTimeout(idleTimer);}
   if(!s.valid||session!==s||!current())return;
   const dialog=globalThis.document.createElement('dialog');s.dialog=dialog;dialog.className='citizen-tutorial';dialog.setAttribute('aria-labelledby','tutorialTitle');dialog.setAttribute('aria-describedby','tutorialExplanation');
   dialog.innerHTML='<section class="tutorial-guide"><strong class="tutorial-mode">DEMONSTRAÇÃO · sem envio</strong><p id="tutorialProgress" data-tutorial-progress></p><h2 id="tutorialTitle" tabindex="-1" aria-describedby="tutorialProgress tutorialExplanation"></h2><p id="tutorialExplanation" data-tutorial-explanation></p><div class="tutorial-controls"><button type="button" class="portal-button secondary" data-tutorial-back>Voltar</button><button type="button" class="portal-button secondary" data-tutorial-example hidden>Usar exemplo fictício</button><button type="button" class="portal-button secondary" data-tutorial-pause>Pausar</button><button type="button" class="portal-button secondary" data-tutorial-skip>Pular</button></div><p data-tutorial-feedback role="status" aria-live="polite"></p></section>';
   dialog.prepend(dialog.querySelector('.tutorial-mode'));
   const root=cloneWorkspace(document);s.root=root;dialog.append(root);
   // Keep one set of native IDs in the document, so labels and ARIA references
   // resolve to the demonstration. Detached live nodes retain drafts, files and
   // listeners; nothing is serialized or rebuilt on return.
   s.savedNodes=[];
   for(const selector of ['main','#newManifestationModal','#composeFilePreview','#manifestationDetailModal']){const node=document.querySelector(selector);if(node){const marker=globalThis.document.createComment('Tutorial preserves native component');node.before(marker);s.savedNodes.push([node,marker]);node.remove();}}
   entry.open=false;(context?.root||globalThis.document.body).append(dialog);dialog.showModal();
   const valid=()=>s.valid&&session===s&&current();
   const feedback=dialog.querySelector('[data-tutorial-feedback]'),events=new WeakMap(),tickets={};
   const ready=()=>valid()&&!s.preparing&&!s.pending;
   const allowAction=action=>ready()&&action===STEPS[s.index]&&tickets[action]===s.epoch;
   // One rendered transition per initiating action. Native change/click pairs,
   // duplicate events and late synthetic API callbacks cannot skip a lesson.
   function evidence(action,epoch,condition=()=>true){
    if(!ready()||epoch!==s.epoch||action!==STEPS[s.index]||!condition())return;
    s.pending=true;const index=s.index;
    s.advanceFrame=requestAnimationFrame(()=>{
     if(!valid()||s.preparing||epoch!==s.epoch)return;
     s.pending=false;if(!condition())return;
     if(index===completed.length){completed.push(STEPS[index]);persist();}
     if(index===STEPS.length-1){stop();award();return;}
     s.epoch++;s.index++;s.timers.forEach(id=>clearTimeout(id));s.timers.clear();
     if(s.index===13||s.index===15){s.preparing=true;root.querySelectorAll('.citizen-modal.open').forEach(n=>n.querySelector('[data-close-modal]')?.click());s.preparing=false;}
     render();
    });
   }
   const apiAction=action=>{const epoch=tickets[action];tickets[action]=null;evidence(action,epoch);};
   const adapter=demoAdapter({verified:user.emailVerified===true,valid,onAction:apiAction,allowAction});s.adapter=adapter;
   const localWindow=new Proxy(window,{get(target,property){
    if(property==='RegulationAuth')return adapter;
    if(property==='setTimeout')return (callback,delay,...args)=>{const epoch=s.epoch;const id=setTimeout(()=>{s.timers.delete(id);if(valid()&&epoch===s.epoch)callback(...args);},delay);s.timers.add(id);return id;};
    const value=Reflect.get(target,property,target);return typeof value==='function'?value.bind(target):value;
   }});
   const demoContext={window:localWindow,document:scopeDocument(root,s.abort.signal),citizenDemo:{auth:adapter},addController:c=>s.controllers.push(c),get disposed(){return !valid();}};
   await initialize(demoContext);if(!valid())return;
   async function prepare(index){
    s.preparing=true;
    root.querySelector('#composeFilePreview').querySelector('[data-close-local-preview]')?.click();
    root.querySelectorAll('.citizen-modal.open').forEach(n=>n.querySelector('[data-close-modal]')?.click());
    if(index>=1&&index<=12){root.querySelector('#openNewManifestation').click();}
    if(index>=5&&index<=12){const n=root.querySelector('input[value="denuncia"]');n.checked=true;n.dispatchEvent(new Event('change',{bubbles:true}));}
    if(index>=6&&index<=12)setValues(root,{manifestationSubject:EXAMPLE.subject,manifestationDescription:EXAMPLE.description});
    root.querySelectorAll('.compose-file-remove').forEach(n=>n.click());
    if(index===7||index===8||index===9)root.querySelector('#composeAttachments').open=true;
    if(index===8||index===9)syntheticFile();
    if(index>=13){adapter.seed();root.querySelector('#refreshManifestations').click();root.querySelector('#markNotificationsRead').click();await Promise.resolve();await Promise.resolve();if(index===14)root.querySelector('[data-protocol]')?.click();}
    s.preparing=false;
   }
   function highlight(){
    if(!valid())return;
    root.querySelectorAll('[data-tutorial-target]').forEach(n=>n.removeAttribute('data-tutorial-target'));
    const target=root.querySelector('#composeFilePreview.open')||root.querySelector(lessons[s.index][2]);
    if(!target||!target.getClientRects().length){feedback.textContent='Abra o componente indicado. Seu progresso está salvo.';return;}
    const visibleTarget=target.matches('input')?target.closest('label')||target:target;
    visibleTarget.dataset.tutorialTarget='';visibleTarget.scrollIntoView({block:'nearest',behavior:'instant'});
   }
   function render(){
    s.previewed=false;feedback.textContent='';
    const [title,text]=lessons[s.index];dialog.querySelector('#tutorialTitle').textContent=title;dialog.querySelector('[data-tutorial-explanation]').textContent=text;
    if(s.index===11)dialog.querySelector('[data-tutorial-explanation]').textContent=`Selecione ${user.emailVerified?'Enviar com sigilo':'Enviar anonimamente'}. O Conselho não vê seu perfil. O protocolo segue ligado à conta; não há anonimato perante o sistema.`;
    dialog.querySelector('[data-tutorial-progress]').textContent=`Etapa ${s.index+1} de ${STEPS.length}`;
    dialog.querySelector('[data-tutorial-back]').disabled=s.index===0;
    dialog.querySelector('[data-tutorial-example]').hidden=![5,6,14].includes(s.index);
    dialog.querySelector('#tutorialTitle').focus({preventScroll:true});requestAnimationFrame(highlight);
   }
   function syntheticFile(){
    const canvas=globalThis.document.createElement('canvas');canvas.width=320;canvas.height=200;const paint=canvas.getContext('2d');paint.fillStyle='#176b8a';paint.fillRect(0,0,320,200);paint.fillStyle='#fff';paint.font='bold 24px sans-serif';paint.fillText('EXEMPLO FICTÍCIO',25,100);const bytes=Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1]),c=>c.charCodeAt(0));
    const transfer=new DataTransfer();transfer.items.add(new File([bytes],'exemplo-ficticio.png',{type:'image/png'}));
    const input=root.querySelector('#manifestationFiles');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
   }
   // Stamp the action before native handlers run, including submit()/Enter.
   for(const type of ['click','change','focusout','keydown','keyup','submit'])root.addEventListener(type,event=>{
    events.set(event,s.epoch);if(!ready())return;
    if(type==='submit'){
     const action=event.target.id==='newManifestationForm'?'send':event.target.id==='replyForm'?'reply':null;
     if(action===STEPS[s.index]&&event.target.checkValidity()&&(action!=='reply'||root.querySelector('#replyText').value.trim()))tickets[action]=s.epoch;
    }
    if(type==='click'){
     const action=event.target.closest('#manifestationList [data-protocol]')?'track':event.target.closest('#notificationList [data-notification]')?'notice':null;
     if(action===STEPS[s.index])tickets[action]=s.epoch;
    }
   },{capture:true,signal:s.abort.signal});
   // The native picker/attachment handler receives only this known local file.
   root.addEventListener('click',event=>{
    if(!valid()){event.preventDefault();event.stopImmediatePropagation();return;}
    if(event.target.closest('#composeChooseFiles,#manifestationFiles,#attachmentFile')){event.preventDefault();event.stopImmediatePropagation();syntheticFile();evidence('files',events.get(event));}
   },{capture:true,signal:s.abort.signal});
   root.addEventListener('keydown',event=>{if(event.key==='Escape'&&s.previewed&&root.querySelector('#composeFilePreview.open'))evidence('preview',events.get(event));},{capture:true,signal:s.abort.signal});
   root.addEventListener('keyup',event=>{
    const n=event.target;
    if(![' ','Enter'].includes(event.key)||event.repeat||!n.matches('input[type=radio]')||!n.checked)return;
    evidence(n.name==='manifestationType'?n.value:n.value==='identificada'?'identified':'protected',events.get(event),()=>n.checked);
   },{signal:s.abort.signal});
   const reportValid=()=>['manifestationSubject','manifestationDescription'].every(id=>{const n=root.querySelector('#'+id);return n.checkValidity()&&n.value.trim().length>=(id==='manifestationSubject'?3:10);});
   const detailsValid=()=>root.querySelector('#composeDetails').open&&['manifestationDate','manifestationService','manifestationLocation','manifestationDesiredOutcome'].some(id=>{const n=root.querySelector('#'+id);return n.value.trim()&&n.checkValidity();});
   function fieldFinished(event){
    if(['manifestationSubject','manifestationDescription'].includes(event.target.id))evidence('report',events.get(event),reportValid);
    if(['manifestationDate','manifestationService','manifestationLocation','manifestationDesiredOutcome'].includes(event.target.id))evidence('details',events.get(event),detailsValid);
   }
   root.addEventListener('change',event=>{
    if(event.target.name==='manifestationType')evidence(event.target.value,events.get(event),()=>event.target.checked);
    if(event.target.name==='manifestationPrivacy')evidence(event.target.value==='identificada'?'identified':'protected',events.get(event),()=>event.target.checked);
    fieldFinished(event);
   },{signal:s.abort.signal});
   root.addEventListener('focusout',fieldFinished,{signal:s.abort.signal});
   root.addEventListener('click',event=>{
    const epoch=events.get(event),radio=event.target.closest('label')?.querySelector('input[type=radio]');
    if(radio)queueMicrotask(()=>evidence(radio.name==='manifestationType'?radio.value:radio.value==='identificada'?'identified':'protected',epoch,()=>radio.checked));
    if(event.target.closest('#openNewManifestation'))evidence('open',epoch);
    if(event.target.closest('[data-close-local-preview]')&&s.previewed)evidence('preview',epoch);
    if(event.target.closest('.compose-file-thumb')&&root.querySelector('#composeFilePreview.open'))s.previewed=true;
    if(event.target.closest('.compose-file-remove'))evidence('remove',epoch,()=>!root.querySelector('.compose-file-remove'));
    if(event.target.closest('[data-close-modal="newManifestationModal"]')&&s.index>=1&&s.index<=12&&!s.preparing){stop();return;}
    requestAnimationFrame(highlight);
   },{signal:s.abort.signal});
   dialog.querySelector('[data-tutorial-example]').addEventListener('click',event=>{
    if(!ready()||event.detail>1)return;
    const epoch=s.epoch;
    if(s.index===5){setValues(root,{manifestationSubject:EXAMPLE.subject,manifestationDescription:EXAMPLE.description});evidence('report',epoch,reportValid);}
    if(s.index===6){root.querySelector('#composeDetails').open=true;setValues(root,{manifestationService:'Unidade Modelo — exemplo fictício'});evidence('details',epoch,detailsValid);}
    if(s.index===14)setValues(root,{replyText:'Exemplo fictício: o mural ficava na entrada. Não reproduzo dados pessoais.'});
   });
   dialog.querySelector('[data-tutorial-back]').addEventListener('click',()=>{
    if(!valid()||s.preparing||s.index===0)return;
    cancelAnimationFrame(s.advanceFrame);s.pending=false;s.epoch++;const epoch=s.epoch;
    s.index--;dialog.querySelector('[data-tutorial-back]').disabled=true;
    prepare(s.index).then(()=>{if(valid()&&epoch===s.epoch)render();});
   });
   dialog.querySelector('[data-tutorial-pause]').addEventListener('click',()=>stop());
   dialog.querySelector('[data-tutorial-skip]').addEventListener('click',()=>{stop();status.textContent='Tutorial pulado. Nenhuma conquista foi concedida. Você pode retomar.';});
   dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab'||event.defaultPrevented||!valid())return;
    const nodes=[...dialog.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length&&getComputedStyle(n).visibility==='visible');
    const first=nodes[0],last=nodes.at(-1),active=globalThis.document.activeElement;
    if(!first)return;
    if(!dialog.contains(active)||event.shiftKey&&active===first){event.preventDefault();(event.shiftKey?last:first).focus();}
    else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
   });
   dialog.addEventListener('cancel',event=>{event.preventDefault();stop();});
   const viewport=globalThis.visualViewport;
   function fit(){if(valid()){dialog.style.setProperty('--tutorial-height',`${viewport?.height||innerHeight}px`);}}
   viewport?.addEventListener('resize',fit,{signal:s.abort.signal});viewport?.addEventListener('scroll',fit,{signal:s.abort.signal});
   globalThis.addEventListener('resize',()=>{fit();highlight();},{signal:s.abort.signal});
   await prepare(s.index);if(valid()){render();fit();}
  }catch(_){stop();status.textContent='Tutorial indisponível agora. O Canal continua disponível e seu rascunho foi preservado.';}
  finally{if(session===s||!session)starting=false;}
 }
 start.addEventListener('click',()=>{if(starting){stop();status.textContent='Preparação cancelada. Você pode retomar.';}else begin();});restart.addEventListener('click',()=>{if(!current()||session||awarding)return;completed=[];persist();status.textContent='';begin();});
 entry.querySelector('[data-tutorial-close-options]').addEventListener('click',closeOptions);
 function closeOptions(){if(starting){stop({focus:false});status.textContent='Preparação cancelada. Você pode retomar.';}entry.open=false;entry.querySelector('summary').focus({preventScroll:true});}
 const abort=new AbortController();
 globalThis.document.addEventListener('keydown',event=>{if(event.key==='Escape'&&entry.open&&!sessionActive()){event.preventDefault();closeOptions();}},{signal:abort.signal});
 function sessionActive(){return Boolean(session&&!starting);}
 globalThis.document.addEventListener('click',event=>{if(entry.open&&!session&&!entry.contains(event.target))entry.open=false;},{capture:true,signal:abort.signal});
 const invalidated=()=>{if(!current()){stop({save:false,focus:false});if(!context&&!logoutInProgress)location.replace(window.RegulationAuth.getToken()?'/cidadao/':'/login/');}};
 globalThis.addEventListener('portal:session-cleared',invalidated,{signal:abort.signal});
 globalThis.addEventListener('portal:session-ready',invalidated,{signal:abort.signal});
 globalThis.addEventListener('storage',invalidated,{signal:abort.signal});
 globalThis.document.addEventListener('click',event=>{if(event.target.closest?.('#portalLogout')){logoutInProgress=true;stop({focus:false});}},{capture:true,signal:abort.signal});
 globalThis.addEventListener('popstate',()=>stop(),{signal:abort.signal});
 globalThis.addEventListener('pagehide',()=>stop({focus:false}),{signal:abort.signal});
 let printPaused=false;
 globalThis.addEventListener('beforeprint',()=>{if(session||starting){printPaused=true;stop({focus:false});if(current())status.textContent='Tutorial pausado para imprimir. Você pode retomar.';}},{capture:true,signal:abort.signal});
 globalThis.addEventListener('afterprint',()=>{if(printPaused&&current()&&entry.isConnected)entry.querySelector('summary').focus({preventScroll:true});printPaused=false;},{signal:abort.signal});
 entryLabel();
 return {get active(){return Boolean(session)||starting;},beforeNavigate(){stop({focus:false});},deactivate(){stop({focus:false});},dispose(){disposed=true;stop({save:false,focus:false});abort.abort();entry.remove();}};
}
globalThis.PortalCitizenTutorial=Object.freeze({mount,steps:STEPS,version:VERSION,launcherVersion:3});
})();
