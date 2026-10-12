'use strict';
(() => {
 const modal=document.getElementById('councilDetailModal'),panel=modal.querySelector('.citizen-modal-panel'),media=matchMedia('screen and (max-width:900px)'),printing=matchMedia('print');
 const actions=document.querySelector('.council-export-actions'),attachments=document.getElementById('detailAttachmentsSection'),anchor=document.createComment('Native Council document position');
 actions.before(anchor);let documentGroup=null;
 function syncCopy(){const conversation=document.querySelector('#councilMobileDetailNav [data-council-scroll="detailConversation"]');const reply=document.getElementById('officialReplyForm');const label=media.matches&&!printing.matches&&!beforePrint&&!reply.hidden?'Responder':'Conversa';if(conversation&&conversation.textContent!==label)conversation.textContent=label;const button=document.querySelector('#councilMobileDetailNav [data-council-scroll="statusBox"]');const text=media.matches&&!printing.matches&&!beforePrint?'Status':'Andamento';if(button&&button.textContent!==text)button.textContent=text;}
 const compose=()=>{
  syncCopy();
  if(!media.matches||printing.matches||beforePrint)document.body.classList.remove('council-detail-editing');
  if(media.matches&&!printing.matches&&!beforePrint&&!documentGroup){documentGroup=document.createElement('details');documentGroup.className='council-detail-document president-only';documentGroup.hidden=actions.hidden;const title=document.createElement('summary');title.textContent='Salvar documento';documentGroup.append(title,actions);anchor.after(documentGroup);}
  else if((!media.matches||printing.matches||beforePrint)&&documentGroup){anchor.after(actions);documentGroup.remove();documentGroup=null;}
 };
 let beforePrint=false;
 media.addEventListener('change',compose);printing.addEventListener('change',compose);
 addEventListener('beforeprint',()=>{beforePrint=true;compose();});addEventListener('afterprint',()=>{beforePrint=false;compose();});compose();
 new MutationObserver(syncCopy).observe(panel,{childList:true,subtree:true});
 const head=modal.querySelector('.citizen-modal-head');
 const headerSize=()=>{modal.toggleAttribute('data-tall-header',parseFloat(getComputedStyle(document.getElementById('detailProtocol')).fontSize)>24||head.getBoundingClientRect().height>140);};
 new ResizeObserver(headerSize).observe(head);headerSize();
 const viewport=()=>{if(media.matches)document.body.style.setProperty('--council-detail-viewport',`${Math.round(window.visualViewport?.height||innerHeight)}px`);};
 window.visualViewport?.addEventListener('resize',viewport);addEventListener('resize',viewport);viewport();
 const editing=()=>{document.body.classList.toggle('council-detail-editing',media.matches&&!printing.matches&&!beforePrint&&modal.classList.contains('open')&&modal.contains(document.activeElement)&&Boolean(document.activeElement.closest('#officialReplyForm,#internalNoteForm,#statusBox'))&&document.activeElement.matches('input,textarea,select,button'));};
 modal.addEventListener('focusin',editing);modal.addEventListener('focusout',()=>setTimeout(editing,0));new MutationObserver(editing).observe(modal,{attributes:true,attributeFilter:['class']});
 modal.addEventListener('click',event=>{
  const button=event.target.closest('[data-council-scroll="detailConversation"]'),reply=document.getElementById('officialReplyForm');
  if(button&&media.matches&&!printing.matches&&!reply.hidden&&!document.getElementById('detailContent').hidden){event.stopPropagation();reply.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});document.querySelectorAll('#councilMobileDetailNav button').forEach(node=>node.classList.toggle('is-active',node===button));}
 },true);
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();modal.querySelector('[data-close-modal]').click();}
  if(event.key!=='Tab')return;
  const controls=[...panel.querySelectorAll('button,a[href],input,select,textarea,summary,[tabindex="0"]')].filter(node=>!node.disabled&&node.getClientRects().length>0);
  const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
})();
