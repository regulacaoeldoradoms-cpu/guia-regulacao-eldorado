# Central de Documentos — evidências da homologação real 4D

Data: 17/09/2026. PR #201, branch `codex/central-docs-drive-sync-phase4`.

**Estado: em execução, sem aceite final e sem merge.** Usado somente um PDF descartável de três páginas com marcadores sintéticos. Nenhum identificador bruto do Drive, token ou conteúdo pessoal integra este registro.

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

Correções preparadas após essa execução:

- Confirmar o upload com releitura da versão somente se arquivo, revisão, MD5 e tamanho coincidirem com o recibo; rejeitar uma revisão externa, inclusive com bytes iguais. Não desativar o preflight estrito do próximo envio.
- Manter a mesma chave de cache restrita na listagem e na confirmação do wrapper.
- Encaminhar o X, saída e troca de documento pela proteção de pendências. Sessões que passaram a depender do Drive continuam protegidas após revogação; edição sempre local mantém saída com confirmação de descarte.
- Cache do frontend atualizado para `20260917-1`. Regressão executa os listeners reais de `documents.js`, não só o harness.
- Suíte completa após integração: **235/235 testes**, sem falhas ou skips. Revisão independente dos patches concluída. A repetição real continua necessária para confirmar a hipótese do conflito de versões.

Repetir autosync após as correções, edição durante upload, confirmação visual transitória, ausência de reenvio sem alteração, falha/retry, fechamento com sucesso e com falha, conflito provocado externamente no mesmo PDF, reabertura da versão final, privacidade dos eventos técnicos e encerramento com controle revogado e preview gate `false`.

O wrapper bloqueia `save_copy`; esse fluxo permanece validado sinteticamente, sem homologação real neste ambiente restrito. Checks automáticos e publicação do preview não substituem a matriz acima.
