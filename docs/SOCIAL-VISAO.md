# Camada social — visão de produto e navegação

Decisão permanente registrada em 06/09/2026.

## Estado

Este documento registra a direção de produto para a futura camada social do Portal da Regulação de Saúde de Eldorado/MS. Ele não autoriza, por si só, a implementação imediata do feed ou a substituição do hub atual. A transição deverá ocorrer em etapa própria, após fechamento seguro da V1 e com revisão de arquitetura, privacidade, desempenho, acessibilidade e segurança.

## Princípio de produto

A futura rede social não deverá ser uma cópia do Orkut. A referência é conceitual e nostálgica: perfis fortes, amizades, comunidades, identidade pessoal, recados, jogos e sensação de pertencimento. O objetivo é evoluir esse modelo com padrões modernos de UX, segurança, acessibilidade, desempenho e entretenimento.

A proposta deve ser tratada como uma melhoria do conceito de rede social comunitária daquela época, e não como reprodução de marca, interface, ativos, código, personagens ou propriedade intelectual de terceiros.

## Evolução da página inicial

Hoje a rota `/` funciona como hub de trabalho e apresenta as ferramentas liberadas de acordo com as permissões da mesma conta.

Quando a camada social estiver madura para lançamento, a intenção de produto é que a rota `/` evolua para a Home social do usuário, com o feed ocupando a área principal da experiência.

A mudança não deverá acontecer antes de existir uma base social funcional e segura, incluindo pelo menos perfil social e amizade suficientes para que a nova Home tenha utilidade real.

## Ferramentas permanecem a um clique

Mesmo com a Home social, o Portal deve continuar sendo eficiente para o trabalho profissional.

As ferramentas nunca deverão ficar escondidas atrás de navegação profunda. O acesso a `Ferramentas` deve permanecer a um único clique ou toque a partir da Home e das principais áreas globais do Portal.

A área de Ferramentas continuará respeitando integralmente as permissões da conta e deverá apresentar somente os módulos autorizados para aquele usuário.

Profissionais que utilizam o Portal prioritariamente para trabalho não devem ser obrigados a navegar pelo feed para acessar Telemedicina, Guia Médico, Recepção, Conselho, Administração ou outros módulos autorizados.

## Navegação global proposta

A arquitetura futura deverá reservar navegação de primeiro nível para os grandes domínios da experiência social e profissional, em formato equivalente a:

- Início / Feed;
- Perfil;
- Amigos;
- Comunidades;
- Jogos;
- Ferramentas.

Conta, Chat e Notificações devem funcionar como recursos globais e permanecer acessíveis independentemente da área em que o usuário estiver.

A composição exata poderá variar entre desktop e mobile, desde que a hierarquia conceitual e o acesso rápido às Ferramentas sejam preservados.

## Atalhos profissionais

A Home social poderá oferecer atalhos fixados pelo próprio usuário para ferramentas profissionais de uso recorrente.

Esses atalhos não substituem a área `Ferramentas`; servem apenas para reduzir ainda mais o atrito operacional.

A implementação futura poderá permitir que o usuário escolha ferramentas favoritas ou frequentes, sempre dentro das permissões já concedidas pelo backend.

## Página inicial preferida

Deverá ser considerada uma preferência de conta que permita ao usuário escolher, quando tecnicamente e institucionalmente adequado, entre:

- abrir o Portal na Home social / Feed;
- abrir o Portal diretamente em Ferramentas.

Essa preferência é especialmente importante para profissionais que usam o sistema durante o expediente e desejam acesso direto ao ambiente de trabalho.

## Feed social

O feed deverá ser social, transparente e separado dos dados assistenciais.

Na primeira geração, a prioridade deve ser conteúdo compreensível e previsível, como:

- publicações de amigos;
- atividades de comunidades acompanhadas;
- conquistas ou atividades sociais de jogos quando o usuário optar por compartilhá-las;
- atualizações sociais explicitamente publicadas pelos próprios usuários.

Evitar, no início, um algoritmo opaco de retenção que decida de forma imprevisível o que o usuário verá. Ordem cronológica, relevância simples ou filtros claros são preferíveis enquanto o produto estiver amadurecendo.

## Separação absoluta entre social e assistencial

O feed e demais superfícies sociais jamais devem publicar automaticamente informações oriundas de Telemedicina, Regulação, manifestações, Conselho, prontuários, solicitações, pacientes, anexos, encaminhamentos ou qualquer outro fluxo assistencial ou protegido.

Exemplos de conteúdo proibido no feed incluem eventos como registro de paciente, criação de manifestação, alteração de encaminhamento ou atividade clínica/administrativa individual.

A camada social deverá conhecer apenas dados e eventos criados para finalidade social, como amizade, publicações, comunidades, jogos, conquistas e preferências sociais voluntárias.

## Inspiração no Orkut

A inspiração deverá permanecer concentrada nos elementos que criavam identidade e comunidade:

- perfil social marcante e personalizável;
- amizades;
- comunidades;
- recados e interações sociais;
- presença de jogos integrados à identidade do usuário;
- sensação de que cada perfil pertence de fato àquela pessoa.

A experiência futura deve atualizar esses conceitos para padrões modernos, sem tentar reproduzir a Home ou o layout histórico do Orkut.

## Direção de experiência

A futura Home deverá fazer o Portal deixar de se apresentar apenas como uma lista de módulos e passar a funcionar também como espaço de convivência digital.

O objetivo de produto é que o usuário possa entrar no Portal e encontrar sua rede, amigos, comunidades, atividades sociais e jogos, ao mesmo tempo em que suas ferramentas de trabalho continuam imediatamente disponíveis quando necessárias.

A camada profissional continua institucional, objetiva e segura. A camada social poderá ser mais pessoal e expressiva, sem comprometer a identidade profissional ou a separação de dados protegidos.

## Relação com amizades e jogos

Esta visão deve ser interpretada em conjunto com `docs/SOCIAL-AMIZADES.md`.

A amizade será uma das fundações da Home social e da futura plataforma de jogos. Jogos poderão usar identidade social, amigos, visitas, cooperação, presentes e conquistas, mantendo isolamento absoluto de dados assistenciais.

## Implementação futura

Antes de substituir o hub atual pela Home social, a etapa de implementação deverá:

- conferir novamente o Dossiê Mestre e a `main`;
- revisar a arquitetura vigente de autenticação, permissões, chat, perfil e conta;
- garantir que Ferramentas permaneça a um clique/toque;
- preservar acesso rápido para profissionais;
- testar desktop e mobile separadamente;
- garantir navegação por teclado, leitores de tela e foco visível;
- validar desempenho do feed e carregamento progressivo;
- impedir qualquer vazamento entre dados sociais e assistenciais;
- documentar a migração da raiz `/` e os fallbacks para contas sem uso social;
- publicar somente após validação completa.
