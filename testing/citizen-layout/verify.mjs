import assert from "node:assert/strict";
import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const baseline = process.argv[3]
  ? JSON.parse(fs.readFileSync(process.argv[3], "utf8"))
  : [];
const sharedRoutes = new Set([
  '/', '/cidadao/', '/perfil/', '/amigos/', '/notificacoes/',
  '/configuracoes/', '/seguranca/', '/conquistas/', '/ferramentas/', '/mascotes/',
]);
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
  if (sharedRoutes.has(row.route))
    assert.equal(row.sharedPresentationReady, true, `${name}: shared presentation resources mounted`);
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
    if (sharedRoutes.has(row.route)) {
      assert.ok(row.bodyClass.includes('shared-mobile-navigation'), `${name}: shared mobile navigation mounted`);
      assert.ok(row.navigation, `${name}: shared navigation is visible`);
      assert.ok(row.navigation.targetsFit, `${name}: all navigation targets visible and at least 44 px`);
      assert.ok(row.navigation.iconOnly, `${name}: shared routes use approved icon navigation`);
      assert.deepEqual(row.navigation.destinations, ["/", "/amigos/", "portalChatLauncher", "socialNotificationTriggerMobile", "/mascotes/", "/perfil/"], `${name}: all six shared destinations retain their order`);
      assert.deepEqual(row.navigation.accessibleNames, ['Início', 'Amigos', 'Chat', 'Avisos', 'Mascotes', 'Perfil'], `${name}: every shared icon retains its accessible name`);
      assert.ok(row.navigation.labelsHidden, `${name}: shared labels are visually hidden`);
      assert.ok(row.navigation.profileAvatar, `${name}: Perfil retains the account avatar`);
      assert.ok(row.navigation.profileAvatarMatchesAccount, `${name}: Perfil uses the original signed-in account avatar`);
      assert.equal(row.navigation.position, "fixed", `${name}: shared navigation stays reachable`);
      assert.equal(row.navigation.rows, 1, `${name}: shared icons stay in one row at both text scales`);
      assert.equal(row.navigation.reflow, false, `${name}: icon navigation does not need text reflow`);
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
        state.x >= -1 && state.right <= (state.viewportClientWidth ?? (row.clientWidth || row.width)) + 1,
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
