// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "lei.seguros.15040",
    "label": "Lei 15.040/2024 — contrato de seguro",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm",
    "locator": "Arts. 1º–2º, 4º, 9º e 133–134; marco legal vigente no momento da consulta, após vacância de um ano da publicação",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC11D_DRAFT = {
  "id": "draft.pc11d",
  "topicId": "draft.pc11d",
  "editorialKey": "PC-11D",
  "candidateBlockId": "banking.products-credit",
  "title": "Seguros: risco coberto, prêmio e prestação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar a função do seguro e suas partes, distinguir prêmio de pagamento da seguradora e ler riscos e limites sem supor cobertura universal.",
  "sourceIds": [
    "lei.seguros.15040"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Proteger um interesse contra riscos definidos",
      "body": "Seguro organiza proteção de interesse legítimo do segurado ou beneficiário contra riscos predeterminados, mediante pagamento do prêmio e conforme o contrato e a lei. Interesse é a relação legítima com o que se quer proteger; risco é o evento incerto contemplado na cobertura. Contratar seguro não impede fisicamente que o evento ocorra: estabelece proteção nos termos pactuados. A referência normativa desta aula é a Lei 15.040/2024, já vigente na data da consulta. Não usar como atuais, sem conferir, dispositivos do Código Civil revogados por esse marco.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "partes",
      "type": "explanation",
      "heading": "2. Seguradora, segurado e beneficiário",
      "body": "Seguradora é a entidade autorizada a assumir riscos em contrato de seguro. Segurado é a pessoa cujo interesse está protegido na relação; beneficiário é quem tem direito à prestação nas condições estabelecidas. Os papéis podem coincidir ou ser distintos. Corretor ou canal de venda não vira seguradora apenas por intermediar. Para entender o caso, localize quem assume a cobertura, qual interesse é protegido e a quem se destina a prestação, sem presumir que a agência que vendeu é responsável como seguradora.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "exemplo-partes",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: separar canal e responsável",
      "body": "Caso didático: uma seguradora autorizada emite contrato distribuído por uma agência; o interesse de Ana é protegido e o instrumento identifica o beneficiário aplicável. Passo 1: a seguradora assume a cobertura contratual. Passo 2: a agência é o canal informado, não automaticamente a seguradora. Passo 3: o destinatário do pagamento depende da posição prevista no contrato e do evento, não da pessoa que preencheu um formulário.",
      "sourceIds": []
    },
    {
      "id": "premio",
      "type": "explanation",
      "heading": "4. Prêmio é o preço da proteção, não o dinheiro de um sorteio",
      "body": "No seguro, prêmio é o valor devido pela cobertura contratada. A prestação da seguradora é o cumprimento da obrigação quando cabível, podendo assumir a forma prevista no seguro. Em seguros de danos, fala-se com frequência em indenização; no seguro de pessoas, não se deve reduzir toda prestação a ressarcimento de uma nota de conserto. O mesmo termo “prêmio” tem outro uso em [capitalização](pc-11b-v1.md#sorteio), onde se refere ao resultado de sorteio. Contexto muda o significado.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "exemplo-premio",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: fluxo de pagamento",
      "body": "Hipótese: prêmio total de R$600 por uma cobertura, pago em doze parcelas de R$50. A soma é 12 × 50 = R$600. Isso é o preço informado da proteção, não o valor que a seguradora prometeu pagar em todo evento. Também não é uma conta de poupança do segurado. O exemplo não estabelece que toda modalidade de seguro tenha esse parcelamento ou custo.",
      "sourceIds": []
    },
    {
      "id": "cobertura",
      "type": "explanation",
      "heading": "6. O risco precisa estar dentro da cobertura",
      "body": "A lei trata de riscos predeterminados: é preciso identificar quais eventos pertencem à cobertura. Exclusões devem ser descritas de modo claro e inequívoco, segundo o art. 9º. Saber que alguém tem “um seguro” não demonstra proteção contra toda causa de dano ou qualquer despesa. É preciso ler objeto, risco, período e condições. A apólice é o documento que formaliza informações do seguro; um slogan publicitário isolado não descreve necessariamente todas essas condições. O exemplo seguinte dá o enquadramento apenas para exercício conceitual.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "exemplo-cobertura",
      "type": "worked-example",
      "heading": "7. Exemplo resolvido: dois eventos, cobertura declarada",
      "body": "Contrato fictício válido cobre dano por incêndio e exclui, de forma clara e juridicamente aplicável no caso, dano exclusivamente por inundação. Cenário A é dano causado por incêndio durante a cobertura; cenário B é dano exclusivamente por inundação. O primeiro corresponde ao risco coberto descrito; o segundo, à exclusão dada. Ainda não calculamos pagamento: limites e demais condições também precisam ser conhecidos. Não concluímos que todo seguro residencial tenha essas coberturas ou exclusões.",
      "sourceIds": []
    },
    {
      "id": "limites",
      "type": "explanation",
      "heading": "8. Limite informado não é pagamento automático",
      "body": "Limite da cobertura é um teto ou parâmetro contratual aplicável, não uma promessa de pagar esse valor em qualquer evento. A prestação depende do seguro, do evento e das demais condições válidas. Não confunda custo do prêmio com extensão da cobertura: pagar prêmio maior não prova, por si, cobertura de qualquer risco. Franquias, carências e procedimentos de apuração têm regras próprias; esta aula não fornece fórmula universal nem prazo de regulação de sinistro.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "exemplo-limite",
      "type": "worked-example",
      "heading": "9. Exemplo resolvido: insuficiência de dados",
      "body": "Um resumo informa limite de R$10.000, mas não descreve evento, cobertura acionada ou demais condições. A pergunta é se a seguradora necessariamente deve pagar R$10.000 agora. Não: há apenas um limite informado, sem demonstração do fato que daria origem à prestação ou de seu valor. A conclusão correta é identificar os dados ausentes. Um limite não é saldo resgatável de uma aplicação.",
      "sourceIds": []
    },
    {
      "id": "comparar",
      "type": "explanation",
      "heading": "10. Comparar proteção exige o mesmo recorte",
      "body": "Para comparar dois seguros, confira riscos cobertos, exclusões, interesse protegido, limite e período, além do prêmio e outras condições. Dois preços diferentes podem corresponder a proteções diferentes. Ausência de evento coberto não significa, por si só, que o prêmio pago em seguro de risco deva ser devolvido: ele remunerou a proteção contratada, segundo o regime aplicável. Existem produtos de pessoas com componentes e regras próprias, como o [VGBL](pc-11c-v1.md#natureza); não universalize o caso de um seguro de risco para todo produto chamado seguro.",
      "sourceIds": [
        "lei.seguros.15040"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "11. Vocabulário de recuperação",
      "body": "Risco: evento incerto abrangido ou excluído nos termos aplicáveis. Cobertura: proteção contratada. Prêmio: preço do seguro. Prestação: cumprimento devido pela seguradora quando cabível. Sinistro: ocorrência do evento relacionado ao risco descrito, cuja cobertura e efeitos precisam ser apurados. Exclusão: hipótese fora da cobertura, sujeita a requisitos legais. Limite: parâmetro/teto aplicável, não pagamento automático.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "12. Leia a proteção antes do preço",
      "body": "Identifique a seguradora e as demais partes. Separe prêmio e prestação. Leia interesse, riscos, exclusões e período. Reconheça o limite sem inventar pagamento. A proteção decorre da combinação de contrato e lei, não do nome genérico ou de uma promessa de que nada poderá acontecer.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Diga quem paga o prêmio e em que sentido ele difere da prestação da seguradora.",
    "Volte ao exemplo de incêndio/inundação se confundiu risco, exclusão e limite.",
    "Explique quais dados faltam para transformar um limite informado em um pagamento efetivamente devido."
  ],
  "questions": [
    {
      "id": "pc11d.q01",
      "topicId": "draft.pc11d",
      "prompt": "Qual é o papel do prêmio em um seguro de risco?",
      "options": [
        "É o prêmio de sorteio ganho pelo segurado.",
        "É o valor devido pela cobertura contratada.",
        "É necessariamente o teto da indenização.",
        "É sempre saldo integralmente resgatável em qualquer momento."
      ],
      "answer": 1,
      "explanation": "No seguro, o termo identifica o preço da cobertura.",
      "optionRationales": [
        "Confunde com o uso do termo em capitalização.",
        "Distingue o pagamento pela proteção.",
        "Teto e preço são informações distintas.",
        "Seguro de risco não é conta de poupança."
      ],
      "recoverySectionIds": [
        "premio",
        "exemplo-premio"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11d.q02",
      "topicId": "draft.pc11d",
      "prompt": "A agência distribui contrato emitido por seguradora autorizada. Só esse fato permite dizer que:",
      "options": [
        "a agência sempre substituiu a seguradora.",
        "qualquer funcionário é o beneficiário.",
        "não há responsável contratual.",
        "o canal de venda não se confunde automaticamente com a seguradora que assume a cobertura."
      ],
      "answer": 3,
      "explanation": "É preciso identificar os papéis dados pelo instrumento.",
      "optionRationales": [
        "Inventa mudança de parte.",
        "A função profissional não define beneficiário.",
        "A seguradora foi identificada.",
        "Mantém a distinção necessária."
      ],
      "recoverySectionIds": [
        "partes",
        "exemplo-partes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc11d.q03",
      "topicId": "draft.pc11d",
      "prompt": "Prêmio total dado: doze parcelas de R$50. Qual leitura é correta?",
      "options": [
        "R$600 de prêmio, sem provar o valor de uma futura prestação da seguradora.",
        "R$50 de prêmio total e indenização obrigatória de R$600.",
        "R$600 são necessariamente saldo de poupança.",
        "R$600 garantem cobertura de qualquer risco."
      ],
      "answer": 0,
      "explanation": "A soma é preço; extensão e prestação da proteção exigem outras informações.",
      "optionRationales": [
        "Calcula e mantém o limite da conclusão.",
        "Troca parcela por total e inventa pagamento.",
        "Muda a natureza do produto.",
        "Preço não define cobertura universal."
      ],
      "recoverySectionIds": [
        "exemplo-premio",
        "limites"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc11d.q04",
      "topicId": "draft.pc11d",
      "prompt": "Caso válido declara cobertura de incêndio e exclusão clara/aplicável de inundação. Dano exclusivamente por inundação corresponde a:",
      "options": [
        "cobertura universal implícita.",
        "indenização automática no teto.",
        "hipótese excluída no caso, sem generalizar a outros seguros.",
        "prova de que todos os seguros são idênticos."
      ],
      "answer": 2,
      "explanation": "A resposta usa o enquadramento expressamente dado.",
      "optionRationales": [
        "Apaga a exclusão.",
        "Não há essa obrigação automática.",
        "Respeita o caso e o âmbito.",
        "Coberturas e condições podem diferir."
      ],
      "recoverySectionIds": [
        "cobertura",
        "exemplo-cobertura"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc11d.q05",
      "topicId": "draft.pc11d",
      "prompt": "Resumo de seguro informa apenas limite de R$10.000. O que falta para concluir pagamento devido agora?",
      "options": [
        "Evento, cobertura acionada e condições aplicáveis; o limite sozinho não basta.",
        "Nada, basta o teto existir.",
        "Só saber a cor do documento.",
        "A vontade de tratar limite como saldo de conta."
      ],
      "answer": 0,
      "explanation": "Teto e ocorrência da obrigação de prestar são diferentes.",
      "optionRationales": [
        "Identifica os dados relevantes ausentes.",
        "Transforma limite em dívida automática.",
        "Informação irrelevante ao enquadramento.",
        "Não altera o contrato ou a lei."
      ],
      "recoverySectionIds": [
        "limites",
        "exemplo-limite"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc11d.q06",
      "topicId": "draft.pc11d",
      "prompt": "Dois seguros têm prêmios diferentes. Qual comparação é adequada?",
      "options": [
        "Escolher sempre o mais caro como universalmente completo.",
        "Conferir riscos, exclusões, limites e período, além do preço.",
        "Supor coberturas iguais sem ler.",
        "Ignorar exclusões porque nunca têm relevância jurídica."
      ],
      "answer": 1,
      "explanation": "Proteções diferentes não são comparáveis apenas pelo preço.",
      "optionRationales": [
        "Preço não demonstra cobertura universal.",
        "Compara a proteção concreta.",
        "Presume o que precisa verificar.",
        "A lei disciplina exclusões, não as torna inexistentes."
      ],
      "recoverySectionIds": [
        "comparar",
        "cobertura"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11d.q07",
      "topicId": "draft.pc11d",
      "prompt": "Seguro de risco permaneceu vigente sem ocorrência de evento coberto. Qual afirmação indevida deve ser evitada?",
      "options": [
        "A proteção existiu nos termos contratados.",
        "Prêmio e indenização são distintos.",
        "É preciso observar o regime do produto.",
        "Todo prêmio deve ser devolvido automaticamente só porque não houve sinistro."
      ],
      "answer": 3,
      "explanation": "Ausência de sinistro não transforma por si só prêmio em depósito resgatável.",
      "optionRationales": [
        "É compatível com a finalidade.",
        "É a distinção central.",
        "Evita generalizar entre produtos.",
        "Cria devolução universal não ensinada."
      ],
      "recoverySectionIds": [
        "comparar"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc11d.q08",
      "topicId": "draft.pc11d",
      "prompt": "Sobre a referência normativa desta aula em 30/09/2026, qual atitude é correta?",
      "options": [
        "Tratar todo artigo antigo do Código Civil sobre seguro como vigente sem conferir revogação.",
        "Ignorar a lei porque existe contrato.",
        "Usar o marco vigente indicado e conferir âmbito, contrato e lei ao analisar uma regra.",
        "Presumir que uma regra de seguro vale para qualquer produto bancário."
      ],
      "answer": 2,
      "explanation": "A versão normativa e o âmbito fazem parte da leitura responsável.",
      "optionRationales": [
        "Pode usar norma revogada.",
        "Contrato não elimina a disciplina legal.",
        "Conserva versão e enquadramento.",
        "Mistura categorias jurídicas distintas."
      ],
      "recoverySectionIds": [
        "inicio",
        "resumo"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc11d-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc11d.q01": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "premio"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "exemplo-premio"
        }
      ],
      "pc11d.q02": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "partes"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "exemplo-partes"
        }
      ],
      "pc11d.q03": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "exemplo-premio"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "limites"
        }
      ],
      "pc11d.q04": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "cobertura"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "exemplo-cobertura"
        }
      ],
      "pc11d.q05": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "limites"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "exemplo-limite"
        }
      ],
      "pc11d.q06": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "comparar"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "cobertura"
        }
      ],
      "pc11d.q07": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "comparar"
        }
      ],
      "pc11d.q08": [
        {
          "missionId": "draft.pc11d",
          "sectionId": "inicio"
        },
        {
          "missionId": "draft.pc11d",
          "sectionId": "resumo"
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
    "O1: distinguir partes e interesse",
    "O2: separar prêmio e prestação",
    "O3: interpretar cobertura/exclusão declaradas",
    "O4: reconhecer limites da informação",
    "O5: comparar proteção e respeitar âmbito normativo",
    "O6: recuperar o termo no trecho de origem"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Recorte conceitual com Lei 15.040/2024; não ensina procedimentos de sinistro, prazos, franquias, carências, seguros obrigatórios ou todos os ramos.",
    "Casos declaram a validade/enquadramento apenas para exercício; não validam cláusulas reais nem recomendam contratação.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Prêmio total fictício",
    "operation": "multiply",
    "values": [
      12,
      50
    ],
    "expected": 600
  }
];
