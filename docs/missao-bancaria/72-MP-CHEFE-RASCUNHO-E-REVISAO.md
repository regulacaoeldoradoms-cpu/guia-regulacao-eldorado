# MP-CHEFE — doze itens próprios para revisão

30/09/2026. Autoria paralela autorizada durante a revisão independente do ensino. Fase 2 ativa, aceite humano não observado. O Chefe é rascunho fora do catálogo, separado da MP-R e das avaliações independentes. [Fonte editorial](rascunhos/mp-chefe-v1.mjs) e [prévia com prática comentada](rascunhos/mp-chefe-v1.md), gerada pelo validador existente com `--unit=mpchefe --render`.

## Entrega e vínculo de ensino

Doze casos próprios, quatro alternativas e justificativa de cada opção: **48 justificativas**. Apoio anterior à prática: cinco trechos com orientação, roteiro de leitura, um exemplo de método, glossário e recuperação. Os casos não requerem novo conteúdo normativo ou taxa atual. Reutilizam ensino e fontes datadas de MP-01–09; não houve nova auditoria dessas fontes.

| Agrupamento da matriz 71 | Itens | Objetivo local | Recuperação principal |
| --- | --- | --- | --- |
| G1 — participantes e relações | q01/q02 | O1: identificar devedor e papel da distribuição | MP-08 interbancário/varejo; MP-01 crédito/capitais |
| G2 — recursos e poder de compra | q03/q04 | O2: separar origem/data e comparar fatores reais | MP-02 instrumento/datas/limites; MP-03 real/exemplo/limites |
| G3 — política e transmissão | q05/q06 | O3: distinguir categorias e causalidade | MP-04 objetivos/Selic; transmissão/exemplo/tempo |
| G4 — operações e contexto | q07/q08 | O3: seguir fluxos e distinguir instrumentos | MP-05 compromissada/absorção; MP-06 QE/comparação/depósitos |
| G5 — fiscal e títulos | q09/q10 | O4: calcular estoque e interpretar revenda | MP-07 fluxo/estoque; emissão/negociação/remuneração/preço |
| G6 — prazos e conclusão limitada | q11/q12 | O5: interpretar curva e composição | MP-09 eixos/formas/limites; acumulado/exemplo |

O6: recuperar erro explicando o distrator, retomando a aula de origem e alterando um dado para refazer o raciocínio. Não implementa diagnóstico automático por conceito nem reagendamento. A cobertura inclui trechos de apoio do próprio Chefe e referências reais às aulas, seguindo o padrão de `kind: boss` existente. Todos os IDs continuam `draft.*`/editoriais.

## Critérios de resposta e limites

- Os dois contratos de q01 são explicitamente independentes; q02 exclui garantias ou obrigações adicionais do distribuidor.
- q03 exige simultaneamente recursos próprios e disponibilidade atual; crédito não contratado e entrada futura são distratores, não dados faltantes.
- q04 fixa período e ausência de custos/movimentações; taxa real arredondada somente ao final. q05 distingue objetivo, decisão e taxa observada; q06 não inventa participação causal de cada fator.
- q07 nomeia o BCB e ambas as pontas, evitando mudança oculta de perspectiva. q08 informa voluntariedade, reversão combinada e contexto estrangeiro; não equipara depósitos remunerados a QE.
- q09 exclui juros/indexação/ajustes para comparar dois planos. q10 informa emissão, revenda efetiva, ausência de cupons/custos e destinatário do pagamento; não promete preço futuro.
- q11 usa uma curva fictícia não monotônica, com tabela equivalente, unidades e comparabilidade explícitas. q12 informa três períodos completos, taxa efetiva fixa e reinvestimento; não pede conversão de periodicidade não ensinada.

As respostas foram conferidas pelo autor para hipótese suficiente, uma alternativa correta e justificativas consistentes. Isso não equivale à revisão independente do Chefe, ainda pendente. Os itens são próprios em relação aos enunciados anteriores, mas ficam expostos nesta documentação; não podem ser apresentados como itens reservados/inéditos numa nova forma independente. Não ampliam A/B nem comprovam retenção ou prontidão.

## Verificação direcionada executada

Node 24: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=mpchefe` passou para os 12 itens/48 justificativas, dois itens por cada um dos seis agrupamentos, ensino de origem existente e presente na cobertura, 18 operações aritméticas, prévia/UTF-8/links e filtro real excluindo o draft. Sintaxe passou. Conferência adicional verificou os três arredondamentos de q04/q12, os dados/eixos do gráfico de q11 contra sua tabela e ausência de enunciados/IDs repetidos com as 72 questões anteriores. Essa comparação usou apenas os identificadores/enunciados anteriores; não refez sua revisão ou seu esquema. Mermaid segue sem homologação de renderização.

MP-04 passou na regeneração/validação afetada. Comparação do objeto editorial com `82316776` confirmou que só o título autorizado mudou; cenário, questões e gabaritos são idênticos. As demais aulas não foram alteradas nem revalidadas. Nenhuma suíte integral do aplicativo, consulta D1 ou chamada de produção nesta etapa.

## Preparação para decisão agrupada

Revisão independente de MP-04–09/MP-R aprovada no recorte introdutório em `82316776706084e8a768534aa80206582a272523`. Única precisão encaminhada: título do exemplo de MP-04, seção 6, alterado para “custo do financiamento e investimento”, preservando cenário e q03/gabarito. Revisão não incluiu Chefe, Mermaid, integração nem repetiu cálculo/esquema/auditoria normativa. MP-01–03 mantêm a revisão anterior.

O pacote revisável reúne nove aulas, revisão cumulativa e este Chefe: **84 questões expostas**, não uma nova avaliação independente. O estado de publicação continua sendo somente o bloco SFN já disponível. Antes de liberar outro conteúdo, a decisão deve indicar escopo/edital adotado e corte de fontes; confirmar o recorte introdutório e suas lacunas; aprovar o Chefe; e autorizar integração/publicação. Integração ainda deverá usar contratos existentes de IDs/progressão e testes de preservação pertinentes. Nenhum desses passos foi presumido pela autoria documental.

Sem bloqueio técnico de autoria. Próxima ação: revisão pontual dos 12 novos itens e decisão agrupada sobre o pacote após essa revisão, preservando o aceite humano da Fase 2 como evidência separada. Sem acesso adicional a D1/produção.
