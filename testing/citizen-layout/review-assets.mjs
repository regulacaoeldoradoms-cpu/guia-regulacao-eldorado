import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '../browser/node_modules/playwright/index.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const names=['canal-cidadao-icon','Fechar-icon','nivel-bronze','nivel-prata','nivel-ouro'];
const rows=[];
for(const name of names){
 const original=await fs.readFile(path.join(root,'assets',name+'.png'));
 const candidate=await fs.readFile(path.join(import.meta.dirname,'asset-candidates',name+'.webp'));
 rows.push(`<article><h2>${name}</h2><div><figure><img src="data:image/png;base64,${original.toString('base64')}"><figcaption>Original · ${original.length.toLocaleString('pt-BR')} bytes</figcaption></figure><figure><img src="data:image/webp;base64,${candidate.toString('base64')}"><figcaption>256 px WebP · ${candidate.length.toLocaleString('pt-BR')} bytes</figcaption></figure></div></article>`);
}
const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>body{font:16px system-ui;margin:24px;color:#18354b;background:#f7fafc}h1{font-size:24px}h2{font-size:18px}article{border:1px solid #cbdceb;border-radius:12px;padding:12px;margin:12px 0;background:white}article>div{display:flex;gap:24px}figure{margin:0;width:300px;text-align:center}img{width:82px;height:82px;object-fit:contain;background:repeating-conic-gradient(#eef2f5 0% 25%,white 0% 50%) 0/16px 16px}figcaption{margin-top:10px}p{max-width:680px}</style><h1>Assets públicos: original × candidato</h1><p>Mesma imagem e transparência. Redução de resolução para o tamanho de interface, seguida de codificação WebP lossless. Candidatos sem ligação com o portal; nenhum vídeo alterado.</p>${rows.join('')}</html>`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:760,height:1300},deviceScaleFactor:2});
 await page.route('http**/*',r=>r.abort());
 await page.setContent(html);
 await page.screenshot({path:path.join(import.meta.dirname,'review/assets-comparison.png'),fullPage:true});
}finally{await browser.close()}
