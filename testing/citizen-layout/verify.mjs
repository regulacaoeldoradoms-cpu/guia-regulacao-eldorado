import assert from "node:assert/strict";
import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const baseline = process.argv[3]
  ? JSON.parse(fs.readFileSync(process.argv[3], "utf8"))
  : [];
for (const row of rows) {
  const name = `${row.route} @ ${row.width}`;
  assert.deepEqual(row.errors, [], `${name}: JavaScript errors`);
  if (row.cachedNavigationLoads) {
    assert.ok(row.navigationScriptLoads.length > 0, `${name}: navigation source was requested`);
    for (const url of row.navigationScriptLoads) {
      const version = new URL(url, "http://localhost").searchParams.get("v");
      assert.ok(version, `${name}: navigation source retains its versioned cache key`);
      if (version === row.legacyNavigationVersion)
        assert.ok(row.cachedNavigationLoads.includes(url), `${name}: old version receives the legacy fixture`);
      else
        assert.ok(!row.cachedNavigationLoads.includes(url), `${name}: bumped version bypasses the legacy fixture`);
    }
  }
  assert.ok(
    row.scrollWidth <= (row.clientWidth || row.width) + 1,
    `${name}: page overflow ${row.scrollWidth}: ${JSON.stringify(row.overflow)}`,
  );
  assert.ok(
    row.bodyClass.includes("citizen-readable-layout"),
    `${name}: citizen presentation`,
  );
  if (row.citizenCards && row.role !== "admin")
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
    if (row.navigation) {
      assert.ok(row.navigation.targetsFit, `${name}: all navigation targets visible and at least 44 px`);
      if (row.route === "/") {
        assert.ok(row.navigation.iconOnly, `${name}: Home uses approved icon navigation`);
        assert.deepEqual(row.navigation.destinations, ["/", "/amigos/", "portalChatLauncher", "socialNotificationTriggerMobile", "/mascotes/", "/perfil/"], `${name}: all six Home destinations retain their order`);
        assert.ok(row.navigation.accessibleNames.every(label => label.trim()), `${name}: every Home icon has an accessible name`);
        assert.ok(row.navigation.labelsHidden, `${name}: Home labels are visually hidden`);
        assert.ok(row.navigation.profileAvatar, `${name}: Perfil retains the account avatar`);
        assert.equal(row.navigation.position, "fixed", `${name}: Home navigation stays reachable`);
        assert.equal(row.navigation.rows, 1, `${name}: Home icons stay in one row at both text scales`);
        assert.equal(row.navigation.reflow, false, `${name}: icon navigation does not need text reflow`);
      } else {
        assert.ok(row.navigation.labelsFit, `${name}: complete navigation labels fit`);
        if (row.textScale !== 2)
          assert.equal(row.navigation.rows, 1, `${name}: normal text navigation stays in one row`);
        else
          assert.ok(row.navigation.reflow, `${name}: enlarged text reflows safely`);
      }
    }
    for (const target of row.controls.filter((c) =>
      c.class.includes("social-mobile-nav-link"),
    ))
      {
        assert.ok(target.height >= 44 && target.width >= 44, `${name}: navigation touch target`);
        assert.ok(target.font >= 14, `${name}: readable navigation font`);
      }
    for (const state of row.states || []) {
      if (state.chatAboveCompanion !== null && state.chatAboveCompanion !== undefined)
        assert.ok(state.chatAboveCompanion, `${name}: chat readable above floating companion`);
      if (state.notificationActionReachable !== undefined)
        assert.ok(state.notificationActionReachable, `${name}: notification action reachable by scrolling`);
      assert.ok(state.opened, `${name}: ${state.name} opens`);
      assert.ok(
        state.x >= -1 && state.right <= (row.clientWidth || row.width) + 1,
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
