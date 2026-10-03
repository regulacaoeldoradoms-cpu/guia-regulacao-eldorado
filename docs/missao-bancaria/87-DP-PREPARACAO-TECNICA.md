# Pagamentos Digitais — preparação desativada

03/10/2026. [Lote editorial](85-DP-CONJUNTO-RASCUNHOS.md) e [Chefe](86-DP-REVISAO-E-PROPOSTA-CHEFE.md): 12 aulas, revisão e Chefe; 116 questões/464 justificativas. Conteúdo ainda sujeito à revisão pedagógica independente.

O gerador [studies-dp-candidate.mjs](../../worker/scripts/studies-dp-candidate.mjs) reutiliza o padrão MP/PC/CE e o conversor de apresentação existente. O artefato [banking-digital-payments-v1.js](../../worker/studies-content/banking-digital-payments-v1.js) contém 14 missões **draft**, não importadas pelo manifesto ativo. `parametersApproved` e `publicationReady` permanecem falsos. Não há opção CLI de ativação.

Proposta preservada: começar após Chefe CE, ordens 51–64 e dependência da unidade anterior; 100 XP/aula/revisão e Chefe 220 XP/75%. IDs `banking.dp.*`, questões `q.dp*`, fontes prefixadas por unidade; recuperação e links do Chefe são convertidos para missões/seções existentes. Valores são preparação, sem alteração do histórico ou parâmetros publicados.

## Evidência proporcional

- Chefe: validador editorial aprovado em 03/10; 12 enunciados, 48 justificativas, seis cálculos, seis grupos e origens nas doze aulas. MD gerado, UTF-8 e links conferidos. Resultados do lote de 01/10 reaproveitados; não repetidos.
- `node --test worker/tests/studies-dp-candidate.test.mjs`: sete testes aprovados. Comparam artefato/textos com a fonte editorial, preservação de catálogo/fontes e exclusão dos drafts; verificam sequência, enunciados próprios e recuperação; rejeitam pacote incompleto/duplicado/ativado, fonte desconhecida, seção inexistente e referência futura.
- `node worker/scripts/studies-dp-candidate.mjs --check-generated`: artefato conferido. Detector textual de isolamento aprovado; nenhum ajuste ao detector ou workflow. Nenhuma suíte geral, API real ou D1 usada nesta preparação.
- O detector identificou seis usos genéricos de “encaminhamento” no novo material de crédito. DP-10, DP-R e uma justificativa do Chefe passaram a identificar “envio da proposta”, com o mesmo sentido, IDs e gabaritos. Somente esses três artefatos foram regenerados e validados novamente; candidato/testes/isolamento passaram após a alteração. Nenhuma exceção foi acrescentada ao detector.

O catálogo ativo continua com SFN/MP/PC/CE. Preparação offline não é homologação da UI nem publicação. Chromium e fluxos de roteador realmente afetados serão verificados na integração, após revisão e autorização aplicável; resultados inalterados de MP/PC/CE continuam válidos.

## Gates restantes

Revisão pedagógica do lote/Chefe; revalidação oficial do estágio Drex antes de ativação; integração técnica final com testes afetados e CI requerida; autorização específica de merge/deploy e fluxo protegido. Marketplace/segmentação são recortes nominais BB; PC-07 continua excluído. Fase 2 sem aceite humano observado.
