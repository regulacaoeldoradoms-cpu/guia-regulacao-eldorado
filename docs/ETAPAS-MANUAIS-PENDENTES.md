# Etapas manuais pendentes — Canal do Cidadão / Conselho V1

Este checklist registra somente o que ainda exige painel externo, teste real no navegador ou validação institucional.

## Estado já concluído

- ✅ `AUTH_DEVELOPER_USERNAMES` configurado e conta Desenvolvedor reconhecida.
- ✅ `AUTH_RATE_LIMIT_SECRET` independente configurado.
- ✅ Projeto Firebase conectado ao Worker.
- ✅ Firestore, Storage e Authentication configurados.
- ✅ Envio e confirmação real de e-mail testados.
- ✅ Domínio de e-mail do Firebase configurado no DNS do Registro.br.
- ✅ Conta testada em Bronze → Prata.
- ✅ Foto de perfil desbloqueada no Prata.
- ✅ Migração de administradores legados concluída e `AUTH_MIGRATE_LEGACY_ADMINS=false` restaurado.
- ✅ A conta passou a ser tratada como identidade única em todos os módulos.
- ✅ Médico, Recepção, Coordenação e Desenvolvedor mantêm o próprio cargo dentro do Canal do Cidadão.
- ✅ O mesmo avatar e o mesmo nível Bronze/Prata/Ouro pertencem à conta inteira.
- ✅ Contas profissionais precisam de e-mail confirmado para abrir manifestação no Canal e, portanto, suas manifestações são sempre sigilosas.

## 1. Firebase — confirmar/publicar regras privadas

O repositório contém:

```text
firebase/firestore.rules
firebase/storage.rules
firebase.json
```

Confirmar no console Firebase que as regras em produção negam leitura/escrita direta por clientes Firebase. Na V1, o acesso ao conteúdo do Conselho ocorre pelo Worker/conta de serviço.

Não liberar regra ampla de cliente para facilitar teste.

## 2. IAM da conta de serviço

Revisar no Google Cloud os papéis da conta de serviço usada pelo Worker.

Ela deve ter somente o necessário para:

- documentos do Firestore usados pelo módulo do Conselho;
- objetos do bucket de anexos;
- operações de Identity Platform/Firebase Authentication usadas pela verificação de e-mail.

Evitar `Owner`, `Editor` ou outros papéis amplos quando não forem necessários.

## 3. Teste da conta única

Manter durante os testes:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
AUTH_MIGRATE_LEGACY_ADMINS=false
```

Com uma conta profissional que já possui e-mail verificado:

1. entrar no Portal;
2. confirmar que o cargo continua correto no Hub;
3. abrir o Canal do Cidadão;
4. confirmar que o cabeçalho continua mostrando o cargo profissional, e não “Cidadão” ou “modo cidadão”;
5. confirmar que a mesma foto aparece no Portal, na conta e no Canal;
6. confirmar que a conta aparece como Prata;
7. abrir `/conta/` e confirmar que Bronze/Prata/Ouro é exibido para a mesma conta, sem criar uma segunda progressão.

## 4. Teste completo da manifestação

Usar uma conta separada como autora quando possível para evitar confundir teste institucional com manifestação própria.

Testar:

1. abrir manifestação;
2. receber protocolo `CMS-AAAA-000000`;
3. verificar listagem em **Minhas manifestações**;
4. abrir detalhes e histórico;
5. anexar JPG ou PNG válido;
6. anexar PDF válido;
7. confirmar limite de 5 MB e máximo de 5 anexos;
8. confirmar que arquivo com extensão/MIME incompatível é recusado pela assinatura real;
9. tentar segunda manifestação antes de 2 horas e confirmar bloqueio;
10. responder dentro do protocolo existente e confirmar que a resposta continua liberada.

## 5. Teste de privacidade

### Conta profissional

Confirmar que:

- sem e-mail verificado, a criação de manifestação é recusada;
- com e-mail verificado, a manifestação é `Sigilosa`;
- o Conselho não recebe e-mail, @usuário, foto ou cargo profissional dentro da manifestação;
- o texto/anexo ainda pode revelar identidade se o próprio autor incluir dados pessoais.

### Conta sem função profissional

Confirmar que:

- sem e-mail, pode aparecer como anônima;
- depois de vincular e-mail, passa para sigilosa;
- protocolos anteriores também sincronizam para sigilosa.

## 6. Funções do Conselho durante o teste

Para validação completa, pode-se manter temporariamente:

- Wellyton: `Desenvolvedor + Presidente do Conselho`, para testar todas as ações institucionais;
- outra conta institucional: `Membro do Conselho`, para testar as restrições.

### Presidente

Confirmar:

- leitura de todas as manifestações;
- alteração de andamento;
- resposta oficial;
- observação interna;
- abertura autorizada de anexos;
- auditoria das ações.

### Membro

Confirmar:

- leitura das manifestações;
- histórico e anexos;
- observação interna;
- ausência de permissão para resposta oficial;
- ausência de permissão para alterar andamento.

## 7. Conta que também integra o Conselho

Com a mesma conta possuindo cargo principal + `council_role`:

1. abrir uma manifestação própria pelo Canal do Cidadão;
2. responder à própria manifestação na área de acompanhamento;
3. confirmar que a resposta é registrada como resposta do autor, não como resposta oficial;
4. abrir o painel institucional do Conselho;
5. confirmar que somente ali aparecem as ações institucionais correspondentes à função do Conselho.

A arquitetura mantém uma identidade única. A distinção é somente de autorização da operação para impedir confusão entre autor e instituição.

## 8. Notificações

Depois de resposta/status pelo Conselho, voltar à conta autora e confirmar:

- contador de notificação;
- texto genérico sem dados sensíveis em preview;
- abertura do protocolo correto;
- marcação individual e geral como lida.

## 9. Ativação futura do e-mail obrigatório profissional

Por enquanto manter:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
```

Pedir que médicos, Recepção, Coordenação, Desenvolvedor e contas com função no Conselho cadastrem e confirmem e-mail.

Somente depois de testar as contas existentes, alterar deliberadamente para:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=true
```

Quando ativado, o login continua possível para regularização, mas as demais ferramentas ficam bloqueadas até a confirmação. A tela `/conta/` permanece acessível.

## 10. Validação institucional antes de abrir ao público

Revisar com Conselho/gestão municipal:

- texto público do canal;
- tipos de manifestação;
- quem pode responder oficialmente;
- política de retenção/arquivamento;
- aviso de privacidade e orientações ao usuário;
- nomenclatura Bronze/Prata/Ouro e explicação de que não tem relação com os níveis oficiais do Gov.br;
- fluxo para situações que não devem ser tratadas apenas como manifestação administrativa;
- regra interna para conflito de interesse quando membro do Conselho também for autor de uma manifestação;
- regra futura de exibição social: profissional deve continuar aparecendo pelo cargo/função de saúde, nunca ser convertido visualmente em “Cidadão”.

O portal já informa que o Canal do Conselho não realiza agendamento, não altera solicitação da Regulação e não substitui atendimento de urgência/emergência.

## Não ativar ainda

Deixar para fase posterior:

- feed social;
- amizade/chat cidadão-profissional;
- descoberta pública de profissionais;
- nível Ouro efetivo / autenticação adicional por novo dispositivo;
- recuperação por chave sem e-mail;
- App Check/reCAPTCHA Enterprise até o fluxo atual estar completamente validado.

## Regra de segurança da publicação

Não abrir o Canal do Cidadão ao público até concluir os testes de autorização, privacidade, anexos e Conselho e revisar os itens institucionais acima.
