# Titon OCR - third-party assets

Vendored for local-only OCR of scanned PDFs.

- Tesseract.js 7.0.0 - Apache-2.0 - https://github.com/naptha/tesseract.js
- tesseract.js-core 7.0.0 - Apache-2.0 - https://github.com/naptha/tesseract.js-core
- Portuguese trained data (@tesseract.js-data/por 1.0.0) - https://github.com/naptha/tessdata

Runtime policy: all OCR assets are served from this Portal. Patient/document images are processed inside the browser and are not sent to a third-party OCR service.

Local changes: default CDN fallback strings in the vendored browser bundles were replaced with same-origin Portal paths. Runtime versions and OCR engine code remain pinned as listed above.
