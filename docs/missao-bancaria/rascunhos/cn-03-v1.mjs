// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  }
];
export const CN03_DRAFT = {
  "id": "draft.cn03",
  "topicId": "draft.cn03",
  "editorialKey": "CN-03",
  "candidateBlockId": "portuguese.syntax",
  "title": "Dois núcleos e usos impessoais: comparar estruturas",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Ajustar formas aos termos relacionados em frases simples, distinguindo núcleo e usos impessoais ensinados.",
  "sourceIds": [
    "senado.concordancia"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Sujeito composto antes do verbo",
      "body": "Em O aluno e a aluna chegaram, aluno/aluna são dois núcleos ligados por e e colocados antes do verbo. Nesse caso, chegou vira chegaram, terceira pessoa plural. Aqui ambos são de terceira pessoa; não generalizar para sujeito posposto ou diferentes conectivos e pessoas.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "haver",
      "heading": "2. Haver indicando existência",
      "body": "Em Há livros na mesa, haver significa existir e é impessoal: não tem sujeito nesse uso. Livros não é sujeito de haver; o verbo fica na terceira pessoa singular. No passado: Havia livros na mesa. Não ensinar que todo haver é impessoal: outros usos ficam fora.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "existir",
      "heading": "3. Existir tem sujeito no exemplo",
      "body": "Compare Existem livros na mesa e Existe um livro na mesa. Existir não é impessoal nesses casos: livros/um livro são sujeitos e o verbo concorda com eles. O significado próximo de há não autoriza copiar a regra de haver para existir.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "fazer",
      "heading": "4. Fazer indicando tempo decorrido",
      "body": "Em Faz dois anos que o grupo se reúne, fazer indica tempo decorrido e é impessoal, singular, mesmo com dois anos. No passado: Fazia dois anos que o grupo se reunia. Compare As equipes fazem resumos: fazer tem sujeito plural nesse outro uso e pode variar. Aqui não se cobram locuções com haver/fazer nem expressões de clima.",
      "type": "explanation",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-composto",
      "heading": "5. Exemplo resolvido: dois núcleos anteriores",
      "body": "Em A professora e o aluno revisaram o texto, os dois núcleos antecedem o verbo e são de terceira pessoa; use revisaram no plural. Texto é complemento e não controla essa forma.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-existencia",
      "heading": "6. Exemplo resolvido: mesma situação, estruturas diferentes",
      "body": "Sobre livros na sala: Há livros na sala / Existem livros na sala. Haver existencial permanece singular e sem sujeito; existir concorda com livros, sujeito plural. A interpretação de existência é próxima, mas as estruturas gramaticais não são idênticas.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
    },
    {
      "id": "ex-tempo",
      "heading": "7. Exemplo resolvido: duração não é sujeito",
      "body": "Em Faz três meses que a turma começou, faz indica tempo decorrido e permanece singular. Compare Os alunos fazem exercícios: alunos é sujeito plural do fazer não temporal. Não pluralizar faz apenas por meses nem singularizar fazem apenas porque o infinitivo é o mesmo.",
      "type": "worked-example",
      "sourceIds": [
        "senado.concordancia"
      ]
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
      "id": "cn03.q01",
      "prompt": "No caso ensinado, complete: A professora e o aluno ___ o roteiro ontem.",
      "options": [
        "revisaram",
        "revisou",
        "revisamos",
        "reviso"
      ],
      "answer": 0,
      "explanation": "Dois núcleos de terceira pessoa anteriores ao verbo pedem plural no passado.",
      "optionRationales": [
        "Dois núcleos de terceira pessoa anteriores ao verbo pedem plural no passado.",
        "Revisou é singular.",
        "Revisamos seria primeira plural.",
        "Reviso muda pessoa/tempo."
      ],
      "recoverySectionIds": [
        "ex-composto"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn03.q02",
      "prompt": "Qual frase aplica haver com sentido existencial no presente?",
      "options": [
        "Havemos cadernos na sala.",
        "Hão cadernos na sala.",
        "Há cadernos na sala.",
        "Hás cadernos na sala."
      ],
      "answer": 2,
      "explanation": "Haver existencial é impessoal e fica singular.",
      "optionRationales": [
        "Havemos não é a forma impessoal ensinada.",
        "Não se pluraliza por cadernos nesse uso.",
        "Haver existencial é impessoal e fica singular.",
        "Hás corresponde a segunda pessoa, não ao uso ensinado."
      ],
      "recoverySectionIds": [
        "haver"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn03.q03",
      "prompt": "Qual comparação está de acordo com os usos ensinados?",
      "options": [
        "Hão notas / Existe notas.",
        "Há notas / Existem notas.",
        "Há notas / Existe notas.",
        "Hão notas / Existem notas."
      ],
      "answer": 1,
      "explanation": "Haver é impessoal; existir tem notas como sujeito plural.",
      "optionRationales": [
        "As duas formas estão inadequadas aos usos.",
        "Haver é impessoal; existir tem notas como sujeito plural.",
        "Existir deve ajustar-se ao sujeito plural.",
        "Haver existencial não se pluraliza."
      ],
      "recoverySectionIds": [
        "ex-existencia"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cn03.q04",
      "prompt": "Complete o caso de tempo decorrido: ___ três meses que a aula começou.",
      "options": [
        "Faço",
        "Fazem",
        "Fazemos",
        "Faz"
      ],
      "answer": 3,
      "explanation": "Fazer temporal é impessoal e permanece singular.",
      "optionRationales": [
        "Faço é primeira pessoa, incompatível com o uso.",
        "Três meses não exige plural no uso impessoal.",
        "Não há nós como sujeito nesse caso.",
        "Fazer temporal é impessoal e permanece singular."
      ],
      "recoverySectionIds": [
        "fazer"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cn03.q05",
      "prompt": "Em Existem livros na mesa, qual é o sujeito no caso ensinado?",
      "options": [
        "existem",
        "na mesa",
        "livros",
        "Não há sujeito porque significa haver."
      ],
      "answer": 2,
      "explanation": "Livros é sujeito plural de existir.",
      "optionRationales": [
        "Existem é o verbo.",
        "Na mesa é circunstância de lugar.",
        "Livros é sujeito plural de existir.",
        "Significado próximo não torna as estruturas iguais."
      ],
      "recoverySectionIds": [
        "existir"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cn03.q06",
      "prompt": "Qual frase mostra fazer com sujeito plural, fora do uso temporal?",
      "options": [
        "As equipes fazem resumos.",
        "Faz três meses que começaram.",
        "Fazia dois anos que estudavam.",
        "Há livros na mesa."
      ],
      "answer": 0,
      "explanation": "Equipes é sujeito plural de fazem nesse uso não temporal.",
      "optionRationales": [
        "Equipes é sujeito plural de fazem nesse uso não temporal.",
        "Faz indica tempo decorrido, impessoal.",
        "Fazia indica tempo decorrido, impessoal.",
        "Há é haver existencial, outro verbo."
      ],
      "recoverySectionIds": [
        "ex-tempo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cn03.q07",
      "prompt": "Você escreveu Haviam cadernos na sala para indicar existência. Qual correção mantém o passado e o uso de haver?",
      "options": [
        "Existem cadernos na sala.",
        "Havemos cadernos na sala.",
        "Há cadernos na sala.",
        "Havia cadernos na sala."
      ],
      "answer": 3,
      "explanation": "Havia é terceira pessoa singular passada do uso impessoal.",
      "optionRationales": [
        "Existem muda verbo e tempo, não é a correção solicitada.",
        "Havemos não mantém o uso impessoal/passado.",
        "Há muda para presente.",
        "Havia é terceira pessoa singular passada do uso impessoal."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "cn03.q08",
      "prompt": "Por que não basta tratar todo uso de fazer como impessoal?",
      "options": [
        "Fazer nunca tem sujeito.",
        "Em As equipes fazem resumos, fazer tem sujeito plural.",
        "Meses sempre controla fazer.",
        "A palavra anterior ao verbo sempre é sujeito."
      ],
      "answer": 1,
      "explanation": "O uso não temporal dado tem sujeito equipes e forma plural.",
      "optionRationales": [
        "É uma generalização que o exemplo refuta.",
        "O uso não temporal dado tem sujeito equipes e forma plural.",
        "No uso temporal ensinado, meses não é sujeito.",
        "A função depende da estrutura, não só da posição."
      ],
      "recoverySectionIds": [
        "fazer"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cn03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cn03.q01": [
        {
          "missionId": "draft.cn03",
          "sectionId": "ex-composto"
        }
      ],
      "cn03.q02": [
        {
          "missionId": "draft.cn03",
          "sectionId": "haver"
        }
      ],
      "cn03.q03": [
        {
          "missionId": "draft.cn03",
          "sectionId": "ex-existencia"
        }
      ],
      "cn03.q04": [
        {
          "missionId": "draft.cn03",
          "sectionId": "fazer"
        }
      ],
      "cn03.q05": [
        {
          "missionId": "draft.cn03",
          "sectionId": "existir"
        }
      ],
      "cn03.q06": [
        {
          "missionId": "draft.cn03",
          "sectionId": "ex-tempo"
        }
      ],
      "cn03.q07": [
        {
          "missionId": "draft.cn03",
          "sectionId": "recuperacao"
        }
      ],
      "cn03.q08": [
        {
          "missionId": "draft.cn03",
          "sectionId": "fazer"
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
