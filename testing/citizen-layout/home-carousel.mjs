import assert from 'node:assert/strict';
import { applyTextScale } from './text-scale.mjs';

export async function verifyHomeCarousel(page, width) {
  const enlarged = process.env.TEXT_SCALE === '2';
  const initial = await page.evaluate(() => {
    const grid = document.querySelector('#socialShortcutGrid');
    const section = grid.closest('.social-shortcuts');
    const strip = section.querySelector('.home-tools-strip');
    const composer = document.querySelector('.social-composer');
    const feed = document.querySelector('#socialFeedList');
    const cards = [...grid.querySelectorAll('a')];
    const authorized = PortalTools.cardsFor(RegulationAuth.getCachedUser()).map(c => c.href);
    const r = strip.getBoundingClientRect();
    const nav = document.querySelector('.social-mobile-nav');
    return {
      toolsTop: section.getBoundingClientRect().top, toolsHeight: section.getBoundingClientRect().height,
      composerTop: composer.getBoundingClientRect().top, feedTop: feed.getBoundingClientRect().top,
      feedHeight: feed.getBoundingClientRect().height, feedCount: feed.querySelectorAll('.social-post').length,
      viewportHeight: innerHeight,
      width: innerWidth, outerWidth: document.documentElement.scrollWidth,
      scrollWidth: strip.scrollWidth, clientWidth: strip.clientWidth,
      cards: cards.map(card => { const b=card.getBoundingClientRect(); return {width:b.width,height:b.height}; }),
      headerHeight: document.querySelector('.portal-topbar').getBoundingClientRect().height,
      chatHeight: document.querySelector('.portal-chat-launcher')?.getBoundingClientRect().height,
      chatInNavigation: nav.contains(document.querySelector('#portalChatLauncher')),
      chatRootInBody: document.querySelector('#portalChatRoot')?.parentElement === document.body,
      composerCollapsed: document.querySelector('#homeComposerPanel').hidden,
      toolsInFeed: section.parentElement === document.querySelector('.social-feed-column'),
      navHeight: nav.getBoundingClientRect().height, navPosition: getComputedStyle(nav).position,
      visibleCards: cards.filter(c => { const b=c.getBoundingClientRect(); return b.left<r.right && b.right>r.left; }).length,
      hrefs: cards.map(c => c.getAttribute('href')), expected: authorized.slice(0, Math.min(5, authorized.length)), total: authorized.length,
      options: [...document.querySelector('#socialShortcutLimit').options].map(o => o.value),
      snap: getComputedStyle(strip).scrollSnapType, motion: getComputedStyle(strip).scrollBehavior,
      hint: document.querySelector('#homeToolsHint').textContent,
      titleFits: cards.every(c => { const title=c.querySelector('h3'), b=c.getBoundingClientRect(), t=title.getBoundingClientRect(); return title.scrollWidth <= title.clientWidth + 1 && t.left >= b.left && t.right <= b.right && t.top >= b.top && t.bottom <= b.bottom; }),
      nav: [...nav.querySelectorAll('.social-mobile-nav-link')].map(c => {
        const b=c.getBoundingClientRect();
        return { width:b.width,height:b.height,left:b.left,right:b.right,top:b.top,label:c.getAttribute('aria-label'),destination:c.getAttribute('href') || c.id };
      })
    };
  });
  assert.equal(initial.width, width);
  assert.equal(initial.outerWidth, width);
  assert.ok(initial.composerTop < initial.toolsTop && initial.toolsTop < initial.feedTop, 'Composer precedes tools and feed');
  assert.ok(initial.composerCollapsed && initial.toolsInFeed, 'Mobile starts with collapsed composer and tools inside the feed column');
  assert.ok(initial.feedCount >= 10 && initial.feedHeight > initial.viewportHeight * 2,
    `Fixture must show at least ten posts spanning two viewport heights: ${initial.feedCount} posts, ${initial.feedHeight}px`);
  assert.ok(initial.visibleCards >= 1);
  assert.ok(initial.cards.every(card => Math.abs(card.width - (enlarged ? 240 : 120)) <= 1 && Math.abs(card.width - card.height) <= 1), 'Tool cards remain square at normal and enlarged text');
  if (initial.cards.reduce((sum, card) => sum + card.width, 0) > initial.clientWidth)
    assert.ok(initial.scrollWidth > initial.clientWidth, 'Tool cards wider than the strip must exercise horizontal scrolling');
  assert.deepEqual(initial.hrefs, initial.expected);
  assert.deepEqual(initial.options, Array.from({length:initial.total}, (_, index) => String(index + 1)));
  assert.match(initial.snap, /^x(?: proximity)?$/);
  assert.equal(initial.motion, 'auto');
  assert.ok(initial.titleFits);
  assert.match(initial.hint, /Mostrar atalhos/);
  assert.ok(initial.chatInNavigation && initial.chatRootInBody && initial.chatHeight >= 44, 'Native Chat launcher moves to navigation while its root stays in body');
  assert.equal(initial.navPosition, 'fixed', 'Icon navigation remains fixed at both text scales');
  if (!enlarged) assert.ok(initial.toolsHeight <= 300 && initial.headerHeight <= 150 && initial.navHeight <= 80, 'Normal Home must remain compact');
  assert.deepEqual(initial.nav.map(item => item.destination), ['/', '/amigos/', 'portalChatLauncher', 'socialNotificationTriggerMobile', '/mascotes/', '/perfil/']);
  assert.equal(new Set(initial.nav.map(item => Math.round(item.top))).size, 1, 'Icons remain in one navigation row');
  assert.ok(initial.nav.every(n => n.width >= 44 && n.height >= 44 && n.left >= -1 && n.right <= width + 1 && n.label), 'Icon navigation retains accessible names and touch targets');

  const openComposer = async () => {
    if (await page.locator('#homeComposerPanel').isHidden()) await page.locator('#homeComposerTrigger').click();
    await page.locator('#socialComposerText').waitFor({state:'visible'});
  };
  const openOptions = async () => {
    const account = page.locator('#homeAccountMenu');
    if (!await account.evaluate(e => e.open)) await account.locator(':scope > summary').click();
    const options = account.locator('.home-tools-options');
    if (!await options.evaluate(e => e.open)) await options.locator(':scope > summary').click();
    await page.locator('#socialShortcutLimit').waitFor({state:'visible'});
  };
  const closeAccount = async () => {
    if (await page.locator('#homeAccountMenu').evaluate(e => e.open)) await page.locator('#homeAccountMenu > summary').click();
  };

  // Check actual clickable surfaces, including beneath the freely moving, passive pet.
  await openComposer();
  for (const selector of ['#socialComposerAudience', '#socialComposerForm [type="submit"]', '.social-post .social-post-header button', '.social-post .social-action']) {
    const menu = page.locator('.social-post .home-post-menu').first();
    const menuAction = selector.includes('.social-post-header');
    if (menuAction) await menu.locator(':scope > summary').click();
    const target = page.locator(selector).first();
    await target.evaluate(e => e.scrollIntoView({block:'center', behavior:'auto'}));
    const surface = await target.evaluate(e => { const r=e.getBoundingClientRect(); const points=[r.left+4,r.left+r.width/2,r.right-4].map(x => {const top=document.elementFromPoint(x,r.top+r.height/2);return {inside:top===e || e.contains(top),top:top?.className,x,y:r.top+r.height/2};}); return {points,rect:{left:r.left,top:r.top,width:r.width,height:r.height}}; });
    assert.ok(surface.points.every(p => p.inside), `${selector}: touch surface obstructed ${JSON.stringify(surface)}`);
    if (menuAction) await page.keyboard.press('Escape');
  }
  assert.ok(await page.locator('.pet-stage-global').evaluate(e => getComputedStyle(e).pointerEvents === 'none'));
  assert.ok(await page.locator('.social-post-actions').first().evaluate(e => [...e.querySelectorAll('.social-action')].every(c => c.scrollWidth <= c.clientWidth + 1)), 'Feed action labels must stay within their own buttons');
  if (enlarged) {
    await page.locator('.social-post-actions').first().evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
    await page.screenshot({path:`/tmp/home-carousel-actions-${process.env.AUDIT_THEME || 'light'}-${process.env.AUDIT_ROLE || 'cidadao'}-${width}-text200.png`});
  }
  assert.ok(await page.locator('.social-composer-footer').evaluate(e => {const r=e.getBoundingClientRect(); return [...e.children].every(c => {const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;});}), 'Audience and submit must stay inside footer');

  const grid = page.locator('#socialShortcutGrid');
  const strip = page.locator('.home-tools-strip');
  const scrollable = initial.scrollWidth > initial.clientWidth + 1;
  if (scrollable) {
    await strip.evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
    const bounds = await strip.boundingBox();
    const startX = bounds.x + bounds.width - 30, y = bounds.y + bounds.height / 2;
    assert.ok(await strip.evaluate((e,p) => e.contains(document.elementFromPoint(p.x,p.y)), {x:startX,y}), 'Touch gesture must begin on visible carousel');
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:startX,y}]});
    for (let step=1;step<=8;step++) await session.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:startX-step*20,y}]});
    await session.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
    await page.waitForTimeout(300);
    assert.ok(await strip.evaluate(e => e.scrollLeft > 0), 'Horizontal touch gesture must scroll tools');
    await session.detach();
    await strip.evaluate(e => {e.scrollLeft=0;});
  }
  await strip.focus();
  if (scrollable) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    assert.ok(await strip.evaluate(e => e.scrollLeft > 0), 'Focused region must scroll with keyboard');
  }
  await strip.locator('a').last().focus();
  await page.waitForFunction(() => {const e=document.querySelector('.home-tools-strip'),r=e.getBoundingClientRect(),last=e.querySelector('.home-all-tools-link').getBoundingClientRect();return last.left>=r.left && last.right<=r.right+1;}, null, {timeout:3000});

  // Moving responsive presentation must keep original nodes, draft, selection and focus.
  await page.locator('#socialComposerText').fill('Rascunho sintético preservado.');
  await page.evaluate(() => {window.__homeReferences = {card:document.querySelector('#socialShortcutGrid a'),select:document.querySelector('#socialShortcutLimit'),account:document.querySelector('.portal-account-area'),form:document.querySelector('#socialComposerForm'),textarea:document.querySelector('#socialComposerText'),launcher:document.querySelector('#portalChatLauncher')};});
  await page.setViewportSize({width:900,height:900});
  await grid.locator('a').first().focus();
  await page.setViewportSize({width:901,height:900});
  await page.waitForTimeout(100);
  const restoredCard = await page.evaluate(() => ({
    sameNode: document.querySelector('#socialShortcutGrid a') === window.__homeReferences.card,
    focused: document.activeElement === window.__homeReferences.card,
    active: {tag:document.activeElement?.tagName,id:document.activeElement?.id,class:document.activeElement?.className},
    card: window.__homeReferences.card.getBoundingClientRect().toJSON(),
  }));
  assert.ok(restoredCard.sameNode && restoredCard.focused, `Original tool card retains desktop focus: ${JSON.stringify(restoredCard)}`);
  assert.equal(await page.locator('.social-tools-rail .social-shortcuts').count(), 1);
  assert.ok(await page.evaluate(() => document.querySelector('#socialComposerForm') === window.__homeReferences.form && document.querySelector('#socialComposerText') === window.__homeReferences.textarea && document.querySelector('#portalChatLauncher') === window.__homeReferences.launcher && document.querySelector('#portalChatRoot').contains(window.__homeReferences.launcher)), 'Desktop restores original composer and native launcher nodes');
  if (initial.total > 1) {
    await page.locator('#socialShortcutLimit').focus();
    await page.setViewportSize({width:900,height:900});
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.activeElement === window.__homeReferences.select && document.querySelector('#socialShortcutLimit') === window.__homeReferences.select));
    await page.locator('#homeAccountPanel .home-tools-options > summary').focus();
    await page.setViewportSize({width:901,height:900});
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.activeElement === window.__homeReferences.select), 'Shortcut options summary focus reaches the original quantity control on desktop');
  }
  await page.setViewportSize({width,height:900});
  await page.waitForTimeout(100);
  await applyTextScale(page);
  assert.equal(await page.locator('.social-feed-column > .social-shortcuts').count(), 1);
  assert.equal(await page.locator('#socialComposerText').inputValue(), 'Rascunho sintético preservado.');
  if (initial.total > 1) {
    await openOptions();
    await page.selectOption('#socialShortcutLimit', '1');
    await applyTextScale(page);
    assert.equal(await grid.locator('a').count(), 1);
    await closeAccount();
    assert.ok(await page.locator('.social-shortcuts a[href="/ferramentas/"]').isVisible());
  } else assert.equal(await page.locator('.home-tools-options').isVisible(), false, 'Single authorized tool must not show redundant quantity control');
  if (enlarged) assert.equal(await grid.locator('h3').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize)), 32);
  await page.reload();
  await page.waitForFunction(() => Boolean(window.PortalHomeReady));
  await page.evaluate(() => window.PortalHomeReady);
  await applyTextScale(page);
  assert.equal(await grid.locator('a').count(), 1, 'Existing quantity preference must persist');
  if (initial.total > 1) {
    await openOptions();
    await page.selectOption('#socialShortcutLimit', String(initial.hrefs.length));
    await applyTextScale(page);
    if (enlarged) {
      await page.locator('#socialShortcutLimit').evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
      await page.screenshot({path:`/tmp/home-carousel-options-${process.env.AUDIT_THEME || 'light'}-${process.env.AUDIT_ROLE || 'cidadao'}-${width}-text200.png`});
    }
    await closeAccount();
  }
  if (enlarged) assert.equal(await grid.locator('h3').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize)), 32);

  // Submit only into the intercepted, synthetic API and verify the resulting feed card.
  await openComposer();
  await page.locator('#socialComposerText').fill('Publicação sintética da revisão.');
  await page.selectOption('#socialComposerAudience', 'self');
  await page.locator('#socialComposerForm [type="submit"]').click();
  await page.waitForSelector('[data-post-id="fixture-created"]');
  assert.match(await page.locator('[data-post-id="fixture-created"]').innerText(), /Publicação sintética da revisão/);
  assert.equal(await page.locator('#socialComposerText').inputValue(), '');
  if (enlarged) {
    await applyTextScale(page, 1);
    assert.equal(await page.locator('.social-mobile-nav').evaluate(e => getComputedStyle(e).position), 'fixed', 'Normal text retains compact icon navigation');
  }
  await applyTextScale(page);
  return initial;
}
