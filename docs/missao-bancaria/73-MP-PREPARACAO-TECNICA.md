# MP — integração e publicação verificadas

30/09/2026. [#564 integrado](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/564), sobre [#563](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/563). Código preparado: `b9e9aa482a656f8b6490323a4552ef5181dac888`; fonte editorial aprovada: `36a8f9c688a44faf13bf3de287f74e291402a182`. Fase 2 ativa, aceite humano não observado; Fase 3 não aberta. Publicação autorizada às 19:42 UTC e confirmada no merge `9b2d5a0f`, com frontend e Worker verificados. Detalhes de runtime/smoke ao final.

## Entrega publicada

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

## Correção SFN publicada com o pacote

A consulta de pré-requisitos A/B usava `banking.sfn.introducao`, mas o progresso real da introdução é salvo em `banking.sfn`. Isso impedia o desbloqueio apesar da conclusão real das nove missões. Fixtures antigas usavam IDs de missão como tópicos e ocultavam a divergência.

O serviço agora consulta uma lista separada de IDs persistidos; nenhuma migração, renomeação de registro, mudança de versão/questões/scores ou prazo B. Testes usam os `topicId` do catálogo real e recusam alias incorreto como substituto de introdução incompleta. A conquista `study.sfn.boss` também exige o Chefe SFN específico; outro Chefe não recebe essa medalha. A correção foi integrada/publicada com o pacote aprovado no merge `9b2d5a0f`.

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

## Ativação validada e publicada

A release local tem 20 missões/122 questões (SFN 9/38 intacto; MP 11/84). Os testes antigos que fixavam o total em nove missões agora distinguem o SFN preservado do catálogo ampliado. Corrigida também uma asserção de identidade de array que falhava na CI apesar de conteúdo igual; nenhuma validação de conteúdo foi removida.

- Node 24.17.0: `npm run check` e **671 testes Worker aprovados**, zero falhas/skip.
- **Sete Chromium MP aprovados** sobre o catálogo ativo: apresentação, consulta repetida, resposta pendente, interrupção/rede e exclusividade. Demais 40 testes/apresentação anteriores são reutilizados por escopo; CI obrigatória executará seu gate.
- Artefato gerado conferido. Nenhum acesso a D1/produção nesta validação. Nenhuma revisão editorial nova de texto inalterado.

Integração #563 → #564 concluída em `9b2d5a0fe4f8a2478e3900fcf56c6965ede3c53a`, árvore idêntica ao head validado `6b04065f90d277dbd9a248d99c0ad8bfea53aa08`. Publicação executada pelo [deploy seguro](../WORKER-SAFE-DEPLOY.md), sem renomear Worker ou alterar bindings.

Aceite humano da Fase 2 continua separado e não observado. Registrar somente resultados reais do [checklist humano](68-MP01-RASCUNHO-E-REVISAO.md#checklist-humano-mínimo-da-fase-2). Preview legado permanece problema independente; exceção raster anterior não é ampliada para esta entrega.

## Correção restrita do gate global

#563 integrado em `ee2fe509cf362fd0771ee26e26dbd9ed5d435f8d`; #564 retargetado para main. Ativação `1fe5273e6bb7356dcf0b67de18034b67875e5ef5` teve Worker/Chromium dos estudos aprovados; validações são reutilizadas no escopo inalterado.

O [log global anterior](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36763703230/job/110052418291) tentava clicar no sétimo radio, oculto após o último desfecho. Correção do teste: seis desfechos explícitos; confirmar opções ocultas, selecionar Falta e testar ambas, inclusive foco/seleção por teclado. Sem skip, alteração de timeout ou remoção de asserção.

O percurso completo revelou fundo computado branco dos dois radios mobile, oriundo da regra preexistente `.tm-inline-form input` com `!important`. Foi autorizado como correção rotineira isolada: `@media screen`, tema escuro, somente `.tm-inline-consult-form .tm-absence-request-option input[type="radio"]`, propriedade `background-color`. Nenhuma lógica, visibilidade, fluxo ou acesso clínico alterado. Referência CSS recebeu cache-bust.

Verificação direcionada: **dois Chromium passaram**, desktop/mobile, com seis desfechos, opções condicionais, foco/seleção nativos e restante do fluxo sintético. Comparação de estilos original versus corrigido em claro/tela, escuro/tela e escuro/impressão confirmou somente a troca do fundo escuro de branco para `rgb(12, 30, 44)`; aparência, accent-color, cor, dimensões, visibilidade, pointer-events, tabIndex e disabled permaneceram iguais. Sintaxe/diff conferidos. Sem D1/produção.

[CI visual final aprovada](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36773698610) no head `6b04065f`. Não houve exceção raster nesta entrega; preview legado permanece separado do deploy principal protegido.

### Sincronização da preferência no teste de contraste

A CI em `d9edb297` passou 213/216 casos; três falharam no contraste durante troca de tema. A fixture mantinha a conta fictícia em escuro enquanto o teste aplicava claro só na página; `hydrateAccountPreferences()` reaplica a preferência da conta após 280 ms. Correção somente em `portal-dark-medical-contrast.spec.mjs`: atualizar a conta sintética via API interceptada, aplicar a preferência pelas APIs existentes e exercitar explicitamente a hidratação tardia. As mesmas asserções de seis blocos, marcadores, alertas, claro e print permanecem. **Quatro casos Chromium passaram**, desktop/mobile e conteúdo preenchido/vazio, sem espera fixa, skip ou novo CSS do Guia Médico. CI final concluída com sucesso no commit `6b04065f`.
## Verificação da publicação — 30/09/2026

Build produtivo `c23aaa9d-260f-425c-bf64-a4fc0b3e7e50` aprovado no merge `9b2d5a0f`; versão Worker `2a0d0e7d-fdb8-459f-a3d1-8d3dadf014df` confirmada a 100%, tag `portal-safe-deploy` e mensagem de candidata validada pelo gate. O deployment foi criado às 21:00:42 UTC.

Smoke às 21:03 UTC: os hashes de `estudos/index.html`, `js/studies.js`, `js/studies-reader.js`, `css/studies-reader.css` e `css/telemedicina-absence-v24.css` coincidiram com o merge. Estudos respondeu 401; Agenda 403; admin GET 401 e OPTIONS 204, com CORS correto. Não houve autenticação como aluno nem leitura de tabelas. Preservação do progresso é evidência dos testes offline/CI, não de consulta produtiva.

Actions da main concluídos com sucesso. Pages `1f08a25f-cd70-42bd-aa37-6b801ea81543` da Central staging foi concluído segundo Wrangler; o HTML servido confere por hash com `testing/central-docs/viewer-harness.html` do merge. Esse bundle sintético não é o portal produtivo; a comparação deste foi independente. O check externo no GitHub continuava `in_progress` às 21:12 UTC, apesar da publicação confirmada; não foi alterado ou dispensado. Evidências locais: `mp-publication-smoke.json`, `mp-production-after.json`, `mp-worker-after-version.json` e `mp-pages-publication.json`, no diretório pai do checkout. Checkpoint atualizado em `PROJECT_STATE.md`; aceite humano Fase 2 continua não observado.
