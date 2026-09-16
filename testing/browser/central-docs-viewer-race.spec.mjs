import { test, expect } from '@playwright/test';

test.describe('Central de Documentos — concorrência de abertura do visualizador', () => {
  test('mantém somente o PDF vencedor em A → B e B → C', async ({ page }) => {
    const consoleErrors = [];
    const forbiddenRequests = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(String(error?.message || error)));
    page.on('request', (request) => {
      if (/yellow-wave-d0a1guia-regulacao-ia|googleapis|googleusercontent|accounts\.google\.com|\/api\//i.test(request.url())) {
        forbiddenRequests.push(request.url());
      }
    });

    let releaseSlowRequest;
    let markSlowRequestStarted;
    const slowRequestStarted = new Promise((resolve) => { markSlowRequestStarted = resolve; });
    const slowRequestGate = new Promise((resolve) => { releaseSlowRequest = resolve; });
    await page.route('**/testing/central-docs/_race-slow.pdf', async (route) => {
      markSlowRequestStarted();
      await slowRequestGate;
      try {
        await route.abort('aborted');
      } catch (_) {
        // O loadingTask obsoleto pode abortar a requisição antes da liberação controlada.
      }
    });

    await page.goto('/testing/central-docs/viewer-harness.html');
    await expect(page.locator('#labStatus')).toHaveAttribute('data-state', 'ready');

    const firstRace = await page.evaluate(async () => {
      const viewer = window.PortalPdfViewer;
      const editor = window.PortalPdfEditor;
      const fixture = window.CentralDocsTestFixture;
      const surface = document.getElementById('pdfRoot');
      const scrollRoot = document.getElementById('scrollRoot');
      const pagesRoot = document.getElementById('pages');
      const thumbnailsRoot = document.getElementById('thumbnails');
      const zoomLabel = document.getElementById('zoomReset');
      const pageCountLabel = document.getElementById('pageCount');
      const events = [];

      await viewer.loadPdfJs();

      async function subset(removeIndex, label, options = {}) {
        const session = await editor.createSession(fixture.blob(), { label });
        if (!editor.removePage(session, removeIndex)) throw new Error(`Falha ao montar ${label}.`);
        if (Number(options.rotateFirst || 0)) {
          if (!editor.rotatePage(session, 0, Number(options.rotateFirst))) {
            throw new Error(`Falha ao rotacionar ${label}.`);
          }
        }
        return editor.buildBlob(session);
      }

      const bBlob = await subset(2, 'PDF B sintético');
      // C intentionally excludes the non-default CropBox page. That fixture is
      // exercised by the crop suite; the concurrency suite needs a stable
      // portrait first page on mobile while still using visibly different
      // pixels from B, achieved with a reversible 180° rotation.
      const cBlob = await subset(1, 'PDF C sintético', { rotateFirst: 2 });

      function options(label, activePage) {
        return {
          root: surface,
          scrollRoot,
          pagesRoot,
          thumbnailsRoot,
          zoomLabel,
          pageCountLabel,
          thumbnailActions: true,
          initialViewState: { activePage, scale: 0.9, fitMode: false },
          onReady(info) {
            events.push(`${label}:ready:${info.pageCount}`);
            surface.dataset.raceOwner = label;
          },
          onFirstPageVisible() {
            events.push(`${label}:visible`);
          },
          onPageChange(pageNumber) {
            events.push(`${label}:page:${pageNumber}`);
          },
          onThumbnailAction(action, pageIndex) {
            events.push(`${label}:action:${action}:${pageIndex}`);
          },
          onError() {
            events.push(`${label}:error`);
          }
        };
      }

      function gatedBlob(source) {
        let release;
        let markStarted;
        const gate = new Promise((resolve) => { release = resolve; });
        const started = new Promise((resolve) => { markStarted = resolve; });
        class SlowBlob extends Blob {
          async arrayBuffer() {
            markStarted();
            await gate;
            return Blob.prototype.arrayBuffer.call(this);
          }
        }
        return {
          blob: new SlowBlob([source], { type: 'application/pdf' }),
          release,
          started
        };
      }

      function snapshot() {
        const pages = [...pagesRoot.querySelectorAll('.portal-pdf-page')];
        const pageCanvases = [...pagesRoot.querySelectorAll('.portal-pdf-page-canvas')];
        const thumbs = [...thumbnailsRoot.querySelectorAll('.portal-pdf-thumb')];
        const thumbCanvases = [...thumbnailsRoot.querySelectorAll('.portal-pdf-thumb-canvas')];
        const canvasState = [...pageCanvases, ...thumbCanvases].map((canvas) => ({
          width: canvas.width,
          height: canvas.height,
          pixels: canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL() : ''
        }));
        return {
          pages,
          pageCanvases,
          thumbs,
          thumbCanvases,
          canvasState,
          activePage: surface.dataset.activePage,
          owner: surface.dataset.raceOwner,
          zoom: zoomLabel.textContent,
          pageCount: pageCountLabel.textContent,
          scrollTop: Math.round(scrollRoot.scrollTop)
        };
      }

      async function waitForSettledSurface(expectedPageCount, expectedActivePage) {
        const deadline = performance.now() + 10_000;
        let previousSignature = '';
        let stableSamples = 0;

        while (performance.now() < deadline) {
          const current = snapshot();
          const activePageRendered = Boolean(
            pagesRoot.querySelector(`.portal-pdf-page[data-page-number="${expectedActivePage}"].rendered`)
          );
          const activeThumbRendered = Boolean(
            thumbnailsRoot.querySelector(`.portal-pdf-thumb[data-page-number="${expectedActivePage}"].rendered`)
          );
          const signature = JSON.stringify({
            activePage: current.activePage,
            owner: current.owner,
            zoom: current.zoom,
            pageCount: current.pageCount,
            scrollTop: current.scrollTop,
            canvasState: current.canvasState
          });
          // The viewer is intentionally lazy. A concurrency test must wait for the
          // winning active page to settle, not force every offscreen page to render.
          const ready = activePageRendered
            && activeThumbRendered
            && current.pages.length === expectedPageCount
            && current.thumbs.length === expectedPageCount
            && current.activePage === String(expectedActivePage);

          if (ready && signature === previousSignature) {
            stableSamples += 1;
            if (stableSamples >= 3) return current;
          } else {
            stableSamples = 0;
          }
          previousSignature = signature;
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        throw new Error(`Superfície vencedora não estabilizou na página ${expectedActivePage}.`);
      }

      function unchanged(before, after) {
        const same = (left, right) => left.length === right.length && left.every((node, index) => node === right[index]);
        return same(before.pages, after.pages)
          && same(before.pageCanvases, after.pageCanvases)
          && same(before.thumbs, after.thumbs)
          && same(before.thumbCanvases, after.thumbCanvases)
          && JSON.stringify(before.canvasState) === JSON.stringify(after.canvasState)
          && before.activePage === after.activePage
          && before.owner === after.owner
          && before.zoom === after.zoom
          && before.pageCount === after.pageCount
          && before.scrollTop === after.scrollTop;
      }

      const delayedA = gatedBlob(fixture.blob());
      const openA = viewer.open(delayedA.blob, options('A-stale', 1));
      await delayedA.started;
      const resultB = await viewer.open(bBlob, options('B-win', 2));
      const beforeARelease = await waitForSettledSurface(2, 2);
      delayedA.release();
      const resultA = await openA;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const afterARelease = snapshot();

      viewer.scrollToPage(1);
      thumbnailsRoot.querySelector('[data-thumbnail-action="rotate-right"]')?.click();

      window.__centralDocsViewerRace = {
        viewer,
        cBlob,
        events,
        options,
        snapshot,
        waitForSettledSurface,
        unchanged,
        slowLoadingResult: null,
        cSnapshot: null
      };

      return {
        resultA,
        resultB,
        stable: unchanged(beforeARelease, afterARelease),
        owner: afterARelease.owner,
        activePage: afterARelease.activePage,
        pageCount: afterARelease.pageCount,
        pages: afterARelease.pages.length,
        thumbnails: afterARelease.thumbs.length,
        staleEvents: events.filter((entry) => entry.startsWith('A-stale:')),
        winnerEvents: events.filter((entry) => entry.startsWith('B-win:'))
      };
    });

    await page.evaluate(() => {
      const race = window.__centralDocsViewerRace;
      race.slowLoadingResult = race.viewer
        .open('/testing/central-docs/_race-slow.pdf', race.options('B-stale', 3))
        .then((value) => ({ value }), (error) => ({ error: String(error?.message || error) }));
    });
    await slowRequestStarted;

    const cWinner = await page.evaluate(async () => {
      const race = window.__centralDocsViewerRace;
      const resultC = await race.viewer.open(race.cBlob, race.options('C-win', 1));
      race.cSnapshot = await race.waitForSettledSurface(2, 1);
      const firstCanvas = document.querySelector('.portal-pdf-page-canvas');
      return {
        resultC,
        owner: race.cSnapshot.owner,
        activePage: race.cSnapshot.activePage,
        pageCount: race.cSnapshot.pageCount,
        pages: race.cSnapshot.pages.length,
        thumbnails: race.cSnapshot.thumbs.length,
        firstCanvas: { width: firstCanvas?.width || 0, height: firstCanvas?.height || 0 }
      };
    });

    releaseSlowRequest();
    const secondRace = await page.evaluate(async () => {
      const race = window.__centralDocsViewerRace;
      const slowResult = await race.slowLoadingResult;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const afterSlowRelease = race.snapshot();
      const stable = race.unchanged(race.cSnapshot, afterSlowRelease);
      race.viewer.scrollToPage(2);
      document.querySelectorAll('[data-thumbnail-action="rotate-right"]')[1]?.click();
      return {
        slowResult,
        stable,
        owner: afterSlowRelease.owner,
        activePage: afterSlowRelease.activePage,
        pages: afterSlowRelease.pages.length,
        thumbnails: afterSlowRelease.thumbs.length,
        staleEvents: race.events.filter((entry) => entry.startsWith('B-stale:')),
        winnerEvents: race.events.filter((entry) => entry.startsWith('C-win:'))
      };
    });

    expect(firstRace.resultA).toBeNull();
    expect(firstRace.resultB?.pageCount).toBe(2);
    expect(firstRace.stable).toBe(true);
    expect(firstRace.owner).toBe('B-win');
    expect(firstRace.activePage).toBe('2');
    expect(firstRace.pageCount).toBe('2 página(s)');
    expect(firstRace.pages).toBe(2);
    expect(firstRace.thumbnails).toBe(2);
    expect(firstRace.staleEvents).toEqual([]);
    expect(firstRace.winnerEvents).toEqual(expect.arrayContaining([
      'B-win:ready:2',
      'B-win:page:2',
      'B-win:page:1',
      'B-win:action:rotate-right:0'
    ]));

    expect(cWinner.resultC?.pageCount).toBe(2);
    expect(cWinner.owner).toBe('C-win');
    expect(cWinner.activePage).toBe('1');
    expect(cWinner.pageCount).toBe('2 página(s)');
    expect(cWinner.pages).toBe(2);
    expect(cWinner.thumbnails).toBe(2);
    expect(cWinner.firstCanvas.height).toBeGreaterThan(cWinner.firstCanvas.width);

    expect(secondRace.slowResult).toEqual({ value: null });
    expect(secondRace.stable).toBe(true);
    expect(secondRace.owner).toBe('C-win');
    expect(secondRace.activePage).toBe('1');
    expect(secondRace.pages).toBe(2);
    expect(secondRace.thumbnails).toBe(2);
    expect(secondRace.staleEvents).toEqual([]);
    expect(secondRace.winnerEvents).toEqual(expect.arrayContaining([
      'C-win:ready:2',
      'C-win:page:1',
      'C-win:page:2',
      'C-win:action:rotate-right:1'
    ]));

    await expect(page.locator('iframe, embed, object')).toHaveCount(0);
    expect(forbiddenRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
