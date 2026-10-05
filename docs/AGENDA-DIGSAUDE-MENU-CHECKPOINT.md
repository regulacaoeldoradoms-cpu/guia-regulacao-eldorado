# Agenda: candidato de abertura do menu

Base conferida: main `0de1a25c07b69e5c7b63ff1be5a95c6f3b0192c9`. Branch `fix/agenda-patient-action-menu`. Candidato 1.2.6, cache do coletor `20261005-menu-1`; sem merge/deploy autorizado nesta etapa.

O coletor publicado procurava somente a ação visível, sem abrir os três pontos. A confirmação humana e o vídeo mostram a ação agrupada no dropdown. A fixture de menu fechado reproduziu a falha antes da correção. O candidato abre apenas o menu associado à ação única e aguarda sua visibilidade no mesmo dropdown; Document, rota, sessão, diálogo e telefone continuam vinculados e validados. Estrutura inesperada ou ambígua continua sem destino.

Evidência real parcial: `.fi-dropdown` contém `.fi-dropdown-trigger` e seu botão interno; a ação é agrupada e tem texto exato. A ancestralidade completa do painel não ficou visível. Não declarar árvore nem contatos reais homologados.

Validação reutilizada: 9/9 testes sintéticos focados do patch local, incluindo ambiguidades, cancelamento e troca de dropdown/Document. Na aplicação sobre main, 8/8 testes selecionados de integração/metadados e 4/4 verificações com o coletor completo no navegador sintético passaram: duas fichas, troca de owner e trigger ambíguo, sem clicar outras ações. CI do head final será registrado no PR; nenhum teste real de lista ou mensagem foi executado.

Próximo passo: revisar o diff e planejar observação automática de uma consulta autorizada, sem ativar a lista inteira. O coletor não possui modo unitário. Avisos/sincronização permanecem pausados conforme relato do operador. Não relaxar associação ou usar controles genéricos se o DOM divergir. Preview Worker falho não substitui nem autoriza produção; gates e credenciais preservados.
