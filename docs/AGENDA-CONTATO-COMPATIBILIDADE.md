# Contrato de contato v2 da Agenda

Worker, frontend, ponte e coletor usam o identificador exato `patient-details-v2`. O Worker declara `contactCapability` nas respostas autenticadas de listagem, estado de contatos e sincronização. Ausência, tipo inválido, versão diferente ou erro não autorizam uso de contato.

## Consumidores atualizados

- Frontend limpa autorização e telefones em memória antes de carregar novamente; resposta de uma carga anterior não pode restaurá-los.
- Um card não contém link navegável pré-carregado. O botão abre somente uma janela inerte durante o gesto do usuário, consulta novamente a listagem protegida e compara ficha, paciente, solicitação, data/horário e telefone. Só atribui o destino após confirmação atual da capacidade e do mesmo contato ativo e válido; alteração, revogação, expiração, erro ou janela fechada interrompem a abertura.
- Ponte confere a capacidade antes de cada POST, inclusive antes de responder a uma repetição deduplicada. Exige também capacidade no ACK e no estado posterior à escrita; perda/erro devolve falha, sem apresentar um sucesso em cache.
- Coletor só inicia/envia com capacidade confirmada. READY ou RESULT atual sem capacidade válida pausa a sessão, invalida geração/entrega pendente e limpa cache de contato, IDs conhecidos e fingerprint. Uma nova ativação precisa de nova confirmação; READY tardio não reativa uma sessão pausada.
- Coletor candidato 1.2.8 usa cache de instalação/update/download `20261009-navigation-1`; ponte mantém `20261005-pending-1` e frontend `20261005-contact-2`. A capacidade exigida continua `patient-details-v2`; pontes anteriores deixam o recorte fora da captura sem classificação. A mudança verifica prontidão de navegação após polling atrasado, com as mesmas guardas de rota, novo Document e sessão.

## Compatibilidade e retorno

Frontend/ponte/coletor atualizados com Worker antigo permanecem fechados para contato: o backend antigo não declara a capacidade. Isso protege consumidores atualizados durante diferença de ordem dos builds ou retorno do Worker, sem alterar `deploy-safe` ou seu rollback.

Clientes antigos não entendem o contrato. Antes da transição, suspender avisos, fechar hrefs/conversas preparados anteriormente e atualizar/reabrir os clientes/coletor. Não prometer segurança de um link antigo que já estava aberto. Preferir confirmar Worker v2 antes de retomar o uso; frontend disponível com backend antigo ainda mostra contatos indisponíveis.

Depois de atualização, iniciar nova sessão e recoletar: contatos legados ficam indisponíveis até coleta v2. Alteração de paciente/solicitação pode exigir primeiro ciclo para revogar e seguinte para coletar. Não completar manualmente um destino vazio. Validade de contato: 24h, com associação conferida no Worker.

## Evidências sintéticas

`worker/tests/agenda-contact-contract.test.mjs` verifica respostas do Worker, matriz de versões, capacidade inválida/ausente, revalidação no clique, revogação/expiração/associação, erro, resposta anterior, cancelamento, ACK/estado posterior e perda de cache do coletor.

Homologação integrada local em Chromium: 12 verificações aprovadas, 51 chamadas à rota real do Worker com adaptadores em memória, zero erros JavaScript. Inclui rollback após carregar o card, perda de capacidade antes de POST, limpeza do cache e nova sessão com Worker antigo. Toda rede interceptada; destinos atribuídos somente a um alvo inerte de teste, sem navegar WhatsApp ou enviar mensagem. Autenticação/infraestrutura reais e conferência do operador continuam etapas de implantação/piloto, não foram simuladas como concluídas.

Nenhuma alteração de gate, baseline visual, autenticação, secrets, bindings ou IA clínica é parte deste contrato.
