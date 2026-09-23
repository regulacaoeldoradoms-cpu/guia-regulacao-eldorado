# Portal — Aparência claro/escuro V1

Data: 23/09/2026.

## Objetivo

Preparar o Portal inteiro para alternar entre **Modo claro** e **Modo escuro**, com controle central em **Configurações**. O modo claro permanece o comportamento visual atual e o padrão de contas que ainda não escolheram outra aparência.

Esta mudança é exclusivamente de apresentação. Não altera autenticação, cargos, permissões, regras assistenciais, Google Drive, IA, Agenda, Conselho, chat, sincronização ou observabilidade.

## Arquitetura

### Bootstrap visual

`js/portal-theme.js` é uma camada mínima e independente, carregada no `<head>` das rotas visuais ativas.

Responsabilidades:
- ler a última aparência conhecida em `regulacao.portal.theme.active.v1`;
- aplicar `data-portal-theme="light|dark"` no elemento `html` antes da pintura sempre que possível;
- ajustar `color-scheme` e `theme-color`;
- reconciliar a preferência já presente no usuário autenticado em cache;
- propagar mudanças entre abas do mesmo navegador.

Essa separação é necessária porque a Telemedicina neutraliza deliberadamente `PortalInteractions` para não receber animações e sons globais. O tema continua funcionando sem reativar essas microinterações.

### Controle e persistência

O controle fica em `/configuracoes/`, no card **Aparência**, com duas opções explícitas:
- **Modo claro**;
- **Modo escuro**.

`js/portal-interactions.js` integra o controle à preferência da conta. A API autenticada `/api/auth/security` persiste `interfaceTheme`, armazenado no D1 como `auth_users.interface_theme`.

Valores aceitos no backend:
- `light`;
- `dark`.

Qualquer outro valor é rejeitado. O padrão da coluna é `light`.

## Estratégia CSS

O CSS claro existente continua sendo a fonte visual principal. O modo escuro é uma camada de sobrescrita em `css/portal-interactions.css`, condicionada por:

```css
html[data-portal-theme="dark"]
```

Isso evita duplicar dezenas de folhas de estilo ou introduzir um tema paralelo por módulo.

A camada escura cobre:
- shell, fundo, topbar e navegação;
- Home/Ferramentas;
- Perfil, Amigos, Notificações, Configurações, Segurança e Conquistas;
- Agenda e ponte de sincronização;
- Central de Documentos/Titon;
- Telemedicina;
- Guia Médico e Protocolos;
- Recepção;
- Canal do Cidadão;
- Conselho público e painel;
- Administração e monitoramento;
- chat, modais, formulários, tabelas, cards, estados e campos de entrada.

## Exceções deliberadas

- **PDF renderizado:** a folha do documento permanece branca para preservar o documento real.
- **Impressão:** continua com `color-scheme: light`; o tema da tela não deve alterar documentos impressos.
- **Imagens/logos:** não são recoloridos artificialmente.
- **Cores semânticas:** sucesso, aviso, erro e estados operacionais mantêm distinção própria com variantes adequadas ao fundo escuro.
- **Telemedicina:** continua sem animação/sonificação global; somente a aparência é aplicada.

## Privacidade e observabilidade

A aparência não contém conteúdo sensível. A preferência `light|dark` não é enviada ao PostHog. Nenhum nome de paciente, arquivo, diagnóstico, termo de pesquisa ou conteúdo clínico é associado à troca de tema.

## Aceite V1

1. Modo claro permanece visualmente equivalente ao estado anterior.
2. Configurações permite selecionar claro ou escuro.
3. A troca ocorre imediatamente sem recarregar.
4. A escolha é mantida ao navegar entre módulos.
5. A escolha é sincronizada à conta autenticada.
6. Outra aba aberta acompanha a mudança.
7. Telemedicina recebe o tema sem reativar microinterações.
8. Agenda recebe o tema sem adicionar observabilidade clínica.
9. PDF e impressão permanecem claros.
10. Todas as rotas ativas carregam o bootstrap versionado.
11. Testes e workflows existentes permanecem verdes.


## Refinamento pós-homologação — chat interno

A homologação visual em produção identificou uma lacuna no chat interno: o contêiner principal já recebia o tema escuro global, porém superfícies internas ainda herdavam cores claras hardcoded de `css/portal-chat.css`.

A correção permanece restrita à apresentação e usa `html[data-portal-theme="dark"]` no CSS próprio do chat para cobrir:
- corpo e lista de contatos;
- área e campo de pesquisa;
- estados hover/foco dos contatos;
- avatares, textos secundários e presença online;
- conversa, balões recebidos/enviados e horários;
- compositor, campo de mensagem e botão Enviar;
- avisos, cartões de notificação e scrollbars.

O modo claro não é alterado. Nenhuma regra de chat, contato, amizade, cargo, mensagem, push ou observabilidade muda. O CSS do chat é versionado em `portal-chat.css?v=20260923-1` nas rotas que montam o chat e no carregador do Guia Médico.

## Refinamento transversal do modo escuro — 23/09/2026

A homologação humana do chat interno em modo escuro foi **aprovada**. Na mesma revisão visual, foram identificadas superfícies legadas que ainda preservavam fundos claros em **Perfil**, **Telemedicina**, **Conquistas**, **Recepção** e **Guia Médico**, incluindo o assistente de pré-regulação.

A correção permanece estritamente visual e segue a arquitetura já aprovada:

- o modo claro continua sendo o baseline e não é reescrito;
- o modo escuro continua condicionado exclusivamente a `html[data-portal-theme="dark"]`;
- as exceções foram consolidadas em `css/portal-interactions.css`, em vez de recolorir componentes por JavaScript;
- superfícies, bordas, textos secundários, estados selecionados, inputs e cartões legados passam a reutilizar os tokens escuros centrais;
- a Telemedicina recebe seletores escuros com especificidade suficiente para prevalecer sobre as camadas visuais V12/V16 sem alterar sua lógica funcional;
- o Guia Médico preserva as cores semânticas de protocolo, alertas e identidade do assistente, mas elimina painéis brancos residuais;
- impressão continua clara porque a cobertura complementar é restrita a `@media screen`;
- nenhuma permissão, regra de negócio, endpoint, dado clínico ou telemetria foi alterado.

Para invalidar CSS antigo em cache, as rotas visuais passam a carregar `portal-interactions.css?v=20260923-2`.

Aceite visual desta unidade: após publicação, validar em modo escuro `/perfil/`, `/telemedicina/`, `/conquistas/`, `/recepcao/` e `/medico/`, preservando o comportamento do modo claro.

