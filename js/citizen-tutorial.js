// No user text, files, tokens or API responses enter tutorial persistence.
(() => {
'use strict';
if (globalThis.PortalCitizenTutorial) return;
const VERSION=1;
const STEPS=Object.freeze(['open','sugestao','reclamacao','elogio','denuncia','report','details','files','preview','remove','identified','protected','send','track','reply','notice']);
const EXAMPLE={subject:'Exemplo fictício: mural com informações a apurar',description:'Exemplo inteiramente fictício: um mural da Unidade Modelo teria exposto dados pessoais inventados de usuários do serviço. Relato essa possível irregularidade para apuração, sem reproduzir esses dados. Não descreve pessoa ou atendimento real.'};
const PROTOCOL='DEMO-FICTICIO-001';
const lessons=[
 ['Comece pelo botão do Canal','Clique em Nova manifestação. Tudo nesta janela é uma demonstração: nada será enviado.','#openNewManifestation'],
 ['Sugestão: proponha uma melhoria','Selecione Sugestão. Exemplo fictício: propor placas para orientar quem chega à Unidade Modelo.','input[value="sugestao"]'],
 ['Reclamação: conte um problema','Selecione Reclamação. Exemplo fictício: a sinalização da Unidade Modelo dificultou encontrar a recepção.','input[value="reclamacao"]'],
 ['Elogio: reconheça o que foi positivo','Selecione Elogio. Exemplo fictício: agradecer à equipe da Unidade Modelo por explicar o funcionamento do serviço.','input[value="elogio"]'],
 ['Denúncia: relate fatos a apurar','Selecione Denúncia. Exemplo fictício: informar que um mural da Unidade Modelo teria exposto dados pessoais inventados, sem reproduzi-los. Diferencie o que viu do que precisa ser apurado.','input[value="denuncia"]'],
 ['Escreva um relato claro','Preencha assunto e relato com uma situação inventada, ou use o exemplo fictício. Evite CPF, Cartão SUS e outros dados pessoais.','#composeReport'],
 ['Acrescente o que souber','Abra Adicionar detalhes e preencha um campo com informação fictícia. Data, serviço, local e expectativa são opcionais no envio real.','#composeDetails'],
 ['Experimente anexar','Abra Anexar arquivos e clique em Escolher arquivos. Aqui esse botão adiciona somente uma imagem fictícia local. No portal, aceita JPG, PNG e PDF, até 5 arquivos de 5 MB.','#composeAttachments'],
 ['Confira a miniatura','Clique na miniatura para ampliar e depois feche a imagem. Uma prévia local permite revisar antes de enviar.','#manifestationFileList'],
 ['Remova o que não precisa','Use Remover anexo na imagem fictícia. No portal real, revise nomes, imagens e PDFs: eles podem revelar sua identidade.','#manifestationFileList'],
 ['Conheça a identificação','Selecione Me identificar. O Conselho vê nome, @ e função; o e-mail permanece protegido. Esta demonstração usa apenas um perfil fictício.','input[value="identificada"]'],
 ['Entenda a proteção da identidade','Selecione a opção de identidade protegida. Com e-mail confirmado, o envio é sigiloso. A opção chamada anônima em outras contas oculta o perfil ao Conselho, mas o protocolo continua ligado à conta. Isso não garante anonimato perante o sistema. Texto e arquivos também podem identificar você.','.compose-privacy'],
 ['Revise e simule o envio','Leia o aviso, marque a confirmação e use Enviar manifestação. O canal não agenda consultas ou exames e não substitui urgência. Aqui o protocolo é fictício e não há envio ou upload.','.compose-privacy'],
 ['Acompanhe pelo protocolo','Feche a janela do protocolo, se estiver aberta, e clique na manifestação fictícia em Minhas manifestações. Confira andamento, conversa e histórico.','#manifestationList'],
 ['Experimente responder','No protocolo fictício, escreva uma resposta inventada ou use o exemplo. Clique em Enviar resposta. No portal real, respostas ficam nesta conta.','#replyForm'],
 ['Confira os avisos','Feche o protocolo e clique no aviso fictício em Notificações. Abrir um aviso no portal o marca como lido; aqui somente o exemplo muda.','#notificationList']
];
function identity(user){return String(user?.id||'')+'|'+String(user?.username||'');}
function keyFor(user){return 'portal.citizen.tutorial.v1:'+encodeURIComponent(identity(user));}
function readProgress(storage,user){
 try{const p=JSON.parse(storage.getItem(keyFor(user))||'null');if(p?.version===VERSION&&Array.isArray(p.steps)&&p.steps.length<=STEPS.length&&p.steps.every((s,i)=>s===STEPS[i]))return p.steps.slice();}catch(_){}
 return [];
}
// This adapter has no reference to fetch, auth.api, storage or an endpoint.
// Even a retained handler or late Promise can only update synthetic memory.
function demoAdapter({verified,valid,onAction}){
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
   if(p==='/api/council/notifications'&&method==='PATCH'){read=true;onAction('notice');return {ok:true};}
   if(p==='/api/council/manifestations'&&method==='POST'){
    submitted=true;item.privacyMode=JSON.parse(options.body).privacyMode;onAction('send');return {manifestation:{...item}};
   }
   if(p===`/api/council/manifestations/${PROTOCOL}`&&method==='GET'){
    onAction('track');return {manifestation:{...item},messages:messages.map(m=>({...m})),events:[{type:'status_changed',fromStatus:'recebida',toStatus:'aguardando_cidadao',detail:'Histórico fictício',createdAt:item.createdAt}],attachments:[]};
   }
   if(p===`/api/council/manifestations/${PROTOCOL}/messages`&&method==='POST'){
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
 const host=document.querySelector('.portal-hero');if(!host||host.querySelector('[data-citizen-tutorial-entry]'))return;
 const token=window.RegulationAuth.getToken(),owner=identity(user),entry=globalThis.document.createElement('details');entry.dataset.citizenTutorialEntry='';entry.className='citizen-tutorial-entry';
 entry.innerHTML='<summary data-tutorial-options aria-label="Tutorial do Canal" title="Tutorial do Canal"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" focusable="false"><path d="M8 8a4 4 0 0 1 8 0c0 3-4 3-4 6"/><circle cx="12" cy="18" r="1"/></svg></span></summary><div class="tutorial-entry-panel"><button type="button" class="portal-button secondary" data-tutorial-start>Aprender usando o Canal</button><button type="button" class="portal-button secondary" data-tutorial-restart hidden>Refazer tutorial</button><button type="button" class="portal-button secondary" data-tutorial-close-options>Fechar ajuda</button><p role="status" data-tutorial-status></p></div>';
 host.append(entry);
 let completed=readProgress(window.localStorage,user),session=null,disposed=false,starting=false,awarding=false,logoutInProgress=false;
 const status=entry.querySelector('[data-tutorial-status]'),start=entry.querySelector('[data-tutorial-start]'),restart=entry.querySelector('[data-tutorial-restart]');
 const current=()=>!disposed&&!context?.disposed&&window.RegulationAuth.getToken()===token&&identity(window.RegulationAuth.getCachedUser())===owner;
 function entryLabel(){start.textContent=completed.length===STEPS.length?'Registrar conclusão do tutorial':completed.length?'Retomar tutorial':'Aprender usando o Canal';restart.hidden=!completed.length;}
 function persist(){try{window.localStorage.setItem(keyFor(user),JSON.stringify({version:VERSION,steps:completed}));}catch(_){status.textContent='Progresso disponível nesta aba; armazenamento local indisponível.';}entryLabel();}
 function stop({save=true,focus=true}={}){
  const s=session;if(!s)return;session=null;starting=false;s.valid=false;s.abort.abort();s.controllers.forEach(c=>c.dispose?.());s.dialog?.close();s.dialog?.remove();s.savedNodes?.forEach(([node,marker])=>marker.replaceWith(node));s.unlock?.();
  if(save&&current())persist();if(focus&&current()&&start.isConnected){entry.open=true;start.focus({preventScroll:true});}
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
  const s={valid:true,controllers:[],abort:new AbortController(),index:completed.length,evidence:false,preparing:true};
  session=s;
  try{
   if(!window.RegulationAuth.whenNetworkIdle)throw new Error('Abra uma nova aba do Portal para iniciar o tutorial com segurança.');
   s.unlock=lockEffects();
   status.textContent='Preparando a demonstração; aguardando ações já iniciadas. Você pode cancelar.';start.textContent='Cancelar preparação';
   let idleTimer;
   try{await Promise.race([window.RegulationAuth.whenNetworkIdle(),new Promise((_,reject)=>{idleTimer=setTimeout(()=>reject(new Error('Ações ainda em andamento')),8000);})]);}finally{clearTimeout(idleTimer);}
   if(!s.valid||session!==s||!current())return;
   const dialog=globalThis.document.createElement('dialog');s.dialog=dialog;dialog.className='citizen-tutorial';dialog.setAttribute('aria-labelledby','tutorialTitle');dialog.setAttribute('aria-describedby','tutorialExplanation');
   dialog.innerHTML='<section class="tutorial-guide"><strong class="tutorial-mode">DEMONSTRAÇÃO · sem envio</strong><p data-tutorial-progress></p><h2 id="tutorialTitle" tabindex="-1"></h2><p id="tutorialExplanation" data-tutorial-explanation></p><div class="tutorial-controls"><button type="button" class="portal-button secondary" data-tutorial-back>Voltar</button><button type="button" class="portal-button primary" data-tutorial-next disabled>Avançar</button><button type="button" class="portal-button secondary" data-tutorial-example hidden>Usar exemplo fictício</button><button type="button" class="portal-button secondary" data-tutorial-pause>Pausar</button><button type="button" class="portal-button secondary" data-tutorial-skip>Pular</button></div><p data-tutorial-feedback role="status" aria-live="polite"></p></section>';
   dialog.prepend(dialog.querySelector('.tutorial-mode'));
   const root=cloneWorkspace(document);s.root=root;dialog.append(root);
   // Keep one set of native IDs in the document, so labels and ARIA references
   // resolve to the demonstration. Detached live nodes retain drafts, files and
   // listeners; nothing is serialized or rebuilt on return.
   s.savedNodes=[];
   for(const selector of ['main','#newManifestationModal','#composeFilePreview','#manifestationDetailModal']){const node=document.querySelector(selector);if(node){const marker=globalThis.document.createComment('Tutorial preserves native component');node.before(marker);s.savedNodes.push([node,marker]);node.remove();}}
   entry.open=false;(context?.root||globalThis.document.body).append(dialog);dialog.showModal();
   const valid=()=>s.valid&&session===s&&current();
   const feedback=dialog.querySelector('[data-tutorial-feedback]'),next=dialog.querySelector('[data-tutorial-next]');
   function evidence(action){if(!valid()||s.preparing||action!==STEPS[s.index])return;s.evidence=true;next.disabled=false;feedback.textContent='Etapa praticada. Use Avançar para continuar.';}
   const adapter=demoAdapter({verified:user.emailVerified===true,valid,onAction:evidence});s.adapter=adapter;
   const localWindow=new Proxy(window,{get(target,property){if(property==='RegulationAuth')return adapter;const value=Reflect.get(target,property,target);return typeof value==='function'?value.bind(target):value;}});
   const demoContext={window:localWindow,document:scopeDocument(root,s.abort.signal),citizenDemo:{auth:adapter},addController:c=>s.controllers.push(c),get disposed(){return !valid();}};
   await initialize(demoContext);if(!valid())return;
   async function prepare(index){
    s.preparing=true;
    root.querySelector('#composeFilePreview').querySelector('[data-close-local-preview]')?.click();
    root.querySelectorAll('.citizen-modal.open').forEach(n=>n.querySelector('[data-close-modal]')?.click());
    if(index>=1&&index<=12){root.querySelector('#openNewManifestation').click();}
    if(index>=5&&index<=12){const n=root.querySelector('input[value="denuncia"]');n.checked=true;n.dispatchEvent(new Event('change',{bubbles:true}));}
    if(index>=6&&index<=12)setValues(root,{manifestationSubject:EXAMPLE.subject,manifestationDescription:EXAMPLE.description});
    if(index===7||index===8||index===9)root.querySelector('#composeAttachments').open=true;
    if(index===8||index===9)syntheticFile();
    if(index>=13){adapter.seed();root.querySelector('#refreshManifestations').click();root.querySelector('#markNotificationsRead').click();await Promise.resolve();await Promise.resolve();if(index===14)root.querySelector('[data-protocol]')?.click();}
    s.preparing=false;
   }
   function highlight(){
    if(!valid())return;
    root.querySelectorAll('[data-tutorial-target]').forEach(n=>n.removeAttribute('data-tutorial-target'));
    const target=root.querySelector('#composeFilePreview.open')||root.querySelector(lessons[s.index][2]);
    if(!target||!target.getClientRects().length){feedback.textContent='Abra ou feche a janela indicada para encontrar o componente. Seu progresso está preservado.';return;}
    const visibleTarget=target.matches('input')?target.closest('label')||target:target;
    visibleTarget.dataset.tutorialTarget='';visibleTarget.scrollIntoView({block:'nearest',behavior:'instant'});
   }
   function render(){
    s.evidence=completed[s.index]===STEPS[s.index];s.previewed=false;next.disabled=!s.evidence;feedback.textContent=s.evidence?'Etapa já praticada. Você pode revisar e avançar.':'Pratique no componente destacado para avançar.';
    const [title,text]=lessons[s.index];dialog.querySelector('#tutorialTitle').textContent=title;dialog.querySelector('[data-tutorial-explanation]').textContent=text;
    dialog.querySelector('[data-tutorial-progress]').textContent=`Etapa ${s.index+1} de ${STEPS.length}`;
    dialog.querySelector('[data-tutorial-back]').disabled=s.index===0;
    dialog.querySelector('[data-tutorial-example]').hidden=![5,6,14].includes(s.index);
    next.textContent=s.index===STEPS.length-1?'Concluir tutorial':'Avançar';
    dialog.querySelector('#tutorialTitle').focus({preventScroll:true});requestAnimationFrame(highlight);
   }
   function syntheticFile(){
    const canvas=globalThis.document.createElement('canvas');canvas.width=320;canvas.height=200;const paint=canvas.getContext('2d');paint.fillStyle='#176b8a';paint.fillRect(0,0,320,200);paint.fillStyle='#fff';paint.font='bold 24px sans-serif';paint.fillText('EXEMPLO FICTÍCIO',25,100);const bytes=Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1]),c=>c.charCodeAt(0));
    const transfer=new DataTransfer();transfer.items.add(new File([bytes],'exemplo-ficticio.png',{type:'image/png'}));
    const input=root.querySelector('#manifestationFiles');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
   }
   // The native picker/attachment handler receives only this known local file.
   root.addEventListener('click',event=>{
    if(!valid()){event.preventDefault();event.stopImmediatePropagation();return;}
    if(event.target.closest('#composeChooseFiles,#manifestationFiles,#attachmentFile')){event.preventDefault();event.stopImmediatePropagation();syntheticFile();evidence('files');}
   },{capture:true,signal:s.abort.signal});
   root.addEventListener('keydown',event=>{if(event.key==='Escape'&&s.previewed&&root.querySelector('#composeFilePreview.open'))evidence('preview');},{capture:true,signal:s.abort.signal});
   root.addEventListener('change',event=>{
    if(event.target.name==='manifestationType')evidence(event.target.value);
    if(event.target.name==='manifestationPrivacy')evidence(event.target.value==='identificada'?'identified':'protected');
   },{signal:s.abort.signal});
   root.addEventListener('input',event=>{
    if(s.index===5&&root.querySelector('#manifestationSubject').value.trim().length>=3&&root.querySelector('#manifestationDescription').value.trim().length>=10)evidence('report');
    if(s.index===6&&root.querySelector('#composeDetails').open&&['manifestationDate','manifestationService','manifestationLocation','manifestationDesiredOutcome'].includes(event.target.id)&&event.target.value.trim())evidence('details');
   },{signal:s.abort.signal});
   root.addEventListener('click',event=>{
    if(event.target.closest('#openNewManifestation'))evidence('open');
    if(event.target.closest('[data-close-local-preview]')&&s.previewed)evidence('preview');
    if(event.target.closest('.compose-file-thumb'))s.previewed=true;
    if(event.target.closest('.compose-file-remove'))evidence('remove');
    if(event.target.closest('[data-close-modal="newManifestationModal"]')&&s.index>=1&&s.index<=12&&!s.preparing){stop();return;}
    requestAnimationFrame(highlight);
   },{signal:s.abort.signal});
   dialog.querySelector('[data-tutorial-example]').addEventListener('click',()=>{
    if(s.index===5)setValues(root,{manifestationSubject:EXAMPLE.subject,manifestationDescription:EXAMPLE.description});
    if(s.index===6){root.querySelector('#composeDetails').open=true;setValues(root,{manifestationService:'Unidade Modelo — exemplo fictício'});}
    if(s.index===14)setValues(root,{replyText:'Exemplo fictício: o mural ficava na entrada. Não reproduzo dados pessoais.'});
   });
   next.addEventListener('click',()=>{
    if(!valid()||!s.evidence)return;
    if(s.index===completed.length){completed.push(STEPS[s.index]);persist();}
    if(s.index===STEPS.length-1){stop();award();return;}
    s.index++;render();
   });
   dialog.querySelector('[data-tutorial-back]').addEventListener('click',()=>{if(s.index>0){s.index--;prepare(s.index).then(()=>{if(valid())render();});}});
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
globalThis.PortalCitizenTutorial=Object.freeze({mount,steps:STEPS,version:VERSION});
})();
