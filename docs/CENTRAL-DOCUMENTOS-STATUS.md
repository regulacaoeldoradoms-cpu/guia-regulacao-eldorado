# Central de Documentos — Status

Última atualização: 17/09/2026

> Este bloco é o estado autoritativo atual. O histórico detalhado anterior continua recuperável no Git (`main@336b647300faee2c958475a3b51b6b0522e0dd06`) e o estado técnico completo da Fase 4 em andamento está documentado no PR #201 e na própria branch `codex/central-docs-drive-sync-phase4`.

## Fase atual

**Fase 4 — Sincronização segura com Drive**

Subfase atual: **4D — homologação real iniciada; correções de conflito e proteção de fechamento em andamento**.

Branch da Fase 4: `codex/central-docs-drive-sync-phase4`  
PR da Fase 4: **#201 — aberto, sem merge**  
Head conferido: `a92bbcc40b7c38eb126dbe375c3db31272efde72`  
Base oficial `main`: `336b647300faee2c958475a3b51b6b0522e0dd06`

As Fases 1, 2 e 3 permanecem encerradas. As subfases 4A, 4B e 4C estão concluídas tecnicamente. A 4D ainda não está aprovada e o PR #201 não deve ser mesclado antes do fechamento da homologação real controlada.

## Mudança transversal em andamento — abertura pós-login em vídeo

Em 17/09/2026 o usuário aprovou uma melhoria transversal do Portal que **não altera, reabre nem conclui a Fase 4**: substituir visualmente o círculo de carregamento pós-login por um vídeo oficial em tela inteira.

Branch isolada: `feat/post-login-opening-video`  
PR: **#202 — draft, aberto, sem merge**  
Último commit funcional antes deste registro: `86dd5e0a1472cc53affbb919aec37c0dc74f088d`

Documento de decisão: `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`

### Decisão funcional aprovada

- o vídeo anexado em 17/09/2026 é o **vídeo oficial da abertura pós-login**;
- reproduzir os aproximadamente **10 segundos completos**;
- manter **som**;
- ocupar a tela inteira;
- manter o loader antigo como fallback;
- continuar carregando a Home por baixo da abertura;
- armazenar a mídia localmente após a primeira reprodução bem-sucedida;
- transição suave ao terminar;
- nenhuma reprodução muda silenciosa será usada para contornar política do navegador.

### Arquivo oficial aprovado

Destino previsto no repositório: `assets/portal-opening-v1.mp4`

Características verificadas no arquivo anexado:

- MP4 / H.264 + AAC;
- 1280 × 720;
- 24 fps;
- 10,005 s;
- 2.393.970 bytes;
- SHA-256: `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`.

O hash acima deve ser usado para impedir substituição silenciosa por outro binário.

### Implementação concluída na branch #202

- `index.html` identifica navegação proveniente de `/login/` e evita o flash inicial do spinner;
- existe proteção temporal de 5 s para que uma falha de inicialização da abertura não deixe a Home invisível;
- `js/home.js` monta a camada de vídeo em `position: fixed`, tela inteira e `object-fit: cover`;
- o carregamento normal da Home permanece executando em paralelo;
- a abertura termina pelo evento real `ended`, sem cronômetro que corte os 10 s;
- ao terminar, fade de 450 ms remove a camada;
- se a Home ainda não estiver pronta, o loader legado continua aparecendo normalmente;
- falha de mídia remove a abertura e devolve o controle ao loader legado;
- áudio é solicitado com `muted=false`, `defaultMuted=false` e volume 1;
- se o navegador bloquear autoplay com som (`NotAllowedError`), aparece o botão **“Iniciar abertura com som”**; não há fallback automático para vídeo mudo;
- Cache Storage versionado `portal-opening-media-v1` é reutilizado em execuções seguintes;
- após a primeira reprodução concluída, a resposta completa é persistida em cache quando suportado;
- cache inválido/corrompido é removido e há uma tentativa pela rede;
- falha/quota/indisponibilidade do Cache Storage nunca bloqueia o Portal;
- o antigo `#homeLoading` e `.home-loading-spinner` foram preservados;
- não foi adicionada telemetria contendo identidade, dados clínicos, documento ou Drive.

### Testes criados

Arquivo: `worker/tests/post-login-opening.test.mjs`

Cobertura de contrato adicionada para:

- detecção pós-login;
- preservação do loader antigo;
- tela cheia;
- áudio obrigatório;
- ausência de fallback silencioso para `muted=true`;
- tratamento de bloqueio de autoplay com som;
- finalização pelo evento `ended`;
- Cache Storage versionado;
- remoção de cache inválido;
- fallback em erro de mídia.

