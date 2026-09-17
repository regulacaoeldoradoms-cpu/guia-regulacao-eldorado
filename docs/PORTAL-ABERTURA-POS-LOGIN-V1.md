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

Esse hash é a referência para confirmar que o binário incorporado ao repositório é exatamente o vídeo aprovado, sem troca silenciosa de conteúdo.

## Fluxo de execução

1. A Home reconhece que a navegação veio da rota `/login/`.
2. Antes de exibir o loader tradicional, a superfície normal do Portal é ocultada para evitar um flash do spinner.
3. A abertura é montada como camada `fixed` em tela inteira, com `object-fit: cover`.
4. O Portal continua autenticando e carregando a Home normalmente por baixo da abertura.
5. Se a Home terminar primeiro, ela fica pronta em segundo plano e só aparece quando o vídeo terminar.
6. Se o vídeo terminar primeiro, a camada some e o loader tradicional continua visível até a Home terminar.
7. Se o vídeo falhar, a camada é removida e o loader tradicional volta a assumir imediatamente a experiência.

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
- testes automatizados relevantes e checks do PR verdes;
- validação visual e sonora humana em preview antes do merge.
