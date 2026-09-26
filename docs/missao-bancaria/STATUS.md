# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — integração das aplicações anteriores e recorte de Operadores/Seguros.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.** Wellyton autorizou continuidade, desenvolvimento e integração tecnicamente elegível sem acesso imediato nem nova confirmação por etapa. Isso não equivale a homologação humana de compreensão. Seguir documentos 24 e 26: dividir o trabalho quando necessário, nunca omitir ensino.

Repositório oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Decisões preservadas

`/estudos/` e `/api/studies/*`; `wellyton` autorizado no backend; nenhum cargo novo. Conteúdo no GitHub, progresso em `study_*` no D1 `AUTH_DB`. Não misturar dados assistenciais, segredos ou telemetria pedagógica externa. Preservar IDs, questões, respostas, XP e conquistas; Bronze/Prata/Ouro permanecem segurança da conta. Rollback sem apagar dados.

## Entregas incorporadas

- #488: documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490: motor, `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495: expansão/revisões, `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498: bloco inicial/Chefe, `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499: retomada/Conquistas, `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500: sequência, `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501: ensino desenvolvido, `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- #502: leitor por partes, `517c42a7511c2c72d01c242690fd32257b237ec3`.
- #503: aplicação introdutória, `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`.
- **#504: CMN/Banco Central, `7a302b6f98fbde9b3ff5bc1aeca01bb8dad63378`, incorporada nesta rodada.**
- **#505: Copom/CVM, `6040f0372997ca60bbf11502a94bd68e0cbad919`, incorporada nesta rodada.**

Nove missões/38 questões são apenas o primeiro bloco de SFN, não o curso ou edital completo. Oito aulas têm ensino, vocabulário e exemplos; o Chefe tem preparação cumulativa. A aplicação complementa o ensino, não o substitui.

## Integrações verificadas nesta rodada

#504: as 24 execuções de GitHub Actions do head `5f3f2ba44f6acce2c29f3d081e944be519003a9e` foram consultadas com sucesso, incluindo auditoria geral `36259684505`.

#505: 23 execuções já estavam aprovadas e a auditoria geral `36260806103`, job `108456106407`, concluiu com sucesso antes do merge do head `d8103934b122c5c1b1f662b0cd53ea33d4388a52`. Não foram alterados head, testes, tolerâncias ou baseline para integrar.

Main resultante contém 15 atividades formativas em cinco aulas, com as mesmas questões pontuadas. Merge não prova sessão autenticada ou distribuição de tráfego produtivo. Registros finais de build/publicação ficam nos comentários das PRs; não inferir sucesso sem consultar.

## Rodada atual — Operadores e Seguros/Previdência

Documento: `34-APLICACAO-OPERADORES-SEGUROS.md`.
Branch: `feat/missao-bancaria-aplicacao-operadores-seguros`, diretamente sobre a main após #505.

Seis casos novos: canais versus carteiras, análise do cliente versus supervisão, naturezas distintas sob o mesmo supervisor; prêmio como pagamento, aberta coletiva versus fechada, canal de oferta versus produto/supervisor.

O texto das aulas permanece integral e as referências de ensino precedem a prática. Nesta branch são **21 atividades opcionais em sete aulas**, além das mesmas 38 questões pontuadas. Nenhuma nota automática, XP por rascunho ou tentativa registrada pelo suplemento. A interface continua avisando que rascunhos são temporários.

Novo módulo de conteúdo e uma fonte oficial adicional da SUSEP. Fontes anteriores preservadas; acrescentados vínculos da FAQ à aula de Seguros e do Portal do Investidor a Operadores. Sem mudança de HTML, CSS, leitor, endpoints, D1, autorização ou gate.

Local: sete testes Node e sintaxe aprovados. Navegador local não executado; DNS local do GitHub falhou. No CI foram preparados os testes de catálogo e cinco novos cenários, mantendo os 32 anteriores, para total de 37. **Resultados remotos, merge desta branch e publicação ainda devem ser lidos e registrados.**

## Fontes e limites

Aberto nesta sessão: Portal do Investidor, explicação histórica BCB, Lei 12.865, LC 109, SUSEP institucional/FAQ e PREVIC. Uso restrito aos conceitos. A página histórica continua rotulada como tal; a abertura direta da Resolução 5.060 depende de JavaScript, sem alegação de nova conferência integral. Esta ampliação não altera a regra de carteiras nem requisitos normativos de autorização.

## Próximas ações

Concluir validação e integração da nova entrega; registrar resultados reais de publicação separadamente. Depois preparar aplicação de Pagamentos/Consórcios e revisão cumulativa apoiada em ensino existente. Não exigir acesso imediato nem criar novos mundos para compensar lacunas de ensino.

## Pendências mantidas

Recorde da sequência limitado aos 500 eventos recentes; cronômetro/interrupções; isolamento/retomada de rodadas; comprovação real de persistência; retenção e clareza no uso humano. Não resolvidas pelos novos exercícios. Rascunho temporário não é progresso salvo.

Falhas históricas de preview de Worker em branches não foram escondidas ou tratadas como sucesso. Erro inicial “Rota não encontrada” motivou #492/#494; #493 sem merge; #491/#496/#497 substituídas. Não reintroduzir alternativas abandonadas nem relaxar gates. A Fase 1 continua sem homologação humana final.
