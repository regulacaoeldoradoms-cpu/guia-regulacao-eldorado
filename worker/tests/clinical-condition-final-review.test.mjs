import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import worker from '../gemini-assistant.js';
import { clinicalPilotRecord } from '../clinical-condition-pilot.js';
const root=new URL('../../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),clone=v=>JSON.parse(JSON.stringify(v));
const NP=clinicalPilotRecord(),OM=clinicalPilotRecord('digsaude.ortopedia.dor-no-ombro'),SG=clinicalPilotRecord('sisreg-campo-grande.ortopedia.referencias-ombro');
async function client(probeMode='compatible',missingId=null){
  let selected=null,pending=null,failed=null;
  const document={readyState:'loading',addEventListener(){},querySelector(selector){
    if(selector.startsWith('#detailPanel >'))return selected?{dataset:{clinicalConditionId:selected.record.id,clinicalQuery:'',clinicalChannel:'guide'},querySelector:()=>({value:selected.age?selected.age.years+' anos':''})}:null;
    if(selector==='[data-clinical-system-choice]')return pending?{dataset:{clinicalSystemChoice:pending}}:null;
    if(selector==='[data-clinical-pilot-unavailable]')return failed?{dataset:{clinicalPilotUnavailable:failed.id}}:null;
    return null;
  }};
  const sent=[],probes=[],window={REGULATION_AI_CONFIG:{endpoint:'https://local.invalid/__mock-ai'},setTimeout,clearTimeout},context=vm.createContext({window,document,URL,AbortController,setTimeout,clearTimeout,fetch:async(url,options)=>{if(String(url).endsWith('/__mock-ai')){const payload=JSON.parse(options.body);if(payload.clinicalConditionProbe){probes.push(payload);if(probeMode.startsWith('http-'))return{ok:false,status:Number(probeMode.slice(5)),json:async()=>({error:'Falha simulada de sondagem.',code:'PROBE_HTTP_FAILURE'})};const records=payload.clinicalConditionProbe.map(id=>clinicalPilotRecord(id));if(probeMode==='different')records[0].rules.pop();return{ok:true,json:async()=>probeMode==='legacy'?{answer:'Formato antigo'}:{clinicalConditionProbe:true,records}};}sent.push(payload);return{ok:true,json:async()=>({answer:'Provedor estritamente simulado.',provider:'Simulação'})};}const loaded=JSON.parse(read(new URL(url,'https://local.invalid').pathname.slice(1)));return{ok:loaded.id!==missingId,status:503,json:async()=>loaded};}});
  vm.runInContext(read('js/clinical-condition-pilot.js'),context);await window.ClinicalConditionPilot.ready;
  context.state={protocols:[{id:'endocrinologia',nome:'Endocrinologia Adulto',resumo:'Diabetes sem melhora após tratamento na APS.',tags:['diabetes'],sistemas:{sisreg:true}},{id:'neuropediatria',nome:'Neuropediatria',tags:['autismo','tea','tdah','paralisia cerebral'],sistemas:{digsus:true}},{id:'cardiologia',nome:'Cardiologia Adulto',tags:['hipertensao'],sistemas:{sisreg:true}},{id:'ortopedia',nome:'Ortopedia Adulto',sistemas:{digsus:true,sisreg:true},examesObrigatorios:['Lista geral não deve entrar no piloto sem sistema.']}],selected:null};
  vm.runInContext(read('js/ai-assistant.js').replace(/\}\)\(\);\s*$/,'window.reviewRequestContext=requestContext;window.reviewAskAssistant=askAssistant;window.reviewFriendlyFailure=friendlyAiFailure;window.reviewPause=shouldPauseRemoteAi;})();'),context);
  return{api:window.ClinicalConditionPilot,select:(record,age=null)=>{selected=record?{record,age}:null;},pending:family=>{pending=family;},requestContext:window.reviewRequestContext,askAssistant:window.reviewAskAssistant,sent,probes,fail:record=>{selected=null;failed=record;},friendly:window.reviewFriendlyFailure,pause:window.reviewPause};
}
test('confronto dos 42 itens com os qualificadores e páginas da matriz recebida',()=>{
  // Expectations transcribed from the supplied matrix, independently of JSON rendering.
  const entries=[
    [NP,'IDADE','condicional','36',['16 anos','11 meses','29 dias']],
    [NP,'CRISE','criterio','37',['Um ou mais episódios','sugestivos']],
    [NP,'MONO','criterio','38',['Epilepsia prévia','controle inadequado','monoterapia otimizada','dose plena','descartada má adesão']],
    [NP,'EFEITOS','criterio','38',['Epilepsia prévia','efeitos adversos intoleráveis','medicação']],
    [NP,'DIFICIL','criterio','38',['controle inadequado','duas ou mais','medicações anticrise','dose plena','descartada má adesão']],
    [NP,'FEBRIL','exclusao','37',['Este critério exclui','convulsão febril simples']],
    [NP,'QUADRO','obrigatorio','36',['quadro clínico atual']],
    [NP,'TRATAMENTO','obrigatorio','38',['tratamento','critério pertinente']],
    [NP,'NEURO','obrigatorio','38',['Exame neurológico','profissional habilitado']],
    [NP,'EEG','opcional_documental','38',['Eletroencefalograma','se houver']],
    [NP,'TC','opcional_documental','38',['crânio','se houver']],
    [NP,'RM','opcional_documental','38',['crânio','se houver']],
    [NP,'APRESENTACAO','condicional','36',['anexados ou descritos']],
    [NP,'RESPONSAVEL','obrigatorio','36',['necessária','familiar ou responsável']],
    [NP,'INDICACAO','ressalva',null,['não são pré-requisitos documentais obrigatórios','não dispensa exames clinicamente indicados']],
    [OM,'IDADE','condicional','46',['A partir de 18 anos']],
    [OM,'TOTAL','criterio','48',['Ruptura total','evidenciada em imagem']],
    [OM,'PARCIAL','criterio','48',['em progressão ou','refratária','tratamento clínico otimizado']],
    [OM,'DOR6','criterio','48',['refratária','tratamento clínico otimizado por 6 meses']],
    [OM,'OA','criterio','48',['potencial indicação cirúrgica','6 meses ou importante prejuízo','atividades de vida diária']],
    [OM,'LUXACAO','criterio','48',['recorrente após avaliação em serviço de emergência']],
    [OM,'MOVIMENTO','obrigatorio','49',['restrição de movimento/prejuízo funcional']],
    [OM,'PRESENCA_LUXACAO','obrigatorio','49',['presença de luxação']],
    [OM,'TRAUMA_PREVIO','obrigatorio','49',['trauma prévio']],
    [OM,'TRATAMENTOS','obrigatorio','49',['tratamento atual','tratamentos prévios']],
    [OM,'RX','obrigatorio','49',['AP + P + axilar']],
    [OM,'USG','obrigatorio','49',['USG de ombro']],
    [OM,'RM','opcional_documental','49',['RM do ombro, se houver']],
    [OM,'TC','condicional_se_houver','49',['apenas','instabilidade ou luxação recidivante','e se houver o exame']],
    [OM,'AVALIACAO','ato_profissional','4',['Exame físico','profissional habilitado','como relato']],
    [OM,'CIRURGIA','condicional','6',['Se houver cirurgia prévia','local, data aproximada, alta, seguimento e urgência','incerteza quando a data for desconhecida']],
    [SG,'IDADE','condicional','219',['18 a 130 anos','Campo Grande']],
    [SG,'GERAL','informar','219',['história, tempo de evolução, exames, tratamentos e medicações','incompletas são devolvidas']],
    [SG,'APS','criterio_da_secao_relacionada','220',['frequente ou persistente','abordagem inicial obrigatória na APS','não uma condição intitulada Dor no Ombro']],
    [SG,'IMAGEM_APS','deverao_ser_informados','220',['deverão ser informados RX AP/perfil e USG']],
    [SG,'ESPECIALISTA','condicional_cirurgia','221',['indicação cirúrgica','especialista em ortopedia geral']],
    [SG,'IMAGEM_CIRURGIA','informar','221',['informar imagem da área','não fornece um pacote próprio de exames']],
    [SG,'CIRURGIA_OMBRO','lista_da_secao','223',['cotovelo/ombro e túnel cubital','não foram corrigidos']],
    [SG,'AGUDOS','urgencia_na_fonte','220',['trauma agudos','osteomielite aguda','urgência/emergência']],
    [SG,'GUIA','regra_do_fluxo_sisreg','14',['carimbo e assinatura','neste fluxo','conforme a identidade entre operador e profissional']],
    [SG,'POS_TELE','condicional_pos_telemedicina','15',['médico assistente da APS','quando a unidade não tem acesso']],
    [SG,'PACTUACAO','limite_de_aplicabilidade','1,19-20',['municípios pactuados','não foi comprovada']]
  ];
  assert.equal(entries.length,42);
  for(const[record,id,requirement,page,phrases]of entries){const rule=record.rules.find(rule=>rule.id===id);assert.ok(rule,id);assert.equal(rule.requirement,requirement,id);if(page)assert.equal(rule.sourceLocations[0].physical,page,id);for(const phrase of phrases)assert.ok(rule.text.includes(phrase),record.id+'/'+id+': '+phrase);}
  assert.deepEqual(NP.rules.find(rule=>rule.id==='CRISE').exceptionRefs,['FEBRIL']);
  assert.deepEqual(OM.rules.find(rule=>rule.id==='RX').views,['AP','P','axilar']);
  assert.equal(OM.rules.find(rule=>rule.id==='OA').anyOf[1].optimizedTreatmentMonths,undefined);
  assert.equal(OM.rules.find(rule=>rule.id==='TC').availability,'se_houver');
  assert.match(NP.professionalBoundary.text,/relato/);assert.match(NP.sourceLimits.text,/não significa dispensa/);
});
test('sem sistema e sem recorte escolhido, cliente pede escolha e não usa catálogo geral',async()=>{
  const c=await client();
  for(const question of ['Quais exames para dor no ombro?','Convulsão infantil: quais exames?']){
    assert.equal(c.api.questionDecision(question).kind,'choose_system');assert.equal(c.api.localOnlyQuestion(question),true);
    assert.deepEqual(clone(c.api.questionContexts(question)),[]);
    const payload=clone(c.requestContext(question));assert.deepEqual(payload.protocols,[]);assert.deepEqual(payload.catalog,[]);
    assert.doesNotMatch(c.api.localAnswer(question),/axilar|USG|EEG|obrigatório/);
  }
  c.pending('shoulder');assert.equal(c.api.questionDecision('Quais exames?').kind,'choose_system');
});
test('recorte escolhido continua isolado; sistema explícito e comparação têm escopos próprios',async()=>{
  const c=await client();
  for(const record of [OM,SG]){const selected=await client();selected.select(record);assert.deepEqual(clone(selected.api.questionContexts('Quais exames para ombro?')).map(p=>p.id),[record.id]);}
  c.select(null);assert.deepEqual(clone(c.api.questionContexts('Quais exames para ombro no DigSaúde?')).map(p=>p.id),[OM.id]);
  assert.deepEqual(clone(c.api.questionContexts('Qual a diferença entre TC e RM no SISREG para ombro?')).map(p=>p.id),[SG.id]);
  assert.equal(c.api.questionDecision('Ombro DigSaúde e SISREG: quais exames?').kind,'choose_system');
  assert.deepEqual(clone(c.api.questionContexts('Compare os sistemas para ombro')).map(p=>p.id),[OM.id,SG.id]);
  const seizure=await client();seizure.select(NP);assert.equal(seizure.api.questionDecision('E quais exames para ombro?').kind,'choose_system');
});
test('escolha curta conserva pergunta, sistema e contexto integral no envio e na contingência',async()=>{
  const c=await client(),question='Quais exames para dor no ombro?';
  assert.match(c.api.localAnswer(question),/escolha/i);
  const payload=clone(c.requestContext('DigSaúde'));
  assert.equal(payload.protocols.length,1);assert.equal(payload.protocols[0].id,OM.id);
  assert.deepEqual(payload.protocols[0].clinicalConditionRecord,OM);assert.match(payload.resolvedQuestion,/Quais exames para dor no ombro/);
  await c.askAssistant('DigSaúde',payload);assert.equal(c.sent.length,1);assert.equal(c.sent[0].originalQuestion,payload.resolvedQuestion);
  const answer=c.api.localAnswer('DigSaúde');assert.match(answer,/AP \+ P \+ axilar/);assert.doesNotMatch(answer,/carimbo e assinatura|RX AP\/perfil/);
  assert.deepEqual(clone(c.requestContext('E a TC?')).protocols.map(p=>p.id),[OM.id]);
  assert.match(c.api.localAnswer('E a TC?'),/instabilidade ou luxação recidivante, e se houver/);
  assert.match(c.api.localAnswer('Ombro DigSaúde e SISREG: quais exames?'),/mais de um sistema/);
  assert.deepEqual(clone(c.requestContext('SISREG')).protocols.map(p=>p.id),[SG.id]);
  assert.match(c.api.localAnswer('SISREG'),/RX AP\/perfil e USG/);
});
test('escolha curta mantém a lacuna dos 17 anos e responde também aos exames perguntados',async()=>{
  const c=await client();assert.match(c.api.localAnswer('Convulsão infantil aos 17 anos: quais exames?'),/escolha/i);
  const payload=clone(c.requestContext('DigSaúde MS'));assert.deepEqual(payload.protocols[0].clinicalAge,{years:17,months:0,days:0});
  const answer=c.api.localAnswer('DigSaúde MS');assert.match(answer,/não define outra rota nem transfere/);assert.match(answer,/Eletroencefalograma \(EEG\), se houver/);
  assert.equal(payload.protocols[0].examesObrigatorios.length,0);assert.equal(payload.protocols[0].recomendadosQuandoDisponiveis.length,3);
});
test('lacunas não viram requisitos, campos de conferência ou obrigação de decisão agora',async()=>{
  const c=await client();
  for(const record of [NP,OM,SG]){
    assert.match(record.sourceNotesPolicy,/não cria.*obrigação/);
    assert.ok(record.uncertainties.every(note=>note.kind));
    const context={record,age:null},projected=c.api.protocolContext(context);
    for(const note of record.uncertainties){assert.ok(!projected.informacoesClinicasObrigatorias.includes(note.text));assert.ok(!projected.examesObrigatorios.includes(note.text));assert.ok(record.sections.every(section=>!section.ruleIds.includes(note.id)));}
    const html=c.api.printDocument(context);assert.doesNotMatch(html,/Fonte, detalhes e pendências|Notas de fonte e pontos em aberto|Estas notas não são uma lista adicional de exigências|data-source-note/);
    assert.ok(html.includes(record.reference));
    if(record.sourceLimits)assert.ok(c.api.printDocument({...context,query:'Qual prazo ou validade?'}).includes(record.sourceLimits.text));
    assert.doesNotMatch(html,/precisa de confirmação com a Regulação/);
  }
  assert.equal(OM.uncertainties.find(note=>note.id==='INDISPONIVEIS').kind,'source_gap');
  const answer=c.api.localAnswer('Como se define tratamento otimizado para ombro DigSaúde?',{record:OM,age:null});
  assert.match(answer,/ausências não criam requisitos adicionais/);
});
test('17/18 anos mantêm limites e lacunas; não recebem destino automático',async()=>{
  const c=await client();
  assert.equal(c.api.ageNotice({years:17,months:0,days:0},NP.id).id,'IDADE17');
  assert.equal(c.api.ageNotice({years:18,months:0,days:0},SG.id).id,'FRONTEIRA18');
  assert.match(c.api.ageNotice({years:18,months:0,days:0},SG.id).text,/não escolhe a especialidade/);
  assert.match(c.api.ageNotice({years:17,months:0,days:0},NP.id).text,/não define outra rota nem transfere/);
});
test('Worker recusa juntar dois sistemas em pergunta genérica sem chamar provedor',async()=>{
  const c=await client(),protocols=[OM,SG].map(record=>clone(c.api.protocolContext({record,age:null})));
  let calls=0,prompt='';const env={AI_PROVIDER:'cloudflare',CLOUDFLARE_AI_FALLBACK_ENABLED:'true',AI:{run:async(model,input)=>{calls++;prompt=input.messages[1].content;return{response:'Somente simulação local.'};}}};
  const request=question=>new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,protocols})});
  const generic=await worker.fetch(request('Quais exames para ombro?'),env);assert.equal(generic.status,200);assert.equal(calls,0);assert.match((await generic.json()).answer,/Escolha DigSaúde/);
  await worker.fetch(request('Quais exames para ombro no SISREG?'),env);assert.equal(calls,1);
  const scoped=JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);assert.deepEqual(scoped.map(p=>p.id),[SG.id]);
  assert.match(prompt,/não cria obrigação de obter confirmação, autorização ou decisão agora/);
});


