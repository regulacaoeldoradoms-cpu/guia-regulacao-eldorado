# Etapas manuais pendentes — Canal do Cidadão / Conselho V1

Este checklist registra somente o que ainda exige painel externo, teste real no navegador ou validação institucional. O código correspondente deve ficar preparado antes dessas etapas.

## Estado já concluído

- ✅ `AUTH_DEVELOPER_USERNAMES` configurado e conta Desenvolvedor reconhecida.
- ✅ `AUTH_RATE_LIMIT_SECRET` independente configurado.
- ✅ Projeto Firebase criado e conectado ao Worker.
- ✅ Firestore criado.
- ✅ Storage criado.
- ✅ Firebase Authentication com E-mail/senha habilitado para verificação.
- ✅ Envio e confirmação real de e-mail testados.
- ✅ Domínio de e-mail do Firebase configurado no DNS do Registro.br.
- ✅ Conta cidadã testada em Bronze → Prata.
- ✅ Foto de perfil desbloqueada no Prata.
- ✅ Profissionais e Coordenação mantêm perfis próprios e agora também podem usar o Canal do Cidadão em caráter pessoal.
- ✅ Migração de administradores legados concluída e `AUTH_MIGRATE_LEGACY_ADMINS=false` restaurado como estado normal.

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

## 3. Teste controlado do Canal do Cidadão

Manter durante os testes:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
AUTH_MIGRATE_LEGACY_ADMINS=false
```

Já validado:

- ✅ cadastro cidadão por usuário + senha;
- ✅ Conta Bronze;
- ✅ confirmação real de e-mail;
- ✅ Conta Prata;
- ✅ foto de perfil;
- ✅ preferência futura de amizade desbloqueada no Prata;
- ✅ aviso de Spam/Lixo eletrônico/Lixeira;
- ✅ perfis profissionais preservados após a separação Desenvolvedor/Coordenação.

Ainda testar no navegador:

1. abrir uma manifestação com conta primariamente cidadã e receber protocolo;
2. confirmar listagem em **Minhas manifestações**;
3. abrir a mesma manifestação no painel do Conselho;
4. confirmar que Conselho não recebe e-mail, @usuário, foto ou perfil profissional do autor;
5. Presidente alterar andamento;
6. Presidente enviar resposta oficial;
7. autor receber notificação e visualizar resposta/histórico;
8. autor responder ao Conselho dentro do protocolo;
9. testar manifestação sem e-mail;
10. vincular e-mail depois e confirmar mudança dos protocolos anteriores para `Sigilosa`;
11. testar manifestação criada por Médico/Recepção/Coordenação/Desenvolvedor em **modo cidadão**;
12. se essa conta também possuir função no Conselho, confirmar que no `/cidadao/` sua resposta própria é registrada como cidadão e não como resposta oficial;
13. testar JPG, PNG e PDF válidos;
14. confirmar que o nome original do arquivo não aparece no painel nem no caminho do objeto novo;
15. tentar arquivo com extensão/MIME incompatível e confirmar rejeição pela assinatura real do conteúdo;
16. confirmar que PDF é entregue como download e JPG/PNG somente após autorização;
17. confirmar limite de 5 anexos e 5 MB por arquivo;
18. confirmar limite de uma nova manifestação a cada 2 horas, sem bloquear respostas em protocolos existentes.

O nível **Ouro** não deve ser atingível na V1.

## 4. Funções do Conselho durante o teste

Para validação completa, pode-se manter temporariamente:

- Wellyton: `Desenvolvedor + Presidente do Conselho`, para testar todas as ações institucionais;
- outra conta institucional: `Membro do Conselho`, para testar as restrições do membro.

Validar que o membro:

- lê manifestações;
- lê histórico e anexos;
- registra observação interna;
- **não** envia resposta oficial;
- **não** altera andamento oficial.

Depois dos testes, aplicar a composição institucional definitiva. A Presidência real deve ser atribuída à conta definida pelo Conselho.

## 5. Migração do e-mail dos profissionais/institucionais

Por enquanto manter:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=false
```

Pedir que médicos, Recepção, Coordenação, Desenvolvedor e contas com função no Conselho cadastrem e confirmem e-mail.

Somente depois de testar todas as contas existentes, alterar deliberadamente para:

```text
AUTH_REQUIRE_EMAIL_VERIFICATION=true
```

Quando ativado, o login continua possível para regularização, mas as demais ferramentas ficam bloqueadas até a confirmação. A tela `/conta/` permanece acessível.

## 6. Validação institucional antes de abrir ao público

Revisar com Conselho/gestão municipal:

- texto público do canal;
- tipos de manifestação;
- quem pode responder oficialmente;
- política de retenção/arquivamento;
- aviso de privacidade e orientações ao cidadão;
- nomenclatura Bronze/Prata/Ouro e explicação de que não tem relação com os níveis oficiais do Gov.br;
- fluxo para situações que não devem ser tratadas apenas como manifestação administrativa;
- regra interna para conflito de interesse quando membro do Conselho também for autor de uma manifestação.

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
