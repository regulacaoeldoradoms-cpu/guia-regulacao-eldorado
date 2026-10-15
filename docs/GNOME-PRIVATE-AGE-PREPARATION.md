# Gnomo e idade privada — implementação local

**Atualização de cadastro em 15/10/2026:** veja [a candidata de cadastro privado](ACCOUNT-PRIVATE-REGISTRATION-CANDIDATE.md), que substitui a compatibilidade de cadastro sem data e restringe a declaração na Galeria ao snapshot de contas legadas. As evidências históricas abaixo não substituem os testes dessa candidata.

Estado: implementação em branch isolada, sem merge ou publicação. Migração produtiva não executada. O lançamento depende da migração privada e de todos os gates de preservação.

## Idade e privacidade

Data civil validada no servidor, com aniversários no calendário de America/Campo_Grande. Datas ausentes, inválidas e futuras falham fechadas. Nascimento em 29/02 permanece bloqueado até01/03 em anos não bissextos, escolha conservadora de produto sem alegação legal.

Nova coleta no cadastro é privada; conta e declaração são inseridas na mesma transação. O endpoint antigo sem data continua criando uma conta com idade desconhecida e acesso aos gatos, preservando compatibilidade. A interface nova exige a data. A tabela `pet_private_age` é separada; publicUser, tokens e perfil social não incluem a data. Contas existentes usam um formulário autenticado na Galeria, aberto somente por escolha do titular. A declaração não pode ser trocada por autoatendimento; ela não é verificação documental.

Catálogo, adoção e endpoint de falas rechecados no servidor. Nenhuma data é lida do cache do cliente como prova de idade. Idade desconhecida/menor não recebe o Gnomo nem falas adultas. Adoção ainda preserva um mascote ativo, transações idempotentes e sessões atuais. A regra de cuidados e a economia existentes são reutilizadas; preços, vidas e itens dos gatos não foram alterados.

A migração `worker/migrations/pets-private-age.sql` só foi aplicada em SQLite sintético. Antes da publicação, precisa de uma execução autorizada pelo fluxo protegido. Sem ela, o catálogo dos gatos continua disponível e o Gnomo falha fechado; o cadastro com data não cria conta parcial se a transação falhar. Rollback do código pode deixar a tabela privada intacta, sem exportar nem apagar declarações.

## Arte, ações e falas

Sprite gerado via imagegen, oito ações com oito quadros cada: idle, caminhar rebolando, correr segurando chapéu, coçar barba, tropeçar/disfarçar, rir, dançar e cochilar no cogumelo. Imagem transparente1254×1254, PNG2204338bytes, carregada apenas na galeria adulta ou para o Gnomo adotado; não foi chamada de asset leve ou atribuída melhoria de bytes sem medição.

55 falas únicas aprovadas no módulo `_server/gnome-phrases.js`, importado apenas pelo Worker, com IDs e versão estáveis, sem atribuição a autores. Não importadas pelo navegador: o cliente recebe o repertório por endpoint autenticado somente após idade adulta e adoção. Ciclo completo evita repetição imediata, inclusive entre ciclos; sessionStorage persiste IDs e prazos, não textos nem nascimento.

Duração individual:180palavras/minuto mais2segundos, mínimo6segundos, sem teto para textos longos. Os sete segundos dos gatos permanecem intactos. O Gnomo pausa os prazos em aba oculta, necessidades urgentes, movimento reduzido ou mascote oculto; a próxima fala só vem depois do término da atual e de um intervalo.

## Evidência e pendências

- 14 contratos existentes de domínio dos gatos passaram.
- 73 testes de regressão de auth/social/grupos/documentos passaram com a alteração do cadastro.
- Datas-limite, catálogo e adoção negados para desconhecido/menor, declaração imutável, atomicidade do cadastro e rollback sem migração,55falas e dois ciclos de leitura testados em fixtures.
- Teste nativo `node testing/pets/gnome-mobile.mjs`: desconhecido com coleta legada, menor e adulto; adoção, endpoint real comSQLitesintético, oito quadros distintos por ação, um companheiro após Home↔Mascotes. Repetido com a arte pixel final.
- Um defeito de duas instâncias de bootstrap foi reproduzido e corrigido unificando URLs da apresentação cidadã e do fallback. Não houve reescrita de política global de cache.

