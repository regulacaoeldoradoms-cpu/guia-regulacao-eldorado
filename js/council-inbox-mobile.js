'use strict';
(() => {
 const phone=matchMedia('screen and (max-width:900px)'),print=matchMedia('print'),body=document.body,main=document.querySelector('.portal-main'),card=main?.querySelector(':scope > .citizen-card'),toolbar=document.querySelector('.council-toolbar'),user=document.querySelector('.portal-user');
 if(!main||!card||!toolbar||!user)return;
 let active=false,printing=false,moves=[],texts=[],owned=[],ui=null,queued=false;
 const rememberText=(node,value)=>{if(!node||node.textContent===value)return;texts.push({node,children:[...node.childNodes]});node.textContent=value;};
 const move=(node,parent,before=null)=>{if(!node||node.parentNode===parent)return;const anchor=document.createComment('Native Council inbox position');node.before(anchor);moves.push({node,anchor});parent.insertBefore(node,before);};
 const element=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const own=n=>(owned.push(n),n);
 function compose(){
  const enabled=phone.matches&&!print.matches&&!printing&&body.classList.contains('council-navigation-ready')&&body.classList.contains('mobile-council-mode');
  if(!enabled){restore();return;}
  if(active){sync();return;}
  if(!document.getElementById('councilPageCount')||!document.getElementById('councilSearch')?.closest('label'))return;
  active=true;body.dataset.councilInbox='true';
  const head=card.querySelector('.citizen-card-head'),caption=own(element('div','council-inbox-caption')),count=element('span','council-inbox-count');count.setAttribute('aria-hidden','true');head.append(caption);
  move(document.getElementById('councilRoleBadge'),caption);const badge=document.getElementById('councilRoleBadge');let role=null;if(badge.classList.contains('is-president-image')){role=own(element('span','council-inbox-role','Presidência'));role.setAttribute('aria-hidden','true');badge.append(role);}caption.append(count);
  const search=document.getElementById('councilSearch'),searchLabel=search.closest('label');if(searchLabel){searchLabel.classList.add('council-inbox-search');rememberText(searchLabel.querySelector('span'),'Buscar manifestações');}
  const originalPlaceholder=search.getAttribute('placeholder');search.placeholder='Buscar manifestações';
  const controls=own(element('div','council-inbox-controls'));toolbar.append(controls);
  const filters=element('details','council-inbox-filters'),filterSummary=element('summary',null,'Filtros'),filterFields=element('div','council-inbox-filter-fields');filters.append(filterSummary,filterFields);controls.append(filters);
  for(const id of ['councilType','councilStatus']){const select=document.getElementById(id),label=select.closest('label');if(label)move(label,filterFields);}
  const clear=element('button','council-inbox-clear','Limpar filtros');clear.type='button';clear.hidden=true;filterFields.append(clear);
  clear.addEventListener('click',()=>{for(const id of ['councilSearch','councilType','councilStatus'])document.getElementById(id).value='';search.dispatchEvent(new Event('input',{bubbles:true}));sync();search.focus();});
  const bulk=document.querySelector('.council-delete-group');let bulkTitle=null;if(bulk){move(bulk,controls);bulkTitle=bulk.querySelector('summary');rememberText(bulkTitle,'Selecionar');}
  const more=element('details','council-inbox-more'),moreTitle=element('summary',null,'Mais'),morePanel=element('div','council-inbox-more-panel');more.append(moreTitle,morePanel);controls.append(more);
  move(document.getElementById('councilSummary'),morePanel);move(document.querySelector('.council-page-help'),morePanel);move(document.getElementById('councilListChecked'),morePanel);
  const pageCount=document.getElementById('councilPageCount');move(pageCount,caption);pageCount.classList.add('council-inbox-live-count');
  const account=own(element('details','council-inbox-account')),accountTitle=element('summary',null,'Conta'),accountPanel=element('div','council-inbox-account-panel');account.append(accountTitle,accountPanel);for(const child of [...user.children])move(child,accountPanel);user.append(account);
  const brandNote=document.querySelector('.portal-brand p');rememberText(brandNote,'Eldorado/MS');
  ui={controls,count,filters,filterSummary,clear,bulk,bulkTitle,more,account,accountPanel,search,originalPlaceholder,pageCount};
  sync();body.removeAttribute('data-council-inbox-pending');body.removeAttribute('data-council-inbox-fallback');
 }
 function sync(){
  if(!active||!phone.matches||print.matches||printing)return;
  const latestBulk=document.querySelector('.council-delete-group');if(latestBulk&&latestBulk!==ui.bulk){ui.bulk=latestBulk;move(latestBulk,ui.controls,ui.more);ui.bulkTitle=latestBulk.querySelector('summary');rememberText(ui.bulkTitle,'Selecionar');}
  const query=ui.search.value.trim(),type=document.getElementById('councilType').value,status=document.getElementById('councilStatus').value,activeFilters=Number(Boolean(query))+Number(Boolean(type))+Number(Boolean(status));
  const filterText=activeFilters?`Filtros · ${activeFilters}`:'Filtros';if(ui.filterSummary.textContent!==filterText)ui.filterSummary.textContent=filterText;if(ui.clear.hidden!==!activeFilters)ui.clear.hidden=!activeFilters;
  const raw=ui.pageCount.textContent,loaded=document.getElementById('metricTotal').textContent||'0',matched=raw.match(/ de (\d+) encontradas/)?.[1]||(raw.startsWith('Nenhum')?'0':loaded);
  const countText=activeFilters?`${matched} ${matched==='1'?'resultado':'resultados'} · ${loaded} carregadas`:`${loaded} ${loaded==='1'?'carregada':'carregadas'}`;if(ui.count.textContent!==countText)ui.count.textContent=countText;
  const pager=document.getElementById('councilPager'),prev=document.getElementById('councilPreviousPage'),next=document.getElementById('councilNextPage');if(pager&&prev&&next){pager.classList.toggle('council-inbox-single-page',prev.disabled&&next.disabled);let presentation=pager.querySelector('.council-inbox-page-range');if(!presentation){presentation=element('span','council-inbox-page-range');pager.prepend(presentation);}const range=raw.match(/^(\d+–\d+ de \d+)/)?.[1]||'';if(presentation.textContent!==range)presentation.textContent=range;}
  if(ui.bulkTitle){const selected=document.getElementById('councilSelectedCount')?.textContent.match(/^(\d+)/)?.[1];const title=selected?`Selecionar · ${selected}`:'Selecionar';if(ui.bulkTitle.textContent!==title)ui.bulkTitle.textContent=title;}
  for(const child of [...user.children])if(child!==ui.account)move(child,ui.accountPanel);
  for(const select of document.querySelectorAll('.council-inbox-filter-fields select')){const label=select.closest('label');let value=label.querySelector('.council-inbox-filter-value');if(!value){value=element('span','council-inbox-filter-value');label.append(value);}const text=select.selectedOptions[0]?.textContent||'';if(value.textContent!==text)value.textContent=text;if(value.hidden!==!select.value)value.hidden=!select.value;}
 }
 function restore(){
  if(!active)return;active=false;delete body.dataset.councilInbox;
  for(const {node,anchor}of moves.reverse()){if(node.isConnected&&anchor.isConnected)anchor.after(node);anchor.remove();}moves=[];
  for(const {node,children}of texts.reverse())if(node.isConnected)node.replaceChildren(...children);texts=[];
  ui.search.setAttribute('placeholder',ui.originalPlaceholder);ui.search.closest('label')?.classList.remove('council-inbox-search');ui.pageCount.classList.remove('council-inbox-live-count');
  document.querySelectorAll('.council-inbox-filter-value,.council-inbox-page-range').forEach(n=>n.remove());document.getElementById('councilPager')?.classList.remove('council-inbox-single-page');
  for(const n of owned)n.remove();owned=[];ui=null;
 }
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;compose();});}
 phone.addEventListener('change',compose);print.addEventListener('change',compose);addEventListener('beforeprint',()=>{printing=true;restore();});addEventListener('afterprint',()=>{printing=false;compose();});
 const init=()=>{new MutationObserver(schedule).observe(body,{attributes:true,attributeFilter:['class']});new MutationObserver(schedule).observe(main,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','disabled']});new MutationObserver(schedule).observe(user,{childList:true});for(const id of ['councilSearch','councilType','councilStatus'])document.getElementById(id)?.addEventListener(id==='councilSearch'?'input':'change',schedule);document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.council-inbox-account[open],.council-inbox-more[open],.council-inbox-filters[open]').forEach(n=>{const containsFocus=n.contains(document.activeElement);n.open=false;if(containsFocus)n.querySelector(':scope>summary').focus();});});compose();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
