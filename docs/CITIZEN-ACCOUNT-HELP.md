# Expansão da informação da conta e aviso de Amigos

Base `136431d47ada25750d6790653bb1b87032a88004` (PR635 aprovada). Alteração restrita à apresentação.

## Causa reproduzida

Em `/cidadao/`, o componente é um `details`/`summary` nativo. Ao tocar, `open` mudava para `true`, mas `#accountEvolutionNotice` continuava com `display:none`, retângulo de 0×0 e texto preenchido. A regra histórica em `citizen-mobile-refinement.css` ocultava o aviso no mobile mesmo após o controlador movê-lo para o bloco retrátil. Não era falha do clique, ausência de dados ou corte por altura/overflow.

O CSS da apresentação agora permite `display:block` exclusivamente para esse aviso dentro do bloco aberto, sem atributo `hidden`. O navegador continua controlando abertura, fechamento e teclado; autorização e estado de dados continuam com os controladores nativos. Classes do primeiro quadro, destaque escuro, desktop e impressão não foram alterados. As versões dos assets afetados e de seus chamadores foram atualizadas para carregar a correção na entrada direta e no shell; o cache global permanece intacto.

## Amigos

Removido somente o cartão com o título “Descoberta protegida” e sua explicação, incluindo o contêiner. Pesquisa, paginação, filtros, política de descoberta, privacidade, perfis e chat permanecem com o código anterior. A comparação de preservação remove exclusivamente esse cartão histórico da base, após exigir título e texto exatos; o candidato deve conter zero desses cartões e apenas a seção de pesquisa no aside. Todo o restante continua sujeito às comparações existentes de controles, cores, geometria e pixels.

## Verificação

O teste funcional do cidadão verifica o conteúdo completo abaixo do summary, altura real positiva, ausência de cortes/overflow e última linha alcançável acima da barra persistente. Repete três ciclos de abrir/fechar e Enter/Espaço, com entrada direta, retorno pelo shell e primeira entrada pelo shell, 320/360/390 px, claro/escuro e texto 200%. Mantém os testes de consentimento, rascunho, ação nativa e continuidade dos controladores.

Capturas e APIs são sintéticas locais. O anexo JPEG da Biblioteca não foi visto: duas tentativas suportadas falharam no download. Foram inspecionados os pixels da reprodução própria. Verificação local concluída: 12 cenários funcionais (36 entradas, 108 ciclos de clique e teclado em cada entrada), 24 cenários de primeiros quadros sem quadros antigos, dez testes de preservação/contratos, dois estados de Amigos em Chromium mobile/desktop e 33 contratos sociais/backend, sem skips. Gates gerais de CI e mascotes continuam necessários para publicação; aceitação em aparelho real é independente.
