// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cc.garantias.reais",
    "label": "Código Civil — garantias reais",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
    "locator": "Arts. 1.361–1.364, 1.419–1.424, 1.428, 1.431–1.432 e 1.473–1.476; recorte conceitual, sem procedimentos executivos",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  },
  {
    "id": "lei.fiduciaria.imovel",
    "label": "Lei 9.514/1997 — alienação fiduciária de imóvel",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/l9514.htm",
    "locator": "Arts. 22–23, texto consolidado, incluindo redação do art. 22 pela Lei 14.711/2023",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC09_DRAFT = {
  "id": "draft.pc09",
  "topicId": "draft.pc09",
  "editorialKey": "PC-09",
  "candidateBlockId": "banking.products-credit",
  "title": "Garantias reais: o bem, a posse e a propriedade",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir garantia pessoal de real e comparar penhor, hipoteca e alienação fiduciária, usando casos com regime declarado e limites de execução.",
  "sourceIds": [
    "cc.garantias.reais",
    "lei.fiduciaria.imovel"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. A garantia ligada a um bem",
      "body": "Em [PC-08](pc-08-v1.md#inicio), um garantidor assume uma obrigação pessoal. Na garantia real, um bem ou direito é juridicamente vinculado ao cumprimento da obrigação, conforme o instrumento. Isso não faz o risco desaparecer nem equivale a transferir dinheiro ao devedor. É preciso verificar titularidade, possibilidade de oferecer o bem, forma e registro exigidos, obrigações anteriores e valor recuperável. O bem pode pertencer ao devedor ou, nas condições legais, a terceiro; não se presume autorização do proprietário.",
      "sourceIds": [
        "cc.garantias.reais"
      ]
    },
    {
      "id": "posse-propriedade",
      "type": "explanation",
      "heading": "2. Ter o bem consigo e ser proprietário são coisas diferentes",
      "body": "Propriedade é o direito jurídico sobre o bem. Posse se refere ao exercício de poderes sobre ele: quem o utiliza pode ter posse sem ser seu proprietário. Na posse desdobrada, uma pessoa exerce a posse direta e outra a indireta, conforme a relação jurídica. Bem móvel pode ser deslocado, como um veículo; um terreno é exemplo de imóvel. “Alienar” é transferir um direito, como a propriedade. “Fiduciário” identifica, aqui, transferência em garantia, sujeita à disciplina e à resolução quando cumprida a obrigação. Não deduza propriedade só por ver alguém dirigindo o carro.",
      "sourceIds": [
        "cc.garantias.reais",
        "lei.fiduciaria.imovel"
      ]
    },
    {
      "id": "penhor",
      "type": "explanation",
      "heading": "3. Penhor comum e exceções de posse",
      "body": "No penhor comum, uma coisa móvel alienável é entregue ao credor ou a seu representante para garantir o débito; transfere-se a posse, não simplesmente a propriedade definitiva. Há registro do instrumento nos termos legais. Não confunda penhor, uma garantia, com penhora, constrição de bens em um procedimento de cobrança. Há modalidades especiais: no penhor rural, industrial, mercantil e de veículos, o Código Civil prevê que os bens permaneçam com o devedor, que deve guardá-los e conservá-los. Portanto, “todo penhor exige entrega física ao credor” é uma generalização errada.",
      "sourceIds": [
        "cc.garantias.reais"
      ]
    },
    {
      "id": "exemplo-penhor",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: joia em penhor comum",
      "body": "Instrumento fictício devidamente constituído: uma joia móvel e alienável é entregue ao credor em penhor comum. Primeiro localizamos o bem; depois a garantia e a entrega da posse. O credor passa a ter a coisa sob a relação de garantia, mas a entrega não prova que comprou a joia. Tampouco é penhora apenas porque a palavra é parecida. Em um caso declarado de penhor rural, seria preciso aplicar a regra própria de permanência do bem.",
      "sourceIds": []
    },
    {
      "id": "hipoteca",
      "type": "explanation",
      "heading": "5. Hipoteca: exemplo imobiliário sem transferência de propriedade",
      "body": "Na hipoteca imobiliária do nosso exemplo, o imóvel é vinculado à garantia, sem transferência da sua propriedade ao credor por esse ato. O proprietário pode continuar na posse. Constituição, publicidade e prioridade dependem dos requisitos legais e do registro; não basta uma conversa. Imóveis são o exemplo usual, mas o art. 1.473 contempla outros objetos, como navios e aeronaves, com disciplina especial. Por isso, não use “hipoteca só pode recair sobre terreno ou casa” como regra universal.",
      "sourceIds": [
        "cc.garantias.reais"
      ]
    },
    {
      "id": "exemplo-hipoteca",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: galpão em garantia",
      "body": "Uma empresa dá seu galpão em hipoteca validamente registrada para garantir dívida, mantendo o uso do imóvel. Passo 1: reconhecer uma garantia real sobre bem identificado. Passo 2: a hipoteca, por si, não transfere a propriedade ao credor. Passo 3: manutenção da posse pela empresa é compatível com o caso. Não concluímos que o credor poderá ficar automaticamente com o galpão no primeiro atraso.",
      "sourceIds": []
    },
    {
      "id": "fiduciaria",
      "type": "explanation",
      "heading": "7. Alienação fiduciária: transferência de propriedade em garantia",
      "body": "Aqui há transferência da propriedade resolúvel ao credor fiduciário para garantir a obrigação. Resolúvel significa sujeita ao encerramento dessa titularidade nos termos legais quando satisfeita a obrigação garantida. O devedor fiduciante pode permanecer com a posse direta e usar o bem; o credor exerce a posse indireta. O Código Civil trata da propriedade fiduciária de móvel infungível — bem individualizado, como o veículo identificado no exemplo — e há legislação especial. Para imóveis, a Lei 9.514 exige registro no Registro de Imóveis para constituir a propriedade fiduciária e admite garantia de obrigação própria ou de terceiro. Os regimes não devem ser misturados em prazos ou procedimentos.",
      "sourceIds": [
        "cc.garantias.reais",
        "lei.fiduciaria.imovel"
      ]
    },
    {
      "id": "exemplo-fiduciaria",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: imóvel e posições jurídicas",
      "body": "Caso de alienação fiduciária imobiliária devidamente registrada: Joana é a fiduciante e usa o imóvel como possuidora direta; a instituição é a credora fiduciária, titular da propriedade resolúvel e possuidora indireta. Passo 1: separar uso e titularidade. Passo 2: reconhecer que isso difere da hipoteca ensinada. Passo 3: não chamar o uso por Joana de prova de propriedade plena sem a garantia. O caso não trata de atraso nem de procedimento de consolidação.",
      "sourceIds": []
    },
    {
      "id": "inadimplemento",
      "type": "explanation",
      "heading": "9. Atraso não autoriza inventar um procedimento",
      "body": "Vencimento sem pagamento é inadimplemento, mas as consequências dependem do contrato, da garantia e da lei. Penhor e hipoteca não autorizam cláusula de apropriação automática do bem pelo credor no vencimento (CC 1.428). Alienação fiduciária segue regime próprio: a existência da propriedade em garantia não é licença genérica para tomar, vender ou reter qualquer valor sem procedimento e prestação de contas aplicáveis. Preferência de um credor também não é absoluta: outras prioridades legais e registros podem importar. Esta aula não ensina execução judicial ou extrajudicial, leilão, prazos ou estratégia em casos reais.",
      "sourceIds": [
        "cc.garantias.reais",
        "lei.fiduciaria.imovel"
      ]
    },
    {
      "id": "exemplo-limite",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: avaliação não equivale a dinheiro recuperado",
      "body": "Um relatório fictício estima um bem em R$30.000 para uma dívida de R$20.000. Não há venda, custos, prioridades nem procedimento informados. A diferença aritmética é R$10.000, mas não representa sobra já recebida pelo devedor ou lucro do credor. O valor estimado não garante que o bem será vendido por esse preço nem que toda a dívida será recuperada. Separar estimativa e fluxo evita uma falsa certeza.",
      "sourceIds": []
    },
    {
      "id": "comparar",
      "type": "explanation",
      "heading": "11. Quadro para recuperar a diferença",
      "body": "| Situação declarada | Ideia central | Erro a evitar |\n| --- | --- | --- |\n| Penhor comum | Móvel em garantia com entrega da posse | Confundir entrega com compra pelo credor |\n| Hipoteca imobiliária | Imóvel vinculado, sem transferência da propriedade por esse ato | Confundir com propriedade fiduciária |\n| Alienação fiduciária | Propriedade resolúvel transferida em garantia | Confundir uso direto com propriedade plena livre da garantia |\n\nAs modalidades especiais e os registros precisam ser conferidos. O quadro ajuda a reconhecer conceitos, sem substituir a lei de um contrato concreto.",
      "sourceIds": [
        "cc.garantias.reais",
        "lei.fiduciaria.imovel"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Palavras que mudam a leitura",
      "body": "Garantia real: vínculo jurídico de bem/direito à obrigação. Posse direta: exercício imediato na relação descrita. Posse indireta: posição que convive com a direta nos termos dessa relação. Proprietário: titular da propriedade. Fiduciante: quem transfere a propriedade em garantia. Fiduciário: quem a recebe nessa condição. Inadimplemento: descumprimento da obrigação. Avaliação: estimativa de valor; não é venda ou pagamento.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. Leia em quatro passos",
      "body": "Identifique a dívida; localize o bem e quem pode oferecê-lo; separe posse e propriedade no regime declarado; reconheça a garantia sem inventar consequências de atraso. A relação entre bem, dívida e procedimento é jurídica, não uma autorização automática para apropriação.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Compare quem fica com a posse e como se trata a propriedade nos três exemplos.",
    "Se confundiu hipoteca e alienação fiduciária, retome o que foi transferido em cada caso.",
    "Explique por que avaliação do bem não é dinheiro recuperado."
  ],
  "questions": [
    {
      "id": "pc09.q01",
      "topicId": "draft.pc09",
      "prompt": "Pessoa usa um veículo, mas o enunciado não diz quem tem a propriedade. O que podemos concluir?",
      "options": [
        "Uso sempre prova propriedade plena livre de garantia.",
        "Nada pode ser dito sobre uso, mesmo observado.",
        "Todo usuário é um fiador.",
        "A posse/uso não basta para concluir quem é proprietário."
      ],
      "answer": 3,
      "explanation": "Posse e propriedade são posições diferentes.",
      "optionRationales": [
        "Confunde poderes exercidos e titularidade.",
        "O dado de uso existe; o que falta é a titularidade.",
        "Uso não constitui fiança.",
        "Respeita a distinção ensinada."
      ],
      "recoverySectionIds": [
        "posse-propriedade"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc09.q02",
      "topicId": "draft.pc09",
      "prompt": "Joia é entregue ao credor em penhor comum validamente constituído. Qual leitura é correta?",
      "options": [
        "O credor comprou definitivamente a joia.",
        "A posse é transferida em garantia; isso não equivale a compra.",
        "É necessariamente hipoteca imobiliária.",
        "Não existe obrigação garantida."
      ],
      "answer": 1,
      "explanation": "O penhor comum informado transfere a posse vinculada à garantia.",
      "optionRationales": [
        "Entrega em garantia não é compra.",
        "Distingue posse e propriedade.",
        "A garantia e o objeto do caso são outros.",
        "O bem justamente garante uma obrigação."
      ],
      "recoverySectionIds": [
        "penhor",
        "exemplo-penhor"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc09.q03",
      "topicId": "draft.pc09",
      "prompt": "Qual frase evita generalização indevida sobre penhor?",
      "options": [
        "No penhor rural previsto no CC, o bem pode permanecer em poder do devedor; a regra do comum não se universaliza.",
        "Todo penhor exige que o devedor nunca mais veja o bem.",
        "Penhor e penhora são palavras para o mesmo instituto.",
        "Nenhum penhor envolve bem móvel."
      ],
      "answer": 0,
      "explanation": "O próprio art. 1.431 distingue a permanência nas modalidades especiais mencionadas.",
      "optionRationales": [
        "Preserva a exceção relevante.",
        "Exagera a entrega e ignora exceções.",
        "Confunde garantia com constrição processual.",
        "Contraria o objeto do penhor ensinado."
      ],
      "recoverySectionIds": [
        "penhor"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc09.q04",
      "topicId": "draft.pc09",
      "prompt": "Galpão é dado em hipoteca imobiliária registrada; a empresa continua usando-o. Qual afirmação cabe?",
      "options": [
        "A hipoteca tornou automaticamente o credor proprietário do galpão.",
        "Não pode existir garantia se a empresa usa o imóvel.",
        "Há vínculo de garantia sem transferência da propriedade por esse ato.",
        "O primeiro atraso autoriza apropriação automática."
      ],
      "answer": 2,
      "explanation": "A manutenção do uso é compatível com a hipoteca descrita.",
      "optionRationales": [
        "Troca hipoteca por transferência de propriedade em garantia.",
        "Confunde posse e ausência de garantia.",
        "Reconhece a estrutura do caso.",
        "Inventa consequência proibida pela regra ensinada."
      ],
      "recoverySectionIds": [
        "hipoteca",
        "exemplo-hipoteca"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc09.q05",
      "topicId": "draft.pc09",
      "prompt": "Na alienação fiduciária imobiliária registrada do exemplo, Joana é fiduciante. Qual combinação é correta?",
      "options": [
        "Credor tem propriedade resolúvel/posse indireta; Joana mantém posse direta conforme o caso.",
        "Joana é a credora fiduciária apenas por morar no imóvel.",
        "Ninguém tem qualquer direito sobre o imóvel.",
        "O registro é irrelevante à constituição da propriedade fiduciária imobiliária."
      ],
      "answer": 0,
      "explanation": "A lei distingue posições e exige o registro constitutivo.",
      "optionRationales": [
        "Relaciona corretamente as posições.",
        "Inverte devedora fiduciante e credor fiduciário.",
        "Ignora a relação jurídica existente.",
        "Contraria o art. 23 da Lei 9.514."
      ],
      "recoverySectionIds": [
        "fiduciaria",
        "exemplo-fiduciaria"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc09.q06",
      "topicId": "draft.pc09",
      "prompt": "Um texto diz “hipoteca só existe sobre casas e terrenos, sem exceção”. O que corrige o erro?",
      "options": [
        "Toda hipoteca é sempre sobre dinheiro.",
        "O art. 1.473 admite outros objetos, como navios e aeronaves com disciplina especial.",
        "A lei nunca lista objetos de hipoteca.",
        "O nome hipoteca dispensa registro."
      ],
      "answer": 1,
      "explanation": "O exemplo imobiliário não esgota as hipóteses legais.",
      "optionRationales": [
        "Substitui por outra generalização errada.",
        "Preserva o limite do exemplo.",
        "A enumeração legal existe.",
        "O nome não afasta os requisitos."
      ],
      "recoverySectionIds": [
        "hipoteca"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc09.q07",
      "topicId": "draft.pc09",
      "prompt": "Bem estimado em R$30.000 garante dívida de R$20.000; não há venda nem custos informados. O que é possível afirmar?",
      "options": [
        "O credor já lucrou R$10.000.",
        "O devedor já recebeu a sobra de R$10.000.",
        "A dívida foi integralmente quitada pela avaliação.",
        "A diferença estimada é R$10.000, sem provar preço de venda, sobra ou quitação."
      ],
      "answer": 3,
      "explanation": "Avaliar não é vender nem pagar a dívida.",
      "optionRationales": [
        "Não há recebimento ou lucro comprovado.",
        "Não houve fluxo de sobra informado.",
        "Estimativa não extingue a obrigação.",
        "Calcula e conserva os limites do caso."
      ],
      "recoverySectionIds": [
        "exemplo-limite",
        "inadimplemento"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc09.q08",
      "topicId": "draft.pc09",
      "prompt": "Sobre atraso de obrigação garantida, qual alternativa respeita esta aula?",
      "options": [
        "Toda garantia dá apropriação automática do bem ao credor.",
        "Todos os regimes usam prazos e procedimentos idênticos.",
        "Consequências exigem contrato e lei aplicáveis; a aula não fornece roteiro de execução.",
        "Preferência de credor nunca admite exceção legal."
      ],
      "answer": 2,
      "explanation": "Identificar garantia não substitui a disciplina de execução e prioridades.",
      "optionRationales": [
        "Cria autorização genérica indevida.",
        "Mistura regimes distintos.",
        "Reconhece o limite relevante.",
        "Apaga prioridades e condições legais."
      ],
      "recoverySectionIds": [
        "inadimplemento",
        "comparar"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc09-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc09.q01": [
        {
          "missionId": "draft.pc09",
          "sectionId": "posse-propriedade"
        }
      ],
      "pc09.q02": [
        {
          "missionId": "draft.pc09",
          "sectionId": "penhor"
        },
        {
          "missionId": "draft.pc09",
          "sectionId": "exemplo-penhor"
        }
      ],
      "pc09.q03": [
        {
          "missionId": "draft.pc09",
          "sectionId": "penhor"
        }
      ],
      "pc09.q04": [
        {
          "missionId": "draft.pc09",
          "sectionId": "hipoteca"
        },
        {
          "missionId": "draft.pc09",
          "sectionId": "exemplo-hipoteca"
        }
      ],
      "pc09.q05": [
        {
          "missionId": "draft.pc09",
          "sectionId": "fiduciaria"
        },
        {
          "missionId": "draft.pc09",
          "sectionId": "exemplo-fiduciaria"
        }
      ],
      "pc09.q06": [
        {
          "missionId": "draft.pc09",
          "sectionId": "hipoteca"
        }
      ],
      "pc09.q07": [
        {
          "missionId": "draft.pc09",
          "sectionId": "exemplo-limite"
        },
        {
          "missionId": "draft.pc09",
          "sectionId": "inadimplemento"
        }
      ],
      "pc09.q08": [
        {
          "missionId": "draft.pc09",
          "sectionId": "inadimplemento"
        },
        {
          "missionId": "draft.pc09",
          "sectionId": "comparar"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Plano 66 reaproveitado; rascunho fora do catálogo, revisão independente e humana pendentes; Fase 2 sem aceite humano observado",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Mapa histórico do plano 66; rastreabilidade específica no documento 77/78, sem adoção de edital",
      "status": "histórico; adoção pendente"
    }
  ],
  "objectives": [
    "O1: distinguir posse e propriedade",
    "O2: reconhecer penhor comum e exceções",
    "O3: reconhecer hipoteca e limites do exemplo",
    "O4: reconhecer alienação fiduciária e posições",
    "O5: separar garantia, valor e execução",
    "O6: recuperar a relação jurídica no trecho indicado"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Não esgota direitos reais, registros, preferências ou efeitos das reformas de execução. Sem modelo contratual, prazo processual ou recomendação jurídica.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [
  {
    "label": "Diferença ilustrativa de avaliação",
    "operation": "subtract",
    "values": [
      30000,
      20000
    ],
    "expected": 10000
  }
];
