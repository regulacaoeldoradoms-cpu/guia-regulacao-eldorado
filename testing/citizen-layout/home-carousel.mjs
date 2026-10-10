import assert from 'node:assert/strict';
import { applyTextScale } from './text-scale.mjs';

export async function verifyHomeCarousel(page, width) {
  const enlarged = process.env.TEXT_SCALE === '2';
  const initial = await page.evaluate(() => {
    const grid = document.querySelector('#socialShortcutGrid');
    const section = grid.closest('.social-shortcuts');
    const composer = document.querySelector('.social-composer');
    const feed = document.querySelector('#socialFeedList');
    const cards = [...grid.querySelectorAll('a')];
    const authorized = PortalTools.cardsFor(RegulationAuth.getCachedUser()).map(c => c.href);
    const r = grid.getBoundingClientRect();
    const nav = document.querySelector('.social-mobile-nav');
    return {
      toolsTop: section.getBoundingClientRect().top, toolsHeight: section.getBoundingClientRect().height,
      composerTop: composer.getBoundingClientRect().top, feedTop: feed.getBoundingClientRect().top,
      feedHeight: feed.getBoundingClientRect().height,
      width: innerWidth, outerWidth: document.documentElement.scrollWidth,
      scrollWidth: grid.scrollWidth, clientWidth: grid.clientWidth,
      cardWidth: cards[0].getBoundingClientRect().width,
      headerHeight: document.querySelector('.portal-topbar').getBoundingClientRect().height,
      chatHeight: document.querySelector('.portal-chat-launcher')?.getBoundingClientRect().height,
      chatInHeader: !!document.querySelector('.portal-user .portal-chat'),
      navHeight: nav.getBoundingClientRect().height, navPosition: getComputedStyle(nav).position,
      visibleCards: cards.filter(c => { const b=c.getBoundingClientRect(); return b.left<r.right && b.right>r.left; }).length,
      hrefs: cards.map(c => c.getAttribute('href')), expected: authorized.slice(0, Math.min(5, authorized.length)), total: authorized.length,
      options: [...document.querySelector('#socialShortcutLimit').options].map(o => o.value),
      snap: getComputedStyle(grid).scrollSnapType, motion: getComputedStyle(grid).scrollBehavior,
      hint: document.querySelector('#homeToolsHint').textContent,
      titleFits: cards.every(c => { const title=c.querySelector('h3'); return title.scrollWidth <= title.clientWidth + 1; }),
      nav: [...nav.querySelectorAll('.social-mobile-nav-link')].map(c => {
        const b=c.getBoundingClientRect(); const label=c.querySelector(':scope > span:not(.social-nav-icon):not(.social-nav-badge)'); const l=label?.getBoundingClientRect();
        return { width:b.width,height:b.height,left:l?.left,right:l?.right,cardLeft:b.left,cardRight:b.right,font:getComputedStyle(c).fontSize };
      })
    };
  });
  assert.equal(initial.width, width);
  assert.equal(initial.outerWidth, width);
  assert.ok(initial.toolsTop < initial.composerTop && initial.composerTop < initial.feedTop);
  assert.ok(initial.feedHeight > 2500, 'Fixture must contain a long feed');
  assert.ok(initial.visibleCards >= (enlarged ? 1 : Math.min(2, initial.hrefs.length)) && initial.cardWidth >= (enlarged && initial.total > 1 ? 280 : 140));
  if (initial.total > 1) assert.ok(initial.scrollWidth > initial.clientWidth);
  assert.deepEqual(initial.hrefs, initial.expected);
  assert.deepEqual(initial.options, Array.from({length:initial.total}, (_, index) => String(index + 1)));
  assert.match(initial.snap, /^x(?: proximity)?$/);
  assert.equal(initial.motion, 'auto');
  assert.ok(initial.titleFits);
  assert.match(initial.hint, /Mostrar atalhos/);
  assert.ok(initial.chatInHeader && initial.chatHeight >= 44);
  if (enlarged) assert.equal(initial.navPosition, 'static', 'Enlarged navigation must not cover content');
  else assert.ok(initial.toolsHeight <= 300 && initial.headerHeight <= 150 && initial.navHeight <= 80, 'Normal Home must remain compact');
  assert.ok(initial.nav.every(n => n.width >= 44 && n.height >= 44 && parseFloat(n.font) >= 14 && (n.left == null || n.left >= n.cardLeft - 1 && n.right <= n.cardRight + 1)));

  // Check actual clickable surfaces, including beneath the freely moving, passive pet.
  for (const selector of ['#socialComposerAudience', '#socialComposerForm [type="submit"]', '.social-post .social-post-header button', '.social-post .social-action']) {
    const target = page.locator(selector).first();
    await target.evaluate(e => e.scrollIntoView({block:'center', behavior:'auto'}));
    const surface = await target.evaluate(e => { const r=e.getBoundingClientRect(); const points=[r.left+4,r.left+r.width/2,r.right-4].map(x => {const top=document.elementFromPoint(x,r.top+r.height/2);return {inside:top===e || e.contains(top),top:top?.className,x,y:r.top+r.height/2};}); return {points,rect:{left:r.left,top:r.top,width:r.width,height:r.height}}; });
    assert.ok(surface.points.every(p => p.inside), `${selector}: touch surface obstructed ${JSON.stringify(surface)}`);
  }
  assert.ok(await page.locator('.pet-stage-global').evaluate(e => getComputedStyle(e).pointerEvents === 'none'));
  assert.ok(await page.locator('.social-post-actions').first().evaluate(e => [...e.querySelectorAll('.social-action')].every(c => c.scrollWidth <= c.clientWidth + 1)), 'Feed action labels must stay within their own buttons');
  if (enlarged) {
    await page.locator('.social-post-actions').first().evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
    await page.screenshot({path:`/tmp/home-carousel-actions-${process.env.AUDIT_THEME || 'light'}-${process.env.AUDIT_ROLE || 'cidadao'}-${width}-text200.png`});
  }
  assert.ok(await page.locator('.social-composer-footer').evaluate(e => {const r=e.getBoundingClientRect(); return [...e.children].every(c => {const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;});}), 'Audience and submit must stay inside footer');

  const grid = page.locator('#socialShortcutGrid');
  if (initial.total > 1) {
    await grid.evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
    const bounds = await grid.boundingBox();
    const startX = bounds.x + bounds.width - 30, y = bounds.y + bounds.height / 2;
    assert.ok(await grid.evaluate((e,p) => e.contains(document.elementFromPoint(p.x,p.y)), {x:startX,y}), 'Touch gesture must begin on visible carousel');
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:startX,y}]});
    for (let step=1;step<=8;step++) await session.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:startX-step*20,y}]});
    await session.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
    await page.waitForTimeout(300);
    assert.ok(await grid.evaluate(e => e.scrollLeft > 0), 'Horizontal touch gesture must scroll tools');
    await session.detach();
    await grid.evaluate(e => {e.scrollLeft=0;});
  }
  await grid.focus();
  if (initial.total > 1) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    assert.ok(await grid.evaluate(e => e.scrollLeft > 0), 'Focused region must scroll with keyboard');
  }
  await grid.locator('a').last().focus();
  await page.waitForFunction(() => {const e=document.querySelector('#socialShortcutGrid'),r=e.getBoundingClientRect(),last=e.lastElementChild.getBoundingClientRect();return last.left>=r.left && last.right<=r.right+1;}, null, {timeout:3000});

  // Moving responsive presentation must keep original nodes, draft, selection and focus.
  await page.locator('#socialComposerText').fill('Rascunho sintético preservado.');
  await page.evaluate(() => {window.__homeReferences = {card:document.querySelector('#socialShortcutGrid a'),select:document.querySelector('#socialShortcutLimit')};});
  await page.setViewportSize({width:900,height:900});
  await grid.locator('a').first().focus();
  await page.setViewportSize({width:901,height:900});
  await page.waitForTimeout(100);
  assert.ok(await page.evaluate(() => document.activeElement === window.__homeReferences.card && document.querySelector('#socialShortcutGrid a') === window.__homeReferences.card));
  assert.equal(await page.locator('.social-tools-rail .social-shortcuts').count(), 1);
  if (initial.total > 1) {
    await page.locator('#socialShortcutLimit').focus();
    await page.setViewportSize({width:900,height:900});
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.activeElement === window.__homeReferences.select && document.querySelector('#socialShortcutLimit') === window.__homeReferences.select));
    await page.locator('.home-tools-options summary').focus();
    await page.setViewportSize({width:901,height:900});
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.activeElement === window.__homeReferences.select), 'Desktop summary focus must reach visible quantity control');
  }
  await page.setViewportSize({width,height:900});
  await page.waitForTimeout(100);
  await applyTextScale(page);
  assert.equal(await page.locator('.social-layout > .social-shortcuts').count(), 1);
  assert.equal(await page.locator('#socialComposerText').inputValue(), 'Rascunho sintético preservado.');
  if (initial.total > 1) {
    await page.locator('.home-tools-options').evaluate(e => {e.open=true;});
    await page.selectOption('#socialShortcutLimit', '1');
    await applyTextScale(page);
    assert.equal(await grid.locator('a').count(), 1);
    assert.ok(await page.locator('.social-shortcuts a[href="/ferramentas/"]').isVisible());
  } else assert.equal(await page.locator('.home-tools-options').isVisible(), false, 'Single authorized tool must not show redundant quantity control');
  if (enlarged) assert.equal(await grid.locator('h3').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize)), 32);
  await page.reload();
  await page.waitForFunction(() => Boolean(window.PortalHomeReady));
  await page.evaluate(() => window.PortalHomeReady);
  await applyTextScale(page);
  assert.equal(await grid.locator('a').count(), 1, 'Existing quantity preference must persist');
  if (initial.total > 1) {
    await page.locator('.home-tools-options').evaluate(e => {e.open=true;});
    await page.selectOption('#socialShortcutLimit', String(initial.hrefs.length));
    await applyTextScale(page);
    if (enlarged) {
      await page.locator('#socialShortcutLimit').evaluate(e => e.scrollIntoView({block:'center',behavior:'auto'}));
      await page.screenshot({path:`/tmp/home-carousel-options-${process.env.AUDIT_THEME || 'light'}-${process.env.AUDIT_ROLE || 'cidadao'}-${width}-text200.png`});
    }
  }
  if (enlarged) assert.equal(await grid.locator('h3').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize)), 32);

  // Submit only into the intercepted, synthetic API and verify the resulting feed card.
  await page.locator('#socialComposerText').fill('Publicação sintética da revisão.');
  await page.selectOption('#socialComposerAudience', 'self');
  await page.locator('#socialComposerForm [type="submit"]').click();
  await page.waitForSelector('[data-post-id="fixture-created"]');
  assert.match(await page.locator('[data-post-id="fixture-created"]').innerText(), /Publicação sintética da revisão/);
  assert.equal(await page.locator('#socialComposerText').inputValue(), '');
  if (enlarged) {
    await applyTextScale(page, 1);
    assert.equal(await page.locator('.social-mobile-nav').evaluate(e => getComputedStyle(e).position), 'fixed', 'Normal text must restore the compact navigation');
  }
  await applyTextScale(page);
  return initial;
}
