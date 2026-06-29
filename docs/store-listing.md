# FreshTab — Store Listing Copy

Reusable copy for the three store submissions. FreshTab collects **no data**,
makes **no network calls** for core widgets, and requests **only** the
`storage` permission. Keep every privacy answer consistent with that.

---

## Name
FreshTab — New Tab Dashboard

## Short summary (≤ 132 chars, Chrome/Edge "summary")
A fast, private new-tab dashboard: clock, greeting, todos, quick links, and a
daily focus quote. Local-only, zero tracking.

## Tagline (Edge "short description")
Replace your new tab with a clean personal dashboard — offline, private, yours.

---

## Detailed description (long)

FreshTab turns every new tab into a calm, useful dashboard instead of a blank
page or an ad-filled feed.

**What you get**
- ⏰ Live clock and date
- 👋 Time-aware greeting with an editable name
- ✅ A persistent to-do list — add, complete, delete, all by keyboard
- 🔗 A quick-links grid with favicons
- 💬 A daily focus quote that changes once per day
- 🎨 Light / dark / system theme and per-widget on/off toggles

**Private by design**
- Requests only the `storage` permission — no browsing history, no host access.
- 100% offline: your data never leaves your machine. No accounts, no telemetry,
  no network calls for any core widget.
- Open source and reproducible build.

**Fast**
- Renders instantly with no network on the critical path.
- Tiny footprint (~240 KB), built with WXT + React + TypeScript.

Open a new tab and make it yours.

---

## Category
Productivity

## Privacy / data-use answers (use verbatim where the form allows)

- **Does this extension collect user data?** No.
- **Data sold to third parties?** No.
- **Data used/transferred for purposes unrelated to core functionality?** No.
- **Data used to determine creditworthiness / lending?** No.

### Single purpose (Chrome requires one)
FreshTab replaces the browser's new-tab page with a local, customizable
dashboard (clock, greeting, to-dos, quick links, daily quote).

### Permission justification — `storage`
Used solely to save your dashboard locally: display name, theme, widget
toggles, to-dos, and quick links. Data is stored with `browser.storage.local`
on your device and is never transmitted.

### Note on favicons (disclose if asked about remote requests)
Quick-link favicons are fetched as images from Google's public favicon service
based on the link's domain. They are a cosmetic enhancement only: if offline or
blocked, each link degrades to a letter avatar. No personal data is sent — only
the domain you chose to add as a link.

---

## Per-store submission notes

### Microsoft Edge Add-ons (free)
- Upload: `.output/fresh-tab-0.1.0-chrome.zip` (Chromium MV3).
- Declare: stores data locally, no collection.

### Firefox Add-ons / AMO (free)
- Upload: `.output/fresh-tab-0.1.0-firefox.zip`.
- Source code: upload `.output/fresh-tab-0.1.0-sources.zip`.
  Build instructions for reviewers: `npm install && npm run build:firefox`
  (output in `.output/firefox-mv2/`).
- Data collection: select "No data collected".

### Chrome Web Store ($5 one-time)
- Upload: `.output/fresh-tab-0.1.0-chrome.zip`.
- Fill Privacy practices tab with the answers above; justify `storage`.

## Store assets checklist
- [x] Icons 16 / 32 / 48 / 96 / 128 px — branded clock mark in `public/icon/`
- [x] Screenshots (1280×800) — `docs/screenshots/1-dashboard-light.png`,
      `2-dashboard-dark.png`, `3-settings.png`
- [x] Short + long description (above)
- [x] Privacy disclosure (above)
