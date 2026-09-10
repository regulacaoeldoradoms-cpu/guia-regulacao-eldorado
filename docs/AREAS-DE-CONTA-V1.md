# Áreas de conta — V1

Decisão permanente registrada em 10/09/2026.

## Objetivo

A antiga rota monolítica `/conta/` deixa de ser uma área funcional do Portal.
As responsabilidades da identidade autenticada passam a ser distribuídas em
superfícies próprias, mantendo a mesma conta, a mesma sessão e as mesmas regras de
autorização do backend.

## Rotas e responsabilidades

- `/perfil/`: identidade social autenticada. O titular altera a própria foto pelo
  ícone de câmera sobre o avatar. Contas de cidadão também alteram nome de exibição e
  @ nessa tela.
- `/seguranca/`: senha, e-mail de segurança, envio de confirmação e fluxos
  obrigatórios de primeiro acesso/verificação.
- `/configuracoes/`: sons da interface e preferências sociais.
- `/conquistas/`: progressão Bronze/Prata/Ouro e catálogo visual de conquistas.
- `/conta/`: compatibilidade para URLs antigas. A página não possui formulários,
  preferências, foto, senha ou progressão; apenas encaminha para a rota especializada
  correspondente.

## Navegação global

A navegação principal contém Início, Amigos, Ferramentas, Notificações, Perfil,
Segurança, Configurações e Conquistas. No mobile, os mesmos destinos ficam em uma
barra horizontal rolável para evitar compressão dos rótulos e ícones. Notificações
continua abrindo o painel na própria tela e usa o rótulo Avisos no mobile.

A área de foto/nome no cabeçalho abre `/perfil/`, eliminando o último acesso
funcional direto à antiga página Conta.

## Segurança e compatibilidade

A redistribuição é somente de apresentação e responsabilidade de rota. Não reduz
qualquer controle existente:

- troca de senha continua usando a API autenticada e renova a sessão;
- exigência `mustChangePassword` direciona para `/seguranca/`;
- bloqueios de e-mail verificado retornam `/seguranca/?verificar-email=1`;
- o link de confirmação do Firebase retorna para `/seguranca/`;
- foto de perfil continua exigindo o nível Prata no backend;
- autorizações profissionais continuam independentes da navegação social;
- `/conta/` permanece reconhecida apenas para compatibilidade de URLs antigas e
  nunca volta a ser fonte de autorização.

## Conquistas

Bronze, Prata e Ouro continuam representando segurança da conta e não equivalem aos
níveis oficiais da conta Gov.br. A página `/conquistas/` também reserva espaço para
medalhas futuras de jogos, exploração e comunidade.

Enquanto não existir regra persistida e verificável de desbloqueio para uma medalha,
ela deve aparecer como `Planejada`. A interface não pode simular pontuação,
desbloqueio ou recompensa inexistente.

## Desempenho

`/seguranca/`, `/configuracoes/` e `/conquistas/` entram no aquecimento das
rotas do Portal. O service worker pode armazenar somente a superfície pública
versionada; APIs autenticadas, preferências retornadas pelo backend, dados sociais e
qualquer conteúdo assistencial continuam fora do cache estático.

## Arquivos principais

- `seguranca/index.html` e `js/security.js`;
- `configuracoes/index.html` e `js/settings.js`;
- `conquistas/index.html` e `js/achievements.js`;
- `perfil/index.html` e `js/social-profile.js`;
- `js/account-section-shell.js`;
- `js/social-navigation.js`;
- `css/account-sections.css`;
- `conta/index.html`, somente como redirecionamento legado.

Qualquer nova responsabilidade permanente de conta deve ser atribuída explicitamente
a uma dessas áreas ou receber uma rota própria, evitando recriar um painel
monolítico em `/conta/`.
