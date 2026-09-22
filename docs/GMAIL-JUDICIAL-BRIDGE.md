# Ponte Gmail → alertas judiciais do Portal

## Objetivo

Transportar para a central existente de notificações do Portal somente os e-mails que o monitoramento do ChatGPT classificou como judiciais e que exigem atenção.

Fluxo:

1. a automação **Monitor Judicial** analisa o Gmail;
2. quando a mensagem exige atenção, aplica a etiqueta `PORTAL_JUDICIAL_ALERTA`;
3. um Google Apps Script da conta institucional busca mensagens com essa etiqueta e sem `PORTAL_JUDICIAL_ENVIADO`;
4. o Apps Script envia somente metadados mínimos ao Worker:
   - ID técnico da mensagem;
   - ID técnico da conversa;
   - remetente;
   - assunto;
   - data/hora recebida;
5. o Worker grava um alerta idempotente no D1 e cria `judicial_alert` para Wellyton, Josiane e Lorrana;
6. o sino, o contador de não lidas, o histórico e o Web Push já existentes são reaproveitados;
7. quando o Worker confirma entrega para todos os destinatários configurados, o Apps Script acrescenta `PORTAL_JUDICIAL_ENVIADO` à mensagem.

O corpo e os anexos do e-mail **não são enviados para o Portal**.

## Segurança

A rota externa é:

`POST /api/integrations/gmail-judicial`

Ela não aceita sessão comum do Portal como autenticação. Exige o header:

`X-Portal-Bridge-Secret`

O valor deve existir como secret do Worker:

`GMAIL_BRIDGE_SECRET`

e como Script Property do Apps Script:

`PORTAL_BRIDGE_SECRET`

O mesmo valor é usado nas duas pontas. O segredo deve possuir no mínimo 32 caracteres e nunca deve ser versionado, enviado por e-mail ou colocado em logs.

O deploy seguro trata `GMAIL_BRIDGE_SECRET` como binding crítico. A versão da ponte não deve chegar a produção antes da criação desse secret.

## Destinatários

Variável não sensível:

`GMAIL_JUDICIAL_RECIPIENTS = "wellyton,josiane,lorrana"`

O Worker resolve os nomes contra `auth_users` e sincroniza o respectivo perfil social. Se qualquer destinatário não existir, o endpoint retorna `complete:false` e a mensagem não recebe `PORTAL_JUDICIAL_ENVIADO`; novas tentativas são seguras porque a persistência é idempotente.

## Idempotência

`portal_judicial_alerts.gmail_message_id` é único.

As notificações judiciais também possuem índice único por:

- destinatário;
- tipo;
- tipo de entidade;
- ID da entidade.

Reexecutar a ponte para a mesma mensagem não duplica alertas.

## Instalação do Apps Script

Código versionado em:

`scripts/gmail-judicial/Code.gs`

Criar um projeto standalone em https://script.google.com usando a conta `regulacaoeldoradoms@gmail.com`, colar o conteúdo de `Code.gs` e adicionar em **Configurações do projeto → Propriedades do script**:

- propriedade: `PORTAL_BRIDGE_SECRET`
- valor: exatamente o mesmo secret configurado no Worker.

Executar manualmente uma vez:

`instalarPonteJudicial`

A função:

- confirma/cria as duas etiquetas;
- remove trigger duplicado da própria ponte;
- cria um trigger a cada 5 minutos;
- executa um dry-run autenticado contra o Worker;
- não cria notificação de teste.

O primeiro uso exigirá autorização Google para Gmail, requisições externas e criação do trigger.

## Teste

Depois que o Worker estiver publicado e o Script Property configurado, executar:

`testarPonteJudicial`

Resultado esperado:

```json
{
  "ok": true,
  "dryRun": true,
  "complete": true,
  "recipients": ["wellyton", "josiane", "lorrana"],
  "missingRecipients": []
}
```

Se `complete` vier falso, corrigir os usernames antes de ligar o trigger.

## Operação

A sincronização normal executa:

`sincronizarJudiciaisComPortal`

Uma mensagem somente recebe `PORTAL_JUDICIAL_ENVIADO` depois que o Worker responder `complete:true`.

Na central do Portal, o alerta mostra:

- marcador ⚖️;
- assunto;
- remetente;
- data e horário em que a mensagem foi recebida no Gmail.

O histórico completo permanece em `/notificacoes/`.
