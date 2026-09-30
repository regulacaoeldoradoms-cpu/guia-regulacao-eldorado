// Rascunho editorial isolado; não importar no runtime.
export const SOURCES = [
  {
    "id": "cc.garantias.pessoais",
    "label": "Código Civil — fiança e aval",
    "url": "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
    "locator": "Arts. 818–819, 823, 827–828 e 897–903; art. 903 ressalva a legislação especial dos títulos",
    "version": "Fonte oficial consultada em 30/09/2026; regras do recorte identificado",
    "checkedAt": "2026-09-30"
  }
];

export const PC08_DRAFT = {
  "id": "draft.pc08",
  "topicId": "draft.pc08",
  "editorialKey": "PC-08",
  "candidateBlockId": "banking.products-credit",
  "title": "Garantias pessoais: aval, fiança e fiança bancária",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Distinguir devedor, credor e garantidor, comparar aval e fiança em instrumentos didáticos e reconhecer o alcance condicionado do benefício de ordem.",
  "sourceIds": [
    "cc.garantias.pessoais"
  ],
  "sections": [
    {
      "id": "inicio",
      "type": "explanation",
      "heading": "1. Primeiro, a obrigação e suas partes",
      "body": "Em [PC-02](pc-02-v1.md#vocabulario), devedor é quem deve cumprir a obrigação e credor é quem tem o direito de exigir o pagamento. A obrigação principal é a dívida que queremos garantir. Um terceiro pode assumir uma garantia pessoal: ele passa a responder nos termos do instrumento e da lei. Isso não significa que escolheu um bem específico como garantia, nem que o devedor original deixou de dever. Uma pessoa jurídica, inclusive um banco nos instrumentos apropriados, também pode prestar uma garantia pessoal.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "fianca",
      "type": "explanation",
      "heading": "2. Fiança: promessa ao credor sobre a dívida de outro",
      "body": "Na fiança, o fiador garante ao credor satisfazer a obrigação assumida pelo devedor se este não a cumprir. O contrato deve ser escrito e não admite interpretação que amplie seu alcance além do que se pode extrair legitimamente do instrumento. A garantia pode ter valor ou condições menos onerosos que a obrigação principal; não se deve presumir cobertura ilimitada. Chamar alguém de contato, referência ou testemunha não equivale, por si só, a contratar fiança.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "exemplo-fianca",
      "type": "worked-example",
      "heading": "3. Exemplo resolvido: nomear três posições",
      "body": "Instrumento fictício válido: “Lia deve R$2.000 a Credora C. Bruno presta fiança por escrito dessa obrigação, no alcance descrito no contrato”. Passo 1: Lia é a devedora principal. Passo 2: C é a credora. Passo 3: Bruno é o fiador. Nada no caso transfere a dívida principal para C nem libera Lia. O exemplo identifica papéis; não é modelo de contrato e não resolve eventuais exceções de validade.",
      "sourceIds": []
    },
    {
      "id": "ordem",
      "type": "explanation",
      "heading": "4. Benefício de ordem: regra com condições e exceções",
      "body": "O benefício de ordem permite ao fiador demandado exigir primeiro a execução de bens do devedor, observadas as condições legais. Pelo art. 827, ele deve alegá-lo no momento processual previsto e indicar bens do devedor situados no mesmo município, livres e suficientes para a dívida. Não é um adiamento automático nem uma garantia de que o fiador nunca pagará. O art. 828 afasta esse benefício, entre outras hipóteses expressas, quando o fiador renuncia a ele, assume como principal pagador/devedor solidário, ou o devedor é insolvente ou falido. Aqui “solidário” indica possibilidade de exigir a obrigação nos termos dessa responsabilidade; não significa dividir obrigatoriamente a cobrança em partes iguais.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "exemplo-ordem",
      "type": "worked-example",
      "heading": "5. Exemplo resolvido: a cláusula faz diferença",
      "body": "Caso A informa fiança válida, condições legais do benefício preenchidas e nenhuma exceção aplicável: o fiador pode invocar o benefício de ordem. Caso B informa renúncia expressa válida a esse benefício: não cabe afirmar que o credor precisa sempre executar primeiro os bens do devedor com base nesse benefício. Passo 1: identificar a fiança; passo 2: ler a condição do caso; passo 3: aplicar a regra correspondente, sem acrescentar uma renúncia inexistente nem ignorar a que foi dada.",
      "sourceIds": []
    },
    {
      "id": "aval",
      "type": "explanation",
      "heading": "6. Aval: garantia de pagamento no título de crédito",
      "body": "Título de crédito é o instrumento que representa um direito de crédito sob requisitos próprios. Aval é a garantia do pagamento de obrigação representada no título. Avalista é quem presta o aval; avalizado é aquele cuja obrigação no título é garantida. Não se deve chamar aval de fiança apenas porque ambos têm função de garantia pessoal. O Código Civil traz regras gerais nos arts. 897–903; legislação especial do título pode estabelecer disciplina diferente. A aula não generaliza formalidades de assinatura nem permissão/proibição de aval parcial para todos os títulos.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "autonomia",
      "type": "explanation",
      "heading": "7. Por que o aval não herda automaticamente todas as defesas",
      "body": "Na regra geral do art. 899, o avalista responde de modo equivalente ao avalizado; a responsabilidade pode subsistir mesmo quando a obrigação avalizada seja nula, salvo nulidade decorrente de vício de forma. Isso ajuda a entender sua autonomia: um defeito na obrigação garantida não libera automaticamente o avalista em qualquer situação. Ao pagar, o avalista tem direito de regresso nos termos legais — pode buscar de quem for juridicamente responsável o valor pago. Regresso é direito de cobrança, não certeza de que conseguirá receber. A fiança tem vínculo acessório com a obrigação principal; comparar os instrumentos não dispensa verificar a lei aplicável ao caso.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "exemplo-aval",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: pagamento e regresso",
      "body": "Caso simplificado regido pelas regras gerais ensinadas: Ana é a devedora avalizada em título; Rui presta aval válido e depois paga R$1.500 ao credor. Primeiro identificamos Rui como avalista e Ana como avalizada. Depois separamos dois momentos: Rui cumpriu a garantia perante o credor e pode exercer o regresso nos termos legais. O pagamento não torna Rui automaticamente sócio de Ana nem prova recebimento imediato do reembolso. Não estamos redigindo ou validando um título real.",
      "sourceIds": []
    },
    {
      "id": "bancaria",
      "type": "explanation",
      "heading": "9. Fiança bancária: o banco ocupa o lugar de fiador",
      "body": "Quando um banco presta fiança, a identidade do fiador explica a expressão fiança bancária. O beneficiário da garantia é o credor da obrigação coberta; o cliente afiançado é o devedor garantido. A emissão da garantia não significa necessariamente que o banco já entregou o valor da dívida ao cliente ou pagou o credor. Alcance, vigência, condições para exigir a garantia e eventuais custos/reembolso precisam ser lidos no instrumento e na disciplina aplicável. O nome bancária não transforma fiança em seguro, aval ou crédito gratuito.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "exemplo-bancaria",
      "type": "worked-example",
      "heading": "10. Exemplo resolvido: emitir não é pagar",
      "body": "Uma empresa deve cumprir obrigação perante Fornecedora F. Banco B presta fiança válida, dentro de limite e prazo expressos. Passo 1: F é a beneficiária; B é o fiador; a empresa é a afiançada. Passo 2: a prestação da garantia não demonstra desembolso já realizado. Passo 3: se houver descumprimento, a análise depende da obrigação e das condições da fiança. O caso não permite concluir que B cobriu dívidas futuras não descritas.",
      "sourceIds": []
    },
    {
      "id": "comparar",
      "type": "explanation",
      "heading": "11. Compare o instrumento, não a aparência",
      "body": "| Pergunta | Fiança | Aval |\n| --- | --- | --- |\n| Onde se identifica a garantia? | No contrato escrito de fiança | No título, segundo sua disciplina |\n| Quem garante? | Fiador, que pode ser banco | Avalista |\n| Benefício de ordem do CC 827? | Depende de condições e exceções | Não transferir essa regra da fiança para o aval |\n| O que deve ser conferido? | Obrigação, alcance e condições | Título, avalizado e lei aplicável |\n\nNenhuma linha desta comparação autoriza cobrança em caso real ou elimina requisitos legais. Uma garantia pessoal não dispensa avaliar o risco de quem deverá pagar.",
      "sourceIds": [
        "cc.garantias.pessoais"
      ]
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "12. Vocabulário jurídico mínimo",
      "body": "Afiançado: devedor cuja obrigação é coberta pela fiança. Fiador: quem presta a fiança. Avalizado: obrigado no título que recebe a garantia. Avalista: quem presta o aval. Beneficiário: quem pode exigir a garantia nos seus termos. Benefício de ordem: faculdade condicionada do fiador, com exceções. Regresso: busca de ressarcimento após pagar obrigação de outro. Vício de forma: defeito em requisito formal do instrumento, não qualquer dificuldade financeira.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "13. Antes de responder",
      "body": "Marque credor, devedor e garantidor. Identifique contrato de fiança ou aval em título. Na fiança, confira alcance e condições do benefício de ordem. No aval, não transporte automaticamente regras da fiança ou ignore a lei especial. Se o garantidor é banco, ainda é necessário ler o instrumento; a emissão, o pagamento e o reembolso são eventos distintos.",
      "sourceIds": []
    }
  ],
  "recall": [
    "Desenhe as três posições de uma fiança e de um aval.",
    "Reconstrua os dois casos do benefício de ordem sem retirar suas condições.",
    "Explique por que emissão da fiança bancária, pagamento e regresso não são o mesmo evento."
  ],
  "questions": [
    {
      "id": "pc08.q01",
      "topicId": "draft.pc08",
      "prompt": "Lia deve a C; Bruno presta fiança por escrito. Quem é o fiador?",
      "options": [
        "Lia, porque recebeu recursos.",
        "C, porque pode cobrar.",
        "Bruno, porque assumiu a garantia.",
        "Todos se tornam automaticamente fiadores."
      ],
      "answer": 2,
      "explanation": "O fiador é o terceiro que prestou a fiança, sem inverter as posições da dívida.",
      "optionRationales": [
        "Lia é devedora principal.",
        "C é credora.",
        "Identifica o garantidor.",
        "Os papéis são distintos."
      ],
      "recoverySectionIds": [
        "fianca",
        "exemplo-fianca"
      ],
      "objectiveIds": [
        "O1"
      ]
    },
    {
      "id": "pc08.q02",
      "topicId": "draft.pc08",
      "prompt": "Sobre a fiança ensinada, qual afirmação é correta?",
      "options": [
        "Deve ser escrita e seu alcance não pode ser ampliado por interpretação extensiva.",
        "Qualquer indicação de contato cria fiança ilimitada.",
        "Sempre libera o devedor principal.",
        "Só pessoas físicas podem prestá-la."
      ],
      "answer": 0,
      "explanation": "A forma e os limites da obrigação são centrais para a fiança.",
      "optionRationales": [
        "Corresponde ao CC 819.",
        "Contato não é contratação da garantia.",
        "A obrigação principal não desaparece.",
        "O banco pode ser fiador."
      ],
      "recoverySectionIds": [
        "fianca",
        "bancaria"
      ],
      "objectiveIds": [
        "O2"
      ]
    },
    {
      "id": "pc08.q03",
      "topicId": "draft.pc08",
      "prompt": "O fiador renunciou expressamente e validamente ao benefício de ordem. Qual resposta respeita esse dado?",
      "options": [
        "A renúncia não faz diferença em hipótese alguma.",
        "O fiador deixa de ser garantidor.",
        "O credor passa a dever ao fiador.",
        "Não se pode exigir sempre a execução prévia do devedor com base no benefício renunciado."
      ],
      "answer": 3,
      "explanation": "A renúncia é uma das exceções expressas do CC 828.",
      "optionRationales": [
        "Ignora a exceção ensinada.",
        "Renunciar ao benefício não extingue a fiança.",
        "Inverte a relação.",
        "Aplica a condição informada."
      ],
      "recoverySectionIds": [
        "ordem",
        "exemplo-ordem"
      ],
      "objectiveIds": [
        "O3"
      ]
    },
    {
      "id": "pc08.q04",
      "topicId": "draft.pc08",
      "prompt": "Quem presta aval válido de obrigação representada em título de crédito é chamado de:",
      "options": [
        "afiançado, necessariamente.",
        "avalista.",
        "credor principal, necessariamente.",
        "proprietário do banco."
      ],
      "answer": 1,
      "explanation": "Avalista é o garantidor; avalizado é o obrigado garantido.",
      "optionRationales": [
        "Afiançado pertence ao vocabulário da fiança.",
        "Usa o termo correto.",
        "Garantir não torna necessariamente credor inicial.",
        "Não há relação societária presumida."
      ],
      "recoverySectionIds": [
        "aval"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc08.q05",
      "topicId": "draft.pc08",
      "prompt": "No recorte geral do art. 899, um colega diz que qualquer nulidade da obrigação avalizada elimina o aval. Qual correção cabe?",
      "options": [
        "A responsabilidade pode subsistir; o texto ressalva o vício de forma e é necessário observar a lei aplicável.",
        "Toda nulidade é sempre irrelevante, inclusive a de forma.",
        "O aval se converte automaticamente em fiança bancária.",
        "Basta a dificuldade financeira do avalizado para liberar o avalista."
      ],
      "answer": 0,
      "explanation": "A regra de autonomia tem limites; nenhum dos extremos descreve o ensino.",
      "optionRationales": [
        "Preserva regra, ressalva e âmbito.",
        "Apaga a ressalva expressa.",
        "Não existe essa transformação automática.",
        "Dificuldade financeira não equivale à exoneração."
      ],
      "recoverySectionIds": [
        "autonomia",
        "aval"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc08.q06",
      "topicId": "draft.pc08",
      "prompt": "Banco B presta fiança em favor de F, garantindo obrigação da empresa E. Apenas essa emissão prova que:",
      "options": [
        "F emprestou ao banco o valor integral.",
        "E não deve mais nada.",
        "B assumiu a garantia nos seus termos, sem comprovar desembolso já realizado.",
        "B pagou necessariamente todas as dívidas de E."
      ],
      "answer": 2,
      "explanation": "Garantia emitida, dívida e pagamento são eventos distintos.",
      "optionRationales": [
        "Inventa fluxo de recursos.",
        "A emissão não quita a obrigação principal.",
        "Limita a conclusão ao fato dado.",
        "Amplia alcance e presume pagamento."
      ],
      "recoverySectionIds": [
        "bancaria",
        "exemplo-bancaria"
      ],
      "objectiveIds": [
        "O5"
      ]
    },
    {
      "id": "pc08.q07",
      "topicId": "draft.pc08",
      "prompt": "Um avalista pagou a obrigação do título. O direito de regresso significa:",
      "options": [
        "participação automática na empresa do avalizado.",
        "direito de buscar ressarcimento de responsáveis nos termos legais, sem garantia de recebimento.",
        "devolução instantânea pelo BCB.",
        "desaparecimento de qualquer relação com o avalizado."
      ],
      "answer": 1,
      "explanation": "Regresso descreve um direito posterior ao pagamento, não uma garantia econômica de sucesso.",
      "optionRationales": [
        "Não é aquisição societária.",
        "Separa direito e resultado financeiro.",
        "Não é atribuição automática do BCB.",
        "O pagamento pode justamente originar esse direito."
      ],
      "recoverySectionIds": [
        "autonomia",
        "exemplo-aval"
      ],
      "objectiveIds": [
        "O4"
      ]
    },
    {
      "id": "pc08.q08",
      "topicId": "draft.pc08",
      "prompt": "Um material pretende aplicar a todos os títulos cada formalidade geral do Código Civil, ignorando leis especiais. Qual atitude é correta?",
      "options": [
        "Aceitar porque aval e fiança são idênticos.",
        "Usar apenas a idade do avalista para escolher a lei.",
        "Tratar qualquer aval como hipoteca.",
        "Identificar o título e sua lei; o CC 903 ressalva disciplina especial."
      ],
      "answer": 3,
      "explanation": "O instrumento e o regime jurídico importam; a aula não universaliza regras específicas.",
      "optionRationales": [
        "Os institutos não são idênticos.",
        "A idade não identifica sozinha o regime do título.",
        "Garantia pessoal não vira real por essa razão.",
        "Reconhece o limite da regra geral."
      ],
      "recoverySectionIds": [
        "aval",
        "comparar"
      ],
      "objectiveIds": [
        "O5"
      ]
    }
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "pc08-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "pc08.q01": [
        {
          "missionId": "draft.pc08",
          "sectionId": "fianca"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "exemplo-fianca"
        }
      ],
      "pc08.q02": [
        {
          "missionId": "draft.pc08",
          "sectionId": "fianca"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "bancaria"
        }
      ],
      "pc08.q03": [
        {
          "missionId": "draft.pc08",
          "sectionId": "ordem"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "exemplo-ordem"
        }
      ],
      "pc08.q04": [
        {
          "missionId": "draft.pc08",
          "sectionId": "aval"
        }
      ],
      "pc08.q05": [
        {
          "missionId": "draft.pc08",
          "sectionId": "autonomia"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "aval"
        }
      ],
      "pc08.q06": [
        {
          "missionId": "draft.pc08",
          "sectionId": "bancaria"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "exemplo-bancaria"
        }
      ],
      "pc08.q07": [
        {
          "missionId": "draft.pc08",
          "sectionId": "autonomia"
        },
        {
          "missionId": "draft.pc08",
          "sectionId": "exemplo-aval"
        }
      ],
      "pc08.q08": [
        {
          "missionId": "draft.pc08",
          "sectionId": "aval"
        },
        {
          "missionId": "draft.pc08",
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
    "O1: identificar partes da obrigação",
    "O2: reconhecer fiança escrita e alcance",
    "O3: aplicar benefício de ordem condicionado",
    "O4: distinguir aval, autonomia e regresso",
    "O5: reconhecer fiança bancária e âmbito legal",
    "O6: recuperar o conceito na comparação indicada"
  ],
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Retomar os trechos indicados, explicar a confusão e reconstruir o caso antes de repetir; não gerar indicador de domínio."
  },
  "limits": [
    "Aula introdutória, não formulário contratual nem parecer jurídico. Não esgota outorga conjugal, capacidade, formalidades de cada título ou execução de garantias.",
    "Aval parcial e detalhes de títulos especiais não são cobrados: regras gerais do CC não devem ser universalizadas.",
    "Casos fictícios originais, sem recomendação para pessoa real. Fontes primárias consultadas em 30/09/2026; conferir alterações pertinentes antes de publicação futura.",
    "Prática exposta, fora de avaliações independentes. IDs locais, sem XP/ordem/gate produtivo ou importação no manifesto. Não demonstra cobertura integral do bloco ou edital histórico."
  ]
};

export const ARITHMETIC = [];
