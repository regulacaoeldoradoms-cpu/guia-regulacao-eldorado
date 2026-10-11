# Investigação de ativação: Home → Perfil/Amigos

Base: main `46d3b3ed3d525aeed52a5470c78b5a022d09772b` (PR630). Dados e sessões exclusivamente sintéticos. Nenhuma leitura de usuários/pacientes ou mudança de permissões neste diagnóstico. A publicação das correções está autorizada e depende dos gates finais.

## Reprodução na versão publicada

Cliques reais em controles visíveis da Home; cada destino foi testado a partir de uma entrada Home independente.

| Condição | Shell inicial | Perfil | Amigos |
|---|---|---|---|
| Cidadão,390px,entrada `/` | ativa | `/`,0documentos novos | `/`,0documentos novos |
| Cidadão,AndroidUA,viewport980px | ausente | `/perfil/`,1documento novo | `/amigos/`,1documento novo |
| Cidadão,Home980px depois390px | ausente | `/perfil/`,1documento novo | `/amigos/`,1documento novo |
| Cidadão,390px,entrada `/index.html` | ausente | `/perfil/`,1documento novo | `/amigos/`,1documento novo |
| Administrador sintético,390px,entrada `/` | ausente | `/perfil/`,1documento novo | `/amigos/`,1documento novo |

O código da Home reconhece Android pelo user agent e pode apresentar `mobile-home-mode` em980px; o bootstrap da shell usa exclusivamente a media query até900px. A instalação inicial também exige cargo exatamente `cidadao`. A shell que não foi instalada não observa mudanças posteriores do viewport. Esses são caminhos demonstrados; cargo e viewport efetivos do aparelho relatado ainda não foram confirmados. A conta administrativa sintética é controle negativo, não prova de acesso cidadão.

## Correções e validação

O login permite três destinosHome: `/`, `/home/` e `/index.html`. Antes da correção, o bootstrap não reconhecia os dois aliases; mesmo montando o HTMLHome, não selecionava seus controladores. A correção normaliza apenas esses aliases para a área interna `/`, antes da seleção e History. O endereço público mantém `/`, sem redirecionar/recriar o documento. Autenticação tardia também reconhece as entradas. Somente a query de versão do script modificado é atualizada nos dez documentos compartilhados.

Além dos aliases, a ativação das áreas compartilhadas passa a aceitar contas autenticadas, preservando autorização nos controladores e backend. O cargo não é alterado nem confere novos acessos. Rotas profissionais não entram na lista ou fila. Para celulares com toque múltiplo e tela física compacta, a captura inicial dos controladores permite ativar a navegação quando o viewport largo retorna ao breakpoint móvel; em largura acima900px, a política de links continua nativa. Não há rebootstrap duplicando controladores nem recarga do documento.

Validação:21cenários de endereço único (incluindo dois cargos sintéticos e dois de mudança de largura),15cenários de ciclo de vida, além dos gates finais registrados no PR. Os dois novos cenários `/index.html` mantêm documento/barra/Chat/SVG/mascote, sem remoções ou frames vazios da barra, e zero documentos novos nas quatro trocas. O login monta os três destinos mantendo o documento e o endereço público canônico. Desktop901/1440px, logout, troca de conta, Chat, Back/Forward e entrada por links antigos seguem nos testes.

## Cache e evidência de publicação

A entrega anterior tem Pages run38116611377 e deploy job114402733820 concluídos com sucesso para o main acima. Artefato `github-pages`11693548688 tem head correspondente e digest SHA256 `6d915b453f883d14cb6765c59fc6768f27acac0777d7f359e6f7d964f6cd26f2`. A materialização pelo helperLibrary falhou no download; não foi possível comparar o conteúdo do arquivo localmente. HTTP direto de produção permanece limitado pelo CONNECT403 do executor, sem tentativa de contornar a restrição. Metadata de deploy não prova qual HTML o navegador do usuário recebeu.

Os testes de navegação anteriores usam o handler nativo de mensagens do SW, mas desativam handlersfetch/cache. Um teste isolado executou a função original `revalidateSharedPage` com HTML público antigo em cache e resposta nova em2800ms: retornou HTML antigo em2506ms e atualizou o cache com HTML novo depois. Isso demonstra o fallback de2500ms da política atual, não demonstra cache antigo no aparelho real. Nenhuma política ou versão global do SW foi alterada.

## Prioridade e limites

1. Corrigida a exclusão de contas não cidadãs das mesmas áreas comuns. A captura mostrou “Desenvolvedor”, mas isso não identifica o cargo interno. Cargo/viewport reais ainda não foram confirmados; essa lacuna não impede publicar as correções demonstradas. Larguras efetivas acima900px mantêm política nativa.
2. Corrigidos aliasesHome e transição do login; a condição exata do Android relatado continua sem validação direta.
3. Se o aparelho for cidadão e viewport até900px, verificar release do HTML/script recebido antes de atribuir o problema ao cache. Investigar fallback antigo com SW completo em navegador isolado antes de mudar a política.
4. Corrigida a ativação após mudança de viewport em tela física compacta com toque múltiplo; preserva documento/controladores/barra/Chat/mascote/rascunho. Desktop verdadeiro permanece nativo.

Evidências locais no worktree: `.local/activation-probe.json`, `.local/activation-probe-baseline.log`, `.local/sw-html-probe.json`, `.local/citizen-single-address/results.json` e `.local/mobile-shell-tests/results.json`. Próxima ação: concluir gates finais e publicar o head aprovado, conferindo deploySHA. A verificação no aparelho real permanece separada. Este diagnóstico não declara resolvido o caso relatado.

## Revisão da auditoria geral

O primeiro head do PR631 teve 209/226 testes aprovados e 17 falhas na auditoria geral: quatro verificavam os endereços antigos; outras capturavam a Home antes da restauração da área solicitada, comparavam a identidade textual do ancestral neutro `display:contents`, ou congelavam o mapa de controles Avisos antes de sua primeira inserção. A verificação agora exige área interna correta, controlador carregado e endereço público compatível antes de comparar tela/impressão. Apenas o segmento de ancestralidade da área sem caixa é normalizado, com `display:contents` verificado; propriedades computadas, geometria, pixels, unicidade e identidade dos controles continuam exigidos. Não houve atualização de baseline nem ampliação de tolerância.

Dois testes negativos adicionais garantem que Home não conte como Perfil e que clones com IDs iguais sejam rejeitados. Os 17 casos que falharam passaram na rodada focada. A navegação global do mascote também aguarda o habitat visível e verifica posição relativa na área de cuidados, preservando todas as verificações anteriores. Os gates locais de navegação global, sete vidas e falas passaram. O runtime de mascotes, seu cache e comandos permaneceram inalterados. A nova auditoria completa inclui os 226 cenários originais mais quatro execuções dos testes negativos nos dois projetos.
