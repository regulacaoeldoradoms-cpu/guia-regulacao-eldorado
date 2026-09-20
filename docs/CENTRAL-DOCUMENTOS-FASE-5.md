# Central de Documentos — Fase 5: IA documental

Data de início: 18/09/2026.

## Estado

Fase 4 encerrada e publicada. Esta frente começa da `main` após o merge do ajuste transversal da abertura pós-login. A Fase 5 não reabre sincronização, editor, OAuth ou permissões já homologadas.

## Objetivo da fase

Adicionar IA documental à Central sem transformar o assistente de pré-regulação existente em um processador de dados identificáveis. O novo domínio deve:

- exibir um painel de IA do Titon ao lado do PDF;
- oferecer **um único botão** `Extrair dados do PDF` como fluxo principal;
- trabalhar com rotinas oficiais versionadas;
- percorrer o documento inteiro no cliente, mas enviar/processar **uma página por vez** para preservar isolamento;
- devolver proveniência explícita por página;
- implementar extração restritiva do Comprovante de Atendimento;
- implementar extração restritiva de páginas médicas autorizadas;
- oferecer perguntas livres sobre o documento somente em fluxo separado da extração institucional.

## Critério de aceite do Guia Mestre

A Fase 5 só pode ser encerrada quando a IA:

1. informa a página de origem;
2. não mistura campos de páginas diferentes;
3. respeita `NÃO CONSTA`;
4. respeita `ILEGÍVEL`;
5. mantém transcrição literal nos campos em que a rotina exige literalidade.

## Fronteira de segurança

### Separação obrigatória

`worker/gemini-assistant.js` continua sendo o assistente de pré-regulação anonimizada e mantém sua recusa a dados pessoais identificáveis.

A IA documental será implementada em módulo próprio, inicialmente `worker/document-ai.js`, usando a capability documental `extract`. Alterar o comportamento de privacidade do assistente de pré-regulação para acomodar documentos identificáveis está descartado.

### Dados e logs

Conteúdo do PDF, imagem de página, OCR/texto extraído, nome de paciente, CPF, CNS, telefone, endereço, nascimento, CID, diagnóstico, prescrição, nome de arquivo e ID do Drive:

- não entram no PostHog;
- não entram em logs técnicos;
- não são persistidos no D1 como conteúdo;
- não são incorporados ao cache estático/PWA;
- não são versionados no GitHub.

Telemetria da Fase 5 deve usar apenas eventos e propriedades técnicas allowlisted, como operação, duração, resultado técnico e faixa de tamanho.

### Provider documental aprovado — custo zero

Por decisão do operador, a IA documental do Titon **não pode gerar cobrança automática**.

Provider aprovado para esta frente:
- runtime: **Cloudflare Workers AI** pelo binding nativo `AI`;
- principal: `@cf/google/gemma-4-26b-a4b-it`;
- fallback: `@cf/qwen/qwen3.8-27b`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- nenhum AI Gateway pago, crédito pré-pago ou modelo fora da allowlist pode ser usado como fallback silencioso;
- ao esgotar a franquia gratuita, o fluxo deve falhar fechado com aviso de limite diário, nunca migrar para modelo pago.

O Gemini API deixa de ser provider da **IA documental** do Titon. `GEMINI_API_KEY` e as variáveis Gemini existentes podem continuar no Worker por outros módulos do Portal, especialmente a pré-regulação; essa separação não autoriza reutilizar o assistente de pré-regulação para documentos identificáveis.

## Princípio de isolamento por página

Para as rotinas restritivas, o modelo não deve receber o PDF inteiro e ser instruído apenas por texto a “não misturar páginas”.

Fluxo obrigatório:

1. o Portal prepara uma página por vez;
2. cada página é enviada isoladamente ao provider;
3. **uma única inferência multimodal por página** retorna `pageType` e, quando autorizada, os campos estruturados;
4. o número da página permanece metadado técnico do backend e nunca depende do modelo;
5. páginas `outro` retornam sem bloco de extração;
6. páginas independentes podem ser processadas com concorrência limitada, sem compartilhar contexto entre elas;
7. a montagem da resposta final apenas concatena blocos já vinculados à origem.

Isso transforma “não misturar páginas” em restrição de arquitetura, não somente em instrução linguística.

## Artefatos de prompt versionados

A implementação deve manter rotinas independentes:

- `PROMPT_CLASSIFICACAO_PAGINAS_V1`;
- `PROMPT_EXTRACAO_REGULACAO_V1`;
- `PROMPT_ANALISE_REGULACAO_V1` — caminho principal de classificação + extração em uma inferência;
- `PROMPT_DOCUMENT_CHAT_V1`;
- `PROMPT_VALIDACAO_V1`.

