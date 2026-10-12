'use strict';

// Server-only content. Never import this module from browser assets.
// The future authenticated endpoint must check the private adult gate first.
// Original/invented jokes approved for this character; no author attribution.
export const GNOME_PHRASE_VERSION = 'gnome-phrases-20261012-1';
const phrases = [
  'Coitado é o cachorro que tem 4 sovacos e enfiam o termômetro no caneco dele.',
  'Malandro é o sapo, que mora na lagoa pra ver perereca molhada.',
  'Quem cedo madruga passa o dia com sono.',
  'Devagar se vai longe… mas de carona chega menos cansado.',
  'Quem não deve não teme. Só evita abrir o aplicativo do banco.',
  'A esperança é a última que morre. Meu salário é o primeiro.',
  'Em terra de cego, quem tem um olho já perdeu os óculos.',
  'Quem procura acha. Quem guarda bem demais nunca mais encontra.',
  'O importante é ter saúde. Porque dinheiro já vimos que não vai dar.',
  'Mente vazia é oficina do diabo. A minha tá alugada pra ele.',
  'Não deixe pra amanhã o que você pode convencer outro a fazer hoje.',
  'Tem gente que é igual nuvem: quando vai embora, o dia fica lindo.',
  'Eu não guardo rancor. Guardo nome, data e captura de tela.',
  'Sou pequeno, mas minha capacidade de falar besteira não tem limite.',
  'Não confunda minha altura com o tamanho da minha má intenção.',
  'Quem vê barba não vê o histórico do navegador.',
  'De médico e louco todo mundo tem um pouco. De rico ninguém tem nada.',
  'Pimenta nos olhos dos outros é refresco. Na minha comida é gastrite.',
  'Antes só do que pagando lanche pra companhia ruim.',
  'Quem tem boca vai a Roma. Quem tem Pix manda buscar pizza.',
  'Dinheiro não traz felicidade, mas paga um lugar confortável pra reclamar.',
  'Malandro é o corrimão, que passa a vida sendo passado pra trás.',
  'Malandro é o ventilador: faz vento pra todo mundo e ainda fica se abanando.',
  'Quem ama o feio tem problema de vista ou informação privilegiada.',
  'Meu chapéu é pontudo, mas minhas intenções são tortas.',
  'Eu até sou um homem de família. Só não descobriram de qual ainda.',
  'Quem vê cara não vê o resto… mas imagina.',
  'Em terra de saci, qualquer calça vira motel.',
  'Água mole em pedra dura… depende de quem tá segurando a mangueira.',
  'Quem não tem cão caça com gato. Eu prefiro quem vem por vontade própria.',
  'Mais vale um passarinho na mão… mas tem gente que prefere soltar a periquita.',
  'Quem dá aos pobres empresta a Deus. Quem dá pro vizinho arruma confusão.',
  'Não sou encanador, mas vivo ouvindo que o problema é falta de pressão.',
  'Sou baixinho, mas alcanço assuntos que você não alcança.',
  'Meu cogumelo é pequeno, mas a sombra é disputada.',
  'Aqui não tem tamanho mínimo. Tem que saber fazer graça.',
  'Quem planta mandioca não pode reclamar quando mandam arrancar pela raiz.',
  'Não é porque eu moro no jardim que você pode vir pegando na minha mangueira.'
];
export const GNOME_PHRASE_CATALOG = Object.freeze(phrases.map((text, index) =>
  Object.freeze({id:`gnome-${String(index + 1).padStart(3, '0')}`, text})
));
