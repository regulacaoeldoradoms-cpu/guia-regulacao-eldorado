# Pagamentos Digitais — preparação desativada

03/10/2026. [Lote editorial](85-DP-CONJUNTO-RASCUNHOS.md) e [Chefe](86-DP-REVISAO-E-PROPOSTA-CHEFE.md): 12 aulas, revisão e Chefe; 116 questões/464 justificativas. Leitura pedagógica agrupada pelo agente concluída, com correções documentadas em 85; parecer independente ainda pendente.

O gerador [studies-dp-candidate.mjs](../../worker/scripts/studies-dp-candidate.mjs) reutiliza o padrão MP/PC/CE e o conversor de apresentação existente. O artefato [banking-digital-payments-v1.js](../../worker/studies-content/banking-digital-payments-v1.js) contém 14 missões **draft**, não importadas pelo manifesto ativo. `parametersApproved` e `publicationReady` permanecem falsos. Não há opção CLI de ativação.

Proposta preservada: começar após Chefe CE, ordens 51–64 e dependência da unidade anterior; 100 XP/aula/revisão e Chefe 220 XP/75%. IDs `banking.dp.*`, questões `q.dp*`, fontes prefixadas por unidade; recuperação e links do Chefe são convertidos para missões/seções existentes. Valores são preparação, sem alteração do histórico ou parâmetros publicados.

## Evidência proporcional

- Chefe: validador editorial aprovado em 03/10; 12 enunciados, 48 justificativas, seis cálculos, seis grupos e origens nas doze aulas. MD gerado, UTF-8 e links conferidos. Resultados do lote de 01/10 reaproveitados; não repetidos.
- `node --test worker/tests/studies-dp-candidate.test.mjs`: sete testes aprovados. Comparam artefato/textos com a fonte editorial, preservação de catálogo/fontes e exclusão dos drafts; verificam sequência, enunciados próprios e recuperação; rejeitam pacote incompleto/duplicado/ativado, fonte desconhecida, seção inexistente e referência futura.
- `node worker/scripts/studies-dp-candidate.mjs --check-generated`: artefato conferido. Detector textual de isolamento aprovado; nenhum ajuste ao detector ou workflow. Nenhuma suíte geral, API real ou D1 usada nesta preparação.
- O detector identificou seis usos genéricos de “encaminhamento” no novo material de crédito. DP-10, DP-R e uma justificativa do Chefe passaram a identificar “envio da proposta”, com o mesmo sentido, IDs e gabaritos. Somente esses três artefatos foram regenerados e validados novamente; candidato/testes/isolamento passaram após a alteração. Nenhuma exceção foi acrescentada ao detector.

O catálogo ativo continua com SFN/MP/PC/CE. Preparação offline não é homologação da UI nem publicação. Chromium e fluxos de roteador realmente afetados serão verificados na integração, após revisão e autorização aplicável; resultados inalterados de MP/PC/CE continuam válidos.

## Gates restantes

Parecer pedagógico independente do lote/Chefe (leitura pelo agente já concluída); revalidação oficial do estágio Drex antes de ativação; integração técnica final com testes afetados e CI requerida; autorização específica de merge/deploy e fluxo protegido. Marketplace/segmentação são recortes nominais BB; PC-07 continua excluído. Fase 2 sem aceite humano observado.

## Estado de CI e limite de escopo

No SHA-base da revisão **5475aec8**, os 23 checks terminaram: **21 verdes**, incluindo estudos, Chromium sintético e Pages; dois falharam. A atualização editorial requer CI própria; os resultados anteriores não são aprovação antecipada do novo commit.

- [Pré-regulação, job 111260834034](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/actions/runs/37142901222/job/111260834034): 731 testes Worker passaram. O job testa a árvore combinada **91eef0bdc059e39ff07d35a0381ed7cd27603cbf**, unindo DP 5475aec8 à main **6c4fcd86198103ad6e1e8adc07901219c7957c92**. Falha no passo “Conferir Worker nativo atualizado”: primeira exigência ausente nessa base é `GEMINI_TOTAL_TIMEOUT_MS` em `worker/index.js`, depois de alterações concorrentes da IA. O checkout DP isolado contém a expressão; não reproduz essa falha. Conferidos pontualmente log e três arquivos do passo no SHA da base, sem repetir suíte ou alterar IA/clínica. A conclusão anterior sobre versão de script ausente foi descartada: o helper confundia regex JS e grep BRE; o script está presente e o passo dele passou. Alinhar o gate ao cancelamento da integração Gemini requer responsável/escopo autorizado separado; não restaurar funcionalidade cancelada para satisfazer grep. Nenhum módulo ou gate foi alterado. Não se afirma que corrigir esta primeira exigência fará todas as restantes passarem.
- Preview Worker legado falho: problema externo já registrado, separado do deploy produtivo protegido; este pacote não muda comando, nome, bindings ou acesso. Não representa prova de incidente produtivo.

A publicação DP ainda exige autorização específica para ativação após Chefe CE (100 XP/aula/revisão, Chefe 220 XP/75%), integração do #572 e deploy protegido, após concluir UI/roteador, fontes mutáveis e gates. Não há exceção de CI implícita.
