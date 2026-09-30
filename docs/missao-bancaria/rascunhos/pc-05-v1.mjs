// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "caixa.giro.finalidade",
    "label": "CAIXA — Capital de Giro, modalidades empresariais",
    "url": "https://www.caixa.gov.br/empresa/credito-financiamento/capital-de-giro/Paginas/default.aspx",
    "version": "Página institucional consultada em 30/09/2026; sem importar condições comerciais",
    "locator": "Apresentação de capital de giro; descrições de Cheque Empresa e Crédito Especial Empresa",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.duplicata",
    "label": "BCB — O que é uma duplicata?",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/o-que-e-uma-duplicata",
    "version": "FAQ atualizada em 30/06/2026",
    "locator": "Título ligado à venda de mercadorias ou prestação de serviços com pagamento a prazo",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.taxas.media",
    "label": "BCB — Taxas de Juros: significado das médias",
    "url": "https://www.bcb.gov.br/estatisticas/txjuros",
    "version": "Página consultada em 30/09/2026; nenhuma taxa de ranking reproduzida",
    "locator": "Apresentação das médias por modalidade e diferenças entre condições de clientes",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.credito.tipos",
    "label": "BCB — Diferença entre empréstimo, financiamento e leasing",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/diferenca-entre-emprestimo-financiamento-e-arrendamento-mercantil-leasing",
    "version": "FAQ atualizada em 21/05/2026",
    "locator": "Contraste empréstimo/financiamento; leasing apenas como limite do recorte",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.credito.condicoes",
    "label": "BCB — Condições para contratar empréstimo",
    "url": "https://www.bcb.gov.br/meubc/faqs/p/condicoes-para-contratar-emprestimo-em-um-banco",
    "version": "FAQ atualizada em 31/01/2023, consultada em 30/09/2026",
    "locator": "Análise e concessão; condições combinadas entre cliente e instituição",
    "checkedAt": "2026-09-30"
  }
];

