// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cvm.ce.acoes",
    "label": "CVM — Ações",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/acoes",
    "version": "Página educativa consultada em 01/10/2026; recorte conceitual",
    "locator": "Participação e retorno; não usar os trechos tributários",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.debentures",
    "label": "CVM — Debêntures",
    "url": "https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/debentures",
    "version": "Página educativa consultada em 01/10/2026",
    "locator": "Credor da emissora, debênture simples, remuneração e risco; sem tributação ou ritos de oferta",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.fundos",
    "label": "CVM — Resolução 175, Parte Geral consolidada",
    "url": "https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_ParteGeral.pdf",
    "version": "Texto consolidado vinculado na página oficial que lista alteração 240/26; consultado em 01/10/2026",
    "locator": "Arts. 3º (datas), 4º–5º, 14, 40 e 80–86 da Parte Geral consolidada; classes/cotas, resgate e prestadores. Somente recorte introdutório.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "cvm.ce.risco",
    "label": "CVM — Risco e a relação risco x retorno",
    "url": "https://www.gov.br/investidor/pt-br/investir/antes-de-investir/entenda-as-caracteristicas-dos-investimentos/risco-e-a-relacao-risco-x-retorno",
    "version": "Página educacional de 15/09/2022; consulta em 01/10/2026",
    "locator": "Riscos de crédito, mercado e liquidez; retorno esperado versus realizado. Sem modelos estatísticos.",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.14286",
    "label": "Lei 14.286/2021 — câmbio",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm",
    "version": "Texto oficial consultado em 01/10/2026",
    "locator": "Arts. 2–5 e 19: taxa pactuada, autorização, finalidade e exceção eventual; sem procedimentos quantitativos",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "imf.ce.real",
    "label": "FMI — Real Exchange Rates: What Money Can Buy",
    "url": "https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/real-exchange-rates",
    "version": "Texto educativo Back to Basics, consultado em 01/10/2026",
    "locator": "Equação eP*/P; índices/base de comparação e limites da comparação de poder de compra",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "bcb.ce.transmissao",
    "label": "BCB — Mecanismos de transmissão da política monetária",
    "url": "https://www.bcb.gov.br/controleinflacao/transmissaopoliticamonetaria",
    "version": "Consulta oficial de 30/09/2026 reaproveitada do preparo MP; sem nova leitura remota",
    "locator": "Canal de câmbio, diferencial de juros e efeitos condicionais sobre importação/exportação",
    "checkedAt": "2026-09-30"
  }
];

