# dìng — project notes

A bare-bones, 100% offline meditation timer. Single static page (no build
step), deployed via GitHub Pages. Everything lives at the repo root:

- `index.html` — the whole app (markup, styles, logic).
- `sw.js` — service worker; precaches the shell + assets for offline use.
- `manifest.webmanifest` — PWA metadata.
- `assets/` — `logo.svg` / `logo-mark.png`, icons, and `sounds/*.mp3` bells.

## Versioning — "Little Sprout" methodology

The app carries a visible version, shown in the info tooltip at the bottom-left
(tap the ⓘ). Format is semantic-ish: **vMAJOR.MINOR.PATCH**, like a sprout
growing.

- **PATCH** (`x.x.+1`) — a fix, tweak, copy/asset change, or any small commit.
  Bump on **every** commit that isn't a feature or a major.
- **MINOR** (`x.+1.0`) — a new user-facing feature.
- **MAJOR** (`+1.0.0`) — a milestone / large rework.

Rules:
- **Bump the version on every commit** (at minimum the patch).
- **Current version: `v1.0.4-diag`.** (diagnostic build — on-screen log of the
  timer media element's `currentTime`/`paused`/visibility per tick, behind a tap
  on the version number; key `ding_diag` in localStorage.)
- The version string is the source of truth in two places — keep them in sync
  when bumping:
  1. `index.html` → the `<span class="ver">` inside the info tooltip.
  2. This file (the "Current version" line above).
- Independently, bump the `CACHE` constant in `sw.js` (e.g. `ding-vN`) whenever
  shipped files change, so installed PWAs pull the update. This is separate
  from the app version.

## Service worker cache

`sw.js` uses a cache-first strategy keyed by the `CACHE` name. Existing installs
keep serving the old shell until `CACHE` changes — always bump it when any
cached file changes.

## Reliability note (background audio)

At start, the app generates a single WAV in memory — `remaining` seconds of
silence followed by the selected bell — and plays it through an `<audio>`
element. Chrome keeps an actively-playing media element running through screen
lock and tab-switches, so the bell rings on time with no JS or AudioContext
needed at the moment it fires (those get frozen/suspended in the background).
The WAV sample rate is lowered for longer sits to bound memory (~50 MB). The
AudioContext is used only to decode tones and for immediate foreground sounds
(start bell + cycle previews). Aggressive battery-saver/Doze can still delay
playback — this limitation is disclosed in the info tooltip.

## Verifying changes

No test suite. Verify with:
- `node --check` on the extracted `<script>` and on `sw.js`; JSON-parse the
  manifest.
- Headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (Playwright is installed globally) — serve over `python3 -m http.server` so
  the service worker, audio, and relative paths behave like production.