Cada versão registra objetivo, entrada permitida, saída esperada e casos de teste. Alterar uma rotina não altera automaticamente as demais.

## Saída estruturada

A extração institucional deve retornar JSON tipado antes de qualquer formatação visual. Cada campo deve ter estado explícito:

- `encontrado`;
- `nao_consta`;
- `ilegivel`.

A camada visual converte esses estados para o texto institucional correspondente.

### Comprovante de Atendimento

A página é autorizada quando o título/cabeçalho/nome visível identifica claramente **COMPROVANTE DE ATENDIMENTO**, **CONTROLE DE ATENDIMENTO** ou **DADOS**.

Bloco previsto:

- nome do paciente;
- CPF;
- CNS;
- data de nascimento;
- nome da mãe;
- telefone;
- endereço;
- agente.

Transformações automáticas são mínimas e explicitamente autorizadas: **CNS sem espaços/apenas sequência numérica** e **data de nascimento em `dd/mm/aaaa` quando a leitura for inequívoca**. Todo o restante preserva literalidade.

### Página médica autorizada

São autorizadas páginas cujo título/cabeçalho/nome visível identifique claramente, com pequenas variações de caixa, acentuação ou singular/plural:

- GUIA DE ENCAMINHAMENTO;
- ENCAMINHAMENTO / ENCAMINHAMENTOS;
- RECEITA SIMPLES;
- LAUDO MÉDICO;
- RECEITUÁRIO MÉDICO;
- SOLICITAÇÃO DE EXAMES;
- SOLICITAÇÃO DE AGENDAMENTO;
- SOLICITAÇÃO DE AGENDAMENTO RETORNO.

Cada página válida gera bloco próprio com proveniência, incluindo quando disponível:

- título encontrado;
- motivo do encaminhamento;
- médico;
- CRM/RMS;
- procedimento solicitado;
- código do procedimento;
- CID;
- descrição do CID.

Nenhum campo pode ser completado a partir de outra página.

## Subfases

### 5A — Fundação segura

- módulo backend separado;
- feature gate da IA documental;
- contratos de permissão `extract`;
- painel lateral inicialmente controlado por flag;
- prompts/versionamento;
- schemas estruturados;
- testes de privacidade e autorização.

Nenhum PDF real precisa ser enviado a um provedor externo nesta subfase.

### Aceite 5A — concluído

A fundação foi concluída com gates fail-closed, capability `extract`, painel oculto, prompts versionados, contratos estruturados e testes de privacidade/autorização. Nenhum conteúdo documental foi enviado a provedor externo. A integração pode ser feita sem ativar a IA em produção.

### 5B — Classificação por página

Estado: **concluída e aceita sinteticamente para integração**.

Implementação:
- gerar representação efêmera de uma página por vez no PDF.js;
- enviar somente a imagem dessa página e o número técnico ao backend;
- limitar MIME a JPEG/PNG e tamanho a 3 MiB;
- classificar `comprovante_atendimento`, `pagina_medica_autorizada` ou `outro`;
- ancorar o número da página no backend usando o header técnico; qualquer número ausente/divergente devolvido pelo modelo é ignorado para fins de proveniência;
- exibir classificação e proveniência sem persistir conteúdo;
- usar provider mockável em testes, sem documento clínico real;
- manter os gates produtivos desligados durante toda a validação 5B.

Aceite pendente: suíte integrada e regressão de navegador verdes; nenhum uso real do provedor é necessário para o aceite sintético desta subfase.

Aceite 5B: 306/306 testes, navegador 75 passed/3 skipped esperados, staging/governança/site verdes; nenhum conteúdo clínico real foi enviado ao provedor e os gates produtivos permanecem desligados.

### 5C — Extração restritiva

Estado: **concluída e aceita sinteticamente no PR #217**.

Implementação:
- histórico 5C: reclassificar a mesma página imediatamente antes da extração. **Esse desenho foi supersedido na 5E otimizada**, pois produzia duas inferências e podia classificar a mesma página de forma divergente;
- permitir extração apenas de `comprovante_atendimento` e `pagina_medica_autorizada`;
- enviar uma única imagem JPEG/PNG da página, com número técnico e tipo autorizado; nenhum nome de arquivo, ref ou ID do Drive;
- usar schema fechado por tipo de página e rejeitar campos extras, campos ausentes, tipo divergente ou proveniência divergente;
- representar cada campo com `encontrado`, `nao_consta` ou `ilegivel`;
- limpar qualquer valor quando o estado não for `encontrado`;
- exigir literalidade para todo campo `encontrado`;
- exibir resultado estruturado no painel sem persistência;
- permitir copiar um campo ou o bloco estruturado no navegador;
- “Ver origem” navega para a página vinculada ao resultado;
- manter `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false` em produção.

