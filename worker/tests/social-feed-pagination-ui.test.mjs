import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('../../', import.meta.url).pathname);
const read = (filename) => fs.readFileSync(path.join(root, filename), 'utf8');

test('feed social usa lotes de 10 com rolagem automática e sem botão visível', () => {
  const feed = read('js/social-feed.js');
  const home = read('index.html');
  const profile = read('perfil/index.html');

  assert.match(feed, /const POSTS_PER_VIEW = 10;/);
  assert.match(feed, /IntersectionObserver/);
  assert.match(feed, /data-post-id/);
  assert.match(feed, /state\.seen\.has/);
  assert.match(home, /id="socialFeedMore"[^>]*data-auto-scroll="true"/);
  assert.match(profile, /id="profilePostsMore"[^>]*data-auto-scroll="true"/);
  assert.doesNotMatch(home, />Carregar mais publicações</);
  assert.doesNotMatch(profile, />Carregar mais publicações</);
  assert.match(home, /social-feed\.js\?v=20260910-1/);
  assert.match(profile, /social-feed\.js\?v=20260910-1/);
});

test('comentários mostram até 5 por lote e só oferecem mais quando houver conteúdo pendente', () => {
  const feed = read('js/social-feed.js');

  assert.match(feed, /const COMMENTS_PER_VIEW = 5;/);
  assert.match(feed, /state\.buffer\.splice\(0, COMMENTS_PER_VIEW\)/);
  assert.match(feed, /more\.hidden = !stateHasMore\(state\)/);
  assert.match(feed, /data-comment-id/);
  assert.match(feed, /Carregar mais comentários/);
});
