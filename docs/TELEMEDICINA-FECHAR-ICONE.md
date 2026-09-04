# Telemedicina — ícone de fechar dos modais

Decisão visual permanente registrada em 04/09/2026.

## Regra

As janelas do módulo `/telemedicina/` que usam `.portal-modal-close` devem exibir o ativo `assets/Fechar-icon.png` no botão de fechamento, em vez de depender visualmente do caractere `×`.

A regra vale para os modais estáticos do módulo e também para modais criados dinamicamente, como a correção de cadastro.

## Implementação

- o texto `×` pode permanecer no DOM como fallback, mas fica oculto visualmente quando o estilo do módulo está carregado;
- o ativo deve ser centralizado no botão, preservando a área de clique existente;
- a alteração é restrita à Telemedicina e não deve mudar os botões de fechar de outros módulos sem pedido específico;
- quando o CSS ou o próprio ativo for alterado, atualizar também o identificador de versão usado pela página para evitar que navegadores mantenham a versão antiga em cache.
