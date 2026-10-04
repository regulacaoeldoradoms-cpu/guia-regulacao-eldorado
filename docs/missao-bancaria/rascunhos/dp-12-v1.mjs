export const SOURCES = [
  {
    "id": "bis.dp.bigtech",
    "label": "BIS — Big tech in finance",
    "url": "https://www.bis.org/publications/aer-2019/big-tech-finance-opportunities-risks",
    "locator": "Conceitos de plataforma, dados, rede e entrada em finanças; não estatísticas atuais",
    "version": "Annual Economic Report 2019, capítulo III",
    "checkedAt": "2026-10-01"
  },
  {
    "id": "lei.dp.lgpd",
    "label": "Lei 13.709/2018 — LGPD",
    "url": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    "locator": "Art. 6º: finalidade, adequação, necessidade e não discriminação; art. 7º: bases legais",
    "version": "Texto oficial consultado em 01/10/2026",
    "checkedAt": "2026-10-01"
  }
];

export const DP12_DRAFT = {
  "id": "draft.dp12",
  "topicId": "banking.digital-payments",
  "candidateBlockId": "banking.digital-payments",
  "editorialKey": "DP-12",
  "title": "Segmentação e interação nos canais digitais",
  "contentVersion": 1,
  "kind": "lesson",
  "publication": {
    "status": "draft"
  },
  "objective": "Interpretar segmentação como agrupamento para atender necessidades.",
  "sourceIds": [
    "bis.dp.bigtech",
    "lei.dp.lgpd"
  ],
  "sections": [
    {
      "id": "segmentos",
      "type": "explanation",
      "heading": "1. Agrupar para compreender necessidades",
      "body": "Nesta aula, segmentar significa organizar grupos por características relevantes para uma finalidade de atendimento ou oferta. Pode-se considerar uma necessidade declarada ou um comportamento observado no cenário. O grupo ajuda a planejar a interação; não descreve tudo sobre cada pessoa nem autoriza tratá-la por estereótipos. O papel de dados em plataformas é discutido pelo BIS.",
      "sourceIds": [
        "bis.dp.bigtech"
      ]
    },
    {
      "id": "ex-necessidade",
      "type": "worked-example",
      "heading": "2. Exemplo resolvido: necessidades distintas",
      "body": "No caso fictício, um grupo quer consultar despesas e outro procura informação sobre recebimentos do pequeno negócio. Organizar conteúdos por essas necessidades pode ajudar. Não se conclui que todos de um grupo têm a mesma renda, habilidade digital ou preferência de contato.",
      "sourceIds": []
    },
    {
      "id": "interacao",
      "type": "explanation",
      "heading": "3. Canal, mensagem e resposta",
      "body": "Interação envolve a troca entre instituição e usuário: informação oferecida, dúvidas, resposta e conclusão da necessidade. O canal deve ser avaliado conforme a situação. Uma mensagem enviada não prova compreensão, e um acesso ao aplicativo não prova satisfação. Observe a evidência efetivamente disponível.",
      "sourceIds": []
    },
    {
      "id": "ex-canal",
      "type": "worked-example",
      "heading": "4. Exemplo resolvido: preferência informada",
      "body": "Uma pessoa do cenário informa que prefere receber uma explicação escrita para consultar depois. Outra solicita conversa para esclarecer uma dúvida. Adequar o formato a essas necessidades é diferente de decidir a preferência de todas as pessoas pela idade ou pelo tipo de telefone.",
      "sourceIds": []
    },
    {
      "id": "dados",
      "type": "explanation",
      "heading": "5. Dados têm finalidade e limites",
      "body": "A LGPD estabelece princípios como finalidade, adequação, necessidade e não discriminação. Para uma finalidade determinada, o tratamento deve se limitar ao necessário e ter base legal aplicável. Consentimento é uma das bases previstas, não a única. Um interesse comercial não autoriza coletar qualquer informação sem examinar essas exigências.",
      "sourceIds": [
        "lei.dp.lgpd"
      ]
    },
    {
      "id": "ex-minimo",
      "type": "worked-example",
      "heading": "6. Exemplo resolvido: informação que não ajuda a tarefa",
      "body": "A tarefa fictícia é escolher se uma explicação será entregue em texto ou conversa. A preferência de formato é relevante; pedir dados sem relação com essa finalidade não se justifica apenas pela frase “pode servir para algo depois”. O exemplo aplica a ideia de necessidade, sem coletar dados reais ou resolver um caso jurídico individual.",
      "sourceIds": []
    },
    {
      "id": "indicadores",
      "type": "explanation",
      "heading": "7. Medir a etapa certa",
      "body": "Clique, mensagem aberta, resposta recebida e necessidade resolvida são indicadores diferentes. Para comparar resultados, o enunciado precisa informar o que foi contado e qual era o objetivo. Uma campanha com mais cliques não demonstra, sozinha, maior compreensão, contratação adequada ou solução do problema.",
      "sourceIds": []
    },
    {
      "id": "ex-metrica",
      "type": "worked-example",
      "heading": "8. Exemplo resolvido: resultado limitado",
      "body": "O relatório fictício informa que mais pessoas abriram uma mensagem após a mudança de título. O efeito observado é mais aberturas. Sem dados adicionais, não se pode afirmar que todas entenderam a explicação ou que suas solicitações foram resolvidas. O resultado é útil, mas limitado à etapa medida.",
      "sourceIds": []
    },
    {
      "id": "glossario",
      "type": "glossary",
      "heading": "Vocabulário essencial",
      "body": "Segmentação: agrupamento por critérios relevantes a uma finalidade. Interação: troca entre usuário e instituição. Indicador: medida de uma etapa ou resultado definido. Necessidade: limitação ao tratamento pertinente à finalidade. Base legal: hipótese jurídica aplicável ao tratamento.",
      "sourceIds": []
    },
    {
      "id": "resumo",
      "type": "summary",
      "heading": "Recuperação e síntese",
      "body": "Use a característica informada sem inventar toda a pessoa. Relacione o indicador ao objetivo e o dado à finalidade. Se errar, nomeie a confusão, retome o trecho indicado e reconstrua o exemplo com suas palavras. Esta prática exposta não é avaliação independente de retenção.",
      "sourceIds": []
    }
  ],
  "questions": [
    {
      "prompt": "Agrupar usuários por necessidade declarada de consulta ou recebimento é, no recorte didático:",
      "options": [
        "Prova de que todos do grupo são iguais.",
        "Autorização para usar qualquer dado.",
        "Uma forma de segmentar para organizar atendimento.",
        "Garantia de contratação de um produto."
      ],
      "answer": 2,
      "explanation": "Relaciona agrupamento e necessidade.",
      "optionRationales": [
        "A característica não descreve toda a pessoa.",
        "Finalidade e base legal continuam relevantes.",
        "Relaciona agrupamento e necessidade.",
        "Não há garantia de resultado comercial."
      ],
      "recoverySectionIds": [
        "segmentos",
        "ex-necessidade"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp12.q01"
    },
    {
      "prompt": "A pessoa informa preferência por explicação escrita. Qual resposta se apoia no dado do caso?",
      "options": [
        "Considerar esse formato para a necessidade descrita.",
        "Presumir a preferência de todos da mesma idade.",
        "Concluir que ela nunca precisa conversar.",
        "Deduzir sua renda pelo formato."
      ],
      "answer": 0,
      "explanation": "Usa a informação pertinente sem extrapolar.",
      "optionRationales": [
        "Usa a informação pertinente sem extrapolar.",
        "Transforma um caso em estereótipo.",
        "A preferência do cenário não cobre toda situação futura.",
        "Não há relação demonstrada com renda."
      ],
      "recoverySectionIds": [
        "interacao",
        "ex-canal"
      ],
      "objectiveIds": [
        "O3"
      ],
      "id": "dp12.q02"
    },
    {
      "prompt": "A frase “pode ser útil algum dia” basta para coletar qualquer dado?",
      "options": [
        "Sim, se houver objetivo comercial.",
        "Sim, se o serviço for digital.",
        "Sim, se a plataforma for grande.",
        "Não; finalidade, necessidade e base legal devem ser consideradas."
      ],
      "answer": 3,
      "explanation": "Reconhece os critérios ensinados.",
      "optionRationales": [
        "Interesse comercial não afasta os requisitos.",
        "O canal não afasta proteção de dados.",
        "Porte não elimina regras.",
        "Reconhece os critérios ensinados."
      ],
      "recoverySectionIds": [
        "dados",
        "ex-minimo"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp12.q03"
    },
    {
      "prompt": "Segundo o recorte da LGPD estudado, consentimento é:",
      "options": [
        "A única base possível para qualquer tratamento.",
        "Uma das bases previstas, exigindo considerar a hipótese aplicável.",
        "Dispensa de finalidade.",
        "Permissão para discriminação ilícita."
      ],
      "answer": 1,
      "explanation": "Evita universalizar uma base.",
      "optionRationales": [
        "A lei prevê outras hipóteses.",
        "Evita universalizar uma base.",
        "Princípios continuam aplicáveis.",
        "O princípio de não discriminação continua relevante."
      ],
      "recoverySectionIds": [
        "dados"
      ],
      "objectiveIds": [
        "O4"
      ],
      "id": "dp12.q04"
    },
    {
      "prompt": "Mais aberturas de uma mensagem, sem outros dados, comprovam:",
      "options": [
        "Apenas maior quantidade de aberturas na comparação descrita.",
        "Resolução de toda solicitação.",
        "Compreensão de todo leitor.",
        "Adequação de todo produto ofertado."
      ],
      "answer": 0,
      "explanation": "Mantém a conclusão na etapa medida.",
      "optionRationales": [
        "Mantém a conclusão na etapa medida.",
        "Resolução é outro resultado.",
        "Abrir não comprova compreender.",
        "Abertura não avalia adequação do produto."
      ],
      "recoverySectionIds": [
        "indicadores",
        "ex-metrica"
      ],
      "objectiveIds": [
        "O5"
      ],
      "id": "dp12.q05"
    },
    {
      "prompt": "Qual afirmação respeita os limites da segmentação?",
      "options": [
        "Todos do grupo têm a mesma renda.",
        "Todo usuário de aplicativo prefere sempre o mesmo canal.",
        "Uma característica comum pode ajudar a organizar a interação, sem descrever toda a pessoa.",
        "Agrupar elimina a necessidade de ouvir o usuário."
      ],
      "answer": 2,
      "explanation": "Preserva utilidade e limite do agrupamento.",
      "optionRationales": [
        "A necessidade comum não prova renda igual.",
        "Canal usado não determina toda preferência.",
        "Preserva utilidade e limite do agrupamento.",
        "A resposta individual continua relevante."
      ],
      "recoverySectionIds": [
        "segmentos",
        "ex-necessidade"
      ],
      "objectiveIds": [
        "O1",
        "O2"
      ],
      "id": "dp12.q06"
    },
    {
      "prompt": "Para comparar se uma mudança resolveu melhor a necessidade do usuário, basta contar cliques?",
      "options": [
        "Sim, porque clique é resolução.",
        "Não; é preciso indicador relacionado à resolução e dados compatíveis com o objetivo.",
        "Sim, porque abertura é compreensão.",
        "Sim, porque toda interação gera resultado positivo."
      ],
      "answer": 1,
      "explanation": "Liga medida ao objetivo real.",
      "optionRationales": [
        "Confunde etapas.",
        "Liga medida ao objetivo real.",
        "Outra confusão de etapas.",
        "Resultado positivo não é automático."
      ],
      "recoverySectionIds": [
        "indicadores"
      ],
      "objectiveIds": [
        "O3",
        "O5"
      ],
      "id": "dp12.q07"
    },
    {
      "prompt": "O aluno confundiu mensagem aberta com problema resolvido. Qual recuperação ataca o erro?",
      "options": [
        "Somar cliques de outro canal sem critério.",
        "Ignorar o objetivo de atendimento.",
        "Declarar sucesso sem medir.",
        "Reconstituir a sequência e identificar exatamente qual etapa foi observada."
      ],
      "answer": 3,
      "explanation": "Separa observação e resultado pretendido.",
      "optionRationales": [
        "Mais contagens não corrigem a definição.",
        "O objetivo orienta a escolha da medida.",
        "Repete a inferência indevida.",
        "Separa observação e resultado pretendido."
      ],
      "recoverySectionIds": [
        "indicadores",
        "ex-metrica",
        "resumo"
      ],
      "objectiveIds": [
        "O6"
      ],
      "id": "dp12.q08"
    }
  ],
  "recall": [
    "Use a característica informada sem inventar toda a pessoa.",
    "Relacione o indicador ao objetivo e o dado à finalidade."
  ],
  "teaching": {
    "contractVersion": 1,
    "editorialPass": "dp12-autoria-r1",
    "reviewStatus": "human-review-pending",
    "questionCoverage": {
      "dp12.q01": [
        {
          "missionId": "draft.dp12",
          "sectionId": "segmentos"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-necessidade"
        }
      ],
      "dp12.q02": [
        {
          "missionId": "draft.dp12",
          "sectionId": "interacao"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-canal"
        }
      ],
      "dp12.q03": [
        {
          "missionId": "draft.dp12",
          "sectionId": "dados"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-minimo"
        }
      ],
      "dp12.q04": [
        {
          "missionId": "draft.dp12",
          "sectionId": "dados"
        }
      ],
      "dp12.q05": [
        {
          "missionId": "draft.dp12",
          "sectionId": "indicadores"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-metrica"
        }
      ],
      "dp12.q06": [
        {
          "missionId": "draft.dp12",
          "sectionId": "segmentos"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-necessidade"
        }
      ],
      "dp12.q07": [
        {
          "missionId": "draft.dp12",
          "sectionId": "indicadores"
        }
      ],
      "dp12.q08": [
        {
          "missionId": "draft.dp12",
          "sectionId": "indicadores"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "ex-metrica"
        },
        {
          "missionId": "draft.dp12",
          "sectionId": "resumo"
        }
      ]
    }
  }
};

export const EDITORIAL = {
  "stage": "Autoria concluída; revisão pedagógica independente pendente; fora do catálogo",
  "referenceOnlyProfiles": [
    {
      "id": "bb.agente-comercial.2022-001",
      "item": "Atualidades 14",
      "status": "histórico; referenceOnly"
    },
    {
      "id": "caixa.tbn.2024-nm",
      "item": "Sem correspondência nominal; recorte específico BB no perfil histórico",
      "status": "histórico; referenceOnly"
    }
  ],
  "objectives": {
    "O1": "Interpretar segmentação como agrupamento para atender necessidades.",
    "O2": "Distinguir característica observada de conclusão sobre toda pessoa.",
    "O3": "Adequar interação ao objetivo e ao canal descritos.",
    "O4": "Reconhecer finalidade, necessidade e limites no uso de dados.",
    "O5": "Separar indicador de interação de resultado do serviço.",
    "O6": "Recuperar a confusão pela seção de ensino e refazer o caso."
  },
  "recovery": {
    "objectiveId": "O6",
    "instruction": "Nomear a confusão e reconstruir o caso após retomar o ensino."
  },
  "limits": [
    "Correspondência nominal apenas no BB histórico; LGPD usada como limite ao uso de dados, sem ampliar esta aula para curso jurídico.",
    "Não ensina coleta, perfilamento de pessoas reais ou decisão automatizada de crédito.",
    "Casos e números autorais fictícios; não representam operação, oferta ou dado pessoal real.",
    "Sem XP/ordem/desbloqueio ou importação no runtime; não equivale a aceite humano da Fase 2."
  ]
};

export const ARITHMETIC = [];
