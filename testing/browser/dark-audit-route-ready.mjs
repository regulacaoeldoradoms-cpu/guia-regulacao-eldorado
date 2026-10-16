const primaryViews = new Set(['/', '/amigos/', '/perfil/', '/mascotes/', '/cidadao/']);

// A canonical Home URL only covers a route when that route's actual native
// controller is loaded and active. Auth redirects and a still-visible Home do
// not count as coverage of Perfil/Amigos/Mascotes/Canal. The exact previous
// shell revision remains native at /cidadao/ when rendering a historical base;
// current/unknown revisions must satisfy the new canonical address contract.
export async function waitForAuditRoute(page, expectedRoute) {
  await page.waitForFunction(({expectedRoute, primary}) => {
    const shell = window.PortalCitizenShell;
    if (shell?.enabled()) {
      const active = shell.active();
      const legacyCitizen = expectedRoute === '/cidadao/' && shell.version === '20261011-citizen-entry-1';
      return active.url.pathname === expectedRoute && active.loaded
        && !shell.diagnostics().navigating
        && location.pathname === (primary && !legacyCitizen ? '/' : expectedRoute);
    }
    if (window.PortalCitizenShellReady && !shell) return false;
    // A native click may expose its URL while deferred bootstrap scripts still
    // redirect the legacy document. Do not count that transient document.
    return document.readyState === 'complete' && location.pathname === expectedRoute;
  }, {expectedRoute, primary:primaryViews.has(expectedRoute)});
}
