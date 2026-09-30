// Rascunho editorial: sem importação pelo runtime, XP, ordem ou IDs definitivos.
// Estruturas de ensino/questões seguem o catálogo existente; fontes ficam locais.
export const SOURCES = [
  { id: 'cvm.sfn.segmentos', label: 'CVM — Funcionamento do Sistema Financeiro Nacional', url: 'https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional', version: 'Página publicada em 25/10/2022', checkedAt: '2026-09-30', locator: 'Parágrafos de segmentação, monetário, câmbio e crédito' },
  { id: 'cvm.valores.papeis', label: 'CVM — O Mercado de Valores Mobiliários', url: 'https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/o-mercado-de-valores-mobiliarios', version: 'Página publicada em 25/10/2022', checkedAt: '2026-09-30', locator: 'Comparação crédito/capitais; prestação de serviços; dívida e participação' },
  { id: 'bcb.credito.2026', label: 'BCB — Caderno de Educação Financeira', url: 'https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf', version: '2026, 2ª edição revisada', checkedAt: '2026-09-30', locator: 'Seções 3.1 e 3.4, páginas impressas 32 e 35' },
  { id: 'cvm.primario.secundario', label: 'CVM — Mercado Primário x Mercado Secundário', url: 'https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario', version: 'Página publicada em 26/08/2022', checkedAt: '2026-09-30', locator: 'Parágrafos sobre novas emissões e negociação entre investidores' }
];

const section = (id, type, heading, body, sourceIds = []) => ({ id, type, heading, body, sourceIds });
const question = (id, prompt, options, answer, explanation, optionRationales, sections, objectives) => ({
  id, topicId: 'draft.mp01', prompt, options, answer, explanation, optionRationales,
  recoverySectionIds: sections, objectiveIds: objectives
});

