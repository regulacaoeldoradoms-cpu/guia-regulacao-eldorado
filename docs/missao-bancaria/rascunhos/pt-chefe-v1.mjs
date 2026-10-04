// Texto e exercícios autorais; rascunho fora do catálogo.
export const SOURCES = [];

export const PTCHEFE_DRAFT = {
  "id": "draft.ptchefe",
  "topicId": "draft.ptchefe",
  "editorialKey": "PT-CHEFE",
  "candidateBlockId": "portuguese.text",
  "title": "Chefe de organização textual: pistas, relações e limites",
  "contentVersion": 1,
  "kind": "boss",
  "publication": {
    "status": "draft"
  },
  "objective": "Aplicar as quatro aulas em doze itens próprios, reconstruindo referências, sequência e relações e distinguindo informação ausente de incompatibilidade.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Como enfrentar o Chefe",
      "body": "O Chefe combina seis grupos de problemas introdutórios. Leia cada caso como um texto próprio: participantes e informações de outra questão não completam este caso. Tente responder antes de consultar; se errar, identifique o que trocou ou acrescentou e use a retomada indicada. Os itens são próprios, mas não constituem avaliação independente nem prova de retenção.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "modos",
      "heading": "2. Organização do trecho",
      "body": "Relatar acontecimentos, apresentar características e orientar ações são modos diferentes de organizar o conteúdo. Uma orientação não afirma seu cumprimento. Um texto misto pode reunir mais de um modo; o rótulo do gênero não substitui a leitura do trecho.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "referencias",
      "heading": "3. Referências e ambiguidade",
      "body": "Explicite o referente de uma retomada: objeto, participante ou ideia. Preserve o acontecimento ao substituir palavras. Quando dois nomes continuarem possíveis, a posição mais próxima não é uma prova suficiente. Reconheça a dúvida e a informação necessária para resolvê-la.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "relacoes",
      "heading": "4. Razão e contraste",
      "body": "Conserve quem funciona como razão e o que é apresentado como resultado. Não inverter esses papéis. Contraste mantém as informações do trecho, em vez de negar uma delas. Um caso relatado não estabelece uma regra universal para todas as situações.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "condicao",
      "heading": "5. Condição e resultado",
      "body": "Uma regra com “se” indica resultado para a hipótese fornecida, sem garantir ocorrência. Só concluir o resultado quando o caso informa a condição satisfeita e a regra aplicável. Não inventar a regra do caso contrário nem tratar adiamento como cancelamento definitivo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "sequencia",
      "heading": "6. Sequência e dependências",
      "body": "Destaque “antes”, “em seguida” e “só depois”; confira os objetos retomados. A ordem precisa conservar os acontecimentos e relações explicitamente procurados. Não escolher uma ordem obrigatória por preferência nem apagar um marcador para manter a primeira resposta.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "compatibilidade",
      "heading": "7. Coerência e informação ausente",
      "body": "Compare se as afirmações falam do mesmo objeto, instante e condições. Referência clara não elimina estados incompatíveis no caso literal dado. Diferentes quantidades de inscrições e presenças podem coexistir; não informar motivo de ausência não equivale a contradizer os números.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-chefe",
      "heading": "8. Exemplo resolvido: combinar pistas",
      "body": "Texto autoral: Téo encontrou um bilhete. Depois, guardou esse bilhete na pasta. Confira a etiqueta antes de entregar a pasta.\n\nAs duas primeiras frases relatam uma sequência e retomam o mesmo bilhete. A última orienta ação futura no caso, sem afirmar que Téo conferiu a etiqueta ou entregou a pasta. Não usar o relato inicial como prova de cumprimento da orientação final.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "retomadas",
      "heading": "9. Consultas por dificuldade",
      "body": "[PT-01: modos e sequência](pt-01-v1.md)\n\n[PT-02: referências e ambiguidade](pt-02-v1.md)\n\n[PT-03: conectivos e condições](pt-03-v1.md)\n\n[PT-04: coesão e coerência](pt-04-v1.md)\n\n[PT-R: revisão cumulativa](pt-r-v1.md)",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "10. Vocabulário de apoio",
      "body": "Referente: informação retomada. Marcador temporal: pista da ordem fornecida. Razão textual: motivo apresentado pelo trecho. Condição: hipótese à qual a regra vincula resultado. Coesão: ligação entre partes. Coerência: construção de sentido compatível no contexto. Lacuna: informação ausente, que não deve ser completada por palpite.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "11. Depois de uma resposta incorreta",
      "body": "Nomeie a confusão: modo, referente, relação, condição, sequência ou compatibilidade. Volte à seção de origem, reescreva a pista e diga o que o distrator acrescentou ou mudou. Só depois tente novamente. Acertar um item após consulta não mede sozinho retenção futura; não converter o Chefe em diagnóstico de prontidão.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Que palavra retoma qual informação?",
    "Qual relação o trecho expressa?",
    "Que informação a alternativa acrescentou ou trocou?"
  ],
  "questions": [
    {
      "id": "ptchefe.q01",
      "prompt": "Texto autoral: A sala tem duas estantes baixas e uma mesa redonda perto da entrada. Como esse trecho apresenta seu conteúdo?",
      "options": [
        "Descreve características e posições de objetos.",
        "Relata etapas sucessivas de montagem da sala.",
        "Ordena que o leitor monte duas estantes.",
        "Demonstra que toda sala deve ter mesa redonda."
      ],
      "answer": 0,
      "explanation": "Apresenta objetos e características do espaço.",
      "optionRationales": [
        "Apresenta objetos e características do espaço.",
        "Não narra montagem ou sequência de acontecimentos.",
        "Não oferece ordem ao destinatário.",
        "Não formula regra sobre todas as salas."
      ],
      "recoverySectionIds": [
        "modos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pt01",
          "sectionId": "descricao"
        }
      ],
      "groupId": "modos"
    },
    {
      "id": "ptchefe.q02",
      "prompt": "Texto autoral: Antes de entregar a pasta, confira a etiqueta. Qual conclusão respeita o trecho?",
      "options": [
        "A entrega e a conferência já foram realizadas.",
        "Há orientação para conferir antes de entregar, sem prova de cumprimento.",
        "A pasta foi entregue ontem sem etiqueta.",
        "A etiqueta deve ser conferida somente depois da entrega."
      ],
      "answer": 1,
      "explanation": "Mantém orientação, ordem e limite das informações.",
      "optionRationales": [
        "Converte instrução em fato concluído.",
        "Mantém orientação, ordem e limite das informações.",
        "Acrescenta acontecimento, data e ausência não informados.",
        "Inverte a ordem expressa."
      ],
      "recoverySectionIds": [
        "modos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pt01",
          "sectionId": "ex-instrucao"
        }
      ],
      "groupId": "modos"
    },
    {
      "id": "ptchefe.q03",
      "prompt": "Texto autoral: Caio trouxe uma revista de viagem. Essa publicação ficou sobre o balcão. Qual é o referente de “essa publicação”?",
      "options": [
        "Caio.",
        "O balcão.",
        "A revista de viagem.",
        "Uma mesa que o texto apresenta."
      ],
      "answer": 2,
      "explanation": "Retoma o objeto apresentado na primeira frase.",
      "optionRationales": [
        "Caio é o participante, não a publicação trazida.",
        "O balcão é o lugar onde ficou a revista.",
        "Retoma o objeto apresentado na primeira frase.",
        "Nenhuma mesa foi apresentada."
      ],
      "recoverySectionIds": [
        "referencias"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pt02",
          "sectionId": "texto-a"
        }
      ],
      "groupId": "referencias"
    },
    {
      "id": "ptchefe.q04",
      "prompt": "Texto autoral: Vera recebeu Paula depois que ela terminou o curso. Sem outra pista, qual análise é adequada?",
      "options": [
        "Só Paula pode ter terminado, por ser o nome mais próximo.",
        "Só Vera pode ter terminado, por aparecer no início.",
        "Uma terceira pessoa terminou o curso com certeza.",
        "A referência de “ela” pode ser Vera ou Paula; falta pista que distinga as duas."
      ],
      "answer": 3,
      "explanation": "Reconhece a ambiguidade e seu limite sem escolher por palpite.",
      "optionRationales": [
        "Proximidade sozinha não elimina a outra referência.",
        "A posição inicial também não determina a referência neste caso.",
        "Acrescenta participante ausente.",
        "Reconhece a ambiguidade e seu limite sem escolher por palpite."
      ],
      "recoverySectionIds": [
        "referencias"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt02",
          "sectionId": "ambiguidade"
        }
      ],
      "groupId": "referencias"
    },
    {
      "id": "ptchefe.q05",
      "prompt": "Texto autoral: A devolução foi adiada porque o balcão estava fechado. Qual informação funciona como razão apresentada?",
      "options": [
        "O balcão estava fechado.",
        "O adiamento causou o fechamento do balcão.",
        "Todo balcão fechado adia qualquer atividade.",
        "A devolução já tinha ocorrido no dia anterior."
      ],
      "answer": 0,
      "explanation": "É a razão explicitamente ligada ao adiamento.",
      "optionRationales": [
        "É a razão explicitamente ligada ao adiamento.",
        "Inverte razão e resultado.",
        "Generaliza o caso para uma regra que não foi dada.",
        "Introduz uma devolução anterior ausente."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pt03",
          "sectionId": "causa"
        }
      ],
      "groupId": "causa-contraste"
    },
    {
      "id": "ptchefe.q06",
      "prompt": "Texto autoral: O caminho era longo, mas a turma chegou ao local. Qual reescrita conserva a relação e as informações?",
      "options": [
        "A turma não chegou porque o caminho era longo.",
        "A turma chegou ao local apesar de o caminho ser longo.",
        "O caminho não era longo, pois a turma chegou.",
        "O caminho impediu a chegada que o texto afirma ter ocorrido."
      ],
      "answer": 1,
      "explanation": "Conserva a chegada e a circunstância contraposta.",
      "optionRationales": [
        "Nega a chegada e substitui contraste por causa de ausência.",
        "Conserva a chegada e a circunstância contraposta.",
        "O contraste não elimina a informação sobre o caminho.",
        "Acrescenta impedimento incompatível com o relato."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pt03",
          "sectionId": "ex-contraste"
        }
      ],
      "groupId": "causa-contraste"
    },
    {
      "id": "ptchefe.q07",
      "prompt": "Texto autoral: Se o projetor falhar, a apresentação será adiada. Sem outra informação, qual afirmação é sustentada?",
      "options": [
        "O projetor falhou com certeza.",
        "A apresentação já foi adiada.",
        "O trecho indica adiamento para a hipótese de falha, sem afirmar que ela ocorreu.",
        "Se o projetor não falhar, a apresentação ocorrerá obrigatoriamente às 18h."
      ],
      "answer": 2,
      "explanation": "Mantém o resultado condicionado e o limite do trecho.",
      "optionRationales": [
        "A condição não garante sua ocorrência.",
        "Não foi fornecido o dado de falha nem relato de adiamento.",
        "Mantém o resultado condicionado e o limite do trecho.",
        "O caso contrário e esse horário não foram definidos."
      ],
      "recoverySectionIds": [
        "condicao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt03",
          "sectionId": "condicao"
        }
      ],
      "groupId": "condicao"
    },
    {
      "id": "ptchefe.q08",
      "prompt": "O caso acrescenta que o projetor falhou e que a regra “Se o projetor falhar, a apresentação será adiada” se aplica. Qual resultado a regra indica?",
      "options": [
        "A apresentação ocorreu ontem.",
        "O projetor não falhou.",
        "O texto determina trocar a apresentação por uma prova.",
        "A apresentação será adiada."
      ],
      "answer": 3,
      "explanation": "Com a condição informada e a regra aplicável, esse é o resultado indicado.",
      "optionRationales": [
        "Nenhuma apresentação anterior foi relatada.",
        "Contraria o dado adicional do caso.",
        "A regra não indica uma prova substituta.",
        "Com a condição informada e a regra aplicável, esse é o resultado indicado."
      ],
      "recoverySectionIds": [
        "condicao"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pt03",
          "sectionId": "ex-condicao"
        }
      ],
      "groupId": "condicao"
    },
    {
      "id": "ptchefe.q09",
      "prompt": "Texto autoral: Léo conferiu a etiqueta antes de fechar a pasta. Só depois de fechar a pasta, entregou a pasta no balcão. Qual sequência preserva o relato?",
      "options": [
        "Conferir a etiqueta, fechar a pasta, entregar a pasta.",
        "Entregar a pasta, conferir a etiqueta, fechar a pasta.",
        "Fechar a pasta, entregar a pasta, conferir a etiqueta.",
        "Conferir a etiqueta, entregar a pasta, fechar a pasta."
      ],
      "answer": 0,
      "explanation": "Conserva “antes” e “só depois” nas ações dadas.",
      "optionRationales": [
        "Conserva “antes” e “só depois” nas ações dadas.",
        "Coloca a entrega antes do fechamento exigido.",
        "Coloca a conferência depois, contrariando “antes”.",
        "Entrega antes de fechar, contrariando “só depois”."
      ],
      "recoverySectionIds": [
        "sequencia"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pt01",
          "sectionId": "ex-sequencia"
        }
      ],
      "groupId": "sequencia"
    },
    {
      "id": "ptchefe.q10",
      "prompt": "Fragmentos autorais: 1. Nina separou um cartão. 2. Em seguida, colocou esse cartão em um envelope e fechou o envelope. 3. Só depois de fechar o envelope, Nina guardou esse envelope na gaveta. Qual ordem conserva os marcadores e as referências do caso?",
      "options": [
        "3, 2, 1.",
        "1, 2, 3.",
        "2, 1, 3.",
        "1, 3, 2."
      ],
      "answer": 1,
      "explanation": "Apresenta o cartão, coloca-o no envelope, fecha e depois guarda.",
      "optionRationales": [
        "Começa pelo resultado final e inverte a sequência fornecida.",
        "Apresenta o cartão, coloca-o no envelope, fecha e depois guarda.",
        "Põe a retomada antes da apresentação, sem conservar “em seguida”.",
        "Guarda antes do fragmento que relata o fechamento exigido por 3."
      ],
      "recoverySectionIds": [
        "sequencia"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pt04",
          "sectionId": "ex-ordem"
        }
      ],
      "groupId": "sequencia"
    },
    {
      "id": "ptchefe.q11",
      "prompt": "Nas condições literais dadas, o texto afirma que, exatamente às 11h, a porta B estava inteiramente aberta e, no mesmo instante, essa mesma porta B estava inteiramente fechada. Qual análise é adequada?",
      "options": [
        "O uso de “essa mesma porta” elimina qualquer conflito de sentido.",
        "As frases falam expressamente de portas diferentes.",
        "Há retomada clara, mas estados incompatíveis atribuídos à mesma porta no mesmo instante.",
        "Não foi fornecido nenhum horário nem estado da porta."
      ],
      "answer": 2,
      "explanation": "Distingue a ligação entre partes da compatibilidade das informações no caso.",
      "optionRationales": [
        "Uma ligação textual não elimina a incompatibilidade.",
        "A identidade da porta é explícita.",
        "Distingue a ligação entre partes da compatibilidade das informações no caso.",
        "O horário e os dois estados foram fornecidos."
      ],
      "recoverySectionIds": [
        "compatibilidade"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt04",
          "sectionId": "compatibilidade"
        }
      ],
      "groupId": "compatibilidade"
    },
    {
      "id": "ptchefe.q12",
      "prompt": "Texto autoral: Doze pessoas se inscreveram na atividade. Depois, sete delas compareceram. Um leitor atribuiu o não comparecimento à chuva. Qual retomada recupera esse erro?",
      "options": [
        "Afirmar que inscrição e presença sempre têm a mesma quantidade.",
        "Inventar previsão de chuva para justificar a resposta.",
        "Declarar que ninguém se inscreveu, apagando a primeira frase.",
        "Distinguir inscrição de comparecimento e reconhecer que o motivo do não comparecimento não foi informado."
      ],
      "answer": 3,
      "explanation": "Conserva os dados e identifica a causa acrescentada sem apoio.",
      "optionRationales": [
        "São informações distintas; essa exigência não foi dada.",
        "Cria causa externa ao trecho.",
        "Contraria as doze pessoas inscritas relatadas.",
        "Conserva os dados e identifica a causa acrescentada sem apoio."
      ],
      "recoverySectionIds": [
        "compatibilidade",
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ],
      "originRefs": [
        {
          "unit": "pt04",
          "sectionId": "ex-lacuna"
        }
      ],
      "groupId": "compatibilidade"
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ptchefe-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ptchefe.q01": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "modos"
        },
        {
          "missionId": "draft.pt01",
          "sectionId": "descricao"
        }
      ],
      "ptchefe.q02": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "modos"
        },
        {
          "missionId": "draft.pt01",
          "sectionId": "ex-instrucao"
        }
      ],
      "ptchefe.q03": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "referencias"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "texto-a"
        }
      ],
      "ptchefe.q04": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "referencias"
        },
        {
          "missionId": "draft.pt02",
          "sectionId": "ambiguidade"
        }
      ],
      "ptchefe.q05": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "relacoes"
        },
        {
          "missionId": "draft.pt03",
          "sectionId": "causa"
        }
      ],
      "ptchefe.q06": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "relacoes"
        },
        {
          "missionId": "draft.pt03",
          "sectionId": "ex-contraste"
        }
      ],
      "ptchefe.q07": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "condicao"
        },
        {
          "missionId": "draft.pt03",
          "sectionId": "condicao"
        }
      ],
      "ptchefe.q08": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "condicao"
        },
        {
          "missionId": "draft.pt03",
          "sectionId": "ex-condicao"
        }
      ],
      "ptchefe.q09": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "sequencia"
        },
        {
          "missionId": "draft.pt01",
          "sectionId": "ex-sequencia"
        }
      ],
      "ptchefe.q10": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "sequencia"
        },
        {
          "missionId": "draft.pt04",
          "sectionId": "ex-ordem"
        }
      ],
      "ptchefe.q11": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "compatibilidade"
        },
        {
          "missionId": "draft.pt04",
          "sectionId": "compatibilidade"
        }
      ],
      "ptchefe.q12": [
        {
          "missionId": "draft.ptchefe",
          "sectionId": "compatibilidade"
        },
        {
          "missionId": "draft.ptchefe",
          "sectionId": "recuperacao"
        },
        {
          "missionId": "draft.pt04",
          "sectionId": "ex-lacuna"
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
      "item": "Português: organização/tipologia textual e coesão/coerência, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Português: organização/tipologia textual e coesão/coerência, recorte do plano 05/mapa existente",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Localizar modos, referentes, razões e dependências.",
    "O2": "Conservar ordem, relação e resultado condicionado.",
    "O3": "Reconhecer ambiguidade, incompatibilidade e limites do caso.",
    "O4": "Recuperar o erro pela pista e seção de origem."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar a pista textual, identificar a troca indevida e reconstruir a resposta."
  },
  "limits": [
    "Recorte previsto em docs/missao-bancaria/05-FASE-4-PORTUGUES-MATEMATICA.md e curriculum-v1.js, sem abrir formalmente a Fase 4.",
    "Textos A/B e frases são integralmente criados pelo autor para exercícios; não são citações, notícias ou instruções de serviços reais.",
    "Sem norma mutável, fonte jurídica ou consulta real nesta unidade; não fabricar fonte bibliográfica para texto autoral.",
    "Correspondência preliminar ao bloco existente não afirma cobertura integral de item/subitem de edital, adoção de edital vigente ou avaliação independente.",
    "Sem XP, ordem, importação no runtime, alteração de progresso, aceite humano ou publicação.",
    "Recorte inicial de portuguese.text; não apresenta classificação completa de tipos/gêneros, teoria linguística exaustiva ou cobertura integral de edital."
  ],
  "groups": [
    {
      "id": "modos",
      "units": [
        "pt01"
      ]
    },
    {
      "id": "referencias",
      "units": [
        "pt02"
      ]
    },
    {
      "id": "causa-contraste",
      "units": [
        "pt03"
      ]
    },
    {
      "id": "condicao",
      "units": [
        "pt03"
      ]
    },
    {
      "id": "sequencia",
      "units": [
        "pt01",
        "pt04"
      ]
    },
    {
      "id": "compatibilidade",
      "units": [
        "pt04"
      ]
    }
  ]
};

export const ARITHMETIC = [];