export const CER_DRAFT = {
  "id": "draft.cer",
  "topicId": "draft.cer",
  "editorialKey": "CE-R",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Revisão cumulativa: do instrumento ao câmbio",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Resolver casos que combinam instrumentos e câmbio, identificando a confusão e retomando a aula que a ensina.",
  "sourceIds": [
    "cvm.ce.acoes",
    "cvm.ce.debentures",
    "cvm.ce.fundos",
    "cvm.ce.risco",
    "lei.14286",
    "bcb.ce.politica",
    "imf.ce.real",
    "bcb.ce.transmissao"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Como usar esta revisão",
      "body": "Tente reconstruir o caminho da resposta antes de olhar o comentário. Para cada erro, escreva uma frase: 'Confundi X com Y'. Em seguida abra a aula de origem indicada na questão, refaça o exemplo correspondente e explique a distinção com seus próprios termos. Repetir a alternativa certa sem recuperar o conceito não demonstra retenção.",
      "sourceIds": []
    },
    {
      "id": "instrumentos",
      "type": "explanation",
      "heading": "2. Instrumento e dinheiro: duas perguntas",
      "body": "Ação representa participação; dívida cria obrigação do emissor; cota representa fração de patrimônio de uma classe de fundo no recorte estudado. Depois pergunte se houve emissão nova ou revenda. A natureza do direito e o destino do dinheiro são dimensões diferentes. Retomada: [CE-01](ce-01-v1.md#mercados), [CE-02](ce-02-v1.md#inicio), [CE-03](ce-03-v1.md#ex-emissor) e [CE-04](ce-04-v1.md#cota).",
      "sourceIds": [
        "cvm.ce.acoes",
        "cvm.ce.debentures",
        "cvm.ce.fundos"
      ]
    },
    {
      "id": "ex-instrumentos",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: mesma emissora, direitos distintos",
      "body": "Na hipótese, uma companhia emite novas ações e novas debêntures simples. Ana subscreve ações: torna-se acionista. Bruno subscreve debêntures: torna-se credor. Em ambos os casos os recursos da emissão chegam à companhia, sem custos no exemplo. Se Ana depois vende suas ações a Carla, esse segundo pagamento vai a Ana, sem nova captação pela companhia.",
      "sourceIds": []
    },
    {
      "id": "riscos",
      "type": "explanation",
      "heading": "4. Prazo e risco continuam presentes",
      "body": "Quantidade de cotas não fixa seu preço futuro. Uma dívida não elimina risco de crédito, mercado ou liquidez. Uma classe aberta admite resgates conforme regras, mas isso não significa receber imediatamente em qualquer circunstância. Retomada: [CE-04, movimentação](ce-04-v1.md#movimentacao) e [CE-05, riscos](ce-05-v1.md#riscos).",
      "sourceIds": [
        "cvm.ce.fundos",
        "cvm.ce.risco"
      ]
    },
    {
      "id": "ex-riscos",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: do pedido ao dinheiro",
      "body": "No caso fictício, 30 cotas são resgatadas segundo valor de R$ 12 na conversão: R$ 360, sem encargos. O regulamento do caso separa o dia de pedido do dia de pagamento. Pedir resgate não antecipa automaticamente o recebimento. A quantidade 30, sozinha, também não prova que o resultado foi positivo: seria necessário conhecer a aplicação inicial e os demais fluxos.",
      "sourceIds": []
    },
    {
      "id": "cambio",
      "type": "explanation",
      "heading": "6. Taxa, operação e regime",
      "body": "Escreva a unidade da taxa e a perspectiva de compra/venda. Identifique a instituição e a finalidade da operação. Para classificar regime, leia o compromisso institucional: um episódio de intervenção não resolve a questão. Retomada: [CE-06](ce-06-v1.md#conversao), [CE-07](ce-07-v1.md#autorizacao) e [CE-08](ce-08-v1.md#flutuante).",
      "sourceIds": [
        "lei.14286",
        "bcb.ce.politica"
      ]
    },
    {
      "id": "ex-conversao",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: compra do cliente",
      "body": "Uma instituição informa compra de dólar a R$ 4,90 e venda a R$ 5,10, na perspectiva dela. O cliente compra US$ 40 sem outros custos: utiliza a venda da instituição e paga 40 × 5,10 = R$ 204. O exercício não identifica o regime do país nem prova que a instituição esteja habilitada; esses dados exigem informações próprias.",
      "sourceIds": []
    },
    {
      "id": "efeitos",
      "type": "explanation",
      "heading": "8. A mesma taxa em perguntas diferentes",
      "body": "Com q = e × P* ÷ P, é preciso acompanhar também os preços. Para receitas e despesas em dólares, mantenha contratos e custos explícitos. Para aplicar em reais e voltar a dólares, refaça as duas conversões. Retomada: [CE-09](ce-09-v1.md#formula), [CE-10](ce-10-v1.md#resultado) e [CE-11](ce-11-v1.md#moedas). Uma pressão sobre a cotação não é previsão garantida.",
      "sourceIds": [
        "imf.ce.real",
        "bcb.ce.transmissao"
      ]
    },
    {
      "id": "ex-efeitos",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: separar duas contas",
      "body": "Um caso informa e = 5, preço externo da cesta US$ 8 e preço doméstico R$ 40: q = 5 × 8 ÷ 40 = 1. Outro contrato, independente, prevê receita US$ 50 e despesa US$ 20, sem outros custos: resultado em reais = (50 − 20) × 5 = R$ 150. q é uma comparação de preços; R$ 150 é um resultado monetário do contrato. Não se confundem as unidades nem se usa um como prova de equilíbrio do outro.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário para separar confusões",
      "body": "Emissor: quem emite o instrumento. Cotista: titular de cotas. Crédito: cumprimento da obrigação. Liquidez: condição de converter em dinheiro. Cotação: relação entre moedas. Regime: regra de formação da taxa. Câmbio real: comparação ajustada pelos preços, conforme convenção. Diferencial: diferença entre taxas comparáveis. Prêmio de risco: compensação exigida, sem promessa de realização.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "O caminho é instrumento → direito → fluxo → prazo/risco → moeda → hipótese → cálculo → limite da conclusão. As oito questões abaixo reaplicam esse caminho em casos novos; cada uma remete às seções de origem. As 11 aulas estão representadas nas referências. Prática comentada e conclusão de ciclos não equivalem a uma avaliação independente de prontidão.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "cer.q01",
      "prompt": "Uma companhia emite ações e debêntures simples novas. Lia subscreve as ações e Rui, as debêntures. Sem custos no caso, qual leitura é correta?",
      "options": [
        "Ambos se tornam proprietários de ações.",
        "Lia é acionista, Rui é credor e a companhia recebe os recursos dessas emissões.",
        "A companhia não recebe recursos de nenhuma emissão.",
        "Rui recebe direito de voto de acionista apenas por ter a debênture simples."
      ],
      "answer": 1,
      "explanation": "O tipo de instrumento define o direito; a emissão nova define o destino inicial do recurso.",
      "optionRationales": [
        "Debênture simples não é ação.",
        "Correta: separa participação, dívida e captação.",
        "Confunde emissão nova com revenda.",
        "O crédito não cria automaticamente voto societário."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "instrumentos",
        "ex-instrumentos"
      ],
      "originRefs": [
        {
          "unit": "ce01",
          "sectionId": "mercados"
        },
        {
          "unit": "ce02",
          "sectionId": "inicio"
        },
        {
          "unit": "ce03",
          "sectionId": "inicio"
        }
      ]
    },
    {
      "id": "cer.q02",
      "prompt": "Uma classe aberta prevê pedido, conversão e pagamento em datas distintas. O cotista pede resgate, sem informação de conversão imediata. É correto concluir que:",
      "options": [
        "O dinheiro necessariamente está disponível no mesmo momento.",
        "A palavra 'aberta' elimina risco de mercado.",
        "O número de cotas determina sozinho o ganho.",
        "É preciso observar os prazos e condições; o pedido não é o pagamento."
      ],
      "answer": 3,
      "explanation": "A admissão de resgate não iguala suas etapas nem garante resultado.",
      "optionRationales": [
        "Contraria a separação de datas informada.",
        "O preço pode variar mesmo em classe aberta.",
        "Faltam preços e fluxos da aplicação.",
        "Correta: lê a condição efetiva de liquidez."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "riscos",
        "ex-riscos"
      ],
      "originRefs": [
        {
          "unit": "ce04",
          "sectionId": "movimentacao"
        },
        {
          "unit": "ce05",
          "sectionId": "riscos"
        }
      ]
    },
    {
      "id": "cer.q03",
      "prompt": "Uma instituição identificada informa, na perspectiva dela, compra a 4,70 e venda a 5,30 R$/US$. Sem outros custos, o cliente que compra US$ 20:",
      "options": [
        "Paga R$ 106; a habilitação da instituição é uma verificação própria.",
        "Paga R$ 94, e o preço sozinho prova autorização.",
        "Paga R$ 100, usando a média obrigatória.",
        "Recebe R$ 106, porque compra e venda são sempre do cliente."
      ],
      "answer": 0,
      "explanation": "A instituição vende: 20 × 5,30 = R$ 106. Cotação não comprova autorização.",
      "optionRationales": [
        "Correta: resolve a conversão sem inferir habilitação do preço.",
        "Usa a ponta contrária e uma conclusão indevida.",
        "Não há obrigação de usar média.",
        "O cliente paga para comprar, e a perspectiva foi declarada."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "cambio",
        "ex-conversao"
      ],
      "originRefs": [
        {
          "unit": "ce06",
          "sectionId": "perspectiva"
        },
        {
          "unit": "ce07",
          "sectionId": "autorizacao"
        }
      ]
    },
    {
      "id": "cer.q04",
      "prompt": "A taxa é formada no mercado e a autoridade intervém em uma disfunção, sem anunciar paridade a defender. Esse episódio:",
      "options": [
        "Prova regime fixo permanente.",
        "Prova uma banda de limites conhecidos.",
        "É compatível com flutuação; intervenção isolada não prova mudança de regime.",
        "Impede que o país adote flutuação."
      ],
      "answer": 2,
      "explanation": "A finalidade e o compromisso institucional importam para a classificação.",
      "optionRationales": [
        "Não existe compromisso fixo informado.",
        "Não foram informados limites.",
        "Correta: evita classificar apenas pelo evento.",
        "Flutuação não requer inação absoluta."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "cambio"
      ],
      "originRefs": [
        {
          "unit": "ce08",
          "sectionId": "flutuante"
        },
        {
          "unit": "ce08",
          "sectionId": "ex-flutuante"
        }
      ]
    },
    {
      "id": "cer.q05",
      "prompt": "Use q = e × P* ÷ P. e permanece 4 R$/US$ e P* permanece US$ 10; P sobe de R$ 32 para R$ 40. q:",
      "options": [
        "Fica constante porque e não mudou.",
        "Sobe de 1 para 1,25.",
        "Prova que a cotação estava em equilíbrio quando q era 1.",
        "Cai de 1,25 para 1, apesar da cotação nominal constante."
      ],
      "answer": 3,
      "explanation": "O numerador permanece R$ 40 e o denominador sobe: 40 ÷ 32 e 40 ÷ 40.",
      "optionRationales": [
        "Ignora o preço doméstico.",
        "Inverte antes e depois.",
        "q igual a 1 no modelo não demonstra equilíbrio econômico.",
        "Correta: os preços também alteram a medida real."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "efeitos",
        "ex-efeitos"
      ],
      "originRefs": [
        {
          "unit": "ce09",
          "sectionId": "formula"
        },
        {
          "unit": "ce09",
          "sectionId": "ex-precos"
        }
      ]
    },
    {
      "id": "cer.q06",
      "prompt": "Uma firma recebe US$ 70, paga US$ 20 de insumos e R$ 50 de outros custos. A 5 R$/US$, sem outros itens, o resultado é:",
      "options": [
        "R$ 350.",
        "R$ 200.",
        "R$ 250.",
        "US$ 200."
      ],
      "answer": 1,
      "explanation": "Receita R$ 350 menos custo importado R$ 100 menos custo local R$ 50 = R$ 200.",
      "optionRationales": [
        "É a receita antes dos custos.",
        "Correta: deduz os dois custos.",
        "Falta deduzir o custo local.",
        "A conta pedida usa reais."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "efeitos",
        "ex-efeitos"
      ],
      "originRefs": [
        {
          "unit": "ce10",
          "sectionId": "resultado"
        },
        {
          "unit": "ce10",
          "sectionId": "ex-resultado"
        }
      ]
    },
    {
      "id": "cer.q07",
      "prompt": "US$ 50 são convertidos a 4 R$/US$ e rendem 10% em reais no período. Sem custos, a reconversão a 4,40 R$/US$ dá:",
      "options": [
        "US$ 55, pois rendimento em reais e em dólares sempre coincide.",
        "US$ 220, ignorando a unidade.",
        "US$ 50; o retorno em dólares foi zero no caso.",
        "Ganho garantido de 10% em qualquer cotação."
      ],
      "answer": 2,
      "explanation": "São R$ 200 iniciais, R$ 220 finais e 220 ÷ 4,40 = US$ 50.",
      "optionRationales": [
        "Ignora a nova taxa de conversão.",
        "Confunde reais com dólares.",
        "Correta: contabiliza as duas conversões.",
        "O câmbio final faz parte do resultado."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "efeitos"
      ],
      "originRefs": [
        {
          "unit": "ce11",
          "sectionId": "moedas"
        },
        {
          "unit": "ce11",
          "sectionId": "ex-conversao"
        },
        {
          "unit": "ce06",
          "sectionId": "conversao"
        }
      ]
    },
    {
      "id": "cer.q08",
      "prompt": "Um anúncio afirma: 'A taxa doméstica subiu; portanto a moeda certamente vai valorizar e qualquer aplicação local terá lucro em dólares'. Qual resposta é adequada?",
      "options": [
        "Juros podem influenciar fluxos, mas riscos, expectativas e reconversão impedem essa garantia.",
        "A promessa está correta porque uma taxa elimina todos os riscos.",
        "A conclusão independe do câmbio de saída.",
        "O retorno esperado é igual ao realizado por definição."
      ],
      "answer": 0,
      "explanation": "O anúncio transforma relações condicionais em certeza sobre o retorno.",
      "optionRationales": [
        "Correta: considera os fatores ensinados.",
        "Taxa maior não elimina riscos.",
        "A reconversão altera o valor na moeda inicial.",
        "Expectativa não é resultado recebido."
      ],
      "objectiveIds": [
        "O2",
        "O5"
      ],
      "recoverySectionIds": [
        "riscos",
        "efeitos"
      ],
      "originRefs": [
        {
          "unit": "ce05",
          "sectionId": "retorno"
        },
        {
          "unit": "ce11",
          "sectionId": "expectativas"
        },
        {
          "unit": "ce11",
          "sectionId": "fluxo"
        }
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
    "editorialPass": "cer-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cer.q01": [
        {
          "missionId": "draft.cer",
          "sectionId": "instrumentos"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "ex-instrumentos"
        }
      ],
      "cer.q02": [
        {
          "missionId": "draft.cer",
          "sectionId": "riscos"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "ex-riscos"
        }
      ],
      "cer.q03": [
        {
          "missionId": "draft.cer",
          "sectionId": "cambio"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "ex-conversao"
        }
      ],
      "cer.q04": [
        {
          "missionId": "draft.cer",
          "sectionId": "cambio"
        }
      ],
      "cer.q05": [
        {
          "missionId": "draft.cer",
          "sectionId": "efeitos"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "ex-efeitos"
        }
      ],
      "cer.q06": [
        {
          "missionId": "draft.cer",
          "sectionId": "efeitos"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "ex-efeitos"
        }
      ],
      "cer.q07": [
        {
          "missionId": "draft.cer",
          "sectionId": "efeitos"
        }
      ],
      "cer.q08": [
        {
          "missionId": "draft.cer",
          "sectionId": "riscos"
        },
        {
          "missionId": "draft.cer",
          "sectionId": "efeitos"
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
      "item": "Itens 5 (investimentos), 6–11 — mesmos recortes de CE-01–11",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 19 (investimentos), 20–25 — mesmos recortes de CE-01–11",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Relacionar instrumento, emissor e destino dos recursos.",
    "O2": "Interpretar cotas, liquidez e riscos sem garantia de retorno.",
    "O3": "Ler conversão, instituição e regime sem extrapolar o enunciado.",
    "O4": "Aplicar convenções de câmbio real e efeitos parciais sobre comércio.",
    "O5": "Integrar juros, risco e reconversão distinguindo hipótese e previsão.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Revisão das 11 aulas escritas; não introduz conteúdo novo nem mede retenção independente. O Chefe ainda é proposta, sem itens publicados.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [
  {
    "label": "ex2 resgate",
    "operation": "multiply",
    "values": [
      30,
      12
    ],
    "expected": 360
  },
  {
    "label": "ex3 compra",
    "operation": "multiply",
    "values": [
      40,
      5.1
    ],
    "expected": 204
  },
  {
    "label": "ex4 cesta",
    "operation": "multiply",
    "values": [
      5,
      8
    ],
    "expected": 40
  },
  {
    "label": "ex4 q",
    "operation": "divide",
    "values": [
      40,
      40
    ],
    "expected": 1
  },
  {
    "label": "ex4 saldo USD",
    "operation": "subtract",
    "values": [
      50,
      20
    ],
    "expected": 30
  },
  {
    "label": "ex4 saldo BRL",
    "operation": "multiply",
    "values": [
      30,
      5
    ],
    "expected": 150
  },
  {
    "label": "q3 compra",
    "operation": "multiply",
    "values": [
      20,
      5.3
    ],
    "expected": 106
  },
  {
    "label": "q5 cesta",
    "operation": "multiply",
    "values": [
      4,
      10
    ],
    "expected": 40
  },
  {
    "label": "q5 q antes",
    "operation": "divide",
    "values": [
      40,
      32
    ],
    "expected": 1.25
  },
  {
    "label": "q5 q depois",
    "operation": "divide",
    "values": [
      40,
      40
    ],
    "expected": 1
  },
  {
    "label": "q6 receita",
    "operation": "multiply",
    "values": [
      70,
      5
    ],
    "expected": 350
  },
  {
    "label": "q6 custo USD",
    "operation": "multiply",
    "values": [
      20,
      5
    ],
    "expected": 100
  },
  {
    "label": "q6 margem",
    "operation": "subtract",
    "values": [
      350,
      100
    ],
    "expected": 250
  },
  {
    "label": "q6 resultado",
    "operation": "subtract",
    "values": [
      250,
      50
    ],
    "expected": 200
  },
  {
    "label": "q7 inicial",
    "operation": "multiply",
    "values": [
      50,
      4
    ],
    "expected": 200
  },
  {
    "label": "q7 final",
    "operation": "multiply",
    "values": [
      200,
      1.1
    ],
    "expected": 220
  },
  {
    "label": "q7 dólares",
    "operation": "divide",
    "values": [
      220,
      4.4
    ],
    "expected": 50
  }
];
