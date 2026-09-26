'use strict';

// Revisão pedagógica da primeira aula. Não altera identidade, questões ou recompensas.
const section = (heading, body) => Object.freeze({ heading, body });

export const INTRODUCTION_SOURCES = Object.freeze([
  Object.freeze({
    id: 'cvm.educacao.estrutura-sfn',
    label: 'Portal do Investidor — estrutura e funções do Sistema Financeiro Nacional',
    url: 'https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/sistema-financeiro-nacional/',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  }),
  Object.freeze({
    id: 'fazenda.cmn.apresentacao',
    label: 'Ministério da Fazenda — Conselho Monetário Nacional',
    url: 'https://www.gov.br/fazenda/pt-br/assuntos/cmn',
    checkedAt: '2026-09-26',
    kind: 'conteudo-oficial'
  })
]);

export const INTRODUCTION_V2 = Object.freeze({
  contentVersion: 2,
  title: 'Comece do zero: o que é o Sistema Financeiro Nacional',
  shortTitle: 'O sistema financeiro, do zero',
  estimatedMinutes: 22,
  objective: 'Aprender o que significa Sistema Financeiro Nacional (SFN), por que ele existe e como distinguir quem orienta, quem fiscaliza e quem oferece serviços financeiros.',
  sourceIds: Object.freeze([
    'edital.bb.2022-001', 'edital.caixa.2024-nm', 'bcb.sfn',
    'cvm.educacao.estrutura-sfn', 'fazenda.cmn.apresentacao'
  ]),
  sections: Object.freeze([
    section('1. Você não precisa conhecer as siglas para começar',
      'SFN significa Sistema Financeiro Nacional: S de Sistema, F de Financeiro e N de Nacional. Uma sigla é apenas uma forma curta de escrever um nome. Aqui, sistema significa um conjunto de partes que se relacionam; financeiro indica a ligação com dinheiro e serviços financeiros; nacional indica o Brasil. Não é o nome de um banco nem de um aplicativo. É o conjunto em que bancos e outras instituições atuam.'),
    section('2. Parta de situações que você já conhece',
      'Receber o salário em uma conta, guardar dinheiro para uma compra e procurar um empréstimo são situações diferentes. Todas envolvem relações com instituições financeiras. Nesta aula, pense nestas perguntas: quem presta o serviço? Quem verifica se essa instituição cumpre suas obrigações? Quem define as orientações gerais? Você vai aprender a separar essas três funções antes de memorizar uma lista de nomes.'),
    section('3. Quatro palavras antes de seguir',
      'Poupar é deixar de gastar uma parte do dinheiro agora. Não significa, obrigatoriamente, depositar na caderneta de poupança: poupar é a ação; a caderneta é um produto. Poupador é quem reserva recursos. Tomador de recursos é quem procura dinheiro para usar agora e devolver conforme o combinado. Crédito, neste contexto, é a disponibilização de recursos com obrigação de pagamento futuro, como acontece em um empréstimo.'),
    section('4. Exemplo: Ana e uma oficina',
      'Situação inventada para entender a ideia: Ana tem dinheiro que não pretende gastar neste mês. Uma oficina precisa de recursos para comprar uma ferramenta. Elas não precisam se conhecer nem negociar entre si. Um banco pode captar recursos de diversos clientes e conceder crédito a outros, analisando os riscos. Esse trabalho de atuar entre quem disponibiliza recursos e quem precisa deles é chamado de intermediação financeira. O exemplo é simplificado: não significa que o depósito específico de Ana seja entregue diretamente à oficina nem que explique todo o funcionamento do crédito bancário.'),
    section('5. E o que são juros?',
      'Juros são a remuneração pelo uso do dinheiro ao longo do tempo. Exemplo puramente didático: alguém recebe R$ 1.000 emprestados e combina devolver R$ 1.100 após certo prazo, sem outros custos nesse exemplo. Os R$ 100 adicionais representam juros. Na vida real podem existir outros encargos e condições. Não é necessário calcular taxas nesta aula; basta distinguir o dinheiro recebido do custo de usá-lo.'),
    section('6. Por que não basta existir um banco?',
      'Imagine a dificuldade de contratar um serviço sem saber quais obrigações a instituição tem ou quem verifica seu cumprimento. Por isso, além de prestadores de serviços, há órgãos que estabelecem diretrizes e entidades que supervisionam. Diretriz quer dizer orientação geral. Norma quer dizer regra. Fiscalizar significa verificar o cumprimento das obrigações. Agora que essas palavras têm significado, podemos dar nome aos três grupos.'),
    section('7. Órgãos normativos: as orientações gerais',
      'Normativo vem de norma. Os órgãos normativos definem políticas e diretrizes gerais do sistema, em seus respectivos segmentos. Um exemplo é o Conselho Monetário Nacional (CMN). Conselho é um grupo que delibera; monetário se refere à moeda, isto é, ao dinheiro. O Conselho Monetário Nacional formula a política da moeda e do crédito. Não é uma agência em que você abre conta ou pede um empréstimo.'),
    section('8. Entidades supervisoras: fiscalização e execução',
      'O Banco Central do Brasil é uma entidade supervisora. Você pode encontrá-lo abreviado como BC ou BCB, e também chamado de Bacen: essas formas se referem à mesma instituição. Ele fiscaliza instituições sob sua responsabilidade e executa a política monetária, que envolve medidas relacionadas à moeda e aos juros. Atenção: supervisores também podem editar normas dentro de suas competências. A distinção não significa que o Banco Central nunca faça regras; significa que ele não é o Conselho Monetário Nacional.'),
    section('9. Operadores: os serviços e as operações',
      'Operador é a instituição que realiza atividades e serviços financeiros. Um banco comercial, por exemplo, recebe depósitos e concede crédito. Banco do Brasil (BB) e Caixa Econômica Federal (CAIXA) são exemplos próximos da sua preparação: você procura essas instituições para serviços bancários, não para definir a política monetária do país. O cliente usa o serviço; o operador o oferece. O Banco Central do Brasil e o Banco do Brasil são instituições diferentes, apesar da semelhança entre os nomes.'),
    section('10. Uma comparação para organizar a memória',
      'Pense em um campeonato: há quem estabeleça as regras gerais, quem verifique seu cumprimento e quem participe das partidas. A comparação ajuda a lembrar três funções diferentes, mas não substitui a estrutura real do sistema financeiro. No assunto estudado aqui, relacione orientações gerais a normativos, fiscalização a supervisores e prestação de serviços a operadores. Uma mesma palavra, como banco, não basta para determinar a função de uma instituição.'),
    section('11. Exemplo resolvido: observe o verbo',
      'Situação inventada: o enunciado descreve uma instituição que analisa um pedido de empréstimo e oferece crédito a uma empresa. Ela está prestando um serviço, portanto exerce papel de operador. Agora troque a ação: uma entidade verifica se instituições estão cumprindo suas obrigações. A função descrita é de supervisão. Repare que você conseguiu classificar os papéis pela atividade, sem decorar nomes soltos.'),
    section('12. Exemplo resolvido: não troque as instituições',
      'Considere a frase: o Conselho Monetário Nacional recebe depósitos dos clientes em suas agências. Ela está errada: receber depósitos é uma atividade operacional, e o conselho não é um banco de atendimento ao público. Já a frase o Conselho Monetário Nacional formula diretrizes para a moeda e o crédito corresponde à sua função. Para resolver, procure primeiro o nome por extenso e depois o que a instituição está fazendo.'),
    section('13. Palavras que também podem aparecer nas alternativas',
      'Cliente é quem utiliza o serviço. Cliente institucional é uma organização, e não uma pessoa contratando em nome próprio. Correspondente bancário é um prestador contratado para realizar determinados serviços em nome da instituição contratante; não é um conselho que define a política monetária. Você não precisa estudar toda a regulamentação desses participantes agora. Na primeira questão, a tarefa é reconhecer a função de estabelecer diretrizes gerais que acabou de ser ensinada.'),
    section('14. Seu resumo de consulta',
      'SFN = Sistema Financeiro Nacional, o conjunto estudado. CMN = Conselho Monetário Nacional, ligado às diretrizes gerais da moeda e do crédito. BC, BCB ou Bacen = Banco Central do Brasil, com funções de supervisão e execução. BB = Banco do Brasil, que presta serviços bancários. CAIXA = Caixa Econômica Federal, também prestadora de serviços bancários. Se esquecer uma sigla, volte a este trecho; não é necessário adivinhar.'),
    section('15. Confira se a ideia ficou clara antes das questões',
      'Explique com suas palavras: qual a diferença entre criar uma orientação geral, fiscalizar seu cumprimento e prestar um serviço? Para conferir sua resposta: essas são, respectivamente, as funções normativas, supervisoras e operacionais que estudamos. Depois tente explicar o exemplo de Ana e da oficina: o banco faz a intermediação entre quem disponibiliza recursos e quem precisa deles. Se a explicação ainda não sair, releia o exemplo correspondente. As questões abaixo são uma primeira prática, não uma prova de que você já domina todo o assunto.')
  ]),
  recall: Object.freeze([
    'Sem consultar: escreva ou diga o nome completo representado por SFN.',
    'Qual é a diferença entre Conselho Monetário Nacional e Banco Central do Brasil? Confira nas partes 7 e 8 após tentar responder.',
    'Uma instituição que oferece empréstimos aos clientes está atuando como normativo, supervisor ou operador? Explique o motivo antes de conferir a parte 9.'
  ])
});
