# Interface da pré-regulação com IA

Atualizada em 04/09/2026, após leitura integral do Dossiê Mestre V1 e conferência da `main` em `48201912e949ae04dd8d36f389ea29c7acffb9ec`.

## Decisão visual

A janela mantém a identidade do assistente e separa cabeçalho, indicadores, aviso de anonimização, conversa e formulário. O selo de protocolos e o estado do provedor ficam no fluxo do cabeçalho, com quebra de linha quando necessário; não devem usar coordenadas absolutas sobre outros textos.

As sugestões usam rótulos curtos em uma grade com quebra de texto, sem rolagem horizontal. Cada botão conserva a pergunta completa em `data-question`, enviada pelo mesmo fluxo conversacional. A mensagem inicial e as instruções clínicas permanecem iguais.

O formulário tem rótulo visível, campo inicialmente com duas linhas, botão de envio alinhado à base e rodapé com atalhos e contador. A altura é recalculada ao abrir, digitar, limpar ou redimensionar a janela; considera o conteúdo, o placeholder, as bordas e o limite definido no CSS. Mensagens longas rolam dentro do campo, e respostas longas rolam na área de conversa.

Acima de 600 px de largura, a janela passa a ter até 480 × 720 px, limitada pelo espaço disponível. Em telas horizontais baixas, aproxima-se da borda inferior para manter conversa e envio acessíveis. Os ajustes compartilhados corrigem cortes e sobreposições também no celular, preservando o posicionamento e as dimensões externas mobile existentes. O portal, o protocolo, os botões flutuantes e o chat profissional não recebem alterações de layout.

## Comportamento e segurança preservados

- Limite de 3.000 caracteres, histórico de 12 mensagens, Enter para enviar, Shift + Enter para nova linha e Escape para fechar.
- Perguntas completas das sugestões, protocolos oficiais, contexto, anonimização, provedores, timeout e contingência.
- Guarda de sessão da IA no Worker (`AUTH_ENFORCE_AI` e validação em `/api/ia`), conferida e sem necessidade de mudança para esta correção visual.

## Validação

Conferir em desktop e mobile: placeholder completo ao abrir e depois de enviar; ausência de sobreposição dos indicadores mesmo com o texto de contingência; sugestões sem corte; campo crescente com limite; contador, foco, atalhos e rolagem de respostas longas. Comparar o restante do Guia Médico com a versão anterior.

Os quatro recursos alterados têm cache `20260904-2` em `medico/index.html`; as verificações existentes que exigem versões específicas acompanham essa atualização. Executar os testes do Worker e os workflows do repositório antes do merge, e conferir os arquivos publicados no domínio após o deploy.

Validação local realizada em Edge/Chromium: 35 cenários de layout em 1440×900, 1366×768, 1024×640, 600×800, 390×844, 320×568, 844×390 e viewport reduzido de 720×450; comparação do layout externo com a versão anterior nos sete tamanhos principais. Conferidos os três atalhos com suas perguntas originais, envio por botão e teclado, múltiplas linhas, limite de caracteres, contador, foco, reabertura, bloqueio de identificadores e contingência. A verificação usa somente arquivos públicos em ambiente local, com respostas de API simuladas, sem sessão real ou dados de pacientes.
