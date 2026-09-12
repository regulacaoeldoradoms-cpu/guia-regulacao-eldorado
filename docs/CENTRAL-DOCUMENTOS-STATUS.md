# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 1 — Navegação do Google Drive**

Subfase atual: concluir validação real da Fase 1 e consolidar o novo modelo de funções adicionais acumuláveis para acesso à Central.

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

15. O acesso operacional à Central deixa de ser administrado por uma lista enorme dentro de `/documentos/`.
16. O Portal passa a suportar **funções adicionais acumuláveis** sem substituir o perfil principal.
17. A primeira função adicional é `documentos` — **Central de Documentos** — e concede leitura do Drive institucional.
18. A gestão dessa função fica em `/admin/usuarios/`; exemplo válido: **Médico + Central de Documentos**.
19. `auth_document_access` permanece para capabilities documentais finas/compatibilidade, enquanto `auth_user_additional_roles` registra funções acumuláveis.
20. A página `/documentos/` mantém apenas operação documental e configuração institucional compacta; administração de usuários sai da tela operacional.


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

- OAuth institucional concluído: a tela real da Central exibiu **Drive conectado**.
- A raiz do Meu Drive foi carregada com sucesso no Portal e exibiu pastas reais em modo somente leitura.
- A integração Google Drive está funcional no ambiente real para listagem inicial; pesquisa e abertura de PDF ainda precisam de validação final explícita.


- Client ID OAuth corrigido no Cloudflare após diagnóstico de valor ausente; configuração esperada agora contém Client ID, Client Secret, redirect URI e chave de criptografia.

- Conta institucional adicionada como usuário de teste no Google Auth Platform; tela confirma 1 usuário de teste ativo.

- Cloudflare: credenciais OAuth e chave de criptografia configuradas pelo usuário, sem exposição dos valores no chat ou repositório.

- Google Drive API ativada no projeto Google Cloud.
- Tela de consentimento OAuth configurada como **Externo** em modo de testes.
- OAuth Client do tipo Web criado no Google Cloud para a Central de Documentos.
- Client ID e Client Secret foram gerados pelo Google; os valores não foram enviados ao chat nem versionados.
- JSON de credenciais foi baixado localmente pelo usuário; deve ser tratado como segredo e não entrar no repositório.

- PostHog seguro já implantado e validado no Portal antes do início desta fase.
- `POSTHOG_PROJECT_TOKEN` já configurado externamente e eventos técnicos validados.

## Decisão futura registrada — histórico de atividade do Drive

O usuário confirmou que deseja, em fase posterior, consultar o histórico de atividade de arquivos e pastas dentro da Central de Documentos.

Diretriz registrada:
- avaliar integração com a **Google Drive Activity API** após a navegação read-only principal estar validada;
- objetivo: exibir eventos como renomeação, movimentação, criação, exclusão/restauração, alterações de compartilhamento e outras ações suportadas pela API;
- isso **não entra na Fase 1** e não deve atrasar a conexão inicial com o Google Drive API;
- antes de implementar, definir escopo OAuth adicional, política de retenção, modelo de exibição e quais eventos podem aparecer sem expor conteúdo clínico;
- qualquer telemetria desse histórico continua proibida de enviar nome de arquivo, usuário, identificadores do Drive ou conteúdo ao PostHog.

## Descoberta técnica na validação real

- O bloco `Acessos à Central` ocupava espaço excessivo e misturava administração de usuários com a operação documental. Foi decidido removê-lo da rota operacional e centralizar a concessão em **Usuários e acessos**.
- O modelo anterior de um único perfil principal não atendia ao requisito novo de acumular funções. Foi criada uma camada adicional, sem quebrar os perfis existentes, para permitir combinações como Médico + Central de Documentos.
- A tela real já comprovou OAuth conectado e listagem da raiz do Meu Drive.


- Durante o consentimento real, o Google exibiu aviso de **app não verificado**. Isso é esperado nesta etapa porque o OAuth está em modo de testes e a conta institucional foi cadastrada como usuário de teste. O fluxo deve continuar apenas com essa conta autorizada até a futura verificação/publicação.

