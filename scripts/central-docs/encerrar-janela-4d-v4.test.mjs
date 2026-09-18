import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FIXED, PUBLIC_NAMES, SECRET_NAMES, inspectOldPreview
} from './preparar-nova-janela-4d-v4.mjs';
import {
  disableControlSql, closedControlSql, validateClosedControl, currentPreviewBase
} from './encerrar-janela-4d-v4.mjs';

const db='11111111-2222-3333-4444-555555555555';
const control='phase4d_0123456789abcdef0123456789abcdef';
const prepared='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const written='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const expires=1790000000;

function oldPreview(){
  const vars={
    ALLOWED_ORIGINS:FIXED.pages,
    AUTH_DEVELOPER_USERNAMES:'dev',
    DOCUMENTS_DRIVE_WRITE_ENABLED:'false',
    DOCUMENTS_HOMOLOGATION_CONTROL_ID:FIXED.oldControl,
    DOCUMENTS_HOMOLOGATION_DIAGNOSTICS:'true',
    DOCUMENTS_HOMOLOGATION_ORIGIN:FIXED.pages,
    DOCUMENTS_HOMOLOGATION_RELEASE:'2fee19e69e06ecd128be2b103354fc6c2fb4e431',
    DOCUMENTS_HOMOLOGATION_WORKER_ORIGIN:FIXED.origin,
    GOOGLE_DRIVE_OAUTH_CLIENT_ID:'client',
    GOOGLE_DRIVE_OAUTH_REDIRECT_URI:'https://example.test/callback'
  };
  return {
    id:FIXED.oldPreview,
    resources:{
      bindings:[
        ...PUBLIC_NAMES.map(name=>({name,type:'plain_text',text:vars[name]})),
        ...SECRET_NAMES.map(name=>({name,type:'secret_text'})),
        {name:'AUTH_DB',type:'d1',id:db}
      ],
      script_runtime:{compatibility_date:'2026-08-25',compatibility_flags:[]}
    }
  };
}

function version({gate,id}){
  const base=inspectOldPreview(oldPreview());
  const vars={
    ...base.vars,
    DOCUMENTS_DRIVE_WRITE_ENABLED:gate?'true':'false',
    DOCUMENTS_HOMOLOGATION_CONTROL_ID:control,
    DOCUMENTS_HOMOLOGATION_RELEASE:FIXED.candidateRelease
  };
  return {
    id,
    resources:{
      bindings:[
        ...PUBLIC_NAMES.map(name=>({name,type:'plain_text',text:vars[name]})),
        ...SECRET_NAMES.map(name=>({name,type:'secret_text'})),
        {name:'AUTH_DB',type:'d1',id:db}
      ],
      script_runtime:{compatibility_date:'2026-08-25',compatibility_flags:[]}
    }
  };
}

test('revogação D1 é estreita e não apaga controle',()=>{
  const sql=disableControlSql(control);
  assert.match(sql,/SET enabled=0/);
  assert.match(sql,new RegExp(control));
  assert.doesNotMatch(sql,/DELETE|DROP|allowed_username|file_id/i);
  assert.match(closedControlSql(control),/file_count/);
});

test('fechamento exige enabled zero, mesmo prazo e um arquivo',()=>{
  const ok=[{results:[{enabled:0,expires_at:expires,file_count:1}]}];
  assert.equal(validateClosedControl(ok,{expiresAt:expires}),true);
  assert.throws(()=>validateClosedControl([{results:[{enabled:1,expires_at:expires,file_count:1}]}],{expiresAt:expires}),/REVOGACAO_D1_NAO_CONFIRMADA/);
  assert.throws(()=>validateClosedControl([{results:[{enabled:0,expires_at:expires,file_count:2}]}],{expiresAt:expires}),/ESCOPO_CONTROLE_DIVERGENTE/);
});

test('preview atual precisa corresponder ao estado do ledger',()=>{
  const readLedger={
    previewVersionId:prepared,
    controlId:control,
    candidateRelease:FIXED.candidateRelease,
    writeGateEnabled:false
  };
  assert.equal(currentPreviewBase(version({gate:false,id:prepared}),readLedger).db,db);

  const writeLedger={
    ...readLedger,
    writeGateEnabled:true,
    writePreviewVersionId:written
  };
  assert.equal(currentPreviewBase(version({gate:true,id:written}),writeLedger).db,db);
  assert.throws(()=>currentPreviewBase(version({gate:false,id:written}),writeLedger),/GATE_PREVIEW_DIVERGENTE/);
});

test('encerramento recusa versão ou controle divergente',()=>{
  const ledger={
    previewVersionId:prepared,
    controlId:control,
    candidateRelease:FIXED.candidateRelease,
    writeGateEnabled:false
  };
  const wrong=version({gate:false,id:prepared});
  wrong.resources.bindings.find(x=>x.name==='DOCUMENTS_HOMOLOGATION_CONTROL_ID').text=FIXED.oldControl;
  assert.throws(()=>currentPreviewBase(wrong,ledger),/CONTROLE_PREVIEW_DIVERGENTE/);
});
