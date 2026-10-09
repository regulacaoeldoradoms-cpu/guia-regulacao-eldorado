import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { petCatalog } from "../../worker/pet-catalog.js";
import { initialPetState, publicPetState } from "../../worker/pet-domain.js";
import { chromium } from "../browser/node_modules/playwright/index.mjs";
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
  role: "cidadao",
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
      });
      await context.addInitScript(
        ({ user }) => {
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
        { user },
      );
      await context.routeWebSocket("**/*", (socket) => socket.close());
      const calls = [],
        errors = [];
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route("**/*", async (r) => {
        const u = new URL(r.request().url());
        calls.push(u.pathname + u.search);
        if (u.hostname === "127.0.0.1") return r.continue();
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
        else if (u.pathname.includes("/feed"))
          data = {
            posts: [
              {
                id: "fixture-post",
                author: profile,
                own: true,
                body: "Publicação fictícia para conferir leitura e botões no celular.",
                audience: "friends",
                createdAt: "2026-10-09T12:00:00Z",
                counts: { comments: 0, reactions: 0 },
              },
            ],
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
      await page.waitForTimeout(300);
      if (process.env.NAV_REVIEW) {
        const mode = process.env.NAV_REVIEW;
        if (!["icons", "scroll"].includes(mode)) throw Error("Unknown nav review");
        await page.addStyleTag({ content: mode === "icons" ? `
          body.citizen-readable-layout.portal-page .social-mobile-nav{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:0!important;min-height:0!important;height:auto!important}
          body.citizen-readable-layout.portal-page .social-mobile-nav-link{min-height:52px!important;height:52px;overflow:visible;position:relative}
          .social-mobile-nav-link>span:not(.social-nav-icon):not(.social-nav-badge){position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
        ` : `
          body.citizen-readable-layout.portal-page .social-mobile-nav{display:flex!important;gap:4px!important;overflow-x:auto!important;overflow-y:hidden!important;min-height:0!important;height:auto!important}
          body.citizen-readable-layout.portal-page .social-mobile-nav-link{flex:0 0 auto!important;min-width:72px!important;min-height:62px!important;padding:6px 10px!important;white-space:nowrap!important;overflow-wrap:normal!important}
        ` });
        await page.evaluate(() => document.querySelectorAll(".social-mobile-nav-link").forEach(link => {
          const label = link.getAttribute("aria-label") || link.textContent.trim();
          link.setAttribute("aria-label", label); link.title = label;
        }));
        await page.waitForTimeout(100);
      }
      if (process.env.TEXT_SCALE === "2")
        await page.evaluate(() => {
          const elements = [...document.querySelectorAll("body *")];
          const sizes = elements.map((e) => getComputedStyle(e).fontSize);
          elements.forEach((e, i) =>
            e.style.setProperty(
              "font-size",
              parseFloat(sizes[i]) * 2 + "px",
              "important",
            ),
          );
        });
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
          viewport: innerWidth,
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
                e.getBoundingClientRect().right > innerWidth + 0.1 &&
                getComputedStyle(e).position !== "fixed",
            )
            .slice(0, 10)
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              right: Math.round(e.getBoundingClientRect().right),
            })),
          resources: performance.getEntriesByType("resource").map((e) => ({
            name: new URL(e.name).pathname,
            bytes: e.decodedBodySize,
            duration: Math.round(e.duration),
          })),
        };
      });
      results.push({
        route,
        width,
        url: page.url(),
        ...metrics,
        calls,
        errors,
      });
      if (process.env.NAV_REVIEW || process.env.REVIEW_CAPTURES) {
        await page.locator(".social-mobile-nav").screenshot({path: `/tmp/citizen-nav-${process.env.NAV_REVIEW || "two-rows"}-${width}${process.env.TEXT_SCALE === "2" ? "-text200" : ""}.png`});
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
                viewport: innerWidth,
                height: innerHeight,
                chatAboveCompanion: e.classList.contains("portal-chat-panel") && document.querySelector(".pet-stage-global")
                  ? Number(getComputedStyle(e.closest(".portal-chat")).zIndex) > Number(getComputedStyle(document.querySelector(".pet-stage-global")).zIndex)
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
