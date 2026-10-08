'use strict';

// Local prototype: position only. Confirmation belongs to the private session receipt.
(() => {
  const prefix = 'study-reading-position-v1:';
  const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  function validContext(context) {
    return context?.readingReceiptProtocol === 1 && context.username === 'wellyton'
      && typeof context.missionId === 'string' && /^[a-z0-9][a-z0-9._-]{0,100}$/i.test(context.missionId)
      && uuid.test(context.sessionId) && Number.isInteger(context.contentVersion) && context.contentVersion > 0
      && Array.isArray(context.sectionIds) && context.sectionIds.length > 0
      && context.sectionIds.every(id => typeof id === 'string' && id.length > 0);
  }
  function key(context) { return prefix + context.username + ':' + context.missionId; }
  function validate(record, context) {
    return validContext(context) && record?.protocol === 1 && record.username === context.username
      && record.sessionId === context.sessionId && record.missionId === context.missionId
      && record.contentVersion === context.contentVersion && context.sectionIds.includes(record.sectionId)
      && typeof record.all === 'boolean' && ['lesson', 'practice'].includes(record.view);
  }
  function read(storage, context) {
    if (!validContext(context)) return null;
    try {
      const record = JSON.parse(storage.getItem(key(context)));
      if (!validate(record, context)) return null;
      return { sectionId: record.sectionId, all: record.all,
        view: record.view === 'practice' && context.readingComplete === true ? 'practice' : 'lesson' };
    } catch { return null; }
  }
  function write(storage, context, position) {
    const record = { protocol: 1, username: context?.username, sessionId: context?.sessionId,
      missionId: context?.missionId, contentVersion: context?.contentVersion,
      sectionId: position?.sectionId, all: position?.all, view: position?.view };
    if (!validate(record, context)) return false;
    try { storage.setItem(key(context), JSON.stringify(record)); return true; } catch { return false; }
  }
  function clear(reader) {
    reader?.observePosition?.(null);
    document.getElementById('studyReadingBookmarkNotice')?.remove();
  }
  function bind(reader, context) {
    clear(reader);
    if (!validContext(context) || !reader?.position || !reader?.restorePosition || !reader?.observePosition) return false;
    let storage;
    try { storage = window.sessionStorage; } catch { /* Reading remains usable. */ }
    const saved = read(storage, context);
    const restored = saved ? reader.restorePosition(saved) : false;
    const notice = document.createElement('p');
    notice.id = 'studyReadingBookmarkNotice'; notice.className = 'study-reader-caption';
    notice.style.fontSize = 'var(--study-reading-size, 1.125rem)';
    notice.setAttribute('role', 'status');
    document.getElementById('studyLessonPanel')?.before(notice);
    const announce = available => { notice.textContent = available
      ? (restored ? 'Posição retomada. ' : '') + 'Posição guardada nesta aba. Não comprova leitura ou aprendizagem e não concede XP.'
      : 'Não foi possível guardar a posição nesta aba. A leitura continua disponível; ao recarregar, volte pelo índice da aula.'; };
    announce(write(storage, context, reader.position()));
    reader.observePosition(position => announce(write(storage, context, position)));
    return restored;
  }
  window.StudyReadingBookmark = Object.freeze({ validContext, validate, read, write, bind, clear });
})();
