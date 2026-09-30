# PC-01–03 — preparo introdutório de produtos e crédito

30/09/2026. Autoria fora do catálogo, conforme sequência existente do plano 66 em #559 (sem integrar esse PR). Nenhuma publicação, XP ou regra nova de desbloqueio. Fase 2 continua sem aceite humano observado.

## Conjunto redigido

- [PC-01 — Conta, saldo e serviços](rascunhos/pc-01-v1.md): 12 trechos, quatro exemplos, oito questões/32 justificativas. Tipos de conta/canal, extrato e agendamento, saldo/limite, identificação/representação e serviço. Pré-requisito didático: [PC-01A](rascunhos/pc-01a-v1.md) para pessoas e poderes.
- [PC-02 — Crédito, empréstimo e financiamento](rascunhos/pc-02-v1.md): 11 trechos, quatro exemplos, oito questões/32 justificativas. Partes, destinação, principal/juros/amortização/prestações, entrada e soma de pagamentos; limites da comparação. Retoma PC-01.
- [PC-03 — Cartões, fatura e limite de crédito](rascunhos/pc-03-v1.md): 12 trechos, quatro exemplos, oito questões/32 justificativas. Funções, datas, total/obrigatório, rotativo e comparação com cheque especial. Retoma PC-01/02; sem taxas, tetos ou recomendação de produto.

## Fontes e limites

As aulas registram URL, versão, localização e consulta em 30/09/2026. Foram reaproveitadas consultas já feitas às FAQs oficiais BCB, Caderno de Cidadania Financeira e Resolução CMN 4.753 compilada v6; para PC-03, Resolução 4.549 compilada v2 consultada diretamente. Não repetir busca normativa geral. Referências BB/CAIXA são históricas e o recorte não equivale à cobertura integral de item. Casos fictícios, sem aconselhamento para pessoa real.

## Verificação proporcional

Validar separadamente com `node docs/missao-bancaria/rascunhos/validate-mp01.mjs --unit=pc01 --render` e `--unit=pc02 --render` / `--unit=pc03 --render`. O validador confere esquema, IDs, gabarito/justificativas, referências/recuperação, exclusão de drafts, aritmética explícita e equivalência Markdown. Resultado executado: três unidades passaram; 24 questões/96 justificativas, 31 cálculos, 88 links locais conferidos e catálogo inalterado. Revisão independente pedagógica permanece pendente; essas verificações não a substituem.

Próxima ação: revisão pedagógica agrupada PC-01/02/03 após concluir a publicação MP autorizada. Não publicar este conjunto.
