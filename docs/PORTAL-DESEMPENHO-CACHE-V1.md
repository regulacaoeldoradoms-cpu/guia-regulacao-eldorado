# Desempenho, cache seguro e pré-carregamento do Portal — V1

Revisado em 10/09/2026.

## Objetivo

A navegação deve se comportar como um mapa previamente preparado: depois do login, a
interface pública e as áreas autorizadas da conta são aquecidas antes do clique. O
conteúdo que precisa estar atualizado continua sendo consultado no Worker, em segundo
plano e sem bloquear a primeira pintura da tela.

A aceleração nunca transforma cache de interface em fonte de autorização. O Worker e
as APIs protegidas permanecem como autoridade para cargos, capacidades e acesso a
dados.

## Fluxo desde o login

1. O login valida as credenciais no Worker.
2. A sessão validada é guardada no armazenamento local já usado pelo Portal.
3. A interface abre imediatamente com os dados válidos dessa sessão.
4. A sessão é reconferida silenciosamente quando a última validação tem mais de 45
   segundos.
5. O catálogo central calcula as ferramentas autorizadas para a conta.
6. O service worker aquece a Home, Ferramentas, Conta, rotas sociais e somente os
   módulos presentes nesse catálogo.
7. Links visíveis, focados, tocados ou apontados recebem prioridade de pré-carregamento.

Em conexões com economia de dados ou classificadas como 2G, o Portal aquece apenas o
núcleo e a página atual.

## Estratégias aplicadas

### Interface estática

O service worker mantém dois caches versionados:

- páginas públicas do Portal;
- CSS, JavaScript, fontes, imagens, áudio e manifestos locais.

Uma página já armazenada é exibida imediatamente. Em paralelo, o navegador busca a
versão atual e a deixa preparada para a próxima navegação. Arquivos com versão na URL
usam cache-first; arquivos sem versão usam stale-while-revalidate.

O service worker usa navigation preload, evita requisições duplicadas em voo, limita a
concorrência e remove apenas versões antigas dos caches que pertencem ao próprio
Portal.

### Sessão e identidade

`requireRole()` usa a sessão local válida para montar a interface sem uma espera
remota inicial. A reconferência ocorre em segundo plano. Resposta 401 limpa a sessão e
redireciona para o login.

`/api/auth/me` entrega os dados necessários da própria conta, inclusive a foto quando
permitida, eliminando a segunda consulta serial que antes era feita a
`/api/auth/profile`.

A interface pode aparecer a partir do último cargo validado, mas nenhuma API protegida
confia nessa informação do navegador: cada operação continua revalidando sessão e
permissão no backend.

### Camada social

A configuração funcional da camada social pode ser reaproveitada em
`sessionStorage`, isolada por usuário, por até 15 minutos. Ela é atualizada em
segundo plano e a navegação recebe os novos contadores e flags sem recarregar a página.

A lista de amigos recebe um snapshot transitório separado, também isolado por usuário
em `sessionStorage`, com validade máxima de 5 minutos e revalidação preferencial
depois de 30 segundos. Esse snapshot contém apenas os resumos sociais já autorizados
para a própria conta, é limpo no logout e nunca entra no service worker. A navegação
inicia sua carga em segundo plano para reduzir a espera ao abrir `/amigos/`; a tela
percorre todas as páginas por cursor, deduplica os perfis e pagina localmente em
10, 20, 30 ou Todos.

Perfil social e primeira página do feed são solicitados em paralelo.

As fotos de perfil sociais usam um cache binário local separado em Cache Storage. Cada
foto recebe no backend uma versão própria, alterada somente quando o avatar é trocado
ou removido. O cliente combina visualizador, @handle e versão para formar a chave do
cache: se a versão já estiver armazenada, reutiliza o blob local sem baixar a imagem
novamente; se a versão mudar, baixa a nova foto uma vez e elimina a versão anterior.
Requisições simultâneas do mesmo avatar também são consolidadas para evitar downloads
duplicados na mesma página.

Esse cache não passa pelo service worker, não é fonte de autorização e não armazena
respostas gerais das APIs sociais. O Worker continua decidindo se o perfil pode ser
visualizado antes de fornecer a foto. O cache de avatares é apagado no logout e suas
chaves são isoladas por usuário visualizador.

### Imagens e conteúdo abaixo da dobra

Imagens dos cartões de ferramenta usam carregamento tardio e decodificação assíncrona.
A marca do login passou do PNG de aproximadamente 1,6 MB para o SVG existente de
aproximadamente 160 KB. Os símbolos gerais do Portal passaram do PNG de
aproximadamente 1 MB para o WebP existente de aproximadamente 8 KB onde a imagem é
exibida.

## Limites de segurança

Nunca entram no cache do service worker:

- qualquer rota `/api/*` ou `/cdn-cgi/*`;
- requisições com `Authorization` ou `Range`;
- respostas com `Cache-Control: no-store` ou `private`;
- respostas que definem cookie;
- métodos diferentes de GET;
- conteúdo de outra origem.

Também não são persistidos em cache de aplicação:

- feed, publicações, comentários e mensagens;
- chat;
- manifestações e anexos;
- nomes ou dados de pacientes;
- teleatendimentos;
- respostas das APIs protegidas, exceto a configuração social, o snapshot transitório
  da lista de amigos e o cache binário versionado de fotos de perfil explicitamente
  descritos acima;
- resultados administrativos, de moderação ou monitoramento.

Logout limpa os pequenos caches de sessão da configuração social, a lista transitória
de amigos e o Cache Storage de fotos de perfil. A troca de versão do service worker
invalida automaticamente os caches estáticos anteriores, sem administrar o cache
privado de avatares.

## Arquivos centrais

- `js/portal-performance.js`: registro, priorização de rotas e aquecimento por perfil;
- `portal-sw.js`: política de cache, atualização e pré-carregamento;
- `js/auth-client.js`: abertura pela sessão válida e reconferência silenciosa;
- `js/social-api.js`: stale-while-revalidate da configuração social, pré-carga
  transitória da lista de amigos e cache local versionado de avatares;
- `js/social-home.js`: carregamento paralelo do perfil e do feed;
- `js/tools-catalog.js`: matriz única de autorização e imagens tardias.

## Validação

A suíte automatizada verifica que:

- todas as entradas ativas registram uma única camada de desempenho;
- as rotas pré-carregadas derivam da matriz de ferramentas existente;
- URLs externas e rotas de API são recusadas;
- conexões com economia de dados reduzem o aquecimento;
- a sessão abre antes da reconferência remota;
- o feed e os dados protegidos não são persistidos fora das exceções sociais
  explicitamente documentadas;
- os assets leves e as versões corretas são usados nas páginas ativas.

A primeira visita depois de uma nova versão ainda precisa baixar o núcleo atualizado.
A partir dessa instalação, as transições elegíveis aproveitam o conteúdo já preparado.