test('Worker confere versão integral sem provedor e mantém autenticação e validação',async()=>{
  let calls=0;const env={AI_PROVIDER:'cloudflare',AI:{run:async()=>{calls++;throw Error('Provider must not run');}}};
  const request=ids=>new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clinicalConditionProbe:ids})});
  const result=await worker.fetch(request([OM.id,SG.id]),env);assert.equal(result.status,200);assert.deepEqual((await result.json()).records,[OM,SG]);assert.equal(calls,0);
  for(const ids of [[],[OM.id,OM.id],['unknown']])assert.equal((await worker.fetch(request(ids),env)).status,400);
  assert.equal((await worker.fetch(request([OM.id]),{...env,AUTH_ENFORCE_AI:'true'})).status,403);assert.equal(calls,0);
});
test('cliente não chama provedor quando o Worker é antigo ou tem registro diferente',async()=>{
  for(const mode of ['legacy','different']){const c=await client(mode),context=clone(c.requestContext('Quais exames para ombro DigSaúde?'));await assert.rejects(()=>c.askAssistant('Quais exames?',context),e=>e.code==='CLINICAL_WORKER_INCOMPATIBLE');assert.equal(c.probes.length,1);assert.equal(c.sent.length,0);}
  const c=await client(),context=clone(c.requestContext('Quais exames para ombro DigSaúde?'));await c.askAssistant('Quais exames?',context);assert.equal(c.probes.length,1);assert.equal(c.sent.length,1);
});
test('ponte conserva a sondagem técnica sem transformá-la em pergunta clínica',async()=>{
  let captured;const endpoint='https://local.invalid/api/ia',window={REGULATION_AI_CONFIG:{endpoint},fetch:async(input,init)=>{captured=JSON.parse(init.body);return{ok:true};}};
  const context=vm.createContext({window,URL,TextEncoder});vm.runInContext(read('js/pre-regulation-bridge.js'),context);
  await window.fetch(endpoint,{method:'POST',body:JSON.stringify({clinicalConditionProbe:[OM.id]})});assert.deepEqual(captured,{clinicalConditionProbe:[OM.id]});
});


