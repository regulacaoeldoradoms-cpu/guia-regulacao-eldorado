# Investigação de ativação: Home → Perfil/Amigos

Base: main `46d3b3ed3d525aeed52a5470c78b5a022d09772b` (PR630). Dados e sessões exclusivamente sintéticos. Nenhuma leitura de usuários/pacientes, mudança de permissões ou publicação neste diagnóstico.

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

## Correção preparada

O login permite três destinosHome: `/`, `/home/` e `/index.html`. Antes da correção, o bootstrap não reconhecia os dois aliases; mesmo montando o HTMLHome, não selecionava seus controladores. A correção normaliza apenas esses aliases para a área interna `/`, antes da seleção e History. O endereço público mantém `/`, sem redirecionar/recriar o documento. Autenticação tardia também reconhece as entradas. Somente a query de versão do script modificado é atualizada nos dez documentos compartilhados.

Validação local:17/17cenários de endereço único e15/15cenários de ciclo de vida. Os dois novos cenários `/index.html` mantêm documento/barra/Chat/SVG/mascote, sem remoções ou frames vazios da barra, e zero documentos novos nas quatro trocas. O login monta os três destinos mantendo o documento e o endereço público canônico. Desktop901/1440px, logout, troca de conta, Chat, Back/Forward e entrada por links antigos seguem nos testes.

## Cache e evidência de publicação

A entrega anterior tem Pages run38116611377 e deploy job114402733820 concluídos com sucesso para o main acima. Artefato `github-pages`11693548688 tem head correspondente e digest SHA256 `6d915b453f883d14cb6765c59fc6768f27acac0777d7f359e6f7d964f6cd26f2`. A materialização pelo helperLibrary falhou no download; não foi possível comparar o conteúdo do arquivo localmente. HTTP direto de produção permanece limitado pelo CONNECT403 do executor, sem tentativa de contornar a restrição. Metadata de deploy não prova qual HTML o navegador do usuário recebeu.

Os testes de navegação anteriores usam o handler nativo de mensagens do SW, mas desativam handlersfetch/cache. Um teste isolado executou a função original `revalidateSharedPage` com HTML público antigo em cache e resposta nova em2800ms: retornou HTML antigo em2506ms e atualizou o cache com HTML novo depois. Isso demonstra o fallback de2500ms da política atual, não demonstra cache antigo no aparelho real. Nenhuma política ou versão global do SW foi alterada.

## Prioridade e limites

1. Confirmar o cargo e viewport no Android relatado: cargo fora de `cidadao` ou largura acima900px tornam a promessa de endereço único inaplicável na implementação atual. Não expandir cargos nem comportamento desktop sem alinhar esse alcance.
2. Revisar a correção demonstrada dos aliasesHome; ela não prova solucionar o relato do usuário se sua entrada foi `/` em outra condição.
3. Se o aparelho for cidadão e viewport até900px, verificar release do HTML/script recebido antes de atribuir o problema ao cache. Investigar fallback antigo com SW completo em navegador isolado antes de mudar a política.
4. A mudança de viewport após carregamento é uma omissão confirmada, mas rebootstrap tardio precisa preservar controladores já iniciados, Chat/mascote e formulários. Não foi implementado de forma improvisada.

Evidências locais no worktree: `.local/activation-probe.json`, `.local/activation-probe-baseline.log`, `.local/sw-html-probe.json`, `.local/citizen-single-address/results.json` e `.local/mobile-shell-tests/results.json`. Próxima ação: vincular a reprodução à condição real do Android, completar gates de publicação para a correção correspondente e só então publicar. Este diagnóstico não declara resolvido o caso relatado.
