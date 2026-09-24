// Narrow, reviewable exceptions. No UI panel or generic button/card is exempted.
export const brightSurfaceAllowlist = [
  { selector:'#dischargeQueue', reason:'Permanent gold and reflection are required by docs/TELEMEDICINA-SALVAMENTO-ATOMICO-E-ALTAS-V29.md, lines 25-60; exception is limited to the Altas button.' },
  { selector:'.telemedicine-page[data-discharge-achievement="v28"] .telemedicine-row.is-discharge-achievement',pseudo:'',reason:'The permanent gold discharge card is explicitly required by docs/TELEMEDICINA-SALVAMENTO-ATOMICO-E-ALTAS-V29.md, line 35; children remain independently audited.' },
  { selector:'.telemedicine-page[data-discharge-achievement="v28"] .telemedicine-row.is-discharge-achievement > .telemedicine-patient, .telemedicine-page[data-discharge-achievement="v28"] .telemedicine-row.is-discharge-achievement > .telemedicine-specialty-block, .telemedicine-page[data-discharge-achievement="v28"] .telemedicine-row.is-discharge-achievement > .telemedicine-date-block, .telemedicine-page[data-discharge-achievement="v28"] .telemedicine-row.is-discharge-achievement > .telemedicine-actions',pseudo:'',reason:'Only the four direct gold zones defined in telemedicina-discharge-achievement-v28.css belong to the deliberately gold discharge card; their controls and dialogs remain audited.' },
  { selector:'.telemedicine-row.is-discharge-achievement > .telemedicine-patient > .telemedicine-achievement-badge, .telemedicine-row.is-discharge-achievement > .telemedicine-specialty-block > .telemedicine-status.is-achievement-status',pseudo:'',reason:'Discharge badge and status use explicit gold semantic colors in telemedicina-discharge-achievement-v28.css; no other status chip is exempted.' },
  { selector:'.telemedicine-row.is-discharge-achievement > .telemedicine-date-block > strong',pseudo:'',reason:'The Alta registrada inset uses the original translucent finish over the documented gold discharge card (telemedicina V37); only this direct text inset is exempted, not controls or history.' },
  { selector:'.portal-pdf-page, .portal-pdf-page canvas, .portal-pdf-thumb canvas', reason:'Original PDF paper/content must remain faithful; surrounding viewer controls are audited.' },
  { selector:'.documents-editor-color-swatch, .portal-editor-color-swatch, input[type="color"]', reason:'The selected content color is data, not an application surface.' },
  { selector:'.interface-theme-preview.is-light, .interface-theme-preview.is-light i', reason:'Explicit miniature preview of the light theme must illustrate its light surfaces.' },
  { selector:'.interface-switch > span',pseudo:'::after',maxArea:625,reason:'Small switch thumb is a control glyph; the surrounding settings panel and track remain audited.' },
  { selector:'.chat-online-dot, .portal-chat-presence-dot',maxArea:256,reason:'Small bright presence dot is a status indicator; the chat surface remains audited.' },
  { selector:'.social-profile-cover, .social-mini-cover',reason:'User-configurable decorative profile cover (js/social-profile.js and css/social.css); its artwork remains faithful while surrounding UI and text are audited.' },
  { selector:'#telemedicineViewSwitch > button, .telemedicine-actions > .portal-button',pseudo:'::before',mask:true,maxArea:1024,reason:'Small masked action glyph uses foreground currentColor; the button surface itself remains audited.' },
  { selector:'#manifestationDetailModal #replyButton',pseudo:'::before',mask:true,maxArea:625,reason:'25px masked reply-airplane glyph in citizen-detail-mobile-v4.css; reply button and detail panel remain audited.' },
  { selector:'#councilMobileDetailNav > button',pseudo:'::before',mask:true,maxArea:576,reason:'24px masked section glyph from council-professional-icons.css; navigation button surfaces remain audited.' },
  { selector:'#exportManifestationPdf.is-praise',pseudo:'::before',mask:true,maxArea:324,reason:'18px masked praise-star glyph from council-export.css; export-button surface remains audited.' },
  { selector:'.telemedicine-status, .telemedicine-alert-marker', pseudo:'::before', mask:true, maxArea:1024, reason:'Small masked status/alert glyph uses foreground currentColor; its surrounding chip surface remains audited.' }
];

