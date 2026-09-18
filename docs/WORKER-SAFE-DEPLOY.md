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
3. consultar a Worker Version mais recente; se ela não for a produção, aceitá-la somente quando for identificada como candidata criada pelo próprio gate e quando todos os bindings críticos, secrets, Firebase estável e `AUTH_DB` continuarem equivalentes à produção;
4. obter o `database_id` de `AUTH_DB` e a lista de nomes dos secrets da produção;
5. criar configuração efêmera com `AUTH_DB` explícito e `secrets.required` dinâmico, sem gravar valores secretos;
6. executar `wrangler versions upload --dry-run` com a configuração efêmera protegida;
7. enviar uma nova Worker Version sem tráfego usando mensagem e tag próprias do gate;
8. inspecionar a candidata;
9. exigir todos os bindings críticos;
10. exigir que todos os secrets existentes na produção continuem presentes na candidata;
11. exigir o mesmo `AUTH_DB`;
12. preservar exatamente os valores públicos estáveis do Firebase quando eles forem `plain_text`;
13. reconfirmar que a produção não mudou durante a inspeção;
14. promover somente a versão candidata validada para 100%;
15. consultar anonimamente `/api/agenda`;
16. considerar 401/403 saudável, porque significa que a requisição alcançou a barreira de autenticação;
17. considerar 503 falha de Firebase/armazenamento e restaurar automaticamente a versão produtiva anterior;
18. reconfirmar versão e bindings depois da promoção.

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
- a Worker Version mais recente não for a produção e também não puder ser comprovada como candidata do próprio gate com bindings equivalentes aos da produção;
- uma candidata órfã do gate perder qualquer binding crítico, secret, referência Firebase estável ou o `AUTH_DB`;
- o dry-run protegido falhar;
- o upload falhar;
- faltar qualquer binding crítico;
- desaparecer qualquer secret que existia na produção;
- `AUTH_DB` apontar para outro banco;
- project ID, client email ou bucket Firebase mudarem silenciosamente quando armazenados como `plain_text`;
- a produção mudar enquanto a candidata está sendo validada.

Se uma execução anterior já tiver enviado uma candidata mas não a tiver promovido, a versão permanece sem tráfego. Na tentativa seguinte, o gate não exige exclusão manual: ele reconhece somente candidatas com a mensagem/tag reservada do próprio gate e revalida a versão órfã integralmente contra a produção antes de permitir novo upload. Versões mais recentes de origem desconhecida continuam bloqueando o processo.

A configuração efêmera também declara dinamicamente em `secrets.required` todos os nomes de secrets encontrados na produção. O gate não usa o modo global `--strict`, porque o Worker mantém bindings e variáveis legítimos gerenciados remotamente com `keep_vars=true`; esse modo pode bloquear o upload por conflito de configuração mesmo quando a herança é intencional. A proteção continua fail-closed em três camadas: validação da versão anterior, exigência explícita dos nomes de secrets e inspeção integral da candidata antes de qualquer promoção.

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
- o gate executa diretamente `node_modules/wrangler/bin/wrangler.js` com o `node` corrente; não chama `npx` em subprocesso. Isso evita diferenças de resolução/execução do wrapper no ambiente do Workers Builds;
- candidatas criadas pelo gate usam a mensagem `Portal: candidato validado pelo gate de deploy seguro` e a tag `portal-safe-deploy`; a mensagem também mantém compatibilidade com candidatas órfãs criadas antes da introdução da tag.

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
