# Central de Documentos — evidências da homologação real 4D

Data: 17/09/2026. PR #201, branch `codex/central-docs-drive-sync-phase4`.

**Estado: homologação real concluída; Fase 4 aceita para merge/publicação.** Usado somente um PDF descartável de três páginas com marcadores sintéticos. Nenhum identificador bruto do Drive, token ou conteúdo pessoal integra este registro.

## Ambiente e limites

- Pages da branch: `https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev/homologacao/documentos/`.
- Worker preview separado por entrypoint, host/origem, usuário, arquivo, sessões e controle D1 revogável. Mesmo PDF preparado para toda a matriz.
- Produção mantida no deployment `f2916211-e56e-4913-b3b2-e09294d99018`, versão `239cca88-9b19-400c-9cd1-82612f942ed0`, gate de escrita desligado.
- Preview inicial `c8dab951` com gate `false`; versão `64dedfd6` com gate `true` somente após login humano e conferência visual do arquivo permitido.
- A primeira recarga após trocar o alias ainda apresentou o botão com `hidden=true` e sincronização indisponível. Nova recarga trouxe `hidden=false` e `disabled=false`. Compatível com acesso antigo carregado durante propagação; a causa exata do atraso não foi comprovada. Conferir o acesso atualizado antes de editar.

## Evidências já obtidas

| Caso | Evidência | Resultado |
| --- | --- | --- |
| Login e escopo | Login habitual realizado pelo operador no Chrome; somente um PDF sintético listado; três páginas conferidas visualmente | Aprovado |
| Sem alteração | Abrir/navegar antes da edição manteve uma revisão de 3.104 bytes e o mesmo horário de modificação | Aprovado no intervalo observado |
| Primeiro autosync | Giro da primeira página passou por `pending` e `syncing`; Drive registrou nova revisão de 3.740 bytes em 13:28:40.852 UTC | Escrita real confirmada; medir estado verde de 1 s ainda pendente |
| Revisão anterior | Revisão inicial passou de `keepForever:false` para `true`; conector recuperou seu texto com os três marcadores originais | Aprovado |
| Edição durante upload | Segunda página girada enquanto a UI indicava `syncing`; após o primeiro envio a UI mostrou conflito, sem alteração externa do arquivo | Reprovado; investigar coerência da versão confirmada pelo resumable |
| Fechar com pendência | Após falha, clique em **Fechar visualização** fechou o editor; listener do cabeçalho chamava `closePdf` diretamente, sem `exitEditor` | Reprovado; corrigir ligação da ação de fechamento |
| Controle revogável | Controle D1 desabilitado após o conflito; nenhuma sessão da homologação permaneceu registrada | Janela interrompida para correção |
| Telemetria recebida | PostHog, projeto 602473: 2 `drive_sync_started`, 1 `drive_sync_completed` e 1 `drive_sync_failed` entre 13:28:15 e 13:28:52 UTC | Chaves observadas são técnicas; sem campos de documento/paciente |

Uma tentativa anterior, ainda com sincronização indisponível, também exibiu falha de renderização ao desfazer. Não confundir esse episódio com confirmação de gravação no Drive. A tentativa posterior com acesso atualizado renderizou o primeiro giro e iniciou o envio; acompanhar eventual recorrência durante a nova matriz.

