// Synthetic API data only. Real HTML/CSS/JS run unchanged against intercepted APIs.
import { syntheticProtocolSource } from './dark-audit-protocol-fixture.mjs';
export const auditUser = {
  id:'audit-user-synthetic', username:'audit.synthetic', name:'Pessoa Fictícia Auditoria',
  email:'audit@example.invalid', role:'admin', councilRole:'presidente', emailVerified:true,
  accountLevel:'ouro', interfaceTheme:'dark', additionalRoles:['documentos'], active:true,
  documentCapabilities:{ view:true, extract:true, edit:true, manage:true }
};
export const auditProfile = { id:auditUser.id, userId:auditUser.id, name:auditUser.name, handle:'audit.synthetic', professional:{ label:'Perfil sintético' }, avatarAvailable:false, defaultPostAudience:'friends', bio:'Perfil exclusivamente sintético para auditoria visual.',isSelf:true,coverTheme:'aurora',coverPattern:'waves',moduleOrder:['about','friends','posts'],interests:['Teste sintético'],counts:{friends:1},acceptFriendRequests:true,profileVisibility:'portal' };
export const auditFriend={ id:'audit-friend',name:'CONTATO FICTÍCIO',username:'synthetic.friend',handle:'synthetic.friend',role:'medico',professional:{label:'Perfil fictício'},avatarAvailable:false,online:true,unread:1,lastSeen:'2026-09-24T12:00:00Z',lastMessageAt:'2026-09-24T12:00:00Z' };
export const auditPost={id:'audit-post',author:auditProfile,own:true,body:'PUBLICAÇÃO FICTÍCIA PARA AUDITORIA DE INTERFACE.',audience:'friends',createdAt:'2026-09-24T12:00:00Z',counts:{comments:1,reactions:1},reacted:false};
export const auditNotifications=[{id:'audit-notification',actor:auditFriend,text:'comentou uma publicação fictícia',read:false,type:'comment',createdAt:'2026-09-24T12:00:00Z'},{id:'audit-judicial',text:'Alerta judicial fictício para teste de interface',read:false,type:'judicial_alert',createdAt:'2026-09-24T12:00:00Z',judicial:{receivedAt:'2026-09-24T12:00:00Z'}}];
export const auditPatient = { id:'audit-patient', name:'PACIENTE FICTÍCIO AUDITORIA', birthDate:'1980-01-01', cpf:'00000000000', phone:'00000000000', cns:'000000000000000', city:'Município fictício' };
export const auditFollowup = { id:'audit-followup', patientId:auditPatient.id, patientName:auditPatient.name, specialty:'Cardiologia', condition:'Condição fictícia de teste', lastConsultationDate:'2026-09-01', returnDueDate:'2026-10-01', reminderDates:['2026-09-16','2026-09-21','2026-09-24'], status:'SOLICITAR', alertToday:true, reminderNumber:3, returnMonths:1, resolution:'Informação exclusivamente sintética.' };
export const auditAgenda = Array.from({length:3},(_,i)=>({sourceId:`audit-appointment-${i}`,patient:`PACIENTE FICTÍCIO ${i+1}`,specialty:'Cardiologia',specialist:'PROFISSIONAL FICTÍCIO',appointmentDate:'2026-09-25',appointmentTime:'08:00',requestedAt:'24/09/2026',active:true,unread:i<2}));
export async function installAuditFixture(context, { theme='dark', authenticated=true, responses={}, userOverrides={} } = {}) {
  const calls = [], unexpected = [], errors = [], blocked=[];
  const user = { ...auditUser, interfaceTheme:theme, ...userOverrides };
  const security={email:user.email,emailVerified:user.emailVerified,firebaseReady:true,interfaceTheme:theme,interfaceSoundsEnabled:false,interfaceSoundsMuted:false,interfaceSoundVolume:32};
  await context.addInitScript(({ user, theme, authenticated }) => {
    localStorage.setItem('regulacao.portal.theme.active.v1', theme);
    if (authenticated) {
      sessionStorage.setItem('regulacao.portal.session', 'synthetic-audit-token-no-backend');
      sessionStorage.setItem('regulacao.portal.user', JSON.stringify(user));
      sessionStorage.setItem('regulacao.portal.user.validatedAt', String(Date.now()));
    }
    delete window.PushManager;
    // Simulate a browser without SW: blocked SW + an unresolved .ready promise
    // would otherwise stall product warmup before the real Documents UI loads.
    delete Navigator.prototype.serviceWorker;
    // No websocket/EventSource/beacon can escape Playwright's HTTP interception.
    window.WebSocket = class { constructor() { throw new Error('Network disabled in synthetic audit'); } };
    window.EventSource = class { constructor() { throw new Error('Network disabled in synthetic audit'); } };
    Object.defineProperty(navigator, 'sendBeacon', { configurable:true, value:() => false });
  }, { user, theme, authenticated });
  await context.route('**/*', async (route) => {
    const request = route.request(), url = new URL(request.url());
    if(url.origin==='http://127.0.0.1:4176'&&url.pathname==='/data/protocol-source.html')return route.fulfill({contentType:'text/html',body:await syntheticProtocolSource()});
    if (url.origin === 'http://127.0.0.1:4176' && !url.pathname.startsWith('/api/')) return route.continue();
    calls.push({ method:request.method(), path:url.pathname, host:url.hostname, action:'fulfilled-locally' });
    if(url.hostname==='i.ibb.co') {blocked.push({url:url.href,reason:'External image explicitly blocked; no download'});return route.abort('blockedbyclient');}
    if(url.hostname==='raw.githubusercontent.com'&&url.pathname==='/regulacaoeldoradoms-cpu/guia-regulacao-eldorado/3c09e13f343ddb4995910d02b349fb164dc08256/index.html')return route.fulfill({contentType:'text/html',body:await syntheticProtocolSource()});
    const override = responses[url.pathname];
    if (override) return route.fulfill({ status:override.status || 200, contentType:'application/json', body:JSON.stringify(override.body ?? override) });
    let data;
    if (url.pathname === '/api/observability') return route.fulfill({status:204,body:''});
    if (url.pathname === '/api/auth/me' || url.pathname === '/api/auth/login') data = { user:authenticated ? user : null, token:'synthetic-audit-token-no-backend' };
    else if (url.pathname === '/api/auth/security') {
      if(request.method()==='PATCH') {Object.assign(security,request.postDataJSON()||{});Object.assign(user,{interfaceTheme:security.interfaceTheme,interfaceSoundsEnabled:security.interfaceSoundsEnabled,interfaceSoundsMuted:security.interfaceSoundsMuted});}
      data={security,user};
    }
    else if (url.pathname === '/api/auth/settings') data = { user };
    else if (url.pathname === '/api/auth/change-password') data = {user:{...user,mustChangePassword:false},token:'synthetic-audit-token-no-backend'};
    else if (url.pathname === '/api/auth/email/send-verification') data = {ok:true,message:'Verificação fictícia preparada localmente.'};
    else if (url.pathname === '/api/admin/users') data = { users:[user] };
    else if (url.pathname === '/api/social/config') data = { backendEnabled:true, homeEnabled:true, available:true, profile:auditProfile, toolsPath:'/ferramentas/' };
    else if (url.pathname === '/api/social/me' || /^\/api\/social\/profiles\/[^/]+$/.test(url.pathname)) data = { profile:auditProfile };
    else if (url.pathname === '/api/social/feed' || url.pathname === '/api/social/posts' || /\/api\/social\/profiles\/[^/]+\/posts$/.test(url.pathname)) data = { posts:[auditPost], nextCursor:'' };
    else if(url.pathname===`/api/social/posts/${auditPost.id}/comments`)data={comments:[{id:'audit-comment',author:auditFriend,body:'Comentário fictício.',createdAt:'2026-09-24T12:00:00Z',own:false}],nextCursor:''};
    else if (url.pathname === '/api/social/moderation/reports') data = { reports:[], nextCursor:'' };
    else if (url.pathname === '/api/social/migrations/status') data = { migrations:[{ version:'synthetic-audit', appliedAt:'2026-09-24T12:00:00Z' }] };
    else if (url.pathname==='/api/social/notifications') data = { notifications:auditNotifications,unreadCount:2,nextCursor:'' };
    else if (url.pathname==='/api/council/notifications') data = { notifications:[], unreadCount:0 };
    else if (url.pathname==='/api/social/relationships') data = { profiles:[], requests:[], nextCursor:'' };
    else if (url.pathname==='/api/social/search') data = {profiles:[],nextCursor:''};
    else if (url.pathname === '/api/chat/contacts') data = { contacts:[], conversations:[], unreadCount:0 };
    else if (url.pathname === '/api/chat/presence') data = {ok:true};
    else if (url.pathname === '/api/chat/users') data = {users:[auditFriend]};
    else if (url.pathname === '/api/chat/messages') data = {messages:[{id:1,fromUser:auditFriend.username,body:'MENSAGEM FICTÍCIA RECEBIDA',sentAt:'2026-09-24T12:00:00Z'},{id:2,fromUser:user.username,body:'MENSAGEM FICTÍCIA ENVIADA',sentAt:'2026-09-24T12:01:00Z'}]};
    else if (url.pathname === '/api/telemedicina/dashboard') data = { today:'2026-09-24', actor:{ admin:true }, patients:[auditPatient], followups:[auditFollowup], counts:{ total:1, pending:1, due:1 } };
    else if (/^\/api\/telemedicina\/patients\/[^/]+$/.test(url.pathname)) data = { patient:auditPatient, followups:[auditFollowup], events:[] };
    else if (url.pathname === '/api/agenda') data = { records:auditAgenda, summary:{ active:3, unread:2, lastSyncAt:'2026-09-24T12:00:00Z' } };
    else if (url.pathname === '/api/documents/access') data = { capabilities:user.documentCapabilities, drive:{ connected:true, configured:true, writeEnabled:false } };
    else if (url.pathname === '/api/documents/drive/list') data = { items:[], nextPageToken:'' };
    else if (url.pathname === '/api/documents/preferences') data = { preferences:{} };
    else if (url.pathname === '/api/documents/ai/config') data = { enabled:false };
    else if (url.pathname === '/api/council/all' || url.pathname === '/api/council/my') data = { manifestations:[] };
    else if (url.pathname === '/api/admin/usage') data = { doctors:[{username:'synthetic.doctor',name:'PROFISSIONAL FICTÍCIO',jobTitle:'Perfil fictício',active:true,online:true,lastSeen:'2026-09-24T12:00:00Z',history:[{usageDate:'2026-09-24',guideVisits:2,visits:2,firstSeen:'2026-09-24T10:00:00Z',lastSeen:'2026-09-24T12:00:00Z'}]}] };
    else if(url.pathname==='/api/admin/readiness')data={readyForControlledDeploy:false,blockers:['synthetic'],generatedAt:'2026-09-24T12:00:00Z',checks:[{label:'Teste pronto',detail:'Estado sintético pronto',ok:true},{label:'Teste pendente',detail:'Estado sintético pendente',ok:false,requiredBeforeDeploy:true},{label:'Teste informativo',detail:'Estado sintético informativo',ok:false,requiredBeforeDeploy:false}]};
    else if (url.pathname==='/api/achievements') data = { achievements:[], unlocked:[], summary:{} };
    else {
      unexpected.push({ method:request.method(), path:url.pathname, host:url.hostname });
      // Unknown APIs fail closed and surface in coverage; never forward anything.
      return route.fulfill({ status:503, contentType:'application/json', body:JSON.stringify({ error:'Endpoint não modelado na auditoria sintética', code:'AUDIT_FIXTURE_MISSING' }) });
    }
    return route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(data) });
  });
  const observe=page=>page.on('pageerror',error=>errors.push(error.message));
  context.pages().forEach(observe);
  context.on('page',observe);
  return { calls, unexpected, errors, blocked };
}