const sections = [
  section('perguntas', 'explanation', '1. Observe a operação antes de escolher o mercado',
    'Nesta aula você vai comparar quatro segmentos: monetário, de crédito, de capitais e de câmbio. Não precisa calcular juros nem conhecer uma cotação atual. Leia primeiro o que aconteceu: quem participou, o que foi negociado e para qual finalidade. Mercado é o conjunto de relações em que essas operações acontecem; não precisa ser um prédio. Instituição é uma organização participante. Operação é o negócio realizado. Instrumento ou produto é aquilo que estrutura esse negócio. Assim, o nome de um banco não responde, sozinho, qual mercado aparece no caso.'),
  section('credito', 'explanation', '2. Crédito: receber recursos e assumir uma obrigação',
    'Tomador é quem recebe os recursos emprestados; devedor é quem tem a obrigação de pagar. Credor é quem tem o direito de receber. No empréstimo bancário que estudaremos, o banco concede recursos à pessoa ou empresa, que deve devolvê-los nas condições contratadas. Juros são a remuneração pelo uso dos recursos durante um período. Prazo é esse intervalo; vencimento é a data em que uma obrigação deve ser cumprida. Esses termos ajudam a ler o contrato, mas uma operação não vira monetária apenas porque vence logo. Esta aula não compara custos nem recomenda contratar crédito.', ['bcb.credito.2026']),
  section('exemplo-credito', 'worked-example', '3. Exemplo resolvido: as despesas de uma oficina',
    'Caso inteiramente fictício: a Oficina Cedro contrata com o Banco Ponte um empréstimo em reais para pagar despesas do mês. Deve devolver ao banco conforme o contrato. Passo 1: a finalidade é obter recursos para a oficina. Passo 2: a oficina é tomadora/devedora; o banco é credor nessa relação. Passo 3: a operação descrita é concessão de crédito, não compra de participação na oficina nem troca de moedas. Conclusão: mercado de crédito. O uso posterior do dinheiro para comprar peças é outra operação; não muda a natureza do empréstimo que estamos classificando.'),
  section('capitais', 'explanation', '4. Capitais: emitir instrumentos para captar recursos',
    'Emissor é quem cria e coloca um instrumento no mercado. Investidor é quem aplica recursos nele. Uma ação representa participação na sociedade: seu titular passa a ser um sócio, chamado acionista, não credor só por possuir a ação. Uma debênture é um título que formaliza dívida da emissora nas condições previstas. Portanto, há dívida também no mercado de capitais. Distribuir títulos é prestar o serviço de colocá-los junto aos investidores. Distribuir títulos não torna o distribuidor responsável pelo pagamento da dívida da emissora aos investidores. Isso não significa ausência de intermediários ou de deveres próprios dos prestadores. Observe o instrumento e o papel exercido, não apenas a palavra banco. O segmento também inclui negociação posterior: se um investidor vende a outro um instrumento já emitido, o pagamento vai ao vendedor, sem representar automaticamente novos recursos para a companhia. Emissão e negociação posterior são operações distintas.', ['cvm.valores.papeis', 'cvm.primario.secundario']),
  section('exemplo-capitais', 'worked-example', '5. Exemplo resolvido: duas formas de financiar a mesma empresa',
    'Caso fictício: para um projeto, a Companhia Horizonte estuda duas alternativas. Na primeira, contrata empréstimo com o Banco Ponte. Na segunda, emite debêntures que investidores compram; o banco somente presta o serviço de distribuição nessa operação. Passo 1: a finalidade geral, financiar o projeto, é igual. Passo 2: na primeira alternativa, a companhia deve ao banco que lhe concedeu crédito. Na segunda, deve aos investidores titulares das debêntures, conforme os títulos. Passo 3: a primeira é crédito bancário; a segunda é captação no mercado de capitais. O nome do banco e a existência de dívida não bastam para distingui-las. Se a companhia emitisse ações, o investidor teria participação societária, não o mesmo direito de recebimento de uma debênture. Não estamos afirmando rentabilidade ou ausência de risco.'),
  section('monetario', 'explanation', '6. Monetário: recursos para a liquidez do sistema',
    'No contexto desta aula, liquidez significa disponibilidade de recursos para cumprir pagamentos no momento necessário. Liquidação é a efetivação de uma obrigação ou operação; não é sinônimo de liquidez. O mercado monetário envolve transferências de curtíssimo prazo, inclusive entre instituições financeiras e em operações com o Banco Central, ligadas à liquidez do sistema. Política monetária é o conjunto de decisões e ações sobre as condições da moeda e dos juros; mercado monetário é um campo de operações. Não são a mesma coisa. Não estudaremos aqui instrumentos específicos nem um número obrigatório de dias.', ['cvm.sfn.segmentos']),
  section('exemplo-monetario', 'worked-example', '7. Exemplo resolvido: ajustar recursos para pagamentos',
    'Caso fictício e simplificado: o Banco Lago precisa de recursos disponíveis para cumprir pagamentos hoje. Outro banco transfere recursos por curtíssimo prazo em uma operação destinada a esse ajuste de liquidez. Passo 1: identifique a finalidade expressa, ajustar a disponibilidade entre instituições. Passo 2: observe os participantes e o prazo, em conjunto. Passo 3: nesse recorte, a operação pertence ao mercado monetário. Compare com a oficina: ali o banco concedeu crédito a uma empresa para suas despesas. Dizer apenas que uma operação dura pouco não informa quem participa ou o que ela resolve. O exemplo não ensina o mecanismo de liquidação nem as regras de um instrumento específico.'),
  section('cambio', 'explanation', '8. Câmbio: a conversão entre moedas',
    'Real é a moeda brasileira; euro e dólar são exemplos de moedas estrangeiras. No câmbio, o objeto da operação é a troca entre moedas. Cotação expressa a relação de troca: uma indicação em reais por euro informa quantos reais correspondem a uma unidade de euro naquele preço. A ordem das moedas importa. Não usaremos valores ou taxas atuais. Um pagamento internacional pode envolver câmbio, mas apenas citar exterior não informa se houve conversão: é preciso ler a operação descrita.', ['cvm.sfn.segmentos']),
  section('exemplo-cambio', 'worked-example', '9. Exemplo resolvido: converter recursos para uma viagem',
    'Caso fictício: Júlia usa reais que já possui para comprar euros para uma viagem, por meio de uma instituição que presta esse serviço. Passo 1: o objeto é converter reais em euros. Passo 2: não há empréstimo nem aquisição de participação em empresa no caso. Passo 3: a conversão é uma operação de câmbio. A viagem explica a necessidade, mas a pista decisiva é a troca de moedas. Se o enunciado dissesse somente que Júlia pagou um serviço no exterior, faltaria saber como ocorreu o pagamento; não seria correto inventar a conversão.'),
  section('limites', 'explanation', '10. Separe os negócios e reconheça o que falta',
    'Use três perguntas: qual é a finalidade da operação; qual é o objeto ou instrumento; quais papéis os participantes exercem? Analise cada operação separadamente. Uma empresa pode tomar empréstimo em reais e depois converter parte dos reais em moeda estrangeira: o encadeamento contém crédito e câmbio. Quando o relato informa apenas que uma empresa obteve recursos com ajuda de um banco, faltam detalhes para escolher entre concessão de crédito e distribuição de títulos. Pedir essa informação é uma resposta fundamentada, não um erro de memória. Os quatro segmentos se relacionam; esta comparação introdutória não resolve toda operação complexa.'),
  section('exemplo-limite', 'worked-example', '11. Exemplo resolvido: não completar o enunciado por conta própria',
    'Caso fictício: a Companhia Serra anuncia que conseguiu recursos com apoio do Banco Vale. Um colega conclui que houve empréstimo bancário. Passo 1: localize o dado conhecido, apoio do banco. Passo 2: perceba o dado ausente, a operação realizada. Passo 3: pergunte se o banco concedeu um empréstimo ou prestou serviços em uma emissão. Nenhuma dessas alternativas está demonstrada no anúncio. A conclusão correta é que a descrição é insuficiente. Reler o contraste entre a oficina e a emissão ajuda a descobrir exatamente o que falta, em vez de decorar que banco significa sempre crédito.'),
  section('glossario', 'glossary', '12. Consulta rápida depois de compreender',
    'Instituição: organização participante. Operação: negócio realizado. Credor/devedor: quem tem direito de receber/obrigação de pagar. Emissor: quem emite o instrumento. Investidor: quem aplica recursos. Ação: participação societária. Debênture: dívida da emissora. Liquidez, no recorte usado: disponibilidade para cumprir pagamentos. Liquidação: efetivação da obrigação/operação. Cotação: relação de troca entre moedas. Consulte as explicações anteriores para entender cada termo no caso, sem substituir o raciocínio por esta lista.'),
  section('resumo', 'summary', '13. Prepare sua explicação antes da prática',
    'Reconstrua os quatro exemplos sem consultar: o empréstimo da oficina; a emissão da companhia; o ajuste entre bancos; a conversão para a viagem. Em cada um, diga quem participa, qual operação acontece e por que a classificou assim. Depois confira os passos resolvidos. Se sua justificativa usar só prazo, nome do banco ou existência de dívida, volte ao contraste pertinente. Os itens seguintes são prática desta aula, não avaliação independente. Acertar agora ou concluir uma revisão não comprova retenção duradoura nem prontidão para prova.')
];

