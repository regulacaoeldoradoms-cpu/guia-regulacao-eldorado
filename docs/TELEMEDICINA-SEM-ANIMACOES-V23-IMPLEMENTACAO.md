# Telemedicina V23 — resumo técnico da implementação

A V23 não altera regras de negócio. Ela transforma a rota `/telemedicina/` em uma exceção de movimento zero.

## Ordem de carregamento aproveitada

`telemedicina/index.html` já carrega `css/telemedicina-viewport-v22.css` e `js/telemedicina-viewport-v22.js` no `<head>`. A V23 reaproveita essa posição antecipada para neutralizar movimento antes das demais camadas, sem introduzir um novo arquivo de runtime ou alterar a ordem dos scripts do módulo.

## JavaScript

`js/telemedicina-viewport-v22.js`:

- confirma que está em `/telemedicina/`;
- remove qualquer classe residual da antiga V22;
- mantém `history.scrollRestoration` no comportamento normal do navegador;
- instala uma fachada `window.PortalInteractions` sem efeitos antes de `js/portal-interactions.js` ser executado;
- fornece métodos no-op compatíveis com chamadas opcionais dos módulos existentes;
- encerra imediatamente a execução;
- conserva a implementação V22 abaixo do `return` apenas para histórico e compatibilidade temporária das validações antigas.

Como `portal-interactions.js` inicia com `if (window.PortalInteractions) return;`, o gerenciador central não registra listeners, MutationObserver, áudio, pressão, animação de conteúdo, foco animado ou som nessa rota.

## CSS

`css/telemedicina-viewport-v22.css` é carregado depois das folhas visuais da Telemedicina e neutraliza:

- `animation`;
- `transition`;
- View Transitions;
- `scroll-behavior: smooth`;
- transforms de hover/active nos controles principais;
- camada de celebração de alta.

O CSS é exclusivo da rota porque somente `telemedicina/index.html` carrega esse arquivo.

## Compatibilidade

Ações funcionais e mudanças instantâneas de cor/estado continuam permitidas. A V23 não remove handlers de formulários, filtros, modais, edição, exclusão, autenticação ou APIs.
