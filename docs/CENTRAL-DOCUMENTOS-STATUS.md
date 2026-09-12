# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 2 — Visualização de alta performance**

Subfase atual: iniciar a Fase 2 com visualização progressiva de PDF, medição confiável da primeira página e redução do tempo percebido sem persistir conteúdo clínico.

## Estado de entrada

- Branch da Fase 1 criada da `main` pós-Fase 0 em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A main já contém a observabilidade segura do PostHog para o Portal.
- No estado de entrada da Fase 1 ainda não existia integração Google Drive funcional; ela passou a ser implementada nesta branch.
- O arquivo de status foi criado na Fase 0 e agora é o ponto obrigatório de continuidade.
- Há PR antigo de Telemedicina aberto (#107), sem relação com a Central; não deve ser misturado a este trabalho.
- PR #133 da Fase 0 foi validado com 21 workflows sem falhas e mesclado na main em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A arquitetura da Fase 0 está encerrada. O código read-only da Fase 1 foi validado e mesclado na `main` pelo PR #134 em `3dc50afd3ba902d36ebe806176ad0939d71c9379`.

## Branch / PR

Branch atual: nenhuma após a consolidação do status; a próxima mudança funcional deve abrir nova branch a partir da `main`.

PR atual: nenhum após a consolidação; PR #136 foi funcional e PR #137 apenas registra o status pós-merge.

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

21. A nomenclatura institucional aprovada para a função adicional `documentos` é **Regulador(a)**; o nome **Central de Documentos** fica reservado à ferramenta.
22. O perfil `medico` passa a ser exibido como **Médico(a)** nas superfícies do Portal, preservando o identificador técnico `medico` e todas as permissões existentes.
23. Nomes futuros de cargos, perfis e funções institucionais devem ser confirmados pelo usuário antes de serem adotados como nomenclatura oficial.


15. O acesso operacional à Central deixa de ser administrado por uma lista enorme dentro de `/documentos/`.
16. O Portal passa a suportar **funções adicionais acumuláveis** sem substituir o perfil principal.
17. A primeira função adicional é `documentos` — **Regulador(a)** — e concede acesso à Central de Documentos e leitura do Drive institucional.
18. A gestão dessa função fica em `/admin/usuarios/`; exemplo válido: **Médico(a) + Regulador(a)**.
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
- O modelo anterior de um único perfil principal não atendia ao requisito novo de acumular funções. Foi criada uma camada adicional, sem quebrar os perfis existentes, para permitir combinações como Médico(a) + Regulador(a).
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
- Fase 1 encerrada: pesquisa global, abertura de PDF e telemetria documental foram comprovadas em produção sem propriedades sensíveis observadas.
- A alteração de UX/cargos acumuláveis desta subfase ainda precisa passar por PR/checks antes de ir para a main.

## Riscos conhecidos

- refresh token de OAuth externo em status Testing expira em prazo curto segundo Google; não usar Testing como solução de produção;
- escopo `drive` é restrito e exige processo de conformidade apropriado;
- nomes de arquivos podem conter dados identificáveis, portanto não entram em PostHog/logs;
- cache persistente ou service worker mal configurado poderia reter documento clínico; explicitamente proibido;
- escrita concorrente futura pode sobrescrever versão externa se a comparação de `version` for omitida.

## Encerramento formal da Fase 1 — 11/09/2026

Critério do Guia Mestre: usuário autorizado consegue encontrar e abrir qualquer PDF permitido da conta sem sair do Portal.

Evidências reais:
- OAuth institucional conectado;
- navegação por Meu Drive e subpastas comprovada;
- pesquisa global comprovada pelo usuário em produção;
- abertura de PDF real autorizada comprovada dentro do Portal;
- PostHog confirmou 1 evento `drive_search_completed`, 1 `pdf_open_started` e 1 `pdf_ready` após os testes;
- propriedades observadas ficaram limitadas a metadados técnicos allowlisted: rota genérica, duração, origem, faixa de quantidade/tamanho, cache state, versão de observabilidade e propriedades técnicas do próprio PostHog;
- não foram observados nome de arquivo, fileId, nome de paciente, CPF, CNS, CID, conteúdo clínico ou conteúdo do PDF.

Conclusão: **Fase 1 encerrada**. A ausência inicial dos três eventos era atraso de ingestão/indexação, não falha funcional do pipeline. Não foi necessária correção de código para esse ponto.

Próxima fase autorizada pelo Guia Mestre: **Fase 2 — Visualização de alta performance**.

## Validação real de PDF — 11/09/2026

- Abertura de PDF real autorizada foi confirmada visualmente em produção dentro de `/documentos/`.
- O visualizador exibiu múltiplas páginas no navegador e permaneceu em modo somente leitura.
- Nenhuma escrita no Drive foi necessária para a validação.
- Imediatamente após o teste, o schema do PostHog ainda não apresentava `pdf_open_started` nem `pdf_ready`. Isso não invalida a abertura funcional do PDF, mas mantém a telemetria documental como pendência de validação.
- Não registrar nome de arquivo, conteúdo do PDF ou qualquer dado identificável no status, logs ou telemetria.

## Auditoria real de observabilidade — 11/09/2026

Consulta direta ao projeto PostHog confirmou tráfego real da Central e do Portal nas últimas 24 horas:

- `drive_folder_opened`: 12 eventos;
- `portal_page_ready`: 32 eventos;
- `portal_web_vital`: 108 eventos.

Propriedades reais observadas em `drive_folder_opened`: `duration_ms`, `cache_state`, `portal_observability_version`, `route`, `source`, `$geoip_disable` e propriedades virtuais de classificação de bot do próprio PostHog. Não foram observados nome de arquivo, fileId do Drive, nome de paciente, CPF, CNS, CID, conteúdo clínico ou conteúdo de PDF.

Propriedades reais observadas em `portal_page_ready`: `duration_ms`, `route`, `connection`, `navigation_type`, `portal_observability_version` e propriedades técnicas virtuais do PostHog.

Propriedades reais observadas em `portal_web_vital`: `value`, `metric`, `route`, `portal_observability_version` e propriedades técnicas virtuais do PostHog.

O schema real ainda não apresenta `drive_search_completed`, `pdf_open_started` nem `pdf_ready`. Isso é evidência de que pesquisa e abertura de PDF ainda não foram comprovadas em uso real nesta validação; esses dois testes continuam obrigatórios para encerrar a Fase 1.

## Métricas / observabilidade

A observabilidade-base já está operacional. A Fase 1 passa a emitir apenas `drive_folder_opened`, `drive_search_completed`, `pdf_open_started` e `pdf_ready` quando houver uso real.

`pdf_first_page_visible` não será emitido nesta fase porque o iframe nativo não oferece medição confiável da primeira página; isso fica para a Fase 2.

Nenhum conteúdo real de Drive foi enviado ao PostHog até este registro.

## Próximo passo

1. mesclar o PR #139 com o encerramento formal da Fase 1;
2. criar branch isolada da **Fase 2 — Visualização de alta performance**;
3. documentar o desenho técnico da visualização progressiva;
4. substituir gradualmente o iframe/Blob integral por renderização progressiva com primeira página priorizada;
5. emitir `pdf_first_page_visible` de forma confiável;
6. medir antes/depois no PostHog sem nomes, IDs ou conteúdo documental;
7. encerrar a Fase 2 somente quando o critério do Guia Mestre estiver comprovado.

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

**Fase atual:** Fase 2 — Visualização de alta performance.  
**Subfase / objetivo atual:** iniciar visualização progressiva de PDF, priorizar primeira página e tornar `pdf_first_page_visible` confiável.  
**Estado real da main:** `866d981a3ca060e1f01064dc751a22d88aec0592` — PR #136 mesclado com as nomenclaturas Regulador(a) e Médico(a).  
**Branch atual:** nenhuma após o merge do PR #137; abrir nova branch somente para a próxima unidade de trabalho.  
**PR atual:** nenhum após o merge do PR #137. PR #136 concluiu a nomenclatura; PR #137 consolidou somente este status.  
**Última ação concluída:** Fase 1 validada em produção: navegação, pesquisa e abertura de PDF funcionaram; PostHog confirmou `drive_search_completed`, `pdf_open_started` e `pdf_ready` com propriedades técnicas permitidas.  
**Validação externa concluída:** OAuth real conectado; Meu Drive, pesquisa global e PDF real validados dentro do Portal.  
**Checks e testes:** 23 workflows do PR #136 concluídos sem falhas; o PR #137 de status também deve ser mesclado somente com checks aprovados.  
**Decisões tomadas:** perfil principal permanece único; funções adicionais podem acumular; `documentos` é exibido como `Regulador(a)` e concede leitura da Central; gestão de usuários fica fora da tela operacional; capabilities finas permanecem no backend.  
**Justificativas:** reduzir drasticamente o espaço ocupado na Central e permitir combinações como Médico(a) + Regulador(a) sem trocar o perfil profissional.  
**Alternativas descartadas:** continuar com uma checkbox para cada usuário dentro de `/documentos/`; transformar `documentos` em novo perfil primário mutuamente exclusivo; conceder acesso apenas escondendo/exibindo UI.  
**Pendências:** mesclar o encerramento da Fase 1 e iniciar a Fase 2; futura Drive Activity API permanece registrada para fase posterior.  
**Riscos conhecidos:** compatibilidade com acessos legados em `auth_document_access`; escopo OAuth restrito em modo Testing; PDF grande ainda é carregado integralmente e é o principal alvo da Fase 2.  
**Próxima ação exata:** mesclar o PR #139, criar branch da Fase 2 a partir da main resultante e implementar a primeira unidade de visualização progressiva com medição real de primeira página.  
**Arquivos principais:** `worker/additional-roles.js`, `worker/document-access.js`, `worker/auth-management-flex.js`, `admin/usuarios/index.html`, `js/admin-users.js`, `documentos/index.html`, `js/documents.js`, `docs/CENTRAL-DOCUMENTOS-FASE-1.md`, este status.
