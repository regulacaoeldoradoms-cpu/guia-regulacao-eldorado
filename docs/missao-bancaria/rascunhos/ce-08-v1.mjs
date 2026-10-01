// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "bcb.ce.politica",
    "label": "BCB — Política cambial",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/politicacambial",
    "version": "Página pública renderizada em 01/10/2026",
    "locator": "Regimes, flutuação no Brasil e atuação para funcionalidade; efeitos sobre comércio e preços",
    "checkedAt": "2026-10-01"
  }
];

export const CE08_DRAFT = {
  "id": "draft.ce08",
  "topicId": "draft.ce08",
  "editorialKey": "CE-08",
  "candidateBlockId": "banking.capital-exchange",
  "title": "Regimes cambiais: regra, mercado e intervenção",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar a regra de formação da taxa sem classificar um regime apenas por um episódio de estabilidade ou intervenção.",
  "sourceIds": [
    "bcb.ce.politica"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Regime é a regra do jogo",
      "body": "A taxa observada é um número em uma data. O regime cambial é o arranjo que orienta sua formação e a atuação das autoridades. Para classificar, procure a regra assumida, não apenas um gráfico curto. Dois países podem exibir a mesma cotação hoje e adotar regimes diferentes.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "fixo",
      "type": "explanation",
      "heading": "2. Fixo: compromisso com uma referência",
      "body": "No modelo fixo, a autoridade assume compromisso com uma paridade ou referência definida e atua para sustentá-la. Isso não quer dizer que a regra seja imutável por toda a história: a paridade pode ser alterada por decisão institucional. É diferente de um preço que ficou estável por coincidência entre oferta e demanda.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "ex-fixo",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: a regra declarada",
      "body": "O país fictício A anuncia compromisso de manter uma unidade da moeda estrangeira igual a duas unidades da sua moeda e de atuar para preservar essa paridade. O elemento que caracteriza o exemplo fixo é o compromisso assumido. Observar apenas o número 2 em uma tela não seria evidência suficiente.",
      "sourceIds": []
    },
    {
      "id": "flutuante",
      "type": "explanation",
      "heading": "4. Flutuante não significa autoridade ausente",
      "body": "No modelo flutuante, a taxa é formada no mercado. A autoridade pode intervir em determinadas circunstâncias sem que exista compromisso de defender uma paridade específica. Por isso, 'houve intervenção' não basta para concluir que o regime é fixo.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "ex-flutuante",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: intervenção e finalidade",
      "body": "No país B, a taxa é formada no mercado. Em um episódio de disfunção, a autoridade intervém para melhorar o funcionamento das negociações, sem anunciar um preço a defender. O episódio é compatível com flutuação. Seria necessário outro dado para inferir mudança de regime.",
      "sourceIds": []
    },
    {
      "id": "intermediario",
      "type": "explanation",
      "heading": "6. Intermediário: leia o compromisso específico",
      "body": "Arranjos intermediários combinam elementos de flexibilidade e compromisso. Uma banda cambial é um exemplo: a autoridade define limites para a taxa dentro do desenho adotado. Não existe uma única regra para todos os arranjos intermediários. A questão deve informar qual mecanismo considera.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "ex-banda",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: uma banda fictícia",
      "body": "O país C permite que o mercado mova a taxa entre 3,80 e 4,20 unidades domésticas por unidade estrangeira e se compromete a defender os limites. O intervalo diferencia o caso de uma paridade única e de uma flutuação sem faixa prometida. Não se deve confundir a banda anunciada com o intervalo mínimo/máximo observado em uma semana.",
      "sourceIds": []
    },
    {
      "id": "brasil",
      "type": "explanation",
      "heading": "8. Referência brasileira e data",
      "body": "A descrição oficial consultada do BCB informa que o Brasil adota câmbio flutuante; sua atuação busca condições de funcionamento do mercado, sem determinar um nível específico para a taxa. Essa referência é temporal e deve ser reconferida se houver mudança pertinente antes da publicação do conteúdo.",
      "sourceIds": [
        "bcb.ce.politica"
      ]
    },
    {
      "id": "ex-observacao",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: três dias não definem o regime",
      "body": "Em três dias, a taxa de um país permanece em 5. Não há informação sobre compromisso da autoridade. A estabilidade observada pode ocorrer em diferentes arranjos. A resposta correta é que os dados não bastam para classificar, e não que todo preço estável prova regime fixo.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "10. Vocabulário essencial",
      "body": "Paridade: relação de referência assumida no modelo fixo. Flutuação: formação de taxa no mercado. Banda: faixa definida no arranjo e sujeita ao compromisso informado. Intervenção: atuação da autoridade. Faixa observada: extremos de dados passados, que não provam uma banda institucional.",
      "sourceIds": []
    },
    {
      "id": "retomada",
      "type": "summary",
      "heading": "11. Síntese e recuperação",
      "body": "Se classificou pela cotação de um dia, retome inicio e ex-observacao. Se igualou qualquer intervenção a regime fixo, volte a flutuante e ex-flutuante. Se confundiu faixa observada com banda anunciada, leia intermediario e ex-banda. Use brasil apenas para a referência brasileira consultada.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "ce08.q01",
      "prompt": "Qual dado distingue o regime fixo no modelo estudado?",
      "options": [
        "Compromisso da autoridade com uma paridade definida.",
        "Qualquer repetição de preço por dois dias.",
        "Ausência absoluta de decisões da autoridade.",
        "Obrigação de a moeda nunca mudar de valor em toda a história."
      ],
      "answer": 0,
      "explanation": "O elemento central é a regra de compromisso, não um episódio isolado.",
      "optionRationales": [
        "Correta: descreve o arranjo institucional.",
        "Estabilidade temporária não prova a regra.",
        "A autoridade tem papel no compromisso.",
        "A referência pode ser alterada institucionalmente."
      ],
      "objectiveIds": [
        "O1",
        "O4"
      ],
      "recoverySectionIds": [
        "fixo",
        "ex-fixo"
      ]
    },
    {
      "id": "ce08.q02",
      "prompt": "Uma autoridade intervém para melhorar a negociação, sem prometer defender uma cotação. O fato, sozinho:",
      "options": [
        "Prova abandono de toda flutuação.",
        "Prova uma banda com limites conhecidos.",
        "Demonstra que as taxas de mercado deixaram de existir.",
        "É compatível com câmbio flutuante."
      ],
      "answer": 3,
      "explanation": "Intervir e defender uma paridade são situações diferentes.",
      "optionRationales": [
        "A conclusão exige dados adicionais.",
        "Não foram anunciados limites.",
        "A intervenção descrita ocorre no mercado.",
        "Correta: flutuação não exige inação absoluta."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "flutuante",
        "ex-flutuante"
      ]
    },
    {
      "id": "ce08.q03",
      "prompt": "Um arranjo admite oscilação dentro de limites anunciados e assume sua defesa. O exemplo descreve:",
      "options": [
        "Apenas o maior e o menor preço observado na semana.",
        "Obrigatoriamente uma paridade única.",
        "Uma banda cambial, como arranjo intermediário.",
        "Ausência de compromisso institucional."
      ],
      "answer": 2,
      "explanation": "A faixa é uma regra anunciada e defendida, não uma estatística passada.",
      "optionRationales": [
        "O enunciado informa compromisso, não só observação.",
        "Há um intervalo, não uma única paridade.",
        "Correta: reúne flexibilidade dentro da faixa e compromisso com limites.",
        "Há compromisso explícito."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "intermediario",
        "ex-banda"
      ]
    },
    {
      "id": "ce08.q04",
      "prompt": "A taxa ficou exatamente igual durante três dias. Sem outros dados, pode-se:",
      "options": [
        "Afirmar que o regime é fixo.",
        "Reconhecer que falta conhecer a regra institucional.",
        "Afirmar que é flutuação pura.",
        "Afirmar que existe uma banda legal."
      ],
      "answer": 1,
      "explanation": "O comportamento de poucos dias não identifica unicamente o regime.",
      "optionRationales": [
        "A estabilidade é insuficiente.",
        "Correta: é necessário conhecer o arranjo.",
        "O mesmo problema impede essa conclusão.",
        "Nenhuma banda foi informada."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "inicio",
        "ex-observacao"
      ]
    },
    {
      "id": "ce08.q05",
      "prompt": "Na descrição oficial brasileira consultada para esta aula, o regime é:",
      "options": [
        "Fixo em R$ 1 por US$ 1.",
        "Uma banda obrigatória de 3,80 a 4,20.",
        "Flutuante, com possibilidade de atuação do BCB no funcionamento do mercado.",
        "Ausência de qualquer política cambial."
      ],
      "answer": 2,
      "explanation": "A faixa de 3,80 a 4,20 é somente o exemplo do país fictício C.",
      "optionRationales": [
        "Essa paridade não corresponde à fonte.",
        "Confunde exemplo fictício com o Brasil.",
        "Correta: corresponde à referência do BCB consultada.",
        "Há política e atuação mesmo sob flutuação."
      ],
      "objectiveIds": [
        "O5"
      ],
      "recoverySectionIds": [
        "brasil",
        "ex-banda"
      ]
    },
    {
      "id": "ce08.q06",
      "prompt": "Qual afirmativa sobre uma paridade fixa evita uma conclusão excessiva?",
      "options": [
        "Jamais pode haver decisão de alterar a paridade.",
        "Pode haver mudança institucional da referência; 'fixo' não significa eterno.",
        "Qualquer oscilação de ações revoga a paridade.",
        "Fixo significa taxa definida individualmente por cada cliente sem compromisso da autoridade."
      ],
      "answer": 1,
      "explanation": "O regime descreve o compromisso vigente, não uma impossibilidade histórica de mudança.",
      "optionRationales": [
        "É uma afirmação absoluta não sustentada.",
        "Correta: distingue regime vigente de imutabilidade.",
        "Preço de ação não define esse regime.",
        "A descrição elimina o elemento central do modelo fixo."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "fixo"
      ]
    },
    {
      "id": "ce08.q07",
      "prompt": "Um relatório diz 'a taxa oscilou entre 4,70 e 5,10 no mês', sem informar regra da autoridade. Qual leitura é adequada?",
      "options": [
        "É uma faixa observada, que não prova compromisso de banda.",
        "Há necessariamente uma banda oficial de 4,70 a 5,10.",
        "O relatório informa uma paridade fixa.",
        "A autoridade garantiu esses limites para o próximo mês."
      ],
      "answer": 0,
      "explanation": "Valores extremos observados não equivalem a limites institucionais.",
      "optionRationales": [
        "Correta: mantém a distinção.",
        "Não há compromisso informado.",
        "Foram observados vários valores.",
        "Nada garante o próximo período."
      ],
      "objectiveIds": [
        "O3",
        "O4"
      ],
      "recoverySectionIds": [
        "intermediario",
        "ex-banda",
        "ex-observacao"
      ]
    },
    {
      "id": "ce08.q08",
      "prompt": "Para investigar se houve mudança de regime, qual informação é mais pertinente?",
      "options": [
        "A cor do gráfico de câmbio.",
        "Uma única operação de um turista.",
        "A cotação de uma ação sem vínculo com a regra cambial.",
        "Mudança no compromisso anunciado e na regra de formação da taxa."
      ],
      "answer": 3,
      "explanation": "A classificação se apoia no arranjo institucional e em sua execução.",
      "optionRationales": [
        "A representação visual não define a regra.",
        "Um negócio isolado não define o regime.",
        "O dado não identifica o compromisso cambial.",
        "Correta: trata do elemento que define o regime."
      ],
      "objectiveIds": [
        "O1",
        "O2",
        "O3",
        "O4"
      ],
      "recoverySectionIds": [
        "inicio",
        "fixo",
        "flutuante",
        "intermediario"
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
    "editorialPass": "ce08-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ce08.q01": [
        {
          "missionId": "draft.ce08",
          "sectionId": "fixo"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-fixo"
        }
      ],
      "ce08.q02": [
        {
          "missionId": "draft.ce08",
          "sectionId": "flutuante"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-flutuante"
        }
      ],
      "ce08.q03": [
        {
          "missionId": "draft.ce08",
          "sectionId": "intermediario"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-banda"
        }
      ],
      "ce08.q04": [
        {
          "missionId": "draft.ce08",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "ce08.q05": [
        {
          "missionId": "draft.ce08",
          "sectionId": "brasil"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-banda"
        }
      ],
      "ce08.q06": [
        {
          "missionId": "draft.ce08",
          "sectionId": "fixo"
        }
      ],
      "ce08.q07": [
        {
          "missionId": "draft.ce08",
          "sectionId": "intermediario"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-banda"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "ex-observacao"
        }
      ],
      "ce08.q08": [
        {
          "missionId": "draft.ce08",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "fixo"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "flutuante"
        },
        {
          "missionId": "draft.ce08",
          "sectionId": "intermediario"
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
      "item": "Item 8 — regimes de taxas de câmbio fixas, flutuantes e intermediários",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Item 22 — regimes de taxas de câmbio fixas, flutuantes e intermediários",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Reconhecer a ideia de compromisso com uma paridade no regime fixo.",
    "O2": "Distinguir formação de mercado e ausência de intervenção.",
    "O3": "Identificar um arranjo intermediário descrito por banda.",
    "O4": "Separar regra institucional de comportamento observado em poucos dias.",
    "O5": "Situar a descrição oficial do regime brasileiro na data consultada.",
    "O6": "Recuperar a confusão conceitual pela seção de origem e reconstruir o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar as seções por questão, explicar o erro e refazer o raciocínio; sem indicador novo de domínio."
  },
  "limits": [
    "Comparação conceitual; bandas e paridades são exemplos fictícios. Não ensina instrumentos de intervenção, história detalhada, reservas necessárias ou estratégia de previsão.",
    "Casos e valores fictícios; educação geral, sem recomendação de investimento ou procedimento para caso real. Não representa cobertura integral dos itens históricos.",
    "Prática exposta, não avaliação independente. IDs editoriais, sem XP/ordem/desbloqueio; publicação.status draft e nenhuma importação no runtime.",
    "Fontes novas consultadas em 01/10/2026; consultas reaproveitadas preservam a data original. Confirmar mudanças normativas pertinentes antes de publicação."
  ]
};

export const ARITHMETIC = [];
