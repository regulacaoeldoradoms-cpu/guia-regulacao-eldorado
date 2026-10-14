import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../css/profile-account-link.css', import.meta.url), 'utf8');
const avatar = readFileSync(new URL('../../assets/avatar.png', import.meta.url));
const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGz0AAAAASUVORK5CYII=';
const defaults = ['header', 'social', 'composer', 'chat', 'portalChatHeaderAvatar', 'profileAvatarPreview', 'mobile', 'mask'];
// Isolated presentation contract matching the native renderers. No account,
// profile API, production data, observer or upload permission is involved.
const fixture = `<!doctype html><html><head><base href="http://127.0.0.1:4176/">
<style>
.avatar{width:64px;height:64px;display:grid;place-items:center;position:relative;overflow:hidden;border:2px solid gray;border-radius:50%;background:#aad2f0;background-size:cover;background-position:center;color:white;font-size:18px;box-sizing:border-box}
.portal-chat-avatar-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
html[data-portal-theme="dark"] .portal-chat-avatar{background:linear-gradient(135deg,#18354a,#234b63)!important;color:white!important}
[data-home-avatar-initials]::before{content:""!important;background:white!important;position:absolute;inset:0}
[data-home-avatar-initials]::after{content:"AB"!important;color:black!important;position:absolute}
.portal-chat-avatar-initials{color:white;font-size:18px}
[hidden]{display:none!important}
</style></head><body>
<div id="header" class="avatar portal-profile-avatar" style="background-image:none" aria-hidden="true">AB</div>
<div id="social" class="avatar social-avatar" role="img" aria-label="Foto de Pessoa de Teste" style="background-image:none">AB</div>
<div id="composer" class="avatar social-avatar home-composer-avatar">AB</div>
<div id="chat" class="avatar portal-chat-avatar"><span class="portal-chat-avatar-initials">AB</span></div>
<div id="portalChatHeaderAvatar" class="avatar"><span class="portal-chat-avatar-initials">AB</span></div>
<div id="profileAvatarPreview" class="avatar" style="background-image:none"><span id="profileAvatarInitials">AB</span></div>
<div id="mobile" class="avatar portal-profile-avatar home-nav-profile-avatar"><svg viewBox="0 0 28 28"><text x="14" y="14">AB</text></svg></div>
<div id="mask" class="avatar social-avatar" role="img" data-home-avatar-initials="true" style="background-image:none;--home-avatar-initials:url('data:image/svg+xml,mask')">AB</div>
<div id="own" class="avatar social-avatar" role="img"></div>
<div id="own-header" class="avatar portal-profile-avatar"></div>
<div id="own-chat" class="avatar portal-chat-avatar"><span class="portal-chat-avatar-initials">AB</span><img class="portal-chat-avatar-image" alt=""></div>
<div class="social-notification judicial"><div id="judicial" class="social-avatar"><svg viewBox="0 0 24 24"><path d="M3 4h18v16H3z"/></svg></div></div>
<div id="system" class="social-avatar">S</div>
<button id="hidden" class="avatar portal-chat-avatar" hidden>AB</button>
</body></html>`;

for (const theme of ['light', 'dark']) {
  test(`default avatar preserves native photos, geometry and icons in ${theme}`, async ({ page }) => {
    let assetRequests = 0;
    await page.route('**/assets/avatar.png', async route => {
      assetRequests += 1;
      await route.fulfill({ contentType: 'image/png', body: avatar });
    });
    await page.setContent(fixture);
    await page.evaluate(({ theme, photo }) => {
      document.documentElement.dataset.portalTheme = theme;
      for (const id of ['own', 'own-header']) document.getElementById(id).style.backgroundImage = `url("${photo}")`;
      document.querySelector('#own-chat img').src = photo;
    }, { theme, photo });
    const snapshot = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.avatar')].map(element => {
      const rect = element.getBoundingClientRect();
      return [element.id, { width: rect.width, height: rect.height, text: element.textContent, background: getComputedStyle(element).backgroundImage }];
    })));
    const before = await snapshot();
    await page.addStyleTag({ content: css });
    const after = await snapshot();
    for (const id of defaults) {
      expect(after[id].background, id).toContain('/assets/avatar.png');
      expect(after[id].width, id).toBe(before[id].width);
      expect(after[id].height, id).toBe(before[id].height);
      expect(after[id].text, id).toBe(before[id].text);
      await expect(page.locator(`#${id}`)).toHaveCSS('background-size', 'cover');
      await expect(page.locator(`#${id}`)).toHaveCSS('color', 'rgba(0, 0, 0, 0)');
    }
    for (const id of ['own', 'own-header', 'own-chat']) expect(after[id]).toEqual(before[id]);
    for (const selector of ['#chat span', '#profileAvatarInitials', '#mobile svg']) await expect(page.locator(selector)).toHaveCSS('visibility', 'hidden');
    for (const id of ['judicial', 'system']) await expect(page.locator(`#${id}`)).toHaveCSS('background-image', 'none');
    await expect(page.locator('#hidden')).toBeHidden();
    await expect(page.locator('#social')).toHaveAttribute('aria-label', 'Foto de Pessoa de Teste');
    expect(await page.locator('#mask').evaluate(element => getComputedStyle(element, '::after').content)).toBe('none');
    await expect.poll(() => assetRequests).toBeGreaterThan(0);
    expect(avatar.subarray(1, 4).toString()).toBe('PNG');
    expect(avatar.readUInt32BE(16)).toBe(avatar.readUInt32BE(20));

    // The original renderers still control photo replacement and removal.
    await page.locator('#social').evaluate((element, value) => { element.style.backgroundImage = `url("${value}")`; }, photo);
    expect(await page.locator('#social').evaluate(element => getComputedStyle(element).backgroundImage)).toContain('data:image/png');
    await page.locator('#social').evaluate(element => { element.style.backgroundImage = 'none'; });
    expect(await page.locator('#social').evaluate(element => getComputedStyle(element).backgroundImage)).toContain('/assets/avatar.png');
    await page.locator('#own-chat img').evaluate(element => element.remove());
    expect(await page.locator('#own-chat').evaluate(element => getComputedStyle(element).backgroundImage)).toContain('/assets/avatar.png');
  });
}