test('outros motivos explícitos saem do piloto e continuam no catálogo normal',async()=>{
  const c=await client();assert.equal(c.api.questionDecision('Quais exames para diabetes?'),null);assert.equal(c.api.legacyTopicTerms().length,0);c.select(NP);assert.equal(c.api.questionDecision('E se não houver melhora?').contexts[0].record.id,NP.id);assert.equal(c.api.questionDecision('Para adulto?').kind,'source_limit');assert.equal(c.api.questionDecision('Quais exames para diabetes?'),null);assert.equal(c.api.localAnswer('Quais exames para diabetes?'),null);
  const context=clone(c.requestContext('Quais exames para diabetes?'));assert.ok(context.protocols.some(p=>p.id==='endocrinologia'));assert.ok(context.protocols.every(p=>!p.clinicalConditionRecord));
  assert.equal(c.api.questionDecision('E quais documentos?'),null);assert.ok(c.api.legacyTopicTerms().includes('diabetes'));assert.ok(clone(c.requestContext('E quais documentos?')).protocols.some(p=>p.id==='endocrinologia'));assert.equal(context.selectedProtocolId,null);
  assert.equal(c.api.questionDecision('Convulsão infantil no DigSaúde: quais exames?').contexts[0].record.id,NP.id);
  const shoulder=await client();shoulder.select(OM);assert.equal(shoulder.api.questionDecision('Como encaminhar para cardiologia?'),null);
});
test('especialidade genérica e idade isolada não escolhem convulsão',async()=>{
  const c=await client();assert.equal(c.api.questionDecision('17 anos'),null);assert.equal(c.api.matches('17 anos'),false);
  const autism=c.api.questionDecision('Quais requisitos de Neuropediatria no DigSaúde para autismo?');assert.equal(autism.kind,'records');assert.equal(autism.contexts[0].record.id,'digsaude.neuropediatria.tea');
  const selected=await client();selected.select(NP);assert.equal(selected.api.questionDecision('17 anos').contexts[0].age.years,17);
  assert.equal(selected.api.questionDecision('Neuropediatria no DigSaúde para autismo?').contexts[0].record.id,'digsaude.neuropediatria.tea');
});
test('registro indisponível não bloqueia assunto fora do piloto',async()=>{
  const c=await client('compatible',NP.id);c.fail(NP);assert.equal(c.api.unavailable(),true);assert.equal(c.api.unavailable('Quais exames para diabetes?'),false);assert.equal(c.api.localOnlyQuestion('Quais exames para diabetes?'),false);assert.equal(c.api.localAnswer('Quais exames para diabetes?'),null);
  assert.ok(clone(c.requestContext('Quais exames para diabetes?')).protocols.every(p=>!p.clinicalConditionRecord));
  assert.equal(c.api.unavailable('Convulsão infantil no DigSaúde: quais exames?'),true);assert.match(c.api.localAnswer('Convulsão infantil no DigSaúde: quais exames?'),/registro integral/);
});
test('sondagem conserva 403, 429 e 503 e a política de sessão/cooldown',async()=>{
  for(const status of [403,429,503]){const c=await client('http-'+status),context=clone(c.requestContext('Quais exames para ombro DigSaúde?'));let failure;try{await c.askAssistant('Quais exames?',context);}catch(error){failure=error;}assert.equal(failure.status,status);assert.equal(failure.code,'PROBE_HTTP_FAILURE');assert.equal(c.sent.length,0);assert.equal(c.pause(failure),status!==403);if(status===403)assert.match(c.friendly(failure),/sessão/);else assert.doesNotMatch(c.friendly(failure),/não corresponde/);}
});


