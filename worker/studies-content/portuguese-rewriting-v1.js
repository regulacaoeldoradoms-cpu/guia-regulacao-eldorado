// Gerado por node worker/scripts/studies-re-candidate.mjs --write. Não editar.
// Rascunhos RE locais. Desativado; sem autorização de ativação/publicação.
export const RE_MISSIONS = Object.freeze([
  {
    "id": "portuguese.meaning.rewriting.criterios",
    "topicId": "portuguese.meaning.rewriting.criterios",
    "contentVersion": 1,
    "order": 127,
    "title": "Reescrita: conferir conteúdo e forma separadamente",
    "shortTitle": "RE-01",
    "kind": "lesson",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-re-intro-r1",
      "releaseSequence": 18,
      "changeImpact": "new"
    },
    "sourceIds": [
      "re.re01.incaper.clareza",
      "re.re01.authorial.re01"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Duas perguntas",
        "body": "Uma reescrita pode ser gramaticalmente possível e alterar a mensagem; pode também conservar uma ideia básica mas não seguir o padrão formal pedido. Separe as perguntas: o conteúdo dado foi preservado? A forma segue a condição do exercício? Retomamos SM/CN/CP, sem ensinar toda transformação sintática.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "conteudo",
        "heading": "2. Conferir informações",
        "body": "A turma não revisou o roteiro ontem informa agente, negação, ação, objeto e dia. Ontem, a turma não revisou o roteiro conserva essas informações e muda a ordem. A turma revisará o roteiro amanhã muda negação, tempo e dia, apesar de poder ser uma frase gramatical.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "forma",
        "heading": "3. Conferir padrão explicitado",
        "body": "No padrão formal de CP02, início de oração sem atrator usa Lembro-me do aviso. Me lembro do aviso pode conservar a ideia básica na fala, mas não segue a orientação formal de início adotada naquele exercício. Não confundir diferença de registro com inexistência de sentido ou condenação de toda fala.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "numero",
        "heading": "4. Alteração pedida não é equivalência total",
        "body": "Se o enunciado pede passar A leitora atenta revisou o texto para duas leitoras, a resposta será As leitoras atentas revisaram o texto, preservando ação/objeto e ajustando artigo/adjetivo/verbo. A quantidade foi alterada de propósito; não chamar as frases de totalmente equivalentes em todos os fatos.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-conteudo",
        "heading": "5. Exemplo resolvido: posição de ontem",
        "body": "Original: A turma não revisou o roteiro ontem. Reescrita: Ontem, a turma não revisou o roteiro. Marque os mesmos agente/não/revisou/roteiro/ontem. Deslocar ontem aqui não muda a informação temporal; não extrair obrigação de que qualquer deslocamento seja neutro.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-forma",
        "heading": "6. Exemplo resolvido: padrão formal",
        "body": "Pedido: início formal sem atrator com lembro/me. Lembro-me do aviso segue CP02. Me lembro do aviso conserva a ideia básica no exemplo de fala, mas o pedido formal distingue as opções. A correção aplica uma condição declarada, não um juízo sobre pessoas.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-numero",
        "heading": "7. Exemplo resolvido: duas leitoras",
        "body": "A leitora atenta revisou o texto passa para As leitoras atentas revisaram o texto sob o pedido de plural. Ajuste a/as, leitora/leitoras, atenta/atentas e revisou/revisaram. O texto continua singular porque o pedido não mandou multiplicar o objeto. A mudança numérica do sujeito é intencional.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "limites",
        "heading": "8. O que não está concluído",
        "body": "Não ensina toda voz passiva, discurso indireto, relativos, nominalização, elipse ou período composto. Equivalência contextual e correção formal são critérios distintos. Toda mudança solicitada deve ser identificada, sem apagar negação/quantidade por economia.",
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
        "id": "q.re01.q01",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "Qual reescrita mantém o conteúdo de A turma não revisou o roteiro ontem no caso fornecido?",
        "options": [
          "A turma revisará o roteiro amanhã.",
          "Ontem, a turma não revisou o roteiro.",
          "A turma revisou o roteiro ontem.",
          "Todas as turmas revisaram os roteiros amanhã."
        ],
        "answer": 1,
        "explanation": "Muda a ordem, conservando agente/negação/ação/objeto/dia.",
        "optionRationales": [
          "Muda tempo, dia e negação.",
          "Muda a ordem, conservando agente/negação/ação/objeto/dia.",
          "Apaga a negação.",
          "Muda quantidade, objeto e tempo."
        ]
      },
      {
        "id": "q.re01.q02",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "Por que uma frase gramaticalmente possível pode falhar como equivalente?",
        "options": [
          "Toda frase longa é equivalente a outra.",
          "Gramática possível garante equivalência total.",
          "O número de letras é o único critério.",
          "Pode mudar informações afirmadas ou negadas."
        ],
        "answer": 3,
        "explanation": "Conteúdo precisa ser conferido separadamente da forma.",
        "optionRationales": [
          "Comprimento não garante equivalência.",
          "São critérios diferentes.",
          "Letras não provam conteúdo.",
          "Conteúdo precisa ser conferido separadamente da forma."
        ]
      },
      {
        "id": "q.re01.q03",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "No pedido de CP02 para início formal sem atrator com lembro/me, qual forma segue a orientação adotada?",
        "options": [
          "Lembro-me do aviso.",
          "Me lembro do aviso, iniciando com átono.",
          "Me-lembro do aviso.",
          "Lembro me do aviso, como ênclise sem hífen."
        ],
        "answer": 0,
        "explanation": "Verbo antes de átono com hífen segue o caso formal ensinado.",
        "optionRationales": [
          "Verbo antes de átono com hífen segue o caso formal ensinado.",
          "Não segue a orientação de início dada.",
          "Não é a ligação de ênclise ensinada.",
          "Falta o hífen de ligação da ênclise."
        ]
      },
      {
        "id": "q.re01.q04",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "O pedido muda uma leitora para duas, mantendo ação e objeto. Qual resposta ajusta a concordância?",
        "options": [
          "A leitoras atentos revisou os textos obrigatoriamente.",
          "As leitora atenta revisou o texto.",
          "As leitoras atentas revisaram o texto.",
          "As leitoras atentas revisou o texto."
        ],
        "answer": 2,
        "explanation": "Artigo/nome/adjetivo/verbo acompanham o sujeito plural; objeto permanece no pedido.",
        "optionRationales": [
          "Não segue concordância e muda objeto sem pedido.",
          "Não ajusta número dos termos.",
          "Artigo/nome/adjetivo/verbo acompanham o sujeito plural; objeto permanece no pedido.",
          "O verbo não acompanha o sujeito plural dado."
        ]
      },
      {
        "id": "q.re01.q05",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "Ao mudar uma leitora para duas conforme o enunciado, as frases ficam equivalentes em toda quantidade?",
        "options": [
          "Não: toda informação deve obrigatoriamente ser apagada.",
          "Sim: singular e plural sempre dizem a mesma quantidade.",
          "Sim: só o objeto pode mudar quantidade.",
          "Não: a quantidade mudou de propósito conforme o pedido."
        ],
        "answer": 3,
        "explanation": "A mudança pedida deve ser reconhecida, não ocultada.",
        "optionRationales": [
          "Não há pedido de apagar toda informação.",
          "Singular/plural diferem na hipótese dada.",
          "Sujeito também pode mudar quantidade.",
          "A mudança pedida deve ser reconhecida, não ocultada."
        ]
      },
      {
        "id": "q.re01.q06",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "Qual cuidado respeita a comparação formal e fala de Me lembro / Lembro-me no exemplo?",
        "options": [
          "Declarar a fala inteira sem sentido.",
          "Distinguir orientação formal pedida da ideia básica e da ocorrência na fala.",
          "Dispensar a condição formal do exercício.",
          "Afirmar equivalência de todas as regras em todo registro."
        ],
        "answer": 1,
        "explanation": "A condição formal e a ideia comunicada são perguntas distintas.",
        "optionRationales": [
          "Não é conclusão permitida.",
          "A condição formal e a ideia comunicada são perguntas distintas.",
          "A condição foi explicitada.",
          "Registros e condições não são todos iguais."
        ]
      },
      {
        "id": "q.re01.q07",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "Você apagou não para encurtar a frase original. Que recuperação é pertinente?",
        "options": [
          "Afirmar que não é sempre redundante.",
          "Contar apenas letras.",
          "Conferir a negação e comparar o que passou a ser afirmado.",
          "Trocar sujeito sem olhar conteúdo."
        ],
        "answer": 2,
        "explanation": "Retirar a palavra ‘não’ muda a mensagem negativa.",
        "optionRationales": [
          "Não nega a afirmação neste caso.",
          "Letras não resolvem essa mudança.",
          "Retirar a palavra ‘não’ muda a mensagem negativa.",
          "Mudar sujeito não recupera a negação."
        ]
      },
      {
        "id": "q.re01.q08",
        "topicId": "portuguese.meaning.rewriting.criterios",
        "prompt": "No plural pedido para as leitoras, por que o texto pode continuar singular?",
        "options": [
          "O pedido alterou o sujeito, não a quantidade do objeto.",
          "Todo objeto deve seguir o número do sujeito.",
          "Texto não pode estar no singular.",
          "Revisaram exige dois objetos obrigatoriamente."
        ],
        "answer": 0,
        "explanation": "Não se deve acrescentar mudança de objeto que não foi pedida.",
        "optionRationales": [
          "Não se deve acrescentar mudança de objeto que não foi pedida.",
          "Não existe essa regra universal.",
          "O objeto singular cabe no caso.",
          "O verbo não impõe quantidade de objetos assim."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "re01-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.re01.q01": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "conteudo"
          }
        ],
        "q.re01.q02": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "entrada"
          }
        ],
        "q.re01.q03": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "forma"
          }
        ],
        "q.re01.q04": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "numero"
          }
        ],
        "q.re01.q05": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "ex-numero"
          }
        ],
        "q.re01.q06": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "ex-forma"
          }
        ],
        "q.re01.q07": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "ex-conteudo"
          }
        ],
        "q.re01.q08": [
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "ex-numero"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.re01",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.pronouns.boss",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.rewriting.clareza",
    "topicId": "portuguese.meaning.rewriting.clareza",
    "contentVersion": 1,
    "order": 128,
    "title": "Escrita clara: encurtar sem perder condições",
    "shortTitle": "RE-02",
    "kind": "lesson",
    "objective": "Interpretar relações de sentido e reescrever os textos fornecidos, preservando contexto, referência e informação.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-re-intro-r1",
      "releaseSequence": 18,
      "changeImpact": "new"
    },
    "sourceIds": [
      "re.re02.incaper.clareza",
      "re.re02.authorial.re02"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Clareza com informação",
        "body": "Incaper11.1D/E orienta clareza e explicação de termos para o público. Aqui aplicamos revisão a frases autorais: encurtar não pode excluir condições relevantes. A finalidade não é declarar que toda repetição seja errada nem que todo texto técnico precise evitar todos os termos.",
        "type": "explanation",
        "sourceIds": [
          "re.re02.incaper.clareza"
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
        "id": "q.re02.q01",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q02",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q03",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q04",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q05",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q06",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q07",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      },
      {
        "id": "q.re02.q08",
        "topicId": "portuguese.meaning.rewriting.clareza",
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
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "re02-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.re02.q01": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "condicoes"
          }
        ],
        "q.re02.q02": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "condicoes"
          }
        ],
        "q.re02.q03": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "repeticao"
          }
        ],
        "q.re02.q04": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "ex-nome"
          }
        ],
        "q.re02.q05": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "termos"
          }
        ],
        "q.re02.q06": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "entrada"
          }
        ],
        "q.re02.q07": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "ex-condicao"
          }
        ],
        "q.re02.q08": [
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.re02",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.rewriting.criterios",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.rewriting.integrada",
    "topicId": "portuguese.meaning.rewriting.integrada",
    "contentVersion": 1,
    "order": 129,
    "title": "Reescrita integrada: corrigir o ponto sem alterar o recado",
    "shortTitle": "RE-03",
    "kind": "lesson",
    "objective": "Reescrever nos casos explicitados, preservando informações e aplicando condições gramaticais já ensinadas.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-re-intro-r1",
      "releaseSequence": 18,
      "changeImpact": "new"
    },
    "sourceIds": [
      "re.re03.incaper.clareza",
      "re.re03.senado.concordancia",
      "re.re03.senado.rg.assistir",
      "re.re03.senado.crase",
      "re.re03.funag.colocacao",
      "re.re03.authorial.re03"
    ],
    "sections": [
      {
        "id": "entrada",
        "heading": "1. Ler o pedido antes de corrigir",
        "body": "A tarefa pode pedir manter informação e corrigir um ponto gramatical. Identifique o agente, a ação, tempo/quantidade/negação e a condição do erro. Só reaplicamos casos anteriores: sujeito simples, presenciar com a, encontro com artigo definido e negativa sem pausa. Não supor que qualquer mudança deixe tudo equivalente.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "concordancia",
        "heading": "2. Corrigir sem mudar o sujeito",
        "body": "A frase de exercício Os leitores atentos leu o roteiro ontem pretende informar leitores plurais e leitura passada. CN ensinou verbo ligado ao núcleo do sujeito: corrija para Os leitores atentos leram o roteiro ontem. Mantenha sujeito plural, objeto singular e ontem; trocar para O leitor leu mudaria a quantidade pretendida.",
        "type": "explanation",
        "sourceIds": [
          "re.re03.senado.concordancia"
        ]
      },
      {
        "id": "vinculo",
        "heading": "3. Preposição e artigo do caso",
        "body": "Pedido: padrão de assistir no sentido de presenciar; grupo definido a apresentação. A frase de exercício A aluna assistiu a apresentação indicada deve representar a preposição a e o artigo a: A aluna assistiu à apresentação indicada. Não acrescentar de nem trocar para a uma apresentação, pois o pedido manteve o grupo definido.",
        "type": "explanation",
        "sourceIds": [
          "re.re03.senado.rg.assistir",
          "re.re03.senado.crase"
        ]
      },
      {
        "id": "negativa",
        "heading": "4. Preservar não e o registro",
        "body": "Pedido formal: verbo simples lembro, negativa não sem pausa. A frase de exercício Não lembro-me do aviso deve ficar Não me lembro do aviso, conforme CP02. Não resolver apagando não: isso alteraria a mensagem e a condição. Sem extrapolar para pausas/locuções não ensinadas.",
        "type": "explanation",
        "sourceIds": [
          "re.re03.funag.colocacao"
        ]
      },
      {
        "id": "ex-concordancia",
        "heading": "5. Exemplo resolvido: leitoras",
        "body": "As leitoras atentas revisou o roteiro hoje: o pedido informa leitoras plurais, revisão passada e hoje. Corrija somente o vínculo verbal para As leitoras atentas revisaram o roteiro hoje. Não tornar roteiro plural sem pedido nem trocar hoje por amanhã.",
        "type": "worked-example",
        "sourceIds": [
          "re.re03.senado.concordancia"
        ]
      },
      {
        "id": "ex-vinculo",
        "heading": "6. Exemplo resolvido: oficina definida",
        "body": "No padrão de presenciar, A turma assistiu a oficina indicada deve conservar oficina com artigo definido a. Combine a preposição com esse artigo: A turma assistiu à oficina indicada. Com artigo uma seria a uma oficina, mas isso é outra determinação não pedida aqui.",
        "type": "worked-example",
        "sourceIds": [
          "re.re03.senado.rg.assistir",
          "re.re03.senado.crase"
        ]
      },
      {
        "id": "ex-negativa",
        "heading": "7. Exemplo resolvido: me",
        "body": "Não engano-me neste exemplo, sob pedido formal de verbo simples e negativa sem pausa, passa a Não me engano neste exemplo. O não permanece; me passa antes do verbo. Apagar não e usar Engano-me não preserva a negação.",
        "type": "worked-example",
        "sourceIds": [
          "re.re03.funag.colocacao"
        ]
      },
      {
        "id": "retomadas",
        "heading": "8. Retomar o ponto pertinente",
        "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [CN-01](cn-01-v1.md#nucleo) · [CR-01](cr-01-v1.md#encontro) · [CP-02](cp-02-v1.md#negativa)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "RE-01",
                "missionId": "portuguese.meaning.rewriting.criterios",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-02",
                "missionId": "portuguese.meaning.rewriting.clareza",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "CN-01",
                "missionId": "portuguese.syntax.concordance.verbal",
                "sectionId": "nucleo",
                "wholeLesson": false
              },
              {
                "text": " · "
              },
              {
                "text": "CR-01",
                "missionId": "portuguese.syntax.crase.encontro",
                "sectionId": "encontro",
                "wholeLesson": false
              },
              {
                "text": " · "
              },
              {
                "text": "CP-02",
                "missionId": "portuguese.meaning.pronouns.formal",
                "sectionId": "negativa",
                "wholeLesson": false
              }
            ]
          }
        ]
      },
      {
        "id": "limites",
        "heading": "9. Correção delimitada",
        "body": "Os erros foram construídos para exercitar condições específicas e não são frases de pessoas reais. Não ensina todos os regimes de assistir, sujeitos coletivos, crase facultativa, todos os atratores ou registro único universal. Preservar a informação indicada não exige conservar a forma gramatical incorreta.",
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
        "id": "q.re03.q01",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Pedido: manter leitores plurais, passado e ontem; corrigir Os leitores atentos leu o roteiro ontem. Qual resposta atende?",
        "options": [
          "Os leitores atentos leram os roteiros ontem, multiplicando obrigatoriamente o objeto.",
          "O leitor atento leu o roteiro ontem.",
          "Os leitores atentos lerão o roteiro amanhã.",
          "Os leitores atentos leram o roteiro ontem."
        ],
        "answer": 3,
        "explanation": "Leram acompanha o sujeito plural e conserva as demais informações pedidas.",
        "optionRationales": [
          "Acrescenta mudança do objeto não pedida.",
          "Muda quantidade do sujeito.",
          "Muda tempo e dia.",
          "Leram acompanha o sujeito plural e conserva as demais informações pedidas."
        ]
      },
      {
        "id": "q.re03.q02",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Na correção de As leitoras atentas revisou para As leitoras atentas revisaram, qual vínculo orienta a forma verbal?",
        "options": [
          "O objeto singular roteiro obrigatoriamente.",
          "O núcleo plural leitoras do sujeito.",
          "Somente a palavra hoje.",
          "O comprimento do adjetivo."
        ],
        "answer": 1,
        "explanation": "O verbo concorda com o sujeito de núcleo leitoras neste caso simples.",
        "optionRationales": [
          "Objeto não determina essa concordância.",
          "O verbo concorda com o sujeito de núcleo leitoras neste caso simples.",
          "Hoje indica tempo, não número do sujeito.",
          "Comprimento não decide a flexão."
        ]
      },
      {
        "id": "q.re03.q03",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Presenciar no padrão ensinado, com oficina e artigo a definido: qual correção representa preposição e artigo?",
        "options": [
          "A turma assistiu a uma oficina, conservando obrigatoriamente a mesma determinação.",
          "A turma assistiu de oficina indicada.",
          "A turma assistiu à oficina indicada.",
          "A turma assistiu ao oficina indicada."
        ],
        "answer": 2,
        "explanation": "A preposição a encontra o artigo a do grupo definido.",
        "optionRationales": [
          "Uma altera a determinação mantida pelo pedido.",
          "De não é o vínculo do caso.",
          "A preposição a encontra o artigo a do grupo definido.",
          "O não é o artigo do grupo feminino dado."
        ]
      },
      {
        "id": "q.re03.q04",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Por que trocar a oficina definida por uma oficina não é só corrigir o sinal no pedido dado?",
        "options": [
          "Muda a determinação do grupo nominal.",
          "Uma e a são sempre o mesmo artigo.",
          "Qualquer palavra feminina exige à uma.",
          "A determinação nunca afeta informação."
        ],
        "answer": 0,
        "explanation": "O pedido explicitou o artigo definido a; uma é outra escolha.",
        "optionRationales": [
          "O pedido explicitou o artigo definido a; uma é outra escolha.",
          "São artigos diferentes.",
          "Não ocorre a+a diante de uma neste caso.",
          "O exercício pede conservar essa informação."
        ]
      },
      {
        "id": "q.re03.q05",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Pedido formal: negativa não sem pausa e verbo simples lembro. Qual correção preserva o caso de Não lembro-me do aviso?",
        "options": [
          "Lembro-me do aviso, apagando não.",
          "Não me lembro do aviso.",
          "Me lembro do aviso, apagando não.",
          "Não lembro me do aviso, como ênclise sem hífen."
        ],
        "answer": 1,
        "explanation": "Mantém negativa e põe me antes do verbo conforme CP02.",
        "optionRationales": [
          "Apaga a negação.",
          "Mantém negativa e põe me antes do verbo conforme CP02.",
          "Apaga a negação e não representa o caso dado.",
          "Não aplica a próclise requerida no caso."
        ]
      },
      {
        "id": "q.re03.q06",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Qual condição deve ser conferida antes de aplicar a correção Não me engano neste recorte?",
        "options": [
          "Toda fala brasileira ser inválida.",
          "Só a quantidade de substantivos.",
          "Todo infinitivo admitir apenas ênclise.",
          "Registro formal, verbo simples e negativa sem pausa."
        ],
        "answer": 3,
        "explanation": "A regra reaplicada foi delimitada a essas condições.",
        "optionRationales": [
          "Não é o alcance da orientação formal.",
          "Contagem não estabelece o caso.",
          "O infinitivo tem outro ensino e pode admitir ambas as posições.",
          "A regra reaplicada foi delimitada a essas condições."
        ]
      },
      {
        "id": "q.re03.q07",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Você corrigiu o verbo, mas mudou hoje para amanhã sem pedido. O que precisa recuperar?",
        "options": [
          "A informação temporal que devia ser conservada.",
          "A regra de todo plural exigir futuro.",
          "O direito de apagar toda informação para corrigir gramática.",
          "Só o número de letras de amanhã."
        ],
        "answer": 0,
        "explanation": "Correção gramatical não autoriza trocar o dia informado.",
        "optionRationales": [
          "Correção gramatical não autoriza trocar o dia informado.",
          "Plural não exige futuro.",
          "O pedido inclui preservação de informação.",
          "Letras não recuperam o conteúdo."
        ]
      },
      {
        "id": "q.re03.q08",
        "topicId": "portuguese.meaning.rewriting.integrada",
        "prompt": "Qual afirmação respeita os limites da correção integrada?",
        "options": [
          "Prova que toda frase com me admite apenas uma posição.",
          "Completa toda gramática do edital.",
          "Só aplica condições já ensinadas e explicitadas, sem resolver todas as variantes e exceções.",
          "Transforma toda palavra feminina em caso de crase."
        ],
        "answer": 2,
        "explanation": "Os recortes e hipóteses permanecem delimitados.",
        "optionRationales": [
          "Infinitivos e registros têm condições diferentes.",
          "O pacote é introdutório.",
          "Os recortes e hipóteses permanecem delimitados.",
          "Gênero sozinho não fornece preposição e artigo."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "re03-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.re03.q01": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "concordancia"
          }
        ],
        "q.re03.q02": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "concordancia"
          }
        ],
        "q.re03.q03": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "vinculo"
          }
        ],
        "q.re03.q04": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "ex-vinculo"
          }
        ],
        "q.re03.q05": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "negativa"
          }
        ],
        "q.re03.q06": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "negativa"
          }
        ],
        "q.re03.q07": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "ex-concordancia"
          }
        ],
        "q.re03.q08": [
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "limites"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.re03",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.rewriting.clareza",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.rewriting.revisao",
    "topicId": "portuguese.meaning.rewriting.revisao",
    "contentVersion": 1,
    "order": 130,
    "title": "Reescrita: revisão integrada do recorte",
    "shortTitle": "RE-R",
    "kind": "lesson",
    "objective": "Reescrever nos casos explicitados, preservando informações e aplicando condições gramaticais já ensinadas.",
    "xp": 100,
    "passScore": 0,
    "estimatedMinutes": 20,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-re-intro-r1",
      "releaseSequence": 18,
      "changeImpact": "new"
    },
    "sourceIds": [
      "re.rer.incaper.clareza",
      "re.rer.senado.concordancia",
      "re.rer.senado.rg.assistir",
      "re.rer.senado.crase",
      "re.rer.funag.colocacao",
      "re.rer.authorial.rer"
    ],
    "sections": [
      {
        "id": "conteudo",
        "heading": "1. Conteúdo e forma",
        "body": "RE01 separa conteúdo de correção formal. Mantenha agente/ação/objeto/tempo/negação; se o pedido muda singular para plural, reconhecer essa alteração intencional e ajustar concordância. Não chamar toda mudança solicitada de equivalência completa.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "clareza",
        "heading": "2. Limites que não podem desaparecer",
        "body": "RE02: somente e condição se concluírem são relevantes. Repetir pessoa pode esclarecer referência; explicar termo usa significado explicitado no cenário, sem inventar definição real.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "integrar",
        "heading": "3. Corrigir o caso dado",
        "body": "RE03: sujeito simples plural pede verbo plural; presenciar com a e artigo feminino definido forma à; negativa sem pausa no padrão formal pede átono antes. Correção não autoriza mudar dia, objeto ou retirar não.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-conteudo",
        "heading": "4. Exemplo resolvido: deslocar",
        "body": "A turma não revisou o texto ontem e Ontem, a turma não revisou o texto conservam informações no caso. Todas revisarão amanhã altera sujeito/tempo/negação.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-clareza",
        "heading": "5. Exemplo resolvido: condição",
        "body": "Se concluírem a revisão, somente duas leitoras receberão o roteiro mantém limite e condição. Duas leitoras receberão omite ambos.",
        "type": "worked-example",
        "sourceIds": []
      },
      {
        "id": "ex-integrar",
        "heading": "6. Exemplo resolvido: não",
        "body": "Não lembro-me do aviso, no pedido formal com verbo simples e sem pausa, corrige-se para Não me lembro do aviso. Não permanece; me muda de posição.",
        "type": "worked-example",
        "sourceIds": [
          "re.rer.funag.colocacao"
        ]
      },
      {
        "id": "retomadas",
        "heading": "7. Retomar a condição",
        "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [RE-03](re-03-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "RE-01",
                "missionId": "portuguese.meaning.rewriting.criterios",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-02",
                "missionId": "portuguese.meaning.rewriting.clareza",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-03",
                "missionId": "portuguese.meaning.rewriting.integrada",
                "sectionId": "entrada",
                "wholeLesson": true
              }
            ]
          }
        ]
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
        "id": "q.rer.q01",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "No caso de A turma não revisou o texto ontem, qual deslocamento mantém as informações explicitadas?",
        "options": [
          "Ontem, a turma não revisou o texto.",
          "Amanhã, todas revisarão o texto.",
          "Ontem, a turma revisou o texto.",
          "A turma perdeu o texto ontem."
        ],
        "answer": 0,
        "explanation": "Desloca tempo sem alterar agente/negação/ação/objeto/dia.",
        "optionRationales": [
          "Desloca tempo sem alterar agente/negação/ação/objeto/dia.",
          "Muda agente, tempo e negação.",
          "Apaga a negação.",
          "Muda a ação."
        ]
      },
      {
        "id": "q.rer.q02",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "O pedido passa uma leitora para duas. Essa alteração pode ser chamada de preservação total da quantidade?",
        "options": [
          "Sim: só verbos mudam quantidade.",
          "Sim: singular e plural sempre dizem a mesma quantidade.",
          "Não: a quantidade foi mudada intencionalmente.",
          "Não: todas as demais informações devem ser apagadas."
        ],
        "answer": 2,
        "explanation": "Reconhecer a alteração pedida evita falsa equivalência completa.",
        "optionRationales": [
          "O sujeito também muda quantidade no caso.",
          "São quantidades distintas na hipótese dada.",
          "Reconhecer a alteração pedida evita falsa equivalência completa.",
          "O pedido não exige apagar conteúdo."
        ]
      },
      {
        "id": "q.rer.q03",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "Qual reescrita mantém somente e se concluírem na condição de recebimento dada?",
        "options": [
          "Todas receberão o roteiro sem condição.",
          "Se concluírem a revisão, somente duas leitoras receberão o roteiro.",
          "Duas leitoras receberão o roteiro.",
          "Somente duas receberam o roteiro ontem."
        ],
        "answer": 1,
        "explanation": "Mantém limitação e condição.",
        "optionRationales": [
          "Muda quantidade e elimina condição.",
          "Mantém limitação e condição.",
          "Apaga limitação e condição.",
          "Muda tempo e apaga condição."
        ]
      },
      {
        "id": "q.rer.q04",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "Para esclarecer referência incerta entre duas pessoas, o que pode ser adequado?",
        "options": [
          "Escolher um nome aleatório como fato.",
          "Proibir qualquer repetição universalmente.",
          "Usar ambas sem a intenção informar participação conjunta.",
          "Repetir o nome da pessoa indicada pela intenção explícita."
        ],
        "answer": 3,
        "explanation": "O nome identifica o referente pretendido no caso.",
        "optionRationales": [
          "A intenção não deve ser inventada.",
          "A clareza pode justificar repetir.",
          "Ambas acrescenta participação.",
          "O nome identifica o referente pretendido no caso."
        ]
      },
      {
        "id": "q.rer.q05",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "Pedido: manter leitoras plurais e revisão passada. Qual correção do verbo de As leitoras revisou o roteiro atende?",
        "options": [
          "As leitoras revisarão o roteiro.",
          "A leitora revisou o roteiro.",
          "As leitoras revisaram o roteiro.",
          "As leitoras revisaram os roteiros obrigatoriamente."
        ],
        "answer": 2,
        "explanation": "Verbo plural passado acompanha sujeito plural sem mudança do objeto.",
        "optionRationales": [
          "Muda o tempo.",
          "Muda quantidade do sujeito.",
          "Verbo plural passado acompanha sujeito plural sem mudança do objeto.",
          "Muda a quantidade do objeto sem pedido."
        ]
      },
      {
        "id": "q.rer.q06",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "No padrão de presenciar com artigo definido a, como representar o encontro no grupo apresentação indicada?",
        "options": [
          "Assistiu à apresentação indicada.",
          "Assistiu de apresentação indicada.",
          "Assistiu à uma apresentação.",
          "Assistiu ao apresentação indicada."
        ],
        "answer": 0,
        "explanation": "A preposição e o artigo a se encontram.",
        "optionRationales": [
          "A preposição e o artigo a se encontram.",
          "De não é o vínculo dado.",
          "Uma não fornece artigo a para fusão.",
          "O não é o artigo do grupo dado."
        ]
      },
      {
        "id": "q.rer.q07",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "A correção formal apagou não de Não lembro-me. Qual informação foi perdida?",
        "options": [
          "A quantidade obrigatória de objetos.",
          "Somente a cor do texto.",
          "Nenhuma informação.",
          "A negação da mensagem original."
        ],
        "answer": 3,
        "explanation": "Retirar a palavra ‘não’ muda a afirmação negativa do caso.",
        "optionRationales": [
          "Não há quantidade de objetos imposta pela palavra.",
          "Cor não é a informação alterada.",
          "A negação é relevante.",
          "Retirar a palavra ‘não’ muda a afirmação negativa do caso."
        ]
      },
      {
        "id": "q.rer.q08",
        "topicId": "portuguese.meaning.rewriting.revisao",
        "prompt": "Você encurtou o recebimento condicionado, apagando se concluírem. Que recuperação cabe?",
        "options": [
          "Considerar toda condição redundante.",
          "Retomar a condição explícita e verificar o alcance da reescrita.",
          "Ignorar o pedido de preservação.",
          "Criar outra condição real de crédito."
        ],
        "answer": 1,
        "explanation": "A condição informa quando ocorrerá o recebimento no cenário.",
        "optionRationales": [
          "Não é redundante no caso.",
          "A condição informa quando ocorrerá o recebimento no cenário.",
          "O pedido exige preservar informação.",
          "Não se trata de crédito real."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rer-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rer.q01": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "conteudo"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "conteudo"
          }
        ],
        "q.rer.q02": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "conteudo"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "numero"
          }
        ],
        "q.rer.q03": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "condicoes"
          }
        ],
        "q.rer.q04": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "repeticao"
          }
        ],
        "q.rer.q05": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "concordancia"
          }
        ],
        "q.rer.q06": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "vinculo"
          }
        ],
        "q.rer.q07": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "negativa"
          }
        ],
        "q.rer.q08": [
          {
            "missionId": "portuguese.meaning.rewriting.revisao",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "ex-condicao"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rer",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.rewriting.integrada",
      "parametersApproved": false
    }
  },
  {
    "id": "portuguese.meaning.rewriting.boss",
    "topicId": "portuguese.meaning.rewriting.boss",
    "contentVersion": 1,
    "order": 131,
    "title": "Reescrita: Chefe introdutório",
    "shortTitle": "RE-CHEFE",
    "kind": "boss",
    "objective": "Reescrever nos casos explicitados, preservando informações e aplicando condições gramaticais já ensinadas.",
    "xp": 220,
    "passScore": 75,
    "estimatedMinutes": 30,
    "publication": {
      "status": "draft",
      "releaseId": "meaning-re-intro-r1",
      "releaseSequence": 18,
      "changeImpact": "new"
    },
    "sourceIds": [
      "re.rechefe.incaper.clareza",
      "re.rechefe.senado.concordancia",
      "re.rechefe.senado.rg.assistir",
      "re.rechefe.senado.crase",
      "re.rechefe.funag.colocacao",
      "re.rechefe.authorial.rechefe"
    ],
    "sections": [
      {
        "id": "conteudo",
        "heading": "1. Conteúdo e forma",
        "body": "RE01 separa conteúdo de correção formal. Mantenha agente/ação/objeto/tempo/negação; se o pedido muda singular para plural, reconhecer essa alteração intencional e ajustar concordância. Não chamar toda mudança solicitada de equivalência completa.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "clareza",
        "heading": "2. Limites que não podem desaparecer",
        "body": "RE02: somente e condição se concluírem são relevantes. Repetir pessoa pode esclarecer referência; explicar termo usa significado explicitado no cenário, sem inventar definição real.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "integrar",
        "heading": "3. Corrigir o caso dado",
        "body": "RE03: sujeito simples plural pede verbo plural; presenciar com a e artigo feminino definido forma à; negativa sem pausa no padrão formal pede átono antes. Correção não autoriza mudar dia, objeto ou retirar não.",
        "type": "explanation",
        "sourceIds": []
      },
      {
        "id": "ex-chefe",
        "heading": "4. Exemplo resolvido: preservar e corrigir",
        "body": "Pedido: leitoras plurais, passado e hoje. As leitoras revisou o texto hoje deve virar As leitoras revisaram o texto hoje, não singular nem futuro. Se houver negativa em outro caso formal, preservá-la antes de ajustar o átono.",
        "type": "worked-example",
        "sourceIds": [
          "re.rechefe.senado.concordancia"
        ]
      },
      {
        "id": "retomadas",
        "heading": "5. Recuperar ensino",
        "body": "[RE-01](re-01-v1.md) · [RE-02](re-02-v1.md) · [RE-03](re-03-v1.md) · [RE-R](re-r-v1.md)",
        "type": "explanation",
        "sourceIds": [],
        "presentation": [
          {
            "type": "paragraph",
            "runs": [
              {
                "text": "RE-01",
                "missionId": "portuguese.meaning.rewriting.criterios",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-02",
                "missionId": "portuguese.meaning.rewriting.clareza",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-03",
                "missionId": "portuguese.meaning.rewriting.integrada",
                "sectionId": "entrada",
                "wholeLesson": true
              },
              {
                "text": " · "
              },
              {
                "text": "RE-R",
                "missionId": "portuguese.meaning.rewriting.revisao",
                "sectionId": "conteudo",
                "wholeLesson": true
              }
            ]
          }
        ]
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
        "id": "q.rechefe.q01",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Original: A equipe não analisou o aviso hoje. Qual reescrita preserva o conteúdo fornecido?",
        "options": [
          "Hoje, todas as equipes analisaram os avisos.",
          "A equipe analisará o aviso amanhã.",
          "Hoje, a equipe não analisou o aviso.",
          "A equipe analisou o aviso hoje."
        ],
        "answer": 2,
        "explanation": "Conserva agente, negação, ação, objeto e dia, mudando ordem.",
        "optionRationales": [
          "Muda quantidade e negação.",
          "Muda tempo/dia e apaga negação.",
          "Conserva agente, negação, ação, objeto e dia, mudando ordem.",
          "Apaga a negação."
        ]
      },
      {
        "id": "q.rechefe.q02",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Qual critério deve ser separado de a frase ser gramaticalmente possível numa tarefa de equivalência?",
        "options": [
          "Preservar as informações dadas.",
          "Contar só letras.",
          "Aceitar qualquer frase correta como conteúdo idêntico.",
          "Proibir todo deslocamento temporal."
        ],
        "answer": 0,
        "explanation": "Gramática possível não garante conteúdo equivalente.",
        "optionRationales": [
          "Gramática possível não garante conteúdo equivalente.",
          "Letras não comprovam conteúdo.",
          "É generalização incorreta.",
          "Um deslocamento pode preservar no caso ensinado."
        ]
      },
      {
        "id": "q.rechefe.q03",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Original: Somente três leitoras receberão o texto se concluírem a atividade. Qual reescrita mantém limites?",
        "options": [
          "Somente três receberam o texto ontem.",
          "Três leitoras receberão o texto.",
          "Todas receberão o texto sem condição.",
          "Se concluírem a atividade, somente três leitoras receberão o texto."
        ],
        "answer": 3,
        "explanation": "Mantém restrição de participantes e condição.",
        "optionRationales": [
          "Muda tempo e apaga condição.",
          "Omite ambas as limitações.",
          "Muda quantidade e condição.",
          "Mantém restrição de participantes e condição."
        ]
      },
      {
        "id": "q.rechefe.q04",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Por que retirar se concluírem a atividade do original não é economia neutra?",
        "options": [
          "Toda condição é palavra ornamental.",
          "Exclui a condição que limitava o recebimento.",
          "Toda expressão com se é obrigatoriamente equivalente à ausência de condição.",
          "Não há diferença de alcance."
        ],
        "answer": 1,
        "explanation": "O caso condiciona o recebimento à conclusão.",
        "optionRationales": [
          "Há informação relevante.",
          "O caso condiciona o recebimento à conclusão.",
          "Não é equivalência universal.",
          "Excluir condição muda alcance."
        ]
      },
      {
        "id": "q.rechefe.q05",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Intenção dada: a revisora enviou o texto; havia duas pessoas e um pronome incerto. Que reescrita esclarece sem acrescentar outro agente?",
        "options": [
          "Ambas enviaram o texto.",
          "A revisora enviou o texto.",
          "A outra pessoa enviou o texto.",
          "Ela enviou o texto, mantendo a dúvida sem contexto."
        ],
        "answer": 1,
        "explanation": "Nomeia somente a pessoa indicada pela intenção.",
        "optionRationales": [
          "Acrescenta participação conjunta.",
          "Nomeia somente a pessoa indicada pela intenção.",
          "Muda agente pretendido.",
          "Mantém a referência incerta."
        ]
      },
      {
        "id": "q.rechefe.q06",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "No cenário, marcador é etiqueta colorida para localizar seção. Qual explicação conserva a definição fornecida?",
        "options": [
          "Um prazo obrigatório de pagamento.",
          "Aprovação automática de uma operação real.",
          "Garantia de que todos concluíram uma aula.",
          "Etiqueta colorida para localizar uma seção."
        ],
        "answer": 3,
        "explanation": "Repete a definição autoral do caso.",
        "optionRationales": [
          "Não é o sentido definido.",
          "Inventa efeito real não informado.",
          "Acrescenta conclusão não dada.",
          "Repete a definição autoral do caso."
        ]
      },
      {
        "id": "q.rechefe.q07",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Pedido: passar A revisora atenta examinou o aviso para duas revisoras, mantendo objeto e passado. Qual resposta atende?",
        "options": [
          "As revisoras atentas examinaram o aviso.",
          "As revisora atenta examinou o aviso.",
          "A revisora atenta examinará os avisos.",
          "As revisoras atentas examinou o aviso."
        ],
        "answer": 0,
        "explanation": "Ajusta sujeito e concordância ao plural pedido, conservando passado e objeto.",
        "optionRationales": [
          "Ajusta sujeito e concordância ao plural pedido, conservando passado e objeto.",
          "Não ajusta plural.",
          "Muda quantidade, tempo e objeto.",
          "Verbo não acompanha sujeito plural dado."
        ]
      },
      {
        "id": "q.rechefe.q08",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Pedido: leitores plurais, passado e ontem. Qual correção de Os leitores leu o texto ontem conserva essas informações?",
        "options": [
          "Os leitores lerão o texto amanhã.",
          "O leitor leu o texto ontem.",
          "Os leitores leram o texto ontem.",
          "Os leitores leram os textos ontem, como alteração obrigatória do objeto."
        ],
        "answer": 2,
        "explanation": "Verbo plural passado corrige o vínculo sem mudar o resto do pedido.",
        "optionRationales": [
          "Muda tempo/dia.",
          "Muda a quantidade de leitores.",
          "Verbo plural passado corrige o vínculo sem mudar o resto do pedido.",
          "Acrescenta plural ao objeto sem pedido."
        ]
      },
      {
        "id": "q.rechefe.q09",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Presenciar no padrão ensinado e oficina com artigo definido a: qual correção do grupo representa o encontro?",
        "options": [
          "Assistiu ao oficina indicada.",
          "Assistiu de oficina indicada.",
          "Assistiu a uma oficina, com determinação necessariamente idêntica.",
          "Assistiu à oficina indicada."
        ],
        "answer": 3,
        "explanation": "A preposição a com artigo a resulta em à.",
        "optionRationales": [
          "O não acompanha o grupo definido feminino.",
          "De não representa o vínculo dado.",
          "Uma modifica a determinação informada.",
          "A preposição a com artigo a resulta em à."
        ]
      },
      {
        "id": "q.rechefe.q10",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Por que corrigir esse grupo definido para a uma oficina não atende ao pedido de conservar artigo a?",
        "options": [
          "Uma e a são formas idênticas em qualquer grupo.",
          "Troca o artigo e a determinação explicitada.",
          "Todo feminino tem à uma.",
          "Só o tamanho da frase importa."
        ],
        "answer": 1,
        "explanation": "O pedido mantém o artigo definido; uma altera essa escolha.",
        "optionRationales": [
          "São artigos diferentes.",
          "O pedido mantém o artigo definido; uma altera essa escolha.",
          "Uma não fornece segundo a do encontro.",
          "Comprimento não preserva determinação."
        ]
      },
      {
        "id": "q.rechefe.q11",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Pedido formal: não sem pausa, verbo simples engano e me. Qual correção preserva a negação de Não engano-me?",
        "options": [
          "Me engano, retirando não.",
          "Engano-me, retirando não.",
          "Não me engano.",
          "Não engano me, como ênclise sem hífen."
        ],
        "answer": 2,
        "explanation": "Conserva não e posiciona me antes conforme o caso formal.",
        "optionRationales": [
          "Apaga a negação do caso.",
          "Apaga a negação.",
          "Conserva não e posiciona me antes conforme o caso formal.",
          "Não aplica a próclise ensinada."
        ]
      },
      {
        "id": "q.rechefe.q12",
        "topicId": "portuguese.meaning.rewriting.boss",
        "prompt": "Você apagou a palavra não para encurtar o original. Que recuperação é necessária antes de escolher outra forma?",
        "options": [
          "Comparar a mensagem negativa original e o conteúdo afirmado após retirar não.",
          "Declarar a palavra ‘não’ sempre dispensável.",
          "Contar apenas sílabas.",
          "Inventar uma pausa e outra intenção."
        ],
        "answer": 0,
        "explanation": "A negação é informação relevante e deve ser preservada no pedido.",
        "optionRationales": [
          "A negação é informação relevante e deve ser preservada no pedido.",
          "A palavra ‘não’ preserva a negação e não é redundante neste caso.",
          "Sílabas não verificam conteúdo.",
          "Não se altera a hipótese para resolver."
        ]
      }
    ],
    "teaching": {
      "contractVersion": 1,
      "editorialPass": "rechefe-autoria-r1",
      "reviewStatus": "human-review-pending",
      "questionCoverage": {
        "q.rechefe.q01": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "conteudo"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "conteudo"
          }
        ],
        "q.rechefe.q02": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "conteudo"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "entrada"
          }
        ],
        "q.rechefe.q03": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "condicoes"
          }
        ],
        "q.rechefe.q04": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "ex-condicao"
          }
        ],
        "q.rechefe.q05": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "repeticao"
          }
        ],
        "q.rechefe.q06": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "clareza"
          },
          {
            "missionId": "portuguese.meaning.rewriting.clareza",
            "sectionId": "termos"
          }
        ],
        "q.rechefe.q07": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "conteudo"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "numero"
          }
        ],
        "q.rechefe.q08": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "concordancia"
          }
        ],
        "q.rechefe.q09": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "vinculo"
          }
        ],
        "q.rechefe.q10": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "ex-vinculo"
          }
        ],
        "q.rechefe.q11": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "integrar"
          },
          {
            "missionId": "portuguese.meaning.rewriting.integrada",
            "sectionId": "negativa"
          }
        ],
        "q.rechefe.q12": [
          {
            "missionId": "portuguese.meaning.rewriting.boss",
            "sectionId": "recuperacao"
          },
          {
            "missionId": "portuguese.meaning.rewriting.criterios",
            "sectionId": "ex-conteudo"
          }
        ]
      }
    },
    "candidate": {
      "editorialId": "draft.rechefe",
      "blockId": "portuguese.meaning-writing",
      "prerequisiteId": "portuguese.meaning.rewriting.revisao",
      "parametersApproved": false
    }
  }
]);
export const RE_SOURCES = Object.freeze([
  {
    "id": "re.re01.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "re.re01.authorial.re01",
    "label": "Material autoral da Missão Bancária — RE-01 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/re-01-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "re.re02.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "re.re02.authorial.re02",
    "label": "Material autoral da Missão Bancária — RE-02 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/re-02-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "re.re03.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "re.re03.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "re.re03.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "re.re03.senado.crase",
    "label": "Senado Federal - Manual de Comunicação: crase",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/crase",
    "version": "HTML consultado em04/10/2026; recorte introdutório delimitado",
    "checkedAt": "2026-10-04",
    "locator": "Definição; Use crase1/3/4 e ressalva de clareza; Não ocorre1/2/3. Não cobrar casos facultativos/nomes próprios/paralelismo geral."
  },
  {
    "id": "re.re03.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "re.re03.authorial.re03",
    "label": "Material autoral da Missão Bancária — RE-03 (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/re-03-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "re.rer.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "re.rer.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "re.rer.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "re.rer.senado.crase",
    "label": "Senado Federal - Manual de Comunicação: crase",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/crase",
    "version": "HTML consultado em04/10/2026; recorte introdutório delimitado",
    "checkedAt": "2026-10-04",
    "locator": "Definição; Use crase1/3/4 e ressalva de clareza; Não ocorre1/2/3. Não cobrar casos facultativos/nomes próprios/paralelismo geral."
  },
  {
    "id": "re.rer.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "re.rer.authorial.rer",
    "label": "Material autoral da Missão Bancária — RE-R (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/re-r-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  },
  {
    "id": "re.rechefe.incaper.clareza",
    "label": "Incaper - Manual de Produção Editorial: adequação da linguagem",
    "url": "https://manual-editorial.incaper.es.gov.br/capitulo_onze.htm",
    "version": "11.1D/E, orientação de clareza e ambiguidade; consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "11.1D: clareza e evitar ambiguidade;11.1E: explicar termos. Não atribuir lista lexical de sinônimos/antônimos a esta fonte."
  },
  {
    "id": "re.rechefe.senado.concordancia",
    "label": "Senado Federal — Manual de Comunicação: concordância verbal",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/concordancia-verbal",
    "version": "Manual de Comunicação, página HTML consultada em 04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Regra geral; sujeito único8 (haver/fazer impessoais); sujeito composto1–2 (posição)"
  },
  {
    "id": "re.rechefe.senado.rg.assistir",
    "label": "Senado Federal — Manual de Comunicação: assistir",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir",
    "version": "Orientação editorial nos sentidos presenciar/ajudar; HTML consultado em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Abertura: sentido estar presente/presenciar; parágrafo de auxiliar/ajudar: use como transitivo direto"
  },
  {
    "id": "re.rechefe.senado.crase",
    "label": "Senado Federal - Manual de Comunicação: crase",
    "url": "https://www12.senado.leg.br/manualdecomunicacao/estilos/crase",
    "version": "HTML consultado em04/10/2026; recorte introdutório delimitado",
    "checkedAt": "2026-10-04",
    "locator": "Definição; Use crase1/3/4 e ressalva de clareza; Não ocorre1/2/3. Não cobrar casos facultativos/nomes próprios/paralelismo geral."
  },
  {
    "id": "re.rechefe.funag.colocacao",
    "label": "FUNAG - Manual de Revisão: colocação pronominal (fontes Cunha/Cintra e Almeida)",
    "url": "https://funag.gov.br/manual/index.php?title=Coloca%C3%A7%C3%A3o_pronominal&oldid=553",
    "version": "oldid553; página atribui Cunha/Cintra2001 e Almeida2009; consultada em04/10/2026",
    "checkedAt": "2026-10-04",
    "locator": "Tipos antes/depois/meio; Com um só verbo2a (negativa sem pausa),4 (infinitivos próclise/ênclise); regra final início formal. Não aplicar as afirmações amplas de locuções verbais/advérbios/futuro a variantes não ensinadas."
  },
  {
    "id": "re.rechefe.authorial.rechefe",
    "label": "Material autoral da Missão Bancária — RE-CHEFE (rascunho local)",
    "url": "https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado",
    "version": "Texto e exercícios autorais v1",
    "checkedAt": "2026-10-04",
    "locator": "docs/missao-bancaria/rascunhos/re-chefe-v1.mjs",
    "provenance": "project-authored",
    "remoteArtifactAvailable": false
  }
]);
