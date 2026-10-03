export const SOURCES = [
  {
    "id": "bcb.dp.pix",
    "label": "BCB — Pix",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/pix",
    "locator": "Conceito, disponibilidade e contas; não tarifas/limites/exceções operacionais",
    "version": "Página oficial consultada em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DP06_DRAFT = {
  "id": "draft.dp06",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-06",
  "title": "Pix: transferência, conta e confirmação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Reconhecer Pix como sistema de pagamento instantâneo.",
  "sourceIds": [
    "bcb.dp.pix"
  ],
  "sections": [
    {
      "id": "conceito",
      "type": "explanation",
      "heading": "1. O que o Pix faz",
      "body": "Pix permite transferir recursos entre contas em poucos segundos e funciona todos os dias, a qualquer hora. Não é uma conta nova nem uma moeda diferente do real. O BCB apresenta seu uso a partir de contas correntes, de poupança ou pré-pagas. A disponibilidade do sistema não elimina a necessidade de condições válidas para cada transação.",
      "sourceIds": [
        "bcb.dp.pix"
      ]
    },
    {
      "id": "ex-conta",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: saldo e transferência",
      "body": "No cenário fictício, Joana tem R$180 disponíveis e conclui um Pix de R$50, sem tarifa ou outro lançamento. Seu saldo passa a R$130. O Pix movimentou recursos; não criou R$50 adicionais e não demonstra concessão de empréstimo.",
      "sourceIds": []
    },
    {
      "id": "disponibilidade",
      "type": "explanation",
      "heading": "3. Funcionar todos os dias não significa aprovar tudo",
      "body": "A operação pode depender de saldo, dados corretos e controles aplicáveis. A aula não fixa limites, tarifas nem regras de devolução. “O sistema está disponível” descreve o serviço; “esta transferência foi concluída” descreve uma operação específica. São afirmações diferentes.",
      "sourceIds": [
        "bcb.dp.pix"
      ]
    },
    {
      "id": "ex-horario",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: domingo",
      "body": "Um Pix é solicitado no domingo. O dia, por si só, não impõe esperar uma agência abrir, pois o sistema tem disponibilidade contínua. Se o caso não informa a conclusão, não é possível deduzir que a transferência ocorreu apenas por ser um serviço instantâneo.",
      "sourceIds": []
    },
    {
      "id": "agendamento",
      "type": "explanation",
      "heading": "5. Agendar é instruir para depois",
      "body": "Pix agendado envolve uma instrução para data futura. A tela de agendamento registra essa intenção; não é prova de que o recebedor já recebeu. Compare o estado e a data da operação. Esta aula não detalha modalidades recorrentes nem regras técnicas de execução.",
      "sourceIds": [
        "bcb.dp.pix"
      ]
    },
    {
      "id": "ex-agenda",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: hoje e amanhã",
      "body": "Na terça-feira, a tela confirma um agendamento para quarta-feira. O fato comprovado na terça é o agendamento. Não há base para tratar os recursos como recebidos na terça. Mesmo no dia previsto, a conclusão deve ser identificada pelo resultado informado.",
      "sourceIds": []
    },
    {
      "id": "conferencia",
      "type": "explanation",
      "heading": "7. Ler antes de confirmar",
      "body": "Em uma situação didática, o enunciado pode mostrar valor e destinatário para conferência. A existência de tecnologia de pagamento não substitui essa leitura. Rapidez não demonstra que toda informação digitada está correta, nem garante recuperação de qualquer erro. Não fazemos promessa de estorno ou de solução para casos reais.",
      "sourceIds": [
        "bcb.dp.pix"
      ]
    },
    {
      "id": "ex-dados",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: valor diferente",
      "body": "O combinado fictício é R$35; a tela mostra R$350 antes da confirmação. A divergência está no valor. Identificá-la antes de confirmar enfrenta o problema descrito; presumir que a rapidez do Pix corrigirá a quantia não tem base.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Pix: sistema de pagamento instantâneo. Conta: onde se registra o saldo. Agendamento: instrução para data futura. Conclusão: resultado da operação, distinto da mera solicitação.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Separe saldo, sistema e operação. Leia data, estado, valor e destinatário informados antes de concluir. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Pix é apresentado nesta aula como:",
      "options": [
        "Uma conta obrigatória separada.",
        "Um empréstimo automático.",
        "Um sistema de pagamento instantâneo entre contas.",
        "Uma moeda distinta do real."
      ],
      "answer": 2,
      "explanation": "É a função geral descrita pelo BCB.",
      "optionRationales": [
        "Pode ser usado a partir de contas já existentes.",
        "Transferência não implica crédito concedido.",
        "É a função geral descrita pelo BCB.",
        "O sistema não é nova unidade monetária."
      ],
      "recoverySectionIds": [
        "conceito"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp06.q01"
    },
    {
      "prompt": "Saldo de R$180, Pix concluído de R$50 e nenhum outro lançamento: qual saldo resulta?",
      "options": [
        "R$130.",
        "R$230.",
        "R$50.",
        "R$180."
      ],
      "answer": 0,
      "explanation": "180 menos 50 resulta em 130.",
      "optionRationales": [
        "180 menos 50 resulta em 130.",
        "Soma indevidamente o valor enviado.",
        "Confunde valor enviado com saldo residual.",
        "Ignora a transferência concluída."
      ],
      "recoverySectionIds": [
        "ex-conta"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "dp06.q02"
    },
    {
      "prompt": "Qual leitura é adequada para um Pix solicitado no domingo, sem resultado informado?",
      "options": [
        "Só pode funcionar em dia útil.",
        "Obrigatoriamente já foi concluído.",
        "Cria crédito se faltar saldo.",
        "O sistema funciona nesse dia, mas falta comprovação do resultado da operação."
      ],
      "answer": 3,
      "explanation": "Separa disponibilidade do sistema e resultado específico.",
      "optionRationales": [
        "Contradiz a disponibilidade contínua.",
        "Instantaneidade não substitui evidência de conclusão.",
        "Não se pode inferir empréstimo.",
        "Separa disponibilidade do sistema e resultado específico."
      ],
      "recoverySectionIds": [
        "disponibilidade",
        "ex-horario"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp06.q03"
    },
    {
      "prompt": "Uma tela na terça confirma Pix agendado para quarta. O que está comprovado naquele momento?",
      "options": [
        "Recebimento na terça.",
        "Agendamento para a data futura.",
        "Conclusão automática de qualquer outra transferência.",
        "Aumento de saldo por empréstimo."
      ],
      "answer": 1,
      "explanation": "É o estado descrito.",
      "optionRationales": [
        "Agendar não prova recebimento imediato.",
        "É o estado descrito.",
        "A tela não trata de outras operações.",
        "Não há crédito informado."
      ],
      "recoverySectionIds": [
        "agendamento",
        "ex-agenda"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp06.q04"
    },
    {
      "prompt": "O combinado é R$35 e a tela mostra R$350 antes da confirmação. Qual é a divergência?",
      "options": [
        "No valor, que deve ser conferido.",
        "Na definição de moeda nacional.",
        "Na impossibilidade de Pix aos domingos.",
        "Na garantia de correção automática pelo sistema."
      ],
      "answer": 0,
      "explanation": "Compara corretamente os dois números.",
      "optionRationales": [
        "Compara corretamente os dois números.",
        "O caso não muda a moeda.",
        "O dia não é o problema descrito.",
        "Não existe essa garantia no caso."
      ],
      "recoverySectionIds": [
        "conferencia",
        "ex-dados"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp06.q05"
    },
    {
      "prompt": "A disponibilidade do Pix todos os dias permite concluir que:",
      "options": [
        "Todas as solicitações passam por qualquer controle.",
        "Toda conta tem saldo suficiente.",
        "O serviço pode ser usado nesses dias, observadas as condições da operação.",
        "Nenhum dado precisa ser conferido."
      ],
      "answer": 2,
      "explanation": "Mantém a distinção central.",
      "optionRationales": [
        "Disponibilidade não dispensa controles.",
        "Saldo é condição específica da conta.",
        "Mantém a distinção central.",
        "Rapidez não substitui leitura."
      ],
      "recoverySectionIds": [
        "disponibilidade"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "dp06.q06"
    },
    {
      "prompt": "Segundo a apresentação geral do BCB, o Pix pode movimentar recursos a partir de:",
      "options": [
        "Somente uma conta com o nome Pix.",
        "Contas correntes, de poupança ou pré-pagas.",
        "Somente dinheiro em papel.",
        "Somente empréstimos novos."
      ],
      "answer": 1,
      "explanation": "São as categorias citadas na fonte.",
      "optionRationales": [
        "Não exige criar uma categoria de conta chamada Pix.",
        "São as categorias citadas na fonte.",
        "O sistema transfere entre contas.",
        "Origem dos recursos não exige empréstimo."
      ],
      "recoverySectionIds": [
        "conceito"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp06.q07"
    },
    {
      "prompt": "Um aluno apresentou agendamento como prova de recebimento. Qual retomada resolve a confusão?",
      "options": [
        "Supor que todo agendamento já liquidou.",
        "Trocar apenas o nome do recebedor.",
        "Ignorar a data da tela.",
        "Separar data da instrução, data prevista e estado de conclusão."
      ],
      "answer": 3,
      "explanation": "Reconstrói as etapas e sua evidência.",
      "optionRationales": [
        "Repete o erro.",
        "O nome não muda a etapa.",
        "A data é parte da informação necessária.",
        "Reconstrói as etapas e sua evidência."
      ],
      "recoverySectionIds": [
        "agendamento",
        "ex-agenda",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp06.q08"
    }
  ],
  "recall": [
    "Separe saldo, sistema e operação.",
    "Leia data, estado, valor e destinatário informados antes de concluir."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp06-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp06.q01": [
        {
          "missionId": "draft.dp06",
          "sectionId": "conceito"
        }
      ],
      "dp06.q02": [
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-conta"
        }
      ],
      "dp06.q03": [
        {
          "missionId": "draft.dp06",
          "sectionId": "disponibilidade"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-horario"
        }
      ],
      "dp06.q04": [
        {
          "missionId": "draft.dp06",
          "sectionId": "agendamento"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-agenda"
        }
      ],
      "dp06.q05": [
        {
          "missionId": "draft.dp06",
          "sectionId": "conferencia"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-dados"
        }
      ],
      "dp06.q06": [
        {
          "missionId": "draft.dp06",
          "sectionId": "disponibilidade"
        }
      ],
      "dp06.q07": [
        {
          "missionId": "draft.dp06",
          "sectionId": "conceito"
        }
      ],
      "dp06.q08": [
        {
          "missionId": "draft.dp06",
          "sectionId": "agendamento"
        },
        {
          "missionId": "draft.dp06",
          "sectionId": "ex-agenda"
        },
        {
          "missionId": "draft.dp06",
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
      "item": "Atualidades 13",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 12",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Reconhecer Pix como sistema de pagamento instantâneo.",
    "O2": "Separar Pix de conta, empréstimo e moeda nova.",
    "O3": "Interpretar disponibilidade geral sem garantir toda operação.",
    "O4": "Distinguir agendamento de transferência concluída.",
    "O5": "Conferir os dados descritos sem prometer irreversibilidade ou recuperação automática.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Sem tarifas, limites, cadastro de dispositivos, modalidades avançadas ou regras de devolução; não orienta operação real.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Saldo após transferência",
    "operation": "subtract",
    "values": [
      180,
      50
    ],
    "expected": 130
  }
];
