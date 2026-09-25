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


## Implementação Fase 1 — V1

Branch:
`feat/missao-bancaria-fase1-mvp`

Registro:
`17-FASE-1-IMPLEMENTACAO-V1.md`

Estado:
**primeira fatia vertical implementada em branch; CI e homologação humana pendentes.**

Conteúdo inicial:
- SFN;
- CMN;
- Banco Central;
- Copom;
- 12 questões autorais.

A Fase 1 permanece aberta.


## Diagnóstico de publicação do Worker — 25/09/2026

Na primeira homologação real de `/estudos/`, o frontend foi publicado, mas a API respondeu **"Rota não encontrada"**.

Evidência:
- `/estudos/` carregou a interface da V1;
- `main` contém `worker/studies.js` e o roteamento `isStudiesApi`;
- comentários automáticos do Cloudflare nas PRs #490/#491 mostraram **Build: Failed** para o Worker;
- o projeto ainda fixava Wrangler `4.133.0`, abaixo do mínimo `4.135.0` exigido pelo mecanismo atual de Worker Previews.

Correção em andamento:
`fix/worker-cloudflare-preview-compat`

A Fase 1 permanece aberta; nenhum progresso de estudo foi perdido.


## Recuperação do deploy seguro do Worker

O frontend da Missão Bancária está publicado, porém a API de produção continuou retornando `Rota não encontrada`.

Diagnóstico adicional:
- o Worker conectado ao GitHub ainda usa o modelo legado de previews do Cloudflare;
- esse modelo pode deixar versões mais novas sem tráfego;
- o gate produtivo rejeita por padrão qualquer versão mais nova que não seja produção/candidata conhecida;
- isso pode impedir a `main` de publicar `/api/studies/*` mesmo com todos os testes do código aprovados.

Correção em andamento:
`fix/worker-safe-deploy-equivalent-version`

Regra: versão não produtiva só é ignorada se **todos** os bindings forem equivalentes à produção. Nenhuma versão desconhecida é promovida.
