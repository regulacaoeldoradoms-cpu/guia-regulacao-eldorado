'use strict';

(() => {
  if (window.PortalSocialHome) return;
  const social = window.PortalSocial;

  function mountIdentity(profile) {
    const name = document.getElementById('socialIdentityName');
    const handle = document.getElementById('socialIdentityHandle');
    const badge = document.getElementById('socialIdentityRole');
    if (name) name.textContent = profile.name || `@${profile.handle}`;
    if (handle) handle.textContent = `@${profile.handle}`;
    if (badge) {
      badge.textContent = profile.professional?.label || 'Perfil social';
      badge.hidden = false;
    }
    social.mountAvatar(document.getElementById('socialIdentityAvatar'), profile);
    const link = document.getElementById('socialIdentityLink');
    if (link) link.href = social.profileUrl(profile.handle);
  }

  async function mount(user, config) {
    const home = document.getElementById('socialHome');
    if (!home) return;
    const payload = await social.api('/api/social/me');
    mountIdentity(payload.profile);
    const audience = document.getElementById('socialComposerAudience');
    if (audience) audience.value = payload.profile.defaultPostAudience || 'friends';

    const shortcuts = document.getElementById('socialShortcutGrid');
    window.PortalTools?.render(shortcuts, user, { compact: true, limit: 3 });
    const feed = document.getElementById('socialFeedList');
    const more = document.getElementById('socialFeedMore');
    window.PortalSocialFeed.bindComposer(document.getElementById('socialComposerForm'), feed, more);
    await window.PortalSocialFeed.load(feed, more);
  }

  window.PortalSocialHome = Object.freeze({ mount });
})();
