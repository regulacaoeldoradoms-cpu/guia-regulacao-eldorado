import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { petCatalog } from "../../worker/pet-catalog.js";
import { initialPetState, publicPetState } from "../../worker/pet-domain.js";
import { verifyHomeCarousel } from "./home-carousel.mjs";
import { applyTextScale } from "./text-scale.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_PATH
  ? pathToFileURL(path.resolve(process.env.PLAYWRIGHT_PATH)).href
  : "../browser/node_modules/playwright/index.mjs");
const root =
  process.env.PORTAL_ROOT || path.resolve(import.meta.dirname, "../..");
const port = Number(process.env.AUDIT_PORT || 4179);
const output = process.argv[2] || "/tmp/citizen-layout-before.json";
const routes = process.env.ROUTES
  ? process.env.ROUTES.split(",")
  : [
      "/",
      "/cidadao/",
      "/perfil/",
      "/amigos/",
      "/notificacoes/",
      "/configuracoes/",
      "/seguranca/",
      "/conquistas/",
      "/ferramentas/",
      "/mascotes/",
    ];
const user = {
  id: "synthetic-citizen",
  username: "fixture.citizen",
  name: "Cidadão fictício",
  role: process.env.AUDIT_ROLE || "cidadao",
  active: true,
  emailVerified: true,
  accountLevel: "prata",
  documentCapabilities: { view: false, manage: false },
};
const pet = initialPetState();
pet.pet = { typeId: "cat", variant: "gray" };
pet.petRevision = 1;
pet.inventory = { "bed-cloud": 1 };
pet.preferences.motionEnabled = false;
const petState = publicPetState(pet, 120, 1, 1791540000);
const manifestation = {
  protocol: "FIXTURE-2026-001",
  subject: "Sugestão fictícia de melhoria do espaço de espera",
  description:
    "Texto sintético para testar leitura, histórico e formulário de resposta, sem dados pessoais.",
  type: "sugestao",
  status: "recebida",
  privacyMode: "sigilosa",
  createdAt: "2026-10-09T12:00:00Z",
};
const profile = {
  name: user.name,
  handle: user.username,
  isSelf: true,
  avatarAvailable: false,
  defaultPostAudience: "friends",
  bio: "Perfil inteiramente fictício",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let p = url.pathname;
    if (p.endsWith("/")) p += "index.html";
    if (
      !routes.includes(url.pathname) &&
      !/^\/(js|css|assets|vendor)\//.test(p) &&
      !/^\/[^/]+\.webmanifest$/.test(p)
    )
      throw Error("denied");
    const file = await fs.realpath(path.resolve(root, "." + p));
    if (!file.startsWith(root + "/")) throw Error("denied");
    const body = await fs.readFile(file);
    const type =
      {
        ".js": "text/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
      }[path.extname(file)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(port, "127.0.0.1", r));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  ignoreDefaultArgs: process.env.SCROLLBAR_FIXTURE ? ["--hide-scrollbars"] : undefined,
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const width of (process.env.WIDTHS || "320,360,390,412,844,1440")
    .split(",")
    .map(Number))
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width, height: width === 844 ? 390 : 900 },
        serviceWorkers: "block",
        ...(process.env.HOME_CAROUSEL ? { hasTouch: true, screen: { width, height: 900 }, reducedMotion: 'reduce', userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36' } : {}),
      });
      await context.addInitScript(
        ({ user, theme }) => {
          if (theme) localStorage.setItem("regulacao.portal.theme.active.v1", theme);
          sessionStorage.setItem("regulacao.portal.session", "synthetic-token");
          sessionStorage.setItem("regulacao.portal.user", JSON.stringify(user));
          sessionStorage.setItem(
            "regulacao.portal.user.validatedAt",
            String(Date.now()),
          );
          delete window.PushManager;
          // Keep the notification prompt visible in both system and CI Chromium.
          if (window.Notification) {
            Object.defineProperty(window.Notification, "permission", { get: () => "default" });
            window.Notification.requestPermission = async () => "default";
          }
        },
        { user, theme: process.env.AUDIT_THEME },
      );
      await context.routeWebSocket("**/*", (socket) => socket.close());
      const calls = [],
        errors = [];
      const cachedNavigationLoads = [];
      const legacyNavigationVersion = "20260928-2";
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route("**/*", async (r) => {
        const u = new URL(r.request().url());
        calls.push(u.pathname + u.search);
        if (u.hostname === "127.0.0.1") {
          // Match the original version key, as portal-sw cache.match(request)
          // does. A bumped URL must load current source, not the legacy payload.
          if (process.env.CACHED_NAV_PATH && u.pathname === "/js/social-navigation.js" && u.searchParams.get("v") === legacyNavigationVersion) {
            cachedNavigationLoads.push(u.pathname + u.search);
            return r.fulfill({contentType:"text/javascript",body:await fs.readFile(process.env.CACHED_NAV_PATH,"utf8")});
          }
          return r.continue();
        }
        let data = { ok: true };
        if (u.pathname === "/api/auth/me") data = { user };
        else if (u.pathname === "/api/social/config")
          data = {
            backendEnabled: true,
            homeEnabled: true,
            available: true,
            profile,
          };
        else if (u.pathname === "/api/social/me") data = { profile };
        else if (u.pathname === '/api/social/posts' && r.request().method() === 'POST') {
          const payload = r.request().postDataJSON();
          data = {post: {id: 'fixture-created', author: profile, own: true, body: payload.body, audience: payload.audience, createdAt: '2026-10-10T01:00:00Z', counts: {comments:0,reactions:0}}};
        }
        else if (u.pathname.includes("/feed"))
          data = {
            posts: Array.from({ length: process.env.HOME_CAROUSEL ? 40 : 1 }, (_, index) => (
              {
                id: `fixture-post-${index}`,
                author: profile,
                own: true,
                body: "Publicação fictícia para conferir leitura e botões no celular.",
                audience: "friends",
                createdAt: "2026-10-09T12:00:00Z",
                counts: { comments: 0, reactions: 0 },
              }
            )),
            nextCursor: "",
          };
        else if (u.pathname.includes("/notifications"))
          data = { notifications: [], unreadCount: 0 };
        else if (u.pathname.includes("/relationships"))
          data = { profiles: [], nextCursor: "" };
        else if (u.pathname === "/api/chat/contacts") data = { contacts: [] };
        else if (u.pathname === "/api/auth/security")
          data = {
            security: {
              emailVerified: true,
              email: "fixture@example.invalid",
              privacyMode: "anonima",
            },
          };
        else if (u.pathname === "/api/council/my")
          data = {
            manifestations: process.env.DETAIL_FIXTURE ? [manifestation] : [],
          };
        else if (u.pathname === "/api/council/manifestations/FIXTURE-2026-001")
          data = { manifestation, messages: [], events: [], attachments: [] };
        else if (u.pathname === "/api/citizen/identity")
          data = { identity: {} };
        else if (u.pathname === "/api/pets/me") data = { state: petState };
        else if (u.pathname === "/api/pets/catalog") data = petCatalog();
        else if (u.pathname === "/api/pets/achievements")
          data = { achievements: [] };
        return r.fulfill({
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      });
      await page.goto(`http://127.0.0.1:${port}` + route);
      if (route === '/') {
        await page.waitForFunction(() => Boolean(window.PortalHomeReady));
        await page.evaluate(() => window.PortalHomeReady);
      }
      await page.waitForTimeout(300);
      if (process.env.NAV_REVIEW) {
        const mode = process.env.NAV_REVIEW;
        if (!["icons", "scroll", "compact"].includes(mode)) throw Error("Unknown nav review");
        await page.addStyleTag({ content: mode === "icons" ? `
          body.citizen-readable-layout.portal-page .social-mobile-nav{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:0!important;min-height:0!important;height:auto!important}
          body.citizen-readable-layout.portal-page .social-mobile-nav-link{min-height:52px!important;height:52px;overflow:visible;position:relative}
          .social-mobile-nav-link>span:not(.social-nav-icon):not(.social-nav-badge){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
        ` : mode === "compact" ? `
          body.citizen-readable-layout.portal-page .social-mobile-nav{grid-template-columns:repeat(3,minmax(44px,max-content)) repeat(3,minmax(44px,1fr))!important;gap:0!important;padding-left:2px!important;padding-right:2px!important;min-height:0!important;height:auto!important}
          body.citizen-readable-layout.portal-page .social-mobile-nav-link{min-height:52px!important;padding:6px 0!important;font-size:14px!important;font-weight:500!important;white-space:nowrap!important;overflow-wrap:normal!important}
        ` : `
          body.citizen-readable-layout.portal-page .social-mobile-nav{display:flex!important;flex-wrap:nowrap!important;gap:4px!important;overflow-x:auto!important;overflow-y:hidden!important;min-height:0!important;height:auto!important}
          body.citizen-readable-layout.portal-page .social-mobile-nav .social-mobile-nav-link{flex:0 0 auto!important;min-width:72px!important;min-height:62px!important;padding:6px 10px!important;font-size:16px!important;white-space:nowrap!important;overflow-wrap:normal!important}
        ` });
        await page.evaluate(() => document.querySelectorAll(".social-mobile-nav-link").forEach(link => {
          const label = link.getAttribute("aria-label") || link.querySelector(":scope > span:not(.social-nav-icon):not(.social-nav-badge)")?.textContent.trim() || link.textContent.trim();
          link.setAttribute("aria-label", label); link.title = label;
        }));
        await page.waitForTimeout(100);
        if (mode === "compact") {
          const bad = await page.evaluate(() => [...document.querySelectorAll(".social-mobile-nav-link")].map(link => {
            const target=link.getBoundingClientRect();
            const label=link.querySelector(":scope > span:not(.social-nav-icon):not(.social-nav-badge)")?.getBoundingClientRect();
            return {name:link.getAttribute('aria-label'), target:target.toJSON(), label:label?.toJSON(), fits: target.width>=43.99 && target.height>=44 && target.left>=0 && target.right<=innerWidth && (!label || (label.left>=target.left-1 && label.right<=target.right+1))};
          }).filter(item=>!item.fits));
          if (bad.length) throw Error("Compact navigation label or touch target does not fit: "+JSON.stringify(bad));
        }
      }
      await applyTextScale(page);
      await page.waitForTimeout(100); // Allow ResizeObserver to settle after text scaling.
      const metrics = await page.evaluate(() => {
        const visible = [...document.querySelectorAll("body *")].filter((e) => {
          const r = e.getBoundingClientRect(),
            s = getComputedStyle(e);
          return (
            r.width &&
            r.height &&
            s.visibility !== "hidden" &&
            s.display !== "none"
          );
        });
        return {
          title: document.title,
          navigation: (() => {
            const nav = document.querySelector(".social-mobile-nav");
            if (!nav || getComputedStyle(nav).display === "none") return null;
            const links = [...nav.querySelectorAll(".social-mobile-nav-link")];
            return {
              iconOnly: nav.dataset.homeIconNavigation === "true",
              position: getComputedStyle(nav).position,
              destinations: links.map(e => e.getAttribute("href") || e.id),
              accessibleNames: links.map(e => e.getAttribute("aria-label") || ""),
              labelsHidden: links.every(e => [...e.querySelectorAll(":scope > span:not(.social-nav-icon):not(.social-nav-badge):not(.portal-chat-launcher-icon):not(#portalChatUnread)")].every(label => {
                const s = getComputedStyle(label), r = label.getBoundingClientRect();
                return s.display === "none" || (r.width <= 1 && r.height <= 1 && s.overflow === "hidden");
              })),
              profileAvatar: !!links.at(-1)?.querySelector(".home-nav-profile-avatar"),
              rows: new Set(links.map(e => Math.round(e.getBoundingClientRect().top))).size,
              reflow: nav.classList.contains("citizen-nav-reflow"),
              targetsFit: links.every(e => { const r=e.getBoundingClientRect(); return r.width>=43.99 && r.height>=44 && r.left>=-1 && r.right<=document.documentElement.clientWidth+1; }),
              labelsFit: links.every(e => { const r=e.getBoundingClientRect(); const label=e.querySelector(":scope > span:not(.social-nav-icon):not(.social-nav-badge)"); if(!label)return true; const l=label.getBoundingClientRect();return l.left>=r.left-1 && l.right<=r.right+1; })
            };
          })(),
          controls: visible
            .filter((e) =>
              e.matches(
                "button,.social-mobile-nav-link,label,.social-post-body",
              ),
            )
            .map((e) => ({
              text:
                e.getAttribute("aria-label") ||
                e.textContent.trim().slice(0, 45),
              class: e.className,
              font: parseFloat(getComputedStyle(e).fontSize),
              width: Math.round(e.getBoundingClientRect().width),
              height: Math.round(e.getBoundingClientRect().height),
            })),
          geometry: [
            ".portal-topbar",
            ".portal-main",
            ".social-shell",
            ".account-section-main",
            ".pet-page",
          ]
            .map((selector) => {
              const e = document.querySelector(selector);
              if (!e) return null;
              const r = e.getBoundingClientRect();
              return {
                selector,
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
                font: getComputedStyle(e).fontSize,
              };
            })
            .filter(Boolean),
          palette: [
            "#openNewManifestation",
            '.citizen-mobile-tab[aria-selected="true"]',
            ".privacy-help-button",
          ]
            .map((selector) => {
              const e = document.querySelector(selector);
              if (!e) return null;
              const s = getComputedStyle(e);
              return {
                selector,
                color: s.color,
                background: s.backgroundColor,
              };
            })
            .filter(Boolean),
          citizenCards: window.PortalTools?.cardsFor(
            window.RegulationAuth?.getCachedUser(),
          ).map((c) => c.href),
          paw: (() => {
            const e = document.querySelector(
              '.social-mobile-nav a[href="/mascotes/"]',
            );
            return e
              ? {
                  svg: !!e.querySelector("svg"),
                  label: e.getAttribute("aria-label"),
                  text: e.textContent.trim(),
                }
              : null;
          })(),
          role: window.RegulationAuth?.getCachedUser()?.role,
          viewport: innerWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyClass: document.body.className,
          smallText: visible
            .filter(
              (e) =>
                e.childElementCount === 0 &&
                e.textContent.trim() &&
                parseFloat(getComputedStyle(e).fontSize) < 14,
            )
            .slice(0, 15)
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              text: e.textContent.trim().slice(0, 45),
              size: getComputedStyle(e).fontSize,
            })),
          smallTargets: visible
            .filter(
              (e) =>
                e.matches("button,input:not([type=hidden]),select,textarea") &&
                e.getBoundingClientRect().height < 40,
            )
            .slice(0, 15)
            .map((e) => ({
              id: e.id,
              text: e.textContent.trim().slice(0, 30),
              height: Math.round(e.getBoundingClientRect().height),
            })),
          overflow: visible
            .filter(
              (e) =>
                (e.getBoundingClientRect().right > innerWidth + 0.1 || e.scrollWidth > e.clientWidth + 2) &&
                getComputedStyle(e).position !== "fixed",
            )
            .slice(0, 10)
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              id: e.id,
              right: Math.round(e.getBoundingClientRect().right),
              width: e.getBoundingClientRect().width,
              scrollWidth: e.scrollWidth,
              clientWidth: e.clientWidth,
              whiteSpace: getComputedStyle(e).whiteSpace,
            })),
          resources: performance.getEntriesByType("resource").map((e) => ({
            name: new URL(e.name).pathname,
            bytes: e.decodedBodySize,
            duration: Math.round(e.duration),
          })),
        };
      });
      metrics.textScale = process.env.TEXT_SCALE === "2" ? 2 : 1;
      if (process.env.HOME_CAROUSEL && route === '/') {
        const captureScale = process.env.TEXT_SCALE === '2' ? '-text200' : '';
        await page.screenshot({path: `/tmp/home-carousel-${process.env.AUDIT_THEME || 'light'}-${user.role}-${width}${captureScale}.png`});
        await page.evaluate(() => window.scrollTo(0, document.querySelector('.social-composer').getBoundingClientRect().top + scrollY - 12));
        await page.screenshot({path: `/tmp/home-carousel-feed-${process.env.AUDIT_THEME || 'light'}-${user.role}-${width}${captureScale}.png`});
        await page.evaluate(() => window.scrollTo(0, 0));
        metrics.carousel = await verifyHomeCarousel(page, width);
      }
      results.push({
        route,
        width,
        url: page.url(),
        ...metrics,
        calls,
        errors,
        ...(process.env.CACHED_NAV_PATH ? {
          cachedNavigationLoads,
          legacyNavigationVersion,
          navigationScriptLoads: calls.filter(value => new URL(value, "http://localhost").pathname === "/js/social-navigation.js"),
        } : {}),
      });
      if (process.env.NAV_REVIEW || process.env.REVIEW_CAPTURES) {
        await page.locator(".social-mobile-nav").screenshot({path: `/tmp/citizen-nav-${process.env.NAV_REVIEW || "applied"}-${width}${process.env.TEXT_SCALE === "2" ? "-text200" : ""}.png`});
      }
      if ([320, 390, 1440].includes(width))
        await page.screenshot({
          path: `/tmp/citizen-${path.basename(output, ".json")}-${route === "/" ? "home" : route.split("/")[1]}-${width}.png`,
          fullPage: true,
        });
      const states = [];
      if (width <= 412 || width === 844) {
        const snapshot = async (name) =>
          states.push({
            name,
            ...(await page.evaluate(() => {
              const e = document.querySelector(
                'dialog[open],.citizen-modal[aria-hidden="false"] .citizen-modal-panel,.portal-chat-panel:not([hidden])',
              );
              if (!e) return { opened: false };
              const r = e.getBoundingClientRect();
              return {
                overflow: [...e.querySelectorAll("*")]
                  .filter((n) => {
                    const a = n.getBoundingClientRect();
                    return a.width && (a.right > r.right + 2 || n.scrollWidth > n.clientWidth + 2);
                  })
                  .slice(0, 12)
                  .map((n) => ({
                    tag: n.tagName,
                    class: n.className,
                    id: n.id,
                    width: n.getBoundingClientRect().width,
                    right: n.getBoundingClientRect().right,
                    scrollWidth: n.scrollWidth,
                    clientWidth: n.clientWidth,
                  })),
                opened: true,
                x: r.x,
                y: r.y,
                right: r.right,
                bottom: r.bottom,
                role: window.RegulationAuth?.getCachedUser()?.role,
          viewport: innerWidth,
                viewportClientWidth: document.documentElement.clientWidth,
                height: innerHeight,
                chatAboveCompanion: e.classList.contains("portal-chat-panel") && document.querySelector(".pet-stage-global")
                  ? (Number(getComputedStyle(e).zIndex) || Number(getComputedStyle(e.closest(".portal-chat")).zIndex)) > Number(getComputedStyle(document.querySelector(".pet-stage-global")).zIndex)
                    && e.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2))
                  : null,
                scrollWidth: e.scrollWidth,
                clientWidth: e.clientWidth,
              };
            })),
          });
        if (route === "/cidadao/") {
          await page.locator("#openNewManifestation").click();
          await page.waitForTimeout(300);
          await snapshot("manifestation");
          await page.screenshot({
            path: `/tmp/citizen-form-${path.basename(output, ".json")}-${width}.png`,
            fullPage: true,
          });
          if (process.env.KEYBOARD_FIXTURE) {
            await page.setViewportSize({
              width,
              height: width === 844 ? 250 : 500,
            });
            await page.locator("#manifestationDescription").focus();
            await page
              .locator("#manifestationDescription")
              .scrollIntoViewIfNeeded();
            await page.waitForTimeout(100);
            await snapshot("keyboard-height");
            results.at(-1).keyboardFocus = await page
              .locator("#manifestationDescription")
              .evaluate((e) => ({
                focused: document.activeElement === e,
                top: e.getBoundingClientRect().top,
                scrollHeight: e.scrollHeight,
              }));
            await page.setViewportSize({
              width,
              height: width === 844 ? 390 : 900,
            });
          }
          await page
            .locator('[data-close-modal="newManifestationModal"]')
            .first()
            .click();
        }
        if (route === "/cidadao/" && process.env.DETAIL_FIXTURE) {
          await page.locator('[data-protocol="FIXTURE-2026-001"]').click();
          await page.waitForTimeout(300);
          await snapshot("detail");
          await page.screenshot({
            path: `/tmp/citizen-detail-${path.basename(output, ".json")}-${width}.png`,
            fullPage: true,
          });
          await page
            .locator('[data-close-modal="manifestationDetailModal"]')
            .click();
        }
        if (route === "/perfil/") {
          await page.locator("#profilePhotoCamera").click();
          await snapshot("photo");
          await page.evaluate(() =>
            document.querySelector("dialog[open]")?.close(),
          );
        }
        if (route === "/") {
          await page.locator("#portalChatLauncher").click();
          await page.waitForTimeout(300);
          await snapshot("chat");
          if (process.env.REVIEW_CAPTURES)
            await page.screenshot({path: `/tmp/citizen-chat-review-${width}.png`});
          const notificationButton = page.locator("#portalChatEnableNotifications");
          if (await notificationButton.isVisible()) {
            await notificationButton.scrollIntoViewIfNeeded();
            states.at(-1).notificationActionReachable = await notificationButton.evaluate((button) => {
              const action = button.getBoundingClientRect();
              const panel = button.closest(".portal-chat-panel").getBoundingClientRect();
              return action.top >= panel.top && action.bottom <= panel.bottom && action.left >= panel.left && action.right <= panel.right;
            });
            if (process.env.REVIEW_CAPTURES)
              await page.screenshot({path: `/tmp/citizen-chat-review-scroll-${width}.png`});
          }
        }
        results.at(-1).states = states;
      }
      await context.close();
    }
} finally {
  await browser.close();
  server.close();
}
await fs.writeFile(output, JSON.stringify(results, null, 2));
console.log(
  JSON.stringify(
    results.map((r) => ({
      route: r.route,
      width: r.width,
      scroll: r.scrollWidth,
      small: r.smallText.length,
      targets: r.smallTargets.length,
      errors: r.errors,
    })),
    null,
    2,
  ),
);
