# MP — integração e ativação autorizada

30/09/2026. [#564 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/564), sobre [#563](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/563). Código preparado: `b9e9aa482a656f8b6490323a4552ef5181dac888`; fonte editorial aprovada: `36a8f9c688a44faf13bf3de287f74e291402a182`. Fase 2 ativa, aceite humano não observado; Fase 3 não aberta. Publicação autorizada às 19:42 UTC; ativação local validada, integração/deploy ainda pendentes.

## Entrega preparada

Nove aulas, revisão cumulativa e Chefe: **124 trechos, 40 exemplos, 84 questões/336 justificativas**. Ensino introdutório de mercados, moeda/pagamentos, inflação/juros reais, política/instrumentos monetários, QE em contexto estrangeiro e depósitos brasileiros, dívida pública, relações interbancárias e curva de juros. Referências BB/CAIXA continuam históricas; não é cobertura integral do bloco, edital ou prontidão.

[Conversor offline](../../worker/scripts/studies-mp-candidate.mjs) e [conversão de apresentação](../../worker/scripts/studies-mp-presentation.mjs) produzem [dados do Worker](../../worker/studies-content/banking-markets-policy-v1.js), com **11 missões publicadas na release autorizada** `markets-policy-intro-r1`. O manifesto/plano/mapa consultam o registro existente de publicação. O catálogo preparado tem 20 missões e dois blocos disponíveis. Testes preservam integralmente o SFN e demonstram que drafts continuam excluídos. O grande arquivo de dados é gerado, não uma segunda fonte de autoria.

- IDs candidatos `banking.mp.*`, questões `q.` + ID editorial; fontes isoladas por unidade, conservando URL/versão/localização/data. Não renomeiam IDs SFN.
- Recuperação aponta a trechos reais anteriores, incluindo origens da MP-R e Chefe. As justificativas só entram no feedback após responder; bootstrap não revela gabaritos.
- Cinco figuras e três tabelas derivam dos formatos aprovados: dois fluxos de ida/retorno e três curvas. Dados dos gráficos são comparados às tabelas durante a conversão.
- O leitor existente cria DOM/SVG seguro, com texto, tabelas acessíveis, temas claro/escuro e figuras inteiras no celular. Sem biblioteca externa, execução de HTML ou download de Mermaid.
- Links de origem abrem consulta dentro da sessão atual. Voltar preserva a parte/questão, seleção, resposta e foco; não abre rodada, concede XP ou conclui leitura. Resposta que termina durante consulta atualiza o DOM original.
- Tempos de 20–30 minutos são estimativas didáticas: palavras/150 + dois minutos por questão, arredondados para cinco minutos. Não impõem duração nem controlam o cronômetro.

Ensino, formatos editoriais, exemplos, enunciados, alternativas, respostas e justificativas aprovados permanecem intactos; somente os dois avisos de status identificados abaixo foram retirados da cópia gerada. Nenhum arquivo em `rascunhos/` foi modificado nesta preparação. A revisão independente do Chefe aprovou seus 12 itens/48 justificativas em 36a8f9c; não foi repetida nem confundida com validação da apresentação.

Comandos de reprodução, sem produção:

```text
node worker/scripts/studies-mp-candidate.mjs --check-generated
node worker/scripts/studies-mp-candidate.mjs --write
```

O segundo regenera a release aprovada; a publicação em produção exige os gates e o deploy protegido separados. Não há ativação por URL ou variável remota.

## Correção SFN incluída no pacote — ainda não publicada

A consulta de pré-requisitos A/B usava `banking.sfn.introducao`, mas o progresso real da introdução é salvo em `banking.sfn`. Isso impedia o desbloqueio apesar da conclusão real das nove missões. Fixtures antigas usavam IDs de missão como tópicos e ocultavam a divergência.

O serviço agora consulta uma lista separada de IDs persistidos; nenhuma migração, renomeação de registro, mudança de versão/questões/scores ou prazo B. Testes usam os `topicId` do catálogo real e recusam alias incorreto como substituto de introdução incompleta. A conquista `study.sfn.boss` também exige o Chefe SFN específico; outro Chefe não recebe essa medalha. A correção será integrada/publicada junto do pacote aprovado, não isoladamente.

## Verificação válida

- **25 testes Node direcionados** passaram: candidato, apresentação, publicação, currículo e leitor. O wrapper de candidato agora executa seis cenários com catálogo/roteador reais, SQLite local e autenticação sintética. Simulação publicada valida manifesto/plano com 20 missões e mapa com dois blocos disponíveis, apenas SFN concluído e prontidão não medida.
- Preservação confirmada de todas as linhas `study_*`, avaliação A concluída e sessão SFN interrompida; autorização exclusiva/origem, ausência de gabaritos, recuperação, limiar e XP idempotente. Evidências anteriores de A/B/feedback/ensino em `f9468c89` continuam válidas no escopo inalterado.
- **40 Chromium direcionados** passaram: sete MP, mais regressões afetadas de leitor, retomada e rodadas. Cobrem 320 px claro, 390 px escuro e desktop para o pacote, dados/eixos/tabelas, fontes maiores, consulta repetida, perda de resposta, resposta pendente, saída/reabertura e retomada. Incluem leitura SFN em quatro tamanhos/dois temas, fallback, autorização, teclado e não execução de HTML.
- Capturas mobile claras/escuras inspecionadas; curvas e rótulos completos, sem recorte lateral. Artefato gerado conferido; sintaxe e diff aprovados.

Chromium usa API simulada; SQLite não é D1. Não houve acesso a produção/D1, teste humano ou homologação produtiva. Não repetir revisão editorial ou suíte integral por mudanças só documentais. Antes de integrar, gates de CI na base/SHA efetivos continuam obrigatórios.

## Decisão agrupada aprovada

Ativar o **pacote introdutório completo** de #563/#564, incluindo a correção SFN, com as referências históricas BB/CAIXA explicitamente preservadas e fontes verificadas em 30/09/2026. Não adotar silenciosamente edital atual nem abrir formalmente Fase 3.

| Ordem | Unidade | ID (prefixo `banking.mp.`) |
| --- | --- | --- |
| 10–12 | MP-01, MP-02, MP-03 | mercados, moeda, inflacao |
| 13–15 | MP-04, MP-05, MP-06 | politica-monetaria, instrumentos, qe-depositos |
| 16–18 | MP-07, MP-08, MP-09 | divida-publica, interbancario, curva-juros |
| 19–20 | MP-R, MP-CHEFE | revisao, boss |

Aprovado em 30/09/2026 às 19:42 UTC: MP-01 após concluir o Chefe SFN; demais unidades em sequência, pela conclusão da missão anterior, conforme gate existente. 100 XP por aula/revisão; Chefe com 220 XP e 75% (9/12). Sem medalha MP nova. Aulas/revisões mantêm a regra atual de conclusão, sem transformar conclusão em domínio. Questões continuam expostas, fora de A/B; não implementar política adaptativa nesta entrega. Parâmetros aprovados e aplicados no candidato.

Na ativação local autorizada, foram retirados **somente dois avisos editoriais desatualizados**, preservando ensino e arquivos originais:

1. MP-R/acesso: “Hoje o conjunto inteiro continua em rascunho, fora do aplicativo.”
2. MP-CHEFE/preparacao: “Hoje todos esses materiais são rascunhos fora do aplicativo.”

A confirmação cobriu pacote e parâmetros: usuário respondeu "sim, precisa ficar perguntando isso nao" (Sentinel_92b94c7904dc819192757a92ff6ef501). Não pedir aprovação por aula/arquivo ou etapa rotineira já autorizada. Aceite humano pedagógico da Fase 2 permanece evidência separada; a autorização de publicação não o substitui.

## Ativação validada e gates restantes

A release local tem 20 missões/122 questões (SFN 9/38 intacto; MP 11/84). Os testes antigos que fixavam o total em nove missões agora distinguem o SFN preservado do catálogo ampliado. Corrigida também uma asserção de identidade de array que falhava na CI apesar de conteúdo igual; nenhuma validação de conteúdo foi removida.

- Node 24.17.0: `npm run check` e **671 testes Worker aprovados**, zero falhas/skip.
- **Sete Chromium MP aprovados** sobre o catálogo ativo: apresentação, consulta repetida, resposta pendente, interrupção/rede e exclusividade. Demais 40 testes/apresentação anteriores são reutilizados por escopo; CI obrigatória executará seu gate.
- Artefato gerado conferido. Nenhum acesso a D1/produção nesta validação. Nenhuma revisão editorial nova de texto inalterado.

Próxima ação: registrar/push da ativação, CI terminal no SHA final, integração #563 → #564 e publicação protegida por [WORKER-SAFE-DEPLOY.md](../WORKER-SAFE-DEPLOY.md). Não renomear Worker, alterar bindings ou usar deploy direto. Confirmar frontend/Worker exatos e smoke mínimo; não declarar sucesso antes disso.

Aceite humano da Fase 2 continua separado e não observado. Registrar somente resultados reais do [checklist humano](68-MP01-RASCUNHO-E-REVISAO.md#checklist-humano-mínimo-da-fase-2). Preview legado permanece problema independente; exceção raster anterior não é ampliada para esta entrega.

## Bloqueio pontual do gate global

#563 integrado em `ee2fe509cf362fd0771ee26e26dbd9ed5d435f8d`; #564 retargetado para main, ativação remota `1fe5273e6bb7356dcf0b67de18034b67875e5ef5`. Nesta ativação, 25 checks aprovados, auditoria global ainda em execução e preview legado separado. Worker/Chromium dos estudos passaram.

O [log global anterior](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36763703230/job/110052418291) falha ao clicar no sétimo radio: o teste selecionava todos os radios do formulário, incluindo opções de Falta ocultas após o último desfecho. Correção somente no teste: seis desfechos explícitos, estado oculto esperado, selecionar Falta e testar as duas opções visíveis. Sem skip, alteração de timeout ou remoção de asserção.

Verificação local direcionada: desktop passou; mobile completou o fluxo, mas `recorder.finish()` rejeitou os dois radios de `.tm-absence-request-option`. O relatório registra `background-color: rgb(255, 255, 255)` vindo de `.tm-inline-form input` em `css/telemedicina-mobile-v9.css`, `!important`; a regra escura de `portal-interactions.css` não tem prioridade. A captura foi inspecionada: são controles nativos, portanto a cor computada não prova uma superfície branca equivalente na pintura final. Não afirmar regressão do produto.

`git diff e06ee0fa HEAD -- css js telemedicina` só lista `css/studies-reader.css`, `js/studies-reader.js` e `js/studies.js`: os recursos de Telemedicina não foram alterados. Proposta mínima ao responsável: autorizar ajuste de fundo escuro restrito aos radios de `.tm-inline-consult-form .tm-absence-request-option`, mantendo estados nativos e temas claro/print. Isso está fora do escopo clínico autorizado; nenhum CSS funcional foi alterado e nenhuma exceção foi aplicada. A correção do teste está local enquanto essa decisão permanece pendente, evitando CI completa repetida com falha conhecida.
