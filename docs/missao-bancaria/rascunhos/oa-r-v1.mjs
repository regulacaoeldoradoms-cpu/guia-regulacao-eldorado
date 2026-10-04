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

export const OAR_DRAFT = {
  "id": "draft.oar",
  "topicId": "draft.oar",
  "editorialKey": "OA-R",
  "candidateBlockId": "portuguese.spelling",
  "title": "Revisão cumulativa de tonicidade e acentuação",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar os quatro recortes em casos próprios, escolhendo a regra pela tonicidade, classe, terminação e restrições, sem copiar um acento por aparência.",
  "sourceIds": [
    "acordo.oa.acentuacao"
  ],
  "sections": [
    {
      "id": "roteiro",
      "heading": "1. A ficha de decisão",
      "body": "Leia a palavra na frase e use a pronúncia indicada. Localize a tônica, identifique a classe e só depois confira a terminação ou o encontro vocálico. A revisão reúne OA-01–04; não é avaliação independente nem prova de retenção. Não pede regras que não foram ensinadas.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "base",
      "heading": "2. Destaque e grafia",
      "body": "Uma palavra pode ter tônica sem sinal gráfico. A posição tônica não é o número de letras ou a posição na frase. Nas leituras fornecidas, registre última/penúltima/antepenúltima antes de aplicar a grafia. Para palavras de uma sílaba, reconheça primeiro o monossílabo no contexto.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-base",
      "heading": "3. Exemplo resolvido: lugar da tônica",
      "body": "Na frase autoral “A mesa ficou perto do café”, use ME-sa e ca-FÉ. Mesa é paroxítona sem acento na forma dada; café é oxítona acentuada pelo caso em e. A presença de sinal não define a classe sozinha e a ausência de sinal não apaga a tônica.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "finais",
      "heading": "4. Classe e terminação",
      "body": "Oxítonas a/e/o, com ou sem s, e o caso multissilábico em/ens recebem o tratamento ensinado em OA-02. Monossílabos tônicos a/e/o, com ou sem s, são outro caso inicial. Paroxítonas l/r/i/is do recorte têm regra própria. Proparoxítonas recebem acento, sem que isso signifique usar somente agudo.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-contraste",
      "heading": "5. Exemplo resolvido: fácil e lâmpada",
      "body": "FÁ-cil é paroxítona em l; LÂM-pa-da é proparoxítona. As duas formas têm sinal gráfico, mas o motivo da acentuação é diferente. Para explicar, use a classe e o caso, não apenas “tem acento porque parece certo”.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "encontros",
      "heading": "6. Hiatos e limites",
      "body": "No caso de i/u tônico em hiato, confira a vogal precedente, a composição da sílaba e restrições. País tem i com s; juiz tem i com z; rainha não recebe o agudo diante de nh. Baiuca ilustra a restrição paroxítona depois de ditongo. Não generalizar que todo hiato recebe agudo.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "alteracoes",
      "heading": "7. Mudanças gráficas delimitadas",
      "body": "Ideia/heroico não têm agudo no caso de ei/oi tônico paroxítono; herói conserva o agudo do ditongo aberto oxítono. Voo/leem não usam circunflexo nos casos apresentados. Essas decisões não eliminam os outros acentos ou as demais regras do Acordo.",
      "type": "explanation",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "ex-encontro",
      "heading": "8. Exemplo resolvido: não transferir a regra",
      "body": "Compare “A ideia era escrever sobre um herói”. Ideia, i-DEI-a, não recebe agudo no caso paroxítono; herói, he-RÓI, recebe no oxítono com ditongo aberto. Não decidir pela sequência oi/ei sem a classe e a pronúncia. O mesmo cuidado impede transferir a ausência de circunflexo em voo para lâmpada.",
      "type": "worked-example",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "glossario",
      "heading": "9. Vocabulário de apoio",
      "body": "Tonicidade: destaque na pronúncia. Classe tônica: posição da sílaba destacada. Terminação: parte final relevante ao caso. Hiato: sons vocálicos em sílabas diferentes. Ditongo: vogal/semivogal na mesma sílaba nos casos dados. Restrição: limite da aplicação de uma regra.",
      "type": "glossary",
      "sourceIds": [
        "acordo.oa.acentuacao"
      ]
    },
    {
      "id": "recuperacao",
      "heading": "10. Retomada por confusão",
      "body": "Erro de destaque/classificação: OA-01. Transferência de regra a/e/o ou em/ens: OA-02. Troca entre paroxítona/proparoxítona: OA-03. Hiato, restrição ou mudança gráfica: OA-04. Escreva o motivo da opção correta e a condição que o distrator ignorou. Depois tente outro caso, sem apenas repetir o enunciado.",
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
      "id": "oar.q01",
      "prompt": "Na leitura ja-NE-la da frase “A janela ficou aberta”, onde está a sílaba tônica?",
      "options": [
        "Na penúltima.",
        "Na última.",
        "Na antepenúltima.",
        "Fora da palavra porque não há sinal gráfico."
      ],
      "answer": 0,
      "explanation": "“Ne” é a penúltima das três sílabas.",
      "optionRationales": [
        "“Ne” é a penúltima das três sílabas.",
        "A última é “la”.",
        "A antepenúltima é “ja”.",
        "A palavra tem destaque tônico mesmo sem sinal."
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
          "sectionId": "posicao"
        }
      ]
    },
    {
      "id": "oar.q02",
      "prompt": "Qual afirmação preserva a diferença entre tonicidade e acento gráfico?",
      "options": [
        "Toda palavra tônica usa circunflexo.",
        "“Casa”, CA-sa, tem tônica e não tem acento gráfico na grafia dada.",
        "Qualquer palavra sem sinal é monossílabo átono.",
        "O sinal sozinho informa o número de sílabas da palavra."
      ],
      "answer": 1,
      "explanation": "Conserva o exemplo que separa os dois conceitos.",
      "optionRationales": [
        "O sinal depende do caso normativo.",
        "Conserva o exemplo que separa os dois conceitos.",
        "“Casa” tem duas sílabas e é tônica.",
        "Número de sílabas não é indicado apenas pelo sinal."
      ],
      "recoverySectionIds": [
        "base",
        "ex-base"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa01",
          "sectionId": "ex-casa"
        }
      ]
    },
    {
      "id": "oar.q03",
      "prompt": "Nas leituras so-FÁ e ro-BÔ, qual par conserva as grafias dos casos de oxítonas ensinados?",
      "options": [
        "Sofa e robo.",
        "Sófa e róbo.",
        "Sofá e robô.",
        "Sofá e robo, pois nenhuma oxítona admite circunflexo."
      ],
      "answer": 2,
      "explanation": "Mantém sinais e tonicidade dos casos fornecidos.",
      "optionRationales": [
        "Suprime sinais das formas padrão.",
        "Muda a posição tônica das duas.",
        "Mantém sinais e tonicidade dos casos fornecidos.",
        "“Robô” admite o circunflexo indicado por sua pronúncia."
      ],
      "recoverySectionIds": [
        "finais"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "finais"
        }
      ]
    },
    {
      "id": "oar.q04",
      "prompt": "Qual comparação preserva o limite do caso em/ens?",
      "options": [
        "Bem recebe agudo pela mesma regra de também.",
        "Toda palavra em em tem mais de uma sílaba.",
        "Também é escrito sem acento porque termina em m.",
        "Também tem mais de uma sílaba e usa agudo nesse caso; bem é monossílabo sem esse acento."
      ],
      "answer": 3,
      "explanation": "Distingue as condições e as formas ensinadas.",
      "optionRationales": [
        "O caso exige mais de uma sílaba.",
        "“Bem” contraria a afirmação.",
        "A terminação do caso é em, não proibição de m.",
        "Distingue as condições e as formas ensinadas."
      ],
      "recoverySectionIds": [
        "finais"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "oa02",
          "sectionId": "ex-em"
        }
      ]
    },
    {
      "id": "oar.q05",
      "prompt": "Na leitura a-MÁ-vel da frase “A pessoa foi amável”, qual justificativa corresponde à grafia dada?",
      "options": [
        "Paroxítona terminada em l no recorte.",
        "Oxítona terminada em o.",
        "Proparoxítona só por ter três sílabas.",
        "Monossílabo átono em s."
      ],
      "answer": 0,
      "explanation": "A tônica é penúltima e a terminação é l.",
      "optionRationales": [
        "A tônica é penúltima e a terminação é l.",
        "Não conserva classe nem terminação.",
        "Três sílabas não bastam; a tônica dada é penúltima.",
        "Há três sílabas e terminação l."
      ],
      "recoverySectionIds": [
        "finais",
        "ex-contraste"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "oa03",
          "sectionId": "terminacoes"
        }
      ]
    },
    {
      "id": "oar.q06",
      "prompt": "Na leitura PÚ-bli-co da frase “O aviso ficou em local público”, qual classificação justifica o acento da forma dada?",
      "options": [
        "Paroxítona em em.",
        "Proparoxítona, com tônica antepenúltima.",
        "Oxítona com tônica final.",
        "Monossílabo átono por terminar em o."
      ],
      "answer": 1,
      "explanation": "Localiza a tônica antepenúltima e aplica o caso.",
      "optionRationales": [
        "A tônica não é penúltima nem há terminação em.",
        "Localiza a tônica antepenúltima e aplica o caso.",
        "A última é “co”, sem destaque principal nessa leitura.",
        "Há três sílabas; terminação não elimina tonicidade."
      ],
      "recoverySectionIds": [
        "finais",
        "ex-contraste"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "oa03",
          "sectionId": "proparoxitona"
        }
      ]
    },
    {
      "id": "oar.q07",
      "prompt": "Na leitura ba-Ú, qual decisão corresponde ao caso tônico de hiato ensinado?",
      "options": [
        "Báu, deslocando o destaque.",
        "Bau, pois todo u tônico fica sem acento.",
        "Baú, com u tônico em hiato sozinho na sílaba.",
        "Báú, acentuando toda vogal da palavra."
      ],
      "answer": 2,
      "explanation": "Usa tonicidade e composição da sílaba do recorte.",
      "optionRationales": [
        "Muda a posição tônica.",
        "Ignora o caso normativo fornecido.",
        "Usa tonicidade e composição da sílaba do recorte.",
        "Não é a grafia nem a regra dada."
      ],
      "recoverySectionIds": [
        "encontros"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "oa04",
          "sectionId": "hiato"
        }
      ]
    },
    {
      "id": "oar.q08",
      "prompt": "Um estudante escreveu “idéia” e “vôo” por ignorar os casos ensinados. Qual retomada corrige esses dois casos?",
      "options": [
        "Retirar todos os acentos de todo o texto.",
        "Acentuar toda sequência ei/oo sem olhar a classe.",
        "Aplicar a regra de proparoxítonas a qualquer palavra de duas sílabas.",
        "Voltar a ideia, paroxítona ei, e ao caso voo, conservando as outras regras do Acordo."
      ],
      "answer": 3,
      "explanation": "Identifica os dois casos delimitados e evita apagar os demais acentos.",
      "optionRationales": [
        "Generaliza duas decisões para todo o sistema.",
        "Repete os atalhos que causaram o erro.",
        "Troca o domínio de aplicação da regra.",
        "Identifica os dois casos delimitados e evita apagar os demais acentos."
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
          "sectionId": "ditongo"
        },
        {
          "unit": "oa04",
          "sectionId": "duplas"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "oar-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "oar.q01": [
        {
          "missionId": "draft.oar",
          "sectionId": "base"
        }
      ],
      "oar.q02": [
        {
          "missionId": "draft.oar",
          "sectionId": "base"
        },
        {
          "missionId": "draft.oar",
          "sectionId": "ex-base"
        }
      ],
      "oar.q03": [
        {
          "missionId": "draft.oar",
          "sectionId": "finais"
        }
      ],
      "oar.q04": [
        {
          "missionId": "draft.oar",
          "sectionId": "finais"
        }
      ],
      "oar.q05": [
        {
          "missionId": "draft.oar",
          "sectionId": "finais"
        },
        {
          "missionId": "draft.oar",
          "sectionId": "ex-contraste"
        }
      ],
      "oar.q06": [
        {
          "missionId": "draft.oar",
          "sectionId": "finais"
        },
        {
          "missionId": "draft.oar",
          "sectionId": "ex-contraste"
        }
      ],
      "oar.q07": [
        {
          "missionId": "draft.oar",
          "sectionId": "encontros"
        }
      ],
      "oar.q08": [
        {
          "missionId": "draft.oar",
          "sectionId": "alteracoes"
        },
        {
          "missionId": "draft.oar",
          "sectionId": "recuperacao"
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
    "O1": "Localizar tonicidade e casos de terminação ensinados.",
    "O2": "Conservar classe e sinal nas formas dadas.",
    "O3": "Aplicar condições e limites de uma regra.",
    "O4": "Retomar o caso normativo e corrigir a generalização."
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
  ]
};

export const ARITHMETIC = [];