const questions = [
  question('mp01.q01', 'Caso fictício: o Banco Leste concede um empréstimo à Padaria Sol. Qual associação identifica instituição e operação, respectivamente?',
    ['Crédito e Banco Leste.', 'Padaria Sol e mercado financeiro.', 'Banco Leste e concessão do empréstimo.', 'Empréstimo e Padaria Sol.'], 2,
    'A organização participante é o banco; o negócio realizado é a concessão. A padaria também é uma organização participante, mas não o nome da operação.',
    ['Inverte segmento e instituição.', 'O segundo termo é um ambiente amplo, não a operação descrita.', 'Distingue quem participa do que foi feito.', 'Inverte operação e organização.'], ['perguntas', 'exemplo-credito'], ['O1', 'O2']),
  question('mp01.q02', 'Caso fictício: um banco empresta reais à Loja Ipê por poucos dias para pagar fornecedores. Qual classificação é sustentada pelo relato?',
    ['Crédito: há concessão à loja com obrigação de devolver.', 'Monetário: todo empréstimo curto pertence a esse segmento.', 'Capitais: qualquer recurso usado por empresa vem desse mercado.', 'Câmbio: pagar fornecedores significa trocar moedas.'], 0,
    'A operação descrita é concessão de crédito à loja. Seu prazo curto não basta para transformá-la em ajuste de liquidez entre instituições.',
    ['Usa operação e papéis efetivamente informados.', 'Usa só o prazo e ignora a finalidade e as partes.', 'Confunde finalidade empresarial com instrumento de captação.', 'O relato não informa troca entre moedas.'], ['credito', 'exemplo-credito', 'exemplo-monetario'], ['O2', 'O3', 'O4']),
  question('mp01.q03', 'Caso fictício: a Companhia Aurora emite debêntures adquiridas por investidores; um banco presta somente distribuição. Qual leitura combina instrumento e papéis?',
    ['Os investidores viram acionistas por terem adquirido debêntures.', 'O banco se torna automaticamente o devedor dos títulos por distribuí-los.', 'A participação de um banco transforma a emissão em empréstimo bancário.', 'A companhia é emissora/devedora; os investidores são titulares da dívida no mercado de capitais.'], 3,
    'A debênture expressa dívida da emissora. O banco exerce o serviço descrito, sem que distribuição e tomada da dívida sejam a mesma função.',
    ['Confunde dívida com participação em ações.', 'Confunde distribuição com a obrigação da emissora.', 'Classifica pela instituição, ignorando a emissão.', 'Identifica título e relações descritas.'], ['capitais', 'exemplo-capitais'], ['O2', 'O3', 'O4']),
  question('mp01.q04', 'Caso fictício: dois bancos realizam uma transferência de curtíssimo prazo para ajustar recursos disponíveis aos pagamentos do dia. Qual raciocínio é mais adequado?',
    ['Crédito ao consumidor, porque todo pagamento é consumo.', 'Monetário, considerando em conjunto liquidez, participantes e prazo.', 'Câmbio, porque todo recurso transferido muda de moeda.', 'Capitais, porque toda instituição precisa de capital.'], 1,
    'O caso delimita ajuste de liquidez entre bancos por curtíssimo prazo. É essa combinação, não uma palavra isolada, que sustenta a classificação.',
    ['Não há consumidor ou crédito ao consumo descrito.', 'Usa os três elementos presentes no caso.', 'Transferência não implica conversão entre moedas.', 'A palavra capital não demonstra emissão ou negociação de títulos.'], ['monetario', 'exemplo-monetario'], ['O2', 'O3']),
  question('mp01.q05', 'Caso fictício: Bia converte euros que já possui em reais. O banco recebe as moedas e realiza a conversão. O que determina a classificação introdutória?',
    ['O fato de ocorrer em banco prova que é empréstimo.', 'Receber reais sempre significa emitir uma dívida.', 'A troca entre moedas caracteriza câmbio.', 'Possuir euros significa ser acionista de uma empresa estrangeira.'], 2,
    'O objeto explicitado é a conversão entre moedas. Nenhuma dívida ou participação societária foi descrita.',
    ['Ignora o serviço efetivamente informado.', 'Confunde recebimento de moeda com obrigação de pagamento.', 'Usa o objeto da operação, inclusive na direção inversa à do exemplo.', 'Confunde moeda estrangeira com ação.'], ['cambio', 'exemplo-cambio'], ['O2', 'O3']),
  question('mp01.q06', 'Um anúncio fictício informa apenas: “A Empresa Mar conseguiu recursos com auxílio de um banco”. Qual informação ajudaria a distinguir crédito bancário de captação por títulos?',
    ['O valor total dos recursos obtidos, sem explicar a operação.', 'Se houve empréstimo concedido pelo banco ou distribuição de títulos emitidos pela empresa.', 'Por quantos anos a empresa pretende utilizar os recursos, sem descrever o instrumento.', 'Se a empresa deseja usar o dinheiro em um projeto.'], 1,
    'É preciso identificar a operação e a relação entre as partes. A finalidade geral de financiar um projeto pode estar presente nas duas alternativas.',
    ['O mesmo valor pode ser obtido por operações diferentes.', 'Distingue concessão e prestação de serviço na emissão.', 'O horizonte de uso não informa como os recursos foram captados.', 'A finalidade isolada pode ser igual nos dois casos.'], ['exemplo-capitais', 'limites', 'exemplo-limite'], ['O2', 'O5']),
  question('mp01.q07', 'Caso fictício: uma empresa contrata empréstimo em reais e, depois, compra dólares com parte desses recursos. Como analisar os dois negócios descritos?',
    ['Primeiro crédito, depois câmbio: classificar cada operação.', 'Somente câmbio, apagando a obrigação do empréstimo.', 'Somente crédito, pois a origem do dinheiro impede outra classificação.', 'Somente monetário, porque houve movimentação de dinheiro.'], 0,
    'O contrato de empréstimo e a conversão têm objetos diferentes. A ligação entre eles não elimina suas características.',
    ['Preserva as duas relações explicitadas.', 'Ignora a primeira operação.', 'Confunde origem dos recursos com o objeto da operação seguinte.', 'Movimentação de dinheiro não basta para essa classificação.'], ['credito', 'cambio', 'limites'], ['O2', 'O3', 'O5']),
  question('mp01.q08', 'Caso fictício: dois investidores adquirem, na emissão, instrumentos diferentes da mesma companhia: Lia compra ações e Rui compra debêntures. Qual contraste foi ensinado?',
    ['Ambos são acionistas porque entregaram dinheiro à companhia.', 'Ambos têm o mesmo direito de receber uma dívida, independentemente do instrumento.', 'Lia é credora pelas ações e Rui acionista pelas debêntures.', 'Lia adquire participação societária; Rui adquire um título de dívida.'], 3,
    'O destino dos recursos não torna iguais os direitos associados a instrumentos diferentes. Ação e debênture precisam ser distinguidas.',
    ['Ignora a natureza da debênture.', 'Transforma participação em dívida.', 'Inverte as características ensinadas.', 'Relaciona cada instrumento ao tipo de vínculo.'], ['capitais', 'exemplo-capitais'], ['O3', 'O4'])
];

