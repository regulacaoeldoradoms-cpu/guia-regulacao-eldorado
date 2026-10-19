import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const script=read('js/clinical-condition-pilot.js');
const style=read('css/clinical-condition-pilot.css');

async function fixture(channel='guide'){
  let mounted=null;
  const opened=[];
  const buttons=[];
  const panel={querySelector:()=>null,prepend(node){mounted=node;}};
  const document={
    getElementById:id=>id===(channel==='reception'?'receptionDetail':'detailPanel')?panel:null,
    createElement:tag=>{
      assert.equal(tag,'section');
      return {dataset:{},className:'',innerHTML:'',querySelectorAll(selector){
        assert.equal(selector,'[data-condition]');
        const matches=[...this.innerHTML.matchAll(/<button type="button" class="cp-condition-card" data-condition="([^"]+)"/g)];
        return matches.map(match=>{
          const button={dataset:{condition:match[1]},addEventListener(event,callback){
            assert.equal(event,'click');
            button.click=callback;
          }};
          buttons.push(button);
          return button;
        });
      }};
    }
  };
  const context=vm.createContext({
    window:{},document,URL,AbortController,setTimeout,clearTimeout,
    fetch:async()=>({ok:false,status:404})
  });
  vm.runInContext(script,context);
  await context.window.ClinicalConditionPilot.ready;
  return {api:context.window.ClinicalConditionPilot,opened,buttons,
    mount:id=>context.window.ClinicalConditionPilot.addDetailChoice({id},(protocol,options)=>opened.push({protocolId:protocol.id,conditionId:options.conditionId}),channel),
    html:()=>mounted?.innerHTML,
    className:()=>mounted?.className,
    dataset:()=>mounted?.dataset
  };
}

test('Neuropediatria mostra oito cards nativos, sem seta, nome separado do sistema e ordem íntegra',async()=>{
  const ui=await fixture();
  ui.mount('neuropediatria');
  assert.equal(ui.buttons.length,8);
  assert.match(ui.className(),/cp-condition-picker/);
  assert.equal(ui.dataset().pilotDetailChoice,'true');
  assert.match(ui.html(),/cp-condition-grid/);
  assert.match(ui.html(),/8 motivos/);
  assert.match(ui.html(),/aria-label="Motivos de encaminhamento disponíveis"/);
  assert.equal((ui.html().match(/class="cp-condition-name"/g)||[]).length,8);
  assert.equal((ui.html().match(/class="cp-condition-system"/g)||[]).length,8);
  assert.equal((ui.html().match(/DigSaúde MS/g)||[]).length,8);
  assert.doesNotMatch(ui.html(),/→|&rarr;|&#8594;|<svg|<img/);
  assert.ok(ui.html().includes('Transtornos de aprendizagem'));
  ui.buttons[3].click();
  assert.deepEqual(ui.opened,[{protocolId:'neuropediatria',conditionId:'digsaude.neuropediatria.tea'}]);
});

test('Ortopedia e Recepção compartilham o seletor e distinguem a origem SISREG',async()=>{
  const ui=await fixture('reception');
  ui.mount('ortopedia');
  assert.equal(ui.buttons.length,3);
  assert.match(ui.html(),/SISREG \/ Campo Grande/);
  assert.equal((ui.html().match(/DigSaúde MS/g)||[]).length,2);
  assert.doesNotMatch(ui.html(),/→|&rarr;/);
  ui.buttons[2].click();
  assert.deepEqual(ui.opened,[{protocolId:'ortopedia',conditionId:'digsaude.ortopedia.bursite-tendinite'}]);
});

test('CSS usa duas colunas no desktop, uma em espaço estreito, hover discreto e foco de teclado',()=>{
  assert.match(style,/\.cp-condition-grid\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s);
  assert.match(style,/@container\s*\(max-width:620px\)\s*\{[^}]*\.cp-condition-grid\s*\{grid-template-columns:minmax\(0,1fr\)/s);
  assert.match(style,/@media\(max-width:900px\)\s*\{[^}]*\.cp-condition-grid\s*\{grid-template-columns:minmax\(0,1fr\)/s);
  assert.match(style,/\.cp-condition-card:focus-visible/);
  assert.match(style,/prefers-reduced-motion:reduce/);
  assert.doesNotMatch(script,/→<\/button>/);
});
