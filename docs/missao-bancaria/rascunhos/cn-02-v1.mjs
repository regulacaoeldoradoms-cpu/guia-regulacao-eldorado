// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "incaper.nominal",
    "label": "Incaper — Manual de Produção Editorial: concordância nominal",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "Manual institucional, capítulo11, HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.2.2 A (regra geral) e B (mais de um substantivo, limite do recorte); 11.2.1 sujeito único9 (ressalva coletivos)"
  }
];
export const CN02_DRAFT = {
  "id": "draft.cn02",
  "topicId": "draft.cn02",
  "editorialKey": "CN-02",
  "candidateBlockId": "portuguese.syntax",
  "title": "Concordância nominal: ligar formas ao substantivo",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
  "sourceIds": [
    "incaper.nominal"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Outro vínculo de concordância",
      "body": "Em O caderno novo e Os cadernos novos, artigo/adjetivo acompanham o substantivo em gênero/número. É concordância nominal. Não confundir com a verbal: chegaram ajusta-se ao sujeito; novos relaciona-se a cadernos no grupo nominal.",
      "type": "explanation",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "genero",
      "heading": "2. Gênero gramatical e número",
      "body": "Caderno é substantivo masculino; lista é feminino. Novo/nova/novos/novas exibem formas de gênero/número nesses usos. Gênero gramatical não corresponde necessariamente a sexo: mesa é substantivo feminino. Número distingue singular/plural. Aqui um adjetivo refere-se a um único substantivo.",
      "type": "explanation",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "relacao",
      "heading": "3. Artigos e demonstrativos ensinados",
      "body": "O/os e a/as acompanham caderno/lista. Este/estes e esta/estas também acompanham os substantivos nos exemplos. Não usar proximidade isolada: em As notas do caderno novo, novo caracteriza caderno, singular masculino; notas é plural feminino, mas não é o substantivo caracterizado por novo nesse grupo.",
      "type": "explanation",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "ex-lista",
      "heading": "4. Exemplo resolvido: lista nova",
      "body": "Em Esta lista nova, lista é feminino singular; esta e nova apresentam o mesmo gênero/número. No plural, Estas listas novas. A mudança de número exige ajustar as três formas dadas.",
      "type": "worked-example",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "ex-caderno",
      "heading": "5. Exemplo resolvido: cadernos novos",
      "body": "Em Os cadernos novos chegaram, cadernos é masculino plural. Os e novos acompanham o substantivo; chegaram concorda com o sujeito plural. Há dois vínculos diferentes na mesma frase.",
      "type": "worked-example",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "ex-vinculo",
      "heading": "6. Exemplo resolvido: substantivo dentro do grupo",
      "body": "Em A capa dos cadernos novos rasgou, novos caracteriza cadernos, masculino plural. Capa é núcleo singular feminino do sujeito e controla rasgou. O adjetivo não concorda automaticamente com o núcleo do sujeito: ele concorda com o substantivo a que se refere nesse uso.",
      "type": "worked-example",
      "sourceIds": [
        "incaper.nominal"
      ]
    },
    {
      "id": "limites",
      "heading": "7. Delimitar a regra",
      "body": "Não se cobram adjetivos ligados a vários substantivos, concordância de predicativos ou usos especiais de bastante/meio/anexo. Identifique o vínculo na frase dada e as formas já ensinadas. Não inventar uma terminação para todo adjetivo: há adjetivos de uma forma de gênero, fora da comparação novo/nova ensinada aqui.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Concordância é o ajuste de formas entre termos relacionados. Concordância verbal relaciona verbo e sujeito em pessoa/número nos casos ensinados; nominal relaciona determinantes/adjetivos ao substantivo em gênero/número. Núcleo é a palavra central do grupo. Sujeito composto tem mais de um núcleo. Verbo impessoal, nos usos ensinados, não tem sujeito; não confundir ausência de sujeito com sujeito oculto.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pelo vínculo",
      "body": "Localize o verbo e o sujeito, quando houver; marque o núcleo e sua pessoa/número. Para formas nominais, identifique o substantivo a que se referem. Não decidir pela palavra mais próxima. Nos usos impessoais, compare haver/existir ou fazer temporal com os exemplos. Retome a aula de origem antes de justificar sua escolha.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual termo controla a concordância neste uso?",
    "Qual é sua pessoa/número ou gênero/número?",
    "Há sujeito ou o verbo é impessoal no caso ensinado?"
  ],
  "questions": [
    {
      "id": "cn02.q01",
      "prompt": "Qual grupo tem as formas ensinadas concordando com listas?",
      "options": [
        "Esta listas nova",
        "Este listas novo",
        "Estas listas novas",
        "Estes listas novos"
      ],
      "answer": 2,
      "explanation": "Listas é feminino plural; estas/novas acompanham esse substantivo.",
      "optionRationales": [
        "Esta/nova permanecem singular.",
        "Este/novo são masculino singular.",
        "Listas é feminino plural; estas/novas acompanham esse substantivo.",
        "Estes/novos são masculino plural."
      ],
      "recoverySectionIds": [
        "ex-lista"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn02.q02",
      "prompt": "Em Os cadernos novos chegaram, quais palavras acompanham nominalmente cadernos?",
      "options": [
        "Os e novos",
        "Chegaram e os",
        "Chegaram e novos",
        "Apenas chegaram"
      ],
      "answer": 0,
      "explanation": "Artigo e adjetivo acompanham o substantivo em gênero/número.",
      "optionRationales": [
        "Artigo e adjetivo acompanham o substantivo em gênero/número.",
        "Chegaram integra a concordância verbal.",
        "Chegaram é verbo, não determinante/adjetivo.",
        "Chegaram é forma verbal ligada ao sujeito."
      ],
      "recoverySectionIds": [
        "ex-caderno"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn02.q03",
      "prompt": "Em A capa dos cadernos novos rasgou, por que novos está no masculino plural?",
      "options": [
        "Toda palavra antes de verbo fica plural.",
        "Caracteriza capa, feminino singular.",
        "Concorda com rasgou como sujeito.",
        "Caracteriza cadernos, masculino plural."
      ],
      "answer": 3,
      "explanation": "O adjetivo caracteriza cadernos no grupo dos cadernos novos.",
      "optionRationales": [
        "A posição não cria essa regra.",
        "O vínculo nominal dado não é com capa.",
        "Rasgou é verbo, não substantivo caracterizado.",
        "O adjetivo caracteriza cadernos no grupo dos cadernos novos."
      ],
      "recoverySectionIds": [
        "ex-vinculo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cn02.q04",
      "prompt": "Qual passagem para plural ajusta as formas de Esta lista nova?",
      "options": [
        "Esta listas novas",
        "Estas listas novas",
        "Estas lista nova",
        "Estes listas novos"
      ],
      "answer": 1,
      "explanation": "As três formas passam ao feminino plural.",
      "optionRationales": [
        "Esta permanece singular.",
        "As três formas passam ao feminino plural.",
        "Lista/nova permanecem singular.",
        "Estes/novos mudam para masculino."
      ],
      "recoverySectionIds": [
        "ex-lista"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn02.q05",
      "prompt": "Qual afirmação interpreta gênero no exemplo mesa?",
      "options": [
        "Feminino é uma classificação gramatical do substantivo.",
        "Mesa precisa ser uma pessoa de sexo feminino.",
        "Mesa é masculina porque é objeto.",
        "Objetos não têm gênero gramatical."
      ],
      "answer": 0,
      "explanation": "O gênero gramatical se aplica também a substantivos que não nomeiam pessoas.",
      "optionRationales": [
        "O gênero gramatical se aplica também a substantivos que não nomeiam pessoas.",
        "Gênero gramatical não exige pessoa/sexo.",
        "Ser objeto não determina gênero masculino.",
        "Mesa tem gênero gramatical feminino."
      ],
      "recoverySectionIds": [
        "genero"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn02.q06",
      "prompt": "Em As notas do caderno novo, qual substantivo novo caracteriza no grupo dado?",
      "options": [
        "as",
        "notas",
        "caderno",
        "do"
      ],
      "answer": 2,
      "explanation": "Novo caracteriza caderno, masculino singular.",
      "optionRationales": [
        "As é artigo, não substantivo caracterizado.",
        "Notas pertence a outro vínculo nesse grupo.",
        "Novo caracteriza caderno, masculino singular.",
        "Do introduz o grupo preposicionado."
      ],
      "recoverySectionIds": [
        "relacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cn02.q07",
      "prompt": "Você escreveu Este lista novo. Qual revisão aplica apenas o ajuste nominal ensinado?",
      "options": [
        "Estes lista novos",
        "Esta lista nova",
        "Este listas novo",
        "Nós lemos lista"
      ],
      "answer": 1,
      "explanation": "Lista feminino singular pede esta/nova.",
      "optionRationales": [
        "Estes/novos continuam incompatíveis.",
        "Lista feminino singular pede esta/nova.",
        "As formas não acompanham listas.",
        "Troca o conteúdo sem corrigir o grupo original."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "cn02.q08",
      "prompt": "Em A capa dos cadernos novos rasgou, qual comparação distingue os vínculos?",
      "options": [
        "Rasgou é adjetivo masculino plural.",
        "Novos e rasgou concordam ambos com cadernos.",
        "Novos acompanha rasgou; capa acompanha novos.",
        "Novos acompanha cadernos; rasgou acompanha o sujeito de núcleo capa."
      ],
      "answer": 3,
      "explanation": "O adjetivo caracteriza cadernos; o verbo concorda com o sujeito singular capa.",
      "optionRationales": [
        "Rasgou é verbo singular no passado.",
        "Rasgou concorda com capa, não cadernos.",
        "Os vínculos estão trocados.",
        "O adjetivo caracteriza cadernos; o verbo concorda com o sujeito singular capa."
      ],
      "recoverySectionIds": [
        "ex-vinculo"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cn02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cn02.q01": [
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-lista"
        }
      ],
      "cn02.q02": [
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-caderno"
        }
      ],
      "cn02.q03": [
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-vinculo"
        }
      ],
      "cn02.q04": [
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-lista"
        }
      ],
      "cn02.q05": [
        {
          "missionId": "draft.cn02",
          "sectionId": "genero"
        }
      ],
      "cn02.q06": [
        {
          "missionId": "draft.cn02",
          "sectionId": "relacao"
        }
      ],
      "cn02.q07": [
        {
          "missionId": "draft.cn02",
          "sectionId": "recuperacao"
        }
      ],
      "cn02.q08": [
        {
          "missionId": "draft.cn02",
          "sectionId": "ex-vinculo"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente aprovado no recorte introdutório",
  "objectives": {
    "O1": "Identificar o termo que controla a forma.",
    "O2": "Aplicar o ajuste nos casos ensinados.",
    "O3": "Distinguir vínculo, proximidade e impessoalidade.",
    "O4": "Retomar ensino e justificar a correção."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Identificar o vínculo e as características do termo controlador antes de corrigir."
  },
  "limits": [
    "Plano05/bloco portuguese.syntax existente; pré-requisitos CF (verbo, pessoa/número, sujeito/núcleo) e PU (grupos); perfis históricos BB/CAIXA referenceOnly.",
    "Frases e exercícios autorais/fictícios, sem dados pessoais. Referências institucionais conferidas em04/10/2026 nas regras pertinentes; não cobrem todo o bloco nem atribuem os exemplos autorais aos manuais.",
    "Recorte introdutório: não cobre coletivos/partitivos, pronomes relativos, porcentagens, concordância com se, sujeito posposto ou misturas de pessoas em sujeitos compostos, adjetivo com múltiplos substantivos, predicativos e todas as expressões especiais.",
    "Sem XP/ordem/candidato/runtime/push/ativação/merge/deploy/D1; parecer não equivale a aceite humano, avaliação independente ou retenção."
  ]
};
export const ARITHMETIC = [];
