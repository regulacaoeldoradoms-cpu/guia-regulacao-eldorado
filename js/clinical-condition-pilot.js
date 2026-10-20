'use strict';
// Condition records are separate from the historical mirror and from each other.
(() => {
  const ID='digsaude.neuropediatria.convulsao-epilepsia', SHOULDER='digsaude.ortopedia.dor-no-ombro', RELATED='sisreg-campo-grande.ortopedia.referencias-ombro', TENDON='digsaude.ortopedia.bursite-tendinite', HEADACHE='digsaude.neuropediatria.cefaleia', DEV='digsaude.neuropediatria.atraso-regressao-desenvolvimento', TEA='digsaude.neuropediatria.tea', ADHD='digsaude.neuropediatria.tdah-tod', LEARN='digsaude.neuropediatria.transtornos-aprendizagem', MOVE='digsaude.neuropediatria.disturbios-movimento', INFLAM='digsaude.neuropediatria.doencas-neurologicas-inflamatorias', VERSION='20261020-4';
  const descriptors=[
    {id:ID,file:'convulsao-epilepsia-20261016',revision:'piloto-convulsao-20261016-3',expected:['IDADE','CRISE','MONO','EFEITOS','DIFICIL','FEBRIL','QUADRO','TRATAMENTO','NEURO','EEG','TC','RM','APRESENTACAO','RESPONSAVEL','INDICACAO']},
    {id:SHOULDER,file:'dor-no-ombro-20261016',revision:'piloto-ombro-20261016-2',expected:['IDADE','TOTAL','PARCIAL','DOR6','OA','LUXACAO','MOVIMENTO','PRESENCA_LUXACAO','TRAUMA_PREVIO','TRATAMENTOS','RX','USG','RM','TC','AVALIACAO','CIRURGIA']},
    {id:RELATED,file:'ombro-referencias-sisreg-cg-20261016',revision:'referencias-ombro-cg-20261016-2',expected:['IDADE','GERAL','APS','IMAGEM_APS','ESPECIALISTA','IMAGEM_CIRURGIA','CIRURGIA_OMBRO','AGUDOS','GUIA','POS_TELE','PACTUACAO']},
    {id:TENDON,file:'bursite-tendinite-20261016',revision:'piloto-bursite-20261016-1',expected:['IDADE','REFRATARIA6','DOR','EVOLUCAO','FATORES','FUNCAO','TRAUMA','RX','USG']},
    {id:HEADACHE,file:'cefaleia-neuropediatria-20261016',revision:'piloto-cefaleia-20261016-1',expected:['IDADE','APS2','INVESTIGACAO','EXAME_ALTERADO','INDISPONIVEL_APS','ALERTAS','PADRAO','PROGRESSAO','SONO','ATIVIDADES','ESFORCO','QUADRO','NEURO','DIARIO','TC','RM','APRESENTACAO','RESPONSAVEL']}
,
    {id:DEV,file:'neuropediatria-atraso-regressao-desenvolvimento-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","MARCOS","HIPOTONIA","PARALISIA","PERIMETRO","MORFOLOGIA","LINGUAGEM","PERDA","ESCOLA","NEURO","TERAPIAS","TC","RM","LAB","QUADRO","RESPONSAVEL"]},
    {id:TEA,file:'neuropediatria-tea-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","SUSPEITA","DISMORFIA","CONSANGUINIDADE","INSTRUMENTO","LAUDOS","MEDICACOES","ESCOLA","BERA","MULTIPROF","NEUROPREV","QUADRO","RESPONSAVEL"]},
    {id:ADHD,file:'neuropediatria-tdah-tod-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","SUSPEITA","QUATRO","SEIS","SNAP","RELATORIO","ESCOLA","BERA","LAUDOS","MEDICACOES","MULTIPROF","NEUROPREV","QUADRO","RESPONSAVEL"]},
    {id:LEARN,file:'neuropediatria-transtornos-aprendizagem-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","NEUROFEN","SEISMESES","ESCOLA","AUDIOMETRIA","LAUDOS","MEDICACOES","PSICOPED","NEUROPSICO","MULTIPROF","NEUROPREV","QUADRO","RESPONSAVEL"]},
    {id:MOVE,file:'neuropediatria-disturbios-movimento-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","ATAXIA","COREIA","DISTONIA","NEURO","LAB","TC","RM","ENMG","QUADRO","RESPONSAVEL"]},
    {id:INFLAM,file:'neuropediatria-doencas-neurologicas-inflamatorias-20261017',revision:'neuropediatria-20261017-1',expected:["IDADE","CRITERIO","NEURO","LAB","TC","RM","QUADRO","RESPONSAVEL"]}
  ];
  const families={seizure:[ID],shoulder:[SHOULDER,RELATED],tendon:[TENDON],headache:[HEADACHE],development:[DEV],autism:[TEA],adhd:[ADHD],learning:[LEARN],movement:[MOVE],inflammation:[INFLAM]},familyLabels={seizure:'Convulsão/Epilepsia',shoulder:'Dor no Ombro',tendon:'Bursite/Tendinite',headache:'Cefaleia pediátrica',development:'Atraso/Regressão do desenvolvimento',autism:'TEA',adhd:'TDAH/TOD',learning:'Transtornos de aprendizagem',movement:'Distúrbios do movimento',inflammation:'Doenças neurológicas inflamatórias'};
  const familyFor=id=>Object.keys(families).find(family=>families[family].includes(id)),parentFor=id=>[ID,HEADACHE,DEV,TEA,ADHD,LEARN,MOVE,INFLAM].includes(id)?'neuropediatria':'ortopedia';
  const parentProtocolId=id=>descriptors.some(descriptor=>descriptor.id===id)?parentFor(id):null;
  const labelFor=id=>id===ID?'Convulsão / Epilepsia':id===SHOULDER?'Dor no Ombro':id===RELATED?'Ombro - seções relacionadas':id===TENDON?'Bursite / Tendinite' :id===HEADACHE?'Cefaleia':({[DEV]:'Atraso/Regressão do desenvolvimento',[TEA]:'TEA',[ADHD]:'TDAH/TOD',[LEARN]:'Transtornos de aprendizagem',[MOVE]:'Distúrbios do movimento',[INFLAM]:'Doenças neurológicas inflamatórias'}[id]||'Condição');
  function unsupportedNewScope(query,family,system){const q=norm(query);return ['tendon','headache'].includes(family)&&(system==='sisreg'||comparisonRequested(query)||family==='headache'&&/\badult[oa]/.test(q)||family==='tendon'&&/\binfantil|\bpediatr|\bcrianc/.test(q));}
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(), clone=value=>JSON.parse(JSON.stringify(value));
  const records=new Map(),errors=new Map(),sourceFor=d=>'/data/clinical-conditions/'+d.file+'.json?v='+VERSION;
  let conversationContext=null,pendingQuestion=null,bypassPilotContext=false,legacyTerms=[],pendingFamilies=[];
  const ready=Promise.all(descriptors.map(async d=>{
    const controller=new AbortController();let timer;
    try{
      const value=await Promise.race([
        fetch(sourceFor(d),{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}),
        new Promise((resolve,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('Tempo de carregamento excedido'));},4000);})
      ]);
      if(value.id!==d.id||value.revision!==d.revision||!Array.isArray(value.rules)||value.rules.length!==d.expected.length||new Set(value.rules.map(r=>r.id)).size!==d.expected.length||d.expected.some(id=>!value.rules.some(r=>r.id===id&&typeof r.text==='string'&&r.text.trim()))||!Array.isArray(value.sources)||!value.sources.length||!Array.isArray(value.uncertainties)||!value.uncertainties.length||!Array.isArray(value.sections)||value.sections.flatMap(s=>s.ruleIds).some(id=>!value.rules.some(r=>r.id===id)))throw new Error('Revisão ou integridade do registro incompatível');
      const presented=['IDADE',...value.rules.filter(r=>r.group==='referral').flatMap(r=>[r.id,...(r.exceptionRefs||[])]),...value.sections.flatMap(s=>s.ruleIds)];
      if(presented.length!==d.expected.length||new Set(presented).size!==d.expected.length||d.expected.some(id=>!presented.includes(id))||value.parentProtocolId!==parentFor(d.id)||value.rules.some(r=>!r.sourceRefs?.length||r.sourceRefs.some(ref=>!value.sources.some(source=>source.id===ref))))throw new Error('Apresentação ou vínculo de fonte incompleto');
      records.set(value.id,value);
    }catch(error){errors.set(d.id,error.message);}finally{clearTimeout(timer);}
  }));
  const recordFor=value=>records.get(typeof value==='string'?value:value?.id||ID);
  function matchingIds(query){
    const q=norm(query);if(/\bcore\b/.test(q))return[];
    if(searchFamilies(query).length>1)return[];
    const family=searchKind(query),system=explicitSystem(query);
    if(unsupportedNewScope(query,family,system))return[];
    if(family==='shoulder')return system==='sisreg'?[RELATED]:system==='digsaude'?[SHOULDER]:[SHOULDER,RELATED];
    if(family==='seizure')return !/\badult[oa]|\bsisreg|campo grande/.test(q)?[ID]:[];
    return families[family]||[];
  }
  function matches(query,id){return id?matchingIds(query).includes(id):matchingIds(query).length>0;}
  function clearConditionUrl(){conversationContext=null;pendingQuestion=null;bypassPilotContext=false;legacyTerms=[];pendingFamilies=[];document.body?.classList.remove('clinical-pilot-active');const url=new URL(location.href);if(descriptors.some(d=>d.id===url.searchParams.get('condicao'))){url.searchParams.delete('condicao');history.replaceState(null,'',url);}}
  function ageFromText(text){const m=norm(text).match(/\b(\d{1,3})\s*anos?(?:\s*[,e]?\s*(\d{1,2})\s*mes(?:es)?(?:\s*[,e]?\s*(\d{1,2})\s*dias?)?)?/);return m?{years:Number(m[1]),months:Number(m[2]||0),days:Number(m[3]||0)}:null;}
  function ageNotice(age,value=ID){
    const record=recordFor(value);if(!record||!age)return null;const exact=record.contextualAlerts?.find(a=>a.trigger.ageYears===age.years);if(exact)return clone(exact);
    const eligibility=record.rules.find(r=>r.id==='IDADE'),compare=(a,b)=>a.years-b.years||a.months-b.months||a.days-b.days;
    return (eligibility.ageMinimum&&compare(age,eligibility.ageMinimum)<0)||(eligibility.ageMaximum&&compare(age,eligibility.ageMaximum)>0)||(eligibility.ageMaximumYears!==undefined&&age.years>eligibility.ageMaximumYears)?{id:'FORA_FAIXA',title:'Idade fora da faixa descrita neste recorte',text:eligibility.text+' Confirme o fluxo com a Regulação; o piloto não define uma rota alternativa.'}:null;
  }
  function active(){const root=document.querySelector('#detailPanel > [data-clinical-condition-id], #receptionDetail > [data-clinical-condition-id]'),record=root&&!root.hidden&&recordFor(root.dataset.clinicalConditionId);return record?{record:clone(record),age:ageFromText(root.querySelector('[data-pilot-age]')?.value??root.dataset.clinicalAge??''),query:root.dataset.clinicalQuery||'',channel:root.dataset.clinicalChannel}:null;}
  function unavailable(question){const root=document.querySelector('[data-clinical-pilot-unavailable]');return question===undefined?Boolean(root):Boolean(root&&questionDecision(question)?.kind==='unavailable');}
  function searchFamilies(query){const q=norm(query),tendon=/bursite|tendinite/.test(q);return[tendon?'tendon':null,/cefaleia|dor de cabeca/.test(q)?'headache':null,/ombro|manguito/.test(q)&&(!tendon||/dor (?:no|do|em) ombro|manguito/.test(q))?'shoulder':null,/convuls|epilep/.test(q)?'seizure':null,/atraso (?:do )?desenvolvimento|regressao (?:do )?desenvolvimento|hipotonia infantil/.test(q)?'development':null,/\btea\b|autismo|espectro autista/.test(q)?'autism':null,/\btdah\b|\btod\b|deficit de atencao/.test(q)?'adhd':null,/dislexia|discalculia|transtornos? (?:de |da )?aprendizagem/.test(q)?'learning':null,/ataxia|coreia|distonia|espasmo hemifacial|disturbios? do movimento/.test(q)?'movement':null,/esclerose multipla|encefalomielite|neurite optica|mielite transversa|doencas? neurologicas? inflamatorias?/.test(q)?'inflammation':null].filter(Boolean);}
  const searchKind=query=>{const found=searchFamilies(query);return found.length===1?found[0]:null;};
  const conditionChoice=found=>({kind:'choose_condition',families:[...found],text:'A pergunta menciona '+found.map(family=>familyLabels[family]).join(' e ')+'. Envie uma condição por vez e informe o sistema; nenhum dos motivos foi escolhido automaticamente.'});
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
    const found=searchFamilies(question);
    if(found.length>1){pendingFamilies=found;conversationContext=null;pendingQuestion=null;bypassPilotContext=true;legacyTerms=[];return conditionChoice(found);}
    const detected=searchKind(question);if(detected){bypassPilotContext=false;legacyTerms=[];pendingFamilies=[];}
    if(pendingFamilies.length){const other=targetsOtherTopic(question,null);if(!other.length)return conditionChoice(pendingFamilies);pendingFamilies=[];legacyTerms=other;return null;}
    if(context===undefined)context=conversationContext||(!bypassPilotContext?active():null);
    const q=norm(question),pending=document.querySelector('[data-clinical-system-choice]'),failed=document.querySelector('[data-clinical-pilot-unavailable]');
    const failedFamily=familyFor(failed?.dataset.clinicalPilotUnavailable)||null;
    const inherited=bypassPilotContext?null:pendingQuestion?.family||context?.record.searchKind||pending?.dataset.clinicalSystemChoice||failedFamily;
    const inheritedRecord=context?.record||recordFor(families[inherited]?.[0]||ID);
    const otherTerms=!detected&&(inherited||bypassPilotContext)?targetsOtherTopic(question,inheritedRecord):[];
    if(otherTerms.length){conversationContext=null;pendingQuestion=null;bypassPilotContext=true;legacyTerms=otherTerms;return null;}
    const family=detected||inherited;
    if(!family)return null;
    const system=explicitSystem(question),comparison=comparisonRequested(question);
    if(system==='core')return{kind:'source_limit',text:'CORE: nenhuma fonte clínica ambulatorial foi validada neste recorte. Não usar os requisitos do DigSaúde ou de Campo Grande como regras CORE.'};
    if(unsupportedNewScope(question,family,system))return{kind:'source_limit',text:'Este recorte de '+familyLabels[family]+' contém somente '+(family==='headache'?'Neuropediatria':'Ortopedia Adulto')+' no DigSaúde MS. Não define exigências de outra faixa ou sistema nem usa SISREG/CORE como substituto.'};
    if(family==='seizure'&&(/\badult[oa]/.test(q)||system==='sisreg'||comparison))return{kind:'source_limit',text:'Este piloto contém Neuropediatria no DigSaúde. O enquadramento adulto e o fluxo SISREG/Campo Grande não foram integrados a este recorte. Suas faixas e exigências não podem ser preenchidas pelas regras do DigSaúde.'};
    if(system==='multiple'&&!comparison)return{kind:'choose_system',family,query:question,text:'A pergunta menciona mais de um sistema. Escolha DigSaúde MS ou SISREG/Campo Grande antes de consultar as exigências, ou peça uma comparação explícita.'};
    let ids;
    if(comparison&&family==='shoulder')ids=[SHOULDER,RELATED];
    else if(system)ids=family==='shoulder'?[system==='sisreg'?RELATED:SHOULDER]:families[family];
    else if(context?.record.searchKind===family)ids=[context.record.id];
    else return{kind:'choose_system',family,query:question,text:family==='shoulder'?'Para Dor no Ombro, escolha DigSaúde MS ou SISREG/Campo Grande antes de consultar as exigências. Os recortes ficam separados.':'Para '+familyLabels[family]+', escolha o sistema antes de consultar as exigências. Este piloto contém somente o recorte DigSaúde MS.'};
    if(ids.some(id=>!recordFor(id)))return{kind:'unavailable',text:'O registro integral do recorte solicitado não está disponível. Nenhuma lista geral foi usada como substituta.'};
    const basis=pendingQuestion?.question||(systemReply(question)?context?.query:null);
    const effectiveQuestion=!detected&&basis&&system?(norm(basis).endsWith(norm(question))?basis:basis+' '+question):question;
    return{kind:'records',contexts:ids.map(id=>({record:clone(recordFor(id)),age:ageFromText(question)||ageFromText(pendingQuestion?.question)||(context?.record.searchKind===family?context.age:null),query:effectiveQuestion,channel:context?.channel||'guide'}))};
  }
  function rememberDecision(decision){if(decision.kind==='records'&&decision.contexts.length===1){conversationContext=decision.contexts[0];pendingQuestion=null;}else if(decision.kind==='records'&&!conversationContext&&!active())pendingQuestion={family:decision.contexts[0].record.searchKind,question:decision.contexts[0].query};}
  function localOnlyQuestion(question,context){const decision=questionDecision(question,context);return Boolean(decision&&decision.kind!=='records');}
  function acceptsQuestion(question,context=active()){
    const r=context&&recordFor(context.record),q=norm(question);if(!r||/\bcore\b/.test(q))return false;
    if(searchFamilies(question).length>1)return false;
    const detected=searchKind(question);if(detected&&detected!==r.searchKind)return false;
    if([TENDON,HEADACHE].includes(r.id))return explicitSystem(question)!=='sisreg'&&!unsupportedNewScope(question,r.searchKind,explicitSystem(question));
    if(r.id===ID)return !/\badult[oa]|\bsisreg|ombro|ortoped/.test(q);
    if(/convuls|epilep|neuropediatr/.test(q))return false;
    if(/compar|diferen|outro sistema/.test(q))return true;
    if(/\bsisreg|campo grande/.test(q))return r.systemKind==='sisreg_reference';
    if(/digsaude|digsus/.test(q))return r.systemKind==='digsaude';return true;
  }
  function protocolContext(context=active()){
    const r=context&&recordFor(context.record);if(!r)return null;const texts=g=>r.rules.filter(rule=>rule.group===g).map(rule=>rule.text),docs=req=>r.rules.filter(rule=>rule.group==='documents'&&rule.requirement===req).map(rule=>rule.text),notice=ageNotice(context.age,r);
    return{id:r.id,nome:r.specialty+' - '+r.condition,categoria:r.category,faixaEtaria:texts('eligibility').join(' '),viaAcesso:r.system,situacaoTeleconsulta:'Piloto em revisão; oferta, vigência e aplicabilidade municipal não confirmadas.',resumo:r.condition,fluxoLocal:texts('appointment').concat(texts('documentPresentation'),texts('scope')).join(' '),criteriosParaEncaminhar:texts('referral'),informacoesClinicasObrigatorias:texts('description').concat(r.rules.filter(rule=>rule.group==='clinicalAssessment'&&rule.requirement==='obrigatorio').map(rule=>rule.text)),...(texts('clinicalRecord').length?{registrosObrigatorios:texts('clinicalRecord')}:{ }),examesObrigatorios:docs('obrigatorio'),examesCondicionais:docs('condicional_se_houver'),recomendadosQuandoDisponiveis:docs('opcional_documental'),elementosPriorizacao:[],alertas:texts('exclusion').concat(texts('editorialSafeguard'),texts('alert'),r.systemBoundary?[r.systemBoundary]:[],notice?[notice.text]:[]),subprotocolos:[],praticaRegulatoria:null,fontes:r.sources.map(s=>s.title+(s.version?' '+s.version:'')),ultimaConferencia:[TENDON,HEADACHE].includes(r.id)?'PDF e páginas conferidos diretamente em 16/10/2026; confirmação institucional pendente.':'Matriz e conferência visual comunicadas pela frente documental em 16/10/2026; confirmação institucional pendente.',clinicalConditionId:r.id,clinicalConditionRecord:clone(r),clinicalAge:context.age?clone(context.age):null,clinicalContextualAlerts:notice?[notice]:[]};
  }
  function questionContexts(question){const decision=questionDecision(question);if(decision?.kind==='records')rememberDecision(decision);return decision?decision.kind==='records'?decision.contexts.map(protocolContext):[]:null;}
  const noticeMarkup=n=>`<div class="cp-alert"><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p></div>`;
  function contentMarkup(r,age,channel,query=''){
    const notice=ageNotice(age,r),ruleMarkup=(id,tag='span')=>`<${tag} data-clinical-rule="${id}">${esc(r.rules.find(rule=>rule.id===id).text)}</${tag}>`,check=id=>channel==='reception'?`<label class="cp-check"><input type="checkbox" aria-label="Consta no encaminhamento: ${esc(r.rules.find(rule=>rule.id===id).text)}"> Consta no encaminhamento</label>`:'';
    const referral=r.rules.filter(rule=>rule.group==='referral'),sections=r.sections.map(s=>`<div class="cp-requirement"><p class="cp-label">${esc(s.label)}</p><h3>${esc(s.title)}</h3><ul>${s.ruleIds.map(id=>`<li>${ruleMarkup(id)}${s.receptionCheck?check(id):''}</li>`).join('')}</ul>${s.note?`<p>${esc(s.note)}</p>`:''}${s.availabilityNote?`<p class="cp-alert">${esc(s.availabilityNote)}</p>`:''}</div>`).join('');
    return `<p class="cp-status">${r.systemKind==='sisreg_reference'?'Seções relacionadas em revisão - pactuação não confirmada':'Piloto em revisão - sem vigência confirmada'}</p><p class="cp-path">${esc(r.system)} → ${esc(r.specialty)}</p><h2>${esc(r.condition)}</h2><p><strong>Faixa etária:</strong> ${ruleMarkup('IDADE')}</p>
      ${channel==='reception'?`<label class="cp-age">Faixa etária para conferência <span>(opcional)</span><input data-pilot-age type="text" autocomplete="off" placeholder="Ex.: 17 anos" value="${esc(age?age.years+' anos'+(age.months?' '+age.months+' meses':'')+(age.days?' '+age.days+' dias':''):'')}"></label>`:''}<div data-pilot-age-notice role="status">${notice?noticeMarkup(notice):''}</div>
      ${r.systemBoundary?`<p class="cp-scope">${esc(r.systemBoundary)}</p>`:''}${r.sourceLimits&&/prazo|validade|crm|solicitante|urgencia|sem exame/.test(norm(query))?`<p class="cp-alert">${esc(r.sourceLimits.text)}</p>`:''}${r.id===ID&&/febril simples/.test(norm(query))?'<p class="cp-alert"><strong>Convulsão febril simples:</strong> está excluída do critério de episódios sugestivos de crise. O piloto não define encaminhamento por esse critério nem inventa outra rota.</p>':''}
      ${channel==='reception'?'<p class="cp-scope">A recepção confere somente se a informação está registrada ou se o exame foi apresentado. Não realiza avaliação clínica nem define diagnóstico, elegibilidade ou urgência. As marcações são locais e não alteram a impressão.</p>':''}
      <div class="cp-grid${referral.length?'':' cp-reference-layout'}">${referral.length?`<section><h3>Quando encaminhar</h3><p>Identifique o critério que sustenta o encaminhamento.</p><ol>${referral.map(rule=>`<li>${ruleMarkup(rule.id)}${rule.exceptionRefs?`<p class="cp-exclusion"><strong>Exclusão:</strong> ${rule.exceptionRefs.map(id=>ruleMarkup(id)).join(' ')}</p>`:''}</li>`).join('')}</ol></section>`:''}<section>${sections}</section></div>
      <p class="cp-reference">${esc(r.reference)}</p>${channel==='reception'?'<div class="cp-actions"><button type="button" data-pilot-print>Imprimir este recorte</button></div>':''}`;

  }
  function setCriteriaExpanded(panel,expanded,returnToCard=false){
    const root=panel.querySelector('[data-clinical-condition-id]'),content=root?.querySelector('[data-pilot-criteria-content]');
    if(!content)return;
    const general=panel.querySelector('[data-pilot-general-protocol]');
    if(general){
      returnToCard=returnToCard||!expanded&&root.contains(document.activeElement);
      general.hidden=expanded;root.hidden=!expanded;
      if(expanded){document.body.classList.add('clinical-pilot-active');const url=new URL(location.href);url.searchParams.set('protocolo',root.dataset.parentProtocolId);url.searchParams.set('condicao',root.dataset.clinicalConditionId);history.replaceState(null,'',url);}
      else clearConditionUrl();
    }
    content.hidden=!expanded;
    root.querySelectorAll('[data-pilot-criteria-toggle]').forEach(button=>{
      button.setAttribute('aria-expanded',String(expanded));
      button.textContent=expanded?'Recolher critérios':'Mostrar critérios';
    });
    let selected;
    panel.querySelectorAll('[data-condition]').forEach(button=>{
      const current=button.dataset.condition===root.dataset.clinicalConditionId;
      button.dataset.selected=String(current&&expanded);
      button.setAttribute('aria-expanded',String(current&&expanded));
      button.setAttribute('aria-controls',content.id);
      if(current)selected=button;
    });
    if(returnToCard&&selected){
      selected.focus({preventScroll:true});
      const rect=selected.getBoundingClientRect(),top=Math.max(0,...Array.from(document.querySelectorAll('.site-header,.social-global-nav')).map(node=>['fixed','sticky'].includes(getComputedStyle(node).position)?node.getBoundingClientRect().bottom:0));
      if(rect.top<top+12||rect.bottom>window.innerHeight-80)selected.scrollIntoView({block:'center',behavior:'instant'});
    }
  }
  function render(protocol,options={},channel='guide',open){
    const descriptor=descriptors.find(d=>d.id===options.conditionId),r=descriptor&&recordFor(descriptor.id),parent=r?.parentProtocolId||(descriptor?parentFor(descriptor.id):'');
    if(!descriptor||protocol?.id!==parent){document.body?.classList.remove('clinical-pilot-active');return false;}
    const panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');if(!panel)return false;document.body?.classList.add('clinical-pilot-active');
    conversationContext=null;pendingQuestion=null;bypassPilotContext=false;legacyTerms=[];pendingFamilies=[];
    if(!r){panel.innerHTML=`<div class="clinical-pilot" data-clinical-pilot-unavailable="${descriptor.id}"><p class="cp-alert">Não foi possível carregar o registro integral do piloto (${esc(errors.get(descriptor.id)||'carregando')}). Nenhuma lista geral foi usada como substituta.</p></div>`;return true;}
    let general=channel==='guide'?panel.querySelector('[data-pilot-general-protocol]'):null;
    if(channel==='guide'&&general?.dataset.pilotGeneralProtocol!==protocol.id){
      open?.(protocol,{preserveUrl:true});
      general=panel.querySelector('[data-pilot-general-protocol]');
    }
    const query=options.query??document.getElementById(channel==='reception'?'receptionSearch':'sideSearchInput')?.value??'',age=options.age||ageFromText(query);
    const picker=channel==='guide'?panel.querySelector('[data-pilot-detail-choice]'):null,keepPicker=picker?.dataset.pilotProtocol===protocol.id?picker:null,focused=keepPicker?.contains(document.activeElement)?document.activeElement:null;
    const criteriaId='cp-condition-criteria-'+protocol.id,contentId=criteriaId+'-content';
    const control=bottom=>`<button type="button" data-pilot-criteria-toggle${bottom?' data-pilot-criteria-bottom':''} aria-expanded="true" aria-controls="${esc(contentId)}">Recolher critérios</button>`;
    const content=contentMarkup(r,age,channel,query);
    const markup=`<article class="clinical-pilot"${channel==='guide'?` id="${esc(criteriaId)}"`:''} data-clinical-condition-id="${r.id}" data-clinical-channel="${channel}" data-clinical-query="${esc(query)}">${channel==='guide'?`<div class="cp-actions cp-criteria-controls"><strong>${esc(r.condition)}</strong>${control(false)}</div><div id="${esc(contentId)}" data-pilot-criteria-content>${content}<div class="cp-actions">${control(true)}</div></div>`:content}</article>`;
    if(general){panel.querySelectorAll(':scope > [data-clinical-condition-id]').forEach(node=>node.remove());panel.insertAdjacentHTML('beforeend',markup);}
    else panel.innerHTML=markup;
    document.querySelectorAll('#protocolList .protocol-card').forEach(card=>card.classList.toggle('active',channel==='guide'&&card.dataset.id===protocol.id));const root=general?panel.lastElementChild:panel.firstElementChild;
    root.dataset.parentProtocolId=protocol.id;
    root.dataset.clinicalAge=age?age.years+' anos '+(age.months||0)+' meses '+(age.days||0)+' dias':'';
    root.querySelector('[data-pilot-age]')?.addEventListener('input',event=>{const n=ageNotice(ageFromText(event.target.value),r);root.querySelector('[data-pilot-age-notice]').innerHTML=n?noticeMarkup(n):'';});root.querySelector('[data-pilot-print]')?.addEventListener('click',printActive);
    if(channel==='guide'){
      if(keepPicker)panel.prepend(keepPicker);else addDetailChoice(protocol,(item,choice)=>render(item,choice,channel,open),channel);
      const choice=panel.querySelector('[data-pilot-detail-choice]'),toggle=choice.querySelector('.cp-condition-toggle');
      toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-controls',choice.querySelector('.cp-condition-grid').id+' '+criteriaId);choice.querySelector('.cp-condition-grid').hidden=false;
      root.querySelectorAll('[data-pilot-criteria-toggle]').forEach(button=>button.addEventListener('click',()=>setCriteriaExpanded(panel,root.querySelector('[data-pilot-criteria-content]').hidden,button.hasAttribute('data-pilot-criteria-bottom'))));
      setCriteriaExpanded(panel,true);focused?.focus({preventScroll:true});
      const url=new URL(location.href);url.searchParams.set('protocolo',protocol.id);url.searchParams.set('condicao',r.id);history.replaceState(null,'',url);
    }return true;
  }
  function addSearchChoice(protocols,open,channel='guide'){
    const query=document.getElementById(channel==='reception'?'receptionSearch':'sideSearchInput')?.value||'',ids=matchingIds(query),list=document.getElementById(channel==='reception'?'receptionProtocolList':'protocolList');if(!list||list.querySelector('[data-pilot-choice]'))return;
    const family=searchKind(query),panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');
    const found=searchFamilies(query);
    if(found.length>1){clearConditionUrl();pendingFamilies=found;bypassPilotContext=true;document.body?.classList.add('clinical-pilot-active');const message='<h2>Escolha um motivo por consulta</h2><p>'+esc(conditionChoice(found).text)+'</p>';if(panel)panel.innerHTML='<article class="clinical-pilot" data-clinical-condition-choice="true">'+message+'</article>';const box=document.createElement('section');box.className='clinical-pilot-choice';box.dataset.pilotChoice='multiple';box.innerHTML=message;list.querySelectorAll(':scope > .empty').forEach(node=>node.remove());list.prepend(box);return;}
    if(!family){if((awaitingSystemChoice()||document.querySelector('[data-clinical-condition-choice]'))&&panel){clearConditionUrl();panel.innerHTML='<div class="loading">Selecione uma especialidade ou exame.</div>';}return;}
    const current=active(),offered=[];
    const showChoice=()=>{
      if(!panel||current&&matches(query,current.record.id))return;
      clearConditionUrl();document.body?.classList.add('clinical-pilot-active');
      const system=explicitSystem(query),blocked=system==='core'||unsupportedNewScope(query,family,system)||family==='seizure'&&(system==='sisreg'||/\badult[oa]/.test(norm(query)));
      panel.innerHTML=`<article class="clinical-pilot" data-clinical-system-choice="${family}"><h2>${blocked?'Recorte não integrado neste piloto':'Escolha o sistema para consultar o motivo'}</h2><p>${blocked?'Este piloto não fornece exigências desse fluxo. As regras de outro sistema não foram usadas como substitutas.':'Cada sistema tem seu próprio recorte. Nenhuma lista de exigências é apresentada antes da escolha.'}</p><div class="cp-actions">${offered.map(id=>`<button type="button" data-pilot-open="${id}">${id===RELATED?'SISREG / Campo Grande':'DigSaúde MS'}</button>`).join('')}</div></article>`;
      panel.querySelectorAll('[data-pilot-open]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.pilotOpen,parent=protocols.find(p=>p.id===parentFor(id));open(parent,{conditionId:id,query});}));
      document.querySelectorAll('#protocolList .protocol-card').forEach(card=>card.classList.remove('active'));
    };
    if(/ombro|manguito/.test(norm(query))&&/\bcore\b/.test(norm(query))){const box=document.createElement('section');box.className='clinical-pilot-choice';box.innerHTML='<p><strong>CORE: fonte clínica ambulatorial não validada neste recorte.</strong></p><p>Não usar exigências do DigSaúde ou de Campo Grande como regras CORE.</p>';list.prepend(box);showChoice();return;}
    let count=0;for(const id of [...ids].reverse()){
      const r=recordFor(id),protocol=protocols.find(p=>p.id===parentFor(id));if(!protocol)continue;
      if(channel==='guide'){const filter=document.querySelector('[data-filter].active')?.dataset.filter||'todos',category=document.getElementById('categoryFilter')?.value||'todos',allowed=id===RELATED?['todos','sisreg','ambos']:['todos','digsus','ambos'];if(!allowed.includes(filter)||!['todos',protocol.categoria].includes(category))continue;}
      const box=document.createElement('section');box.className='clinical-pilot-choice';box.dataset.pilotChoice=id;const label=(parentFor(id)==='neuropediatria'?'Neuropediatria - ':'Ortopedia Adulto - ')+labelFor(id),system=id===RELATED?'SISREG / Campo Grande':'DigSaúde MS',notice=r&&ageNotice(ageFromText(query),r);
      box.innerHTML=`<p><strong>${esc(label)}</strong></p><p>Escolha o sistema. ${id===RELATED?'Referências relacionadas; pactuação a confirmar.':'Piloto em revisão; oferta a confirmar.'}</p><button type="button" data-pilot-system="${id}">${system}</button>${notice?noticeMarkup(notice):''}`;
      box.querySelector('button').addEventListener('click',()=>open(protocol,{conditionId:id,query}));list.prepend(box);offered.push(id);count++;
    }
    if(count)list.querySelectorAll(':scope > .empty').forEach(node=>node.remove());
    const element=document.getElementById(channel==='reception'?'receptionResultCount':'resultCount');if(count&&element)element.textContent+=' · '+count+' recorte(s)-piloto';
    showChoice();
  }
  function addDetailChoice(protocol,open,channel='guide'){
    const ids=descriptors.filter(d=>parentFor(d.id)===protocol?.id).map(d=>d.id);
    const panel=document.getElementById(channel==='reception'?'receptionDetail':'detailPanel');
    if(!ids.length||!panel||panel.querySelector('[data-pilot-detail-choice]')||channel!=='guide'&&panel.querySelector('[data-clinical-condition-id]'))return;
    const general=channel==='guide'&&panel.querySelector(':scope > article:not([data-clinical-condition-id])');
    if(general)general.dataset.pilotGeneralProtocol=protocol.id;
    const box=document.createElement('section');
    box.className='clinical-pilot-choice cp-condition-picker';
    box.dataset.pilotDetailChoice='true';
    box.dataset.pilotProtocol=protocol.id;
    const cards=ids.map(id=>'<button type="button" class="cp-condition-card" data-condition="'+esc(id)+'"><span class="cp-condition-name">'+esc(labelFor(id))+'</span><span class="cp-condition-system">'+(id===RELATED?'SISREG / Campo Grande':'DigSaúde MS')+'</span></button>').join('');
    const count=ids.length+' '+(ids.length===1?'motivo disponível':'motivos disponíveis');
    if(channel==='guide'){
      const gridId='cp-condition-options-'+protocol.id;
      box.innerHTML='<h3 class="cp-condition-toggle-heading"><button type="button" class="cp-condition-toggle" aria-expanded="false" aria-controls="'+esc(gridId)+'"><span class="cp-condition-toggle-title">Consultar por motivo</span><span class="cp-condition-count">'+count+'</span><span class="cp-condition-chevron" aria-hidden="true"></span></button></h3><div id="'+esc(gridId)+'" class="cp-condition-grid" role="group" aria-label="Motivos de encaminhamento disponíveis" hidden>'+cards+'</div>';
      const toggle=box.querySelector('.cp-condition-toggle'),grid=box.querySelector('.cp-condition-grid');
      toggle.addEventListener('click',()=>{
        const expanded=toggle.getAttribute('aria-expanded')==='true';
        toggle.setAttribute('aria-expanded',String(!expanded));
        grid.hidden=expanded;
        if(expanded&&panel.querySelector('[data-clinical-condition-id]'))setCriteriaExpanded(panel,false);
      });
    }else{
      box.innerHTML='<div class="cp-condition-heading"><div><h3>Consultar por motivo</h3><p>Selecione a condição para visualizar os requisitos do encaminhamento.</p></div><span class="cp-condition-count">'+ids.length+' '+(ids.length===1?'motivo':'motivos')+'</span></div><div class="cp-condition-grid" role="group" aria-label="Motivos de encaminhamento disponíveis">'+cards+'</div>';
    }
    box.querySelectorAll('[data-condition]').forEach(button=>button.addEventListener('click',()=>{
      const current=channel==='guide'&&panel.querySelector('[data-clinical-condition-id]');
      if(current&&current.dataset.clinicalConditionId===button.dataset.condition){setCriteriaExpanded(panel,current.querySelector('[data-pilot-criteria-content]').hidden);return;}
      open(protocol,{conditionId:button.dataset.condition});
    }));
    panel.prepend(box);
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
    const pagination=[TENDON,HEADACHE].includes(r.id)?'.cp-requirement{break-inside:auto}.cp-grid>section{margin:16px 0}.cp-requirement,.cp-reference{margin-top:14px;padding-top:12px}.cp-grid li{margin:6px 0}p{margin:0 0 8px}h3{margin:0 0 8px}ul,ol{margin:8px 0}':'';
    return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(r.condition)+' - em revisão</title><style>body{font:18px/1.45 Arial,sans-serif;color:#17343d;margin:0}p{margin:0 0 12px}h2{margin:12px 0 18px}h3{margin:0 0 12px}.cp-label{break-after:avoid}ul,ol{margin:12px 0;padding-left:26px}.clinical-pilot{max-width:900px;margin:auto}.cp-status,.cp-label{font-weight:bold}.cp-grid{display:block}.cp-grid>section{margin:24px 0}.cp-grid li{margin:10px 0}.cp-alert,.cp-exclusion{border-left:3px solid #94671f;background:#fff5df;padding:12px}.cp-requirement,.cp-reference{border-top:1px solid #b5c5ba;margin-top:20px;padding-top:18px}h2,h3{break-after:avoid}li,.cp-requirement{break-inside:avoid}@page{size:A4;margin:18mm}'+pagination+'</style><article class="clinical-pilot">'+contentMarkup(r,context.age,'print',context.query)+'</article></html>';
  }
  function printActive(){const html=printDocument();if(!html)return;const popup=window.open('','_blank');if(!popup){window.alert('Permita abrir a orientação de impressão deste piloto.');return;}popup.document.open();popup.document.write(html);popup.document.close();popup.focus();popup.print();}
  window.ClinicalConditionPilot={legacyTopicTerms:()=>bypassPilotContext?[...legacyTerms]:[],ID,SHOULDER,RELATED,TENDON,HEADACHE,REVISION:descriptors[0].revision,VERSION,SOURCE:sourceFor(descriptors[0]),ready,matches,parentProtocolId,clearConditionUrl,ageFromText,ageNotice,active,unavailable,awaitingSystemChoice,localOnlyQuestion,questionDecision,acceptsQuestion,protocolContext,questionContexts,render,addSearchChoice,addDetailChoice,localAnswer,printDocument,record:(id=ID)=>recordFor(id)?clone(recordFor(id)):null};
})();
