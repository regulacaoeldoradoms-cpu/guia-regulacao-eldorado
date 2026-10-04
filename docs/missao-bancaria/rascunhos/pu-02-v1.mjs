// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "senado.virgula",
    "label": "Senado Federal — Manual de Comunicação: vírgula",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/virgula",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Não separe; Use vírgula: enumeração, termos explicativos/deslocados; ressalva de adjunto curto"
  },
  {
    "id": "funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  }
];
export const PU02_DRAFT = {
  "id": "draft.pu02",
  "topicId": "draft.pu02",
  "editorialKey": "PU-02",
  "candidateBlockId": "portuguese.syntax",
  "title": "Vírgula: conservar grupos e delimitar intercalações",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
  "sourceIds": [
    "senado.virgula",
    "funag.virgula"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Pausa não decide tudo",
      "body": "A vírgula organiza relações na escrita. Respiração e leitura em voz alta podem variar; não são uma regra suficiente para inserir vírgulas. Retome os grupos sujeitos/complementos de CF e a oração de PU-01 antes de decidir onde o sinal cabe.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "estrutura",
      "heading": "2. Grupos ligados na ordem simples",
      "body": "Em A equipe atenta leu o aviso, o sujeito A equipe atenta liga-se ao predicado leu o aviso. Sem intercalação ou inversão, não insira uma vírgula entre esse sujeito e o verbo. Também não separe leu de seu complemento o aviso por vírgula nesse uso simples. A equipe atenta, leu o aviso e A equipe atenta leu, o aviso quebram esses vínculos. Não é regra de que nunca pode aparecer vírgula entre essas posições: um trecho intercalado delimitado por dois sinais é caso diferente.",
      "type": "explanation",
      "sourceIds": [
        "senado.virgula"
      ]
    },
    {
      "id": "lista",
      "heading": "3. Enumeração simples fornecida",
      "body": "Em A turma leu a pauta, o resumo e a proposta, os três grupos indicam o que foi lido, na enumeração simples. A vírgula separa os dois primeiros itens; e liga o último. O enunciado das questões pedirá essa enumeração com último elemento ligado por e e sem intercalações. Não transforme o exemplo em proibição universal de vírgula junto a e, pois outros contextos ficam fora.",
      "type": "explanation",
      "sourceIds": [
        "senado.virgula",
        "funag.virgula"
      ]
    },
    {
      "id": "intercalacao",
      "heading": "4. Informação intercalada delimitada",
      "body": "Em A turma, segundo o combinado, leu a nota, segundo o combinado é apresentado como observação intercalada entre sujeito e verbo. As duas vírgulas marcam seus limites; a estrutura básica A turma leu a nota permanece. Não conclua que a primeira vírgula isola diretamente o sujeito do verbo nem retire apenas um dos sinais quando a intenção é conservar essa delimitação. Sem vírgulas pode haver outra organização; as questões especificam a observação delimitada.",
      "type": "explanation",
      "sourceIds": [
        "senado.virgula"
      ]
    },
    {
      "id": "ex-estrutura",
      "heading": "5. Exemplo resolvido: retirar quebra indevida",
      "body": "O enunciado pede frase em ordem simples, sem trecho intercalado. A turma cuidadosa, revisou o roteiro insere vírgula entre sujeito e verbo. Corrija para A turma cuidadosa revisou o roteiro. Não trocar por A turma cuidadosa revisou, o roteiro, pois isso separa verbo e complemento nesse caso.",
      "type": "worked-example",
      "sourceIds": [
        "senado.virgula"
      ]
    },
    {
      "id": "ex-lista",
      "heading": "6. Exemplo resolvido: lista de três itens",
      "body": "Na enumeração pedida com último elemento ligado por e, escreva O grupo conferiu o texto, a pauta e a lista. A vírgula distingue os primeiros itens da lista; não vem após o sujeito O grupo nem entre conferiu e o primeiro complemento. O sinal serve à enumeração, não ao comprimento da frase.",
      "type": "worked-example",
      "sourceIds": [
        "senado.virgula",
        "funag.virgula"
      ]
    },
    {
      "id": "ex-intercalacao",
      "heading": "7. Exemplo resolvido: localizar os dois limites",
      "body": "Em O grupo, conforme o combinado, preparou o resumo, as vírgulas delimitam conforme o combinado. Retirando essa observação, a estrutura fica O grupo preparou o resumo. Conservar só O grupo, conforme o combinado preparou o resumo não mantém os dois limites da intercalação pretendida.",
      "type": "worked-example",
      "sourceIds": [
        "senado.virgula"
      ]
    },
    {
      "id": "limites",
      "heading": "8. Não universalizar",
      "body": "O recorte não cobre todo adjunto deslocado, oração intercalada, coordenação com e, inversão ou estilo. Não cobra vírgula obrigatória em toda expressão curta de tempo. Os itens de intercalação explicitam a intenção de delimitá-la; os de ordem simples excluem trecho intercalado/inversão. Decida pelo caso apresentado.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Frase comunica algo em uma situação; oração organiza-se em torno de verbo ou locução verbal; período contém uma ou mais orações nos exemplos. Termos são palavras/grupos com função, como sujeito e complemento. Intercalação insere informação entre partes da estrutura. Vocativo chama o interlocutor; aposto explicativo esclarece um termo. Restrição identifica o grupo referido; explicação acrescenta informação sobre ele. Esses termos têm ensino e exemplos no recorte, não uma classificação completa.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pela estrutura e pelo sentido",
      "body": "Localize verbo/locução e grupos; marque qual função tem o trecho e o que a pergunta pede. Retome o exemplo de origem e compare a alternativa escolhida. Se houve mudança de vírgulas, explique o sentido preservado ou alterado. Não decidir pelo comprimento da frase nem só por uma pausa de respiração.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual verbo/locução e quais grupos aparecem?",
    "O trecho é sujeito, complemento, intercalação, chamada ou explicação?",
    "As vírgulas conservam a estrutura e o alcance pretendido?"
  ],
  "questions": [
    {
      "id": "pu02.q01",
      "prompt": "Sem inversão nem trecho intercalado, qual frase mantém os grupos ligados no caso ensinado?",
      "options": [
        "A equipe cuidadosa revisou, o texto.",
        "A equipe cuidadosa, revisou o texto.",
        "A equipe cuidadosa revisou o texto.",
        "A equipe, cuidadosa revisou o texto."
      ],
      "answer": 2,
      "explanation": "Conserva sujeito e verbo e o vínculo entre verbo e complemento.",
      "optionRationales": [
        "Separa verbo de complemento.",
        "Separa sujeito de verbo sem intercalação.",
        "Conserva sujeito e verbo e o vínculo entre verbo e complemento.",
        "Interrompe o grupo sem a delimitação de observação intercalada."
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu02.q02",
      "prompt": "Qual forma atende à enumeração simples de texto, pauta e lista, com último item ligado por e, sem intercalação?",
      "options": [
        "O grupo conferiu o texto, a pauta e a lista.",
        "O grupo, conferiu o texto a pauta e a lista.",
        "O grupo conferiu, o texto a pauta e a lista.",
        "O grupo conferiu o texto a pauta, e a lista."
      ],
      "answer": 0,
      "explanation": "Marca o limite entre os primeiros itens da enumeração fornecida.",
      "optionRationales": [
        "Marca o limite entre os primeiros itens da enumeração fornecida.",
        "Quebra sujeito/verbo e não delimita primeiros itens.",
        "Quebra verbo/primeiro complemento.",
        "Não separa os dois primeiros itens da lista pedida."
      ],
      "recoverySectionIds": [
        "lista"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu02.q03",
      "prompt": "Tratando conforme o combinado como observação intercalada delimitada por vírgulas, qual forma mantém seus dois limites?",
      "options": [
        "A turma conforme o combinado leu o roteiro.",
        "A turma, conforme o combinado leu o roteiro.",
        "A turma conforme o combinado, leu o roteiro.",
        "A turma, conforme o combinado, leu o roteiro."
      ],
      "answer": 3,
      "explanation": "As duas vírgulas delimitam a observação na organização solicitada.",
      "optionRationales": [
        "Não delimita por vírgulas a observação como foi solicitado, sem afirmar que toda outra organização é impossível.",
        "Falta o limite final.",
        "Falta o limite inicial.",
        "As duas vírgulas delimitam a observação na organização solicitada."
      ],
      "recoverySectionIds": [
        "intercalacao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu02.q04",
      "prompt": "Por que A turma, segundo o combinado, leu a nota não é o mesmo caso de A turma, leu a nota?",
      "options": [
        "Qualquer vírgula após substantivo sempre está errada.",
        "Na primeira, duas vírgulas delimitam observação; na segunda, sem observação, uma quebra o vínculo sujeito/verbo.",
        "As duas frases têm exatamente a mesma estrutura intercalada.",
        "Segundo o combinado transforma turma em verbo."
      ],
      "answer": 1,
      "explanation": "Identifica a informação inserida e os limites dela.",
      "optionRationales": [
        "A intercalação ensinada é um contraste.",
        "Identifica a informação inserida e os limites dela.",
        "A segunda não tem a observação intercalada.",
        "Turma continua substantivo no sujeito."
      ],
      "recoverySectionIds": [
        "intercalacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu02.q05",
      "prompt": "Um estudante pôs vírgula entre leu e o aviso em A equipe leu o aviso, apenas porque respirou ali. Qual retomada cabe?",
      "options": [
        "Reconhecer o vínculo verbo/complemento na ordem simples e retirar a separação indevida.",
        "Toda respiração exige vírgula.",
        "O aviso deve virar sujeito por estar após vírgula.",
        "Qualquer complemento exige vírgula antes."
      ],
      "answer": 0,
      "explanation": "Estrutura do caso simples é critério, não pausa de respiração isolada.",
      "optionRationales": [
        "Estrutura do caso simples é critério, não pausa de respiração isolada.",
        "A pausa não é regra suficiente.",
        "O grupo completa leu no exemplo.",
        "Generaliza contra o uso simples ensinado."
      ],
      "recoverySectionIds": [
        "ex-estrutura"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pu02.q06",
      "prompt": "Na frase O grupo leu a nota, o resumo e o roteiro, para que serve a vírgula do recorte?",
      "options": [
        "Separar leu de toda informação que o completa.",
        "Separar diretamente sujeito e verbo.",
        "Separar itens de uma enumeração simples.",
        "Transformar cada substantivo em uma nova oração."
      ],
      "answer": 2,
      "explanation": "A vírgula distingue nota e resumo como itens da lista.",
      "optionRationales": [
        "Não há quebra entre leu e a nota.",
        "A vírgula está dentro da enumeração de complementos.",
        "A vírgula distingue nota e resumo como itens da lista.",
        "Não cria núcleos verbais adicionais."
      ],
      "recoverySectionIds": [
        "ex-lista"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pu02.q07",
      "prompt": "Qual conclusão extrapola a aula sobre enumeração simples?",
      "options": [
        "A aula cobra lista simples com último item ligado por e.",
        "Nenhuma frase do português pode usar vírgula junto a e, independentemente do contexto.",
        "Intercalações pedidas têm limites explícitos.",
        "Sem intercalação, o sujeito não deve ser separado do verbo nos exemplos dados."
      ],
      "answer": 1,
      "explanation": "Transforma um caso delimitado em proibição universal não ensinada.",
      "optionRationales": [
        "Conserva o recorte do enunciado.",
        "Transforma um caso delimitado em proibição universal não ensinada.",
        "Conserva o critério de delimitação.",
        "Mantém a condição de ordem simples."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu02.q08",
      "prompt": "Se a intenção é manter segundo o combinado como observação delimitada, qual correção completa A equipe, segundo o combinado leu a nota?",
      "options": [
        "A equipe, segundo o combinado leu, a nota.",
        "A equipe, leu segundo o combinado a nota.",
        "A equipe segundo, o combinado leu a nota.",
        "A equipe, segundo o combinado, leu a nota."
      ],
      "answer": 3,
      "explanation": "Acrescenta o limite final da observação na estrutura solicitada.",
      "optionRationales": [
        "Não marca seu limite final e separa verbo/complemento.",
        "Não mantém a observação delimitada entre sujeito e verbo.",
        "Quebra a expressão segundo o combinado.",
        "Acrescenta o limite final da observação na estrutura solicitada."
      ],
      "recoverySectionIds": [
        "ex-intercalacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pu02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pu02.q01": [
        {
          "missionId": "draft.pu02",
          "sectionId": "estrutura"
        }
      ],
      "pu02.q02": [
        {
          "missionId": "draft.pu02",
          "sectionId": "lista"
        }
      ],
      "pu02.q03": [
        {
          "missionId": "draft.pu02",
          "sectionId": "intercalacao"
        }
      ],
      "pu02.q04": [
        {
          "missionId": "draft.pu02",
          "sectionId": "intercalacao"
        }
      ],
      "pu02.q05": [
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-estrutura"
        }
      ],
      "pu02.q06": [
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-lista"
        }
      ],
      "pu02.q07": [
        {
          "missionId": "draft.pu02",
          "sectionId": "limites"
        }
      ],
      "pu02.q08": [
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-intercalacao"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente concluído, precisão da justificativa PU-03 q5 aplicada",
  "objectives": {
    "O1": "Identificar oração, grupo e função do trecho.",
    "O2": "Aplicar a pontuação delimitada nos exemplos.",
    "O3": "Comparar estrutura e alcance sem regra universal.",
    "O4": "Retomar ensino e corrigir o vínculo ignorado."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar verbo/grupos, identificar função do trecho e justificar pontuação e alcance."
  },
  "limits": [
    "Plano05/bloco portuguese.syntax existente, após CF; BB/CAIXA históricos/referenceOnly, sem cobertura integral ou fase formal.",
    "Frases, nomes e questões são autorais/fictícios; sem instruções de casos reais ou atribuição bibliográfica fictícia.",
    "Recorte introdutório; não todas as classes de orações, sinais, vírgulas, conjunções, citações, abreviaturas ou regras estilísticas.",
    "Referências de pontuação conferidas em04/10/2026 somente nas afirmações pertinentes; página FUNAG reproduz Cunha/Cintra2003, sem autoria original atribuída à FUNAG. Exemplos e itens continuam autorais.",
    "Sem XP/ordem/runtime/push/ativação/merge/deploy/D1; revisão/Chefe não são avaliação independente ou prova de retenção."
  ]
};
export const ARITHMETIC = [];
