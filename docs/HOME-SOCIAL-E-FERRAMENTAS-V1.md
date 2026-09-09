# Migração da Home e área Ferramentas — V1

Atualizado em 09/09/2026.

## Mudança de responsabilidade

O catálogo que antes existia somente na raiz foi extraído para
`js/tools-catalog.js`. A mesma função monta:

- o fallback operacional de `/`;
- a rota dedicada `/ferramentas/`;
- os três atalhos autorizados exibidos na Home social.

Isso mantém uma matriz cliente única e evita divergência visual entre hub e
Ferramentas. A autorização efetiva de cada módulo continua no backend e nos guards
próprios; um card nunca concede acesso.

## Rollout da raiz

`/` contém duas superfícies mutuamente exclusivas:

1. `toolsFallback`, disponível sem depender da API social;
2. `socialHome`, montada apenas com sessão válida, Conta Prata, backend e Home
   habilitados.

O fluxo de `js/home.js` é:

1. validar a sessão;
2. priorizar troca obrigatória de senha;
3. manter somente a animação de carregamento enquanto a configuração social é
   resolvida, sem expor a Home anterior durante a transição;
4. carregar `/api/social/config` com uma primeira janela de até dez segundos;
5. em timeout ou erro transitório de backend/banco social, manter a animação e
   executar uma segunda tentativa com orçamento de até trinta segundos;
6. usar Ferramentas se a Home estiver desligada, o usuário não estiver elegível ou a
   API permanecer indisponível após a recuperação;
7. respeitar a preferência `tools` antes de montar o feed;
8. montar perfil, compositor, atalhos e feed; qualquer falha volta ao fallback.

Para o perfil Desenvolvedor, uma falha persistente da configuração social inclui
somente o código técnico e o status HTTP no aviso da Home. Nenhuma credencial, dado de
usuário ou conteúdo protegido é exposto.

## Diagnóstico de produção

Após a primeira tentativa de ativação da Home, a interface publicada permaneceu no
fallback com a mensagem de indisponibilidade social. Um probe externo sem credenciais
foi adicionado para distinguir indisponibilidade do Worker de falha interna da camada.
O teste confirmou em produção:

- `/api/auth/me` responde `401` sem sessão, como esperado;
- `/api/social/config` também responde `401` sem sessão, confirmando que a rota social
  está publicada no Worker;
- o preflight `OPTIONS /api/social/config`, com a origem oficial do Portal, responde
  `204`, confirmando a configuração CORS da rota.

Portanto, o fallback observado não era ausência da rota nem bloqueio CORS. A Home foi
endurecida para tolerar inicialização lenta/transitória do backend social sem abandonar
a experiência na primeira falha curta.

Em 09/09/2026, um novo caso no desktop revelou `SOCIAL_CONFIG_TIMEOUT` mesmo com as
rotas de autenticação funcionando. A causa estava no caminho frio do Worker: cada novo
isolate repetia toda a sequência idempotente de tabelas e índices antes de responder à
configuração. O backend agora consulta primeiro a versão registrada da migração e só
executa DDL quando ela realmente não existe. A configuração também reutiliza a sessão
já validada e consulta notificações/perfil em paralelo. Assim, o desktop deixa de
esgotar as duas janelas de espera e cair na Home anterior por latência de inicialização.

## Flags

- `SOCIAL_BACKEND_ENABLED=true`: libera a API e executa schema/semeadura idempotente
  na primeira sessão social.
- `SOCIAL_HOME_ENABLED=true`: decisão permanente de 08/09/2026; a raiz passa a ser o
  feed para contas elegíveis, mantendo Ferramentas como fallback seguro.

A ativação continua reversível. Se a Home social apresentar falha incapacitante,
`SOCIAL_HOME_ENABLED=false` restaura imediatamente o catálogo na raiz sem apagar
dados sociais. Desligar também o backend contém toda a camada, enquanto
`/ferramentas/` continua funcional.

## Redirecionamentos

- Login comum abre `/`; a raiz aplica a preferência Feed/Ferramentas.
- Autocadastro Bronze abre `/` e recebe o fallback, sem descoberta social.
- Primeiro acesso e troca obrigatória de senha continuam em `/conta/` antes de
  qualquer preferência.
- `/home/` permanece redirecionamento de compatibilidade para `/`.
- Conta-base exclusiva do Conselho continua abrindo `/conselho/painel/`.

## Navegação

Desktop apresenta os recursos elegíveis em primeiro nível: Início, Amigos,
Ferramentas, Notificações e Perfil. Mobile usa barra inferior com Início, Amigos,
Ferramentas, Avisos e Perfil. Não existe mais item independente `Conta` na navegação
global; as configurações privadas permanecem acessíveis pela área de foto/nome do
cabeçalho, que continua apontando para `/conta/`.

Para contas sem elegibilidade social, os itens sociais são omitidos e a navegação
mínima mantém Início e Ferramentas. Isso evita expor Perfil social para contas Bronze
antes do gate de segurança.

Chat profissional permanece flutuante somente para os cargos autorizados. O CSS
reposiciona o launcher acima da barra inferior e respeita safe areas.

## Critérios de rollback

Executar rollback da Home se houver falha de feed, perfil, navegação, latência
incapacitante ou regressão de Ferramentas. O procedimento é:

1. definir `SOCIAL_HOME_ENABLED=false`;
2. publicar o Worker;
3. confirmar `/` e `/ferramentas/` com pelo menos um perfil profissional e um
   cidadão Bronze;
4. manter tabelas intactas para diagnóstico;
5. desligar `SOCIAL_BACKEND_ENABLED` somente se o problema estiver nas APIs sociais.
