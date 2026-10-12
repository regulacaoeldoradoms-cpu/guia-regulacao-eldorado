# Gnomo e idade privada — implementação local

Estado: implementação em branch isolada, sem merge ou publicação. Migração produtiva não executada. O lançamento depende da migração privada e de todos os gates de preservação.

## Idade e privacidade

Data civil validada no servidor, com aniversários no calendário de America/Campo_Grande. Datas ausentes, inválidas e futuras falham fechadas. Nascimento em 29/02 permanece bloqueado até01/03 em anos não bissextos, escolha conservadora de produto sem alegação legal.

Nova coleta no cadastro é privada; conta e declaração são inseridas na mesma transação. O endpoint antigo sem data continua criando uma conta com idade desconhecida e acesso aos gatos, preservando compatibilidade. A interface nova exige a data. A tabela `pet_private_age` é separada; publicUser, tokens e perfil social não incluem a data. Contas existentes usam um formulário autenticado na Galeria, aberto somente por escolha do titular. A declaração não pode ser trocada por autoatendimento; ela não é verificação documental.

Catálogo, adoção e endpoint de falas rechecados no servidor. Nenhuma data é lida do cache do cliente como prova de idade. Idade desconhecida/menor não recebe o Gnomo nem falas adultas. Adoção ainda preserva um mascote ativo, transações idempotentes e sessões atuais. A regra de cuidados e a economia existentes são reutilizadas; preços, vidas e itens dos gatos não foram alterados.

A migração `worker/migrations/pets-private-age.sql` só foi aplicada em SQLite sintético. Antes da publicação, precisa de uma execução autorizada pelo fluxo protegido. Sem ela, o catálogo dos gatos continua disponível e o Gnomo falha fechado; o cadastro com data não cria conta parcial se a transação falhar. Rollback do código pode deixar a tabela privada intacta, sem exportar nem apagar declarações.

## Arte, ações e falas

Sprite gerado via imagegen, oito ações com oito quadros cada: idle, caminhar rebolando, correr segurando chapéu, coçar barba, tropeçar/disfarçar, rir, dançar e cochilar no cogumelo. Imagem transparente1254×1254, PNG2204338bytes, carregada apenas na galeria adulta ou para o Gnomo adotado; não foi chamada de asset leve ou atribuída melhoria de bytes sem medição.

54 falas únicas aprovadas no módulo `_server/gnome-phrases.js`, importado apenas pelo Worker, com IDs e versão estáveis, sem atribuição a autores. Não importadas pelo navegador: o cliente recebe o repertório por endpoint autenticado somente após idade adulta e adoção. Ciclo completo evita repetição imediata, inclusive entre ciclos; sessionStorage persiste IDs e prazos, não textos nem nascimento.

Duração individual:180palavras/minuto mais2segundos, mínimo6segundos, sem teto para textos longos. Os sete segundos dos gatos permanecem intactos. O Gnomo pausa os prazos em aba oculta, necessidades urgentes, movimento reduzido ou mascote oculto; a próxima fala só vem depois do término da atual e de um intervalo.

## Evidência e pendências

- 14 contratos existentes de domínio dos gatos passaram.
- 73 testes de regressão de auth/social/grupos/documentos passaram com a alteração do cadastro.
- Datas-limite, catálogo e adoção negados para desconhecido/menor, declaração imutável, atomicidade do cadastro e rollback sem migração,54falas e dois ciclos de leitura testados em fixtures.
- Teste nativo `node testing/pets/gnome-mobile.mjs`: desconhecido com coleta legada, menor e adulto; adoção, endpoint real comSQLitesintético, oito quadros distintos por ação, um companheiro após Home↔Mascotes. Repetido com a arte pixel final.
- Um defeito de duas instâncias de bootstrap foi reproduzido e corrigido unificando URLs da apresentação cidadã e do fallback. Não houve reescrita de política global de cache.

Ainda obrigatórios: matriz visual ampla320/360/390 claro/escuro/texto200, desktop/print, gates originais de navegação/vidas/falas, higiene final dos entrypoints sobre a PR640 publicada, revisão da migração e CI completo. Não considerar aceito em aparelho real ou pronto para lançar antes dessas etapas.

O repertório fica em `_server/`, excluído pelo build Jekyll de Pages. O `_redirects` adiciona uma regra exclusiva para impedir que Cloudflare Pages entregue esse diretório como conteúdo estático quando usa a raiz diretamente. Fontes: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll e https://developers.cloudflare.com/pages/configuration/redirects/. A disponibilidade desses arquivos por URLs estáticas deve ser rechecadas nos artefatos e no deploy antes do lançamento; o repositório de código permanece público, o bloqueio é do serviço do Portal.
