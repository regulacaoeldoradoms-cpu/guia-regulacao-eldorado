'use strict';

(() => {
  const MAX_CONCURRENT = 1;
  const queue = [];
  const running = new Map();
  let nextId = 1;
  let scheduled = false;
  let paused = false;
  let pauseReason = '';

  function now() {
    return performance?.now?.() || Date.now();
  }

  function abortError() {
    try {
      return new DOMException('Tarefa de background cancelada.', 'AbortError');
    } catch (_) {
      const error = new Error('Tarefa de background cancelada.');
      error.name = 'AbortError';
      return error;
    }
  }

  function isAbort(error) {
    return error?.name === 'AbortError';
  }

  function settle(task, state, reason = '', value = null, error = null) {
    if (task.settled) return;
    task.settled = true;
    const durationMs = Math.max(0, Math.round(now() - task.startedAt));
    const outcome = Object.freeze({
      id: task.id,
      key: task.key,
      type: task.type,
      scope: task.scope,
      state,
      reason: String(reason || ''),
      durationMs,
      value,
      error
    });
    try { task.onSettled?.(outcome); } catch (_) {}
    try { task.resolveDone?.(outcome); } catch (_) {}
  }

  function schedulePump() {
    if (scheduled || paused || !queue.length) return;
    scheduled = true;
    const run = (deadline = null) => {
      scheduled = false;
      if (paused || document.visibilityState === 'hidden') return;
      pump(deadline);
    };
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(() => run(null), 160);
    }
  }

  function selectNext() {
    queue.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.order - b.order;
    });
    return queue.shift() || null;
  }

  function start(task) {
    if (task.cancelled || task.settled) return;
    const controller = new AbortController();
    task.controller = controller;
    task.startedAt = now();
    running.set(task.id, task);

    Promise.resolve().then(() => task.run({
      signal: controller.signal,
      cancelled: () => task.cancelled || controller.signal.aborted,
      throwIfCancelled: () => {
        if (task.cancelled || controller.signal.aborted) throw abortError();
      }
    })).then((value) => {
      if (task.cancelled || controller.signal.aborted) {
        settle(task, 'cancelled', task.cancelReason || 'cancelled', null, null);
      } else {
        settle(task, 'prepared', '', value, null);
      }
    }).catch((error) => {
      if (task.cancelled || controller.signal.aborted || isAbort(error)) {
        settle(task, 'cancelled', task.cancelReason || 'cancelled', null, error);
      } else {
        settle(task, 'failed', '', null, error);
      }
    }).finally(() => {
      running.delete(task.id);
      schedulePump();
    });
  }

  function pump(deadline = null) {
    while (!paused && running.size < MAX_CONCURRENT && queue.length) {
      if (
        deadline
        && !deadline.didTimeout
        && typeof deadline.timeRemaining === 'function'
        && deadline.timeRemaining() < 4
      ) {
        schedulePump();
        return;
      }
      const task = selectNext();
      if (!task) return;
      start(task);
    }
  }

  function schedule(options = {}) {
    const key = String(options.key || '').trim();
    const type = String(options.type || 'task').trim() || 'task';
    const scope = String(options.scope || 'global').trim() || 'global';
    const run = options.run;
    if (!key || typeof run !== 'function') return null;

    const duplicate = queue.find((task) => task.key === key && !task.settled)
      || Array.from(running.values()).find((task) => task.key === key && !task.settled);
    if (duplicate) return duplicate.id;

    let resolveDone = null;
    const done = new Promise((resolve) => { resolveDone = resolve; });
    const task = {
      id: nextId++,
      key,
      type,
      scope,
      priority: Number.isFinite(Number(options.priority)) ? Number(options.priority) : 0,
      order: nextId,
      run,
      onSettled: typeof options.onSettled === 'function' ? options.onSettled : null,
      controller: null,
      cancelled: false,
      cancelReason: '',
      startedAt: now(),
      settled: false,
      done,
      resolveDone
    };

    queue.push(task);
    schedulePump();
    return task.id;
  }

  function cancelTask(task, reason) {
    if (!task || task.settled) return false;
    task.cancelled = true;
    task.cancelReason = String(reason || 'cancelled');
    if (task.controller && !task.controller.signal.aborted) {
      try { task.controller.abort(task.cancelReason); } catch (_) { task.controller.abort(); }
    }
    if (!running.has(task.id)) settle(task, 'cancelled', task.cancelReason);
    return true;
  }

  function join(key) {
    const target = String(key || '').trim();
    if (!target) return null;
    const task = Array.from(running.values()).find((item) => item.key === target && !item.settled);
    return task?.done || null;
  }

  function cancelQueuedScope(scope, reason = 'scope_cancelled') {
    const target = String(scope || '');
    if (!target) return 0;
    let count = 0;
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (queue[index].scope !== target) continue;
      const [task] = queue.splice(index, 1);
      if (cancelTask(task, reason)) count += 1;
    }
    return count;
  }

  function cancelScope(scope, reason = 'scope_cancelled') {
    const target = String(scope || '');
    if (!target) return 0;
    let count = 0;
    for (let index = queue.length - 1; index >= 0; index -= 1) {
      if (queue[index].scope !== target) continue;
      const [task] = queue.splice(index, 1);
      if (cancelTask(task, reason)) count += 1;
    }
    for (const task of running.values()) {
      if (task.scope === target && cancelTask(task, reason)) count += 1;
    }
    return count;
  }

  function cancelAll(reason = 'cancelled') {
    let count = 0;
    while (queue.length) {
      const task = queue.pop();
      if (cancelTask(task, reason)) count += 1;
    }
    for (const task of running.values()) {
      if (cancelTask(task, reason)) count += 1;
    }
    return count;
  }

  function setPaused(value, reason = '') {
    paused = value === true;
    pauseReason = paused ? String(reason || 'foreground') : '';
    if (!paused) schedulePump();
    return paused;
  }

  function stats() {
    return Object.freeze({
      queued: queue.length,
      running: running.size,
      paused,
      pauseReason
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cancelAll('hidden');
      setPaused(true, 'hidden');
    } else {
      setPaused(false);
    }
  });

  window.addEventListener('portal:session-cleared', () => {
    cancelAll('session');
  });

  window.PortalDocumentBackground = Object.freeze({
    schedule,
    join,
    cancelQueuedScope,
    cancelScope,
    cancelAll,
    setPaused,
    stats
  });
})();
