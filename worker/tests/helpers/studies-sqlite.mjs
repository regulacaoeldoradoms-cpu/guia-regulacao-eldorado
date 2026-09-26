// Adapter de teste: executa SQL real em memória, incluindo rollback de batch.
export function sqliteD1(sqlite) {
  const prepare = (sql, params = []) => ({
    sql, params,
    bind(...next) { return prepare(sql, next); },
    async first() { return sqlite.prepare(sql).get(...params) || null; },
    async all() { return { results: sqlite.prepare(sql).all(...params) }; },
    async run() { const r = sqlite.prepare(sql).run(...params); return { success: true, meta: { changes: Number(r.changes) } }; }
  });
  return {
    prepare,
    async batch(statements) {
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        const results = statements.map(({ sql, params }) => {
          const r = sqlite.prepare(sql).run(...params);
          return { success: true, meta: { changes: Number(r.changes) } };
        });
        sqlite.exec('COMMIT');
        return results;
      } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    }
  };
}
