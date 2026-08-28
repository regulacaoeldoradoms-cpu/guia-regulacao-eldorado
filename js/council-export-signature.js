'use strict';

(() => {
  const SIGNATURE_SRC = '/assets/assinatura-elizabete-menezes.png?v=20260828-1';
  const SIGNATURE_LABEL = 'Presidência do Conselho Municipal de Saúde';
  const nativeOpen = window.open.bind(window);

  function patchExportHtml(html) {
    if (typeof html !== 'string' || !html.includes(SIGNATURE_LABEL)) return html;

    let output = html;

    const signatureCss = `
  .signature .president-signature{
    display:block;
    width:auto;
    max-width:180px;
    height:auto;
    max-height:52px;
    object-fit:contain;
    margin:0 auto -3px;
  }
  .compact .signature .president-signature{max-width:165px;max-height:46px}
  .dense .signature .president-signature{max-width:150px;max-height:40px}
  @media(max-width:820px){.signature .president-signature{max-width:170px;max-height:50px}}
  @media print{.signature .president-signature{display:block!important}}
`;

    if (!output.includes('president-signature')) {
      output = output.replace(/<\/style>/i, `${signatureCss}</style>`);

      output = output.replace(
        /<div class="signature"><div class="line"><\/div><strong>Presidência do Conselho Municipal de Saúde<\/strong><span>Eldorado\/MS<\/span><\/div>/g,
        `<div class="signature"><img class="president-signature" src="${SIGNATURE_SRC}" alt="Assinatura da Presidência"><div class="line"></div><strong>Presidência do Conselho Municipal de Saúde</strong><span>Eldorado/MS</span></div>`
      );
    }

    // Evita que a impressão automática aconteça antes do PNG da assinatura carregar.
    output = output.replace(
      /<script>setTimeout\(function\(\)\{window\.print\(\)\},700\);<\\\/script>/g,
      `<script>(function(){var done=false;function printNow(){if(done)return;done=true;setTimeout(function(){window.print()},120)}var img=document.querySelector('.president-signature');if(!img||img.complete){printNow()}else{img.addEventListener('load',printNow,{once:true});img.addEventListener('error',printNow,{once:true});setTimeout(printNow,1800)}})();<\\/script>`
    );

    return output;
  }

  window.open = function (...args) {
    const popup = nativeOpen(...args);
    try {
      if (!popup || !popup.document || popup.__councilSignaturePatched) return popup;
      popup.__councilSignaturePatched = true;

      const doc = popup.document;
      const nativeWrite = doc.write.bind(doc);
      doc.write = function (...chunks) {
        return nativeWrite(patchExportHtml(chunks.join('')));
      };
    } catch (error) {
      console.warn('[Conselho] Não foi possível aplicar a assinatura automática ao documento.', error);
    }
    return popup;
  };
})();
