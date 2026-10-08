'use strict';

(() => {
  if (window.PortalChatGroups) return;
  let host, groups = [], active = null, disposed = false, generation = 0, connected = false;
  let refreshTimer, refreshPending, refreshAgain = false, lastRefresh = 0, filter = 'all';
  const drafts = new Map(), delivered = new Map(), groupAvatars = new Map();
  const avatarQueue = []; let avatarLoading = 0;
  const avatarKey = item => item.username ? item.id + ':' + item.username : item.id;
  function withAvatar(group) {
    const cached = groupAvatars.get(avatarKey(group));
    return { ...group, avatarDataUrl: group.avatarAvailable && cached?.version === group.avatarVersion ? cached.data || '' : '' };
  }
  function queueAvatars(items = groups) {
    if (disposed) return;
    for (const group of items) {
      const key = avatarKey(group);
      if (!group.avatarAvailable || groupAvatars.get(key)?.version === group.avatarVersion) continue;
      const record = { version: group.avatarVersion, data: '' };
      groupAvatars.set(key, record); avatarQueue.push({ id: group.id, username: group.username, key, record });
    }
    while (!disposed && avatarLoading < 3 && avatarQueue.length) {
      const task = avatarQueue.shift();
      if (groupAvatars.get(task.key) !== task.record) continue;
      avatarLoading++;
      request('/' + task.id + (task.username ? '/member-avatar?username=' + encodeURIComponent(task.username) : '/avatar')).then(payload => {
        if (disposed || groupAvatars.get(task.key) !== task.record) return;
        if (payload.avatarVersion !== task.record.version) { groupAvatars.delete(task.key); return; }
        task.record.data = payload.avatarDataUrl || '';
        if (task.username) {
          if (active?.id === task.id) {
            const avatar = [...($('portalGroupSheet')?.querySelectorAll('[data-member-avatar]') || [])].find(node => node.dataset.memberAvatar === task.username);
            if (avatar) avatar.innerHTML = host.avatarMarkup({name:avatar.dataset.memberName,avatarDataUrl:task.record.data});
          }
          return;
        }
        groups = groups.map(withAvatar);
        if (active?.id === task.id) { active.group = withAvatar(active.group); updateHeader(); }
        renderList();
      }).catch(() => {
        if (groupAvatars.get(task.key) === task.record) groupAvatars.delete(task.key);
      }).finally(() => { avatarLoading--; queueAvatars([]); });
    }
  }
  function clearAvatars() { groupAvatars.clear(); avatarQueue.length = 0; }
  let lastSync = 0, sheetGeneration = 0, availabilityGeneration = 0;
  function disableGroups() {
    availabilityGeneration++;
    if (active) host.stopDirect(); else closeSheet();
    groups = []; drafts.clear(); delivered.clear(); clearAvatars(); filter = 'all';
    renderList(); $('portalGroupTabs').hidden = true; $('portalChatGroupsSection').hidden = true;
  }
  function roleLabel(member) {
    const role = member.accountRole || member.senderRole || member.role;
    const labels = { cidadao: 'Cidadão', medico: 'Médico(a)', recepcao: 'Recepção', coordenacao: 'Coordenação', telemedicina: 'Técnico em Telemedicina', admin: 'Desenvolvedor' };
    return member.jobTitle && member.jobTitle !== role ? member.jobTitle : labels[role] || '';
  }
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uuid = () => 'group-' + crypto.randomUUID();
  const isVisible = () => Boolean(active && !document.hidden && host.root.classList.contains('open') && !$('portalGroupSheet')?.classList.contains('visible'));
  const groupIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/></svg>';
  async function request(path = '', options = {}) {
    const controller = new AbortController(), timer = setTimeout(()=>controller.abort(),15000);
    try { return await host.api('/api/chat/groups'+path,{...options,signal:controller.signal}); }
    catch (error) { if (error.code === 'GROUP_DISABLED' && !disposed) disableGroups(); throw error; }
    finally { clearTimeout(timer); }
  }
  const post = (path,body={}) => request(path,{method:'POST',body:JSON.stringify(body)});
  function errorText(error) { return error?.name==='AbortError'?'A conexão demorou. Tente novamente.':error?.message || 'Não foi possível concluir. Tente novamente.'; }
  function report(error) { if (!disposed) host.showStatus(errorText(error)); }
  function applyFilter() {
    if (!$('portalGroupTabs')) return;
    host.root.dataset.groupFilter = filter;
    $('portalChatList').hidden=filter==='groups'; $('portalChatGroupsSection').hidden=filter==='people';
    $('portalGroupTabs').querySelectorAll('[data-group-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.groupFilter===filter)));
  }
  function renderList() {
    if (!host || disposed) return;
    const term=String($('portalChatSearch')?.value||'').toLocaleLowerCase('pt-BR');
    const visible=groups.filter(group=>group.name.toLocaleLowerCase('pt-BR').includes(term));
    $('portalChatGroupsList').innerHTML=visible.length?visible.map(group=>`<button type="button" class="portal-chat-contact portal-group-row" data-group-open="${esc(group.id)}">
      <span class="portal-chat-avatar" aria-hidden="true">${host.avatarMarkup(group)}</span><span class="portal-chat-contact-main"><strong>${esc(group.name)}</strong><small>${group.closed?'Encerrado':group.state==='invited'?'Convite para participar':`${group.memberCount} participante(s)`}${group.muted?' · Silenciado':''}</small></span>
      ${group.state==='invited'?'<span class="portal-chat-unread">Convite</span>':group.unread?`<span class="portal-chat-unread">${Math.min(99,group.unread)}${group.unread>99?'+':''}</span>`:''}</button>`).join(''):'<p class="portal-group-empty">Nenhum grupo por aqui.</p>';
    applyFilter(); host.updateLauncher();
  }
  function updateHeader() {
    if (!active) return;
    $('portalChatHeaderName').textContent=active.group.name;
    $('portalChatHeaderStatus').textContent=active.group.closed?'Grupo encerrado':'Grupo privado · somente participantes';
    $('portalChatHeaderAvatar').hidden=false;
    $('portalChatHeaderAvatar').innerHTML=host.avatarMarkup(active.group);
    $('portalChatHeaderAvatar')._portalChatMarkup = ''; // The direct header must redraw its own photo.
    $('portalChatProfileLink').hidden=true; $('portalChatBack').hidden=false;
    $('portalGroupInfo').hidden=false;
    $('portalGroupInput').disabled=Boolean(active.group.closed);
    $('portalGroupSend').disabled=Boolean(active.group.closed);
  }
  function closeSheet() {
    const sheet=$('portalGroupSheet'); if (!sheet) return;
    sheetGeneration++; sheet.classList.remove('visible'); sheet.replaceChildren();
    if (active) { $('portalGroupInput')?.focus(); void acknowledge(); }
  }
  function sheet(title,html) {
    const container=$('portalGroupSheet'); sheetGeneration++;
    container.dataset.sheetGeneration = String(sheetGeneration);
    container.innerHTML=`<header><strong>${esc(title)}</strong><button type="button" data-group-sheet-close aria-label="Fechar detalhes">×</button></header><div class="portal-group-sheet-body">${html}</div>`;
    container.classList.add('visible');
    container.querySelector('[data-group-sheet-close]').onclick=closeSheet;
    container.querySelector('input,button,textarea')?.focus();
    return container;
  }
  function toggleEmojis(force) {
    const picker=$('portalGroupEmojis'), button=$('portalGroupEmojiButton');
    if (!picker || !button) return;
    picker.hidden = typeof force === 'boolean' ? !force : !picker.hidden;
    button.setAttribute('aria-expanded', String(!picker.hidden));
  }
  function close() {
    toggleEmojis(false);
    if (!host) return;
    if (active) drafts.set(active.id,$('portalGroupInput')?.value||'');
    generation++; active=null; closeSheet();
    $('portalChatGroupView')?.classList.remove('active');
    if ($('portalGroupInfo')) $('portalGroupInfo').hidden=true;
    $('portalGroupMessages')?.replaceChildren();
    if ($('portalGroupInput')) $('portalGroupInput').value='';
    host.root.classList.remove('group-open');
  }
  function messageNode(message) {
    const mine=message.fromUser===host.user.username;
    const element=document.createElement('div'); element.className='portal-chat-message '+(mine?'mine':'theirs');
    element.dataset.groupMessage=message.id || message.clientId;
    element.dataset.sentAt=message.sentAt;
    const author=document.createElement('div'); author.className='portal-group-author';
    author.innerHTML=`<span class="portal-chat-avatar" aria-hidden="true">${host.avatarMarkup({name:message.senderName||message.fromUser,avatarDataUrl:message.avatarDataUrl})}</span><span></span>`;
    author.lastElementChild.textContent=mine?'Você':message.senderName||message.fromUser;
    const text=document.createElement('div'); text.className='portal-chat-message-text'; text.textContent=message.body;
    const footer=document.createElement('div'); footer.className='portal-chat-message-time'; footer.textContent=host.formatTime(message.sentAt);
    if (mine) {
      const action=document.createElement('button'); action.type='button'; action.className='portal-group-message-info';
      action.textContent=message.pending?'Enviando…':message.failed?'Reenviar':'Informações';
      action.disabled=Boolean(message.pending);
      action.onclick=()=>message.failed?transmit(message):showReceipts(message.id);
      footer.appendChild(action);
    }
    element.append(author,text,footer); return element;
  }
  function renderMessages(older = false) {
    if (!active) return;
    const box=$('portalGroupMessages'), oldHeight=box.scrollHeight,oldTop=box.scrollTop;
    const atBottom=oldHeight-oldTop-box.clientHeight<90;
    const sorted=[...active.messages.values()].sort((a,b)=>a.id&&b.id?a.id-b.id:a.id?-1:b.id?1:a.order-b.order);
    const existing=new Map([...box.querySelectorAll('[data-group-message]')].map(el=>[el.dataset.groupMessage,el]));
    box.querySelectorAll('.portal-chat-date-divider,.portal-chat-unread-divider,.portal-group-empty').forEach(el=>el.remove());
    let day='',boundary=false;
    for (const message of sorted) {
      const key=String(message.id||message.clientId);
      let node=existing.get(key);
      const sendState = message.pending ? 'pending' : message.failed ? 'failed' : 'sent';
      if (!node || node.dataset.sendState !== sendState || node._groupAvatar !== (message.avatarDataUrl || '') || node._groupSender !== (message.senderName || '')) {
        const replacement=messageNode(message); if(node)node.replaceWith(replacement); node=replacement;
        node.dataset.sendState = sendState; node._groupAvatar = message.avatarDataUrl || ''; node._groupSender = message.senderName || '';
      }
      box.appendChild(node); existing.delete(key);
      const date=host.parseServerDate(message.sentAt),label=host.messageDayLabel(date);
      if(day!==label){const divider=document.createElement('div');divider.className='portal-chat-date-divider';divider.setAttribute('role','separator');const span=document.createElement('span');span.textContent=label;divider.appendChild(span);box.insertBefore(divider,node);day=label;}
      if(!boundary&&active.boundary&&message.id>=active.boundary){const mark=document.createElement('div');mark.className='portal-chat-unread-divider';mark.textContent='Novas mensagens';box.insertBefore(mark,node);boundary=true;}
    }
    for(const node of existing.values())node.remove();
    if(!sorted.length){const empty=document.createElement('p');empty.className='portal-group-empty';empty.textContent='Envie a primeira mensagem. O histórico começa na sua entrada no grupo.';box.appendChild(empty);}
    $('portalGroupOlder').hidden=!active.hasOlder;
    if(older)box.scrollTop=oldTop+box.scrollHeight-oldHeight;else if(atBottom)box.scrollTop=box.scrollHeight;
    if(isVisible())void acknowledge();
  }
  async function acknowledge() {
    const state=active;
    if (!state || !isVisible() || state.ackPending) return;
    const through=state.cursor;
    if(!through||through<=state.readThrough)return;
    state.ackPending=true;
    try {
      await post('/'+state.id+'/receipt',{kind:'read',throughId:through});
      if(active!==state)return;
      state.readThrough=through;
      const item=groups.find(g=>g.id===state.id);if(item){item.unread=0;renderList();}
    } catch(error){if(active===state)report(error);}
    finally {state.ackPending=false;if(active===state&&isVisible()&&state.readThrough>=through&&state.cursor>through)void acknowledge();}
  }
  async function sync(older = false) {
    const state=active,version=generation;
    if(!state || (state.loading&&!older)) {if(state)state.again=true;return;}
    if(state.loading)return;
    state.loading=true; lastSync=Date.now();
    try {
      const ids=[...state.messages.values()].map(m=>m.id).filter(Boolean);
      const before=older&&ids.length?Math.min(...ids):0;
      const payload=await request('/'+state.id+'/messages?'+(before?'before='+before:'after='+state.cursor));
      if(version!==generation||active!==state||disposed)return;
      if(!Array.isArray(payload.messages)||!payload.group)throw Error('O servidor ainda não confirmou o grupo.');
      state.group=withAvatar({...state.group,...payload.group}); queueAvatars([state.group]); updateHeader();
      const senderPhotos=new Map((payload.senders||[]).map(sender=>[sender.username,sender.avatarDataUrl||'']));
      for(const message of payload.messages){if(message.clientId)state.messages.delete(message.clientId);state.messages.set(message.id,{...message,avatarDataUrl:senderPhotos.get(message.fromUser)||''});}
      if(before||!state.cursor)state.hasOlder=payload.messages.length>=payload.pageSize;
      if(!before)state.cursor=Math.max(state.cursor,...payload.messages.map(m=>m.id),0);
      renderMessages(older);
      if(!before&&payload.messages.length>=payload.pageSize)state.again=true;
    } catch(error) {
      if(active!==state||disposed)return;
      if([403,404].includes(error.status)){host.stopDirect();void refresh();}report(error);
    } finally {
      state.loading=false;
      if(state.again&&active===state&&!disposed){state.again=false;void sync();}
    }
  }
  async function open(id) {
    const known=groups.find(g=>g.id===id);if(!known)return;
    if(known.state==='invited'){
      const popup=sheet('Convite para grupo',`<h3>${esc(known.name)}</h3><p>${esc(known.description)}</p><p>Ao aceitar, seu nome e sua foto serão vistos pelos participantes. Você verá mensagens enviadas após sua entrada.</p><div class="portal-group-actions"><button type="button" data-accept ${known.closed?'disabled':''}>Aceitar convite</button><button type="button" data-decline>Recusar</button></div>`);
      for(const action of ['accept','decline'])popup.querySelector('[data-'+action+']').onclick=async event=>{
        event.target.disabled=true;try{await post('/'+id+'/'+action);closeSheet();await refresh(true);if(action==='accept')void open(id);}catch(error){report(error);event.target.disabled=false;}
      };return;
    }
    host.stopDirect(); host.root.classList.add('open','group-open');
    $('portalChatContactsView').classList.remove('active');$('portalChatConversationView').classList.remove('active');$('portalChatGroupView').classList.add('active');
    active={id,group:known,messages:new Map(),cursor:0,hasOlder:false,readThrough:0,boundary:known.firstUnreadId||0,loading:false,again:false};
    $('portalGroupInput').value=drafts.get(id)||'';updateHeader();await sync();$('portalGroupInput')?.focus();
  }
  async function transmit(message) {
    const state=active;if(!state||message.pending)return;
    message.pending=true;message.failed=false;renderMessages();
    try {
      const payload=await post('/'+state.id+'/messages',{body:message.body,clientId:message.clientId});
      if(active!==state||disposed)return;
      if(!payload.message?.id)throw Error('O servidor não confirmou o envio.');
      state.messages.delete(message.clientId);state.messages.set(payload.message.id,{...message,...payload.message,pending:false,failed:false});renderMessages();
    } catch(error){if(active!==state||disposed||!state.messages.has(message.clientId))return;message.pending=false;message.failed=true;renderMessages();report(error);}
  }
  function send() {
    if(!active||active.group.closed)return;
    const input=$('portalGroupInput'),text=input.value.trim();if(!text)return; toggleEmojis(false);
    const message={clientId:uuid(),body:text,fromUser:host.user.username,senderName:host.user.name,avatarDataUrl:host.user.avatarDataUrl || '',sentAt:new Date().toISOString(),order:Date.now()};
    active.messages.set(message.clientId,message);input.value='';drafts.delete(active.id);void transmit(message);input.focus();
  }
  async function photo(file) {
    if(!file)return '';
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5000000)throw Error('Escolha uma foto JPG, PNG ou WebP de até 5 MB.');
    const image=await createImageBitmap(file);
    try {const canvas=document.createElement('canvas');canvas.width=canvas.height=160;const ctx=canvas.getContext('2d');const side=Math.min(image.width,image.height);ctx.drawImage(image,(image.width-side)/2,(image.height-side)/2,side,side,0,0,160,160);return canvas.toDataURL('image/jpeg',0.82);}finally{image.close();}
  }
  async function form(kind) {
    const state=active,id=kind==='create'?'':state?.id;if(kind!=='create'&&!id)return;
    const editing=kind==='edit',clientId=uuid(),version=generation;
    const popup=sheet(kind==='create'?'Novo grupo':editing?'Editar grupo':'Convidar participantes',`<p class="portal-group-help">Somente amigos aceitos do criador original podem ser convidados.</p><form id="portalGroupForm">
      ${kind!=='invite'?`<label>Nome do grupo<input name="name" maxlength="80" required value="${esc(editing?state.group.name:'')}"></label><label>Descrição<textarea name="description" maxlength="500">${esc(editing?state.group.description:'')}</textarea></label><label>Foto do grupo<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"></label>`:''}
      ${!editing?'<input type="search" placeholder="Buscar amigo" aria-label="Buscar amigo" data-friend-search><div class="portal-group-friends">Carregando amigos…</div>':''}
      <p class="portal-group-form-error" role="alert"></p><button type="submit" ${editing?'':'disabled'}>${editing?'Salvar alterações':kind==='create'?'Criar e convidar':'Enviar convites'}</button></form>`);
    const dialogVersion=sheetGeneration;
    const element=popup.querySelector('form'),submit=element.querySelector('[type=submit]'),status=element.querySelector('[role=alert]');
    if(!editing){
      try {const payload=await request('/friends'+(id?'?groupId='+encodeURIComponent(id):''));if(version!==generation||dialogVersion!==sheetGeneration||!element.isConnected)return;
        const friends=payload.friends||[];element.querySelector('.portal-group-friends').innerHTML=friends.length?friends.map(friend=>`<label class="portal-group-friend"><input type="checkbox" name="members" value="${esc(friend.username)}"><span class="portal-chat-avatar" aria-hidden="true">${host.avatarMarkup(friend)}</span><span>${esc(friend.name||friend.username)}</span></label>`).join(''):'<p>Nenhum amigo elegível. Adicione amigos em <a href="/amigos/">Amigos</a> antes de convidar.</p>';
        element.querySelector('[data-friend-search]').oninput=event=>{const term=event.target.value.toLowerCase();element.querySelectorAll('.portal-group-friend').forEach(label=>label.hidden=!label.textContent.toLowerCase().includes(term));};
        submit.disabled=!friends.length;
      }catch(error){status.textContent=errorText(error);}
    }
    element.onsubmit=async event=>{
      event.preventDefault();submit.disabled=true;status.textContent='';
      try {
        const data=new FormData(element),invited=data.getAll('members');
        if(!editing&&(!invited.length||invited.length>19))throw Error('Selecione de 1 a 19 amigos.');
        const value=kind==='invite'?{members:invited}:{name:String(data.get('name')),description:String(data.get('description')),...(data.get('photo')?.size?{avatarDataUrl:await photo(data.get('photo'))}:!editing?{avatarDataUrl:''}:{}),...(!editing?{members:invited,clientId}:{})};
        if (!element.isConnected || disposed || dialogVersion !== sheetGeneration) return;
        const payload=await post(kind==='create'?'':'/'+id+(editing?'/settings':'/invite'),value);
        if(kind==='create'&&!payload.group?.id)throw Error('O servidor não confirmou a criação.');
        if(!element.isConnected||disposed||dialogVersion!==sheetGeneration)return;
        closeSheet();await refresh(true);if(kind==='create')void open(payload.group.id);else if(editing)void sync();
      }catch(error){if(element.isConnected){status.textContent=errorText(error);submit.disabled=false;}}
    };
  }
  async function showReceipts(messageId) {
    const state=active;if(!state)return;
    const popup=sheet('Informações da mensagem','<p>Conferindo recebimento e visualização…</p>'), dialogVersion=sheetGeneration;
    try {const payload=await request('/'+state.id+'/info?messageId='+messageId);if(active!==state||disposed||dialogVersion!==sheetGeneration||!popup.classList.contains('visible'))return;
      popup.querySelector('.portal-group-sheet-body').innerHTML=payload.receipts?.length?payload.receipts.map(item=>`<p><strong>${esc(item.name||item.username)}</strong><br>${item.viewed?'Visualizada':item.delivered?'Recebida no chat':'Aguardando recebimento'}</p>`).join(''):'<p>Nenhum outro participante havia entrado no momento do envio.</p>';
    }catch(error){report(error);}
  }
  async function showInfo() {
    const state=active;if(!state)return;
    const popup=sheet('Dados do grupo','<p>Carregando participantes…</p>'), dialogVersion=sheetGeneration;
    try{
      const payload=await request('/'+state.id);if(active!==state||disposed||dialogVersion!==sheetGeneration||!popup.classList.contains('visible'))return;
      state.group=withAvatar({...state.group,...payload.group});queueAvatars([state.group]);const admin=['owner','admin'].includes(state.group.role)&&!state.group.closed;
      popup.querySelector('.portal-group-sheet-body').innerHTML=`<h3>${esc(state.group.name)}</h3><p>${esc(state.group.description)}</p><p class="portal-group-help">Criador original: ${esc(state.group.creatorUsername)}. Fazer parte deste grupo não cria amizades nem libera outras ferramentas.</p>
        <div class="portal-group-actions">${admin?'<button data-action="edit">Editar</button><button data-action="invite">Convidar amigos do criador</button>':''}<button data-action="mute">${state.group.muted?'Ativar avisos':'Silenciar'}</button></div>
        <h4>${admin?'Participantes e convites':'Participantes'}</h4>${payload.members.map(member=>`<div class="portal-group-member"><span class="portal-chat-avatar" data-member-avatar="${esc(member.username)}" data-member-name="${esc(member.name||member.username)}" aria-hidden="true">${host.avatarMarkup(withAvatar({...member,id:state.id}))}</span><span><strong>${esc(member.name||member.username)}</strong><small>${esc(roleLabel(member))} · ${member.state==='invited'?'Convidado':member.role==='owner'?'Criador':member.role==='admin'?'Administrador':'Participante'}</small></span>
          ${admin&&member.username!==host.user.username&&member.username!==state.group.creatorUsername&&(state.group.creatorUsername===host.user.username||member.role==='member')?`<div class="portal-group-member-actions"><button data-member="${esc(member.username)}" data-member-action="remove">Remover</button>${member.state==='member'?`<button data-member="${esc(member.username)}" data-member-action="${member.role==='admin'?'demote':'promote'}">${member.role==='admin'?'Retirar admin':'Tornar admin'}</button>`:''}</div>`:''}</div>`).join('')}
        <div class="portal-group-actions"><button data-action="leave">Sair do grupo</button>${admin?'<button data-action="close">Encerrar grupo</button>':''}</div>`;
      queueAvatars(payload.members.map(member=>({...member,id:state.id})));
      popup.querySelectorAll('[data-action]').forEach(button=>button.onclick=async()=>{
        const action=button.dataset.action;if(['edit','invite'].includes(action))return form(action);
        if(action!=='mute'&&!window.confirm(action==='leave'?(state.group.creatorUsername===host.user.username?'Sair deste grupo? Seu acesso ao histórico será encerrado. Nesta versão, a saída do criador é definitiva; os outros administradores continuam gerenciando o grupo.':'Sair deste grupo? Seu acesso ao histórico será encerrado.'):'Encerrar o grupo para novas mensagens e convites?'))return;
        button.disabled=true;
        try{await post('/'+state.id+'/'+(action==='mute'?'settings':action),action==='mute'?{muted:!state.group.muted}:{});if(dialogVersion===sheetGeneration)closeSheet();if(action==='leave'&&active===state)host.stopDirect();await refresh(true);}catch(error){report(error);button.disabled=false;}
      });
      popup.querySelectorAll('[data-member-action]').forEach(button=>button.onclick=async()=>{
        if(!window.confirm('Confirmar alteração deste participante?'))return;
        button.disabled=true;try{await post('/'+state.id+'/members',{username:button.dataset.member,action:button.dataset.memberAction});if(dialogVersion===sheetGeneration&&active===state)void showInfo();await refresh(true);}catch(error){report(error);button.disabled=false;}
      });
    }catch(error){report(error);}
  }
  async function refresh(force = false) {
    if(!host||disposed)return;
    if(refreshPending){refreshAgain=true;return refreshPending;}
    if(!force&&Date.now()-lastRefresh<2000)return;
    const version=availabilityGeneration;
    refreshPending=(async()=>{
      try{
        const payload=await request();if(disposed||version!==availabilityGeneration)return;
        if(payload.enabled!==true||payload.protocol!=='groups-v1'){
          disableGroups(); return;
        }
        groups=(Array.isArray(payload.groups)?payload.groups:[]).map(withAvatar);
        for (const id of groupAvatars.keys()) if (!groups.some(group=>group.id===id.split(':')[0])) groupAvatars.delete(id);
        lastRefresh=Date.now();$('portalGroupTabs').hidden=false;renderList();queueAvatars();
        if(active&&!groups.some(g=>g.id===active.id&&g.state==='member'))host.stopDirect();
        if(active&&!document.hidden)await sync();
        if(!document.hidden&&host.root.classList.contains('open')){
          // Panel delivery is separate from reading a particular group. No content preload.
          await Promise.allSettled(groups.filter(g=>g.state==='member'&&g.lastId>Number(delivered.get(g.id)||0)&&g.id!==active?.id).map(g=>post('/'+g.id+'/receipt',{kind:'delivered',throughId:g.lastId}).then(()=>delivered.set(g.id,g.lastId))));
        }
      }catch(error){if(disposed)return;if([403,404].includes(error.status)){groups=[];if(active)host.stopDirect();renderList();}if(host.root.classList.contains('open'))report(error);}
      finally {refreshPending=null;if(refreshAgain&&!disposed){refreshAgain=false;void refresh(true);}}
    })();return refreshPending;
  }
  function mount(options) {
    if(host)return;host=options;
    const tabs=document.createElement('div');tabs.id='portalGroupTabs';tabs.className='portal-group-tabs';tabs.hidden=true;
    tabs.innerHTML='<div role="group" aria-label="Filtrar conversas"><button data-group-filter="all" aria-pressed="true">Todos</button><button data-group-filter="people" aria-pressed="false">Pessoas</button><button data-group-filter="groups" aria-pressed="false">Grupos</button></div><button type="button" id="portalGroupCreate">'+groupIcon+' Novo grupo</button>';
    $('portalChatSearch').closest('.portal-chat-search-wrap').prepend(tabs);
    const section=document.createElement('section');section.id='portalChatGroupsSection';section.className='portal-group-list-section';section.hidden=true;section.innerHTML='<h3>Grupos</h3><div id="portalChatGroupsList"></div>';
    $('portalChatContactsView').insertBefore(section,$('portalChatList'));
    const view=document.createElement('div');view.id='portalChatGroupView';view.className='portal-chat-view portal-chat-conversation';
    view.innerHTML='<button type="button" id="portalGroupOlder" class="portal-group-older" hidden>Carregar mensagens anteriores</button><div class="portal-chat-messages" id="portalGroupMessages" role="log" aria-label="Mensagens do grupo"></div><div class="portal-chat-composer"><div class="portal-chat-tools"><button type="button" id="portalGroupEmojiButton" class="portal-chat-tool-button" aria-expanded="false" aria-controls="portalGroupEmojis">Emoticons</button></div><div id="portalGroupEmojis" class="portal-chat-emoji-picker" role="group" aria-label="Escolher emoticon" hidden></div><div class="portal-chat-compose"><textarea id="portalGroupInput" class="portal-chat-input" maxlength="2000" rows="1" placeholder="Mensagem para o grupo" aria-label="Mensagem para o grupo"></textarea><button type="button" id="portalGroupSend" class="portal-chat-send">Enviar</button></div><div class="portal-chat-note">Grupo privado. Não compartilhe dados de pacientes ou documentos assistenciais.</div></div>';
    host.root.querySelector('.portal-chat-body').appendChild(view);
    const info=document.createElement('button');info.id='portalGroupInfo';info.type='button';info.className='portal-chat-profile-link portal-group-info';info.textContent='Dados do grupo';info.hidden=true;$('portalChatHeaderName').parentElement.appendChild(info);
    const popup=document.createElement('section');popup.id='portalGroupSheet';popup.className='portal-group-sheet';popup.setAttribute('role','dialog');popup.setAttribute('aria-label','Gerenciar grupo');popup.setAttribute('aria-modal','true');host.root.querySelector('.portal-chat-panel').appendChild(popup);
    tabs.querySelectorAll('[data-group-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.groupFilter;applyFilter();});
    $('portalGroupCreate').onclick=()=>form('create');info.onclick=showInfo;
    $('portalChatGroupsList').onclick=event=>{const button=event.target.closest('[data-group-open]');if(button)void open(button.dataset.groupOpen);};
    $('portalGroupEmojis').innerHTML=host.emojis.map((emoji,index)=>'<button class="portal-chat-emoji" type="button" data-group-emoji="'+index+'" aria-label="Inserir '+emoji+'">'+emoji+'</button>').join('');
    $('portalGroupEmojiButton').innerHTML=host.smileIcon+'<span>Emoticons</span>';
    $('portalGroupEmojiButton').onclick=()=>toggleEmojis();
    $('portalGroupEmojis').onclick=event=>{
      const button=event.target.closest('[data-group-emoji]'); if(!button)return;
      const input=$('portalGroupInput'), emoji=host.emojis[Number(button.dataset.groupEmoji)]; if(!emoji||input.disabled)return;
      input.setRangeText(emoji,input.selectionStart,input.selectionEnd,'end');input.focus();
    };
    host.root.addEventListener('click', event=>{if(!event.target.closest('#portalGroupEmojis,#portalGroupEmojiButton'))toggleEmojis(false);});
    $('portalGroupInput').addEventListener('keydown',event=>{if(event.key==='Escape')toggleEmojis(false);});
    $('portalGroupSend').onclick=send;$('portalGroupInput').onkeydown=event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send();}};
    $('portalGroupOlder').onclick=()=>sync(true);$('portalChatSearch').addEventListener('input',renderList);
    $('portalChatLauncher').addEventListener('click',()=>{void refresh(true);});
    popup.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeSheet();}if(event.key==='Tab'){const items=[...popup.querySelectorAll('button,input,textarea,a')].filter(el=>!el.disabled&&!el.hidden);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){void refresh(true);}});
    window.addEventListener('online',()=>{void refresh(true);});
    window.addEventListener('portal:session-cleared',()=>{disposed=true;generation++;clearInterval(refreshTimer);close();groups=[];drafts.clear();delivered.clear();clearAvatars();section.replaceChildren();tabs.remove();popup.remove();});
    refreshTimer=setInterval(()=>{if(!disposed&&!document.hidden){if(active&&host.root.classList.contains('open')&&Date.now()-lastSync>(connected?30000:4400))void sync();if(Date.now()-lastRefresh>(connected?120000:30000))void refresh();}},4500);
    void refresh(true);
  }
  window.PortalChatGroups=Object.freeze({mount,close,renderList,
    count:()=>groups.reduce((n,g)=>n+(g.state==='invited'?1:Number(g.unread||0)),0),
    connection:value=>{connected=Boolean(value);if(host&&connected)void refresh(true);},
    event:()=>{if(!document.hidden)void refresh(true);}
  });
})();
