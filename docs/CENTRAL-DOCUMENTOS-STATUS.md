# Central de Documentos — Status

Última atualização: 17/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.**

Subfase: **4D — leitura real confirmada; liberação de escrita interrompida por mudança da produção; script operacional V2-R1 reemitido e testado localmente, aguardando execução do operador.**

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR: **#201 aberto e sem merge**; última consulta indicou `mergeable:false`.
- Main conferida: `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`, após conclusão da abertura pós-login, PRs #202/#203. Não desfazer essa mudança.
- Código congelado do reteste restrito: `2fee19e69e06ecd128be2b103354fc6c2fb4e431`.
- Preview-base informado e conferido anteriormente pelo operador: `a17473ce-ad9a-480c-8e53-901f2fcc3c92`, escrita false.

Fases 0–3 permanecem encerradas. A implementação/testes técnicos de 4A–4C não substituem a matriz real 4D. **Não encerrar a Fase 4, iniciar fase nova nem mesclar o PR por causa do prazo operacional.**

## Fontes e histórico preservado

Este é o registro operacional atual. O detalhamento anterior continua versionado em `9f295ca2766b890285b912b7ab714adeb63d2bc7:docs/CENTRAL-DOCUMENTOS-STATUS.md` e `2caa4797eaccf9e86d69e1d699161855bc22205b:docs/CENTRAL-DOCUMENTOS-STATUS.md`.

Fontes complementares obrigatórias: Guia Mestre V1.1; Dossiê/deltas aplicáveis; `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-RESULTADOS.md`, `CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md`, `CENTRAL-DOCUMENTOS-4D-CONTINUIDADE-20260917-TARDE.md`, FASE-4, ARQUITETURA-V1 e HOMOLOGACAO-V1.

Relatos antigos de ausência de conector, de produção em 239cca88 e de gate desligado valem para seus respectivos horários/sessões. Não tratá-los como estado atual sem conferir. Resultado verde antigo também não descreve automaticamente o head atual.

## Evidências recebidas do operador

1. Login normal do Wrangler concluído no Windows 10 Pro; Node 24.17.0, npm 11.13.0 e Wrangler fixado em 4.133.0. Compilação local dry-run da entrada exclusiva de homologação concluiu com `PREPARO_LOCAL_OK`.
2. `enviar-preview-4d-seguro.mjs` informou `PREVIEW_ENVIADO_DESARMADO`: versão a17473ce, código 2fee19e, gate false e produção então inalterada em 239cca88, 100%. Registros locais: `CentralDocumentos4D/ultimo-preview.json` e configuração separada.
3. Novo controle D1 criado sem prorrogar o anterior, copiando somente a conta e o único PDF descartável autorizados. Resultado: enabled=1, vencimento **17/09/2026 20:10:01 UTC — 16:10:01 em Eldorado/MS**.
4. Screenshot aproximadamente às 14:17 locais: `/homologacao/documentos/` lista um nome sintético e abre o PDF; visualizador reconhece três páginas e mostra miniaturas. Isso comprova leitura, não salvamento com a nova versão.
5. O script original `liberar-escrita-preview-4d.mjs` interrompeu em `CONFERIR_PREVIEW_E_PRODUCAO`, código `VERSAO_DE_PRODUCAO_DIVERGENTE`, antes de qualquer upload. Exigia produção histórica 239cca88; não foi defeito do PDF.
6. Consulta posterior fornecida pelo operador: produção **f8848c45-0bfc-40d6-8508-92b33dea6f43, 100%**, deployment **83a620d7-82cc-47ae-9779-f7002f45482d**, criado em 18:26:45.063 UTC. Últimas versões: a17473ce às 18:02:13.211, eabef99f às 18:23:39.339 e f8848c45 às 18:26:44.579 UTC.

A leitura da Cloudflare acima foi feita pelo operador, não pelo assistente nesta retomada. A atualização da main foi confirmada separadamente pelo GitHub; proximidade de horário não basta para atribuir o conteúdo de uma versão Cloudflare a um PR.

**Decisão: preservar a produção f8848c45 e seu deployment.** Não restaurar 239cca88 para fazer o script antigo passar. Não repetir OAuth, criação do PDF, download do código ou formulário de Builds.

## Retomada após resposta interrompida — V2-R1

A tentativa anterior registrou um V2 e um hash no status, mas a mensagem final falhou. Nesta retomada o executável original do ZIP foi recuperado e seu SHA-256 conferido como `53b6cc137149b69ea3fb6a650e6a6c9e40918b68f2ef5154cdcc5814fbc212d5`. O executável V2 descrito no registro anterior não foi localizado nos arquivos disponíveis; não se presumiu entrega ou execução.

