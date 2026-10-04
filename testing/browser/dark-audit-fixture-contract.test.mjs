import assert from 'node:assert/strict';
import test from 'node:test';
import { installAuditFixture, auditAgenda } from './dark-audit-fixture.mjs';

async function fixtureRequest(path, method = 'GET') {
  let handler, response, forwarded = false;
  const context = { addInitScript:async()=>{}, route:async(_pattern,fn)=>{handler=fn;}, pages:()=>[], on:()=>{} };
  const network = await installAuditFixture(context);
  await handler({ request:()=>({ url:()=>`https://synthetic.invalid${path}`, method:()=>method, postDataJSON:()=>({}) }),
    fulfill:async value=>{response=value;}, continue:async()=>{forwarded=true;}, abort:async()=>{} });
  return {network,response,forwarded};
}
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
  assert.deepEqual(JSON.parse(response.body),{active:3,known:3,missing:0,knownSourceIds:auditAgenda.map(item=>item.sourceId)});
  assert.deepEqual(network.unexpected,[]);
});
for (const [path,method] of [['/api/chat/realtime/ticket','GET'],['/api/chat/realtime/tickets','POST'],['/api/agenda/contact-state','POST'],['/api/unknown','GET']]) test(`unmodeled ${method} ${path} still fails closed`,async()=>{
  const {response,network,forwarded}=await fixtureRequest(path,method);
  assert.equal(response.status,503);
  assert.equal(JSON.parse(response.body).code,'AUDIT_FIXTURE_MISSING');
  assert.equal(network.unexpected.length,1);
  assert.equal(forwarded,false);
});
