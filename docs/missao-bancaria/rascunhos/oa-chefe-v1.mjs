// Ensino e exercícios autorais; rascunho com fonte normativa primária.
export const SOURCES = [
  {
    "id": "acordo.oa.acentuacao",
    "label": "Acordo Ortográfico — acentuação gráfica",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/decreto/d6583.htm",
    "checkedAt": "2026-10-04",
    "version": "Decreto nº 6.583/2008, Anexo I — texto oficial consultado",
    "locator": "Anexo I, Bases VIII, IX, X e XI; somente os recortes ensinados em OA-01–04"
  }
];

export const OACHEFE_DRAFT = {
  "id": "draft.oachefe",
  "topicId": "draft.oachefe",
  "editorialKey": "OA-CHEFE",
  "candidateBlockId": "portuguese.spelling",
  "title": "Chefe de acentuação: classe, regra e restrição",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar tonicidade, terminação e restrições dos quatro recortes em doze itens próprios, explicando o motivo da grafia e o erro do distrator.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Preparar a decisão",
      "body": "Cada item informa um caso próprio. Use pronúncia/divisão quando fornecidas; identifique a regra antes de confirmar a grafia. O Chefe tem seis grupos e recuperações nas aulas de origem. Itens próprios não constituem avaliação independente ou comprovação de retenção.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "base",
      "heading": "2. Tonicidade e sinal",
      "body": "Distinguir o destaque da pronúncia e o sinal escrito evita classificar pelo acento ou pelo número de letras. Última, penúltima e antepenúltima se contam na palavra, não na frase. Palavra sem sinal também pode ser tônica.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "oxitonas",
      "heading": "3. Oxítonas do recorte",
      "body": "Verifique a tônica final e a terminação a/e/o, com ou sem s. O caso em/ens exige mais de uma sílaba e tem formas especiais fora desta cobrança. Não aplicar qualquer decisão a toda oxítona ou a todo final em m.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "monossilabos",
      "heading": "4. Uma sílaba e a regra pertinente",
      "body": "Monossílabos tônicos a/e/o, com ou sem s, do recorte recebem sinal; sol e bem não recebem por esse caso. Conte sílabas de pronúncia, não letras. Não invente penúltima ou antepenúltima em uma palavra de uma sílaba.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "parox-proparox",
      "heading": "5. Paroxítonas e proparoxítonas",
      "body": "Paroxítonas l/r/i/is são os casos ensinados; não é a lista integral. Proparoxítonas recebem acento com agudo ou circunflexo conforme a forma. A presença de três sílabas não determina sozinha a classe.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "hiatos",
      "heading": "6. O limite faz parte da regra",
      "body": "No caso de i/u em hiato, examine tonicidade e composição da sílaba: sozinho ou com s, observadas as restrições. Juiz/raiz, rainha e baiuca mostram por que “todo hiato recebe acento” é falso. Não transfira a grafia sem conservar as condições.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "alteracoes",
      "heading": "7. Alterações delimitadas",
      "body": "Ideia/heroico no caso ei/oi paroxítono não recebem agudo; herói oxítono conserva. Voo/leem não recebem os circunflexos dos casos ensinados. A decisão não revoga outras regras de acentuação.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-chefe",
      "heading": "8. Exemplo resolvido: registrar o motivo",
      "body": "Frase autoral: O café ficou perto do lápis e da lâmpada.\n\nCa-FÉ: oxítona em e. LÁ-pis: paroxítona em is. LÂM-pa-da: proparoxítona. Todas têm sinal, mas a justificativa não é a mesma. Dizer apenas “estão acentuadas” não recupera a regra que a questão exige.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "retomadas",
      "heading": "9. Consultas por dificuldade",
      "body": "[OA-01: tonicidade e sinal](oa-01-v1.md)\n\n[OA-02: oxítonas e monossílabos](oa-02-v1.md)\n\n[OA-03: paroxítonas e proparoxítonas](oa-03-v1.md)\n\n[OA-04: encontros e alterações](oa-04-v1.md)\n\n[OA-R: revisão cumulativa](oa-r-v1.md)",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Classe tônica: posição da sílaba destacada. Monossílabo: palavra de uma sílaba. Terminação: final relevante para o caso. Restrição: condição que limita a regra. Hiato/ditongo: distribuições distintas dos sons vocálicos nos casos apresentados. Recuperação: explicar a pista e o motivo, em vez de apenas repetir a opção.",
      "type": "glossary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "11. Refazer antes de tentar novamente",
      "body": "Nomeie a confusão: tonicidade, classe, terminação, monossílabo, hiato ou mudança gráfica. Volte à aula, reescreva a ficha de decisão e indique o que o distrator ignorou. Não use o resultado do Chefe como prontidão global nem conclusão integral de ortografia.",
      "type": "summary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    }
  ],
  "recall": [
    "Qual é a sílaba tônica e a classe neste caso?",
    "Qual terminação ou encontro vocálico está presente?",
    "Qual regra e qual limite justificam a grafia?"
  ],
  "questions": [
    {
      "id": "oachefe.q01",
      "prompt": "Na leitura a-ba-ca-XI de “O abacaxi ficou na bancada”, qual posição tônica está expressa?",
      "options": [
        "Última sílaba.",
        "Penúltima sílaba.",
        "Antepenúltima sílaba.",
        "Ausência de tônica porque não há acento gráfico."
      ],
      "answer": 0,
      "explanation": "“Xi” encerra a palavra e recebe o destaque dado.",
      "optionRationales": [
        "“Xi” encerra a palavra e recebe o destaque dado.",
        "A penúltima é “ca”.",
        "A antepenúltima é “ba”.",
        "A ausência de sinal não elimina a tônica."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa01",
          "sectionId": "novos"
        }
      ],
      "groupId": "tonicidade"
    },
    {
      "id": "oachefe.q02",
      "prompt": "Na leitura CA-sa, qual descrição de “casa” distingue os conceitos corretamente?",
      "options": [
        "Tem acento gráfico obrigatório por possuir duas sílabas.",
        "É paroxítona, tem sílaba tônica e é escrita sem acento gráfico no caso dado.",
        "É monossílabo átono porque não tem sinal.",
        "É proparoxítona por aparecer na primeira frase."
      ],
      "answer": 1,
      "explanation": "Mantém a posição tônica e a grafia do exemplo.",
      "optionRationales": [
        "O total de sílabas não impõe um sinal.",
        "Mantém a posição tônica e a grafia do exemplo.",
        "Tem duas sílabas e destaque em ca.",
        "A posição na frase não fornece uma antepenúltima sílaba."
      ],
      "recoverySectionIds": [
        "base"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa01",
          "sectionId": "ex-casa"
        }
      ],
      "groupId": "tonicidade"
    },
    {
      "id": "oachefe.q03",
      "prompt": "Na leitura ci-PÓ da frase “O cipó cresceu perto da árvore”, qual caso justifica “cipó”?",
      "options": [
        "Paroxítona terminada em l.",
        "Proparoxítona com três sílabas.",
        "Oxítona terminada em o no caso ensinado.",
        "Toda palavra iniciada por c recebe agudo."
      ],
      "answer": 2,
      "explanation": "Usa a tônica final e a terminação o.",
      "optionRationales": [
        "Não conserva classe nem terminação.",
        "A divisão dada tem duas sílabas e tônica final.",
        "Usa a tônica final e a terminação o.",
        "A primeira letra não é a regra."
      ],
      "recoverySectionIds": [
        "oxitonas"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "finais"
        }
      ],
      "groupId": "oxitonas"
    },
    {
      "id": "oachefe.q04",
      "prompt": "Nas leituras ar-ma-ZÉM e ar-ma-ZÉNS, quais grafias correspondem ao caso de oxítonas com mais de uma sílaba?",
      "options": [
        "Armazem; armazens.",
        "Ármazem; ármazens.",
        "Armazêm; armazêns.",
        "Armazém; armazéns."
      ],
      "answer": 3,
      "explanation": "Conserva o caso e o agudo das formas padrão.",
      "optionRationales": [
        "Suprime sinais dos casos em/ens.",
        "Desloca a tônica para a primeira sílaba.",
        "Troca o agudo das formas dadas por circunflexo.",
        "Conserva o caso e o agudo das formas padrão."
      ],
      "recoverySectionIds": [
        "oxitonas"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "em"
        }
      ],
      "groupId": "oxitonas"
    },
    {
      "id": "oachefe.q05",
      "prompt": "Qual comparação entre “mês” e “sol” respeita o caso de monossílabos da aula?",
      "options": [
        "Mês recebe circunflexo no caso de e/s; sol termina em l e não recebe esse acento.",
        "Os dois recebem acento só por terem uma sílaba.",
        "Sol recebe a mesma regra de em/ens multissilábico.",
        "Mês é proparoxítona por ter circunflexo."
      ],
      "answer": 0,
      "explanation": "Distingue as terminações dos dois monossílabos tônicos.",
      "optionRationales": [
        "Distingue as terminações dos dois monossílabos tônicos.",
        "Tonicidade e uma sílaba não bastam sem verificar o caso.",
        "Não termina em em/ens nem tem mais de uma sílaba.",
        "Um monossílabo não tem antepenúltima sílaba."
      ],
      "recoverySectionIds": [
        "monossilabos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "mono-regra"
        }
      ],
      "groupId": "monossilabos"
    },
    {
      "id": "oachefe.q06",
      "prompt": "Na frase “O pé da mesa ficou solto”, a grafia de “pé” é explicada por qual caso do recorte?",
      "options": [
        "Paroxítona terminada em r.",
        "Monossílabo tônico terminado em e.",
        "Monossílabo átono que perde todo destaque.",
        "Proparoxítona em is."
      ],
      "answer": 1,
      "explanation": "Identifica número de sílabas, tonicidade e terminação.",
      "optionRationales": [
        "Não há penúltima nem terminação r.",
        "Identifica número de sílabas, tonicidade e terminação.",
        "O uso apresentado é tônico.",
        "Não há antepenúltima nem terminação is."
      ],
      "recoverySectionIds": [
        "monossilabos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "ex-mono"
        }
      ],
      "groupId": "monossilabos"
    },
    {
      "id": "oachefe.q07",
      "prompt": "Na leitura a-ÇÚ-car, qual justificativa conserva a regra de “açúcar”?",
      "options": [
        "Oxítona terminada em a.",
        "Monossílabo em e.",
        "Paroxítona terminada em r no caso ensinado.",
        "Toda palavra de três sílabas recebe circunflexo."
      ],
      "answer": 2,
      "explanation": "Usa a classe e a terminação pertinentes.",
      "optionRationales": [
        "A tônica é penúltima e a terminação é r.",
        "A divisão tem três sílabas.",
        "Usa a classe e a terminação pertinentes.",
        "Não é a regra e a forma dada usa agudo."
      ],
      "recoverySectionIds": [
        "parox-proparox"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa03",
          "sectionId": "terminacoes"
        }
      ],
      "groupId": "parox-proparox"
    },
    {
      "id": "oachefe.q08",
      "prompt": "Na leitura ÚL-ti-mo da frase “Ele chegou por último”, qual análise conserva o caso de acentuação?",
      "options": [
        "É oxítona porque aparece no fim da frase.",
        "É paroxítona por terminar em o.",
        "Não pode ser classificada por ter três sílabas.",
        "É proparoxítona e recebe acento pelo caso da antepenúltima tônica."
      ],
      "answer": 3,
      "explanation": "Identifica a classe e a regra ensinada.",
      "optionRationales": [
        "Posição na frase não é posição da tônica na palavra.",
        "Terminação não muda a tônica fornecida.",
        "A divisão e o destaque permitem classificá-la.",
        "Identifica a classe e a regra ensinada."
      ],
      "recoverySectionIds": [
        "parox-proparox"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "oa03",
          "sectionId": "proparoxitona"
        }
      ],
      "groupId": "parox-proparox"
    },
    {
      "id": "oachefe.q09",
      "prompt": "Na leitura ra-IZ da frase “A raiz ficou visível”, qual decisão usa o limite do caso de i em hiato?",
      "options": [
        "Raiz, sem agudo: i forma sílaba com z nesse caso.",
        "Raíz, porque todo i tônico recebe acento.",
        "Ráiz, deslocando o destaque dado.",
        "Ráíz, marcando toda a sequência de vogais."
      ],
      "answer": 0,
      "explanation": "Aplica o limite já ensinado com juiz à composição indicada.",
      "optionRationales": [
        "Aplica o limite já ensinado com juiz à composição indicada.",
        "Ignora a restrição relevante.",
        "Troca a posição tônica.",
        "Não corresponde à regra ou à grafia padrão."
      ],
      "recoverySectionIds": [
        "hiatos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "oa04",
          "sectionId": "ex-hiato"
        }
      ],
      "groupId": "hiatos"
    },
    {
      "id": "oachefe.q10",
      "prompt": "No caso apresentado em OA-04, qual grafia preserva o limite de i diante de nh?",
      "options": [
        "Raínha, por acentuar qualquer hiato.",
        "Rainha.",
        "Ráinha, por classificar toda palavra de três sílabas como proparoxítona.",
        "Rainhá, mudando a tônica para o final."
      ],
      "answer": 1,
      "explanation": "Conserva a forma ensinada.",
      "optionRationales": [
        "Ignora o limite do caso antes de nh.",
        "Conserva a forma ensinada.",
        "Usa número de sílabas sem localizar a tônica.",
        "Não preserva a leitura dada no ensino."
      ],
      "recoverySectionIds": [
        "hiatos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa04",
          "sectionId": "hiato"
        }
      ],
      "groupId": "hiatos"
    },
    {
      "id": "oachefe.q11",
      "prompt": "Na leitura he-ROI-co da frase “O gesto foi heroico”, qual grafia respeita o contraste de ditongos ensinado?",
      "options": [
        "Heróico, porque todo oi tônico leva agudo.",
        "Herôico, substituindo a regra por circunflexo.",
        "Heroico, sem agudo no oi tônico paroxítono desse caso.",
        "Heroicó, tornando a palavra oxítona."
      ],
      "answer": 2,
      "explanation": "Conserva classe e ausência de agudo do recorte.",
      "optionRationales": [
        "Ignora a regra do caso paroxítono.",
        "Não é o sinal nem a grafia correspondente ao caso.",
        "Conserva classe e ausência de agudo do recorte.",
        "Troca a posição tônica fornecida."
      ],
      "recoverySectionIds": [
        "alteracoes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa04",
          "sectionId": "ditongo"
        }
      ],
      "groupId": "alteracoes"
    },
    {
      "id": "oachefe.q12",
      "prompt": "Um leitor escreveu “O vôo foi adiado. Eles lêem o aviso”. Qual retomada corrige apenas esses casos, sem apagar o resto das regras?",
      "options": [
        "Retirar todo acento gráfico de qualquer palavra.",
        "Trocar o circunflexo por agudo nas duas palavras.",
        "Aplicar a regra de toda proparoxítona às duas formas.",
        "Retomar as formas voo/leem sem circunflexo nesses casos e conservar as demais regras."
      ],
      "answer": 3,
      "explanation": "Identifica as alterações delimitadas e evita uma regra universal falsa.",
      "optionRationales": [
        "Generaliza duas alterações indevidamente.",
        "Não é a grafia atual dos casos apresentados.",
        "Não é a classe nem a regra dos exemplos.",
        "Identifica as alterações delimitadas e evita uma regra universal falsa."
      ],
      "recoverySectionIds": [
        "alteracoes",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "oa04",
          "sectionId": "duplas"
        }
      ],
      "groupId": "alteracoes"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oachefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oachefe.q01": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "novos"
        }
      ],
      "oachefe.q02": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "base"
        },
        {
          "missionId": "draft.oa01",
          "sectionId": "ex-casa"
        }
      ],
      "oachefe.q03": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "oxitonas"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "finais"
        }
      ],
      "oachefe.q04": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "oxitonas"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "em"
        }
      ],
      "oachefe.q05": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "monossilabos"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "mono-regra"
        }
      ],
      "oachefe.q06": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "monossilabos"
        },
        {
          "missionId": "draft.oa02",
          "sectionId": "ex-mono"
        }
      ],
      "oachefe.q07": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "parox-proparox"
        },
        {
          "missionId": "draft.oa03",
          "sectionId": "terminacoes"
        }
      ],
      "oachefe.q08": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "parox-proparox"
        },
        {
          "missionId": "draft.oa03",
          "sectionId": "proparoxitona"
        }
      ],
      "oachefe.q09": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "hiatos"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "ex-hiato"
        }
      ],
      "oachefe.q10": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "hiatos"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "hiato"
        }
      ],
      "oachefe.q11": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "alteracoes"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "ditongo"
        }
      ],
      "oachefe.q12": [
        {
          "missionId": "draft.oachefe",
          "sectionId": "alteracoes"
        },
        {
          "missionId": "draft.oachefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.oa04",
          "sectionId": "duplas"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local desativado; parecer pedagógico independente concluído, sem aceite de publicação",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Português: ortografia e acentuação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Português: ortografia e acentuação, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Identificar a tônica e o caso pertinente.",
    "O2": "Conservar classe e grafia nas condições dadas.",
    "O3": "Reconhecer restrições e generalizações indevidas.",
    "O4": "Retomar a regra e reconstruir o motivo da forma correta."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar tonicidade, caso gráfico e regra; comparar o distrator e refazer a aplicação."
  },
  "limits": [
    "Recorte de acentuação do plano 97/bloco portuguese.spelling; não completa ortografia, hífen ou cobertura de edital.",
    "Frases, explicações e exercícios autorais, com base normativa identificada; exemplos não são citações extensas do Acordo.",
    "Acordo Ortográfico consultado em 04/10/2026; locator delimita os dispositivos usados. Regras e contrastes limitados ao ensino deste recorte.",
    "Leituras e divisões dadas nos casos; sem inventar regra universal a partir de uma grafia isolada ou excluir outras regras do Acordo.",
    "Sem edição de dados reais, XP/ordem/importação runtime ou publicação. Parecer independente agrupado pendente."
  ],
  "groups": [
    {
      "id": "tonicidade",
      "units": [
        "oa01"
      ]
    },
    {
      "id": "oxitonas",
      "units": [
        "oa02"
      ]
    },
    {
      "id": "monossilabos",
      "units": [
        "oa02"
      ]
    },
    {
      "id": "parox-proparox",
      "units": [
        "oa03"
      ]
    },
    {
      "id": "hiatos",
      "units": [
        "oa04"
      ]
    },
    {
      "id": "alteracoes",
      "units": [
        "oa04"
      ]
    }
  ]
};

export const ARITHMETIC = [];
