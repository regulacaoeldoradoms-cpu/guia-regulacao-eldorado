# Central de Documentos — Status

Última atualização: 11/09/2026

## Fase atual

**Fase 3 — Editor PDF essencial**

Subfase atual: corrigir regressão de sessão no auto-gerenciamento do Desenvolvedor e então concluir a validação real da capability `edit` da Fase 3.

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

## Encerramento formal da Fase 2 — 12/09/2026

Validação real do cache criptografado após reaberturas em produção:

- `pdf_ready` hit: 7 eventos; média 107 ms; mediana 90 ms; p95 167,5 ms;
- `pdf_ready` miss: 9 eventos; média 5.461,3 ms (~5,46 s); mediana 5.177 ms; p95 6.878,2 ms;
- `pdf_first_page_visible` hit: 7 eventos; média 127,6 ms; mediana 110 ms; p95 193 ms;
- `pdf_first_page_visible` miss: 7 eventos; média 5.506,7 ms (~5,51 s); mediana 5.212 ms; p95 7.026,6 ms.

Ganho:
- `pdf_ready`: redução média de ~98,0%, cerca de 51x;
- primeira página: redução média de ~97,7%, cerca de 43x.

O PostHog mostrou eventos reais `cache_state=hit` com `source=cache` e eventos `miss` com `source=drive`. A telemetria continuou sem nomes de arquivos, IDs do Drive, paciente, CPF, CNS, CID ou conteúdo de PDF.

Conclusão: **Fase 2 encerrada**. O critério do Guia Mestre foi cumprido: métricas confiáveis, cache/pré-carregamento funcionando e reabertura sem espera desnecessária. A próxima fase é **Fase 3 — Editor PDF essencial**.

## Validação real da Fase 2A e decisão de cache — 12/09/2026

Teste real após o PR #140:
- PDF abriu em produção, mas a experiência continuou perceptivelmente lenta;
- PostHog nas últimas duas horas registrou 2 `pdf_open_started` e 2 `pdf_ready`;
- a abertura mais recente apresentou `pdf_ready.duration_ms` de aproximadamente **5.914 ms (~5,9 s)**; a abertura anterior havia ficado em aproximadamente **4.830 ms (~4,8 s)**;
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

## Bloqueio encontrado na concessão do editor — 12/09/2026

Durante a tentativa real de habilitar **Permitir editor de PDF** na própria conta Desenvolvedor/Regulador(a), a interface exibiu incorretamente:

`Somente o Desenvolvedor pode conceder funções adicionais.`

Diagnóstico:
- a tela considerava a sessão como Desenvolvedor a partir do usuário em cache;
- ao salvar alterações da própria conta, `updateManagedUser` sempre incrementava `session_version`, mesmo quando papel e estado ativo não mudavam;
- isso invalidava imediatamente o token da própria sessão;
- a operação seguinte de capability documental ocorria com token já invalidado;
- em uma nova tentativa, `auth-management-flex` recebia ator nulo e devolvia a mensagem de permissão de Desenvolvedor, mascarando o problema real de sessão expirada.

Correção implementada na branch `fix/developer-self-edit-session`:
- edição da própria conta preserva a sessão quando apenas dados não críticos mudam;
- mudança do próprio papel ou estado ativo continua incrementando `session_version` por segurança;
- alterações em contas de terceiros continuam invalidando as sessões do alvo como antes;
- sessão inválida agora retorna 401 com mensagem explícita de sessão expirada, em vez de falsa mensagem de falta de papel;
- `/admin/usuarios/` força revalidação da sessão antes de permitir gestão;
- versão de `admin-users.js` avançou para evitar cache do cliente antigo;
- teste de regressão cobre exatamente o fluxo: salvar a própria conta Desenvolvedor + conceder capability `edit` na segunda requisição com o mesmo token.

Impacto observado:
- a tentativa anterior pode ter deixado a sessão atual do navegador já invalidada. Após o deploy da correção, será necessário entrar novamente **uma vez** se essa sessão antiga continuar aberta.

## Aprovação explícita de edição — 12/09/2026

O usuário aprovou explicitamente **“Permitir editor de PDF”** para a conta Regulador(a) usada nos testes da Central.

Estado técnico:
- o PR #146 já foi mesclado na main em `b3665ed9`;
- a UI administrativa agora possui o controle separado `Permitir editor de PDF`;
- a capability `edit` continua opt-in e não é herdada automaticamente de Regulador(a);
- a concessão ainda depende de uma ação autenticada no Portal em `/admin/usuarios/`, pois esta conversa não possui uma sessão administrativa do Portal para executar a alteração diretamente.

A aprovação está registrada e não precisa ser solicitada novamente. A próxima ação humana é somente efetivar o checkbox na conta de teste autorizada após o deploy.

