import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASELINE_RELEASE_SEQUENCE,
  attachPublication,
  publishedCatalog,
  publicationSnapshot,
  validatePublicationCatalog
} from '../studies-content/publication-registry.js';

const baseMissions=[
  {
    id:'fixture.reading',topicId:'fixture.reading',contentVersion:1,kind:'lesson',
    sections:[{id:'s1',type:'explanation'}],questions:[]
  },
  {
    id:'fixture.boss',topicId:'fixture.boss',contentVersion:1,kind:'boss',passScore:75,
    sections:[{id:'s2',type:'summary'}],questions:[]
  },
  {
    id:'fixture.application',topicId:'fixture.application',contentVersion:1,kind:'lesson',
    applications:{version:1,tasks:[{id:'a1'}]},sections:[{id:'s3',type:'worked-example'}],questions:[]
  }
];

test('registro de publicação é genérico para formatos distintos',()=>{
  const catalog=publishedCatalog(baseMissions);
  assert.equal(catalog.length,3);
  assert.deepEqual(validatePublicationCatalog(catalog),[]);
  assert.ok(catalog.every(mission=>mission.publication.status==='published'));
  assert.ok(catalog.every(mission=>mission.publication.releaseSequence===BASELINE_RELEASE_SEQUENCE));
  assert.equal(catalog[1].passScore,75);
  assert.equal(catalog[2].applications.tasks[0].id,'a1');
});

test('quarta missão entra por dados sem alterar progresso das três anteriores',()=>{
  const progress={
    'fixture.reading':{coverageState:3,contentVersionSeen:1,startedAt:'2026-09-20 10:00:00'},
    'fixture.boss':{coverageState:3,contentVersionSeen:1,startedAt:'2026-09-21 10:00:00'},
    'fixture.application':{coverageState:2,contentVersionSeen:1,startedAt:'2026-09-22 10:00:00'}
  };
  const before=structuredClone(progress);
  const fourth={
    id:'fixture.new',topicId:'fixture.new',contentVersion:1,kind:'lesson',
    sections:[],questions:[],
    publication:{status:'published',releaseId:'release-2',releaseSequence:2,changeImpact:'new'}
  };
  const expanded=publishedCatalog([...baseMissions,fourth]);
  const snapshot=publicationSnapshot(expanded,progress);

  assert.equal(expanded.length,4);
  assert.equal(snapshot.currentRelease,'release-2');
  assert.equal(snapshot.currentReleaseSequence,2);
  assert.equal(snapshot.newCount,1);
  assert.deepEqual(snapshot.newMissionIds,['fixture.new']);
  assert.deepEqual(progress,before);
});

test('rascunho não é publicado e impacto editorial não força revisão',()=>{
  const draft={
    id:'fixture.draft',topicId:'fixture.draft',contentVersion:1,
    publication:{status:'draft',releaseId:'release-2',releaseSequence:2,changeImpact:'new'}
  };
  assert.equal(publishedCatalog([...baseMissions,draft]).some(m=>m.id===draft.id),false);

  const editorial=attachPublication({
    id:'fixture.editorial',topicId:'fixture.editorial',contentVersion:2,
    publication:{status:'published',releaseId:'release-2',releaseSequence:2,changeImpact:'editorial'}
  });
  const conceptual=attachPublication({
    id:'fixture.conceptual',topicId:'fixture.conceptual',contentVersion:2,
    publication:{status:'published',releaseId:'release-2',releaseSequence:2,changeImpact:'conceptual'}
  });
  const progress={
    'fixture.editorial':{coverageState:3,contentVersionSeen:1,startedAt:'2026-09-10'},
    'fixture.conceptual':{coverageState:3,contentVersionSeen:1,startedAt:'2026-09-10'}
  };
  const snapshot=publicationSnapshot([editorial,conceptual],progress);
  assert.equal(snapshot.newCount,0);
  assert.deepEqual(snapshot.revisionRecommendedIds,['fixture.conceptual']);
});


test('metadados inválidos são rejeitados em vez de normalizados silenciosamente',()=>{
  const invalid=[{
    id:'fixture.invalid',topicId:'fixture.invalid',contentVersion:1,
    publication:{status:'live',releaseId:'',releaseSequence:0,changeImpact:'rewrite'}
  }];
  const errors=validatePublicationCatalog(invalid);
  assert.ok(errors.includes('fixture.invalid:invalid-publication-status'));
  assert.ok(errors.includes('fixture.invalid:invalid-change-impact'));
  assert.ok(errors.includes('fixture.invalid:missing-release-id'));
  assert.ok(errors.includes('fixture.invalid:invalid-release-sequence'));
});
