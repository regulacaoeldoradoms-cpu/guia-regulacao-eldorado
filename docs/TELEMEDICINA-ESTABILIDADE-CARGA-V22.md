# Telemedicina — estabilidade do viewport na carga V22

## Estado atual

**Superada pela decisão V23 de 08/09/2026.**

A V22 tentou manter o viewport no topo durante a hidratação inicial do dashboard e desativar a ancoragem automática de rolagem. Como o deslocamento visual continuou sendo observado na prática, a estratégia deixou de ser considerada adequada para a rota `/telemedicina/`.

A partir da V23, o mecanismo V22 permanece apenas no histórico do repositório e **não executa mais qualquer correção automática de viewport**. O JavaScript carregado com esse nome retorna imediatamente e expõe apenas uma fachada inerte por compatibilidade.

A decisão vigente está documentada em `docs/TELEMEDICINA-SEM-ANIMACOES-V23.md`.

## Histórico da V22

A rota `/telemedicina/` deveria permanecer visualmente estável desde a entrada na página até o término da hidratação inicial do dashboard. O carregamento assíncrono da data operacional, alertas e acompanhamentos não deveria deslocar automaticamente o viewport para baixo.

A V22 cobria restauração de posição pelo navegador e reajuste de âncora quando o conteúdo curto de carregamento era substituído pelo dashboard completo. Essa abordagem usava `history.scrollRestoration = 'manual'`, observação de DOM e reposicionamento explícito para o topo.

Esses mecanismos foram desativados na V23 para eliminar qualquer interferência automática sobre o viewport da Telemedicina.
