# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 2 — Visualização de alta performance**

Subfase atual: unidade 2B — reduzir a latência real com cache local criptografado, pré-aquecimento e invalidação por versão, mantendo `pdf_first_page_visible` confiável.

## Estado de entrada

- Branch da Fase 1 criada da `main` pós-Fase 0 em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A main já contém a observabilidade segura do PostHog para o Portal.
- No estado de entrada da Fase 1 ainda não existia integração Google Drive funcional; ela passou a ser implementada nesta branch.
- O arquivo de status foi criado na Fase 0 e agora é o ponto obrigatório de continuidade.
- Há PR antigo de Telemedicina aberto (#107), sem relação com a Central; não deve ser misturado a este trabalho.
- PR #133 da Fase 0 foi validado com 21 workflows sem falhas e mesclado na main em `686b5774dfd51916b21b63d66fd8b4ff7a822795`.
- A arquitetura da Fase 0 está encerrada. O código read-only da Fase 1 foi validado e mesclado na `main` pelo PR #134 em `3dc50afd3ba902d36ebe806176ad0939d71c9379`.

## Branch / PR

Branch atual: `docs/central-docs-phase2b-postmerge` (somente consolidação pós-merge).

PR atual: nenhum funcional aberto; PR #142 foi validado e mesclado.

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

## Validação real da Fase 2A e decisão de cache — 12/09/2026

Teste real após o PR #140:
- PDF abriu em produção, mas a experiência continuou perceptivelmente lenta;
- PostHog nas últimas duas horas registrou 2 `pdf_open_started` e 2 `pdf_ready`;
- a abertura mais recente apresentou `pdf_ready.duration_ms` de aproximadamente **5.914 ms**; a abertura anterior havia ficado em aproximadamente **4.830 ms**;
- `pdf_first_page_visible` permaneceu em **0** nessa validação;
- o valor real de `pdf_ready.cache_state` observado foi `miss`.

Conclusão: stream progressivo isolado não entregou o ganho esperado no navegador testado. A Fase 2 permanece aberta.

Nova decisão aprovada pelo usuário:
- PDFs podem ser mantidos em cache local para acelerar o fluxo;
- a proteção por cargo continua obrigatória, porém não é usada como única proteção dos bytes persistidos;
- para preservar privacidade mesmo em disco local, o cache aprovado será IndexedDB **criptografado** e segregado pela sessão;
- cache em texto puro no Service Worker/Cache Storage continua proibido.

Unidade 2B implementada na branch:
- Worker devolve `cacheKey` estável e opaco por HMAC, sem expor fileId;
- `js/document-cache.js` cifra bytes com AES-GCM e chave derivada via HKDF da sessão atual;
- cache usa `version` do Drive para invalidar conteúdo antigo;
- TTL inicial 12 h, limite total 256 MB, limite por PDF 50 MB;
- pré-aquecimento automático até 12 MB para os primeiros PDFs prováveis;
- hover/foco em PDF também inicia aquecimento;
- uma abertura reutiliza aquecimento já em curso por até 350 ms antes de cair para rede;
- logout e desconexão do Drive solicitam limpeza;
- mudança de fingerprint de sessão limpa o cache anterior;
- `pdf_ready`/`pdf_first_page_visible` passam a distinguir `cache_state=hit|miss` sem identificadores.

## Fase 2 — implementação em andamento

Unidade 2A implementada na branch:
- documento `docs/CENTRAL-DOCUMENTOS-FASE-2.md` criado;
- Service Worker ganhou rota virtual efêmera `/__portal_document_pdf/<viewId>`;
- a página registra referência opaca + sessão apenas em memória do Service Worker, com TTL curto e heartbeat;
- requisições `Range` do visualizador são encaminhadas ao endpoint documental protegido;
- respostas continuam `no-store` e não entram em Cache Storage;
- endpoint virtual não contém fileId, nome de arquivo ou token;
- modo progressivo usa iframe nativo diretamente sobre o stream;
- fallback Blob integral da Fase 1 permanece automático;
- `pdf_first_page_visible` passa a ser emitido somente no modo progressivo após `load` + confirmação de área visível;
- testes estáticos e de privacidade foram ampliados;
- cache do Service Worker avançou para V11.

Decisões desta unidade:
- não usar CDN de terceiros/PDF.js remoto em página clínica;
- não colocar token de sessão ou ticket bearer na URL do PDF, evitando exposição em histórico/logs;
- não persistir sessão/referência em IndexedDB/Cache Storage;
- usar memória efêmera do Service Worker e reidratação por heartbeat;
- manter fallback Blob para compatibilidade e rollback funcional.

Alternativas descartadas:
- biblioteca PDF remota via CDN, por ampliar superfície de supply chain em tela com documentos sensíveis;
- URL temporária com credencial no path/query, por risco de registro em logs/histórico;
- cache persistente do PDF para acelerar reaberturas;
- considerar o `load` do Blob integral como `pdf_first_page_visible`, pois isso não mede primeira página com confiabilidade.

## Riscos conhecidos

- refresh token de OAuth externo em status Testing expira em prazo curto segundo Google; não usar Testing como solução de produção;
- escopo `drive` é restrito e exige processo de conformidade apropriado;
- nomes de arquivos podem conter dados identificáveis, portanto não entram em PostHog/logs;
- cache persistente ou service worker mal configurado poderia reter documento clínico; explicitamente proibido;
- o registro progressivo do Service Worker é volátil e pode desaparecer se o processo reiniciar; heartbeat de 5 s e fallback Blob mitigam esse risco;
- o comportamento do visualizador PDF nativo com Range varia entre navegadores; o teste real da Fase 2A mostrou latência de ~5,9 s e ausência de `pdf_first_page_visible`, motivando a unidade 2B;
- cache local cifrado pode consumir armazenamento do navegador; limites de 256 MB/50 MB, TTL de 12 h e LRU mitigam o risco;
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

1. PR #142 validado com 23 workflows e mesclado em `f75b5725`;
2. aguardar deploy da main e atualização do Service Worker/cache estático V12;
3. recarregar a Central com Ctrl+F5;
4. aguardar alguns segundos na pasta para o pré-aquecimento;
5. abrir um PDF, fechar e abrir o mesmo novamente;
6. confirmar no PostHog diferença entre `cache_state=miss` e `cache_state=hit` em `pdf_ready`/`pdf_first_page_visible`;
7. manter a Fase 2 aberta até o ganho de cache hit ser comprovado.

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
**Subfase / objetivo atual:** unidade 2B — cache local criptografado + pré-aquecimento para reduzir `pdf_ready` e tornar `pdf_first_page_visible` mensurável.  
**Estado real da main:** `f75b5725cc447cde66cbceb9eb2ea79a72b981bd` — PR #142 mesclado com a unidade 2B de cache criptografado.  
**Branch atual:** `docs/central-docs-phase2b-postmerge` (status pós-merge; nenhuma mudança funcional adicional).  
**PR atual:** nenhum funcional; PR #142 foi concluído.  
**Última validação real:** PDF abriu, porém lento; PostHog mostrou abertura anterior ~4.830 ms e mais recente ~5.914 ms em `pdf_ready`, ambos cache miss; `pdf_first_page_visible` ainda 0.  
**Decisão aprovada:** permitir cache persistente de PDFs, mas implementá-lo cifrado e segregado pela sessão; cargo/capability continua obrigatório, porém não é a única barreira para bytes em disco.  
**Implementação concluída:** PR #142 validado com 23 workflows sem falhas e mesclado; chave opaca HMAC por arquivo; IndexedDB cifrado AES-GCM/HKDF; TTL 12 h; 256 MB totais; 50 MB por PDF; prefetch até 12 MB; aquecimento por lista/hover; invalidação por `version`; limpeza por logout/desconexão/troca de sessão; cache hit/miss na telemetria allowlisted.  
**Justificativa:** o stream progressivo sozinho não reduziu a espera no navegador real; o Guia Mestre autoriza cache e pré-carregamento na Fase 2.  
**Alternativas descartadas:** PDF clínico em texto puro no Cache Storage; CDN/edge cache compartilhado; fileId como chave de cache; cache ilimitado; confiar apenas na UI/cargo para proteger bytes locais.  
**Pendências:** aguardar deploy da main; validar cache hit real em produção; comparar tempos; confirmar `pdf_first_page_visible`; futura Drive Activity API permanece registrada.  
**Riscos conhecidos:** armazenamento local limitado; cache de outra sessão; documento desatualizado; todos mitigados por criptografia ligada à sessão, fingerprint, TTL/LRU e `version` do Drive.  
**Próxima ação exata:** após o deploy da main `f75b5725`, recarregar `/documentos/` com atualização completa; aguardar alguns segundos para o prefetch, abrir um PDF, fechá-lo e abrir o mesmo PDF novamente. Em seguida comparar `pdf_ready` e `pdf_first_page_visible` entre miss/hit no PostHog.  
**Arquivos principais:** `worker/document-drive.js`, `js/document-cache.js`, `js/documents.js`, `documentos/index.html`, `portal-sw.js`, `docs/CENTRAL-DOCUMENTOS-FASE-2.md`, `docs/CENTRAL-DOCUMENTOS-STATUS.md`.
