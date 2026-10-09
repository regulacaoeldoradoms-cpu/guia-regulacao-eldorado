import {execFileSync} from 'node:child_process';import path from 'node:path';import fs from 'node:fs';
const cwd=decodeURIComponent(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')));
console.log(execFileSync(process.execPath,[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),'install','--ignore-scripts','--no-audit','--no-fund'],{cwd,encoding:'utf8',timeout:120000}));
for(const browser of ['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'])console.log(browser,fs.existsSync(browser));
