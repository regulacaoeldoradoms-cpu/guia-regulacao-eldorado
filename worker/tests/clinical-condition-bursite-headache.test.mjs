import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import worker from '../gemini-assistant.js';
import {clinicalPilotRecord,hydrateClinicalPilot} from '../clinical-condition-pilot.js';
const root=new URL('../../',import.meta.url),read=file=>fs.readFileSync(new URL(file,root),'utf8'),clone=value=>JSON.parse(JSON.stringify(value));
const BT=clinicalPilotRecord('digsaude.ortopedia.bursite-tendinite'),CE=clinicalPilotRecord('digsaude.neuropediatria.cefaleia');
const rule=(record,id)=>record.rules.find(rule=>rule.id===id);
async function client(missing=null,transform=value=>value){
 let selected=null,failed=null;
 const document={querySelector(selector){if(selector.startsWith('#detailPanel >'))return selected?{dataset:{clinicalConditionId:selected.id,clinicalQuery:'',clinicalChannel:'guide'},querySelector:()=>({value:''})}:null;if(selector==='[data-clinical-pilot-unavailable]')return failed?{dataset:{clinicalPilotUnavailable:failed.id}}:null;return null;}};
 const context=vm.createContext({window:{},document,URL,AbortController,setTimeout,clearTimeout,fetch:async url=>{const record=transform(JSON.parse(read(new URL(url,'https://local.invalid').pathname.slice(1))));return{ok:record.id!==missing,status:503,json:async()=>record};}});
 context.state={protocols:[{id:'endocrinologia',nome:'Endocrinologia',tags:['diabetes']},{id:'neuropediatria',nome:'Neuropediatria',tags:['autismo','tea','tdah']},{id:'ortopedia',nome:'Ortopedia Adulto',tags:['bursite','tendinite','ombro','joelho']}]};
 vm.runInContext(read('js/clinical-condition-pilot.js'),context);const api=context.window.ClinicalConditionPilot;await api.ready;
 return{api,select:record=>{selected=record;},fail:record=>{selected=null;failed=record;}};
}
test('Bursite: critério NÃO farmacológico por 6 meses, descritivos e dois exames obrigatórios da p.47',()=>{
 assert.equal(BT.rules.length,9);assert.deepEqual(rule(BT,'IDADE').ageMinimum,{years:18,months:0,days:0});
 for(const phrase of ['sem resposta satisfatória','não farmacológico','exercícios','acompanhamento fisioterápico','otimizado','6 meses'])assert.ok(rule(BT,'REFRATARIA6').text.includes(phrase));
 assert.equal(rule(BT,'REFRATARIA6').optimizedTreatmentMonths,6);
 for(const[id,phrase]of [['DOR','característica da dor'],['EVOLUCAO','tempo de evolução'],['FATORES','desencadeantes e fatores de alívio'],['FUNCAO','restrição de movimento ou prejuízo funcional'],['TRAUMA','trauma prévio']])assert.ok(rule(BT,id).text.includes(phrase));
 assert.deepEqual(rule(BT,'RX').views,['AP','perfil']);assert.equal(rule(BT,'RX').requirement,'obrigatorio');assert.equal(rule(BT,'USG').requirement,'obrigatorio');
 assert.doesNotMatch(BT.rules.map(r=>r.text).join(' '),/resson|\bRM\b|axilar|sessões|relatório fisioterápico|6 semanas/i);
 for(const r of BT.rules)assert.equal(r.sourceLocations[0].physical,r.id==='IDADE'?'46':'47');
});
test('Cefaleia: cinco critérios distintos, números e cinco alertas da p.37 são preservados',()=>{
 assert.equal(CE.rules.length,18);assert.deepEqual(rule(CE,'IDADE').ageMaximum,{years:16,months:11,days:29});
 assert.equal(CE.rules.filter(r=>r.group==='referral').length,5);assert.equal(rule(CE,'APS2').minimumProphylaxisMonths,2);
 assert.match(rule(CE,'APS2').text,/refratária.*profilático.*APS.*mínimo de 2 meses/);
 assert.match(rule(CE,'INVESTIGACAO').text,/necessidade de investigação.*RM.*ou.*TC/);
 assert.match(rule(CE,'EXAME_ALTERADO').text,/RMN ou TC.*ou Eletroencefalograma.*alterado/);
 assert.match(rule(CE,'INDISPONIVEL_APS').text,/quando o exame não for disponível na APS/);
 for(const[id,re]of [['PADRAO',/novo ou mudança recente/],['PROGRESSAO',/insidiosa e progressiva.*semanas ou meses/],['SONO',/acorda durante o sono/],['ATIVIDADES',/escolares, atividades físicas ou brincadeiras/],['ESFORCO',/esforço, tosse, atividade física ou manobra de Valsalva/]]){assert.match(rule(CE,id).text,re);assert.equal(rule(CE,id).group,'alert');}
 assert.equal(CE.rules.filter(r=>r.minimumProphylaxisMonths!==undefined).length,1);
 assert.doesNotMatch(CE.rules.map(r=>r.text).join(' '),/monoterapia|anticrise|febril|epilepsia|6 meses/i);
});
test('Diário obrigatório é registro, avaliação neurológica é clínica, TC/RM se houver; EEG não vira exame obrigatório',async()=>{
 const c=await client(),p=clone(c.api.protocolContext({record:CE,age:null}));
 assert.equal(rule(CE,'DIARIO').group,'clinicalRecord');assert.equal(rule(CE,'DIARIO').requirement,'obrigatorio');
 assert.equal(rule(CE,'NEURO').group,'clinicalAssessment');assert.equal(rule(CE,'NEURO').requirement,'obrigatorio');
 assert.deepEqual(p.registrosObrigatorios,['Diário de cefaleia (dor) - (obrigatório).']);assert.deepEqual(p.examesObrigatorios,[]);
 assert.equal(p.recomendadosQuandoDisponiveis.length,2);assert.ok(p.recomendadosQuandoDisponiveis.every(s=>s.includes('se houver')));
 assert.ok(p.informacoesClinicasObrigatorias.some(s=>s.includes('Exame físico neurológico')));assert.ok(!p.informacoesClinicasObrigatorias.some(s=>s.includes('Diário')));
 assert.equal(CE.rules.some(r=>r.group==='documents'&&/EEG|Eletroencefalograma/.test(r.text)),false);
 assert.deepEqual(rule(CE,'APRESENTACAO').alternatives,['anexados','descritos']);assert.equal(rule(CE,'RESPONSAVEL').requirement,'obrigatorio');
 assert.deepEqual(hydrateClinicalPilot(p),p);
 const bt=clone(c.api.protocolContext({record:BT,age:null}));assert.equal(bt.examesObrigatorios.length,2);assert.deepEqual(bt.recomendadosQuandoDisponiveis,[]);assert.equal(bt.registrosObrigatorios,undefined);
});
test('Ambiguidade de imagem e lacunas ficam nas notas, sem elegibilidade, exame ou urgência inventados',async()=>{
 const c=await client();assert.match(CE.uncertainties.find(u=>u.id==='IMAGEM_DUPLICADA').text,/Ambos foram preservados.*não.*resolvida.*não gera elegibilidade automática/);
 for(const record of [BT,CE]){assert.match(record.sourceNotesPolicy,/não cria.*obrigação/);assert.ok(record.uncertainties.every(u=>u.kind));const projected=c.api.protocolContext({record,age:null});for(const note of record.uncertainties){assert.ok(!projected.examesObrigatorios.includes(note.text));assert.ok(!projected.informacoesClinicasObrigatorias.includes(note.text));}}
 assert.match(CE.sourceLimits.text,/regime de profilaxia, duração ou formato do diário, validade da imagem/);
 assert.match(CE.sections.find(s=>s.ruleIds.includes('ESFORCO')).note,/não cria destino ou urgência automática/);
 assert.match(BT.uncertainties.find(u=>u.id==='OTIMIZADO').text,/não estabelece quantidade de sessões.*relatório fisioterápico obrigatório/);
});
test('Fonte: bytes/páginas conferidos; revisão Gmail dirigida não certifica vigência; vínculos completos',()=>{
 for(const record of [BT,CE]){assert.equal(record.sources[0].fileHash,'96445fc56ecf27e3b81a47389c923a0a4c837372eeab5e31c7fba054ad139315');assert.match(record.provenance,/renderizadas e inspecionadas/);assert.match(record.correspondence.notes,/três consultas, 14 mensagens únicas/);assert.match(record.correspondence.notes,/Não corresponde a pesquisa exaustiva/);assert.match(record.status,/sem_vigencia_confirmada/);for(const r of record.rules){assert.deepEqual(r.sourceRefs,['TEL2']);assert.ok(r.sourceLocations.length);}}
 assert.deepEqual(CE.sources[0].pages,{physical:'36-37',printed:'30-31',documentTotal:72});assert.deepEqual(BT.sources[0].pages,{physical:'46-47',printed:'40-41',documentTotal:72});
});
test('Classificação específica: Bursite/Tendinite no ombro não importa Dor no Ombro; Cefaleia não herda crises',async()=>{
 const c=await client();
 for(const query of ['bursite no ombro','tendinite no ombro DigSaúde','Bursite e tendinite']){assert.ok(c.api.matches(query,BT.id));assert.equal(c.api.matches(query,c.api.SHOULDER),false);}
 assert.ok(c.api.matches('cefaleia pediátrica',CE.id));assert.ok(c.api.matches('dor de cabeça',CE.id));
 for(const query of ['17 anos','dor no joelho'])assert.equal(c.api.matches(query),false);
 assert.equal(c.api.matches('Neuropediatria para autismo no DigSaúde',c.api.record('digsaude.neuropediatria.tea')?.id),true,'TEA possui recorte próprio, sem importar cefaleia/convulsão');
 c.select(c.api.record());assert.deepEqual(clone(c.api.questionContexts('Cefaleia no DigSaúde: quais exames?')).map(p=>p.id),[CE.id]);
 assert.doesNotMatch(c.api.localAnswer('Cefaleia no DigSaúde: quais exames?'),/monoterapia|anticrise|febril simples/);
 assert.deepEqual(clone(c.api.questionContexts('Convulsão no DigSaúde')).map(p=>p.id),[c.api.ID]);
 assert.deepEqual(clone(c.api.questionContexts('Bursite no ombro DigSaúde')).map(p=>p.id),[BT.id]);
 assert.doesNotMatch(c.api.localAnswer('Bursite no ombro DigSaúde: exames?'),/axilar|Ruptura total|USG de ombro:/);
});
test('Escolha curta conserva pergunta e idade; seguir tema clínico não exige escolher sistema a cada pergunta',async()=>{
 for(const[question,record]of [['Bursite: quais exames?',BT],['Cefaleia aos 17 anos: quais exames?',CE]]){
  const c=await client();assert.match(c.api.localAnswer(question),/escolha/i);assert.deepEqual(clone(c.api.questionContexts(question)),[]);
  const contexts=clone(c.api.questionContexts('Teleatendimento'));assert.equal(contexts.length,1);assert.equal(contexts[0].id,record.id);assert.ok(contexts[0].clinicalConditionRecord.rules.length===record.rules.length);
  assert.ok(contexts[0].clinicalConditionRecord.sources.length);const answer=c.api.localAnswer('Teleatendimento');
  if(record===CE){assert.match(answer,/17 anos/);assert.match(answer,/Diário de cefaleia/);assert.equal(contexts[0].clinicalAge.years,17);}else assert.match(answer,/AP e perfil/);
  assert.deepEqual(clone(c.api.questionContexts('E quais documentos?')).map(p=>p.id),[record.id]);
 }
});

