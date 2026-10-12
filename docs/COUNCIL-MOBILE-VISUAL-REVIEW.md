# Revisão prática do Conselho no celular

Em preparação, não publicada nem aceita visualmente pelo usuário. Branch separada do Gnomo, sobre a publicação481de260. Nenhum dado real de saúde acessado.

A versão anterior repetia o título, reservava espaço demais para o topo e mostrava seleção/exclusão antes dos casos. A nova composição mantém a identificação e o resumo compactos, rotula os filtros, destaca assunto/status/tipo e organiza ações destrutivas em um disclosure nativo. Protocolo, criação, atualização e serviço permanecem visíveis. O detalhe recupera chips e PDF que ficavam em um espaço praticamente vazio; título e atalhos ficam proporcionais. Os mesmos controles e handlers são mantidos.

A barra usa mountCitizenMobileNavigation e mountHomeMobileDirect, sem outra navegação: Início, Amigos, Chat, Avisos, Mascotes e Perfil. Chat mantém o launcher original dentro da barra e o painel fullscreen acima dela. A opção específica homeLeavesPage faz Início fechar o Chat e navegar ao início a partir do Conselho; o comportamento existente dos demais consumidores permanece intacto. Desktop/print devem restaurar controles e estilos nativos; verificação estrita ainda pendente.

O endpoint já retornava nextPageToken, mas o cliente e a próxima consulta ignoravam o cursor, limitando o uso aos primeiros100registros. O Worker agora repassa o cursor opaco ao mesmo firestoreList autorizado, mantendo100por lote, proteção de identidade e ACL. Mobile renderiza20por página; próximos lotes dependem de pedido explícito. Busca/filtros operam sobre registros carregados, que são contados como carregados, sem alegar busca no acervo inteiro.

Estado fica na memória da sessão: filtros/página/posição e rascunhos por caso. Respostas antigas ou de outro token são descartadas. Atualização recarrega apenas a quantidade de lotes já consultados, mantém a lista anterior identificada como anterior se falhar, e reutiliza linhas que não mudaram. Abrir detalhe consulta o estado fresco; ações móveis atualizam esse detalhe sem buscar novamente toda a lista. Não há decisões clínicas nem triagem automática. Rascunhos não são gravados em storage.

## Evidências e próximos gates

Antes em .local/before-preserved e depois em .local/after-detail-review,320/360/390. Em390 a primeira linha mudou aproximadamente805→479px (preliminar; não representa ganho de rede). Detalhe teve a hierarquia e o espaço do resumo/PDF revistos. Tela completa e fluxo ainda estão sendo avaliados com253registros sintéticos, status variados, assuntos/relatos longos e rede lenta.

A imagem Librarylibfile_f28f73ba886881918ffe6c19feacbb2e não foi visualizada: duas materializações suportadas falharam. A comparação usa a tela atual do código com fixtures, sem alegar correspondência à imagem.

Pendentes: fluxo253com paginação/cursor/atualização/rascunhos, casos vazios/curtos, texto200, presidente/membro/desenvolvedor, navdireta/login/reentrada/Chat, concorrência, controles destrutivos/cancelamento/PDF/anexos, desktop/print estritos, comparação da latência inicial, CI completo e revisão visual. Não considerar concluído apenas por ausência de overflow.
