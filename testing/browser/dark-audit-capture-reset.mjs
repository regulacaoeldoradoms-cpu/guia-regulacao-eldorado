export const AUDIT_TRANSITION_RESET_PATH = '/__portal_dark_audit_transition_reset__.css';
export const AUDIT_TRANSITION_RESET_CSS = '*,*::before,*::after{transition:none!important}';

// Stop transitions before the first app paint. Keep native CSS animations
// available to prepare(), including the Council's asserted 4.8s reflection.
// The existing complete animation/caret/scroll reset still runs after prepare.
// Cancelling a running transition later can retain a blur raster produced at
// an intermediate fractional position, even after layout and PNGs stabilize.
// No product styles, CSS effects, viewport or pixel acceptance change here.
export async function installCaptureTransitionReset(target) {
  await target.addInitScript(path => {
    if (location.origin !== 'http://127.0.0.1:4176') return;
    const insert = () => {
      if (!document.head) return false;
      if (document.querySelector('link[data-dark-audit-transition-reset]')) return true;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      link.dataset.darkAuditTransitionReset = '1';
      link.dataset.darkAuditResetState = 'loading';
      // Dynamically inserted stylesheets need explicit render blocking.
      // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-blocking
      link.setAttribute('blocking', 'render');
      window.__captureResetTiming = { scope: 'transitions', inserted: performance.now() };
      link.addEventListener('load', () => {
        link.dataset.darkAuditResetState = 'loaded';
        window.__captureResetTiming.loaded = performance.now();
      }, { once: true });
      link.addEventListener('error', () => {
        link.dataset.darkAuditResetState = 'error';
      }, { once: true });
      document.head.appendChild(link);
      return true;
    };
    if (insert()) return;
    const observer = new MutationObserver(() => {
      if (insert()) observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  }, AUDIT_TRANSITION_RESET_PATH);
}

export async function waitForCaptureTransitionReset(page) {
  await page.evaluate(async () => {
    const link = document.querySelector('link[data-dark-audit-transition-reset]');
    if (!link) throw new Error('CSS sintético de transições não foi instalado antes da navegação.');
    if (link.dataset.darkAuditResetState === 'error') throw new Error('Falha ao carregar CSS sintético de transições.');
    if (link.sheet) return;
    await new Promise((resolve, reject) => {
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', () => reject(new Error('Falha ao carregar CSS sintético de transições.')), { once: true });
    });
  });
}