test('Perguntas com motivos distintos pedem uma condição sem omitir a segunda nem reutilizar contexto antigo',async()=>{
 for(const selected of [null,BT,CE]){
  const c=await client();if(selected)c.select(selected);
  for(const question of ['Quais exames para bursite e cefaleia?','Cefaleia e tendinite no ombro no DigSaúde','Cefaleia e convulsão no DigSaúde','Bursite e dor no ombro no DigSaúde']){
   assert.equal(c.api.questionDecision(question).kind,'choose_condition');assert.equal(c.api.matches(question),false);
   assert.deepEqual(clone(c.api.questionContexts(question)),[]);assert.equal(c.api.localOnlyQuestion(question),true);
   const answer=c.api.localAnswer(question);assert.match(answer,/condição por vez|motivo por consulta/);assert.doesNotMatch(answer,/AP e perfil|Diário de cefaleia|monoterapia/);
   assert.equal(c.api.acceptsQuestion(question,{record:BT,age:null}),false);
   assert.equal(c.api.questionDecision('DigSaúde').kind,'choose_condition');assert.deepEqual(clone(c.api.questionContexts('E quais documentos?')),[]);
  }
  assert.deepEqual(clone(c.api.questionContexts('Cefaleia no DigSaúde')).map(p=>p.id),[CE.id]);
  assert.deepEqual(clone(c.api.questionContexts('Tendinite no ombro no DigSaúde')).map(p=>p.id),[BT.id]);
  c.api.localAnswer('Bursite e cefaleia');assert.equal(c.api.questionContexts('Quais exames para diabetes?'),null);
 }
 const c=await client();for(const query of ['bursite no ombro','Bursite e tendinite DigSaúde'])assert.deepEqual(clone(c.api.questionContexts(query.includes('DigSaúde')?query:query+' DigSaúde')).map(p=>p.id),[BT.id]);
 assert.deepEqual(clone(c.api.questionContexts('Compare Dor no Ombro DigSaúde e SISREG')).map(p=>p.id),[c.api.SHOULDER,c.api.RELATED]);
});

