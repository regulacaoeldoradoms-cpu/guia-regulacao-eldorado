'use strict';
// Local prototype only. The server owns completion, grading and rewards.
(() => {
 function valid(summary, context) {
  return summary?.protocol === 1 && summary.sessionId === context?.sessionId
   && summary.missionId === context.mission?.id && summary.contentVersion === context.mission.contentVersion
   && ['lesson','boss','review'].includes(summary.mode) && summary.mode === context.mode
   && Number.isInteger(summary.total) && summary.total === context.mission.questions.length
   && Number.isInteger(summary.answered) && summary.answered >= 0 && summary.answered <= summary.total
   && Number.isInteger(summary.correct) && summary.correct >= 0 && summary.correct <= summary.answered
   && summary.completionMayUseHistory === (summary.mode === 'lesson')
   && Array.isArray(summary.items) && summary.items.length === summary.answered
   && new Set(summary.items.map(item=>item?.questionId)).size === summary.answered
   && summary.items.every(item=>context.mission.questions.some(question=>question.id===item?.questionId)
      && typeof item.correct === 'boolean' && typeof item.prompt === 'string' && typeof item.explanation === 'string')
   && summary.items.filter(item=>item.correct).length === summary.correct;
 }
 function clear(root) { root?.querySelector('#studySessionSummary')?.remove(); }
 function render(root, summary, context, onLeave) {
  clear(root); if(!root || !valid(summary,context))return false;
  const doc=root.ownerDocument,make=(tag,text)=>{const node=doc.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
  const panel=make('section');panel.id='studySessionSummary';panel.className='study-application-panel';panel.setAttribute('aria-labelledby','studySessionSummaryTitle');
  const heading=make('h2','Resumo desta sessão');heading.id='studySessionSummaryTitle';heading.tabIndex=-1;
  const missing=summary.total-summary.answered;
  panel.append(heading,make('p',`${summary.answered} de ${summary.total} respostas confirmadas nesta sessão; ${summary.correct} corretas e ${summary.answered-summary.correct} incorretas.`));
  if(missing)panel.append(make('p',`${missing} ${missing===1?'questão não tem':'questões não têm'} resposta confirmada nesta sessão.`));
  if(summary.completionMayUseHistory)panel.append(make('p','A conclusão da aula pode aproveitar respostas anteriores. Este resumo conta somente respostas desta sessão.'));
  panel.append(make('p','Concluir a atividade ou receber XP não comprova domínio nem prontidão para a prova.'));
  for(const item of summary.items){const detail=make('details');detail.append(make('summary',(item.correct?'Correta: ':'Rever: ')+item.prompt),make('p',item.explanation));
   if(typeof item.selectedFeedback==='string'&&item.selectedFeedback)detail.append(make('p',item.selectedFeedback));panel.append(detail);}
  const leave=make('button','Voltar ao painel');leave.type='button';leave.addEventListener('click',onLeave);panel.append(leave);
  root.querySelector('#studyPracticeTitle')?.before(panel);heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'auto'});return true;
 }
 window.StudySessionSummary=Object.freeze({valid,render,clear});
})();
