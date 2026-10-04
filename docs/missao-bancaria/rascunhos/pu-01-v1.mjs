// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [];
export const PU01_DRAFT = {
  "id": "draft.pu01",
  "topicId": "draft.pu01",
  "editorialKey": "PU-01",
  "candidateBlockId": "portuguese.syntax",
  "title": "Frase, oração e período: localizar o núcleo antes do sinal",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Pontuar começa pela leitura",
      "body": "Compare Bom dia! e O grupo leu a nota. Ambas comunicam algo em uma situação; a segunda contém verbo expresso. Frase pode comunicar sem verbo, como a saudação dada. Oração organiza-se em torno de verbo ou locução verbal. Não concluir que todo ponto de exclamação garante uma oração.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "oracao",
      "heading": "2. Verbo e oração nos casos simples",
      "body": "Em A turma leu o texto, leu é verbo e a frase tem uma oração. Em O grupo revisou a pauta, revisou organiza uma oração. Os grupos de sujeito/predicado/complemento foram introduzidos em CF. Aqui não se cobram orações reduzidas, verbos omitidos ou análise completa de coordenação/subordinação.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "locucao",
      "heading": "3. Dois verbos podem formar uma locução",
      "body": "Em A turma vai ler o roteiro, vai ler forma uma locução verbal: vai funciona como auxiliar e ler é a forma principal no infinitivo, nome da forma não flexionada por pessoa neste exemplo. Essa combinação organiza uma oração, não duas apenas por ter duas palavras verbais. Compare com A turma leu a nota e o grupo preparou o resumo: leu e preparou organizam duas orações, com sujeitos expressos. E liga essas orações; não se ensina toda classificação de conectivos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "periodo",
      "heading": "4. Períodos nos exemplos escritos",
      "body": "Um período, neste recorte, é uma frase formada por uma ou mais orações e encerrada por sinal final. O grupo leu a nota. tem um período com uma oração. O grupo leu a nota e a turma preparou o resumo. tem um período com duas orações. O grupo leu a nota. A turma preparou o resumo. apresenta dois períodos, cada um com uma oração. A saudação sem verbo não será contada como período composto de orações. Não conte abreviaturas, citações ou pontos decimais como se fossem sinais finais do recorte.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-uma",
      "heading": "5. Exemplo resolvido: núcleo único",
      "body": "Em A equipe vai revisar o texto., vai revisar é locução verbal que organiza uma oração. A equipe é sujeito; o texto completa a locução vai revisar no uso apresentado. A frase escrita termina com ponto final: um período com uma oração. O número de palavras não cria novas orações.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-duas",
      "heading": "6. Exemplo resolvido: dois núcleos",
      "body": "Em O grupo leu a pauta e a turma preparou a proposta., identifique leu e preparou; cada um organiza uma oração com sujeito expresso. O ponto final encerra um período que reúne as duas. Não confundir duas orações com dois períodos quando o enunciado só tem um sinal final de encerramento.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-frase",
      "heading": "7. Exemplo resolvido: frase sem verbo",
      "body": "No cumprimento Boa tarde!, a saudação comunica algo em situação apropriada, mas não contém verbo expresso nem locução. É frase, não uma oração neste caso. O sinal de exclamação não acrescenta um verbo à escrita.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. O que não contar mecanicamente",
      "body": "Duas palavras verbais podem formar uma locução; uma única frase pode reunir duas orações; uma saudação pode ser frase sem oração. Não usar quantidade de palavras, vírgulas ou pausas para decidir. Os próximos usos de vírgula dependem dos grupos e dos sentidos, não só da contagem de orações.",
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
      "id": "pu01.q01",
      "prompt": "Qual enunciado é frase sem verbo expresso, no recorte ensinado?",
      "options": [
        "A turma leu.",
        "Boa tarde!",
        "O grupo vai ler.",
        "A equipe revisou o texto."
      ],
      "answer": 1,
      "explanation": "A saudação comunica algo sem verbo ou locução expressos.",
      "optionRationales": [
        "Leu é verbo.",
        "A saudação comunica algo sem verbo ou locução expressos.",
        "Vai ler é locução verbal.",
        "Revisou é verbo."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pu01.q02",
      "prompt": "Em A turma vai ler o resumo, por que não se contam duas orações apenas pelas palavras vai e ler?",
      "options": [
        "Uma frase com auxiliar não pode conter oração.",
        "Toda palavra da frase corresponde a uma oração.",
        "Vai é substantivo e ler é adjetivo.",
        "Vai ler constitui uma locução que organiza uma oração nesse uso."
      ],
      "answer": 3,
      "explanation": "A locução tem unidade verbal no exemplo.",
      "optionRationales": [
        "A locução organiza uma oração.",
        "A contagem não é por palavra.",
        "São formas verbais no uso dado.",
        "A locução tem unidade verbal no exemplo."
      ],
      "recoverySectionIds": [
        "locucao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu01.q03",
      "prompt": "Em A equipe leu a nota e o grupo preparou o resumo., quantas orações e períodos há no recorte?",
      "options": [
        "Duas orações em dois períodos.",
        "Uma oração em dois períodos.",
        "Duas orações em um período.",
        "Nenhuma oração, por haver e."
      ],
      "answer": 2,
      "explanation": "Leu/preparou organizam duas orações no mesmo período encerrado pelo ponto.",
      "optionRationales": [
        "Há um único encerramento do período.",
        "Inverte as contagens.",
        "Leu/preparou organizam duas orações no mesmo período encerrado pelo ponto.",
        "E liga as orações, sem eliminá-las."
      ],
      "recoverySectionIds": [
        "periodo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu01.q04",
      "prompt": "Em A equipe leu. O grupo preparou a pauta., como se distribuem os casos ensinados?",
      "options": [
        "Dois períodos, cada um com uma oração.",
        "Um período sem oração.",
        "Uma locução formada por leu e preparou.",
        "Três períodos por haver palavras diferentes."
      ],
      "answer": 0,
      "explanation": "Cada ponto final encerra uma oração em seu período no trecho dado.",
      "optionRationales": [
        "Cada ponto final encerra uma oração em seu período no trecho dado.",
        "Há dois verbos e dois encerramentos.",
        "Os verbos pertencem a frases separadas, não à mesma locução.",
        "Quantidade de palavras não conta períodos."
      ],
      "recoverySectionIds": [
        "periodo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu01.q05",
      "prompt": "Por que a exclamação em Bom dia! não prova existência de oração?",
      "options": [
        "Dia passa a ser verbo por vir antes de exclamação.",
        "Todo sinal final funciona como verbo auxiliar.",
        "O sinal final não acrescenta verbo à saudação sem verbo expresso.",
        "Toda saudação é uma locução verbal."
      ],
      "answer": 2,
      "explanation": "Estrutura verbal e sinal final são verificações distintas.",
      "optionRationales": [
        "Dia continua substantivo.",
        "Sinal não é palavra verbal.",
        "Estrutura verbal e sinal final são verificações distintas.",
        "A saudação dada não tem locução."
      ],
      "recoverySectionIds": [
        "ex-frase"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu01.q06",
      "prompt": "Qual comparação diferencia locução de dois núcleos verbais separados nos exemplos?",
      "options": [
        "Vai revisar é uma locução; leu e preparou, em duas orações com sujeitos expressos, são dois núcleos.",
        "Qualquer par de verbos sempre forma locução.",
        "Qualquer par de verbos sempre forma duas orações.",
        "Um sinal final elimina toda forma verbal."
      ],
      "answer": 0,
      "explanation": "Usa o vínculo dos verbos e a estrutura fornecida.",
      "optionRationales": [
        "Usa o vínculo dos verbos e a estrutura fornecida.",
        "O exemplo com sujeitos distintos é contraste.",
        "Vai revisar mostra uma locução única.",
        "O sinal encerra a escrita, não apaga verbos."
      ],
      "recoverySectionIds": [
        "locucao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu01.q07",
      "prompt": "Um estudante contou cinco orações em A turma leu o texto por haver cinco palavras. Qual retomada é adequada?",
      "options": [
        "Excluir leu porque só substantivos organizam orações.",
        "Contar letras em vez de palavras.",
        "Acrescentar vírgula após cada palavra para criar orações.",
        "Localizar leu como verbo que organiza uma oração nesse caso."
      ],
      "answer": 3,
      "explanation": "Retoma o núcleo verbal, sem contagem mecânica de palavras.",
      "optionRationales": [
        "Leu é verbo expresso.",
        "Letras também não contam orações.",
        "Vírgulas não tornam cada palavra uma oração.",
        "Retoma o núcleo verbal, sem contagem mecânica de palavras."
      ],
      "recoverySectionIds": [
        "oracao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pu01.q08",
      "prompt": "A frase A equipe vai preparar o roteiro. exemplifica qual combinação ensinada?",
      "options": [
        "Dois períodos porque há vai e preparar.",
        "Um período com uma oração organizada por vai preparar.",
        "Uma frase sem verbo, só com substantivos.",
        "Três orações por haver equipe, vai e roteiro."
      ],
      "answer": 1,
      "explanation": "A locução integra uma oração e o ponto encerra um período.",
      "optionRationales": [
        "Confunde palavras verbais com períodos.",
        "A locução integra uma oração e o ponto encerra um período.",
        "Vai preparar é locução verbal.",
        "Substantivos não criam essas orações."
      ],
      "recoverySectionIds": [
        "ex-uma"
      ],
      "objectiveIds": [
        "O2"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pu01-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pu01.q01": [
        {
          "missionId": "draft.pu01",
          "sectionId": "entrada"
        }
      ],
      "pu01.q02": [
        {
          "missionId": "draft.pu01",
          "sectionId": "locucao"
        }
      ],
      "pu01.q03": [
        {
          "missionId": "draft.pu01",
          "sectionId": "periodo"
        }
      ],
      "pu01.q04": [
        {
          "missionId": "draft.pu01",
          "sectionId": "periodo"
        }
      ],
      "pu01.q05": [
        {
          "missionId": "draft.pu01",
          "sectionId": "ex-frase"
        }
      ],
      "pu01.q06": [
        {
          "missionId": "draft.pu01",
          "sectionId": "locucao"
        }
      ],
      "pu01.q07": [
        {
          "missionId": "draft.pu01",
          "sectionId": "oracao"
        }
      ],
      "pu01.q08": [
        {
          "missionId": "draft.pu01",
          "sectionId": "ex-uma"
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
