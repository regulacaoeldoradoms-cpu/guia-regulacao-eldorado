import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { groupFixture, GroupTestD1, handleChatRoute, handlePortalRoute } from './helpers/chat-group-fixture.mjs';
import { ensureGroupSchema } from '../chat-groups.js';
const payload = text => ({body:text,clientId:'group-'+crypto.randomUUID()});
const run=(name,fn)=>test(name,async()=>{const f=await groupFixture();try{await fn(f);}finally{f.close();}});

run('grupo: criação convida só amigos do criador, sem abrir histórico ao convidado',async f=>{
  const id=await f.create();
  assert.deepEqual((await f.json('alpha','/friends')).friends.map(p=>p.username),['beta','gamma']);
  const invitation=(await f.json('beta')).groups[0];assert.equal(invitation.state,'invited');
  assert.equal((await f.json('beta','/'+id+'/messages')).status,404);
  assert.equal((await f.json('beta','/'+id+'/messages',payload('Não deve entrar'))).status,404);
  assert.equal((await f.json('outsider','/'+id)).status,404);
  assert.equal((await f.json('beta','/'+id)).members.length,0);
  assert.ok(f.events.length>=3);
  assert.ok(f.events.every(({event})=>Object.keys(event).sort().join(',')==='groupId,type'));
});
run('grupo: contato profissional, admin e pedido pendente não substituem amizade',async f=>{
  for(const state of ['pending','removed','blocked']){
    await f.friend('alpha','beta',state);
    const result=await f.json('alpha','',{name:'Teste',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID()});
    assert.equal(result.status,409,JSON.stringify({result,errors:f.env.AUTH_DB.errors}));
  }
  const result=await f.json('beta','',{name:'Grupo do médico',description:'',members:['gamma'],clientId:'group-'+crypto.randomUUID()});assert.equal(result.status,409);
  assert.equal((await f.env.AUTH_DB.prepare('SELECT COUNT(*) AS n FROM portal_chat_groups').first()).n,0);
});
run('grupo: aceite revalida amizade e permite conversar sem amizade entre participantes',async f=>{
  const id=await f.create();const before=await f.json('alpha','/'+id+'/messages',payload('Anterior à entrada'));
  await f.friend('alpha','beta','removed');assert.equal((await f.json('beta','/'+id+'/accept',{})).status,409);
  await f.friend('alpha','beta');assert.equal((await f.json('beta','/'+id+'/accept',{})).status,200);
  assert.equal((await f.json('gamma','/'+id+'/accept',{})).status,200);
  const a=await f.json('beta','/'+id+'/messages',payload('Primeira pública ao grupo'));
  assert.equal(a.status,201,JSON.stringify({a,errors:f.env.AUTH_DB.errors}));
  const b=await f.json('gamma','/'+id+'/messages',payload('Resposta'));
  assert.equal(b.status,201);
  const history=await f.json('beta','/'+id+'/messages');assert.equal(history.messages.length,2);
  assert.ok(!history.messages.some(m=>m.id===before.message.id));
  assert.deepEqual(history.messages.map(m=>m.fromUser),['beta','gamma']);
});
run('grupo: administradores não usam seus próprios amigos nem mudam o criador',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  assert.equal((await f.json('alpha','/'+id+'/members',{username:'beta',action:'promote'})).status,200);
  assert.equal((await f.json('beta','/'+id+'/invite',{members:['delta']})).status,409);
  assert.deepEqual((await f.json('beta','/friends?groupId='+id)).friends,[]);
  await f.friend('alpha','delta');
  assert.equal((await f.json('beta','/'+id+'/invite',{members:['delta']})).status,200);
  assert.equal((await f.json('beta','/'+id+'/members',{username:'alpha',action:'remove'})).status,409);
  await f.json('beta','/'+id+'/settings',{name:'Novo nome',description:'',avatarDataUrl:'',creatorUsername:'beta'});
  assert.equal((await f.json('beta','/'+id)).group.creatorUsername,'alpha');
});
run('grupo: revogação entre seleção e INSERT é aplicada na mesma instrução SQL',async f=>{
  const id=await f.create(['gamma']);await f.friend('alpha','delta');
  const candidates=await f.json('alpha','/friends?groupId='+id);assert.ok(candidates.friends.some(p=>p.username==='delta'));
  let fired=false;
  f.env.AUTH_DB.beforeQuery=sql=>{if(!fired&&sql.includes("SELECT g.id,wanted.value,'invited'")){fired=true;f.env.AUTH_DB.database.exec("UPDATE social_relationships SET state='removed'");}};
  const result=await f.json('alpha','/'+id+'/invite',{members:['delta']});assert.equal(result.status,409);assert.equal(fired,true);
});
run('grupo: remoção durante consulta de candidatos não expõe amigos do criador',async f=>{
  const id=await f.create(['beta']);await f.json('beta','/'+id+'/accept',{});await f.json('alpha','/'+id+'/members',{username:'beta',action:'promote'});
  let fired=false;f.env.AUTH_DB.beforeQuery=sql=>{if(!fired&&sql.includes('SELECT u.username,u.name,u.role')){fired=true;f.env.AUTH_DB.database.prepare("UPDATE portal_chat_group_members SET state='removed' WHERE username='beta'").run();}};
  assert.deepEqual((await f.json('beta','/friends?groupId='+id)).friends,[]);assert.equal(fired,true);
});
run('grupo: membro comum não administra, outsider e sessão antiga não leem nem enviam',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  for(const action of ['invite','members','settings','close']){
    const body=action==='invite'?{members:['delta']}:action==='members'?{username:'gamma',action:'remove'}:action==='settings'?{name:'Outra',description:''}:{};
    assert.ok((await f.json('beta','/'+id+'/'+action,body)).status>=400);
  }
  assert.equal((await f.json('alpha','/'+id+'/messages',undefined,{sessionVersion:0})).status,403);
  assert.equal((await f.json('outsider','/'+id+'/messages',payload('Inválida'))).status,404);
  await f.env.AUTH_DB.prepare("UPDATE social_users SET suspended_at=CURRENT_TIMESTAMP WHERE auth_username='beta'").run();
  assert.equal((await f.json('beta','/'+id+'/messages')).status,403);
});
run('grupo: recibos individuais não antecipam leitura e não aceitam ID de outro grupo',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});await f.json('gamma','/'+id+'/accept',{});
  const sent=await f.json('alpha','/'+id+'/messages',payload('Teste recibos'));assert.equal(sent.status,201);
  await f.json('beta','/'+id+'/messages');
  let info=await f.json('alpha','/'+id+'/info?messageId='+sent.message.id);assert.ok(info.receipts.every(r=>!r.viewed&&!r.delivered));
  await f.json('beta','/'+id+'/receipt',{kind:'delivered',throughId:sent.message.id});
  info=await f.json('alpha','/'+id+'/info?messageId='+sent.message.id);assert.equal(info.receipts.find(r=>r.username==='beta').delivered,1);assert.equal(info.receipts.find(r=>r.username==='beta').viewed,0);
  await f.json('beta','/'+id+'/receipt',{kind:'read',throughId:sent.message.id});
  info=await f.json('alpha','/'+id+'/info?messageId='+sent.message.id);assert.equal(info.receipts.find(r=>r.username==='beta').viewed,1);assert.equal(info.receipts.find(r=>r.username==='gamma').viewed,0);
  const other=await f.create(['beta']);const elsewhere=await f.json('alpha','/'+other+'/messages',payload('Outro grupo'));
  const invalid=await f.json('beta','/'+id+'/receipt',{kind:'read',throughId:elsewhere.message.id});assert.equal(invalid.changed,false);
});
run('grupo: remoção/saída revogam todas as rotas e reentrada não expõe o intervalo ausente',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  await f.json('alpha','/'+id+'/messages',payload('Antes da saída'));
  assert.equal((await f.json('beta','/'+id+'/leave',{})).status,200);
  for(const suffix of ['', '/messages','/info?messageId=1'])assert.equal((await f.json('beta','/'+id+suffix)).status,404);
  await f.json('alpha','/'+id+'/messages',payload('Enquanto estava fora'));
  await f.json('alpha','/'+id+'/invite',{members:['beta']});await f.json('beta','/'+id+'/accept',{});
  assert.equal((await f.json('beta','/'+id+'/messages')).messages.length,0);
  await f.json('alpha','/'+id+'/messages',payload('Após a volta'));assert.equal((await f.json('beta','/'+id+'/messages')).messages.length,1);
  await f.json('alpha','/'+id+'/members',{username:'beta',action:'remove'});assert.equal((await f.json('beta','/'+id+'/messages')).status,404);
});
run('grupo: perda posterior de amizade não remove silenciosamente membro aceito',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});await f.friend('alpha','beta','removed');
  assert.equal((await f.json('beta','/'+id+'/messages',payload('Membro vigente'))).status,201);
});
run('grupo: repetição de criação e envio não duplica persistência',async f=>{
  const clientId='group-'+crypto.randomUUID(),id=await f.create(['beta'],{clientId});
  const same=await f.json('alpha','',{name:'Grupo sintético',description:'Somente testes',members:['beta'],clientId});assert.equal(same.group.id,id);
  const body=payload('Idempotente');const one=await f.json('alpha','/'+id+'/messages',body),two=await f.json('alpha','/'+id+'/messages',body);
  assert.equal(one.message.id,two.message.id);assert.equal(two.duplicate,true);
  assert.equal((await f.env.AUTH_DB.prepare('SELECT COUNT(*) AS n FROM portal_chat_group_messages').first()).n,1);
});
run('grupo: arquivamento conserva histórico e impede mensagens/novos convites',async f=>{
  const id=await f.create();const msg=await f.json('alpha','/'+id+'/messages',payload('Preservada'));
  assert.equal((await f.json('alpha','/'+id+'/leave',{})).status,409);
  assert.equal((await f.json('alpha','/'+id+'/close',{})).status,200);
  assert.equal((await f.json('alpha','/'+id+'/messages')).messages[0].id,msg.message.id);
  assert.equal((await f.json('alpha','/'+id+'/messages',payload('Bloqueada'))).status,409);
  assert.equal((await f.json('beta','/'+id+'/decline',{})).status,200);
  assert.equal((await f.json('alpha','/'+id+'/leave',{})).status,200);
});
run('grupo: foto raster validada e limites não aceitam URL, HTML nem entrada malformada',async f=>{
  for(const avatarDataUrl of ['https://example.invalid/image','data:image/svg+xml;base64,PHN2Zy8+','data:image/png;base64,ZmFrZQ==']){
    const result=await f.json('alpha','',{name:'Teste',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID(),avatarDataUrl});assert.equal(result.status,400);
  }
  const id=await f.create();
  for(const after of ['-1','NaN','99999999999999999999999'])assert.equal((await f.json('alpha','/'+id+'/messages?after='+after)).status,400);
  assert.equal((await f.json('alpha','/'+id+'/messages',{...payload('x'.repeat(2001))})).status,400);
});
run('grupo: paginação não duplica IDs e marcação de histórico usa o momento de entrada',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  for(let n=0;n<90;n++)await f.env.AUTH_DB.prepare('INSERT INTO portal_chat_group_messages(group_id,from_user,client_id,body) VALUES (?,?,?,?)').bind(id,'alpha','synthetic-'+n,'Página '+n).run();
  const first=await f.json('beta','/'+id+'/messages');const second=await f.json('beta','/'+id+'/messages?before='+first.messages[0].id);
  assert.equal(first.messages.length,80);assert.equal(second.messages.length,10);assert.equal(new Set([...first.messages,...second.messages].map(m=>m.id)).size,90);
});
run('grupo: schema aditivo é reaproveitado em outro isolate; flag impede ativação',async f=>{
  const cold={...f.env,AUTH_DB:new GroupTestD1(f.env.AUTH_DB.database)};
  assert.equal(await ensureGroupSchema(cold),true);
  assert.equal(await ensureGroupSchema({...cold,CHAT_GROUPS_ENABLED:'false'}),false);
  const response=await f.json('alpha');assert.equal(response.protocol,'groups-v1');
  f.env.CHAT_GROUPS_ENABLED='false';assert.equal((await f.json('alpha')).enabled,false);
});
run('grupo: roteador real exige sessão e preserva CORS antes de qualquer operação',async f=>{
  const origin='https://portal.test';
  const preflight=await handleChatRoute(new Request(origin+'/api/chat/groups',{method:'OPTIONS'}),f.env,origin,true);assert.equal(preflight.status,204);
  const anon=await handleChatRoute(new Request(origin+'/api/chat/groups'),f.env,origin,true);assert.equal(anon.status,403);
  const deniedOrigin=await handleChatRoute(new Request(origin+'/api/chat/groups'),f.env,origin,false);assert.equal(deniedOrigin.status,403);assert.equal(deniedOrigin.headers.get('Access-Control-Allow-Origin'),null);
  const registration=await handlePortalRoute(new Request(origin+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'127.0.0.71'},body:JSON.stringify({username:'token.fixture',password:'Synthetic-Registration-2026'})}),f.env,origin,true);
  const session=await registration.json();assert.ok(session.token);
  const response=await handleChatRoute(new Request(origin+'/api/chat/groups',{headers:{Authorization:'Bearer '+session.token}}),f.env,origin,true);
  // Account with no social identity cannot acquire groups by relying on the professional directory.
  assert.ok([200,403].includes(response.status));assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('grupo: integração preserva websocket único, escopo de invalidação e cache privado',()=>{
  const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
  const ui=read('../../js/portal-chat-groups.js'),bootstrap=read('../../js/portal-global-chat.js'),worker=read('../chat-realtime-do.js');
  assert.ok(bootstrap.indexOf('await script(GROUP_SCRIPT')<bootstrap.indexOf('await script(CHAT_SCRIPT'));
  assert.ok(!/new WebSocket|localStorage|sessionStorage|indexedDB|console\./.test(ui));
  assert.match(worker,/\? \{ type, groupId \} : null/);
  assert.match(ui,/portal:session-cleared/);assert.match(ui,/state\.cursor/);
});

