// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cdc.credito.cobranca",
    "label": "Código de Defesa do Consumidor — crédito e cobrança",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    "locator": "Arts. 42, 52 e 54-D, texto consolidado; aplicação aos casos declarados de relação de consumo",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC10_DRAFT = {
  "id": "draft.pc10",
  "topicId": "draft.pc10",
  "editorialKey": "PC-10",
  "candidateBlockId": "banking.products-credit",
  "title": "Acompanhar crédito e tratar o atraso",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir concessão, acompanhamento, atraso e recuperação, ler um fluxo simples e reconhecer limites da cobrança nas relações de consumo.",
  "sourceIds": [
    "cdc.credito.cobranca"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Uma dívida tem uma linha do tempo",
      "body": "Retome [PC-02](pc-02-v1.md#vocabulario) e [PC-04](pc-04-v1.md#base-comparavel): valor liberado, pagamentos e datas precisam ser lidos juntos. Nesta aula acompanharemos uma operação fictícia de crédito ao consumidor. Concessão é a decisão e contratação/liberação nos termos acordados; acompanhamento é verificar a evolução depois disso; atraso é não cumprir no vencimento; recuperação é buscar regularizar ou recuperar o crédito, respeitando contrato e lei. Esses nomes organizam o caso didático, sem criar classificação contábil ou regra interna de banco.",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "concessao",
      "type": "explanation",
      "heading": "2. Antes de conceder: informação e avaliação",
      "body": "No âmbito do CDC, antes da contratação, o fornecedor ou intermediário deve explicar a natureza do crédito, seus custos e consequências do inadimplemento, além de avaliar responsavelmente as condições de crédito com as informações disponíveis e observância da proteção de dados. Deve identificar o financiador e entregar cópia do contrato nos termos legais. A avaliação prévia não é certeza de pagamento: renda, despesas e outros eventos podem mudar. Também não se substitui essa avaliação apenas porque existe [garantia pessoal](pc-08-v1.md#inicio) ou [real](pc-09-v1.md#inicio).",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "exemplo-concessao",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: dados antes da assinatura",
      "body": "Caso fictício de consumo: foram informados o valor líquido, as datas, as parcelas e o CET aplicável, mas o atendente quer assinar antes de explicar custos e consequências de atraso. Passo 1: reconhecer o momento pré-contratação. Passo 2: identificar a informação que falta. Passo 3: não considerar a simples existência das parcelas como prova de explicação adequada de todas as condições. Nenhuma aprovação de crédito foi deduzida pelo exemplo.",
      "sourceIds": []
    },
    {
      "id": "acompanhamento",
      "type": "explanation",
      "heading": "4. Depois da liberação: previsto e realizado",
      "body": "Acompanhar é comparar o combinado com o ocorrido. Um quadro simples separa vencimento, valor devido segundo o contrato, valor pago e data do pagamento. O saldo de parcelas ainda não pagas não é necessariamente “tudo vencido”. Compromissos futuros, parcelas vencidas e encargos são informações distintas. Um recebimento parcial precisa ser registrado conforme sua efetiva imputação; sem regra de alocação e dados suficientes, não inventamos quanto foi amortização, juros ou multa. O acompanhamento didático não calcula classificação de risco, provisão contábil ou vencimento antecipado.",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "exemplo-linha",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: três parcelas em datas diferentes",
      "body": "Contrato didático: três parcelas de R$300, nos dias 10 de abril, maio e junho. A primeira foi paga; a segunda não foi paga no vencimento. Hoje é 15 de maio; o caso exclui vencimento antecipado e não fornece encargos. Passo 1: parcela de abril está quitada. Passo 2: parcela de maio está vencida e não paga. Passo 3: junho ainda não venceu. As duas parcelas não pagas somam R$600, mas só R$300 estão vencidos entre os valores nominais informados. Esse quadro não é saldo de quitação antecipada.",
      "sourceIds": []
    },
    {
      "id": "atraso",
      "type": "explanation",
      "heading": "6. Atraso é um evento, não uma explicação completa",
      "body": "Constatar falta de pagamento não revela sozinho a causa. Pode ser preciso conferir recebimentos ainda não identificados, divergência de valor, dificuldades de caixa ou outro fato. A análise deve usar informações pertinentes e verificadas. Um atraso não prova fraude, incapacidade permanente, nulidade da dívida ou perda total. Tampouco autoriza inventar uma nota regulatória de risco com base apenas no número de dias. Datas e fatos do caso orientam a próxima verificação, dentro das regras aplicáveis.",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "exemplo-verificacao",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: confirmar antes de concluir",
      "body": "O painel didático mostra “não pago”, mas o consumidor informa um pagamento. O enunciado ainda não fornece comprovante nem conciliação. Primeiro registramos a divergência e conferimos os dados pertinentes do pagamento e do contrato; não declaramos a dívida quitada somente pela fala, nem chamamos o consumidor de fraudador somente pelo painel. O objetivo é decidir qual informação falta, sem expor documentos ou dados reais nesta aula.",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "type": "explanation",
      "heading": "8. Recuperação e renegociação não são sinônimos de perdão",
      "body": "Recuperação é o objetivo de regularizar/receber valores. Pode envolver esclarecimento de divergências, pagamento ou negociação, conforme o caso e os meios lícitos. Renegociar é pactuar condições revistas, quando efetivamente acordadas; não existe, nesta aula, taxa universal, desconto obrigatório, prazo padrão ou promessa de aceitação de toda proposta. Se o caso diz que uma oferta ainda não foi aceita, não a trate como contrato novo. Ao comparar propostas, leia total, datas, encargos, garantias e efeitos sobre a obrigação anterior.",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "exemplo-acordo",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: oferta não é acordo",
      "body": "Para uma dívida identificada, o enunciado apresenta oferta de quatro pagamentos de R$250, sem entrada e sem outro valor nessa oferta. Somam 4 × 250 = R$1.000. Isso descreve a oferta, não prova que o devedor aceitou ou pagou. Se outra oferta for dois pagamentos de R$450, seu total nominal é R$900, mas comparar adequação exige datas, condições e capacidade de cumprir. Não conclua automaticamente que a de R$250 é mais barata por parcela ou que há obrigação de conceder desconto.",
      "sourceIds": []
    },
    {
      "id": "cobranca",
      "type": "explanation",
      "heading": "10. Cobrança nas relações de consumo",
      "body": "O CDC proíbe expor o consumidor inadimplente ao ridículo ou submetê-lo a constrangimento ou ameaça na cobrança. Isso não extingue automaticamente uma dívida válida: limita os meios de cobrá-la. O CDC também assegura liquidação antecipada total ou parcial, com redução proporcional de juros e demais acréscimos, nas condições do art. 52, §2º. Por isso, a soma das parcelas futuras não é automaticamente o valor exato de quitação hoje. O recorte é de relação de consumo; não transportamos indiscriminadamente todas essas regras a qualquer operação empresarial.",
      "sourceIds": [
        "cdc.credito.cobranca"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de acompanhamento",
      "body": "Vencimento: data prevista para cumprir uma obrigação. Parcela vincenda: ainda não vencida. Parcela vencida: atingiu o vencimento; pode estar paga ou não. Inadimplemento: descumprimento. Conciliação: conferência entre registros e pagamentos. Oferta de acordo: proposta ainda sujeita a aceitação. Recuperação: busca de regularização/recebimento, sem confusão com o diagnóstico de aprendizagem do aluno.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Roteiro de análise",
      "body": "Localize o momento da operação. Compare valores e datas previstos com pagamentos comprovados. Separe vencido de vincendo; confira divergências sem presumir causa. Leia eventual proposta como proposta, e acordo como acordo. A cobrança e a negociação seguem limites legais; garantias e atrasos não autorizam procedimentos inventados.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Reconte a linha do tempo separando pago, vencido não pago e vincendo.",
    "Diga qual informação falta quando painel e relato de pagamento divergem.",
    "Explique a diferença entre proposta, acordo e pagamento sem prometer desconto obrigatório."
  ],
  "questions": [
    {
      "id": "pc10.q01",
      "topicId": "draft.pc10",
      "prompt": "Antes de contratar crédito ao consumidor, que conduta corresponde ao CDC ensinado?",
      "options": [
        "Explicar custos e consequências e avaliar responsavelmente as condições de crédito.",
        "Omitir tudo se houver uma garantia.",
        "Avaliar apenas depois da primeira cobrança.",
        "Prometer que nenhum risco poderá ocorrer."
      ],
      "answer": 0,
      "explanation": "Informação e avaliação pertencem ao momento anterior à contratação, sem promessa de certeza.",
      "optionRationales": [
        "Reúne as obrigações ensinadas.",
        "Garantia não substitui informação ou avaliação.",
        "Inverte o momento da avaliação prévia.",
        "Não há garantia de ausência de risco."
      ],
      "recoverySectionIds": [
        "concessao",
        "exemplo-concessao"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc10.q02",
      "topicId": "draft.pc10",
      "prompt": "Três parcelas de R$300 vencem em abril/maio/junho. Abril foi pago; maio venceu sem pagamento; junho não venceu. Sem antecipação ou encargos no caso, quanto está nominalmente vencido e não pago?",
      "options": [
        "R$900.",
        "R$600.",
        "R$300.",
        "R$0 porque junho ainda não venceu."
      ],
      "answer": 2,
      "explanation": "Apenas maio está vencido e não pago.",
      "optionRationales": [
        "Inclui uma parcela paga e outra futura.",
        "Inclui junho ainda vincendo.",
        "Corresponde a uma parcela de maio.",
        "A data de junho não elimina o atraso de maio."
      ],
      "recoverySectionIds": [
        "acompanhamento",
        "exemplo-linha"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc10.q03",
      "topicId": "draft.pc10",
      "prompt": "Painel sem pagamento identificado e consumidor informa que pagou. O caso ainda não contém comprovação. Qual próximo passo é adequado?",
      "options": [
        "Declarar fraude automaticamente.",
        "Conferir a divergência com os dados pertinentes de contrato e pagamento.",
        "Apagar a dívida sem conferência.",
        "Divulgar o caso a conhecidos do consumidor."
      ],
      "answer": 1,
      "explanation": "Os registros precisam ser conciliados antes de uma conclusão definitiva.",
      "optionRationales": [
        "A causa não está demonstrada.",
        "Trata a incerteza com verificação pertinente.",
        "A informação ainda não comprova quitação.",
        "Exposição não resolve a divergência e pode violar limites."
      ],
      "recoverySectionIds": [
        "atraso",
        "exemplo-verificacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc10.q04",
      "topicId": "draft.pc10",
      "prompt": "Oferta ainda não aceita: quatro parcelas de R$250, sem outros pagamentos. Qual leitura é correta?",
      "options": [
        "O devedor já quitou R$1.000.",
        "O contrato já foi substituído em qualquer hipótese.",
        "A parcela menor prova menor custo que qualquer alternativa.",
        "A oferta soma R$1.000, mas não prova aceitação nem pagamento."
      ],
      "answer": 3,
      "explanation": "A soma descreve o fluxo proposto e não altera o estado de aceitação dado.",
      "optionRationales": [
        "Não ocorreu pagamento informado.",
        "Ignora que ainda é oferta.",
        "Faltam quantidade e condições das alternativas.",
        "Conserva total e estágio da proposta."
      ],
      "recoverySectionIds": [
        "recuperacao",
        "exemplo-acordo"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc10.q05",
      "topicId": "draft.pc10",
      "prompt": "Sobre cobrança de dívida de consumidor, qual afirmação cabe?",
      "options": [
        "O atraso permite ameaça e exposição ao ridículo.",
        "A proibição de constrangimento extingue toda dívida.",
        "A cobrança deve respeitar limites do CDC, sem que isso por si apague dívida válida.",
        "Uma garantia permite ignorar esses limites."
      ],
      "answer": 2,
      "explanation": "Meios lícitos de cobrança e existência da obrigação são questões distintas.",
      "optionRationales": [
        "Contraria o art. 42.",
        "Inventa efeito de extinção geral.",
        "Mantém as duas dimensões.",
        "Garantia não autoriza constrangimento."
      ],
      "recoverySectionIds": [
        "cobranca"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc10.q06",
      "topicId": "draft.pc10",
      "prompt": "A soma de parcelas futuras é apresentada como valor exato de quitação antecipada de crédito de consumo. O que falta considerar?",
      "options": [
        "A redução proporcional de juros e demais acréscimos prevista no CDC.",
        "Que antecipar sempre duplica juros.",
        "Que nenhuma quitação parcial é possível.",
        "Que o valor de qualquer parcela pode ser ignorado sem cálculo."
      ],
      "answer": 0,
      "explanation": "O direito à liquidação antecipada modifica a leitura da soma nominal futura.",
      "optionRationales": [
        "Reconhece a regra aplicável.",
        "Afirma o oposto do ensino.",
        "O dispositivo abrange liquidação total ou parcial.",
        "A regra exige apuração adequada, não valores arbitrários."
      ],
      "recoverySectionIds": [
        "cobranca",
        "exemplo-linha"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc10.q07",
      "topicId": "draft.pc10",
      "prompt": "O único dado é um atraso de cinco dias. Qual afirmação ultrapassa os dados e o recorte da aula?",
      "options": [
        "É preciso conferir datas e pagamentos.",
        "Já está provada uma classificação regulatória específica e perda total.",
        "O atraso não explica sozinho sua causa.",
        "Informações pertinentes podem ser necessárias."
      ],
      "answer": 1,
      "explanation": "O recorte não fornece norma de classificação; atraso isolado não prova perda total.",
      "optionRationales": [
        "É uma verificação coerente.",
        "Inventa classificação e conclusão econômica.",
        "Reconhece o limite do evento.",
        "Não faz presunção indevida."
      ],
      "recoverySectionIds": [
        "atraso"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc10.q08",
      "topicId": "draft.pc10",
      "prompt": "Oferta X: quatro parcelas de R$250. Y: duas de R$450. Sem entrada ou extras informados, o que podemos afirmar sobre somas nominais?",
      "options": [
        "X soma R$250 e Y R$450.",
        "X custa menos porque a parcela é menor.",
        "A comparação obriga aceitar Y, quaisquer que sejam datas e condições.",
        "X soma R$1.000 e Y R$900; adequação e custo temporal exigem mais dados."
      ],
      "answer": 3,
      "explanation": "Multiplicar quantidade por valor mostra a soma, sem substituir a análise do tempo e das condições.",
      "optionRationales": [
        "Usa só uma parcela.",
        "Ignora o número de pagamentos.",
        "Soma não determina aceitação ou adequação.",
        "Calcula e limita a conclusão."
      ],
      "recoverySectionIds": [
        "exemplo-acordo"
      ],
      "objectiveIds": [
        "O2",
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc10-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc10.q01": [
        {
          "missionId": "draft.pc10",
          "sectionId": "concessao"
        },
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-concessao"
        }
      ],
      "pc10.q02": [
        {
          "missionId": "draft.pc10",
          "sectionId": "acompanhamento"
        },
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-linha"
        }
      ],
      "pc10.q03": [
        {
          "missionId": "draft.pc10",
          "sectionId": "atraso"
        },
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-verificacao"
        }
      ],
      "pc10.q04": [
        {
          "missionId": "draft.pc10",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-acordo"
        }
      ],
      "pc10.q05": [
        {
          "missionId": "draft.pc10",
          "sectionId": "cobranca"
        }
      ],
      "pc10.q06": [
        {
          "missionId": "draft.pc10",
          "sectionId": "cobranca"
        },
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-linha"
        }
      ],
      "pc10.q07": [
        {
          "missionId": "draft.pc10",
          "sectionId": "atraso"
        }
      ],
      "pc10.q08": [
        {
          "missionId": "draft.pc10",
          "sectionId": "exemplo-acordo"
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
    "O1: reconhecer informação/avaliação prévias",
    "O2: ler datas e valores sem duplicar",
    "O3: separar atraso, causa e diagnóstico",
    "O4: distinguir oferta, acordo e recuperação",
    "O5: aplicar limites do CDC no recorte",
    "O6: reconstruir o fluxo no trecho de origem"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Casos expressamente de consumo. Sem classificação regulatória de risco, cálculo de provisão, rito executivo ou política de concessão/renegociação.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Parcelas não pagas",
    "operation": "add",
    "values": [
      300,
      300
    ],
    "expected": 600
  },
  {
    "label": "Oferta X",
    "operation": "multiply",
    "values": [
      4,
      250
    ],
    "expected": 1000
  },
  {
    "label": "Oferta Y",
    "operation": "multiply",
    "values": [
      2,
      450
    ],
    "expected": 900
  }
];
