# Gate de Deploy Seguro do Worker

Atualizado em 18/09/2026.

## Objetivo

Impedir que uma nova versão do Worker institucional entre em produção quando perder bindings, secrets ou referências críticas já presentes na versão produtiva.

A origem desta proteção é o incidente da Agenda DigSaúde de 17–18/09/2026: o código permaneceu íntegro, mas uma versão do Worker foi publicada sem os bindings Firebase necessários. A rota da Agenda passou a responder 503 antes de consultar o Firestore.

## Princípio

O deploy produtivo deixa de usar `wrangler deploy` diretamente.

O fluxo aprovado é:

1. executar sintaxe e testes do Worker;
2. consultar a versão que está em 100% da produção;
3. exigir que a Worker Version mais recente seja exatamente essa versão produtiva;
4. obter o `database_id` de `AUTH_DB` da produção e criar uma configuração efêmera;
5. executar `wrangler versions upload --dry-run`;
6. enviar uma nova Worker Version sem tráfego;
7. inspecionar a candidata;
8. exigir todos os bindings críticos;
9. exigir que todos os secrets existentes na produção continuem presentes na candidata;
10. exigir o mesmo `AUTH_DB`;
11. preservar exatamente os valores públicos estáveis do Firebase quando eles forem `plain_text`;
12. reconfirmar que a produção não mudou durante a inspeção;
13. promover somente a versão candidata validada para 100%;
14. consultar anonimamente `/api/agenda`;
15. considerar 401/403 saudável, porque significa que a requisição alcançou a barreira de autenticação;
16. considerar 503 falha de Firebase/armazenamento e restaurar automaticamente a versão produtiva anterior;
17. reconfirmar versão e bindings depois da promoção.

## Bindings críticos fixos

O gate exige atualmente:

- `AUTH_DB` como D1;
- `AI` como binding Workers AI;
- `FIREBASE_PROJECT_ID`;
- `FIREBASE_CLIENT_EMAIL`;
- `FIREBASE_PRIVATE_KEY` como secret;
- `FIREBASE_STORAGE_BUCKET`;
- `AUTH_SESSION_SECRET`;
- `AUTH_RATE_LIMIT_SECRET`;
- `GEMINI_API_KEY`.

Além da lista fixa, todos os bindings `secret_text` ou `secret_key` presentes na versão produtiva são preservados dinamicamente. Assim, secrets adicionados no futuro também não podem desaparecer silenciosamente.

`FIREBASE_WEB_API_KEY` não é requisito do gate da Agenda porque a rota Firestore da Agenda não depende dela. Se esse recurso voltar a ser necessário como requisito global, a decisão deve ser documentada e testada antes de incluí-lo como bloqueador fixo.

## Fail closed

O gate para antes da promoção quando:

- a produção não estiver em uma única versão a 100%;
- a Worker Version mais recente não for a mesma que está em produção;
- o dry-run falhar;
- o upload falhar;
- faltar qualquer binding crítico;
- desaparecer qualquer secret que existia na produção;
- `AUTH_DB` apontar para outro banco;
- project ID, client email ou bucket Firebase mudarem silenciosamente quando armazenados como `plain_text`;
- a produção mudar enquanto a candidata está sendo validada.

Se a candidata já tiver sido enviada mas ainda não promovida, ela permanece sem tráfego e o processo termina. Não é permitido repetir automaticamente nesse estado, porque o próximo upload poderia herdar secrets de uma versão não produtiva.

## Rollback automático

Depois que a promoção começa, qualquer falha do pós-deploy faz o script tentar colocar a versão produtiva anterior novamente em 100%.

Marcadores operacionais:

- sucesso: `DEPLOY_SEGURO_CONCLUIDO`;
- rollback concluído: `ROLLBACK_DE_SEGURANCA=OK`;
- rollback não confirmado: `ROLLBACK_DE_SEGURANCA=FALHOU`.

No último caso, novos deploys devem ser interrompidos até conferência manual.

## Arquivos

- `worker/scripts/deploy-safe.mjs`: gate produtivo;
- `worker/tests/deploy-safe.test.mjs`: testes de regressão;
- `.github/workflows/validate-worker-safe-deploy.yml`: protege o próprio gate;
- `worker/package.json`: `deploy` e `deploy:safe` apontam para o gate; `wrangler` fica fixado exatamente em `4.133.0` para que Workers Builds e validações usem a mesma versão.
- o gate executa diretamente `node_modules/wrangler/bin/wrangler.js` com o `node` corrente; não chama `npx` em subprocesso. Isso evita diferenças de resolução/execução do wrapper no ambiente do Workers Builds.

## Configuração Cloudflare necessária

No Worker `yellow-wave-d0a1guia-regulacao-ia`, com root directory `/worker` e production branch `main`, o Deploy command deve ser:

```text
npm run deploy:safe
```

Não alterar os Runtime variables and secrets para ativar o gate.

## Segurança

- nenhum valor de secret é lido ou impresso pelo gate;
- o gate fixa explicitamente o Account ID técnico já usado pelo projeto e também o injeta no config somente-leitura, evitando seleção ambígua de conta no Workers Builds;
- nenhum token ou credencial é versionado;
- a configuração temporária de leitura é criada fora do repositório; a configuração efêmera usada pelo Wrangler para upload fica temporariamente dentro de `/worker` para que `main = "index.js"` continue sendo resolvido corretamente, e é apagada no `finally`;
- o gate trabalha somente com nomes/tipos dos secrets e com valores `plain_text` que a própria API de versão já expõe;
- a verificação pós-deploy da Agenda é anônima e não acessa dados de pacientes.
