'use strict';

(() => {
  function normalizeUsername(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9._-]/g, '')
      .replace(/[._-]{2,}/g, '.')
      .replace(/^[._-]+|[._-]+$/g, '')
      .slice(0, 40);
  }

  function prepare() {
    const username = document.getElementById('newUsername');
    const form = document.getElementById('createUserForm');

    document.querySelectorAll('input[type="password"]').forEach((input) => {
      input.removeAttribute('minlength');
    });

    username?.addEventListener('blur', () => {
      username.value = normalizeUsername(username.value);
    });

    form?.addEventListener('submit', () => {
      if (username) username.value = normalizeUsername(username.value);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true });
  else prepare();
})();