# Capitais e Câmbio — plano introdutório e primeira unidade

01/10/2026. Decomposição pedagógica de `banking.capital-exchange`, já existente nos dois perfis `referenceOnly`. Autoria em rascunho, fora do catálogo; Fase 2 sem aceite humano observado, Fase 3 não aberta. O checkpoint de publicação PC está no [#569 draft](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/pull/569), não integrado à main.

## Escopo rastreado

Referências históricas: [BB 2022/001](https://www.bb.com.br/docs/portal/dipes/EditalSelExtern2022001.pdf#page=34), Anexo III, Agente Comercial, Conhecimentos Bancários, p. 34; [CAIXA 2024/NM](https://www.caixa.gov.br/Downloads/concurso-publico-editais/EDITAL_N_01_2024_NM_DE_22_DE_FEVEREIRO_DE_2024_.pdf#page=33), Anexo IV, TBN geral, pp. 33–34. BB conferido textualmente em 01/10/2026, versão com alterações de janeiro/fevereiro de 2023. CAIXA reutiliza a extração/inspeção oficial de 30/09/2026: versão com alteração de 27/02/2024, SHA-256 `6ef6262ce9f0f8a1db5225d288251b1c3f3761fc8ae368f3d6c77b57ae50014b`; navegador atual continuou com redirecionamento. Evidência anterior no [documento 65 em 400d4854](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria/65-RASTREABILIDADE-BANCARIOS-REFERENCIAS.md), sem integrar #559.

Os vínculos abaixo são recortes editoriais de itens amplos, não novos subitens oficiais ou certificação de cobertura. Núcleo comum resolvido pelos perfis; nenhum tema adicional de TI, programas CAIXA, PC-07, derivativos avançados, criptoativos ou planejamento tributário. Leis/regras operacionais serão verificadas nas fontes primárias ao redigir a unidade pertinente; não transportar uma norma antiga do edital como vigente.

## Sequência de aulas curtas

| Unidade | Competência e limite | Base didática | BB / CAIXA |
| --- | --- | --- | --- |
| CE-01 — Emissão, revenda e destino dos recursos | Identificar emissor/investidor, participação/dívida e distinguir emissão nova de revenda | SFN/CVM; MP-01; PC-02 | 6 / 20 |
| CE-02 — Ações e participação | Distinguir participação, preço, retorno e direitos básicos; sem valuation ou tributação | CE-01 | 5 (investimentos), 6 / 19 (investimentos), 20 |
| CE-03 — Títulos de dívida e emissor | Comparar debênture simples e título bancário introdutório; ler vencimento/remuneração sem prometer pagamento | CE-01/02; MP-03; PC-02/04 | 5 (investimentos), 6 / 19 (investimentos), 20 |
| CE-04 — Fundos e cotas | Relacionar cota/carteira, papéis e condições de movimentação; sem catálogo exaustivo de classes | CE-01–03 | 5 (investimentos), 6 / 19 (investimentos), 20 |
| CE-05 — Risco, liquidez e rentabilidade | Separar crédito/mercado/liquidez e retorno bruto/líquido sob custos dados; diversificação sem garantia | CE-02–04; PC-04 | 5 (investimentos), 6 / 19 (investimentos), 20 |
| CE-06 — Moedas, cotação e conversão | Ler unidade R$/moeda, compra/venda pela perspectiva declarada; multiplicar/dividir em caso simples | MP-01/câmbio; MP-03 | 7, 9 (nominal) / 21, 23 (nominal) |
| CE-07 — Participantes e operações de câmbio | Distinguir cliente, instituição autorizada e finalidade; localizar regras, sem decorar limites não verificados | CE-06; SFN/BCB | 7 / 21 |
| CE-08 — Regimes cambiais | Comparar fixo, flutuante e intermediário; intervenção não basta para classificar regime | CE-06/07; MP/política monetária | 8 / 22 |
| CE-09 — Câmbio nominal e real | Separar preço entre moedas e ajuste por preços; ensinar razão/índice antes de cálculo | CE-06/08; MP-03/inflação | 9 / 23 |
| CE-10 — Exportação e importação | Raciocinar sobre receitas/custos sob moeda e preços declarados; separar efeito parcial de resultado garantido | CE-06/09 | 10 / 24 |
| CE-11 — Juros, risco e fluxos de capitais | Explicar incentivos condicionais e expectativas; não prever cotação só pelo diferencial de juros | CE-05/08–10; MP/juros | 11 / 25 |
| CE-R — Revisão com recuperação | Reconstruir casos e retomar as seções que ensinam cada erro | CE-01–11 | Mesmos recortes, sem cobertura nova |
| Chefe CE — proposta | 12 itens próprios em seis grupos: instrumentos/fluxos; fundos/riscos; conversão/operação; regimes; nominal-real/comércio; juros/fluxos | CE-R e aulas de origem | Mesmos recortes; prática exposta, não avaliação independente |

Cada aula terá ensino iniciante, vocabulário, exemplos resolvidos, oito questões com quatro justificativas e recuperação por seção. Divisões internas podem ser refinadas para manter leitura curta, sem ampliar os itens. A revisão e o Chefe só cobrarão ensino efetivamente escrito/revisado. A ordem da tabela é pedagógica: **não define XP, desbloqueio ou publicação**. Reutilizar arquitetura e dados existentes quando houver preparação técnica autorizada.

## CE-01 entregue como rascunho

[Leitura](rascunhos/ce-01-v1.md) e [fonte estruturada](rascunhos/ce-01-v1.mjs): ensino de participação/dívida, emissão/revenda, destino do dinheiro, oferta mista simplificada e limite da intermediação. Objetivos O1–O5 cobertos pela prática; O6 orienta recuperação. Exemplos fictícios, sem aconselhamento pessoal. Fontes CVM consultadas em 01/10/2026, com localização e limites no artefato; não reaproveitar os trechos tributários ou procedimentos detalhados das páginas educativas para futuras aulas sem conferência normativa.

Verificação executada em 01/10/2026: `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=ce01 --render` passou: 12 trechos, quatro exemplos, oito questões/32 justificativas, seis objetivos, quatro fontes e 16 contas. Esquema, gabaritos, recuperação/âncoras, equivalência MD/MJS e exclusão pelo filtro de publicação aprovados. Sintaxe da unidade/validador e diff conferidos. O validador recebeu apenas CE-01/data/documento 80; execuções sem render em MP-01 e PC-01 confirmaram compatibilidade e previews antigos idênticos, sem alterar aulas aprovadas. Nenhuma suíte do aplicativo ou acesso D1/produção foi executado. Revisão independente de conteúdo ainda pendente.

CE-02–11 e CE-R foram redigidas e revisadas pedagogicamente no [lote 81](81-CE-CONJUNTO-RASCUNHOS.md), com [12 itens próprios do Chefe no documento 82](82-CE-REVISAO-E-PROPOSTA-CHEFE.md) e [preparo técnico desativado no documento 83](83-CE-PREPARACAO-TECNICA.md). Próxima ação: revisão independente do Chefe e decisão agrupada de publicação. Conservar SFN/MP/PC, progresso e exclusividade de `wellyton`; #569 continua draft e separado.
