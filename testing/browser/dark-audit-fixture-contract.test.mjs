import assert from 'node:assert/strict';
import test from 'node:test';
import { installAuditFixture, auditAgenda, auditUser, agendaContactCapabilityFromSource } from './dark-audit-fixture.mjs';

async function fixtureRequest(path, method = 'GET', options = {}, page = null) {
  let handler, response, forwarded = false;
  const context = { addInitScript:async()=>{}, route:async(_pattern,fn)=>{handler=fn;}, pages:()=>[], on:()=>{} };
  const network = await installAuditFixture(context, options);
  await handler({ request:()=>({ url:()=>`https://synthetic.invalid${path}`, method:()=>method, postDataJSON:()=>({}), frame:()=>({page:()=>page}) }),
    fulfill:async value=>{response=value;}, continue:async()=>{forwarded=true;}, abort:async()=>{} });
  return {network,response,forwarded};
}
test('own citizen identity preparation is synthetic and read-only',async()=>{
  const read=await fixtureRequest('/api/citizen/identity');
  assert.deepEqual(JSON.parse(read.response.body),{identity:{displayName:auditUser.name,handle:auditUser.username,canChangeHandle:true}});
  assert.deepEqual(read.network.unexpected,[]);
  assert.equal(read.forwarded,false);
  const mutation=await fixtureRequest('/api/citizen/identity','PATCH');
  assert.equal(mutation.response.status,503);
  assert.equal(mutation.network.unexpected.length,1);
  assert.equal(mutation.forwarded,false);
});
for (const path of ['/api/pets/me','/api/pets/catalog','/api/pets/achievements']) test(`mascot read ${path} models PETS_ENABLED=false without forwarding`,async()=>{
  const {network,response,forwarded}=await fixtureRequest(path);
  assert.equal(response.status,503);
  assert.equal(JSON.parse(response.body).code,'PETS_DISABLED');
  assert.deepEqual(network.unexpected,[]);
  assert.equal(forwarded,false);
});
for (const [path,method] of [['/api/pets/me','POST'],['/api/pets/catalog','POST'],['/api/pets/achievements','POST'],['/api/pets/unknown','GET'],['/api/pets/care','POST']]) test(`unmodeled mascot ${method} ${path} remains fail closed`,async()=>{
  const {network,response,forwarded}=await fixtureRequest(path,method);
  assert.equal(JSON.parse(response.body).code,'AUDIT_FIXTURE_MISSING');
  assert.equal(network.unexpected.length,1);
  assert.equal(forwarded,false);
});
test('the audit explicitly models unavailable realtime and keeps the HTTP fallback', async()=>{
  const {network,response,forwarded} = await fixtureRequest('/api/chat/realtime/ticket','POST');
  assert.equal(response.status,503);
  assert.equal(JSON.parse(response.body).error,'Tempo real temporariamente indisponível.');
  assert.deepEqual(network.unexpected,[]);
  assert.equal(forwarded,false);
});
for (const path of ['/api/chat/delivery','/api/chat/typing','/api/chat/read']) test(`models ${path} only as POST`,async()=>{
  const valid=await fixtureRequest(path,'POST');
  assert.equal(valid.response.status,200);
  assert.equal(JSON.parse(valid.response.body).ok,true);
  assert.deepEqual(valid.network.unexpected,[]);
  const invalid=await fixtureRequest(path,'GET');
  assert.equal(invalid.response.status,503);
  assert.equal(invalid.network.unexpected.length,1);
  assert.equal(invalid.forwarded,false);
});
test('agenda contact state matches the synthetic appointments',async()=>{
  const {response,network}=await fixtureRequest('/api/agenda/contact-state');
  assert.deepEqual(JSON.parse(response.body),{contactCapability:'patient-directory-v1',active:3,known:3,missing:0,knownSourceIds:auditAgenda.map(item=>item.sourceId)});
  assert.deepEqual(network.unexpected,[]);
});
test('agenda listing models the current contact capability',async()=>{
  const {response,network}=await fixtureRequest('/api/agenda');
  assert.equal(JSON.parse(response.body).contactCapability,'patient-directory-v1');
  assert.deepEqual(network.unexpected,[]);
});
test('baseline and current pages receive their own synthetic Agenda capability',async()=>{
  const currentPage={},basePage={};
  const options={agendaContactCapability:request=>request.frame().page()===currentPage?'patient-directory-v1':'patient-details-v2'};
  for(const path of ['/api/agenda/contact-state','/api/agenda'])for(const [page,expected]of [[currentPage,'patient-directory-v1'],[basePage,'patient-details-v2']]){
    const {response,network,forwarded}=await fixtureRequest(path,'GET',options,page);
    assert.equal(JSON.parse(response.body).contactCapability,expected);
    assert.deepEqual(network.unexpected,[]);
    assert.equal(forwarded,false);
  }
});
test('Agenda capability is extracted only from an explicit bridge declaration',()=>{
  for(const capability of ['patient-details-v2','patient-directory-v1'])assert.equal(agendaContactCapabilityFromSource(`  const CONTACT_CAPABILITY = '${capability}';\n`),capability);
  assert.throws(()=>agendaContactCapabilityFromSource("// patient-details-v2\nconst OTHER = 'patient-directory-v1';"),/must declare/);
});
test('group listing models enabled empty groups without forwarding requests',async()=>{
  const {response,network,forwarded}=await fixtureRequest('/api/chat/groups');
  assert.equal(response.status,200);
  assert.deepEqual(JSON.parse(response.body),{enabled:true,groups:[],protocol:'groups-v1'});
  assert.deepEqual(network.unexpected,[]);
  assert.equal(forwarded,false);
});
for (const [path,method] of [['/api/chat/groups','POST'],['/api/chat/groups/unknown/messages','GET'],['/api/chat/realtime/ticket','GET'],['/api/chat/realtime/tickets','POST'],['/api/agenda/contact-state','POST'],['/api/unknown','GET']]) test(`unmodeled ${method} ${path} still fails closed`,async()=>{
  const {response,network,forwarded}=await fixtureRequest(path,method);
  assert.equal(response.status,503);
  assert.equal(JSON.parse(response.body).code,'AUDIT_FIXTURE_MISSING');
  assert.equal(network.unexpected.length,1);
  assert.equal(forwarded,false);
});

test('tutorial read is explicit synthetic metadata and never forwards',async()=>{const {network,response,forwarded}=await fixtureRequest('/api/portal-tutorials/citizen','GET');assert.deepEqual(JSON.parse(response.body),{completion:null});assert.deepEqual(network.unexpected,[]);assert.equal(forwarded,false);});
for(const [path,method]of [['/api/portal-tutorials/citizen','POST'],['/api/portal-tutorials/citizen/complete','POST']])test(`tutorial mutation ${path} remains fail closed`,async()=>{const {network,response,forwarded}=await fixtureRequest(path,method);assert.equal(response.status,503);assert.equal(network.unexpected.length,1);assert.equal(forwarded,false);});
