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
- **Current version: `v1.0.5`.** (The v1.0.4-diag on-screen logger is still
  present — tap the version number; key `ding_diag` in localStorage. Adds an
  `ev:"bell"` record when the bell fires.)
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

Corrected root cause (v1.0.4-diag logs): the MediaSession card and audio focus
are NOT lost in the background — the card persists past 60s / 5min while locked.
The real problem is that Chrome on Android suspends an `<audio>` element's
**decode/playback at the ~60s background cap**: a long, mostly-silent blob's
`currentTime` advances, then freezes at ~62s with `paused:true`, so it never
reaches a bell baked in later. (The earlier "silence loses audio focus"
hypothesis was wrong.)

Fix (v1.0.5):
- **Looping sub-perceptual carrier.** Play a short (~4s) looping WAV of ±1 LSB
  dither (~-90 dBFS, inaudible) with `loop=true` from Start. Because the
  element always outputs nonzero frames, Chrome does not suspend its decode at
  the 60s cap. The carrier is NOT the bell and NOT the timing source.
- **Wall-clock-scheduled bell.** `bellTargetMs = Date.now() + remaining*1000`.
  The bell fires from the target, not from a playhead: a Web Audio
  `AudioBufferSourceNode.start(when)` (rings on time if the context survives)
  with a silent "marker" node to detect it fired, plus an element `play()`
  fallback (`fireBellViaElement`, reuses the carrier element) triggered by the
  countdown tick and a `setTimeout` backup. A `bellFired` guard + `BELL_GRACE`
  (600ms head start for the Web Audio path) ensure it rings exactly once.
- **MediaSession kept fresh.** metadata + action handlers are set BEFORE the
  first `play()`; `setPositionState` is updated every tick.

The AudioContext is also used to decode tones and for immediate foreground
sounds (start bell + cycle previews). Aggressive battery-saver/Doze can still
delay playback — disclosed in the info tooltip. The `ev:"bell"` diag record logs
when/how the bell actually fired.

## Verifying changes

No test suite. Verify with:
- `node --check` on the extracted `<script>` and on `sw.js`; JSON-parse the
  manifest.
- Headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (Playwright is installed globally) — serve over `python3 -m http.server` so
  the service worker, audio, and relative paths behave like production.
