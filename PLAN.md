# FreshTab — Phase-Wise Implementation Plan

A new-tab dashboard browser extension. Built with **WXT + TypeScript + React**, MV3, cross-browser. This plan sequences the build so each phase adds exactly one new concept and ends in a runnable state. Grounding/context: see `CONTEXT.md`.

**Guiding rule (from the master project list):** every phase has a measurable exit criterion. If a phase can't state a number or a checkable outcome, it isn't done.

---

## Phase 0 — Scaffold & Toolchain *(≈ half day)*
**Goal:** a blank extension that loads and shows "Hello FreshTab" on every new tab.

Steps:
1. `npm create wxt@latest fresh-tab` → choose the **React + TypeScript** template (run inside `experiments/`, or scaffold in place).
2. Add the new-tab entrypoint: `entrypoints/newtab/` (`index.html`, `main.tsx`, `App.tsx`).
3. In `wxt.config.ts`, set manifest: name, version `0.1.0`, permissions `["storage"]`, and the new-tab override is handled by WXT's `newtab` entrypoint automatically.
4. Add Tailwind (or commit to CSS modules). Wire ESLint + Prettier + strict `tsconfig`.
5. `wxt dev` → confirm auto-reload; load unpacked from `.output/chrome-mv3`.

**Exit:** opening a new tab in Chrome shows the React app; editing a file hot-reloads the tab. Bundle builds with 0 type errors.

---

## Phase 1 — Storage Layer (TDD first) *(≈ half day)*
**Goal:** a typed, tested persistence module before any UI depends on it.

Steps:
1. Define types in `lib/types.ts` (`Settings`, `Todo`, `QuickLink`).
2. Write **failing tests** for `lib/storage.ts` (mock `browser.storage.local`): get returns defaults when empty; set→get round-trips; bad data falls back to defaults.
3. Implement `lib/storage.ts` over `wxt/storage` to pass tests.
4. Add `lib/sanitize-url.ts` + tests: allow only `http:`/`https:`, reject `javascript:`/`data:`.

**Exit:** `vitest run` green; 80%+ coverage on `lib/`. No UI yet.

---

## Phase 2 — Static Layout & Clock *(≈ 1 day)*
**Goal:** the visual shell with the first live widget.

Steps:
1. Build `App.tsx` layout: centered column, responsive, theme-aware container.
2. `widgets/Clock.tsx`: single `setInterval`, cleaned up on unmount; no layout shift (fixed-width digits).
3. `widgets/Greeting.tsx`: time-aware text, reads `displayName` from settings (hardcode default for now).
4. Apply theme tokens (light/dark) via CSS variables or Tailwind `dark:`.

**Exit:** new tab shows clock ticking + greeting; FCP < 100 ms (DevTools Performance); no console errors; interval cleared on navigation.

---

## Phase 3 — Todos Widget *(≈ 1–1.5 days)*
**Goal:** first stateful, persisted widget.

Steps:
1. `widgets/Todos.tsx` + a `useReducer` (`add`/`toggle`/`delete`/`reorder`).
2. Load todos on mount from storage; write back debounced (150–300 ms).
3. Keyboard-first: Enter adds, Space toggles, Delete removes; visible focus rings.
4. Tests: reducer transitions; component add/toggle/delete via Testing Library roles.

**Exit:** add/complete/delete works; todos survive a full browser restart; reducer tests green.

---

## Phase 4 — Quick Links Widget *(≈ 1 day)*
**Goal:** add/edit/remove labelled links with favicons.

Steps:
1. `widgets/QuickLinks.tsx`: grid of links; add/edit modal.
2. Run every URL through `sanitize-url` before save and before render.
3. Favicon via `https://www.google.com/s2/favicons?domain=` OR the site's own — pick one; degrade to a letter-avatar on load error.
4. Persist to storage; tests for sanitizer rejection paths.

**Exit:** links persist; a `javascript:` URL is rejected with a visible error; broken favicon falls back gracefully.

---

## Phase 5 — Quote + Settings Panel *(≈ 1 day)*
**Goal:** finish the feature set + make it customizable.

Steps:
1. `widgets/Quote.tsx`: deterministic quote-of-day from a local seed list (`index = dayOfYear % quotes.length`) + test.
2. `Settings.tsx`: edit display name, theme (light/dark/system), toggle each widget on/off.
3. Wire all widgets to read their on/off flag + theme from settings.

**Exit:** toggling a widget hides it and persists; theme=system follows OS; quote stable within a day, changes next day.

---

## Phase 6 — Polish, A11y & Test Gate *(≈ 1 day)*
**Goal:** production-grade quality bar.

Steps:
1. Error boundary around the React root.
2. Keyboard-only pass: every control reachable + operable; AA contrast check.
3. Empty states + loading flash prevention (read storage before first paint where possible).
4. Raise coverage to target; `tsc --noEmit` clean; ESLint clean.

**Exit:** keyboard-only operation complete; coverage ≥ 80% on logic; 0 type/lint errors.

---

## Phase 7 — Cross-Browser Build & Package *(≈ half day)*
**Goal:** shippable artifacts for all three stores.

Steps:
1. `wxt build` (Chrome/Edge — same Chromium MV3 output) and `wxt build -b firefox`.
2. `wxt zip` and `wxt zip -b firefox` → store-ready zips in `.output/`.
3. Smoke test: load each unpacked build; verify storage + render in Chrome, Edge, Firefox.

**Exit:** three zips produced; all load with no console errors.

---

## Phase 8 — Deploy *(time = store review queues)*
**Goal:** publicly installable.

Order (cheap first):
1. **Edge Add-ons** (free) — submit Chromium zip.
2. **Firefox AMO** (free) — submit Firefox zip + source (Mozilla reviews source; keep build reproducible).
3. **Chrome Web Store** ($5 one-time, ~₹425) — when reach matters.

See `README.md` → *Deployment* for the exact click-path per store.

**Exit:** at least one public store listing live; install link works from a fresh profile.

---

## Timeline Summary
| Phase | Focus | Est. |
|-------|-------|------|
| 0 | Scaffold | 0.5 d |
| 1 | Storage (TDD) | 0.5 d |
| 2 | Layout + Clock | 1 d |
| 3 | Todos | 1–1.5 d |
| 4 | Quick Links | 1 d |
| 5 | Quote + Settings | 1 d |
| 6 | Polish + a11y | 1 d |
| 7 | Cross-browser build | 0.5 d |
| 8 | Deploy | review-bound |

**Total active build: ~6–7 days.** MVP (Phases 0–3) is demoable in ~3 days.

## Definition of Done (whole project)
- New tab renders dashboard, FCP < 100 ms, fully offline.
- Todos/links/name/theme persist across restart.
- Builds + zips for Chrome, Edge, Firefox with no console errors.
- 80%+ test coverage on logic; strict types; no lint errors.
- At least one public store listing live.
