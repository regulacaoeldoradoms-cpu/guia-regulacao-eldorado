# Navegação móvel do cidadão

O shell inicia apenas em tela móvel com conta cidadão. As dez áreas comuns são Home, Amigos, Mascotes, Perfil, Ferramentas, Avisos, Segurança, Configurações, Conquistas e Canal do Cidadão. Catálogo e gates nativos continuam decidindo acesso; módulos profissionais não são pré-carregados.

Cada área visitada registra seu inicializador e mantém DOM, rascunhos, foco e rolagem em memória. Uma área fica conectada; barra, Chat e mascote têm os mesmos donos durante a navegação. Scripts da resposta HTML não são executados. Desktop usa navegação nativa; impressão e saída do breakpoint recuperam apresentação própria da área. Logout/troca de conta encerram o shell e o estado privado anterior.

## Limites

- Cache de até16áreas por caminho/query. Home, Mascotes e áreas editadas são protegidas. Áreas inativas sem edição podem ser expulsas; se todas estiverem protegidas, a próxima abertura é recusada com aviso. A marca de edição é conservadora e pode continuar após salvar.
- Rascunhos/rolagem do shell não sobrevivem a recarregar, crash ou logout. O protocolo nativo do Chat no SW permanece separado.
- Avisos/feed usam REST existente: primeira verificação após1s; seguintes30s após conclusão; falhas60/120s; pausa oculto/offline, retomada imediata ao voltar. Não é entrega instantânea.
- Feed oferece “Novas publicações”; só insere ao toque, preservando o ponto de leitura. Cada toque segue até5páginas adicionais e mantém continuação. Paginação10publicações e5comentários por lote. Leitura contínua não tem teto total de nós DOM.

## Validação sintética

`testing/citizen-layout/mobile-shell.mjs` cobre13cenários de navegação, rascunhos, histórico, entrada direta, desktop, retry, sessão e handoff Login→Home. `mobile-shell-regressions.mjs` cobre7cenários de saturação/expulsão de cache, feed vazio, intervalo de8páginas, relógio determinístico do updater e mensagens nativas SW após logout/troca de conta. O workflow Home tools carousel executa ambos e guarda JSON/capturas.

Os fixtures usam somente usuários/conteúdo sintéticos e interceptam API/WebSocket; não são benchmark de latência/bateria em produção. Testes de timing substituem somente o agendador do updater. O SW usa seu handler original com observação de eventos; não prova comportamento sob crash ou toda corrida criptográfica de mensagens já transmitidas antes do encerramento.
