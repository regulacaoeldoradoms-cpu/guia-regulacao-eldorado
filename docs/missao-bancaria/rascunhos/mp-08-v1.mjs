// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "cvm.sfn",
    "label": "CVM — Funcionamento do Sistema Financeiro Nacional",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/conheca-o-mercado-de-capitais/funcionamento-do-sistema-financeiro-nacional",
    "version": "Publicação de 25/10/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Segmentos monetário, de crédito, de capitais e cambial; operações entre bancos e BCB. Não descreve organograma obrigatório de um banco.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  }
];
export const MP08_DRAFT = {
  "id": "draft.mp08",
  "topicId": "draft.mp08",
  "editorialKey": "MP-08",
  "candidateBlockId": "banking.markets-policy",
  "title": "Mercado interbancário, tesouraria e varejo",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar quem contrata com quem em uma necessidade de liquidez bancária ou operação de cliente, distinguindo fluxos e funções sem presumir um organograma universal.",
  "sourceIds": [
    "cvm.sfn",
    "bcb.selic",
    "br.l4595"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Um banco pode aparecer em relações diferentes",
      "body": "Retome a classificação de mercados em [MP-01](mp-01-v1.md), saldo/crédito em [MP-02](mp-02-v1.md) e operações em [MP-05](mp-05-v1.md). “O banco recebeu dinheiro” não descreve sozinho a operação. Pode ser um depósito de cliente, um empréstimo de outro banco ou liquidação de um título. Precisamos identificar a contraparte, a obrigação criada e a data. A função desempenhada numa operação é mais informativa do que apenas o nome da instituição.",
      "sourceIds": []
    },
    {
      "id": "interbancario",
      "type": "explanation",
      "heading": "2. Operações entre bancos",
      "body": "No recorte monetário, instituições ajustam necessidades e disponibilidades de curto prazo. Interbancário identifica uma relação entre bancos; não é um nome alternativo para qualquer empréstimo de um banco. Um banco com recursos disponíveis pode fornecer recursos a outro, sob condições pactuadas. A operação cria obrigação entre as instituições. Não é, por esse motivo, um crédito pessoal contratado por cada correntista do banco tomador. Operações monetárias também podem envolver o BCB, mas isso não transforma qualquer relação banco–cliente em interbancária.",
      "sourceIds": [
        "cvm.sfn"
      ]
    },
    {
      "id": "exemplo-interbancario",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: acompanhar um ajuste entre bancos",
      "body": "Modelo fictício: banco A tem 70 de disponibilidade e banco B precisa de 30 para seu fluxo do dia. Admitindo operação permitida entre eles, A entrega 30 a B, que assume devolver o valor e a remuneração combinada no prazo. Na ida, A fica com 40 de disponibilidade no modelo; B recebe 30. A tem um direito perante B, não perante cada cliente de B. A transferência redistribui recursos entre os dois bancos no instante descrito; o exemplo não mede o crédito total nem a quantidade total de moeda na economia.\n\n```mermaid\nflowchart LR\n  A[\"Banco A: fornece recursos\"] -->|\"30 hoje\"| B[\"Banco B: obtém recursos\"]\n  B -->|\"devolução e remuneração no prazo\"| A\n```",
      "sourceIds": []
    },
    {
      "id": "varejo",
      "type": "explanation",
      "heading": "4. A operação de cliente tem outra contraparte",
      "body": "Varejo bancário é um modo de organizar o atendimento e a oferta de serviços a um conjunto amplo de clientes, incluindo pessoas e pequenos negócios. Aqui estudamos o caso de crédito a uma pessoa. O banco e o cliente são as contrapartes; o cliente assume a obrigação de devolver conforme o contrato. Como o banco administra seus recursos é outra relação. Não deduza que o crédito de um cliente está ligado individualmente a um empréstimo interbancário específico sem essa informação.",
      "sourceIds": []
    },
    {
      "id": "exemplo-varejo",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: o mesmo número não faz a mesma operação",
      "body": "Outro caso fictício: banco C concede 30 de crédito à cliente Lia, que assume o pagamento contratual. A origem e o destino agora são banco e pessoa. O número 30 coincide com o exemplo anterior, mas a contraparte tomadora mudou. No primeiro caso, B devia a A; aqui, Lia deve a C. Não há no relato prova de que C tomou 30 de outro banco para financiar Lia.\n\n```mermaid\nflowchart LR\n  C[\"Banco C: credor\"] -->|\"crédito de 30\"| L[\"Lia: cliente tomadora\"]\n  L -->|\"pagamento contratual\"| C\n```",
      "sourceIds": []
    },
    {
      "id": "tesouraria",
      "type": "explanation",
      "heading": "6. Tesouraria: olhar para recursos, prazos e posições",
      "body": "Usaremos “tesouraria” como função de administrar recursos e posições financeiras da instituição, inclusive acompanhar entradas, saídas e vencimentos. Essa lente ajuda a entender uma necessidade de liquidez do próprio banco. Não define um organograma obrigatório: responsabilidades e nomes de áreas variam. Atendimento ao cliente e gestão financeira institucional podem coexistir no mesmo banco; isso não torna a operação com cliente idêntica ao ajuste entre instituições. Avaliar cada contrato evita reduzir o banco a uma única função.",
      "sourceIds": []
    },
    {
      "id": "exemplo-calendario",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: total suficiente, horário inadequado",
      "body": "Banco fictício tem 15 disponíveis pela manhã, deve pagar 25 ao meio-dia e espera receber 20 no fim do dia. Ao meio-dia, faltam 25 − 15 = 10 se nenhum outro recurso entrar. Somar logo 15 + 20 e concluir que não há necessidade ignora o horário do recebimento. No total do dia, 15 + 20 − 25 = 10, mas essa sobra final não pagou antecipadamente o compromisso do meio-dia. Uma operação permitida para o intervalo pode atender a necessidade; condições e devolução continuam relevantes.",
      "sourceIds": []
    },
    {
      "id": "taxas",
      "type": "explanation",
      "heading": "8. Identificar a taxa da operação certa",
      "body": "Uma taxa precisa indicar operações, prazo e método de apuração. A Selic efetiva, por exemplo, corresponde ao recorte de compromissadas federais de um dia útil explicado em MP-04. Não é correto atribuí-la automaticamente a todo crédito varejista ou a todo contrato entre bancos. Se um exercício fornece apenas “taxa de 8%” sem prazo e sem dizer a que operação pertence, faltam informações. Não introduziremos cálculo de uma taxa interbancária específica sem seus dados e convenções.",
      "sourceIds": [
        "bcb.selic"
      ]
    },
    {
      "id": "comparacao",
      "type": "explanation",
      "heading": "9. Recuperação de crédito não é ajuste de liquidez",
      "body": "Se um cliente atrasa uma dívida, há um problema de cumprimento daquela obrigação. Recuperação de crédito é o conjunto de ações para buscar esse recebimento dentro das regras aplicáveis; sua abordagem jurídica/negocial pertence ao recorte PC-10 previsto, não a esta aula. Se um banco precisa cobrir um desencontro de horários, a pergunta imediata é de liquidez. Os fenômenos podem se relacionar, mas não são sinônimos. Não é possível diagnosticar a qualidade de toda a carteira apenas pelo ajuste de caixa de um dia.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário para comparar relações",
      "body": "Interbancário: entre bancos. Varejo bancário: atendimento/serviços ao conjunto de clientes descrito, não um tipo único de contrato. Tesouraria: função de gestão de recursos e posições usada neste recorte. Credor: quem tem direito de receber. Tomador/devedor: quem assume obrigação na operação. Posição: recursos ou obrigações observados numa data. Vencimento: prazo de cumprimento. Carteira: conjunto de operações/ativos.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "11. Um quadro antes de classificar",
      "body": "Faça quatro colunas: quem entrega, quem recebe, qual obrigação e quando. A mesma quantia pode aparecer em contratos diferentes. A mesma instituição pode atuar com clientes, outras instituições e BCB. Após errar, troque uma contraparte no desenho e explique por que a relação mudou. Não acrescente uma fonte de financiamento não informada.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Banco D fornece recursos de curto prazo ao banco E. Qual relação foi descrita?",
      "options": [
        "Crédito pessoal automático a todos os clientes de E.",
        "Operação entre os bancos D e E.",
        "Emissão obrigatória de ações de E.",
        "Transferência sem obrigação porque ambos são bancos."
      ],
      "answer": 1,
      "explanation": "As contrapartes são as duas instituições; condições da operação continuam relevantes.",
      "optionRationales": [
        "Troca os devedores sem informação.",
        "Identifica os participantes.",
        "Não existe emissão no relato.",
        "A natureza bancária não elimina obrigação."
      ],
      "recoverySectionIds": [
        "interbancario",
        "exemplo-interbancario"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp08.q01",
      "topicId": "draft.mp08"
    },
    {
      "prompt": "Banco D concede crédito à cliente Nara. O mesmo valor havia aparecido num exemplo entre bancos. O que determina a distinção?",
      "options": [
        "A quantia, sozinha.",
        "A cor do cartão da cliente.",
        "As contrapartes e as obrigações, não a coincidência numérica.",
        "Ser todo crédito obrigatoriamente interbancário."
      ],
      "answer": 2,
      "explanation": "Cliente tomadora e banco tomador pertencem a relações distintas.",
      "optionRationales": [
        "O valor não identifica a relação.",
        "Dado irrelevante ao contrato apresentado.",
        "Usa a informação que diferencia os casos.",
        "Apaga a contraparte cliente."
      ],
      "recoverySectionIds": [
        "varejo",
        "exemplo-varejo"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp08.q02",
      "topicId": "draft.mp08"
    },
    {
      "prompt": "Um banco tem 12 disponíveis agora, deve 20 antes de receber 15 no fim do dia. Qual necessidade imediata no modelo?",
      "options": [
        "Faltam 8 para o pagamento anterior ao recebimento.",
        "Sobram 7 agora, somando o recebimento futuro.",
        "Faltam 20, ignorando os 12 disponíveis.",
        "Não se pode comparar datas em uma análise de liquidez."
      ],
      "answer": 0,
      "explanation": "Antes da entrada futura, 20 − 12 = 8. A sobra final não elimina o intervalo.",
      "optionRationales": [
        "Respeita os horários.",
        "Antecipa recursos ainda indisponíveis.",
        "Ignora recursos presentes.",
        "A data é justamente parte da análise."
      ],
      "recoverySectionIds": [
        "tesouraria",
        "exemplo-calendario"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp08.q03",
      "topicId": "draft.mp08"
    },
    {
      "prompt": "Qual uso de “tesouraria” corresponde ao recorte da aula?",
      "options": [
        "Nome obrigatório de toda agência no país.",
        "Sinônimo de todos os empréstimos pessoais.",
        "Função exclusiva de instituições que não atendem clientes.",
        "Função de gerir recursos/posições; a organização concreta pode variar."
      ],
      "answer": 3,
      "explanation": "A aula descreve função, sem impor estrutura interna universal.",
      "optionRationales": [
        "Confunde função e regra de nomenclatura.",
        "Reduz função institucional a um contrato de varejo.",
        "Inventa exclusividade.",
        "Preserva o limite da definição."
      ],
      "recoverySectionIds": [
        "tesouraria",
        "glossario"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp08.q04",
      "topicId": "draft.mp08"
    },
    {
      "prompt": "Um enunciado informa uma taxa de uma operação interbancária. Podemos atribuí-la automaticamente ao empréstimo de um cliente?",
      "options": [
        "Sim, todas as taxas de um banco são iguais.",
        "Não: precisamos das condições e do prazo da operação do cliente.",
        "Sim, pois percentuais não dependem de contratos.",
        "Não: crédito ao cliente nunca tem juros."
      ],
      "answer": 1,
      "explanation": "Taxa é associada a operações e condições; não basta compartilhar uma instituição.",
      "optionRationales": [
        "Elimina diferenças contratuais.",
        "Identifica a informação necessária.",
        "Ignora prazo e operação.",
        "Nega a remuneração possível do crédito."
      ],
      "recoverySectionIds": [
        "taxas"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp08.q05",
      "topicId": "draft.mp08"
    },
    {
      "prompt": "Um banco ajusta sua liquidez ao meio-dia. Isso comprova que todos os seus clientes estão inadimplentes?",
      "options": [
        "Sim: toda necessidade temporal prova inadimplência total.",
        "Sim: liquidez é o número de atrasos da carteira.",
        "Não: o ajuste temporal não permite essa conclusão sobre a carteira.",
        "Não: bancos nunca sofrem inadimplência."
      ],
      "answer": 2,
      "explanation": "Datas de entradas/saídas e qualidade de crédito exigem informações diferentes.",
      "optionRationales": [
        "Generaliza sem dados.",
        "Troca definição de liquidez.",
        "Respeita o alcance da evidência.",
        "Nega risco sem fundamento."
      ],
      "recoverySectionIds": [
        "exemplo-calendario",
        "comparacao"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp08.q06",
      "topicId": "draft.mp08"
    }
  ],
  "recall": [
    "Compare os dois diagramas identificando credor e devedor.",
    "Explique por que sobra ao fim do dia pode coexistir com falta ao meio-dia.",
    "Depois de errar, refaça as quatro colunas sem inventar participantes ou contratos."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp08-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp08.q01": [
        {
          "missionId": "draft.mp08",
          "sectionId": "interbancario"
        },
        {
          "missionId": "draft.mp08",
          "sectionId": "exemplo-interbancario"
        }
      ],
      "mp08.q02": [
        {
          "missionId": "draft.mp08",
          "sectionId": "varejo"
        },
        {
          "missionId": "draft.mp08",
          "sectionId": "exemplo-varejo"
        }
      ],
      "mp08.q03": [
        {
          "missionId": "draft.mp08",
          "sectionId": "tesouraria"
        },
        {
          "missionId": "draft.mp08",
          "sectionId": "exemplo-calendario"
        }
      ],
      "mp08.q04": [
        {
          "missionId": "draft.mp08",
          "sectionId": "tesouraria"
        },
        {
          "missionId": "draft.mp08",
          "sectionId": "glossario"
        }
      ],
      "mp08.q05": [
        {
          "missionId": "draft.mp08",
          "sectionId": "taxas"
        }
      ],
      "mp08.q06": [
        {
          "missionId": "draft.mp08",
          "sectionId": "exemplo-calendario"
        },
        {
          "missionId": "draft.mp08",
          "sectionId": "comparacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "B/C/E redigidas; revisão factual/editorial do autor; revisão independente/humana pendente; integração F não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 12 e parte de 13",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 26 e parte de 27",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "Tesouraria/varejo como funções e relações introdutórias; não descreve organogramas obrigatórios ou todo o negócio bancário.",
    "Produtos interbancários específicos e apuração de taxas como DI exigem recorte/fonte/ensino adicional; não considerados cobertos.",
    "Recuperação de crédito somente contrastada; procedimentos ficam para PC-10.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Disponibilidade A",
    "operation": "subtract",
    "values": [
      70,
      30
    ],
    "expected": 40
  },
  {
    "label": "Necessidade ao meio-dia",
    "operation": "subtract",
    "values": [
      25,
      15
    ],
    "expected": 10
  },
  {
    "label": "Entrada no total",
    "operation": "add",
    "values": [
      15,
      20
    ],
    "expected": 35
  },
  {
    "label": "Sobra final",
    "operation": "subtract",
    "values": [
      35,
      25
    ],
    "expected": 10
  },
  {
    "label": "q03 necessidade",
    "operation": "subtract",
    "values": [
      20,
      12
    ],
    "expected": 8
  },
  {
    "label": "q03 total entrada",
    "operation": "add",
    "values": [
      12,
      15
    ],
    "expected": 27
  },
  {
    "label": "q03 sobra final",
    "operation": "subtract",
    "values": [
      27,
      20
    ],
    "expected": 7
  }
];