Critérios sintéticos da 5C:
1. página `outro` nunca alcança a rotina de extração;
2. o provider recebe uma única página por chamada;
3. proveniência ou tipo divergente falha fechado;
4. `NÃO CONSTA` e `ILEGÍVEL` nunca carregam texto residual;
5. nenhum identificador documental entra na chamada técnica fora do conteúdo visual da própria página;
6. resultados estruturados da extração permanecem separados de futuras respostas livres da 5D.

Aceite 5C: **314/314 testes** na suíte integrada, navegador **75 passed / 3 skipped esperados**, staging, governança e site verdes. Nenhum documento clínico real foi enviado ao provedor; os gates produtivos permaneceram desligados.

### 5D — Perguntas sobre o documento

Estado: **concluída e aceita sinteticamente para integração**.

Implementação:
- painel conversacional separado da extração institucional;
- chat recebe somente evidências estruturadas já extraídas na sessão atual;
- nenhuma imagem, nome de arquivo, ref ou ID do Drive acompanha a pergunta 5D;
- evidências permanecem somente em memória e são descartadas ao fechar/trocar o PDF;
- máximo de 12 páginas de evidência por pergunta;
- respostas comuns exigem ao menos uma citação textual `[p. N]` e lista de páginas coerente com as evidências;
- citações para páginas ausentes são rejeitadas no backend;
- `NÃO CONSTA` e `ILEGÍVEL` permanecem respostas terminais explícitas;
- respostas livres entram somente em `documentAiChatHistory` e não alteram classificação/extração institucional;
- botões das páginas citadas levam à origem no visualizador;
- produção continua com os dois gates da IA documental desligados.

Critérios sintéticos da 5D:
1. pergunta sem evidência não é enviada;
2. evidência duplicada ou estruturalmente inválida falha fechado;
3. provider recebe somente pergunta + evidência estruturada paginada;
4. resposta sem proveniência é rejeitada;
5. resposta citando página fora das evidências é rejeitada;
6. histórico de chat é efêmero e separado dos resultados 5C;
7. nenhum conteúdo do chat entra em telemetria técnica.

Aceite 5D: **320/320 testes** na suíte integrada, navegador **75 passed / 3 skipped esperados**, staging, governança e site verdes após reconciliação com a `main` atual. A reconciliação incorporou 83 commits posteriores sem arquivos sobrepostos ao escopo 5D. Nenhum documento real foi enviado ao provedor e os gates produtivos permaneceram desligados.

### 5E — Homologação real controlada

Estado: **homologação real em andamento. O runtime Gemini corrigido chegou a 8 aprovados / 2 falhas, revelou reclassificação redundante e latência excessiva; a próxima rodada migra a IA documental para Workers AI free-only com uma inferência por página.**

Artefatos preparados:
- wrapper Worker preview-only `worker/homologation-5e.js`;
- laboratório sintético em `/homologacao-5e/`;
- seis fixtures adversariais geradas em canvas no navegador;
- procedimento de preparo `preparar-homologacao-5e.mjs`;
- procedimento fail-closed de encerramento `encerrar-homologacao-5e.mjs`;
- workflow operacional específico da 5E;
- documentação completa em `CENTRAL-DOCUMENTOS-HOMOLOGACAO-5E.md`.

Matriz real:
- comprovante sintético completo;
- duas páginas médicas com valores conflitantes para detectar mistura;
- campo ausente;
- campo ilegível/borrado;
- página não autorizada contendo prompt injection;
- classificação `outro` sem extração;
- perguntas por evidência para páginas específicas;
- `NÃO CONSTA` e `ILEGÍVEL` no chat;
- confirmação de ausência de mistura entre páginas;
- encerramento D1 + gates false + HTTP bloqueado.

Isolamento:
- somente uma versão preview do Worker pode ter os gates da IA `true`;
- `DOCUMENTS_DRIVE_WRITE_ENABLED=false` é obrigatório;
- produção não é promovida pelo procedimento;
- login é restrito ao usuário autorizado pelo controle D1;
- cada rota de IA exige marcador sintético adicional;
- o laboratório aceita o alias Worker 5E apenas em memória, sem persistência;
- o endereço aceito é exatamente o alias oficial `central-docs-phase5e-...workers.dev`;
- conteúdo real de paciente é proibido nesta homologação.

