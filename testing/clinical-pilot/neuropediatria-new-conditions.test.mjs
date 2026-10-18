import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cases=[
 ['atraso-regressao-desenvolvimento',['NEURO','ESCOLA'],['TC','RM','LAB','TERAPIAS']],
 ['tea',['INSTRUMENTO'],['MULTIPROF','NEUROPREV']],
 ['tdah-tod',['SNAP','RELATORIO','ESCOLA'],['MULTIPROF','NEUROPREV']],
 ['transtornos-aprendizagem',['ESCOLA'],['PSICOPED','NEUROPSICO']],
 ['disturbios-movimento',['NEURO'],['LAB','TC','RM','ENMG']],
 ['doencas-neurologicas-inflamatorias',['NEURO'],['LAB','TC','RM']]
];
for(const [slug,required,optional] of cases){
 test('Neuropediatria '+slug+': requisitos íntegros e separados',()=>{
   const r=JSON.parse(readFileSync(new URL('../../data/clinical-conditions/neuropediatria-'+slug+'-20261017.json',import.meta.url),'utf8'));
   assert.equal(r.parentProtocolId,'neuropediatria');
   assert.equal(r.system,'DigSaúde MS');
   const rules=new Map(r.rules.map(x=>[x.id,x]));
   assert.equal(rules.size,r.rules.length,'Identificadores de regra duplicados');
   for(const s of r.sections)for(const id of s.ruleIds)assert.ok(rules.has(id),'Regra ausente em '+s.title+': '+id);
   for(const id of required)assert.equal(rules.get(id)?.requirement,'obrigatorio',id);
   for(const id of optional){assert.equal(rules.get(id)?.requirement,'opcional_documental',id);assert.equal(rules.get(id)?.availability,'se_houver',id);}
   assert.ok(r.sources[0].pages.printed);
   assert.ok(r.rules.every(rule=>rule.sourceRefs?.length && rule.sourceLocations?.length));
   assert.ok(r.uncertainties.some(x=>x.id==='OFERTA'));
   assert.ok(r.uncertainties.some(x=>x.id==='IDADE17'));
 });
}
test('TEA: instrumentos alternativos e condicionais distintos',()=>{
 const r=JSON.parse(readFileSync(new URL('../../data/clinical-conditions/neuropediatria-tea-20261017.json',import.meta.url),'utf8'));
 const t=r.rules.find(x=>x.id==='INSTRUMENTO').text;
 assert.match(t,/pelo menos um/i);
 assert.match(t,/M-CHAT/);
 assert.match(t,/AQ-10/);
 assert.match(t,/CARS-2/);
 assert.equal(r.rules.find(x=>x.id==='BERA').requirement,'condicional');
});
test('TDAH: quatro semanas só na faixa de seis anos completos em diante',()=>{
 const r=JSON.parse(readFileSync(new URL('../../data/clinical-conditions/neuropediatria-tdah-tod-20261017.json',import.meta.url),'utf8'));
 assert.match(r.rules.find(x=>x.id==='SEIS').text,/4 semanas/);
 assert.doesNotMatch(r.rules.find(x=>x.id==='QUATRO').text,/4 semanas/);
});
