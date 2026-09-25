import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { installAuditFixture, auditPost, auditFriend } from './dark-audit-fixture.mjs';
import { inspectSurfaces } from './dark-audit-surfaces.mjs';

async function capture(page,info,name) {
  await page.waitForTimeout(150);
  const report=await inspectSurfaces(page);
  await writeFile(info.outputPath(`${name}.json`),JSON.stringify(report,null,2));
  await info.attach(`${name}.json`,{body:Buffer.from(JSON.stringify(report,null,2)),contentType:'application/json'});
  await page.screenshot({path:info.outputPath(`${name}.png`),fullPage:true,animations:'disabled',caret:'hide'});
  expect(report.theme).toBe('dark');
  if(process.env.DARK_AUDIT_REPORT_ONLY!=='1')expect.soft(report.bright,`Unexpected bright surfaces in ${name}`).toEqual([]);
}
async function finish(info,network) {
  await info.attach('network-coverage.json',{body:Buffer.from(JSON.stringify(network,null,2)),contentType:'application/json'});
  expect(network.unexpected,'No unmodeled API can count as successful state coverage').toEqual([]);
  expect(network.errors,'Social/account/admin scenarios have no baseline JavaScript error').toEqual([]);
}

test('social states: populated feed, edit, comments, confirmation and notification panel',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  await page.goto('/');
  const post=page.locator('[data-post-id="audit-post"]');
  await expect(post).toBeVisible();
  await capture(page,info,'feed-populated');
  await post.getByRole('button',{name:'Editar',exact:true}).click();
  await expect(post.locator('.social-post-edit')).toBeVisible();
  await post.locator('.social-textarea').focus();
  await capture(page,info,'feed-edit-focus');
  await post.getByRole('button',{name:'Cancelar',exact:true}).click();
  await post.getByRole('button',{name:/Comentários/}).click();
  await expect(post.locator('.social-comment').first()).toBeVisible();
  await capture(page,info,'feed-comments');
  await post.getByRole('button',{name:'Excluir',exact:true}).click();
  await expect(page.locator('#socialConfirmDialog')).toBeVisible();
  await capture(page,info,'social-delete-confirmation');
  await page.locator('#socialConfirmDialog').getByRole('button',{name:'Cancelar'}).click();
  const trigger=page.locator('#socialNotificationTriggerMobile:visible,#socialNotificationTriggerDesktop:visible');
  await trigger.click();
  await expect(page.locator('.social-notification-panel:visible')).toBeVisible();
  await expect(page.locator('.social-notification-panel:visible .social-notification.judicial')).toBeVisible();
  await capture(page,info,'notification-panel-populated');
  await finish(info,network);
});

test('social states: report dialog from another synthetic author',async({page,context},info)=>{
  const network=await installAuditFixture(context,{responses:{'/api/social/feed':{posts:[{...auditPost,own:false,author:auditFriend}],nextCursor:''}}});
  await page.goto('/');
  await page.locator('[data-post-id="audit-post"]').getByRole('button',{name:'Denunciar',exact:true}).click();
  await expect(page.locator('#socialReportDialog')).toBeVisible();
  await page.locator('#socialReportReason').selectOption('privacidade');
  await page.locator('#socialReportDetails').fill('RELATO FICTÍCIO SEM ENVIO.');
  await capture(page,info,'social-report-dialog');
  await page.locator('#socialReportDialog').getByRole('button',{name:'Cancelar'}).click();
  await finish(info,network);
});

