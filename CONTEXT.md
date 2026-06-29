# FreshTab — Project Context

> Follows the **Prompt Context template** (Notion). Feed this whole file to an AI agent as grounding before any implementation work.

PROJECT:
A new-tab dashboard browser extension. Overrides the browser's default new-tab page with a fast, customizable personal dashboard (clock, greeting, todo list, quick links, focus quote). Manifest V3. Cross-browser (Chrome, Edge, Firefox) from one codebase.

USERS:
- Primary: the builder (daily dogfood — replaces the new tab seen on every Ctrl+T).
- Secondary: anyone wanting a clean, zero-permission new-tab page they can install from a store.

FUNCTIONAL REQUIREMENTS:
- Override the new-tab page (`chrome_url_overrides.newtab`).
- Live clock + date, updating each second without layout shift.
- Time-aware greeting ("Good morning, <name>").
- Editable display name, persisted.
- Todo list: add, toggle complete, delete, reorder; persisted across reloads.
- Quick links grid: add/edit/remove labelled links with favicons.
- Rotating focus quote (local seed list, deterministic per day).
- Settings panel: theme (light/dark/system), toggle each widget on/off.
- All state persists locally and survives the service-worker sleeping.

NON-FUNCTIONAL REQUIREMENTS:
- First contentful paint < 100 ms on a mid-range laptop (no network on load).
- Zero host permissions; only `storage`.
- Bundle (uncompressed) < 300 KB.
- Works offline 100% — no runtime network dependency for core widgets.
- Accessible: keyboard-operable, visible focus rings, WCAG AA contrast.

TECH STACK:
- Framework: WXT (extension framework, file-based entrypoints, auto-reload, multi-browser build).
- Language: TypeScript (strict).
- UI: React 18 + function components/hooks.
- Styling: Tailwind CSS (or CSS modules — single choice, no mixing).
- Storage: `wxt/storage` (wraps `browser.storage.local`).
- Cross-browser API: `browser.*` via WXT's polyfilled namespace (never raw `chrome.*`).
- Tooling: Vite (via WXT), Vitest + Testing Library, ESLint + Prettier.

ARCHITECTURE:
- Three extension worlds — for this project only ONE is used heavily:
  - **New-tab page** (`entrypoints/newtab/`): the entire app — React mounts here.
  - **Background** (service worker): minimal/none for v1 (no alarms needed).
  - **Content scripts**: none.
- State lives in `browser.storage.local`, read once on mount into React state, written on change (debounced).
- Widget-based composition: each widget is a self-contained component reading its slice of settings.

DOMAIN ENTITIES:
- `Settings { displayName, theme, widgets: { clock, greeting, todos, links, quote } }`
- `Todo { id, text, done, order, createdAt }`
- `QuickLink { id, label, url, order }`
- `Quote { text, author }` (static seed list)

DATABASE SCHEMA:
- No server DB. Local key-value in `browser.storage.local`:
  - `settings` → Settings
  - `todos` → Todo[]
  - `links` → QuickLink[]

API CONTRACTS:
- No external/network API in v1. All reads/writes go through a typed storage module (`lib/storage.ts`) exposing `getSettings/setSettings`, `getTodos/setTodos`, `getLinks/setLinks`.

CONSTRAINTS:
- Manifest V3 only (MV2 is dead in Chrome).
- No host permissions, no `<all_urls>`, no remote code — keeps store review trivial and install warning-free.
- One styling system, one state approach — no premature abstraction (extract a helper only at 3+ callers).
- Hard file-size limit 300 lines per source file.

CODING RULES:
- TypeScript strict; never `any` (use `unknown` + narrow).
- Named exports only; `const` over `let`; no `var`.
- Functional React components; hooks prefixed `use`.
- Booleans prefixed is/has/can/should.
- Files kebab-case; components PascalCase.
- No comment explaining WHAT; only WHY when non-obvious.

CURRENT IMPLEMENTATION:
- Greenfield. Repo scaffolded with WXT + React + TS. No widgets built yet. See PLAN.md for phase order.

SECURITY REQUIREMENTS:
- Request only `storage` permission.
- Sanitize quick-link URLs (allow only http/https; reject `javascript:` schemes) before render/click.
- No `dangerouslySetInnerHTML`; no eval; no inline remote scripts (MV3 CSP forbids anyway).
- No secrets in the repo.

PERFORMANCE REQUIREMENTS:
- FCP < 100 ms; no network on the critical render path.
- Storage reads batched on mount; writes debounced 150–300 ms.
- Clock uses a single interval, cleaned up on unmount.

TESTING STRATEGY:
- Vitest + Testing Library. Test file mirrors source path.
- Unit: storage module (mock `browser.storage`), todo reducer, URL sanitizer, quote-of-day selector.
- Component: render each widget, assert behavior via `getByRole`/`getByLabelText`.
- Coverage target: 80%+ on lib/ and widget logic. OS/extension-boundary code exempt.

ACCEPTANCE CRITERIA:
- Loading a new tab shows the dashboard with FCP < 100 ms.
- Todos/links/name/theme persist across browser restart.
- Builds cleanly for Chrome, Edge, and Firefox (`wxt build` + `-b firefox`).
- Lighthouse/manual a11y: keyboard-only operation works; AA contrast.
- Zip artifacts load unpacked in all three browsers with no errors in console.

OBSERVABILITY:
- Dev: WXT auto-reload + browser devtools console.
- Lightweight error boundary around the React root logging to console (no remote telemetry in v1).

DEPLOYMENT:
- Build per browser → zip → submit:
  - Edge Add-ons (free) and Firefox AMO (free) first.
  - Chrome Web Store ($5 one-time, ~₹425) when ready for reach.
- Local: `load unpacked` from `.output/<browser>-mv3` for dev + personal use.
- Full step-by-step in README.md.

OUT OF SCOPE (v1):
- Cloud sync / accounts.
- Weather / news / any networked widget.
- Background service-worker logic, alarms, notifications.
- Content scripts, options page beyond the in-page settings panel.

WHEN RESPONDING (for AI agents using this context):
- Follow the architecture above; do not introduce new technologies.
- Explain tradeoffs.
- Include tests with any logic change.
- Include migration steps when storage shape changes.
