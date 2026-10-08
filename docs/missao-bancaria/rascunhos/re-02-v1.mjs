// Textos e exercícios autorais; rascunho local desativado.
export const SOURCES = [
  {
    "id": "incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  }
];
export const RE02_DRAFT = {
  "id": "draft.re02",
  "topicId": "draft.re02",
  "editorialKey": "RE-02",
  "candidateBlockId": "portuguese.meaning-writing",
  "title": "Escrita clara: encurtar sem perder condições",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
  "sourceIds": [
    "incaper.clareza"
  ],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. Clareza com informação",
      "body": "Incaper11.1D/E orienta clareza e explicação de termos para o público. Aqui aplicamos revisão a frases autorais: encurtar não pode excluir condições relevantes. A finalidade não é declarar que toda repetição seja errada nem que todo texto técnico precise evitar todos os termos.",
      "type": "explanation",
      "sourceIds": [
        "incaper.clareza"
      ]
    },
    {
      "id": "condicoes",
      "heading": "2. Somente e se importam",
      "body": "Somente duas leitoras receberão o roteiro se concluírem a revisão informa limitação de participantes e condição. Duas leitoras receberão o roteiro não conserva esses limites: apaga somente e se concluírem a revisão. Não tratar palavras curtas como automaticamente dispensáveis.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "repeticao",
      "heading": "3. Referência pode justificar repetir",
      "body": "No caso de duas pessoas e pronome incerto, repetir o nome indicado pela intenção pode esclarecer, como em SM03. Não eliminar toda repetição por regra automática. Se a intenção é a revisora entregar o roteiro, nomeá-la preserva essa informação; trocar para ambas inventa participação conjunta.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "termos",
      "heading": "4. Explicar sem inventar definição",
      "body": "Se um texto usa um termo desconhecido do público, o manual recomenda explicação concisa/glossário. A explicação deve ser pertinente e verificável, não um significado inventado. Neste lote não se cobra definição de produto real; os exemplos usam o termo marcador com sentido explicitamente definido pelo próprio exercício.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-condicao",
      "heading": "5. Exemplo resolvido: manter limite",
      "body": "Somente duas leitoras receberão o roteiro se concluírem a revisão. Reescrita: Se concluírem a revisão, somente duas leitoras receberão o roteiro. As informações essenciais do caso são conservadas. Duas leitoras receberão apaga restrição e condição.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-nome",
      "heading": "6. Exemplo resolvido: clareza de pessoa",
      "body": "Intenção dada: a revisora entregou. Em trecho com organizadora/revisora, substitua referência incerta pelo nome a revisora. A repetição serve à clareza nesse caso. Ambas entregaram acrescenta participação não dada.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-termo",
      "heading": "7. Exemplo resolvido: definição dada",
      "body": "No exercício, marcador significa uma etiqueta colorida usada para localizar uma seção. Para esse público hipotético, marcador (etiqueta colorida para localizar uma seção) explicita a definição fornecida. Marcador significa aprovação automática de crédito inventaria outra definição e um fato real indevido.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. Próximo recorte",
      "body": "Este par inicial não completa escrita formal. Falta o recorte integrador RE03 com transformações delimitadas, revisão e Chefe; voz passiva/discurso indireto/relativas precisam ensino próprio. Não usar concisão para retirar ressalvas nem declarar toda palavra repetida proibida.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Sentido próximo conserva uma ideia semelhante neste contexto; oposição contrasta uma dimensão informada, não todo o universo. Negação rejeita a afirmação, sem escolher automaticamente um extremo contrário. Ambiguidade é possibilidade de mais de uma leitura no trecho; reescrita para clareza explicita a leitura pretendida sem acrescentar fatos.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Recuperar pelo trecho",
      "body": "Sublinhe ação, referência, quantidade, tempo e negação. Teste a alternativa dentro da frase e explique o que ela mantém ou muda. Se há mais de uma leitura, não escolha a intenção real sem contexto; compare uma reescrita com a intenção explicitada.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "O que a frase afirma ou nega?",
    "Qual dimensão a troca mantém ou muda?",
    "A intenção da reescrita foi informada?"
  ],
  "questions": [
    {
      "id": "re02.q01",
      "prompt": "Qual reescrita preserva somente e a condição de conclusão no caso dado?",
      "options": [
        "Todas as leitoras receberão o roteiro sem condição.",
        "Duas leitoras receberão o roteiro.",
        "Se concluírem a revisão, somente duas leitoras receberão o roteiro.",
        "Somente duas leitoras receberam o roteiro ontem."
      ],
      "answer": 2,
      "explanation": "Mantém a restrição e a condição, deslocando o grupo condicional.",
      "optionRationales": [
        "Muda quantidade e exclui condição.",
        "Apaga limitação e condição.",
        "Mantém a restrição e a condição, deslocando o grupo condicional.",
        "Muda tempo e apaga condição."
      ],
      "recoverySectionIds": [
        "condicoes"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re02.q02",
      "prompt": "Por que retirar somente não é economia neutra nesse enunciado?",
      "options": [
        "Apaga a restrição explicitada.",
        "Somente nunca altera alcance.",
        "Toda palavra curta é dispensável.",
        "A restrição depende só do tamanho da fonte."
      ],
      "answer": 0,
      "explanation": "Somente limita o alcance no caso dado.",
      "optionRationales": [
        "Somente limita o alcance no caso dado.",
        "Pode limitar alcance como neste caso.",
        "Tamanho não decide relevância.",
        "Fonte visual não cria essa informação."
      ],
      "recoverySectionIds": [
        "condicoes"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "re02.q03",
      "prompt": "No caso de duas pessoas com referente incerto, que procedimento pode favorecer clareza?",
      "options": [
        "Escolher referência aleatória como fato.",
        "Proibir qualquer repetição em todo texto.",
        "Substituir ambos os nomes por ela sem contexto.",
        "Repetir o nome da pessoa indicada pela intenção fornecida."
      ],
      "answer": 3,
      "explanation": "A repetição pode esclarecer a referência no caso.",
      "optionRationales": [
        "Intenção precisa ser respeitada.",
        "Não é regra universal do manual nem do lote.",
        "Pode preservar a dúvida.",
        "A repetição pode esclarecer a referência no caso."
      ],
      "recoverySectionIds": [
        "repeticao"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re02.q04",
      "prompt": "A intenção dada é a revisora ter entregado. Que reescrita acrescenta participação não informada?",
      "options": [
        "A revisora entregou o roteiro.",
        "Ambas entregaram o roteiro.",
        "A revisora realizou a entrega do roteiro.",
        "Quem entregou foi a revisora, conforme a intenção dada."
      ],
      "answer": 1,
      "explanation": "Ambas inclui também outra pessoa, não indicada pela intenção.",
      "optionRationales": [
        "Nomeia só a pessoa pretendida.",
        "Ambas inclui também outra pessoa, não indicada pela intenção.",
        "Só a revisora permanece indicada como agente, sem participação conjunta.",
        "Indica a pessoa dada, sem participação conjunta."
      ],
      "recoverySectionIds": [
        "ex-nome"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "re02.q05",
      "prompt": "No exercício, marcador significa etiqueta colorida para localizar seção. Qual explicação preserva a definição dada?",
      "options": [
        "Marcador: etiqueta colorida usada para localizar uma seção.",
        "Marcador: aprovação automática de crédito.",
        "Marcador: prova de que todas as pessoas concluíram.",
        "Marcador: um dia de prazo obrigatório."
      ],
      "answer": 0,
      "explanation": "Reproduz a definição fornecida no cenário autoral.",
      "optionRationales": [
        "Reproduz a definição fornecida no cenário autoral.",
        "Inventa produto/efeito não dado.",
        "Acrescenta conclusão de pessoas.",
        "Prazo não foi definido."
      ],
      "recoverySectionIds": [
        "termos"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "re02.q06",
      "prompt": "Qual cuidado segue a orientação pertinente de explicar termos?",
      "options": [
        "Eliminar toda palavra técnica mesmo com explicação necessária.",
        "Criar qualquer definição para economizar leitura.",
        "Explicar de modo conciso e verificável, sem inventar significado.",
        "Proibir qualquer glossário."
      ],
      "answer": 2,
      "explanation": "Explicação deve ajudar compreensão e ser pertinente.",
      "optionRationales": [
        "A orientação admite explicação/glossário quando necessário.",
        "Definição inventada não preserva informação.",
        "Explicação deve ajudar compreensão e ser pertinente.",
        "Glossário pode ajudar."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "re02.q07",
      "prompt": "Você encurtou a frase excluindo se concluírem a revisão. O que precisa recuperar?",
      "options": [
        "Somente a primeira letra do roteiro.",
        "A condição que limita quando receberão o roteiro.",
        "A regra de toda condição ser redundante.",
        "A ideia de recebimento sem nenhuma condição."
      ],
      "answer": 1,
      "explanation": "O caso condiciona o recebimento à conclusão.",
      "optionRationales": [
        "Letras não recuperam conteúdo.",
        "O caso condiciona o recebimento à conclusão.",
        "A condição é informação relevante.",
        "Isso seria a mudança indevida."
      ],
      "recoverySectionIds": [
        "ex-condicao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "re02.q08",
      "prompt": "Que limite acompanha os exemplos de marcador?",
      "options": [
        "Completa toda escrita formal do edital.",
        "Prova definição universal de marcador em qualquer texto.",
        "Autoriza inventar direitos de crédito.",
        "A definição é do cenário autoral, sem cobrir todos os usos lexicais ou produtos reais."
      ],
      "answer": 3,
      "explanation": "O exercício delimita o sentido, não uma definição universal externa.",
      "optionRationales": [
        "É um recorte inicial.",
        "Há outros contextos possíveis.",
        "Não trata de direitos reais.",
        "O exercício delimita o sentido, não uma definição universal externa."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O1"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "re02-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "re02.q01": [
        {
          "missionId": "draft.re02",
          "sectionId": "condicoes"
        }
      ],
      "re02.q02": [
        {
          "missionId": "draft.re02",
          "sectionId": "condicoes"
        }
      ],
      "re02.q03": [
        {
          "missionId": "draft.re02",
          "sectionId": "repeticao"
        }
      ],
      "re02.q04": [
        {
          "missionId": "draft.re02",
          "sectionId": "ex-nome"
        }
      ],
      "re02.q05": [
        {
          "missionId": "draft.re02",
          "sectionId": "termos"
        }
      ],
      "re02.q06": [
        {
          "missionId": "draft.re02",
          "sectionId": "entrada"
        }
      ],
      "re02.q07": [
        {
          "missionId": "draft.re02",
          "sectionId": "ex-condicao"
        }
      ],
      "re02.q08": [
        {
          "missionId": "draft.re02",
          "sectionId": "limites"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente favorável, precisão RE01q7 aplicada nos comentários",
  "objectives": {
    "O1": "Reconhecer relação e referência no trecho.",
    "O2": "Preservar a ideia básica ou a intenção explicitada.",
    "O3": "Evitar oposição absoluta e inferência não sustentada.",
    "O4": "Retomar pistas e condição ignorada."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Conferir contexto/referência/negação e comparar o conteúdo da reescrita."
  },
  "limits": [
    "Plano05/documento120, bloco portuguese.meaning-writing existente. Perfis históricos/referenceOnly, sem novo currículo/fase formal.",
    "Ensino e textos autorais; Incaper11.1D/E somente orientação de clareza/evitar ambiguidade, não tabela lexical normativa.",
    "Relações e reescritas delimitadas; não ensinar sinônimos perfeitos universais, toda polissemia/homonímia, pressuposição, todas as figuras, passiva ou colocação pronominal.",
    "Sem produção/D1/push/ativação/merge/deploy; não prova edital completo, retenção ou aceite humano."
  ]
};
export const ARITHMETIC = [];
