# OCR local do Titon — Tesseract.js 7.0.0

Este diretório contém somente o runtime necessário para o OCR local de páginas digitalizadas no Titon.

## Componentes versionados

- `tesseract.min.js` — Tesseract.js 7.0.0, blob Git de origem `449da3bf07dbe1c95c92510175d554d21d8071df`.
- `worker.min.js` — Worker browser Tesseract.js 7.0.0, blob Git de origem `de4a93b57987867b5dd42d8b6a5d222644aeab88`.
- `core/tesseract-core-lstm.wasm.js` — tesseract.js-core 7.0.0, blob `57d52b25a1438b086ba0ae8c49e9105957f306b3`.
- `core/tesseract-core-simd-lstm.wasm.js` — tesseract.js-core 7.0.0, blob `c831ffec0db84e022ec5be2cdf1d4e4ae797d593`.
- `core/tesseract-core-relaxedsimd-lstm.wasm.js` — tesseract.js-core 7.0.0, blob `dbc88c372a923875187d611d527774f169d47561`.

O Titon usa explicitamente `OEM.LSTM_ONLY`, portanto somente a família LSTM de cores é necessária. O carregador oficial escolhe entre Relaxed SIMD, SIMD e fallback sem SIMD conforme suporte do navegador.

## Dados de idioma

O modelo português não fica persistido no repositório. No primeiro OCR de uma sessão, o Tesseract.js baixa somente o arquivo estático versionado:

`https://cdn.jsdelivr.net/npm/@tesseract.js-data/por@1.0.0/4.0.0_best_int/por.traineddata.gz`

SHA-256 esperado: `dacebc1386ddaaf8389f81094236cca0d690897cde693d48cbdaa881c86e2b4c`.

Esse request contém apenas o download do modelo estático de português. Imagens/pixels do documento não são enviados ao CDN nem ao backend do Portal.

## Integridade

O CI valida presença e hashes/objetos Git dos arquivos versionados. Hashes SHA-256:

- `tesseract.min.js`: `000c27d9cd0def655f77b36c72a389c0ab13793aa31cb4d7aab56d09c0afbc7e`
- `worker.min.js`: `576b7df7e3393e137e51849357c9adb53fe7ac1bb69bfa06cf3d61520f182c6d`

A tag de script do runtime também usa SRI para impedir execução se o arquivo local divergir do hash aprovado.

## Privacidade

O reconhecimento acontece dentro do navegador, em Web Worker. O resultado OCR fica apenas em memória na sessão do Titon; não é enviado ao PostHog, Workers AI, Google Drive ou outro serviço. Fechar um documento enquanto o OCR está ativo termina o worker local.

## Licenças e fontes

- Tesseract.js: Apache-2.0 — licença em `LICENSE-tesseract.js.md`.
- tesseract.js-core / Tesseract: Apache-2.0 — licença em `LICENSE-tesseract.js-core.txt`.
- Dados `@tesseract.js-data/por`: pacote MIT; traineddata upstream Tesseract sob Apache-2.0.

As fontes exatas e hashes são pinados para tornar atualização/revisão reproduzíveis.
