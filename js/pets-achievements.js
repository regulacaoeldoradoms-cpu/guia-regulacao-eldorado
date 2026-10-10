import {petSession} from './pets-bootstrap.js';
const initializePetAchievements = (context) => {
const window=context?.window||globalThis;
const document=context?.document||globalThis.document;
let generation=0;
function clear(){generation++;document.getElementById('petAchievementsSection')?.remove();}
async function mount(){
 clear();const epoch=generation;
 const session=await petSession();
 if(!session||epoch!==generation)return;
 try{
  const payload=await session.api.get('achievements');
  if(epoch!==generation||!session.api.valid()||!Array.isArray(payload.achievements))return;
  const host=document.querySelector('.account-achievement-categories');if(!host)return;
  const section=document.createElement('section');section.id='petAchievementsSection';section.className='account-achievement-category';
  const header=document.createElement('header'),heading=document.createElement('h2');heading.textContent='Mascotes';header.append(heading);
  const grid=document.createElement('div');grid.id='petAchievementsGrid';grid.className='achievement-grid';section.append(header,grid);
  if(!payload.achievements.length){const p=document.createElement('p');p.textContent='Adote um mascote para desbloquear sua primeira conquista.';grid.append(p);}
  for(const item of payload.achievements){const card=document.createElement('article');card.className='achievement-card';const title=document.createElement('h3');title.textContent=item.title;const date=document.createElement('p');date.textContent='Conquistada em '+new Date(item.unlockedAt*1000).toLocaleDateString('pt-BR');card.append(title,date);grid.append(card);}
  host.prepend(section);
 }catch{ /* Feature disabled or unavailable: preserve existing achievements. */ }
}
window.addEventListener('portal:session-cleared',clear);
window.addEventListener('portal:session-ready',mount);
return mount();
};
if(globalThis.PortalCitizenShell)globalThis.PortalCitizenShell.register('pets-achievements',initializePetAchievements);
else initializePetAchievements();