test('Worker pede uma condição para pergunta mista mesmo com cliente antigo ou lista incompleta, sem provedor',async()=>{
 let calls=0;const env={AI_PROVIDER:'cloudflare',CLOUDFLARE_AI_FALLBACK_ENABLED:'true',AI:{run:async()=>{calls++;return{response:'Não deveria ser chamado'};}}};
 for(const question of ['Quais exames para bursite e cefaleia?','Cefaleia e tendinite no ombro DigSaúde','Cefaleia e convulsão DigSaúde','Bursite e dor no ombro DigSaúde'])for(const records of [[],[BT],[CE],[BT,CE]]){
  const response=await worker.fetch(new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,protocols:records.map(r=>({id:r.id,clinicalConditionId:r.id,clinicalConditionRecord:{revision:r.revision}}))})}),env);
  assert.equal(response.status,200);const body=await response.json();assert.match(body.answer,/condição por vez|motivo por consulta/);assert.doesNotMatch(body.answer,/AP e perfil|Diário de cefaleia|monoterapia/);assert.equal(body.provider,'Consulta local de escopo');
 }
 assert.equal(calls,0);
});
test('Contexto e indisponibilidade: diabetes/joelho não herdam os novos recortes',async()=>{
 for(const record of [BT,CE])for(const other of ['Quais exames para diabetes?','Dor no joelho: o que descrever?']){
  const c=await client();c.select(record);assert.equal(c.api.questionDecision(other),null);assert.equal(c.api.localAnswer(other),null);assert.equal(c.api.questionContexts('E quais exames?'),null);
  const unavailable=await client(record.id);unavailable.fail(record);assert.equal(unavailable.api.questionDecision(other),null);assert.equal(unavailable.api.localAnswer(other),null);
 }
});
test('Novos recortes não substituem SISREG/CORE ou outra faixa; lacuna dos 17 permanece',async()=>{
 const c=await client();for(const question of ['Bursite no SISREG','Cefaleia no CORE','Cefaleia adulto no DigSaúde','Bursite infantil no DigSaúde','Compare os sistemas para Cefaleia']){assert.equal(c.api.questionDecision(question).kind,'source_limit');assert.deepEqual(clone(c.api.questionContexts(question)),[]);}
 assert.equal(c.api.ageNotice({years:16,months:11,days:29},CE.id),null);assert.equal(c.api.ageNotice({years:17,months:0,days:0},CE.id).id,'IDADE17');assert.match(c.api.ageNotice({years:17,months:0,days:0},CE.id).text,/não define outra rota nem transfere/);
 assert.equal(c.api.ageNotice({years:18,months:0,days:0},BT.id),null);assert.equal(c.api.ageNotice({years:17,months:11,days:29},BT.id).id,'FORA_FAIXA');
});
test('Falha ou truncamento do novo JSON não usa lista geral nem bloqueia o outro motivo',async()=>{
 for(const record of [BT,CE]){const c=await client(record.id);assert.equal(c.api.record(record.id),null);assert.ok(c.api.record(record===BT?CE.id:BT.id));const bad=await client(null,r=>r.id===record.id?{...r,rules:r.rules.slice(1)}:r);assert.equal(bad.api.record(record.id),null);}
});
test('Impressão e projeções apresentam cada regra uma vez, incluindo diário e nota de ambiguidade',async()=>{
 const c=await client();for(const record of [BT,CE]){const html=c.api.printDocument({record,age:record===CE?{years:17,months:0,days:0}:null,query:''});assert.equal([...html.matchAll(/data-clinical-rule=/g)].length,record.rules.length);for(const r of record.rules)assert.equal(html.split('data-clinical-rule="'+r.id+'"').length-1,1);assert.doesNotMatch(html,/Fonte, detalhes e pendências|Notas de fonte e pontos em aberto|Estas notas não são uma lista adicional de exigências|data-source-note/);assert.ok(html.includes(record.reference));assert.ok(c.api.printDocument({record,age:null,query:'Qual prazo ou validade?'}).includes(record.sourceLimits.text));if(record===CE){assert.match(html,/Registro obrigatório/);assert.match(html,/não gera elegibilidade automática/);assert.match(html,/17 anos/);}}
});
test('Worker conserva registro integral e diário fora de exames, ignora adulteração e rejeita revisão/idade inválidas',async()=>{
 const c=await client();for(const record of [BT,CE]){const projected=clone(c.api.protocolContext({record,age:null}));projected.clinicalConditionRecord.rules=[{id:'FAKE',text:'EEG obrigatório inventado'}];const actual=hydrateClinicalPilot(projected);assert.deepEqual(actual.clinicalConditionRecord,record);assert.throws(()=>hydrateClinicalPilot({...projected,clinicalConditionRecord:{revision:'antiga'}}),e=>e.status===409);assert.throws(()=>hydrateClinicalPilot({...projected,clinicalAge:{years:17,months:12,days:0}}),e=>e.status===400);}
});
test('Worker envia as regras/fontes/notas completas com provedor estritamente simulado e mantém limite de sondagem',async()=>{
 let calls=0,prompt='';const env={AI_PROVIDER:'cloudflare',CLOUDFLARE_AI_FALLBACK_ENABLED:'true',AI:{run:async(_model,input)=>{calls++;prompt=input.messages[1].content;return{response:'Simulação sem rede.'};}}};
 const request=body=>new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 for(const record of [BT,CE]){const response=await worker.fetch(request({question:record.condition+' no DigSaúde: quais requisitos?',protocols:[{id:record.id,clinicalConditionId:record.id,clinicalConditionRecord:{revision:record.revision},clinicalAge:null}]}),env);assert.equal(response.status,200);const payload=JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);assert.deepEqual(payload[0].clinicalConditionRecord,record);if(record===BT){assert.match(prompt,/tratamento NÃO farmacológico/);assert.doesNotMatch(prompt,/Cefaleia pediátrica: os 2 meses/);}else{assert.match(prompt,/diário é registro obrigatório/);assert.doesNotMatch(prompt,/Bursite\/Tendinite: o critério/);}}
 assert.equal(calls,2);const probe=await worker.fetch(request({clinicalConditionProbe:[BT.id,CE.id]}),env);assert.deepEqual((await probe.json()).records,[BT,CE]);assert.equal(calls,2);
 assert.equal((await worker.fetch(request({clinicalConditionProbe:[BT.id,CE.id,'digsaude.neuropediatria.convulsao-epilepsia','digsaude.ortopedia.dor-no-ombro']}),env)).status,400);
 assert.equal((await worker.fetch(request({clinicalConditionProbe:[CE.id]}),{...env,AUTH_ENFORCE_AI:'true'})).status,403);assert.equal(calls,2);
});
test('Worker não envia novos recortes a provedor para sistema ou faixa explicitamente fora do escopo',async()=>{
 let calls=0;const env={AI_PROVIDER:'cloudflare',CLOUDFLARE_AI_FALLBACK_ENABLED:'true',AI:{run:async()=>{calls++;throw Error('Must not run');}}};
 for(const [question,record]of [['Bursite no SISREG',BT],['Cefaleia no CORE',CE],['Cefaleia adulto',CE],['Tendinite infantil',BT],['Compare sistemas para Cefaleia',CE],['Bursite: e no outro sistema?',BT]]){const response=await worker.fetch(new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,protocols:[{id:record.id,clinicalConditionId:record.id,clinicalConditionRecord:{revision:record.revision}}]})}),env);assert.equal(response.status,200);assert.match((await response.json()).answer,/somente DigSaúde/);}assert.equal(calls,0);
});
test('Os três registros do PR664 e o espelho histórico permanecem byte a byte preservados',()=>{
 for(const[file,sha]of [['convulsao-epilepsia-20261016','a450d2b9100bc158b37ee249a4caeaca3004f4aeea6dfc3b30ab59f34de7afed'],['dor-no-ombro-20261016','239f252fbd5af57c13b0a0abd3fd6878acaf2aa9a053816947ad5b4a182f901f'],['ombro-referencias-sisreg-cg-20261016','db088ee8d46027b5f876a1bff662b3976f0815d3e81cb43f9c2757c1462b82f1']])assert.equal(createHash('sha256').update(read('data/clinical-conditions/'+file+'.json').replaceAll('\r\n','\n')).digest('hex'),sha);
 assert.equal(createHash('sha256').update(read('data/protocol-source.html').replaceAll('\r\n','\n')).digest('hex'),'19d10b176c7ab5c9a960ca1bda3d0d117de3b26440a222497a6f89914d6e2b77');
});

