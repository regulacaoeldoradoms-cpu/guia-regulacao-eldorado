# MISSÃO BANCÁRIA — STATUS

Atualizado em: 26/09/2026

## Estado

**Fase ativa: Fase 1 — Motor MVP + primeiro recorte real de Sistema Financeiro Nacional.**

A documentação-base foi incorporada à `main` pela PR #488.

## Fase 0

**APROVADA E ENCERRADA em 25/09/2026 por aceite explícito de Wellyton.**

Plano técnico aprovado:
`15-FASE-0-PLANO-TECNICO.md`

## Decisões técnicas homologadas

- frontend em `/estudos/`;
- APIs em `/api/studies/*`;
- acesso inicial exclusivamente para `wellyton`;
- sem nova função profissional;
- D1 `AUTH_DB` com tabelas `study_*` isoladas;
- conteúdo pedagógico versionado no repositório;
- estado/progresso no D1;
- IDs estáveis;
- integração com `/conquistas/`;
- Bronze/Prata/Ouro preservados;
- sem telemetria pedagógica externa;
- rollback sem apagar tabelas/progresso.

## Fase 1 — V1

Implementação inicial incorporada à `main` pela PR #490:

`22257bca768cfc440578e0b8e11da62f15abc08f`

Conteúdo inicial:
- SFN;
- CMN;
- Banco Central;
- Copom;
- 12 questões autorais.

Recursos:
- dashboard;
- XP e nível;
- horas líquidas;
- modo foco;
- cronômetro;
- tentativas persistidas;
- revisão agendada;
- conquista `study.first_mission`;
- integração com `/conquistas/`.

## Incidente de publicação inicial

Na primeira abertura real, o frontend de `/estudos/` foi publicado, mas o Worker ainda respondeu **"Rota não encontrada"**.

Correções incorporadas:
- PR #492 — compatibilidade do Wrangler/gate com o pipeline atual;
- PR #494 — recuperação fail-closed do deploy diante de versão não produtiva, permitindo continuidade apenas quando a configuração for integralmente equivalente à produção.

Commit da recuperação:
`90cc6d8e16039bb7ed1482bec3f75feadb860816`

A PR #493 (`previews = { }`) foi fechada **sem merge**, pois não resolvia isoladamente o modelo legado de previews conectado ao Worker.

## Homologação humana

Wellyton já acessou a interface real da Missão Bancária e autorizou a continuidade do desenvolvimento.

Ainda falta registrar, antes de encerrar a Fase 1:
- conclusão de missão real ponta a ponta;
- persistência confirmada após sair e voltar;
- conquista confirmada em `/conquistas/`;
- expansão aplicada sem perda de progresso.

## Expansão SFN V1.1

Branch atual:
`feat/missao-bancaria-fase1-expansao-sfn-v2`

Documento:
`18-EXPANSAO-SFN-V1.1.md`

Escopo:
- Missão 5 — CVM;
- Missão 6 — Operadores do SFN;
- 6 novas questões autorais;
- fontes oficiais atuais;
- Mundo 1 fixado em 9 missões;
- progresso conquistado calculado sobre o escopo fixo;
- teste que prova que a publicação de novas missões não reduz o progresso já conquistado.

A Fase 1 permanece **ABERTA**.


## Revisão espaçada V1

Documento:
`19-FASE-1-REVISAO-ESPACADA-V1.md`

Estado:
**implementada na branch da expansão; homologação humana pendente.**

Entregue:
- revisões vencidas visíveis no dashboard;
- reutilização do modo foco;
- exigência de nova prática após o vencimento;
- conclusão persistida;
- +20 XP idempotente por revisão;
- ciclos já agendados em 1/7/30 dias.

A Fase 1 continua aberta.


## Fechamento do Mundo 1 — SFN

Documento:
`20-FECHAMENTO-MUNDO1-SFN.md`

Estado:
**incorporado à `main` pela PR #498, merge `20487883c948dffbeb4b6849baa3c39e9c577d9f`; homologação humana pendente.**

Entregue:
- Missão 7 — Seguros, previdência e capitalização;
- Missão 8 — Pagamentos, Pix e consórcios;
- Missão 9 — Chefe do SFN;
- 20 novas questões autorais (4 + 4 + 12);
- 9/9 missões do Mundo 1 publicáveis;
- Chefe com nota mínima de 75%;
- pontuação restrita à rodada atual;
- conquista `study.sfn.boss` — SFN dominado;
- fontes oficiais SUSEP, PREVIC e Banco Central registradas.

A Fase 1 permanece **ABERTA** até homologação humana.


## Retomada parcial de missão

Branch atual:
`feat/missao-bancaria-fase1-retomar-missao-v2`

PR atual:
**#499**

Documento:
`21-FASE-1-RETOMADA-PARCIAL.md`

Estado:
**implementada; homologação humana pendente.**

Entregue:
- reconhecimento de questões respondidas em sessões anteriores;
- continuação sem necessidade de refazer toda a aula;
- opção de responder novamente;
- nenhum gabarito no bootstrap;
- revisões e Chefe excluídos do reaproveitamento histórico;
- cache do cliente atualizado.

A Fase 1 permanece **ABERTA**.


## Correção de Conquistas

Incluída na PR #499:
- corrige a interpolação do SVG no estado sem medalhas;
- atualiza o cache de `achievements.js`;
- preserva Bronze/Prata/Ouro;
- adiciona teste para impedir retorno do placeholder literal `${bookIcon}`.

A Fase 1 permanece **ABERTA**.


## Sequência de estudo V1

Documento:
`22-FASE-1-SEQUENCIA-ESTUDO-V1.md`

Estado:
**implementada em branch; homologação pendente.**

Entregue:
- sequência atual;
- melhor sequência histórica;
- dias locais em `America/Campo_Grande`;
- atividade real por questão, sessão >= 60s ou evento pedagógico;
- abertura simples da página não conta;
- sequência não concede XP nem pune ausência.

Com esta entrega, o dashboard mínimo documentado da Fase 1 fica tecnicamente completo.

A Fase 1 permanece **ABERTA** até homologação humana.
