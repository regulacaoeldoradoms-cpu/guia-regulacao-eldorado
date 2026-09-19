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

## Princípio de isolamento por página

Para as rotinas restritivas, o modelo não deve receber o PDF inteiro e ser instruído apenas por texto a “não misturar páginas”.

Fluxo obrigatório:

1. o Portal identifica a página candidata;
2. somente aquela página é preparada para a chamada de IA;
3. a chamada recebe o número da página como metadado técnico da requisição;
4. o backend ancora a proveniência nesse metadado e **não confia no modelo para ecoar o número da página**;
5. cada página médica autorizada é extraída em chamada própria;
6. a montagem da resposta final apenas concatena blocos já vinculados à origem.

Isso transforma “não misturar páginas” em restrição de arquitetura, não somente em instrução linguística.

## Artefatos de prompt versionados

A implementação deve manter rotinas independentes:

- `PROMPT_CLASSIFICACAO_PAGINAS_V1`;
- `PROMPT_EXTRACAO_REGULACAO_V1`;
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
- reclassificar a mesma página imediatamente antes da extração, evitando confiar somente em estado antigo do frontend;
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

Estado: **homologação real em andamento; primeira execução real alcançou o provedor, mas a matriz falhou por `DOCUMENT_AI_PAGE_INVALID` antes do aceite**.

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

Possível intervenção futura:
- o preparo consulta a versão produtiva e verifica apenas a **existência/tipo** de `GEMINI_API_KEY`, sem ler o valor;
- se a chave não existir na baseline, o script para antes de qualquer upload/controle ativo com `INTERVENCAO_NECESSARIA_GEMINI_API_KEY_AUSENTE`;
- se existir, o usuário ainda precisará confirmar explicitamente a abertura da janela 5E e executar a matriz no navegador.

## UX aprovada do Titon — extração em um clique

A classificação e a extração permanecem separadas **internamente**, mas deixam de ser etapas manuais da interface final.

Fluxo aprovado:

1. usuário abre o PDF;
2. clica **Extrair dados do PDF**;
3. Titon obtém a quantidade de páginas no PDF.js;
4. percorre as páginas sequencialmente;
5. cada página é enviada isoladamente para classificação;
6. páginas `outro` são ignoradas;
7. páginas autorizadas são extraídas em chamada própria e armazenadas somente em memória;
8. o resultado final mostra um bloco de comprovante e um bloco separado para cada página médica autorizada, sempre com número de página e ação **Ver página**;
9. **Copiar dados** gera o modelo institucional completo;
10. o chat permanece opcional/secundário e recebe somente evidências estruturadas já extraídas.

Se ocorrer erro inesperado no meio da varredura, o Titon descarta o resultado parcial em vez de apresentá-lo como documento completo.

## Fora de escopo da Fase 5

- acelerar autosync do Drive: Fase 7;
- automação antecipatória em segundo plano: Fase 6;
- diagnóstico, prescrição, classificação de risco ou decisão clínica;
- gravar automaticamente resultados de IA em sistemas externos;
- ampliar permissões de usuário por causa da IA.

## Próximo passo atual

A correção funcional foi integrada à `main` pela PR #256 no commit `39ded96a1ef1e2f707f8cf96ae33c96ee405c5d2`. O reteste 5E está congelado nesse source ref e no Pages imutável `https://56753b53.portal-regulacao-central-staging.pages.dev`.

Antes de qualquer reteste, a segunda janela 5E antiga, que executou a matriz no runtime `408bff...`, deve ser **encerrada fail-closed**. Depois, o operador deve executar o verificador read-only; somente com `PRECONDICOES_5E_OK` pode abrir nova janela controlada apontando para as referências corrigidas e repetir a matriz sintética real.

Produção permanece com `DOCUMENTS_AI_ENABLED=false` e `DOCUMENTS_AI_PROCESSING_ENABLED=false`. O check automático Workers Builds do Cloudflare no merge #256 falhou e precisa ser tratado separadamente antes de qualquer publicação produtiva da Fase 5; isso não muda o fluxo preview-only do reteste.
