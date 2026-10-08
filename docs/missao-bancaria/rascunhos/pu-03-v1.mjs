// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "funag.virgula",
    "label": "FUNAG — Manual de Revisão: vírgula (reprodução de Cunha/Cintra)",
    "url": "https://funag.gov.br/manual/index.php?title=V%C3%ADrgula&oldid=490",
    "version": "Página institucional oldid490; atribuição a Cunha/Cintra, Nova gramática, 3ª ed., 2003, pp.644–650",
    "checkedAt": "2026-10-04",
    "locator": "I.1 e observação (enumeração); I.2 a/b (aposto/vocativo); II.4 e observação (explicativa/restritiva)"
  }
];
export const PU03_DRAFT = {
  "id": "draft.pu03",
  "topicId": "draft.pu03",
  "editorialKey": "PU-03",
  "candidateBlockId": "portuguese.syntax",
  "title": "Vírgulas e sentido: chamada, explicação e restrição",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Relacionar pontuação, estrutura e alcance em frases simples ensinadas, sem generalizar o recorte.",
  "sourceIds": [
    "funag.virgula"
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
        "funag.virgula"
      ]
    },
    {
      "id": "aposto",
      "heading": "3. Explicação de um termo",
      "body": "Em Lia, coordenadora do grupo, apresentou a proposta, coordenadora do grupo explica o termo Lia e é aposto explicativo, delimitado por vírgulas. O sujeito tem núcleo Lia; apresentou a proposta é predicado. Não concluir que todo nome de pessoa deve receber vírgula nem que qualquer substantivo depois de uma vírgula é aposto. O recorte cobra a explicação apresentada, não todos os tipos de aposto.",
      "type": "explanation",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "restricao",
      "heading": "4. Uma oração pode delimitar o grupo",
      "body": "Em Os alunos que concluíram a leitura fizeram a prática, que concluíram a leitura é uma oração que caracteriza e delimita os alunos referidos. Que retoma alunos e introduz esse trecho; concluíram é verbo. Chama-se oração adjetiva restritiva nesse caso, sem as vírgulas que a isolariam como explicação. A frase não obriga a existência de alunos excluídos nem afirma quem são todos os alunos da escola: identifica o grupo pela condição apresentada.",
      "type": "explanation",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "explicacao",
      "heading": "5. A mesma informação como explicação",
      "body": "Em Os alunos, que concluíram a leitura, fizeram a prática, o trecho entre vírgulas apresenta a conclusão da leitura como informação explicativa do conjunto de alunos referido, não como filtro para selecionar parte deles. É oração adjetiva explicativa nesse uso. A explicação é sobre o conjunto a que o texto se refere; não ampliar automaticamente para todos os alunos da escola ou do mundo. Inserir ou retirar as duas vírgulas pode alterar alcance e sentido, não apenas leitura em voz alta.",
      "type": "explanation",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "ex-chamada",
      "heading": "6. Exemplo resolvido: dois grupos distintos",
      "body": "Em Colegas, o roteiro chegou, Colegas é vocativo; o roteiro é sujeito e chegou é verbo. Retirar a chamada deixa O roteiro chegou. Não responder Colegas como sujeito só por ser substantivo na abertura.",
      "type": "worked-example",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "ex-aposto",
      "heading": "7. Exemplo resolvido: explicar o termo",
      "body": "Em Lia, integrante do grupo, revisou o resumo, integrante do grupo é explicação intercalada sobre Lia. As duas vírgulas delimitam o aposto explicativo. A estrutura básica é Lia revisou o resumo; revisou não fica separado diretamente de seu sujeito por uma vírgula sem intercalação.",
      "type": "worked-example",
      "sourceIds": [
        "funag.virgula"
      ]
    },
    {
      "id": "ex-alcance",
      "heading": "8. Exemplo resolvido: conferir o grupo referido",
      "body": "Compare Os colegas que leram a pauta responderam e Os colegas, que leram a pauta, responderam. A primeira identifica os colegas pela leitura; a segunda apresenta a leitura como explicação do conjunto referido. Não inferir que na primeira necessariamente há colegas que não leram; não extrapolar a segunda para todos os colegas de qualquer outro grupo. A mudança de sinais deve ser analisada junto ao contexto.",
      "type": "worked-example",
      "sourceIds": [
        "funag.virgula"
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
      "id": "pu03.q01",
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
      ],
      "recoverySectionIds": [
        "vocativo"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pu03.q02",
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
      ],
      "recoverySectionIds": [
        "ex-chamada"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu03.q03",
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
      ],
      "recoverySectionIds": [
        "aposto"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pu03.q04",
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
      ],
      "recoverySectionIds": [
        "restricao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu03.q05",
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
      ],
      "recoverySectionIds": [
        "explicacao"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu03.q06",
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
      ],
      "recoverySectionIds": [
        "vocativo"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pu03.q07",
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
      ],
      "recoverySectionIds": [
        "ex-alcance"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pu03.q08",
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
      ],
      "recoverySectionIds": [
        "ex-aposto"
      ],
      "objectiveIds": [
        "O2"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pu03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pu03.q01": [
        {
          "missionId": "draft.pu03",
          "sectionId": "vocativo"
        }
      ],
      "pu03.q02": [
        {
          "missionId": "draft.pu03",
          "sectionId": "ex-chamada"
        }
      ],
      "pu03.q03": [
        {
          "missionId": "draft.pu03",
          "sectionId": "aposto"
        }
      ],
      "pu03.q04": [
        {
          "missionId": "draft.pu03",
          "sectionId": "restricao"
        }
      ],
      "pu03.q05": [
        {
          "missionId": "draft.pu03",
          "sectionId": "explicacao"
        }
      ],
      "pu03.q06": [
        {
          "missionId": "draft.pu03",
          "sectionId": "vocativo"
        }
      ],
      "pu03.q07": [
        {
          "missionId": "draft.pu03",
          "sectionId": "ex-alcance"
        }
      ],
      "pu03.q08": [
        {
          "missionId": "draft.pu03",
          "sectionId": "ex-aposto"
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
