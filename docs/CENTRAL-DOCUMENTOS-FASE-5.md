# Central de Documentos — Fase 5: IA documental

Data de início: 18/09/2026.

## Estado

Fase 4 encerrada e publicada. Esta frente começa da `main` após o merge do ajuste transversal da abertura pós-login. A Fase 5 não reabre sincronização, editor, OAuth ou permissões já homologadas.

## Objetivo da fase

Adicionar IA documental à Central sem transformar o assistente de pré-regulação existente em um processador de dados identificáveis. O novo domínio deve:

- exibir um painel de IA ao lado do PDF;
- trabalhar com rotinas oficiais versionadas;
- processar uma página por vez quando a regra exigir isolamento;
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
4. o resultado retorna o mesmo número como proveniência;
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

Bloco inicial previsto:

- nome do paciente;
- CPF;
- CNS;
- data de nascimento;
- nome da mãe;
- telefone;
- endereço;
- agente.

Transformações automáticas devem ser mínimas e explicitamente autorizadas. O padrão inicial é preservar literalidade.

### Página médica autorizada

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
- validar que o número devolvido pelo provider coincide exatamente com a página enviada;
- exibir classificação e proveniência sem persistir conteúdo;
- usar provider mockável em testes, sem documento clínico real;
- manter os gates produtivos desligados durante toda a validação 5B.

Aceite pendente: suíte integrada e regressão de navegador verdes; nenhum uso real do provedor é necessário para o aceite sintético desta subfase.

Aceite 5B: 306/306 testes, navegador 75 passed/3 skipped esperados, staging/governança/site verdes; nenhum conteúdo clínico real foi enviado ao provedor e os gates produtivos permanecem desligados.

### 5C — Extração restritiva

Estado: **implementada; em validação sintética no PR #217**.

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

### 5D — Perguntas sobre o documento

- painel conversacional separado da extração institucional;
- respostas sempre com página(s) de origem;
- nenhuma resposta livre pode contaminar os resultados estruturados da extração.

### 5E — Homologação real controlada

- PDFs sintéticos com campos conflitantes entre páginas;
- campo ausente;
- campo ilegível;
- páginas fora de ordem;
- mais de uma página médica;
- página não autorizada contendo dado tentador;
- confirmação de ausência de mistura entre páginas;
- revisão de privacidade/telemetria.

## Fora de escopo da Fase 5

- acelerar autosync do Drive: Fase 7;
- automação antecipatória em segundo plano: Fase 6;
- diagnóstico, prescrição, classificação de risco ou decisão clínica;
- gravar automaticamente resultados de IA em sistemas externos;
- ampliar permissões de usuário por causa da IA.

## Próximo passo atual

Concluir a validação sintética da 5C no PR #217; se os checks permanecerem verdes, registrar aceite e integrar. Depois iniciar a 5D em branch própria, mantendo os gates produtivos desligados até a homologação 5E.
