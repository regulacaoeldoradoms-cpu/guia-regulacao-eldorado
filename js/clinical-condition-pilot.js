'use strict';
// Condition records are separate from the historical mirror and from each other.
(() => {
  const ID='digsaude.neuropediatria.convulsao-epilepsia', SHOULDER='digsaude.ortopedia.dor-no-ombro', RELATED='sisreg-campo-grande.ortopedia.referencias-ombro', VERSION='20261016-3';
  const descriptors=[
    {id:ID,file:'convulsao-epilepsia-20261016',revision:'piloto-convulsao-20261016-3',expected:['IDADE','CRISE','MONO','EFEITOS','DIFICIL','FEBRIL','QUADRO','TRATAMENTO','NEURO','EEG','TC','RM','APRESENTACAO','RESPONSAVEL','INDICACAO']},
    {id:SHOULDER,file:'dor-no-ombro-20261016',revision:'piloto-ombro-20261016-2',expected:['IDADE','TOTAL','PARCIAL','DOR6','OA','LUXACAO','MOVIMENTO','PRESENCA_LUXACAO','TRAUMA_PREVIO','TRATAMENTOS','RX','USG','RM','TC','AVALIACAO','CIRURGIA']},
    {id:RELATED,file:'ombro-referencias-sisreg-cg-20261016',revision:'referencias-ombro-cg-20261016-2',expected:['IDADE','GERAL','APS','IMAGEM_APS','ESPECIALISTA','IMAGEM_CIRURGIA','CIRURGIA_OMBRO','AGUDOS','GUIA','POS_TELE','PACTUACAO']}
  ];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(), clone=value=>JSON.parse(JSON.stringify(value));
  const records=new Map(),errors=new Map(),sourceFor=d=>'/data/clinical-conditions/'+d.file+'.json?v='+VERSION;
  let conversationContext=null,pendingQuestion=null,bypassPilotContext=false,legacyTerms=[];
  const ready=Promise.all(descriptors.map(async d=>{
    const controller=new AbortController();let timer;
    try{
      const value=await Promise.race([
        fetch(sourceFor(d),{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}),
        new Promise((resolve,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Tempo de carregamento excedido'));},4000);})
      ]);
      if(value.id!==d.id||value.revision!==d.revision||!Array.isArray(value.rules)||value.rules.length!==d.expected.length||new Set(value.rules.map(r=>r.id)).size!==d.expected.length||d.expected.some(id=>!value.rules.some(r=>r.id===id&&typeof r.text==='string'&&r.text.trim()))||!Array.isArray(value.sources)||!value.sources.length||!Array.isArray(value.uncertainties)||!value.uncertainties.length||!Array.isArray(value.sections)||value.sections.flatMap(s=>s.ruleIds).some(id=>!value.rules.some(r=>r.id===id)))throw new Error('Revisão ou integridade do registro incompatível');
      const presented=['IDADE',...value.rules.filter(r=>r.group==='referral').flatMap(r=>[r.id,...(r.exceptionRefs||[])]),...value.sections.flatMap(s=>s.ruleIds)];
      if(presented.length!==d.expected.length||new Set(presented).size!==d.expected.length||d.expected.some(id=>!presented.includes(id))||value.parentProtocolId!==(d.id===ID?'neuropediatria':'ortopedia')||value.rules.some(r=>!r.sourceRefs?.length||r.sourceRefs.some(ref=>!value.sources.some(source=>source.id===ref))))throw new Error('Apresentação ou vínculo de fonte incompleto');
      records.set(value.id,value);
    }catch(error){errors.set(d.id,error.message);}finally{clearTimeout(timer);}
  }));
  const recordFor=value=>records.get(typeof value==='string'?value:value?.id||ID);
  function matchingIds(query){
    const q=norm(query);if(/\bcore\b/.test(q))return[];
    if(/ombro|manguito/.test(q)){const system=explicitSystem(query);return system==='sisreg'?[RELATED]:system==='digsaude'?[SHOULDER]:[SHOULDER,RELATED];}
    return (/convuls|epilep/.test(q))&&!/\badult[oa]|\bsisreg|campo grande/.test(q)?[ID]:[];
  }
  function matches(query,id){return id?matchingIds(query).includes(id):matchingIds(query).length>0;}
  function clearConditionUrl(){conversationContext=null;pendingQuestion=null;bypassPilotContext=false;legacyTerms=[];document.body?.classList.remove('clinical-pilot-active');const url=new URL(location.href);if(descriptors.some(d=>d.id===url.searchParams.get('condicao'))){url.searchParams.delete('condicao');history.replaceState(null,'',url);}}
  function ageFromText(text){const m=norm(text).match(/\b(\d{1,3})\s*anos?(?:\s*[,e]?\s*(\d{1,2})\s*mes(?:es)?(?:\s*[,e]?\s*(\d{1,2})\s*dias?)?)?/);return m?{years:Number(m[1]),months:Number(m[2]||0),days:Number(m[3]||0)}:null;}
  function ageNotice(age,value=ID){
    const record=recordFor(value);if(!record||!age)return null;const exact=record.contextualAlerts?.find(a=>a.trigger.ageYears===age.years);if(exact)return clone(exact);
    const eligibility=record.rules.find(r=>r.id==='IDADE'),compare=(a,b)=>a.years-b.years||a.months-b.months||a.days-b.days;
    return (eligibility.ageMinimum&&compare(age,eligibility.ageMinimum)<0)||(eligibility.ageMaximum&&compare(age,eligibility.ageMaximum)>0)||(eligibility.ageMaximumYears!==undefined&&age.years>eligibility.ageMaximumYears)?{id:'FORA_FAIXA',title:'Idade fora da faixa descrita neste recorte',text:eligibility.text+' Confirme o fluxo com a Regulação; o piloto não define uma rota alternativa.'}:null;
  }
  function active(){const root=document.querySelector('#detailPanel > [data-clinical-condition-id], #receptionDetail > [data-clinical-condition-id]'),record=root&&recordFor(root.dataset.clinicalConditionId);return record?{record:clone(record),age:ageFromText(root.querySelector('[data-pilot-age]')?.value||''),query:root.dataset.clinicalQuery||'',channel:root.dataset.clinicalChannel}:null;}
  function unavailable(question){const root=document.querySelector('[data-clinical-pilot-unavailable]');return question===undefined?Boolean(root):Boolean(root&&questionDecision(question)?.kind==='unavailable');}
  const searchKind=query=>/ombro|manguito/.test(norm(query))?'shoulder':/convuls|epilep/.test(norm(query))?'seizure':null;
  function awaitingSystemChoice(){return Boolean(document.querySelector('[data-clinical-system-choice]'));}
  function explicitSystem(query){const q=norm(query),dig=/dig\s*saude|digsus|telessaude|teleatendimento/.test(q),sg=/\bsisreg|campo grande/.test(q);return /\bcore\b/.test(q)?'core':dig&&sg?'multiple':dig?'digsaude':sg?'sisreg':null;}
  function comparisonRequested(query){const q=norm(query);return /outro sistema/.test(q)||/compar|diferen/.test(q)&&(/sistemas|fluxos/.test(q)||explicitSystem(query)==='multiple');}
  function systemReply(query){return /^(?:(?:pelo|no|para|usar|o|sistema)\s+)*(?:dig\s*saude(?:\s*ms)?|digsus|telessaude|teleatendimento|sisreg(?:\s*\/\s*campo grande)?|campo grande)(?:\s+por favor)?[.!]?\s*$/.test(norm(query).trim());}
  function targetsOtherTopic(question,record){
    const generic=new Set('para com sem uma uns das dos que qual quais como pelo pela esta estao pode deve ser tem ter sobre entre quando precisa preciso necessario necessaria solicitar encaminhar encaminhamento paciente exames exame documentos documento criterios criterio informacoes informacao clinico clinica atendimento teleatendimento digs us digsus digsaude telessaude sisreg campo grande core anos ano meses dias idade etaria faixa haver houver familiar responsavel obrigatorio obrigatoria opcional condicional novo nova outro outra agora antes depois atual anterior apenas tambem entao proceder fazer sistema sistemas fluxo fluxos compare comparar comparacao diferenca diferencas adulto adulta pediatrico pediatrica infantil melhora piora resposta dose posologia neurologico neurologica'.split(' '));
    const terms=(norm(question).match(/[a-z]{3,}/g)||[]).filter(term=>!generic.has(term));
    let legacy=[];try{if(typeof state!=='undefined'&&Array.isArray(state.protocols))legacy=state.protocols;}catch{}
    if(!legacy.length)return [];
    const words=text=>new Set(norm(text).match(/[a-z]{3,}/g)||[]);
    const own=words([record?.condition,record?.specialty,...(record?.rules||[]).map(rule=>rule.text),...(record?.sections||[]).flatMap(section=>[section.title,section.label,section.note])].join(' '));
    const explicitSubject=/\b(?:para|sobre|por|caso de|paciente com)\b/.test(norm(question));
    const catalog=words(legacy.map(protocol=>[protocol.nome,...(protocol.tags||[]).filter(tag=>norm(tag).split(/\s+/).length<=3),...(protocol.subprotocolos||[]).map(sub=>sub.titulo),...(explicitSubject?[protocol.resumo,protocol._searchText]:[])].join(' ')).join(' '));
    return [...new Set(terms.filter(term=>!own.has(term)&&(catalog.has(term)||term.startsWith('autis')&&[...catalog].some(word=>word.startsWith('autis')))))];
  }
  function questionDecision(question,context){
    const detected=searchKind(question);if(detected){bypassPilotContext=false;legacyTerms=[];}
    if(context===undefined)context=conversationContext||(!bypassPilotContext?active():null);
    const q=norm(question),pending=document.querySelector('[data-clinical-system-choice]'),failed=document.querySelector('[data-clinical-pilot-unavailable]');
    const failedFamily=failed?.dataset.clinicalPilotUnavailable===ID?'seizure':failed?.dataset.clinicalPilotUnavailable?'shoulder':null;
    const inherited=bypassPilotContext?null:pendingQuestion?.family||context?.record.searchKind||pending?.dataset.clinicalSystemChoice||failedFamily;
    const inheritedRecord=context?.record||recordFor(inherited==='seizure'?ID:SHOULDER);
    const otherTerms=!detected&&(inherited||bypassPilotContext)?targetsOtherTopic(question,inheritedRecord):[];
    if(otherTerms.length){conversationContext=null;pendingQuestion=null;bypassPilotContext=true;legacyTerms=otherTerms;return null;}
    const family=detected||inherited;
    if(!family)return null;
    const system=explicitSystem(question),comparison=comparisonRequested(question);
    if(system==='core')return{kind:'source_limit',text:'CORE: nenhuma fonte clínica ambulatorial foi validada neste recorte. Não usar os requisitos do DigSaúde ou de Campo Grande como regras CORE.'};
    if(family==='seizure'&&(/\badult[oa]/.test(q)||system==='sisreg'||comparison))return{kind:'source_limit',text:'Este piloto contém Neuropediatria no DigSaúde. O enquadramento adulto e o fluxo SISREG/Campo Grande não foram integrados a este recorte. Suas faixas e exigências não podem ser preenchidas pelas regras do DigSaúde.'};
    if(system==='multiple'&&!comparison)return{kind:'choose_system',family,query:question,text:'A pergunta menciona mais de um sistema. Escolha DigSaúde MS ou SISREG/Campo Grande antes de consultar as exigências, ou peça uma comparação explícita.'};
    let ids;
    if(comparison&&family==='shoulder')ids=[SHOULDER,RELATED];
    else if(system)ids=[family==='shoulder'?(system==='sisreg'?RELATED:SHOULDER):ID];
    else if(context?.record.searchKind===family)ids=[context.record.id];
    else return{kind:'choose_system',family,query:question,text:family==='shoulder'?'Para Dor no Ombro, escolha DigSaúde MS ou SISREG/Campo Grande antes de consultar as exigências. Os recortes ficam separados.':'Para Convulsão/Epilepsia, escolha o sistema antes de consultar as exigências. Este piloto contém o recorte de Neuropediatria no DigSaúde MS.'};
    if(ids.some(id=>!recordFor(id)))return{kind:'unavailable',text:'O registro integral do recorte solicitado não está disponível. Nenhuma lista geral foi usada como substituta.'};
    const basis=pendingQuestion?.question||(systemReply(question)?context?.query:null);
    const effectiveQuestion=!detected&&basis&&system?(norm(basis).endsWith(norm(question))?basis:basis+' '+question):question;
    return{kind:'records',contexts:ids.map(id=>({record:clone(recordFor(id)),age:ageFromText(question)||ageFromText(pendingQuestion?.question)||(context?.record.searchKind===family?context.age:null),query:effectiveQuestion,channel:context?.channel||'guide'}))};
  }
  function rememberDecision(decision){if(decision.kind==='records'&&decision.contexts.length===1){conversationContext=decision.contexts[0];pendingQuestion=null;}else if(decision.kind==='records'&&!conversationContext&&!active())pendingQuestion={family:decision.contexts[0].record.searchKind,question:decision.contexts[0].query};}
  function localOnlyQuestion(question,context){const decision=questionDecision(question,context);return Boolean(decision&&decision.kind!=='records');}
  function acceptsQuestion(question,context=active()){
    const r=context&&recordFor(context.record),q=norm(question);if(!r||/\bcore\b/.test(q))return false;
    if(r.id===ID)return !/\badult[oa]|\bsisreg|ombro|ortoped/.test(q);
    if(/convuls|epilep|neuropediatr/.test(q))return false;
    if(/compar|diferen|outro sistema/.test(q))return true;
    if(/\bsisreg|campo grande/.test(q))return r.systemKind==='sisreg_reference';
    if(/digsaude|digsus/.test(q))return r.systemKind==='digsaude';return true;
  }
  function protocolContext(context=active()){
    const r=context&&recordFor(context.record);if(!r)return null;const texts=g=>r.rules.filter(rule=>rule.group===g).map(rule=>rule.text),docs=req=>r.rules.filter(rule=>rule.group==='documents'&&rule.requirement===req).map(rule=>rule.text),notice=ageNotice(context.age,r);
    return{id:r.id,nome:r.specialty+' - '+r.condition,categoria:r.category,faixaEtaria:texts('eligibility').join(' '),viaAcesso:r.system,situacaoTeleconsulta:'Piloto em revisão; oferta, vigência e aplicabilidade municipal não confirmadas.',resumo:r.condition,fluxoLocal:texts('appointment').concat(texts('documentPresentation'),texts('scope')).join(' '),criteriosParaEncaminhar:texts('referral'),informacoesClinicasObrigatorias:texts('description').concat(r.rules.filter(rule=>rule.group==='clinicalAssessment'&&rule.requirement==='obrigatorio').map(rule=>rule.text)),examesObrigatorios:docs('obrigatorio'),examesCondicionais:docs('condicional_se_houver'),recomendadosQuandoDisponiveis:docs('opcional_documental'),elementosPriorizacao:[],alertas:texts('exclusion').concat(texts('editorialSafeguard'),texts('alert'),r.systemBoundary?[r.systemBoundary]:[],notice?[notice.text]:[]),subprotocolos:[],praticaRegulatoria:null,fontes:r.sources.map(s=>s.title+(s.version?' '+s.version:'')),ultimaConferencia:'Matriz e conferência visual comunicadas pela frente documental em 16/10/2026; confirmação institucional pendente.',clinicalConditionId:r.id,clinicalConditionRecord:clone(r),clinicalAge:context.age?clone(context.age):null,clinicalContextualAlerts:notice?[notice]:[]};
  }
  function questionContexts(question){const decision=questionDecision(question);if(decision?.kind==='records')rememberDecision(decision);return decision?decision.kind==='records'?decision.contexts.map(protocolContext):[]:null;}
  const noticeMarkup=n=>`<div class="cp-alert"><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p></div>`;
  const pendingMarkup=(r,includeLimits=false)=>`<section class="cp-pending"><h3>Notas de fonte e pontos em aberto</h3><p>Estas notas não são uma lista adicional de exigências.</p><ul>${r.uncertainties.map(u=>`<li data-source-note="${esc(u.kind)}"><strong>${esc(u.title)}:</strong> ${esc(u.text)}</li>`).join('')}</ul>${includeLimits&&r.sourceLimits?'<p>'+esc(r.sourceLimits.text)+'</p>':''}</section>`;
  function sourcesMarkup(r){return `<p>${esc(r.provenance)}</p>${r.sources.map(s=>`<p><strong>${esc(s.title)}${s.version?' '+esc(s.version):''}</strong>${s.date?' - '+esc(s.date):''}${s.pages?' - físicas '+esc(s.pages.physical||s.pages.printed)+' / impressas '+esc(s.pages.printed):''}. ${esc(s.verification)}${s.fileHash?'<br>SHA-256: <code>'+esc(s.fileHash)+'</code>. '+esc(s.hashVerification):s.fileHash===null?' Hash ainda não vinculado.':''}</p>`).join('')}<p>${esc(r.sourceLimits?.text||'')}</p><p>${esc(r.correspondence?.notes||'')}</p>`;}
  function contentMarkup(r,age,channel,query=''){
    const notice=ageNotice(age,r),ruleMarkup=(id,tag='span')=>`<${tag} data-clinical-rule="${id}">${esc(r.rules.find(rule=>rule.id===id).text)}</${tag}>`,check=id=>channel==='reception'?`<label class="cp-check"><input type="checkbox" aria-label="Consta no encaminhamento: ${esc(r.rules.find(rule=>rule.id===id).text)}"> Consta no encaminhamento</label>`:'';
    const referral=r.rules.filter(rule=>rule.group==='referral'),sections=r.sections.map(s=>`<div class="cp-requirement"><p class="cp-label">${esc(s.label)}</p><h3>${esc(s.title)}</h3><ul>${s.ruleIds.map(id=>`<li>${ruleMarkup(id)}${s.receptionCheck?check(id):''}</li>`).join('')}</ul>${s.note?`<p>${esc(s.note)}</p>`:''}${s.availabilityNote?`<p class="cp-alert">${esc(s.availabilityNote)}</p>`:''}</div>`).join('');
    return `<p class="cp-status">${r.systemKind==='sisreg_reference'?'Seções relacionadas em revisão - pactuação não confirmada':'Piloto em revisão - sem vigência confirmada'}</p><p class="cp-path">${esc(r.system)} → ${esc(r.specialty)}</p><h2>${esc(r.condition)}</h2><p><strong>Faixa etária:</strong> ${ruleMarkup('IDADE')}</p>
      ${channel!=='print'?`<label class="cp-age">Faixa etária para conferência <span>(opcional)</span><input data-pilot-age type="text" autocomplete="off" placeholder="Ex.: 17 anos" value="${esc(age?age.years+' anos'+(age.months?' '+age.months+' meses':'')+(age.days?' '+age.days+' dias':''):'')}"></label>`:''}<div data-pilot-age-notice role="status">${notice?noticeMarkup(notice):''}</div>
      ${r.systemBoundary?`<p class="cp-scope">${esc(r.systemBoundary)}</p>`:''}${r.sourceLimits&&/prazo|validade|crm|solicitante|urgencia|sem exame/.test(norm(query))?`<p class="cp-alert">${esc(r.sourceLimits.text)}</p>`:''}${r.id===ID&&/febril simples/.test(norm(query))?'<p class="cp-alert"><strong>Convulsão febril simples:</strong> está excluída do critério de episódios sugestivos de crise. O piloto não define encaminhamento por esse critério nem inventa outra rota.</p>':''}
      ${channel==='reception'?'<p class="cp-scope">A recepção confere somente se a informação está registrada ou se o exame foi apresentado. Não realiza avaliação clínica nem define diagnóstico, elegibilidade ou urgência. As marcações são locais e não alteram a impressão.</p>':''}
      <div class="cp-grid${referral.length?'':' cp-reference-layout'}">${referral.length?`<section><h3>Quando encaminhar</h3><p>Identifique o critério que sustenta o encaminhamento.</p><ol>${referral.map(rule=>`<li>${ruleMarkup(rule.id)}${rule.exceptionRefs?`<p class="cp-exclusion"><strong>Exclusão:</strong> ${rule.exceptionRefs.map(id=>ruleMarkup(id)).join(' ')}</p>`:''}</li>`).join('')}</ol></section>`:''}<section>${sections}</section></div>
      <p class="cp-reference">${esc(r.reference)}</p>${channel==='print'?pendingMarkup(r,true)+`<p>Registro ${esc(r.id)} - revisão ${esc(r.revision)}.</p>`:`<div class="cp-actions"><button type="button" data-pilot-print>Imprimir este recorte</button></div><details class="cp-sources"><summary>Fonte, detalhes e pendências</summary>${sourcesMarkup(r)}${pendingMarkup(r)}<p>Registro ${esc(r.id)} - revisão ${esc(r.revision)}. A IA recebe o registro integral; dúvidas não representam confirmação de oferta ou vigência.</p></details>`}`;
  }
  function render(protocol,options={},channel='guide'){
    const descriptor=descriptors.find(d=>d.id===options.conditionId),r=descriptor&&recordFor(descriptor.id),parent=r?.parentProtocolId||(descriptor?.id===ID?'neuropediatria':descriptor?'ortopedia':'');
    if(!descriptor||protocol?.id!==parent){document.body?.classList.remove('clinical-pilot-active');return false;}
    const panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');if(!panel)return false;document.body?.classList.add('clinical-pilot-active');
    conversationContext=null;pendingQuestion=null;bypassPilotContext=false;legacyTerms=[];
    if(!r){panel.innerHTML=`<div class="clinical-pilot" data-clinical-pilot-unavailable="${descriptor.id}"><p class="cp-alert">Não foi possível carregar o registro integral do piloto (${esc(errors.get(descriptor.id)||'carregando')}). Nenhuma lista geral foi usada como substituta.</p></div>`;return true;}
    const query=options.query??document.getElementById(channel==='reception'?'receptionSearch':'sideSearchInput')?.value??'',age=options.age||ageFromText(query);
    panel.innerHTML=`<article class="clinical-pilot" data-clinical-condition-id="${r.id}" data-clinical-channel="${channel}" data-clinical-query="${esc(query)}">${contentMarkup(r,age,channel,query)}</article>`;
    document.querySelectorAll('#protocolList .protocol-card').forEach(card=>card.classList.remove('active'));const root=panel.firstElementChild;
    root.querySelector('[data-pilot-age]')?.addEventListener('input',event=>{const n=ageNotice(ageFromText(event.target.value),r);root.querySelector('[data-pilot-age-notice]').innerHTML=n?noticeMarkup(n):'';});root.querySelector('[data-pilot-print]')?.addEventListener('click',printActive);
    if(channel==='guide'){const url=new URL(location.href);url.searchParams.set('protocolo',protocol.id);url.searchParams.set('condicao',r.id);history.replaceState(null,'',url);}return true;
  }
  function addSearchChoice(protocols,open,channel='guide'){
    const query=document.getElementById(channel==='reception'?'receptionSearch':'sideSearchInput')?.value||'',ids=matchingIds(query),list=document.getElementById(channel==='reception'?'receptionProtocolList':'protocolList');if(!list||list.querySelector('[data-pilot-choice]'))return;
    const family=searchKind(query),panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');
    if(!family){if(awaitingSystemChoice()&&panel){clearConditionUrl();panel.innerHTML='<div class="loading">Selecione uma especialidade ou exame.</div>';}return;}
    const current=active(),offered=[];
    const showChoice=()=>{
      if(!panel||current&&matches(query,current.record.id))return;
      clearConditionUrl();document.body?.classList.add('clinical-pilot-active');
      const system=explicitSystem(query),blocked=system==='core'||family==='seizure'&&(system==='sisreg'||/\badult[oa]/.test(norm(query)));
      panel.innerHTML=`<article class="clinical-pilot" data-clinical-system-choice="${family}"><h2>${blocked?'Recorte não integrado neste piloto':'Escolha o sistema para consultar o motivo'}</h2><p>${blocked?'Este piloto não fornece exigências desse fluxo. As regras de outro sistema não foram usadas como substitutas.':'Cada sistema tem seu próprio recorte. Nenhuma lista de exigências é apresentada antes da escolha.'}</p><div class="cp-actions">${offered.map(id=>`<button type="button" data-pilot-open="${id}">${id===RELATED?'SISREG / Campo Grande':'DigSaúde MS'} →</button>`).join('')}</div></article>`;
      panel.querySelectorAll('[data-pilot-open]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.pilotOpen,parent=protocols.find(p=>p.id===(id===ID?'neuropediatria':'ortopedia'));open(parent,{conditionId:id,query});}));
      document.querySelectorAll('#protocolList .protocol-card').forEach(card=>card.classList.remove('active'));
    };
    if(/ombro|manguito/.test(norm(query))&&/\bcore\b/.test(norm(query))){const box=document.createElement('section');box.className='clinical-pilot-choice';box.innerHTML='<p><strong>CORE: fonte clínica ambulatorial não validada neste recorte.</strong></p><p>Não usar exigências do DigSaúde ou de Campo Grande como regras CORE.</p>';list.prepend(box);showChoice();return;}
    let count=0;for(const id of [...ids].reverse()){
      const r=recordFor(id),protocol=protocols.find(p=>p.id===(id===ID?'neuropediatria':'ortopedia'));if(!protocol)continue;
      if(channel==='guide'){const filter=document.querySelector('[data-filter].active')?.dataset.filter||'todos',category=document.getElementById('categoryFilter')?.value||'todos',allowed=id===RELATED?['todos','sisreg','ambos']:['todos','digsus','ambos'];if(!allowed.includes(filter)||!['todos',protocol.categoria].includes(category))continue;}
      const box=document.createElement('section');box.className='clinical-pilot-choice';box.dataset.pilotChoice=id;const label=id===ID?'Neuropediatria - Convulsão / Epilepsia':id===SHOULDER?'Ortopedia Adulto - Dor no Ombro':'Ombro - seções relacionadas de Campo Grande',system=id===RELATED?'SISREG / Campo Grande':'DigSaúde MS',notice=r&&ageNotice(ageFromText(query),r);
      box.innerHTML=`<p><strong>${esc(label)}</strong></p><p>Escolha o sistema. ${id===RELATED?'Referências relacionadas; pactuação a confirmar.':'Piloto em revisão; oferta a confirmar.'}</p><button type="button" data-pilot-system="${id}">${system} →</button>${notice?noticeMarkup(notice):''}`;
      box.querySelector('button').addEventListener('click',()=>open(protocol,{conditionId:id,query}));list.prepend(box);offered.push(id);count++;
    }
    const element=document.getElementById(channel==='reception'?'receptionResultCount':'resultCount');if(count&&element)element.textContent+=' · '+count+' recorte(s)-piloto';
    showChoice();
  }
  function addDetailChoice(protocol,open,channel='guide'){
    const ids=protocol?.id==='neuropediatria'?[ID]:protocol?.id==='ortopedia'?[SHOULDER,RELATED]:[],panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');if(!ids.length||!panel||panel.querySelector('[data-clinical-condition-id], [data-pilot-detail-choice]'))return;
    const box=document.createElement('section');box.className='clinical-pilot-choice';box.dataset.pilotDetailChoice='true';box.innerHTML='<p><strong>Consultar por motivo e sistema</strong></p>'+ids.map(id=>`<button type="button" data-condition="${id}">${id===ID?'Convulsão / Epilepsia - DigSaúde MS':id===SHOULDER?'Dor no Ombro - DigSaúde MS':'Ombro - seções relacionadas SISREG/Campo Grande'} →</button>`).join('');box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>open(protocol,{conditionId:b.dataset.condition})));panel.prepend(box);
  }
  function localAnswer(question,context){
    const decision=questionDecision(question,context);if(!decision)return null;if(decision.kind!=='records'){if(decision.kind==='choose_system')pendingQuestion={family:decision.family,question:decision.query||question};return decision.text;}
    if(decision){context=decision.contexts[0];rememberDecision(decision);}
    if(!acceptsQuestion(question,context))return null;const r=recordFor(context.record),q=norm(context.query||question),notice=ageNotice(ageFromText(question)||context.age,r),rule=id=>r.rules.find(rule=>rule.id===id).text;
    const lines=[r.specialty+' - '+r.condition,r.system+' - em revisão, sem vigência ou aplicabilidade confirmadas.'];if(notice)lines.push('',notice.title,notice.text);if(r.systemBoundary)lines.push('',r.systemBoundary);
    if(r.id===ID&&/relatorio escolar|bera|m.?chat|snap/.test(q))lines.push('Esse item não consta nos requisitos desta condição-piloto. Não transformar exigências de outros motivos em pré-requisitos.');
    else if(r.id===ID&&/febril simples/.test(q))lines.push(rule('FEBRIL'),'Essa exclusão se refere ao critério de episódios sugestivos de crise; o piloto não define outra rota.');
    else if(r.sourceLimits&&/prazo|validade|crm|solicitante|urgencia|sem exame/.test(q))lines.push(r.sourceLimits.text);
    else if(/idade|etaria/.test(q)||/^\s*\d{1,3}\s*anos?\s*$/.test(q))lines.push(rule('IDADE'));
    else{const exams=/exame|eeg|tomograf|resson|document|anex|\btc\b|\brm\b|\brx\b|usg/.test(q);if(!exams)lines.push('',...r.rules.filter(rule=>rule.group==='referral').map(rule=>'- '+rule.text),...r.rules.filter(rule=>rule.group==='exclusion').map(rule=>'Exclusão: '+rule.text));
      for(const section of r.sections){if(exams&&section.ruleIds.every(id=>r.rules.find(rule=>rule.id===id).group==='description'))continue;lines.push('',section.label+': '+section.title,...section.ruleIds.map(id=>'- '+rule(id)));if(section.note)lines.push(section.note);if(section.availabilityNote)lines.push(section.availabilityNote);}}
    if(r.id===ID&&!lines.some(line=>line.includes(rule('RESPONSAVEL'))))lines.push('',rule('RESPONSAVEL'));
    if(decision?.contexts.length>1){const other=decision.contexts[1].record;lines.push('',other.system+' - recorte separado:',other.systemBoundary,...other.rules.map(rule=>'- '+rule.text),'Fonte do outro recorte: '+other.reference);}
    lines.push('','Notas de fonte (não são exigências adicionais):',...r.uncertainties.map(u=>u.title+': '+u.text),'Fonte consultada: '+r.reference+' Consulta local do piloto.');return lines.join('\n');
  }
  function printDocument(context=active()){
    const r=context&&recordFor(context.record);if(!r)return null;
    return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(r.condition)+' - em revisão</title><style>body{font:18px/1.45 Arial,sans-serif;color:#17343d;margin:0}p{margin:0 0 12px}h2{margin:12px 0 18px}h3{margin:0 0 12px}.cp-label{break-after:avoid}ul,ol{margin:12px 0;padding-left:26px}.clinical-pilot{max-width:900px;margin:auto}.cp-status,.cp-label{font-weight:bold}.cp-grid{display:block}.cp-grid>section{margin:24px 0}.cp-grid li{margin:10px 0}.cp-alert,.cp-exclusion{border-left:3px solid #94671f;background:#fff5df;padding:12px}.cp-requirement,.cp-pending,.cp-reference{border-top:1px solid #b5c5ba;margin-top:20px;padding-top:18px}h2,h3{break-after:avoid}li,.cp-requirement,.cp-pending{break-inside:avoid}@page{size:A4;margin:18mm}</style><article class="clinical-pilot">'+contentMarkup(r,context.age,'print',context.query)+'</article></html>';
  }
  function printActive(){const html=printDocument();if(!html)return;const popup=window.open('','_blank');if(!popup){window.alert('Permita abrir a orientação de impressão deste piloto.');return;}popup.document.open();popup.document.write(html);popup.document.close();popup.focus();popup.print();}
  window.ClinicalConditionPilot={legacyTopicTerms:()=>bypassPilotContext?[...legacyTerms]:[],ID,SHOULDER,RELATED,REVISION:descriptors[0].revision,VERSION,SOURCE:sourceFor(descriptors[0]),ready,matches,clearConditionUrl,ageFromText,ageNotice,active,unavailable,awaitingSystemChoice,localOnlyQuestion,questionDecision,acceptsQuestion,protocolContext,questionContexts,render,addSearchChoice,addDetailChoice,localAnswer,printDocument,record:(id=ID)=>recordFor(id)?clone(recordFor(id)):null};
})();
