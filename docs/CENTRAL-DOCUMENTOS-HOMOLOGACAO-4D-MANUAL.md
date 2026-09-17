# Central de Documentos — Homologação 4D manual

Data: 17/09/2026  
Branch: `codex/central-docs-drive-sync-phase4`  
PR: `#201`

## Objetivo

Executar a homologação real do autosync com Google Drive sem depender do Codex e sem expor segredos no chat.

Este roteiro parte da implementação já existente na branch:
- frontend real de homologação em `/homologacao/documentos/`;
- build de staging parametrizado por `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL`;
- Worker protegido por `DOCUMENTS_DRIVE_WRITE_ENABLED`;
- origem de homologação explicitamente allowlisted no `wrangler.toml` da branch;
- produção bloqueada como alvo do bundle 4D.

## Regras de segurança

1. Usar somente PDF descartável, sem dados de paciente, CPF, CNS, diagnóstico, CID ou nome real.
2. Não usar o Worker de produção como alvo da homologação.
3. Não colar token, client secret, refresh token, chave de criptografia ou qualquer segredo em chat/GitHub.
4. Manter `DOCUMENTS_DRIVE_WRITE_ENABLED` desligado fora da janela de teste.
5. Não mesclar o PR #201 antes de concluir e registrar a 4D.
6. Se qualquer etapa indicar que a URL de homologação aponta para produção, interromper.

## O que já está pronto no GitHub

### Frontend de homologação

O script `scripts/build-central-docs-staging.mjs` gera:
- `/homologacao/documentos/` — Central de Documentos real da branch;
- `/homologacao/login/` — login isolado da homologação;
- `/homologacao/js/auth-config.js` — configuração que recebe apenas a origem pública do Worker preview;
- `/homologacao/homologation-manifest.json` — estado técnico da homologação;
- headers `no-store`, `noindex` e CSP própria para o Worker preview.

Sem `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL`, a rota 4D é gerada, mas permanece desarmada com endpoint vazio.

Com `CENTRAL_DOCS_HOMOLOGATION_WORKER_URL=https://<preview>.workers.dev`, o bundle materializa essa origem no auth-config e na CSP. O script rejeita explicitamente a origem de produção `https://yellow-wave-d0a1guia-regulacao-ia.regulacaoeldoradoms.workers.dev`.

### Origem permitida pelo Worker

A branch já contém a origem estável do Pages de homologação:

`https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev`

em `ALLOWED_ORIGINS` e em `DOCUMENTS_HOMOLOGATION_ORIGIN` no `worker/wrangler.toml`.

Essa inclusão é temporária para a 4D e deve ser revista/removida antes do merge final.

## Configuração manual no Cloudflare — quando formos executar

### A. Criar/obter uma versão preview do Worker da branch

No painel Cloudflare:
1. abrir **Workers & Pages**;
2. abrir o Worker `yellow-wave-d0a1guia-regulacao-ia`;
3. abrir a área de builds/deployments;
4. habilitar build de branch não produtiva, se necessário;
5. selecionar/usar a branch `codex/central-docs-drive-sync-phase4`;
6. confirmar que o resultado é uma URL `https://...workers.dev` diferente da produção;
7. anotar somente essa URL pública de preview — ela não é segredo.

Não prosseguir se a URL obtida for a URL de produção.

### B. Configurar o Pages de staging para apontar ao Worker preview

No projeto Pages `portal-regulacao-central-staging`:
1. abrir **Settings** → variáveis de ambiente/build;
2. no ambiente de preview da branch, criar:

`CENTRAL_DOCS_HOMOLOGATION_WORKER_URL = https://<worker-preview>.workers.dev`

3. salvar;
4. disparar/repetir o deployment da branch;
5. abrir:

`https://codex-central-docs-drive-syn.portal-regulacao-central-staging.pages.dev/homologacao/documentos/`

6. conferir que a faixa superior mostra **HOMOLOGAÇÃO 4D**;
7. conferir `/homologacao/homologation-manifest.json` e verificar:
   - `workerConfigured: true`;
   - `workerOrigin` igual ao preview esperado;
   - `disposablePdfOnly: true`.

### C. Habilitar escrita somente no Worker preview

No ambiente/versão preview do Worker, criar variável de texto:

