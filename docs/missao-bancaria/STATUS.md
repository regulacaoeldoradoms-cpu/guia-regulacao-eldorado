# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — rodadas explícitas e confiabilidade de sessões.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes da avaliação.** Wellyton autorizou continuar desenvolvimento, testes e integrações elegíveis sem acesso imediato ou aceite por pequena etapa. Não confundir autorização com homologação humana de compreensão. Seguir os documentos 24 e 26 e subdividir a produção sem cortar ensino.

Repositório oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Decisões preservadas

`/estudos/`, `/api/studies/*`, `wellyton` validado pelo backend. Conteúdo no GitHub; estado em `study_*` no D1 `AUTH_DB`. Nenhum cargo novo, informação assistencial ou telemetria pedagógica externa. Preserve IDs, textos, perguntas, gabaritos, XP e conquistas. Bronze/Prata/Ouro continuam segurança da conta. Rollback mantém dados.

## Entregas incorporadas

- #488 documentação; Fase 0 aprovada em 25/09/2026, plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501 ensino: `f6ae4c598156656e2c630372d6e2122259ffb1c2`.
- #502 leitor: `517c42a7511c2c72d01c242690fd32257b237ec3`.
- #503 aplicação introdutória: `c6c6dbfdd1e069053767bbec70ce2ce03b592dc3`.
- #504 CMN/BCB: `7a302b6f98fbde9b3ff5bc1aeca01bb8dad63378`.
- #505 Copom/CVM: `6040f0372997ca60bbf11502a94bd68e0cbad919`.
- #506 Operadores/Seguros: `614991af8d01def824e85b1b71f06fbd22b01d4a`.
- **#507 Pagamentos e revisão cumulativa: `f19b1cbb583fee9f38c79cda6538972af825ee72`, incorporada nesta retomada.**

No head da #507, `f6b66e3b22cede1ca6f60701704204db90529e81`, as 24 execuções consultadas estavam concluídas com sucesso, incluindo auditoria geral `36266983013` e navegador da Central `36266982963`. Nenhum teste, baseline ou tolerância foi relaxado. Consultar os checks do merge para publicação; não inferir tráfego efetivo do resultado de merge.

Main resultante: oito aulas de ensino, preparação do Chefe, 27 atividades formativas opcionais e 38 questões pontuadas. Esse é somente o primeiro bloco de SFN, não o edital ou curso completo.

## Nova entrega — vínculo de rodadas e coordenação de sessões

Documento: `36-RODADAS-PERSISTENTES-E-SESSOES.md`.
Branch: `fix/missao-bancaria-rodadas-persistentes`.
Base: merge da #507 indicado acima.

Implementado:
- vínculo explícito entre sessão, modo, revisão e tentativas;
- Chefe/revisão deixam de inferir respostas apenas pelo horário;
- mesma resposta reenviada não duplica tentativas;
- uma resposta por questão/rodada, sem alteração depois da correção;
- rodada finalizada preserva o resultado para recuperar falha de resposta;
- revisão concluída e evento de XP em transação;
- cliente ignora respostas de rede de uma missão anterior e não fecha a nova missão com temporizador antigo;
- abertura duplicada bloqueada na mesma página, leitura disponível durante confirmação;
- fechamento idempotente e duração limitada ao intervalo registrado no servidor.

**Schema aditivo:** duas tabelas novas `study_rounds` e `study_round_answers`, criadas após autorização. Nenhuma tentativa antiga é apagada ou reatribuída. Aulas normais mantêm retomada histórica; revisões/Chefe exigem prática vinculada à rodada apropriada. IDs das aulas/questões e recompensas não mudam.

Nenhuma alteração nos arquivos de conteúdo, no leitor, CSS, autenticação global ou gate de deploy. O cliente passa a enviar `sessionId`; clientes antigos devem atualizar/reabrir, com mensagem explícita. Verificar implantação de frontend e Worker conjuntamente.

## Testes e limites

Executados localmente: **24 testes de serviço com SQL real em SQLite descartável e sete fluxos do roteador real com identidade/catálogo sintéticos**, todos aprovados. Conferidos hashes dos módulos testados e sintaxe. Não foi usada base produtiva nem sessão de Wellyton.

CI preparado: os testes anteriores continuam, substituindo somente as asserções que exigiam a consulta antiga por timestamp/rowid; novos testes comportamentais cobrem essa regra. Dez cenários de navegador adicionais mantêm os 45 anteriores, total previsto de 55. **Resultado remoto, merge desta correção e publicação ainda devem ser consultados; não são presumidos por este registro.**

SQLite local com adaptador D1 testa SQL/transações, não toda a infraestrutura distribuída. Browser com API simulada não equivale a teste autenticado produtivo. Os comentários finais da PR devem registrar resultados posteriores a este arquivo.

## Próximas tarefas autorizadas

Concluir CI, revisar o diff e integrar somente se elegível. Depois tratar cronômetro por visibilidade/pausa e salvamento periódico em recorte próprio. **Essa pausa ainda não foi implementada nesta rodada: a duração continua baseada em tempo decorrido no cliente**, com proteção básica no servidor. Não anunciar horas líquidas/atenção como comprovadas.

Também permanecem: sequência histórica além de 500 eventos; recuperação depois de fechar a página; sessões abandonadas; requisitos/desbloqueio no backend; comprovação real de persistência e aprendizagem humana. A correção de rodadas não resolve automaticamente todos esses pontos.

Histórico de publicação: checks de frontend e Worker de merges anteriores foram registrados nas PRs; não equivalem a 100% do tráfego ou ao resultado dos commits mais novos. Erro inicial “Rota não encontrada” motivou #492/#494; #493 sem merge; #491/#496/#497 substituídas. Não relaxar gates nem reintroduzir alternativas abandonadas.

A Fase 1 continua aberta. Não pedir acesso imediato nem inventar aprovação humana.