test('social states: chat contacts, search empty, incoming/outgoing messages and error',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  await page.goto('/ferramentas/');
  await page.locator('#portalChatLauncher').click();
  await expect(page.locator('[data-chat-user="synthetic.friend"]')).toBeVisible();
  await capture(page,info,'chat-contact-list');
  await page.locator('#portalChatSearch').fill('inexistente-ficticio');
  await expect(page.locator('#portalChatList .portal-chat-empty')).toBeVisible();
  await capture(page,info,'chat-empty-filter');
  await page.locator('#portalChatSearch').fill('');
  await page.locator('[data-chat-user="synthetic.friend"]').click();
  await expect(page.locator('.portal-chat-message.mine')).toBeVisible();
  await expect(page.locator('.portal-chat-message.theirs')).toBeVisible();
  await page.locator('#portalChatInput').fill('RASCUNHO FICTÍCIO');
  await capture(page,info,'chat-conversation-focus');
  await context.route('**/api/chat/messages',route=>route.request().method()==='POST'?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Falha sintética de envio'})}):route.fallback());
  await page.locator('#portalChatSend').click();
  await expect(page.locator('#portalChatStatus')).toContainText('Falha sintética');
  await capture(page,info,'chat-error');
  await finish(info,network);
});

test('social states: profile editor, native photo dialog, settings success and theme persistence',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  await page.goto('/perfil/');
  await expect(page.locator('#profileEditor')).toBeVisible();
  await page.locator('#profileEditBio').fill('BIO FICTÍCIA EM EDIÇÃO');
  await capture(page,info,'profile-editor-focus');
  await page.locator('#profilePhotoCamera').click();
  await expect(page.locator('#profilePhotoDialog')).toBeVisible();
  await capture(page,info,'profile-photo-dialog');
  await page.locator('#profilePhotoDialog').getByRole('button',{name:'Cancelar'}).click();
  await page.goto('/configuracoes/');
  await expect(page.locator('#interfaceThemeDark')).toBeChecked();
  await page.locator('#socialProfileVisibility').selectOption('friends');
  await page.locator('#saveSocialPreferences').click();
  await expect(page.locator('#socialPreferencesStatus')).toHaveClass(/success/);
  await capture(page,info,'settings-success');
  await page.locator('label:has(#interfaceThemeLight)').click();
  await expect(page.locator('html')).toHaveAttribute('data-portal-theme','light');
  await page.locator('label:has(#interfaceThemeDark)').click();
  await expect(page.locator('html')).toHaveAttribute('data-portal-theme','dark');
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('regulacao.portal.theme.active.v1'))).toBe('dark');
  await capture(page,info,'settings-dark-saved');
  await finish(info,network);
});

test('social states: security first access, mismatch error and verification gate',async({page,context},info)=>{
  const network=await installAuditFixture(context,{userOverrides:{mustChangePassword:true,emailVerified:false,emailVerificationRequired:true,accountLevel:'bronze'}});
  await page.goto('/seguranca/?primeiro-acesso=1');
  await expect(page.locator('body')).toHaveClass(/security-first-access/);
  await expect(page.locator('#firstAccessNotice')).toBeVisible();
  await capture(page,info,'security-first-access');
  await page.locator('#currentPassword').fill('senha-ficticia');
  await page.locator('#newPassword').fill('nova-ficticia-1');
  await page.locator('#confirmPassword').fill('nova-ficticia-2');
  await page.locator('#changePasswordButton').click();
  await expect(page.locator('#accountStatus')).toHaveClass(/error/);
  await capture(page,info,'security-validation-error');
  await finish(info,network);
});

test('social states: login invalid credentials',async({page,context},info)=>{
  const network=await installAuditFixture(context,{authenticated:false,responses:{'/api/auth/login':{status:401,body:{error:'Credenciais fictícias inválidas.'}}}});
  await page.goto('/login/');
  await page.locator('#loginUsername').fill('audit.invalid');
  await page.locator('#loginPassword').fill('senha-ficticia');
  await page.locator('#loginSubmit').click();
  await expect(page.locator('#loginStatus')).toBeVisible();
  await expect(page.locator('#loginSubmit')).toBeEnabled();
  await capture(page,info,'login-error');
  await finish(info,network);
});

