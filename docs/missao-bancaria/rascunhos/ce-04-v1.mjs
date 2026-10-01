// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  }
];

export const CE04_DRAFT = {
  "id": "draft.ce04",
  "topicId": "draft.ce04",
  "editorialKey": "CE-04",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Fundos, cotas e condições de movimentação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar cotas e patrimônio, distinguir prestadores e interpretar condições de aplicação/resgate sem prometer liquidez ou retorno.",
  "sourceIds": [
    "cvm.ce.fundos"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Uma aplicação coletiva",
      "body": "Um fundo reúne recursos para investir conforme regras. O investidor adquire cotas, não escolhe diretamente cada ativo da carteira como se operasse sozinho. A estrutura pode ter classes com patrimônios segregados; nos exemplos usaremos só uma classe e uma subclasse. Retome [ação e dívida](ce-01-v1.md#direitos): a cota não transforma o investidor automaticamente em acionista do banco que distribui o fundo.",
      "sourceIds": [
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "cota",
      "type": "explanation",
      "heading": "2. Patrimônio e fração",
      "body": "Patrimônio líquido é o valor dos ativos menos obrigações, no recorte simplificado. Valor da cota = patrimônio líquido / quantidade de cotas. Aplicação dividida pelo valor de cota aplicável resulta em quantidade; quantidade multiplicada pela cota resulta em valor. A variação dos ativos e os encargos podem mudar a cota. Usamos valores já apurados, sem recalcular despesas embutidas.",
      "sourceIds": [
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "ex-cota",
      "type": "worked-example",
      "heading": "3. Calcular a fração",
      "body": "Classe fictícia: ativos R$12.000, obrigações R$2.000 e 1.000 cotas. Passo 1: patrimônio líquido = 12.000 − 2.000 = R$10.000. Passo 2: cota = 10.000/1.000 = R$10. Uma posição de 20 cotas corresponde a R$200 nessa apuração, não a vinte ações do administrador.",
      "sourceIds": []
    },
    {
      "id": "ex-aplicacao",
      "type": "worked-example",
      "heading": "4. Quantidade não é valor fixo",
      "body": "Com cota aplicável de R$5 e sem cobrança adicional no exemplo, uma aplicação de R$300 corresponde a 60 cotas. Se a cota depois for R$4,50, sem movimentação da posição, 60 × 4,50 = R$270. A quantidade permaneceu; o valor caiu R$30. A aplicação coletiva também pode ter perda.",
      "sourceIds": []
    },
    {
      "id": "papeis",
      "type": "explanation",
      "heading": "5. Quem faz o quê",
      "body": "Administrador e gestor são prestadores de serviços essenciais com funções e responsabilidades próprias. Administração envolve a estrutura e serviços administrativos; gestão envolve decisões sobre os ativos, dentro da política e dos limites. Distribuição é a colocação das cotas junto ao investidor. A escolha profissional dos ativos não é garantia de retorno. Regulamento e informações da classe esclarecem política, custos, riscos e condições.",
      "sourceIds": [
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "ex-papeis",
      "type": "worked-example",
      "heading": "6. Encontrar a função",
      "body": "No fundo fictício Horizonte, uma equipe decide vender um título e comprar outro conforme a política de investimento. Isso corresponde à gestão da carteira. A tarefa de organizar registros e informações do fundo pertence ao campo administrativo e aos serviços contratados pertinentes. Não atribua automaticamente toda função ao banco que apenas apresentou as cotas.",
      "sourceIds": [
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "movimentacao",
      "type": "explanation",
      "heading": "7. Aberta, fechada e prazos",
      "body": "Classe aberta admite resgate conforme regulamento; aberta não quer dizer dinheiro imediato. Classe fechada não admite o resgate ordinário por solicitação do cotista; amortização/liquidação têm regras próprias. Eventual negociação de cotas com outro investidor depende de condições e comprador. No resgate, separe solicitação, conversão das cotas em valor e pagamento. A data da conversão define qual cota será usada; a do pagamento indica quando ocorre o recebimento.",
      "sourceIds": [
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "ex-prazos",
      "type": "worked-example",
      "heading": "8. Ler a sequência informada",
      "body": "Condições fictícias: solicitação no dia útil D0, conversão em D2 e pagamento em D5. Uma pessoa resgata 40 cotas; a cota apurada em D2 é R$8. Sem cobrança adicional: 40 × 8 = R$320, pagos em D5. A cota vista em D0 não substitui a de D2 e R$320 não ficam disponíveis em D0. Esses prazos são dados do caso, não regra de todos os fundos.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "9. Vocabulário",
      "body": "Cota: fração do patrimônio da classe. Carteira: conjunto de ativos. Regulamento: condições do fundo/classes. Conversão: apuração do valor aplicável. Pagamento: entrega dos recursos. Amortização: pagamento de parcela nas condições previstas; não confundir com venda a outro investidor.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "10. Recuperação",
      "body": "Confira classe e regras, depois patrimônio/quantidade, prestador e datas. Uma cota pode variar; uma classe aberta pode ter prazo de resgate. Não presuma garantia ou liquidez apenas pelo nome do fundo. Retome a seção correspondente ao erro.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce04.q01",
      "prompt": "Uma classe tem patrimônio líquido R$9.000 e 900 cotas iguais. Qual valor de cota?",
      "options": [
        "R$10.",
        "R$900.",
        "R$9.000.",
        "R$0,10."
      ],
      "answer": 0,
      "explanation": "9.000/900 = 10.",
      "optionRationales": [
        "Divide patrimônio pela quantidade.",
        "Usa quantidade como preço.",
        "Usa patrimônio total como preço.",
        "Inverte a razão."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "cota",
        "ex-cota"
      ]
    },
    {
      "id": "ce04.q02",
      "prompt": "Aplicação R$240, cota aplicável R$6, sem cobrança adicional. Quantas cotas?",
      "options": [
        "6.",
        "240.",
        "40.",
        "1.440."
      ],
      "answer": 2,
      "explanation": "240/6 = 40.",
      "optionRationales": [
        "Confunde preço e quantidade.",
        "Ignora o preço.",
        "Relaciona aplicação e preço.",
        "Multiplica em vez de dividir."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "ex-aplicacao"
      ]
    },
    {
      "id": "ce04.q03",
      "prompt": "Escolher ativos da carteira dentro da política é atribuição de:",
      "options": [
        "todo cotista individualmente para a carteira inteira.",
        "gestão.",
        "emissor de qualquer ação comprada.",
        "qualquer distribuidor, automaticamente."
      ],
      "answer": 1,
      "explanation": "A função descrita é gestão dos ativos.",
      "optionRationales": [
        "Confunde investimento coletivo e escolha individual.",
        "Relaciona função e decisão.",
        "Emissor não gere automaticamente o fundo.",
        "Distribuição não é gestão por definição."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "papeis",
        "ex-papeis"
      ]
    },
    {
      "id": "ce04.q04",
      "prompt": "Classe aberta significa que:",
      "options": [
        "todo pedido é pago imediatamente.",
        "o principal é garantido.",
        "não pode haver custos.",
        "admite resgate nas condições do regulamento."
      ],
      "answer": 3,
      "explanation": "Abertura ao resgate não elimina prazos e riscos.",
      "optionRationales": [
        "Confunde possibilidade e instante.",
        "Não decorre da classificação.",
        "Não decorre da classificação.",
        "Mantém as condições."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "movimentacao"
      ]
    },
    {
      "id": "ce04.q05",
      "prompt": "No caso D0 solicitação, D2 conversão e D5 pagamento, qual cota usar?",
      "options": [
        "Sempre a de D0.",
        "Sempre a de D5.",
        "A de D2, conforme o caso.",
        "A maior das três."
      ],
      "answer": 2,
      "explanation": "A data de conversão indicada controla o cálculo.",
      "optionRationales": [
        "Troca solicitação por conversão.",
        "Troca pagamento por conversão.",
        "Segue a condição informada.",
        "Inventa escolha favorável."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "ex-prazos"
      ]
    },
    {
      "id": "ce04.q06",
      "prompt": "50 cotas passam de R$10 a R$9, sem movimentação. O valor da posição:",
      "options": [
        "passa de R$500 a R$450.",
        "fica R$500 por obrigação do banco.",
        "sobe a R$550.",
        "vira 45 cotas automaticamente."
      ],
      "answer": 0,
      "explanation": "Quantidade permanece; o valor de cota diminui.",
      "optionRationales": [
        "Multiplica a mesma quantidade pelo novo valor.",
        "Inventa garantia.",
        "Troca queda por alta.",
        "A variação não altera sozinha a quantidade."
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "recoverySectionIds": [
        "ex-aplicacao"
      ]
    },
    {
      "id": "ce04.q07",
      "prompt": "Uma classe fechada não admite resgate ordinário a pedido. Antes de contar com saída por venda, deve-se:",
      "options": [
        "considerar o dinheiro imediatamente disponível.",
        "exigir o mesmo prazo de qualquer classe aberta.",
        "presumir recompra obrigatória pelo distribuidor.",
        "verificar negociação permitida, comprador e preço."
      ],
      "answer": 3,
      "explanation": "Possibilidade de negociar não garante execução imediata.",
      "optionRationales": [
        "Confunde cota e saldo disponível.",
        "Transfere regra de outra classe.",
        "Inventa obrigação.",
        "Reconhece condições de liquidez."
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "recoverySectionIds": [
        "movimentacao"
      ]
    },
    {
      "id": "ce04.q08",
      "prompt": "Ativos R$5.000, obrigações R$500 e 450 cotas. Qual patrimônio líquido e cota?",
      "options": [
        "R$5.000 e R$500.",
        "R$4.500 e R$10.",
        "R$5.500 e R$10.",
        "R$500 e R$450."
      ],
      "answer": 1,
      "explanation": "5.000 − 500 = 4.500; 4.500/450 = 10.",
      "optionRationales": [
        "Não deduz obrigações.",
        "Faz as duas etapas.",
        "Soma obrigações ao patrimônio.",
        "Troca grandezas."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "cota",
        "ex-cota"
      ]
    }
  ],
  "recall": [
    "Explique os conceitos sem consultar e confira a seção de origem.",
    "Refaça o exemplo, separando dados, hipótese e conclusão.",
    "Quando errar, nomeie a confusão e retome as seções indicadas antes de tentar novamente."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ce04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce04.q01": [
        {
          "missionId": "draft.ce04",
          "sectionId": "cota"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-cota"
        }
      ],
      "ce04.q02": [
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-aplicacao"
        }
      ],
      "ce04.q03": [
        {
          "missionId": "draft.ce04",
          "sectionId": "papeis"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-papeis"
        }
      ],
      "ce04.q04": [
        {
          "missionId": "draft.ce04",
          "sectionId": "movimentacao"
        }
      ],
      "ce04.q05": [
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-prazos"
        }
      ],
      "ce04.q06": [
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-aplicacao"
        }
      ],
      "ce04.q07": [
        {
          "missionId": "draft.ce04",
          "sectionId": "movimentacao"
        }
      ],
      "ce04.q08": [
        {
          "missionId": "draft.ce04",
          "sectionId": "cota"
        },
        {
          "missionId": "draft.ce04",
          "sectionId": "ex-cota"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão independente agrupada e humana pendentes",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Itens 5 (investimentos) e 6",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 19 (investimentos) e 20",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Relacionar classe, patrimônio líquido e valor de cota.",
    "O2": "Calcular quantidade e valor em casos simples.",
    "O3": "Distinguir administração e gestão.",
    "O4": "Separar classe aberta/fechada e datas de conversão/pagamento.",
    "O5": "Reconhecer riscos e informações ausentes no regulamento.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Exemplos de classe única e uma única subclasse, sem percentuais mínimos por categoria, tributação, alavancagem ou promessa de responsabilidade limitada para todo fundo.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "PL",
    "operation": "subtract",
    "values": [
      12000,
      2000
    ],
    "expected": 10000
  },
  {
    "label": "cota",
    "operation": "divide",
    "values": [
      10000,
      1000
    ],
    "expected": 10
  },
  {
    "label": "posição",
    "operation": "multiply",
    "values": [
      20,
      10
    ],
    "expected": 200
  },
  {
    "label": "aplicação",
    "operation": "divide",
    "values": [
      300,
      5
    ],
    "expected": 60
  },
  {
    "label": "nova posição",
    "operation": "multiply",
    "values": [
      60,
      4.5
    ],
    "expected": 270
  },
  {
    "label": "perda",
    "operation": "subtract",
    "values": [
      270,
      300
    ],
    "expected": -30
  },
  {
    "label": "resgate",
    "operation": "multiply",
    "values": [
      40,
      8
    ],
    "expected": 320
  },
  {
    "label": "q1",
    "operation": "divide",
    "values": [
      9000,
      900
    ],
    "expected": 10
  },
  {
    "label": "q2",
    "operation": "divide",
    "values": [
      240,
      6
    ],
    "expected": 40
  },
  {
    "label": "q6 antes",
    "operation": "multiply",
    "values": [
      50,
      10
    ],
    "expected": 500
  },
  {
    "label": "q6 depois",
    "operation": "multiply",
    "values": [
      50,
      9
    ],
    "expected": 450
  },
  {
    "label": "q8 PL",
    "operation": "subtract",
    "values": [
      5000,
      500
    ],
    "expected": 4500
  },
  {
    "label": "q8 cota",
    "operation": "divide",
    "values": [
      4500,
      450
    ],
    "expected": 10
  }
];
