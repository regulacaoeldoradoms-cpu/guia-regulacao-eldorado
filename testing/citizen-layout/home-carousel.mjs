import assert from 'node:assert/strict';

export async function verifyHomeCarousel(page, width) {
  const initial = await page.evaluate(() => {
    const grid = document.querySelector('#socialShortcutGrid');
    const section = grid.closest('.social-shortcuts');
    const composer = document.querySelector('.social-composer');
    const feed = document.querySelector('#socialFeedList');
    const cards = [...grid.querySelectorAll('a')];
    const authorized = PortalTools.cardsFor(RegulationAuth.getCachedUser()).map(c => c.href);
    const r = grid.getBoundingClientRect();
    return {
      toolsTop: section.getBoundingClientRect().top,
      composerTop: composer.getBoundingClientRect().top,
      feedTop: feed.getBoundingClientRect().top,
      feedHeight: feed.getBoundingClientRect().height,
      width: innerWidth, outerWidth: document.documentElement.scrollWidth,
      scrollWidth: grid.scrollWidth, clientWidth: grid.clientWidth,
      cardWidth: cards[0].getBoundingClientRect().width,
      headerHeight: document.querySelector('.portal-topbar').getBoundingClientRect().height,
      chatHeight: document.querySelector('.portal-chat-launcher')?.getBoundingClientRect().height,
      visibleCards: cards.filter(c => { const b=c.getBoundingClientRect(); return b.left<r.right && b.right>r.left; }).length,
      hrefs: cards.map(c => c.getAttribute('href')),
      expected: authorized.slice(0, cards.length),
      snap: getComputedStyle(grid).scrollSnapType,
      motion: getComputedStyle(grid).scrollBehavior,
      hint: document.querySelector('#homeToolsHint').textContent,
      titleFits: cards.every(c => { const title=c.querySelector('h3'); return title.scrollWidth <= title.clientWidth + 1; }),
      nav: [...document.querySelectorAll('.social-mobile-nav-link')].map(c => {
        const b=c.getBoundingClientRect(); const label=c.querySelector(':scope > span:not(.social-nav-icon):not(.social-nav-badge)');
        const l=label?.getBoundingClientRect();
        return { width:b.width,height:b.height,left:l?.left,right:l?.right,cardLeft:b.left,cardRight:b.right,font:getComputedStyle(c).fontSize };
      })
    };
  });
  assert.equal(initial.width, width);
  assert.equal(initial.outerWidth, width);
  assert.ok(initial.toolsTop < initial.composerTop && initial.composerTop < initial.feedTop);
  assert.ok(initial.feedHeight > 2500, `Fixture must contain a long feed: ${JSON.stringify(initial)}`);
  assert.ok(initial.visibleCards >= Math.min(2, initial.hrefs.length) && initial.cardWidth >= 140);
  if (initial.hrefs.length > 1) assert.ok(initial.scrollWidth > initial.clientWidth);
  assert.deepEqual(initial.hrefs, initial.expected);
  assert.match(initial.snap, /^x(?: proximity)?$/);
  assert.equal(initial.motion, 'auto');
  assert.ok(initial.titleFits);
  assert.match(initial.hint, /Mostrar atalhos/);
  assert.ok(initial.nav.every(n => n.width >= 44 && n.height >= 44 && parseFloat(n.font) >= 14 && (n.left == null || n.left >= n.cardLeft - 1 && n.right <= n.cardRight + 1)));
  const grid = page.locator('#socialShortcutGrid');
  if (initial.hrefs.length > 1) {
    const bounds = await grid.boundingBox();
    const session = await page.context().newCDPSession(page);
    const startX = bounds.x + bounds.width - 30, y = bounds.y + bounds.height / 2;
    await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: startX, y}]});
    for (let step=1;step<=8;step++) {
      await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: startX - step * 20, y}]});
    }
    await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    await page.waitForTimeout(300);
    assert.ok(await grid.evaluate(e => e.scrollLeft > 0), 'Horizontal touch gesture must scroll tools');
    await session.detach();
    await grid.evaluate(e => {e.scrollLeft=0;});
  }
  await grid.focus();
  if (initial.hrefs.length > 1) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    assert.ok(await grid.evaluate(e => e.scrollLeft > 0), 'Focused region must scroll with keyboard');
  }
  await grid.locator('a').last().focus();
  await page.waitForFunction(() => { const e=document.querySelector('#socialShortcutGrid'); const r=e.getBoundingClientRect(), last=e.lastElementChild.getBoundingClientRect(); return last.left>=r.left && last.right<=r.right+1; }, null, {timeout:3000}).catch(async () => {throw Error(JSON.stringify(await grid.evaluate(e=>({scroll:e.scrollLeft,width:e.clientWidth,scrollWidth:e.scrollWidth,grid:e.getBoundingClientRect().toJSON(),last:e.lastElementChild.getBoundingClientRect().toJSON(),active:document.activeElement===e.lastElementChild}))));});
  assert.ok(await grid.evaluate(e => { const r=e.getBoundingClientRect(), last=e.lastElementChild.getBoundingClientRect();return last.left>=r.left && last.right<=r.right+1; }), 'Focused card must remain visible');
  if (initial.hrefs.length > 1) await page.selectOption('#socialShortcutLimit', '1');
  assert.equal(await grid.locator('a').count(), 1);
  if (initial.hrefs.length > 1) assert.ok(await page.locator('.social-shortcuts a[href="/ferramentas/"]').isVisible());
  await page.reload();
  await page.waitForFunction(() => window.PortalHomeReady);
  await page.evaluate(() => window.PortalHomeReady);
  assert.equal(await grid.locator('a').count(), 1, 'Existing quantity preference must persist');
  if (initial.hrefs.length > 1) await page.selectOption('#socialShortcutLimit', String(initial.hrefs.length));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.social-tools-rail .social-shortcuts').count(), 1, 'Desktop restores original position');
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.social-feed-column > .social-shortcuts').count(), 1);
  return initial;
}
