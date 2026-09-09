# Telemedicina - Alta destacada V28/V31

Decisão permanente registrada em 09/09/2026 e refinada na V31.

## Decisão de produto

Uma **Alta do episódio** não deve fazer o card do paciente desaparecer do painel da Telemedicina.

A alta representa resolutividade do DigSaúde e deve permanecer visível com **destaque dourado próprio**. O card continua ligado ao histórico longitudinal do paciente e não gera retorno, aviso, lembrete ou nova pendência.

A palavra **“conquista” foi usada apenas como referência conceitual durante o desenvolvimento e não deve aparecer na interface da Telemedicina**. Para o usuário, a nomenclatura é simplesmente **Alta**.

## Regra funcional

Quando o acompanhamento estiver encerrado por alta:

- o follow-up permanece com `active: false`, porque não há tarefa operacional pendente;
- o dashboard continua retornando esse acompanhamento mesmo estando inativo;
- registros excluídos logicamente (`deletedAt`) continuam ocultos;
- desistência e encaminhamento para atendimento presencial continuam sendo desfechos históricos sem o destaque dourado de alta;
- a alta mantém status técnico `CONCLUÍDO`, mas a interface apresenta **ALTA**;
- o filtro oferece **Altas**;
- o botão **Histórico** permanece disponível.

A identificação de alta considera, para compatibilidade com registros atuais e históricos:

1. `discharged: true`;
2. `followupMode: discharge`;
3. resolução contendo `ALTA`.

## Regra visual

O card de alta deve ser imediatamente reconhecível sem depender somente de texto:

- fundo amarelo claro;
- borda dourada;
- acento lateral dourado;
- selo vetorial com uma coroa;
- texto **Alta**;
- status **ALTA**;
- área de retorno substituída por **Desfecho / Alta registrada / Atendimento concluído no DigSaúde**.

O destaque deve ser institucional e legível em desktop e mobile. O card de alta permanece sem animações decorativas; a animação de reflexo pertence somente ao botão de acesso à fila **Altas**.

## Motivação

As altas são resultado positivo do atendimento especializado por Telemedicina e não podem ficar invisíveis depois do encerramento operacional. Preservá-las no painel permite reconhecer a resolutividade do DigSaúde e mantém o acesso direto ao histórico do paciente.

## Compatibilidade e segurança

- nenhum dado de paciente é versionado;
- nenhuma permissão é ampliada;
- a alta continua sem lembretes ou pendências;
- a exclusão lógica continua prevalecendo sobre a exibição;
- os eventos históricos continuam armazenados no Firestore;
- o backend continua sendo a fonte de autorização e armazenamento.

## Arquivos principais

- `worker/telemedicine-rules.js`;
- `worker/telemedicine.js`;
- `worker/tests/telemedicine-outcomes-v25.test.mjs`;
- `telemedicina/index.html`;
- `js/telemedicina-discharge-achievement-v28.js`;
- `css/telemedicina-discharge-achievement-v28.css`.

## Critérios de regressão

1. Registrar alta não remove o card do dashboard.
2. Alta manual com `followupMode: discharge` é reconhecida como alta concluída.
3. Alta histórica identificada pela resolução também é reconhecida.
4. Desistência não recebe coroa nem tratamento dourado de alta.
5. Encaminhamento para presencial não recebe coroa nem tratamento dourado de alta.
6. Card de alta não apresenta retorno ou lembretes.
7. Card de alta mantém acesso ao Histórico.
8. Registros excluídos logicamente não reaparecem.
9. Desktop e mobile recebem o mesmo significado visual sem alterar a estrutura dos demais cards.
10. A palavra “conquista” não aparece em nenhum texto visível da área de altas da Telemedicina.
