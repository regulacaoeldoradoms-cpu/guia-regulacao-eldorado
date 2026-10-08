# Grupos privados do chat

Regra aprovada em 07/10/2026; implementação de 08/10/2026.
Versão: `20261008-chat-groups-1`.
O estado de publicação e as evidências ficam em [CHAT-GRUPOS-CHECKPOINT.md](CHAT-GRUPOS-CHECKPOINT.md).
Relacionados: [chat individual](CHAT-PROFISSIONAL.md) e [gate seguro](WORKER-SAFE-DEPLOY.md).

## Regra permanente do responsável

Somente pessoas com amizade aceita e vigente com o **criador original** podem ser
convidadas para o grupo. A mesma regra vale quando outro administrador faz o convite.
Contato profissional, cargo, pedido pendente, amizade removida ou bloqueada não
substituem a amizade aceita. O servidor revalida a condição na criação, no convite
e no aceite, inclusive quando o relacionamento muda depois da seleção na tela.

Os participantes não precisam ser amigos entre si. Compartilhar um grupo não cria
amizades, não autoriza conversas individuais e não concede acesso profissional.
A referência ao criador original é imutável e não acompanha a troca de administradores.

## Experiência

O painel global conserva as conversas individuais e acrescenta **Novo grupo** e os
filtros **Todos / Pessoas / Grupos**. Nome, descrição e foto identificam cada grupo.
As mensagens mostram remetente, foto, horário, divisões por dia e novas mensagens.
Há emoticons no cursor, envio otimista, erro com **Reenviar**, histórico paginado,
recibos individuais de recebimento/leitura e silenciamento dos avisos por conta.

O convidado aceita ou recusa. Enquanto convidado, não recebe texto nem lista de
participantes. Após aceitar, vê somente mensagens posteriores à entrada.
Administradores podem editar dados, convidar, promover participantes e remover.
Um administrador nomeado não pode remover/rebaixar outro administrador; o criador
pode gerenciar esses administradores, mas não altera sua própria referência original.
Membros comuns veem apenas participantes aceitos; convites pendentes são privados
para administradores. A administração do grupo não dá privilégios no Portal.

## Saída, revogação e histórico

Sair ou ser removido encerra o acesso às rotas de conteúdo. A reentrada exige novo
convite e aceite e inicia outro intervalo: mensagens anteriores e do período ausente
não reaparecem. Um clientId antigo também não pode recuperar texto anterior à entrada.
O último administrador precisa nomear outro ou encerrar o grupo antes de sair.
Encerrar conserva o histórico para membros atuais, mas bloqueia novos envios/convites.

Na V1, a saída do criador original é definitiva para ele: não há autoamizade nem
transferência de fundador. A confirmação de saída informa essa limitação. Os demais
administradores continuam sujeitos à lista de amigos do criador original. Não se
implementa retorno privilegiado oculto ou mudança de referência para outro membro.

Perder amizade depois de aceitar não remove silenciosamente um participante já
admitido. Para revogar o grupo, um administrador deve removê-lo ou ele deve sair.
A perda de amizade impede novos convites e aceites; não muda a autorização individual.
Contas inativas, sessões revogadas e suspensões sociais não recebem acesso ao conteúdo.

## Limites iniciais

- 20 pessoas por grupo, incluindo convites pendentes.
- 100 participações/convites por conta, incluindo grupos encerrados ainda presentes.
  Sair ou recusar libera a vaga; a listagem não trunca grupos além da capacidade.
- 20 grupos abertos por criador; até 5 criações nas últimas 24 horas.
- Até 60 mensagens por minuto/remetente e 2.000 caracteres por mensagem.
- Nome de até 80 caracteres; descrição de até 500; páginas de 80 mensagens.
- Foto JPG, PNG ou WebP: navegador aceita até 5 MB, recorta e reduz para 160×160.
  Servidor aceita apenas data URL raster limitada, com assinatura de formato validada.

Limites de admissão e amizade são verificados na mesma instrução SQL de inclusão.
Criação usa batch transacional; não deixa grupo parcial quando uma etapa falha.
Repetição com o mesmo clientId é idempotente dentro do intervalo autorizado.

## Arquitetura e privacidade

`worker/chat-groups.js` acrescenta três tabelas ao D1: grupos, participações por
intervalo e mensagens. Não modifica nem migra mensagens individuais. Índices e marcador
`groups-v1` tornam a preparação aditiva e idempotente. Uma mensagem é persistida uma
vez por grupo, sem uma cópia por participante.

O WebSocket existente envia somente `group-refresh` com UUID do grupo. Nome, foto,
remetente e texto não são colocados nesse evento. Cada consulta seguinte ao conteúdo
revalida sessão, participação e intervalo no servidor. Não existe segundo socket.
A conexão global recebe invalidações mesmo fora da Home; recuperação HTTP trabalha
com a conversa visível e pausas quando a aba está oculta.

Mensagens e rascunhos dos grupos ficam somente na memória da página. Não são gravados
em localStorage, sessionStorage, IndexedDB ou Cache Storage. Fotos/HTML/JS públicos
são separados do conteúdo privado das APIs, que usam no-store. Logout, revogação e
desativação limpam o grupo ativo. Respostas antigas não substituem novos diálogos.

A flag `CHAT_GROUPS_ENABLED` controla o recurso. Desligada, a listagem retorna capacidade
indisponível; leitura específica e mutações são negadas, nunca confirmadas como sucesso.
O desligamento não apaga tabelas nem dados. O gate de deploy seguro permanece intacto.

Não anunciar criptografia ponta a ponta ou equivalência de segurança com WhatsApp.
Não enviar dados de pacientes, documentos assistenciais ou manifestações pelo grupo.
Áudios, chamadas, anexos, links públicos de entrada e chamada de atenção coletiva
não fazem parte desta versão.

## Validação

`worker/tests/chat-groups.test.mjs` verifica as rotas com SQLite real em memória e
contas fictícias, incluindo amizade do fundador, sessões, reentrada, idempotência,
limites atômicos, convites privados, desativação e recibos.
`worker/tests/browser/chat-groups.cjs` usa três sessões fictícias com as rotas reais,
HTTP/WebSocket interceptados, temas claro/escuro e tamanhos desktop/mobile.
O gate existente também mantém regressões de recebimento, fotos e datas individuais.
Testes sintéticos não constituem uma conversa real autenticada em produção.
