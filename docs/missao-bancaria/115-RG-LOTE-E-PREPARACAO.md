# Regência introdutória — lote e preparação local

04/10/2026. Continuação do [início114](114-RG-INICIO-REGENCIA.md), no bloco existente portuguese.syntax e no recorte do [plano05](05-FASE-4-PORTUGUES-MATEMATICA.md). Tudo local e desativado; não abre fase formal nem comprova cobertura integral do edital.

| Unidade | Ensino e recuperação | Questões |
| --- | --- | --- |
| [RG-01](rascunhos/rg-01-v1.md) | Vínculos verbais, preposição/artigo e distinção da concordância; retoma CF-03/CN-01 | 8 |
| [RG-02](rascunhos/rg-02-v1.md) | Assistir conforme sentido; visar conforme sentido e orientação editorial delimitada | 8 |
| [RG-03](rascunhos/rg-03-v1.md) | Dependência nominal nas frases fornecidas; necessidade de, leitura do/dos; de + artigo | 8 |
| [RG-R](rascunhos/rg-r-v1.md) | Revisão cumulativa com recuperação nas três aulas | 8 |
| [RG-Chefe](rascunhos/rg-chefe-v1.md) | Doze itens próprios, seis grupos de recuperação; todas as três aulas | 12 |

Total: cinco unidades, 44 questões, 176 justificativas e 13 exemplos resolvidos. Parecer independente RG-01 reutilizado de27f39ca6. Leitura independente das quatro novas unidades: favorável após duas precisões (RG-03q6, regente nominal é nome/não verbo; RG-Rq6, grupo dos roteiros depende de qual nome). Gabaritos preservados. Teste encontrou enunciado repetido RG-03q2/Chefeq10: o Chefe passou a usar leitura do aviso, sem alterar a contração de+o, opções ou gabaritoC; confirmação independente dirigida favorável. Pareceres limitados ao conteúdo, sem homologação, retenção ou aceite humano.

## Referências delimitadas

Conferidas em04/10/2026: [Senado, Assistir](https://www12.senado.leg.br/manualdecomunicacao/estilos/assistir), presenciar com a e ajudar/auxiliar direto na orientação do manual; [Senado, Visar](https://www12.senado.leg.br/manualdecomunicacao/estilos/visar), preferência com a antes de nome no sentido de objetivo, ausência de a antes de infinitivo conforme esse manual, mirar/carimbar direto. A preferência não foi convertida em proibição universal de variante direta. Metadados, localizadores e seções correspondentes presentes em RG-02/R/Chefe; exemplos autorais, sem copiar os exemplos institucionais.

RG-03 ensina estrutura em frases autorais explicitadas; não afirma ter verificado tabela normativa de regência nominal lexical. Não inclui lista de adjetivos, regências controversas de outros verbos, crase, relativas ou cobertura completa. Expansão prescritiva exige referência pertinente primeiro; não prolongar busca geral.

## Preparação e evidência

Candidato worker/scripts/studies-rg-candidate.mjs e artefato portuguese-regency-v1.js: cinco missões draft/parametersApproved:false, ordens107–111/release14 após ChefeCN106. IS passa somente em metadados para112–121/release15 após ChefeRG111; texto, IDs, fontes, questões, XP e demais campos IS iguais a27f39ca6. XP100 por unidade/220 e75% no Chefe são parâmetros propostos do padrão existente, não ativados. Manifest/mapa usam os filtros de publicação existentes; nenhum motor novo.

Verificado: dez testes RG, oito IS, três ordem e13isolamento, 34 testes distintos aprovados (RG repetido somente após correção do enunciado); incluem12cenários SQLite offline. Chromium: seis RG (320claro/390escuro, fonte ampliada/links, rede/repetição, resposta pendente, retomada, wellyton) e três IS afetados (dois tamanhos/temas e retomada), nove casos aprovados. Quatro novas unidades passaram esquema/renderização sincronizada; artefatos RG/IS --check-generated conferidos. RG-01 byte a byte preservada. Comparação com27f39ca6 confirma catálogo, fontes, planejamento, mapa e snapshot ativos iguais; Central/js/css/motor/leitor/rodadas/A-B inalterados.

Falhas locais corrigidas sem dispensar testes: compilador não mapeava links anteriores CF-03/CN-01; artefatos dependentes ainda não gerados; enunciado duplicado do Chefe. Verificação de comparação tentou comparar identidade de funções em vez do resultado do snapshot; o helper foi corrigido e resultado equivalente confirmado. Sem mudanças de workflow, detector, acesso ou produção. Evidências PU/CN41e6ce77 e HF/CF44bdbd26 reutilizadas, sem repetir suítes não afetadas.

Fixtures/SQLite/Chromium são offline e sintéticos; não equivalem a API real ou produção. Sem D1, push, PR novo, ativação, merge ou deploy. Fase2 mantém aceite humano não observado. Próximo recorte previsto: crase introdutória após preposição/artigo e dependência nominal, conferindo somente regras específicas; posteriormente semântica, colocação pronominal/reescrita e ampliação dos recortes ainda parciais conforme plano05.
