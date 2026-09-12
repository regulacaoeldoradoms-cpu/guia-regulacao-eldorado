# Central de Documentos — Arquitetura e Segurança V1

Data: 11/09/2026  
Fase: 0 — Arquitetura e segurança  
Status deste documento: decisão técnica da fase, sujeita à validação por PR.

## 1. Objetivo

Definir a base técnica da Central de Documentos antes de qualquer integração com o Google Drive ou processamento de PDF.

A Central será um subsistema do Portal Regulação Eldorado-MS, preservando a autenticação, as permissões, o Worker como fronteira de segurança, o Google Drive como fonte institucional dos documentos e a política de observabilidade sem conteúdo sensível.

Esta fase não implementa navegação de Drive, visualizador PDF, editor, sincronização ou IA documental.

## 2. Estado do Portal considerado

- Frontend estático hospedado pelo fluxo atual do Portal.
- Cloudflare Worker é a fronteira de autenticação/autorização e integrações sensíveis.
- D1 mantém autenticação, permissões e dados técnicos; não deve virar repositório de PDFs.
- O repositório é público; segredos e dados assistenciais nunca podem ser versionados.
- Service Worker existente pode cachear assets públicos, mas APIs e conteúdo protegido ficam fora do cache estático.
- A observabilidade segura com PostHog já está ativa por allowlist, sem SDK direto nas páginas e sem identidade persistente.
- Os eventos documentais `drive_*`, `pdf_*` e `document_ai_*` já estão reservados na política de observabilidade, porém ainda não são emitidos.

## 3. Arquitetura de referência

```text
Usuário autenticado no Portal
        |
        v
Frontend /documentos/
  - navegação
  - visualizador
  - editor local futuro
  - cache local controlado (memória + IndexedDB criptografado por sessão)
        |
        | sessão do Portal
        v
Cloudflare Worker
  - revalida sessão
  - revalida capability documental
  - troca/renova token Google
  - aplica allowlist de operações
  - faz proxy/stream do Drive
        |
        +---------------------> PostHog
        |                       somente evento técnico sanitizado
        |
        v
Google Drive API v3
  - Meu Drive institucional
  - metadados
  - pesquisa
  - conteúdo PDF
  - revisões e uploads futuros
```

O navegador nunca recebe refresh token, client secret ou token OAuth permanente do Google.

## 4. Autenticação Google e escopo

### 4.1 Fluxo escolhido

Usar OAuth 2.0 no modelo web-server, com autorização única da conta institucional do Google Drive. O callback e a troca do `authorization_code` acontecem no Worker.

O Portal continua autenticando seus próprios usuários pela sessão atual. Usuários do Portal não precisam conhecer nem usar a senha da conta Google institucional.

### 4.2 Escopo necessário

Requisito funcional aprovado: a Central precisa navegar pelo **Meu Drive completo**, pesquisar em toda a conta e, em fases posteriores, salvar/atualizar documentos.

Por isso o escopo escolhido para produção é:

`https://www.googleapis.com/auth/drive`

Motivo: `drive.file` limita o aplicativo aos arquivos criados pelo app ou explicitamente escolhidos/abertos com ele e não atende ao requisito de navegar pelo Meu Drive institucional inteiro.

O escopo `drive` é classificado pelo Google como **Restricted**. Como o backend processará dados obtidos por esse escopo, a publicação definitiva deve considerar os requisitos vigentes de verificação e eventual avaliação de segurança do Google.

Referências oficiais:
- https://developers.google.com/workspace/drive/api/guides/about-sdk
- https://developers.google.com/workspace/docs/api/auth
- https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
- https://developers.google.com/workspace/workspace-api-user-data-developer-policy

### 4.3 Desenvolvimento versus produção

Durante desenvolvimento, um projeto OAuth externo em estado **Testing** pode ser usado com a conta institucional cadastrada como test user. Esse estado não é solução permanente: para escopos além de identidade básica, refresh tokens de projetos externos em Testing expiram em aproximadamente 7 dias segundo a documentação oficial do Google.

Para produção, a integração não deve depender dessa expiração curta.

Caminhos aceitáveis:
1. OAuth externo publicado, com os requisitos de verificação aplicáveis ao uso do escopo restrito; ou
2. futuramente, se a instituição adotar Google Workspace e a arquitetura for migrada para uma aplicação interna da organização, reavaliar o modelo de consentimento.