## Fase 3 — implementação em andamento

Unidades 3A/3B implementadas na branch:
- `docs/CENTRAL-DOCUMENTOS-FASE-3.md` criado com escopo e critérios;
- núcleo `js/document-editor.js` com plano de páginas, histórico de até 50 snapshots, undo/redo e geração de Blob PDF;
- excluir página com trava para impedir resultado sem páginas;
- mover página para cima/baixo;
- unir outro PDF permitido à sessão local;
- visualização do resultado editado no iframe existente;
- sair do editor descarta prévia e restaura o documento original;
- clicar em outro PDF enquanto o editor está ativo oferece união ao resultado atual;
- o editor não possui rota de escrita/salvamento no Drive;
- `pdf_edit_completed` registra apenas operação, duração, faixa de tamanho e rota genérica;
- capability `edit` passa a ser administrável explicitamente em **Usuários e acessos**;
- marcar Regulador(a) **não** concede edição automaticamente;
- remover Regulador(a) revoga `view/extract/edit` explícitos associados à Central, evitando acesso residual;
- `pdf-lib 1.17.1` é carregado somente ao iniciar o editor, com URL versionada, SRI, crossorigin anônimo e no-referrer;
- CSP da Central permite somente o host fixo do jsDelivr para esse script;
- testes unitários do plano do editor foram adicionados com motor PDF simulado, incluindo exclusão, reordenação, undo/redo, união e verificação do cabeçalho `%PDF`.

Decisões:
- editor continua estritamente local na Fase 3;
- capability de edição é fina e separada do cargo Regulador(a), pois concedê-la automaticamente ampliaria permissão sem decisão individual;
- biblioteca externa não foi necessária na Fase 2 e por isso foi descartada lá; na Fase 3 a decisão foi reavaliada por necessidade de manipulação binária, mantendo versão fixa + SRI;
- falha da biblioteca afeta somente o editor; visualização/cache da Fase 2 permanecem disponíveis;
- a união usa PDFs já autorizados pela mesma navegação do Drive; nenhum seletor externo é introduzido;
- após undo de uma união, a presença do PDF é derivada do plano atual, evitando bloquear nova união por estado residual.

Alternativas descartadas:
- habilitar editor para todo Regulador(a) automaticamente;
- criar endpoints de save/upload antecipando a Fase 4;
- enviar PDF ao Worker/terceiro apenas para excluir/reordenar páginas;
- manter nome/fileId/número exato de página na telemetria;
- remover o fallback/read-only da Fase 2.

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

1. abrir PR da correção `fix/developer-self-edit-session`;
2. rodar suíte completa e validar o teste de regressão;
3. mesclar somente com checks aprovados;
4. após deploy, recarregar `/admin/usuarios/`; se a sessão antiga estiver invalidada, entrar novamente uma vez;
5. editar a própria conta, manter Regulador(a), marcar **Permitir editor de PDF** e salvar;
6. confirmar que a capability `edit` foi concedida sem derrubar a sessão;
7. retomar a validação real da Fase 3: excluir/reordenar/undo/redo/unir/prévia.

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

**Fase atual:** Fase 3 — Editor PDF essencial.  
**Subfase / objetivo atual:** corrigir regressão de sessão que bloqueava a concessão real da capability `edit` na própria conta Desenvolvedor.  
**Estado real da main antes da correção:** `b5ad566e1d27bc81230ac3e36054422b0ba1cf13`.  
**Branch atual:** `fix/developer-self-edit-session`.  
**PR atual:** ainda não aberto neste registro.  
**Bug reproduzido:** salvar a própria conta em Usuários e acessos invalidava o token porque `session_version` sempre era incrementado; a tentativa seguinte exibia falsamente “Somente o Desenvolvedor pode conceder funções adicionais”.  
**Correção:** preservar sessão em autoedição quando papel/ativo não mudam; manter invalidação em mudanças críticas e alvos terceiros; 401 explícito para sessão inválida; revalidação imediata na página admin; cache-bust do JS.  
**Teste de regressão:** Desenvolvedor edita própria conta + função Regulador(a) e, com o mesmo token, concede `edit=true`; mudança do próprio papel continua invalidando a sessão.  
**Pendências:** abrir PR, checks, merge/deploy; usuário pode precisar relogar uma vez por causa da sessão antiga já invalidada; depois conceder `edit` e testar o editor real.  
**Próxima ação exata:** abrir PR da correção, acompanhar checks e corrigir qualquer falha antes de merge.  
**Arquivos principais:** `worker/auth-management-v2.js`, `worker/auth-management-flex.js`, `worker/tests/developer-self-edit-session.test.mjs`, `js/admin-users.js`, `admin/usuarios/index.html`, `docs/CENTRAL-DOCUMENTOS-STATUS.md`.
