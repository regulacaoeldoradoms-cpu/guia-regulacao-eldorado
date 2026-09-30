# MISSÃO BANCÁRIA — FASE 2 — RECORTE C4
## Publicação incremental e preservação de histórico

Data: 29/09/2026.  
Fase ativa: Fase 2.  
Dependência: Recorte C3.

## Objetivo

Cumprir o requisito estrutural de publicar novas missões sem alterar lógica específica do motor e sem apagar ou diluir o progresso anterior.

## Registro declarativo

Arquivo:
- `worker/studies-content/publication-registry.js`.

Cada missão pode declarar:

### status
- `draft` — permanece fora do catálogo publicado;
- `published` — pode ser entregue pelo manifesto.

### releaseId
Identificador estável da release editorial/técnica que publicou a missão.

### releaseSequence
Inteiro crescente usado para distinguir a baseline de releases posteriores.

### changeImpact
- `baseline` — conteúdo já existente na adoção do protocolo;
- `new` — missão nova;
- `editorial` — correção/clareza sem exigir refazer o conteúdo;
- `conceptual` — mudança relevante que recomenda nova revisão quando o usuário já viu versão anterior.

Metadados inválidos são erro de validação e também falham fechado na composição de `publishedCatalog()`; não são silenciosamente corrigidos para um estado publicável nem dependem apenas do CI para serem bloqueados.

## Baseline

As nove missões atuais não precisam ser reescritas.

Quando não existe metadado explícito, o registro atribui:
- `status=published`;
- `releaseId=sfn-foundation-r1`;
- `releaseSequence=1`;
- `changeImpact=baseline`.

Isso impede que a implantação do protocolo marque retroativamente todas as aulas antigas como “novas”.

## Catálogo publicado

O manifesto passa pela composição genérica:
1. ensino;
2. atividades declarativas;
3. publicação declarativa.

`publishedCatalog()` filtra apenas itens `published`.

Adicionar uma missão futura exige dados/conteúdo e seus metadados de publicação; não exige uma função específica no manifesto.

## Conteúdo novo

`publicationSnapshot()` marca como nova uma missão quando:
- está publicada;
- possui `releaseSequence` posterior à baseline;
- possui impacto `new`;
- ainda não foi iniciada.

Uma missão continua marcada como nova até produzir evidência de início (`coverageState`, `startedAt` ou `contentVersionSeen`).

## Correções de conteúdo

### Editorial
Mesmo com nova versão de conteúdo:
- não gera recomendação automática de refazer;
- preserva conclusão, XP, tentativas e revisões.

### Conceitual
Se:
- o usuário já viu uma versão anterior; e
- a versão atual é maior;

então a missão aparece em `revisionRecommendedIds`.

A recomendação não apaga conclusão e não reduz cobertura.

## Bootstrap

Novo protocolo:
- `publicationProtocol: 1`.

Objeto:
- `publication.baselineReleaseSequence`;
- `publication.currentRelease`;
- `publication.currentReleaseSequence`;
- `publication.newCount`;
- `publication.newMissionIds`;
- `publication.revisionRecommendedCount`;
- `publication.revisionRecommendedIds`.

O campo legado `contentRelease: sfn-v1.2` permanece intacto.

## Interface

O painel do bloco passa a mostrar:
- novas missões disponíveis;
- revisões conceituais recomendadas;
- ou “Nenhum conteúdo novo ou revisão conceitual pendente.”

Com Worker antigo, o aviso permanece oculto.

## Preservação

Nenhuma nova tabela é criada.

O recorte não modifica:
- XP;
- tentativas;
- conclusões;
- cobertura;
- revisões;
- conquistas;
- avaliação independente;
- prontidão.

## Prova do critério estrutural

Teste sintético:
1. publica três missões estruturalmente diferentes pelo mesmo registro;
2. registra progresso nas três;
3. adiciona quarta missão com `releaseSequence=2`;
4. a quarta aparece em `newMissionIds`;
5. o progresso original é comparado integralmente antes/depois e permanece igual;
6. uma quinta missão em `draft` permanece fora do catálogo;
7. mudança editorial não pede revisão;
8. mudança conceitual de versão já vista pede revisão;
9. metadado explícito inválido faz `publishedCatalog()` falhar fechado em runtime.

## Próximo passo

Depois de integrar/publicar C1–C4:
- consolidar evidências dos critérios da Fase 2;
- testar publicação/compatibilidade do frontend e Worker;
- registrar pendências humanas reais;
- solicitar aceite explícito somente quando o critério da fase estiver demonstrado.