Não tratar "Testing" como produção estável.

### 4.4 Conta de serviço descartada para o requisito atual

Conta de serviço não é escolhida como mecanismo principal porque o requisito é acessar o **Meu Drive de um usuário**. Service accounts não possuem cota própria para serem donas de arquivos em My Drive e funcionam melhor com conteúdo explicitamente compartilhado ou Shared Drives.

Esse modelo poderá ser reavaliado somente se a instituição migrar os documentos para Shared Drive/Google Workspace.

## 5. Tokens, segredos e persistência

### 5.1 Segredos Cloudflare

Valores que nunca entram no GitHub/frontend:

- `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET`
- `DRIVE_TOKEN_ENCRYPTION_KEY`
- demais segredos de integração que venham a ser necessários.

O client ID pode ser tratado como configuração, mas não precisa ser exposto ao frontend.

### 5.2 Refresh token

O refresh token deve ser persistido **criptografado**, nunca em texto puro.

Modelo previsto:
- tabela D1 exclusiva da Central;
- ciphertext + IV/nonce + versão do formato;
- criptografia AES-GCM no Worker;
- chave mestre somente em `DRIVE_TOKEN_ENCRYPTION_KEY` no painel da Cloudflare;
- nenhum token em log, PostHog, resposta HTTP ou erro exibido ao cliente.

A autorização inicial poderá criar/rotacionar esse registro sem exigir que o token seja copiado para o navegador.

### 5.3 Access token

Access tokens são de curta duração e ficam apenas em memória de execução do backend pelo tempo necessário. Não persistir access token no browser, localStorage, IndexedDB, D1 ou PostHog.

## 6. Modelo de autorização da Central

As permissões documentais serão capacidades independentes do cargo principal do Portal.

Capabilities propostas:

- `documents_view`: listar, pesquisar e abrir documentos permitidos;
- `documents_extract`: usar extração/IA documental quando a Fase 5 existir;
- `documents_edit`: editar PDFs localmente e iniciar salvamento;
- `documents_manage`: administrar acesso à Central e operações administrativas do módulo.

Princípios:
- padrão = nenhuma capability;
- cargo profissional por si só não concede acesso documental;
- somente autoridade administrativa definida no backend concede capabilities;
- amizade, Conselho, Camada Social e outras permissões não concedem acesso documental;
- toda rota `/api/documents/*` revalida sessão + capability no Worker;
- esconder botão no frontend nunca substitui autorização de backend.

Persistência prevista em D1 com tabela separada de capabilities por usuário, sem nomes de pacientes, nomes de arquivos ou metadados clínicos.

## 7. Endpoints previstos por fase

### Fase 1 — somente leitura

- `GET /api/documents/drive/status`
- `GET /api/documents/drive/list`
- `GET /api/documents/drive/search`
- `GET /api/documents/drive/files/:opaqueId/metadata`
- `GET /api/documents/drive/files/:opaqueId/content`

O identificador externo deve ser tratado como dado operacional protegido e nunca enviado ao PostHog.

### Fases posteriores

Escrita, revisão, upload e IA serão adicionadas em rotas separadas. Nenhuma rota de escrita entra na Fase 1.

## 8. Estratégia de leitura e streaming

O Worker não deve montar PDFs completos em memória para depois devolvê-los.

Diretriz:
- solicitar conteúdo ao Drive;
- encaminhar o body como stream quando possível;
- preservar suporte a Range quando tecnicamente suportado pelo endpoint do Drive;
- aplicar `Cache-Control: no-store` para conteúdo clínico/documental;
- não registrar URL completa do Drive;
- não enviar nome do arquivo ao log técnico.

Objetivo: reduzir latência e pressão de memória no Worker.

## 9. Política de cache

### Permitido

- JS/CSS/fonts/icons públicos versionados: Service Worker/cache existente;
- listas/metadados do Drive: memória efêmera da aba/sessão, com TTL curto;
- páginas/bytes de PDF: memória efêmera e, desde a decisão da Fase 2B, IndexedDB criptografado por sessão com TTL/limites/versionamento;
- access token: memória efêmera do Worker.

### Proibido

