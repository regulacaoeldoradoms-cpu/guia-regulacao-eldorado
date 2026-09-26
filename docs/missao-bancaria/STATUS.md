# MISSÃO BANCÁRIA — STATUS

Atualizado em 26/09/2026 após a incorporação da PR #501.

## Estado e autorização atual

**Fase ativa: Fase 1. Ensino por leitura antes da prática é a prioridade.**

Wellyton autorizou o avanço, revisões, testes e integrações necessárias sem aguardar seu acesso imediato ao portal. Registro: `28-REVISAO-SEGMENTOS-E-AUTORIZACAO.md`. Não exigir confirmação a cada pequena etapa nem solicitar teste imediato. **Avaliação humana de compreensão continua pendente; não alegar que já ocorreu.**

Todas as matérias e versões seguem `24-CONTRATO-PEDAGOGICO-GLOBAL.md` e `26-PRODUCAO-PEDAGOGICA-EM-ETAPAS.md`. Dividir a produção quando necessário, sem reduzir ou omitir ensino.

## Entregas incorporadas

- #488: documentação-base; Fase 0 aprovada em 25/09/2026; plano `15-FASE-0-PLANO-TECNICO.md`.
- #490 motor inicial: `22257bca768cfc440578e0b8e11da62f15abc08f`.
- #495 expansão/revisões: `97cc6ab382d624841da46d6d9a9ff7f26a1a18ca`.
- #498 bloco de nove missões/Chefe: `20487883c948dffbeb4b6849baa3c39e9c577d9f`.
- #499 retomada/Conquistas: `c5ebf3a0bb93bf303851835446ec32ff5decb0cd`.
- #500 sequência: `ac9128c7e807be8eff0ee5bc1579f792aa249a3d`.
- **#501 ensino por leitura: `f6ae4c598156656e2c630372d6e2122259ffb1c2`, incorporada em 26/09/2026 às 15:53:12 UTC.** Head integrado: `1424abcc4a3301b637f3c7736eac12870a2538e1`.

9/9 refere-se somente ao primeiro bloco de SFN, não ao curso ou edital completo.

## Regras preservadas

Acesso exclusivo de `wellyton` no backend; `/estudos/` e `/api/studies/*`; nenhum novo cargo; conteúdo no GitHub e progresso em tabelas `study_*` no D1 `AUTH_DB`. IDs, perguntas, gabaritos, XP e conquistas preservados. Bronze/Prata/Ouro separados do estudo. Nenhuma telemetria pedagógica externa. Rollback sem apagar dados.

## O que a PR #501 colocou na main

**Oito aulas com explicações, vocabulário, exemplos resolvidos e consulta, mais preparação cumulativa do Chefe.** As 38 questões existentes estão ligadas a trechos de ensino; os itens do Chefe também identificam aulas anteriores de origem.

- Documentos 23–26: correção do ensino, contrato global e produção subdividida.
- Documento 27: 13 trechos revisados em Introdução, CMN, Banco Central e Copom.
- Documento 28: 25 trechos revisados em CVM, Operadores, Seguros/Previdência, Pagamentos/Consórcios e Chefe, com testes de aplicação real ao catálogo.
- Documento 29: conferência pontual de carteiras e limites da evidência.

Os textos usam o renderizador existente, anterior às questões. Não foi criado botão novo de navegação por questão nem alegada alteração visual. Nenhum dado pessoal foi apagado, nenhuma pergunta foi trocada e nenhuma pontuação foi recalculada nesta revisão editorial.

As nove missões possuem passagem editorial identificada; o estado de avaliação humana permanece `human-review-pending`. As perguntas ainda são prática inicial de reconhecimento, não avaliação completa de aplicação em situações novas e retenção duradoura.

## Precisão e alcance da conferência

Leis 6.385, 6.404, 12.865 e 11.795, LC 109 e páginas SUSEP/PREVIC foram abertas para os trechos utilizados; a LC 179 foi consultada no lote A.

O ponto sobre carteiras foi conferido por cotejo, conforme documento 29: art. 4º em reprodução jurídica externa, explicação institucional histórica e alterações oficiais indexadas no BCB. O repositório externo não foi rotulado como fonte oficial. A limitação de acesso automatizado direto ao inteiro teor consolidado do BCB permanece registrada; não foi inventada uma leitura integral. Não se introduziram requisitos de capital ou de autorização completa de bancos.

## CI confirmado antes do merge

No head final `1424abcc4a3301b637f3c7736eac12870a2538e1`, foram confirmadas **20 execuções de GitHub Actions com `completed/success`**. Entre elas:

- Missão Bancária: `36253317841`;
- site: `36253317951`;
- interações do Portal: `36253317952`;
- Camada Social: `36253317875`;
- autenticação/PBKDF2: `36253318425`.

Os testes da Missão Bancária executam o catálogo real, verificam referências e aplicação dos textos, preservação de perguntas/recompensas e casos negativos de material ausente ou referência quebrada. Não certificam aprendizado nem substituem uso real.

No mesmo head da branch, Cloudflare Pages teve sucesso e o check externo de Worker falhou, sem causa detalhada em seu resumo. A falha foi registrada na PR, não ocultada ou convertida em sucesso. Nenhuma proteção de deploy foi alterada. O build da main é verificado separadamente.

## Publicação após o merge — último estado consultado

O merge de conteúdo `f6ae4c598156656e2c630372d6e2122259ffb1c2` disparou:
- Workers Builds, check `108435808960`, build `cd1f7986-07c8-4031-9e60-9af37f35e7d6`: **em andamento na consulta inicial**;
- publicação GitHub Pages, workflow `36253496028`: em andamento nessa consulta.

Não tratar o merge como confirmação de tráfego produtivo atualizado. Consultar os check-runs do merge e os registros finais na conversa da PR #501. Esta atualização de STATUS é documental, posterior ao conteúdo integrado, e não presume o desfecho dos builds.

## Próximas tarefas autorizadas

1. Concluir verificação da publicação no Worker, sem relaxar gates ou alegar leitura autenticada não realizada.
2. Revisar a experiência de leitura no celular com dados sintéticos e dividir blocos quando necessário, sem cortar conteúdo essencial.
3. Preparar, em etapas menores, avaliações de compreensão/aplicação após o ensino. Preservar as perguntas existentes e seu histórico; não chamar três acertos de domínio consolidado.
4. Corrigir as lacunas técnicas já conhecidas em entregas próprias, com testes e documentação.

Não abrir novos mundos para compensar ensino insuficiente. Não declarar Fase 1 homologada pedagogicamente porque houve merge. A autorização permite continuar trabalhos planejados sem aguardar acesso imediato; não permite inventar resultado de aprendizagem.

## Histórico e limites técnicos mantidos

Incidente inicial: frontend chegou antes do Worker e mostrou “Rota não encontrada”. Correções #492/#494, commit `90cc6d8e16039bb7ed1482bec3f75feadb860816`. #493 sem merge; #491/#496/#497 substituídas.

Continuam pendentes: recorde da sequência além de 500 eventos; cronômetro/interrupções; isolamento e retomada de rodadas; comprovação real de persistência. Nenhum desses pontos foi resolvido apenas pela revisão editorial.

Quando Wellyton voltar a estudar, avaliar clareza, aplicação, retorno com progresso salvo, conquistas, revisões e Chefe. Não solicitar esse acesso agora nem alegar aprovação em sua ausência.
