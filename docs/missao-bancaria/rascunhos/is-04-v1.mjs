// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.saques",
    "label": "Planalto — Lei 8.036/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm",
    "locator": "Arts. 20, III/VIII, 20-A–20-D; regras permanentes selecionadas, sem promessa de saque ou liberação extraordinária",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS04_DRAFT = {
  "id": "draft.is04",
  "topicId": "draft.is04",
  "editorialKey": "IS-04",
  "candidateBlockId": "banking.institution-specific",
  "title": "FGTS: hipóteses e sistemáticas de saque",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir hipótese legal, condição comprovada e sistemática do FGTS, evitando deduzir disponibilidade pelo saldo.",
  "sourceIds": [
    "lei.is.saques"
  ],
  "sections": [
    {
      "id": "hipoteses",
      "heading": "1. O saldo é apenas o começo",
      "body": "A Lei 8.036 prevê situações de movimentação, entre elas aposentadoria concedida e permanência de três anos ininterruptos fora do regime do FGTS. Cada hipótese precisa dos fatos correspondentes. Algumas situações possuem condições específicas e restrições ligadas à sistemática escolhida. Esta aula seleciona hipóteses para ensinar o raciocínio; não apresenta uma lista exaustiva nem decide um pedido real.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "ex-aposentadoria",
      "heading": "2. Exemplo resolvido: expectativa e fato concedido",
      "body": "O primeiro caso diz apenas que Marta pretende pedir aposentadoria. Isso não é aposentadoria concedida. O segundo informa concessão pela Previdência Social: existe o fato descrito no inciso III do art. 20. Reconhecer essa hipótese não equivale a validar todos os documentos, bloqueios ou valores disponíveis de um pedido real.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "fora-regime",
      "heading": "3. Três anos fora do regime não são três anos sem depósito",
      "body": "A hipótese do inciso VIII exige três anos ininterruptos fora do regime do FGTS. A falta de depósitos, isoladamente, não prova essa condição: pode haver vínculo submetido ao regime e inadimplemento do empregador. Não substitua uma expressão legal por outra apenas porque os períodos numéricos se parecem.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "ex-regime",
      "heading": "4. Exemplo resolvido: duas situações diferentes",
      "body": "Pedro permanece empregado em vínculo submetido ao regime, mas o caso informa ausência de recolhimentos por três anos. Esses dados não demonstram três anos fora do regime. Em outro exercício, o próprio enunciado comprova três anos ininterruptos fora do regime: essa condição temporal está presente. A conclusão se limita à condição explicitada.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "sistematicas",
      "heading": "5. Saque-rescisão e saque-aniversário",
      "body": "O titular se sujeita a uma das sistemáticas: saque-rescisão ou saque-aniversário. Todas as contas do mesmo titular seguem a mesma sistemática. A original é saque-rescisão; a primeira opção por saque-aniversário tem efeitos imediatos conforme o art. 20-C. Mudanças posteriores não são instantâneas: a regra indicada prevê efetivação no primeiro dia do 25º mês subsequente à solicitação e condiciona a mudança à ausência de cessão/alienação dos direitos futuros ali descritos. Não ensinamos procedimento de aplicativo nem contratação de antecipação.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "rescisao",
      "heading": "6. O nome não garante saque integral em qualquer rescisão",
      "body": "Na regra permanente do art. 20-A, a sistemática de saque-aniversário exclui algumas hipóteses de movimentação, incluindo a despedida sem justa causa do inciso I. Isso impede concluir que a demissão sempre libera integralmente o saldo para qualquer modalidade. O art. 20-D, § 7º, preserva a movimentação da multa rescisória prevista em lei. Não confunda multa com todo o saldo. Liberações extraordinárias datadas não são ensinadas como regra permanente.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "ex-modalidade",
      "heading": "7. Exemplo resolvido: ler a modalidade no momento do evento",
      "body": "O caso didático fixa saque-aniversário no momento da despedida sem justa causa, sem hipótese extraordinária de liberação, e pergunta pela regra permanente indicada. Não se presume saque integral do saldo por essa demissão; a multa rescisória é objeto distinto. Um pedido de mudança de sistemática feito depois não altera automaticamente a modalidade já aplicável ao evento.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.saques"
      ]
    },
    {
      "id": "ex-contas",
      "heading": "8. Exemplo resolvido: duas contas, um titular",
      "body": "Uma pessoa tem duas contas vinculadas no exercício, ambas de sua titularidade. A lei sujeita todas à mesma sistemática. Não escolhemos saque-aniversário para uma conta e saque-rescisão para outra só por terem saldos diferentes. Para resolver a questão, identificamos o titular e a sistemática, não o número de contas.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.saques"
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
      "id": "is04.q01",
      "prompt": "Um caso apenas informa saldo no FGTS. O que falta para afirmar disponibilidade de saque em hipótese específica?",
      "options": [
        "Os fatos e condições pertinentes à movimentação.",
        "Somente o modelo do telefone.",
        "A escolha de uma alternativa ao acaso.",
        "A certeza de que todo saldo é livre."
      ],
      "answer": 0,
      "explanation": "Saldo não substitui condição legal.",
      "optionRationales": [
        "Saldo não substitui condição legal.",
        "Dispositivo não prova hipótese de saque.",
        "Uma conclusão precisa de dados.",
        "A premissa contraria a vinculação."
      ],
      "recoverySectionIds": [
        "hipoteses"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is04.q02",
      "prompt": "Marta pretende pedir aposentadoria, mas o enunciado não informa concessão. É possível tratar essa intenção como aposentadoria concedida?",
      "options": [
        "Sim, intenção e concessão são sinônimos.",
        "Não; o fato exigido pela hipótese não foi demonstrado.",
        "Sim, qualquer conta bancária concede aposentadoria.",
        "Não, porque aposentadoria nunca aparece na lei do FGTS."
      ],
      "answer": 1,
      "explanation": "Preserva a diferença ensinada.",
      "optionRationales": [
        "São estados diferentes.",
        "Preserva a diferença ensinada.",
        "Conta não é concessão previdenciária.",
        "A hipótese consta do inciso III."
      ],
      "recoverySectionIds": [
        "ex-aposentadoria"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is04.q03",
      "prompt": "Pedro segue em vínculo submetido ao regime do FGTS, mas faltam depósitos há três anos. Isso demonstra a condição de três anos fora do regime?",
      "options": [
        "Sim, depósito e regime são iguais.",
        "Sim, qualquer inadimplemento encerra o vínculo.",
        "Não; ausência de recolhimento não prova estar fora do regime.",
        "Sim, apenas porque o número três aparece."
      ],
      "answer": 2,
      "explanation": "Distingue a condição legal do fato apresentado.",
      "optionRationales": [
        "Mistura obrigação e enquadramento.",
        "Não foi informada extinção do vínculo.",
        "Distingue a condição legal do fato apresentado.",
        "O período numérico não torna as situações equivalentes."
      ],
      "recoverySectionIds": [
        "fora-regime",
        "ex-regime"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is04.q04",
      "prompt": "Qual é a sistemática original indicada no art. 20-B?",
      "options": [
        "Cada conta escolhe uma modalidade independente.",
        "Ambas simultaneamente em todas as contas.",
        "Nenhuma modalidade legal.",
        "Saque-rescisão, admitida opção de alteração nas condições legais."
      ],
      "answer": 3,
      "explanation": "Identifica a original sem negar a possibilidade de alteração.",
      "optionRationales": [
        "Todas as contas do titular seguem a mesma sistemática.",
        "São sistemáticas alternativas.",
        "A lei disciplina as modalidades.",
        "Identifica a original sem negar a possibilidade de alteração."
      ],
      "recoverySectionIds": [
        "sistematicas"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is04.q05",
      "prompt": "Uma pessoa tem duas contas vinculadas. Qual afirmação respeita a regra ensinada?",
      "options": [
        "Todas as contas do titular se sujeitam à mesma sistemática.",
        "Contas pequenas sempre usam outra sistemática.",
        "Uma conta é sempre uma instituição financeira nova.",
        "A modalidade nunca importa."
      ],
      "answer": 0,
      "explanation": "É a regra do art. 20-A, § 1º.",
      "optionRationales": [
        "É a regra do art. 20-A, § 1º.",
        "Saldo não cria exceção ensinada.",
        "Conta e instituição não se confundem.",
        "A modalidade pode mudar hipóteses de movimentação."
      ],
      "recoverySectionIds": [
        "sistematicas",
        "ex-contas"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is04.q06",
      "prompt": "Pela regra permanente indicada, com saque-aniversário no momento da demissão sem justa causa e sem liberação extraordinária, qual distinção é correta?",
      "options": [
        "Demissão libera sempre todo o saldo.",
        "Não se presume saldo integral liberado por essa demissão; multa rescisória é distinta.",
        "A multa e o saldo total são a mesma coisa.",
        "A demissão transforma o FGTS em abono."
      ],
      "answer": 1,
      "explanation": "Separa saldo e multa conforme o ensino.",
      "optionRationales": [
        "Ignora a restrição da sistemática.",
        "Separa saldo e multa conforme o ensino.",
        "São objetos diferentes.",
        "Abono é benefício distinto."
      ],
      "recoverySectionIds": [
        "rescisao",
        "ex-modalidade"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is04.q07",
      "prompt": "Uma alteração posterior de sistemática solicitada hoje é automaticamente instantânea?",
      "options": [
        "Sim, qualquer alteração sempre é imediata.",
        "Sim, basta mudar de telefone.",
        "Não; há prazo e condições, distintos dos efeitos da primeira opção.",
        "Não, porque nenhuma alteração é possível."
      ],
      "answer": 2,
      "explanation": "Distingue situações e condições.",
      "optionRationales": [
        "Generaliza a regra da primeira opção.",
        "Dispositivo não substitui norma.",
        "Distingue situações e condições.",
        "A lei admite alterações condicionadas."
      ],
      "recoverySectionIds": [
        "sistematicas"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is04.q08",
      "prompt": "Um aluno aplica o saque integral por demissão a todas as modalidades. Qual recuperação é adequada?",
      "options": [
        "Ignorar a modalidade informada.",
        "Usar o saldo como única prova.",
        "Presumir uma liberação extraordinária não mencionada.",
        "Reler sistemáticas e separar o saldo da multa rescisória."
      ],
      "answer": 3,
      "explanation": "Corrige a confusão efetivamente ensinada.",
      "optionRationales": [
        "Remove dado relevante.",
        "Saldo não prova a hipótese aplicável.",
        "Inventa uma exceção.",
        "Corrige a confusão efetivamente ensinada."
      ],
      "recoverySectionIds": [
        "sistematicas",
        "rescisao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is04-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is04.q01": [
        {
          "missionId": "draft.is04",
          "sectionId": "hipoteses"
        }
      ],
      "is04.q02": [
        {
          "missionId": "draft.is04",
          "sectionId": "ex-aposentadoria"
        }
      ],
      "is04.q03": [
        {
          "missionId": "draft.is04",
          "sectionId": "fora-regime"
        },
        {
          "missionId": "draft.is04",
          "sectionId": "ex-regime"
        }
      ],
      "is04.q04": [
        {
          "missionId": "draft.is04",
          "sectionId": "sistematicas"
        }
      ],
      "is04.q05": [
        {
          "missionId": "draft.is04",
          "sectionId": "sistematicas"
        },
        {
          "missionId": "draft.is04",
          "sectionId": "ex-contas"
        }
      ],
      "is04.q06": [
        {
          "missionId": "draft.is04",
          "sectionId": "rescisao"
        },
        {
          "missionId": "draft.is04",
          "sectionId": "ex-modalidade"
        }
      ],
      "is04.q07": [
        {
          "missionId": "draft.is04",
          "sectionId": "sistematicas"
        }
      ],
      "is04.q08": [
        {
          "missionId": "draft.is04",
          "sectionId": "sistematicas"
        },
        {
          "missionId": "draft.is04",
          "sectionId": "rescisao"
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
      "item": "Conhecimentos Bancários 32 (hipóteses selecionadas e modalidades); Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir hipótese legal, condição comprovada e sistemática do FGTS, evitando deduzir disponibilidade pelo saldo.",
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
    "Recorte não exaustivo; não cobre utilização habitacional completa, documentos, calendários e antecipação de saques.",
    "Usa regras permanentes indicadas, sem aplicar liberação extraordinária a um caso real."
  ]
};

export const ARITHMETIC = [];
