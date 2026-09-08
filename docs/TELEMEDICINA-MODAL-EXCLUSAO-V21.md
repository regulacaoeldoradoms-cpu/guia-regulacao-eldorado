# Telemedicina — Modalidade e exclusão de acompanhamentos V21

## Decisão de produto

A partir da V21, qualquer janela modal da Telemedicina deve se comportar como um diálogo verdadeiramente modal: enquanto estiver aberta, somente os controles contidos nela podem receber clique, toque, foco ou navegação por teclado. O conteúdo de fundo permanece visível, mas fica inerte até o fechamento da janela.

A rota `/telemedicina/` prioriza estabilidade visual durante a operação. O efeito global de pressão não deve deslocar nem redimensionar controles dessa página, e a animação de atualização de conteúdo não deve mover verticalmente listas, cards ou painéis ao clicar.

**Atualização V23, 08/09/2026:** a exceção deixou de valer somente para os modais. A rota inteira passou a operar sem animações, transições, sons da camada central, View Transitions, rolagem suave ou manipulação automática do viewport. A decisão vigente está em `docs/TELEMEDICINA-SEM-ANIMACOES-V23.md`.

Os quatro indicadores do resumo (`Solicitar agora`, `Atrasados`, `Em aguardo` e `Sem programação`) filtram os acompanhamentos **no ponto atual da página**. O clique nesses indicadores não deve executar `scrollIntoView`, rolagem suave, reposicionamento automático do viewport ou qualquer outro deslocamento vertical. A posição de rolagem existente deve ser preservada enquanto o filtro é aplicado.

As janelas modais da Telemedicina também ficam fora da camada global de microinterações do Portal. Não devem receber animações de pressão, transição, seleção, abertura ou atualização que possam causar repintura perceptível durante o preenchimento dos campos. A prioridade nesses diálogos é estabilidade visual e entrada de dados sem piscadas. Essa exceção vale somente para a Telemedicina e não remove a linguagem global de interação do restante do Portal.

O isolamento do fundo não deve ser reprocessado em cada alteração de classe de controles internos. A observação de DOM deve reagir somente a criação/remoção de modais e a alterações de estado do próprio backdrop, evitando repinturas desnecessárias enquanto o usuário digita ou muda o foco.

## Exclusão de acompanhamento

Cada card de acompanhamento ativo exibe uma ação vermelha `Excluir`, identificada por ícone vetorial profissional de lixeira. A ação sempre exige confirmação em uma janela modal antes de qualquer alteração persistente.

A exclusão é **lógica**, não física:

- o documento do acompanhamento recebe `active: false`;
- são registrados `deletedAt` e `deletedBy`;
- o acompanhamento deixa de aparecer no dashboard e na situação atual do histórico;
- os eventos históricos permanecem preservados para rastreabilidade;
- uma nova teleconsulta para o mesmo paciente e especialidade pode criar/reativar o acompanhamento e limpa os metadados de exclusão.

A rota `DELETE /api/telemedicina/followups/:id` permanece protegida pela mesma autorização de backend da Telemedicina. Ocultar ou exibir o botão no frontend não substitui a validação do Worker.

### Linguagem apresentada ao operador

A confirmação de exclusão deve explicar apenas a consequência operacional relevante: o acompanhamento será removido da lista de retornos ativos e as informações já registradas no histórico serão preservadas. Termos internos de implementação como `backend`, Firestore, exclusão lógica, campos técnicos ou rastreabilidade técnica não devem ser apresentados ao operador na interface.

## Regras técnicas

- O isolamento utiliza `inert` quando disponível e também uma guarda de eventos em fase de captura para impedir interação acidental com o fundo.
- O foco é mantido dentro do modal e a tecla Tab circula entre os controles disponíveis.
- A pressão global `.portal-interaction-pressing` não aplica `transform` na rota `/telemedicina/`.
- A atualização global `.portal-content-updating` não executa animação nem deslocamento na rota `/telemedicina/`.
- Os indicadores com `data-status-filter` preservam `scrollX` e `scrollY`, atualizam `#statusFilter` e disparam o fluxo normal de filtragem sem permitir os handlers legados que chamam `scrollIntoView`.
- Os backdrops da Telemedicina usam `data-portal-interaction-ignore="true"` para não receber as microinterações globais do Portal.
- Os modais da Telemedicina não usam `backdrop-filter`, animação, transformação nem transição de composição.
- Desde a V23, o gerenciador global `PortalInteractions` inteiro permanece inerte em `/telemedicina/`.
- O botão de exclusão usa `data-telemedicine-delete`, separado de `data-action`, para não conflitar com a captura de ações da camada mobile V9.
- O ícone é SVG inline; não são usados emoji ou bibliotecas externas.
- Nenhum dado de paciente, credencial ou conteúdo sensível é versionado nesta implementação.
