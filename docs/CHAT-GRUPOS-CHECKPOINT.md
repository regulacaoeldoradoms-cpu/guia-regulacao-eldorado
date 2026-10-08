# Grupos do chat — checkpoint V1

## Implementação validada

Versão `20261008-chat-groups-1`, desenvolvida sobre a main
`954feb53575fbcbac4d8eccaef9d71516876f44b` e conciliada com
`8e1a208bb924606a85aa4ada2397a81ae80011b5` (PR #609).
Branch de entrega: `feat/chat-groups-reviewed-20261008`; PR #611.
Regra permanente e funcionamento: [CHAT-GRUPOS.md](CHAT-GRUPOS.md).
A documentação inicial da PR #610 foi incorporada e substituída por esta especificação.

As pendências da revisão anterior foram tratadas: Reenviar distingue erro de envio
pendente; respostas de diálogos antigos são descartadas; desativação nega operações
e limpa a conversa; idempotência respeita reentrada; limites por conta são atômicos;
convites pendentes são restritos à administração; saída do criador é explicitada;
fotos, emoticons e espaço do filtro Grupos foram conferidos nos dois temas.

O caso residual da PR #608 foi corrigido: a primeira entrega em tempo real não é
ignorada quando o pré-carregamento já conhece a mensagem. A deduplicação de eventos
permanece separada do cache. O marcador recebido do diretório também impede contar
novamente mensagens já incluídas pelo servidor. Histórico e permissões são preservados.

## Evidências locais da candidata

- 826/826 testes Node aprovados após conciliação com a PR #609, nenhum teste pulado,
  incluindo 26 dos grupos e a regressão do contador; antes da conciliação, 823/823.
- 4/4 combinações de grupo: claro/escuro × desktop/mobile, com três sessões fictícias,
  rotas reais sobre SQLite e HTTP/WebSocket interceptados. Incluem erro/retry,
  fotos raster, emoticon no cursor, resposta atrasada e limpeza ao desativar.
- 15/15 cenários de recebimento individual, inclusive preload e contador do diretório.
- 8/8 cenários de apresentação individual: fotos, datas, paginação e virada do dia.
- Revisão final cobre push somente para membros aceitos e avatar privado por versão,
  sem repetir imagens grandes na listagem a cada mensagem.
- Capturas da interface foram examinadas. Não foram usadas conversas reais.

Os 26 arquivos da entrega concorrente da Missão Bancária foram preservados.
A página de estudos combina os scripts novos de estudo com a referência nova do chat;
o wrangler conserva o preview isolado e acrescenta a flag dos grupos só na produção.
Os demais arquivos de estudos não foram modificados por esta entrega.

Os testes e suas evidências também integram o gate de CI existente. Testes sintéticos
não equivalem a uma conversa real autenticada nem comprovam, sozinhos, publicação.

## Publicação e continuidade

Integrar somente depois do CI, da revisão de diff e de eventuais apontamentos.
Usar exclusivamente o gate seguro existente, sem trocar bindings, segredos ou D1.
Após a integração, registrar na PR #611 o SHA, resultado de Pages/Worker,
comparação dos arquivos públicos e healthchecks. Esse registro distingue a publicação
do aceite no acesso real. Uma aba já aberta precisa de uma recarga para o novo cliente.
O código desta versão não adiciona criptografia ponta a ponta, anexos ou chamadas.
