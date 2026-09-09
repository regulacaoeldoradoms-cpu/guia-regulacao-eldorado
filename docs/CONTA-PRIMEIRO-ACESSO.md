# Conta — experiência de primeiro acesso

## Decisão permanente

Quando uma conta autenticada estiver com `mustChangePassword = true`, a rota `/conta/` deve assumir um modo visual específico de **primeiro acesso**. O objetivo é deixar inequívoco que a conta foi criada corretamente, mas o acesso às demais áreas só será liberado depois da substituição da senha temporária.

Essa decisão **não altera a regra de segurança**. A exigência continua sendo validada pelo fluxo existente de autenticação e pelo backend; a mudança é de comunicação, hierarquia visual e prevenção de confusão.

## Comportamento obrigatório

Durante o primeiro acesso:

- o topo da página deve informar que se trata de uma **etapa obrigatória**;
- o título principal deve orientar a pessoa a definir uma nova senha para continuar;
- o aviso deve explicar que a senha atual é temporária e que o redirecionamento ocorrerá automaticamente após a troca;
- o cartão de alteração de senha deve ser promovido para o início da página, sem exigir rolagem por conteúdos de nível, perfil ou preferências;
- o botão `Início` deve permanecer visível apenas como referência, porém sem navegação e marcado como indisponível até a troca da senha;
- o formulário deve identificar a senha atual como **Senha temporária atual**;
- o botão principal deve usar a ação **Salvar nova senha e continuar**;
- devem ser apresentados somente requisitos realmente aceitos pelo backend: no mínimo 8 caracteres, senha nova diferente da temporária e confirmação igual à nova senha;
- os campos de senha podem oferecer controle profissional de mostrar/ocultar senha;
- o restante da página de conta fica temporariamente fora de foco visual enquanto `mustChangePassword` permanecer verdadeiro;
- `Sair` continua disponível;
- desktop e mobile devem apresentar a mesma lógica, adaptada ao espaço disponível.

## Hierarquia visual e contraste

O primeiro acesso não deve formar uma sequência de superfícies quase brancas. A interface deve separar claramente as camadas sem perder a identidade institucional do Portal:

- o fundo geral usa cinza-azulado suave, com presença discreta de azul e verde-azulado;
- o bloco principal de orientação usa uma superfície azul/verde-azulada clara, porém distinta do fundo;
- o aviso de acesso incompleto recebe contraste intermediário, borda lateral institucional e ícone de segurança mais evidente;
- o formulário permanece como a superfície principal, com borda azul, sombra moderada e fundo levemente azulado em vez de branco plano;
- os campos usam fundo branco, borda cinza-azulada perceptível e foco azul institucional;
- o painel de requisitos usa uma superfície própria, com estados pendentes e concluídos claramente diferenciados;
- o botão de continuidade deve ter presença visual superior aos elementos auxiliares;
- o botão `Início` bloqueado deve parecer indisponível, mas continuar legível;
- o contraste deve ser obtido por cor, borda e superfície, sem efeitos chamativos ou perda de legibilidade;
- a mesma lógica de contraste deve existir em desktop e mobile, respeitando o espaço de cada tela.

## Após a troca

O backend continua sendo responsável por:

- gravar `must_change_password = 0`;
- incrementar `session_version`;
- emitir uma sessão renovada.

Depois da confirmação dessa nova sessão, a experiência de primeiro acesso é removida. Se não houver outra exigência de segurança, a pessoa segue para `/`. Se houver verificação adicional obrigatória, a página volta ao modo normal de conta e conduz para a etapa correspondente.

## Arquivos

- `js/account-first-access.js` — comportamento e apresentação do modo de primeiro acesso;
- `js/citizen-identity-ui.js` — carregamento da experiência na rota compartilhada `/conta/`;
- `js/account.js` — fluxo existente de troca de senha, preservado;
- `worker/auth-management-v2.js` — regra de segurança e renovação de sessão, preservadas;
- `portal-sw.js` — versão de cache renovada para impedir que a interface antiga fique presa no cache estático;
- `worker/tests/account-first-access-ui.test.mjs` — contrato automatizado da experiência.

## Limites

- não liberar `Início` apenas por manipulação visual;
- não remover a exigência de troca de senha no frontend nem no backend;
- não criar requisitos de senha que o backend não valide;
- não expor detalhes técnicos de autenticação ao usuário final;
- não alterar permissões, cargo, nível Bronze/Prata/Ouro ou regras sociais por causa desse fluxo;
- não transformar o contraste visual em uma estética pesada, saturada ou desvinculada das cores institucionais do Portal.