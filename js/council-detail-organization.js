'use strict';
(() => {
 const modal=document.getElementById('councilDetailModal'),panel=modal?.querySelector('.citizen-modal-panel'),main=document.querySelector('#detailContent .council-detail-main'),phone=matchMedia('screen and (max-width:900px)'),print=matchMedia('print');
 if(!modal||!panel||!main)return;
 let regions=null,anchors=[],navNodes=[],buttons=[],observer=null,beforePrint=false;
 const nodes=['detailOverview','detailStory','detailAttachmentsSection','detailConversation','historySection','internalNotesSection','officialReplyForm','statusBox','internalNoteForm'].map(id=>document.getElementById(id));
 function move(node,parent){const marker=document.createComment('Native Council organization position');node.before(marker);anchors.push({node,marker});parent.append(node);}
 function region(id,label){const section=document.createElement('section');section.id=id;section.className='council-organized-region';const heading=document.createElement('h3');heading.className='council-organized-heading';heading.textContent=label;section.append(heading);return section;}
 function compose(){
  if(!phone.matches||print.matches||beforePrint){restore();return;}
  if(regions)return;
  const read=region('councilReadRegion','Manifestação'),context=region('councilContextRegion','Conversa e histórico'),actions=region('councilActionsRegion','Ações da presidência');actions.classList.add('president-only');main.prepend(read,context,actions);regions=[read,context,actions];
  for(const id of ['detailOverview','detailStory','detailAttachmentsSection'])move(document.getElementById(id),read);
  for(const id of ['detailConversation','historySection','internalNotesSection'])move(document.getElementById(id),context);
  const reply=region('councilReplyAction','Responder ao manifestante');reply.classList.add('council-organized-action');actions.append(reply);move(document.getElementById('officialReplyForm'),reply);
  move(document.getElementById('statusBox'),actions);
  const note=region('councilNoteAction','Registrar observação interna');note.classList.add('council-organized-action');actions.append(note);move(document.getElementById('internalNoteForm'),note);
  const documents=document.querySelector('.council-detail-document');if(documents)move(documents,actions);
  const nav=document.getElementById('councilMobileDetailNav');if(nav){navNodes=[...nav.childNodes];nav.replaceChildren();const label=document.createElement('span');label.className='council-organized-nav-label';label.textContent='Ir para';nav.append(label);buttons=regions.map((target,index)=>{const button=document.createElement('button');button.type='button';button.textContent=['Relato','Contexto','Ações'][index];button.dataset.councilRegion=target.id;button.addEventListener('click',()=>{target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});});nav.append(button);return button;});nav.setAttribute('aria-label','Ir para uma área da manifestação');}
  modal.dataset.councilOrganized='true';sync();
 }
 function sync(){if(!regions)return;const readonly=document.getElementById('statusBox').hidden||document.body.classList.contains('council-member-readonly');regions[2].hidden=readonly;if(buttons[2])buttons[2].hidden=readonly;document.getElementById('councilReplyAction').hidden=document.getElementById('officialReplyForm').hidden;document.getElementById('councilNoteAction').hidden=document.getElementById('internalNotesSection').hidden;}
 function restore(){if(!regions)return;for(const {node,marker}of anchors.reverse()){if(node.isConnected)marker.after(node);marker.remove();}anchors=[];for(const section of regions)section.remove();regions=null;const nav=document.getElementById('councilMobileDetailNav');if(nav){nav.replaceChildren(...navNodes);nav.setAttribute('aria-label','Atalhos da manifestação');}buttons=[];navNodes=[];delete modal.dataset.councilOrganized;}
 function init(){compose();const nav=document.getElementById('councilMobileDetailNav');if(nav)new ResizeObserver(()=>modal.style.setProperty('--council-organized-nav-height',`${Math.ceil(nav.getBoundingClientRect().height)}px`)).observe(nav);observer=new MutationObserver(sync);for(const node of nodes)if(node)observer.observe(node,{attributes:true,attributeFilter:['hidden']});}
 phone.addEventListener('change',compose);print.addEventListener('change',compose);addEventListener('beforeprint',()=>{beforePrint=true;restore();});addEventListener('afterprint',()=>{beforePrint=false;compose();});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
