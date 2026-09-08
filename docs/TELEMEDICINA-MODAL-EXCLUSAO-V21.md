# Telemedicina — Modalidade e exclusão de acompanhamentos V21

## Decisão de produto

A partir da V21, qualquer janela modal da Telemedicina deve se comportar como um diálogo verdadeiramente modal: enquanto estiver aberta, somente os controles contidos nela podem receber clique, toque, foco ou navegação por teclado. O conteúdo de fundo permanece visível, mas fica inerte até o fechamento da janela.

No desktop, a Telemedicina não usa `backdrop-filter` nem transformações/transições de composição nos modais. Essa restrição é deliberada para evitar a piscada observada em navegadores durante interação com campos nativos, especialmente entradas de data.

## Exclusão de acompanhamento

Cada card de acompanhamento ativo exibe uma ação vermelha `Excluir`, identificada por ícone vetorial profissional de lixeira. A ação sempre exige confirmação em uma janela modal antes de qualquer alteração no backend.

A exclusão é **lógica**, não física:

- o documento do acompanhamento recebe `active: false`;
- são registrados `deletedAt` e `deletedBy`;
- o acompanhamento deixa de aparecer no dashboard e na situação atual do histórico;
- os eventos históricos permanecem preservados para rastreabilidade;
- uma nova teleconsulta para o mesmo paciente e especialidade pode criar/reativar o acompanhamento e limpa os metadados de exclusão.

A rota `DELETE /api/telemedicina/followups/:id` permanece protegida pela mesma autorização de backend da Telemedicina. Ocultar ou exibir o botão no frontend não substitui a validação do Worker.

## Regras técnicas

- O isolamento utiliza `inert` quando disponível e também uma guarda de eventos em fase de captura para impedir interação acidental com o fundo.
- O foco é mantido dentro do modal e a tecla Tab circula entre os controles disponíveis.
- O botão de exclusão usa `data-telemedicine-delete`, separado de `data-action`, para não conflitar com a captura de ações da camada mobile V9.
- O ícone é SVG inline; não são usados emoji ou bibliotecas externas.
- Nenhum dado de paciente, credencial ou conteúdo sensível é versionado nesta implementação.