export const MP01_DRAFT = {
  id: 'draft.mp01', topicId: 'draft.mp01', editorialKey: 'MP-01', candidateBlockId: 'banking.markets-policy',
  title: 'O que acontece em cada mercado', contentVersion: 1, kind: 'lesson',
  publication: { status: 'draft' },
  objective: 'Comparar monetário, crédito, capitais e câmbio pela operação, pelo objeto e pelos papéis; reconhecer informação insuficiente.',
  sourceIds: SOURCES.map(source => source.id), sections, questions,
  recall: [
    'Explique mercado, instituição e operação com um dos casos; compare com a seção perguntas.',
    'Por que existir dívida não prova que houve empréstimo bancário? Confira capitais e exemplo-capitais.',
    'Escolha um erro da prática, localize a seção indicada e explique a diferença sem consultar a alternativa. Depois confira os passos do exemplo.'
  ],
  teaching: { contractVersion: 1, editorialPass: 'mp01-autoria-r1', reviewStatus: 'human-review-pending',
    questionCoverage: Object.fromEntries(questions.map(q => [q.id, q.recoverySectionIds.map(sectionId => ({ missionId: 'draft.mp01', sectionId }))]))
  }
};

export const EDITORIAL = {
  stage: 'B/C/E redigidas; D revisada pelo autor e por revisão independente pontual, com duas correções aplicadas; revisão humana pendente; F não iniciada',
  referenceOnlyProfiles: [
    { id: 'bb.agente-comercial.2022-001', item: 'Anexo III, Agente Comercial, item 2', status: 'histórico; adoção pendente' },
    { id: 'caixa.tbn.2024-nm', item: 'Anexo IV, TBN, item 3', status: 'histórico; adoção pendente' }
  ],
  recovery: { objectiveId: 'O6', instruction: 'Após cada erro, reler recoverySectionIds e reescrever a justificativa antes de comparar com o comentário. Em nova sessão de estudo, explicar um contraste sem consulta; não registrar isso como política adaptativa implementada.' },
  limits: ['IDs locais, sem reserva de IDs produtivos ou definição de XP/ordem.', 'Prática exposta: não compõe banco de avaliação independente.', 'Sem regras normativas de produtos, taxas atuais, derivativos ou mecânica de instrumentos monetários.', 'A conversão não exige cálculo; valores/cotações atuais não foram usados.', 'Casos originais fictícios; fontes fundamentam conceitos, não comprovam clareza humana.']
};
