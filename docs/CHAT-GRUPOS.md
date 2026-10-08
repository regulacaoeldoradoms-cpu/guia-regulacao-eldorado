# Grupos do chat — regra de inclusão

Status: decisão de produto registrada; grupos ainda não publicados.
Implementação e validações: [checkpoint atual](CHAT-GRUPOS-CHECKPOINT.md).
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

## Detalhamento posterior

Após a autorização de desenvolvimento, foram adotados convites com aceite,
histórico a partir da entrada, revogação de acesso após saída/remoção e limites
iniciais de uso. O checkpoint diferencia o que já foi implementado em ambiente
isolado, os testes executados e os ajustes ainda necessários antes da publicação.
A referência de amizade não será transferida para outro administrador.

## Critérios de validação

Verificar inclusão com amizade aceita, recusa sem amizade ou com pedido pendente,
recusa após revogação entre seleção e confirmação, ausência de exceção por cargo,
e impossibilidade de um administrador usar apenas a própria lista de amigos.
Validar também que dois amigos distintos do criador possam participar sem
amizade entre si e sem ganhar autorização de contato individual por esse fato.
Resultados executados e limites estão no checkpoint, não devem ser inferidos
a partir desta lista de requisitos.

## Estado e limites deste registro

Esta branch e a PR #610 permanecem documentais, em rascunho. A implementação
funcional está preservada no ambiente de desenvolvimento, não na main.
Nenhum grupo real foi criado e nenhum dado produtivo foi alterado por esta etapa.
A correção residual de pré-carregamento da PR #608 passou nos testes locais,
mas também não foi publicada. Antes de retomar, ler o checkpoint e reconferir
os arquivos e a main para preservar alterações concorrentes.
