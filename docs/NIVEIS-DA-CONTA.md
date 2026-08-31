# Níveis da conta do cidadão — Bronze, Prata e Ouro

## Objetivo

Os níveis são uma mecânica interna do Portal da Regulação de Saúde de Eldorado/MS para representar **segurança da conta e desbloqueio progressivo de funcionalidades**.

Eles não têm relação com os níveis oficiais da conta Gov.br e não representam identidade civil comprovada, prioridade administrativa, confiabilidade de uma manifestação ou preferência no atendimento.

## Princípios

1. Toda conta cidadã começa funcional. A pessoa não precisa fornecer e-mail para utilizar o Canal do Cidadão.
2. Evoluir a conta acrescenta segurança e funcionalidades, mas não aumenta o peso de uma reclamação, denúncia, elogio ou sugestão.
3. O nível da conta é separado da privacidade da manifestação.
4. Perfil social e manifestação institucional permanecem separados.
5. Nenhum nível permite contornar as regras que protegem médicos, recepcionistas ou outros profissionais do contato direto não autorizado.

## Bronze

### Requisito

- cadastro concluído com nome de usuário + senha.

### Recursos

- login no Portal;
- Hub do Cidadão;
- abertura de manifestação;
- protocolo;
- histórico e linha do tempo;
- respostas dentro do protocolo;
- notificações internas;
- anexos da manifestação dentro dos limites da V1.

### Recursos ainda bloqueados

- foto de perfil da conta cidadã;
- preferência futura para receber pedidos de amizade;
- funções sociais futuras.

## Prata

### Requisito

- e-mail de segurança confirmado.

O endereço de e-mail continua separado do documento da manifestação e não é exibido no painel do Conselho.

### Recursos adicionais

- foto de perfil;
- preparação do perfil social futuro;
- preferência para receber pedidos de amizade quando o módulo de amizade existir.

A foto de perfil é um dado do perfil da conta. Ela **não acompanha a manifestação** e não deve ser exibida à Presidência ou aos membros do Conselho como forma de identificação do autor.

## Ouro

### Requisito previsto

- proteção reforçada de autenticação, incluindo mecanismo para novo dispositivo e/ou segunda etapa de autenticação.

### Situação na V1

O nível existe na arquitetura e na interface como evolução futura, mas **não pode ser conquistado ainda**.

### Recursos previstos

- dispositivos confiáveis;
- recursos sociais que exijam maior proteção da conta;
- elegibilidade para comunicação social avançada quando o módulo social for desenvolvido.

O nível Ouro não transforma o cidadão em contato autorizado de nenhum profissional. A comunicação cidadão-profissional continuará dependendo das regras de amizade, consentimento e privacidade definidas para cada conta.

## Nível da conta x privacidade da manifestação

São conceitos independentes.

### Exemplo 1 — Bronze + Anônima

- cidadão criou usuário + senha;
- não cadastrou e-mail;
- conta: Bronze;
- manifestação: Anônima no modelo do portal, sem e-mail/telefone vinculado.

### Exemplo 2 — Bronze + Anônima com e-mail ainda não verificado

- cidadão adicionou um e-mail, mas ainda não confirmou;
- conta continua Bronze porque o requisito do Prata ainda não foi concluído;
- toda nova manifestação continua Anônima;
- solicitações diretas de modalidade Sigilosa ou Identificada são normalizadas pelo backend para Anônima.

### Exemplo 3 — Prata + escolha por manifestação

- e-mail confirmado;
- conta passa para Prata;
- foto de perfil é desbloqueada;
- em cada nova manifestação, o autor escolhe Sigilosa ou Identificada;
- a opção padrão e o fallback são Sigilosa;
- o Conselho nunca recebe o e-mail de segurança nem a foto do perfil como identificação da manifestação.

## Níveis de profissionais

Bronze, Prata e Ouro são apresentados como experiência de evolução principalmente para cidadãos. Médicos, Recepção, Coordenação, Conselho e Desenvolvedor continuam sujeitos às exigências de segurança definidas para os seus cargos.

A verificação obrigatória de e-mail dos profissionais é uma regra de segurança institucional e não deve ser tratada como privilégio ou gamificação de acesso ao trabalho.

## Recursos sociais futuros

Quando a camada social for desenvolvida, a matriz inicial será:

| Recurso | Bronze | Prata | Ouro |
|---|---:|---:|---:|
| Manifestações ao Conselho | Sim | Sim | Sim |
| Acompanhamento e notificações | Sim | Sim | Sim |
| Foto de perfil | Não | Sim | Sim |
| Preferência de pedidos de amizade | Não | Sim | Sim |
| Perfil social | Não | Previsto | Sim |
| Recursos sociais avançados | Não | Não | Previsto |
| Dispositivos confiáveis | Não | Não | Previsto |

A matriz poderá ser refinada quando amizade, chat social e feed entrarem em desenvolvimento.