`DOCUMENTS_DRIVE_WRITE_ENABLED = true`

Essa variável é um feature flag, não um segredo.

Não alterar os valores reais dos segredos existentes. O preview precisa receber os bindings/segredos necessários por mecanismo seguro do Cloudflare; se o ambiente não herdar ou não possuir os bindings corretos, interromper em vez de copiá-los para chat.

## Preparar o PDF descartável no Drive

Criar manualmente no Drive institucional um PDF simples, por exemplo:
- nome: `TESTE-CENTRAL-DOCUMENTOS-4D.pdf`;
- conteúdo: apenas texto fictício como `TESTE DE SINCRONIZAÇÃO — PÁGINA 1`;
- nenhuma informação real de paciente ou servidor.

O arquivo deve poder ser descartado depois da homologação.

## Matriz de teste 4D

Executar na ordem:

### 1. Conexão e abertura
- login no ambiente de homologação;
- conectar Drive, se a sessão isolada exigir;
- abrir o PDF descartável;
- confirmar que o botão Drive inicia em `normal`.

### 2. Autosync real
- fazer uma alteração simples, como inserir texto fictício ou rotacionar uma página;
- observar `pending`;
- aguardar aproximadamente 1 segundo sem editar;
- observar `syncing`;
- somente após resposta final do Drive, observar `success` por aproximadamente 1 segundo;
- confirmar retorno a `normal`;
- reabrir/baixar o arquivo no Drive e confirmar a alteração real.

### 3. Nenhuma mudança = nenhum upload
- deixar o documento aberto sem alterar;
- navegar/alterar zoom;
- confirmar que não ocorre nova sincronização.

### 4. Edição durante upload
- fazer nova alteração enquanto outra revisão está sincronizando;
- confirmar que a revisão nova permanece pendente;
- confirmar que um segundo autosync ocorre após a primeira conclusão;
- o sucesso final deve representar a revisão mais recente.

### 5. Botão Forçar sincronização
- provocar uma condição de retry somente de forma controlada;
- confirmar estado `failed` quando a tentativa não for confirmada;
- restaurar conectividade/condição;
- clicar em **Forçar sincronização com Google Drive**;
- confirmar nova tentativa e sucesso real.

### 6. Fechamento com revisão pendente
- alterar o PDF;
- clicar em Fechar antes do debounce completar;
- confirmar que o Portal tenta sincronizar imediatamente;
- confirmar que só fecha depois da confirmação real;
- em falha/conflito, confirmar que permanece aberto.

### 7. Conflito de versão
- abrir o PDF na Central;
- alterar externamente o mesmo arquivo no Drive antes da tentativa de replace;
- fazer nova alteração local;
- confirmar bloqueio por conflito de `version`;
- confirmar ausência de sobrescrita silenciosa.

### 8. Revisão recuperável
- antes do replace, confirmar que a revisão anterior foi preservada;
- validar que a revisão anterior continua recuperável no Drive.

### 9. Privacidade/telemetria
- verificar somente telemetria técnica;
- não deve existir nome de arquivo, fileId, referência opaca, conteúdo, paciente, CPF, CNS, CID ou diagnóstico em PostHog/logs funcionais.

## Encerramento obrigatório

Ao terminar:
1. voltar `DOCUMENTS_DRIVE_WRITE_ENABLED` para `false` ou remover a variável do preview;
2. manter o PDF descartável ou excluí-lo manualmente conforme conveniência;
3. registrar resultado em `docs/CENTRAL-DOCUMENTOS-STATUS.md`;
4. registrar aceite/reprovação da 4D;
5. remover/reavaliar `DOCUMENTS_HOMOLOGATION_ORIGIN` e a origem Pages temporária antes do merge;
6. somente se todos os critérios passarem, encerrar a Fase 4 e considerar merge do PR #201.

## Critério de aceite da 4D

A 4D só é aceita quando houver evidência real, com arquivo descartável, de:
- autosync após mutação real;
- ausência de sync sem mutação;
- confirmação visual somente após resposta final do Drive;
- retry manual funcional;
- proteção ao fechar;
- conflito de versão bloqueando sobrescrita;
- revisão anterior recuperável;
- ausência de dados sensíveis em observabilidade.