export const PC05_DRAFT = {
  "id": "draft.pc05",
  "topicId": "draft.pc05",
  "editorialKey": "PC-05",
  "candidateBlockId": "banking.products-credit",
  "title": "Crédito comercial e ao consumidor: finalidade e fluxo",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir necessidades empresariais e de consumo, interpretar recursos presentes e recebíveis e relacionar características contratuais à finalidade sem presumir aprovação ou recomendar contratação.",
  "sourceIds": [
    "caixa.giro.finalidade",
    "bcb.duplicata",
    "bcb.taxas.media",
    "bcb.credito.tipos",
    "bcb.credito.condicoes"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Quem precisa dos recursos e para quê?",
      "body": "Em [PC-02](pc-02-v1.md#modalidades), a destinação contratual separou empréstimo e financiamento; em [PC-04](pc-04-v1.md#base-comparavel), examinamos custo e calendário. Aqui, crédito comercial designará o recorte de operações voltadas à atividade empresarial, e crédito ao consumidor, o recorte de uso por pessoa física para suas necessidades de consumo. São agrupamentos didáticos, não uma promessa de que todos os bancos tenham um contrato único com esses nomes. Uma operação empresarial também tem tomador, credor, obrigação, finalidade e condições a ler.",
      "sourceIds": [
        "bcb.credito.tipos",
        "caixa.giro.finalidade"
      ]
    },
    {
      "id": "giro",
      "type": "explanation",
      "heading": "2. A atividade tem entradas e saídas em datas diferentes",
      "body": "Uma empresa pode precisar pagar insumos, fornecedores ou despesas do funcionamento antes de receber suas vendas. No recorte desta aula, o capital de giro dá suporte a esse ciclo operacional. Necessidade de caixa é diferente de comprar um equipamento durável para ampliar a capacidade produtiva. Não chamaremos qualquer gasto empresarial de reposição de caixa.\n\nA página institucional da CAIXA apresenta mais de uma opção de crédito para capital de giro, incluindo modalidades rotativas e parceladas. Usamos isso somente para mostrar que a finalidade não determina sozinha prazo, forma de pagamento ou taxa. Não reproduzimos ofertas, programas ou requisitos de contratação.",
      "sourceIds": [
        "caixa.giro.finalidade"
      ]
    },
    {
      "id": "exemplo-giro",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: falta temporária de caixa",
      "body": "Caso fictício: uma pequena oficina precisa pagar R$3.000 em insumos na segunda-feira; tem R$1.000 disponíveis e prevê receber R$4.000 por serviços na sexta-feira. Passo 1: a insuficiência na segunda é 3.000 − 1.000 = R$2.000. Passo 2: os R$4.000 previstos para sexta não são saldo disponível na segunda. Passo 3: a necessidade descrita é sustentar o funcionamento entre pagamento e recebimento. Esses dados não aprovam empréstimo nem demonstram capacidade de pagar tudo: faltam outras obrigações, condições do crédito e segurança do recebimento. Um atraso no recebível também pode alterar o cenário.",
      "sourceIds": []
    },
    {
      "id": "finalidade",
      "type": "explanation",
      "heading": "4. Finalidade econômica e vínculo do contrato",
      "body": "Comprar uma máquina de uso duradouro é uma finalidade diferente de recompor recursos para despesas do ciclo corrente. Mas conhecer a finalidade econômica não basta para classificar o contrato como financiamento: observe se o crédito está contratualmente ligado ao bem, como ensinado em PC-02. Um empréstimo sem destinação contratual específica não vira financiamento só porque o tomador decidiu comprar algo. Da mesma forma, o nome comercial da linha não demonstra a existência de determinada garantia ou a menor taxa. Essas condições precisam estar no caso/contrato.",
      "sourceIds": [
        "bcb.credito.tipos"
      ]
    },
    {
      "id": "exemplo-finalidade",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: mesma atividade, necessidades diferentes",
      "body": "A padaria A quer pagar farinha e despesas do funcionamento antes de receber vendas a prazo. A padaria B quer comprar um forno que será usado durante anos. Passo 1: identificar o uso do recurso, não apenas a palavra padaria. Passo 2: A descreve uma necessidade do ciclo operacional; B descreve aquisição de equipamento durável. Passo 3: para dizer se B contratará financiamento vinculado ao forno ou empréstimo sem destinação específica, ainda é preciso ler o contrato. Não supomos que todo equipamento venha com garantia real ou taxa menor.",
      "sourceIds": []
    },
    {
      "id": "recebiveis",
      "type": "explanation",
      "heading": "6. Recebível não é dinheiro já recebido",
      "body": "Recebível é um direito a receber um valor futuramente. A duplicata é um título de crédito ligado à venda de mercadorias ou à prestação de serviços a prazo; representa o valor devido pelo comprador ao fornecedor. Ter esse título não é o mesmo que ter o dinheiro disponível hoje, nem torna duplicata uma ação societária.\n\nEm uma antecipação descrita no contrato, o interessado obtém recursos antes da data prevista do recebimento. O caso pode informar deduções e o valor líquido entregue. Aqui ensinaremos a leitura desses valores, não o procedimento legal de transferência, garantias ou responsabilidade se o devedor original não pagar. Essas condições não podem ser inventadas a partir da palavra antecipação.",
      "sourceIds": [
        "bcb.duplicata"
      ]
    },
    {
      "id": "exemplo-recebivel",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: direito futuro e valor líquido",
      "body": "A empresa fictícia tem uma duplicata de R$1.500 com vencimento futuro. Um contrato do caso prevê antecipar hoje R$1.425, com dedução total de R$75, sem outros valores na conta proposta. Passo 1: reconhecer R$1.500 como valor do direito futuro. Passo 2: conferir 1.500 − 75 = R$1.425 disponíveis hoje. Passo 3: a dedução não desaparece por ser retida antes da liberação. Sem datas completas e demonstrativo, não convertemos R$75 em CET; sem condições contratuais, não afirmamos que toda responsabilidade da empresa acabou. O exemplo informa o fluxo de antecipação, não todas as regras do instrumento.",
      "sourceIds": []
    },
    {
      "id": "consumo",
      "type": "explanation",
      "heading": "8. Necessidade de consumo e modalidade contratada",
      "body": "No caso de consumo, uma pessoa pode obter crédito vinculado à aquisição de um bem, ou contratar empréstimo sem destinação específica. Compare finalidade, principal, entrada, prazo, parcelas, custos e condições. O fato de um bem ser doméstico não o torna gratuito, e a existência de crédito disponível não o transforma em renda própria.\n\nNão trataremos CDC como um contrato idêntico em todas as instituições nem introduziremos aqui regras de consignado, leasing ou garantias. O recorte é identificar o que o caso efetivamente descreve; produtos com mecanismos próprios precisam de ensino específico.",
      "sourceIds": [
        "bcb.credito.tipos"
      ]
    },
    {
      "id": "exemplo-consumo",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: aquisição de um bem para uso pessoal",
      "body": "Um refrigerador do caso custa R$1.500 à vista. Pessoa física dá entrada de R$300 e financia os R$1.200 restantes em cinco pagamentos de R$260. O cenário não tem outros desembolsos. Passo 1: 1.500 − 300 = R$1.200 financiados. Passo 2: as parcelas somam 5 × 260 = R$1.300. Passo 3: entrada mais parcelas = 300 + 1.300 = R$1.600; são R$100 além do preço à vista. A entrada reduz o valor financiado, mas faz parte do desembolso total da compra. Sem o calendário/CET, essa soma não é uma taxa anual nem uma recomendação.",
      "sourceIds": []
    },
    {
      "id": "condicoes",
      "type": "explanation",
      "heading": "10. Finalidade não garante concessão ou condições universais",
      "body": "O BCB esclarece que a instituição pode analisar e conceder ou não o empréstimo; manter uma conta não obriga a aprovação. Na leitura de propostas, não extrapole condições de uma pessoa para outra. A página de taxas do BCB apresenta médias por modalidade e período, não uma oferta garantida a todo cliente. Cadastro, entrada e garantias podem integrar diferenças nas condições observadas; a aula não ensina a determinar preço ou aprovação.\n\nPara uma comparação didática, reúna finalidade, vínculo contratual, recurso líquido, vencimentos, custo e responsabilidades expressas. Leia o CET quando aplicável, retomando [os limites de PC-04](pc-04-v1.md#limites). Se o pagamento do crédito vence antes do recebimento esperado, isso deve aparecer na análise de caixa mesmo que a parcela pareça pequena.",
      "sourceIds": [
        "bcb.credito.condicoes",
        "bcb.taxas.media"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário do fluxo",
      "body": "Ciclo operacional: sequência de atividades que exige pagamentos e gera recebimentos. Capital de giro: recursos de suporte ao funcionamento nesse ciclo, no recorte introdutório. Equipamento durável: bem utilizado na atividade por tempo prolongado. Recebível: direito de receber valor futuramente. Duplicata: título ligado a venda/serviço a prazo. Valor líquido antecipado: quanto fica disponível agora após as deduções informadas. Condição contratual: regra pactuada que não pode ser deduzida apenas do nome do produto.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Explique a necessidade antes de nomear a solução",
      "body": "Identifique quem recebe, finalidade e datas; separe caixa atual de direito futuro; confira se o contrato vincula o crédito a um bem; leia principal, entrada, parcelas e encargos sem duplicação. Depois diga o que ainda falta para comparar ou avaliar a operação. Não confunda classificação didática com aprovação ou recomendação individual.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Explique a diferença entre sustentar o ciclo operacional e comprar equipamento durável.",
    "Refaça um caso separando saldo atual, recebível e dedução da antecipação.",
    "Após errar, use as seções indicadas para escrever a condição que foi indevidamente presumida."
  ],
  "questions": [
    {
      "id": "pc05.q01",
      "topicId": "draft.pc05",
      "prompt": "Uma oficina precisa pagar R$3.000 hoje, tem R$1.000 disponíveis e espera R$4.000 na sexta. Qual leitura corresponde aos dados?",
      "options": [
        "Os R$4.000 futuros já tornam o saldo de hoje R$5.000.",
        "Faltam R$2.000 hoje; o recebimento previsto não é saldo atual.",
        "Faltam R$4.000 hoje porque esse é o recebível.",
        "O banco é obrigado a emprestar os R$2.000."
      ],
      "answer": 1,
      "explanation": "A diferença de hoje é 3.000 − 1.000; previsão de recebimento e aprovação de crédito são questões separadas.",
      "optionRationales": [
        "Antecipa um recebimento que ainda não ocorreu.",
        "Separa saldo disponível de fluxo futuro.",
        "Usa o valor futuro no lugar da diferença presente.",
        "A insuficiência de caixa não cria obrigação de concessão."
      ],
      "recoverySectionIds": [
        "giro",
        "exemplo-giro",
        "condicoes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc05.q02",
      "topicId": "draft.pc05",
      "prompt": "Padaria A quer recursos para insumos antes das vendas a prazo; B quer adquirir um forno durável. O que está correto?",
      "options": [
        "Todas as necessidades empresariais são idênticas.",
        "O forno é automaticamente um saldo de conta.",
        "B terá necessariamente garantia real e taxa menor.",
        "A descreve o ciclo operacional; B, equipamento durável; o tipo de contrato ainda exige leitura."
      ],
      "answer": 3,
      "explanation": "Uso econômico e vínculo contratual precisam ser identificados separadamente.",
      "optionRationales": [
        "Apaga a diferença de finalidade.",
        "Bem de uso não é saldo bancário.",
        "Inventa condições que o caso não deu.",
        "Distingue as finalidades sem presumir condições."
      ],
      "recoverySectionIds": [
        "finalidade",
        "exemplo-finalidade"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc05.q03",
      "topicId": "draft.pc05",
      "prompt": "Uma empresa vende mercadorias a prazo e possui duplicata que representa R$2.000 devidos pelo comprador. Qual interpretação é adequada?",
      "options": [
        "Há um título ligado ao recebimento futuro; isso não prova dinheiro já disponível hoje.",
        "A duplicata é participação societária do comprador.",
        "A empresa já recebeu R$2.000 em moeda pelo simples fato de ter o título.",
        "A duplicata elimina a data de vencimento."
      ],
      "answer": 0,
      "explanation": "Título representativo de valor a receber não se confunde com saldo atual ou ação.",
      "optionRationales": [
        "Relaciona a venda a prazo ao direito de receber.",
        "Troca título de crédito por participação societária.",
        "Confunde direito futuro e recebimento consumado.",
        "Ignora a dimensão temporal da obrigação."
      ],
      "recoverySectionIds": [
        "recebiveis"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc05.q04",
      "topicId": "draft.pc05",
      "prompt": "No contrato fictício, um recebível de R$2.000 será antecipado com dedução total de R$80, sem outros valores na liberação. Quanto fica disponível hoje?",
      "options": [
        "R$2.080.",
        "R$2.000, pois a dedução não importa.",
        "R$1.920; isso sozinho não informa CET nem todas as responsabilidades.",
        "R$80; o resto não é recurso."
      ],
      "answer": 2,
      "explanation": "O líquido é 2.000 − 80 = 1.920. Datas e demais condições seriam necessárias para conclusões adicionais.",
      "optionRationales": [
        "Soma uma dedução que reduz o líquido.",
        "Ignora o valor retido.",
        "Calcula o líquido e conserva os limites da informação.",
        "Confunde dedução com recurso recebido."
      ],
      "recoverySectionIds": [
        "recebiveis",
        "exemplo-recebivel"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc05.q05",
      "topicId": "draft.pc05",
      "prompt": "Bem de uso pessoal: preço à vista R$1.000, entrada R$200, quatro prestações de R$220, sem outros pagamentos. Qual leitura é correta?",
      "options": [
        "R$800 financiados e desembolso nominal total de R$1.080.",
        "R$1.000 financiados e desembolso total de R$880.",
        "R$200 são juros porque foram pagos antes.",
        "R$1.080 é o CET anual."
      ],
      "answer": 0,
      "explanation": "O principal restante é 1.000 − 200 = 800; parcelas somam 880 e, com entrada, 1.080.",
      "optionRationales": [
        "Distingue o financiado da soma total da compra.",
        "Ignora a entrada ao calcular ambas as grandezas.",
        "Entrada é pagamento do preço no cenário, não juros presumidos.",
        "CET é taxa, não essa soma em reais."
      ],
      "recoverySectionIds": [
        "consumo",
        "exemplo-consumo"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc05.q06",
      "topicId": "draft.pc05",
      "prompt": "Um empréstimo foi contratado sem destinação específica. Depois, o tomador decide usá-lo para comprar um equipamento. Essa decisão, sozinha, permite qual conclusão?",
      "options": [
        "O contrato passou automaticamente a financiar bem vinculado.",
        "O custo foi eliminado pela finalidade escolhida.",
        "O empréstimo tornou-se uma garantia real.",
        "A finalidade pessoal do gasto não altera automaticamente o vínculo descrito no contrato."
      ],
      "answer": 3,
      "explanation": "A classificação pelo vínculo depende das condições contratuais, não só da intenção do tomador.",
      "optionRationales": [
        "Confunde escolha posterior de gasto com vínculo contratual.",
        "A finalidade não apaga a obrigação de pagar.",
        "Crédito não se converte em garantia apenas pelo uso.",
        "Preserva a distinção ensinada entre uso e contrato."
      ],
      "recoverySectionIds": [
        "finalidade"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc05.q07",
      "topicId": "draft.pc05",
      "prompt": "Um interessado encontra uma taxa média de determinada modalidade no BCB e já tem conta num banco. Qual conclusão é permitida?",
      "options": [
        "A média é uma oferta pessoal obrigatória daquele banco.",
        "A média é referência do conjunto/período; conta e consulta não asseguram aprovação nem a mesma condição.",
        "Toda empresa receberá a mesma taxa porque a finalidade é comercial.",
        "A média substitui o demonstrativo da proposta real."
      ],
      "answer": 1,
      "explanation": "As informações agregadas não substituem análise de concessão e condições específicas da operação.",
      "optionRationales": [
        "Converte estatística em compromisso individual.",
        "Mantém os limites da referência e da relação de conta.",
        "Generaliza condições entre tomadores.",
        "Dispensa indevidamente informação da operação."
      ],
      "recoverySectionIds": [
        "condicoes"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc05.q08",
      "topicId": "draft.pc05",
      "prompt": "Uma proposta empresarial vence na terça-feira; o recebimento previsto ocorre na sexta. O anúncio destaca prestação pequena. Qual análise é melhor fundamentada?",
      "options": [
        "Ignorar as datas, pois prestação pequena sempre resolve caixa.",
        "Tratar sexta-feira como se já fosse terça.",
        "Conferir recursos disponíveis até terça, outros compromissos e custo/condições completos; a parcela sozinha não basta.",
        "Presumir que o banco mudou o vencimento para sexta."
      ],
      "answer": 2,
      "explanation": "Fluxos precisam ser lidos por data, como custos precisam ser lidos por componentes. Não se inventam recursos ou mudança de contrato.",
      "optionRationales": [
        "Troca um dado isolado pela análise do calendário.",
        "Antecipa um recurso futuro sem base.",
        "Identifica informações relevantes e limites do anúncio.",
        "Cria alteração contratual não informada."
      ],
      "recoverySectionIds": [
        "exemplo-giro",
        "condicoes"
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc05-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc05.q01": [
        {
          "missionId": "draft.pc05",
          "sectionId": "giro"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "exemplo-giro"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "condicoes"
        }
      ],
      "pc05.q02": [
        {
          "missionId": "draft.pc05",
          "sectionId": "finalidade"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "exemplo-finalidade"
        }
      ],
      "pc05.q03": [
        {
          "missionId": "draft.pc05",
          "sectionId": "recebiveis"
        }
      ],
      "pc05.q04": [
        {
          "missionId": "draft.pc05",
          "sectionId": "recebiveis"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "exemplo-recebivel"
        }
      ],
      "pc05.q05": [
        {
          "missionId": "draft.pc05",
          "sectionId": "consumo"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "exemplo-consumo"
        }
      ],
      "pc05.q06": [
        {
          "missionId": "draft.pc05",
          "sectionId": "finalidade"
        }
      ],
      "pc05.q07": [
        {
          "missionId": "draft.pc05",
          "sectionId": "condicoes"
        }
      ],
      "pc05.q08": [
        {
          "missionId": "draft.pc05",
          "sectionId": "exemplo-giro"
        },
        {
          "missionId": "draft.pc05",
          "sectionId": "condicoes"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 5 histórico; recorte introdutório/apoio didático, sem atribuir subitem CET inexistente",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 19 histórico; recorte introdutório/apoio didático, sem atribuir subitem CET inexistente",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": {
    "O1": "Identificar necessidade de caixa e calendário do ciclo operacional.",
    "O2": "Distinguir finalidade econômica de vínculo contratual.",
    "O3": "Interpretar duplicata, recebível e valor líquido de antecipação.",
    "O4": "Ler entrada, principal e soma dos pagamentos no consumo.",
    "O5": "Reconhecer limites de médias, aprovação e comparação de condições.",
    "O6": "Reconstruir fluxo e explicitar a hipótese indevida após erro."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Recorte inicial PC-05, não inventário completo de produtos comerciais/CDC. Sem critérios de concessão, garantias, execução de duplicatas, desconto bancário completo, programas, consignado ou leasing.",
    "CAIXA é fonte primária de exemplos de modalidades, não recomendação nem adoção de condições comerciais. Não se reproduziram taxas, limites, prazos ofertados ou programas atuais.",
    "Somente aritmética dos casos explicitados; não se calculam CET, desconto racional/comercial ou equivalência de taxas. Antecipação não autoriza concluir extinção de responsabilidades.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "insuficiência oficina",
    "operation": "subtract",
    "values": [
      3000,
      1000
    ],
    "expected": 2000
  },
  {
    "label": "líquido duplicata",
    "operation": "subtract",
    "values": [
      1500,
      75
    ],
    "expected": 1425
  },
  {
    "label": "principal refrigerador",
    "operation": "subtract",
    "values": [
      1500,
      300
    ],
    "expected": 1200
  },
  {
    "label": "parcelas refrigerador",
    "operation": "multiply",
    "values": [
      5,
      260
    ],
    "expected": 1300
  },
  {
    "label": "total compra refrigerador",
    "operation": "add",
    "values": [
      300,
      1300
    ],
    "expected": 1600
  },
  {
    "label": "diferença preço",
    "operation": "subtract",
    "values": [
      1600,
      1500
    ],
    "expected": 100
  },
  {
    "label": "q4 líquido",
    "operation": "subtract",
    "values": [
      2000,
      80
    ],
    "expected": 1920
  },
  {
    "label": "q5 principal",
    "operation": "subtract",
    "values": [
      1000,
      200
    ],
    "expected": 800
  },
  {
    "label": "q5 parcelas",
    "operation": "multiply",
    "values": [
      4,
      220
    ],
    "expected": 880
  },
  {
    "label": "q5 total",
    "operation": "add",
    "values": [
      200,
      880
    ],
    "expected": 1080
  }
];