Foi reemitido um arquivo de revisão própria, **`liberar-escrita-preview-4d-v2-r1.mjs`**, a partir do script recuperado e das decisões persistidas. Esta entrega substitui os arquivos de liberação anteriores.

**SHA-256 executável V2-R1:** `812255aa8194f301b3a96c3be286f1e15adfc60f8201f5bf0de52e89f56703f8`.

Pacote local: `preview-4d-liberar-escrita-v2-r1.zip`, contendo executável, testes, LEIA-ME e resultados. Cópia TXT idêntica para contingência de download. Os artefatos foram criados e a correspondência do hash dentro do ZIP foi verificada. Não houve nova publicação na Cloudflare nem acesso ao PDF pelo assistente.

### Proteções do procedimento

- Exige exatamente f8848c45/83a620d7/100% antes e depois. Outra produção não é aceita automaticamente.
- Preserva o snapshot antigo de 239cca88/f2916211 como histórico; não o compara indevidamente com a produção nova.
- Só arquiva tentativa anterior registrada como uploadAttempted=false, uploaded=false e sem ID novo. Tentativa inconclusiva ou envio anterior bloqueia repetição. Há trava local contra execuções simultâneas e gravação do registro antes da tentativa de envio.
- Confere a17473ce como base desarmada, o mesmo release, controle, origens, runtime e D1. A última versão esperada para a herança passa a ser f8848c45, não a17473ce.
- Confere na produção os nomes/tipos dos seis segredos necessários e o mesmo D1/dependências públicas. Não extrai, compara nem copia valores de segredo; presença de nomes não comprova igualdade de valores entre versões.
- Usa secrets.required para seis bindings inherit e unsafe.metadata.keep_bindings=[] para impedir herança ampla na nova versão. Isso não exclui segredos da produção. Comportamento verificado no fonte fixado do Wrangler 4.133.0.
- Exige dry-run e inspeciona o multipart efetivamente produzido: um módulo de homologação, dez variáveis permitidas, AUTH_DB e seis referências de herança sem valores secretos. Bloqueia módulos, metadados, bindings adicionais ou herança ampla. Se o contrato gerado pelo Wrangler diferir, para antes de enviar.
- Verifica snapshot dos fontes locais antes/depois da compilação e antes de enviar; não muda código do editor.
- Executa somente SELECT no D1: prazo, flags, igualdade do escopo e contagens, sem projetar usuário/fileId. Exige um PDF, mesma conta/escopo, ausência de outra janela ativa e de sessões pendentes, prazo original e pelo menos 20 minutos restantes. Não prolonga a autorização.
- Após confirmação humana `LIBERAR TESTE`, revalida estado/prazo e usa somente versions upload. Não executa deploy, promoção, rollback, comando de segredo, INSERT, UPDATE ou DELETE no D1.
- Após o envio confere configuração, alias informado, predecessor da nova versão, produção e prazo. Essas conferências não são um bloqueio remoto transacional: evitar publicações concorrentes durante o procedimento. Incerteza após tentativa exige inspeção/revogação, nunca repetição cega.

### Validação desta reentrega

**31 testes Node locais aprovados, zero falhas/skips**, mais sintaxe e SELECT exercitado em SQLite de memória com dados sintéticos. Inclui produção antiga/nova/divergente, dependências, herança restrita, multipart, concorrência, expiração, privacidade, confirmação humana e fluxo completo simulado. O dry-run real do Wrangler e o upload autenticado do V2-R1 ainda dependem da execução no Windows do operador. Não apresentar testes locais como homologação real do editor.

## Estado técnico e evidências de produto

