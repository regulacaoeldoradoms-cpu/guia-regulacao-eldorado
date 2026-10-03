// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.is.guias",
    "label": "Planalto — Lei 8.036/1990",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm",
    "locator": "Arts. 17-A e 26-A, especialmente § 2º; declaração, recolhimento, valores e período",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  },
  {
    "id": "mte.is.digital",
    "label": "MTE — Perguntas frequentes FGTS Digital",
    "url": "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/perguntas-frequentes",
    "locator": "03.01 (12/03/2024): competência/fato gerador da transição; limites e regimes específicos não universalizados. Evitar exemplo contraditório de fevereiro na 01.07",
    "version": "Texto oficial consultado em 03/10/2026; corte normativo declarado na aula",
    "checkedAt": "2026-10-03"
  }
];

export const IS06_DRAFT = {
  "id": "draft.is06",
  "topicId": "draft.is06",
  "editorialKey": "IS-06",
  "candidateBlockId": "banking.institution-specific",
  "title": "GRF e FGTS Digital: guia, competência e recolhimento",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir referência histórica da guia, período da obrigação, emissão e recolhimento, reconhecendo a transição de sistemas no recorte geral.",
  "sourceIds": [
    "lei.is.guias",
    "mte.is.digital"
  ],
  "sections": [
    {
      "id": "guia",
      "heading": "1. Instrumento e obrigação",
      "body": "O item 34 do edital histórico nomeia a Guia de Recolhimento do FGTS, GRF. Uma guia organiza informações e valores para recolhimento. A Lei 8.036 exige identificar valores de FGTS e período laboral nas guias. Instrumento, obrigação e pagamento são distintos: emitir não significa pagar; o comprovante de um pagamento particular não é um CRF universal. A sigla do edital é preservada como referência histórica, sem impor o sistema antigo a toda obrigação atual.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.guias"
      ]
    },
    {
      "id": "competencia",
      "heading": "2. Competência é o período de referência",
      "body": "Competência identifica o período a que a obrigação se refere. Data de emissão é quando a guia foi gerada; data de pagamento é quando houve recolhimento. Uma obrigação de fevereiro pode ser paga em março e continuar sendo de fevereiro. Para escolher o regime indicado pelo caso, não substitua a competência pela data de emissão ou pagamento. Nos exemplos, a competência e a categoria serão explicitadas.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.guias"
      ]
    },
    {
      "id": "ex-periodo",
      "heading": "3. Exemplo resolvido: mês da obrigação e mês do pagamento",
      "body": "Uma guia fictícia informa competência fevereiro/2024, emissão em março/2024 e pagamento confirmado em março/2024. O período laboral informado continua fevereiro. Emissão e pagamento pertencem a março, mas respondem a perguntas diferentes. Se o enunciado apenas mostrasse emissão, faltaria evidência de recolhimento.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.guias"
      ]
    },
    {
      "id": "transicao",
      "heading": "4. Reconhecer a transição sem universalizar",
      "body": "A orientação 03.01 do MTE registra entrada do FGTS Digital em 01/03/2024 e distingue obrigações anteriores das relativas a fatos geradores a partir dessa data. No recorte mensal geral da orientação, competência fevereiro/2024 permanece nos sistemas anteriores; março/2024 utiliza FGTS Digital. Essa distinção não ensina procedimentos de todos os empregadores ou processos trabalhistas, que possuem enquadramentos e transições específicos. Não basta afirmar que qualquer pagamento feito depois de março usa sempre o mesmo sistema.",
      "type": "explanation",
      "sourceIds": [
        "mte.is.digital"
      ]
    },
    {
      "id": "ex-sistema",
      "heading": "5. Exemplo resolvido: a data de emissão não muda a competência",
      "body": "Considere somente o recolhimento mensal geral do recorte 03.01, sem categoria especial ou processo trabalhista. O caso A é de fevereiro/2024; o caso B é de março/2024. A orientação diferencia os sistemas conforme esses períodos. Gerar a guia A em março não transforma sua obrigação em competência março. Não reutilizamos automaticamente uma instrução histórica como procedimento para um caso diferente.",
      "type": "worked-example",
      "sourceIds": [
        "mte.is.digital"
      ]
    },
    {
      "id": "dados",
      "heading": "6. Declaração, geração e confirmação",
      "body": "O empregador deve declarar os dados pertinentes e recolher os valores conforme as regras aplicáveis. No exercício, leia identidade da obrigação, competência, valor e estado informado. Valor incorreto ou período incompatível exige esclarecer os dados; não ensinar um artifício para pagar menos nem presumir que qualquer arquivo enviado já está quitado. Esta unidade explica a leitura, sem acessar sistemas ou contas reais.",
      "type": "explanation",
      "sourceIds": [
        "lei.is.guias"
      ]
    },
    {
      "id": "ex-valor",
      "heading": "7. Exemplo resolvido: somar valores explicitamente dados",
      "body": "O exercício fornece dois débitos distintos já apurados: R$ 160 e R$ 24, que serão recolhidos no mesmo instrumento conforme a hipótese expressa. O total é 160 + 24 = R$ 184. Não aplicamos novamente as alíquotas aos débitos, pois eles já são valores de FGTS. Somar corretamente tampouco prova emissão, recolhimento ou regularidade global.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.guias"
      ]
    },
    {
      "id": "ex-evidencia",
      "heading": "8. Exemplo resolvido: comprovante com alcance limitado",
      "body": "A guia X foi emitida, mas o caso não informa pagamento. A guia Y tem recolhimento confirmado. Podemos distinguir os estados X e Y, sem atribuir quitação a X. O pagamento de Y comprova a obrigação descrita no caso; não demonstra automaticamente todas as demais obrigações, nem autoriza um saque individual.",
      "type": "worked-example",
      "sourceIds": [
        "lei.is.guias"
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
      "id": "is06.q01",
      "prompt": "Qual leitura separa corretamente guia e pagamento?",
      "options": [
        "Guia organiza valores para recolhimento; emissão não é pagamento.",
        "Gerar qualquer guia quita todas as obrigações.",
        "Guia e saldo individual são sinônimos.",
        "Uma guia é sempre concessão de crédito."
      ],
      "answer": 0,
      "explanation": "Preserva o instrumento e seu estado.",
      "optionRationales": [
        "Preserva o instrumento e seu estado.",
        "Não há quitação automática.",
        "Os objetos são diferentes.",
        "Não se trata de contratação de crédito."
      ],
      "recoverySectionIds": [
        "guia"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "is06.q02",
      "prompt": "A obrigação é da competência fevereiro, com emissão e pagamento em março. Qual é o período laboral informado?",
      "options": [
        "Março, porque houve pagamento nesse mês.",
        "Fevereiro.",
        "Qualquer mês futuro.",
        "Somente a hora de emissão."
      ],
      "answer": 1,
      "explanation": "Mantém o período explicitado.",
      "optionRationales": [
        "Confunde referência e pagamento.",
        "Mantém o período explicitado.",
        "Não há referência futura.",
        "Hora de emissão não substitui a competência."
      ],
      "recoverySectionIds": [
        "competencia",
        "ex-periodo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is06.q03",
      "prompt": "No recorte mensal geral 03.01, sem categoria especial, qual comparação respeita a transição indicada?",
      "options": [
        "Todo débito anterior desapareceu.",
        "Toda emissão em março é competência março.",
        "Fevereiro/2024 segue os sistemas anteriores; março/2024 utiliza FGTS Digital.",
        "GRF e CRF são o mesmo documento."
      ],
      "answer": 2,
      "explanation": "Aplica a distinção no escopo informado.",
      "optionRationales": [
        "Não houve perdão de obrigações ensinado.",
        "Emissão não redefine competência.",
        "Aplica a distinção no escopo informado.",
        "Guia e certificado são diferentes."
      ],
      "recoverySectionIds": [
        "transicao",
        "ex-sistema"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is06.q04",
      "prompt": "Uma guia de fevereiro/2024 foi gerada em março/2024. Isso altera automaticamente sua competência?",
      "options": [
        "Sim, a data de emissão reescreve o período.",
        "Sim, basta mudar o arquivo.",
        "Sim, o ano-base do abono determina a guia.",
        "Não; competência e emissão são dados distintos."
      ],
      "answer": 3,
      "explanation": "Preserva o dado do caso.",
      "optionRationales": [
        "Não é a regra ensinada.",
        "Trocar arquivo não muda a obrigação.",
        "Abono e guia de FGTS não se confundem.",
        "Preserva o dado do caso."
      ],
      "recoverySectionIds": [
        "competencia",
        "ex-sistema"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is06.q05",
      "prompt": "Dois débitos distintos, já apurados, são R$ 160 e R$ 24. O caso permite somá-los no instrumento. Qual total resulta?",
      "options": [
        "R$ 184.",
        "R$ 136.",
        "R$ 1.840.",
        "R$ 14,72 por aplicar novamente 8%."
      ],
      "answer": 0,
      "explanation": "160 + 24 = 184.",
      "optionRationales": [
        "160 + 24 = 184.",
        "Subtrai em vez de somar.",
        "Altera a escala dos valores.",
        "Aplica alíquota a débitos já apurados."
      ],
      "recoverySectionIds": [
        "ex-valor"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "is06.q06",
      "prompt": "O valor de R$ 184 foi corretamente calculado, mas nada informa pagamento. Qual é a conclusão segura?",
      "options": [
        "Todo o FGTS foi recolhido.",
        "O cálculo do total não comprova pagamento.",
        "Todas as contas estão livres para saque.",
        "O CRF foi automaticamente emitido."
      ],
      "answer": 1,
      "explanation": "Reconhece o alcance da evidência.",
      "optionRationales": [
        "Cálculo não é confirmação de recolhimento.",
        "Reconhece o alcance da evidência.",
        "Saque depende de outra hipótese.",
        "Regularidade não decorre de uma soma."
      ],
      "recoverySectionIds": [
        "dados",
        "ex-valor"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is06.q07",
      "prompt": "X tem somente emissão; Y tem pagamento confirmado. Qual afirmação acompanha o estado de cada caso?",
      "options": [
        "X e Y estão ambos quitados.",
        "Nenhum pagamento é relevante.",
        "Y tem recolhimento confirmado; não há essa confirmação para X.",
        "X comprova regularidade global pelo nome do arquivo."
      ],
      "answer": 2,
      "explanation": "Respeita os fatos explicitados.",
      "optionRationales": [
        "Iguala estados distintos.",
        "O dado confirmado de Y importa.",
        "Respeita os fatos explicitados.",
        "Nome e emissão não comprovam regularidade global."
      ],
      "recoverySectionIds": [
        "ex-evidencia"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "is06.q08",
      "prompt": "Um aluno pretende aplicar uma instrução antiga de sistema a todo empregador e qualquer competência atual. Qual recuperação é pertinente?",
      "options": [
        "Ignorar categoria e período.",
        "Presumir que todo caso atual é idêntico ao antigo.",
        "Trocar apenas a cor da guia.",
        "Reler competência, transição e limites do enquadramento antes de generalizar."
      ],
      "answer": 3,
      "explanation": "Recupera as distinções necessárias.",
      "optionRationales": [
        "Remove dados relevantes.",
        "Não há identidade automática.",
        "Aparência não corrige o enquadramento.",
        "Recupera as distinções necessárias."
      ],
      "recoverySectionIds": [
        "competencia",
        "transicao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "is06-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "is06.q01": [
        {
          "missionId": "draft.is06",
          "sectionId": "guia"
        }
      ],
      "is06.q02": [
        {
          "missionId": "draft.is06",
          "sectionId": "competencia"
        },
        {
          "missionId": "draft.is06",
          "sectionId": "ex-periodo"
        }
      ],
      "is06.q03": [
        {
          "missionId": "draft.is06",
          "sectionId": "transicao"
        },
        {
          "missionId": "draft.is06",
          "sectionId": "ex-sistema"
        }
      ],
      "is06.q04": [
        {
          "missionId": "draft.is06",
          "sectionId": "competencia"
        },
        {
          "missionId": "draft.is06",
          "sectionId": "ex-sistema"
        }
      ],
      "is06.q05": [
        {
          "missionId": "draft.is06",
          "sectionId": "ex-valor"
        }
      ],
      "is06.q06": [
        {
          "missionId": "draft.is06",
          "sectionId": "dados"
        },
        {
          "missionId": "draft.is06",
          "sectionId": "ex-valor"
        }
      ],
      "is06.q07": [
        {
          "missionId": "draft.is06",
          "sectionId": "ex-evidencia"
        }
      ],
      "is06.q08": [
        {
          "missionId": "draft.is06",
          "sectionId": "competencia"
        },
        {
          "missionId": "draft.is06",
          "sectionId": "transicao"
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
      "item": "Conhecimentos Bancários 34; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Distinguir referência histórica da guia, período da obrigação, emissão e recolhimento, reconhecendo a transição de sistemas no recorte geral.",
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
    "Recorte introdutório, sem procedimento de SEFIP/FGTS Digital, prazos de vencimento, categorias especiais ou processos trabalhistas.",
    "Competências anteriores/posteriores são exemplos delimitados; não certifica domínio de toda transição operacional."
  ]
};

export const ARITHMETIC = [
  {
    "label": "débitos já apurados",
    "operation": "add",
    "values": [
      160,
      24
    ],
    "expected": 184
  }
];
