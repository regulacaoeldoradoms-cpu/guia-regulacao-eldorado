// Gerado por node worker/scripts/studies-pu-candidate.mjs --write. Não editar.
// Rascunhos PU locais. Desativado; sem autorização de ativação/publicação.
export const PU_MISSIONS = Object.freeze([
  {
    "id": "portuguese.syntax.punctuation.periodos",
    "topicId": "portuguese.syntax.punctuation.periodos",
    "contentVersion": 1,
    "order": 97,
    "title": "Frase, oração e período: localizar o núcleo antes do sinal",
    "shortTitle": "PU-01",
    "kind": "lesson",
    "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-punctuation-intro-r1",
      "releaseSequence": 12,
      "changeImpact": "new"
    },
    "sourceIds": [
      "pu.pu01.authorial.pu01"
    ],
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
        "id": "q.pu01.q01",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q02",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q03",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q04",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q05",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q06",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q07",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      },
      {
        "id": "q.pu01.q08",
        "topicId": "portuguese.syntax.punctuation.periodos",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "pu01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.pu01.q01": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "entrada"
          }
        ],
        "q.pu01.q02": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "locucao"
          }
        ],
        "q.pu01.q03": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "periodo"
          }
        ],
        "q.pu01.q04": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "periodo"
          }
        ],
        "q.pu01.q05": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-frase"
          }
        ],
        "q.pu01.q06": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "locucao"
          }
        ],
        "q.pu01.q07": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "oracao"
          }
        ],
        "q.pu01.q08": [
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-uma"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.pu01",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.foundation.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.punctuation.estrutura",
    "topicId": "portuguese.syntax.punctuation.estrutura",
    "contentVersion": 1,
    "order": 98,
    "title": "Vírgula: conservar grupos e delimitar intercalações",
    "shortTitle": "PU-02",
    "kind": "lesson",
    "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-punctuation-intro-r1",
      "releaseSequence": 12,
      "changeImpact": "new"
    },
    "sourceIds": [
      "pu.pu02.senado.virgula",
      "pu.pu02.funag.virgula",
      "pu.pu02.authorial.pu02"
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
          "pu.pu02.senado.virgula"
        ]
      },
      {
        "id": "lista",
        "heading": "3. Enumeração simples fornecida",
        "body": "Em A turma leu a pauta, o resumo e a proposta, os três grupos indicam o que foi lido, na enumeração simples. A vírgula separa os dois primeiros itens; e liga o último. O enunciado das questões pedirá essa enumeração com último elemento ligado por e e sem intercalações. Não transforme o exemplo em proibição universal de vírgula junto a e, pois outros contextos ficam fora.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu02.senado.virgula",
          "pu.pu02.funag.virgula"
        ]
      },
      {
        "id": "intercalacao",
        "heading": "4. Informação intercalada delimitada",
        "body": "Em A turma, segundo o combinado, leu a nota, segundo o combinado é apresentado como observação intercalada entre sujeito e verbo. As duas vírgulas marcam seus limites; a estrutura básica A turma leu a nota permanece. Não conclua que a primeira vírgula isola diretamente o sujeito do verbo nem retire apenas um dos sinais quando a intenção é conservar essa delimitação. Sem vírgulas pode haver outra organização; as questões especificam a observação delimitada.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu02.senado.virgula"
        ]
      },
      {
        "id": "ex-estrutura",
        "heading": "5. Exemplo resolvido: retirar quebra indevida",
        "body": "O enunciado pede frase em ordem simples, sem trecho intercalado. A turma cuidadosa, revisou o roteiro insere vírgula entre sujeito e verbo. Corrija para A turma cuidadosa revisou o roteiro. Não trocar por A turma cuidadosa revisou, o roteiro, pois isso separa verbo e complemento nesse caso.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu02.senado.virgula"
        ]
      },
      {
        "id": "ex-lista",
        "heading": "6. Exemplo resolvido: lista de três itens",
        "body": "Na enumeração pedida com último elemento ligado por e, escreva O grupo conferiu o texto, a pauta e a lista. A vírgula distingue os primeiros itens da lista; não vem após o sujeito O grupo nem entre conferiu e o primeiro complemento. O sinal serve à enumeração, não ao comprimento da frase.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu02.senado.virgula",
          "pu.pu02.funag.virgula"
        ]
      },
      {
        "id": "ex-intercalacao",
        "heading": "7. Exemplo resolvido: localizar os dois limites",
        "body": "Em O grupo, conforme o combinado, preparou o resumo, as vírgulas delimitam conforme o combinado. Retirando essa observação, a estrutura fica O grupo preparou o resumo. Conservar só O grupo, conforme o combinado preparou o resumo não mantém os dois limites da intercalação pretendida.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu02.senado.virgula"
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
        "id": "q.pu02.q01",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q02",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q03",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q04",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q05",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q06",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q07",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      },
      {
        "id": "q.pu02.q08",
        "topicId": "portuguese.syntax.punctuation.estrutura",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "pu02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.pu02.q01": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "estrutura"
          }
        ],
        "q.pu02.q02": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "lista"
          }
        ],
        "q.pu02.q03": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "intercalacao"
          }
        ],
        "q.pu02.q04": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "intercalacao"
          }
        ],
        "q.pu02.q05": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-estrutura"
          }
        ],
        "q.pu02.q06": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-lista"
          }
        ],
        "q.pu02.q07": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "limites"
          }
        ],
        "q.pu02.q08": [
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-intercalacao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.pu02",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.punctuation.periodos",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.punctuation.sentido",
    "topicId": "portuguese.syntax.punctuation.sentido",
    "contentVersion": 1,
    "order": 99,
    "title": "Vírgulas e sentido: chamada, explicação e restrição",
    "shortTitle": "PU-03",
    "kind": "lesson",
    "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 25,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-punctuation-intro-r1",
      "releaseSequence": 12,
      "changeImpact": "new"
    },
    "sourceIds": [
      "pu.pu03.funag.virgula",
      "pu.pu03.authorial.pu03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. O mesmo sinal pode ter funções diferentes",
        "body": "Em Colegas, a lista chegou, Colegas chama os interlocutores: é vocativo. O sujeito da oração é a lista, não a palavra da chamada. Em Lia, responsável pelo grupo, enviou a nota, o trecho responsável pelo grupo explica quem é Lia nesse contexto: aposto explicativo. Os nomes e situações são fictícios.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "vocativo",
        "heading": "2. Chamar não é ser sujeito",
        "body": "O vocativo chama ou se dirige ao interlocutor e fica separado por vírgula nos exemplos: Colegas, a pauta está disponível; A pauta, colegas, está disponível; A pauta está disponível, colegas. Se estiver no meio, duas vírgulas marcam a chamada. Compare Colegas chegaram: aqui Colegas é sujeito de chegaram, sem a chamada intercalada. A classe substantivo, sozinha, não decide a função.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "aposto",
        "heading": "3. Explicação de um termo",
        "body": "Em Lia, coordenadora do grupo, apresentou a proposta, coordenadora do grupo explica o termo Lia e é aposto explicativo, delimitado por vírgulas. O sujeito tem núcleo Lia; apresentou a proposta é predicado. Não concluir que todo nome de pessoa deve receber vírgula nem que qualquer substantivo depois de uma vírgula é aposto. O recorte cobra a explicação apresentada, não todos os tipos de aposto.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "restricao",
        "heading": "4. Uma oração pode delimitar o grupo",
        "body": "Em Os alunos que concluíram a leitura fizeram a prática, que concluíram a leitura é uma oração que caracteriza e delimita os alunos referidos. Que retoma alunos e introduz esse trecho; concluíram é verbo. Chama-se oração adjetiva restritiva nesse caso, sem as vírgulas que a isolariam como explicação. A frase não obriga a existência de alunos excluídos nem afirma quem são todos os alunos da escola: identifica o grupo pela condição apresentada.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "explicacao",
        "heading": "5. A mesma informação como explicação",
        "body": "Em Os alunos, que concluíram a leitura, fizeram a prática, o trecho entre vírgulas apresenta a conclusão da leitura como informação explicativa do conjunto de alunos referido, não como filtro para selecionar parte deles. É oração adjetiva explicativa nesse uso. A explicação é sobre o conjunto a que o texto se refere; não ampliar automaticamente para todos os alunos da escola ou do mundo. Inserir ou retirar as duas vírgulas pode alterar alcance e sentido, não apenas leitura em voz alta.",
        "type": "explanation",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "ex-chamada",
        "heading": "6. Exemplo resolvido: dois grupos distintos",
        "body": "Em Colegas, o roteiro chegou, Colegas é vocativo; o roteiro é sujeito e chegou é verbo. Retirar a chamada deixa O roteiro chegou. Não responder Colegas como sujeito só por ser substantivo na abertura.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "ex-aposto",
        "heading": "7. Exemplo resolvido: explicar o termo",
        "body": "Em Lia, integrante do grupo, revisou o resumo, integrante do grupo é explicação intercalada sobre Lia. As duas vírgulas delimitam o aposto explicativo. A estrutura básica é Lia revisou o resumo; revisou não fica separado diretamente de seu sujeito por uma vírgula sem intercalação.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "ex-alcance",
        "heading": "8. Exemplo resolvido: conferir o grupo referido",
        "body": "Compare Os colegas que leram a pauta responderam e Os colegas, que leram a pauta, responderam. A primeira identifica os colegas pela leitura; a segunda apresenta a leitura como explicação do conjunto referido. Não inferir que na primeira necessariamente há colegas que não leram; não extrapolar a segunda para todos os colegas de qualquer outro grupo. A mudança de sinais deve ser analisada junto ao contexto.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pu03.funag.virgula"
        ]
      },
      {
        "id": "limites",
        "heading": "9. Manter limites e intenção",
        "body": "Não se ensina aqui toda oração relativa, pontuação entre orações, todos os pronomes relativos ou situações de vocativo/aposto. As questões dão a leitura pretendida e os exemplos ensinados. Não transferir automaticamente vírgulas de uma chamada para um sujeito; não retirar vírgulas de uma explicação afirmando equivalência universal de sentido.",
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
        "id": "q.pu03.q01",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Em Colegas, a pauta chegou, qual é a função de Colegas no uso dado?",
        "options": [
          "Vocativo, chamando os interlocutores.",
          "Sujeito de chegou.",
          "Objeto direto de chegou.",
          "Circunstância de tempo."
        ],
        "answer": 0,
        "explanation": "A palavra dirige a mensagem aos interlocutores, sem ser sujeito da chegada.",
        "optionRationales": [
          "A palavra dirige a mensagem aos interlocutores, sem ser sujeito da chegada.",
          "O sujeito é a pauta.",
          "Não completa chegou como objeto no caso.",
          "Não indica quando aconteceu."
        ]
      },
      {
        "id": "q.pu03.q02",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Em A lista, colegas, está disponível, que grupo é sujeito da oração?",
        "options": [
          "Está disponível.",
          "Colegas.",
          "A lista.",
          "Disponível."
        ],
        "answer": 2,
        "explanation": "A declaração de disponibilidade é feita sobre A lista.",
        "optionRationales": [
          "É predicado no uso.",
          "É chamada intercalada, não sujeito.",
          "A declaração de disponibilidade é feita sobre A lista.",
          "É característica no predicado."
        ]
      },
      {
        "id": "q.pu03.q03",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Em Lia, coordenadora do grupo, apresentou o resumo, para que servem as duas vírgulas do recorte?",
        "options": [
          "Separar Lia diretamente do verbo sem nenhuma informação inserida.",
          "Delimitar a explicação coordenadora do grupo sobre Lia.",
          "Transformar coordenadora em forma verbal.",
          "Indicar dois pontos finais e dois períodos."
        ],
        "answer": 1,
        "explanation": "Aposto explicativo é delimitado no contexto dado.",
        "optionRationales": [
          "Há informação explicativa inserida entre os sinais.",
          "Aposto explicativo é delimitado no contexto dado.",
          "Coordenadora é substantivo no trecho explicativo.",
          "Vírgulas não encerram esses períodos."
        ]
      },
      {
        "id": "q.pu03.q04",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Qual leitura é ensinada para Os alunos que concluíram a leitura fizeram a prática, sem isolar o trecho com vírgulas?",
        "options": [
          "As palavras que concluíram a leitura não contêm verbo.",
          "A frase prova que todos os alunos da escola leram.",
          "A frase prova necessariamente que existem alunos que não leram.",
          "O trecho que concluíram a leitura identifica o grupo de alunos referido pela condição."
        ],
        "answer": 3,
        "explanation": "Mantém a restrição sem acrescentar informações sobre o grupo total da escola.",
        "optionRationales": [
          "Concluíram é verbo no trecho.",
          "Extrapola o conjunto referido.",
          "Restrição não obriga existência de excluídos.",
          "Mantém a restrição sem acrescentar informações sobre o grupo total da escola."
        ]
      },
      {
        "id": "q.pu03.q05",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Na leitura explicativa de Os alunos, que concluíram a leitura, fizeram a prática, o trecho entre vírgulas é apresentado como quê?",
        "options": [
          "Prova de que todos os alunos do país leram.",
          "Filtro obrigatório que exclui parte do conjunto referido.",
          "Informação sobre o conjunto de alunos referido no texto, não filtro para selecionar parte dele.",
          "Uma chamada aos alunos sem declaração sobre eles."
        ],
        "answer": 2,
        "explanation": "Conserva o alcance da explicação no contexto.",
        "optionRationales": [
          "Amplia o referente sem apoio.",
          "Transforma a explicação em filtro e acrescenta exclusão de integrantes não informada pelo texto.",
          "Conserva o alcance da explicação no contexto.",
          "O trecho tem verbo e explica o conjunto, não é vocativo."
        ]
      },
      {
        "id": "q.pu03.q06",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Por que Colegas chegaram não recebe automaticamente a vírgula de Colegas, a lista chegou?",
        "options": [
          "No primeiro, Colegas é sujeito; no segundo, é chamada aos interlocutores.",
          "Todo substantivo inicial deve ficar isolado.",
          "Chegaram não é verbo, então não importa o sujeito.",
          "As duas palavras Colegas têm obrigatoriamente a mesma função."
        ],
        "answer": 0,
        "explanation": "Classe lexical não determina sozinha função de sujeito ou vocativo.",
        "optionRationales": [
          "Classe lexical não determina sozinha função de sujeito ou vocativo.",
          "Generaliza uma chamada para qualquer substantivo.",
          "Chegaram é verbo expresso.",
          "O contexto e a estrutura mudam a função."
        ]
      },
      {
        "id": "q.pu03.q07",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Um estudante retirou as vírgulas de Os colegas, que leram a pauta, responderam e afirmou que nunca pode mudar o sentido. Qual retomada cabe?",
        "options": [
          "A versão com vírgulas vale obrigatoriamente para todos os colegas de qualquer lugar.",
          "Vírgulas só marcam respiração e nunca alcance.",
          "A versão sem vírgulas prova por si só existência de colegas excluídos.",
          "Comparar explicação do conjunto referido com restrição que identifica o grupo, antes de afirmar equivalência."
        ],
        "answer": 3,
        "explanation": "Retoma o contraste de alcance sem acrescentar conclusões não apoiadas.",
        "optionRationales": [
          "Extrapola o conjunto referido.",
          "Ignora função sintática e sentido.",
          "A restrição não prova essa existência.",
          "Retoma o contraste de alcance sem acrescentar conclusões não apoiadas."
        ]
      },
      {
        "id": "q.pu03.q08",
        "topicId": "portuguese.syntax.punctuation.sentido",
        "prompt": "Em Lia, integrante do grupo, revisou a nota, qual análise corresponde ao aposto explicativo ensinado?",
        "options": [
          "Integrante do grupo é necessariamente objeto indireto de revisou.",
          "Integrante do grupo explica Lia e fica delimitado; revisou a nota é o predicado da estrutura básica.",
          "Lia é verbo, e revisou é vocativo.",
          "A primeira vírgula mostra erro de sujeito/verbo, mesmo havendo explicação delimitada."
        ],
        "answer": 1,
        "explanation": "Segue o vínculo explicativo ao termo Lia e conserva o predicado.",
        "optionRationales": [
          "O trecho explica Lia, não completa revisou.",
          "Segue o vínculo explicativo ao termo Lia e conserva o predicado.",
          "Inverte classes/funções.",
          "Ignora a intercalação delimitada pelas duas vírgulas."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "pu03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.pu03.q01": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "vocativo"
          }
        ],
        "q.pu03.q02": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-chamada"
          }
        ],
        "q.pu03.q03": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "aposto"
          }
        ],
        "q.pu03.q04": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "restricao"
          }
        ],
        "q.pu03.q05": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "explicacao"
          }
        ],
        "q.pu03.q06": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "vocativo"
          }
        ],
        "q.pu03.q07": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-alcance"
          }
        ],
        "q.pu03.q08": [
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-aposto"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.pu03",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.punctuation.estrutura",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.punctuation.revisao",
    "topicId": "portuguese.syntax.punctuation.revisao",
    "contentVersion": 1,
    "order": 100,
    "title": "Revisão: pontuação com estrutura e alcance",
    "shortTitle": "PU-R",
    "kind": "lesson",
    "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-punctuation-intro-r1",
      "releaseSequence": 12,
      "changeImpact": "new"
    },
    "sourceIds": [
      "pu.pur.senado.virgula",
      "pu.pur.funag.virgula",
      "pu.pur.authorial.pur"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Recuperar o vínculo",
        "body": "Esta revisão aplica PU-01/02/03 em oito contextos novos. Antes de escolher, localize verbo/locução, grupos e função do trecho. Revisão com consulta não é avaliação independente nem prova de retenção.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "nucleo",
        "heading": "2. Exemplo resolvido: não contar palavras",
        "body": "Em O grupo vai revisar a nota., vai revisar é uma locução que organiza uma oração no período dado. Em O grupo leu a nota e a turma escreveu o resumo., leu/escreveu organizam duas orações no mesmo período. A ligação é decidida pela estrutura, não por contar palavras verbais isoladas.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "estrutura",
        "heading": "3. Exemplo resolvido: delimitar observação",
        "body": "Se conforme o combinado for tratado como observação intercalada delimitada, escreva A equipe, conforme o combinado, leu o roteiro. A estrutura básica é A equipe leu o roteiro. Não conservar só o sinal inicial da intercalação nem inserir outro entre leu e o roteiro.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pur.senado.virgula",
          "pu.pur.funag.virgula"
        ]
      },
      {
        "id": "sentido",
        "heading": "4. Exemplo resolvido: chamada e alcance",
        "body": "Em Colegas, a proposta chegou, Colegas é chamada e a proposta é sujeito. Em Os colegas que leram a proposta responderam, a leitura identifica o grupo referido; com o trecho entre duas vírgulas, ela é apresentada como explicação do conjunto referido. Nenhuma dessas formas obriga ampliar o referente para toda a escola.",
        "type": "worked-example",
        "sourceIds": [
          "pu.pur.funag.virgula"
        ]
      },
      {
        "id": "retomadas",
        "heading": "5. Voltar à origem do erro",
        "body": "Consulte [PU-01](pu-01-v1.md), [PU-02](pu-02-v1.md) ou [PU-03](pu-03-v1.md). Explique que vínculo uma alternativa quebra ou que informação ela acrescenta. Refaça um exemplo próximo, distinguindo contagem de oração, posição da vírgula e sentido da delimitação.",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Consulte "
              },
              {
                "text": "PU-01",
                "missionId": "portuguese.syntax.punctuation.periodos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "PU-02",
                "missionId": "portuguese.syntax.punctuation.estrutura",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " ou "
              },
              {
                "text": "PU-03",
                "missionId": "portuguese.syntax.punctuation.sentido",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": ". Explique que vínculo uma alternativa quebra ou que informação ela acrescenta. Refaça um exemplo próximo, distinguindo contagem de oração, posição da vírgula e sentido da delimitação."
              }
            ]
          }
        ]
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
        "id": "q.pur.q01",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Em A turma vai preparar a proposta., que análise segue o recorte ensinado?",
        "options": [
          "Frase sem verbo porque vai é apenas pontuação.",
          "Dois períodos porque há duas palavras verbais.",
          "Três orações porque turma, preparar e proposta são palavras diferentes.",
          "Um período com uma oração organizada pela locução vai preparar."
        ],
        "answer": 3,
        "explanation": "A locução organiza uma oração e o ponto encerra o período dado.",
        "optionRationales": [
          "Vai preparar tem formas verbais.",
          "Confunde palavra verbal e período.",
          "Palavras não contam orações mecanicamente.",
          "A locução organiza uma oração e o ponto encerra o período dado."
        ]
      },
      {
        "id": "q.pur.q02",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Qual conclusão sobre a saudação Boa noite! evita generalização pelo sinal?",
        "options": [
          "Toda exclamação corresponde a duas orações.",
          "Ela comunica algo sem verbo expresso; a exclamação não cria uma oração.",
          "Noite se torna verbo antes de exclamação.",
          "Frases só podem comunicar quando têm verbo."
        ],
        "answer": 1,
        "explanation": "Conserva a frase sem núcleo verbal expresso no caso.",
        "optionRationales": [
          "Sinal não decide essa contagem.",
          "Conserva a frase sem núcleo verbal expresso no caso.",
          "Noite é substantivo.",
          "A saudação é exemplo de frase sem verbo."
        ]
      },
      {
        "id": "q.pur.q03",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Qual frase em ordem simples, sem intercalação/inversão, conserva sujeito/verbo e verbo/complemento?",
        "options": [
          "O grupo atento conferiu a pauta.",
          "O grupo atento, conferiu a pauta.",
          "O grupo atento conferiu, a pauta.",
          "O grupo, atento conferiu a pauta."
        ],
        "answer": 0,
        "explanation": "Não quebra os grupos ligados na estrutura simples pedida.",
        "optionRationales": [
          "Não quebra os grupos ligados na estrutura simples pedida.",
          "Insere quebra sujeito/verbo.",
          "Insere quebra verbo/complemento.",
          "Não delimita uma observação intercalada; quebra o grupo simples."
        ]
      },
      {
        "id": "q.pur.q04",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Tratando segundo o combinado como observação intercalada delimitada por vírgulas, qual forma cumpre a instrução?",
        "options": [
          "A equipe segundo o combinado, revisou o texto.",
          "A equipe, segundo o combinado revisou o texto.",
          "A equipe, segundo o combinado, revisou o texto.",
          "A equipe segundo o combinado revisou o texto."
        ],
        "answer": 2,
        "explanation": "Os dois limites da observação estão marcados.",
        "optionRationales": [
          "Falta limite inicial.",
          "Falta limite final.",
          "Os dois limites da observação estão marcados.",
          "Não cumpre a delimitação por vírgulas pedida, sem afirmar impossibilidade de outra organização."
        ]
      },
      {
        "id": "q.pur.q05",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Em Colegas, o material chegou, qual análise distingue chamada e sujeito?",
        "options": [
          "Colegas é sujeito; o material é vocativo.",
          "Colegas é vocativo; o material é sujeito.",
          "Chegou é substantivo dentro do vocativo.",
          "Todo termo inicial é sujeito, mesmo em chamada."
        ],
        "answer": 1,
        "explanation": "A chegada é declarada sobre o material; Colegas dirige a mensagem.",
        "optionRationales": [
          "Troca as funções.",
          "A chegada é declarada sobre o material; Colegas dirige a mensagem.",
          "Chegou é verbo expresso.",
          "A chamada é contraste à regra falsa."
        ]
      },
      {
        "id": "q.pur.q06",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Compare O grupo leu a nota. A turma escreveu o resumo. com O grupo leu a nota e a turma escreveu o resumo. Qual distinção é ensinada?",
        "options": [
          "Leu e escreveu sempre formam uma única locução.",
          "Os dois trechos obrigatoriamente têm três períodos.",
          "O segundo não tem oração por conter e.",
          "O primeiro trecho tem dois períodos; o segundo reúne duas orações em um período."
        ],
        "answer": 3,
        "explanation": "A organização escrita e os núcleos expressos distinguem os casos.",
        "optionRationales": [
          "Os verbos pertencem a orações com sujeitos distintos.",
          "Não há os três encerramentos indicados.",
          "E liga as orações.",
          "A organização escrita e os núcleos expressos distinguem os casos."
        ]
      },
      {
        "id": "q.pur.q07",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Na enumeração simples de pauta, lista e resumo com último item ligado por e, qual escrita corresponde ao modelo?",
        "options": [
          "A turma conferiu, a pauta a lista e o resumo.",
          "A turma, conferiu a pauta a lista e o resumo.",
          "A turma conferiu a pauta, a lista e o resumo.",
          "A turma conferiu a pauta a lista, e o resumo."
        ],
        "answer": 2,
        "explanation": "A vírgula separa os primeiros itens da lista solicitada.",
        "optionRationales": [
          "Quebra verbo/primeiro complemento.",
          "Quebra sujeito/verbo e não separa os primeiros itens.",
          "A vírgula separa os primeiros itens da lista solicitada.",
          "Não separa pauta e lista como itens no modelo pedido."
        ]
      },
      {
        "id": "q.pur.q08",
        "topicId": "portuguese.syntax.punctuation.revisao",
        "prompt": "Um estudante diz que Os alunos que leram a pauta responderam prova necessariamente a existência de alunos que não leram. Qual retomada corrige?",
        "options": [
          "A restrição identifica o grupo referido, sem obrigar a existência de excluídos.",
          "Toda restrição afirma que existe pelo menos um excluído.",
          "Retirar vírgulas sempre torna toda informação falsa.",
          "A frase fala de todos os alunos do país."
        ],
        "answer": 0,
        "explanation": "Não acrescenta existência ou universo não dados.",
        "optionRationales": [
          "Não acrescenta existência ou universo não dados.",
          "Generaliza além do alcance da construção.",
          "Pontuação não é uma regra de falsidade universal.",
          "Amplia o referente sem apoio."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "pur-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.pur.q01": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "nucleo"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-uma"
          }
        ],
        "q.pur.q02": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "nucleo"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-frase"
          }
        ],
        "q.pur.q03": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "estrutura"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-estrutura"
          }
        ],
        "q.pur.q04": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "estrutura"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-intercalacao"
          }
        ],
        "q.pur.q05": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "sentido"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-chamada"
          }
        ],
        "q.pur.q06": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "nucleo"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "periodo"
          }
        ],
        "q.pur.q07": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "estrutura"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-lista"
          }
        ],
        "q.pur.q08": [
          {
            "missionId": "portuguese.syntax.punctuation.revisao",
            "sectionId": "sentido"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "restricao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.pur",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.punctuation.sentido",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.syntax.punctuation.boss",
    "topicId": "portuguese.syntax.punctuation.boss",
    "contentVersion": 1,
    "order": 101,
    "title": "Chefe: escolher sinais pela estrutura e pelo alcance",
    "shortTitle": "PU-CHEFE",
    "kind": "boss",
    "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "syntax-punctuation-intro-r1",
      "releaseSequence": 12,
      "changeImpact": "new"
    },
    "sourceIds": [
      "pu.puchefe.senado.virgula",
      "pu.puchefe.funag.virgula",
      "pu.puchefe.authorial.puchefe"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Desafio do recorte",
        "body": "Doze itens próprios aplicam os contextos ensinados em PU-01/02/03. As hipóteses de ordem simples, enumeração e intercalação são explicitadas. Não pressupõem todos os usos de vírgula ou avaliação independente de prontidão.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "nucleos",
        "heading": "2. Verbo, locução e encerramento",
        "body": "Vai ler e vai revisar são locuções de uma oração nos exemplos. Leu e escreveu com sujeitos expressos organizam duas orações. Um período pode reunir as duas; dois pontos finais de encerramento nos exemplos simples separam dois períodos. Uma saudação sem verbo não ganha oração pelo sinal final.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "estrutura",
        "heading": "3. Preservar grupos",
        "body": "Sem inversão/intercalação, não separar sujeito de verbo nem verbo de complemento nos casos simples. Na lista dada de três itens com último ligado por e, a vírgula separa os primeiros itens. Uma regra de pausa ou comprimento não substitui análise de vínculos.",
        "type": "explanation",
        "sourceIds": [
          "pu.puchefe.senado.virgula",
          "pu.puchefe.funag.virgula"
        ]
      },
      {
        "id": "intercalacao",
        "heading": "4. Exemplo resolvido: dois limites",
        "body": "Com a instrução de tratar conforme o combinado como observação delimitada, A equipe, conforme o combinado, conferiu o texto tem duas vírgulas na intercalação. A equipe conferiu o texto é a estrutura básica. Não confundir esse caso com uma vírgula isolada entre sujeito/verbo sem informação inserida.",
        "type": "worked-example",
        "sourceIds": [
          "pu.puchefe.senado.virgula"
        ]
      },
      {
        "id": "funcao",
        "heading": "5. Chamada e explicação",
        "body": "Colegas em Colegas, a lista chegou é vocativo; a lista é sujeito. Em Lia, responsável pelo grupo, enviou o resumo, responsável pelo grupo explica Lia e fica delimitado como aposto explicativo. Não transferir vírgulas da chamada para todo substantivo inicial.",
        "type": "explanation",
        "sourceIds": [
          "pu.puchefe.funag.virgula"
        ]
      },
      {
        "id": "alcance",
        "heading": "6. Grupo referido e informação acrescentada",
        "body": "Os alunos que leram o texto responderam identifica os alunos pela condição da leitura, sem garantir existência de excluídos. Os alunos, que leram o texto, responderam apresenta a leitura como explicação do conjunto referido. Não ampliar qualquer construção para todos os alunos de outros grupos nem afirmar que trocar os sinais nunca altera sentido.",
        "type": "explanation",
        "sourceIds": [
          "pu.puchefe.funag.virgula"
        ]
      },
      {
        "id": "retomadas",
        "heading": "7. Recuperar sem repetir a mesma inferência",
        "body": "Consulte [PU-01](pu-01-v1.md), [PU-02](pu-02-v1.md), [PU-03](pu-03-v1.md) ou a [revisão](pu-r-v1.md). Identifique o vínculo/sinal/alcance ignorado e refaça uma frase equivalente ao caso ensinado. Acerto com consulta não mede sozinho retenção futura.",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "Consulte "
              },
              {
                "text": "PU-01",
                "missionId": "portuguese.syntax.punctuation.periodos",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "PU-02",
                "missionId": "portuguese.syntax.punctuation.estrutura",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": ", "
              },
              {
                "text": "PU-03",
                "missionId": "portuguese.syntax.punctuation.sentido",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " ou a "
              },
              {
                "text": "revisão",
                "missionId": "portuguese.syntax.punctuation.revisao",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": ". Identifique o vínculo/sinal/alcance ignorado e refaça uma frase equivalente ao caso ensinado. Acerto com consulta não mede sozinho retenção futura."
              }
            ]
          }
        ]
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
        "id": "q.puchefe.q01",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Na frase O grupo vai revisar a pauta., qual análise conserva a unidade verbal ensinada?",
        "options": [
          "Cada palavra forma uma oração independente.",
          "Vai revisar forma uma locução e organiza uma oração no período dado.",
          "Vai revisar são dois períodos sem sinal final.",
          "A frase não contém forma verbal."
        ],
        "answer": 1,
        "explanation": "As formas integram uma locução no contexto.",
        "optionRationales": [
          "Não se contam orações por palavra.",
          "As formas integram uma locução no contexto.",
          "Palavras verbais não são períodos.",
          "Há locução verbal expressa."
        ]
      },
      {
        "id": "q.puchefe.q02",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Que afirmação sobre Bom dia! acrescenta algo que o sinal de exclamação não prova?",
        "options": [
          "A frase não contém locução verbal expressa.",
          "A saudação pode comunicar sem verbo expresso.",
          "Dia é substantivo no uso dado.",
          "A saudação tem necessariamente uma oração só por terminar com exclamação."
        ],
        "answer": 3,
        "explanation": "O sinal não cria núcleo verbal na saudação.",
        "optionRationales": [
          "Conserva a estrutura escrita.",
          "É o caso ensinado de frase sem verbo.",
          "Não transforma a palavra em verbo.",
          "O sinal não cria núcleo verbal na saudação."
        ]
      },
      {
        "id": "q.puchefe.q03",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Em A equipe leu a proposta e a turma escreveu a síntese., que contagem corresponde ao recorte?",
        "options": [
          "Duas orações em um período.",
          "Um período sem oração.",
          "Duas orações em três períodos.",
          "Uma única locução feita por leu e escreveu."
        ],
        "answer": 0,
        "explanation": "Dois núcleos com sujeitos expressos aparecem no mesmo período encerrado.",
        "optionRationales": [
          "Dois núcleos com sujeitos expressos aparecem no mesmo período encerrado.",
          "Há verbos nas duas partes.",
          "Há um só encerramento do período dado.",
          "Os verbos organizam orações distintas."
        ]
      },
      {
        "id": "q.puchefe.q04",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Compare A turma leu a pauta. O grupo preparou a nota. com A turma leu a pauta e o grupo preparou a nota. Que diferença é apoiada?",
        "options": [
          "No segundo, e elimina os verbos expressos.",
          "Nenhum período no primeiro por haver duas frases.",
          "Dois períodos no primeiro trecho; um período com duas orações no segundo.",
          "Os dois trechos têm necessariamente quatro períodos."
        ],
        "answer": 2,
        "explanation": "A disposição dos encerramentos e núcleos conserva a distinção.",
        "optionRationales": [
          "E liga, não elimina, orações.",
          "As frases com verbos e encerramentos são períodos no recorte.",
          "A disposição dos encerramentos e núcleos conserva a distinção.",
          "Não há os quatro encerramentos alegados."
        ]
      },
      {
        "id": "q.puchefe.q05",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Sem inversão nem termo intercalado, qual escrita conserva os vínculos simples ensinados?",
        "options": [
          "A turma atenta leu, a nota.",
          "A turma atenta, leu a nota.",
          "A turma atenta leu a nota.",
          "A turma, atenta leu a nota."
        ],
        "answer": 2,
        "explanation": "Conserva grupo de sujeito e verbo/complemento sem quebra indevida.",
        "optionRationales": [
          "Insere quebra verbo/complemento.",
          "Insere quebra sujeito/verbo.",
          "Conserva grupo de sujeito e verbo/complemento sem quebra indevida.",
          "Não delimita observação; interrompe o grupo simples."
        ]
      },
      {
        "id": "q.puchefe.q06",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Para enumerar texto, pauta e proposta, com último item ligado por e e sem intercalação, qual escrita atende ao modelo?",
        "options": [
          "O grupo revisou o texto, a pauta e a proposta.",
          "O grupo, revisou o texto a pauta e a proposta.",
          "O grupo revisou, o texto a pauta e a proposta.",
          "O grupo revisou o texto a pauta, e a proposta."
        ],
        "answer": 0,
        "explanation": "Distingue os primeiros itens na enumeração pedida.",
        "optionRationales": [
          "Distingue os primeiros itens na enumeração pedida.",
          "Quebra sujeito/verbo e omite limite entre primeiros itens.",
          "Separa verbo de primeiro complemento.",
          "Não separa texto e pauta como pede a lista simples."
        ]
      },
      {
        "id": "q.puchefe.q07",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Tratando segundo o combinado como observação intercalada delimitada por vírgulas, qual forma preserva os dois limites?",
        "options": [
          "A equipe segundo o combinado preparou o roteiro.",
          "A equipe, segundo o combinado preparou o roteiro.",
          "A equipe segundo o combinado, preparou o roteiro.",
          "A equipe, segundo o combinado, preparou o roteiro."
        ],
        "answer": 3,
        "explanation": "Marca início e fim da intercalação na organização solicitada.",
        "optionRationales": [
          "Não marca a delimitação por vírgulas pedida, sem declarar toda outra organização impossível.",
          "Omite limite final.",
          "Omite limite inicial.",
          "Marca início e fim da intercalação na organização solicitada."
        ]
      },
      {
        "id": "q.puchefe.q08",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Qual análise distingue A turma, conforme o combinado, leu a nota de A turma, leu a nota no caso simples?",
        "options": [
          "Todas as vírgulas após turma são sempre incorretas.",
          "A primeira delimita observação; a segunda quebra diretamente sujeito/verbo sem essa observação.",
          "As duas têm exatamente a mesma intercalação.",
          "Conforme o combinado é locução verbal que substitui leu."
        ],
        "answer": 1,
        "explanation": "Identifica o conteúdo inserido e seus limites.",
        "optionRationales": [
          "Generaliza contra o caso intercalado.",
          "Identifica o conteúdo inserido e seus limites.",
          "A segunda não tem o trecho explicativo dado.",
          "A expressão não substitui o verbo leu como locução."
        ]
      },
      {
        "id": "q.puchefe.q09",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Em Colegas, o resumo chegou, qual distinção está ensinada?",
        "options": [
          "Colegas chama os interlocutores; o resumo é sujeito de chegou.",
          "Colegas é sujeito de chegou; resumo é verbo.",
          "O resumo é vocativo por vir após a vírgula.",
          "Todo substantivo inicial é sujeito em qualquer contexto."
        ],
        "answer": 0,
        "explanation": "O vocativo não é sujeito da chegada no exemplo.",
        "optionRationales": [
          "O vocativo não é sujeito da chegada no exemplo.",
          "O sujeito é o resumo, e chegou é verbo.",
          "É o grupo de que se declara a chegada.",
          "A chamada mostra limite da generalização."
        ]
      },
      {
        "id": "q.puchefe.q10",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Em Lia, integrante do grupo, revisou a proposta, para que servem as duas vírgulas no recorte?",
        "options": [
          "Separar revisou de todo complemento.",
          "Marcar dois períodos sem verbos.",
          "Delimitar o aposto explicativo integrante do grupo sobre Lia.",
          "Transformar integrante em verbo de futuro."
        ],
        "answer": 2,
        "explanation": "O trecho explica o termo Lia e está delimitado.",
        "optionRationales": [
          "Não estão entre revisou e a proposta.",
          "Não encerram períodos no caso.",
          "O trecho explica o termo Lia e está delimitado.",
          "Integrante nomeia a condição de Lia como substantivo."
        ]
      },
      {
        "id": "q.puchefe.q11",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Qual conclusão é defensável para Os alunos que concluíram a leitura fizeram a prática, na leitura restritiva ensinada?",
        "options": [
          "A frase obriga que pelo menos um aluno tenha sido excluído.",
          "A condição identifica os alunos referidos, sem obrigar existência de outros alunos excluídos.",
          "Todos os alunos de qualquer escola obrigatoriamente concluíram a leitura.",
          "A construção não contém verbo no trecho que concluíram a leitura."
        ],
        "answer": 1,
        "explanation": "Mantém a restrição sem acrescentar existência ou universo.",
        "optionRationales": [
          "O valor restritivo não garante essa existência.",
          "Mantém a restrição sem acrescentar existência ou universo.",
          "Extrapola o conjunto referido.",
          "Concluíram é verbo nesse trecho."
        ]
      },
      {
        "id": "q.puchefe.q12",
        "topicId": "portuguese.syntax.punctuation.boss",
        "prompt": "Ao pôr o trecho entre duas vírgulas em Os alunos, que leram a pauta, responderam, qual interpretação conserva a explicação ensinada?",
        "options": [
          "O sentido nunca pode mudar quando se retiram essas vírgulas.",
          "As vírgulas sempre garantem leitura de todos os alunos do país.",
          "O trecho passa a ser chamada sem declarar algo sobre alunos.",
          "A leitura é apresentada como informação do conjunto referido, não como filtro para selecionar parte dele."
        ],
        "answer": 3,
        "explanation": "Conserva o alcance explicativo do referente contextual.",
        "optionRationales": [
          "O contraste com restrição pode alterar alcance.",
          "Amplia o universo sem apoio.",
          "A oração acrescenta informação, não é vocativo.",
          "Conserva o alcance explicativo do referente contextual."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "puchefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.puchefe.q01": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "nucleos"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "locucao"
          }
        ],
        "q.puchefe.q02": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "nucleos"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-frase"
          }
        ],
        "q.puchefe.q03": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "nucleos"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "ex-duas"
          }
        ],
        "q.puchefe.q04": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "nucleos"
          },
          {
            "missionId": "portuguese.syntax.punctuation.periodos",
            "sectionId": "periodo"
          }
        ],
        "q.puchefe.q05": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "estrutura"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-estrutura"
          }
        ],
        "q.puchefe.q06": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "estrutura"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-lista"
          }
        ],
        "q.puchefe.q07": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "intercalacao"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "ex-intercalacao"
          }
        ],
        "q.puchefe.q08": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "intercalacao"
          },
          {
            "missionId": "portuguese.syntax.punctuation.estrutura",
            "sectionId": "intercalacao"
          }
        ],
        "q.puchefe.q09": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "funcao"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-chamada"
          }
        ],
        "q.puchefe.q10": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "funcao"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "ex-aposto"
          }
        ],
        "q.puchefe.q11": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "alcance"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "restricao"
          }
        ],
        "q.puchefe.q12": [
          {
            "missionId": "portuguese.syntax.punctuation.boss",
            "sectionId": "alcance"
          },
          {
            "missionId": "portuguese.syntax.punctuation.sentido",
            "sectionId": "explicacao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.puchefe",
      "blockId": "portuguese.syntax",
      "prerequisiteId": "portuguese.syntax.punctuation.revisao",
      "parametersApproved": false
    }
  }
]);
export const PU_SOURCES = Object.freeze([
  {
    "id": "pu.pu01.authorial.pu01",
    "label": "Material autoral da Missão Bancária — PU-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/pu-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "pu.pu02.senado.virgula",
    "label": "Senado Federal — Manual de Comunicação: vírgula",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/virgula",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Não separe; Use vírgula: enumeração, termos explicativos/deslocados; ressalva de adjunto curto"
  },
  {
    "id": "pu.pu02.funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  },
  {
    "id": "pu.pu02.authorial.pu02",
    "label": "Material autoral da Missão Bancária — PU-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/pu-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "pu.pu03.funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  },
  {
    "id": "pu.pu03.authorial.pu03",
    "label": "Material autoral da Missão Bancária — PU-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/pu-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "pu.pur.senado.virgula",
    "label": "Senado Federal — Manual de Comunicação: vírgula",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/virgula",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Não separe; Use vírgula: enumeração, termos explicativos/deslocados; ressalva de adjunto curto"
  },
  {
    "id": "pu.pur.funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  },
  {
    "id": "pu.pur.authorial.pur",
    "label": "Material autoral da Missão Bancária — PU-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/pu-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "pu.puchefe.senado.virgula",
    "label": "Senado Federal — Manual de Comunicação: vírgula",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/virgula",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Não separe; Use vírgula: enumeração, termos explicativos/deslocados; ressalva de adjunto curto"
  },
  {
    "id": "pu.puchefe.funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  },
  {
    "id": "pu.puchefe.authorial.puchefe",
    "label": "Material autoral da Missão Bancária — PU-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/pu-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