test('social states: friends populated, empty list and empty search',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  await context.route('**/api/social/relationships?*',route=>{
    const type=new URL(route.request().url()).searchParams.get('type');
    return route.fulfill({contentType:'application/json',body:JSON.stringify({profiles:type==='friends'?[{...auditFriend,relationship:'friends'}]:[],nextCursor:''})});
  });
  await page.goto('/amigos/');
  await expect(page.locator('#relationshipList')).toContainText(auditFriend.name);
  await capture(page,info,'friends-populated');
  await context.unroute('**/api/social/relationships?*');
  await page.reload();
  await expect(page.locator('#relationshipList .social-empty')).toBeVisible();
  await capture(page,info,'friends-empty-list');
  await page.locator('#socialSearchInput').fill('amigo-ficticio-ausente');
  await page.locator('#socialSearchForm').getByRole('button',{name:'Pesquisar'}).click();
  await expect(page.locator('#socialSearchResults .social-empty')).toBeVisible();
  await capture(page,info,'friends-empty-search');
  await finish(info,network);
});

test('social states: verification gate and success',async({page,context},info)=>{
  const network=await installAuditFixture(context,{userOverrides:{emailVerified:false,emailVerificationRequired:true,accountLevel:'bronze'}});
  await page.goto('/seguranca/?verificar-email=1');
  await expect(page.locator('body')).toHaveClass(/security-verification-gate/);
  await expect(page.locator('#emailVerificationNotice')).toBeVisible();
  await capture(page,info,'security-verification-gate');
  await page.locator('#sendEmailVerification').click();
  await expect(page.locator('#securityStatus')).toHaveClass(/success/);
  await capture(page,info,'security-verification-success');
  await finish(info,network);
});

test('social states: feed loading, empty and error via real fetch transitions',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  let release;const hold=new Promise(resolve=>{release=resolve;});
  await context.route('**/api/social/feed',async route=>{await hold;await route.fulfill({contentType:'application/json',body:JSON.stringify({posts:[],nextCursor:''})});});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#socialFeedList')).toBeAttached();
  // Home readiness intentionally keeps its real loader until the feed settles.
  await expect(page.locator('#homeLoading')).toBeVisible();
  await capture(page,info,'home-loading');
  release();
  await expect(page.locator('#socialFeedList .social-empty')).toBeVisible();
  await capture(page,info,'feed-empty');
  await context.unroute('**/api/social/feed');
  await context.route('**/api/social/feed',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Falha fictícia ao consultar publicações'})}));
  await page.reload();
  await expect(page.locator('#toolsFallback')).toBeVisible();
  await expect(page.locator('#homeFallbackNotice')).toContainText('HTTP 503');
  await capture(page,info,'feed-error');
  await finish(info,network);
});

test('social states: admin edit/reset modals, empty search and diagnostic states',async({page,context},info)=>{
  const network=await installAuditFixture(context);
  await page.goto('/admin/usuarios/');
  await page.locator('[data-action="edit"]').first().click();
  await expect(page.locator('#editUserModal')).toHaveClass(/open/);
  await page.locator('#editName').focus();
  await capture(page,info,'admin-edit-modal');
  await page.locator('#editUserModal [data-close-modal]').first().click();
  await page.locator('[data-action="reset"]').first().click();
  await expect(page.locator('#resetPasswordModal')).toHaveClass(/open/);
  await capture(page,info,'admin-reset-modal');
  await page.locator('#resetPasswordModal [data-close-modal]').first().click();
  await page.locator('#usersSearch').fill('usuario-ficticio-ausente');
  await expect(page.locator('#usersList')).toContainText('Nenhuma conta');
  await capture(page,info,'admin-empty-filter');
  await page.goto('/admin/configuracao/');
  await expect(page.locator('.readiness-item')).toHaveCount(3);
  await page.locator('#refreshReadiness').click();
  await expect(page.locator('#refreshReadiness')).toBeEnabled();
  await capture(page,info,'admin-diagnostics-populated');
  await finish(info,network);
});