test('7 e 17 unidades da fonte correspondem a 9 e 18 itens: três desdobramentos sem novas exigências',()=>{
 assert.equal(BT.sourceMatrixUnitCount,7);assert.equal(CE.sourceMatrixUnitCount,17);
 assert.deepEqual(BT.editorialBreakdown[0].ruleIds,['DOR','EVOLUCAO','FATORES']);assert.deepEqual(BT.editorialBreakdown[0].additionalStructuredIds,['EVOLUCAO','FATORES']);
 assert.equal(BT.editorialBreakdown[0].sourceLocations[0].physical,'47');assert.match(BT.editorialBreakdown[0].sourceExcerpt,/característica da dor, tempo de evolução, fatores desencadeantes e fatores de alívio/);
 assert.deepEqual(CE.editorialBreakdown[0].ruleIds,['QUADRO','APRESENTACAO']);assert.deepEqual(CE.editorialBreakdown[0].additionalStructuredIds,['APRESENTACAO']);
 assert.equal(CE.editorialBreakdown[0].sourceLocations[0].physical,'36');assert.match(CE.editorialBreakdown[0].sourceExcerpt,/quadro clínico atual, documentos anexados ou descritos/);
 for(const record of [BT,CE]){assert.equal(record.rules.length-record.editorialBreakdown.reduce((n,g)=>n+g.ruleIds.length-1,0),record.sourceMatrixUnitCount);assert.ok(record.editorialBreakdown.every(g=>g.ruleIds.every(id=>record.rules.some(r=>r.id===id))));assert.match(record.editorialBreakdown[0].explanation,/Não acrescenta exigência/);}
});

