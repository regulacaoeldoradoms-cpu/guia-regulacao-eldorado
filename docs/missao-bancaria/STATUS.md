# MISSÃO BANCÁRIA — STATUS

Atualizado em: 25/09/2026

## Estado

**Fase ativa: Fase 1 — Motor MVP + primeiro recorte real de Sistema Financeiro Nacional.**

A documentação-base foi incorporada à `main` pela PR #488 no commit:
`abb7d7e5f7b747abab62f4df4ed8a2cb636b92ec`.

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

## Fase 1

**AUTORIZADA E ABERTA.**

Próximo trabalho:
- reler integralmente `02-FASE-1-MOTOR-MVP.md`;
- conferir novamente o estado real do código após o merge desta documentação;
- congelar as fontes oficiais do primeiro recorte de SFN;
- implementar a primeira fatia vertical jogável em branch própria;
- não publicar em produção sem testes e homologação previstos.