- Revisão visual do Cloudflare mostrou que a linha da variável `GOOGLE_DRIVE_OAUTH_CLIENT_ID` está presente, porém o campo **Value** aparece vazio; `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET` está como Secret, `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` possui URL e `DRIVE_TOKEN_ENCRYPTION_KEY` está como Secret. A ausência do valor do Client ID explica o estado `Integração aguardando configuração` mostrado pela Central.
- Validação real em `/documentos/` mostrou **Integração aguardando configuração** mesmo após o usuário informar que cadastrou as três variáveis no Cloudflare.
- Isso comprova que o Worker em produção não está enxergando pelo menos uma das quatro configurações exigidas por `driveOAuthConfiguration`: `GOOGLE_DRIVE_OAUTH_CLIENT_ID`, `GOOGLE_DRIVE_OAUTH_CLIENT_SECRET`, `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` ou `DRIVE_TOKEN_ENCRYPTION_KEY`.
- O frontend e as rotas da Central estão publicados e funcionais, pois a página, capabilities e lista de usuários carregaram normalmente.
- Próxima verificação deve ser feita no Cloudflare em Variables and Secrets, sem expor valores: conferir nomes exatos, ambiente correto e se houve Save/Deploy.

## Pendências e bloqueios

- PR #134 foi validado com 26 workflows sem falhas e mesclado na `main`.
- Google Cloud/OAuth da Central configurado e consentimento institucional concluído.
- Produção com escopo `drive` exige tratar o status de escopo restrito e requisitos de verificação aplicáveis.
- Nenhum bloqueio impede concluir a documentação da Fase 0.
- Fase 1 ainda depende de validar pesquisa, abertura de PDF real e auditoria final dos eventos PostHog.
- A alteração de UX/cargos acumuláveis desta subfase ainda precisa passar por PR/checks antes de ir para a main.

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

1. abrir PR desta subfase com remoção do bloco extenso de acessos e funções adicionais acumuláveis;
2. validar suíte completa e checks;
3. mesclar somente se os checks passarem;
4. confirmar em produção que `/documentos/` ficou compacta e que a função **Central de Documentos** aparece em `/admin/usuarios/`;
5. validar pesquisa real no Drive;
6. abrir um PDF real autorizado e confirmar visualização;
7. auditar no PostHog apenas os eventos/propriedades técnicas permitidos;
8. encerrar a Fase 1 somente após esses critérios.

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
**Subfase / objetivo atual:** concluir a revisão de UX/autorização com funções acumuláveis e depois finalizar os testes reais da Fase 1.  
**Estado real da main:** `3dc50afd3ba902d36ebe806176ad0939d71c9379`; main continua sem as mudanças desta subfase.  
**Branch atual:** `feat/central-docs-phase1-oauth-validation`.  
**PR atual:** ainda não criado para esta subfase.  
**Última ação concluída:** implementado modelo `auth_user_additional_roles`, função acumulável `documentos`, gestão em `/admin/usuarios/`, remoção do bloco gigante `Acessos à Central` e documentação correspondente.  
**Validação externa concluída:** OAuth real conectado; Portal mostrou `Drive conectado` e carregou a raiz do Meu Drive.  
**Checks e testes:** testes automatizados foram ampliados, mas ainda precisam rodar no PR desta subfase.  
**Decisões tomadas:** perfil principal permanece único; funções adicionais podem acumular; `documentos` concede leitura da Central; gestão de usuários fica fora da tela operacional; capabilities finas permanecem no backend.  
**Justificativas:** reduzir drasticamente o espaço ocupado na Central e permitir combinações como Médico + Central de Documentos sem trocar o perfil profissional.  
**Alternativas descartadas:** continuar com uma checkbox para cada usuário dentro de `/documentos/`; transformar `documentos` em novo perfil primário mutuamente exclusivo; conceder acesso apenas escondendo/exibindo UI.  
**Pendências:** abrir PR/checks; validar produção após merge; testar pesquisa real; abrir PDF real; auditar PostHog; futura Drive Activity API permanece registrada para outra fase.  
**Riscos conhecidos:** compatibilidade com acessos legados em `auth_document_access`; escopo OAuth restrito em modo Testing; PDF grande ainda é carregado integralmente nesta fase.  
**Próxima ação exata:** abrir PR da branch atual, acompanhar checks e corrigir qualquer regressão antes de merge.  
**Arquivos principais:** `worker/additional-roles.js`, `worker/document-access.js`, `worker/auth-management-flex.js`, `admin/usuarios/index.html`, `js/admin-users.js`, `documentos/index.html`, `js/documents.js`, `docs/CENTRAL-DOCUMENTOS-FASE-1.md`, este status.