- PDF clínico em Service Worker Cache Storage ou qualquer cache compartilhado em texto puro;
- PDF em CDN/edge cache compartilhado;
- PDF, nome de arquivo ou fileId em localStorage;
- conteúdo do PDF ou campos extraídos em PostHog;
- cache persistente em texto puro ou desvinculado da sessão. A exceção aprovada na Fase 2B é IndexedDB criptografado com chave derivada da sessão, TTL e invalidação por versão.

No logout e na desconexão do Drive, a Central deve solicitar limpeza do cache documental; bytes remanescentes após falha/crash permanecem cifrados e uma nova sessão invalida o fingerprint anterior.

## 10. Concorrência, conflitos e integridade

A Fase 1 é read-only, mas a estratégia de escrita fica definida desde agora.

Ao abrir um arquivo, o backend deve obter e manter como baseline técnico:
- `fileId` protegido;
- `version` do Drive;
- `modifiedTime`;
- `md5Checksum` quando aplicável;
- capability de edição do próprio recurso.

O campo `version` do Drive é monotonicamente crescente e reflete mudanças feitas no servidor.

Antes de substituir conteúdo:
1. buscar novamente os metadados atuais;
2. comparar a versão atual com a versão-base;
3. se houver mudança externa, interromper com conflito explícito e não sobrescrever;
4. se não houver conflito, preservar uma revisão recuperável do conteúdo binário anterior;
5. iniciar upload resumable do novo PDF;
6. confirmar a resposta final do Drive e nova versão;
7. somente então mostrar "Salvo no Drive".

Para PDFs/binários, revisões importantes podem ser marcadas com `keepForever`, respeitando o limite do Drive. O upload resumable será o padrão para substituições por tolerar interrupções e permitir retomada.

Referências:
- https://developers.google.com/workspace/drive/api/guides/manage-uploads
- https://developers.google.com/resources/api-libraries/documentation/drive/v3/python/latest/drive_v3.files.html
- https://developers.google.com/resources/api-libraries/documentation/drive/v3/python/latest/drive_v3.revisions.html

## 11. Estratégia de rollback

Nenhuma substituição destrutiva deve depender de "torcer para o upload dar certo".

Para substituir um PDF:
- validar localmente que o resultado é um PDF processável;
- confirmar ausência de conflito;
- preservar revisão anterior recuperável;
- usar upload resumable;
- se a confirmação final não chegar, estado visual = "sincronização pendente/indeterminada", nunca "salvo";
- em falha posterior confirmada, permitir restauração da revisão anterior por fluxo administrativo futuro.

"Salvar como novo" usa `files.create` e mantém o original intacto.

## 12. PostHog e logs

Continuam valendo integralmente `docs/PORTAL-OBSERVABILIDADE-POSTHOG-V1.md`.

Permitido:
- duração;
- status técnico;
- faixa de tamanho;
- tipo de operação;
- cache hit/miss;
- rota sanitizada.

Proibido:
- nome do arquivo;
- fileId;
- pasta;
- paciente;
- CPF/CNS;
- diagnóstico/CID;
- texto ou imagem do PDF;
- resultado extraído;
- query do usuário para IA documental.

Eventos reservados:
- `drive_folder_opened`
- `drive_search_completed`
- `pdf_open_started`
- `pdf_first_page_visible`
- `pdf_ready`
- `pdf_edit_completed`
- `drive_sync_started/completed/failed`
- `document_ai_started/completed/failed`

## 13. Fronteira da IA documental

A IA da Fase 5 será uma integração separada da pré-regulação atual.

Regras:
- não enfraquecer o bloqueio de dados sensíveis do assistente médico existente;
- não reutilizar automaticamente `/api/ia` para PDFs identificáveis;
- criar endpoint, política, prompt e testes próprios;
- manter proveniência por página;
- enviar ao provedor somente o conteúdo necessário à operação autorizada;
- PostHog nunca recebe prompt, resposta, texto, imagem ou identificador do documento.

A escolha definitiva do provedor/contrato de tratamento de dados fica para a Fase 5, antes de qualquer PDF real ser enviado a IA.

## 14. Principais ameaças e controles

