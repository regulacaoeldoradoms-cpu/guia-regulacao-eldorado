# Pagamentos digitais — lote para revisão pedagógica

01/10/2026. Continuidade do [plano 84](84-DP-PLANO-E-PRIMEIRA-UNIDADE.md), dentro de `banking.digital-payments`. Doze aulas e uma revisão cumulativa, todas `draft` fora do catálogo. O Chefe redigido em 03/10 está no [documento 86](86-DP-REVISAO-E-PROPOSTA-CHEFE.md). Fase 2 sem aceite humano observado; a autoria não abre formalmente outra fase.

## Sequência e origem

BB significa Atualidades do Mercado Financeiro do edital histórico 2022/001; CAIXA significa Conhecimentos Bancários do edital histórico 2024/NM. Ambos continuam `referenceOnly`. A sequência organiza recortes já definidos, sem novo edital ou disciplina.

| Unidade / fonte editorial | Competência | BB | CAIXA | Pré-requisito conceitual |
| --- | --- | --- | --- | --- |
| [DP-01](rascunhos/dp-01-v1.md) | Canal, operação e instituição | 2/3 | 5/6 | PC-01; SFN |
| [DP-02](rascunhos/dp-02-v1.md) | Canal, processo e modelo | 1/5/15 | 4/7/15 | DP-01 |
| [DP-03](rascunhos/dp-03-v1.md) | Fintech, startup e bigtech | 6 | 8 | DP-02 |
| [DP-04](rascunhos/dp-04-v1.md) | Shadow banking, liquidez e alavancagem | 7 | 9 | DP-03; PC/CE: ativos e dívida |
| [DP-05](rascunhos/dp-05-v1.md) | SPB, arranjos e participantes | 12 | 38 | DP-01; SFN |
| [DP-06](rascunhos/dp-06-v1.md) | Pix, conta e confirmação | 13 | 12 | DP-05 |
| [DP-07](rascunhos/dp-07-v1.md) | Open Banking/Open Finance | 4 | 13 | DP-01/06 |
| [DP-08](rascunhos/dp-08-v1.md) | Blockchain e natureza do ativo | 9 | 10 | MP: moeda; CE: valores mobiliários |
| [DP-09](rascunhos/dp-09-v1.md) | CBDC/Drex e limites da proposta | 9, sem Drex nominal | 14 | DP-06/08 |
| [DP-10](rascunhos/dp-10-v1.md) | Correspondente e contratante | 11 | 11 | DP-01/02; PC: crédito |
| [DP-11](rascunhos/dp-11-v1.md) | Marketplace, papéis e total | 10 | Sem item nominal | DP-02/03/05 |
| [DP-12](rascunhos/dp-12-v1.md) | Segmentação e interação digital | 14 | Sem item nominal | DP-01/02/07 |
| [DP-R](rascunhos/dp-r-v1.md) | Integração e recuperação | Recortes acima | Recortes acima, ressalvadas DP-11/12 | DP-01–12 |

Cada unidade contém ensino iniciante, quatro exemplos resolvidos, glossário, síntese, oito questões, quatro justificativas por questão e retomada por seção. O lote totaliza **104 questões e 416 justificativas**, com **52 exemplos**. As oito questões de DP-R têm origens explícitas que, em conjunto, alcançam as doze aulas. São prática exposta, não avaliação independente ou simulado representativo do edital.

## Fontes e limites verificados na autoria

- BCB: SPB, arranjos, Pix e Open Finance consultados em 01/10/2026; fundamentos, sem limites/tarifas ou manual operacional. Contas em DP-01 preservam consultas de 30/09; canais CAIXA e definição de fintechs já verificados foram reaproveitados.
- LC 182/2021, art. 4º: conceito de startup e necessidade de requisitos; sem copiar limites numéricos. BIS 2019: somente conceitos de bigtech/plataforma/rede, sem estatísticas ou classificação atual de empresas.
- FSB: NBFI e recorte por riscos; não confundir “não bancário” com ilegal ou totalmente desregulado. Caso autoral de alavancagem informa todos os valores e hipóteses.
- NIST IR 8202 (2018): registro, consenso e redes permissionadas; Lei 14.478, arts. 1º/3º: distinções e exclusões. Sem regime atual de autorização de prestadoras ou recomendação financeira.
- **Drex:** página geral e duas FAQs lidas em 01/10/2026. As FAQs exibem atualizações de 2023/2024; a de lançamento mantém ausência de data específica. Aula não anuncia disponibilidade ou arquitetura definitiva. **Revalidar estágio antes de publicar**, sem converter a FAQ antiga em confirmação de todas as etapas atuais.
- Resolução CMN 4.935: versão vigente exibida, atualizada em 01/12/2025; usados arts. 2º/3º/12/14. Art. 8º revogado não utilizado. LGPD arts. 6º/7º: limites ao uso de dados, sem novo curso jurídico ou dados reais.

