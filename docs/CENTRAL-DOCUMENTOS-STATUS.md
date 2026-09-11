# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 1 — Navegação do Google Drive**

Subfase atual: implementar a superfície read-only da Central, capabilities documentais e integração OAuth/Drive sem escrita.

## Estado de entrada

- Branch da Fase 1 criada da `main` pós-Fase 0 em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A main já contém a observabilidade segura do PostHog para o Portal.
- No estado de entrada da Fase 1 ainda não existia integração Google Drive funcional; ela passou a ser implementada nesta branch.
- O arquivo de status foi criado na Fase 0 e agora é o ponto obrigatório de continuidade.
- Há PR antigo de Telemedicina aberto (#107), sem relação com a Central; não deve ser misturado a este trabalho.
- PR #133 da Fase 0 foi validado com 21 workflows sem falhas e mesclado na main em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A arquitetura da Fase 0 está encerrada. O código read-only da Fase 1 foi validado e mesclado na `main` pelo PR #134 em `3dc50afd3ba902d36ebe806176ad0939d71c9379`.

## Branch / PR

Branch atual: `feat/central-docs-phase1-oauth-validation`

PR atual: nenhum para esta subfase. PR #134 foi mesclado na `main`.

## Entregas concluídas nesta unidade

- Fase 0 encerrada com PR #133 mesclado;
- 21 workflows do PR #133 concluídos com sucesso;
- branch da Fase 1 criada diretamente da main pós-merge;
- leitura do Guia Mestre V1.1 e aplicação do protocolo de continuidade;
- inspeção da main, arquitetura, autenticação, catálogo de ferramentas e política de observabilidade;
- confirmação de que a Central de Documentos ainda não foi implementada;
- pesquisa das regras atuais do Google Drive API/OAuth em documentação oficial;
- criação de `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`;
- criação deste arquivo de estado;
- `worker/document-access.js`: tabela e capabilities documentais independentes do cargo;
- autenticação flexível passou a devolver `documentCapabilities` na sessão e na gestão de usuários;
- `worker/document-drive.js`: OAuth web-server, refresh token AES-GCM, access token efêmero, referências opacas, listagem, busca e PDF read-only;
- estado OAuth deixou de transportar username para o Google; identidade fica apenas no D1 temporário;
- `worker/documents-router.js` e integração no `worker/index.js`;
- `/documentos/`, `css/documents.css` e `js/documents.js` com navegação, busca, breadcrumbs, gestão de leitura e visualizador PDF;
- catálogo de ferramentas passou a mostrar a Central somente por capability documental;
- Service Worker reconhece a página estática da Central, mantendo `/api/*` e Range fora do cache; cache global renovado para V10;
- prontidão técnica passou a indicar apenas presença/ausência das configurações OAuth, sem exibir valores;
- redirect URI e URL de retorno públicos foram documentados no `wrangler.toml`; credenciais permanecem externas;
- testes `documents-phase1.test.mjs` e `documents-ui.test.mjs` adicionados;
- workflow `Validar Central de Documentos — Fase 1` adicionado;
- documentação `docs/CENTRAL-DOCUMENTOS-FASE-1.md` criada e arquitetura geral atualizada.

## Decisões tomadas

1. Google Drive continua sendo a fonte institucional; PDFs não serão copiados para D1/Firebase como repositório paralelo.
2. Integração usa Google Drive API v3 através do Cloudflare Worker.
3. A conta institucional é autorizada uma vez; usuários do Portal usam sessão/capabilities do próprio Portal.
4. Escopo previsto: `https://www.googleapis.com/auth/drive`, pois o requisito é navegar pelo Meu Drive completo e editar em fases posteriores.
5. Refresh token será armazenado criptografado no backend; navegador nunca recebe token permanente.
6. Capabilities documentais serão independentes dos cargos: `documents_view`, `documents_extract`, `documents_edit`, `documents_manage`.
7. Conteúdo documental terá `no-store` e cache somente efêmero em memória da sessão nesta versão.
8. Conflitos futuros serão detectados com a `version` do Drive antes da escrita.
9. Substituição futura só será considerada salva após confirmação real do Google Drive e preservará revisão recuperável.
10. A IA documental será separada da pré-regulação atual e não reutilizará automaticamente o endpoint existente.
11. A Fase 1 usa referência opaca AES-GCM para que o fileId bruto do Drive não chegue ao navegador.
12. Lista e pesquisa usam POST no Portal para evitar termos/referências em query string local.
13. O visualizador da Fase 1 usa Blob efêmero + iframe nativo; medição confiável de primeira página fica para a Fase 2.
14. A interface da Fase 1 concede somente Leitura; IA/Edição permanecem capabilities reservadas e não são expostas como funcionalidade ativa.

## Justificativas

- O escopo `drive.file` não satisfaz o acesso a todo o acervo preexistente.
- Service account exigiria compartilhamento/migração do acervo e não representa o Meu Drive integral atual.
- Persistir PDFs localmente aumentaria risco de divergência e exposição.
- Capabilities independentes evitam conceder acesso documental apenas por associação a um cargo.
- Worker mantém tokens e regras de autorização fora do navegador.
- Cache efêmero reduz risco de persistência de documentos clínicos no dispositivo.

## Alternativas descartadas

- `drive.file` como escopo principal.
- service account + compartilhamento manual de todo o acervo.
- cópia do acervo para banco/Firebase.
- PostHog SDK/autocapture em páginas documentais.
- cache persistente de PDFs no navegador.

## Ações externas concluídas

- PostHog seguro já implantado e validado no Portal antes do início desta fase.
- `POSTHOG_PROJECT_TOKEN` já configurado externamente e eventos técnicos validados.

## Pendências e bloqueios

- PR #134 foi validado com 26 workflows sem falhas e mesclado na `main`.
- Google Cloud/OAuth da Central ainda não configurado.
- Consentimento da conta institucional ainda não executado.
- Produção com escopo `drive` exige tratar o status de escopo restrito e requisitos de verificação aplicáveis.
- Nenhum bloqueio impede concluir a documentação da Fase 0.
- Fase 1 não poderá completar o critério de aceite real até os passos OAuth externos estarem prontos.
- O código read-only está preparado para permanecer desconectado de forma neutra quando as variáveis/Secrets ainda não existirem.
- Após checks do PR, a próxima dependência humana será criar/configurar o OAuth no Google Cloud e os valores correspondentes na Cloudflare.

## Riscos conhecidos

- refresh token de OAuth externo em status Testing expira em prazo curto segundo Google; não usar Testing como solução de produção;
- escopo `drive` é restrito e exige processo de conformidade apropriado;
- nomes de arquivos podem conter dados identificáveis, portanto não entram em PostHog/logs;
- cache persistente ou service worker mal configurado poderia reter documento clínico; explicitamente proibido;
- escrita concorrente futura pode sobrescrever versão externa se a comparação de `version` for omitida.

## Métricas / observabilidade

A observabilidade-base já está operacional. A Fase 1 passa a emitir apenas `drive_folder_opened`, `drive_search_completed`, `pdf_open_started` e `pdf_ready` quando houver uso real.

`pdf_first_page_visible` não será emitido nesta fase porque o iframe nativo não oferece medição confiável da primeira página; isso fica para a Fase 2.

Nenhum conteúdo real de Drive foi enviado ao PostHog até este registro.

## Próximo passo

1. PR #134 validado com 26 workflows e mesclado em `3dc50afd`;
2. confirmar publicação do Worker/frontend pós-merge;
3. realizar a configuração externa Google Cloud/Cloudflare;
5. conectar a conta institucional a partir de `/documentos/`;
6. comprovar navegação por Meu Drive, pesquisa e abertura de PDF real;
7. auditar eventos/propriedades reais no PostHog;
8. encerrar Fase 1 apenas após esses critérios.

## Arquivos e fontes principais

- `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`
- `docs/CENTRAL-DOCUMENTOS-STATUS.md`
- `docs/CENTRAL-DOCUMENTOS-FASE-1.md`
- `documentos/index.html`
- `js/documents.js`
- `worker/document-access.js`
- `worker/document-drive.js`
- `worker/documents-router.js`
- `PORTAL-ARQUITETURA.md`
- `docs/PORTAL-OBSERVABILIDADE-POSTHOG-V1.md`
- `js/tools-catalog.js`
- `worker/auth-management-flex.js`
- `worker/index.js`
- `worker/wrangler.toml`
- Guia Mestre — Central de Documentos V1.1

## Handoff para o próximo chat

**Fase atual:** Fase 1 — Navegação do Google Drive.  
**Subfase / objetivo atual:** conectar e validar a conta institucional no ambiente real, sem iniciar Fase 2.  
**Última ação concluída:** PR #134 validado com 26 workflows e mesclado na main em `3dc50afd3ba902d36ebe806176ad0939d71c9379`; nova branch de validação OAuth criada da main.  
**Branch atual:** `feat/central-docs-phase1-oauth-validation`.  
**PR atual:** nenhum; abrir somente se a validação real exigir correção de código/documentação.  
**Último commit relevante:** `3dc50afd` — merge da implementação read-only da Fase 1.  
**Checks e testes:** 26 workflows do PR #134 passaram; inclui suíte específica da Central e suíte completa do Worker.  
**Decisões tomadas:** Drive API via Worker; escopo `drive`; refresh token AES-GCM; access token em memória; fileId encapsulado; POST para lista/pesquisa; Blob efêmero; UI estritamente read-only.  
**Justificativas:** atender Meu Drive completo sem expor credenciais/fileId nem persistir documento clínico.  
**Alternativas descartadas:** `drive.file`, service account para acervo atual, espelho de PDFs, cache persistente, token Google no frontend, IA/edição antecipadas.  
**Ações externas concluídas:** PostHog seguro operacional; código da Fase 1 mesclado. Google Cloud OAuth ainda não configurado.  
**Pendências:** confirmar deploy; configurar Google Drive API/OAuth; adicionar Client ID/Secret e chave AES na Cloudflare; consentir conta institucional; testar navegação/pesquisa/PDF; auditar PostHog.  
**Riscos conhecidos:** restricted scope e requisitos de produção; refresh token curto em Testing; PDFs grandes ainda carregam integralmente nesta fase.  
**Métricas / observabilidade:** instrumentação da Fase 1 pronta, mas nenhum evento documental real validado ainda.  
**Próxima ação exata:** confirmar que a versão pós-merge está publicada e, então, orientar somente os passos manuais inevitáveis do Google Cloud/Cloudflare.  
**Arquivos e fontes principais:** `docs/CENTRAL-DOCUMENTOS-FASE-1.md`, arquitetura V1, este status, `worker/document-drive.js`, `worker/documents-router.js`, `documentos/index.html`, `js/documents.js`.
