'use strict';
const INSTANCE=Symbol.for('portal.citizenMobilePresentation');
export function prepareCitizenMobilePresentation(root){
  const key=Symbol.for('portal.citizenMobileEarlyCopies');
  const originals=window[key] ||= new Map();
  for(const [selector,text] of [
    ['.portal-hero h2','Canal do Cidadão'],
    ['.portal-hero-copy > p','Participe e acompanhe suas manifestações.'],
    ['#openNewManifestation strong','Nova manifestação'],
    ['#openNewManifestation > span:not(.icon) > span','Sugestão, reclamação, elogio ou denúncia.']
  ]){const node=root.querySelector(selector);if(node){if(!originals.has(node))originals.set(node,node.dataset.citizenNativeText ? [document.createTextNode(node.dataset.citizenNativeText)] : [...node.childNodes]);node.textContent=text;}}
}
export function mountCitizenMobilePresentation(){
  const area=window.PortalCitizenShell?.active();
  const root=area?.root || document;
  if(window[INSTANCE]){
    if(window[INSTANCE].root===root){window[INSTANCE].sync();return window[INSTANCE];}
    window[INSTANCE].dispose?.();
  }
  if(!root.querySelector('#manifestationsCard'))return null;
  const media=matchMedia('screen and (max-width: 900px)'),print=matchMedia('print');
  const copies=new Map();let bound=false,mobile=false,queued=false,printing=false,disposed=false;
  let notice,marker,help;
  const compose=root.querySelector('#newManifestationModal');
  function composeViewport(active){
    if(!compose)return;
    if(active){
      compose.style.setProperty('--compose-viewport-height',`${window.visualViewport?.height || innerHeight}px`);
      compose.style.setProperty('--compose-viewport-top',`${window.visualViewport?.offsetTop || 0}px`);
    }else{compose.style.removeProperty('--compose-viewport-height');compose.style.removeProperty('--compose-viewport-top');}
  }
  const path=()=>window.PortalCitizenShell?.active()?.url.pathname || location.pathname;
  function bind(){
    if(bound)return true;
    if(!root.querySelector('.citizen-mobile-tabs'))return false;
    for(const [selector,text] of [
      ['.portal-hero h2','Canal do Cidadão'],
      ['.portal-hero-copy > p','Participe e acompanhe suas manifestações.'],
      ['#openNewManifestation strong','Nova manifestação'],
      ['#openNewManifestation > span:not(.icon) > span','Sugestão, reclamação, elogio ou denúncia.'],
      ['.citizen-mobile-tab[data-tab="manifestations"] > span','Meus envios'],
      ['.citizen-mobile-tab[data-tab="notifications"] > span','Avisos'],
      ['#newManifestationModal .citizen-modal-head h2','Escrever ao Conselho'],
      ['#newManifestationModal .citizen-modal-head small','Conte o que aconteceu. Campos opcionais podem ficar em branco.'],
      ['#newManifestationModal .form-section:nth-of-type(1) h3','Tipo de mensagem'],
      ['#newManifestationModal .form-section:nth-of-type(1) .form-section-head p','Escolha uma opção.'],
      ['#newManifestationModal .form-section:nth-of-type(2) h3','Onde e quando'],
      ['#newManifestationModal .form-section:nth-of-type(2) .form-section-head p','Informe o que souber. Estes campos são opcionais.'],
      ['#newManifestationModal .form-section:nth-of-type(3) h3','O que aconteceu?'],
      ['#newManifestationModal .form-section:nth-of-type(3) .form-section-head p','Escreva os detalhes que ajudam o Conselho a entender o assunto.']
    ]){const node=root.querySelector(selector);if(node && !(selector.startsWith('#newManifestationModal') && compose?.hasAttribute('data-compose-refinement')))copies.set(node,{text,original:window[Symbol.for('portal.citizenMobileEarlyCopies')]?.get(node) || [...node.childNodes]});}
    notice=root.querySelector('#accountEvolutionNotice');
    if(notice){
      marker=document.createComment('Original account explanation position');notice.before(marker);
      help=document.createElement('details');help.className='citizen-account-help';
      const summary=document.createElement('summary');summary.textContent='Sobre sua conta e privacidade';help.append(summary);
    }
    bound=true;return true;
  }
  function sync(){
    if(disposed)return;
    queued=false;
    const eligible=path()==='/cidadao/' && media.matches && !printing && !print.matches;
    const active=eligible && bind();
    const early=eligible && document.body.classList.contains('citizen-first-paint');
    document.body.classList.toggle('citizen-mobile-presentation',Boolean(active || early));
    if(active){
      if(document.body.classList.contains('shared-mobile-header'))document.body.classList.remove('citizen-first-paint');
      for(const [node,{text}] of copies)if(node.textContent!==text)node.textContent=text;
      if(help){
        if(!help.isConnected)root.querySelector('.citizen-grid').after(help);
        if(notice.parentNode!==help)help.append(notice);
        const hidden=notice.hidden || !notice.textContent.trim();if(help.hidden!==hidden)help.hidden=hidden;
      }
    }else if(mobile){
      for(const [node,{original}] of copies)node.replaceChildren(...original);
      if(help){marker.parentNode.insertBefore(notice,marker.nextSibling);help.remove();}
    }
    composeViewport(Boolean(active));
    mobile=Boolean(active);
  }
  function schedule(){if(!disposed&&!queued){queued=true;queueMicrotask(sync);}}
  const observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  media.addEventListener('change',sync);print.addEventListener('change',sync);
  const viewportChanged=()=>{sync();const focused=document.activeElement;if(mobile&&compose?.classList.contains('open')&&compose.contains(focused)&&focused?.matches('input,select,textarea'))requestAnimationFrame(()=>focused.scrollIntoView({block:'nearest',inline:'nearest'}));};
  window.visualViewport?.addEventListener('resize',viewportChanged);window.visualViewport?.addEventListener('scroll',viewportChanged);
  const beforePrint=()=>{printing=true;sync();},afterPrint=()=>{printing=false;sync();};
  window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);
  window.addEventListener('portal:citizen-route',sync);
  const controller=Object.freeze({root,sync,dispose(){
    if(disposed)return;disposed=true;observer.disconnect();
    media.removeEventListener('change',sync);print.removeEventListener('change',sync);
    window.visualViewport?.removeEventListener('resize',viewportChanged);window.visualViewport?.removeEventListener('scroll',viewportChanged);
    window.removeEventListener('beforeprint',beforePrint);window.removeEventListener('afterprint',afterPrint);window.removeEventListener('portal:citizen-route',sync);
    const originals=window[Symbol.for('portal.citizenMobileEarlyCopies')];
    for(const node of copies.keys())originals?.delete(node);
    copies.clear();help?.remove();
    if(window[INSTANCE]===controller)delete window[INSTANCE];
  }});
  area?.addController?.(controller);window[INSTANCE]=controller;sync();return controller;
}
