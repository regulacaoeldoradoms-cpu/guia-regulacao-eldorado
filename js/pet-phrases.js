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
]);

// Keep a short recent history; needs alerts remain the runtime's first priority.
export function nextPetPhrase(recent = [], random = Math.random) {
 const available = PET_PHRASES.filter(phrase => !recent.includes(phrase));
 const choices = available.length ? available : PET_PHRASES;
 return choices[Math.floor(random() * choices.length)];
}