As referências exatas, localizadores e datas estão nos artefatos e nas versões legíveis. Exemplos, questões e cálculos são autorais fictícios. DP-11/12 mantêm identificação de recorte nominal BB.

## Verificação e revisão

Resultado local em Node 24: **13 unidades aprovadas, 132 trechos, 52 exemplos, 104 questões, 416 justificativas e 7 cálculos conferidos**. Fontes/objetivos/âncoras/origens/UTF-8 e MD gerado verificados; os rascunhos são excluídos do catálogo publicado em todas as execuções. Detector de isolamento e diff sem erros.

O validador editorial existente foi estendido somente para os rascunhos DP: oito itens/unidade, fontes delimitadas, objetivos, recuperação, origens de DP-R e sincronia MD/MJS. O detector de isolamento e os workflows não foram alterados. DP-01/02 receberam glossário e passaram ao mesmo renderizador; textos anteriores, opções, gabaritos e justificativas foram preservados.

Comando por unidade: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=dp03 --render` (substituir por `dp01`–`dp12` ou `dpr`). As verificações estruturais e aritméticas não substituem leitura pedagógica. **Leitura pedagógica agrupada pelo agente concluída em 03/10**, incluindo as doze aulas, DP-R e os doze itens do Chefe; não é parecer independente nem aceite humano; preparação desativada em [87](87-DP-PREPARACAO-TECNICA.md).

### Correções da revisão agrupada de 03/10

Leitura de todos os enunciados e justificativas no pacote-base **5475aec87e58e0da808bf36ab02cbd2dd8bef884**. Não foram encontrados outros bloqueios pedagógicos no recorte introdutório. Revisão feita pelo agente responsável pelas correções, sem novo revisor externo; um único parecer independente do diff alterado foi aprovado em dd4b33cd, sem correções adicionais. Ele não reaudita as 116 questões.

| Unidade | Correção e motivo |
| --- | --- |
| DP-01 | Retomada aponta às cinco perguntas da própria aula; removida atribuição conceitual incorreta a CE-05. |
| DP-03 | Questão 6 usa caso concreto: aplicativo sozinho não comprova enquadramento legal. Analisar requisitos já não aparece como se fosse comprová-los. Glossário define fintech como empresa. |
| DP-04 | Exemplo e questão 1 explicitam subscrição de nova emissão no mercado primário, entregando recursos às emissoras; compra secundária não era prova de financiamento direto. |
| DP-05 | Liquidação descrita como cumprimento das obrigações de pagamento por transferência de recursos; removida expressão que sugeria transferência de obrigações. |
| DP-06 | Exemplo e questão 2 informam envio e débito do Pix; recebimento já não pode sustentar a alternativa de R$230. |
| DP-07 | Acrescentada fonte expressa LGPD arts. 16, I, e 18, VI/IX para a conservação legal após cancelamento; conclusão didática preservada. |

IDs, posições dos gabaritos, objetivos e valores dos cálculos preservados. Os doze itens do Chefe não exigiram mudança de texto; sua lista de fontes incorporou as novas bases do ensino. Fontes primárias verificadas pontualmente em 03/10: [LC 182, art. 4º](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp182.htm), [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) e [CPSS-IOSCO 2012, princípio 8, §3.8.1](https://www.bis.org/publications/principles-financial-market-infrastructures.pdf). Sem nova auditoria normativa geral ou mudança sobre o estágio do Drex.

Somente DP-01/03/04/05/06/07 e Chefe foram regenerados e validados: sincronia MD/MJS, fontes, cobertura, retomada, UTF-8 e cálculos existentes passaram. Candidato regenerado (14 drafts/116 questões/464 justificativas/58 referências por unidade), sete testes offline e detector de isolamento passaram. Validadores das unidades inalteradas de 01/10 reaproveitados.

Nenhuma alteração de runtime, autorização, dados, progresso ou catálogo ativo. Não há XP, ordem ou liberação efetiva nestes artefatos. Não foram executados testes contra produção/D1 nem repetidas suítes MP/PC/CE por esta autoria.

Parecer complementar do mesmo revisor: precisão temporal de DP-09 aprovada após reconsulta das três páginas BCB em 03/10. Datas exibidas de 2023/2024 mantidas; confirmação restrita ao teor das páginas, sem atestar todas as etapas atuais. Nenhuma questão ou gabarito alterado nessa revalidação. Evidência técnica atual em [87](87-DP-PREPARACAO-TECNICA.md).
