# Letras — candidato offline desativado

04/10/2026. [Lote 100](100-OL-PLANO-LOTE-E-REVISAO.md): cinco unidades/44 questões/176 justificativas, conteúdo revisado independentemente com dois ajustes pedagógicos aplicados. Todos locais, sem publicação ou aceite humano.

Compilador studies-ol-candidate.mjs reaproveita o pipeline OA e gera portuguese-spelling-letters-v1.js. IDs próprios portuguese.spelling.letters.*, com fonte primária identificada por unidade, cinco fontes e quatro links de consulta compilados. Textos, alternativas, justificativas e recuperações preservados. Ordens 92–96 após Chefe OA, sequência anterior e XP 100/220, mínimo 75% no Chefe são apenas propostas; parametersApproved:false, publication.status:draft, sem opção CLI/ambiente para ativação. Nenhuma importação no manifesto/mapa, configuração browser, UI ou roteador foi acrescentada para OL.

## Verificações proporcionais

- Cinco artefatos editoriais conferidos/renderizados pelo validador existente, estendido apenas ao lote OL: esquema, fonte/data/locator, objetivos, quatro justificativas, IDs, gabaritos, origem/recuperação, grupos do Chefe, UTF-8, links e sincronia. Repetida somente a renderização afetada pela nota de tônica/reordenação; sem nova auditoria de fontes.
- Oito testes do compilador passaram antes dos ajustes: referência primária, draft inacessível, preservação de artefato/ensino, sequência não aprovada, Chefe próprio e negativos de pacote incompleto/duplicado/ativado, fonte/recuperação inexistente e pré-requisito futuro. Depois, artefato regenerado e apenas três testes de preservação afetada, Chefe próprio e integridade de itens/posições executados; registros reais no checkpoint.
- Catálogo e fontes ativos comparados ao controle anterior: 50 missões/374 questões idênticos. Progresso não acessado. Sintaxe, artefato gerado, referências/diff conferidos. Não foram executados roteador/Chromium OL: não há exposição no catálogo ou mudança de fluxo; evidências OA de nove testes/seis cenários e seis Chromium em e4ca3c1c continuam válidas para o pipeline inalterado, sem alegar execução OL dessas suítes. Antes de futura ativação, executar regressões pertinentes à ligação real do catálogo.

Comandos: node --test worker/tests/studies-ol-candidate.test.mjs; após ajustes, --test-name-pattern="artefato preserva|itens próprios"; node worker/scripts/studies-ol-candidate.mjs --check-generated. Sem suíte geral ou produção/D1.

## Ponto de salvamento em draft PR, ainda sem envio

LP (5 unidades/44 questões), PT (6/52) e OA (6/52) têm conteúdo revisado, candidato desativado e testes de roteador/Chromium próprios já registrados. OL (5/44) tem conteúdo revisado e compilação offline, aguardando futura ligação controlada ao catálogo e seus testes afetados. Total local Português: **22 unidades/192 questões**, sem disponibilidade no produto. Podem ser preservados juntos em um draft PR quando houver aprovação específica; não enviar agora.

A branch deriva de DP #572/IS #600, não da main atual. Um envio agrupado precisa de base isolada/diff apenas dos lotes pretendidos, preservando commits concorrentes e reconciliando contratos #598; não transportar histórico alheio inadvertidamente. IS é recorte CAIXA histórico, LP/PT/OA/OL são comuns BB/CAIXA; dependência IS→LP precisa decisão antes da ativação. Hífen e outros casos continuam pendentes, sem reivindicar bloco integral. Central/IA clínica/gates permanecem intocados; sem nova investigação de preview/checks conhecidos.
