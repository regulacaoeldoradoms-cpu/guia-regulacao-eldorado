// Council-only composition of the approved native shared navigation and chat.
import {mountCitizenMobileNavigation} from './citizen-mobile-navigation.js?v=20261010-mobile-shell-1';
import {mountHomeMobileDirect} from './home-mobile-direct.js?v=20261012-council-review-1';
const mobile=matchMedia('screen and (max-width:900px)'),print=matchMedia('print');
const auth=window.PortalCouncilAuth||window.RegulationAuth;
const user=await (auth?.initialUser||auth?.me({allowCached:false}).catch(()=>null));
if(user&&auth.hasCouncilAccess(user)){
 let printing=false,navigation,direct,bulk,bulkAnchor,bulkOpen=false,filters=[];
 const toolbar=document.querySelector('.council-toolbar');
 const compose=enabled=>{
  if(enabled&&!filters.length){for(const [id,title] of [['councilSearch','Buscar nas manifestações carregadas'],['councilType','Tipo'],['councilStatus','Status']]){const field=document.getElementById(id),anchor=document.createComment('Native Council filter position'),label=document.createElement('label'),copy=document.createElement('span');field.before(anchor);copy.textContent=title;label.htmlFor=id;label.append(copy,field);anchor.after(label);filters.push({field,anchor,label});}}
  else if(!enabled&&filters.length){for(const {field,anchor,label} of filters){anchor.before(field);anchor.remove();label.remove();}filters=[];}
  const batch=document.querySelector('.council-delete-toolbar');
  const help=document.querySelector('.council-page-help'),card=document.querySelector('.portal-main > .citizen-card');if(enabled&&help&&card&&help.parentNode!==card)card.append(help);
  if(enabled&&batch&&!bulk){bulkAnchor=document.createComment('Native Council selection controls');batch.before(bulkAnchor);bulk=document.createElement('details');bulk.className='council-delete-group';bulk.open=bulkOpen;const title=document.createElement('summary');title.textContent='Selecionar e excluir';bulk.append(title,batch);bulkAnchor.after(bulk);}
  else if(!enabled&&bulk){bulkOpen=bulk.open;bulkAnchor.before(batch);bulk.remove();bulkAnchor.remove();bulk=null;}
  const side=document.querySelector('.council-side'),main=document.querySelector('.council-detail-main'),status=document.getElementById('statusBox'),notes=document.getElementById('internalNotesSection'),history=document.getElementById('historySection');
  if(!enabled&&!printing&&!print.matches&&side&&status?.parentNode!==side){side.append(status,notes);}
  else if(enabled&&main&&history&&status?.parentNode!==main){main.insertBefore(status,history);history.after(notes);}
  document.body.classList.toggle('council-bulk-open',Boolean(enabled&&bulk?.open));
 };
 const sync=()=>{
  const enabled=mobile.matches&&!print.matches&&!printing;
  if(!printing&&!print.matches)document.body.classList.toggle('mobile-council-mode',enabled);compose(enabled);
  document.body.classList.toggle('citizen-readable-layout',enabled);
  navigation?.sync();direct?.refresh();
 };
 sync();direct=mountHomeMobileDirect({homeLeavesPage:true});navigation=mountCitizenMobileNavigation();sync();
 mobile.addEventListener('change',sync);print.addEventListener('change',sync);
 addEventListener('beforeprint',()=>{printing=true;sync();});addEventListener('afterprint',()=>{printing=false;sync();});
 const navSize=new ResizeObserver(()=>{const nav=document.querySelector('.social-mobile-nav'),detailNav=document.getElementById('councilMobileDetailNav');if(nav&&mobile.matches)document.body.style.setProperty('--citizen-bottom-space',`${Math.ceil(nav.getBoundingClientRect().height)+12}px`);if(detailNav&&mobile.matches)document.body.style.setProperty('--council-detail-nav-space',`${Math.ceil(detailNav.getBoundingClientRect().height)+12}px`);});
 const observe=()=>{compose(mobile.matches&&!printing&&!print.matches);const nav=document.querySelector('.social-mobile-nav'),detailNav=document.getElementById('councilMobileDetailNav');if(nav)navSize.observe(nav);if(detailNav)navSize.observe(detailNav);navigation.sync();document.body.classList.toggle('council-navigation-ready',Boolean(nav?.dataset.homeIconNavigation==='true'&&nav.contains(document.getElementById('portalChatLauncher'))));};
 new MutationObserver(observe).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});observe();
}
