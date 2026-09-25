# MISSÃO BANCÁRIA — STATUS

Atualizado em: 25/09/2026

## Estado

**Fase ativa: Fase 0 — Governança, isolamento e arquitetura.**

A documentação-base foi incorporada à `main` pela PR #488 no commit:
`abb7d7e5f7b747abab62f4df4ed8a2cb636b92ec`.

## Trabalho atual

Plano técnico da Fase 0 elaborado na branch:
`docs/missao-bancaria-fase0-arquitetura`

Documento:
`15-FASE-0-PLANO-TECNICO.md`

## Decisões técnicas propostas para homologação

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

## Pendência humana

A Fase 0 **não está encerrada**.

Falta homologação explícita de Wellyton sobre o plano técnico V1.

Depois do aceite:
- registrar encerramento da Fase 0;
- abrir Fase 1;
- construir a primeira fatia jogável com conteúdo real de SFN.
