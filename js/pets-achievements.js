import {petSession} from './pets-bootstrap.js';
const section=document.getElementById('petAchievementsSection'),grid=document.getElementById('petAchievementsGrid');
if(section&&grid){
 const session=await petSession();
 if(session)try{
  const payload=await session.api.get('achievements');
  section.hidden=false;
  if(!payload.achievements.length){const p=document.createElement('p');p.textContent='Adote um mascote para desbloquear sua primeira conquista.';grid.append(p);}
  for(const item of payload.achievements){const card=document.createElement('article');card.className='achievement-card';const title=document.createElement('h3');title.textContent=item.title;const date=document.createElement('p');date.textContent='Conquistada em '+new Date(item.unlockedAt*1000).toLocaleDateString('pt-BR');card.append(title,date);grid.append(card);}
 }catch{section.hidden=false;grid.textContent='Conquistas de mascotes temporariamente indisponíveis.';}
}
