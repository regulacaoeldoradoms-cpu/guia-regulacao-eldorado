# Checkpoint dos mascotes — falas em rascunho

Produção permanece `491ae932ca96a019c3909a0f6becaee16ea48b9e`, PRs #616/#617 e 33/33 checks. Acompanhante global transparente, movimento nos dois eixos, escala 128 × 96 px, cuidados/loja/cama somente na página Mascotes. QA real confirmou aparência, movimento, navegação/recarga e clique atravessando a camada, sem mudar dados/preferências do gato real.

## Diagnóstico da percepção de poucas falas

Na versão publicada há 42 textos; seleção aleatória evita somente as cinco falas recentes. Primeira fala após 45 s, próximas em 45–75 s, duração 4,5 s. Navegação reinicia espera/histórico; sede, fome e higiene têm prioridade. Movimento desativado/reduzido interrompe seleção. Diagnóstico sintético do código publicado selecionou as 42 frases em 300 escolhas sem repetição das cinco recentes; nenhum travamento comprovado. A sessão real observou uma frase nova. Cache publicado: `20261009-pets-phrases-5`.

## Pacote separado em preparação

Branch `preparation/mascotes-falas-ciclo`, base na produção acima. Somente implementação/testes/PR draft/CI: não integrar, publicar ou ativar sem autorização específica. Usuário aprovou 25–40 segundos e balão de 7 segundos em 09/10/2026 às 19:33 UTC (Sentinel_0f6d41b61c848191aac558ab586bb480); pedidos posteriores autorizaram mais humor e ciclo sem reposição. Aprovação da publicação ainda pendente.

67 frases: 42 originais mantidas e 25 novas de humor, sem duplicatas, até 55 caracteres. IDs e versão explícita do catálogo em `js/pet-phrases.js`. Embaralhamento sem reposição percorre todas antes de repetir; evita igualdade na fronteira dos ciclos. Primeira seleção e próximas respeitam 25–40 s; duração 7 s. Alertas/mostrar continuam prioritários; frases invisíveis não consomem o ciclo. Comportamento de movimento reduzido preservado, sem ampliar acessibilidade nesta etapa.

Ciclo, prazo e balão corrente sobrevivem à navegação/recarga na mesma aba/sessão autenticada. `sessionStorage` armazena apenas IDs, versão e prazos técnicos; chave de escopo SHA-256 da sessão, sem token bruto, nomes, textos de falas, páginas visitadas ou dados pessoais no registro novo. Outra conta não herda o ciclo; retorno à sessão anterior retoma o seu. Catálogo incompatível/dados inválidos reiniciam com segurança. Armazenamento indisponível usa memória; não existe backlog de falas offline. Não é histórico entre dispositivos ou novos logins.

Cache novo `20261009-pets-speech-cycle-7`. Imports do módulo de falas/runtime têm versão e export legado permanece para não quebrar abas antigas durante atualização; a nova rotina usa o ciclo completo. Teste de cache confirma que o runtime carregado usa o catálogo novo. Nenhuma mudança no backend, moedas, necessidades, flags, esquema, permissões, chaves ou dados reais.

Validação local final: 95 contratos afetados (incluem oito de catálogo/ciclo/temporizador/armazenamento), 11 cenários de fala no navegador, 37 cenários globais e nove de cache/sessão aprovados. Navegador usa SQLite em memória, duas contas fictícias, relógio técnico controlado e bloqueio de requisições externas. Sem POST à API de mascotes nos cenários de falas. CI mantém auditoria geral e acrescenta o teste `testing/pets/speech.cjs`. Evidências fora do checkout em `/workspace/scratch/mascotes-falas-ciclo/`; diagnóstico original em `/workspace/scratch/mascotes-phrases/published-diagnosis.json`.

## Sete vidas: entrega independente

PR #618, head `fb50fcd5da03d9a996db90f87fa56cc364decdc6`, draft, 29/29 checks aprovados, 911 testes completos, dez cenários de vidas. Preço base proposto do potinho: 20 moedas de atividade, enchimento gratuito; perdas simultâneas por fome/sede somam limitadas às vidas restantes. Continua sem autorização de produção. Não incluir suas mecânicas neste pacote de falas. Quando um pacote for integrado, reconciliar o outro com main, principalmente cache/runtime/workflow, e validar o head reconciliado antes de publicação.

Próxima ação: revisar PR e gates do head final e obter autorização específica de publicação. Publicação futura deve manter `docs/WORKER-SAFE-DEPLOY.md`; rollback conservador preserva tabelas/estado. Scripts históricos install/fix/integrate/video-setup do PC não foram executados; nenhuma dependência instalada no executor.
