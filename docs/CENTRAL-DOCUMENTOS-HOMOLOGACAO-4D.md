# Central de Documentos — Homologação 4D no Drive real

Data: 16/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
PR: `#201`

## Complemento de isolamento — 17/09/2026

A retomada operacional usa `worker/homologation-4d.js`, entrypoint exclusivo de preview, e o procedimento de `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md`. O Worker normal permanece com entrada `index.js`. O preview compartilha a conexão institucional existente, mas restringe usuário, arquivos descartáveis e sessões de sincronização por controle revogável e expirável no backend. OAuth/reconexão/desconexão e módulos alheios ficam bloqueados.

Não basta usar uma URL diferente da produção nem trocar o alias ao terminar: a versão antiga possui URL estática. Desabilitar o controle no D1 é parte obrigatória do encerramento; com controle ausente, inválido, expirado ou revogado, o preview bloqueia o acesso. Nenhuma escrita real é aceita apenas porque a matriz sintética está verde.

## Objetivo

Validar a sincronização automática do editor PDF contra o Google Drive real sem publicar a Fase 4 em produção e sem usar qualquer documento de paciente.

## Arquitetura da homologação

O projeto de Pages de staging mantém dois ambientes no mesmo deployment:

- `/` — laboratório sintético, sem APIs reais e sem Google Drive;
- `/homologacao/documentos/` — frontend real da Central de Documentos para a 4D.

A rota de homologação não aceita silenciosamente o Worker de produção. O build somente habilita a conexão quando a variável pública de build `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL` aponta para uma origem HTTPS `*.workers.dev` diferente do Worker de produção.

O login da homologação usa chaves de armazenamento próprias (`central.docs.homologacao.*`), isoladas da sessão do Portal em produção.

## Proteções

- banner amarelo identifica explicitamente **HOMOLOGAÇÃO 4D**;
- `robots.txt` bloqueia indexação;
- respostas usam `no-store`, `noindex`, `no-referrer` e CSP restritiva;
- o Worker de produção é rejeitado como alvo pelo script de build;
- segredos OAuth/Drive não entram no bundle;
- o staging sintético continua isolado da rota 4D;
- a origem temporária de Pages foi adicionada à allowlist somente nesta branch e deve ser removida antes do merge final;
- a escrita real continua dependendo de `DOCUMENTS_DRIVE_WRITE_ENABLED=true` no Worker usado para homologação.

## Valores públicos necessários no Cloudflare

Nenhum segredo deve ser colado no GitHub ou no chat.

Na hora da 4D serão necessárias somente estas configurações operacionais:

1. **Worker preview da branch** com o código deste PR.
2. No projeto Pages `portal-regulacao-central-staging`, variável de build:
   - `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL=https://<ORIGEM-DO-WORKER-PREVIEW>.workers.dev`
3. No Worker preview, feature gate temporário:
   - `DOCUMENTS_DRIVE_WRITE_ENABLED=true`

A origem de Pages aprovada nesta branch é:

`https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev`

## PDF de teste

Usar somente um PDF descartável criado especificamente para a homologação. O arquivo não pode conter:

- nome de paciente;
- CPF, CNS, endereço ou telefone;
- diagnóstico, CID, encaminhamento ou informação clínica;
- qualquer conteúdo operacional que precise ser preservado.

Sugestão: uma única página com o texto `TESTE CENTRAL DE DOCUMENTOS — HOMOLOGAÇÃO 4D`.

## Matriz 4D

Executar nesta ordem:

1. abrir o PDF descartável na Central;
2. entrar no editor e confirmar estado inicial `Drive_normal.png`;
3. fazer uma alteração simples;
4. confirmar `Drive_pendente.png`;
5. após 1 segundo sem novas edições, confirmar `Drive_sincronizando.png`;
6. somente após resposta final do Drive, confirmar `Drive_sincronizado_1seg.png` por aproximadamente 1 segundo e retorno ao estado normal;
7. recarregar/abrir novamente o arquivo e confirmar que a alteração existe no Drive;
8. testar uma alteração imediatamente antes de **Fechar** e confirmar que o editor não fecha sem sincronizar;
9. testar o botão **Forçar sincronização** como retry de uma revisão pendente/falha;
10. confirmar que a revisão anterior permanece recuperável;
11. provocar conflito de `version` com o PDF descartável e confirmar bloqueio de sobrescrita;
12. conferir telemetria somente técnica (`drive_sync_started/completed/failed`), sem nome, IDs brutos ou conteúdo documental.

## Encerramento obrigatório

Depois do teste:

- voltar `DOCUMENTS_DRIVE_WRITE_ENABLED` para desligado no ambiente de homologação até a decisão final;
- registrar o resultado neste projeto;
- remover a origem temporária de Pages da configuração antes do merge final, salvo decisão arquitetural expressa em contrário;
- não mesclar o PR #201 se houver qualquer falha de confirmação, conflito, recuperação ou privacidade.