Pré-condição do provider:
- o preparo 5E exige o binding nativo `AI` do Workers AI;
- a homologação não exige mais `GEMINI_API_KEY` para a IA documental;
- o preview força `DOCUMENTS_AI_FREE_ONLY=true`, Gemma 4 como principal e Qwen 3.8 como único fallback;
- a confirmação humana `PREPARAR HOMOLOGACAO 5E` continua obrigatória antes de qualquer janela real.

## UX aprovada do Titon — extração em um clique

A classificação e a extração permanecem separadas **internamente**, mas deixam de ser etapas manuais da interface final.

Fluxo aprovado:

1. usuário abre o PDF;
2. clica **Extrair dados do PDF**;
3. Titon obtém a quantidade de páginas no PDF.js;
4. prepara JPEG efêmero de cada página, sem nome/ID do Drive;
5. processa até **3 páginas independentes em paralelo**;
6. cada página usa **uma inferência** para classificar e extrair;
7. páginas `outro` são ignoradas;
8. páginas autorizadas são armazenadas somente em memória e geram blocos separados;
9. o resultado final mostra número da página e ação **Ver página**;
10. **Copiar dados** gera o modelo institucional completo;
11. o chat permanece opcional/secundário e recebe somente evidências estruturadas já extraídas.

Se ocorrer erro inesperado no meio da varredura, o Titon descarta o resultado parcial em vez de apresentá-lo como documento completo.

## Fora de escopo da Fase 5

- acelerar autosync do Drive: Fase 7;
- automação antecipatória em segundo plano: Fase 6;
- diagnóstico, prescrição, classificação de risco ou decisão clínica;
- gravar automaticamente resultados de IA em sistemas externos;
- ampliar permissões de usuário por causa da IA.


### V7 — baixa latência visual

A V7 foi integrada pela PR #280 para atender ao novo requisito operacional de reduzir o tempo de extração em pelo menos 2x sem reabrir fases anteriores nem reduzir as proteções da 5E.

Referências congeladas do próximo reteste:
- source ref: `28a4916840f450b2caa7d93138d0e127a5db1a88`;
- Pages imutável: `https://0c46e41f.portal-regulacao-central-staging.pages.dev`.

O fast path usa Moondream 3.1 somente no preview controlado; produção permanece com o fast path e a IA documental desligados. Gemma/Qwen continuam como rede de segurança. O aceite exige a matriz 10/10 e `duracao_extracao_ms` <= 50% da V6 em comparação operacional equivalente.

A janela V6 existente deve ser encerrada fail-closed antes de qualquer preparo V7. Não reutilizar o controle V6.

## Próximo passo atual

A V7 de baixa latência foi integrada pela PR #280.

Referências congeladas do próximo reteste:
- source ref: `28a4916840f450b2caa7d93138d0e127a5db1a88`;
- Pages imutável: `https://0c46e41f.portal-regulacao-central-staging.pages.dev`;
- versão IA documental: `phase5e-v7-low-latency-vision`.

A janela V6 aberta pelo operador continua sendo a janela controlada anterior e deve ser encerrada fail-closed antes de qualquer preparo V7. Depois do encerramento, atualizar os scripts locais para a `main`, executar o readiness e confirmar que ele aponta exatamente para as referências V7 acima. Somente então abrir uma nova janela e executar a matriz uma única vez.

O aceite da V7 exige simultaneamente **10/10** e `duracao_extracao_ms` em no máximo 50% da V6 numa comparação operacional equivalente. Se a meta de 2x não for atingida, avançar para o caminho híbrido text-layer + visão seletiva já documentado, sem reduzir privacidade ou precisão.

Produção permanece com `DOCUMENTS_AI_ENABLED=false`, `DOCUMENTS_AI_PROCESSING_ENABLED=false` e `DOCUMENTS_AI_FAST_VISION_ENABLED=false`.


### V7B — correção de gargalos medidos

A V7 real passou 10/10, mas levou 21,428 s. A V7B corrige apenas causas observadas:
- round-trips D1 redundantes no wrapper 5E;
- preflight não cacheado;
- dupla validação da sessão documental;
- prompt Moondream longo que não resultou em nenhuma página final aceita.

Referências congeladas:
- source ref: `5e27d58a09751363392b1ee1c7560be3f5f473cc`;
- Pages: `https://18727b6f.portal-regulacao-central-staging.pages.dev`.

A V7B não altera produção, modelo principal de fallback, resolução ou política de custo. O aceite exige manter 10/10 e demonstrar redução objetiva do overhead e do número de tentativas.


### V7B probe-fixed

A primeira abertura V7B foi interrompida em 6/8 por divergência do probe HTTP, antes de qualquer ativação deliberada do controle. A PR #294 restaurou a prova operacional 403 antes / 401 depois apenas na rota de leitura usada pelo preparador e preservou o caminho quente otimizado da IA.