- Visualizador PDF.js, editor essencial, operações locais reversíveis, exportação e impressão pertencem às fases anteriores encerradas.
- Preflight revalida sessão, documents_edit, metadados e conflito. Upload resumable em blocos, assinatura PDF no primeiro bloco, revisão anterior preservada e confirmação final obrigatória.
- Autosync observa mutação da revisão e espera um segundo sem alteração. Zoom/navegação/ociosidade não geram upload. Botão: normal → pending → syncing → success (1 s) → normal; failed permite retry. Assets aprovados mantidos, inclusive correção do PNG pendente v=20260916-2.
- Confirmação de uma revisão anterior não comprova salvamento de edição nova feita durante upload. X, saída e troca de documento passam pelo guard. Beforeunload é aviso, não garantia de upload depois do encerramento do navegador.
- Primeiras tentativas reais gravaram revisões sintéticas e comprovaram preservação/recuperação; success observado por cerca de 963 ms. Envios seguintes tiveram conflito indevido; X com falha foi corrigido e retestado.
- Diagnóstico identificado observou base 16 e versão atual 18, sem revisão externa adicional observada; causa específica no keepForever não foi comprovada.
- Correção 2fee19e: confirmação por recibo/metadados e baseline certificada na ref, vinculada a usuário/arquivo/versão/identidade/contexto/origens/controle, validade 30 minutos. Revisão externa, mesmo com bytes iguais, permanece conflito. Não torna preflight/upload atômicos.
- RESULTADOS registra 274/274 testes do Worker e 75 passed / 3 skipped de navegador para essa correção. São evidências registradas, não novo aceite nem descrição dos checks de todo head posterior.

## Isolamento, encerramento e riscos

O preview usa `worker/homologation-4d.js`; **jamais promover esse wrapper para produção**. Autenticação/capabilities reais, D1 e OAuth compartilhados; isolamento por host/origem exatos, conta/arquivos permitidos, controle revogável/expirável e sessões. OAuth/reconexão/desconexão/rotas alheias bloqueados. Wrapper permite replace_pdf, bloqueia save_copy; cópia continua sem homologação real nesse ambiente.

Não registrar dados pessoais, nomes/IDs de arquivo, ref, URL resumable, conteúdo, CPF, CNS, CID, diagnóstico ou credenciais no repositório/PostHog. Somente drive_sync_started/completed/failed e propriedades técnicas allowlisted. Ausência de logs do preview não prova privacidade.

Ao encerrar: aguardar requisições em voo, revogar o controle D1, confirmar bloqueio e preparar gate false. Revogação não desfaz upload já aceito. Troca de alias não revoga por si só versões antigas. Janela termina em 20:10:01 UTC sem extensão automática.

## Próxima ação exata

1. Operador executa **V2-R1** no mesmo Windows, com preparo/login já existentes, sem outras publicações simultâneas. Digita LIBERAR TESTE somente após os checks. Receber somente o relatório final.
2. Se PREVIEW_COM_ESCRITA_LIBERADA: conferir acesso atualizado e repetir autosync consecutivo, edição durante upload, ausência de reenvio sem mudança, retry, fechamento com sucesso/falha, conflito externo, reabertura e recuperação. O script sozinho não grava PDF nem aprova a 4D.
3. Se interrupção: conferir se uploadAttempted foi falso ou verdadeiro antes de orientar ação. Envio tentado/inconclusivo exige revogar e inspecionar; não repetir nem editar o PDF. Não contornar expiração.
4. Encerrar controles/gate e registrar a matriz. Reconciliar o PR #201 com a main em etapa própria, preservando a abertura pós-login e rodando checks do candidato reconciliado. Nunca escolher automaticamente um lado do conflito nem descartar a main para cumprir prazo.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D, sem aceite; fases anteriores não reiniciadas |
| Última ação concluída | Executável V2-R1 reemitido com hash próprio, 31 testes locais e SELECT SQLite; nenhum upload real desta revisão |
| Branch/PR | codex/central-docs-drive-sync-phase4, #201 aberto, sem merge e conflito indicado |
| Código/preview | 2fee19e; a17473ce desarmado; main conferida 3dc193c |
| Produção a preservar | f8848c45 / deployment 83a620d7 / 100%, informado pelo operador; script confere novamente |
| Janela | Mesma conta/PDF sintético; prazo 17/09 20:10:01 UTC; leitura de três páginas recebida |
| Decisões/porquê | Preservar nova produção e histórico, restringir herança e validar multipart; erro antigo era referência desatualizada |
| Descartado | Rollback, remover guards, prolongar janela, repetir OAuth/Builds ou aceitar produção desconhecida |
| Testes | 31 testes locais V2-R1 + sintaxe/SQLite; produto histórico em RESULTADOS; execução autenticada e matriz real pendentes |
| Próximo passo | Executar V2-R1, conferir relatório/versão/gate/produção/prazo; só então teste real no descartável |
| Riscos | D1/OAuth compartilhados, publicação concorrente, expiração, herança, cache antigo e reconciliação com main |
| Fontes | STATUS, RESULTADOS, ISOLAMENTO, CONTINUIDADE-TARDE, PR #201, ultimo-preview.json, ultimo-preview-escrita.json, V2-R1 e hash acima |
