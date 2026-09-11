# Observabilidade segura do Portal com PostHog — V1

Revisado em 11/09/2026.

## Objetivo

Medir desempenho, estabilidade e gargalos do Portal sem enviar conteúdo assistencial,
identidade de usuário ou documentos ao PostHog. A observabilidade é deliberadamente
mais restritiva do que a captura padrão do SDK.

## Arquitetura

Fluxo obrigatório:

\`navegador -> /api/observability no Worker -> validação rígida -> PostHog\`

O Portal não inicializa o SDK JavaScript do PostHog. \`js/portal-observability.js\`
coleta apenas métricas técnicas e usa o mesmo Worker já autorizado pelo CSP. O Worker
é a única camada que conhece a credencial de ingestão.

## Proteções de privacidade

- Session Replay desligado.
- Captura de console desligada.
- Autocapture desligado.
- Dead clicks desligado.
- IP descartado no projeto.
- Nenhuma leitura de texto do DOM, campos de formulário ou conteúdo digitado.
- Nenhum nome de arquivo, identificador do Drive, query string ou conteúdo de PDF.
- Nenhum nome, usuário, e-mail, CPF, CNS, telefone, endereço, nascimento, diagnóstico,
  CID, encaminhamento, prescrição, exame ou mensagem.
- Nenhum \`identify()\` e nenhum perfil persistente de pessoa.
- \`distinct_id\` efêmero por carregamento de página, sem vínculo com a conta.
- \`$process_person_profile=false\` em todos os eventos.
- \`$geoip_disable=true\` em todos os eventos.
- O Worker rejeita evento, propriedade, rota, enum ou campo de envelope fora da
  allowlist. Não existe passagem genérica de propriedades.

## Eventos permitidos

Núcleo atual:

- \`portal_page_ready\`
- \`portal_navigation_ready\`
- \`portal_web_vital\`
- \`api_request_timing\`
- \`api_request_failed\`

Reserva já validada para o módulo documental:

- \`drive_folder_opened\`
- \`drive_search_completed\`
- \`pdf_open_started\`
- \`pdf_first_page_visible\`
- \`pdf_ready\`
- \`pdf_edit_completed\`
- \`drive_sync_started\`
- \`drive_sync_completed\`
- \`drive_sync_failed\`
- \`document_ai_started\`
- \`document_ai_completed\`
- \`document_ai_failed\`

Os eventos documentais aceitam apenas classificações técnicas como duração, operação,
faixa de tamanho e estado de cache. Nunca recebem nome ou ID do documento.

## Web Vitals

O cliente usa PerformanceObserver para FCP, LCP, CLS e INP. As métricas são enviadas
como \`portal_web_vital\`, com a rota reduzida a uma lista fixa de caminhos do Portal.
Query strings e hashes nunca são enviados.

## Configuração necessária no Cloudflare

Configurar no Worker, fora do GitHub:

- \`POSTHOG_PROJECT_TOKEN\`: token de ingestão write-only do projeto PostHog.
- \`POSTHOG_HOST\`: opcional. O padrão é \`https://us.i.posthog.com\`; somente os hosts
  US e EU oficiais são aceitos.

O token não deve ser versionado. Sem ele, o endpoint continua respondendo de forma
neutra e não envia eventos, de modo que a observabilidade nunca interrompe a operação
do Portal.

## Desempenho

\`js/portal-observability.js\` é carregado de forma assíncrona e ociosa pela camada de
desempenho. Ele não participa do caminho crítico da primeira pintura. Eventos são
agrupados no navegador e enviados com \`keepalive\`; no Worker, a entrega ao PostHog é
agendada com \`waitUntil\`, portanto a interface não espera a ingestão externa.

## Testes

\`worker/tests/observability-privacy.test.mjs\` valida:

- rejeição de propriedades não previstas;
- rejeição de rota dinâmica;
- ausência de identidade persistente;
- envio de \`$process_person_profile=false\` e \`$geoip_disable=true\`;
- ausência de URL completa e username;
- bloqueio de origem não autorizada;
- comportamento neutro quando o token ainda não estiver configurado.