test('aliases de DigSaúde concordam entre cliente e Worker em seleção e comparação',async()=>{
  for(const alias of ['DigSaúde','Digsus','Telessaúde','Teleatendimento']){
    const c=await client();c.api.localAnswer('Quais exames para dor no ombro?');const single=clone(c.requestContext(alias));assert.equal(single.protocols[0].id,OM.id);assert.match(single.resolvedQuestion,/Quais exames para dor no ombro/);const answer=c.api.localAnswer(alias);assert.match(answer,/AP \+ P \+ axilar/);assert.doesNotMatch(answer,/Ruptura total/);
    const protocols=[OM,SG].map(record=>clone(c.api.protocolContext({record,age:null})));let prompt='';const env={AI_PROVIDER:'cloudflare',CLOUDFLARE_AI_FALLBACK_ENABLED:'true',AI:{run:async(model,input)=>{prompt=input.messages[1].content;return{response:'Simulação.'};}}};
    for(const[question,expected]of [['Compare '+alias+' e SISREG para dor no ombro',[OM.id,SG.id]],['Qual a diferença entre TC e RM no '+alias+' para ombro?',[OM.id]]]){
      const response=await worker.fetch(new Request('https://local.invalid/api/ia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,protocols})}),env);assert.equal(response.status,200);const scoped=JSON.parse(prompt.split('PROTOCOLOS MAIS RELEVANTES:\n')[1].split('\n\nCATÁLOGO OPERACIONAL RESUMIDO:')[0]);assert.deepEqual(scoped.map(p=>p.id),expected);assert.deepEqual(clone(c.api.questionContexts(question)).map(p=>p.id),expected);
    }
  }
});
