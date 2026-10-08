'use strict';
import {getStudyRound,StudyRoundError} from './study-rounds.js';
import {questionFeedbackById} from './studies-content/question-feedback-v1.js';

// Called after a confirmed attempt; never included in the public mission projection.
export function projectStudyFeedback(mission,question,selectedOption,correct) {
 const pedagogical=questionFeedbackById(question.id,question);
 const refs=mission.teaching?.questionCoverage?.[question.id];
 return {correct,correctOption:question.answer,explanation:question.explanation,
  selectedFeedback:correct?'':pedagogical?.optionReasons?.[selectedOption]||'',
  reviewRefs:(Array.isArray(refs)?refs:[]).map(ref=>({missionId:ref.missionId,sectionId:ref.sectionId}))};
}

export async function confirmedStudyFeedback(db,username,mission,sessionId) {
 const round=await getStudyRound(db,username,mission,sessionId);
 if(round.status!=='active'||round.session_status!=='active')throw new StudyRoundError('Esta sessão não pode ser retomada.');
 const rows=(await db.prepare(`SELECT x.question_id,a.selected_option,a.correct
  FROM study_round_answers x JOIN study_attempts a ON a.attempt_id=x.attempt_id
  WHERE x.session_id=? AND a.username=? AND a.topic_id=? AND a.content_version=?
  ORDER BY x.question_id`).bind(sessionId,username,mission.topicId,mission.contentVersion).all()).results||[];
 return rows.flatMap(row=>{
  const question=mission.questions.find(q=>q.id===row.question_id),selected=row.selected_option,correct=row.correct;
  if(!question||!round.questionIds.includes(question.id)||!Number.isInteger(selected)||selected<0||selected>=question.options.length
    || ![0,1].includes(correct)||correct!==Number(selected===question.answer))return [];
  return [{...projectStudyFeedback(mission,question,selected,!!correct),questionId:question.id,selectedOption:selected,
   sessionId,missionId:mission.id,contentVersion:mission.contentVersion}];
 });
}
