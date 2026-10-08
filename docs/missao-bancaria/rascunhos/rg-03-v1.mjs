// Ensino e frases autorais; rascunho local desativado.
export const SOURCES = [];
export const RG03_DRAFT = {
  "id": "draft.rg03",
  "topicId": "draft.rg03",
  "editorialKey": "RG-03",
  "candidateBlockId": "portuguese.syntax",
  "title": "Regência nominal: identificar o nome e seu dependente",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Identificar regente, sentido e dependente, aplicando só os vínculos ensinados e o padrão editorial explicitamente adotado.",
  "sourceIds": [],
  "sections": [
    {
      "id": "entrada",
      "heading": "1. O regente não precisa ser verbo",
      "body": "Regência nominal observa relação de dependência a partir de um nome, como substantivo ou adjetivo. Aqui vamos identificar só dois grupos nominais dados, necessidade de revisão e leitura do roteiro. Os exemplos são autorais de estrutura, não uma lista normativa de preposições exclusivas para todos os nomes/sentidos.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "necessidade",
      "heading": "2. Necessidade de revisão",
      "body": "Em Há necessidade de revisão, necessidade é substantivo; de revisão depende desse nome e esclarece de que há necessidade no uso dado. A relação nominal é com necessidade, não com há. De liga os termos; não conclua que todo grupo com de seja objeto de um verbo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "leitura",
      "heading": "3. Leitura do roteiro e contração",
      "body": "Em A leitura do roteiro terminou, do é a contração de de com o, artigo que acompanha roteiro: de + o = do. Do roteiro depende do substantivo leitura no grupo dado. O sujeito inteiro tem leitura como núcleo e controla terminou. Não se cobra distinguir toda classe de complemento/adjunto nominal; o objetivo é identificar nome e vínculo.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "vinculos",
      "heading": "4. Comparar sem criar exclusividade",
      "body": "Compare A aluna precisa de tempo e Há necessidade de tempo: no primeiro, o grupo com de completa precisa no uso ensinado; no segundo, depende do nome necessidade. A mesma preposição não torna as relações idênticas. Não afirmar que um nome só admite uma preposição em todos os sentidos; outros usos e adjetivos exigem ensino específico.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "ex-nome",
      "heading": "5. Exemplo resolvido: qual termo rege",
      "body": "Em Há necessidade de orientação, marque necessidade como nome; de orientação identifica o conteúdo dessa necessidade. Há é haver impessoal, como ensinado em CN. O grupo de orientação liga-se ao nome no exemplo, sem trocar o verbo por uma forma plural.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-leitura",
      "heading": "6. Exemplo resolvido: nome e forma verbal",
      "body": "A leitura dos roteiros terminou: dos reúne de + os; o grupo dos roteiros depende de leitura. Leitura é núcleo singular do sujeito e controla terminou; roteiros plural não controla o verbo. Há vínculo nominal e concordância verbal na mesma frase.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "ex-comparar",
      "heading": "7. Exemplo resolvido: trocar estrutura",
      "body": "A equipe precisou de tempo contém verbo precisou e seu complemento de tempo. A necessidade de tempo aumentou contém nome necessidade e seu dependente de tempo; aumentou concorda com o sujeito de núcleo necessidade. Não decidir só pela palavra de nem chamar todo dependente de nome de objeto indireto.",
      "type": "worked-example",
      "sourceIds": []
    },
    {
      "id": "limites",
      "heading": "8. O que ainda fica fora",
      "body": "Aula introdutória de identificação estrutural em dois grupos nominais. Não ensina lista de regências de adjetivos, nomes com múltiplas preposições, relativos, pronomes ou crase; não afirma preposição exclusiva para todos os usos de necessidade/leitura. A expansão normativa lexical exige referência pertinente antes de novas questões prescritivas.",
      "type": "explanation",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "heading": "Vocabulário de apoio",
      "body": "Regência: relação de dependência entre termos. Regente é o termo do qual outro depende; regido é o dependente. Regência verbal liga verbo e complemento no uso dado; nominal relaciona um nome e o grupo que dele depende. Preposição liga termos; artigo acompanha substantivo. Infinitivo é a forma verbal como melhorar/organizar. Preferência editorial é escolha indicada por um manual para seu padrão, não proibição universal de outras variantes.",
      "type": "glossary",
      "sourceIds": []
    },
    {
      "id": "recuperacao",
      "heading": "Refazer pelo termo e pelo sentido",
      "body": "Localize o termo regente e seu sentido no contexto; identifique o dependente e a ligação. Se o item adota orientação de manual, releia também o alcance e as ressalvas. Separe concordância, regência e artigo. Não trocar preposição mecanicamente nem generalizar uma frase para todos os usos.",
      "type": "summary",
      "sourceIds": []
    }
  ],
  "recall": [
    "Qual termo rege a ligação neste uso?",
    "O sentido e a orientação de referência foram explicitados?",
    "Qual ressalva impede uma regra universal?"
  ],
  "questions": [
    {
      "id": "rg03.q01",
      "prompt": "No grupo necessidade de revisão, qual termo é o nome regente no uso dado?",
      "options": [
        "necessidade",
        "de",
        "revisão",
        "Um verbo oculto obrigatório."
      ],
      "answer": 0,
      "explanation": "Necessidade é o substantivo do qual depende de revisão no exemplo.",
      "optionRationales": [
        "Necessidade é o substantivo do qual depende de revisão no exemplo.",
        "De liga termos.",
        "Revisão é o dependente apresentado.",
        "Não há essa exigência de um verbo oculto."
      ],
      "recoverySectionIds": [
        "necessidade"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg03.q02",
      "prompt": "Em A leitura do roteiro terminou, qual composição de do foi ensinada?",
      "options": [
        "Duas formas do sujeito eu.",
        "Dois verbos no passado.",
        "De + o, preposição e artigo.",
        "A + a, sempre."
      ],
      "answer": 2,
      "explanation": "Do reúne de com o, artigo de roteiro.",
      "optionRationales": [
        "Não é combinação de pronomes eu.",
        "Não é uma locução verbal.",
        "Do reúne de com o, artigo de roteiro.",
        "Não é a composição ensinada."
      ],
      "recoverySectionIds": [
        "leitura"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg03.q03",
      "prompt": "Compare precisa de tempo e necessidade de tempo. Qual distinção preserva os usos dados?",
      "options": [
        "Ambos só podem ter regência verbal porque há de.",
        "De tempo depende de um verbo no primeiro e de um nome no segundo.",
        "Ambos só podem ter regência nominal porque há tempo.",
        "A preposição de elimina qualquer dependência."
      ],
      "answer": 1,
      "explanation": "Precisa é verbo; necessidade é nome na comparação apresentada.",
      "optionRationales": [
        "A presença de de não decide qual termo rege.",
        "Precisa é verbo; necessidade é nome na comparação apresentada.",
        "Tempo não transforma o verbo em nome.",
        "De participa da ligação, não a elimina."
      ],
      "recoverySectionIds": [
        "vinculos"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg03.q04",
      "prompt": "Em A leitura dos roteiros terminou, qual termo controla terminou no caso?",
      "options": [
        "Qualquer palavra depois do verbo.",
        "Roteiros, por ser plural e próximo.",
        "Dos, por ser preposição/artigo.",
        "O sujeito de núcleo leitura, singular."
      ],
      "answer": 3,
      "explanation": "Leitura é o núcleo singular do sujeito; terminou mantém a concordância.",
      "optionRationales": [
        "A concordância não depende dessa posição.",
        "Roteiros integra o grupo nominal dependente.",
        "Dos não é núcleo do sujeito.",
        "Leitura é o núcleo singular do sujeito; terminou mantém a concordância."
      ],
      "recoverySectionIds": [
        "ex-leitura"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "rg03.q05",
      "prompt": "Em Há necessidade de orientação, de orientação está ligado a qual termo no exemplo?",
      "options": [
        "A um sujeito orientação que pluraliza há.",
        "A há como objeto indireto obrigatório.",
        "Ao substantivo necessidade.",
        "A uma data não expressa."
      ],
      "answer": 2,
      "explanation": "O grupo esclarece a necessidade e depende desse nome no caso.",
      "optionRationales": [
        "Há é impessoal e orientação não é seu sujeito.",
        "Não é o vínculo nominal descrito.",
        "O grupo esclarece a necessidade e depende desse nome no caso.",
        "Orientação não introduz uma data no exemplo."
      ],
      "recoverySectionIds": [
        "ex-nome"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "rg03.q06",
      "prompt": "Qual afirmação respeita os limites da aula nominal?",
      "options": [
        "Identificamos vínculos nos grupos dados, sem provar preposição exclusiva para todo nome/sentido.",
        "Todo grupo com de é sempre objeto indireto.",
        "Todo nome só admite a preposição de.",
        "Regência nominal exige que o termo regente seja verbo."
      ],
      "answer": 0,
      "explanation": "A identificação estrutural não autoriza lista universal ou exclusividade lexical.",
      "optionRationales": [
        "A identificação estrutural não autoriza lista universal ou exclusividade lexical.",
        "Grupos com de podem depender de nomes.",
        "Não se ensinou essa regra universal.",
        "O regente nominal é um nome, não um verbo."
      ],
      "recoverySectionIds": [
        "limites"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "rg03.q07",
      "prompt": "Você chamou de tempo de objeto indireto em A necessidade de tempo aumentou só por haver de. Qual retomada é pertinente?",
      "options": [
        "Retirar necessidade para evitar analisar a frase.",
        "Trocar aumentou por aumentaram por proximidade.",
        "Concluir que toda preposição rege um verbo.",
        "Identificar necessidade como nome regente do grupo e distinguir o verbo aumentou."
      ],
      "answer": 3,
      "explanation": "O grupo depende do nome; a função não é decidida só pela preposição.",
      "optionRationales": [
        "Isso muda a estrutura sem recuperá-la.",
        "Não corrige o vínculo e contraria o núcleo singular.",
        "A preposição pode ligar nome e dependente.",
        "O grupo depende do nome; a função não é decidida só pela preposição."
      ],
      "recoverySectionIds": [
        "recuperacao"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "rg03.q08",
      "prompt": "Em A leitura dos roteiros terminou, qual combinação identifica os dois vínculos?",
      "options": [
        "Terminou concorda com roteiros; dos é verbo.",
        "Dos roteiros depende de leitura; terminou concorda com o sujeito de núcleo leitura.",
        "Leitura concorda em pessoa com dos.",
        "Toda relação da frase é apenas pontuação."
      ],
      "answer": 1,
      "explanation": "Há relação nominal no grupo e verbal de concordância com o sujeito.",
      "optionRationales": [
        "Os vínculos/classes foram trocados.",
        "Há relação nominal no grupo e verbal de concordância com o sujeito.",
        "Pessoa verbal não é propriedade de dos.",
        "Os vínculos são sintáticos, não só pontuação."
      ],
      "recoverySectionIds": [
        "ex-leitura"
      ],
      "objectiveIds": [
        "O3"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "rg03-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "rg03.q01": [
        {
          "missionId": "draft.rg03",
          "sectionId": "necessidade"
        }
      ],
      "rg03.q02": [
        {
          "missionId": "draft.rg03",
          "sectionId": "leitura"
        }
      ],
      "rg03.q03": [
        {
          "missionId": "draft.rg03",
          "sectionId": "vinculos"
        }
      ],
      "rg03.q04": [
        {
          "missionId": "draft.rg03",
          "sectionId": "ex-leitura"
        }
      ],
      "rg03.q05": [
        {
          "missionId": "draft.rg03",
          "sectionId": "ex-nome"
        }
      ],
      "rg03.q06": [
        {
          "missionId": "draft.rg03",
          "sectionId": "limites"
        }
      ],
      "rg03.q07": [
        {
          "missionId": "draft.rg03",
          "sectionId": "recuperacao"
        }
      ],
      "rg03.q08": [
        {
          "missionId": "draft.rg03",
          "sectionId": "ex-leitura"
        }
      ]
    }
  }
};
export const EDITORIAL = {
  "stage": "Rascunho local fora do catálogo; parecer independente concluído, correções dirigidas RG-03 q6/RG-R q6 aplicadas",
  "objectives": {
    "O1": "Reconhecer o regente e o vínculo no contexto.",
    "O2": "Aplicar o padrão delimitado nos casos ensinados.",
    "O3": "Distinguir sentidos e alcance sem regra universal.",
    "O4": "Retomar ensino e corrigir o vínculo ignorado."
  },
  "recovery": {
    "objectiveId": "O4",
    "instruction": "Localizar regente/sentido/dependente e justificar a ligação conforme o recorte e a fonte, se adotada."
  },
  "limits": [
    "Plano05/documento114/bloco portuguese.syntax existente; pré-requisitos CF/RG-01/CN, perfis BB/CAIXA históricos/referenceOnly.",
    "Textos/exemplos/itens autorais e fictícios; referências verificadas somente para assistir/visar. Não reproduz exemplos institucionais nem orienta casos/procedimentos reais.",
    "RG-02 segue a orientação editorial do Senado explicitamente ensinada, não alega única regência possível em todos os registros. RG-03 é identificação estrutural em necessidade de/leitura do, sem lista normativa de nomes/preposições exclusivos ou todos os complementos nominais.",
    "Outros verbos/sentidos, regências nominais específicas, relativas com preposição, pronomes oblíquos e crase ficam fora do recorte; requerem ensino/fonte pertinentes antes de cobrar.",
    "Sem XP/ordem/candidato/push/ativação/merge/deploy/D1; reviewStatus human-review-pending não é aceite humano/avaliação independente/retenção."
  ]
};
export const ARITHMETIC = [];
