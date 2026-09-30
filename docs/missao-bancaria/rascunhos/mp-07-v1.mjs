// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "stn.fiscal",
    "label": "Tesouro Nacional — Sobre Política Fiscal",
    "url": "https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento/sobre-politica-fiscal",
    "version": "Atualização de 08/07/2022, consultada em 30/09/2026",
    "locator": "Receitas/despesas, fluxos/estoques e resultado primário; exemplo didático não reproduz contabilidade fiscal oficial.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l4320",
    "label": "Lei 4.320/1964 — orçamento e execução",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4320.htm",
    "version": "Texto consultado em 30/09/2026",
    "locator": "Arts. 47–50, 90 e 102: limites autorizados, programação, execução e comparação entre previsão e realização. Sem apresentar processo orçamentário completo.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.d12814",
    "label": "Decreto 12.814/2026 — títulos públicos",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12814.htm",
    "version": "Decreto de 09/01/2026, DOU de 12/01/2026; consultado em 30/09/2026",
    "locator": "Arts. 2º, 3º, 7º e 11: LTN/LFT/NTN-B/NTN-F. Arts. 31–32: revogação do Decreto 11.301/2022 e vigência na publicação. Recorte introdutório, sem listar todas as séries.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "cvm.primario",
    "label": "CVM — Mercado primário x mercado secundário",
    "url": "https://www.gov.br/investidor/pt-br/investir/como-investir/como-funciona-a-bolsa/mercado-primario-x-mercado-secundario",
    "version": "Publicação de 26/08/2022, consulta reaproveitada em 30/09/2026",
    "locator": "Emissão/captação e negociação de títulos existentes; exemplos delimitados ao emissor e às contrapartes indicadas.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l4595",
    "label": "Lei 4.595/1964",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l4595.htm",
    "version": "Redação dos incisos V e XII do artigo 10 dada pela LC 179/2021, consultada em 30/09/2026",
    "locator": "Competências do BCB para redesconto/empréstimo e operações com títulos federais, sob regulamentação; não confundir trechos revogados com vigentes.",
    "checkedAt": "2026-09-30"
  }
];
export const MP07_DRAFT = {
  "id": "draft.mp07",
  "topicId": "draft.mp07",
  "editorialKey": "MP-07",
  "candidateBlockId": "banking.markets-policy",
  "title": "Orçamento, dívida pública e títulos",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Separar planejamento orçamentário, fluxos de financiamento e estoque de dívida; distinguir emissão, negociação posterior e formas básicas de remuneração de títulos.",
  "sourceIds": [
    "stn.fiscal",
    "br.l4320",
    "br.d12814",
    "cvm.primario",
    "br.l4595"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Dívida não é uma palavra para qualquer gasto",
      "body": "Pré-requisitos: mercados em [MP-01](mp-01-v1.md), porcentagens/juros em [MP-03](mp-03-v1.md) e título/participantes em [MP-05](mp-05-v1.md). Comprar um bem, planejar uma despesa, arrecadar receita e emitir dívida são fatos diferentes. Nesta aula, acompanharemos quem entrega recursos e qual obrigação nasce ou permanece. Os exemplos são modelos fictícios, sem reproduzir o orçamento federal ou avaliar a situação fiscal atual.",
      "sourceIds": []
    },
    {
      "id": "orcamento",
      "type": "explanation",
      "heading": "2. Orçamento e política fiscal",
      "body": "Orçamento público organiza a previsão de receitas e a autorização de despesas de um período. Prever arrecadação não significa que o dinheiro já entrou; autorizar despesa não significa que todo valor já foi pago. Política fiscal envolve escolhas de receitas e despesas, com efeitos econômicos e distributivos. Para entender uma notícia, separe plano, execução e financiamento. Uma autorização de gasto, por si só, não demonstra que houve emissão de título nem que o BCB mudou a taxa de juros.",
      "sourceIds": [
        "stn.fiscal",
        "br.l4320"
      ]
    },
    {
      "id": "fluxo-estoque",
      "type": "explanation",
      "heading": "3. Fluxo ao longo do período, estoque em uma data",
      "body": "Fluxo mede o que ocorreu entre datas; estoque mede uma posição em determinada data. Arrecadar 100 durante o ano é fluxo. Dever 500 no encerramento é estoque. Déficit e dívida não são o mesmo número. A evolução da dívida depende de emissões, resgates e outros ajustes; um resultado fiscal do período não deve ser somado mecanicamente a qualquer medida de dívida sem conhecer a definição. Aqui usaremos um modelo declarado sem juros nem ajustes, só para aprender o raciocínio.",
      "sourceIds": [
        "stn.fiscal"
      ]
    },
    {
      "id": "exemplo-fluxo",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: necessidade e forma de financiamento",
      "body": "Modelo fictício: entradas de recursos de 100, pagamentos de 120 no período, sem caixa inicial e sem outros fluxos. A diferença é 120 − 100 = 20. Para que todos os pagamentos do modelo ocorram, faltam 20. Se o governo emitir um título por 20 e um investidor o comprar, entram os recursos e nasce a obrigação nas condições do título. O gasto não se tornou gratuito. A necessidade de 20 não prova que a dívida total é 20: pode existir estoque anterior. O caso não descreve regras legais de autorização de endividamento.",
      "sourceIds": []
    },
    {
      "id": "resultado",
      "type": "explanation",
      "heading": "5. Resultado primário e juros: cuidado com o recorte",
      "body": "O resultado primário compara receitas e despesas classificadas como primárias no período; não incorpora os juros da dívida nesse recorte. Superávit primário indica receitas primárias maiores que despesas primárias; déficit, o inverso. O resultado nominal incorpora também os juros líquidos, observadas a metodologia e a convenção de sinais da fonte. Um superávit primário não implica automaticamente ausência de dívida nem dispensa de refinanciar vencimentos. Para cálculos oficiais, são necessárias as classificações e a metodologia, que não serão presumidas.",
      "sourceIds": [
        "stn.fiscal"
      ]
    },
    {
      "id": "exemplo-estoque",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: refinanciar não é zerar a dívida",
      "body": "Modelo sem juros, indexação ou outros ajustes: estoque inicial 500. Durante o período, vencem e são pagos 100; uma nova emissão de 100 fornece os recursos para esse pagamento. Estoque final: 500 − 100 + 100 = 500. Houve emissão e resgate, embora o estoque final não tenha aumentado. Se a emissão fosse de 120 com o mesmo resgate de 100, o estoque seria 520 no modelo. Refinanciar é obter novo financiamento para cumprir obrigações; não significa que o credor perdoou a dívida.",
      "sourceIds": []
    },
    {
      "id": "emissao-negociacao",
      "type": "explanation",
      "heading": "7. Mercado primário e negociação posterior",
      "body": "Na emissão do nosso exemplo, o investidor entrega recursos ao emissor e recebe o título. Se depois vende esse título existente a outro investidor, o pagamento da negociação vai ao vendedor. Isso não é automaticamente nova captação do emissor. O título continua representando a obrigação definida; muda quem detém o direito. O preço de revenda pode ser diferente do preço pago antes. No caso de títulos federais, identifique se a operação é emissão do Tesouro ou atuação do BCB com finalidade monetária: os papéis não se confundem.",
      "sourceIds": [
        "cvm.primario",
        "br.l4595"
      ]
    },
    {
      "id": "exemplo-secundario",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: seguir o pagamento até o destinatário",
      "body": "Caso fictício: na emissão, Ana paga 90 ao emissor por um título. Depois Bruno compra esse mesmo título de Ana por 92. Na segunda operação, os 92 vão a Ana; Bruno passa a deter o título. O emissor não recebeu mais 92 só por causa dessa troca. A diferença de 2 entre os preços é um ganho bruto de negociação para Ana no modelo, sem custos ou outros pagamentos. Não é a remuneração garantida a Bruno nem uma nova dívida de Ana com ele.",
      "sourceIds": []
    },
    {
      "id": "remuneracao",
      "type": "explanation",
      "heading": "9. Três leituras básicas da remuneração",
      "body": "Prefixado: a condição de remuneração nominal é definida na contratação; isso não fixa o preço de uma revenda futura. Pós-fixado: a remuneração depende da evolução de um referencial especificado. Vinculado à inflação: usa índice de preços, podendo combinar atualização do principal com uma parcela de juros definida. É necessário ler prazo e fluxo de pagamentos. Cupom é um pagamento periódico de juros; não é sinônimo do valor total recebido nem está presente em todo título. “Valor nominal do título” é uma referência contratual, distinta do contraste entre taxa nominal e real em MP-03.",
      "sourceIds": []
    },
    {
      "id": "titulos-2026",
      "type": "explanation",
      "heading": "10. Exemplos federais com data normativa explícita",
      "body": "Recorte do Decreto 12.814/2026: LTN tem rendimento definido pelo deságio sobre o valor nominal e resgate desse valor no vencimento; LFT tem rendimento associado à taxa Selic indicada na norma; NTN-B atualiza o valor nominal pelo IPCA e prevê juros semestrais; NTN-F prevê juros semestrais e resgate do valor nominal. Deságio é preço inferior à referência nominal. Essas siglas não esgotam os títulos/séries existentes. O decreto entrou em vigor em sua publicação, em 12/01/2026, revogando o Decreto 11.301/2022. Não se deve usar a norma antiga, ainda ligada em página de 2023, como prova da regra atual. Tampouco transpor a norma de 2026 para uma prova histórica sem declarar a data de corte.",
      "sourceIds": [
        "br.d12814"
      ]
    },
    {
      "id": "exemplo-preco",
      "type": "worked-example",
      "heading": "11. Exemplo resolvido: valor prometido e preço de venda",
      "body": "Título inteiramente fictício de pagamento único de 100 no fim do período. Carla compra por 95; se houver pagamento integral no vencimento, a diferença bruta será 5. Antes disso, uma proposta de compra de 93 significaria receber 2 menos que os 95 pagos, se ela aceitasse vender, sem custos ou pagamentos anteriores. Saber o recebimento contratual no vencimento não fixa a proposta de revenda. Esse modelo simples não descreve todos os títulos citados nem suas condições comerciais.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Vocabulário fiscal e de títulos",
      "body": "Orçamento: previsão/autorização organizada para um período. Execução: fatos realizados. Fluxo: movimento entre datas. Estoque: posição numa data. Emissão: criação/colocação de um título pelo emissor nas condições da operação. Resgate: cumprimento do pagamento do título. Refinanciamento: novo financiamento para cumprir obrigação existente. Indexação: atualização por referencial. Cupom: juros periódicos. Deságio: diferença de preço abaixo do valor de referência.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. O roteiro para ler um caso de dívida",
      "body": "Marque período e data, separe estoque e fluxo, identifique emissão ou negociação de título existente e descubra o destinatário dos recursos. Depois leia indexador, vencimento e pagamentos. Não use o nome do título para prometer uma revenda sem perda. Ao recuperar um erro, redesenhe quem paga a quem e indique a informação que ainda falta para concluir.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Uma despesa foi autorizada no orçamento. O que esse fato sozinho comprova?",
      "options": [
        "Que foi paga integralmente.",
        "Que o BCB já comprou o título correspondente.",
        "A autorização prevista, não a execução do pagamento ou sua forma de financiamento.",
        "Que a arrecadação prevista entrou integralmente."
      ],
      "answer": 2,
      "explanation": "Autorização, execução e financiamento precisam ser verificados separadamente.",
      "optionRationales": [
        "Confunde autorização e realização.",
        "Inventa operação monetária.",
        "Respeita o alcance do dado.",
        "Previsão de receita não é recebimento."
      ],
      "recoverySectionIds": [
        "orcamento"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp07.q01",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "Qual dado é estoque, e não fluxo do período?",
      "options": [
        "Receita arrecadada durante o mês.",
        "Dívida apurada no encerramento do mês.",
        "Resgates pagos durante o ano.",
        "Títulos emitidos durante a semana."
      ],
      "answer": 1,
      "explanation": "A dívida numa data é uma posição; os demais itens são movimentos entre datas.",
      "optionRationales": [
        "É entrada ao longo de um intervalo.",
        "Identifica posição temporal.",
        "É saída ocorrida no período.",
        "É movimento de emissão."
      ],
      "recoverySectionIds": [
        "fluxo-estoque"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp07.q02",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "No modelo sem ajustes, estoque inicial 300, resgates 40 e emissões 50. Qual estoque final?",
      "options": [
        "310.",
        "90.",
        "350.",
        "260."
      ],
      "answer": 0,
      "explanation": "300 − 40 + 50 = 310; é preciso considerar os dois fluxos.",
      "optionRationales": [
        "Inclui posição inicial e ambos os movimentos.",
        "Soma fluxos e ignora estoque inicial.",
        "Ignora resgates.",
        "Ignora emissões."
      ],
      "recoverySectionIds": [
        "fluxo-estoque",
        "exemplo-estoque"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp07.q03",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "O governo tem superávit primário em um período. Qual conclusão é indevida apenas com essa informação?",
      "options": [
        "Receitas primárias excederam despesas primárias no recorte.",
        "É necessário observar juros para outro recorte de resultado.",
        "Pode haver vencimentos a refinanciar.",
        "Toda a dívida pública já foi eliminada."
      ],
      "answer": 3,
      "explanation": "Um resultado de fluxo não demonstra estoque nulo de dívida.",
      "optionRationales": [
        "É o sentido do superávit primário definido.",
        "Reconhece o recorte dos juros.",
        "É compatível com obrigações anteriores.",
        "Confunde resultado do período e dívida acumulada."
      ],
      "recoverySectionIds": [
        "resultado",
        "exemplo-estoque"
      ],
      "objectiveIds": [
        "O2",
        "O3"
      ],
      "id": "mp07.q04",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "Um investidor vende um título existente a outro por 70. Quem recebe esses 70 na negociação descrita?",
      "options": [
        "Necessariamente o emissor como nova captação.",
        "O investidor vendedor.",
        "O BCB, mesmo sem participar.",
        "Ninguém, pois títulos existentes não têm preço."
      ],
      "answer": 1,
      "explanation": "A negociação transfere recursos ao detentor que vendeu, sem nova emissão indicada.",
      "optionRationales": [
        "Confunde emissão e revenda.",
        "Segue o fluxo descrito.",
        "Introduz participante ausente.",
        "Nega o pagamento explicitamente informado."
      ],
      "recoverySectionIds": [
        "emissao-negociacao",
        "exemplo-secundario"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp07.q05",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "Qual associação respeita o recorte normativo explicitamente datado na aula?",
      "options": [
        "Toda LTN paga cupom semestral.",
        "Toda NTN-B é sem indexação.",
        "LFT tem rendimento associado à Selic na norma; NTN-B tem atualização pelo IPCA e juros semestrais.",
        "Só existem duas espécies de título público."
      ],
      "answer": 2,
      "explanation": "São características selecionadas do Decreto 12.814/2026, sem inventário completo.",
      "optionRationales": [
        "Transpõe cupom de outro título.",
        "Nega a atualização indicada.",
        "Preserva as características ensinadas.",
        "Transforma recorte em lista exaustiva."
      ],
      "recoverySectionIds": [
        "remuneracao",
        "titulos-2026"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp07.q06",
      "topicId": "draft.mp07"
    },
    {
      "prompt": "Saber o valor de pagamento de um título fictício no vencimento garante a mesma quantia ao vendê-lo antes?",
      "options": [
        "Sim, preço de negociação e pagamento final são sempre iguais.",
        "Não: a revenda tem preço próprio, que pode gerar perda em relação à compra.",
        "Sim, prefixado significa preço de revenda fixo.",
        "Não: títulos nunca podem ser negociados."
      ],
      "answer": 1,
      "explanation": "Condição de vencimento e preço antes dele são variáveis distintas.",
      "optionRationales": [
        "Confunde duas datas e operações.",
        "Reconhece risco da negociação antecipada.",
        "Confunde remuneração contratada e mercado secundário.",
        "Generaliza proibição inexistente."
      ],
      "recoverySectionIds": [
        "remuneracao",
        "exemplo-preco"
      ],
      "objectiveIds": [
        "O4",
        "O5"
      ],
      "id": "mp07.q07",
      "topicId": "draft.mp07"
    }
  ],
  "recall": [
    "Dê um exemplo de fluxo e de estoque, indicando as datas.",
    "Reconstrua emissão, revenda e resgate com participantes diferentes.",
    "Após errar, escreva qual informação foi confundida: autorização, pagamento, estoque, fluxo ou preço."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp07-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp07.q01": [
        {
          "missionId": "draft.mp07",
          "sectionId": "orcamento"
        }
      ],
      "mp07.q02": [
        {
          "missionId": "draft.mp07",
          "sectionId": "fluxo-estoque"
        }
      ],
      "mp07.q03": [
        {
          "missionId": "draft.mp07",
          "sectionId": "fluxo-estoque"
        },
        {
          "missionId": "draft.mp07",
          "sectionId": "exemplo-estoque"
        }
      ],
      "mp07.q04": [
        {
          "missionId": "draft.mp07",
          "sectionId": "resultado"
        },
        {
          "missionId": "draft.mp07",
          "sectionId": "exemplo-estoque"
        }
      ],
      "mp07.q05": [
        {
          "missionId": "draft.mp07",
          "sectionId": "emissao-negociacao"
        },
        {
          "missionId": "draft.mp07",
          "sectionId": "exemplo-secundario"
        }
      ],
      "mp07.q06": [
        {
          "missionId": "draft.mp07",
          "sectionId": "remuneracao"
        },
        {
          "missionId": "draft.mp07",
          "sectionId": "titulos-2026"
        }
      ],
      "mp07.q07": [
        {
          "missionId": "draft.mp07",
          "sectionId": "remuneracao"
        },
        {
          "missionId": "draft.mp07",
          "sectionId": "exemplo-preco"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "B/C/E redigidas; revisão factual/editorial do autor; revisão independente/humana pendente; integração F não iniciada",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Item 4",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 18",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "Modelo fiscal simplificado; não cobre processo orçamentário completo, limites de endividamento ou metodologia oficial dos resultados.",
    "Características de títulos delimitadas ao Decreto 12.814/2026; não é catálogo de ofertas do Tesouro Direto nem promessa de rentabilidade.",
    "Preço, tributos, regras de compra/resgate e cálculo de cupons exigem ensino próprio antes de cobrança.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Necessidade",
    "operation": "subtract",
    "values": [
      120,
      100
    ],
    "expected": 20
  },
  {
    "label": "Estoque após resgate",
    "operation": "subtract",
    "values": [
      500,
      100
    ],
    "expected": 400
  },
  {
    "label": "Refinanciamento igual",
    "operation": "add",
    "values": [
      400,
      100
    ],
    "expected": 500
  },
  {
    "label": "Refinanciamento maior",
    "operation": "add",
    "values": [
      400,
      120
    ],
    "expected": 520
  },
  {
    "label": "Revenda",
    "operation": "subtract",
    "values": [
      92,
      90
    ],
    "expected": 2
  },
  {
    "label": "Pagamento final",
    "operation": "subtract",
    "values": [
      100,
      95
    ],
    "expected": 5
  },
  {
    "label": "Perda de revenda",
    "operation": "subtract",
    "values": [
      93,
      95
    ],
    "expected": -2
  },
  {
    "label": "q03 resgate",
    "operation": "subtract",
    "values": [
      300,
      40
    ],
    "expected": 260
  },
  {
    "label": "q03 emissão",
    "operation": "add",
    "values": [
      260,
      50
    ],
    "expected": 310
  }
];
