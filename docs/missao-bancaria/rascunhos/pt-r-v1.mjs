// Texto e exercícios autorais; rascunho fora do catálogo.
export const SOURCES = [];

export const PTR_DRAFT = {
  "id": "draft.ptr",
  "topicId": "draft.ptr",
  "editorialKey": "PT-R",
  "candidateBlockId": "portuguese.text",
  "title": "Revisão cumulativa de organização, retomadas e relações",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Combinar modos de organização, referências e relações textuais em casos novos, distinguindo ambiguidade, condição, contradição e informação ausente.",
  "sourceIds": [],
  "sections": [
    {
      "id": "roteiro",
      "heading": "1. Um roteiro curto para retomar",
      "body": "Leia sem classificar de imediato. Primeiro diga o que cada frase informa; depois identifique participantes, retomadas e conectivos. Confira se a conclusão preserva os mesmos acontecimentos, tempos e relações. Esta revisão reúne PT-01 a PT-04, com casos novos; não é uma avaliação independente nem uma prova de retenção.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "modos",
      "heading": "2. Relatar, caracterizar e orientar",
      "body": "Um relato informa acontecimentos; uma descrição apresenta características; uma orientação indica ação a realizar. Uma frase instrucional não prova que alguém cumpriu a ação. Um texto pode combinar essas formas. O nome do gênero, sozinho, não decide como cada trecho organiza as informações.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-modos",
      "heading": "3. Exemplo resolvido: duas funções no mesmo recado",
      "body": "Texto autoral: Ontem, Nara deixou um caderno no balcão. Antes de retirar o caderno, confira a etiqueta.\n\nA primeira frase relata um acontecimento passado; a segunda orienta quem vai agir. O texto não prova que a etiqueta já foi conferida. O caderno é o mesmo objeto apresentado na primeira frase.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "referencias",
      "heading": "4. Identificar o que é retomado",
      "body": "Retomadas podem recuperar uma palavra ou uma ideia. Se duas referências continuam possíveis, não decidir apenas pela proximidade. A forma mais clara de explicar a dúvida é testar os nomes por extenso e mostrar qual informação faltou. Substituições também precisam preservar o acontecimento; transferir uma data não significa cancelar um encontro.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-ref",
      "heading": "5. Exemplo resolvido: explicitar quem realizou a ação",
      "body": "Texto autoral: Ana encontrou Vera depois que ela saiu da oficina.\n\nO trecho, sozinho, não distingue se Ana ou Vera saiu da oficina. Para informar que Vera saiu, reescreva “Ana encontrou Vera depois que Vera saiu da oficina”. Não eliminar a dúvida apenas alegando que Vera é o nome mais próximo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "relacoes",
      "heading": "6. Conservar causa, contraste e condição",
      "body": "Uma razão apresentada não vira regra universal; contraste não apaga as informações; condição não garante ocorrência. “Se faltar material, a atividade será adiada” informa uma regra para o caso indicado. Sem dado de falta de material, não concluir que a atividade foi adiada. Também não inventar o resultado de uma situação que a regra não descreve.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "compatibilidade",
      "heading": "7. Coesão, coerência e sequência",
      "body": "Identifique o mesmo participante, objeto e instante antes de comparar afirmações. Uma retomada clara pode ligar duas informações incompatíveis. Já uma quantidade de inscritos maior que a de presentes não cria contradição por si só. Para ordenar ações, use os marcadores dados, sem inventar uma ordem quando não há pista suficiente.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-revisao",
      "heading": "8. Exemplo resolvido: contradição ou falta de informação?",
      "body": "Caso 1: exatamente às 10h, a mesma caixa estava vazia e, no mesmo instante, continha dois livros. Nas condições literais fornecidas, há conflito entre vazia e contendo livros.\n\nCaso 2: dez pessoas se inscreveram e seis compareceram depois. As informações podem coexistir; o motivo do não comparecimento não foi fornecido. Não chamar qualquer informação ausente de contradição.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "9. Vocabulário de apoio",
      "body": "Modo de organização: forma de apresentar o conteúdo do trecho. Referente: o que uma expressão retoma. Condição: situação para a qual uma regra indica resultado. Contraste: oposição expressa entre informações ou expectativas. Contradição: incompatibilidade nas condições do mesmo caso. Lacuna: detalhe não informado.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "10. Recuperação por tipo de erro",
      "body": "Se errou a função da frase, retome PT-01. Se trocou um participante ou resolveu pronome por palpite, retome PT-02. Se converteu hipótese em certeza ou inverteu causa, retome PT-03. Se inventou contexto para apagar conflito ou trocou a sequência, retome PT-04. Explique a correção com a pista expressa antes de tentar novamente.",
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
      "id": "ptr.q01",
      "prompt": "Texto autoral: No sábado, Ivo separou os folhetos e depois os colocou numa pasta. Qual organização é expressa nesse trecho?",
      "options": [
        "Relato de acontecimentos em sequência.",
        "Orientação para uma ação ainda a realizar.",
        "Descrição exclusiva das características de uma pasta.",
        "Regra que proíbe organizar folhetos aos sábados."
      ],
      "answer": 0,
      "explanation": "Há ações relatadas e marcador temporal.",
      "optionRationales": [
        "Há ações relatadas e marcador temporal.",
        "O trecho relata ações, sem orientar o destinatário a realizá-las.",
        "Não apresenta apenas características estáticas.",
        "Nenhuma proibição é dada."
      ],
      "recoverySectionIds": [
        "modos",
        "ex-modos"
      ],
      "objectiveIds": [
        "O1"
      ],
      "originRefs": [
        {
          "unit": "pt01",
          "sectionId": "narracao"
        }
      ]
    },
    {
      "id": "ptr.q02",
      "prompt": "Texto autoral: Confira a etiqueta antes de guardar a pasta. Qual conclusão é sustentada?",
      "options": [
        "A pasta já foi guardada e a etiqueta conferida.",
        "O trecho orienta conferir a etiqueta antes de guardar, sem afirmar cumprimento.",
        "A etiqueta foi impressa naquela manhã.",
        "Guardar a pasta deve acontecer antes de conferir a etiqueta."
      ],
      "answer": 1,
      "explanation": "Conserva a ordem indicada e o limite da orientação.",
      "optionRationales": [
        "A orientação não prova ações cumpridas.",
        "Conserva a ordem indicada e o limite da orientação.",
        "Não há impressão nem horário informado.",
        "Inverte a ordem indicada."
      ],
      "recoverySectionIds": [
        "modos",
        "ex-modos"
      ],
      "objectiveIds": [
        "O2"
      ],
      "originRefs": [
        {
          "unit": "pt01",
          "sectionId": "ex-instrucao"
        }
      ]
    },
    {
      "id": "ptr.q03",
      "prompt": "Texto autoral: Rosa encontrou Mila depois que ela saiu do curso. Sem outra pista, qual conclusão é adequada?",
      "options": [
        "“Ela” só pode ser Mila por ser o último nome.",
        "“Ela” só pode ser Rosa por iniciar o texto.",
        "O trecho permite associar a saída a Rosa ou a Mila, sem distinguir as duas.",
        "Uma terceira pessoa saiu do curso com certeza."
      ],
      "answer": 2,
      "explanation": "Reconhece as possibilidades dadas sem inventar uma escolha.",
      "optionRationales": [
        "Proximidade sozinha não elimina a outra leitura.",
        "Posição inicial sozinha não resolve a referência.",
        "Reconhece as possibilidades dadas sem inventar uma escolha.",
        "Não há terceira participante no texto."
      ],
      "recoverySectionIds": [
        "referencias",
        "ex-ref"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt02",
          "sectionId": "ambiguidade"
        }
      ]
    },
    {
      "id": "ptr.q04",
      "prompt": "Texto autoral: O ensaio foi transferido de segunda para quarta. Essa alteração foi comunicada ao grupo. O que “essa alteração” retoma?",
      "options": [
        "A troca de todos os integrantes.",
        "O cancelamento definitivo do ensaio.",
        "Uma mudança de local expressamente citada.",
        "A transferência do ensaio de segunda para quarta."
      ],
      "answer": 3,
      "explanation": "Retoma a mudança de data da primeira frase.",
      "optionRationales": [
        "Não foi relatada mudança dos integrantes.",
        "Transferência de data não equivale a cancelamento definitivo.",
        "Nenhum local foi apresentado.",
        "Retoma a mudança de data da primeira frase."
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
          "sectionId": "ideia"
        }
      ]
    },
    {
      "id": "ptr.q05",
      "prompt": "Texto autoral: Se faltar material, a atividade será adiada. Sem outra informação, o que esse trecho permite afirmar?",
      "options": [
        "Indica adiamento para o caso de falta de material, sem afirmar que isso ocorreu.",
        "A atividade já foi adiada.",
        "O material faltará com certeza.",
        "Se não faltar material, a atividade será obrigatoriamente cancelada."
      ],
      "answer": 0,
      "explanation": "Descreve a regra e seu limite.",
      "optionRationales": [
        "Descreve a regra e seu limite.",
        "Não foi informado que a condição ocorreu nem que houve adiamento.",
        "A frase não garante ocorrência da condição.",
        "O caso contrário não recebeu esse resultado."
      ],
      "recoverySectionIds": [
        "relacoes"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt03",
          "sectionId": "condicao"
        }
      ]
    },
    {
      "id": "ptr.q06",
      "prompt": "Texto autoral: Havia vento, mas a equipe realizou a visita. Qual reescrita conserva as informações e a relação?",
      "options": [
        "O vento impediu a visita da equipe.",
        "A equipe realizou a visita apesar do vento.",
        "Não havia vento e nenhuma visita aconteceu.",
        "A equipe realizou a visita porque o vento impediu a visita."
      ],
      "answer": 1,
      "explanation": "Preserva a ocorrência e o contraste.",
      "optionRationales": [
        "Troca visita realizada por visita impedida.",
        "Preserva a ocorrência e o contraste.",
        "Nega as informações relatadas.",
        "Cria uma relação que contradiz a visita realizada."
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
      ]
    },
    {
      "id": "ptr.q07",
      "prompt": "No mesmo instante e nas condições literais do caso, o texto afirma que a mesma caixa estava vazia e continha dois livros. Qual problema deve ser identificado?",
      "options": [
        "Ausência de qualquer referência à caixa.",
        "Quantidades compatíveis sobre caixas diferentes.",
        "Informações incompatíveis sobre a mesma caixa no mesmo instante.",
        "Uma conclusão de que quatro pessoas se inscreveram."
      ],
      "answer": 2,
      "explanation": "Nomeia o conflito sem mudar as condições.",
      "optionRationales": [
        "A caixa é identificada nas duas afirmações.",
        "O caso especifica a mesma caixa, não caixas diferentes.",
        "Nomeia o conflito sem mudar as condições.",
        "Inscrições não aparecem no caso."
      ],
      "recoverySectionIds": [
        "compatibilidade",
        "ex-revisao"
      ],
      "objectiveIds": [
        "O3"
      ],
      "originRefs": [
        {
          "unit": "pt04",
          "sectionId": "compatibilidade"
        }
      ]
    },
    {
      "id": "ptr.q08",
      "prompt": "Um caso relata: Davi guardou os papéis na pasta e só depois levou essa pasta ao balcão. Um estudante inverteu a ordem. Qual retomada corrige o erro?",
      "options": [
        "Aceitar a inversão porque aparece a palavra “e”.",
        "Inventar outra pasta para manter a resposta.",
        "Apagar “só depois” e declarar que não há pistas temporais.",
        "Voltar a “só depois” e conservar guardar antes de levar ao balcão."
      ],
      "answer": 3,
      "explanation": "Reconstrói a sequência a partir da informação fornecida.",
      "optionRationales": [
        "A presença de ligação não permite inverter o marcador expresso.",
        "Acrescenta objeto para mudar o caso.",
        "Elimina a pista que deveria ser usada.",
        "Reconstrói a sequência a partir da informação fornecida."
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
          "sectionId": "reescrita"
        }
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "ptr-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "ptr.q01": [
        {
          "missionId": "draft.ptr",
          "sectionId": "modos"
        },
        {
          "missionId": "draft.ptr",
          "sectionId": "ex-modos"
        }
      ],
      "ptr.q02": [
        {
          "missionId": "draft.ptr",
          "sectionId": "modos"
        },
        {
          "missionId": "draft.ptr",
          "sectionId": "ex-modos"
        }
      ],
      "ptr.q03": [
        {
          "missionId": "draft.ptr",
          "sectionId": "referencias"
        },
        {
          "missionId": "draft.ptr",
          "sectionId": "ex-ref"
        }
      ],
      "ptr.q04": [
        {
          "missionId": "draft.ptr",
          "sectionId": "referencias"
        }
      ],
      "ptr.q05": [
        {
          "missionId": "draft.ptr",
          "sectionId": "relacoes"
        }
      ],
      "ptr.q06": [
        {
          "missionId": "draft.ptr",
          "sectionId": "relacoes"
        }
      ],
      "ptr.q07": [
        {
          "missionId": "draft.ptr",
          "sectionId": "compatibilidade"
        },
        {
          "missionId": "draft.ptr",
          "sectionId": "ex-revisao"
        }
      ],
      "ptr.q08": [
        {
          "missionId": "draft.ptr",
          "sectionId": "compatibilidade"
        },
        {
          "missionId": "draft.ptr",
          "sectionId": "recuperacao"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; revisão independente pendente",
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
    "O1": "Identificar modos e referências em casos novos.",
    "O2": "Conservar ordem e relações nas reescritas.",
    "O3": "Distinguir ambiguidade, condição e contradição.",
    "O4": "Recuperar o erro usando a pista e a aula de origem."
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
  ]
};

export const ARITHMETIC = [];
