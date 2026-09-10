'use strict';

(() => {
  if (window.PortalSocialFeed) return;
  const social = window.PortalSocial;
  const POSTS_PER_VIEW = 10;
  const COMMENTS_PER_VIEW = 5;
  const MAX_EMPTY_PAGE_HOPS = 3;
  const postStates = new Map();
  const commentStates = new Map();
  const autoScrollBindings = new WeakMap();

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

  function freshState() {
    return { cursor: '', buffer: [], seen: new Set(), done: false, pending: null };
  }

  function stateHasMore(state) {
    return Boolean(state && (state.buffer.length || !state.done));
  }

  function appendUnique(state, items) {
    let added = 0;
    for (const item of items || []) {
      const id = String(item?.id || '');
      if (!id || state.seen.has(id)) continue;
      state.seen.add(id);
      state.buffer.push(item);
      added += 1;
    }
    return added;
  }

  async function fillBuffer(state, path, itemKey, minimum) {
    let emptyHops = 0;
    while (state.buffer.length < minimum && !state.done && emptyHops < MAX_EMPTY_PAGE_HOPS) {
      const currentCursor = state.cursor;
      const payload = await social.api(`${path}${currentCursor ? `?cursor=${encodeURIComponent(currentCursor)}` : ''}`);
      const added = appendUnique(state, payload[itemKey] || []);
      const nextCursor = String(payload.nextCursor || '');
      state.cursor = nextCursor;
      state.done = !nextCursor;
      if (added > 0) emptyHops = 0;
      else emptyHops += 1;
      if (nextCursor && nextCursor === currentCursor) {
        state.done = true;
        state.cursor = '';
      }
    }
  }

  function renderComments(list, comments, post, onCountChange, append) {
    if (!append) list.innerHTML = '';
    const existing = new Set(Array.from(list.querySelectorAll('[data-comment-id]'), (node) => node.dataset.commentId));
    for (const comment of comments) {
      if (!comment?.id || existing.has(String(comment.id))) continue;
      existing.add(String(comment.id));
      list.appendChild(commentNode(comment, post, onCountChange));
    }
  }

  async function loadComments(post, section, append = false, onCountChange = () => {}) {
    const key = `comments:${post.id}`;
    let state = commentStates.get(key);
    if (!append || !state) {
      state = freshState();
      commentStates.set(key, state);
    }
    if (state.pending) return state.pending;

    const more = section.querySelector('[data-comments-more]');
    const list = section.querySelector('.social-comment-list');
    if (more) more.disabled = true;

    state.pending = (async () => {
      try {
        await fillBuffer(state, `/api/social/posts/${encodeURIComponent(post.id)}/comments`, 'comments', COMMENTS_PER_VIEW);
        const batch = state.buffer.splice(0, COMMENTS_PER_VIEW);
        renderComments(list, batch, post, onCountChange, append);
        if (more) more.hidden = !stateHasMore(state);
        return true;
      } catch (error) {
        social.status(error.message || 'Não foi possível carregar os comentários.', 'error');
        return false;
      } finally {
        if (more) more.disabled = false;
        state.pending = null;
      }
    })();

    return state.pending;
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
        const state = commentStates.get(`comments:${post.id}`);
        if (state && payload.comment?.id) state.seen.add(String(payload.comment.id));
        const commentId = String(payload.comment?.id || '');
        const existingCommentIds = new Set(Array.from(list.querySelectorAll('[data-comment-id]'), (node) => node.dataset.commentId));
        if (commentId && !existingCommentIds.has(commentId)) list.appendChild(commentNode(payload.comment, post, onCountChange));
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
    const existing = new Set(Array.from(container.querySelectorAll('[data-post-id]'), (node) => node.dataset.postId));
    for (const post of posts) {
      if (!post?.id || existing.has(String(post.id))) continue;
      existing.add(String(post.id));
      container.appendChild(postNode(post));
    }
  }

  function postKey(options = {}) {
    return options.handle ? `profile:${options.handle}` : 'feed';
  }

  function postPath(options = {}) {
    return options.handle
      ? `/api/social/profiles/${encodeURIComponent(options.handle)}/posts`
      : '/api/social/feed';
  }

  function isAutoScrollControl(control) {
    return Boolean(control?.dataset?.autoScroll === 'true');
  }

  function syncPaginationControl(control, state) {
    if (!control) return;
    const more = stateHasMore(state);
    control.hidden = !more;
    if (!isAutoScrollControl(control)) control.disabled = false;
  }

  function bindAutoScroll(container, control, options = {}) {
    if (!container || !control || !isAutoScrollControl(control)) return;
    const previous = autoScrollBindings.get(control);
    previous?.cleanup?.();

    let stopped = false;
    const loadNext = async () => {
      if (stopped || control.hidden || control.dataset.loading === 'true') return;
      const state = postStates.get(postKey(options));
      if (!stateHasMore(state)) {
        control.hidden = true;
        return;
      }
      control.dataset.loading = 'true';
      try {
        await load(container, control, { ...options, append: true });
      } catch (error) {
        social.status(error.message || 'Não foi possível carregar mais publicações.', 'error');
      } finally {
        control.dataset.loading = 'false';
      }
    };

    let cleanup;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadNext();
      }, { rootMargin: '600px 0px', threshold: 0 });
      observer.observe(control);
      cleanup = () => observer.disconnect();
    } else {
      let scheduled = false;
      const onScroll = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          if (control.hidden) return;
          const rect = control.getBoundingClientRect();
          if (rect.top <= window.innerHeight + 600) loadNext();
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      cleanup = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }

    autoScrollBindings.set(control, {
      cleanup: () => {
        stopped = true;
        cleanup?.();
      }
    });
  }

  async function load(container, paginationControl, options = {}) {
    const key = postKey(options);
    let state = postStates.get(key);
    if (!options.append || !state) {
      state = freshState();
      postStates.set(key, state);
    }
    if (isAutoScrollControl(paginationControl)) bindAutoScroll(container, paginationControl, options);
    if (state.pending) return state.pending;
    if (paginationControl && !isAutoScrollControl(paginationControl)) paginationControl.disabled = true;

    state.pending = (async () => {
      try {
        await fillBuffer(state, postPath(options), 'posts', POSTS_PER_VIEW);
        const batch = state.buffer.splice(0, POSTS_PER_VIEW);
        renderPosts(container, batch, Boolean(options.append));
        syncPaginationControl(paginationControl, state);
        return { posts: batch, hasMore: stateHasMore(state), nextCursor: state.cursor };
      } finally {
        if (paginationControl && !isAutoScrollControl(paginationControl)) paginationControl.disabled = false;
        state.pending = null;
      }
    })();

    return state.pending;
  }

  function bindComposer(form, container, paginationControl) {
    if (!form) return;
    if (isAutoScrollControl(paginationControl)) bindAutoScroll(container, paginationControl);
    if (form.dataset.socialComposerBound === 'true') return;
    form.dataset.socialComposerBound = 'true';
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
        const state = postStates.get('feed');
        if (state && payload.post?.id) state.seen.add(String(payload.post.id));
        const postId = String(payload.post?.id || '');
        const existingPostIds = new Set(Array.from(container.querySelectorAll('[data-post-id]'), (node) => node.dataset.postId));
        if (postId && !existingPostIds.has(postId)) container.prepend(postNode(payload.post));
        textarea.value = '';
        social.status('Publicação criada.', 'success');
      } catch (error) {
        social.status(error.message || 'Não foi possível publicar.', 'error');
      } finally {
        submit.disabled = false;
        textarea.focus();
      }
    });
    if (paginationControl && !isAutoScrollControl(paginationControl)) {
      paginationControl.addEventListener('click', () => load(container, paginationControl, { append: true })
        .catch((error) => social.status(error.message || 'Não foi possível carregar mais publicações.', 'error')));
    }
  }

  window.PortalSocialFeed = Object.freeze({ bindComposer, load, postNode, renderPosts });
})();
