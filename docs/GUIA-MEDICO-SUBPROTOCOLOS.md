# Guia Médico — requisitos distribuídos em subprotocolos

## Decisão permanente

Quando uma especialidade ou procedimento possui condições clínicas organizadas em `subprotocolos`, um campo geral vazio no protocolo-pai **não significa** que não existam critérios, informações clínicas, exames obrigatórios, exames condicionais ou documentos recomendados.

A interpretação correta é:

- se o protocolo-pai possui conteúdo próprio, esse conteúdo permanece visível e deve ser considerado;
- se o protocolo-pai está vazio para um tipo de requisito e os subprotocolos possuem conteúdo desse mesmo tipo, o requisito é **dependente da condição clínica**;
- nesse caso, a interface não deve exibir um card geral vazio que contradiga os subprotocolos;
- a pré-regulação com IA deve consultar os subprotocolos antes de concluir que um requisito não existe;
- em pergunta genérica, como “quais exames são necessários para Endocrinologia?”, a resposta deve explicar que os exames variam conforme a condição e utilizar os subprotocolos pertinentes, em vez de afirmar que não há exames obrigatórios.

## Motivo da correção

Foi identificado em Endocrinologia Adulto que os campos gerais `examesObrigatorios` e `examesCondicionais` estavam vazios, enquanto Diabetes Mellitus, Dislipidemias, Tireoidopatias, Obesidade e outras condições possuíam listas próprias. A interface mostrava cards gerais vazios acima dos cards preenchidos e a IA podia interpretar o vazio do protocolo-pai como ausência de exames.

A regra foi implementada de forma genérica para todas as especialidades e procedimentos com a mesma estrutura, evitando correções específicas apenas para Endocrinologia.

## Comportamento esperado da interface

O `referral-workbench.js` compara os campos gerais com os campos correspondentes dos subprotocolos. Um card geral é removido somente quando:

1. o campo do protocolo-pai está vazio; e
2. pelo menos um subprotocolo oficial possui conteúdo equivalente.

Campos gerais preenchidos não são ocultados.

## Comportamento esperado da IA

O `pre-regulation-bridge.js` preserva os subprotocolos oficiais e, quando detecta campo geral vazio com conteúdo nos subprotocolos, envia uma orientação explícita ao Worker informando que os requisitos variam conforme a condição clínica. Para exames, é proibido interpretar o campo geral vazio como “não há exames” quando houver exames obrigatórios ou condicionais em qualquer subprotocolo oficial.

A compactação deve priorizar os subprotocolos oficiais. A camada prática permanece identificada como não normativa e não substitui o protocolo oficial.

## Fontes clínicas de referência

A classificação entre obrigatório, obrigatório conforme o caso e recomendado deve seguir a fonte oficial aplicável ao protocolo. Para os teleatendimentos do Núcleo de Telessaúde Mato Grosso do Sul, a base vigente cadastrada no projeto deve refletir o protocolo oficial correspondente. Em caso de conflito de conteúdo clínico, a fonte oficial prevalece sobre descrições históricas ou inferências da IA.

## Teste preventivo

O teste `worker/tests/subprotocol-requirements.test.mjs`:

- varre toda a base `data/protocol-source.html` para identificar protocolos com campo geral vazio e conteúdo equivalente em subprotocolos;
- garante que Endocrinologia Adulto esteja coberta pelo cenário conhecido;
- verifica a regra de supressão visual dos cards gerais redundantes;
- simula a compactação enviada à IA e confirma que os exames dos subprotocolos permanecem no contexto e que o campo geral vazio não é tratado como ausência de exames.

Atualizado em 04/09/2026.
