# Central de Documentos — Fase 1: Navegação read-only do Google Drive

Data: 11/09/2026  
Branch: `feat/central-docs-phase-1-drive-readonly`

## Objetivo

Entregar a primeira superfície funcional da Central de Documentos: acesso autorizado ao Google Drive institucional, navegação por Meu Drive, pesquisa global por nome e abertura de PDFs dentro do Portal, sem qualquer escrita no Drive.

## Escopo implementado

### Autorização do Portal

A Central usa capabilities separadas do cargo principal:

- `view`: leitura da Central e PDFs;
- `extract`: reservada para Fase 5;
- `edit`: reservada para Fase 3/4;
- `manage`: administração da conexão institucional.

A tabela D1 é `auth_document_access`. O Desenvolvedor recebe `manage` implicitamente, mas não recebe leitura de documentos automaticamente: `view` continua explícita.

Toda rota protegida revalida sessão + capability no Worker.

### OAuth institucional

O fluxo é web-server:

1. usuário com `manage` solicita início da conexão;
2. Worker cria nonce temporário e estado HMAC sem username no payload enviado ao Google;
3. Google retorna ao callback do Worker;
4. Worker troca o authorization code;
5. refresh token é criptografado com AES-GCM e salvo no D1;
6. access token permanece apenas em memória e é renovado quando necessário.

O navegador nunca recebe refresh token, client secret ou access token do Google.

### Referências de arquivos

O `fileId` bruto do Google Drive não é retornado ao frontend.

O Worker cria uma referência opaca temporária com AES-GCM contendo apenas:
- ID do Drive;
- MIME type;
- validade curta.

Essa referência é usada para navegar em pastas e abrir PDFs. PostHog nunca recebe a referência.

### Navegação

Endpoints da Fase 1:

- `GET /api/documents/access`
- `PATCH /api/documents/admin/access/:username`
- `POST /api/documents/oauth/start`
- `GET /api/documents/oauth/callback`
- `POST /api/documents/oauth/disconnect`
- `GET /api/documents/drive/status`
- `POST /api/documents/drive/list`
- `POST /api/documents/drive/search`
- `GET /api/documents/drive/content/:opaqueRef`

Lista e pesquisa usam POST para evitar termos de pesquisa e referências em query string do Portal.

### Visualização de PDF

A Fase 1 usa o visualizador nativo do navegador sobre um Blob temporário:

`Drive -> Worker streaming -> fetch autenticado -> Blob em memória -> blob: URL -> iframe`

A URL Blob é revogada ao fechar, trocar de documento, sair da página ou fazer logout.

Esse desenho é deliberadamente simples para validar acesso e integridade. A Fase 2 substituirá o carregamento integral por visualização progressiva de alta performance com medição real de primeira página.

## Privacidade e cache

- respostas documentais: `Cache-Control: no-store`;
- Service Worker não cacheia `/api/*` nem requisições com `Range`;
- nenhum PDF em localStorage, sessionStorage, IndexedDB ou Cache Storage;
- nomes e metadados ficam somente no estado em memória da página;
- pesquisa não entra na URL do Portal;
- fileId não sai do Worker;
- nenhum conteúdo documental entra em PostHog.

Eventos técnicos permitidos nesta fase:
- `drive_folder_opened`
- `drive_search_completed`
- `pdf_open_started`
- `pdf_ready`

`pdf_first_page_visible` permanece reservado para a Fase 2, pois o iframe nativo não fornece uma medição confiável da primeira página.

## Interface

A rota `/documentos/`:
- aparece no catálogo somente quando há `view` ou `manage`;
- mostra configuração institucional para quem administra;
- permite ao Desenvolvedor conceder apenas a capability de leitura nesta fase;
- navega por pastas com breadcrumbs mantidos somente em memória;
- pesquisa globalmente por nome;
- mostra pastas primeiro;
- abre PDFs no painel lateral/abaixo em mobile;
- arquivos não-PDF aparecem como não suportados nesta fase.

IA e edição não são apresentadas na UI da Fase 1.

## Configuração externa necessária

No Cloudflare:
- `GOOGLE_DRIVE_OAUTH_CLIENT_ID` — variável;
- `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` — Secret;
- `DRIVE_TOKEN_ENCRYPTION_KEY` — Secret.

Já versionados como valores públicos seguros:
- `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` apontando para o callback do Worker;
- `DOCUMENTS_PORTAL_RETURN_URL` apontando para `/documentos/`.

No Google Cloud:
1. habilitar Google Drive API;
2. configurar OAuth consent screen;
3. durante desenvolvimento, cadastrar a conta institucional como test user;
4. criar OAuth Client do tipo Web;
5. cadastrar exatamente o redirect URI informado pelo Worker;
6. copiar Client ID/Secret para Cloudflare;
7. executar a autorização a partir da Central.

O modo Testing é somente desenvolvimento; não é solução estável de produção para o escopo restrito `drive`.

## Fora de escopo

- criar, renomear, mover ou excluir arquivos;
- substituir PDF;
- editar páginas;
- unir PDFs;
- IA documental;
- cache persistente;
- Shared Drives como fluxo específico;
- sincronização offline.

## Critérios de aceite

Para encerrar a Fase 1:

- [x] capabilities documentais separadas do cargo;
- [x] OAuth backend sem token Google no frontend;
- [x] refresh token criptografado;
- [x] fileId bruto não exposto ao cliente;
- [x] listagem de pasta implementada;
- [x] pesquisa global por nome implementada;
- [x] stream/download PDF protegido implementado;
- [x] rota `/documentos/` implementada;
- [x] cache persistente de PDF bloqueado;
- [x] telemetria documental limitada à allowlist técnica;
- [x] testes automatizados de privacidade e autorização adicionados;
- [ ] configuração Google Cloud/OAuth real concluída;
- [ ] conta institucional conectada;
- [ ] teste real confirma navegação por Meu Drive, pesquisa e abertura de PDF permitido;
- [ ] propriedades recebidas no PostHog revalidadas após uso real;
- [ ] PR da Fase 1 com checks aprovados e resultado registrado no status.

A fase permanece aberta enquanto os itens de integração real não forem comprovados.
