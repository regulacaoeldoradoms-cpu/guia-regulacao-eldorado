# Telemedicina — modo sem animações V23

Decisão permanente registrada em 08/09/2026.

## Motivo

Persistiu na rota `/telemedicina/` um deslocamento visual indesejado durante a carga e a operação, mesmo depois das tentativas de estabilização V21 e V22. Como a origem não pôde ser isolada com segurança, a decisão de produto passou a ser remover qualquer camada de movimento ou sonificação dessa página, priorizando estabilidade operacional.

## Regra vigente

Na rota `/telemedicina/`:

- nenhuma animação CSS deve executar;
- nenhuma transição CSS deve executar;
- View Transitions ficam desativadas;
- rolagem suave fica desativada;
- efeitos de hover ou pressão não podem mover, elevar, ampliar ou reduzir controles;
- confetes, fogos ou qualquer celebração animada ficam ocultos;
- a camada central `PortalInteractions` não executa movimento, som, gerenciamento de estados animados ou microinterações nessa rota;
- a antiga proteção V22 não executa restauração manual, pinagem, correção ou reposicionamento automático do viewport;
- alterações funcionais de estado continuam permitidas: abrir e fechar modal, filtrar, salvar, excluir, programar retorno, trocar visualização e atualizar textos continuam funcionando, porém sem movimento decorativo.

## Implementação

`css/telemedicina-viewport-v22.css`, já carregado no `<head>` da rota, passa a funcionar como guarda de movimento zero. Ele neutraliza `animation`, `transition`, `scroll-behavior: smooth`, View Transitions e transforms de hover/active nos principais controles da Telemedicina.

`js/telemedicina-viewport-v22.js`, também carregado antes do restante da aplicação, não executa mais a lógica V22. Ele:

1. deixa `history.scrollRestoration` sob comportamento normal do navegador;
2. não adiciona a classe de pinagem V22;
3. expõe `TelemedicineViewportV22` apenas como fachada inerte;
4. instala antes de `portal-interactions.js` uma fachada `PortalInteractions` inerte, fazendo com que o gerenciador central encerre a inicialização nessa rota;
5. mantém métodos no-op compatíveis com chamadas opcionais dos scripts existentes, sem alterar regras de negócio.

## Escopo

A decisão é exclusiva de `/telemedicina/`. O restante do Portal continua utilizando normalmente a linguagem global de interação, sons, estados e animações definida em `docs/PORTAL-INTERACTIONS-V1.md`.

Não há alteração de autenticação, autorização, regras assistenciais, APIs, persistência, dados de pacientes, lógica de retorno, notificações do navegador ou permissões.

## Critério de regressão

Qualquer mudança futura que reintroduza animação, transição, View Transition, rolagem suave, deslocamento de hover/pressão, som da camada central ou manipulação automática de viewport em `/telemedicina/` deve ser tratada como regressão até que exista decisão expressa em contrário.