Referências finais para o próximo reteste:
- source ref: `09bf379f306579bcb7ca049ad02d4c6a94c1df67`;
- Pages: `https://20627e1a.portal-regulacao-central-staging.pages.dev`.

O procedimento de recuperação local `recuperar-preparo-5e.mjs --recuperar` deve ser executado antes de repetir o readiness, pois existe um marcador de upload anterior incerto criado por desenho fail-closed.


### V7C — pageType estrutural + autorização D1 consolidada

A V7B real passou 10/10, mas manteve 17,154 s de extração. A V7C ataca os dois gargalos restantes medidos:
- `DOCUMENT_AI_PAGE_TYPE_INVALID` em todas as tentativas Moondream;
- ~5 s/página fora do provider.

Referências congeladas:
- source ref: `d99a6642dc38b6d9a9bb27d2a7ba06f9335ffce7`;
- Pages: `https://82985cc2.portal-regulacao-central-staging.pages.dev`.

O tipo da página só é derivado quando o conjunto de chaves de `fields` coincide **exatamente** com um dos contratos autorizados, ou quando `fields={}`. Não há inferência de valores nem ampliação de schema.

No caminho quente 5E, assinatura do token é verificada localmente e uma única consulta D1 `first-primary` reúne usuário ativo, versão da sessão, capability documental, role adicional e controle revogável. O router continua recebendo usuário pré-validado.


### V7D — Gemma direto

A V7C real passou 10/10 em 13,748 s, mas Moondream terminou 0/6 e consumiu ~2,1–5,0 s por página antes do Gemma.

A V7D desliga o fast path Moondream no preview 5E e usa Gemma 4 diretamente. Qwen permanece como fallback/revisor focal.

Referências congeladas:
- source ref: `208639f021ca9d5f86a2df97a9bd8a5978e5224f`;
- Pages: `https://b5b3f33e.portal-regulacao-central-staging.pages.dev`.

O resumo seguro também passa a informar `revisao_alterou=` com nomes de campos, sem valores. Isso permitirá decidir com evidência se a revisão Qwen da página ilegível é necessária ou apenas custo extra.


### V7E — Gemma controlado

A V7D real falhou 2 casos e ficou mais lenta que a V7C. A V7E busca reduzir variabilidade sem reintroduzir Moondream:
- concorrência 4;
- máximo 700 tokens na análise integrada;
- máximo 350 tokens na revisão;
- `titulo` revisado na mesma chamada Qwen quando já houver revisão por CID/ilegibilidade.

Referências congeladas:
- source ref: `5fe6d24bb1b26b039a0221b0224201692cdf11ef`;
- Pages: `https://ffdd1515.portal-regulacao-central-staging.pages.dev`.

Critério: recuperar 10/10 e superar os 13,748 s da V7C. Se não ocorrer, encerrar a linha V7.x e avançar para V8 híbrida.


### V7F — último experimento image-only

A V7E passou 10/10 em 12,008 s. A V7F testa uma última hipótese derivada do scheduling observado:
- concorrência 5;
- sem Qwen apenas no caso exato Gemma CID=ilegivel + descrição encontrada + nenhum outro campo ilegível.

Referências congeladas:
- source ref: `6e30117a1e0c342cb84d4cdf1f1a2f7351d86c82`;
- Pages: `https://58d9fc14.portal-regulacao-central-staging.pages.dev`.

Meta: 10/10 e aproximadamente 6–6,5 s. Se não ocorrer, não criar V7G; avançar para V8 híbrida.


### V7G — teste final image-only
- source ref: `ba7d8a369940a9613a436b6b0f572bdedb99375f`;
- Pages: `https://0e5a1474.portal-regulacao-central-staging.pages.dev`;
- única mudança funcional: concorrência de páginas 5 → 6;
- V7F permanece baseline de rollback: 10/10 em 6,830 s;
- se V7G não mantiver 10/10 ou não melhorar de forma material, encerrar V7.x e avançar para V8 híbrida.


### V8A — crop visual adaptativo
- source ref: `5268ed9984c6d792e1f3eb12e1d8f168d32d39a9`;
- Pages: `https://09560ba9.portal-regulacao-central-staging.pages.dev`;
- baseline de comparação: V7F 10/10 em 6,830 s;
- imagem renderizada continua sendo fonte de verdade;
- recorte remove somente áreas vazias, com text layer apenas como salvaguarda geométrica;
- resumo seguro mede `imagem_area_pct`;
- critério: 10/10 e ganho material sobre 6,830 s.
