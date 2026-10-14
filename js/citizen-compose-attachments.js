'use strict';
(() => {
  if (globalThis.PortalCitizenComposeAttachments) return;
  function create({ input, list, picker, disclosure, count, preview, compose, onChange, onError, validate, isBusy }) {
    let files = [], disposed = false, previewRecord = null, previewOpener = null, focusFrame = 0;
    const records = new Map();
    const image = preview.querySelector('img'), title = preview.querySelector('h2');
    const close = preview.querySelector('[data-close-local-preview]');
    const size = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024
      ? `${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(bytes / 1024)} KB`
      : `${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(bytes / 1024 / 1024)} MB`;
    const imageKind = file => /^image\/(jpeg|png)$/.test(file.type)
      || !file.type && /\.(jpe?g|png)$/i.test(file.name);
    const live = record => !disposed && records.get(record.file) === record;
    function fitPreview() {if(preview.classList.contains('open')){const height=globalThis.visualViewport?.height || innerHeight;preview.style.setProperty('--local-preview-height',`${height}px`);preview.style.setProperty('--local-preview-top',`${globalThis.visualViewport?.offsetTop || 0}px`);const head=preview.querySelector('.citizen-modal-head'),help=preview.querySelector('p');preview.style.setProperty('--local-image-limit',`${Math.max(48,height-head.offsetHeight-help.offsetHeight-48)}px`);}}
    function restoreInput() {
      try { const transfer = new DataTransfer();files.forEach(file=>transfer.items.add(file));input.files = transfer.files; }
      catch (_) { input.value = ''; } // The selected File objects remain the upload source.
    }
    function closePreview({ restoreFocus = true } = {}) {
      if (!preview.classList.contains('open')) return;
      preview.classList.remove('open');preview.setAttribute('aria-hidden','true');
      preview.setAttribute('aria-modal','false');image.removeAttribute('src');
      previewRecord = null;compose.inert = false;
      cancelAnimationFrame(focusFrame);
      compose.setAttribute('aria-modal',String(compose.classList.contains('open')));
      if (restoreFocus && compose.classList.contains('open')) {
        const target = previewOpener?.isConnected && previewOpener.getClientRects().length ? previewOpener : picker;
        target?.focus({preventScroll:true});
      }
      previewOpener = null;
    }
    function openPreview(record) {
      if (!live(record) || !record.ready || isBusy()) return;
      previewRecord = record;previewOpener = record.button;
      title.textContent = record.displayName;image.alt = `Imagem anexada: ${record.displayName}`;image.src = record.url;
      preview.classList.add('open');preview.setAttribute('aria-hidden','false');preview.setAttribute('aria-modal','true');
      compose.inert = true;compose.setAttribute('aria-modal','false');close.focus({preventScroll:true});
      fitPreview();
      focusFrame=requestAnimationFrame(()=>{if(preview.classList.contains('open')&&!preview.contains(document.activeElement))close.focus({preventScroll:true});});
    }
    function release(record) {
      if (previewRecord === record) closePreview();
      records.delete(record.file);
      if (record.url) URL.revokeObjectURL(record.url);
      record.image?.removeAttribute('src');record.row.remove();
    }
    function unavailable(record) {
      if (!live(record)) return;
      record.ready = false;record.button.disabled = true;
      record.row.classList.add('preview-unavailable');
      record.button.classList.remove('has-preview');
      record.hint.textContent = 'Prévia indisponível. O arquivo foi mantido.';
      record.image?.removeAttribute('src');
      if (record.url) {URL.revokeObjectURL(record.url);record.url = '';}
      if (previewRecord === record) closePreview();
    }
    async function prepareImage(record) {
      try {
        // Only JPEG/PNG signatures reach the image element. No SVG/HTML resources
        // can be interpreted as a local image, even with a misleading MIME/name.
        const bytes = new Uint8Array(await record.file.slice(0,12).arrayBuffer());
        const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
        const png = [137,80,78,71,13,10,26,10].every((byte,index)=>bytes[index]===byte);
        if (!jpeg && !png) return unavailable(record);
        if (!live(record)) return;
        const blob = new Blob([record.file],{type:png?'image/png':'image/jpeg'});
        record.url = URL.createObjectURL(blob);
        record.image.src = record.url;
      } catch (_) { unavailable(record); }
    }
    function addRow(file, occurrence) {
      const row = document.createElement('div');row.className = 'selected-file compose-file-row';
      const thumb = document.createElement(imageKind(file)?'button':'span');thumb.className = 'compose-file-thumb';
      const metadata = document.createElement('div');metadata.className = 'compose-file-meta';
      const name = document.createElement('strong');name.textContent = file.name + (occurrence > 1 ? ` (${occurrence})` : '');
      const details = document.createElement('small');details.textContent = `${/pdf$/i.test(file.type)||/\.pdf$/i.test(file.name)?'PDF':'Imagem'} · ${size(file.size)}`;
      const hint = document.createElement('small');hint.className = 'compose-file-hint';
      const remove = document.createElement('button');remove.type = 'button';remove.className = 'compose-file-remove';
      remove.setAttribute('aria-label',`Remover anexo ${name.textContent}`);remove.textContent = '×';
      metadata.append(name,details,hint);row.append(thumb,metadata,remove);list.append(row);
      const record = {file,displayName:name.textContent,row,button:thumb,remove,hint,url:'',ready:false,image:null};records.set(file,record);
      if (imageKind(file)) {
        thumb.type = 'button';thumb.disabled = true;thumb.setAttribute('aria-label',`Ampliar imagem ${name.textContent}`);
        const img = document.createElement('img');img.alt = '';img.decoding = 'async';record.image = img;thumb.append(img);
        hint.textContent = 'Preparando prévia…';
        img.addEventListener('load',()=>{if(live(record)){record.ready=true;thumb.classList.add('has-preview');thumb.disabled=isBusy();hint.textContent='Toque para ampliar';}});
        img.addEventListener('error',()=>unavailable(record));thumb.addEventListener('click',()=>openPreview(record));
        void prepareImage(record);
      } else {thumb.innerHTML='<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M5 2h9l5 5v19H5zM14 2v6h5"/></svg><span>PDF</span>';thumb.setAttribute('aria-hidden','true');}
      remove.addEventListener('click',()=>{
        if (isBusy()) return;
        files = files.filter(candidate=>candidate!==file);release(record);restoreInput();update();
        (records.values().next().value?.remove || picker).focus({preventScroll:true});onChange({validated:true});
      });
      return record;
    }
    function update() {
      list.hidden = !files.length;
      count.textContent = files.length ? `${files.length} arquivo${files.length===1?'':'s'}` : 'opcional';
      picker.textContent = files.length ? 'Trocar arquivos' : 'Escolher arquivos';
      for (const record of records.values()) {record.remove.disabled=isBusy();if(record.image)record.button.disabled=isBusy()||!record.ready;}
    }
    function changed() {
      if (isBusy()) {restoreInput();return;}
      const selected = [...new Set(Array.from(input.files || []))];
      const error = validate(selected);
      if (error) {restoreInput();onError(error + (files.length?' Os anexos anteriores foram mantidos.':''));onChange();return;}
      closePreview({restoreFocus:false});
      for (const record of [...records.values()]) release(record);
      files = selected;
      const names = new Set();
      for (const file of files) {let occurrence=1;while(names.has(occurrence===1?file.name:`${file.name} (${occurrence})`))occurrence++;names.add(occurrence===1?file.name:`${file.name} (${occurrence})`);addRow(file,occurrence);}
      if (files.length) disclosure.open = true;
      update();onChange({validated:true});
    }
    function clear() {closePreview({restoreFocus:false});for(const record of [...records.values()])release(record);files=[];input.value='';update();}
    function choose() {if (!isBusy()) input.click();}
    function previewKeys(event) {
      if (!preview.classList.contains('open')) return;
      if (event.key === 'Escape') {event.preventDefault();event.stopPropagation();closePreview();}
      if (event.key === 'Tab') {event.preventDefault();event.stopPropagation();close.focus();}
    }
    const closeClicked = () => closePreview();
    const backdrop = event => {if(event.target===preview)closePreview();};
    const previewError = () => {if(previewRecord)unavailable(previewRecord);};
    const pageHidden = event => {if(!event.persisted)clear();};
    const printing = () => closePreview({restoreFocus:false}),printMedia=matchMedia('print');
    const printChanged=()=>{if(printMedia.matches)printing();};
    input.addEventListener('change',changed);picker.addEventListener('click',choose);
    close.addEventListener('click',closeClicked);preview.addEventListener('click',backdrop);preview.addEventListener('keydown',previewKeys);
    image.addEventListener('error',previewError);globalThis.addEventListener('pagehide',pageHidden);
    globalThis.addEventListener('beforeprint',printing);printMedia.addEventListener('change',printChanged);
    globalThis.visualViewport?.addEventListener('resize',fitPreview);globalThis.visualViewport?.addEventListener('scroll',fitPreview);
    const resizeObserver=globalThis.ResizeObserver?new ResizeObserver(fitPreview):null;
    resizeObserver?.observe(preview.querySelector('.citizen-modal-head'));resizeObserver?.observe(preview.querySelector('p'));
    update();
    return Object.freeze({getFiles:()=>[...files],clear,sync:update,closePreview,dispose(){
      if(disposed)return;clear();disposed=true;
      input.removeEventListener('change',changed);picker.removeEventListener('click',choose);
      close.removeEventListener('click',closeClicked);preview.removeEventListener('click',backdrop);preview.removeEventListener('keydown',previewKeys);
      image.removeEventListener('error',previewError);globalThis.removeEventListener('pagehide',pageHidden);
      globalThis.removeEventListener('beforeprint',printing);printMedia.removeEventListener('change',printChanged);
      globalThis.visualViewport?.removeEventListener('resize',fitPreview);globalThis.visualViewport?.removeEventListener('scroll',fitPreview);
      resizeObserver?.disconnect();cancelAnimationFrame(focusFrame);
    }});
  }
  globalThis.PortalCitizenComposeAttachments=Object.freeze({create});
})();