Matriz ampla320/360/390 claro/escuro/texto200 e gates originais de gatos concluídos. Galeria dos gatos fica utilizável enquanto o PNG do Gnomo está pendente; teste mantém o download bloqueado até verificar os botões nativos. A branch foi atualizada sobre a PR640 publicada, preservando o modal e versionando conjuntamente os entrypoints dependentes. Ainda obrigatórios: revisão desktop/print, revisão da migração, artefatos estáticos e CI completo. Não considerar aceito em aparelho real ou pronto para lançar antes dessas etapas.

O repertório fica em `_server/`, excluído pelo build Jekyll de Pages. O `_redirects` adiciona uma regra exclusiva para impedir que Cloudflare Pages entregue esse diretório como conteúdo estático quando usa a raiz diretamente. Fontes: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll e https://developers.cloudflare.com/pages/configuration/redirects/. A disponibilidade desses arquivos por URLs estáticas deve ser rechecadas nos artefatos e no deploy antes do lançamento; o repositório de código permanece público, o bloqueio é do serviço do Portal.

A consulta GET de idade no cliente é opcional e não bloqueia a abertura dos controles dos gatos: os cenários com resposta retida e503 verificam cuidados utilizáveis, Gnomo ausente e nenhuma fala adulta. Somente a resposta autenticada permite oferecer declaração; catálogo/adoção/falas continuam decididos pelo servidor.

A CI também gera um artefato real com actions/jekyll-build-pages, sem deploy, e exige ausência de `_server` no resultado. A regra de deny do preview Cloudflare ainda deve ser conferida por acesso anônimo disponível;403do proxy que também impede `/mascotes/` não comprova essa proteção. Plano de migração/rollout preparado em arquivo local de revisão, sem execução remota.

Identidade do preview conferida na CI: o projeto Cloudflare `portal-regulacao-central-staging` entrega o Laboratório da Central de Documentos, inclusive em `/mascotes/`. Ele não é um preview do Portal e não comprova acesso/layout de Mascotes nem a proteção estática do Portal. O probe adicional que esperava a página de Mascotes nesse host foi removido por alvo incorreto; as verificações existentes e a exclusão do artefato Jekyll permanecem estritas. A URL real do Portal deve ser conferida após o rollout autorizado. Não alterar esse projeto ou presumir publicação do Portal por seu check verde.

A entrada do Conselho acessível ao cidadão com atribuição própria também declara o mesmo bootstrap versionado. O teste nativo isola uma conta cidadã sintética adulta com Gnomo adotado, fornece um bootstrap antigo em cache no endereço sem versão e confirma que ele não é executado: um único Gnomo e55falas no Conselho. Não se usa conta privilegiada como prova de acesso cidadão, nem se alteram módulos clínicos.

Preservação específica: a declaração para contas legadas fica separada dos painéis nativos dos gatos no desktop; no celular usa o mesmo nó na Galeria e permanece oculta na impressão. A comparação de Mascotes contra ac89d0fb conserva as mesmas asserções de igualdade, com titular sintético coerente (nascimento gravado, menor de idade e catálogo de gatos). No cadastro e Segurança, as adições/cópias aprovadas são afirmadas antes de uma projeção restrita para comparar os controles e pixels anteriores; nenhuma tolerância ou rota foi removida. A matriz nativa testa os componentes reais, incluindo gênero opcional com cinco escolhas, edição pelo titular, nascimento imutável, privacidade e reflow. Modelo atual, SQL ainda não aplicado, evidências e bloqueio de implantação em [ACCOUNT-PRIVATE-REGISTRATION-CANDIDATE.md](ACCOUNT-PRIVATE-REGISTRATION-CANDIDATE.md).
