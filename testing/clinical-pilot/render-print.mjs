// Render the actual production print function offline; no server or provider.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),require=createRequire(import.meta.url);
const {chromium}=require(process.env.CLINICAL_PILOT_PLAYWRIGHT||'playwright');
const dir=path.resolve(process.argv[2]||path.join(root,'.local/clinical-print'));fs.mkdirSync(dir,{recursive:true});
const context=vm.createContext({window:{},document:{querySelector:()=>null},URL,AbortController,setTimeout,clearTimeout,fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,new URL(url,'https://local.invalid').pathname),'utf8'))})});
vm.runInContext(fs.readFileSync(path.join(root,'js/clinical-condition-pilot.js'),'utf8'),context);const api=context.window.ClinicalConditionPilot;await api.ready;
const browser=await chromium.launch({headless:true}),report=[],selectedId=process.argv.find(arg=>arg.startsWith('--record='))?.slice(9);
try{
  for(const [id,name,years] of [[api.ID,'convulsao',17],[api.SHOULDER,'ombro-dig',52],[api.RELATED,'ombro-sisreg',18]].filter(([id])=>!selectedId||id===selectedId)){
    const record=api.record(id),html=api.printDocument({record,age:{years,months:0,days:0},query:''});
    assert.equal([...html.matchAll(/data-clinical-rule=/g)].length,record.rules.length);
    const page=await browser.newPage();await page.route('**/*',route=>route.abort());await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
    const pdf=path.join(dir,'impressao-'+name+'.pdf');await page.pdf({path:pdf,format:'A4'});
    report.push({id,revision:record.revision,file:path.basename(pdf),rules:record.rules.length});await page.close();
  }
}finally{await browser.close();}
assert.ok(report.length,'No record selected');fs.writeFileSync(path.join(dir,selectedId?'render-verification-selected.json':'render-verification.json'),JSON.stringify({passed:true,networkCalls:0,documents:report},null,2));console.log(JSON.stringify(report));
