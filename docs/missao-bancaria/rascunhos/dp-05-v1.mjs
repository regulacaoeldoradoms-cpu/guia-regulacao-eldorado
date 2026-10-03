export const SOURCES = [
  {
    "id": "bcb.dp.spb",
    "label": "BCB — Sistema de Pagamentos Brasileiro",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/spb",
    "locator": "Infraestruturas, arranjos e participantes",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.dp.arranjos",
    "label": "BCB — Arranjos de pagamento",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/arranjospagamento",
    "locator": "Conceito e distinção entre arranjo, participantes e instituições",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DP05_DRAFT = {
  "id": "draft.dp05",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-05",
  "title": "SPB, arranjos e participantes dos pagamentos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar sistema, regras de um arranjo e participantes.",
  "sourceIds": [
    "bcb.dp.spb",
    "bcb.dp.arranjos"
  ],
  "sections": [
    {
      "id": "spb",
      "type": "explanation",
      "heading": "1. A estrutura por trás da tela",
      "body": "Uma transferência envolve mais que o aplicativo visto pelo usuário. O SPB reúne infraestruturas do mercado financeiro e arranjos de pagamento. Infraestruturas organizam atividades como liquidação e registro; arranjos estabelecem regras para serviços de pagamento. Essa visão permite separar o conjunto de regras e sistemas das entidades que participam deles.",
      "sourceIds": [
        "bcb.dp.spb"
      ]
    },
    {
      "id": "ex-camadas",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: três camadas",
      "body": "Uma tela recebe uma ordem, instituições processam a operação e a transferência se conclui segundo regras comuns. A tela é o canal; as instituições são participantes; as regras pertencem ao arranjo. A descrição de um canal não explica, sozinha, toda a infraestrutura.",
      "sourceIds": []
    },
    {
      "id": "arranjo",
      "type": "explanation",
      "heading": "3. Arranjo é um conjunto de regras",
      "body": "Um arranjo disciplina como determinado serviço de pagamento funciona e como seus participantes se relacionam. Não é sinônimo da empresa de quem o usuário é cliente. Na compra com cartão, regras comuns permitem a interação entre quem paga, quem recebe e os prestadores envolvidos. Pix e arranjos de cartões são exemplos apresentados pelo BCB.",
      "sourceIds": [
        "bcb.dp.arranjos",
        "bcb.dp.spb"
      ]
    },
    {
      "id": "ex-cartao",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: aceitação",
      "body": "No caso fictício, uma loja aceita o arranjo do cartão apresentado pelo comprador. A compatibilidade permite iniciar aquela compra conforme as regras aplicáveis. Isso não obriga toda loja a aceitar qualquer cartão nem garante a autorização de cada compra: ainda podem existir condições específicas da operação.",
      "sourceIds": []
    },
    {
      "id": "participantes",
      "type": "explanation",
      "heading": "5. Quem faz o quê?",
      "body": "O instituidor organiza o arranjo; os participantes executam papéis previstos nas regras. Instituições financeiras e instituições de pagamento podem participar de serviços de pagamento. Uma instituição de pagamento não vira banco apenas por participar de um arranjo; a natureza da instituição e a atividade devem ser identificadas separadamente.",
      "sourceIds": [
        "bcb.dp.arranjos",
        "bcb.dp.spb"
      ]
    },
    {
      "id": "ex-instituicao",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: mesma função, entidades distintas",
      "body": "O enunciado informa que um banco e uma instituição de pagamento prestam um serviço no mesmo arranjo. Compartilhar regras daquele serviço não torna iguais todas as suas atividades permitidas. A comparação correta observa a função comum sem apagar a diferença entre as instituições.",
      "sourceIds": []
    },
    {
      "id": "etapas",
      "type": "explanation",
      "heading": "7. Solicitar não é concluir",
      "body": "Para acompanhar uma operação, distinga a ordem do usuário, o processamento e a liquidação, entendida aqui como conclusão da transferência das obrigações ou recursos segundo as regras do sistema. Uma mensagem “solicitação recebida” não comprova por si só a liquidação. O significado do estado exibido deve ser lido no caso, sem inventar sucesso.",
      "sourceIds": [
        "bcb.dp.spb"
      ]
    },
    {
      "id": "ex-estado",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: evidência incompleta",
      "body": "Uma tela diz “ordem recebida para processamento”, sem informar resultado. É correto dizer que a solicitação entrou no fluxo. É incorreto concluir que o recebedor já dispõe dos recursos. Uma confirmação explícita de conclusão daria evidência diferente; a aula não realiza pagamentos reais.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "SPB: conjunto de infraestruturas e arranjos. Arranjo: regras de um serviço de pagamento. Instituidor: organizador do arranjo. Participante: entidade que exerce papel nele. Liquidação: conclusão financeira segundo as regras aplicáveis.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Desenhe canal, regras e participantes em linhas separadas. Leia o estado da operação antes de concluir que houve liquidação. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "O SPB, conforme a apresentação do BCB usada nesta aula, abrange:",
      "options": [
        "Somente aplicativos de celular.",
        "Infraestruturas do mercado financeiro e arranjos de pagamento.",
        "Apenas uma empresa emissora de cartões.",
        "Exclusivamente papel-moeda."
      ],
      "answer": 1,
      "explanation": "São os dois segmentos apresentados.",
      "optionRationales": [
        "Canal é apenas parte da experiência visível.",
        "São os dois segmentos apresentados.",
        "O conjunto é mais amplo que um prestador.",
        "Pagamentos e infraestruturas não se resumem a cédulas."
      ],
      "recoverySectionIds": [
        "spb"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp05.q01"
    },
    {
      "prompt": "O conjunto de regras e procedimentos de um serviço de pagamento é:",
      "options": [
        "O saldo de um usuário.",
        "Uma agência física.",
        "Necessariamente um banco.",
        "Um arranjo de pagamento."
      ],
      "answer": 3,
      "explanation": "Corresponde ao conceito ensinado.",
      "optionRationales": [
        "Saldo é valor em conta.",
        "Local de atendimento não é o conjunto de regras.",
        "Regras e instituição são dimensões distintas.",
        "Corresponde ao conceito ensinado."
      ],
      "recoverySectionIds": [
        "arranjo"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp05.q02"
    },
    {
      "prompt": "Banco e instituição de pagamento participam do mesmo arranjo. Isso permite concluir que:",
      "options": [
        "Exercem papéis sob regras comuns daquele serviço, sem identidade de todas as atividades.",
        "Ambos se tornaram bancos centrais.",
        "Todas as atividades permitidas às duas entidades são idênticas.",
        "Nenhuma regra é necessária."
      ],
      "answer": 0,
      "explanation": "Preserva função comum e natureza distinta.",
      "optionRationales": [
        "Preserva função comum e natureza distinta.",
        "Participar não cria autoridade monetária.",
        "O arranjo não iguala toda a autorização institucional.",
        "A participação ocorre justamente sob regras."
      ],
      "recoverySectionIds": [
        "participantes",
        "ex-instituicao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp05.q03"
    },
    {
      "prompt": "“Ordem recebida para processamento”, sem outro resultado, comprova:",
      "options": [
        "Liquidação e crédito final ao recebedor.",
        "Lucro do recebedor.",
        "Entrada da solicitação no fluxo, sem comprovar conclusão.",
        "Fim de todas as obrigações da compra."
      ],
      "answer": 2,
      "explanation": "Respeita o estado informado.",
      "optionRationales": [
        "Acrescenta etapa não confirmada.",
        "Pagamento e lucro são conceitos distintos.",
        "Respeita o estado informado.",
        "O texto não confirma nem a conclusão financeira."
      ],
      "recoverySectionIds": [
        "etapas",
        "ex-estado"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp05.q04"
    },
    {
      "prompt": "Em um exemplo, o usuário toca em um botão no aplicativo. A tela é:",
      "options": [
        "Todo o SPB.",
        "O canal visível, sem representar sozinha as regras e infraestruturas.",
        "O instituidor de qualquer arranjo.",
        "Prova de liquidação."
      ],
      "answer": 1,
      "explanation": "Separa interface e sistema subjacente.",
      "optionRationales": [
        "Há participantes e infraestruturas além da tela.",
        "Separa interface e sistema subjacente.",
        "Uma tela não identifica esse papel.",
        "O toque pode apenas iniciar uma solicitação."
      ],
      "recoverySectionIds": [
        "ex-camadas"
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "id": "dp05.q05"
    },
    {
      "prompt": "Uma loja aceita determinado arranjo de cartão. Qual conclusão adicional não decorre disso?",
      "options": [
        "Há compatibilidade descrita para iniciar a compra.",
        "Regras comuns organizam o serviço.",
        "Outras condições podem ser relevantes.",
        "Todas as compras com qualquer cartão estão garantidas."
      ],
      "answer": 3,
      "explanation": "Generaliza além da aceitação descrita.",
      "optionRationales": [
        "É a compatibilidade informada.",
        "Corresponde ao papel do arranjo.",
        "Aceitação não elimina condições da operação.",
        "Generaliza além da aceitação descrita."
      ],
      "recoverySectionIds": [
        "ex-cartao"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "dp05.q06"
    },
    {
      "prompt": "Qual papel é associado à organização das regras do arranjo?",
      "options": [
        "O instituidor do arranjo.",
        "Todo comprador individual, sozinho.",
        "A mercadoria comprada.",
        "O saldo da conta."
      ],
      "answer": 0,
      "explanation": "É o papel organizador apresentado.",
      "optionRationales": [
        "É o papel organizador apresentado.",
        "O usuário adere ao serviço; não define sozinho suas regras.",
        "Produto comercial não organiza o arranjo.",
        "Saldo é valor, não entidade organizadora."
      ],
      "recoverySectionIds": [
        "participantes"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp05.q07"
    },
    {
      "prompt": "Quem confundiu instituição com arranjo deve retomar:",
      "options": [
        "A cor do cartão, sem olhar os papéis.",
        "A suposição de que toda tela é um banco.",
        "A separação entre regras do serviço e entidades participantes.",
        "A ideia de que aceitar um cartão garante qualquer compra."
      ],
      "answer": 2,
      "explanation": "Reconstrói os conceitos necessários.",
      "optionRationales": [
        "Cor não resolve a distinção.",
        "Repete confusão entre canal e entidade.",
        "Reconstrói os conceitos necessários.",
        "Acrescenta outra generalização."
      ],
      "recoverySectionIds": [
        "arranjo",
        "participantes",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp05.q08"
    }
  ],
  "recall": [
    "Desenhe canal, regras e participantes em linhas separadas.",
    "Leia o estado da operação antes de concluir que houve liquidação."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp05-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp05.q01": [
        {
          "missionId": "draft.dp05",
          "sectionId": "spb"
        }
      ],
      "dp05.q02": [
        {
          "missionId": "draft.dp05",
          "sectionId": "arranjo"
        }
      ],
      "dp05.q03": [
        {
          "missionId": "draft.dp05",
          "sectionId": "participantes"
        },
        {
          "missionId": "draft.dp05",
          "sectionId": "ex-instituicao"
        }
      ],
      "dp05.q04": [
        {
          "missionId": "draft.dp05",
          "sectionId": "etapas"
        },
        {
          "missionId": "draft.dp05",
          "sectionId": "ex-estado"
        }
      ],
      "dp05.q05": [
        {
          "missionId": "draft.dp05",
          "sectionId": "ex-camadas"
        }
      ],
      "dp05.q06": [
        {
          "missionId": "draft.dp05",
          "sectionId": "ex-cartao"
        }
      ],
      "dp05.q07": [
        {
          "missionId": "draft.dp05",
          "sectionId": "participantes"
        }
      ],
      "dp05.q08": [
        {
          "missionId": "draft.dp05",
          "sectionId": "arranjo"
        },
        {
          "missionId": "draft.dp05",
          "sectionId": "participantes"
        },
        {
          "missionId": "draft.dp05",
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
      "item": "Atualidades 12",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 38",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar sistema, regras de um arranjo e participantes.",
    "O2": "Reconhecer a função das infraestruturas de pagamento.",
    "O3": "Distinguir arranjo de pagamento de instituição.",
    "O4": "Identificar papéis nos casos de pagamento.",
    "O5": "Distinguir instrução, processamento e conclusão pelos dados disponíveis.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Introdução; não cobre classificação regulatória completa, modelos de liquidação ou exceções de arranjos não integrantes do SPB.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
