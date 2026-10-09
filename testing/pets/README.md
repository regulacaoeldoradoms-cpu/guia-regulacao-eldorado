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

Revisão visual das evidências existentes: proporções das poses consistentes; na captura mobile, o mascote/alerta cobre parte das barras de necessidade e a caminha cobre texto da loja. Ponto de legibilidade registrado para revisão, sem nova alteração visual. Barras fixas aparecem no meio de capturas de página inteira por causa do método de captura.
