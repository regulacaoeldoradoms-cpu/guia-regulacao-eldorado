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
- manter `DOCUMENTS_AI_BACKGROUND_ENABLED=false` em produção;
- a IA documental normal pode permanecer ativa após a publicação controlada V1, com `DOCUMENTS_AI_ENABLED=true` e `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- a ativação normal não amplia permissões: toda rota continua exigindo capability `extract`;
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
- com a IA documental normal habilitada de forma controlada, o botão aparece somente para conta autorizada e deve abrir o painel normalmente.

## Publicação controlada da IA documental normal

Em 20/09/2026 o operador autorizou explicitamente o uso produtivo da IA documental já aprovada na Fase 5. A publicação ativa somente o fluxo iniciado por clique do usuário:

- `DOCUMENTS_AI_ENABLED=true`;
- `DOCUMENTS_AI_PROCESSING_ENABLED=true`;
- `DOCUMENTS_AI_BACKGROUND_ENABLED=false`;
- `DOCUMENTS_AI_FREE_ONLY=true`;
- `DOCUMENTS_AI_FAST_VISION_ENABLED=false`.

A mudança não liga preextração em background, não altera Drive/autosync e não concede capability a contas que não possuam `extract`.

## Resultado

Pendente de conclusão da validação operacional real da Fase 6; a publicação normal da IA é uma mudança transversal autorizada e não encerra a Fase 6 por si só.

## Próxima ação

Usar a Central normalmente após o merge #342 e coletar a evidência técnica da sessão. Se os critérios acima forem comprovados, registrar o aceite da Fase 6 e avançar para a Fase 7 — Robustez e otimização contínua.


## Ajuste de UX aprovado durante a homologação — lista integral + Titon integral

Antes do aceite final da Fase 6, o operador aprovou simplificar a superfície da Central:

- sem PDF em primeiro plano, a lista ocupa toda a largura útil;
- no desktop, clique simples seleciona PDF, duplo clique abre no Titon e `Enter` abre o PDF selecionado;
- em mobile/touch, o PDF oferece ação explícita **Abrir no Titon**;
- ao abrir, o Titon ocupa a mesma superfície integral e fica em primeiro plano;
- a lista permanece montada e preservada em segundo plano, sem nova consulta ao Drive ao fechar;
- o X fecha somente o Titon e devolve foco/visibilidade à lista preservada;
- pesquisa, pasta, resultados, seleção e posição de rolagem devem permanecer intactos;
- o fluxo **Unir PDF** preserva a seleção de outro documento: o painel oferece **Escolher PDF da Central**, traz a lista temporariamente ao primeiro plano e retorna ao Titon após a seleção.

### Aceite visual adicional

Na validação humana da Fase 6, confirmar:
1. lista usa a largura integral quando o Titon está fechado;
2. clique simples não abre PDF no desktop;
3. duplo clique e `Enter` abrem o PDF selecionado;
4. botão **Abrir no Titon** aparece em mobile/touch;
5. Titon usa largura integral;
6. X retorna à mesma lista, pesquisa e posição de rolagem;
7. unir outro PDF continua funcional pela ação **Escolher PDF da Central**;
8. nenhuma nova consulta ao Drive é causada apenas pelo retorno do Titon à lista.


## Casos adicionais — Titon conectado ao arquivo real e prevenção de duplicidade

### Caso 7 — renomear o PDF real

Procedimento:
1. abrir PDF autorizado;
2. clicar uma vez no título e confirmar seleção;
3. dar duplo clique e editar somente o nome, com `.pdf` protegido;
4. confirmar com `Enter`;
5. verificar o Google Drive e a lista da Central;
6. repetir em modo Editor PDF.

Aceite:
- o nome real no Drive muda;
- Titon e lista refletem o novo nome sem nova pesquisa obrigatória;
- `Escape` cancela sem escrita;
- conta sem `edit` não renomeia;
- conflito de versão interrompe a operação;
- renomeação não perde alteração de conteúdo pendente do editor.

### Caso 8 — zoom visível

Aceite:
- percentual entre − e + é legível em preto/escuro;
- atualiza conforme zoom muda;
- clicar no percentual mantém o comportamento de restaurar zoom.

### Caso 9 — dois usuários no mesmo PDF

Procedimento:
1. usuário A abre um PDF;
2. usuário B, em outra conta autenticada, abre o mesmo PDF;
3. observar ambos os Titons;
4. usuário A entra no editor;
5. fechar uma das sessões e aguardar atualização.

Aceite:
- presença simultânea gera borda laranja e aviso;
- o aviso pode identificar o outro operador autenticado;
- quando alguém edita, o destaque/aviso aumenta de importância;
- fechar a sessão remove a presença; encerramento abrupto expira em até 75 s;
- nenhuma ação é bloqueada somente pela presença;
- conflito real de Drive continua fail-closed;
- duas abas do mesmo username não geram falso alerta de “outro usuário”;
- nenhuma identidade documental ou conteúdo vai para observabilidade externa.


## Caso adicional — painel IA compacto e resultados por categoria

Procedimento:
1. abrir PDF e painel IA;
2. confirmar que a tela inicial mostra essencialmente **Extrair dados do PDF**;
3. abrir o botão **i** e confirmar que as explicações continuam acessíveis;
4. extrair o documento;
5. conferir separação por página e categorias **Paciente**, **Encaminhamento**, **Solicitação** e **Profissional** conforme os campos existentes;
6. copiar individualmente nome do paciente, motivo do encaminhamento, CID, médico e CRM/RMS;
7. testar **Copiar esta página** e **Copiar tudo**;
8. abrir o chat opcional somente após a extração.

Aceite:
- nenhum novo request de IA ocorre ao organizar ou copiar os resultados;
- cópia individual leva somente o valor exibido do campo;
- páginas não são misturadas;
- informação técnica fica fora do fluxo principal;
- nenhuma mudança em provider/modelos/gates.
