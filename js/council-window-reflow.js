'use strict';
(() => {
 const modal=document.getElementById('councilDetailModal'),panel=modal?.querySelector('.citizen-modal-panel'),content=panel?.querySelector('.citizen-modal-content'),phone=matchMedia('screen and (max-width:900px)'),print=matchMedia('print');
 if(!panel||!content)return;
 let moved=[],printing=false,openHeight=null,keyboardReduced=false;
 function move(node,before,parent){if(!node)return;const anchor=document.createComment('Native Council window position');node.before(anchor);moved.push({node,anchor});parent.insertBefore(node,before);}
 function viewport(){
  if(!modal.hasAttribute('data-council-window-reflow'))return;
  const vp=window.visualViewport,top=vp?.offsetTop||0,height=vp?.height||innerHeight,bottom=top+height;
  let dock=0;for(const nav of document.querySelectorAll('.social-mobile-nav')){const r=nav.getBoundingClientRect();if(r.width&&r.height&&r.top<bottom&&r.bottom>top&&r.bottom>=bottom-20)dock=Math.max(dock,bottom-r.top+8);}
  const typing=modal.contains(document.activeElement)&&document.activeElement.matches('input,textarea,select');
  if(openHeight!==null){if(height>=openHeight-80)keyboardReduced=false;else if(typing)keyboardReduced=true;else if(!keyboardReduced)openHeight=height;}
  modal.toggleAttribute('data-council-window-small',keyboardReduced);modal.style.setProperty('--council-window-top',`${top}px`);modal.style.setProperty('--council-window-height',`${Math.max(104,height-dock)}px`);
 }
 function compose(){
  const enabled=phone.matches&&!print.matches&&!printing;
  if(enabled&&!moved.length){const nav=document.getElementById('councilMobileDetailNav');move(nav,content,panel);move(document.getElementById('detailMeta'),document.getElementById('detailOverview').firstChild,document.getElementById('detailOverview'));modal.dataset.councilWindowReflow='true';}
  else if(!enabled&&moved.length){for(const {node,anchor}of moved.reverse()){anchor.after(node);anchor.remove();}moved=[];delete modal.dataset.councilWindowReflow;delete modal.dataset.councilWindowSmall;openHeight=null;keyboardReduced=false;modal.style.removeProperty('--council-window-top');modal.style.removeProperty('--council-window-height');}
  viewport();
 }
 phone.addEventListener('change',compose);print.addEventListener('change',compose);addEventListener('beforeprint',()=>{printing=true;compose();});addEventListener('afterprint',()=>{printing=false;compose();});
 addEventListener('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);
 const dockObserver=new ResizeObserver(viewport),observed=new WeakSet();
 const layout=()=>{if(!phone.matches||print.matches||printing)return;if(modal.classList.contains('open')){if(openHeight===null)openHeight=window.visualViewport?.height||innerHeight;}else{openHeight=null;keyboardReduced=false;}for(const nav of document.querySelectorAll('.social-mobile-nav'))if(!observed.has(nav)){observed.add(nav);dockObserver.observe(nav);}viewport();};
 const init=()=>{compose();layout();new MutationObserver(layout).observe(modal,{attributes:true,attributeFilter:['class']});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
