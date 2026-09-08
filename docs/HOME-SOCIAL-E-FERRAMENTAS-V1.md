# Migração da Home e área Ferramentas — V1

Atualizado em 08/09/2026.

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
3. renderizar imediatamente Ferramentas e a navegação básica;
4. carregar `/api/social/config` com limite de cinco segundos e então reconciliar a
   navegação com a elegibilidade;
5. usar Ferramentas se a Home estiver desligada, o usuário não estiver elegível ou
   a API falhar ou demorar além do limite;
6. respeitar a preferência `tools` antes de montar o feed;
7. montar perfil, compositor, atalhos e feed; qualquer falha volta ao fallback.

## Flags

- `SOCIAL_BACKEND_ENABLED=true`: libera a API e executa schema/semeadura idempotente
  na primeira sessão social.
- `SOCIAL_HOME_ENABLED=false`: valor de implantação inicial; mantém o hub enquanto
  perfil, amizade e feed são validados no domínio publicado.

Depois do QA autenticado, a segunda flag pode ser alterada para `true` em um commit
pequeno e reversível. Desligá-la restaura imediatamente o catálogo na raiz sem apagar
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

Desktop apresenta os recursos elegíveis em primeiro nível: Início, Meu perfil,
Amigos, Ferramentas, Notificações e Conta. Mobile usa barra inferior com Início,
Amigos, Ferramentas, Avisos e Conta; itens sociais são omitidos para Bronze ou quando
o backend estiver indisponível.

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
