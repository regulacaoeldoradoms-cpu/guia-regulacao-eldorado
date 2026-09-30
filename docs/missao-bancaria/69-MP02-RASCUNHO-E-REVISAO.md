# MP-02 — moeda, pagamentos e liquidez em rascunho

30/09/2026. Fase 2 ativa; aceite humano **não observado**. Continuidade de autoria autorizada não é aceite nem abertura da Fase 3. Unidade prevista no [plano 66 da #559](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria/66-ESPECIFICACAO-PROXIMOS-BLOCOS-BANCARIOS.md), sem nova auditoria curricular.

Leia a [aula e prática MP-02](rascunhos/mp-02-v1.md). Fonte editorial: [mp-02-v1.mjs](rascunhos/mp-02-v1.mjs). Reutiliza o formato MP-01; nenhuma modificação no manifesto/runtime. Identificadores `draft.mp02` locais, sem XP, ordem ou gate de acesso.

## Delimitação e entrega

Objetivo: compreender funções da moeda, distinguir instrumento e recurso, calcular saldos simples e reconhecer falta de liquidez em datas diferentes. Pré-requisito editorial: MP-01, também em rascunho; seus termos essenciais são retomados. Vocabulário e soma/subtração são ensinados antes de cobrar aplicação. Não introduz multiplicador, agregados monetários, criação de moeda, regras de contratação ou taxas atuais.

| Objetivo local | Ensino/exemplo | Prática/recuperação |
| --- | --- | --- |
| O1 — três funções e seus limites | `funcoes`, `exemplo-funcoes` | q01/q02, primeiro prompt |
| O2 — instrumento, saldo próprio e limite | `instrumento`, `exemplo-instrumento` | q03/q06 |
| O3 — saldo e movimentações | `datas`, exemplos de Rui e Lia | q03/q04, segundo prompt |
| O4 — liquidez e vencimento | `liquidez`, exemplos de Lia e Oficina Brisa | q04/q05 |
| O5 — informação insuficiente | `limites`, ressalvas dos exemplos | q02/q05/q06 |
| O6 — recuperação do erro | `resumo`, referências por questão | terceiro prompt; reconstrução da conta/linha do tempo |

São 12 trechos, quatro exemplos resolvidos, seis questões, 24 justificativas e três prompts de recordação/recuperação. Valores e personagens são fictícios; nenhuma taxa foi pesquisada ou usada. Somar patrimônio avaliado a saldo disponível, antecipar recebimento futuro e contar saldo novamente como cartão são erros tratados explicitamente. A função destacada em uma situação não exclui as demais funções da moeda.

## Fontes e revisão proporcional

Reaproveitado o Caderno de Educação Financeira do BCB, edição 2026: orçamento/crédito já consultados; liquidez localizada em 5.3, páginas impressas 60–61. Duas fontes complementares pontuais: nota do Banco Central Europeu, atualizada em 19/06/2024, somente para funções gerais da moeda; página educacional legada do BCB, somente para instrumento/movimentação de pagamentos. Todas conferidas em 30/09/2026, com URL e localizador no rascunho. Não foram transpostas regras europeias ao Brasil nem consideradas vigentes as normas antigas listadas na página legada.

B/C/E redigidas; revisão factual/editorial e contas conferidas pelo autor. Revisão independente de MP-02 aprovada por leitura integral no commit `5bedc461bc54e886e859dc8b91f0844db70aad85`, sem erro conceitual, ambiguidade relevante ou pré-requisito ausente; não repetiu esquema, contas ou fontes. Clareza humana/aceite de publicação pendentes; F não iniciada. A revisão independente de MP-01 foi reaproveitada, sem repetição: corrigidas a obrigação do distribuidor na seção 4 e a identificação de dois bancos na q04. Prática exposta continua separada de A/B e não comprova aprendizagem.

Validação: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=mp02`. O validador editorial existente aceita a segunda unidade e preserva o comando original. Confere estrutura, fontes, gabaritos, justificativas, cobertura e recuperação, prévia gerada, UTF-8/links e dez contas de soma/subtração. O filtro real exclui o draft sem mudar a lista publicada. Validar MP-01 apenas para as duas correções e o reaproveitamento do gerador; não repetir suíte integral do aplicativo.

Continuidade atual: revisão dos novos recortes no [conjunto MP](71-MP-BLOCO-RASCUNHO-E-REVISAO.md), preservando MP-02 aprovada. O status de autoria na prévia original antecede a revisão independente registrada aqui; seu corpo, exemplos e questões não mudaram. Revisões humanas dos rascunhos permanecem separadas do [checklist de aceite da Fase 2](68-MP01-RASCUNHO-E-REVISAO.md#checklist-humano-mínimo-da-fase-2). Nenhum conteúdo novo foi publicado.