| Ameaça | Controle obrigatório |
|---|---|
| Usuário do Portal sem autorização chama endpoint diretamente | sessão + capability revalidadas no Worker em toda requisição |
| Token Google roubado por JavaScript/XSS | refresh token nunca vai ao frontend; CSP e backend como proxy |
| Segredo publicado em repositório público | segredos somente no Cloudflare; validações automatizadas |
| Nome/ID/conteúdo enviado ao PostHog | allowlist rígida e testes de privacidade |
| Cache entrega documento antigo ou de outra sessão | `version` do Drive na chave lógica + cache IndexedDB cifrado por sessão + fingerprint de sessão + TTL/LRU |
| Usuários editam o mesmo arquivo simultaneamente | comparação de `version` imediatamente antes da escrita |
| Upload interrompido | upload resumable e estado "pendente", nunca falso sucesso |
| PDF novo inválido | validação antes de enviar e revisão anterior preservada |
| Escopo OAuth excessivo | uso do menor escopo que ainda satisfaz o requisito; neste caso `drive` é justificado por acesso ao Meu Drive completo |
| Conta Google institucional comprometida | tokens backend-only, capacidade Portal segregada e possibilidade de revogação OAuth |
| IA mistura páginas ou vaza contexto | pipeline documental separado, página/proveniência e prompts versionados |

## 15. Alternativas avaliadas e descartadas

### `drive.file`
Descartado para o requisito principal porque não permite navegar de forma geral por todo o Meu Drive preexistente.

### Service account + compartilhamento manual
Descartado como solução principal porque exigiria compartilhar/migrar o acervo e não representa o Meu Drive integral da conta atual.

### Armazenar PDFs no D1/Firebase para "acelerar"
Descartado. Google Drive continua sendo a fonte institucional; duplicar o acervo aumentaria risco de divergência, exposição e custo.

### PostHog SDK direto com autocapture
Descartado. A política atual por Worker/allowlist já está validada e é mais apropriada para ambiente de saúde.

### Cache persistente de PDFs no navegador
A proibição absoluta da Fase 0 foi revisada na Fase 2 após validação real de desempenho. Continua proibido cache clínico em texto puro, Cache Storage ou cache compartilhado. Foi aprovado somente cache IndexedDB cifrado por sessão, com TTL, limites, invalidação por `version` e limpeza no logout/desconexão.

## 16. Critérios de aceite da Fase 0

- [x] Diagrama técnico documentado.
- [x] Modelo de OAuth e escopo Google definido.
- [x] Risco de escopo restrito e caminho de produção documentados.
- [x] Política de tokens e segredos definida.
- [x] Modelo de capabilities documentais definido.
- [x] Política de cache clínico definida.
- [x] Estratégia de conflito, sincronização e rollback definida.
- [x] Fronteira da IA documental definida.
- [x] Principais ameaças e controles registrados.
- [x] Observabilidade compatível com a política já implantada.

## 17. Pré-requisitos para a Fase 1

Antes de leitura real do Drive em ambiente conectado:
1. criar/selecionar projeto Google Cloud específico para a Central;
2. habilitar Google Drive API;
3. configurar OAuth consent screen;
4. cadastrar a conta institucional como test user durante desenvolvimento;
5. criar OAuth Client do tipo Web;
6. cadastrar o redirect URI do Worker;
7. criar os segredos correspondentes no Cloudflare;
8. executar consentimento inicial da conta institucional.

A configuração do Google Cloud exige intervenção humana quando o conector disponível não puder criar/autorizar esses recursos.


## Atualização Fase 2 — stream efêmero

A Fase 2 substitui preferencialmente o caminho `fetch completo -> Blob -> iframe` por um caminho progressivo:

`iframe same-origin virtual -> Service Worker -> Worker documental autenticado -> Google Drive Range/stream`

Regras:
- o Service Worker guarda referência opaca e token de sessão apenas em memória, com expiração curta;
- a página renova esse registro enquanto o PDF estiver aberto e o libera ao fechar;
- o endpoint virtual nunca contém fileId, nome de arquivo ou token;
- o Service Worker não grava resposta documental em Cache Storage, IndexedDB ou outra persistência;
- requisições `Range` do visualizador são encaminhadas ao Worker documental;
- o Worker continua revalidando a sessão e a capability `view` em cada fetch real;
- se o modo progressivo não estiver disponível, o Blob efêmero da Fase 1 continua como fallback;
- `pdf_first_page_visible` só é emitido no caminho progressivo, após o iframe carregar e uma pintura visível ser confirmada;
- nomes, referências e conteúdo continuam proibidos na telemetria.

O detalhamento operacional está em `docs/CENTRAL-DOCUMENTOS-FASE-2.md`.