Na leitura do PostHog foram consultadas somente contagens, horários e **nomes das propriedades**, sem valores pessoais ou identificadores. Chaves encontradas: `$geoip_disable`, `$process_person_profile`, `distinct_id`, `operation`, `portal_observability_version`, `route`, `size_bucket`, `duration_ms` e `status_code`. Não há propriedade de nome de arquivo, ref, fileId, URL resumable, token, PDF, CPF, CNS, paciente, CID ou diagnóstico nesses quatro eventos. A correlação é temporal; o payload mínimo não inclui hostname para distinguir ambientes. Esta evidência não é uma auditoria de todos os eventos históricos. Consulta via skill PostHog, somente leitura; sintaxe conferida na [documentação de SQL](https://posthog.com/docs/data-warehouse/sql/useful-functions).

## Critérios ainda pendentes

### Repetição com frontend `5058844`

- Pages `7371f9f6` publicado, frontend `documents.js?v=20260917-1` confirmado no DOM; 26/26 Actions aprovados (navegador 75 passed / 3 skipped).
- Worker com correção enviado como versão `dbc7e8b0` às 13:40:26 UTC. A versão efetivamente servida pelo alias ainda precisa ser identificada por marcador técnico, evitando atribuir a uma versão uma resposta que pode ter sido servida durante propagação.
- Autosync de uma alteração confirmado no Drive às 13:42:53.954 UTC: terceira revisão, 3.741 bytes. `success` observado até retornar a `normal` após 963 ms.
- Novo envio, acompanhado de outra edição enquanto `syncing`, voltou a falhar por conflito; continuaram três revisões, portanto esse envio não gerou uma quarta revisão. Não declarar a correção do conflito aprovada.
- Clique no X com essa falha iniciou nova tentativa, recebeu falha e **manteve o editor aberto**, exibindo mensagem de proteção. Correção do fechamento com falha aprovada nessa repetição.
- Controle D1 novamente revogado durante diagnóstico. Não relaxar a verificação de conflito sem evidência causal.

Correções preparadas após essa execução:

- Confirmar o upload com releitura da versão somente se arquivo, revisão, MD5 e tamanho coincidirem com o recibo; rejeitar uma revisão externa, inclusive com bytes iguais. Não desativar o preflight estrito do próximo envio.
- Manter a mesma chave de cache restrita na listagem e na confirmação do wrapper.
- Encaminhar o X, saída e troca de documento pela proteção de pendências. Sessões que passaram a depender do Drive continuam protegidas após revogação; edição sempre local mantém saída com confirmação de descarte.
- Cache do frontend atualizado para `20260917-1`. Regressão executa os listeners reais de `documents.js`, não só o harness.
- Suíte completa após integração: **235/235 testes**, sem falhas ou skips. Revisão independente dos patches concluída. A repetição real continua necessária para confirmar a hipótese do conflito de versões.

Repetir autosync após as correções, edição durante upload, confirmação visual transitória, ausência de reenvio sem alteração, falha/retry, fechamento com sucesso e com falha, conflito provocado externamente no mesmo PDF, reabertura da versão final, privacidade dos eventos técnicos e encerramento com controle revogado e preview gate `false`.

O wrapper bloqueia `save_copy`; esse fluxo permanece validado sinteticamente, sem homologação real neste ambiente restrito. Checks automáticos e publicação do preview não substituem a matriz acima.

### Diagnóstico com versão servida comprovada

- Worker `e37fccb3`, código `2185b21`, identificado pelo cabeçalho `X-Central-Docs-Preview-Release` na resposta real do alias. Actions 26/26 e Pages `9932e234` aprovados.
- Primeiro envio nessa repetição criou a quarta revisão sintética (3.742 bytes, 13:52:55.788 UTC); UI observou `syncing → success`. Segundo envio, desta vez **sem edição concorrente**, voltou a receber conflito.
- Diagnóstico opt-in publicado em `5645185`, Worker `da1f2bc8`, com release confirmado antes da tentativa. O retry registrou somente: etapa `preflight`, HTTP 409, versão-base `16`, versão atual `18`, código `DRIVE_VERSION_CONFLICT` às 13:57:53 UTC. O PDF permaneceu com quatro revisões; nenhum envio externo ocorreu nesse intervalo.
- Isso demonstra divergência numérica após confirmação, mas não comprova qual operação interna do Google causou o incremento. Não atribuir causalidade ao `keepForever` sem evidência adicional.
- Teste executando o frontend real confirmou que a versão devolvida é usada no preflight/start seguinte. Dois defeitos visuais independentes foram reproduzidos: subtítulo da lista desatualizado e documento salvo reaparecendo como selecionável para unir. A correção preserva as fontes originais do editor e atualiza a identidade do alvo atual e o subtítulo após confirmação.
- Diagnósticos ficam em tabela própria do controle, somente com horário, etapa, status, versões numéricas e código allowlisted. Não registram usuário, arquivo, ref, checksum, token, URL de upload ou PDF. Controle revogado entre execuções.

### Correção causal preparada para repetição real

O Worker emite a referência opaca com baseline certificada somente após confirmar recibo e metadados do upload. A tolerância a incremento posterior de versão exige mesmo usuário, arquivo, versão-base, escopo e revisão/checksum/tamanho; expira após 30 minutos. Referências comuns continuam estritas e uma revisão externa é conflito mesmo com bytes iguais. Isso reconhece conteúdo certificado, sem presumir a origem de alterações de metadados.

Validação integrada: **274/274 testes do Worker**, incluindo 28 casos de baseline e integração real dos handlers com Google sintético; **75 passed / 3 skipped previstos** no navegador desktop/mobile, sem retries. Execução local usa Chrome instalado e vídeo desligado; os skips são casos de toque inaplicáveis ao desktop. Sintaxe, diff e runtime do bundle aprovados. Revisões independentes verificaram escopo, adulteração, expiração, duas abas, metadados ausentes, tamanho máximo da ref, revalidação no start e preservação dos gates. Frontend/cache em `20260917-2`.

## Matriz final V4 — aceite

Em 18/09/2026 foi aberta uma nova janela controlada após reconciliar o PR #201 com a main. O preview de escrita foi `7a3418c6-af84-4709-b361-bf185f49bdea`, release `1d4decd03e0047a1bad678d60cee36ba6822d5b5`, sem promoção do Worker de produção.

| Caso final | Evidência | Resultado |
| --- | --- | --- |
| Login/leitura com gate false | PDF descartável listado com nome genérico e aberto no visualizador próprio em 3 páginas | Aprovado |
| Autosync isolado | Uma rotação iniciou sync e terminou em `Sincronizado com o Google Drive` somente após confirmação final | Aprovado |
| Sem mudança | Período sem interação não iniciou novo sync | Aprovado |
| Segundo autosync | Segunda alteração gerou novo sync e sucesso | Aprovado |
| Fechar/reabrir | Alterações anteriores permaneceram ao reabrir o PDF | Aprovado |
| Conflito externo | Segunda aba criou revisão; aba antiga recebeu `Conflito detectado: o arquivo foi alterado no Google Drive...` | Aprovado; sem sobrescrita silenciosa |
| Revisão vencedora | Alteração da aba vencedora permaneceu após reabrir | Aprovado |
| Encerramento | controle desabilitado, preview final `1864a072-a76a-4a7d-8709-23c5b9045b73`, gate false e HTTP bloqueado | Aprovado |

Observabilidade real já comprovada nesta homologação: PostHog recebeu `drive_sync_started`, `drive_sync_completed` e `drive_sync_failed` com propriedades técnicas allowlisted e sem conteúdo clínico/documental. A nova janela exerceu novamente caminhos de sucesso e conflito; não foi necessário ampliar telemetria.

Limitações não bloqueantes para esta publicação:

- `save_copy` segue validado sinteticamente; o wrapper de homologação deliberadamente permite apenas `replace_pdf` real para não criar fileId novo fora da allowlist;
- edição durante upload, falha/retry e refinamento de latência continuam cobertos por regressão automatizada e ficam como hardening posterior;
- latência percebida entre `syncing` e `success` foi maior que no Lumin e deve ser otimizada na Fase 7 sem antecipar sucesso antes da resposta real do Drive.

**Conclusão:** Fase 4 aceita para merge/publicação do fluxo atual.
