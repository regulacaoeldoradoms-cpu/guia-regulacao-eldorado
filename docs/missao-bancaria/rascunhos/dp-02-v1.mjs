// Rascunho local isolado; não importar no runtime. Sincronizado com dp-02-v1.md.
export const SOURCES = [
  {
    "id": "bcb.dp.fintechs",
    "label": "BCB — Fintechs",
    "url": "https://www.bcb.gov.br/estabilidadefinanceira/fintechs",
    "version": "Página institucional; consulta em 01/10/2026, 01:43 UTC",
    "locator": "Definição introdutória e benefícios possíveis; não reutilizar limites ou referências normativas de outras seções",
    "checkedAt": "2026-10-01"
  }
];

export const DP02_DRAFT = {
  "id": "draft.dp02",
  "topicId": "draft.dp02",
  "editorialKey": "DP-02",
  "candidateBlockId": "banking.digital-payments",
  "title": "Transformação digital: canal, processo e modelo de negócio",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir mudanças de canal, processo e modelo, identificando efeitos e limites pelos dados do caso.",
  "sourceIds": [
    "bcb.dp.fintechs"
  ],
  "sections": [
    {
      "id": "camadas",
      "heading": "1. O que mudou de fato?",
      "body": "“Digital” pode descrever mudanças diferentes. Nesta aula usaremos três perguntas didáticas. **Canal:** mudou a forma de interação? **Processo:** mudou o caminho que transforma uma solicitação em resultado? **Modelo de negócio:** mudou a maneira de organizar e oferecer valor ao público, incluindo participantes e formas de remuneração?\n\nAs três dimensões podem coexistir. Elas não são classes jurídicas nem rótulos mutuamente exclusivos. A questão deve informar o que mudou; instalar um aplicativo, por si só, não demonstra que toda a organização foi transformada.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-canal",
      "heading": "2. Exemplo resolvido: a porta de entrada",
      "body": "Um banco passa a receber pelo aplicativo a mesma solicitação antes entregue em papel. O caso informa que análise, etapas internas e serviço final continuam iguais. A mudança comprovada é no canal de entrada. Não há dados para afirmar que o processo inteiro foi automatizado ou que surgiu outro modelo de negócio.\n\nIsso não torna a mudança irrelevante: ela pode facilitar o acesso. Apenas separa o que foi descrito do que ainda teria de ser demonstrado.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "processo",
      "heading": "3. Processo: acompanhe o caminho",
      "body": "Um processo reúne etapas, informações, responsabilidades e decisões. Para compará-lo antes e depois, observe o que foi retirado, acrescentado ou integrado. A presença de uma tela nova não esclarece sozinha o trabalho que ocorre depois do envio.\n\nAutomatizar uma etapa também não significa que todas as decisões se tornaram automáticas. Se o caso mantém uma análise humana, ela continua fazendo parte do processo. Não se deve inventar sua eliminação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-processo",
      "heading": "4. Exemplo resolvido: menos redigitação",
      "body": "No processo fictício anterior, o cliente preenche um formulário e um atendente digita novamente os mesmos dados. Na nova versão, os campos são transmitidos ao sistema e conferidos; um analista continua avaliando a solicitação. Há mudança no processo, com retirada da redigitação. O caso não permite afirmar aprovação automática, ausência de erros ou eliminação de todos os profissionais.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "modelo",
      "heading": "5. Modelo: participantes, necessidade e remuneração",
      "body": "Para interpretar um modelo de negócio, identifique o público atendido, o serviço entregue, os participantes e a forma de remuneração informada. Uma cobrança por assinatura e uma remuneração por serviço realizado são arranjos distintos nos casos didáticos. Nenhum deles é necessariamente melhor: faltam custos, riscos e preferências para esse julgamento.\n\nMudar a forma de remuneração não altera automaticamente a natureza jurídica do prestador nem elimina regras aplicáveis. A descrição econômica não substitui a identificação da atividade e de quem responde por ela.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-modelo",
      "heading": "6. Exemplo resolvido: mesma tela, outra organização",
      "body": "Duas plataformas fictícias têm aparência semelhante e ajudam a organizar despesas. A primeira cobra assinatura do próprio usuário. Na segunda, o caso informa que o acesso do usuário não é cobrado e que empresas pagam pela divulgação identificada de suas ofertas. A diferença relevante descrita está na remuneração e nos participantes do modelo, não no tamanho dos botões.\n\n“Sem cobrança do usuário neste caso” não significa ausência de custos, de interesses comerciais ou de condições de uso. Não se pode concluir, apenas com esses dados, qual plataforma é mais vantajosa.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "inovacao",
      "heading": "7. Inovação financeira e efeitos possíveis",
      "body": "O BCB apresenta fintechs como empresas que empregam tecnologia intensamente para inovar nos serviços financeiros, com possibilidade de novos modelos de negócio. O termo ajuda a reconhecer um fenômeno econômico; não comprova, sozinho, autorização para qualquer atividade ou garantia de resultado.\n\nBenefícios esperados de uma mudança, como maior eficiência e melhor acesso, precisam ser confrontados com o caso. Um serviço pode reduzir uma etapa e ainda impor dificuldades a parte do público. Usaremos como critério a necessidade atendida e o funcionamento descrito, sem prometer que tecnologia sempre reduz preço ou risco.",
      "type": "explanation",
      "sourceIds": [
        "bcb.dp.fintechs"
      ]
    },
    {
      "id": "ex-acesso",
      "heading": "8. Exemplo resolvido: melhoria com limite",
      "body": "Uma cooperativa fictícia cria consulta digital de informações. O caso informa que pessoas com conexão conseguem consultar sem deslocamento, mas parte do público não tem acesso estável à internet. A melhoria descrita beneficia o primeiro grupo; não demonstra que todas as barreiras de atendimento desapareceram. Avaliar a mudança exige considerar também as necessidades do segundo grupo, sem presumir uma solução específica não informada.",
      "type": "worked-example",
      "sourceIds": [
        "bcb.dp.fintechs"
      ]
    },
    {
      "id": "evidencia",
      "heading": "9. Promessa, dado e conclusão",
      "body": "“O serviço foi redesenhado para agilizar” expressa uma intenção. “O caso mediu redução no tempo de uma etapa” apresenta um resultado limitado àquela medição. “Todas as operações serão instantâneas e sem erro” é uma conclusão muito mais ampla, que não decorre das duas primeiras frases.\n\nPergunte sempre: qual etapa, qual público e qual efeito foram efetivamente descritos? Essa leitura também evita concluir que toda empresa tecnológica é um banco ou que toda instituição que lança um aplicativo mudou de natureza.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Canal: forma de interação. Processo: conjunto de etapas e decisões. Modelo de negócio: organização de participantes, valor oferecido e remuneração. Evidência: informação efetivamente apresentada. Benefício possível: resultado esperado que ainda exige confirmação.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "heading": "10. Recuperação",
      "body": "Monte três linhas: canal, processo e modelo. Preencha cada uma com uma evidência do enunciado ou escreva “não informado”. Depois separe benefício esperado de resultado observado. Se errou, nomeie o salto: “deduzi automação pela tela”, “confundi remuneração com aparência” ou “transformei benefício possível em garantia”. Refaça o exemplo correspondente. A prática exposta não mede retenção independente.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "id": "dp02.q01",
      "prompt": "Uma solicitação antes entregue em papel passa a entrar pelo aplicativo; o caso informa que as etapas internas e o serviço final permanecem iguais. Qual mudança está comprovada?",
      "options": [
        "Toda decisão passou a ser automática.",
        "O banco perdeu sua natureza jurídica.",
        "O canal de entrada mudou.",
        "Todos os custos deixaram de existir."
      ],
      "answer": 2,
      "explanation": "é exatamente a alteração descrita.",
      "optionRationales": [
        "o caso preserva as etapas, sem informar automação integral.",
        "o canal não determina essa mudança jurídica.",
        "é exatamente a alteração descrita.",
        "não há informação sobre eliminação de custos."
      ],
      "objectiveIds": [
        "O1"
      ],
      "recoverySectionIds": [
        "camadas",
        "ex-canal"
      ]
    },
    {
      "id": "dp02.q02",
      "prompt": "Na nova versão, os dados do formulário chegam diretamente ao sistema, mas um analista continua avaliando a solicitação. O que a descrição permite concluir?",
      "options": [
        "Nenhum processo mudou.",
        "Não há mais participação humana.",
        "Todas as solicitações são aprovadas.",
        "A redigitação foi retirada, mantendo-se a análise humana informada."
      ],
      "answer": 3,
      "explanation": "reconhece o efeito específico sem generalizar.",
      "optionRationales": [
        "a retirada da redigitação é mudança de etapa.",
        "contradiz a presença do analista.",
        "avaliação não é garantia de aprovação.",
        "reconhece o efeito específico sem generalizar."
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "recoverySectionIds": [
        "processo",
        "ex-processo"
      ]
    },
    {
      "id": "dp02.q03",
      "prompt": "Duas plataformas do caso têm telas semelhantes. Uma recebe assinatura do usuário; a outra é remunerada por empresas que divulgam ofertas identificadas. Qual aspecto merece comparação?",
      "options": [
        "A forma de remuneração e os participantes do modelo.",
        "Apenas a cor das telas.",
        "A certeza de que ambas não têm custos.",
        "A certeza de que ambas são bancos."
      ],
      "answer": 0,
      "explanation": "corresponde à diferença explicitada.",
      "optionRationales": [
        "corresponde à diferença explicitada.",
        "não explica a remuneração descrita.",
        "remuneração de outra origem não elimina custos.",
        "o caso não atribui essa natureza às plataformas."
      ],
      "objectiveIds": [
        "O2"
      ],
      "recoverySectionIds": [
        "modelo",
        "ex-modelo"
      ]
    },
    {
      "id": "dp02.q04",
      "prompt": "Uma empresa é apresentada como fintech. Qual conclusão pode ser sustentada apenas por essa caracterização geral?",
      "options": [
        "Ela pode exercer qualquer atividade financeira sem requisitos próprios.",
        "O termo se relaciona a inovação financeira com tecnologia; a atividade concreta ainda precisa ser identificada.",
        "Todo produto que oferece tem retorno garantido.",
        "Todo serviço oferecido é gratuito."
      ],
      "answer": 1,
      "explanation": "preserva o sentido geral e seus limites.",
      "optionRationales": [
        "o rótulo não substitui requisitos da atividade.",
        "preserva o sentido geral e seus limites.",
        "não há garantia de retorno decorrente do termo.",
        "a caracterização não define preço."
      ],
      "objectiveIds": [
        "O3"
      ],
      "recoverySectionIds": [
        "inovacao",
        "evidencia"
      ]
    },
    {
      "id": "dp02.q05",
      "prompt": "No exemplo da cooperativa, pessoas com internet estável consultam sem deslocamento, mas outra parte do público não tem essa conexão. Qual avaliação respeita os dados?",
      "options": [
        "Toda barreira de atendimento desapareceu.",
        "Nenhuma pessoa obteve benefício.",
        "Houve benefício para o grupo descrito, sem demonstrar solução para todas as necessidades.",
        "O caso comprova ausência total de custos operacionais."
      ],
      "answer": 2,
      "explanation": "reconhece benefício e limite simultaneamente.",
      "optionRationales": [
        "ignora o grupo sem acesso estável.",
        "contradiz a consulta sem deslocamento do primeiro grupo.",
        "reconhece benefício e limite simultaneamente.",
        "o caso não mede custos operacionais."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "inovacao",
        "ex-acesso"
      ]
    },
    {
      "id": "dp02.q06",
      "prompt": "O anúncio informa apenas que um sistema foi criado “para agilizar o atendimento”, sem apresentar medição. O que está informado?",
      "options": [
        "Uma redução de tempo comprovada em todas as operações.",
        "A ausência definitiva de erros.",
        "A substituição de todas as decisões por automação.",
        "Um objetivo declarado, sem comprovação do resultado no enunciado."
      ],
      "answer": 3,
      "explanation": "distingue objetivo de resultado observado.",
      "optionRationales": [
        "inventa medição e abrangência.",
        "acrescenta garantia ausente.",
        "intenção de agilizar não descreve essa transformação.",
        "distingue objetivo de resultado observado."
      ],
      "objectiveIds": [
        "O4"
      ],
      "recoverySectionIds": [
        "evidencia",
        "resumo"
      ]
    },
    {
      "id": "dp02.q07",
      "prompt": "Uma plataforma recebe por assinatura e outra por divulgação de ofertas. O enunciado não informa preços, condições ou preferências do usuário. Qual conclusão é adequada?",
      "options": [
        "Os modelos de remuneração diferem; não há dados suficientes para dizer qual é mais vantajoso.",
        "A assinatura é sempre a pior opção.",
        "A divulgação é sempre a melhor opção.",
        "Aparência semelhante torna os modelos idênticos."
      ],
      "answer": 0,
      "explanation": "reconhece a diferença e evita julgamento sem os dados necessários.",
      "optionRationales": [
        "reconhece a diferença e evita julgamento sem os dados necessários.",
        "generaliza sem comparar condições.",
        "comete a mesma generalização.",
        "confunde interface com organização econômica."
      ],
      "objectiveIds": [
        "O2",
        "O4"
      ],
      "recoverySectionIds": [
        "modelo",
        "ex-modelo"
      ]
    },
    {
      "id": "dp02.q08",
      "prompt": "Um aluno concluiu que o lançamento de um aplicativo automatizou todas as etapas internas, embora o caso não as descreva. Qual recuperação enfrenta o erro?",
      "options": [
        "Memorizar que todo aplicativo elimina o trabalho humano.",
        "Separar canal de processo e identificar quais etapas foram efetivamente informadas.",
        "Escolher a alternativa que promete o maior ganho.",
        "Trocar o nome do aplicativo sem rever a justificativa."
      ],
      "answer": 1,
      "explanation": "retorna à distinção ausente no raciocínio.",
      "optionRationales": [
        "repete o salto lógico.",
        "retorna à distinção ausente no raciocínio.",
        "benefício prometido não é evidência.",
        "muda o nome, mantendo a inferência indevida."
      ],
      "objectiveIds": [
        "O1",
        "O5"
      ],
      "recoverySectionIds": [
        "camadas",
        "processo",
        "resumo"
      ]
    }
  ],
  "recall": [
    "Separe canal, processo e modelo com uma evidência por dimensão.",
    "Diferencie benefício esperado de resultado observado.",
    "Nomeie a inferência indevida e reconstrua o caso pela seção indicada."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp02.q01": [
        {
          "missionId": "draft.dp02",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-canal"
        }
      ],
      "dp02.q02": [
        {
          "missionId": "draft.dp02",
          "sectionId": "processo"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-processo"
        }
      ],
      "dp02.q03": [
        {
          "missionId": "draft.dp02",
          "sectionId": "modelo"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-modelo"
        }
      ],
      "dp02.q04": [
        {
          "missionId": "draft.dp02",
          "sectionId": "inovacao"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "evidencia"
        }
      ],
      "dp02.q05": [
        {
          "missionId": "draft.dp02",
          "sectionId": "inovacao"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-acesso"
        }
      ],
      "dp02.q06": [
        {
          "missionId": "draft.dp02",
          "sectionId": "evidencia"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "resumo"
        }
      ],
      "dp02.q07": [
        {
          "missionId": "draft.dp02",
          "sectionId": "modelo"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "ex-modelo"
        }
      ],
      "dp02.q08": [
        {
          "missionId": "draft.dp02",
          "sectionId": "camadas"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "processo"
        },
        {
          "missionId": "draft.dp02",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão pedagógica independente pendente",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades do Mercado Financeiro 1/5/15; p.33",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Conhecimentos Bancários 4/7/15; Anexo IV pp.33–34",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Separar mudança de canal, processo e modelo de negócio.",
    "O2": "Identificar participantes, necessidade, etapas e remuneração explicitados.",
    "O3": "Reconhecer inovação tecnológica financeira sem inferir autorização ou natureza jurídica.",
    "O4": "Separar intenção, benefício possível e resultado observado.",
    "O5": "Recuperar a confusão pelo trecho de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O5",
    "instruction": "Nomear a confusão, reler o trecho de origem e reconstruir o exemplo."
  },
  "limits": [
    "Canal/processo/modelo é ferramenta didática, não classificação jurídica.",
    "BCB consultado apenas na definição de fintechs e efeitos possíveis; nenhum limite ou norma antiga foi incorporado.",
    "Casos autorais fictícios, sem cálculos, tarifas, operação real ou dados pessoais.",
    "Sem XP/ordem/desbloqueio, importação no runtime ou avaliação independente. Aceite humano da Fase 2 não observado."
  ]
};

export const ARITHMETIC = [];
