# Central de Documentos — Status

Última atualização: 25/09/2026.

## Ajuste pós-homologação — texto dos blocos do Guia Médico — EM VALIDAÇÃO — 25/09/2026

Pedido aprovado: tornar branco o texto abaixo dos títulos em **Critérios para encaminhar**, **Informações clínicas obrigatórias**, **Exames obrigatórios para solicitar**, **Exames obrigatórios conforme o caso**, **Exames e documentos recomendados quando disponíveis** e **Elementos que auxiliam a priorização**, somente no modo escuro de `/medico/`.

Estado recuperado: `main` em `54c1e74dd5724879b492924cbbe93f90d75234cc`, com #480 e #483 integradas. A PR aberta #481 é uma frente distinta de Telemedicina e não foi alterada. A Fase 7 permanece ativa; este é um reparo visual concreto encontrado na revisão em produção, não uma reabertura da 7G.6.

Diagnóstico confirmado no código:
- os seis blocos são gerados por `blockHtml()` / `renderProtocol()` em `js/medical-app.js`, com classe real `.content-block`;
- `css/site.css` define `.content-block ul { color: var(--slate-700); }`, mantendo a lista escura mesmo quando o contêiner recebe o fundo dark;
- `p.empty` recebe a cor secundária global; também precisa do branco solicitado;
- o seletor real de tema é `html[data-portal-theme="dark"]`, não o `data-theme` ilustrativo sugerido na resposta anterior;
- a auditoria anterior bloqueava superfícies claras, mas relatava baixo contraste textual apenas para revisão manual. Por isso seu sucesso não substituía esta homologação humana.

Implementação na branch `fix/medical-dark-content-contrast-20260925`:
- sobrescrita pequena em `css/medical.css`, condicionada a `@media screen`, tema dark, `body[data-role-view="medico"]`, `#detailPanel` e `.content-block:not(.alert)`;
- listas, itens, marcadores e parágrafos desses blocos recebem `#fff`, inclusive **Não informado ou não aplicável.**;
- títulos, fundos, bordas, alerta clínico e demais módulos não são recoloridos;
- modo claro e impressão permanecem fora da regra;
- `/medico/` passa a carregar `medical.css?v=20260925-1` para invalidar a folha antiga sem rebustar o tema global;
- regressão `testing/browser/portal-dark-medical-contrast.spec.mjs` usa a rota e o renderer reais com conteúdo sintético e APIs interceptadas, cobrindo os seis blocos preenchidos/vazios, marcadores, títulos/alerta e preservação claro/print em desktop e mobile;
- nenhum workflow, gate, permissão, dado, protocolo clínico, IA, Drive ou telemetria foi alterado.

Validação já executada antes deste commit: sintaxe Node do novo spec aprovada; prova focal de cascata em Chromium local com **8/8 cenários** (1440/412 px; dark, light, print e outro perfil) aprovada. Essa prova usa um fixture reduzido com as regras CSS relevantes e **não é apresentada como teste integral da rota ou backend**. A regressão integral da rota e os checks da PR ainda precisam concluir no CI existente; a auditoria completa não foi desativada nem marcada como aprovada por antecipação.

Alternativas descartadas: tornar todo o Portal branco com seletor global; mudar variáveis claras compartilhadas; alterar conteúdo clínico; reverter toda a #480 por uma lacuna pontual de contraste. A correção usa o CSS próprio do componente, preservando o mecanismo global de tema e evitando alterações desnecessárias em outras rotas.

**Próxima ação exata:** abrir/conferir a PR desta branch, avaliar checks e a regressão Chromium, corrigir eventual falha e integrar somente após validação pertinente. Confirmar o deploy estático antes de pedir nova revisão em `/medico/`. Até essa evidência, não declarar o ajuste publicado. Reversão desta unidade, se necessária, deve desfazer somente sua PR, preservando #480 e demais mudanças. A homologação global dark e a pendência separada de Worker abaixo não são encerradas por este reparo.

## Estado atual e histórico preservado

**Fase 7 — Robustez e otimização contínua.** A Fase 0 e as Fases 1–6 não são reiniciadas. A 7G.6 permanece homologada e encerrada. A auditoria transversal de modo escuro da **PR #480 foi integrada à main**, com publicação estática confirmada pelo GitHub Pages e **homologação visual humana pendente em produção**, por decisão explícita do operador.

O histórico integral anterior foi preservado, sem editar seu conteúdo, em [CENTRAL-DOCUMENTOS-STATUS-HISTORICO-ATE-2026-09-25-PR480.md](CENTRAL-DOCUMENTOS-STATUS-HISTORICO-ATE-2026-09-25-PR480.md). Blob preservado: `28712da4976e07f4a536bcb7bec9d05f93f12f59`, correspondente ao status no merge `76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2` antes desta atualização. Esse histórico continua sendo fonte de decisões, justificativas, deltas e pendências das demais frentes; elas não são encerradas por omissão neste registro. Âncoras históricas devem ser procuradas no arquivo preservado.

