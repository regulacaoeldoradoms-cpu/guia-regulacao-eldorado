# Checkpoint local dos mascotes

Base: `c10773fba8010bf2f2c8f42433976cefffe64315`. Fontes do checkpoint do PC preservadas no pacote de validação; cópias de trabalho normalizadas para LF. Entrega destinada a branch isolada e PR draft para revisão, com autorização específica de envio ao GitHub. Nenhum merge, deploy produtivo ou migração remota foi executado. `PETS_ENABLED=false` permanece no Worker.

Correções de reconciliação: estilos compartilhados da página, versões dos carregadores e cache do portal, limpeza da interface na troca de conta, cancelamento de requisições da sessão anterior e `.gitignore` dos artefatos locais. `cache-session.cjs` acrescenta validação com SQLite em memória, duas contas fictícias e servidor restrito a loopback. Ele bloqueia requisições externas e testa a atualização do service worker real da base para a cópia atual.

Validação realizada no executor com Node 24, SQLite embutido, Playwright já disponível e Chromium do sistema. Nenhuma dependência foi instalada. Os scripts históricos `install`, `fix-*`, `integrate` e `video-setup` foram preservados como fontes do checkpoint; não foram executados durante a reconciliação.

Para repetir apenas o teste de cache e sessões, com as ferramentas já disponíveis:

```sh
PETS_BROWSER_EXECUTABLE=/usr/bin/chromium PETS_CACHE_ARTIFACT_DIR=/tmp/pets-cache-evidence node testing/pets/cache-session.cjs
```

O preview original usa `serve.mjs` e `browser.mjs`; configure `PETS_PREVIEW_DB`, `PETS_ARTIFACT_DIR`, `PETS_BROWSER_EXECUTABLE` e `PETS_DISABLE_VIDEO=1` para manter banco e evidências fora do checkout. O servidor de preview usa somente `127.0.0.1:8793` e sessões fictícias. Nunca publique esse servidor.

Antes de qualquer ativação: revisar e aceitar o patch consolidado; autorizar explicitamente o destino e a publicação; aplicar `worker/migrations/pets-v1.sql` ao `AUTH_DB` aprovado e validar o esquema; confirmar autenticação real, isolamento de duas contas e idempotência nesse ambiente; habilitar a flag somente no destino autorizado. A publicação do Worker deve cumprir `docs/WORKER-SAFE-DEPLOY.md`. Nenhum desses passos remotos foi autorizado ou executado nesta etapa.

Limites: os testes locais usam SQLite e autenticação sintética, não D1 remoto nem contas reais. A suíte de 851 testes foi aprovada antes das correções finais de cache/sessão; depois delas passaram 130 testes pertinentes, os 13 cenários originais de navegador e os nove cenários adicionais de cache/sessão. Consulte `validation.json` e as evidências do pacote para o resultado final.

Correção da revisão visual: gato, alerta e cama ocupam uma cena de 224 px reservada no fluxo da página, com escala de 128 × 96 px para o gato. Em Mascotes, essa cena fica antes das necessidades e dos cuidados; nos demais módulos, um link de 44 px leva aos cuidados. Não há sobreposição sobre conteúdo, controles ou navegação. A posição da cama é normalizada dentro da cena e se ajusta ao redimensionamento; gato dormindo acompanha a cama. A animação do gato permanece ativa. Com o stylesheet de mascotes ativo, a navegação nativa por snapshots fica desativada para evitar rejeições de transição entre páginas; os movimentos do gato continuam independentes.

A Home carrega o companheiro de forma opcional depois de estar pronta. Foi retirado o script extra do HTML da Home, que fazia a transição de login rejeitar a resposta. A lista exata de scripts autorizados em `js/login-home-transition.js` permanece intacta; um teste novo verifica todos os scripts do HTML real contra ela. Payloads incompletos não criam uma cena órfã.

Validação da correção: 111 testes unitários pertinentes; 14 cenários existentes da Home em desktop/mobile; 13 cenários originais de mascotes; nove cenários de cache/sessão; 13 verificações novas da área segura (320, 390, 600, 844 e 1280 px, quatro cantos da cama, movimento, cuidados, posição, viewport curta, troca de sessão e link entre módulos). Nenhuma dependência instalada. Evidências da correção ficam fora do checkout, em `/workspace/scratch/mascotes-mobile-fix/` neste executor.

CI do primeiro commit do PR #613: a suíte completa do Worker passou com 851/851 e o gate com 29/29; a auditoria de vídeo encontrou a regressão de Home acima, agora corrigida e validada localmente. Os resultados do CI do commit de correção devem ser consultados antes de qualquer aceite. As duas auditorias amplas são acompanhadas sem disparar repetição local de suítes intactas.

Produção: `main` permaneceu em `c10773f`; o check externo do primeiro commit aponta explicitamente para um preview da branch. A comparação adicional dos arquivos públicos do domínio produtivo foi bloqueada pela conectividade deste executor, portanto não se declara verificação direta do tráfego/versionamento do Worker. Não houve alteração de configuração, secrets, grants, workflows, migração, promoção ou merge.

As quatro imagens antigas e os resultados exatos das transferências falhas foram preservados em `/workspace/scratch/mascotes-previa-visual/`. Todas falharam antes de finalizar a Library; não há IDs de Library confirmados. `transfer-recovery.json` identifica as reservas de upload, sem expor URLs. O helper atual não oferece retomada por ID de sessão; não foi trocada a rota iniciada nem repetido envio incerto. Novas capturas locais refletem a área segura corrigida.

Correção da auditoria visual: a fixture modela somente os três GETs exatos de mascotes com a resposta real de flag desativada (503); mutações e endpoints desconhecidos continuam bloqueados. O servidor sintético permite a nova página `/mascotes/`. Como essa página não existe na base, ela recebe auditoria de superfícies light/dark/print, enquanto as páginas existentes continuam comparadas à base sem rebaseline ou mudança de limiares. Navegação e seção de conquistas de mascotes só são criadas após resposta válida da função habilitada e removidas ao encerrar a sessão. A página segue as variáveis do tema real do portal, inclusive alertas.

Verificações adicionais: 120 testes focados (incluem 21 contratos da fixture), 13 cenários originais de mascotes, nove de cache/sessão e 13 de área segura aprovados após as correções. Superfícies da página com gato, cama e alerta ativos em dark não apresentaram superfícies claras indevidas. A conquista habilitada e a remoção dos links/conquista ao sair também foram verificadas com conta fictícia. O pacote Library v1 corresponde ao checkpoint de validação anterior; não substitui o diff atualizado do PR.

Comparação focada final: 20/20 cenários de superfícies e preservação da base aprovados em desktop/mobile para Home, Ferramentas, Conquistas e Mascotes. Evidência: `dark-focus-final.log` no diretório externo de validação.
