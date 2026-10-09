import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
const cwd=decodeURIComponent(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')));
const browsers=path.resolve(cwd,'../../.local/playwright');fs.mkdirSync(browsers,{recursive:true});
console.log(execFileSync(process.execPath,[path.join(cwd,'node_modules/playwright/cli.js'),'install','ffmpeg'],{cwd,env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:browsers},encoding:'utf8',timeout:120000}));
const file=path.join(cwd,'browser.mjs'),source=fs.readFileSync(file,'utf8');fs.writeFileSync(file,source.replace("const browser=await chromium.launch","process.env.PLAYWRIGHT_BROWSERS_PATH=path.resolve(out,'../../../.local/playwright');\nconst browser=await chromium.launch"));
