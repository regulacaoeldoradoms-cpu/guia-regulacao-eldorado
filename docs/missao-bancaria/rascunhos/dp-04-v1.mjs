export const SOURCES = [
  {
    "id": "fsb.dp.nbfi",
    "label": "FSB — Non-Bank Financial Intermediation",
    "url": "https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/non-bank-financial-intermediation/",
    "locator": "Introdução e Monitoring: universo amplo, subconjunto de riscos, liquidez/prazos/alavancagem",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DP04_DRAFT = {
  "id": "draft.dp04",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-04",
  "title": "Shadow banking e intermediação não bancária",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer intermediação financeira fora do sistema bancário tradicional.",
  "sourceIds": [
    "fsb.dp.nbfi"
  ],
  "sections": [
    {
      "id": "conceito",
      "type": "explanation",
      "heading": "1. Por que estudar além dos bancos?",
      "body": "O termo histórico shadow banking direciona a atenção à intermediação de crédito realizada fora do sistema bancário tradicional. O FSB hoje organiza seu acompanhamento como intermediação financeira não bancária (NBFI). O universo é diverso; ter atividade financeira sem ser banco não significa, por si só, prática clandestina. Há modelos e regras distintos.",
      "sourceIds": [
        "fsb.dp.nbfi"
      ]
    },
    {
      "id": "ex-canal",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: financiamento por outro canal",
      "body": "Um fundo fictício reúne recursos de investidores e subscreve novos títulos de dívida emitidos por empresas, no mercado primário. Os recursos dessa emissão vão para as empresas emissoras. O financiamento alcança empresas por um canal não bancário. O exemplo não informa infração; o nome do canal não permite concluir ilegalidade ou falta de regulação.",
      "sourceIds": []
    },
    {
      "id": "liquidez",
      "type": "explanation",
      "heading": "3. Prazo e liquidez",
      "body": "Liquidez é a possibilidade de obter recursos disponíveis, inclusive convertendo ativos em dinheiro sem perdas excessivas. Um compromisso de resgate curto pode entrar em tensão com ativos que só geram caixa mais tarde ou são difíceis de vender. O problema é o descompasso; não basta observar que há ativos de valor positivo.",
      "sourceIds": [
        "fsb.dp.nbfi"
      ]
    },
    {
      "id": "ex-resgate",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: dinheiro existe, mas quando?",
      "body": "No caso fictício, investidores podem pedir resgate em prazo curto, enquanto os recebimentos dos ativos ocorrem muito depois. Muitos pedidos juntos podem exigir venda antecipada. Se compradores exigirem desconto, a venda pode gerar perda. Isso ilustra risco de liquidez e de prazos; não prova que toda instituição não bancária vive a mesma situação.",
      "sourceIds": []
    },
    {
      "id": "alavancagem",
      "type": "explanation",
      "heading": "5. Recursos próprios e dívida",
      "body": "Alavancagem envolve ampliar exposições usando endividamento ou mecanismos equivalentes. Ganhos e perdas dos ativos podem ter efeito maior sobre os recursos próprios. Aqui usamos apenas dívida simples: receber dinheiro emprestado aumenta também uma obrigação, e não representa automaticamente aumento do patrimônio líquido.",
      "sourceIds": [
        "fsb.dp.nbfi"
      ]
    },
    {
      "id": "ex-alavancagem",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: perda sobre recursos próprios",
      "body": "Uma entidade fictícia possui R$20 próprios, toma R$80 emprestados e compra R$100 em ativos. Se os ativos caem para R$90 e a dívida permanece R$80, restam R$10 de recursos próprios: perda de metade dos R$20 iniciais. Hipótese: sem outros ativos, receitas, custos ou obrigações. A queda de 10% no ativo não foi de apenas 10% sobre o capital próprio.",
      "sourceIds": []
    },
    {
      "id": "recorte",
      "type": "explanation",
      "heading": "7. Nem todo não banco tem o mesmo risco",
      "body": "O monitoramento amplo do FSB abrange diversos intermediários; uma medida mais estreita focaliza funções associadas a riscos financeiros semelhantes aos bancários, como transformação de prazos/liquidez e alavancagem. Interligações podem transmitir tensões: uma venda forçada afeta preços e outros participantes expostos. Não basta chamar toda empresa não bancária de shadow bank.",
      "sourceIds": [
        "fsb.dp.nbfi"
      ]
    },
    {
      "id": "ex-contagio",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: ligação entre participantes",
      "body": "Duas entidades mantêm o mesmo tipo de ativo. No cenário informado, uma vende rapidamente em grande volume, pressionando o preço; a outra vê o valor de sua carteira cair. O caso ilustra transmissão de uma tensão por preços. Não comprova quebra de ambas nem ilegalidade da atividade.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Intermediação não bancária: canal financeiro fora dos bancos tradicionais. Liquidez: capacidade de obter caixa. Descasamento: diferença entre prazos/características de recebimentos e pagamentos. Alavancagem: exposição ampliada com dívida ou mecanismo equivalente. Contágio: transmissão de tensão entre participantes.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Desenhe quem financia quem. Compare quando é preciso pagar e quando o caixa chega. Separe ativos, dívida e recursos próprios. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Um fundo reúne recursos e subscreve novos títulos de dívida emitidos por empresas no mercado primário, entregando recursos às emissoras. Qual leitura respeita o caso?",
      "options": [
        "A operação é criminosa só porque não é feita por banco.",
        "O nome fundo prova ausência de qualquer regra.",
        "Há financiamento por canal não bancário, sem prova de ilegalidade no enunciado.",
        "A operação não pode financiar empresas."
      ],
      "answer": 2,
      "explanation": "Descreve a atividade e preserva o limite da informação.",
      "optionRationales": [
        "A conclusão jurídica não decorre do canal.",
        "Modelos não bancários também podem ser regulados.",
        "Descreve a atividade e preserva o limite da informação.",
        "A subscrição da nova emissão entrega recursos às empresas no exemplo."
      ],
      "recoverySectionIds": [
        "conceito",
        "ex-canal"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp04.q01"
    },
    {
      "prompt": "Resgates curtos são prometidos, mas os ativos só geram caixa muito depois. Qual tensão merece atenção?",
      "options": [
        "Descompasso de prazo e liquidez.",
        "Ausência necessária de qualquer ativo.",
        "Garantia de lucro imediato.",
        "Proibição universal de fundos."
      ],
      "answer": 0,
      "explanation": "O tempo para pagar e o tempo para receber podem divergir.",
      "optionRationales": [
        "O tempo para pagar e o tempo para receber podem divergir.",
        "Existem ativos, embora seu caixa seja posterior.",
        "O descompasso não garante ganho.",
        "O caso é de risco, não de proibição universal."
      ],
      "recoverySectionIds": [
        "liquidez",
        "ex-resgate"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp04.q02"
    },
    {
      "prompt": "Uma carteira pode ter valor positivo e dificuldade de atender resgates imediatos porque:",
      "options": [
        "Todo ativo é dinheiro disponível.",
        "Patrimônio positivo elimina qualquer prazo.",
        "Resgate cria recursos sem venda ou recebimento.",
        "Converter ativos em caixa pode exigir tempo ou desconto."
      ],
      "answer": 3,
      "explanation": "Distingue valor econômico de disponibilidade imediata.",
      "optionRationales": [
        "Ativo pode ter prazo ou baixa liquidez.",
        "Valor não elimina o calendário dos fluxos.",
        "É preciso fonte de liquidez para pagar.",
        "Distingue valor econômico de disponibilidade imediata."
      ],
      "recoverySectionIds": [
        "liquidez"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp04.q03"
    },
    {
      "prompt": "No exemplo de R$20 próprios e R$80 de dívida, os ativos caem de R$100 para R$90. Mantida a dívida, quanto resta de recursos próprios?",
      "options": [
        "R$90.",
        "R$10.",
        "R$80.",
        "R$20."
      ],
      "answer": 1,
      "explanation": "90 menos 80 resulta em 10.",
      "optionRationales": [
        "Esse é o ativo antes de deduzir a obrigação.",
        "90 menos 80 resulta em 10.",
        "Esse é o valor da dívida.",
        "O capital inicial foi reduzido pela perda."
      ],
      "recoverySectionIds": [
        "ex-alavancagem"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp04.q04"
    },
    {
      "prompt": "A medida mais estreita do FSB, dentro do universo não bancário, procura:",
      "options": [
        "Funções com riscos como transformação de liquidez/prazos e alavancagem.",
        "Todas as lojas de qualquer setor.",
        "Somente bancos centrais.",
        "Provar que toda entidade não bancária é ilegal."
      ],
      "answer": 0,
      "explanation": "O recorte considera características de risco.",
      "optionRationales": [
        "O recorte considera características de risco.",
        "Ser não banco em sentido literal não define intermediação financeira.",
        "Não corresponde ao universo descrito.",
        "Monitoramento de risco não é acusação de ilegalidade."
      ],
      "recoverySectionIds": [
        "recorte"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp04.q05"
    },
    {
      "prompt": "Venda forçada por uma entidade reduz o preço de ativo também mantido por outra. O mecanismo ilustrado é:",
      "options": [
        "Garantia automática de quebra das duas.",
        "Eliminação da interdependência.",
        "Transmissão de tensão por preços e exposições comuns.",
        "Criação de moeda pelo fundo."
      ],
      "answer": 2,
      "explanation": "Identifica como o efeito alcança outro participante.",
      "optionRationales": [
        "O caso não traz esse desfecho.",
        "Há justamente uma ligação pelo ativo.",
        "Identifica como o efeito alcança outro participante.",
        "O exemplo trata de venda e preço."
      ],
      "recoverySectionIds": [
        "ex-contagio"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "dp04.q06"
    },
    {
      "prompt": "Qual frase é compatível com a aula?",
      "options": [
        "Toda atividade não bancária opera sem regras.",
        "Há diversidade de modelos e regras; o risco depende da atividade e da estrutura.",
        "Só bancos podem participar de qualquer financiamento.",
        "Todo fundo tem resgate imediato e ativos longos."
      ],
      "answer": 1,
      "explanation": "Preserva a heterogeneidade do universo.",
      "optionRationales": [
        "Confunde fora dos bancos com fora da regulação.",
        "Preserva a heterogeneidade do universo.",
        "Ignora os canais não bancários apresentados.",
        "Generaliza condições de um exemplo."
      ],
      "recoverySectionIds": [
        "conceito",
        "recorte"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "id": "dp04.q07"
    },
    {
      "prompt": "Um aluno tratou ativo de R$90 como capital próprio de R$90, ignorando R$80 de dívida. Qual retomada é adequada?",
      "options": [
        "Apagar a dívida do enunciado.",
        "Usar apenas o nome da entidade.",
        "Concluir que não houve perda.",
        "Separar ativos e obrigações e refazer o saldo residual."
      ],
      "answer": 3,
      "explanation": "Corrige a confusão entre ativo e recursos próprios.",
      "optionRationales": [
        "Distorce a hipótese.",
        "O nome não resolve a conta.",
        "O capital caiu de 20 para 10.",
        "Corrige a confusão entre ativo e recursos próprios."
      ],
      "recoverySectionIds": [
        "ex-alavancagem",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp04.q08"
    }
  ],
  "recall": [
    "Desenhe quem financia quem.",
    "Compare quando é preciso pagar e quando o caixa chega.",
    "Separe ativos, dívida e recursos próprios."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp04.q01": [
        {
          "missionId": "draft.dp04",
          "sectionId": "conceito"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-canal"
        }
      ],
      "dp04.q02": [
        {
          "missionId": "draft.dp04",
          "sectionId": "liquidez"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-resgate"
        }
      ],
      "dp04.q03": [
        {
          "missionId": "draft.dp04",
          "sectionId": "liquidez"
        }
      ],
      "dp04.q04": [
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-alavancagem"
        }
      ],
      "dp04.q05": [
        {
          "missionId": "draft.dp04",
          "sectionId": "recorte"
        }
      ],
      "dp04.q06": [
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-contagio"
        }
      ],
      "dp04.q07": [
        {
          "missionId": "draft.dp04",
          "sectionId": "conceito"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "recorte"
        }
      ],
      "dp04.q08": [
        {
          "missionId": "draft.dp04",
          "sectionId": "ex-alavancagem"
        },
        {
          "missionId": "draft.dp04",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Autoria concluída; revisão pedagógica independente pendente; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades 7",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 9",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Reconhecer intermediação financeira fora do sistema bancário tradicional.",
    "O2": "Separar atividade não bancária de ilegalidade ou ausência de regras.",
    "O3": "Identificar descasamento entre resgate e realização de ativos.",
    "O4": "Reconhecer alavancagem e transmissão de tensões.",
    "O5": "Distinguir universo amplo não bancário de subconjunto monitorado por riscos.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Terminologia histórica de edital relacionada ao monitoramento atual do FSB; não há classificação de entidades reais.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Ativos menos dívida",
    "operation": "subtract",
    "values": [
      90,
      80
    ],
    "expected": 10
  },
  {
    "label": "Perda relativa do capital",
    "operation": "divide",
    "values": [
      10,
      20
    ],
    "expected": 0.5
  }
];
