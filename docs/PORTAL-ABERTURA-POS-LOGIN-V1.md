# Portal — Abertura pós-login V1

Data da decisão: 17/09/2026  
Escopo: mudança transversal de experiência do Portal, sem alterar o escopo funcional da Fase 4 da Central de Documentos.

## Decisão aprovada

O vídeo anexado pelo usuário em 17/09/2026 é o **vídeo oficial de abertura pós-login do Portal**.

Requisitos aprovados:

- reproduzir os aproximadamente **10 segundos completos** do vídeo;
- manter **som**;
- ocupar a tela inteira no lugar do círculo de carregamento após o login;
- manter o loader legado como fallback;
- manter o carregamento real do Portal em paralelo, por baixo da abertura;
- aproveitar os ~10 s como **janela de aquecimento** para autenticação, Home, assets e rotas autorizadas que já são pré-carregadas pelo Portal, sem prolongar artificialmente a abertura além do vídeo;
- armazenar a mídia localmente após a primeira reprodução bem-sucedida;
- fazer uma transição suave ao terminar;
- nenhuma abertura pode ser declarada concluída antes do evento real `ended` do vídeo.

## Arquivo oficial

Destino versionado no Portal:

`/assets/portal-opening-v1.mp4`

Características do arquivo recebido:

- container: MP4;
- vídeo: H.264;
- áudio: AAC;
- resolução: 1280 × 720;
- 24 fps;
- duração medida: 10,005 s;
- tamanho: 2.393.970 bytes;
- SHA-256 do arquivo recebido: `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

O binário foi incorporado à branch `feat/post-login-opening-video` no commit `2ba3533c3e14606e0ba7a2c285bfec142de30aaf`, com blob Git `6ab3032978f4a7e8c667e72edd691c5e4d3decc8` e tamanho de 2.393.970 bytes. A suíte do PR valida também o SHA-256 acima diretamente sobre o arquivo versionado, impedindo substituição silenciosa por outro binário.

## Fluxo de execução

1. A Home reconhece que a navegação veio da rota `/login/`.
2. Antes de exibir o loader tradicional, a superfície normal do Portal é ocultada para evitar um flash do spinner.
3. A abertura é montada como camada `fixed` em tela inteira, com `object-fit: cover`.
4. O Portal continua autenticando, aquecendo rotas permitidas e carregando a Home normalmente por baixo da abertura.
5. Se a Home terminar primeiro, ela fica pronta em segundo plano e só aparece quando o vídeo terminar.
6. Se o vídeo terminar primeiro, a camada some e o loader tradicional continua visível até a Home terminar.
7. Se o vídeo falhar, a camada é removida e o loader tradicional volta a assumir imediatamente a experiência.

A duração de aproximadamente 10 s foi mantida deliberadamente: além da identidade visual, ela oferece uma janela útil para o aquecimento já existente do Portal. Isso não transforma o vídeo em espera artificial; o sistema continua trabalhando em paralelo e não adiciona atraso extra depois do evento `ended`.

## Som e política dos navegadores

A reprodução deve ser tentada **com áudio ativo**, sem fallback silencioso para `muted`.

Navegadores podem bloquear autoplay com som por política própria. Quando `video.play()` retornar `NotAllowedError`, a abertura permanece em tela inteira e exibe o botão **“Iniciar abertura com som”**. Um clique do usuário inicia o mesmo vídeo com áudio.

Não converter automaticamente para reprodução muda apenas para contornar a política do navegador, porque isso contrariaria a decisão funcional aprovada.

## Cache local

A implementação utiliza Cache Storage com nome versionado `portal-opening-media-v1`.

Comportamento:

- primeira execução: o vídeo pode vir da rede/HTTP cache;
- após reprodução concluída: é feita tentativa de persistir a resposta completa no Cache Storage;
- execuções seguintes: uma cópia válida no Cache Storage é convertida em Blob local e reproduzida sem depender novamente da rede;
- cache corrompido: é removido e ocorre uma única nova tentativa pela rede;
- falha de Cache Storage, quota ou indisponibilidade: nunca bloqueia o Portal;
- futuras versões devem alterar URL e nome lógico de cache para evitar conteúdo antigo apresentado como atual.

### Correção de CSP para o cache

Durante a revisão do fluxo de segunda execução foi identificado um ponto de segurança/compatibilidade: o vídeo recuperado do Cache Storage é convertido em uma URL `blob:`. A CSP anterior da Home não declarava `media-src`, portanto `default-src 'self'` poderia bloquear a reprodução desse Blob e forçar a abertura a voltar para a rede.

Correção aplicada:

- a Home passa a declarar `media-src 'self' blob:`;
- a política continua restrita a mídia same-origin e Blob local criado pelo próprio Portal;
- o teste de contrato exige essa diretiva e exige também `URL.createObjectURL(blob)` no caminho de cache;
- nenhuma origem externa de mídia foi liberada.

Justificativa: sem essa diretiva o cache poderia existir, mas a segunda reprodução não seria realmente utilizável sob a própria CSP do Portal.

## Pré-carregamento durante a abertura

O Portal já possui `PortalPerformance.warmForUser()`, chamado no fluxo de autenticação, que aquece imediatamente a Home, Ferramentas e demais rotas autorizadas conforme o perfil. O Service Worker pré-carrega a página e seus assets estáticos de forma controlada.

A abertura de 10 s passa a ser tratada como uma **janela útil para esse trabalho em segundo plano**, não como substituta do mecanismo de performance. Não foi adotado um novo carregador paralelo independente, porque duplicaria requisições e estado; a decisão é reutilizar o aquecimento existente e manter a abertura desacoplada da conclusão dessas requisições.

Em conexões restritas/Save-Data, as regras existentes de contenção de pré-carregamento continuam prevalecendo.

## Laboratório sintético de navegador

Para não depender de dados reais nem da autenticação institucional durante a validação visual, foi criado um laboratório isolado em `testing/post-login-opening/`.

Esse laboratório:

- usa o **mesmo `js/home.js`** da implementação real;
- usa o **mesmo MP4 oficial** versionado;
- simula somente uma sessão fictícia e mantém o loader legado ativo em segundo plano;
- não carrega Google Drive, Worker de produção, D1, dados clínicos, usuários reais ou segredos;
- é incluído no bundle sintético de staging em `/opening/`;
- possui CSP com `media-src 'self' blob:` igual ao requisito da Home;
- recebe validação Playwright própria em Chromium desktop e mobile.

A suíte de navegador cobre: duração real do MP4 próxima de 10,005 s, tela cheia, áudio não mutado, cache persistido e reutilizado sem rede, gesto explícito quando autoplay é bloqueado e retorno ao loader legado quando a mídia falha.

## Fallback e antirregressão

O elemento `#homeLoading` e `.home-loading-spinner` permanecem no código. Eles não são removidos porque são a proteção para falha de mídia e para o caso em que o vídeo termina antes de a Home estar pronta.

