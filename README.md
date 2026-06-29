# 🧩 FreshTab

A fast, customizable **new-tab dashboard** browser extension — replaces your browser's default new-tab page with a clean personal dashboard (live clock, greeting, todos, quick links, daily focus quote). **Manifest V3**, cross-browser (Chrome · Edge · Firefox), zero host permissions, works 100% offline.

> Built with **WXT + TypeScript + React**. This README covers everything from cloning to deploying on every store.

---

## ✨ Features
- ⏰ Live clock + date
- 👋 Time-aware greeting with editable name
- ✅ Persistent todo list (add / complete / delete / reorder)
- 🔗 Quick-links grid with favicons
- 💬 Deterministic daily focus quote
- 🎨 Light / dark / system theme + per-widget toggles
- 🔒 Only the `storage` permission — no scary install warning

---

## 🧠 How a new-tab extension works
An extension is **three isolated JS worlds** wired by message-passing. FreshTab uses only one:
- **New-tab page** — the whole React app; mounts where the browser's new tab used to be.
- *(Background service worker & content scripts — unused in v1.)*

The magic is one manifest line — `chrome_url_overrides.newtab` — which WXT generates for you from the `entrypoints/newtab/` folder. State lives in `browser.storage.local` so it survives the service worker sleeping.

---

## 🛠️ Tech Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **WXT** | File-based entrypoints, auto-reload, one codebase → all browsers |
| Language | **TypeScript** (strict) | Catches `browser.*` API mistakes before runtime |
| UI | **React 18** | Familiar component model for the dashboard |
| Styling | **Tailwind CSS** | Fast, consistent styling |
| Storage | `wxt/storage` over `browser.storage.local` | Persistent, MV3-safe |
| Cross-browser | `browser.*` namespace | Promise-based; works on Chrome via polyfill |
| Tests | **Vitest + Testing Library** | Unit + component coverage |

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js ≥ 18
- npm (or pnpm/yarn)
- Chrome, Edge, or Firefox

### Install & run
```bash
git clone <this-repo-url>
cd fresh-tab
npm install
npm run dev          # WXT dev server + auto-reload (Chrome)
npm run dev:firefox  # Firefox dev
```

### Load the extension manually (if needed)
**Chrome / Edge**
1. Go to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** → select `.output/chrome-mv3/`.
4. Open a new tab — FreshTab appears.

**Firefox**
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** → select any file in `.output/firefox-mv2/` (e.g. `manifest.json`).
3. Open a new tab.

> Unpacked extensions show a "developer mode" nag and don't auto-update — fine for dev/personal use, use the stores for real distribution.

---

## 📂 Project Structure
```
fresh-tab/
├── entrypoints/
│   └── newtab/          # the dashboard app (index.html, main.tsx, App.tsx)
├── components/          # shared UI
├── widgets/             # Clock, Greeting, Todos, QuickLinks, Quote, Settings
├── lib/                 # storage.ts, types.ts, sanitize-url.ts, quote-of-day.ts
├── public/              # icons
├── wxt.config.ts        # manifest + build config
├── CONTEXT.md           # AI grounding (Prompt Context template)
├── PLAN.md              # phase-wise build plan
└── README.md
```

---

## 🧪 Testing
```bash
npm run test           # vitest watch
npm run test -- --run  # single run
npm run test -- --coverage
npm run compile        # tsc --noEmit (type gate)
```
Target: **80%+ coverage** on `lib/` and widget logic. Test files mirror source paths.

---

## 📦 Building for Production
```bash
npm run build           # Chrome/Edge (Chromium MV3) → .output/chrome-mv3/
npm run build:firefox   # Firefox → .output/firefox-mv2/
npm run zip             # store-ready zip (Chromium)
npm run zip:firefox     # store-ready zip (Firefox)
```
Edge uses the **same Chromium build** as Chrome — no separate build needed.

---

## 🌐 Deployment — step by step

Deploy cheapest-first. **Edge + Firefox are free; Chrome is a one-time $5 (~₹425), no recurring fee.**

### 1. Microsoft Edge Add-ons — FREE
1. Create a dev account at **partner.microsoft.com/dashboard/microsoftedge**.
2. **Submit new extension** → upload `chrome-mv3` zip.
3. Fill listing: name, description, screenshots, category, privacy (declare: stores data locally, no collection).
4. Submit → review (usually hours–days) → published.

### 2. Firefox Add-ons (AMO) — FREE
1. Sign in at **addons.mozilla.org/developers/**.
2. **Submit a New Add-on** → upload the Firefox zip.
3. Mozilla reviews **source code** — if the bundle is minified, upload source + build instructions (`npm install && npm run build:firefox`). Keep the build reproducible.
4. Submit → review → published; you get an `addons.mozilla.org` install link.

### 3. Chrome Web Store — $5 ONE-TIME
1. Register at **chrome.google.com/webstore/devconsole** and pay the **one-time $5** registration fee (lifetime, unlimited extensions).
2. **Add new item** → upload `chrome-mv3` zip.
3. Fill listing + privacy practices (declare local storage, no data collection, justify the `storage` permission).
4. Submit → review → published.

### Store assets checklist
- [ ] Icon set (16/32/48/128 px)
- [ ] At least 1–3 screenshots (1280×800 or 640×400)
- [ ] Short + long description
- [ ] Privacy disclosure (FreshTab: local-only, no collection)
- [ ] Justification for `storage` permission

---

## 🔐 Security & Privacy
- Requests only the `storage` permission; no host permissions, no remote code.
- Quick-link URLs are sanitized (only `http`/`https`; `javascript:`/`data:` rejected).
- No telemetry, no network calls, no accounts. All data stays on your machine.

---

## 🗺️ Roadmap
See **PLAN.md** for the full phase-wise build (Phase 0 scaffold → Phase 8 deploy). v1 is intentionally offline-only; cloud sync, weather, and a background worker are out of scope for v1.

---

## 📄 License
MIT — see [LICENSE](./LICENSE).
