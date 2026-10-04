# Organização textual — preparo técnico desativado

04/10/2026. [Lote 95](95-PT-LOTE-REVISAO-E-CHEFE.md): quatro aulas, revisão e Chefe; **52 questões/208 justificativas**, seis grupos do Chefe com dois itens cada. Ensino, 16 seções de exemplos e recuperação por item. **Parecer pedagógico independente pendente**; preparo técnico não o substitui nem autoriza publicação.

## Adaptação mínima

`worker/scripts/studies-pt-candidate.mjs` reutiliza o compilador de apresentação e o pipeline LP, gerando `portuguese-text-v1.js`. Seis missões `publication.status:'draft'`, `parametersApproved:false`, ordens propostas 80–85, após Chefe LP. Sequência por conclusão anterior, 100 XP/aula/revisão e Chefe 220 XP/75% somente propostos; sem nova conquista ou arquitetura. A dependência anterior IS→LP continua uma escolha a resolver antes da ativação de Português comum aos perfis BB/CAIXA, conforme [93](93-LP-PREPARACAO-TECNICA.md).

Manifesto e bloco `portuguese.text` ligam somente o resultado do filtro de publicação. Os cinco links do Chefe foram convertidos em consultas às quatro aulas/revisão; nenhum corpo editorial, alternativa, gabarito ou justificativa foi alterado pelo preparo. Proveniência `project-authored` registra autoria local e locator, com URL somente do projeto e `remoteArtifactAvailable:false`; não inventa fonte normativa nem relaxa o contrato existente.

## Evidências executadas

- PT-02/03/04/R/Chefe: conferência final de esquema, quatro objetivos, gabaritos/quatro justificativas, origem, recuperação, UTF-8, Markdown e links. PT-01 validado anteriormente; não refeita sua revisão. As primeiras renderizações apontaram links aos Markdown que ainda seriam gerados; após gerar as cinco unidades, todas passaram sem render. Confirmados 52 IDs e enunciados únicos, explicação igual à justificativa correta, oito itens por aula/revisão e 12 no Chefe. A/B/C/D equilibrados em 2/2/2/2 ou 3/3/3/3; equilíbrio não prova qualidade pedagógica.
- **Nove testes PT**, incluindo **seis cenários de roteador real/SQLite em memória**: manifesto/mapa real excluem drafts; projeção futura valida ensino e prontidão não medida; 401/403/origem negados antes da persistência; draft inacessível; sequência proposta; feedback só após resposta; duplicação e retomada; preservação integral de tabelas `study_*`, progresso, XP, tentativas, conquista SFN, revisões, avaliação A e sessão interrompida em SFN/MP/PC/CE/DP/IS/LP; recuperação externa; Chefe 8/12 rejeitado, 9/12 aceito e XP único, sem conquista SFN nova.
- **Seis Chromium PT**: cinco consultas com fonte ampliada em 320 px claro/390 px escuro, sem overflow; escolha preservada após consulta; falha de rede/retry com registro único; resposta pendente durante consulta, saída e retomada; questão respondida retomada sem nova sessão; outro usuário bloqueado. 6/6 em 9,6 s, rota totalmente interceptada, sem API real.
- Artefato gerado conferido, sintaxe e diff. Catálogo e fontes anteriores serializados idênticos: **50 missões/374 questões/quatro blocos reais**. As 85 missões/oito blocos da projeção incluem DP/IS/LP/PT somente na memória das fixtures; não são disponibilidade do produto.

Comandos direcionados: `node --test worker/tests/studies-pt-candidate.test.mjs`; `node worker/scripts/studies-pt-candidate.mjs --check-generated`; somente `studies-pt.spec.mjs` com `studies-reader.config.mjs`. Evidências LP/IS/DP/CE inalteradas reaproveitadas; sem suíte geral, produção/D1 ou histórico real do aluno. Fixtures não são homologação autenticada, medição de retenção ou aceite humano.

## Integração futura e próximo passo

LP/PT permanecem **locais**, sem push/PR, ativação, merge ou deploy autorizados. IS #600 remoto `709901d7cca28684e7b2b5cac9292e3c667dfb31` baseia-se em DP #572/d4867b80; estes lotes locais derivam dessa cadeia e não da main atual. Antes de integração, reconciliar os commits concorrentes e os contratos de fixtures preparados em #598/2e600517. #600 terminal 25/27 verdes; global procura `worker/ai-resilience.js` ausente na base, preview Worker também falho. Não foi alterada IA clínica, dispensado gate ou reaberto diagnóstico preview.

Próximo passo: parecer independente agrupado de PT-01–04/R/Chefe e correções exclusivamente dos achados; manter candidatos desativados. Continuidade local do currículo não equivale a cobertura integral de texto nem abertura de fase. Fase 2 permanece sem aceite humano pedagógico observado.
