import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '../browser/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const width of [320,390]){
  const modes=[['applied','Aplicada: uma linha com nomes','Seis destinos visíveis, nomes a 14 px e patinha SVG. Texto ampliado pode ocupar mais linhas.'],['icons','Alternativa: uma linha de ícones','Seis alvos visíveis ≥44 px, nomes acessíveis e tooltip. Os nomes não ficam visíveis na barra.'],['scroll','Alternativa: uma linha com nomes','Nomes completos a 16 px, sem quebrar Ferramentas. Exige deslizar para encontrar os demais destinos.']];
  let cards='';
  for(const [mode,title,note] of modes){
   const image=await fs.readFile(`/tmp/citizen-nav-${mode}-${width}.png`);
   cards+=`<section><h2>${title}</h2><p>${note}</p><img alt="${title}" src="data:image/png;base64,${image.toString('base64')}"></section>`;
  }
  const page=await browser.newPage({viewport:{width:460,height:1000},deviceScaleFactor:2});
  await page.setContent(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>body{font:18px system-ui;color:#18354b;background:#f7fafc;margin:18px}h1{font-size:24px}h2{font-size:21px;margin:0}p{line-height:1.45}section{border:1px solid #cbdceb;padding:12px;margin:16px 0;border-radius:10px;background:white}img{display:block;max-width:100%;height:auto}</style><h1>Barra fixa inferior · ${width} px</h1><p>Conta e conteúdo inteiramente fictícios. Barra aplicada e alternativas apenas para revisão.</p>${cards}</html>`);
  await page.screenshot({path:path.join(import.meta.dirname,`review/nav-comparison-${width}.png`),fullPage:true});
  await page.close();
 }
}finally{await browser.close()}
