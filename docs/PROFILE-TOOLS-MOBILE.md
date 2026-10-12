# Perfil e Ferramentas no celular

Base: b5e89f6863597aa740446ad0a53874ff17908e30. Escopo: apresentação das rotas compartilhadas acessíveis ao cidadão. Permissões, catálogo, uploads e backend permanecem com seus controladores nativos.

O próprio Perfil abre em visualização. `Editar perfil` revela os formulários originais; Cancelar restaura os valores carregados e devolve o foco ao botão. Salvamento bem sucedido retorna à visualização; erro mantém formulário e dados. A navegação entre abas conserva o editor e seu rascunho intencional. Outra pessoa nunca recebe editor ou câmera do titular. Desktop e impressão conservam os formulários nativos; na impressão removemos o botão exclusivo do celular e impedimos que a transição de fonte do formulário recém-revelado altere suas medidas.

A folha de Perfil entra no head e usa uma raiz própria; Perfil, Mascotes e Ferramentas mantêm suas folhas totalmente delimitadas ativas durante a navegação. Isso evita reativação tardia de `media=not all`. O cabeçalho nativo tem apresentação compacta enquanto o menu compartilhado real carrega. Não há menu falso, bloqueio artificial da página ou mudança de cache global. Ferramentas fica acessível através de Home, sem reaparecer no Perfil ou na barra inferior.

Ferramentas usa cabeçalho curto e cartões horizontais com ícones de 44 px, descrição, nome e ação preservados. A mesma matriz nativa determina todos os atalhos. Na fixture cidadã de 390 px, claro e texto normal, o único atalho autorizado é Canal do Cidadão: conteúdo útil até o fim da seção 789,44 → 483,72 px; cartão 287,14 → 159,34 px. Não usamos a altura mínima flexível da página para alegar economia.

Validação local: `profile-tools-mobile.mjs` cobre 12 combinações de 320/360/390 px, claro/escuro e texto 100/200%, com assets CSS atrasados 150 ms e JS 300 ms. Verifica primeiros quadros úteis, visualização inicial, edição por teclado, rascunho em navegação real, erro e sucesso de salvamento, cancelamento, perfil permitido de outra pessoa, retorno repetido de Ferramentas, recarga e ausência de overflow. APIs e WebSockets são sintéticos e isolados. Fixtures usam cargo cidadão; nenhum dado real de usuário ou paciente é acessado. O gate roda em CI.

O teste existente de Perfil preserva foto/modal/câmera, controles originais, chat e navegação. A comparação de desktop/impressão usa a mesma base e exige igualdade exata dos controles, estilos e medidas observados; tolerâncias e baselines não foram relaxados. A expectativa antiga de Ferramentas dentro do menu do Perfil foi atualizada para o pedido explícito de acesso somente por Home.

Limites: texto ampliado é escala sintética de fontes; assets quentes são reutilização no navegador de teste, sem prova de Service Worker produtivo. Aceite em aparelho real permanece com o usuário. Publicação depende dos gates do SHA final e confirmação de Pages/Cloudflare Pages/Workers no SHA integrado.
