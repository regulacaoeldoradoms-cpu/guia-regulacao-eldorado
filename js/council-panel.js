'use strict';

(async () => {
  const auth = window.PortalCouncilAuth || window.RegulationAuth;
  const initialToken = auth.getToken();
  const cached = auth.getCachedUser();
  // The endpoint independently authorizes this read. Only a fresh authorized
  // session below may expose its result, and a token change discards it.
  const initialList = initialToken && auth.hasCouncilAccess(cached)
    ? auth.api('/api/council/all', { method: 'GET' }).then(data => ({data}), error => ({error})) : null;
  const user = await (auth.initialUser || auth.me({ allowCached: false }).catch(() => null));
  if (!user) {
    location.replace(`/login/?next=${encodeURIComponent(location.pathname)}`);
    return;
  }
  if (!auth.hasCouncilAccess(user)) {
    location.replace(user.role === 'cidadao' ? '/cidadao/' : '/');
    return;
  }
  if (user.emailVerificationRequired) {
    const next = encodeURIComponent('/conselho/painel/');
    location.replace(`/seguranca/?verificar-email=1&next=${next}`);
    return;
  }

  const endpoint = String((window.REGULATION_AUTH_CONFIG || {}).endpoint || '').replace(/\/$/, '');
  const state = { manifestations: [], selectedProtocol: '', detail: null, page:0, nextPageToken:'', loadedPages:1, listGeneration:0, detailGeneration:0, loading:false, checkedAt:0 };
  const phone = matchMedia('screen and (max-width:900px)');
  const pageSize=20,drafts=new Map();
  const rowSignatures=new WeakMap();
  const tableContainer=document.querySelector('#councilRows').closest('table').parentElement;
  const pager=document.createElement('div');pager.id='councilPager';pager.className='council-pager';pager.hidden=true;
  pager.innerHTML='<span id="councilPageCount" role="status" aria-live="polite"></span><div><button id="councilPreviousPage" type="button">Anterior</button><button id="councilNextPage" type="button">Próxima</button></div><button id="councilLoadMore" type="button" hidden>Carregar mais manifestações</button><small id="councilListChecked"></small>';
  tableContainer.after(pager);
  const isPresident = user.councilRole === 'presidente';
  const statusLabels = {
    recebida: 'Recebida', em_analise: 'Em análise', aguardando_cidadao: 'Aguardando cidadão',
    encaminhada: 'Encaminhada', aguardando_retorno: 'Aguardando retorno', respondida: 'Respondida',
    concluida: 'Concluída', arquivada: 'Arquivada'
  };
  const typeLabels = { sugestao: 'Sugestão', reclamacao: 'Reclamação', elogio: 'Elogio', denuncia: 'Denúncia' };
  const privacyLabels = { anonima: 'Anônima', sigilosa: 'Sigilosa', identificada: 'Identificada' };

  document.getElementById('portalUserName').textContent = user.name || user.username;
  document.getElementById('portalUserRole').textContent = isPresident ? 'Presidente do Conselho' : 'Membro do Conselho';
  const councilRoleBadge = document.getElementById('councilRoleBadge');
  councilRoleBadge.classList.toggle('is-president-image', isPresident);
  if (isPresident) {
    councilRoleBadge.innerHTML = '<img class="council-role-image" src="/assets/barra-presidente-conselho-2.png?v=20260827-1" alt="Presidente do Conselho">';
    councilRoleBadge.setAttribute('aria-label', 'Presidente do Conselho');
  } else {
    councilRoleBadge.textContent = 'Membro do Conselho';
    councilRoleBadge.removeAttribute('aria-label');
  }
  document.getElementById('backHome').href = user.role === 'cidadao' ? '/cidadao/' : '/';
  document.querySelectorAll('.president-only').forEach((element) => { element.hidden = !isPresident; });

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return date.toLocaleString('pt-BR', { timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function showStatus(el, message, type = 'error') {
    el.textContent = message;
    el.className = `account-status visible ${type}`;
  }

  function openModal() {
    const modal = document.getElementById('councilDetailModal');
    if(modal.classList.contains('open'))return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if(phone.matches)modal.querySelector('[data-close-modal]')?.focus({preventScroll:true});
  }

  function closeModal() {
    rememberDraft();
    state.detailGeneration++;
    const modal = document.getElementById('councilDetailModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.querySelector(`#councilRows [data-protocol="${CSS.escape(state.selectedProtocol)}"] .council-open-detail`)?.focus({ preventScroll: true });
  }
  function rememberDraft(){
    if(!phone.matches||!state.selectedProtocol||!state.detail)return;
    drafts.set(state.selectedProtocol,{statusDetail:document.getElementById('statusDetail').value,internalNoteText:document.getElementById('internalNoteText').value,officialReply:document.getElementById('officialReply').value,status:document.getElementById('statusSelect').value!==state.detail.manifestation.status?document.getElementById('statusSelect').value:null});
  }

  function identitySummary(item) {
    if (item?.privacyMode !== 'identificada' || !item.authorIdentity) return '';
    const identity = item.authorIdentity;
    const parts = [identity.displayName];
    if (identity.handle) parts.push(`@${identity.handle}`);
    if (identity.jobTitle) parts.push(identity.jobTitle);
    else if (identity.roleLabel) parts.push(identity.roleLabel);
    return parts.filter(Boolean).join(' · ');
  }

  function filtered() {
    const query = document.getElementById('councilSearch').value.trim().toLowerCase();
    const type = document.getElementById('councilType').value;
    const status = document.getElementById('councilStatus').value;
    return state.manifestations.filter((item) => {
      if (type && item.type !== type) return false;
      if (status && item.status !== status) return false;
      if (!query) return true;
      return `${item.protocol} ${item.subject} ${item.service} ${item.description} ${item.authorLabel || ''} ${identitySummary(item)}`.toLowerCase().includes(query);
    });
  }

  function renderMetrics() {
    const items = state.manifestations;
    document.getElementById('metricTotal').textContent = String(items.length);
    const summaryCount = document.getElementById('councilSummaryCount');
    if (summaryCount) summaryCount.textContent = String(items.length);
    document.getElementById('metricNew').textContent = String(items.filter((item) => item.status === 'recebida').length);
    document.getElementById('metricAnalysis').textContent = String(items.filter((item) => item.status === 'em_analise').length);
    document.getElementById('metricWaiting').textContent = String(items.filter((item) => ['aguardando_cidadao', 'aguardando_retorno', 'encaminhada'].includes(item.status)).length);
    document.getElementById('metricDone').textContent = String(items.filter((item) => item.status === 'concluida').length);
  }

  function renderRows() {
    const rows = document.getElementById('councilRows');
    const all=filtered();state.page=Math.max(0,Math.min(state.page,Math.max(0,Math.ceil(all.length/pageSize)-1)));
    const items=phone.matches?all.slice(state.page*pageSize,(state.page+1)*pageSize):all;
    pager.hidden=!phone.matches;
    document.getElementById('councilPageCount').textContent=all.length?`${state.page*pageSize+1}–${Math.min(all.length,(state.page+1)*pageSize)} de ${all.length} encontradas · ${state.manifestations.length} carregadas`:'Nenhum resultado nos registros carregados';
    document.getElementById('councilPreviousPage').disabled=state.loading||state.page===0;
    document.getElementById('councilNextPage').disabled=state.loading||(state.page+1)*pageSize>=all.length;
    document.getElementById('councilLoadMore').hidden=!state.nextPageToken;
    document.getElementById('councilLoadMore').disabled=state.loading;
    document.getElementById('councilListChecked').textContent=state.loading?'Consultando o servidor…':state.checkedAt?`Última consulta: ${new Date(state.checkedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}${state.nextPageToken?' · Há mais registros para carregar.':''}`:'';
    if (!items.length) {
      rows.innerHTML = '<tr><td colspan="5">Nenhuma manifestação corresponde aos filtros.</td></tr>';
      return;
    }
    const existing=new Map([...rows.querySelectorAll(':scope > tr[data-protocol]')].map(row=>[row.dataset.protocol,row]));
    const next=items.map((item) => {
      const secondary = item.service || identitySummary(item) || item.authorLabel || 'Identidade protegida';
      const html=`<tr data-protocol="${escapeHtml(item.protocol)}">
      <td><strong>${escapeHtml(item.protocol)}</strong><small>${escapeHtml(formatDate(item.createdAt))}</small></td>
      <td><strong>${escapeHtml(item.subject || 'Sem assunto')}</strong><small>${escapeHtml(secondary)}</small></td>
      <td>${escapeHtml(typeLabels[item.type] || item.type)}</td>
      <td><span class="status-chip ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span></td>
      <td>${escapeHtml(formatDate(item.lastActivityAt || item.updatedAt || item.createdAt))}</td>
    </tr>`;
      const prior=existing.get(item.protocol);if(prior&&rowSignatures.get(prior)===html)return prior;
      const temporary=document.createElement('tbody');temporary.innerHTML=html;const row=temporary.firstElementChild;rowSignatures.set(row,html);return row;
    });
    let at=rows.firstChild;for(const row of next){if(row===at)at=at.nextSibling;else rows.insertBefore(row,at);}while(at){const following=at.nextSibling;at.remove();at=following;}
  }

  function preserveListPosition(){
    const row=[...document.querySelectorAll('#councilRows tr[data-protocol]')].find(n=>n.getBoundingClientRect().bottom>0);
    return {protocol:row?.dataset.protocol,top:row?.getBoundingClientRect().top,scroll:scrollY};
  }
  function restoreListPosition(anchor){if(!phone.matches||!anchor)return;requestAnimationFrame(()=>{const row=anchor.protocol&&document.querySelector(`#councilRows tr[data-protocol="${CSS.escape(anchor.protocol)}"]`);if(row)scrollBy(0,row.getBoundingClientRect().top-anchor.top);else scrollTo(0,anchor.scroll);});}
  async function loadAll(preloaded = null) {
    const generation=++state.listGeneration,anchor=preserveListPosition(),pages=state.loadedPages;
    state.loading=true;
    if(!state.manifestations.length)document.getElementById('councilRows').innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    else renderRows();
    try {
      const result = preloaded ? await preloaded : { data: await auth.api('/api/council/all', { method: 'GET' }) };
      if (auth.getToken() !== initialToken||generation!==state.listGeneration) return;
      if (result.error) throw result.error;
      const payload = result.data;
      const records=new Map((Array.isArray(payload?.manifestations)?payload.manifestations:[]).map(item=>[item.protocol,item]));
      let cursor=payload?.nextPageToken||'',loaded=1;
      while(phone.matches&&loaded<pages&&cursor){const next=await auth.api('/api/council/all?'+new URLSearchParams({pageToken:cursor}),{method:'GET'});if(auth.getToken()!==initialToken||generation!==state.listGeneration)return;for(const item of next.manifestations||[])records.set(item.protocol,item);cursor=next.nextPageToken||'';loaded++;}
      state.manifestations=[...records.values()];state.nextPageToken=cursor;state.loadedPages=loaded;state.checkedAt=Date.now();state.loading=false;
      if(phone.matches&&anchor.protocol){const index=filtered().findIndex(item=>item.protocol===anchor.protocol);if(index>=0)state.page=Math.floor(index/pageSize);}
      renderMetrics();
      renderRows();
      document.getElementById('firebaseNotice').hidden = true;
      if(anchor.protocol)restoreListPosition(anchor);
    } catch (error) {
      if(generation!==state.listGeneration||auth.getToken()!==initialToken)return;
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/seguranca/?verificar-email=1&next=${encodeURIComponent('/conselho/painel/')}`);
        return;
      }
      if (error.code === 'FIREBASE_PENDING' || error.status === 503) {
        const notice = document.getElementById('firebaseNotice');
        notice.textContent = 'O painel já está instalado, mas o projeto Firebase do Conselho ainda precisa ser conectado para começar a armazenar manifestações.';
        notice.hidden = false;
      }
      if(state.manifestations.length){const notice=document.getElementById('firebaseNotice');notice.textContent='A atualização falhou. A lista exibida é da consulta anterior. '+(error.message||'Tente novamente.');notice.hidden=false;}
      else document.getElementById('councilRows').innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || 'Não foi possível carregar as manifestações.')}</td></tr>`;
    }finally{if(generation===state.listGeneration&&auth.getToken()===initialToken){state.loading=false;if(state.manifestations.length)renderRows();}}
  }
  async function loadMore(){
    if(state.loading||!state.nextPageToken)return;
    const generation=++state.listGeneration,cursor=state.nextPageToken,anchor=preserveListPosition();state.loading=true;renderRows();
    try{const payload=await auth.api('/api/council/all?'+new URLSearchParams({pageToken:cursor}),{method:'GET'});if(auth.getToken()!==initialToken||generation!==state.listGeneration)return;
      const records=new Map(state.manifestations.map(item=>[item.protocol,item]));for(const item of payload.manifestations||[]){const prior=records.get(item.protocol);if(!prior||Date.parse(item.updatedAt||item.createdAt)>=Date.parse(prior.updatedAt||prior.createdAt))records.set(item.protocol,item);}
      state.manifestations=[...records.values()];state.nextPageToken=payload.nextPageToken||'';state.loadedPages++;renderMetrics();restoreListPosition(anchor);
    }catch(error){if(generation===state.listGeneration){const notice=document.getElementById('firebaseNotice');notice.textContent='Não foi possível carregar o próximo lote. '+error.message;notice.hidden=false;}}
    finally{if(generation===state.listGeneration&&auth.getToken()===initialToken){state.loading=false;renderRows();}}
  }
  function updateLoadedDetail(item){
    if(!item)return;const anchor=preserveListPosition();const index=state.manifestations.findIndex(row=>row.protocol===item.protocol);if(index>=0)state.manifestations[index]=item;renderMetrics();renderRows();restoreListPosition(anchor);
  }
  document.getElementById('councilPreviousPage').addEventListener('click',()=>{state.page--;renderRows();tableContainer.scrollIntoView({block:'start'});});
  document.getElementById('councilNextPage').addEventListener('click',()=>{state.page++;renderRows();tableContainer.scrollIntoView({block:'start'});});
  document.getElementById('councilLoadMore').addEventListener('click',loadMore);
  phone.addEventListener('change',renderRows);
  addEventListener('portal:session-cleared',()=>{state.listGeneration++;state.detailGeneration++;state.manifestations=[];state.detail=null;state.selectedProtocol='';drafts.clear();pager.hidden=true;document.getElementById('councilRows').innerHTML='<tr><td colspan="5">Sessão encerrada.</td></tr>';document.getElementById('detailContent').hidden=true;for(const id of ['statusDetail','officialReply','internalNoteText'])document.getElementById(id).value='';closeModal();});
  addEventListener('portal:session-ready',()=>{const fresh=auth.getCachedUser(),effectiveRole=fresh?.role==='admin'?'presidente':fresh?.councilRole;if(auth.getToken()!==initialToken||fresh?.username!==user.username||fresh?.role!==user.role||effectiveRole!==user.councilRole)location.replace(location.href);});

  function renderMessages(messages) {
    const el = document.getElementById('messageThread');
    if (!messages.length) {
      el.innerHTML = '<div class="empty-state">Ainda não há mensagens adicionais.</div>';
      return;
    }
    el.innerHTML = messages.map((message) => `<div class="thread-message ${message.senderType === 'council' ? 'council' : ''}">
      <strong>${escapeHtml(message.senderLabel || (message.senderType === 'council' ? 'Conselho Municipal de Saúde' : 'Cidadão'))} · ${escapeHtml(formatDate(message.createdAt))}</strong>
      <p>${escapeHtml(message.body)}</p>
    </div>`).join('');
  }

  function renderTimeline(events) {
    const el = document.getElementById('timeline');
    if (!events.length) {
      el.innerHTML = '<div class="empty-state">Sem movimentações registradas.</div>';
      return;
    }
    el.innerHTML = events.map((event) => {
      let title = event.detail || event.type;
      if (event.type === 'status_changed') title = `Andamento: ${statusLabels[event.fromStatus] || event.fromStatus} → ${statusLabels[event.toStatus] || event.toStatus}${event.detail ? ` · ${event.detail}` : ''}`;
      return `<div class="timeline-item"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(formatDate(event.createdAt))}${event.actorLabel ? ` · ${escapeHtml(event.actorLabel)}` : ''}</small></div>`;
    }).join('');
  }

  function renderNotes(notes) {
    const el = document.getElementById('internalNotes');
    if (!notes.length) {
      el.innerHTML = '<div style="font-size:.82rem;color:#708596;margin-bottom:10px">Nenhuma observação interna.</div>';
      return;
    }
    el.innerHTML = notes.map((note) => `<div class="internal-note"><strong>${escapeHtml(note.authorLabel || 'Conselho')} · ${escapeHtml(formatDate(note.createdAt))}</strong><p>${escapeHtml(note.body)}</p></div>`).join('');
  }

  function attachmentIcon() {
    return '<span class="attachment-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 12.5l6.7-6.7a3 3 0 0 1 4.3 4.2l-8.6 8.6a5 5 0 0 1-7.1-7.1l8-8"/></svg></span>';
  }

  function renderAttachments(items) {
    const list = document.getElementById('attachmentList');
    if (!items.length) {
      list.innerHTML = '<span style="color:#73889a;font-size:.84rem">Nenhum anexo.</span>';
      return;
    }
    list.innerHTML = items.map((item) => `<button class="attachment-link" type="button" data-attachment="${escapeHtml(item.id)}">${attachmentIcon()}${escapeHtml(item.displayName || 'Anexo')}</button>`).join('');
  }

  async function openDetail(protocol) {
    rememberDraft();const generation=++state.detailGeneration;
    state.selectedProtocol = protocol;
    state.detail = null;
    openModal();
    document.getElementById('detailLoading').hidden = false;
    document.getElementById('detailLoading').textContent = 'Carregando...';
    document.getElementById('detailContent').hidden = true;
    try {
      const payload = await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}`, { method: 'GET' });
      if(generation!==state.detailGeneration||auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      state.detail = payload;
      const item = payload.manifestation;
      const identity = identitySummary(item);
      document.getElementById('detailProtocol').textContent = item.protocol;
      document.getElementById('detailMeta').textContent = `${typeLabels[item.type] || item.type} · ${formatDate(item.createdAt)} · ${item.authorLabel || 'Identidade protegida'}`;
      const chip = document.getElementById('detailStatus');
      chip.textContent = statusLabels[item.status] || item.status;
      chip.className = `status-chip ${item.status}`;
      const privacyChip = document.getElementById('detailPrivacy');
      privacyChip.textContent = privacyLabels[item.privacyMode] || item.privacyMode || 'Privacidade não informada';
      privacyChip.classList.toggle('identified', item.privacyMode === 'identificada');
      const identityChip = document.getElementById('detailIdentity');
      identityChip.textContent = identity || 'Identidade protegida';
      identityChip.classList.toggle('identified', Boolean(identity));
      document.getElementById('detailSubject').textContent = item.subject || '';
      document.getElementById('detailService').textContent = item.service ? `Serviço/unidade informado: ${item.service}` : 'Serviço/unidade não informado.';
      document.getElementById('detailDescription').textContent = item.description || '';
      document.getElementById('statusSelect').value = item.status || 'recebida';
      document.getElementById('statusDetail').value = '';
      const draft=phone.matches&&drafts.get(protocol);
      for(const id of ['internalNoteText','officialReply'])document.getElementById(id).value=draft?.[id]||'';
      if(draft){document.getElementById('statusDetail').value=draft.statusDetail;if(draft.status)document.getElementById('statusSelect').value=draft.status;}
      renderMessages(payload.messages || []);
      renderTimeline(payload.events || []);
      renderNotes(payload.internalNotes || []);
      renderAttachments(payload.attachments || []);
      document.getElementById('detailLoading').hidden = true;
      document.getElementById('detailContent').hidden = false;
      if(phone.matches)updateLoadedDetail(item);
    } catch (error) {
      if(generation!==state.detailGeneration||auth.getToken()!==initialToken)return;
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') {
        location.replace(error.verificationPath || `/seguranca/?verificar-email=1&next=${encodeURIComponent('/conselho/painel/')}`);
        return;
      }
      document.getElementById('detailLoading').textContent = error.message || 'Não foi possível abrir a manifestação.';
    }
  }

  document.getElementById('councilRows').addEventListener('click', (event) => {
    const row = event.target.closest('[data-protocol]');
    if (row) openDetail(row.dataset.protocol);
  });
  ['councilSearch', 'councilType', 'councilStatus'].forEach((id) => document.getElementById(id).addEventListener(id === 'councilSearch' ? 'input' : 'change', ()=>{state.page=0;renderRows();}));
  document.getElementById('refreshCouncil').addEventListener('click', () => loadAll());
  document.querySelector('[data-close-modal]').addEventListener('click', closeModal);
  document.getElementById('councilDetailModal').addEventListener('click', (event) => { if (event.target.id === 'councilDetailModal') closeModal(); });

  document.getElementById('internalNoteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.selectedProtocol) return;
    const status = document.getElementById('internalNoteStatus');
    const protocol=state.selectedProtocol,body=document.getElementById('internalNoteText').value;
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}/internal-notes`, {
        method: 'POST', body: JSON.stringify({ body })
      });
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      if(document.getElementById('internalNoteText').value===body)document.getElementById('internalNoteText').value = '';
      showStatus(status, 'Observação interna registrada.', 'success');
      await openDetail(protocol);
    } catch (error) {
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/seguranca/?verificar-email=1');
      showStatus(status, error.message || 'Não foi possível registrar.', 'error');
    }
  });

  document.getElementById('saveStatus').addEventListener('click', async () => {
    if (!isPresident || !state.selectedProtocol) return;
    const statusEl = document.getElementById('statusUpdateMessage');
    const protocol=state.selectedProtocol,button=document.getElementById('saveStatus');if(button.disabled)return;button.disabled=true;
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}`, {
        method: 'PATCH', body: JSON.stringify({ status: document.getElementById('statusSelect').value, detail: document.getElementById('statusDetail').value })
      });
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      showStatus(statusEl, 'Andamento atualizado.', 'success');
      await Promise.all([openDetail(protocol), ...(!phone.matches?[loadAll()]:[])]);
    } catch (error) {
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/seguranca/?verificar-email=1');
      showStatus(statusEl, error.message || 'Não foi possível atualizar.', 'error');
    }finally{button.disabled=false;}
  });

  document.getElementById('officialReplyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isPresident || !state.selectedProtocol) return;
    const button = document.getElementById('officialReplyButton');
    const statusEl = document.getElementById('officialReplyStatus');
    const protocol=state.selectedProtocol,body=document.getElementById('officialReply').value;
    button.disabled = true;
    try {
      await auth.api(`/api/council/manifestations/${encodeURIComponent(protocol)}/messages`, {
        method: 'POST', body: JSON.stringify({ body })
      });
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      if(document.getElementById('officialReply').value===body)document.getElementById('officialReply').value = '';
      showStatus(statusEl, 'Resposta enviada ao cidadão.', 'success');
      await Promise.all([openDetail(protocol), ...(!phone.matches?[loadAll()]:[])]);
    } catch (error) {
      if(auth.getToken()!==initialToken||state.selectedProtocol!==protocol)return;
      if (error.code === 'EMAIL_VERIFICATION_REQUIRED') return location.replace(error.verificationPath || '/seguranca/?verificar-email=1');
      showStatus(statusEl, error.message || 'Não foi possível enviar.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('attachmentList').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-attachment]');
    if (!button || !state.selectedProtocol) return;
    button.disabled = true;
    try {
      const response = await fetch(`${endpoint}/api/council/manifestations/${encodeURIComponent(state.selectedProtocol)}/attachments/${encodeURIComponent(button.dataset.attachment)}`, {
        headers: auth.authorizationHeader(), cache: 'no-store'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (payload.code === 'EMAIL_VERIFICATION_REQUIRED') {
          location.replace(payload.verificationPath || '/seguranca/?verificar-email=1');
          return;
        }
        throw new Error(payload.error || 'Não foi possível abrir o anexo.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      window.alert(error.message || 'Não foi possível abrir o anexo.');
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('portalLogout').addEventListener('click', async () => {
    await auth.logout();
    location.replace('/login/');
  });

  await loadAll(initialList);
})();
