# Central de Documentos — Status

Última atualização: 17/09/2026.

## Fase atual

**Fase 4 — Sincronização segura com Drive.**

Subfase atual: **4D — leitura real confirmada; liberação de escrita interrompida por mudança da produção; procedimento operacional V2 preparado, ainda sem execução real confirmada.**

- Branch: `codex/central-docs-drive-sync-phase4`.
- PR: **#201, aberto e sem merge**. A consulta atual retornou `mergeable:false`; reconciliar com a main em etapa própria antes de qualquer promoção, sem desfazer a abertura pós-login.
- Main conferida: `3dc193c34d5f0f02c0a50b2f51ba2e29e022f77f`, após conclusão da abertura pós-login (PRs #202/#203).
- Código congelado do reteste restrito: `2fee19e69e06ecd128be2b103354fc6c2fb4e431`.
- Preview desarmado informado e verificado anteriormente pelo operador: `a17473ce-ad9a-480c-8e53-901f2fcc3c92`.

A **Fase 0** e as Fases **1, 2 e 3** permanecem encerradas. As subfases 4A–4C têm implementação e testes técnicos; a **4D ainda não está aprovada**. Não iniciar nova fase nem mesclar o PR #201 por causa do prazo operacional.

## Histórico preservado e hierarquia deste registro

Este arquivo foi consolidado para eliminar instruções operacionais vencidas do topo/handoff. O histórico integral anterior continua versionado em `2caa4797eaccf9e86d69e1d699161855bc22205b:docs/CENTRAL-DOCUMENTOS-STATUS.md` e nos documentos abaixo:

- `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-RESULTADOS.md`: matriz real, falhas e correções.
- `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-4D-ISOLAMENTO.md`: contrato do preview e controles.
- `docs/CENTRAL-DOCUMENTOS-4D-CONTINUIDADE-20260917-TARDE.md`: sequência de retomada, leitura confirmada e primeira interrupção.
- `docs/CENTRAL-DOCUMENTOS-FASE-4.md`, `docs/CENTRAL-DOCUMENTOS-ARQUITETURA-V1.md`, `docs/CENTRAL-DOCUMENTOS-HOMOLOGACAO-V1.md` e Guia Mestre V1.1: governança e critérios.

Relatos antigos de ausência de conector Cloudflare, de gate desligado e de produção na versão 239cca88 são históricos de suas respectivas sessões/horários. Não extrapolar disponibilidade de ferramenta nem configuração atual a partir deles. Da mesma forma, os testes antigos verdes de 6f45b7c não representam automaticamente o head atual.

## Evidências operacionais atuais — recebidas do operador

### Nova janela, ainda com escrita desligada

- O script `enviar-preview-4d-seguro.mjs` informou `PREVIEW_ENVIADO_DESARMADO`: versão `a17473ce-ad9a-480c-8e53-901f2fcc3c92`, código 2fee19e, gate `DOCUMENTS_DRIVE_WRITE_ENABLED=false` e produção então inalterada em 239cca88, 100%.
- O operador criou **novo** controle no D1, copiando somente a restrição existente de conta e de um único PDF descartável. O identificador anterior não foi prorrogado. A linha nova estava habilitada e vence em **17/09/2026 20:10:01 UTC (16:10:01 em Eldorado/MS)**.
- Screenshot aproximadamente às 14:17 locais: a rota `/homologacao/documentos/` lista apenas um nome sintético e o visualizador reconhece três páginas. Leitura comprovada; não é comprovação de autosync com esta versão.
- Não repetir login OAuth institucional, criação do PDF, tentativa do formulário de Builds ou preparo do código. O login legítimo do Portal e o login normal do Wrangler já ocorreram.

### Bloqueio da primeira liberação e produção reconferida

O script `liberar-escrita-preview-4d.mjs` original parou em `CONFERIR_PREVIEW_E_PRODUCAO`, código `VERSAO_DE_PRODUCAO_DIVERGENTE`, antes de executar qualquer comando de upload. Ele exigia a produção histórica 239cca88 e também presumiria que a última versão criada ainda era a17473ce.

O operador então executou consultas do Wrangler e forneceu:

- Deployment produtivo: **`83a620d7-82cc-47ae-9779-f7002f45482d`**.
- Versão produtiva: **`f8848c45-0bfc-40d6-8508-92b33dea6f43`**, **100%**.
- Deployment criado em **17/09/2026 18:26:45.063 UTC**.
- Últimas versões: preview a17473ce às 18:02:13.211 UTC, eabef99f às 18:23:39.339 UTC e f8848c45 às 18:26:44.579 UTC.

Esses são metadados recebidos do operador, não leitura autenticada da Cloudflare pelo assistente nesta etapa. A main em 3dc193c e a conclusão da abertura pós-login foram confirmadas separadamente pelo GitHub. Não atribuir o conteúdo de uma versão Cloudflare a um PR apenas pela proximidade de horários.

Decisão: **preservar f8848c45 e seu deployment**, sem rollback. A versão 239cca88 continua registrada como referência histórica; não deve ser restaurada para fazer o script antigo passar.

## Procedimento operacional V2 preparado

Arquivo entregue localmente: `liberar-escrita-preview-4d-v2.mjs`.

SHA-256: `eb7688dd10335bf145cf8f883600faba4eb867996fa4ff97fe8d37b4cce14e18`.

O V2 não muda código do editor. Ele prepara a mesma janela/preview para o teste, com as seguintes verificações:

1. Exige **exatamente** f8848c45, deployment 83a620d7 e 100% antes e depois; qualquer nova mudança interrompe. Não aceita automaticamente outra produção.
2. Preserva o snapshot histórico do registro local em vez de compará-lo indevidamente com a produção nova. Uma tentativa antiga interrompida antes de upload é arquivada; tentativa de upload anterior, mesmo inconclusiva, bloqueia reenvio automático.
3. Confere a17473ce como base desarmada, mesmo código, controle, origens, runtime e D1. A última versão permitida para a fonte de herança passa a ser a produção f8848c45; outra versão recém-criada interrompe.
4. Lê metadados da produção atual para conferir o mesmo D1 e dependências públicas compartilhadas, além da presença/tipo dos seis segredos necessários. **Valores secretos não são extraídos, comparados ou copiados.** Presença de nomes não comprova igualdade dos valores entre versões.
5. Evita herdar todos os segredos de produção: `secrets.required` especifica os seis nomes e `unsafe.metadata.keep_bindings=[]` limita a herança ampla no payload da nova versão. Esse ajuste atua no upload do preview, não exclui segredos da versão produtiva. O comportamento foi conferido no fonte do Wrangler 4.133.0; o multipart efetivamente gerado deve ser verificado localmente antes de permitir o envio real.
6. Executa dry-run com arquivo multipart e exige apenas o módulo compilado, dez variáveis permitidas, AUTH_DB e seis bindings `inherit` sem valores secretos; bloqueia atributos/arquivos/recursos adicionais ou herança ampla. Se o Wrangler gerar outro contrato, a operação para antes da confirmação/upload.
7. Faz somente SELECT de prazo, flags, igualdade de escopo e contagens no D1; exige um PDF, mesma conta/escopo, ausência de outra janela ativa ou sessões pendentes, prazo original e pelo menos 20 minutos restantes. Não prorroga nem recria o controle.
8. Exige confirmação humana `LIBERAR TESTE`, revalida estado/prazo e usa **somente `versions upload`**. Não executa deploy, promoção, rollback, alteração de segredo, INSERT, UPDATE ou DELETE no D1.
9. Após envio, confere a configuração da versão retornada, alias informado, predecessor da versão (para detectar upload concorrente), produção e validade. A comparação antes/depois não é um bloqueio remoto transacional; evitar outras publicações durante o procedimento. Incerteza após tentativa exige inspeção e revogação, não repetição cega.

**Validação local V2:** 27 testes Node aprovados, sintaxe aprovada e SELECT exercitado em SQLite de memória com dados fictícios. Inclui produção antiga/nova/divergente, dependências ausentes/tipos errados, recursos extras, herança ampla, metadados multipart, concorrência, expiração, privacidade e ordem das proteções. Não foi executado upload autenticado deste V2 pelo assistente; o dry-run do Wrangler com o payload V2 e a confirmação final dependem da execução do operador.

Próxima ação exata: operador executa o V2 no mesmo Windows com o preparo local existente. Receber apenas o relatório final. Se houver `PREVIEW_COM_ESCRITA_LIBERADA`, conferir acesso atualizado e iniciar a matriz real. Se houver interrupção, distinguir `uploadAttempted` falso/verdadeiro antes de orientar qualquer nova execução. Não editar o PDF com estado de envio incerto.

## Estado técnico do editor e evidências anteriores

### Fases 1–3 e 4A–4C

- Visualizador próprio PDF.js, editor essencial, operações locais reversíveis e exportação/impressão integram a base das fases encerradas.
- Preflight do Worker revalida sessão, capability `documents_edit`, metadados e versão do Drive. Referências são opacas.
- Upload resumable em blocos, confirmação final e preservação da revisão anterior; erros/interrupções não viram falso sucesso. O primeiro bloco exige assinatura `%PDF-`.
- Autosync observa a revisão real do editor; usa 1 segundo de ociosidade, não envia por zoom/navegação nem por permanência sem alterações.
- Botão de força é retry/fallback e indicador: `normal → pending → syncing → success (1 s) → normal`; erro usa `failed`. Assets aprovados: Drive_normal.png, Drive_pendente.png, Drive_sincronizando.png, Drive_sincronizado_1seg.png e Drive_falha.png. O ícone pendente corrigido usa cache-buster v=20260916-2.
- Confirmação de revisão anterior não implica que a edição nova feita durante upload esteja salva. Novas alterações ficam pendentes.
- X do visualizador, saída do editor e troca de documento precisam passar pelo guard de pendências. Beforeunload oferece aviso de saída, não garantia de upload após encerramento do navegador.

### Regressões e prova real já registrada

- Regressão do harness por e2a8c76 foi reparada restaurando o harness completo de edd95fa e mantendo a duração sintética de syncing; não confundir testes do harness com frontend real.
- As primeiras tentativas reais gravaram revisões do PDF descartável, preservaram e recuperaram a revisão anterior. O estado success foi observado por cerca de 963 ms em uma repetição.
- Edições/envios seguintes falharam por conflito indevido; o X também permitia fechar com pendência. A repetição com frontend corrigido comprovou que o X manteve aberto após falha.
- Diagnóstico com release servido identificado observou versão-base 16 e versão atual 18, sem nova revisão externa observada. Não foi comprovada causalidade específica do keepForever.
- Correção 2fee19e: releitura do recibo/metadados e baseline certificada na referência opaca, vinculada a usuário, arquivo, versão, identidade binária, contexto/origens/controle e TTL de 30 minutos. Divergência de revisão externa continua bloqueada, inclusive com bytes iguais. Não transforma preflight/upload em transação atômica.
- RESULTADOS registra para essa correção **274/274 testes do Worker** e **75 passed / 3 skipped previstos** no navegador. São evidências técnicas registradas, não novo aceite real nem descrição de todos os checks do head atual.

## Isolamento, privacidade e encerramento

O preview usa o entrypoint `worker/homologation-4d.js`; **não promover esse wrapper para produção**. Usa autenticação e permissões reais do Portal. D1 e OAuth são compartilhados; o isolamento depende do host/origem exatos, conta e arquivos permitidos, controle com prazo/revogação e sessões de upload vinculadas. OAuth/reconexão/desconexão e rotas alheias ficam bloqueados. O wrapper permite replace_pdf e bloqueia save_copy; cópia ainda não foi homologada no Drive real por esse ambiente.

Não enviar nomes, identificadores do Drive, referências, URL resumable, conteúdo PDF, CPF, CNS, CID, diagnóstico ou credenciais ao GitHub/PostHog. Telemetria permitida: drive_sync_started/completed/failed com propriedades técnicas allowlisted. Ausência de Workers Logs no preview não prova privacidade.

A nova janela encerra em 20:10:01 UTC, sem extensão automática. Ao terminar: aguardar operações em voo, revogar o controle no D1, confirmar o bloqueio e preparar gate false no preview. Revogação não desfaz upload já aceito. Não confiar apenas em troca de alias para revogar versões antigas.

## Pendências e critérios de avanço

- Executar e conferir a liberação restrita V2; ela por si só não grava PDF nem aprova a fase.
- Repetir salvamentos consecutivos com 2fee19e; editar durante upload; confirmar ausência de reenvio sem mudança, retry manual após falha, fechamento com sucesso e falha, conflito externo verdadeiro, reabertura do PDF final e recuperação.
- Encerrar controles/gate e registrar evidências sem dados sensíveis.
- Reconciliar #201 com a main atual em etapa própria, preservando a abertura pós-login; rodar checks do candidato reconciliado. O status mergeable:false não é autorização para descartar a main ou escolher automaticamente um lado.
- Não declarar operação plena/salva a partir de teste sintético, marcador de release, consulta HTTP ou abertura visual. Sucesso documental exige confirmação real do Google e homologação.

## Handoff para o próximo chat

| Campo | Estado |
| --- | --- |
| Fase/subfase | Fase 4D, sem aceite; fases anteriores não reiniciadas |
| Última ação concluída | Operador identificou nova produção f8848c45/83a620d7 a 100%; V2 do procedimento foi preparado e testado localmente, sem execução real confirmada |
| Branch/PR | codex/central-docs-drive-sync-phase4, #201 aberto, sem merge, conflito de integração indicado |
| Código do reteste | 2fee19e; preview-base a17473ce, gate false informado; main conferida 3dc193c |
| Produção a preservar | f8848c45-0bfc-40d6-8508-92b33dea6f43, deployment 83a620d7-82cc-47ae-9779-f7002f45482d, 100%, conforme saída Wrangler do operador |
| Janela e leitura | Uma conta e um PDF sintético, janela nova até 17/09 20:10:01 UTC; leitura/3 páginas conferidas às 14:17 locais |
| Decisão | Não fazer rollback; distinguir produção atual, histórico local e preview-base; restringir herança a recursos necessários; não estender janela |
| Testes | V2 operacional: 27 testes locais + sintaxe + SELECT SQLite; ainda não executado no Windows/Cloudflare. Histórico do produto em RESULTADOS: 274 Worker, 75 navegador/3 skips |
| Próxima ação exata | Receber saída de liberar-escrita-preview-4d-v2.mjs; conferir tentativa/upload/gate/produção/prazo antes de primeira edição. Interrupção pós-envio exige conferir/revogar, não repetir |
| Riscos | D1/OAuth compartilhados, publicação concorrente, prazo, herança de segredos, estados antigos em cache; merge com main pendente |
| Observabilidade | Apenas dados técnicos; nunca arquivos, usuários, credenciais ou conteúdo em evidências públicas |
| Fontes | STATUS, RESULTADOS, ISOLAMENTO, CONTINUIDADE-20260917-TARDE, PR #201, registros locais ultimo-preview.json/ultimo-preview-escrita.json e script V2 identificado pelo SHA-256 acima |
