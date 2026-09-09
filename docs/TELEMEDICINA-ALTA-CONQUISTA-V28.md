# Telemedicina - Alta como conquista V28

Decisão permanente registrada em 09/09/2026.

## Decisão de produto

Uma **Alta do episódio** não deve fazer o card do paciente desaparecer do painel da Telemedicina.

A alta representa resolutividade do DigSaúde e deve permanecer visível como uma **conquista assistencial**. O card continua ligado ao histórico longitudinal do paciente e não gera retorno, aviso, lembrete ou nova pendência.

## Regra funcional

Quando o acompanhamento estiver encerrado por alta:

- o follow-up permanece com `active: false`, porque não há tarefa operacional pendente;
- o dashboard continua retornando esse acompanhamento mesmo estando inativo;
- registros excluídos logicamente (`deletedAt`) continuam ocultos;
- desistência e encaminhamento para atendimento presencial continuam sendo desfechos históricos sem o destaque de conquista;
- a alta mantém status técnico `CONCLUÍDO`, mas a interface a apresenta como **ALTA · CONQUISTA**;
- o filtro passa a oferecer **Altas / conquistas**;
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
- texto **Conquista · Alta**;
- status **ALTA · CONQUISTA**;
- área de retorno substituída por **Alta registrada / Atendimento concluído no DigSaúde**.

O destaque deve ser institucional e legível em desktop e mobile. Não são adicionadas animações ao card.

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
2. Alta manual com `followupMode: discharge` é reconhecida como conquista.
3. Alta histórica identificada pela resolução também é reconhecida.
4. Desistência não recebe coroa nem tratamento de conquista.
5. Encaminhamento para presencial não recebe coroa nem tratamento de conquista.
6. Card de alta não apresenta retorno ou lembretes.
7. Card de alta mantém acesso ao Histórico.
8. Registros excluídos logicamente não reaparecem.
9. Desktop e mobile recebem o mesmo significado visual sem alterar a estrutura dos demais cards.
