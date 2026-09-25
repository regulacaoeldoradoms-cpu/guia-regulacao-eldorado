# Central de Documentos — Status

Última atualização: 25/09/2026.

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
| Subfase / objetivo atual | Auditoria transversal dark #480 integrada; revisão visual em produção autorizada, ainda pendente. |
| Última ação concluída | Merge `76648e3` e deploy GitHub Pages success do mesmo commit; decisão, limites e reversão registrados neste arquivo. |
| Branch atual | Funcional `fix/portal-dark-final-audit-20260924` já integrada; registro documental em `docs/dark-audit-production-handoff-20260925`. |
| PR atual | #480 merged; consultar a PR documental desta branch antes de criar duplicata e confirmar seu merge. |
| Último commit relevante | Head validado `d1c6392`; merge `76648e373c7f9e5d51ce6ad6f1c20aecfd0a41b2`; baseline anterior `5f632d7`. |
| Checks e testes | Pré-merge 54/54, auditoria 210/210. Pós-merge: Pages deploy success; Worker Build failure sem causa disponível no check. Não confundir conjuntos. |
| Decisões tomadas | Publicar versão tecnicamente validada e revisar no site; outro preview não é pré-requisito. Histórico integral preservado em arquivo separado. |
| Justificativas | Autorização explícita após identificação do link errado; mudança visual reversível; estado atual legível com histórico recuperável. |
| Alternativas descartadas | Manter bloqueio de preview após autorização; abrir gates/segredos para avaliar aparência; resetar main; perder histórico ao resumir status. |
| Ações externas concluídas | Merge #480 e deploy estático GitHub Pages. Nenhuma configuração externa, segredo, OAuth, permissão ou dado foi alterado pelo assistente nesta unidade. |
| Pendências e bloqueios | Revisão visual humana; log do Worker Build d8be41f4 por acesso autorizado; conferência HTTP do domínio quando possível; verificar integração da PR documental. |
| Riscos conhecidos | Diferenças fora do Chromium emulado; CI sintético não prova serviços reais; falha separada de build ainda não diagnosticada; âncoras antigas devem consultar o histórico. |
| Métricas / observabilidade | Métricas sintéticas acima, nenhuma coleta clínica nem alteração do PostHog. |
| Próxima ação exata | Conferir integração documental; recuperar log Worker sem contornar proteção; receber revisão do operador no Portal. Com aprovação, registrar encerramento da frente; com defeito, corrigir ou reverter especificamente #480 via PR. |
| Arquivos e fontes principais | Este status e histórico ao lado; Guia Mestre 1.1; Dossiê Mestre e deltas pertinentes; `AUDITORIA-FINAL-MODO-ESCURO-2026-09.md`; `testing/browser/DARK_AUDIT.md`; PR #480; runs 36156810522 e 36164321273; check 108169352943. |
