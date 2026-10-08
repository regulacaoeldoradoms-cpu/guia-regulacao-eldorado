// Texto e exercícios autorais; rascunho local desativado.
export const SOURCES = [];
export const CF03_DRAFT = {
  "id": "draft.cf03",
  "topicId": "draft.cf03",
  "editorialKey": "CF-03",
  "candidateBlockId": "portuguese.syntax",
  "title": "Grupos da oração: sujeito, predicado e complementação básica",
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
      "heading": "1. Grupos completos",
      "body": "Em A turma de novos alunos leu o aviso, leu é verbo; A turma de novos alunos é sujeito completo; leu o aviso é predicado. Novos alunos integra o sujeito, mas não substitui o grupo completo. Os exemplos têm sujeito expresso e estrutura simples.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "nucleo",
      "heading": "2. Núcleo e grupo",
      "body": "Núcleo é a palavra central do grupo. Em A turma de novos alunos, o núcleo é turma; de novos alunos especifica a turma. Em Os alunos atentos, alunos é núcleo e atentos os caracteriza. Sujeito completo inclui todo o grupo; núcleo pede a palavra central. Não escolha a última palavra só por estar perto do verbo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "predicado",
      "heading": "3. Predicado não é só verbo",
      "body": "Em A equipe cuidadosa conferiu o texto, conferiu é verbo; conferiu o texto é predicado completo. Em A equipe está atenta, está atenta é predicado, com estado e característica do sujeito. Atenta caracteriza equipe; não é objeto lido/preparado. Localizar o verbo inicia a análise, não responde toda pergunta sobre predicado.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "complementos",
      "heading": "4. Dois casos de complementação",
      "body": "Em A equipe leu o texto, o texto completa leu sem preposição: objeto direto no exemplo. Em A equipe precisou de tempo, de tempo completa precisou com a preposição de exigida por esse uso: objeto indireto no exemplo. Preposição liga termos, como de em de tempo. Não há lista completa de regência; o que vem após o verbo não é sempre objeto e nem todo grupo com de completa verbo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "circunstancia",
      "heading": "5. Informação de tempo",
      "body": "Em A equipe leu o texto ontem, o texto indica o que foi lido; ontem informa quando, uma circunstância de tempo, não objeto. Em A equipe trabalhou ontem, ontem continua temporal; não surge objeto só por haver palavra depois do verbo. A equipe trabalhou ainda é uma frase sem essa circunstância.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-grupo",
      "heading": "6. Exemplo resolvido: grupo e núcleo",
      "body": "Em O grupo de jovens leitores revisou o roteiro, o sujeito é O grupo de jovens leitores, com núcleo grupo. Revisou o roteiro é predicado completo. Leitores integra o sujeito, mas não é seu núcleo nesse exemplo. Responder só grupo quando se pede sujeito completo omite palavras do termo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-complemento",
      "heading": "7. Exemplo resolvido: vínculo",
      "body": "Em A turma precisou de orientação ontem, de orientação é objeto indireto de precisou nesse uso; ontem é circunstância de tempo. Em A turma preparou o resumo, o resumo é objeto direto, completando preparou sem preposição. Não decida só pela posição depois do verbo.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-de",
      "heading": "8. Exemplo resolvido: de no sujeito",
      "body": "Em A turma de leitores leu a nota, de leitores especifica turma dentro do sujeito; não completa leu. A nota é objeto direto de leu no caso. Não chame de leitores de objeto indireto só por começar com de. Identifique o vínculo do grupo à palavra.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "9. Manter limites",
      "body": "Fora do recorte: sujeitos ocultos/indeterminados, orações sem sujeito, voz passiva, classificação completa de predicados/complementos/adjuntos e várias orações. Sujeito não é definido universalmente como agente. Os objetos são reconhecidos nos usos ensinados, sem generalizar perguntas informais.",
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
      "id": "cf03.q01",
      "prompt": "Em A equipe de jovens revisou o roteiro, qual é o sujeito completo?",
      "options": [
        "Equipe.",
        "A equipe de jovens.",
        "De jovens.",
        "Revisou o roteiro."
      ],
      "answer": 1,
      "explanation": "O grupo inteiro é o termo sobre o qual se declara a revisão.",
      "optionRationales": [
        "É só núcleo.",
        "O grupo inteiro é o termo sobre o qual se declara a revisão.",
        "Especifica equipe dentro do sujeito.",
        "É o predicado."
      ],
      "recoverySectionIds": [
        "entrada"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cf03.q02",
      "prompt": "Em O grupo de leitores conferiu a nota, qual é o núcleo do sujeito?",
      "options": [
        "Nota.",
        "Leitores.",
        "Conferiu.",
        "Grupo."
      ],
      "answer": 3,
      "explanation": "Grupo é a palavra central do sujeito.",
      "optionRationales": [
        "Integra complemento.",
        "Especifica o grupo, sem ser seu núcleo.",
        "É verbo.",
        "Grupo é a palavra central do sujeito."
      ],
      "recoverySectionIds": [
        "nucleo"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cf03.q03",
      "prompt": "Em A turma organizada preparou o texto, qual é o predicado completo?",
      "options": [
        "Preparou o texto.",
        "Preparou.",
        "A turma organizada.",
        "Organizada."
      ],
      "answer": 0,
      "explanation": "Inclui verbo e complemento da declaração.",
      "optionRationales": [
        "Inclui verbo e complemento da declaração.",
        "É só verbo.",
        "É sujeito completo.",
        "É adjetivo no sujeito."
      ],
      "recoverySectionIds": [
        "predicado"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "cf03.q04",
      "prompt": "Em A turma leu o aviso ontem, que grupo é objeto direto no uso ensinado?",
      "options": [
        "A turma.",
        "Ontem.",
        "O aviso.",
        "Leu o aviso ontem."
      ],
      "answer": 2,
      "explanation": "Completa leu sem preposição.",
      "optionRationales": [
        "É sujeito.",
        "É circunstância de tempo.",
        "Completa leu sem preposição.",
        "É todo o predicado."
      ],
      "recoverySectionIds": [
        "complementos"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "cf03.q05",
      "prompt": "Em A equipe precisou de apoio ontem, qual análise conserva os vínculos ensinados?",
      "options": [
        "De apoio é objeto indireto de precisou; ontem indica tempo.",
        "Ontem é objeto indireto e de apoio é sujeito.",
        "Todo termo depois do verbo é sujeito.",
        "De apoio é objeto direto só por conter apoio."
      ],
      "answer": 0,
      "explanation": "Conserva complemento preposicionado e circunstância.",
      "optionRationales": [
        "Conserva complemento preposicionado e circunstância.",
        "Inverte os vínculos.",
        "Posição não define sujeito.",
        "Esse uso de precisou tem complemento com de."
      ],
      "recoverySectionIds": [
        "ex-complemento"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cf03.q06",
      "prompt": "Em A turma de estudantes leu a mensagem, por que de estudantes não é objeto indireto de leu?",
      "options": [
        "Todo grupo com de deve ser excluído.",
        "De nunca é preposição.",
        "Especifica turma no sujeito; a mensagem completa leu.",
        "Leu não tem complemento no caso."
      ],
      "answer": 2,
      "explanation": "Segue o vínculo ao substantivo, não ao verbo.",
      "optionRationales": [
        "O grupo integra o sujeito.",
        "De é preposição no exemplo.",
        "Segue o vínculo ao substantivo, não ao verbo.",
        "A mensagem completa leu."
      ],
      "recoverySectionIds": [
        "ex-de"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cf03.q07",
      "prompt": "Em A equipe trabalhou ontem, que afirmação extrapola o ensino?",
      "options": [
        "Trabalhou é verbo.",
        "Ontem informa quando houve trabalho.",
        "A equipe é sujeito expresso.",
        "Ontem é obrigatoriamente objeto direto por vir depois de trabalhou."
      ],
      "answer": 3,
      "explanation": "Ontem é circunstância; posição não basta para objeto.",
      "optionRationales": [
        "Reconhece verbo expresso.",
        "Conserva informação temporal.",
        "Identifica sujeito do exemplo.",
        "Ontem é circunstância; posição não basta para objeto."
      ],
      "recoverySectionIds": [
        "circunstancia"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "cf03.q08",
      "prompt": "Um estudante respondeu só revisou como predicado completo de O grupo atento revisou a nota. Qual correção cabe?",
      "options": [
        "Usar só grupo, por ser substantivo.",
        "Reunir revisou a nota como predicado e O grupo atento como sujeito.",
        "Classificar toda a oração como única classe de palavra.",
        "Usar atento como todo o predicado."
      ],
      "answer": 1,
      "explanation": "Retoma o grupo completo solicitado.",
      "optionRationales": [
        "É núcleo do sujeito.",
        "Retoma o grupo completo solicitado.",
        "Confunde classe e função.",
        "Atento integra o sujeito."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "cf03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "cf03.q01": [
        {
          "missionId": "draft.cf03",
          "sectionId": "entrada"
        }
      ],
      "cf03.q02": [
        {
          "missionId": "draft.cf03",
          "sectionId": "nucleo"
        }
      ],
      "cf03.q03": [
        {
          "missionId": "draft.cf03",
          "sectionId": "predicado"
        }
      ],
      "cf03.q04": [
        {
          "missionId": "draft.cf03",
          "sectionId": "complementos"
        }
      ],
      "cf03.q05": [
        {
          "missionId": "draft.cf03",
          "sectionId": "ex-complemento"
        }
      ],
      "cf03.q06": [
        {
          "missionId": "draft.cf03",
          "sectionId": "ex-de"
        }
      ],
      "cf03.q07": [
        {
          "missionId": "draft.cf03",
          "sectionId": "circunstancia"
        }
      ],
      "cf03.q08": [
        {
          "missionId": "draft.cf03",
          "sectionId": "recuperacao"
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
