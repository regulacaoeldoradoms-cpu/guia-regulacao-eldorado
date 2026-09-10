'use strict';

(async () => {
  const auth = window.RegulationAuth;
  const social = window.PortalSocial;
  const user = await window.PortalAccountSection?.mount();
  if (!user) return;

  const friendRequests = document.getElementById('acceptFriendRequests');
  const socialVisibility = document.getElementById('socialProfileVisibility');
  const socialAudience = document.getElementById('socialDefaultAudience');
  const saveSocialPreferences = document.getElementById('saveSocialPreferences');
  const status = document.getElementById('socialPreferencesStatus');
  const viewProfile = document.getElementById('viewSocialProfile');
  let socialAvailable = false;

  function show(message, type = 'success') {
    if (!status) return;
    status.textContent = message;
    status.className = `account-status visible ${type}`;
  }

  function setSocialEnabled(enabled) {
    socialAvailable = enabled;
    [friendRequests, socialVisibility, socialAudience, saveSocialPreferences].forEach((control) => {
      if (control) control.disabled = !enabled;
    });
  }

  async function load() {
    try {
      const config = await social.getConfig();
      if (!config.backendEnabled || !config.available) {
        setSocialEnabled(false);
        show('As preferências sociais estão temporariamente indisponíveis. As configurações de som continuam funcionando normalmente.', 'error');
        return;
      }
      const payload = await auth.api('/api/social/me');
      const profile = payload.profile || {};
      if (friendRequests) friendRequests.checked = Boolean(profile.acceptFriendRequests);
      if (socialVisibility) socialVisibility.value = profile.profileVisibility || 'portal';
      if (socialAudience) socialAudience.value = profile.defaultPostAudience || 'friends';
      if (viewProfile) viewProfile.href = `/perfil/?u=${encodeURIComponent(profile.handle || '')}`;
      setSocialEnabled(true);
    } catch (error) {
      setSocialEnabled(false);
      show(error.message || 'Não foi possível carregar as preferências sociais.', 'error');
    }
  }

  friendRequests?.addEventListener('change', async () => {
    if (!socialAvailable) return;
    try {
      await auth.updateSecurity({ acceptFriendRequests: friendRequests.checked });
      show(friendRequests.checked ? 'Pedidos de amizade permitidos.' : 'Pedidos de amizade desativados.', 'success');
    } catch (error) {
      friendRequests.checked = !friendRequests.checked;
      show(error.message || 'Não foi possível salvar a preferência de pedidos.', 'error');
    }
  });

  saveSocialPreferences?.addEventListener('click', async () => {
    if (!socialAvailable) return;
    saveSocialPreferences.disabled = true;
    try {
      const payload = await auth.api('/api/social/me', {
        method: 'PATCH',
        body: JSON.stringify({
          acceptFriendRequests: Boolean(friendRequests?.checked),
          profileVisibility: socialVisibility?.value || 'portal',
          defaultPostAudience: socialAudience?.value || 'friends'
        })
      });
      if (viewProfile) viewProfile.href = `/perfil/?u=${encodeURIComponent(payload.profile?.handle || '')}`;
      show('Preferências sociais salvas.', 'success');
    } catch (error) {
      show(error.message || 'Não foi possível salvar as preferências sociais.', 'error');
    } finally {
      saveSocialPreferences.disabled = false;
    }
  });

  await load();
})();
