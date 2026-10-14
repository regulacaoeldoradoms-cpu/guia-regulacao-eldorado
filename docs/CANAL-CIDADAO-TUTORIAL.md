# Tutorial interativo do Canal do Cidadão

Base verificada: `71a2c8e90eb2516162c5deca7b4ff12c12db65c8` (14/10/2026), posterior ao merge da PR654 e à PR655. Branch isolada: `feat/citizen-interactive-tutorial-20261014`. AGENTS/checkpoint e workflows conferidos; não há skills locais adicionais. O checkpoint da Missão Bancária foi preservado.

## Plano e critérios

1. Reutilizar os componentes/controlador existentes; separar demonstração dos efeitos reais.
2. Ensinar quatro categorias, relato/detalhes, prévia/remoção, privacidade, protocolo/resposta e avisos em 16 etapas praticadas.
3. Validar ações por teclado/Enter, eventos programáticos, repetição, retorno, contas, histórico, acessibilidade e renderização.
4. Abrir PR draft, revisar CI e comentários. Sem merge, auto-merge, produção ou aplicação de migração.

## Implementação e segurança

- Início explícito; aviso de demonstração sempre visível. Avançar exige a prática da etapa. Voltar permite revisar etapas já praticadas; Pausar/Pular/Cancelar/Escape encerram a demonstração sem conceder conquista. Refazer reinicia somente o tutorial.
- Componentes clonados do próprio portal são inicializados pelo mesmo controlador `citizen.js`, com adaptador imutável e sem rede. Não há formulário paralelo escrito à mão. Os nós originais ficam desconectados e voltam intactos: dados, File objects, miniaturas, listeners e rascunho não são serializados/recriados.
- A demonstração começa depois das solicitações de API já iniciadas. O observador em `auth-client.js` retém somente Promises. A espera pode ser cancelada e tem limite; não cancela nem repete envios anteriores.
- Durante a demonstração, os handlers reais do Canal recusam efeitos. A barreira temporária também bloqueia APIs por fetch, XHR, beacon, construção/envio de WebSocket e submit nativo. Navegação/logout encerram a demonstração antes de prosseguir. Todos os transportes são restaurados em pausa, erro, interrupção e descarte.
- Arquivos da demonstração são PNGs gerados localmente com “EXEMPLO FICTÍCIO”; o seletor não abre câmera/dispositivo. Relatos/respostas digitados nunca são enviados, gravados em progresso ou incorporados a fixtures. O acompanhamento/avisos altera apenas memória sintética.
- Sigilo segue a opção real da conta verificada. A opção denominada anônima nas demais contas protege a exibição ao Conselho; o tutorial explica que o protocolo continua vinculado à conta e não promete anonimato perante o sistema.
- Progresso local contém apenas `{version, steps}` em chave por identidade da conta. Apenas prefixos ordenados são aceitos; troca de conta invalida a sessão. Não sincroniza o ponto de retomada entre dispositivos.
- A conquista usa uma rota autenticada nova, origem allowlisted, corpo exato/bounded e conclusão integral. INSERT verifica novamente conta ativa, versão da sessão e primeiro acesso, com unicidade por usuário/tutorial/versão. Sem novos papéis, XP ou permissões. O cliente exige recibo válido antes de anunciar a conquista.

## Ativação futura

`PORTAL_TUTORIAL_COMPLETION_ENABLED` está **desativado por padrão** e não foi adicionado ao config produtivo. A migração `worker/migrations/portal-tutorials-v1.sql` foi exercitada somente em SQLite em memória. Nada foi aplicado a D1/produção. Ativação real requer autorização específica para migração, configuração e publicação; sem isso, a interface explica que concluiu localmente e que o registro está indisponível.

As versões dos carregadores compartilhados seguem o gate de cache existente. Mudanças na home e demais entradas se limitam às referências de versão; não há reconstrução de UI nem alteração da política de cache. O marcador HTML/SW acompanha a versão.

## Evidência e limites

- Validação inicial: sintaxe e 956 testes Worker; nova conclusão autenticada: 14 testes atuais; cache: 27; 20 cenários Chromium (320/360/390/412/1280, claro/escuro, texto 100/200%), todos com zero APIs durante demonstração e preservação de rascunho/anexos. Após os ajustes finais, 78 testes afetados passaram; a matriz de 20 passou também na CI de d059361f. CI e interrupções são reconfirmadas no head final.
- Evidência visual é gerada pelo workflow `Citizen tutorial isolation`, no artefato `citizen-tutorial-synthetic-evidence`: relato, imagem ampliada, privacidade, acompanhamento, viewport reduzida, reflow equivalente a zoom 200% e impressão do Canal com o widget externo de chat ocultado transitoriamente nas duas capturas comparadas. Os gates existentes de impressão/Chat permanecem intactos. Revisão visual é feita nas imagens renderizadas, além das asserções de DOM/foco/árvore acessível/contraste.
- Fixtures sintéticos e Chromium isolado não equivalem à homologação com leitores de tela reais, teclado virtual de aparelho físico, Safari/iOS ou conta produtiva. Viewport reduzida/visualViewport é uma simulação do teclado; métricas CSS 640px com escala 2 exercitam o reflow equivalente ao zoom de um desktop de 1280px.
- A conquista é cosmética e confirma o percurso informado pelo cliente; não prova aprendizado ou presença humana contra cliente adulterado. A barreira cobre os transportes/controladores existentes, sem ser uma sandbox contra script malicioso da mesma origem ou extensões. Não concede autorização para manifestações reais.
- Workflows de push produtivo são restritos à main (diagnóstico específico usa outra branch nominal); este workflow usa leitura do GitHub e recursos existentes de CI, sem secrets, deploy, banco remoto ou recurso pago adicional. Integrações Cloudflare existentes fazem previews de branch; O smoke institucional preexistente de auth-me/social consultou produção anonimamente na CI, sem credenciais, conteúdo privado ou mutações; nenhuma URL preview é usada para homologação autenticada ou dados reais. O novo registro permanece desativado também nesses builds.