A preparação inicial possui proteção temporal para não deixar a Home invisível caso o JavaScript da abertura não inicialize.

## Privacidade e observabilidade

A abertura não envia ao PostHog nome de usuário, rota clínica, documento, arquivo, ID do Drive ou qualquer conteúdo sensível. Nenhuma nova telemetria de usuário é necessária para esta V1.

## Relação com a Central de Documentos

A fase oficial em andamento continua sendo **Fase 4 — Sincronização segura com Drive**, subfase 4D, no PR #201 e branch `codex/central-docs-drive-sync-phase4`.

Esta mudança de abertura é uma melhoria transversal do Portal em branch própria e **não conclui, reabre nem modifica os critérios de aceite da Fase 4**.

## Critérios de aceite desta mudança transversal

- binário oficial presente em `/assets/portal-opening-v1.mp4` com SHA-256 correspondente ao arquivo aprovado;
- tela cheia em desktop e mobile;
- áudio presente e audível quando permitido pelo navegador;
- botão de gesto explícito quando autoplay com som for bloqueado;
- reprodução termina pelo evento real `ended`, preservando os ~10 s completos;
- transição suave ao término;
- loader antigo continua funcionando em falha de mídia e enquanto a Home ainda estiver carregando;
- cache local é populado após a primeira execução e reaproveitado em uma segunda autenticação;
- CSP permite somente mídia same-origin e Blob local necessário à reprodução cacheada;
- aquecimento do Portal continua em paralelo, sem aguardar artificialmente além do vídeo;
- testes de contrato + Playwright desktop/mobile e checks do PR verdes;
- validação visual e sonora humana no preview `/opening/` antes do merge.