Validação local já feita fora do repositório: `node --check` do novo `home.js` aprovado. Os checks remotos do PR #202 ainda precisam ser consolidados depois que o binário oficial for incorporado.

## Bloqueio atual da abertura pós-login

O conector GitHub disponível nesta sessão grava arquivos de texto e blobs quando o conteúdo é fornecido diretamente, mas não aceita o caminho local do anexo como parâmetro de arquivo binário. O vídeo recebido está disponível localmente no chat, porém **ainda não foi incorporado fisicamente ao PR #202**.

Não foi adotada solução improvisada de base64 em JavaScript, fragmentação do vídeo em arquivos de texto, hospedagem externa ou conversão para GIF. Essas alternativas foram descartadas porque aumentariam peso, complexidade, risco de cache inconsistente ou dependência externa sem benefício funcional.

Até o binário existir em `assets/portal-opening-v1.mp4`, a branch não atende o critério de aceite visual e o PR #202 deve permanecer draft.

## Riscos conhecidos

- navegadores podem bloquear autoplay com áudio mesmo após o usuário ter acabado de autenticar; isso é política do navegador, por isso existe o gesto explícito **“Iniciar abertura com som”**;
- o vídeo usa `object-fit: cover`; em proporções muito diferentes de 16:9 pode haver corte periférico, sem deformação;
- o cache só é uma otimização. A indisponibilidade do Cache Storage deve continuar caindo para rede/fallback;
- não mesclar #202 antes de validar áudio, enquadramento, os 10 s completos, segunda execução com cache e fallback real;
- não misturar #202 com #201: a Fase 4 possui homologação e riscos de escrita no Drive independentes desta mudança visual.

## Alternativas descartadas

- GIF: descartado por tamanho, qualidade e ausência de áudio;
- autoplay forçado em modo mudo: descartado porque contraria a decisão de manter som;
- remover o spinner antigo: descartado porque elimina o fallback seguro;
- bloquear o carregamento da Home até o fim do vídeo: descartado porque piora desempenho percebido e contraria o princípio do instrumentador;
- misturar a mudança no PR #201: descartado para não contaminar a homologação 4D com uma alteração visual transversal;
- hospedar o vídeo em serviço externo apenas para contornar o upload binário: descartado por dependência e governança desnecessárias.

## Handoff para o próximo chat

**Fase atual:** Fase 4 — Sincronização segura com Drive.  
**Subfase / objetivo atual:** 4D continua no PR #201; em paralelo existe a mudança transversal de abertura pós-login no PR #202.  
**Última ação concluída:** implementação de código, proteção de autoplay/cache/fallback, teste de contrato e documentação da abertura no PR #202.  
**Branch atual desta mudança:** `feat/post-login-opening-video`.  
**PR atual desta mudança:** #202, draft, não mesclado.  
**Último commit funcional registrado:** `86dd5e0a1472cc53affbb919aec37c0dc74f088d` antes do commit deste status.  
**Checks e testes:** `node --check` local do `home.js` aprovado; checks GitHub devem ser conferidos após inclusão do binário.  
**Decisões tomadas:** vídeo de 10,005 s com som é oficial; tela inteira; cache local; loader antigo como fallback; gesto explícito se autoplay com som for bloqueado.  
**Justificativas:** preservar experiência visual aprovada sem sacrificar recuperação, desempenho ou política dos navegadores.  
**Alternativas descartadas:** GIF, vídeo mudo automático, remoção do spinner, bloqueio do carregamento da Home, mistura com PR #201 e hospedagem externa improvisada.  
**Ações externas concluídas:** nenhuma necessária para esta mudança.  
**Pendências e bloqueios:** incorporar o binário oficial exato em `assets/portal-opening-v1.mp4`; depois executar checks e homologação visual/sonora.  
**Riscos conhecidos:** bloqueio de autoplay com som; crop periférico por `cover`; cache indisponível; regressão se #202 for mesclado sem mídia.  
**Métricas / observabilidade:** nenhuma nova telemetria sensível adicionada; esta V1 não depende de PostHog.  
**Próxima ação exata:** adicionar ao PR #202 o arquivo MP4 aprovado com SHA-256 `98b866963ccf1debbca9d942e647307e8ed4e045c231af17117d150da4c9d766`, conferir checks e abrir o preview para validar áudio, duração, enquadramento, cache na segunda autenticação e fallback.  
**Arquivos e fontes principais:** `docs/PORTAL-ABERTURA-POS-LOGIN-V1.md`, `index.html`, `js/home.js`, `worker/tests/post-login-opening.test.mjs`, PR #202; para a Fase 4, PR #201 e `docs/CENTRAL-DOCUMENTOS-STATUS.md` na branch `codex/central-docs-drive-sync-phase4`.
