# Integração Central + contratos CI + Home — 04/10/2026

Base remota conferida: `6c4fcd86198103ad6e1e8adc07901219c7957c92`. Pacote reutiliza os 17 arquivos da #599 (`f4306fc1`) e os cinco ajustes técnicos exatos da #598 (`2e600517`), sem sobreposição ou resolução de conflito. `PROJECT_STATE.md` e trabalho bancário preservados.

A lista da Central passa a aparecer após acesso atual; preferências/IA deixam o caminho crítico. Cache de pasta/pesquisa em RAM, 20 s/12 entradas/200 itens, com validação de acesso ao vivo, isolamento por sessão, invalidação em mutações e descarte de respostas atrasadas. [Medições sintéticas e limites](CENTRAL-DOCUMENTOS-NAVEGACAO-RAM-20261003.md) continuam válidos; não são latência produtiva.

A mudança funcional adicional da Home é **somente** `['/js/portal-global-chat.js', 'PortalGlobalChat']` em `SCRIPT_GLOBALS`, `js/login-home-transition.js`. O módulo já consta no HTML. Origem igual, caminhos fixos, rejeição de scripts/handlers inline e conteúdo ativo, destinos restritos, timeout/fallback permanecem. O bootstrap carrega dependências locais já existentes; nenhuma permissão de usuário/API foi alterada. Autorização específica obtida antes da implementação.

Verificações locais afetadas:
- **23/23 Node Home**, incluindo 11 contratos novos com rejeições de origem externa, scripts fora da lista (inclusive dependência de chat não autorizada diretamente), handlers inline, conteúdo ativo e destinos fora da Home.
- **14/14 Chromium Home**, desktop/mobile, sem skips/flaky: cenários originais com documento único, vídeo de 10 s, perfil lento, ausência de flash, credenciais inválidas e primeiro acesso; acrescidos de bootstrap duplicado, ausência de sessão e duas falhas de carregamento. Falha de dependência do chat preserva Home pronta; falha do bootstrap segue o fallback existente.
- **12/12 contratos #598** e **2/2 auditoria escura da Central** da etapa integrada anterior, aplicáveis a arquivos inalterados.
- Sintaxe/diff e aplicabilidade do pacote local à base equivalente conferidos. Nenhuma instalação ou API real; navegador/runtime preexistentes, fixtures e servidores loopback próprios.

[Resumo reproduzível da Home](../testing/central-docs/home-transition-verification-20261004.json). Comandos: `node --test worker/tests/post-login-opening.test.mjs worker/tests/home-transition-security.test.mjs`; `npx playwright test --config playwright-home-opening.config.mjs` em testing/browser com dependências do projeto. O workflow Home executa os novos contratos; nenhuma asserção, timeout ou baseline foi afrouxado.

Reaproveitados #599: aggregate 737/737, Central Chromium/fases/staging/governança; #598: auditoria global 216/216 no próprio head. Não repetidos localmente aggregate, auditoria ampla ou preview. Esses heads não equivalem ao CI da nova árvore; acompanhar o head remoto da draft até o resultado terminal e registrar o resultado na descrição, sem novo commit apenas documental.

Riscos restantes: runtime local Playwright 1.62.1 difere do 1.55.0 do projeto; CI confirma Linux/versão do projeto. Cache RAM e bootstrap continuam sujeitos a rede/mutações externas. Worker preview legado e lista de checks obrigatórios da main seguem limites conhecidos, sem nova investigação, migração, alteração de credenciais/bindings/proteções.

Entrega é **PR draft para revisão**. Nenhum merge, ativação ou deploy autorizado.
