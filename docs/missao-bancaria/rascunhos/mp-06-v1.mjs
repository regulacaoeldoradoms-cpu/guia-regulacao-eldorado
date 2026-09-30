// Rascunho editorial, sem importação pelo runtime. Valores didáticos são fictícios.
export const SOURCES = [
  {
    "id": "boe.qe",
    "label": "Bank of England — Quantitative easing",
    "url": "https://www.bankofengland.co.uk/monetary-policy/quantitative-easing",
    "version": "Página atualizada em 05/12/2025, consultada em 30/09/2026",
    "locator": "Conceito de compras de títulos com reservas e transmissão para juros mais longos; contexto britânico iniciado em março de 2009. Não transpor política, meta ou situação atual ao Brasil.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "br.l14185",
    "label": "Lei 14.185/2021 — depósitos voluntários",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14185.htm",
    "version": "Lei de 14/07/2021, publicada em 15/07/2021; texto consultado em 30/09/2026",
    "locator": "Artigos 1º e 3º: autorização, remuneração definida pelo BCB e condições regulamentares; não informa taxa vigente.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.selic",
    "label": "BCB — Taxa Selic",
    "url": "https://www.bcb.gov.br/controleinflacao/taxaselic",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Definição da taxa efetiva nas compromissadas de um dia útil e atuação para alinhá-la à meta definida pelo Copom. Sem usar o valor atual.",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "bcb.compulsorios",
    "label": "BCB — Recolhimentos compulsórios",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/recolhimentoscompulsorios",
    "version": "Página institucional consultada em 30/09/2026",
    "locator": "Recolhimento obrigatório ao BCB, liquidez e estabilidade financeira. Não utilizada para alíquotas atuais.",
    "checkedAt": "2026-09-30"
  }
];
export const MP06_DRAFT = {
  "id": "draft.mp06",
  "topicId": "draft.mp06",
  "editorialKey": "MP-06",
  "candidateBlockId": "banking.markets-policy",
  "title": "Instrumentos não convencionais e temas datados",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Explicar a ideia de QE e distinguir compra de ativos, operação temporária e depósito voluntário remunerado, identificando país, data e limites de cada referência.",
  "sourceIds": [
    "boe.qe",
    "br.l14185",
    "bcb.selic",
    "bcb.compulsorios"
  ],
  "sections": [
    {
      "id": "retomada",
      "type": "explanation",
      "heading": "1. Comparar instrumentos exige contexto",
      "body": "Leia [MP-04](mp-04-v1.md) e [MP-05](mp-05-v1.md) antes desta unidade. Política monetária não se resume a uma única ferramenta. “Não convencional” costuma identificar instrumentos usados em contextos em que a atuação usual sobre juros de curto prazo encontra limites. O nome não torna duas medidas equivalentes. Vamos estudar um exemplo estrangeiro de compra de ativos e uma autorização brasileira de depósitos: fatos distintos, sem afirmar que o Brasil adotou o programa estrangeiro.",
      "sourceIds": []
    },
    {
      "id": "qe",
      "type": "explanation",
      "heading": "2. QE: a ideia e o caso britânico delimitado",
      "body": "Quantitative easing, ou QE, envolve compras de ativos pelo banco central, em programas voltados a influenciar condições financeiras além da taxa curta. No exemplo do Bank of England, compras de títulos pagas com reservas do banco central buscaram reduzir juros mais longos e apoiar gasto, especialmente com pouco espaço para reduzir a taxa curta. Reservas aqui são registros de recursos no banco central, não cédulas entregues diretamente a cada família. O BoE iniciou QE em março de 2009. A data identifica um caso histórico; não descreve a política brasileira atual.",
      "sourceIds": [
        "boe.qe"
      ]
    },
    {
      "id": "preco-rendimento",
      "type": "explanation",
      "heading": "3. Apoio de matemática: preço e retorno de um pagamento fixo",
      "body": "Considere apenas um título fictício que promete pagar 110 em uma data futura, sem pagamentos intermediários. Se comprado por 100 e pago integralmente no prazo, o retorno bruto do período é (110 − 100)/100 = 10%. Se o mesmo pagamento de 110 for comprado por 105, o retorno bruto será (110 − 105)/105, aproximadamente 4,7619%. Pagamento e data iguais, preço maior e retorno menor. Isso é uma derivação do modelo, não uma fórmula completa de precificação de títulos com cupons nem uma taxa anualizada.",
      "sourceIds": []
    },
    {
      "id": "exemplo-qe",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: seguir uma compra de ativos",
      "body": "Em um país fictício, o banco central compra um título já existente de um investidor; a liquidação passa pelo banco desse investidor. O investidor troca o título por recursos e o sistema bancário recebe reservas na liquidação. A compra pode pressionar o preço do título para cima; no modelo de pagamento fixo, um preço maior corresponde a retorno menor. Isso ajuda a compreender o canal de juros, mas não prova que todo vendedor gastará, que todo banco emprestará ou que cada preço subirá em proporção fixa.",
      "sourceIds": [
        "boe.qe"
      ]
    },
    {
      "id": "comparar",
      "type": "explanation",
      "heading": "5. QE e compromissada não são sinônimos",
      "body": "Nos exemplos de MP-05, a operação tinha retorno combinado: compra/venda agora e operação inversa depois. No programa de QE aqui estudado, a explicação é a compra de ativos e manutenção de uma carteira como instrumento. Título, prazo, escala, finalidade e condições precisam ser conhecidos; não basta o banco central aparecer comprando algo para chamar a operação de QE. Uma negociação de curto prazo para alinhar a taxa efetiva à meta também não prova, por si, a existência de um programa de compras de longo alcance.",
      "sourceIds": [
        "boe.qe",
        "bcb.selic"
      ]
    },
    {
      "id": "depositos",
      "type": "explanation",
      "heading": "6. Depósitos voluntários remunerados no Brasil",
      "body": "A Lei 14.185, de 14 de julho de 2021, autorizou o BCB a acolher depósitos voluntários à vista ou a prazo de instituições financeiras, com remuneração por ele estabelecida. As condições dos depósitos a prazo, como limites, prazos e negociação, dependem de regulamentação do BCB. Voluntário distingue a escolha de contratar da exigência de compulsório. Remunerado indica pagamento segundo condições; não significa conta varejista aberta a qualquer pessoa. A lei não fornece uma taxa universal para usar hoje.",
      "sourceIds": [
        "br.l14185"
      ]
    },
    {
      "id": "exemplo-deposito",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: depósito não é compra de título",
      "body": "Caso fictício: um banco decide colocar 80 unidades em um depósito a prazo no banco central, conforme condições dadas. Durante o prazo estipulado, esses recursos deixam de estar livres para outros pagamentos do banco; ele tem o direito definido pelo depósito. Não houve, no enunciado, compra de título de um investidor nem obrigação de recolhimento calculada sobre captação. Para descrever remuneração e retirada, precisaríamos das condições contratadas. Não se deve preencher essa falta de dados com a taxa de outro instrumento.",
      "sourceIds": []
    },
    {
      "id": "exemplo-classificacao",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: três fatos, três justificativas",
      "body": "Situação A: banco cumpre recolhimento exigido por uma regra sobre sua captação — compulsório. B: banco escolhe depósito a prazo remunerado no banco central — depósito voluntário nas condições aplicáveis. C: banco central anuncia programa de compras de ativos com objetivo de influenciar condições mais longas — caso compatível com o conceito de QE ensinado. Ter banco central e recursos financeiros nos três relatos não apaga a diferença entre obrigação, contrato de depósito e compra de ativos.",
      "sourceIds": []
    },
    {
      "id": "datas",
      "type": "explanation",
      "heading": "9. Não usar o tempo presente de uma página antiga",
      "body": "Fonte e data fazem parte do conteúdo. A lei brasileira é de 2021; a página explicativa britânica consultada foi atualizada em 2025 e descreve iniciativas históricas. Referências BB 2022/001 e CAIXA 2024/NM também são históricas. Uma questão conceitual pode usar esses fatos delimitados; uma questão sobre a política “atual” exigiria checagem específica do país e do período. Não estamos dizendo que um anúncio britânico vale como norma brasileira ou que todo instrumento novo é QE.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Termos com limites explícitos",
      "body": "QE: programa de compras de ativos com finalidade monetária, no recorte ensinado. Reservas do banco central: recursos registrados para a liquidação bancária, distintos do papel-moeda nas mãos do público. Carteira: conjunto de ativos mantidos. Depósito voluntário: recursos colocados por escolha contratual. Remuneração: pagamento estabelecido nas condições da operação. Retorno bruto do modelo: diferença recebimento/preço em relação ao preço, sem custos, tributos ou inadimplência.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "11. Quatro perguntas para classificar",
      "body": "Identifique país e período; depois quem entrega os recursos e que direito recebe; verifique se há imposição de uma regra ou escolha contratual; por fim veja se existe reversão previamente combinada. Não conclua pela palavra “liquidez” isolada. Depois de errar, mude apenas uma característica do caso e explique por que a classificação muda ou permanece.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "No exemplo britânico apresentado, qual descrição corresponde ao QE?",
      "options": [
        "Empréstimo pessoal automático para toda família.",
        "Recolhimento compulsório calculado sobre depósitos.",
        "Compras de títulos com reservas buscando influenciar condições financeiras mais longas.",
        "Decisão que proíbe qualquer variação de preços."
      ],
      "answer": 2,
      "explanation": "A operação ensinada compra ativos e procura influenciar condições financeiras; não concede crédito pessoal direto.",
      "optionRationales": [
        "Confunde canal de transmissão e contrato de varejo.",
        "Troca aquisição de ativos por obrigação de recolhimento.",
        "Mantém instrumento e objetivo do exemplo.",
        "Cria garantia inexistente."
      ],
      "recoverySectionIds": [
        "qe",
        "exemplo-qe"
      ],
      "objectiveIds": [
        "O1"
      ],
      "id": "mp06.q01",
      "topicId": "draft.mp06"
    },
    {
      "prompt": "No modelo de pagamento único de 110, elevar o preço de compra de 100 para 105, mantendo data e pagamento, faz o retorno bruto do período:",
      "options": [
        "Cair, de 10% para aproximadamente 4,7619%.",
        "Subir para 15%.",
        "Ficar necessariamente em 10%.",
        "Virar automaticamente a taxa anual atual do Brasil."
      ],
      "answer": 0,
      "explanation": "O ganho cai de 10 sobre 100 para 5 sobre 105. Trata-se do mesmo período fictício.",
      "optionRationales": [
        "Compara corretamente ganho e base.",
        "Soma valores sem aplicar a relação.",
        "Ignora a mudança do preço pago.",
        "Transpõe período fictício e contexto."
      ],
      "recoverySectionIds": [
        "preco-rendimento"
      ],
      "objectiveIds": [
        "O2"
      ],
      "id": "mp06.q02",
      "topicId": "draft.mp06"
    },
    {
      "prompt": "Qual diferença separa a compromissada de MP-05 do exemplo de QE?",
      "options": [
        "Qualquer compra pelo BCB é QE.",
        "QE significa recolhimento compulsório.",
        "Toda compromissada elimina o título.",
        "A compromissada tem operação inversa combinada; o exemplo de QE trata de programa de compras de ativos."
      ],
      "answer": 3,
      "explanation": "É necessário examinar condições e finalidade, não apenas o verbo comprar.",
      "optionRationales": [
        "Apaga condições e objetivo.",
        "Confunde mecanismos.",
        "Revenda não extingue automaticamente o título.",
        "Reconhece a distinção ensinada."
      ],
      "recoverySectionIds": [
        "comparar"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "mp06.q03",
      "topicId": "draft.mp06"
    },
    {
      "prompt": "A Lei 14.185/2021 autoriza qual relação no recorte estudado?",
      "options": [
        "Qualquer família abrir depósito varejista diretamente no BCB.",
        "Depósitos voluntários de instituições financeiras no BCB, sob condições aplicáveis.",
        "Compulsório obrigatório de todo salário recebido.",
        "Adoção automática do programa britânico de QE."
      ],
      "answer": 1,
      "explanation": "A lei se refere às instituições financeiras e atribui condições ao BCB.",
      "optionRationales": [
        "Amplia o público sem base.",
        "Preserva sujeito e caráter da operação.",
        "Transforma voluntariedade em imposição ao trabalhador.",
        "Mistura países e instrumentos."
      ],
      "recoverySectionIds": [
        "depositos",
        "exemplo-deposito"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp06.q04",
      "topicId": "draft.mp06"
    },
    {
      "prompt": "Um banco escolhe um depósito a prazo remunerado no BCB. Podemos chamá-lo de compulsório só porque os recursos ficam no BCB?",
      "options": [
        "Sim: localização determina obrigatoriedade.",
        "Sim: toda remuneração cria uma imposição.",
        "Não: é preciso distinguir escolha contratual e recolhimento exigido.",
        "Não: compulsórios não envolvem recursos no BCB."
      ],
      "answer": 2,
      "explanation": "Localização dos recursos não substitui a análise da obrigação.",
      "optionRationales": [
        "Confunde local e natureza.",
        "Remuneração não determina compulsoriedade.",
        "Usa o critério correto.",
        "Nega a característica do compulsório."
      ],
      "recoverySectionIds": [
        "depositos",
        "exemplo-classificacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "mp06.q05",
      "topicId": "draft.mp06"
    },
    {
      "prompt": "Uma página britânica descreve QE iniciado em 2009. Qual uso é apropriado?",
      "options": [
        "Ensinar o caso com país/data, sem afirmar que descreve a política brasileira atual.",
        "Tratar toda frase no presente como dado brasileiro de hoje.",
        "Concluir que Brasil e Reino Unido têm a mesma meta e regras.",
        "Ignorar a data porque conceitos e decisões nunca mudam."
      ],
      "answer": 0,
      "explanation": "Contexto histórico e jurisdição precisam permanecer explícitos.",
      "optionRationales": [
        "Delimita corretamente a evidência.",
        "Transpõe tempo e país.",
        "Importa normas estrangeiras.",
        "Elimina controle de atualidade."
      ],
      "recoverySectionIds": [
        "datas",
        "resumo"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "mp06.q06",
      "topicId": "draft.mp06"
    }
  ],
  "recall": [
    "Explique a diferença entre comprar um ativo e acolher um depósito.",
    "Refaça o retorno do pagamento fixo com os dois preços, mantendo o período.",
    "Ao recuperar um erro, marque país/data e a característica que decide a classificação."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "mp06-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "mp06.q01": [
        {
          "missionId": "draft.mp06",
          "sectionId": "qe"
        },
        {
          "missionId": "draft.mp06",
          "sectionId": "exemplo-qe"
        }
      ],
      "mp06.q02": [
        {
          "missionId": "draft.mp06",
          "sectionId": "preco-rendimento"
        }
      ],
      "mp06.q03": [
        {
          "missionId": "draft.mp06",
          "sectionId": "comparar"
        }
      ],
      "mp06.q04": [
        {
          "missionId": "draft.mp06",
          "sectionId": "depositos"
        },
        {
          "missionId": "draft.mp06",
          "sectionId": "exemplo-deposito"
        }
      ],
      "mp06.q05": [
        {
          "missionId": "draft.mp06",
          "sectionId": "depositos"
        },
        {
          "missionId": "draft.mp06",
          "sectionId": "exemplo-classificacao"
        }
      ],
      "mp06.q06": [
        {
          "missionId": "draft.mp06",
          "sectionId": "datas"
        },
        {
          "missionId": "draft.mp06",
          "sectionId": "resumo"
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
      "item": "Item 3, recorte introdutório",
      "status": "histórico; adoção/profundidade pendentes"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Itens 16/17, recorte introdutório",
      "status": "histórico; adoção/profundidade pendentes"
    }
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar o exemplo indicado, explicar o erro e resolver um caso alterado; sem alterar a política de revisão do aplicativo."
  },
  "limits": [
    "QE é apresentado pelo caso britânico; não afirma adoção pelo Brasil nem status atual do programa.",
    "Depósitos voluntários não são classificados como sinônimo de QE ou necessariamente como instrumento não convencional.",
    "Não reproduz regulamentação operacional, taxa ou elegibilidade atual dos depósitos; usa autorização legal delimitada.",
    "Modelo de retorno de um pagamento único, sem cupons/custos/tributos; não anualiza nem recomenda produto.",
    "Rascunho fora do catálogo; não é nova forma independente A/B, aceite de fase ou recomendação financeira."
  ]
};
export const ARITHMETIC = [
  {
    "label": "Título preço 100: ganho",
    "operation": "subtract",
    "values": [
      110,
      100
    ],
    "expected": 10
  },
  {
    "label": "Título preço 100: retorno",
    "operation": "divide",
    "values": [
      10,
      100
    ],
    "expected": 0.1
  },
  {
    "label": "Título preço 105: ganho",
    "operation": "subtract",
    "values": [
      110,
      105
    ],
    "expected": 5
  },
  {
    "label": "Título preço 105: retorno",
    "operation": "divide",
    "values": [
      5,
      105
    ],
    "expected": 0.047619047619047616
  }
];
