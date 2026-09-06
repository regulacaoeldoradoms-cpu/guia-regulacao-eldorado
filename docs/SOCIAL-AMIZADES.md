# Camada social — amizades e perfis

Decisão permanente registrada em 06/09/2026.

## Estado

Este documento registra decisões de produto para a futura camada social do Portal da Regulação de Saúde de Eldorado/MS. A implementação ainda não está autorizada por este registro; amizade e perfil social devem ser desenvolvidos em etapa própria, com revisão de arquitetura, privacidade, segurança e testes.

## Princípio geral

A amizade será uma relação social separada das permissões profissionais e assistenciais do Portal. Nenhuma amizade poderá conceder acesso a dados de Telemedicina, Regulação, manifestações, Conselho, anexos, prontuários ou qualquer informação protegida de saúde.

## Rede inicial de colegas

Quando a camada social for implementada, contas profissionais provisionadas pelo Desenvolvedor e elegíveis ao chat profissional poderão ser tratadas como amizades iniciais entre si.

A regra deve abranger apenas perfis profissionais efetivamente autorizados no chat profissional, atualmente: Médico, Recepção, Coordenação, Técnico em Telemedicina e Desenvolvedor.

Contas `cidadao`, funções do Conselho isoladamente e outras contas institucionais que não participem do chat profissional não devem receber amizade automática por essa regra.

A origem da conta deve ser determinada pelos dados técnicos do backend, como `created_by`, e não por inferência no frontend.

## Amizade não é autorização profissional

O chat profissional e a amizade são conceitos independentes.

- desfazer amizade não deve retirar, por si só, o acesso a comunicação profissional que seja permitida pelo cargo;
- amizade não deve conceder acesso ao chat profissional para quem não possui essa autorização;
- futuros chats sociais entre cidadãos ou perfis sociais poderão depender de amizade, privacidade, bloqueio e consentimento próprios.

## Desfazer amizade

Qualquer usuário deve poder desfazer uma amizade.

A remoção deve ser registrada como decisão explícita entre aquele par de contas. Uma rotina de amizade automática não poderá recriar posteriormente uma amizade que tenha sido removida manualmente, salvo nova ação voluntária entre os usuários.

## Bloqueio

Bloquear e desfazer amizade são ações distintas.

- desfazer amizade encerra apenas o relacionamento social;
- bloquear deve ter regras próprias de visibilidade, contato e descoberta;
- a implementação futura deverá definir como bloqueio social se relaciona com comunicações profissionais obrigatórias, sem permitir que a camada social elimine fluxos institucionais necessários.

## Integração com o chat

No chat profissional, a identidade do contato deverá poder levar ao perfil social da pessoa quando esse perfil estiver disponível.

A interface poderá oferecer `Ver perfil` pelo cabeçalho da conversa e/ou por elementos de identidade do contato, como nome e foto, respeitando acessibilidade e comportamento mobile.

## Perfil social público

`/conta/` permanece como área privada de configuração da própria conta.

A representação social visitável por outras pessoas deverá ser uma rota própria, em formato equivalente a `/perfil/@usuario`, sem misturar controles administrativos privados com o perfil público/social.

Inicialmente, "perfil aberto" deve significar visível a usuários autenticados da camada social, e não necessariamente uma página pública indexável na internet. Níveis adicionais de visibilidade poderão ser definidos posteriormente.

## Personalização do perfil

O perfil social deverá permitir personalização substancial, incluindo progressivamente:

- foto de perfil;
- capa;
- nome de exibição e `@usuario`;
- biografia;
- frase ou status pessoal;
- informações opcionais definidas pelo usuário;
- interesses;
- cores e tema do perfil;
- fundo ou padrões aprovados pelo Portal;
- organização e seleção de módulos visíveis;
- amigos;
- comunidades;
- conquistas;
- jogos e progresso social, quando existirem.

A personalização deve ocorrer por opções e componentes controlados pelo Portal. Não permitir HTML, JavaScript ou CSS arbitrário fornecido pelo usuário, evitando XSS, quebra de layout e problemas de acessibilidade.

## Identidade institucional de profissionais

Perfis profissionais devem manter uma identificação institucional autêntica e não falsificável pelo próprio usuário.

Cargo/função profissional deve permanecer derivado dos dados autorizados do Portal e ser exibido de forma clara no perfil social quando aplicável. O usuário poderá personalizar a área social ao redor dessa identificação, mas não transformar, ocultar ou falsificar seu cargo institucional por meio da personalização do perfil.

## Estados da relação

A implementação futura deve prever estados explícitos de relacionamento, pelo menos:

- sem relação;
- pedido enviado;
- pedido recebido;
- amigos;
- amizade removida;
- bloqueado.

As transições devem ser validadas no backend, e não apenas pela interface.

## Integração futura com jogos

A amizade será uma das fundações da futura plataforma social de jogos. Jogos poderão usar amigos para visitas, cooperação, presentes, conquistas e outras mecânicas sociais, mas sem acesso a qualquer dado assistencial ou protegido do Portal.

## Segurança e privacidade

- autorização de relações deve ser validada no Cloudflare Worker;
- não confiar em botões ocultos no frontend como controle de segurança;
- não expor e-mail, dados assistenciais, manifestações ou outros dados protegidos no perfil social;
- não versionar conteúdo privado de usuários no repositório público;
- evitar enumeração abusiva de contas e descoberta irrestrita de profissionais;
- manter separação entre identidade social, identidade institucional e permissões assistenciais.

## Relação com decisões anteriores

Esta decisão evolui a camada social anteriormente mantida como futura no Portal. A preferência `accept_friend_requests` já existente permanece como preparação técnica e deverá ser revisada quando a implementação da amizade começar.

O chat profissional continua regido por `docs/CHAT-PROFISSIONAL.md` até que uma implementação social posterior altere explicitamente sua integração, sem reduzir as garantias atuais de autorização e isolamento de cidadãos.