export async function inspectSurfaces(page) {
  return page.evaluate(({ allowlist }) => {
    // Product code adds some static clinical explanations after loading data.
    // Evidence uses synthetic narrative text only, retaining real nodes, classes,
    // controls, technical specialty identifiers and roughly the same text length.
    let syntheticNarrativeNodes=0;
    if(/^\/(medico|recepcao|protocolo)(\/|\.html|$)/.test(location.pathname)) {
      const roots=document.querySelectorAll('#detailPanel,#receptionDetail,#printArea');
      for(const root of roots){
        const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
        while(walker.nextNode())nodes.push(walker.currentNode);
        for(const node of nodes){
          if(!node.textContent.trim()||node.parentElement?.closest('button,a,select,option,h1,h2,h3,h4,h5,h6,svg,script,style,.reception-summary,.reception-actions,.detail-meta,.protocol-metadata'))continue;
          if(node.textContent.startsWith('Texto fictício de auditoria'))continue;
          const sentence='Texto fictício de auditoria visual sem conteúdo assistencial. ';
          node.textContent=sentence.repeat(Math.ceil(Math.max(sentence.length,node.textContent.length)/sentence.length)).slice(0,Math.max(sentence.length,node.textContent.length));
          syntheticNarrativeNodes++;
        }
      }
    }
    const rgba = text => {
      const m = String(text).match(/^rgba?\(([^)]+)\)$/);
      if (!m) return null;
      const n = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return n.length >= 3 ? [n[0], n[1], n[2], n.length > 3 ? n[3] : 1] : null;
    };
    const lum = c => {
      const linear = c.slice(0,3).map(n => { n /= 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
      return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
    };
    const blend = (front, back) => front.slice(0,3).map((v,i) => v * front[3] + back[i] * (1-front[3])).concat(1);
    const visible = el => {
      if (!el.getClientRects().length) return false;
      for (let p=el; p; p=p.parentElement) {
        const s=getComputedStyle(p);
        if (s.display==='none' || s.visibility==='hidden' || Number(s.opacity)===0 || p.hidden) return false;
      }
      return true;
    };
    const selector = el => {
      const uniqueId=p=>p.id&&document.querySelectorAll('#'+CSS.escape(p.id)).length===1;
      if (uniqueId(el)) return '#' + CSS.escape(el.id);
      const segments=[];
      // Keep the full ancestry until a unique ID. A depth limit aliases repeated
      // badges/SVG paths and invents differences in the baseline snapshot map.
      for (let p=el; p; p=p.parentElement) {
        if (uniqueId(p)) { segments.unshift('#'+CSS.escape(p.id)); break; }
        let segment=p.localName;
        if (p.classList.length) segment += '.'+[...p.classList].slice(0,3).map(CSS.escape).join('.');
        const siblings=p.parentElement ? [...p.parentElement.children].filter(n=>n.localName===p.localName) : [];
        if (siblings.length>1) segment += ':nth-of-type('+(siblings.indexOf(p)+1)+')';
        segments.unshift(segment);
      }
      return segments.join(' > ');
    };
    // CSS paints the last background image first. Composite translucent stops
    // against the lower gradient, never an assumed white page (false positives).
    const paint = (style, under) => {
      let result=blend(rgba(style.backgroundColor)||[0,0,0,0],under);
      const layers=[]; let start=0,depth=0;
      for(let i=0;i<style.backgroundImage.length;i++) {
        const ch=style.backgroundImage[i]; if(ch==='(') depth++; else if(ch===')') depth--;
        if(ch===','&&depth===0){layers.push(style.backgroundImage.slice(start,i));start=i+1;}
      }
      layers.push(style.backgroundImage.slice(start));
      for(const layer of layers.reverse()) {
        const colors=(layer.match(/rgba?\([^)]+\)/g)||[]).map(rgba).filter(Boolean);
        if(colors.length) result=colors.map(color=>blend(color,result)).sort((a,b)=>lum(b)-lum(a))[0];
      }
      return result;
    };
    const inheritedBackground = el => {
      const chain=[];
      for (let p=el; p; p=p.parentElement) chain.unshift(p);
      return chain.reduce((bg,p)=>paint(getComputedStyle(p),bg),[255,255,255,1]);
    };
    const rules=[];
    const walk=(collection,href,guards=[])=>{
      for (const r of collection||[]) {
        if(r instanceof CSSImportRule){
          if(r.media.mediaText&&!matchMedia(r.media.mediaText).matches)continue;
          try{walk(r.styleSheet.cssRules,r.href,[...guards,r.media.mediaText]);}catch{}
          continue;
        }
        if (r instanceof CSSMediaRule && !matchMedia(r.conditionText).matches) continue;
        if (r instanceof CSSSupportsRule && !CSS.supports(r.conditionText)) continue;
        if (r.selectorText && r.style) rules.push({ selector:r.selectorText, style:r.style, source:href, guards });
        if (r.cssRules) walk(r.cssRules,href,[...guards, r.conditionText||'']);
      }
    };
    for(const sheet of document.styleSheets) { try { walk(sheet.cssRules,sheet.href||`inline <style${sheet.ownerNode?.id?' id='+sheet.ownerNode.id:''}>`); } catch {} }
    const splitSelectors=value=>{const parts=[];let start=0,depth=0;for(let i=0;i<value.length;i++){const c=value[i];if(c==='('||c==='[')depth++;else if(c===')'||c===']')depth--;else if(c===','&&depth===0){parts.push(value.slice(start,i));start=i+1;}}parts.push(value.slice(start));return parts;};
    const matchedSources=(el,pseudo)=>rules.filter(r=>{
      try { return splitSelectors(r.selector).some(s=>{
        const isPseudo=/::?(before|after)\b/.test(s);
        if(Boolean(pseudo)!==isPseudo) return false;
        if(pseudo&&!s.includes(pseudo)) return false;
        return el.matches(s.replace(/::?(before|after)\b/g,''));
      }); } catch { return false; }
    }).map(r=>({source:r.source, selector:r.selector, declarations:['background','background-color','background-image'].filter(k=>r.style.getPropertyValue(k)).map(k=>({property:k,value:r.style.getPropertyValue(k),important:r.style.getPropertyPriority(k)})),guards:r.guards})).filter(r=>r.declarations.length).slice(-18);
    const bright=[], allowed=[], contrast=[], snapshot=[];
    for (const el of document.querySelectorAll('html,body,body *')) {
      if (!visible(el)) continue;
      const rect=el.getBoundingClientRect(), name=selector(el);
      if(rect.width<2||rect.height<2) continue;
      const base=getComputedStyle(el);
      snapshot.push({selector:name,tag:el.localName,background:base.backgroundColor,backgroundImage:base.backgroundImage,color:base.color,border:base.borderColor,shadow:base.boxShadow,opacity:base.opacity,filter:base.filter,display:base.display,font:base.fontFamily,fontSize:base.fontSize,width:Math.round(rect.width*100)/100,height:Math.round(rect.height*100)/100});
      for (const pseudo of ['', '::before','::after']) {
        const style=pseudo?getComputedStyle(el,pseudo):base;
        if (pseudo && (style.content==='none'||style.content==='normal'||style.display==='none'||Number(style.opacity)===0)) continue;
        if(pseudo)snapshot.push({selector:name+pseudo,tag:el.localName,pseudo,background:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,border:style.borderColor,shadow:style.boxShadow,opacity:style.opacity,filter:style.filter,display:style.display,font:style.fontFamily,fontSize:style.fontSize,width:style.width,height:style.height,maskImage:style.maskImage,content:style.content});
        const background=rgba(style.backgroundColor);
        const gradientColors=(style.backgroundImage.match(/rgba?\([^)]+\)/g)||[]).map(rgba).filter(Boolean);
        const colors=background?[background,...gradientColors]:gradientColors;
        const under=inheritedBackground(pseudo?el:el.parentElement);
        const maximum=colors.some(c=>c[3]>0)?lum(blend([...paint(style,under).slice(0,3),Number(style.opacity)],under)):0;
        const area=pseudo?(parseFloat(style.width)||rect.width)*(parseFloat(style.height)||rect.height):rect.width*rect.height;
        if(maximum>=.45 && area>=96 && !['img','video','canvas','svg','path'].includes(el.localName)) {
          const exemption=allowlist.find(item=>el.matches(item.selector)&&(item.pseudo===undefined||item.pseudo===pseudo)&&(!item.mask||style.maskImage!=='none')&&(!item.maxArea||area<=item.maxArea));
          const finding={ selector:name,pseudo,tag:el.localName,background:style.backgroundColor,backgroundImage:style.backgroundImage,maskImage:style.maskImage,opacity:style.opacity,luminance:+maximum.toFixed(4),color:style.color,area:Math.round(area),text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,110),inlineStyle:el.getAttribute('style'),sources:matchedSources(el,pseudo) };
          if(exemption) allowed.push({...finding,reason:exemption.reason}); else bright.push(finding);
        }
      }
      if([...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()) && base.backgroundImage==='none') {
        const fg=rgba(base.color),bg=inheritedBackground(el);
        if(fg) {
          const a=lum(blend(fg,bg)),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          const large=parseFloat(base.fontSize)>=24||(parseFloat(base.fontSize)>=18.66&&Number(base.fontWeight)>=700);
          if(ratio<(large?3:4.5)) contrast.push({selector:name,ratio:+ratio.toFixed(2),required:large?3:4.5,color:base.color,background:bg,text:(el.textContent||'').trim().slice(0,100)});
        }
      }
    }
    return {url:location.href,theme:document.documentElement.dataset.portalTheme,media:matchMedia('print').matches?'print':'screen',title:document.title,viewport:{width:innerWidth,height:innerHeight},visibleElementCount:snapshot.filter(item=>!item.pseudo).length,visiblePseudoElementCount:snapshot.filter(item=>item.pseudo).length,syntheticNarrativeNodes,bright,allowed,contrast,snapshot};
  }, {allowlist:brightSurfaceAllowlist});
}
