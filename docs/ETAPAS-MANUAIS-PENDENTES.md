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
- ✅ Migração de administradores legados concluída e `AUTH_MIGRATE_LEGACY_ADMINS=false` restaurado.
- ✅ A conta passou a ser tratada como identidade única em todos os módulos.
- ✅ Médico, Recepção, Coordenação e Desenvolvedor mantêm o próprio cargo dentro do Canal do Cidadão.
- ✅ O mesmo avatar e o mesmo nível Bronze/Prata/Ouro pertencem à conta inteira.
- ✅ O backend e a interface normalizam toda nova manifestação sem e-mail verificado para anônima, inclusive se a conta for profissional.
- ✅ Conta com e-mail verificado escolhe entre sigilosa e identificada; padrão/fallback permanecem sigilosos.
- ✅ Protocolos anônimos não são convertidos retroativamente após futura verificação de e-mail.
- ✅ Membro possui acesso anônimo e somente leitura, sem anexos ou observações internas.
- ✅ Desenvolvedor possui capacidade institucional equivalente à Presidência sem alteração do cargo salvo.
- ✅ `council_role=presidente` está bloqueado de abrir nova manifestação no backend.

## 1. Firebase — confirmar/publicar regras privadas

Confirmar no console Firebase que as regras em produção negam leitura/escrita direta por clientes Firebase. Na V1, o acesso ao conteúdo do Conselho ocorre pelo Worker/conta de serviço.

Não liberar regra ampla de cliente para facilitar teste.

## 2. IAM da conta de serviço

Revisar no Google Cloud os papéis da conta de serviço usada pelo Worker. Ela deve ter somente o necessário para Firestore, anexos e verificação de e-mail.

Evitar `Owner`, `Editor` ou papéis amplos quando não forem necessários.

## 3. Teste da conta única

Manter durante os testes:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
AUTH_MIGRATE_LEGACY_ADMINS=false
```

Confirmar:

1. cargo correto no Hub;
2. mesmo cargo dentro do Canal do Cidadão;
3. mesma foto em todos os módulos;
4. conta sem e-mail verificado aparece Bronze;
5. conta com e-mail verificado aparece Prata;
6. `/conta/` mostra uma única progressão Bronze/Prata/Ouro.

## 4. Teste completo da manifestação

Usar uma conta que não seja Presidente do Conselho.

Testar:

1. abrir manifestação;
2. receber protocolo `CMS-AAAA-000000`;
3. verificar listagem em **Minhas manifestações**;
4. abrir detalhes e histórico;
5. anexar JPG/PNG/PDF válidos;
6. confirmar limite de 5 MB e máximo de 5 anexos;
7. confirmar rejeição de extensão/MIME incompatível;
8. tentar segunda manifestação antes de 2 horas e confirmar bloqueio;
9. responder dentro de protocolo existente.

## 5. Teste de privacidade

### Sem e-mail verificado

Confirmar que qualquer conta elegível para criar manifestação — inclusive Médico, Recepção, Coordenação e Desenvolvedor — pode gerar uma nova manifestação marcada como `Anônima`.

Se existir e-mail cadastrado, mas ele ainda não estiver confirmado, a manifestação nova continua anônima.

### Com e-mail verificado

Confirmar que a opção padrão cria manifestação `Sigilosa`; depois escolher `Identificada` e confirmar que somente nome de perfil, @ e cargo/função autorizados aparecem. Em ambos os casos, o Conselho não recebe endereço de e-mail nem identificadores técnicos de autenticação.

### Histórico

Confirmar que uma manifestação criada como anônima permanece anônima mesmo depois de o autor verificar o e-mail. A verificação só altera a privacidade das novas manifestações.

## 6. Funções do Conselho durante o teste

Pode-se manter temporariamente:

- Wellyton: `Desenvolvedor + Presidente do Conselho`, para testar todas as ações institucionais;
- outra conta institucional: `Membro do Conselho`, para testar as restrições.

### Presidente

Confirmar:

- leitura de todas as manifestações;
- alteração de andamento;
- resposta oficial;
- observação interna;
- abertura autorizada de anexos;
- auditoria das ações;
- **ausência do botão Nova manifestação** no Canal do Cidadão;
- tentativa direta de POST para nova manifestação recebe `COUNCIL_PRESIDENT_CANNOT_SUBMIT`.

### Membro

Confirmar:

- leitura anônima do conteúdo e do histórico;
- ausência de identidade, anexos e observações internas;
- ausência de permissão para resposta oficial, alteração de andamento ou qualquer outra interação;
- bloqueio equivalente quando a tentativa é feita diretamente pela API;
- possibilidade de abrir manifestação própria no contexto cidadão, desde que não seja Presidente.

## 7. Conta que também integra o Conselho

Para `membro`, confirmar que uma manifestação própria pode ser acompanhada normalmente e que uma resposta do autor não é confundida com resposta oficial.

Para `presidente`, não criar nova manifestação. Caso existam protocolos próprios anteriores à atribuição da Presidência, apenas validar o acompanhamento desses protocolos sem usar isso para gerar nova manifestação.

## 8. Notificações

Depois de resposta/status pelo Conselho, voltar à conta autora e confirmar:

- contador de notificação;
- texto genérico sem dados sensíveis;
- abertura do protocolo correto;
- marcação individual e geral como lida.

## 9. Ativação futura do e-mail obrigatório profissional

Decisão da V1:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
```

A exigência geral de e-mail profissional não será ativada nesta versão. A possibilidade de manifestação anônima por conta profissional existe enquanto o e-mail ainda não estiver verificado.

Qualquer mudança para `AUTH_REQUIRE_EMAIL_VERIFICATION=true` exige nova decisão institucional, atualização do dossiê e repetição dos testes em ambiente controlado, porque essa flag afeta o acesso às ferramentas profissionais. A regra de privacidade das manifestações continua baseada no estado de verificação no momento da criação.

## 10. Validação institucional antes de abrir ao público

Revisar com Conselho/gestão municipal:

- texto público do canal;
- tipos de manifestação;
- quem pode responder oficialmente;
- política de retenção/arquivamento;
- aviso de privacidade e orientações ao usuário;
- nomenclatura Bronze/Prata/Ouro;
- fluxo para situações que não devem ser tratadas apenas como manifestação administrativa;
- regra definitiva para membros do Conselho que também sejam autores;
- regra de exibição social futura dos profissionais pelo cargo/função de saúde.

## Não ativar ainda

- feed social;
- amizade/chat cidadão-profissional;
- descoberta pública de profissionais;
- nível Ouro efetivo;
- recuperação por chave sem e-mail;
- App Check/reCAPTCHA Enterprise até o fluxo atual estar validado.

## Regra de segurança da publicação

Não abrir o Canal do Cidadão ao público até concluir os testes de autorização, privacidade, anexos e Conselho.