run('grupo: recurso desativado nega toda mutação e não devolve falso sucesso',async f=>{
  const id=await f.create();f.env.CHAT_GROUPS_ENABLED='false';
  assert.equal((await f.json('alpha')).enabled,false);
  for(const [path,body] of [['',{name:'Bloqueado',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID()}],['/'+id+'/messages',payload('Bloqueada')],['/'+id+'/close',{}],['/'+id+'/receipt',{kind:'read',throughId:1}]]){
    const result=await f.json('alpha',path,body);assert.equal(result.status,503);assert.equal(result.code,'GROUP_DISABLED');assert.equal(result.message,undefined);
  }
  assert.equal((await f.env.AUTH_DB.prepare('SELECT COUNT(*) AS n FROM portal_chat_group_messages').first()).n,0);
});
run('grupo: retry de mensagem anterior não atravessa um novo intervalo de participação',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  const body=payload('Conteúdo do intervalo anterior'),sent=await f.json('beta','/'+id+'/messages',body);assert.equal(sent.status,201);
  await f.json('beta','/'+id+'/leave',{});await f.json('alpha','/'+id+'/invite',{members:['beta']});await f.json('beta','/'+id+'/accept',{});
  const retried=await f.json('beta','/'+id+'/messages',body);assert.equal(retried.status,409);assert.equal(retried.message,undefined);
  assert.equal((await f.json('beta','/'+id+'/messages')).messages.length,0);
});
run('grupo: convites pendentes são visíveis somente à administração',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  assert.deepEqual((await f.json('beta','/'+id)).members.map(m=>m.username),['alpha','beta']);
  assert.ok((await f.json('alpha','/'+id)).members.some(m=>m.username==='gamma'&&m.state==='invited'));
  await f.json('alpha','/'+id+'/members',{username:'beta',action:'promote'});
  assert.ok((await f.json('beta','/'+id)).members.some(m=>m.username==='gamma'&&m.state==='invited'));
});
function fillMemberships(f,username,count){
  const db=f.env.AUTH_DB.database;
  for(let n=0;n<count;n++){const id=crypto.randomUUID();db.prepare("INSERT INTO portal_chat_groups(id,creator_username,client_id,name,closed) VALUES (?,'outsider',?,'Grupo de limite',1)").run(id,'fixture-'+id);db.prepare("INSERT INTO portal_chat_group_members(group_id,username,state) VALUES (?,?,'invited')").run(id,username);}
}
run('grupo: limite por conta reserva convites e nunca trunca grupos acessíveis',async f=>{
  fillMemberships(f,'beta',99);const id=await f.create(['beta']);
  assert.equal((await f.json('beta')).groups.length,100);
  const denied=await f.json('alpha','',{name:'Capacidade',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID()});assert.equal(denied.status,409);
  await f.json('beta','/'+id+'/accept',{});assert.equal((await f.json('beta')).groups.length,100);
  const another=await f.create(['gamma']);assert.equal((await f.json('alpha','/'+another+'/invite',{members:['beta']})).status,409);
  await f.json('beta','/'+id+'/leave',{});assert.equal((await f.json('alpha','/'+another+'/invite',{members:['beta']})).status,200);
});
run('grupo: criador também respeita capacidade por conta e corrida entre seleção e convite',async f=>{
  fillMemberships(f,'alpha',100);
  assert.equal((await f.json('alpha','',{name:'Excesso',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID()})).status,409);
  f.env.AUTH_DB.database.exec("UPDATE portal_chat_group_members SET state='declined' WHERE username='alpha'");
  const id=await f.create(['gamma']);fillMemberships(f,'beta',99);
  let fired=false;f.env.AUTH_DB.beforeQuery=sql=>{if(!fired&&sql.includes("SELECT g.id,wanted.value,'invited'")){fired=true;fillMemberships(f,'beta',1);}};
  assert.equal((await f.json('alpha','/'+id+'/invite',{members:['beta']})).status,409);assert.equal(fired,true);
});
run('grupo: saída do criador não troca a referência nem autoriza autoamizade',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});await f.json('alpha','/'+id+'/members',{username:'beta',action:'promote'});
  assert.equal((await f.json('alpha','/'+id+'/leave',{})).status,200);
  assert.equal((await f.json('alpha','/'+id+'/messages')).status,404);
  assert.equal((await f.json('beta','/'+id)).group.creatorUsername,'alpha');
  assert.equal((await f.json('beta','/'+id+'/invite',{members:['alpha']})).status,409,'Creator departure has no automatic reentry in V1');
  await f.friend('alpha','delta');assert.equal((await f.json('beta','/'+id+'/invite',{members:['delta']})).status,200);
});
run('grupo: limite de mensagens e criações não impede retry idempotente permitido',async f=>{
  const id=await f.create(['beta']);let last;
  for(let n=0;n<60;n++){last=payload('Limite '+n);assert.equal((await f.json('alpha','/'+id+'/messages',last)).status,201);}
  assert.equal((await f.json('alpha','/'+id+'/messages',last)).status,200);
  assert.equal((await f.json('alpha','/'+id+'/messages',payload('Excedeu'))).status,409);
  for(let n=0;n<4;n++)await f.create(['beta']);
  assert.equal((await f.json('alpha','',{name:'Excesso diário',description:'',members:['beta'],clientId:'group-'+crypto.randomUUID()})).status,409);
});


