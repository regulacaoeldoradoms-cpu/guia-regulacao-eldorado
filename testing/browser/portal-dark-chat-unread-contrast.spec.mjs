import { test, expect } from '@playwright/test';
import { installAuditFixture } from './dark-audit-fixture.mjs';

test('chat unread count has at least 4.5:1 text contrast', async ({ page, context }, info) => {
  const network = await installAuditFixture(context);
  await page.goto('/ferramentas/');
  await page.evaluate(() => window.PortalCitizenMobileReady);
  await page.locator('#portalChatLauncher').click();
  const badge = page.locator('[data-chat-user="synthetic.friend"] > .portal-chat-unread');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveText('1');
  await expect.poll(() => badge.evaluate(node => {
    let opacity = 1;
    for (let current = node; current; current = current.parentElement) opacity *= Number(getComputedStyle(current).opacity);
    return opacity;
  }), { message: 'Measure the visible badge after its opening transition' }).toBe(1);
  const measured = await badge.evaluate(node => {
    const style = getComputedStyle(node);
    const rgba = value => {
      const values = value.match(/[\d.]+/g).map(Number);
      return [...values.slice(0, 3), values[3] ?? 1];
    };
    const luminance = channels => channels.slice(0, 3).map(value => value / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
      .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const foreground = rgba(style.color), background = rgba(style.backgroundColor);
    const a = luminance(foreground), b = luminance(background);
    const ancestorOpacity = [];
    for (let current = node; current; current = current.parentElement) ancestorOpacity.push(Number(getComputedStyle(current).opacity));
    return { color: style.color, background: style.backgroundColor, backgroundImage: style.backgroundImage,
      alpha: [foreground[3], background[3]], ancestorOpacity,
      ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
  });
  await info.attach('unread-badge-contrast.json', { body: Buffer.from(JSON.stringify(measured, null, 2)), contentType: 'application/json' });
  await page.screenshot({ path: info.outputPath('unread-badge-contact-list.png'), animations: 'disabled', caret: 'hide' });
  // The ratio is valid for the actual opaque text/background, without gradients
  // or ancestor opacity that could change their rendered colors.
  expect(measured.backgroundImage).toBe('none');
  expect(measured.alpha).toEqual([1, 1]);
  expect(measured.ancestorOpacity.every(value => value === 1)).toBe(true);
  expect(measured.ratio, JSON.stringify(measured)).toBeGreaterThanOrEqual(4.5);
  expect(network.unexpected).toEqual([]);
  expect(network.errors).toEqual([]);
});
