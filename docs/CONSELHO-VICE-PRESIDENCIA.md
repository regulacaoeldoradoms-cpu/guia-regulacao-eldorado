# Vice-Presidência do Conselho Municipal de Saúde

Decisão permanente registrada em 03/09/2026.

## Cargo institucional

O portal passa a reconhecer o cargo **Vice-Presidente do Conselho Municipal de Saúde**.

A Vice-Presidência é uma identificação institucional própria, mas **não recebe as permissões operacionais da Presidência**. Por decisão do responsável pelo portal, o Vice-Presidente utiliza exatamente o mesmo nível de acesso do **Membro do Conselho**.

## Permissões da Vice-Presidência

No painel institucional do Conselho, o Vice-Presidente pode:

- abrir o painel do Conselho;
- visualizar a lista de manifestações;
- consultar o conteúdo textual e o histórico que já são liberados aos membros.

O Vice-Presidente não pode:

- identificar o manifestante;
- visualizar nome, @, cargo/função ou outros dados de identidade do autor;
- acessar anexos;
- acessar observações internas;
- responder ao manifestante;
- alterar status ou andamento;
- registrar observações internas;
- excluir manifestações;
- executar qualquer outra ação reservada à Presidência ou ao Desenvolvedor.

## Regra de anonimização

A anonimização aplicada ao Membro também é obrigatória para o Vice-Presidente.

Mesmo quando o cidadão escolhe enviar uma manifestação **identificada**, a resposta entregue à Vice-Presidência deve ser transformada para o modo de leitura anônima antes de chegar ao navegador. Nome, usuário, identificação estruturada, rótulos de autoria em mensagens e eventos, anexos e observações internas permanecem ocultos.

A proteção é aplicada no backend. A interface apenas reflete a mesma restrição; esconder campos no navegador não é considerado controle de autorização.

## Implementação de menor privilégio

Para evitar que o título de Vice-Presidente seja confundido com uma elevação de permissão, a implementação mantém o papel-base do Conselho como `membro`.

- `council_role=membro` continua sendo a permissão efetiva armazenada na conta;
- a tabela lateral D1 `auth_council_vice_access` registra exclusivamente que aquela conta ocupa o cargo de Vice-Presidente;
- `worker/council-vice-access.js` adiciona à resposta autenticada o metadado visual `councilOffice=vice_presidente`, sem alterar o `councilRole` efetivo;
- `worker/council-access-policy.js` continua tratando a conta como membro, aplicando leitura anônima e bloqueio de mutações;
- `js/council-access-policy.js` usa `councilOffice` apenas para apresentar o título **Vice-Presidente**, mantendo a interface de somente leitura;
- `worker/auth-management-flex.js` converte uma atribuição administrativa `vice_presidente` para o papel-base `membro` e grava a marca lateral da Vice-Presidência.

Essa arquitetura é deliberada: o cargo é distinto para identificação e gestão administrativa, mas não cria uma nova classe de autorização capaz de ultrapassar as restrições de membro.

## Gestão do cargo

Somente o **Desenvolvedor** pode conceder ou remover a Vice-Presidência.

Na tela de usuários e acessos, o cargo aparece como **Vice-Presidente do Conselho — leitura anônima, como Membro**. Quando a conta é criada especificamente para o Conselho, o perfil principal continua sendo `cidadao`, assim como ocorre com as demais funções institucionais do Conselho.

Contas marcadas como Vice-Presidente ficam fora da gestão subordinada da Coordenação, ainda que possuam um perfil profissional que normalmente pudesse ser administrado por ela.

## Testes obrigatórios

A suíte deve garantir que:

1. o cargo é reconhecido como `vice_presidente` apenas na camada de identificação institucional;
2. o papel-base efetivo continua sendo `membro`;
3. a Vice-Presidência entra no modo institucional de somente leitura;
4. uma manifestação `identificada` chega à Vice-Presidência como anônima;
5. `authorUsername` e `authorIdentity` não são entregues;
6. rótulos de autoria em mensagens e eventos são substituídos por `Manifestante anônimo`;
7. anexos e observações internas são removidos do payload;
8. ações de resposta, mudança de andamento e exclusão permanecem bloqueadas.
