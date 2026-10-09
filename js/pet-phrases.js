// Fixed, general companionship phrases. Never read page content or personal data.
export const PET_PHRASES = Object.freeze([
 'Uma pausa também faz bem.',
 'Miau. Que bom estar por aqui.',
 'Minha água está sempre por perto.',
 'Vou cuidar da minha patinha.',
 'Uma coisa de cada vez.',
 'Você também merece uma pausa.',
 'Um dia difícil não apaga seu progresso.',
 'Tudo bem ir no seu ritmo.',
 'Nem todo dia precisa render igual.',
 'Seu descanso também tem lugar.',
 'Hoje pode ser um passo pequeno.',
 'Você não precisa resolver tudo agora.',
 'Um pouco de gentileza com você.',
 'Minha contribuição hoje é supervisionar deitado.',
 'O que você já fez também conta.',
 'Pedir ajuda também é um caminho.',
 'Você merece cuidado, mesmo nos dias difíceis.',
 'Tudo bem fazer uma coisa simples hoje.',
 'Seu valor vai além da lista de tarefas.',
 'Essa aba estava aberta. Achei que era pra eu sentar.',
 'Às vezes, fazer menos é cuidar de si.',
 'Se cabe um gato, cabe uma soneca.',
 'Vou ficar por aqui fazendo companhia.',
 'Miau. Pausa para espreguiçar?',
 'Estou treinando a arte de descansar.',
 'Minha agenda tem uma soneca marcada.',
 'Uma patinha de cada vez.',
 'Meu talento é achar um cantinho confortável.',
 'Se eu ronronar, é só companhia.',
 'Gostei deste cantinho. Miau.',
 'Trabalho importante: observar uma poeirinha.',
 'Não estou parado. Estou em modo gato.',
 'Minha opinião sobre isso: miau.',
 'A reunião das patinhas foi adiada para a soneca.',
 'Este cantinho passou na inspeção felina.',
 'Achei um lugar bom. Vou testar deitado.',
 'Minha cama está me chamando pelo nome.',
 'Vou espreguiçar e fingir que foi exercício.',
 'Se houver uma caixa, eu gostaria de saber.',
 'Posso supervisionar? Prometo piscar devagar.',
 'Estou ocupado sendo um gato muito sério.',
 'Minha patinha pediu cinco minutos de descanso.',
 'Se a caneta cair, foi um teste de gravidade.',
 'Meu currículo diz: especialista em caixas.',
 'O teclado estava morno. Fiz uma reserva.',
 'Passei na porta e esqueci o motivo. Miau.',
 'O aspirador e eu temos divergências históricas.',
 'A bolinha foi para baixo do sofá. Abrirei investigação.',
 'Meu pelo combina com todas as suas roupas.',
 'Não ouvi meu nome. Ouvi sachê perfeitamente.',
 'Cacei o ponto vermelho. Ele venceu por pouco.',
 'O espelho copiou meu penteado sem pedir.',
 'Minha cauda tem opiniões próprias.',
 'Um passarinho na janela cancelou meus planos.',
 'Essa toalha acabou de virar um trono.',
 'O tapete dobrou a ponta. Precisei lutar com ele.',
 'A sacola fez barulho. Eu respondi com outro.',
 'Seu fio de carregar não é uma cobra. Eu conferi.',
 'Tenho duas velocidades: estátua e foguete.',
 'A meia sumiu? Só falo na presença do meu advogado.',
 'Meu plano de exercícios: fugir do banho.',
 'Português? Eu sou fluente em miado.',
 'Minha pegada ecológica tem formato de patinha.',
 'Esse miado foi uma nota musical experimental.',
 'Fiz uma pirueta. O chão pediu bis.',
 'Se a lua fosse um novelo, eu já teria planos.',
 'Fui buscar silêncio. Trouxe um miado.',
]);

export const PET_PHRASE_VERSION='pet-phrases-20261009-cycle-1';
// Compatibility for an older runtime already held in an open tab/cache during an update.
// New runtimes use PetSpeech's complete cycle.
export function nextPetPhrase(recent=[],random=Math.random){const available=PET_PHRASES.filter(p=>!recent.includes(p)),choices=available.length?available:PET_PHRASES;return choices[Math.floor(random()*choices.length)];}
export const PET_SPEECH_TIMING=Object.freeze({minDelayMs:25000,maxDelayMs:40000,bubbleMs:7000});
export const PET_PHRASE_CATALOG=Object.freeze(PET_PHRASES.map((text,i)=>Object.freeze({id:'phrase-'+String(i+1).padStart(3,'0'),text})));
const ids=PET_PHRASE_CATALOG.map(p=>p.id),texts=new Map(PET_PHRASE_CATALOG.map(p=>[p.id,p.text]));
const valid=s=>s?.version===PET_PHRASE_VERSION&&Array.isArray(s.remaining)&&s.remaining.length<=ids.length&&new Set(s.remaining).size===s.remaining.length&&s.remaining.every(id=>texts.has(id))&&(s.lastId===null||texts.has(s.lastId))&&!s.remaining.includes(s.lastId);
export class PetPhraseCycle{
 constructor(saved,random=Math.random){this.random=random;this.remaining=valid(saved)?[...saved.remaining]:[];this.lastId=valid(saved)?saved.lastId:null;}
 next(){
  if(!this.remaining.length){
   this.remaining=[...ids];for(let i=this.remaining.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.remaining[i],this.remaining[j]]=[this.remaining[j],this.remaining[i]];}
   if(this.remaining[0]===this.lastId)[this.remaining[0],this.remaining[1]]=[this.remaining[1],this.remaining[0]];
  }
  this.lastId=this.remaining.shift();return {id:this.lastId,text:texts.get(this.lastId)};
 }
 snapshot(){return {version:PET_PHRASE_VERSION,remaining:[...this.remaining],lastId:this.lastId};}
}
export class PetSpeech{
 constructor(storage=null,key=null,{now=Date.now,random=Math.random}={}){
  this.storage=storage;this.key=key;this.now=now;this.random=random;let saved;
  try{saved=JSON.parse(key&&storage?.getItem(key));}catch{}
  this.cycle=new PetPhraseCycle(saved,random);const time=now(),timing=PET_SPEECH_TIMING;
  this.nextAt=valid(saved)&&saved.nextAt>time&&saved.nextAt<=time+timing.maxDelayMs?saved.nextAt:this.deadline(time);
  this.bubbleUntil=valid(saved)&&saved.bubbleUntil>time&&saved.bubbleUntil<=time+timing.bubbleMs?saved.bubbleUntil:0;
  this.save();
 }
 deadline(time){return time+PET_SPEECH_TIMING.minDelayMs+this.random()*(PET_SPEECH_TIMING.maxDelayMs-PET_SPEECH_TIMING.minDelayMs);}
 advance(time=this.now()){
  if(time<this.nextAt)return false;
  this.cycle.next();this.bubbleUntil=time+PET_SPEECH_TIMING.bubbleMs;this.nextAt=this.deadline(time);this.save();return true;
 }
 text(time=this.now()){return time<this.bubbleUntil?texts.get(this.cycle.lastId)||'':'';}
 save(){try{if(this.key)this.storage?.setItem(this.key,JSON.stringify({...this.cycle.snapshot(),nextAt:this.nextAt,bubbleUntil:this.bubbleUntil}));}catch{}}
}
// The opaque session scope is never a credential. Payload contains catalog IDs and technical deadlines only.
export async function petSpeechForSession(token){
 let storage=null,key=null;
 try{storage=sessionStorage;const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));key='portal:pets:speech:'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}catch{}
 return new PetSpeech(storage,key);
}
