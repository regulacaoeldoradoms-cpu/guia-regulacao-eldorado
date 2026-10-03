# Central — abertura e navegação com cache em RAM

Base verificada: `6c4fcd86198103ad6e1e8adc07901219c7957c92`. Pacote de implementação autorizado em 03/10/2026; entrega por PR draft, sem autorização de merge/publicação.

Entrega: [PR #599 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/599), commit funcional inicial `9c2467dfb994dff85cc70847142c1fc89512f45a`. Os 17 arquivos remotos foram conferidos por hashes Git contra a cópia local testada.

## Comportamento

- A primeira lista pode aparecer após a validação atual de acesso. Preferências e configuração da IA carregam em segundo plano.
- O Service Worker libera quem já aguardava o warmup assim que a raiz fica pronta, mesmo que preferências ainda estejam pendentes.
- Raiz aquecida com menos de 20 segundos dispensa refresh adicional na entrada. A renovação periódica existente permanece.
- Pasta e pesquisa reutilizam respostas somente na memória da aba: TTL de 20 segundos, até 12 entradas e 200 itens. A chave inclui rota, pasta, página, ordenação, consulta, modo nome/conteúdo e filtros.
- Reutilização e prévia local exigem acesso atual confirmado pelo backend. Uma visita sem cache também faz essa validação; isso acrescenta uma leitura de acesso, sem ampliar permissões.
- Leituras concorrentes equivalentes compartilham a consulta de acesso em andamento e a chamada do Drive. Acesso não fica autorizado por TTL.
- Sessão/token/usuário diferente, logout, acesso negado ou erro na validação limpam cache e interface privada. Respostas atrasadas são descartadas por geração e identidade de sessão.
- Mutações de Drive invalidam antes/depois da tentativa, incluindo falha; sincronização confirmada também invalida. O warmup é limpo e outras abas recebem invalidação pelo Service Worker.
- A busca continua por nome ou conteúdo, com a opção existente de somente título. Paginação permanece em 20 itens. Nenhum índice externo ou persistência de nomes/consultas foi acrescentado.

## Medição sintética comparável

Executaram-se as funções reais de inicialização/navegação e do Service Worker em Node VM, com DOM sintético e relógio virtual. APIs simuladas: acesso 25 ms, Drive 300 ms, preferências 100 ms e IA 180 ms. O cenário de warmup pendente usa preferências de 1000 ms.

| Cenário | Antes | Depois | Chamadas Drive antes → depois |
|---|---:|---:|---:|
| Abrir sem cache | 505 ms | 325 ms | 1 → 1 |
| Raiz aquecida, preferências/IA ausentes no snapshot | 205 ms | 25 ms | 1 → 0 |
| Snapshot completo | 25 ms | 25 ms | 1 → 0 |
| Primeira entrada em pasta sem cache | 300 ms | 325 ms | 1 → 1 |
| Entrar em pasta e voltar à raiz | 600 ms | 350 ms | 2 → 1 |
| Pesquisar e repetir a mesma pesquisa | 600 ms | 350 ms | 2 → 1 |
| Refresh da raiz concorrente com navegação | 300 ms | 325 ms | 2 → 1 |
| Warmup pendente, raiz pronta antes das preferências | 1205 ms | 325 ms | 2 → 1 |

Os ganhos medem remoção de dependências e de chamadas sob atrasos fixos. Não são tempos observados em Chromium ou no portal produtivo, nem sustentam promessa de latência imperceptível. A visita fria a uma pasta custa 25 ms adicionais nessa fixture pelo gate ao vivo. A rede/Drive continuam determinantes para consultas inéditas.

Artefatos: `testing/central-docs/navigation-benchmark.mjs`, `navigation-fixture.mjs` e `navigation-benchmark-20261003.json`. Para reproduzir em checkout Git com o commit-base disponível: `node testing/central-docs/navigation-benchmark.mjs`. Se necessário, buscar somente o SHA-base com `git fetch origin 6c4fcd86198103ad6e1e8adc07901219c7957c92 --depth=1`. Na cópia isolada por arquivo ZIP, a baseline foi o snapshot Git local idêntico ao SHA-base, selecionado por `DOCUMENT_NAVIGATION_BASELINE=HEAD`.

## Verificação

- 13 testes funcionais novos: TTL, chaves/paginação/filtros, limites, cópias, concorrência, troca de conta/logout, acesso negado, falha de acesso/Drive, resposta atrasada, mutação bem-sucedida/falha, interface real e liberação do warmup.
- Interface/preload e proteção de fechamento/sync reconciliados com a dependência nova; mantidas as asserções de autorização, retry e ausência de persistência/telemetria identificável.
- Aggregate obrigatório do Worker: 737/737; sintaxe do Worker e dos clientes modificados; bundle de staging e quatro testes de recuperação 5E aprovados.
- Código funcional do Worker permanece intacto. Nenhum paciente/documento real, D1 produtivo, credencial ou infraestrutura foi consultado/alterado.
- CI do funcional: [Central Fases 1–6](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/37161739384), [staging](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/37161739486) e governança success. Chromium da Central também concluiu com success nesse candidato.
- [Pré-regulação](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/37161739391) falhou no gate de Worker nativo: a primeira asserção ausente é `GEMINI_TOTAL_TIMEOUT_MS` em `worker/index.js`; três outras asserções de resiliência também estão ausentes. Tanto esse arquivo quanto o workflow têm os mesmos hashes da base `6c4fcd86`. Trata-se de divergência preexistente, fora do pacote; não foi corrigida nem o gate relaxado.

## Limites e próxima ação

O cache expira rapidamente e é descartado ao navegar para outra página; o Service Worker continua conservando apenas a raiz. Alterações feitas diretamente no Drive ou por outro dispositivo podem aparecer após até 20 segundos; mutações desta aplicação invalidam imediatamente. Invalidação entre abas depende da entrega da mensagem do Service Worker.

A execução local usa Node VM; o gate Chromium existente deve concluir no CI da PR antes de considerar publicação. Não houve instalação de dependências. Após aprovação de publicação, medir primeiro-lista visível com o mesmo ponto inicial para hit/miss, mais p50/p95, chamadas por ação, retries e `drive_token_ms/api_ms/map_ms`. Cache hit devolve timings Drive vazios, evitando atribuir a uma reutilização a duração antiga da rede. Registrar somente durações/categorias, sem nomes, consultas ou referências.

CI adicional: o run de abertura pós-login `37161739497` teve quatro timeouts de 35 s em `opening-home-ready.spec.mjs`, ao avaliar o vídeo da Home. Causa não determinada neste escopo; preservar como pendência antes de publicação. A revisão final também zera termos/filtros e snapshots residuais da interface na invalidação de sessão; aggregate 737/737 e benchmark idêntico reaprovados.
