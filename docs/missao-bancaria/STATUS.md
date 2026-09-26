# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — integração da aplicação introdutória e novo recorte Copom/CVM.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.**

Wellyton reiterou autorização para desenvolvimento, implementação e integrações necessárias sem acesso imediato ou novas confirmações por pequena etapa. Não confundir autorização com evidência de compreensão ou retenção. Seguir `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`: dividir a produção, não reduzir o ensino.

## Fonte oficial e limites

Repositório `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`. `/estudos/` e `/api/studies/*`, conta `wellyton` autorizada pelo backend, nenhum cargo novo. Conteúdo no GitHub; progresso em `study_*` no D1 `AUTH_DB`. Sem dados assistenciais, segredos ou telemetria pedagógica externa. Preservar IDs, questões, respostas, XP, conquistas e dados. Bronze/Prata/Ouro continuam níveis de segurança da conta. Rollback não apaga progresso.

## Entregas incorporadas

- #488 documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 primeiro bloco/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501 ensino completo do recorte: `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- #502 leitor por partes: `517c42a7511c2c72d01c242690fd32257b237ec3`.
- **#503 aplicação introdutória: `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`, incorporada nesta rodada.**

Nove missões/38 questões são apenas o primeiro bloco de SFN, não curso, edital ou toda a disciplina. Oito aulas têm conceitos, siglas, exemplos resolvidos e consulta; o Chefe possui preparação cumulativa. Não trocar ensino por novas questões.

## Aplicação introdutória — #503

Documento 31. Head `08f9b07f0e3cbc16a1eb40dc4c14195d73222f69`: todas as 24 execuções de GitHub Actions consultadas retornaram sucesso, incluindo auditoria geral `36258637192`. A PR foi marcada pronta e incorporada com o head exato validado, sem alterar testes ou tolerâncias.

Três casos formativos, comentários, critérios e links para reler; rascunho opcional temporário. Sem nota automática, XP, envio de rascunho ou alteração das questões pontuadas. O merge é confirmado; consultar checks do commit para resultado de build/publicação, sem presumir tráfego produtivo atualizado.

## CMN e Banco Central — #504

Documento 32. Branch `feat/missao-bancaria-aplicacao-cmn-bcb`, head `5f3f2ba44f6acce2c29f3d081e944be519003a9e`.

Seis atividades próprias; com a introdução, nove em três aulas. Ensino integral e 38 questões preservados. A #504 foi redirecionada à main após o merge da #503. Na última consulta, 23 workflows estavam aprovados e a auditoria geral `36259684505` permanecia em execução. Não registrar merge antes da operação bem-sucedida. Os comentários finais da PR registram resultados posteriores a este STATUS.

## Rodada atual — Copom e CVM

Documento `33-APLICACAO-COPOM-CVM.md`.
Branch `feat/missao-bancaria-aplicacao-copom-cvm`, baseada no head da #504.

Seis atividades formativas:
- Copom: meta versus contrato, sistema/taxa apurada/meta, limites da conclusão sobre efeitos imediatos.
- CVM: destino de recursos em emissão/venda posterior, participação versus dívida, fiscalização versus lucro garantido.

Nesta branch: **15 atividades em cinco aulas**, além das mesmas 38 questões pontuadas. As quatro missões restantes não recebem suplemento sem planejamento próprio. Material já ensinado, textos e gabaritos preservados; comentários não introduzem silenciosamente conceitos inéditos.

Nenhuma mudança de HTML, CSS, leitor, endpoint, autenticação, D1, cronômetro, pontuação ou gate. Novo módulo de conteúdo, ligação no manifesto, testes e documentação. O painel anterior já aceita o formato.

**Local executado:** sete testes Node com fixtures passaram. Não houve navegador local nem suíte completa local; DNS de GitHub indisponível nesse ambiente. **CI preparado:** testes de catálogo real, preservação dos casos anteriores e 32 cenários de navegador (27 anteriores + 5 novos). Consultar o resultado depois do push; não presumir CI/merge/publicação nesta versão do documento.

Fontes primárias abertas nesta sessão: LC 179, leis 6.385/6.404 e páginas institucionais/educacionais da CVM. BCB Selic/Copom: conteúdo indexado consultado, abertura direta dependente de JavaScript; não alegar leitura integral nem atualizar carimbo de fonte sem conferência.

## Próxima ação autorizada

Concluir as validações de #504 e desta nova entrega; integrar apenas versões elegíveis e registrar separadamente os builds. Depois preparar aplicação de Operadores e Seguros/Previdência em recortes pequenos, com leitura anterior e critérios explícitos. Não solicitar acesso imediato do usuário.

## Histórico e pendências preservadas

A #502 teve sucesso nos checks do merge: Workers Builds `108452897413`, versão informada `ad2d0848-9624-4ff5-934b-b1b74cabb81f`; Cloudflare Pages `108452795618`; GitHub Pages `108452819050`. Esses registros não comprovam publicação dos commits posteriores nem 100% do tráfego do Worker.

Falhas históricas do preview Worker em branches não foram convertidas em sucesso. Não mudar gates para escondê-las. O erro inicial “Rota não encontrada” motivou #492/#494; #493 ficou sem merge; #491/#496/#497 foram substituídas.

Continuam pendentes: recorde histórico além de 500 eventos, cronômetro/interrupções, isolamento/retomada de rodadas, comprovação real de persistência e retenção pedagógica. Rascunho de autoavaliação não é progresso salvo e seu limite é avisado na interface.

Fase 1 sem homologação humana de aprendizagem. Testes sintéticos e autorização para avançar não substituem observação do uso real.
