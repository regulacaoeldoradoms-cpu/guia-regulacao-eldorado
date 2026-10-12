// Presentation only: the existing page retains every control, listener and pet rule.
const controllers = new WeakMap();
export function mountPetsMobilePresentation(root = document) {
 const page=root.querySelector('.pet-page');if(!page)return null;if(controllers.has(page))return controllers.get(page);
 const screen=matchMedia('screen and (max-width:900px)'),print=matchMedia('print');
 const originalOrder=[...page.childNodes],wrappers=[],gallery=page.querySelector('#petGallery').closest('section'),settings=page.querySelector('#petSettings'),life=page.querySelector('#petLifeStatus'),home=page.querySelector('#petHome'),homeOrder=[...home.childNodes];
 const intro=page.querySelector('header > p:not(.pet-eyebrow):not(.pet-mobile-intro)');
 const brand=document.querySelector('.portal-topbar .portal-brand');
 const brandStyle=brand?.getAttribute('style');
 // A direct Mascotes document has a plain native brand. Prepare the same
 // shared header nodes once; retain its untouched desktop/print copy.
 let nativeBrand=null,phoneBrand=null;
 if(brand&&!brand.querySelector('h1')){
  nativeBrand=[...brand.childNodes];const logo=document.createElement('img'),copy=document.createElement('div'),title=document.createElement('h1'),subtitle=document.createElement('p');
  logo.className='portal-symbol';logo.alt='Símbolo do Portal da Regulação de Saúde';copy.className='portal-brand-copy';title.textContent='Portal da regulação';subtitle.textContent='Eldorado/MS';copy.append(title,subtitle);phoneBrand=[logo,copy];
 }
 let mobile=false,printing=false,living=null,introMarker;
 function disclosure(target,title,all){
  const marker=document.createComment('Native pet information position'),details=document.createElement('details'),summary=document.createElement('summary');
  summary.textContent=title;details.className='pet-mobile-disclosure';details.append(summary);
  const nodes=all?[...target.childNodes]:[target];
  if(all){target.prepend(marker);target.append(details);}else{target.before(marker);marker.after(details);}
  for(const node of nodes)details.append(node);
  const row={marker,details,nodes};wrappers.push(row);return details;
 }
 function sync(){
  const active=screen.matches&&!print.matches&&!printing;
  if(nativeBrand){
   if(active){brand.style.textDecoration='none';brand.style.color='inherit';if(!brand.contains(phoneBrand[0])){phoneBrand[0].src='/assets/portal-regulacao-header_180x180.png?v=20260911-1';brand.replaceChildren(...phoneBrand);}}
   else {if(brand.contains(phoneBrand[0]))brand.replaceChildren(...nativeBrand);if(brandStyle===null)brand.removeAttribute('style');else brand.setAttribute('style',brandStyle);}
  }
  if(active&&!mobile){
   const gal=disclosure(gallery,'Galeria · adoção',true);gal.classList.add('pet-gallery-disclosure');gal.open=living===false;
   introMarker=document.createComment('Native pet introduction position');intro.before(introMarker);gal.querySelector('summary').after(intro);
   disclosure(settings,'Preferências e expediente',true);
   const rules=disclosure(life,'Como funcionam as vidas e os cuidados',false);rules.classList.add('pet-life-disclosure');rules.open=living===false;
   home.append(page.querySelector('#petHabitat'),page.querySelector('#petNeeds'),page.querySelector('.pet-actions'),page.querySelector('#petWallet'),page.querySelector('#petAchievement'),rules);
   if(living===false)home.before(gallery);else page.querySelector('#petShop').after(gallery);
   page.dataset.petMobileReady='true';
  }else if(!active&&mobile){
   introMarker.before(intro);introMarker.remove();
   for(const {marker,details,nodes} of wrappers){for(const node of nodes)marker.before(node);details.remove();marker.remove();}
   wrappers.length=0;const careTarget=home.querySelector('#petCareTarget');home.replaceChildren(...homeOrder);if(careTarget)home.querySelector('h2').after(careTarget);page.replaceChildren(...originalOrder);delete page.dataset.petMobileReady;
  }
  mobile=active;
 }
 const controller={sync,state(state){const next=Boolean(state.pet&&state.life?.deadAt==null);if(next!==living){living=next;page.dataset.petAdoptionAvailable=String(!living);const rules=page.querySelector('.pet-life-disclosure');if(rules)rules.open=!living;const gal=page.querySelector('.pet-gallery-disclosure');if(gal){gal.open=!living;if(living)page.querySelector('#petShop').after(gallery);else home.before(gallery);}}},dispose(){printing=true;sync();screen.removeEventListener('change',sync);print.removeEventListener('change',sync);window.removeEventListener('beforeprint',before);window.removeEventListener('afterprint',after);controllers.delete(page);}};
 const before=()=>{printing=true;sync();},after=()=>{printing=false;sync();};
 screen.addEventListener('change',sync);print.addEventListener('change',sync);window.addEventListener('beforeprint',before);window.addEventListener('afterprint',after);
 controllers.set(page,controller);sync();return controller;
}
