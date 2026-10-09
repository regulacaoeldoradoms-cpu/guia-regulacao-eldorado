import assert from "node:assert/strict";
import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const baseline = process.argv[3]
  ? JSON.parse(fs.readFileSync(process.argv[3], "utf8"))
  : [];
for (const row of rows) {
  const name = `${row.route} @ ${row.width}`;
  assert.deepEqual(row.errors, [], `${name}: JavaScript errors`);
  assert.ok(
    row.scrollWidth <= row.width + 1,
    `${name}: page overflow ${row.scrollWidth}: ${JSON.stringify(row.overflow)}`,
  );
  assert.ok(
    row.bodyClass.includes("citizen-readable-layout"),
    `${name}: citizen presentation`,
  );
  if (row.citizenCards)
    assert.deepEqual(
      row.citizenCards,
      ["/cidadao/"],
      `${name}: tools remain citizen-only`,
    );
  if (row.width <= 900) {
    assert.deepEqual(
      row.paw,
      { svg: true, label: "Mascotes", text: "" },
      `${name}: accessible SVG paw`,
    );
    for (const target of row.controls.filter((c) =>
      c.class.includes("social-mobile-nav-link"),
    ))
      assert.ok(target.height >= 44, `${name}: navigation touch target`);
    for (const state of row.states || []) {
      if (state.chatAboveCompanion !== null && state.chatAboveCompanion !== undefined)
        assert.ok(state.chatAboveCompanion, `${name}: chat readable above floating companion`);
      if (state.notificationActionReachable !== undefined)
        assert.ok(state.notificationActionReachable, `${name}: notification action reachable by scrolling`);
      assert.ok(state.opened, `${name}: ${state.name} opens`);
      assert.ok(
        state.x >= -1 && state.right <= row.width + 1,
        `${name}: ${state.name} horizontal bounds`,
      );
      assert.ok(
        state.scrollWidth <= state.clientWidth + 1,
        `${name}: ${state.name} inner overflow ${state.scrollWidth}/${state.clientWidth}: ${JSON.stringify(state.overflow)}`,
      );
    }
  }
  const before = baseline.find(
    (b) => b.route === row.route && b.width === row.width,
  );
  if (before?.palette)
    assert.deepEqual(row.palette, before.palette, `${name}: semantic colors`);
  if (row.width === 1440 && before?.geometry)
    assert.deepEqual(
      row.geometry,
      before.geometry,
      `${name}: desktop geometry`,
    );
}
console.log(`${rows.length} citizen layout scenarios passed`);
