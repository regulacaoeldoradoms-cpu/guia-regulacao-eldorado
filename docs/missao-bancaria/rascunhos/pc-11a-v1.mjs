// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.poupanca",
    "label": "BCB — Remuneração dos depósitos de poupança",
    "url": "https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca",
    "locator": "Regra de remuneração, menor saldo, período e aniversário; sem usar a tabela de taxas observadas",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "lei.poupanca.2012",
    "label": "Lei 12.703/2012 — transição da poupança",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm",
    "locator": "Arts. 1º–3º: regra adicional e separação dos depósitos a partir de 4/5/2012",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC11A_DRAFT = {
  "id": "draft.pc11a",
  "topicId": "draft.pc11a",
  "editorialKey": "PC-11A",
  "candidateBlockId": "banking.products-credit",
  "title": "Poupança: depósito, aniversário e remuneração",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Entender a poupança como depósito remunerado, ler a regra do período e distinguir os regimes dos depósitos sem prometer rentabilidade real ou comparar só números.",
  "sourceIds": [
    "bcb.poupanca",
    "lei.poupanca.2012"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Poupar e ter uma conta de poupança",
      "body": "Poupar é separar recursos para uso futuro; não indica um único produto. A caderneta de poupança é uma modalidade de depósito com remuneração regulada. Em [PC-01](pc-01-v1.md#inicio), saldo próprio não se confunde com limite de crédito. Depositar R$500 de recursos próprios na poupança não cria uma dívida de R$500 do depositante perante o banco. Também não equivale a título de capitalização ou a prestação de consórcio; cada produto terá regra própria.",
      "sourceIds": [
        "bcb.poupanca"
      ]
    },
    {
      "id": "periodo",
      "type": "explanation",
      "heading": "2. O período importa",
      "body": "No recorte usual de pessoa física, o período de rendimento é mensal e a remuneração é creditada ao final desse período. A data de aniversário orienta o ciclo; depósitos nos dias 29, 30 e 31 são tratados segundo a regra de aniversário no dia 1º do mês seguinte. Não se deve supor rendimento diário proporcional para todo valor retirado antes de completar o período. Nosso exemplo usa um único saldo com aniversário conhecido; contas com vários depósitos e datas exigem separar os respectivos registros. A regra geral da fonte prevê período trimestral para outros depósitos fora do grupo de pessoas físicas e entidades sem fins lucrativos.",
      "sourceIds": [
        "bcb.poupanca"
      ]
    },
    {
      "id": "base",
      "type": "explanation",
      "heading": "3. O menor saldo do período",
      "body": "A remuneração considera o menor saldo do período de rendimento. Portanto, retirar uma parte e depois repô-la não faz essa parte ser tratada automaticamente como mantida durante todo o ciclo original. A retirada não apaga por si só o rendimento devido ao montante que permaneceu segundo a regra, mas o saldo retirado antes do aniversário não ganha rendimento proporcional pelo simples número de dias. É diferente de um empréstimo, em que calendário e juros seguem a obrigação contratada.",
      "sourceIds": [
        "bcb.poupanca"
      ]
    },
    {
      "id": "exemplo-saldo",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: base de um único ciclo",
      "body": "Caso didático simplificado: pessoa física mantém R$1.000 no início de um ciclo com aniversário conhecido. Retira R$300 antes do aniversário e não faz novos depósitos no período. O menor saldo é 1.000 − 300 = R$700. Se a taxa total hipotética informada para esse ciclo for 0,6%, a remuneração sobre a base é 700 × 0,006 = R$4,20. A taxa de 0,6% foi dada para a conta aritmética, não representa a taxa vigente nem é calculada somando componentes nesta aula.",
      "sourceIds": []
    },
    {
      "id": "regra",
      "type": "explanation",
      "heading": "5. TR e remuneração adicional no regime novo",
      "body": "Para depósitos efetuados a partir de 4 de maio de 2012, há remuneração básica pela Taxa Referencial (TR) e remuneração adicional. Se a meta Selic anual for superior a 8,5%, a parcela adicional é de 0,5% ao mês. Se for igual ou inferior a 8,5%, a parcela adicional corresponde a 70% da meta Selic anual, mensalizada, considerando a meta no início do período. TR não é Selic. “70%” é proporção da meta, não taxa mensal de 70%; e 0,5% mensal é parcela adicional, não necessariamente toda a remuneração quando há TR. A fórmula de composição e conversão mensal fica fora deste recorte.",
      "sourceIds": [
        "bcb.poupanca",
        "lei.poupanca.2012"
      ]
    },
    {
      "id": "exemplo-limiar",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: escolher o ramo da regra",
      "body": "São cenários hipotéticos, não a Selic atual. Cenário A: meta de 9% ao ano no início do período. Como 9 é maior que 8,5, aplica-se adicional de 0,5% ao mês. Cenário B: meta de exatamente 8,5% ao ano. A igualdade pertence ao ramo “igual ou inferior”: usa-se 70% da meta anual, mensalizada. Antes da mensalização, 8,5% × 0,70 = 5,95% ao ano. Não chamamos 5,95% de taxa mensal e não concluímos a remuneração total sem TR e a regra de composição.",
      "sourceIds": []
    },
    {
      "id": "antigos",
      "type": "explanation",
      "heading": "7. A data do depósito diferencia regimes",
      "body": "A Lei 12.703 preservou, para o saldo dos depósitos anteriores ao regime iniciado em 4/5/2012, a remuneração por TR mais juros de 0,5% ao mês, nos termos legais. As instituições devem manter segregados os saldos antigos e novos. A data de abertura da conta sozinha não transforma depósitos novos em antigos: a separação se refere aos depósitos. Uma conta aberta antes de 2012 pode receber dinheiro depois dessa data, sujeito ao regime correspondente.",
      "sourceIds": [
        "lei.poupanca.2012"
      ]
    },
    {
      "id": "exemplo-data",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: conta antiga, depósito novo",
      "body": "Uma conta foi aberta em 2010, mas o valor descrito foi efetivamente depositado em 2026. Para esse depósito, olhamos a data em que o dinheiro foi creditado, e não apenas a idade da conta. Ele pertence ao regime dos depósitos a partir de 4/5/2012. O caso não descreve saldo antigo remanescente, que seria tratado separadamente.",
      "sourceIds": []
    },
    {
      "id": "limites",
      "type": "explanation",
      "heading": "9. Rendimento nominal não prova ganho de compra",
      "body": "Rendimento nominal é aumento em reais; poder de compra depende também da evolução dos preços. Uma remuneração positiva não garante superar a inflação. Para comparar produtos, ainda importam prazo, disponibilidade, custos, risco e regras, sem concluir que um rótulo comercial torna um produto sempre melhor. Esta aula não especifica cobertura ou limites de garantia de depósitos, tributação de todos os titulares ou recomendação individual. Essas informações precisam de fonte própria e enquadramento antes de serem usadas em uma decisão real.",
      "sourceIds": [
        "bcb.poupanca"
      ]
    },
    {
      "id": "exemplo-poder",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: comparar grandezas proporcionais",
      "body": "Hipótese apenas matemática: saldo de R$1.000 passa a R$1.040 num período; uma cesta comparável de R$1.000 passa a custar R$1.050 no mesmo período. O saldo aumentou R$40, mas não compra a mesma cesta ao final: faltam R$10. Não calculamos aqui taxa real exata nem dizemos que essas foram taxas efetivas da poupança ou da inflação.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de recuperação",
      "body": "Depósito: recurso creditado na conta. Aniversário: referência do ciclo de remuneração. TR: taxa referencial usada na parcela básica da remuneração. Meta Selic: referência da condição do adicional no regime novo. Mensalizar: converter uma taxa para equivalente mensal segundo a regra, sem simplesmente mudar o nome do período. Saldo segregado: registro separado de regimes distintos.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Sequência de leitura",
      "body": "Identifique titular, depósito e regime. Confira aniversário e menor saldo do período. Escolha o ramo da regra da meta Selic quando for depósito do regime novo, conservando TR e unidades temporais. Não confunda taxa adicional com total nem rendimento nominal com ganho real.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Explique por que uma conta antiga pode conter depósitos do regime novo.",
    "Reconstrua o exemplo do menor saldo e escreva 0,6% como fração decimal.",
    "Diferencie TR, meta Selic, adicional e remuneração total sem trocar períodos."
  ],
  "questions": [
    {
      "id": "pc11a.q01",
      "topicId": "draft.pc11a",
      "prompt": "Pessoa transfere R$500 próprios para uma conta de poupança. O fato descrito é:",
      "options": [
        "contratação automática de empréstimo pelo depositante.",
        "depósito de recursos próprios em modalidade remunerada.",
        "compra obrigatória de título de capitalização.",
        "pagamento de lance de consórcio."
      ],
      "answer": 1,
      "explanation": "As categorias não se confundem apenas porque envolvem dinheiro.",
      "optionRationales": [
        "Não há limite ou empréstimo utilizado no caso.",
        "Identifica o depósito.",
        "Capitalização é produto diferente.",
        "Nenhum grupo ou lance foi informado."
      ],
      "recoverySectionIds": [
        "inicio"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc11a.q02",
      "topicId": "draft.pc11a",
      "prompt": "No exemplo de um único ciclo, saldo R$1.000, saque R$300 e nenhum depósito posterior. Qual base foi usada para remuneração?",
      "options": [
        "R$1.300.",
        "R$1.000, sempre ignorando o saque.",
        "R$300.",
        "R$700, o menor saldo do período."
      ],
      "answer": 3,
      "explanation": "A retirada reduz o menor saldo a 700.",
      "optionRationales": [
        "Soma um saque em vez de subtrair.",
        "Ignora a regra da base.",
        "Usa o valor retirado, não o saldo mantido.",
        "Aplica a regra ao caso simplificado."
      ],
      "recoverySectionIds": [
        "base",
        "exemplo-saldo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11a.q03",
      "topicId": "draft.pc11a",
      "prompt": "Depósito do regime novo; meta Selic hipotética exatamente 8,5% a.a. Qual ramo corresponde?",
      "options": [
        "70% da meta anual, mensalizada, além da TR conforme a regra.",
        "0,5% adicional mensal porque igualdade significa superior.",
        "70% ao mês garantidos.",
        "Nenhuma remuneração pode existir."
      ],
      "answer": 0,
      "explanation": "A igualdade pertence ao ramo igual ou inferior a 8,5%.",
      "optionRationales": [
        "Mantém limiar e período corretos.",
        "Troca maior por maior ou igual.",
        "Transforma proporção em taxa mensal.",
        "Não decorre da regra."
      ],
      "recoverySectionIds": [
        "regra",
        "exemplo-limiar"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11a.q04",
      "topicId": "draft.pc11a",
      "prompt": "No ramo de meta Selic superior a 8,5% a.a., a expressão 0,5% ao mês descreve:",
      "options": [
        "a meta Selic anual.",
        "sempre o total completo, mesmo com TR.",
        "a remuneração adicional, distinguida da básica pela TR.",
        "o rendimento diário."
      ],
      "answer": 2,
      "explanation": "É a parcela adicional mensal, não toda referência possível da operação.",
      "optionRationales": [
        "Troca duas taxas e seus períodos.",
        "Ignora a parcela básica.",
        "Usa a abrangência correta.",
        "Troca mês por dia."
      ],
      "recoverySectionIds": [
        "regra"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11a.q05",
      "topicId": "draft.pc11a",
      "prompt": "Conta aberta em 2010 recebe um depósito em 2026. Qual data define o regime desse depósito?",
      "options": [
        "Somente 2010; tudo na conta será antigo.",
        "O depósito em 2026 pertence ao regime a partir de 4/5/2012, com saldos antigos separados se existirem.",
        "A data do nascimento do titular.",
        "A data em que a questão foi respondida."
      ],
      "answer": 1,
      "explanation": "A separação é por depósitos, não apenas pela abertura da conta.",
      "optionRationales": [
        "Confunde conta com regime de todos os depósitos.",
        "Reconhece a segregação.",
        "Não é o critério legal.",
        "Não altera quando o depósito ocorreu."
      ],
      "recoverySectionIds": [
        "antigos",
        "exemplo-data"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11a.q06",
      "topicId": "draft.pc11a",
      "prompt": "O saldo passou de R$1.000 para R$1.040, mas a cesta comparável passou de R$1.000 para R$1.050 no mesmo período. O que cabe afirmar?",
      "options": [
        "Rendimento nominal positivo prova ganho de compra.",
        "O saldo não aumentou em reais.",
        "A diferença garante a taxa real exata sem cálculo.",
        "Houve aumento nominal de R$40, insuficiente para comprar a mesma cesta ao final."
      ],
      "answer": 3,
      "explanation": "A comparação distingue aumento em reais e compra da cesta.",
      "optionRationales": [
        "A cesta ficou proporcionalmente mais cara.",
        "O saldo aumentou 40.",
        "O caso não calculou a taxa real exata.",
        "Interpreta os valores sem extrapolar."
      ],
      "recoverySectionIds": [
        "limites",
        "exemplo-poder"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11a.q07",
      "topicId": "draft.pc11a",
      "prompt": "A taxa total didática de um ciclo é dada como 0,6%, com base de R$700. Qual cálculo corresponde?",
      "options": [
        "700 × 0,006 = R$4,20.",
        "700 × 0,6 = R$420.",
        "700 + 0,6 = R$700,60 de rendimento.",
        "R$0,60 independentemente do saldo."
      ],
      "answer": 0,
      "explanation": "0,6 por cento equivale a 0,006 na multiplicação.",
      "optionRationales": [
        "Converte e aplica a proporção.",
        "Usa 60% no lugar de 0,6%.",
        "Soma número de taxa a dinheiro sem calcular rendimento.",
        "Ignora a base."
      ],
      "recoverySectionIds": [
        "exemplo-saldo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11a.q08",
      "topicId": "draft.pc11a",
      "prompt": "Sobre saque antes do aniversário no recorte de pessoa física, qual leitura respeita a aula?",
      "options": [
        "Todo valor sacado recebe automaticamente rendimento proporcional por dia.",
        "Todos os depósitos de qualquer titular rendem diariamente de modo idêntico.",
        "Não se deve presumir rendimento diário proporcional; observe período, base e datas.",
        "O saque torna todo o saldo uma dívida de crédito."
      ],
      "answer": 2,
      "explanation": "Disponibilidade do dinheiro e regra de remuneração não são a mesma coisa.",
      "optionRationales": [
        "Inventa uma proporcionalidade que não é a regra ensinada.",
        "Ignora períodos e titulares.",
        "Conserva as condições necessárias.",
        "Saque de saldo próprio não contrata dívida automaticamente."
      ],
      "recoverySectionIds": [
        "periodo",
        "base"
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc11a-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc11a.q01": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "inicio"
        }
      ],
      "pc11a.q02": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "base"
        },
        {
          "missionId": "draft.pc11a",
          "sectionId": "exemplo-saldo"
        }
      ],
      "pc11a.q03": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "regra"
        },
        {
          "missionId": "draft.pc11a",
          "sectionId": "exemplo-limiar"
        }
      ],
      "pc11a.q04": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "regra"
        }
      ],
      "pc11a.q05": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "antigos"
        },
        {
          "missionId": "draft.pc11a",
          "sectionId": "exemplo-data"
        }
      ],
      "pc11a.q06": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "limites"
        },
        {
          "missionId": "draft.pc11a",
          "sectionId": "exemplo-poder"
        }
      ],
      "pc11a.q07": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "exemplo-saldo"
        }
      ],
      "pc11a.q08": [
        {
          "missionId": "draft.pc11a",
          "sectionId": "periodo"
        },
        {
          "missionId": "draft.pc11a",
          "sectionId": "base"
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
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": [
    "O1: reconhecer depósito e finalidade",
    "O2: ler período e base",
    "O3: interpretar limiar e componentes",
    "O4: distinguir regimes de depósitos",
    "O5: reconhecer limites e poder de compra",
    "O6: recuperar a regra no trecho indicado"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Não calcula composição TR/adicional nem equivalência completa de taxas. Não utiliza Selic, TR ou rentabilidade observada como dado atual.",
    "Sem deduzir tributação/garantia de depósitos fora do escopo; exemplos de taxa total são hipotéticos e explicitamente fornecidos.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Saldo mantido",
    "operation": "subtract",
    "values": [
      1000,
      300
    ],
    "expected": 700
  },
  {
    "label": "Taxa de exemplo",
    "operation": "divide",
    "values": [
      0.6,
      100
    ],
    "expected": 0.006
  },
  {
    "label": "Rendimento dado",
    "operation": "multiply",
    "values": [
      700,
      0.006
    ],
    "expected": 4.2
  },
  {
    "label": "Proporção antes de mensalizar",
    "operation": "multiply",
    "values": [
      8.5,
      0.7
    ],
    "expected": 5.95
  },
  {
    "label": "Aumento nominal",
    "operation": "subtract",
    "values": [
      1040,
      1000
    ],
    "expected": 40
  },
  {
    "label": "Diferença cesta",
    "operation": "subtract",
    "values": [
      1050,
      1040
    ],
    "expected": 10
  }
];
