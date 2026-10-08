# Grupos do chat — checkpoint de desenvolvimento

## Situação objetiva

O responsável autorizou planejar, desenvolver e implementar grupos no chat.
A implementação inicial foi escrita e exercitada em cópia isolada do repositório,
mas **não foi enviada para a main nem publicada**. Esta PR continua documental
em rascunho; não confundir este registro com a entrega do runtime.

Main conferida antes do trabalho e novamente ao interromper:
`954feb53575fbcbac4d8eccaef9d71516876f44b` (PR #608).
Base de produto: [regra aprovada dos grupos](CHAT-GRUPOS.md).
Dossiê Mestre consultado integralmente; código, autenticação, camada social,
realtime, estilos e gate de publicação existentes foram examinados.

## Regra confirmada que não pode mudar

Toda nova inclusão depende de amizade aceita e vigente do candidato com o
**criador original**. Um administrador nomeado depois não pode usar apenas seus
próprios amigos. A verificação ocorre no servidor na criação, no convite e no aceite,
inclusive se a amizade mudar entre a seleção e a confirmação.
Grupo não cria amizade entre participantes nem libera chat individual ou módulos.

## Desenho adotado na implementação inicial

- Mesmo painel global, com Novo grupo e filtros Todos/Pessoas/Grupos.
- Nome, descrição e foto raster do grupo; mensagens com identificação do remetente.
- Convite com aceite/recusa; convidado não recebe o histórico antes de aceitar.
- Histórico começa na entrada. Saída ou remoção revoga acesso; uma nova entrada
  inicia outro intervalo, sem liberar mensagens anteriores ou do período ausente.
- Administradores gerenciam participantes; original permanece referência de amizade.
  O último administrador precisa nomear outro ou encerrar o grupo antes de sair.
- Silenciamento por conta e recibos separados de recebimento e leitura.
- Três tabelas novas no D1, aditivas, com índices e migração idempotente. Mensagem
  persistida uma vez por grupo, sem criar cópias de conteúdo para cada destinatário.
- Canal WebSocket existente emite somente uma invalidação com UUID do grupo.
  O texto é obtido por consulta que revalida sessão e participação; não há segundo
  socket nem confiança em lista de membros armazenada no navegador.
- Mensagens e rascunhos de grupos ficam somente em memória do cliente; nenhum
  conteúdo de grupo vai para armazenamento durável do navegador ou repositório.
- Limites iniciais implementados: 20 participantes incluindo convites pendentes,
  20 grupos abertos por criador, 5 criações por dia e 60 mensagens por minuto/remetente.
- Perder amizade após aceitar não remove silenciosamente o participante.
  Para impedir futuras leituras do grupo, é necessário remover o membro ou ele sair.
  A perda de amizade impede novo convite/aceite.
- Áudios, chamadas, anexos e chamada de atenção coletiva ficam fora desta entrega.

Esses detalhes operacionais são decisões técnicas desta implementação autorizada;
a regra expressamente definida pelo responsável continua sendo a amizade com o criador.
Não anunciar equivalência de segurança com WhatsApp nem criptografia ponta a ponta.

## Código preservado no ambiente de desenvolvimento

Pasta isolada: `portal-chat-groups-20261008`, subdiretório `repo`.
O registro privado de continuidade contém a localização exata do dispositivo.

Arquivos novos:

- `worker/chat-groups.js`
- `js/portal-chat-groups.js`
- `worker/tests/helpers/chat-group-fixture.mjs`
- `worker/tests/chat-groups.test.mjs`
- `worker/tests/browser/chat-groups.cjs`

Integrações locais: cliente e bootstrap globais, allowlist de eventos do Durable Object,
roteador de chat, estilos escopados, flag CHAT_GROUPS_ENABLED e referências de cache.
Versão local prevista: `20261008-chat-groups-1`. Esta versão **não é produtiva**.
O gate de deploy seguro não foi modificado.

O script de integração foi aplicado uma vez e não deve ser repetido sobre a mesma
cópia. A fonte original do snapshot está preservada separadamente para comparação.
A correção residual da PR #608 também foi implementada somente nessa cópia:
deduplicação por eventos efetivamente tratados, separada do cache pré-carregado.

## Resultados realmente executados

- Sintaxe dos módulos novos, integração e cliente: aprovada.
- **17/17** testes novos de backend/integração, com SQLite em memória e dados fictícios.
- **815/815** testes da suíte Node completa: nenhuma falha ou teste pulado.
- **4/4** combinações de navegador para grupos: claro/escuro × desktop/mobile,
  cada uma com três sessões fictícias e o handler de grupos real sobre SQLite.
  Cobrem criação, seleção restrita, aceite, envio entre os três participantes,
  identificação, texto seguro, administração, retorno à aba, remoção e logout.
- **14/14** cenários de recebimento individual, incluindo os dois de preload antes
  do primeiro evento que falhavam na versão publicada da PR #608.
- **8/8** cenários de apresentação individual: foto, claro/escuro, desktop/mobile,
  datas, novas mensagens, paginação, virada do dia e imagem ausente/inválida.
- Capturas da criação mobile clara, conversa mobile escura e participantes desktop
  escuros foram inspecionadas visualmente.

Evidências locais: `groups-tests.log`, `full-tests.log`, `groups-browser.log`,
`presentation-browser.log`, `evidence/groups-browser.json`,
`evidence/direct-preload-regression.json` e capturas sintéticas.
Nenhuma conta ou conversa real foi utilizada; não houve alteração no D1 produtivo.
Esses testes não constituem aceite produtivo nem eliminam as pendências abaixo.

## Pendências obrigatórias antes da publicação

Na revisão posterior aos testes, foram identificados pontos adicionais não cobertos:

1. A assinatura visual do envio usa o mesmo valor para pendente e falho; separar
   estados para garantir que uma falha apresente Reenviar, com teste de erro/retry.
2. Respostas antigas de detalhes/recibos não devem substituir um diálogo mais novo;
   usar geração do diálogo e testar troca durante requisição pendente.
3. Flag desligada deve negar mutações, não responder com envelope de capacidade
   como sucesso; cliente deve fechar e limpar grupo ativo quando desabilitado.
4. A consulta idempotente de envio deve respeitar o intervalo de participação atual,
   inclusive quando o próprio autor reutiliza clientId anterior após reentrada.
5. Limite de participação por conta deve ser coerente com a listagem de até 100;
   aplicar a restrição atomicamente, sem deixar grupos invisíveis por truncamento.
6. Restringir visualização de convites pendentes a administradores, revisar o caso
   de saída/reentrada do criador sem trocar a referência original, e testar os limites.
7. Complementar verificação de fotos reais sintéticas no grupo, melhora de rótulos
   profissionais, seletor de emoticons e ocupação do filtro somente Grupos.
8. Integrar os testes de grupos e os 14 cenários individuais ao gate de CI existente,
   revisar diff completo e eventuais apontamentos de revisão, antes de merge.

A tentativa de escrever o script desses ajustes finais foi **bloqueada pela ferramenta**,
que informou não conseguir determinar o status de segurança da solicitação.
O script `review-groups.cjs` não foi criado e nenhum desses ajustes foi aplicado.
Não contornar esse bloqueio por outra rota nem publicar a versão ainda em revisão.
O trabalho já executado, os testes e as evidências foram preservados.

## Próxima ação

Retomar da cópia preservada e das pendências acima quando for possível executar
as edições autorizadas. Não reconstruir a implementação nem repetir testes
intactos sem necessidade. Conferir a main novamente, concluir os ajustes com seus
testes, publicar somente pelo gate existente e conferir arquivos/serviços em produção.
A conclusão deve distinguir desenvolvimento, testes sintéticos, publicação e aceite real.
