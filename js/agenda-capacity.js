'use strict';

((root) => {
  const ROOM_CAPACITY = 2;
  const CONFLICT_WINDOW_MINUTES = 30;

  function normalized(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function parseMinutes(value) {
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return (hours * 60) + minutes;
  }

  function isPsychiatry(record) {
    return normalized(record?.specialty).includes('psiquiatr');
  }

  function isEligible(record) {
    return record?.active !== false
      && Boolean(String(record?.appointmentDate || '').trim())
      && parseMinutes(record?.appointmentTime) !== null
      && !isPsychiatry(record);
  }

  function isSubset(candidate, existing) {
    const existingIds = new Set(existing.records.map((record) => String(record.sourceId || '')));
    return candidate.records.every((record) => existingIds.has(String(record.sourceId || '')));
  }

  function analyze(records) {
    const occupancyBySourceId = Object.create(null);
    const byDate = new Map();

    for (const record of Array.isArray(records) ? records : []) {
      if (!isEligible(record)) continue;
      const date = String(record.appointmentDate);
      const entry = { record, minutes: parseMinutes(record.appointmentTime) };
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date).push(entry);
    }

    const criticalCandidates = [];

    for (const [date, entries] of byDate.entries()) {
      entries.sort((left, right) => {
        if (left.minutes !== right.minutes) return left.minutes - right.minutes;
        return String(left.record.patient || '').localeCompare(String(right.record.patient || ''), 'pt-BR');
      });

      for (let start = 0; start < entries.length; start += 1) {
        const first = entries[start];
        const windowEntries = [];

        for (let cursor = start; cursor < entries.length; cursor += 1) {
          const current = entries[cursor];
          if (current.minutes - first.minutes > CONFLICT_WINDOW_MINUTES) break;
          windowEntries.push(current);
        }

        if (windowEntries.length < 2) continue;

        for (const entry of windowEntries) {
          const sourceId = String(entry.record.sourceId || '');
          if (!sourceId) continue;
          occupancyBySourceId[sourceId] = Math.max(occupancyBySourceId[sourceId] || 0, windowEntries.length);
        }

        if (windowEntries.length > ROOM_CAPACITY) {
          criticalCandidates.push({
            date,
            startMinutes: windowEntries[0].minutes,
            endMinutes: windowEntries[windowEntries.length - 1].minutes,
            records: windowEntries.map((entry) => entry.record)
          });
        }
      }
    }

    criticalCandidates.sort((left, right) => {
      if (left.date !== right.date) return left.date.localeCompare(right.date);
      if (left.records.length !== right.records.length) return right.records.length - left.records.length;
      return left.startMinutes - right.startMinutes;
    });

    const criticalGroups = [];
    for (const candidate of criticalCandidates) {
      const covered = criticalGroups.some((existing) => (
        existing.date === candidate.date
        && candidate.records.length <= existing.records.length
        && isSubset(candidate, existing)
      ));
      if (!covered) criticalGroups.push(candidate);
    }

    criticalGroups.sort((left, right) => {
      if (left.date !== right.date) return left.date.localeCompare(right.date);
      return left.startMinutes - right.startMinutes;
    });

    return {
      roomCapacity: ROOM_CAPACITY,
      windowMinutes: CONFLICT_WINDOW_MINUTES,
      occupancyBySourceId,
      criticalGroups
    };
  }

  root.AgendaCapacity = {
    ROOM_CAPACITY,
    CONFLICT_WINDOW_MINUTES,
    analyze,
    isPsychiatry,
    parseMinutes
  };
})(window);
