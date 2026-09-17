# Central de Documentos — isolamento do preview 4D

Data: 17/09/2026. Esta preparação não representa aceite da homologação real.

## Escopo e entrada

O entrypoint exclusivo `worker/homologation-4d.js` protege a homologação que reutiliza os bindings do Worker institucional. O entrypoint normal `worker/index.js` e o `main` de `worker/wrangler.toml` permanecem inalterados. A versão de homologação deve ser enviada como versão não produtiva com este entrypoint, sem promover deployment.

O wrapper chama os handlers existentes de autenticação, documentos e observabilidade. Reutiliza a validação da sessão Portal, capabilities atuais e verificação de e-mail quando configurada. Não cria um mecanismo próprio de autenticação, não emite tokens artificiais e não altera permissões. A chamada direta dos handlers evita a reconciliação global de perfis legados executada no início de `index.fetch`, que não pertence à 4D.

Uma versão preview com D1 e segredos herdados usa a mesma conexão OAuth institucional e as mesmas contas do Portal. A separação do armazenamento do navegador não isola esses recursos. Por isso o wrapper bloqueia todas as rotas OAuth, inclusive callback, reconexão e desconexão; não é necessário repetir consentimento para usar a conexão existente.

## Configuração pública da versão

- `DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN`: origem HTTPS exata do preview autorizado, preferencialmente alias conhecido antes do upload. Precisa terminar em `.workers.dev`; a origem de produção é rejeitada explicitamente.
- `DOCUMENTS_HOMOLOGATION_ORIGIN`: origem HTTPS exata do Pages de homologação, terminada em `.pages.dev`.
- `DOCUMENTS_HOMOLOGATION_CONTROL_ID`: identificador técnico único da janela, de 8 a 80 caracteres alfanuméricos, `_` ou `-`. Não reutilizar o identificador para uma janela futura.
- `DOCUMENTS_DRIVE_WRITE_ENABLED`: manter `false` durante preparação e leitura. A escrita depende de `true` **e** de controle ativo no D1.

Todas as requisições precisam chegar pelo host exato e apresentar a origem Pages exata. Sem `Origin`, host diferente, query string ou rota não permitida, o wrapper bloqueia antes de encaminhar. CORS não substitui a autenticação: usuário e capabilities são verificados no backend.

O frontend continua a receber somente `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL`. Não recebe o controle, lista de fileIds nem segredos. A URL estática de uma versão fora da origem autorizada é bloqueada, mesmo quando essa versão permanece acessível na Cloudflare.

## Controle revogável no D1

O esquema revisável está em `worker/migrations/central-documents-homologation-4d.sql`. Ele contém somente duas criações idempotentes de tabelas. Não insere usuário, arquivo ou janela habilitada e não é executado automaticamente pelo wrapper.

`document_drive_homologation_controls` contém:

| Campo | Finalidade |
| --- | --- |
| `control_id` | Identificador único da janela/preview |
| `enabled` | `0` por padrão; somente `1` habilita a janela |
| `expires_at` | Expiração Unix em segundos, obrigatória e futura |
| `allowed_username` | Uma conta existente, ativa, com capacidades documentais necessárias |
| `allowed_file_ids_json` | JSON de 1 a 5 fileIds de PDFs descartáveis, confirmados pelo operador |

Os IDs ficam apenas no backend operacional. Nenhum ID real deve entrar em repositório, frontend, screenshots de evidência ou telemetria. A linha não contém nomes de arquivos, conteúdo de PDF ou dados clínicos.

O controle é lido diretamente do D1 a cada requisição, sem cache; consultas diretas do binding vão ao primário. Em operações de escrita, ele é relido depois da autenticação e leitura do corpo. Tabela/linha ausente, consulta falha, configuração inválida, revogação ou expiração bloqueiam. Preparação com linha ativa e feature gate `false` permite login e leitura restrita, sem escrita Drive.

Para encerrar, atualizar a linha para `enabled = 0` ou removê-la no backend, além de manter gate desligado na versão de trabalho. A próxima requisição da mesma URL imutável será rejeitada. Uma requisição já encaminhada ao Google pode concluir; aguardar operações em voo antes do encerramento e confirmar o bloqueio com nova chamada. Não confundir revogação com cancelamento retroativo de um upload aceito.

## Arquivos e sessões de upload

A listagem/pesquisa consulta individualmente metadados apenas dos fileIds permitidos e apresenta nomes sintéticos (`PDF descartável 4D 1.pdf`, etc.). Não navega pastas, não usa listagem global do Drive nem devolve nomes reais. Metadados de versão/capacidade usam o preflight existente; abertura e substituição usam os handlers reais.

A identidade do cache é um HMAC-SHA-256 de controle e fileId, com separação de domínio `homologation-4d` e chave de proteção do Drive no backend. Não expõe ID ou controle, nem depende da posição na lista. Reordenar ou trocar PDFs permitidos não reutiliza o cache de outro arquivo. A confirmação do upload retorna essa mesma chave do preview; não repassa a chave do namespace normal de produção.

Antes de conteúdo/preflight/start, a referência opaca é aberta no backend e o fileId precisa constar da lista de descartáveis. A homologação restrita permite `replace_pdf`; `save_copy` fica bloqueado porque produziria um novo fileId não autorizado previamente. Isso não altera a implementação normal de produção e não homologa salvamento de cópia no Drive real.

