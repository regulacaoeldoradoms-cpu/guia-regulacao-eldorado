# Atualização do HTML das rotas compartilhadas

A reprodução usa HTML e SW de `709444b2` com conta fictícia cidadão/admin em modo escuro, depois entrega o checkout atual no mesmo navegador e armazenamento. O SW pré-621 pode devolver o HTML antigo enquanto atualiza o cache; seu Home JS v1 limita a apresentação a cidadão. Atualizar o cache não troca o DOM já aberto. A reprodução é Chromium com viewport/touch móvel, não um aparelho Android real nem prova de qual camada está ativa no aparelho do usuário.

A política `20261010-citizen-html-1` revalida somente o HTML das dez rotas compartilhadas, com `cache: no-cache` e prazo de 2,5 segundos. Em erro, offline ou demora, mantém a cópia disponível e os fallbacks Home/login existentes. A resposta lenta ainda pode atualizar o cache para a próxima navegação. Sem nenhuma cópia, responde 503 após o prazo. Redirecionamentos HTTP permanecem redirecionamentos.

O arquivo do SW muda de bytes para permitir a atualização normal do registro. `CACHE_VERSION` e os namespaces permanecem iguais: não há limpeza global, alteração de assets, permissões, APIs ou runtime de mascotes. A ativação original mantém o formulário aberto e não força navegação. Uma página antiga já renderizada só recebe o HTML novo na próxima navegação/reload.

## Verificação focada

```sh
node --test testing/citizen-cache/cache-policy.test.mjs
node testing/citizen-cache/cache-update.mjs /tmp/citizen-cache-update.json
```

Os testes funcionais cobrem as dez rotas, prazo, fallback frio/offline/HTTP, query/hash/aliases, redirecionamentos, assets, requisições privadas e preservação da estratégia das rotas profissionais. O navegador real do harness verifica cidadão/admin com registro pré-621, rede boa/lenta/perda de conexão, rascunho aberto, armazenamento, cache de assets, API de prova local e atualização via recargas normais. Todos os dados e endpoints de API são fictícios; nenhum paciente, foto, post ou conta real é copiado.

## Instrução de atualização validada

Com internet, salve o que estiver digitando e recarregue a página normalmente. Se a aba ainda mostrar a barra antiga, aguarde a atualização do navegador e recarregue novamente. O teste demonstra essa sequência sem limpar dados ou reinstalar. Não se promete resolver o aparelho específico sem conferir as versões/viewport que ele recebeu. Com rede lenta ou offline, a cópia antiga pode ser mostrada para manter o uso; uma navegação posterior com internet recebe a atual.
