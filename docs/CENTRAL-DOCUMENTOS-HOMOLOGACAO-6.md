# Central de Documentos — Homologação operacional da Fase 6

Data: 20/09/2026.

## Objetivo

Comprovar o critério final do Guia Mestre para a Fase 6:

1. redução mensurável de tempo operacional;
2. sem perda de controle do usuário.

A implementação 6A–6E já está integrada na `main`. Esta homologação não introduz código novo, não altera permissões e não ativa IA antecipatória em produção.

## Referências congeladas

- merge da implementação: `87b7b7b274d8d6392bfacd85e18eab19dc672885`;
- head funcional: `de1ddc5de6346da0911e6e2fc7ca86abb2b260a9`;
- Pages staging do head funcional: `https://a2d88ca3.portal-regulacao-central-staging.pages.dev`;
- comparação head → merge: zero arquivos diferentes;
- CI: 27 workflows/checks verdes.

## Regras de segurança

Durante a homologação:
- não ativar `DOCUMENTS_AI_BACKGROUND_ENABLED` em produção;
- não alterar `DOCUMENTS_AI_ENABLED` ou `DOCUMENTS_AI_PROCESSING_ENABLED` em produção;
- não testar escrita automática;
- não usar nome, CID, diagnóstico ou conteúdo clínico como sinal de prioridade;
- não registrar nome de arquivo, ref, fileId, cacheKey ou conteúdo no PostHog;
- tarefas em background devem ser canceláveis e preemptadas pela ação do usuário.

## Matriz operacional

### Caso 1 — abertura/primeira página sem regressão

Procedimento:
1. abrir a Central;
2. abrir um PDF de tamanho habitual;
3. confirmar que a primeira página aparece normalmente;
4. rolar imediatamente enquanto o background pode estar ativo.

Aceite:
- primeira página não fica bloqueada por automação;
- rolagem permanece responsiva;
- nenhuma mensagem de erro de automação interfere no uso.

Evidência técnica esperada:
- eventos existentes `pdf_open_started`, `pdf_first_page_visible`, `pdf_ready`;
- tarefas de background podem aparecer separadamente como `document_background_task`.

### Caso 2 — cache/prefetch gera ganho real

Procedimento:
1. permanecer alguns segundos numa pasta/lista contendo PDFs pequenos elegíveis;
2. abrir um PDF que tenha sido provável candidato de aquecimento;
3. fechar;
4. reabrir o mesmo PDF ou outro item aquecido.

Aceite:
- ao menos um fluxo observado deve mostrar abertura por cache significativamente mais rápida que abertura sem cache;
- o ganho pode ser comprovado por `cache_state=hit` e duração menor nos eventos de PDF;
- nenhuma identidade documental deve aparecer na telemetria.

Observação:
- a Fase 2 já comprovou o benefício do cache criptografado; na Fase 6 o objetivo é comprovar que a preparação antecipatória consegue transformar pelo menos uma próxima ação em cache hit ou reduzir espera perceptível.

### Caso 3 — troca de documento cancela background antigo

Procedimento:
1. abrir um PDF;
2. antes de aguardar todo preparo de fundo, fechar/trocar para outro PDF.

Aceite:
- nenhuma sugestão/resultante do PDF anterior aparece no novo documento;
- tarefas antigas são canceladas/expiradas;
- o novo PDF funciona normalmente.

Evidência técnica esperada:
- `document_background_task` com estado `cancelled` e motivo técnico `document_changed` ou equivalente allowlisted.

### Caso 4 — entrar no editor preempta background

Procedimento:
1. abrir PDF;
2. clicar em **Editar PDF** enquanto houver preparo oportunista possível;
3. usar o editor normalmente.

Aceite:
- editor abre sem aguardar tarefas de background;
- preparo de IA/imagem efêmera do viewer é descartado;
- nenhuma tarefa de fundo altera o PDF;
- sincronização continua sob as regras da Fase 4.

Evidência técnica esperada:
- cancelamento técnico com motivo `editor` quando aplicável.

### Caso 5 — próxima ação sugerida continua sob controle humano

Procedimento:
1. abrir um PDF;
2. aguardar eventual mensagem discreta de preparo;
3. confirmar que nenhuma extração, edição, exclusão ou salvamento começa sozinha.

Aceite:
- sugestão é apenas informativa;
- qualquer fluxo com efeito exige clique/ação humana.

### Caso 6 — IA antecipatória permanece fail-closed em produção

Aceite:
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false` em produção;
- nenhuma chamada antecipatória ao provider ocorre por esse gate;
- o fluxo normal de IA documental continua separado e controlado.

## Evidência mínima para encerrar a Fase 6

A Fase 6 pode ser encerrada quando houver evidência real de:
- pelo menos um ganho operacional mensurável por preparação antecipatória/cache;
- nenhuma regressão de abertura/primeira página;
- cancelamento ao trocar documento;
- prioridade do editor/ação foreground;
- nenhuma ação destrutiva automática;
- observabilidade sem dados sensíveis.

Não é necessário ligar IA antecipatória em produção para encerrar a Fase 6. O gate pode permanecer `false`; a infraestrutura e o controle humano podem ser homologados independentemente.

## Achado durante a validação — botão IA fantasma

Foi encontrada uma regressão visual: o botão lateral IA documental aparecia mesmo com a IA produtiva desabilitada. A causa era CSS autoral de `.documents-rail-tool` sobrescrevendo o comportamento nativo de `hidden`.

A lógica de gate permaneceu fail-closed e o clique não abriu o painel nem ativou IA. A correção exige que ferramentas laterais com `hidden` usem `display:none !important`.

Após o deploy da correção, validar:
- com IA documental desabilitada, botão IA ausente;
- quando futuramente `enabled=true` de forma controlada, o mesmo botão pode ser exibido e deve abrir o painel normalmente.

## Resultado

Pendente de conclusão da validação operacional real após a correção visual.

## Próxima ação

Usar a Central normalmente após o merge #342 e coletar a evidência técnica da sessão. Se os critérios acima forem comprovados, registrar o aceite da Fase 6 e avançar para a Fase 7 — Robustez e otimização contínua.
