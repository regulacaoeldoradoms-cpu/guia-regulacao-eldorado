# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 — leitor e primeiro suplemento de aplicação.

## Estado e autorização

**Fase ativa: Fase 1. Ensino por leitura antes das questões.**

Wellyton autorizou continuar desenvolvimento, revisão, testes e integrações sem acessar imediatamente nem reconfirmar cada pequena etapa. Não alegar compreensão, retenção ou homologação humana que não ocorreram. Seguir os documentos 24 e 26: subdividir a produção, sem reduzir o ensino.

Fonte oficial: `regulacaoeldoradoms-cpu/guia-regulacao-eldorado`.

## Decisões preservadas

`/estudos/`, `/api/studies/*`, acesso exclusivo de `wellyton` validado no backend. Conteúdo no GitHub; progresso nas tabelas `study_*` do D1 `AUTH_DB`; nenhum cargo novo, dado clínico ou telemetria pedagógica externa. IDs, perguntas, gabaritos, XP e conquistas preservados. Bronze/Prata/Ouro continuam separados como segurança da conta. Rollback não apaga dados.

## Já incorporado antes das entregas atuais

- #488: documentação; Fase 0 aprovada em 25/09/2026. Plano: `15-FASE-0-PLANO-TECNICO.md`.
- #490: motor inicial, `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495: expansão/revisões, `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498: primeiro bloco/Chefe, `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499: retomada/Conquistas, `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500: sequência, `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- #501: ensino desenvolvido, `f6ae4c598156656e2c630372d6e2122259ffb1c2`.

**9 missões e 38 questões são somente o primeiro bloco de SFN, não curso ou edital completo.** Oito aulas possuem conceitos, vocabulário, exemplos e consulta; o Chefe tem preparação cumulativa. Documentos 23–29 preservam o histórico editorial e as limitações da conferência das fontes.

## PR #502 — leitura no celular

Branch: `feat/missao-bancaria-leitura-mobile`.
Head observado: `1c902d5606429fc8700a349086b31df7aa84f6eb`.
Documento: `30-LEITURA-MOBILE-E-PRATICA.md`.

Leitura por partes/inteira, índice, letras ajustáveis, painéis Ler/Praticar, consulta preservando respostas e sessão. Barra das questões começa em zero e legenda passa a indicar acerto nas tentativas, não domínio comprovado. Sem cortar conteúdo nem alterar backend/dados.

O CI específico do leitor e seus 14 testes de navegador passou. Na auditoria geral, a primeira execução terminou com 215 sucessos e uma falha de comparação visual na impressão escura de `/cidadao/`. Não foi desligado nem relaxado o teste. O job foi repetido sem alteração de código: run `36254703571`, novo job `108447920775`. Na última consulta estava em execução. Conferir o resultado antes de declarar o bloqueio resolvido ou integrar a PR.

O preview do Worker na branch havia falhado sem causa detalhada no resumo. Isso não deve ser chamado de sucesso nem confundido com publicação de produção. Nenhum gate foi alterado para contorná-lo.

## Rodada atual — aplicação guiada V1

Branch empilhada: `feat/missao-bancaria-aplicacao-guiada`.
Base: head da PR #502 indicado acima.
Documento: `31-APLICACAO-GUIADA-SFN-V1.md`.

Implementado:
- três casos formativos na introdução: papéis, limite do macete de palavras e intermediação em contexto diferente;
- explicação em palavras próprias, comentário revelável e critérios de autoavaliação;
- botões para reler os trechos da mesma aula sem recriar sessão ou respostas;
- rascunho opcional temporário, sem envio/armazenamento na conta;
- nenhuma nota automática, XP ou conclusão decorrente desses casos;
- suplemento versionado separado das 38 questões pontuadas;
- textos e gabaritos existentes preservados, sem alteração de D1 ou endpoints.

É o primeiro recorte da aplicação, não uma avaliação abrangente de todas as matérias. As demais aulas mantêm seu ensino e terão aplicação desenvolvida em etapas posteriores. A atividade opcional não substitui as questões obrigatórias de missão/revisão.

Validação local efetiva: cinco testes Node e seis cenários Chromium com DOM sintético simplificado aprovados; captura inspecionada. Adicionados dois testes de catálogo real e oito cenários de navegador para o CI, mantendo os 14 anteriores. **Não presumir resultado remoto, merge ou publicação antes de consultá-los.**

Fontes oficiais conceituais reabertas nesta rodada: estrutura do SFN no Portal do Investidor e apresentação do CMN no Ministério da Fazenda. Nenhuma taxa atual ou nova norma de contratação introduzida.

## Publicação histórica e limites

A PR #501 teve checks bem-sucedidos do merge: Workers Builds `108435911331`, versão informada `edbfb205-76f6-4417-bae9-8afb4e3b7161`; Cloudflare Pages `108435851677`; GitHub Pages `108435880048`. Isso não comprova publicação das PRs atuais nem tráfego produtivo integral. Não houve acesso autenticado real do usuário nesta sessão.

Incidente inicial: frontend antes do Worker, “Rota não encontrada”; correções #492/#494, commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`. #493 fechada sem merge; #491/#496/#497 substituídas. Não reintroduzir versões abandonadas.

## Próximas ações autorizadas

Concluir a leitura dos resultados da auditoria do leitor. Validar o suplemento com HTML/CSS reais e APIs sintéticas. Corrigir regressões, integrar somente versões elegíveis e registrar separadamente os builds e a publicação. Depois preparar aplicação para CMN/Banco Central, com material anterior e critérios de correção, em recortes pequenos. Não exigir teste imediato de Wellyton.

Pendências técnicas anteriores mantidas: recorde de sequência limitado aos 500 eventos; cronômetro/interrupções; isolamento e retomada de rodadas; comprovação real de persistência. Os rascunhos desta nova autoavaliação não são progresso salvo: isso é informado na própria interface.

Avaliação humana posterior: clareza, explicação própria, aplicação, retorno com progresso/XP salvo, conquistas, revisão e Chefe. Não encerrar a Fase 1 apenas com testes de interface nem afirmar retenção comprovada.
