# Grupos do chat — regra de inclusão

Status: decisão de produto registrada; grupos ainda não implementados por este documento.
Data da decisão: 07/10/2026.
Base técnica conferida: main em `954feb53575fbcbac4d8eccaef9d71516876f44b`.
Documento relacionado: [Chat profissional e social](CHAT-PROFISSIONAL.md).

## Decisão confirmada pelo responsável

Só poderá ser adicionada ao grupo uma pessoa que tenha amizade aceita e vigente
no Portal com a pessoa que criou aquele grupo.

A referência é o **criador original do grupo**, não qualquer participante nem
qualquer administrador que venha a ser nomeado posteriormente.

## Consequências para a implementação

- A seleção de participantes deverá oferecer somente contas ativas e elegíveis
  entre os amigos aceitos do criador, excluindo quem já participa.
- Pedido de amizade pendente, recusado, removido ou bloqueado não permite uma
  nova inclusão. Ser contato profissional no chat não substitui a amizade.
- A amizade deverá ser revalidada no servidor no momento da inclusão, além de
  validar a sessão e a autorização de quem executa a ação. Uma lista em cache
  ou uma opção visível no navegador não poderá autorizar a entrada.
- Caso outros administradores possam adicionar participantes, deverão respeitar
  a mesma condição: amizade do candidato com o criador original. Ser amigo
  somente do administrador que está adicionando não será suficiente.
- Essa regra não exige amizade de todos os participantes entre si. Compartilhar
  um grupo não criará amizades nem ampliará permissões de conversa individual
  ou acesso a módulos profissionais.
- Qualquer fluxo futuro de convite ou entrada deverá preservar essa condição,
  sem atalhos que dispensem a verificação de amizade com o criador.
- A seleção de candidatos não deverá expor a terceiros a lista completa de
  amigos do criador fora do escopo estritamente autorizado da administração.

## Pontos ainda não decididos

A regra acima trata de novas inclusões. Ainda devem ser definidos: quem poderá
criar e administrar grupos; entrada direta ou convite com aceite; visibilidade
do histórico anterior à entrada; efeito de desfazer amizade ou bloquear após
a entrada; saída ou desativação do criador; e eventual transferência de gestão.
Não implementar remoção automática de membros nem trocar a referência de
amizade para outro administrador sem uma decisão explícita sobre esses casos.
As demais funcionalidades sugeridas na conversa são propostas, não entregas.

## Critérios de validação a implementar

Verificar inclusão com amizade aceita, recusa sem amizade ou com pedido pendente,
recusa após revogação entre seleção e confirmação, ausência de exceção por cargo,
e impossibilidade de um administrador usar apenas a própria lista de amigos.
Validar também que dois amigos distintos do criador possam participar sem
amizade entre si e sem ganhar autorização de contato individual por esse fato.

## Estado e limites deste registro

Alteração exclusivamente documental em branch separada, sem modificar a main,
o runtime, o banco de dados ou as permissões atuais. Nenhum grupo foi criado.
Antes da implementação, conferir novamente o código e as pendências do chat,
incluindo o caso residual de pré-carregamento e primeiro evento registrado na
PR #608. O aceite de funcionamento relatado pelo responsável não equivale à
correção técnica desse caso específico.
