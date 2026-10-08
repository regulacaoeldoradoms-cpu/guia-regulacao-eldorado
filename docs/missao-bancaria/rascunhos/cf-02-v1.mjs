// Texto e exercícios autorais; rascunho local desativado.
export const SOURCES = [];
export const CF02_DRAFT = {
  "id": "draft.cf02",
  "topicId": "draft.cf02",
  "editorialKey": "CF-02",
  "candidateBlockId": "portuguese.syntax",
  "title": "Verbo em contexto: ação, estado, tempo e pessoa",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Analisar classes, formas verbais e grupos nas frases simples ensinadas, preservando contexto e limites.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Ação e estado",
      "body": "Compare A turma leu e A turma está atenta. Leu apresenta ação; está apresenta estado e liga a turma à característica atenta. Ambos são verbos. Definir verbo apenas como ação falha na segunda frase. Leitura nomeia uma atividade como substantivo; leu é uma forma verbal, como visto em CF-01.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "tempo",
      "heading": "2. Forma verbal e pista de tempo",
      "body": "Compare Ontem a equipe leu, Hoje a equipe lê e Amanhã a equipe lerá. Leu apresenta passado, lê tem forma do presente e lerá tem forma do futuro. Ontem/hoje/amanhã são pistas que situam os acontecimentos, não formas verbais. O recorte não ensina todos os tempos ou modos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "contexto",
      "heading": "3. Presente não é sempre agora",
      "body": "Em A turma lê todos os dias, o presente apresenta hábito, não leitura necessariamente ocorrendo neste segundo. Em Amanhã a equipe entrega o resumo, entrega tem forma do presente, mas amanhã situa a entrega no futuro da fala. Distinga forma verbal de referência temporal da frase. Não apague a pista amanhã por reconhecer o presente.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "pessoa",
      "heading": "4. Pessoa e número",
      "body": "Eu é primeira pessoa do singular; nós, primeira do plural, incluindo quem fala. Ele/ela são terceira pessoa do singular; eles/elas, terceira do plural. Compare Eu leio, Nós lemos, Ela lê e Elas leem. A forma se ajusta à pessoa/número nesses usos. Nós lemos sem contexto também pode referir-se ao passado; os itens dão o contexto necessário. Não se cobra toda conjugação ou tu/vós/você.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-estado",
      "heading": "5. Exemplo resolvido: estado",
      "body": "Em A equipe está tranquila, está é verbo e tranquila é adjetivo. A equipe é sujeito completo; está tranquila é predicado. Não excluir está por não mostrar uma ação nem chamar tranquila de verbo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-tempo",
      "heading": "6. Exemplo resolvido: contexto",
      "body": "Em Amanhã o grupo apresenta a proposta, apresenta tem forma do presente, com referência futura marcada por amanhã. Em O grupo apresenta propostas toda semana, a mesma forma apresenta hábito. O contexto situa o processo sem exigir troca da forma verbal.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-numero",
      "heading": "7. Exemplo resolvido: mudar número",
      "body": "Compare Ela lê o roteiro todos os dias e Elas leem o roteiro todos os dias. Terceira pessoa singular passa a plural; lê passa a leem. O hábito e o complemento permanecem. Plural não transforma a leitura em passado.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. Recorte delimitado",
      "body": "A flexão básica não cobre toda concordância, todos os tempos/modos ou irregularidades. Decida pelos contextos fornecidos. Estado não é ausência de verbo; nome de atividade não é automaticamente verbo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário mínimo",
      "body": "Classe é categoria da palavra no contexto; função é papel do termo na oração. Forma verbal é uma realização do verbo, como leu/lerá. Pessoa gramatical e número distinguem eu/nós e ele/eles. Complemento completa o verbo nos usos ensinados; circunstância informa tempo/lugar nos exemplos, sem se tornar objeto por sua posição.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Retomar a pergunta e o contexto",
      "body": "Marque se a questão pede classe, forma verbal ou função. Localize o verbo e os grupos completos; retome a seção indicada e compare um exemplo próximo. Registre o que a resposta errada ignorou e refaça a análise. Não transformar os casos introdutórios em regra universal.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Classe: que tipo de palavra é no contexto? Função: que papel tem o termo na oração?",
    "Compare aviso como substantivo no sujeito e no complemento.",
    "Não reduzir sujeito completo ao núcleo nem classificar toda ação nomeada como verbo."
  ],
  "questions": [
    {
      "id": "cf02.q01",
      "prompt": "Em A equipe está animada, qual palavra é verbo?",
      "options": [
        "Animada.",
        "Equipe.",
        "Está.",
        "A."
      ],
      "answer": 2,
      "explanation": "Está apresenta estado e integra o predicado.",
      "optionRationales": [
        "Animada é adjetivo.",
        "Equipe é substantivo.",
        "Está apresenta estado e integra o predicado.",
        "A é artigo."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cf02.q02",
      "prompt": "Em Ontem o grupo leu a nota, qual análise distingue forma verbal e pista temporal?",
      "options": [
        "Leu é verbo; ontem situa a leitura no passado.",
        "Ontem é verbo; leu é substantivo.",
        "Leu é futuro só por nomear ação.",
        "Não há pista de tempo."
      ],
      "answer": 0,
      "explanation": "Separa verbo e referência temporal explícita.",
      "optionRationales": [
        "Separa verbo e referência temporal explícita.",
        "Inverte classes e funções das palavras.",
        "O fato está situado no passado.",
        "Ontem é pista explícita."
      ],
      "recoverySectionIds": [
        "tempo"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cf02.q03",
      "prompt": "Em Amanhã a turma apresenta o trabalho, o que se pode concluir?",
      "options": [
        "Presente com amanhã torna a frase obrigatoriamente impossível.",
        "O trabalho necessariamente é apresentado neste segundo.",
        "Amanhã transforma apresenta em substantivo.",
        "Apresenta tem forma do presente, mas amanhã situa o acontecimento no futuro da fala."
      ],
      "answer": 3,
      "explanation": "Conserva forma e contexto.",
      "optionRationales": [
        "A aula ensina esse uso contextual.",
        "Ignora amanhã.",
        "Apresenta continua verbo.",
        "Conserva forma e contexto."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cf02.q04",
      "prompt": "Em A equipe lê todos os dias, há leitura necessariamente ocorrendo neste segundo?",
      "options": [
        "Sim; todo presente só indica este segundo.",
        "Não; todos os dias apresenta hábito.",
        "Não; lê é sempre passado.",
        "Sim; todos os dias exclui hábito."
      ],
      "answer": 1,
      "explanation": "O contexto é habitual.",
      "optionRationales": [
        "Generaliza o presente.",
        "O contexto é habitual.",
        "Lê tem forma do presente.",
        "A expressão marca hábito."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cf02.q05",
      "prompt": "Qual par conserva pessoa e número ensinados?",
      "options": [
        "Nós lemos: terceira singular; eu leio: primeira plural.",
        "Eu leio: terceira plural; nós lemos: primeira singular.",
        "Ela lê: primeira plural; elas leem: terceira singular.",
        "Eu leio: primeira singular; nós lemos: primeira plural."
      ],
      "answer": 3,
      "explanation": "Eu/nós incluem quem fala e distinguem singular/plural.",
      "optionRationales": [
        "Nós é primeira plural; eu, primeira singular.",
        "Inverte as duas descrições.",
        "Ela/elas são terceira singular/plural.",
        "Eu/nós incluem quem fala e distinguem singular/plural."
      ],
      "recoverySectionIds": [
        "pessoa"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cf02.q06",
      "prompt": "Como transformar Ela lê o roteiro todos os dias para sujeito Elas, segundo o exemplo?",
      "options": [
        "Elas lê o roteiro todos os dias.",
        "Elas leem o roteiro todos os dias.",
        "Elas lerá o roteiro todos os dias.",
        "Elas leitura o roteiro todos os dias."
      ],
      "answer": 1,
      "explanation": "Leem corresponde à terceira pessoa plural no uso dado.",
      "optionRationales": [
        "Lê mantém singular.",
        "Leem corresponde à terceira pessoa plural no uso dado.",
        "Lerá é futuro singular, sem preservar o caso.",
        "Leitura é substantivo."
      ],
      "recoverySectionIds": [
        "ex-numero"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cf02.q07",
      "prompt": "Um estudante excluiu o verbo de A turma está atenta por não haver ação. Qual retomada corrige?",
      "options": [
        "Reconhecer está como verbo de estado e atenta como adjetivo.",
        "Chamar atenta de verbo e retirar está.",
        "Definir verbo exclusivamente como ação.",
        "Tratar turma como verbo por ser sujeito."
      ],
      "answer": 0,
      "explanation": "O contraste ação/estado conserva o verbo expresso.",
      "optionRationales": [
        "O contraste ação/estado conserva o verbo expresso.",
        "Atenta caracteriza turma.",
        "A própria frase apresenta estado por verbo.",
        "Turma é substantivo; sujeito é função."
      ],
      "recoverySectionIds": [
        "ex-estado"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "cf02.q08",
      "prompt": "Em Amanhã a equipe entrega o material, qual conclusão ignora uma pista ensinada?",
      "options": [
        "Entrega continua verbo.",
        "Amanhã situa a entrega depois da fala.",
        "A entrega ocorre necessariamente agora porque entrega tem forma do presente.",
        "Forma verbal e referência temporal são perguntas diferentes."
      ],
      "answer": 2,
      "explanation": "Ignora o futuro explícito em amanhã.",
      "optionRationales": [
        "A classe não muda nesse uso.",
        "Conserva a pista.",
        "Ignora o futuro explícito em amanhã.",
        "Conserva a distinção ensinada."
      ],
      "recoverySectionIds": [
        "contexto"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cf02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cf02.q01": [
        {
          "missionId": "draft.cf02",
          "sectionId": "entrada"
        }
      ],
      "cf02.q02": [
        {
          "missionId": "draft.cf02",
          "sectionId": "tempo"
        }
      ],
      "cf02.q03": [
        {
          "missionId": "draft.cf02",
          "sectionId": "contexto"
        }
      ],
      "cf02.q04": [
        {
          "missionId": "draft.cf02",
          "sectionId": "contexto"
        }
      ],
      "cf02.q05": [
        {
          "missionId": "draft.cf02",
          "sectionId": "pessoa"
        }
      ],
      "cf02.q06": [
        {
          "missionId": "draft.cf02",
          "sectionId": "ex-numero"
        }
      ],
      "cf02.q07": [
        {
          "missionId": "draft.cf02",
          "sectionId": "ex-estado"
        }
      ],
      "cf02.q08": [
        {
          "missionId": "draft.cf02",
          "sectionId": "contexto"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer pedagógico independente concluído sem correções",
  "objectives": {
    "O1": "Distinguir classe, forma verbal e função no contexto.",
    "O2": "Aplicar análise de verbo e grupos completos.",
    "O3": "Comparar casos sem regra universal.",
    "O4": "Retomar ensino e corrigir a pergunta confundida."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar verbo/grupos e retomar a seção de ensino."
  },
  "limits": [
    "Plano 05/bloco portuguese.syntax; BB/CAIXA históricos/referenceOnly; recorte, não cobertura integral.",
    "Texto, frases e itens autorais; sem atribuição normativa fictícia ou norma jurídica mutável.",
    "Não todos os modos/tempos/classes/sujeitos/complementos, voz passiva, concordância, regência ou crase.",
    "Revisão/Chefe não são avaliação independente ou prova de retenção.",
    "Sem XP/ordem editorial/runtime/push/ativação/merge/deploy/D1; parecer não é aceite humano."
  ]
};
export const ARITHMETIC = [];