test('Paginação dos novos recortes conserva todo o conteúdo e fonte 18px; as três impressões anteriores ficam idênticas',async()=>{
 const c=await client(),hash=text=>createHash('sha256').update(text).digest('hex');
 console.log('PRINT_HASHES_20261019',JSON.stringify([...[[c.api.ID,17],[c.api.SHOULDER,52],[c.api.RELATED,18]].map(([id,years])=>({id,hash:hash(c.api.printDocument({record:c.api.record(id),age:{years,months:0,days:0},query:''}))})),...[[BT,52],[CE,17]].map(([record,years])=>({id:record.id,hash:hash(c.api.printDocument({record,age:{years,months:0,days:0},query:''}).replace(/<style>[\s\S]*?<\/style>/,''))}))]));
 for(const[id,years,expected]of [[c.api.ID,17,'d6611763d1ccd0883c0e1b835615f4258e1b848c0f1d92e9b5ca524a738eabd9'],[c.api.SHOULDER,52,'34715aa9714681328f9b8faa41edce60ff2a1d6b53504cba7828a9c97974bb23'],[c.api.RELATED,18,'df80b63fe8cbeaa739e9a35a36f8dd2b45a1fa2afe2dbe8a2dd8a99329e41a49']])assert.equal(hash(c.api.printDocument({record:c.api.record(id),age:{years,months:0,days:0},query:''})),expected);
 for(const[record,years,expected]of [[BT,52,'555e5c2c44db3c8c5b5bc2456c62eb2f1632fc61c4b0111fbe8b403ef53936cf'],[CE,17,'9eec453ae7a2d195ce0e7ac807c6ec1a1a45df0ef34671632ce449a5142cf34d']]){const html=c.api.printDocument({record,age:{years,months:0,days:0},query:''});assert.equal(hash(html.replace(/<style>[\s\S]*?<\/style>/,'')),expected);assert.match(html,/font:18px\/1\.45/);assert.match(html,/\.cp-requirement\{break-inside:auto\}/);}
});
