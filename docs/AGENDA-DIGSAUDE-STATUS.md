# Agenda DigSaúde — Status

Atualizado em 16/09/2026.

## Estado atual

- Frente: Agenda DigSaúde V1.
- V1 original mesclada na `main` pelo PR #185 em `77a1b7b55750ce19ba1c0d3cf8ddf5070ec6c751`.
- Primeira homologação real iniciada em 16/09/2026 com sessão autorizada do DigSaúde.
- O primeiro envio real de 40 agendamentos chegou à ponte do Portal, mas o Worker falhou com `Too many subrequests by single Worker invocation`.
- Causa: a V1 fazia leitura e gravação individual no Firestore por registro, excedendo o limite de subrequests do Cloudflare.
- Correção mesclada pelo PR #186 em `cd1d67232f34acd77d0b194be194a75d816fc8ce`.
- Deploy de produção do Worker concluído com sucesso em 16/09/2026, versão Cloudflare `a790bd06-b51a-4a02-8bf2-fe2a28f84849`.
- Próximo estado de homologação: repetir o mesmo envio real dos 40 agendamentos.

## Correção aplicada

- a sincronização carrega o estado existente do Firestore uma vez com `listAll`;
- compara os registros em memória pelo `sourceId`;
- acumula criações, atualizações, reativações e desativações;
- grava pelo endpoint `documents:commit` do Firestore;
- divide lotes em até 450 writes, abaixo do limite de 500 por commit;
- preserva `readBy`, `firstSeenAt` e demais metadados;
- reativação também atualiza `lastChangedAt`, fazendo o item voltar a ser não lido;
- `markRead` continua unitário, pois atua em apenas um registro;
- teste de regressão impede retorno ao padrão N+1 de subrequests.

## Validação

- PR #186 validado com 21/21 workflows concluídos com sucesso no head `986e9d5bff87f23ee0e8abe40e1683b255331973`, incluindo `Validar Agenda DigSaúde V1`;
- sintaxe do Worker e do gateway passou nas suítes de regressão;
- build/deploy de produção do Worker concluído com sucesso após o merge;
- homologação funcional real ainda depende de repetir o envio no navegador autorizado.

## Por que foi feito assim

O erro não era do Tampermonkey, do DigSaúde ou da sessão do usuário. O snapshot chegou corretamente ao Portal; a falha ocorria ao persistir dezenas de registros com chamadas individuais. O commit em lote reduz dezenas de subrequests externos para poucas chamadas controladas, sem guardar credenciais do DigSaúde nem ampliar permissões.

## Alternativas descartadas

- aumentar artificialmente o limite de subrequests como solução principal;
- dividir o envio em dezenas de requisições do navegador;
- armazenar senha, cookie ou sessão do DigSaúde no backend;
- remover comparação de registros ou leitura individual para economizar chamadas.

Essas alternativas aumentariam fragilidade, exposição ou complexidade sem corrigir a causa arquitetural.

## Segurança e privacidade

- DigSaúde continua como fonte oficial;
- Portal continua somente leitura em relação ao DigSaúde;
- nenhuma senha, cookie, sessão ou token CSRF do DigSaúde é enviado ao Portal;
- Agenda continua sem PostHog/observabilidade de conteúdo clínico;
- respostas da API permanecem `no-store`.

## Próximo passo exato

1. no DigSaúde, manter a aba **Agendados** aberta;
2. clicar novamente em **Enviar Agenda ao Portal**;
3. confirmar que a janela `/agenda/sync/` conclui sem erro;
4. voltar à `/agenda/` e clicar em **Atualizar**;
5. validar que os 40 registros aparecem, com totais e estado de novos/alterados coerentes;
6. testar abertura de um registro e confirmar leitura individual;
7. registrar aqui o resultado final da homologação.

## Riscos restantes

- se a lista futura ultrapassar uma página do DigSaúde, snapshots parciais não podem desativar ausentes;
- mudanças futuras no HTML Filament/Livewire podem exigir ajuste do extrator;
- a homologação final desta correção ainda depende do reteste real descrito acima.
