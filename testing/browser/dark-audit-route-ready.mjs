const primaryViews = new Set(['/', '/amigos/', '/perfil/', '/mascotes/']);

// A canonical Home URL only covers a route when that route's actual native
// controller is loaded and active. Auth redirects and a still-visible Home do
// not count as coverage of Perfil/Amigos/Mascotes.
export async function waitForAuditRoute(page, expectedRoute) {
  await page.waitForFunction(({expectedRoute, primary}) => {
    const shell = window.PortalCitizenShell;
    if (shell?.enabled()) {
      const active = shell.active();
      return active.url.pathname === expectedRoute && active.loaded
        && !shell.diagnostics().navigating
        && location.pathname === (primary ? '/' : expectedRoute);
    }
    if (window.PortalCitizenShellReady && !shell) return false;
    // A native click may expose its URL while deferred bootstrap scripts still
    // redirect the legacy document. Do not count that transient document.
    return document.readyState === 'complete' && location.pathname === expectedRoute;
  }, {expectedRoute, primary:primaryViews.has(expectedRoute)});
}