A separação entre estado ativo e histórico evita leituras truncadas do documento acumulado e o uso de tarefas históricas como instruções atuais. Não houve exclusão do histórico nem alteração do Guia Mestre, Dossiê Mestre ou documentos de decisão específicos.

## Publicação da PR #480 — 25/09/2026

### Decisão humana

Após esclarecer que o staging informado era somente o laboratório PDF.js, o operador autorizou publicar a alteração e revisar diretamente no site, com possibilidade de reversão: “se o modo escuro já está pronto então pode implementar, aí eu reviso ele diretamente no site, qualquer coisa é só reverter”.

Essa decisão substitui, exclusivamente para esta entrega visual já validada tecnicamente, a exigência anterior de homologação humana no preview antes do merge. **Autorização de publicação não significa homologação visual concluída.** A revisão ocorrerá em produção. Não houve autorização para reduzir testes, modificar permissões, expor dados ou mudar integrações.

Preparar outro preview completo deixou de ser pré-requisito desta entrega. A alternativa de continuar bloqueando o merge pela indisponibilidade do preview foi descartada após a escolha explícita do operador. Uma publicação experimental sem aceite técnico não foi autorizada.

### Integração efetiva e escopo

- PR [#480](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/480): **merged**, às 16:59:58 UTC de 25/09/2026.
- Branch funcional: `fix/portal-dark-final-audit-20260924`.
- Head validado: `d1c63922473cb17053f8625b843d69a251a99647`.
- Main anterior: `5f632d71229582f87b1a7288757f178b1f34f02d`.
- Merge real: **`76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2`**. O merge usou verificação do SHA esperado.
- `478028ed2c9c3660709fac40fc55890e8ec43584` era somente o merge sintético do CI, não o merge real.

A entrega cobre 24 rotas de interface e 3 aliases. O escopo é CSS, referências versionadas de assets, testes e documentação. A PR não altera JavaScript funcional de produto, Worker runtime, autenticação, permissões, banco, Drive, IA ou regras clínicas.

Permanecem os controles transparentes/line-art branca do Titon 7G.6; Salvar PDF/Imprimir azuis; estados semânticos do Drive; dourado intencional de Altas; mostrar/ocultar senha da #482; modo claro e impressão. Papel do PDF, canvas, miniaturas e conteúdo documental conservam suas cores: o tema não inverte o documento.

### Aceite técnico pré-merge

- **54/54 checks success** no head `d1c6392`: 52 workflows GitHub Actions, Cloudflare Pages e Workers Builds.
- Auditoria: [run 36156810522](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36156810522), job `108143633296`, concluído às 16:15:37 UTC de 25/09/2026.
- **210/210 testes**, zero skips, flaky ou falhas; **404 estados**, 296 dark; 103.370 elementos visíveis e 1.705 pseudo-elementos.
- Zero superfícies claras inesperadas e zero endpoints sintéticos desconhecidos.
- 120 comparações contra main com proveniência de raiz; 111 PNG-exatas/dentro da tolerância de raster registrada.
- Diferenças estruturais/computed/layout e erros JavaScript novos continuam bloqueantes. Exceções limitadas de rasterização Linux estão documentadas; não houve ampliação de allowlist funcional para esconder defeitos.
- Evidência anterior preservada: head `6f027235b134cf798e3d3be80ce94c21011f2727`, run `36153569515`.

Os testes usam Chromium desktop 1440×1000 e Pixel 7 emulado, fixtures sintéticas e rede interceptada. Não comprovam backend real, aparelho físico, Firefox/WebKit ou aprovação humana.

### Publicação e pendências pós-merge

O [run 36164321273 do GitHub Pages](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/36164321273) publicou o merge `76648e3`: job `deploy` `108168444240` **success**, concluído às 17:00:47 UTC; deployment `6665919188`, ambiente `github-pages`. O `CNAME` versionado aponta para `regulacaoeldoradoms.com.br`.

Cloudflare Pages também concluiu o deploy `3932ff3b-fc48-4a63-a67a-7a6a8310d6d1`, mas esse projeto é o laboratório da Central, não a comprovação de publicação do Portal completo.

**Pendência técnica:** o build automático separado do Worker `yellow-wave-d0a1guia-regulacao-ia`, ID `d8be41f4-d1fe-4b85-8677-df76bf7f2bcc`, reportou `failure` às 17:03:03 UTC, check `108169352943`. O check apresenta o link do console, não a causa. A integração GitHub disponível não retornou o log Cloudflare; a busca de conector Cloudflare não encontrou ferramenta utilizável nesta sessão. Não atribuir a falha ao CSS nem declarar o pós-merge 100% verde sem investigar. A ausência de alterações no backend nesta PR não comprova, sozinha, sua saúde operacional. Não contornar o gate de deploy seguro nem recriar segredos para forçar publicação.

A leitura HTTP independente do domínio nesta conversa não foi concluída: a ferramenta web não acessou a URL e a resolução de nome falhou no container. Isso limita a verificação às evidências de deploy; **não demonstra indisponibilidade global do site**. Não houve navegação autenticada, leitura de dados reais ou homologação visual pelo assistente.

## Correção da orientação sobre staging

`https://d9ef40fe.portal-regulacao-central-staging.pages.dev/` abre o laboratório sintético PDF.js. `scripts/build-central-docs-staging.mjs` copia `testing/central-docs/viewer-harness.html` como entrada; a página tem estilos claros próprios e não é o preview das 24 rotas. A indicação anterior desse endereço como Portal completo estava incorreta. A auditoria foi executada no servidor local do CI, que não é publicado automaticamente pelo bundle da Central.

Não pedir limpeza de cache, login de produção no laboratório, reabertura de gates 4D/5E, credenciais novas ou mudança de endpoints para resolver essa diferença. A revisão visual foi transferida para produção por escolha explícita do operador.

## Plano de reversão

Baseline anterior: `5f632d71229582f87b1a7288757f178b1f34f02d`. Mudança a reverter, se necessário: merge `76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2` da #480.

Se houver regressão atribuível à entrega, criar branch da main atual e preparar a reversão específica do merge (`git revert -m 1 76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2`), revisar conflitos e documentação, executar checks pertinentes e publicar via PR. O comando é referência de recuperação e **não foi executado**. Não usar reset/force-push da main: alterações posteriores devem ser preservadas. Reversão de código não desfaz operações legítimas dos usuários no banco ou Drive.

## Demais frentes — continuidade sem reinício

As pendências, métricas e fontes completas permanecem no histórico preservado e nos documentos de cada frente. Esta publicação não altera seu estado por inferência. Em particular: Fase 6 encerrada; Fase 7 ativa; 7G.6 homologada e encerrada; defeito de renomear após sincronizar e OCR retangular têm aprovações humanas registradas. Não repetir testes encerrados sem novo relato.

As decisões recentes de IA canônica, execução antecipatória, busca e pré-carregamento prevalecem sobre registros antigos de laboratório. A 7H.1 de especialidade pela Solicitação foi rejeitada e revertida na #469; não reintroduzir essa inferência em trabalho visual. 7A/observabilidade/SLOs e homologações específicas de #482 e Telemedicina V42 não foram encerradas nesta unidade; consultar suas seções antes de retomá-las.

## Handoff para o próximo chat

| Campo | Estado persistente |
|---|---|
| Fase atual | Fase 7 — Robustez e otimização contínua; Fase 0 e Fases 1–6 não reiniciadas; 7G.6 encerrada. |
| Subfase / objetivo atual | Reparo de contraste dos seis blocos clínicos de `/medico/`, encontrado na revisão produtiva da #480. |
| Última ação concluída | Diagnóstico da cascata real, override CSS restrito, cache-buster e spec Chromium preparados; prova focal local 8/8 e sintaxe Node aprovadas. |
| Branch atual | `fix/medical-dark-content-contrast-20260925`, baseada em `54c1e74dd5724879b492924cbbe93f90d75234cc`. |
| PR atual | Abrir/conferir a PR desta branch; #480 e #483 já merged. #481 é separada e não foi tocada. |
| Último commit relevante | Base `54c1e74d`; integração funcional anterior #480 `76648e3`; localizar o head da branch para os checks deste reparo. |
| Checks e testes | Prova focal reduzida local 8/8 e sintaxe do spec aprovadas. CI da rota completa e auditoria existente pendentes, não substituídos pela prova local. |
| Decisões tomadas | Texto, listas, marcadores e mensagem vazia brancos somente nos blocos clínicos do Guia Médico em dark/screen; preservar títulos, alertas, claro e print. |
| Justificativas | `.content-block ul` mantinha cor slate-700 explícita; o fundo dark do pai não substitui essa cor. Pseudo-exemplo anterior não usava os seletores reais. |
| Alternativas descartadas | Seletor branco global; alterar variáveis claras; recolorir por JavaScript; mudar protocolos; reverter toda a #480. |
| Ações externas concluídas | #480 e #483 integradas anteriormente; nenhuma credencial, dado, configuração externa ou permissão mudou neste reparo. |
| Pendências e bloqueios | CI/merge/deploy do reparo, homologação humana posterior; log do Worker Build histórico d8be41f4 segue pendência separada. |
| Riscos conhecidos | Evitar branco na impressão ou em alertas; CI sintético não comprova backend nem navegador físico. Não afirmar publicação sem deploy. |
| Métricas / observabilidade | Nenhuma telemetria nova; dados dos testes exclusivamente sintéticos. |
| Próxima ação exata | Conferir PR/checks da branch, corrigir falhas reais se houver, integrar após validação, confirmar Pages do Portal e solicitar conferência dos textos em `/medico/`. |
| Arquivos e fontes principais | `css/medical.css`; `medico/index.html`; `js/medical-app.js`; `css/site.css`; `testing/browser/portal-dark-medical-contrast.spec.mjs`; este status; Guia Mestre 1.1; `PORTAL-APARENCIA-V1.md`; histórico preservado. |
