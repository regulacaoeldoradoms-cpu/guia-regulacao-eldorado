# MP — conjunto introdutório em rascunho

30/09/2026. Fase 2 ativa; aceite humano não observado. MP-01–09 e MP-R são preparação editorial de `banking.markets-policy`, fora do catálogo. Não abrem Fase 3, não publicam conteúdo e não alteram dados de estudo.

## Escopo e sequência

Reaproveita o plano 66 e a matriz 65 da [#559, commit 400d4854](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/tree/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria), sem integrar aquela PR nem repetir a auditoria. São recortes introdutórios, não certificação de cobertura integral dos itens amplos. Perfis BB 2022/001 e CAIXA 2024/NM continuam históricos, separados e sem adoção como edital vigente. Identificadores O1–O6 abaixo pertencem a cada aula, não ao produto.

| Unidade | Pré-requisito de ensino/acesso | Recorte histórico BB | Recorte histórico CAIXA |
| --- | --- | --- | --- |
| MP-01 — mercados | SFN inicial | 2 | 3 |
| MP-02 — moeda, pagamento, liquidez | MP-01 | 3 | 16/17 |
| MP-03 — preços e juros | MP-02; porcentagens ensinadas na aula | 3/14 | 16/17 e item impresso 278, posição 28 |
| MP-04 — objetivos e transmissão | MP-02/03 e CMN/BCB/Copom | 3 | 16/17 |
| MP-05 — operações convencionais | MP-04 e liquidez de MP-02 | 3 | 16/17 |
| MP-06 — QE e depósitos datados | MP-04/05 | 3: não convencionais e debate sobre depósitos | 16: política convencional/não convencional; 17: depósitos remunerados |
| MP-07 — orçamento, dívida, títulos | MP-01/03/05 | 4 | 18 |
| MP-08 — interbancário, tesouraria, varejo | MP-01/02/05 | 12 e parte de 13 | 26 e parte de 27 |
| MP-09 — curva de juros | MP-03/07; leitura de gráfico ensinada na aula | 14 | item impresso 278, posição 28 |
| MP-R — revisão cumulativa | Todas as anteriores efetivamente ensinadas e acessíveis | recortes acima | recortes acima |

O conjunto não omite temas complexos para alegar fechamento: MP-06 apresenta QE pelo exemplo britânico e a autorização legal brasileira dos depósitos, sem equipará-los. Profundidade do debate histórico de custos/alternativas, produtos interbancários específicos e apuração de DI, detalhes fiscais e estimação/precificação da curva continuam pendentes de recorte e fontes antes de cobrança. O item de tesouraria/varejo inclui assuntos que seguem para PC-10; não foi declarado integralmente coberto.

## Ensino → prática → recuperação

Entrega desta etapa: **MP-04–09 + MP-R**, 80 trechos, 25 exemplos resolvidos, 50 questões/200 justificativas, 21 prompts de recordação e 43 verificações aritméticas. Conjunto MP-01–09/MP-R: 119 trechos, 39 exemplos e 72 questões/288 justificativas. Contagem de material não mede cobertura de edital ou prontidão.

Leitura: [MP-04](rascunhos/mp-04-v1.md), [MP-05](rascunhos/mp-05-v1.md), [MP-06](rascunhos/mp-06-v1.md), [MP-07](rascunhos/mp-07-v1.md), [MP-08](rascunhos/mp-08-v1.md), [MP-09](rascunhos/mp-09-v1.md), [MP-R](rascunhos/mp-r-v1.md). Fontes editoriais `.mjs` estão vinculadas em cada prévia.

Cada arquivo `.mjs` é a fonte editorial única da prévia Markdown. Há leitura antes das questões, exemplos resolvidos, quatro justificativas por item e vínculos de recuperação. O6 é sempre reconstruir o raciocínio após erro: consultar a origem, explicar o distrator e alterar um dado/participante. Isso não implanta diagnóstico automático nem muda o agendamento das revisões.

| Unidade | O1 | O2 | O3 | O4 | O5 |
| --- | --- | --- | --- | --- | --- |
| MP-04 | objetivo/instrumento: q01 | meta/efetiva: q02 | transmissão: q03/q06 | canais/contexto: q04 | tempo/limites: q05/q06 |
| MP-05 | duas pontas: q01/q02 | título/prazo/emissão: q03/q08 | compulsório: q04/q05 | assistência/liquidez: q06/q07 | inferência limitada: q05/q07/q08 |
| MP-06 | QE delimitado: q01 | preço/retorno: q02 | QE/compromissada: q03 | depósito/obrigação: q04/q05 | país/data: q06 |
| MP-07 | autorização/execução: q01 | estoque/fluxo: q02–q04 | recorte primário: q04 | emissão/revenda: q05/q07 | remuneração/data: q06/q07 |
| MP-08 | entre bancos: q01 | relação de cliente: q02 | função/datas: q03/q04 | taxa/contrato: q05 | liquidez/carteira: q06 |
| MP-09 | eixos: q01 | forma/diferença: q02/q03 | previsão indevida: q04 | anual/acumulado: q05 | comparação: q06/q07 |
| MP-R | relações/mercados: q01/q08 | moeda/real: q02/q03 | instrumentos/efeitos: q04–q06 | dívida/negociação: q07 | curva/limites da evidência: q09/q10 |

Os objetivos de MP-01–03 permanecem nos documentos 68–70. A revisão cumulativa adiciona origem por questão, com unidade/trecho verificáveis. Seus itens são distintos dos enunciados anteriores, mas já expostos; não devem entrar como inéditos em avaliações independentes.

## Fontes, corte e revisão

- Fontes de MP-01–03 e revisões anteriores reaproveitadas. Revisão independente de MP-02/03 **aprovada em `5bedc461bc54e886e859dc8b91f0844db70aad85`**, por leitura integral dos textos, sem erro conceitual, ambiguidade relevante ou pré-requisito ausente. Não refez esquema, contas ou fontes; não é publicação, aceite humano de fase ou aprovação de código. Os textos dessas três aulas não foram alterados nesta etapa.
- BCB: páginas de Selic, transmissão e compulsórios conferidas em 30/09/2026 por navegador público sem autenticação. Textos carregados por JavaScript, não inferidos do aviso do extrator. Nenhum percentual vigente ou prazo universal foi inventado. A URL tentada de mercado aberto mostrou página interna 404 e **não** foi usada como evidência.
- LC 179/2021, Lei 4.595/1964 (redação aplicável do art. 10), Lei 14.185 de **14/07/2021**, Lei 4.320/1964 e Decreto **12.814/2026** consultados no Planalto em 30/09/2026, com localizadores em cada aula. O decreto revoga o 11.301/2022 e vigora desde a publicação em 12/01/2026; a página antiga do Tesouro não prevalece sobre a norma atual. Esta checagem não altera a versão histórica dos editais.
- Tesouro: conceitos fiscais da página atualizada em 08/07/2022; CVM: relações de mercado já verificadas; BoE: explicação atualizada em 05/12/2025, apenas para conceito e caso histórico de QE; BCE: definição/metodologia de curvas, apenas apoio conceitual. Sem importar metas, decisões ou taxas estrangeiras ao Brasil.
- MP-04–09/MP-R têm autoria e conferência factual dirigida; revisão independente/humana ainda pendente. Hipóteses e contas são explícitas. Esquema válido não atesta precisão pedagógica ou aprendizagem.

## Desafio final previsto, ainda não integrado

O chefe será prática cumulativa **separada de MP-R e de avaliação independente**. Proposta editorial dentro do padrão existente: 12 itens novos, dois em cada agrupamento abaixo. Não foram atribuídos IDs produtivos, XP, tempo de bloqueio ou critério de domínio. Esses parâmetros devem seguir os contratos existentes quando a integração for autorizada.

| Agrupamento | Ensino de origem | Evidência solicitada em caso novo |
| --- | --- | --- |
| Participantes e relações | MP-01/08 | identificar credor/devedor e separar cliente/interbancário |
| Recursos e poder de compra | MP-02/03 | separar instrumento/saldo e comparar fatores no mesmo período |
| Política e transmissão | MP-04 | separar objetivo/decisão/observação e reconhecer influência concorrente |
| Operações e contexto | MP-05/06 | seguir duas pontas; distinguir obrigação, depósito e compra de ativo |
| Fiscal e títulos | MP-07 | reconstruir estoque/fluxo e destinatário de emissão/revenda |
| Prazos e conclusão limitada | MP-09 | ler outro gráfico e evitar previsão ou conversão indevida |

Antes de redigir os itens do chefe: concluir revisão pontual do ensino novo e conferir suficiência para cada cobrança. Cada item deverá ter cenário/valores próprios, resposta única, justificativa dos distratores e vínculos às aulas liberadas. Não reutilizar os casos resolvidos nem os itens já expostos como “inéditos”. Não publicar chefe antes de suas aulas; não chamar sua conclusão de retenção ou prontidão. Formas independentes continuam exigindo decisão própria sobre exposição e quantidade de formas, sem mexer em A/B.

## Verificação proporcional e próxima ação

Validação executada em Node 24: as sete unidades novas e as três anteriores passaram no validador editorial; 65 operações aritméticas, sendo 43 novas. Passaram sintaxe, esquema, gabaritos, cobertura, fontes/localizadores, UTF-8, links/âncoras de origem e equivalência das prévias. O filtro real de publicação manteve todos os drafts excluídos. Conferência conjunta confirmou IDs/enunciados únicos e dados/eixos dos dois gráficos iguais às tabelas; Mermaid conferido estruturalmente, sem homologar renderização no GitHub ou no aplicativo. Arquivos `.mjs`/`.md` de MP-01–03 idênticos a `5bedc461`, comprovados por comparação com Git; sua revisão não foi repetida. Nenhuma suíte integral do aplicativo ou teste de produção executado.

Reprodução: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=mp04`, variando até `mp09` e `mpr`; `--render` regenera a prévia. O comando histórico sem flag continua validando MP-01. Repetir apenas verificação afetada, não todos os testes por alteração documental. O gerador compartilhado verifica agora também a aula/trecho de origem por questão cumulativa.

Próxima ação: revisão independente pontual de MP-04–09/MP-R, concentrada nos limites de transmissão, datas/normas, fluxos e gráficos. Depois preparar os itens próprios do chefe conforme a matriz acima. Publicação depende de escopo/edital adotado, revisão e autorização; o aceite humano da Fase 2 continua separado, com checklist no documento 68.