Todo start autorizado desta homologação força `preserveRevision: true` antes do handler real, inclusive se a requisição pedir `false`. A revisão anterior precisa receber confirmação de `keepForever=true` antes de iniciar a substituição. Essa proteção é exclusiva do preview e será exercitada somente com os PDFs descartáveis.

`document_drive_homologation_sessions` vincula cada `sync_id` emitido pelo start real ao controle, usuário, fileId e expiração. O registro precisa existir antes de upload/status/cancel; o arquivo precisa continuar autorizado, o usuário continuar sendo o responsável e a janela continuar ativa. Sessões existentes de produção ou de outra janela não passam. A existência da tabela é verificada antes de iniciar qualquer mutação Google.

Na confirmação ou cancelamento, remove-se o vínculo da homologação. O core existente já remove sua própria sessão quando conclui/cancela; o wrapper não introduz nova política de retry depois da conclusão. Uma falha de registro após start não encaminha bytes de PDF e deixa a sessão sem autorização para upload; não é mostrada como sucesso.

## Confirmação de versão após upload

A primeira execução real registrou uma revisão preservada e uma nova revisão, mas a edição feita durante o primeiro upload terminou com conflito sem alteração externa conhecida. A hipótese de diferença entre a versão do recibo resumable e a versão imediatamente lida pelo próximo preflight ainda precisa de repetição real para ser confirmada. A documentação do Drive define `version` como contador de alterações do servidor, inclusive alterações de metadados; ela não comprova que `keepForever` causou o episódio observado.

O core compartilhado `document-drive.js` agora relê os metadados depois do recibo final 200/201. Só conclui e retorna a versão atual se fileId, revisão de conteúdo (`headRevisionId`), MD5 e tamanho coincidirem com o recibo do próprio upload. O recibo precisa trazer revisão, checksum válido e tamanho igual ao upload autorizado. Outra revisão é conflito 409 mesmo quando os bytes têm o mesmo checksum. Uma versão numérica anterior à do recibo retorna interrupção 503 e permite nova consulta de status. A comparação estrita de versão no próximo preflight permanece inalterada.

Isso adiciona uma leitura de metadados a cada confirmação, incluindo retomada por status, e evita confirmar sucesso com identidade incompleta. Não torna upload e leitura uma transação: uma alteração posterior à leitura continua a ser detectada no próximo preflight. O teste sintético cobre duas edições sequenciais com recibos v8/v10 e metadados v9/v11, preservação obrigatória em ambas e conflito externo subsequente. Não substitui a repetição da prova real.

## Rotas e observabilidade

Permitidas: login da conta configurada, `auth/me`, logout, acesso/status/preferências documentais de leitura, lista/pesquisa restritas, conteúdo e fluxo de substituição. Administração, criação de conta, mudança de senha, gravação de preferências, OAuth e demais módulos ficam bloqueados.

Exceção intencional: `/api/observability` mantém o contrato técnico público sem bearer do frontend existente, inclusive `sendBeacon`. Exige host/origem exatos e controle ativo e reutiliza a allowlist de eventos e propriedades do backend; não dá acesso ao Drive. Login é encaminhado à autenticação normal somente para o nome de usuário autorizado, sem contornar senha ou sessão.

O wrapper não registra erros, queries, IDs, tokens, referências ou conteúdo em logs. Evidência de integração deve usar respostas sanitizadas, interface, confirmação no Drive e eventos técnicos. A documentação Cloudflare informa que Preview URLs não oferecem Workers Logs, tail ou Logpush; ausência de logs não prova execução nem privacidade.

## Validação sintética

Executar `node --test worker/tests/homologation-4d.test.mjs`.

A matriz cobre host/origem, rotas, controle ausente/inválido/expirado/revogado, sessão e capabilities, arquivo fora da lista, gate desligado, sessão de outro usuário/arquivo/janela, revogação entre awaits, tamanho de corpo, CORS e zero encaminhamento ao Google nas rejeições. Há integração com os handlers reais do Portal/Drive e autenticação normal com conta sintética: login, listagem, conteúdo, gate desligado, preservação de revisão, início resumable e confirmação final. Somente Google é mockado nessa integração, sem documentos nem credenciais reais.

Esses testes não substituem a matriz real 4D, nem autorizam merge ou promoção de produção.

## Referências técnicas verificadas

- [Cloudflare — D1 Database](https://developers.cloudflare.com/d1/worker-api/d1-database/): consultas diretas no primário; sessões são necessárias para leitura replicada.
- [Cloudflare — Preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/): URLs estáticas por versão, aliases e limites de logs.
- [Cloudflare — Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/): bindings, limites de leitura, segredos e promessas aguardadas.
- [Google Drive — File](https://developers.google.com/workspace/drive/api/reference/rest/v3/files): significado de `version`, `headRevisionId`, `md5Checksum` e `size`.
- [Google Drive — Upload file data](https://developers.google.com/workspace/drive/api/guides/manage-uploads): resposta final e consulta de status de sessões resumable.

Tipos consultados: `@cloudflare/workers-types` 5.20260917.1, sem acrescentar dependência ao projeto. Nenhuma mudança na compatibilidade ou configuração produtiva é necessária para este wrapper.
