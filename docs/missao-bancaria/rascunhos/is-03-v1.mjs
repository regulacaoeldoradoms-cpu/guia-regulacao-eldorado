// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.fgts",
    "label": "Planalto — Lei 8.036/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm",
    "locator": "Arts. 2º, 4º, 5º, 7º e 15, caput e § 7º; agentes, contas vinculadas e alíquotas dos casos delimitados",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS03_DRAFT = {
  "id": "draft.is03",
  "topicId": "draft.is03",
  "editorialKey": "IS-03",
  "candidateBlockId": "banking.institution-specific",
  "title": "FGTS: contas vinculadas, agentes e depósito",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar fundo, conta vinculada, funções institucionais e depósito do empregador, calculando casos delimitados.",
  "sourceIds": [
    "lei.is.fgts"
  ],
  "sections": [
    {
      "id": "fundo",
      "heading": "1. Fundo e conta vinculada",
      "body": "FGTS significa Fundo de Garantia do Tempo de Serviço. A Lei 8.036 define sua constituição com saldos de contas vinculadas e outros recursos. Uma conta vinculada ao trabalhador se relaciona com esse regime legal: não é uma conta corrente comum que se movimenta livremente por qualquer motivo. Existir saldo é diferente de satisfazer uma hipótese legal para utilização ou saque.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "ex-conta",
      "heading": "2. Exemplo resolvido: saldo e disponibilidade",
      "body": "Uma ficha didática informa R$ 2.000 de saldo em conta vinculada e nada informa sobre hipótese de saque. Há dado de saldo. Não podemos concluir que todo o valor está disponível para retirada imediata. O raciocínio separa existência de recursos e condições de movimentação; as hipóteses serão ensinadas em IS-04.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "agentes",
      "heading": "3. Funções distintas no sistema",
      "body": "A CAIXA é agente operador do FGTS. Entre suas funções estão centralizar recursos, manter/controlar contas vinculadas e emitir extratos. O Conselho Curador estabelece diretrizes e exerce atribuições próprias previstas em lei. O órgão do Executivo responsável pela política de habitação é gestor da aplicação dos recursos. Operar contas, estabelecer diretrizes e gerir a aplicação não são expressões intercambiáveis.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "ex-agentes",
      "heading": "4. Exemplo resolvido: reconhecer a função",
      "body": "O caso pede a entidade que mantém e controla as contas vinculadas, conforme a lei. Essa tarefa remete à CAIXA como agente operador. Se a pergunta descrevesse atribuição de estabelecer diretrizes do Conselho Curador, o nome não seria trocado por CAIXA apenas porque ela participa do sistema. Leia o verbo e a atribuição, como no SFN.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "deposito",
      "heading": "5. Depósito e base informada",
      "body": "Para o caso geral do art. 15, o empregador deposita 8% da remuneração que integra a base legal. O exercício fornecerá a base já delimitada, evitando decidir se cada verba concreta a integra. Para contratos de aprendizagem, o § 7º reduz essa alíquota a 2%. A existência dessa hipótese já impede dizer que 8% vale para todos os contratos. Depósito devido não prova, sozinho, que o recolhimento ocorreu.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "ex-oito",
      "heading": "6. Exemplo resolvido: caso geral com base delimitada",
      "body": "Considere vínculo submetido à regra geral de 8% e base de incidência já informada de R$ 2.000. Porcentagem significa fração de 100: 8% = 8 ÷ 100 = 0,08. O depósito do exemplo é 2.000 × 0,08 = R$ 160. O cálculo é da obrigação do caso; só um dado adicional de recolhimento comprovaria pagamento efetivo.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "ex-dois",
      "heading": "7. Exemplo resolvido: aprendizagem",
      "body": "O caso informa expressamente contrato de aprendizagem e base de incidência de R$ 1.200. A alíquota ensinada para essa hipótese é 2%, ou 0,02. Assim, 1.200 × 0,02 = R$ 24. Aplicar automaticamente 8% produziria R$ 96, mas ignoraria a classificação explicitada no enunciado. Não extrapolamos essa hipótese a categorias não ensinadas.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "evidencia",
      "heading": "8. Obrigações, registro e interpretação",
      "body": "Um valor calculado é evidência de uma operação matemática, não de cumprimento da obrigação. Um extrato fictício que mostra depósito registrado oferece outra informação: recolhimento no caso descrito. Nenhuma dessas informações, sozinha, demonstra todas as condições de saque ou a regularidade global do empregador. Certificado de regularidade e guia de recolhimento terão recortes próprios; não vamos tratá-los como sinônimos de saldo.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.fgts"
      ]
    },
    {
      "id": "glossario",
      "heading": "Glossário",
      "body": "**Programa:** estrutura de objetivos e regras. **Benefício:** prestação prevista para quem satisfaz condições. **Ano-base:** período usado para verificar dados. **Operador/pagador:** entidade que executa funções atribuídas; não elimina requisitos legais. **Hipótese didática:** dado fixado para resolver um exercício, sem prometer resultado de um pedido real.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "Resumo e recuperação",
      "body": "Identifique primeiro o objeto e o período. Depois separe pessoa interessada, requisitos e função da instituição. Se errar uma distinção, releia o trecho indicado, refaça o exemplo em palavras próprias e explique por que a alternativa escolhida excedeu os dados. Conclusão da prática não prova retenção nem autoriza uma operação real.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual é o objeto tratado e qual período foi informado?",
    "Que conclusão depende de requisito adicional?",
    "Como você resolveria novamente o exemplo sem olhar o gabarito?"
  ],
  "questions": [
    {
      "id": "is03.q01",
      "prompt": "Qual distinção descreve a conta vinculada do FGTS neste recorte?",
      "options": [
        "Relaciona-se ao regime legal do fundo, não sendo conta corrente de movimentação livre.",
        "É conta corrente livre para qualquer retirada.",
        "É sempre a mesma coisa que abono salarial.",
        "É uma carteira de criptomoeda por definição."
      ],
      "answer": 0,
      "explanation": "Respeita o objeto e as condições legais.",
      "optionRationales": [
        "Respeita o objeto e as condições legais.",
        "Ignora a vinculação e as hipóteses de movimentação.",
        "FGTS e abono são distintos.",
        "Não há essa definição."
      ],
      "recoverySectionIds": [
        "fundo"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is03.q02",
      "prompt": "Um saldo de R$ 2.000 é informado, sem hipótese de saque. O que se pode concluir?",
      "options": [
        "O valor inteiro pode ser retirado hoje.",
        "Há saldo, mas os dados não comprovam direito ao saque imediato.",
        "Não existe conta vinculada.",
        "O empregador está regular em todas as obrigações."
      ],
      "answer": 1,
      "explanation": "Separa existência de recursos e autorização legal.",
      "optionRationales": [
        "Saldo não substitui condição de movimentação.",
        "Separa existência de recursos e autorização legal.",
        "A ficha informa o saldo da conta.",
        "Não se demonstrou regularidade global."
      ],
      "recoverySectionIds": [
        "fundo",
        "ex-conta"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is03.q03",
      "prompt": "A manutenção e o controle das contas vinculadas remetem a qual função?",
      "options": [
        "Copom como pagador de benefícios.",
        "CVM como empregadora.",
        "CAIXA como agente operador do FGTS.",
        "Banco do Brasil como único supervisor do SFN."
      ],
      "answer": 2,
      "explanation": "É a atribuição do art. 7º utilizada na aula.",
      "optionRationales": [
        "Copom não exerce a tarefa.",
        "Não é atribuição da CVM descrita.",
        "É a atribuição do art. 7º utilizada na aula.",
        "Não existe essa função no recorte."
      ],
      "recoverySectionIds": [
        "agentes",
        "ex-agentes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is03.q04",
      "prompt": "Qual leitura separa os papéis institucionais?",
      "options": [
        "Operador e Conselho Curador são sempre a mesma entidade.",
        "Todo saldo pessoal decide a política de habitação.",
        "Um aplicativo substitui os órgãos previstos em lei.",
        "CAIXA opera; Conselho Curador e gestor da aplicação têm atribuições distintas."
      ],
      "answer": 3,
      "explanation": "Reconhece os agentes sem trocar suas funções.",
      "optionRationales": [
        "Participação no sistema não elimina funções distintas.",
        "Saldo de conta não é função institucional.",
        "O canal não substitui a organização legal.",
        "Reconhece os agentes sem trocar suas funções."
      ],
      "recoverySectionIds": [
        "agentes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is03.q05",
      "prompt": "Caso geral de 8%, com base de incidência explicitamente fixada em R$ 2.000: qual depósito é calculado?",
      "options": [
        "R$ 160.",
        "R$ 16.",
        "R$ 2.160.",
        "R$ 8 independentemente da base."
      ],
      "answer": 0,
      "explanation": "2.000 × 0,08 = 160.",
      "optionRationales": [
        "2.000 × 0,08 = 160.",
        "Aplica 0,8%, não 8%.",
        "Soma à base em vez de calcular a parcela.",
        "Ignora a base e a porcentagem."
      ],
      "recoverySectionIds": [
        "deposito",
        "ex-oito"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is03.q06",
      "prompt": "Contrato de aprendizagem e base de incidência de R$ 1.200: qual resultado aplica a hipótese ensinada?",
      "options": [
        "R$ 96 pela regra universal de 8%.",
        "R$ 24 pela alíquota de 2%.",
        "R$ 1.202 por soma de números.",
        "R$ 12 porque sempre se aplica 1%."
      ],
      "answer": 1,
      "explanation": "1.200 × 0,02 = 24.",
      "optionRationales": [
        "Ignora a hipótese de aprendizagem.",
        "1.200 × 0,02 = 24.",
        "Porcentagem não é somar dois reais à base.",
        "A alíquota ensinada é 2%."
      ],
      "recoverySectionIds": [
        "deposito",
        "ex-dois"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is03.q07",
      "prompt": "O aluno encontrou R$ 160 como depósito devido. O enunciado não informa recolhimento. Qual inferência preserva os dados?",
      "options": [
        "O depósito já foi pago.",
        "Todo saldo já pode ser sacado.",
        "O cálculo não comprova, sozinho, recolhimento efetivo.",
        "Todas as obrigações do empregador estão regulares."
      ],
      "answer": 2,
      "explanation": "Distingue cálculo e evidência de cumprimento.",
      "optionRationales": [
        "Obrigação calculada não é registro de pagamento.",
        "Saque tem outras condições.",
        "Distingue cálculo e evidência de cumprimento.",
        "Um cálculo não comprova regularidade global."
      ],
      "recoverySectionIds": [
        "evidencia",
        "ex-oito"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is03.q08",
      "prompt": "Qual generalização precisa ser corrigida pela própria aula?",
      "options": [
        "Ler a base informada antes de calcular.",
        "Separar fundo e conta corrente.",
        "Identificar a função do agente operador.",
        "Aplicar 8% a todo contrato, mesmo quando há aprendizagem expressamente informada."
      ],
      "answer": 3,
      "explanation": "Contraria a exceção de 2% ensinada e exige recuperar o enquadramento.",
      "optionRationales": [
        "É a prática correta ensinada.",
        "É a distinção correta.",
        "É necessário ler a atribuição.",
        "Contraria a exceção de 2% ensinada e exige recuperar o enquadramento."
      ],
      "recoverySectionIds": [
        "deposito",
        "ex-dois"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is03.q01": [
        {
          "missionId": "draft.is03",
          "sectionId": "fundo"
        }
      ],
      "is03.q02": [
        {
          "missionId": "draft.is03",
          "sectionId": "fundo"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-conta"
        }
      ],
      "is03.q03": [
        {
          "missionId": "draft.is03",
          "sectionId": "agentes"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-agentes"
        }
      ],
      "is03.q04": [
        {
          "missionId": "draft.is03",
          "sectionId": "agentes"
        }
      ],
      "is03.q05": [
        {
          "missionId": "draft.is03",
          "sectionId": "deposito"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-oito"
        }
      ],
      "is03.q06": [
        {
          "missionId": "draft.is03",
          "sectionId": "deposito"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-dois"
        }
      ],
      "is03.q07": [
        {
          "missionId": "draft.is03",
          "sectionId": "evidencia"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-oito"
        }
      ],
      "is03.q08": [
        {
          "missionId": "draft.is03",
          "sectionId": "deposito"
        },
        {
          "missionId": "draft.is03",
          "sectionId": "ex-dois"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho fora do catálogo; revisão pedagógica independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 32 (fundamentos; utilização e saque ainda não completos); Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar fundo, conta vinculada, funções institucionais e depósito do empregador, calculando casos delimitados.",
    "O2": "Separar papéis, períodos e condições sem presumir direitos.",
    "O3": "Aplicar as hipóteses e os cálculos explicitamente ensinados.",
    "O4": "Reconhecer o erro e recuperar o trecho de ensino."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar a confusão, reler a seção indicada e reconstruir o exemplo."
  },
  "limits": [
    "Recorte exclusivo do perfil histórico CAIXA; não atribuído nominalmente ao BB.",
    "Fonte de escopo: matriz 65 do PR #559 em 400d4854, reaproveitada sem integrar o PR ou adotar edital vigente.",
    "Corte de consulta normativa: 03/10/2026; normas atuais distintas do edital histórico.",
    "Casos fictícios; não constitui atendimento, concessão de benefício, prática real ou avaliação independente.",
    "Sem XP, ordem, ativação, D1, alteração de permissões ou aceite humano de fase.",
    "Não inclui deadlines, multas rescisórias, remuneração completa, hipóteses de saque ou classificação de verbas.",
    "Não cobre CRF/GRF apenas por mencionar sua distinção."
  ]
};

export const ARITHMETIC = [
  {
    "label": "depósito geral",
    "operation": "multiply",
    "values": [
      2000,
      0.08
    ],
    "expected": 160
  },
  {
    "label": "aprendizagem",
    "operation": "multiply",
    "values": [
      1200,
      0.02
    ],
    "expected": 24
  },
  {
    "label": "contraste errado 8%",
    "operation": "multiply",
    "values": [
      1200,
      0.08
    ],
    "expected": 96
  }
];