run('grupo: mensagens não geram push para convites ainda não aceitos',async f=>{
  const id=await f.create();await f.json('beta','/'+id+'/accept',{});
  const pushes=[];f.env.AUTH_DB.beforeQuery=(sql,values)=>{if(sql.includes('SELECT endpoint')&&sql.includes('FROM portal_push_subscriptions'))pushes.push(values[0]);};
  await f.json('alpha','/'+id+'/messages',payload('Somente membros recebem push'));
  assert.deepEqual(pushes,['beta']);
  pushes.length=0;await f.friend('alpha','delta');await f.json('alpha','/'+id+'/invite',{members:['delta']});
  assert.ok(pushes.includes('delta'),'Invitation still notifies its recipient');
});
run('grupo: listas são leves e fotos são privadas, versionadas e independentes das mensagens',async f=>{
  const image='data:image/png;base64,'+Buffer.from('\x89PNG\r\n\x1a\nfixture','binary').toString('base64');
  const id=await f.create(['beta'],{avatarDataUrl:image});
  const first=(await f.json('alpha')).groups[0];
  assert.equal(first.avatarAvailable,1);assert.equal(first.avatarDataUrl,undefined);assert.ok(first.avatarVersion);
  assert.equal((await f.json('beta','/'+id+'/avatar')).avatarDataUrl,image);
  assert.equal((await f.json('outsider','/'+id+'/avatar')).status,404);
  await f.json('alpha','/'+id+'/messages',payload('Não altera versão da foto'));
  assert.equal((await f.json('alpha')).groups[0].avatarVersion,first.avatarVersion);
  await f.json('alpha','/'+id+'/settings',{name:'Nome alterado',description:''});
  assert.equal((await f.json('alpha','/'+id+'/avatar')).avatarDataUrl,image);
  assert.equal((await f.json('alpha')).groups[0].avatarVersion,first.avatarVersion);
  await f.json('alpha','/'+id+'/settings',{name:'Sem foto',description:'',avatarDataUrl:''});
  assert.equal((await f.json('alpha')).groups[0].avatarAvailable,0);
  assert.notEqual((await f.json('alpha')).groups[0].avatarVersion,first.avatarVersion);
});
