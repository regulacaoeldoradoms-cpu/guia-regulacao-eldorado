# PC-04/05 — custos e finalidade do crédito

30/09/2026. Próximos recortes já previstos no [plano 66, #559](https://github.com/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/blob/400d48545710c1ec0b3a9628bd37813d065dac00/docs/missao-bancaria/66-ESPECIFICACAO-PROXIMOS-BLOCOS-BANCARIOS.md), sem integrar esse PR. Rascunhos fora do catálogo; não alteram acesso, progresso ou regras produtivas. Fase 2 sem aceite humano observado.

- [PC-04](rascunhos/pc-04-v1.md): 13 trechos, quatro exemplos, oito questões/32 justificativas. CET e componentes; valor líquido, fluxo/calendário, soma nominal versus taxa, informação prévia, limites de indexadores e âmbito. Pré-requisitos: PC-02/03. CETs anuais são informados em fluxos de pagamento único após 365 dias; não se ensina fórmula geral, conversão mensal/anual ou SAC/Price.
- [PC-05](rascunhos/pc-05-v1.md): 12 trechos, quatro exemplos, oito questões/32 justificativas. Necessidade comercial/consumo, funcionamento versus equipamento durável, saldo versus recebível, antecipação com valores explicitados, entrada/principal/total e limites da concessão. Pré-requisitos: PC-02/04. Não esgota modalidades, garantias ou disciplina de duplicatas.

As fontes estruturadas e os links de recuperação ficam nas duas fontes `.mjs`, que geram as leituras. Cada questão aponta ensino anterior e objetivo; O6 exige recuperar o raciocínio, sem criar indicador de domínio.

## Fontes e limites

- [Resolução CMN 4.881](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20CMN&numero=4881), texto exibido pelo BCB em 30/09/2026: arts. 1º–5º e 7º–9º. Exceções de crédito rural/repasses externos e tratamento de referência variável explícitos.
- [BCB — duplicata](https://www.bcb.gov.br/meubc/faqs/p/o-que-e-uma-duplicata), atualizada em 30/06/2026; [taxas médias](https://www.bcb.gov.br/estatisticas/txjuros), consulta em 30/09/2026. Não se copiaram taxas do ranking nem se inferiu condição individual.
- [CAIXA — capital de giro](https://www.caixa.gov.br/empresa/credito-financiamento/capital-de-giro/Paginas/default.aspx), consulta em 30/09/2026: somente contraste introdutório das modalidades rotativas/parceladas. Sem ofertas, programas, taxas ou prazos comerciais; não é recomendação.
- FAQs BCB e Caderno de Cidadania Financeira de PC-02 reaproveitados no escopo inalterado. Perfis BB/CAIXA históricos; CET é apoio didático, sem subitem inventado ou cobertura integral declarada.

## Verificação dirigida

Executados `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc04 --render` e `--unit=pc05 --render`: ambas aprovadas em esquema, IDs/gabaritos/justificativas, fontes, recuperação, Markdown e exclusão do catálogo. Foram conferidas 26 operações aritméticas (incluindo coerência dos três CETs anuais informados em fluxos únicos de 365 dias) e 48 referências locais nas verificações. Sintaxe do validador e diff aprovados. Nenhuma suíte do aplicativo, D1 ou produção foi acessada. Revisão independente do novo lote ainda pendente; não se repetirá a revisão de PC-01A/01/02/03 já recebida.

Próxima unidade prevista: PC-06, crédito rural introdutório, com finalidades/participantes e fontes próprias; manter PC-07 habitacional condicionado e não publicar rascunhos sem decisão agrupada.
