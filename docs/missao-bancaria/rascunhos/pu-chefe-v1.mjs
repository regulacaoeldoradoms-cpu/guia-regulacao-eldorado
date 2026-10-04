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
export const PUCHEFE_DRAFT = {
  "id": "draft.puchefe",
  "topicId": "draft.puchefe",
  "editorialKey": "PU-CHEFE",
  "candidateBlockId": "portuguese.syntax",
  "title": "Chefe: escolher sinais pela estrutura e pelo alcance",
  "contentVersion": 1,
  "kind": "boss",
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
        "senado.virgula",
        "funag.virgula"
      ]
    },
    {
      "id": "intercalacao",
      "heading": "4. Exemplo resolvido: dois limites",
      "body": "Com a instrução de tratar conforme o combinado como observação delimitada, A equipe, conforme o combinado, conferiu o texto tem duas vírgulas na intercalação. A equipe conferiu o texto é a estrutura básica. Não confundir esse caso com uma vírgula isolada entre sujeito/verbo sem informação inserida.",
      "type": "worked-example",
      "sourceIds": [
        "senado.virgula"
      ]
    },
    {
      "id": "funcao",
      "heading": "5. Chamada e explicação",
      "body": "Colegas em Colegas, a lista chegou é vocativo; a lista é sujeito. Em Lia, responsável pelo grupo, enviou o resumo, responsável pelo grupo explica Lia e fica delimitado como aposto explicativo. Não transferir vírgulas da chamada para todo substantivo inicial.",
      "type": "explanation",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "alcance",
      "heading": "6. Grupo referido e informação acrescentada",
      "body": "Os alunos que leram o texto responderam identifica os alunos pela condição da leitura, sem garantir existência de excluídos. Os alunos, que leram o texto, responderam apresenta a leitura como explicação do conjunto referido. Não ampliar qualquer construção para todos os alunos de outros grupos nem afirmar que trocar os sinais nunca altera sentido.",
      "type": "explanation",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "retomadas",
      "heading": "7. Recuperar sem repetir a mesma inferência",
      "body": "Consulte [PU-01](pu-01-v1.md), [PU-02](pu-02-v1.md), [PU-03](pu-03-v1.md) ou a [revisão](pu-r-v1.md). Identifique o vínculo/sinal/alcance ignorado e refaça uma frase equivalente ao caso ensinado. Acerto com consulta não mede sozinho retenção futura.",
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
      "id": "puchefe.q01",
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
      ],
      "recoverySectionIds": [
        "nucleos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "locucao"
        }
      ],
      "groupId": "oracao-locucao"
    },
    {
      "id": "puchefe.q02",
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
      ],
      "recoverySectionIds": [
        "nucleos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "ex-frase"
        }
      ],
      "groupId": "oracao-locucao"
    },
    {
      "id": "puchefe.q03",
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
      ],
      "recoverySectionIds": [
        "nucleos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "ex-duas"
        }
      ],
      "groupId": "periodos"
    },
    {
      "id": "puchefe.q04",
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
      ],
      "recoverySectionIds": [
        "nucleos"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu01",
          "sectionId": "periodo"
        }
      ],
      "groupId": "periodos"
    },
    {
      "id": "puchefe.q05",
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
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-estrutura"
        }
      ],
      "groupId": "estrutura-lista"
    },
    {
      "id": "puchefe.q06",
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
      ],
      "recoverySectionIds": [
        "estrutura"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-lista"
        }
      ],
      "groupId": "estrutura-lista"
    },
    {
      "id": "puchefe.q07",
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
      ],
      "recoverySectionIds": [
        "intercalacao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "ex-intercalacao"
        }
      ],
      "groupId": "intercalacao"
    },
    {
      "id": "puchefe.q08",
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
      ],
      "recoverySectionIds": [
        "intercalacao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu02",
          "sectionId": "intercalacao"
        }
      ],
      "groupId": "intercalacao"
    },
    {
      "id": "puchefe.q09",
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
      ],
      "recoverySectionIds": [
        "funcao"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "ex-chamada"
        }
      ],
      "groupId": "chamada-aposto"
    },
    {
      "id": "puchefe.q10",
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
      ],
      "recoverySectionIds": [
        "funcao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "ex-aposto"
        }
      ],
      "groupId": "chamada-aposto"
    },
    {
      "id": "puchefe.q11",
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
      ],
      "recoverySectionIds": [
        "alcance"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "restricao"
        }
      ],
      "groupId": "restricao-explicacao"
    },
    {
      "id": "puchefe.q12",
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
      ],
      "recoverySectionIds": [
        "alcance"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "pu03",
          "sectionId": "explicacao"
        }
      ],
      "groupId": "restricao-explicacao"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "puchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "puchefe.q01": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "nucleos"
        },
        {
          "missionId": "draft.pu01",
          "sectionId": "locucao"
        }
      ],
      "puchefe.q02": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "nucleos"
        },
        {
          "missionId": "draft.pu01",
          "sectionId": "ex-frase"
        }
      ],
      "puchefe.q03": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "nucleos"
        },
        {
          "missionId": "draft.pu01",
          "sectionId": "ex-duas"
        }
      ],
      "puchefe.q04": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "nucleos"
        },
        {
          "missionId": "draft.pu01",
          "sectionId": "periodo"
        }
      ],
      "puchefe.q05": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "estrutura"
        },
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-estrutura"
        }
      ],
      "puchefe.q06": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "estrutura"
        },
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-lista"
        }
      ],
      "puchefe.q07": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "intercalacao"
        },
        {
          "missionId": "draft.pu02",
          "sectionId": "ex-intercalacao"
        }
      ],
      "puchefe.q08": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "intercalacao"
        },
        {
          "missionId": "draft.pu02",
          "sectionId": "intercalacao"
        }
      ],
      "puchefe.q09": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "funcao"
        },
        {
          "missionId": "draft.pu03",
          "sectionId": "ex-chamada"
        }
      ],
      "puchefe.q10": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "funcao"
        },
        {
          "missionId": "draft.pu03",
          "sectionId": "ex-aposto"
        }
      ],
      "puchefe.q11": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "alcance"
        },
        {
          "missionId": "draft.pu03",
          "sectionId": "restricao"
        }
      ],
      "puchefe.q12": [
        {
          "missionId": "draft.puchefe",
          "sectionId": "alcance"
        },
        {
          "missionId": "draft.pu03",
          "sectionId": "explicacao"
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
  ],
  "groups": [
    {
      "id": "oracao-locucao",
      "units": [
        "pu01"
      ]
    },
    {
      "id": "periodos",
      "units": [
        "pu01"
      ]
    },
    {
      "id": "estrutura-lista",
      "units": [
        "pu02"
      ]
    },
    {
      "id": "intercalacao",
      "units": [
        "pu02"
      ]
    },
    {
      "id": "chamada-aposto",
      "units": [
        "pu03"
      ]
    },
    {
      "id": "restricao-explicacao",
      "units": [
        "pu03"
      ]
    }
  ]
};
export const ARITHMETIC = [];
