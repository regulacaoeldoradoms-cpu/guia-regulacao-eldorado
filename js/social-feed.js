'use strict';

(() => {
  if (window.PortalSocialFeed) return;
  const social = window.PortalSocial;
  const cursors = new Map();

  function emptyState(message) {
    const empty = document.createElement('div');
    empty.className = 'social-empty';
    empty.innerHTML = social.icons.comment;
    const title = document.createElement('h2');
    title.textContent = 'Seu feed começa com conexões reais';
    const text = document.createElement('p');
    text.textContent = message || 'Adicione amigos ou faça sua primeira publicação. A ordem é cronológica e não usa ranking secreto.';
    empty.append(title, text);
    return empty;
  }

  function authorHeader(post) {
    const header = document.createElement('header');
    header.className = 'social-post-header';
    const avatar = document.createElement('div');
    avatar.className = 'social-avatar';
    social.mountAvatar(avatar, post.author);
    const copy = document.createElement('div');
    copy.className = 'social-post-author';
    const link = document.createElement('a');
    link.href = social.profileUrl(post.author.handle);
    link.textContent = post.author.name || `@${post.author.handle}`;
    const meta = document.createElement('span');
    const role = post.author.professional?.label ? `${post.author.professional.label} · ` : '';
    meta.textContent = `${role}@${post.author.handle}`;
    copy.append(link, meta);
    header.append(avatar, copy);
    return header;
  }

  function editPost(post, card, bodyNode) {
    if (card.querySelector('.social-post-edit')) return;
    const editor = document.createElement('form');
    editor.className = 'social-post-edit';
    const textarea = document.createElement('textarea');
    textarea.className = 'social-textarea';
    textarea.maxLength = 2000;
    textarea.value = post.body;
    const audience = document.createElement('select');
    audience.className = 'social-select';
    audience.setAttribute('aria-label', 'Audiência da publicação');
    audience.add(new Option('Amigos', 'friends'));
    audience.add(new Option('Somente eu', 'self'));
    audience.value = post.audience;
    const actions = document.createElement('div');
    actions.className = 'social-row-actions';
    const cancel = social.button('Cancelar', 'social-button secondary');
    const save = social.button('Salvar edição', 'social-button primary');
    save.type = 'submit';
    actions.append(cancel, save);
    editor.append(textarea, audience, actions);
    bodyNode.hidden = true;
    bodyNode.insertAdjacentElement('afterend', editor);
    cancel.addEventListener('click', () => { editor.remove(); bodyNode.hidden = false; });
    editor.addEventListener('submit', async (event) => {
      event.preventDefault();
      save.disabled = true;
      try {
        const payload = await social.api(`/api/social/posts/${encodeURIComponent(post.id)}`, {
          method: 'PATCH', body: JSON.stringify({ body: textarea.value, audience: audience.value })
        });
        post.body = payload.post.body;
        post.audience = payload.post.audience;
        post.updatedAt = payload.post.updatedAt;
        post.edited = true;
        bodyNode.textContent = post.body;
        const meta = card.querySelector('.social-post-meta');
        if (meta) meta.textContent = `${social.formatDate(post.createdAt)} · editada · ${post.audience === 'self' ? 'somente eu' : 'amigos'}`;
        editor.remove();
        bodyNode.hidden = false;
        social.status('Publicação atualizada.', 'success');
      } catch (error) {
        social.status(error.message || 'Não foi possível atualizar a publicação.', 'error');
      } finally {
        save.disabled = false;
      }
    });
    textarea.focus();
  }

  async function deletePost(post, card) {
    const confirmed = await social.confirmAction({
      title: 'Excluir publicação?',
      message: 'A publicação deixará de aparecer no feed. Esta ação é diferente de ocultar ou bloquear uma pessoa.',
      confirmLabel: 'Excluir publicação',
      danger: true
    });
    if (!confirmed) return;
    try {
      await social.api(`/api/social/posts/${encodeURIComponent(post.id)}`, { method: 'DELETE' });
      card.remove();
      social.status('Publicação excluída.', 'success');
    } catch (error) {
      social.status(error.message || 'Não foi possível excluir a publicação.', 'error');
    }
  }

  function postMenu(post, card, bodyNode) {
    const wrap = document.createElement('div');
    wrap.className = 'social-row-actions';
    if (post.own) {
      const edit = social.button('Editar', 'social-button secondary');
      const remove = social.button('Excluir', 'social-button danger');
      edit.addEventListener('click', () => editPost(post, card, bodyNode));
      remove.addEventListener('click', () => deletePost(post, card));
      wrap.append(edit, remove);
    } else {
      const report = social.button('Denunciar', 'social-button secondary');
      report.addEventListener('click', async () => {
        try {
          if (await social.report('post', post.id)) social.status('Denúncia enviada para análise.', 'success');
        } catch (error) {
          social.status(error.message || 'Não foi possível enviar a denúncia.', 'error');
        }
      });
      wrap.appendChild(report);
    }
    return wrap;
  }

  function commentNode(comment, post, onCountChange = () => {}) {
    const row = document.createElement('article');
    row.className = 'social-comment';
    row.dataset.commentId = comment.id;
    const avatar = document.createElement('div');
    avatar.className = 'social-avatar';
    social.mountAvatar(avatar, comment.author);
    const bubble = document.createElement('div');
    bubble.className = 'social-comment-bubble';
    const author = document.createElement('a');
    author.href = social.profileUrl(comment.author.handle);
    author.textContent = comment.author.name || `@${comment.author.handle}`;
    const text = document.createElement('p');
    text.textContent = comment.body;
    bubble.append(author, text);
    row.append(avatar, bubble);
    if (comment.own) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'social-comment-delete';
      remove.textContent = 'Excluir';
      remove.addEventListener('click', async () => {
        const confirmed = await social.confirmAction({
          title: 'Excluir comentário?',
          message: 'O comentário será removido desta publicação.',
          confirmLabel: 'Excluir comentário',
          danger: true
        });
        if (!confirmed) return;
        try {
          await social.api(`/api/social/comments/${encodeURIComponent(comment.id)}`, { method: 'DELETE' });
          row.remove();
          post.counts.comments = Math.max(0, Number(post.counts.comments || 0) - 1);
          onCountChange();
        } catch (error) {
          social.status(error.message || 'Não foi possível excluir o comentário.', 'error');
        }
      });
      row.appendChild(remove);
    }
    return row;
  }

  async function loadComments(post, section, append = false, onCountChange = () => {}) {
    const key = `comments:${post.id}`;
    const cursor = append ? cursors.get(key) || '' : '';
    const more = section.querySelector('[data-comments-more]');
    more.disabled = true;
    try {
      const payload = await social.api(`/api/social/posts/${encodeURIComponent(post.id)}/comments${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
      const list = section.querySelector('.social-comment-list');
      if (!append) list.innerHTML = '';
      (payload.comments || []).forEach((comment) => list.appendChild(commentNode(comment, post, onCountChange)));
      cursors.set(key, payload.nextCursor || '');
      more.hidden = !payload.nextCursor;
      return true;
    } catch (error) {
      social.status(error.message || 'Não foi possível carregar os comentários.', 'error');
      return false;
    } finally {
      more.disabled = false;
    }
  }

  function commentsSection(post, onCountChange) {
    const section = document.createElement('section');
    section.className = 'social-comments';
    section.hidden = true;
    const list = document.createElement('div');
    list.className = 'social-comment-list';
    const more = social.button('Carregar mais comentários', 'social-button secondary');
    more.dataset.commentsMore = 'true';
    more.hidden = true;
    more.addEventListener('click', () => loadComments(post, section, true, onCountChange));
    const form = document.createElement('form');
    form.className = 'social-comment-form';
    const input = document.createElement('input');
    input.className = 'social-input';
    input.maxLength = 600;
    input.required = true;
    input.placeholder = 'Escreva um comentário';
    input.setAttribute('aria-label', 'Novo comentário');
    const submit = social.button('Comentar', 'social-button primary');
    submit.type = 'submit';
    form.append(input, submit);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      try {
        const payload = await social.api(`/api/social/posts/${encodeURIComponent(post.id)}/comments`, {
          method: 'POST', body: JSON.stringify({ body: input.value })
        });
        list.appendChild(commentNode(payload.comment, post, onCountChange));
        post.counts.comments = Number(post.counts.comments || 0) + 1;
        onCountChange();
        input.value = '';
        social.status('Comentário publicado.', 'success');
      } catch (error) {
        social.status(error.message || 'Não foi possível comentar.', 'error');
      } finally {
        submit.disabled = false;
      }
    });
    section.append(list, more, form);
    return section;
  }

  function postNode(post) {
    const card = document.createElement('article');
    card.className = 'social-post';
    card.dataset.postId = post.id;
    const header = authorHeader(post);
    const body = document.createElement('p');
    body.className = 'social-post-body';
    body.textContent = post.body;
    const meta = document.createElement('div');
    meta.className = 'social-post-meta';
    meta.textContent = `${social.formatDate(post.createdAt)}${post.edited ? ' · editada' : ''} · ${post.audience === 'self' ? 'somente eu' : 'amigos'}`;
    const menu = postMenu(post, card, body);
    header.appendChild(menu);
    const actions = document.createElement('div');
    actions.className = 'social-post-actions';
    const like = social.button('', 'social-action', social.icons.like);
    const likeText = like.querySelector('span:last-child');
    const updateLike = () => {
      like.classList.toggle('active', Boolean(post.reacted));
      like.setAttribute('aria-pressed', post.reacted ? 'true' : 'false');
      likeText.textContent = `${post.reacted ? 'Curtido' : 'Curtir'} · ${Number(post.counts.reactions || 0)}`;
    };
    updateLike();
    like.addEventListener('click', async () => {
      like.disabled = true;
      try {
        const payload = await social.api(`/api/social/posts/${encodeURIComponent(post.id)}/reaction`, {
          method: post.reacted ? 'DELETE' : 'PUT'
        });
        post.reacted = payload.reacted;
        post.counts.reactions = payload.reactions;
        updateLike();
      } catch (error) {
        social.status(error.message || 'Não foi possível atualizar a curtida.', 'error');
      } finally {
        like.disabled = false;
      }
    });
    let comment = null;
    const updateComment = () => {
      const label = comment?.querySelector('span:last-child');
      if (label) label.textContent = `Comentários · ${Number(post.counts.comments || 0)}`;
    };
    const comments = commentsSection(post, updateComment);
    comment = social.button('', 'social-action', social.icons.comment);
    updateComment();
    comment.setAttribute('aria-expanded', 'false');
    comment.addEventListener('click', async () => {
      const opening = comments.hidden;
      comments.hidden = !opening;
      comment.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (opening && !comments.dataset.loaded) {
        const loaded = await loadComments(post, comments, false, updateComment);
        if (loaded) comments.dataset.loaded = 'true';
      }
    });
    actions.append(like, comment);
    card.append(header, body, meta, actions, comments);
    return card;
  }

  function renderPosts(container, posts, append = false) {
    if (!container) return;
    if (!append) container.innerHTML = '';
    if (!posts.length && !append) {
      container.appendChild(emptyState());
      return;
    }
    posts.forEach((post) => container.appendChild(postNode(post)));
  }

  async function load(container, loadMoreButton, options = {}) {
    const key = options.handle ? `profile:${options.handle}` : 'feed';
    const cursor = options.append ? cursors.get(key) || '' : '';
    const path = options.handle
      ? `/api/social/profiles/${encodeURIComponent(options.handle)}/posts`
      : '/api/social/feed';
    if (loadMoreButton) loadMoreButton.disabled = true;
    try {
      const payload = await social.api(`${path}${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
      renderPosts(container, payload.posts || [], Boolean(options.append));
      cursors.set(key, payload.nextCursor || '');
      if (loadMoreButton) loadMoreButton.hidden = !payload.nextCursor;
      return payload;
    } finally {
      if (loadMoreButton) loadMoreButton.disabled = false;
    }
  }

  function bindComposer(form, container, loadMoreButton) {
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const textarea = form.querySelector('textarea');
      const audience = form.querySelector('select');
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        const payload = await social.api('/api/social/posts', {
          method: 'POST', body: JSON.stringify({ body: textarea.value, audience: audience.value })
        });
        const empty = container.querySelector('.social-empty');
        if (empty) empty.remove();
        container.prepend(postNode(payload.post));
        textarea.value = '';
        social.status('Publicação criada.', 'success');
      } catch (error) {
        social.status(error.message || 'Não foi possível publicar.', 'error');
      } finally {
        submit.disabled = false;
        textarea.focus();
      }
    });
    loadMoreButton?.addEventListener('click', () => load(container, loadMoreButton, { append: true }).catch((error) => social.status(error.message, 'error')));
  }

  window.PortalSocialFeed = Object.freeze({ bindComposer, load, postNode, renderPosts });
})();
