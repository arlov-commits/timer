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
- **Current version: `v1.0.6`.** (The v1.0.4-diag on-screen logger is still
  present — tap the version number; key `ding_diag` in localStorage. `ev:"bell"`
  records when the buffer playhead reaches the bell offset.)
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

Root cause is **two-part**, both proven by the v1.0.4/v1.0.5 diagnostic logs:

(a) **Element decode is suspended at the ~60s background cap.** A long,
mostly-silent media blob's `currentTime` advances, then freezes at ~62s
(`paused:true`) — it never reaches a bell baked in later. The MediaSession card
and audio focus are NOT lost (the card persists past 5min locked); the earlier
"silence loses audio focus" hypothesis was wrong. **Fix:** continuous
sub-perceptual dither (±1 LSB, ~-90 dBFS, inaudible) keeps the stream's decode
alive indefinitely in the background. (v1.0.5 proved the dithered carrier loops
0→4→0→4 forever while backgrounded.)

(b) **JS-based bell triggers are throttled/suspended in the background.**
Android throttles `setInterval`/`setTimeout` to ~1s and then drops them when
backgrounded, so any "fire the bell from a tick / wall-clock check / tick-kicked
Web Audio schedule" approach never runs (v1.0.5 produced no `ev:"bell"` while
locked). **Fix:** bake the bell into the continuously-playing audio so NO
trigger code runs at fire time.

Architecture (v1.0.6):
- At Start, build ONE Web Audio `AudioBuffer` = sub-perceptual dither for the
  whole remaining duration, with the real bell samples written at offset
  `floor(remaining*rate)` (`bellOffsetsSec = [remaining]` — an array so
  interval-bells are a one-line change later). Play it with a single
  `AudioBufferSourceNode.start(0)`. The bell sounds when the playhead reaches
  the offset, on the audio thread, with zero main-thread JS.
- Route the source through `MediaStreamDestination` → an `<audio>` sink — the
  media playback that survives lock/tab-switch and keeps the decode alive.
- Keep the context alive: `audioCtx.resume()` on every tick + visibilitychange;
  MediaSession metadata/handlers set before playback, `playbackState="playing"`,
  `setPositionState` refreshed each tick.
- Memory: `AudioBuffer` is Float32 (4 B/sample). `pickRate()` lowers the rate
  for long sits (60min → 6000Hz ≈ 87MB) to stay under ~90MB. Dither has no
  frequency content to preserve; the bell shares the rate (warmer on long sits).
- No JS trigger remains: the old `setInterval`/`bellTargetMs` firing is deleted.
  `finish()` is UI-only (it rings via the immediate path only if the background
  buffer never armed — guarded so it can't double-ring).

ctx.destination is used directly only for immediate foreground sounds (start
bell + cycle previews) and decoding. The `ev:"bell"` diag record (from a silent
marker node at the offset) is observation only — the bell sounding does NOT
depend on it. Aggressive battery-saver/Doze can still delay playback if it
suspends the context outright; disclosed in the info tooltip.

## Verifying changes

No test suite. Verify with:
- `node --check` on the extracted `<script>` and on `sw.js`; JSON-parse the
  manifest.
- Headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (Playwright is installed globally) — serve over `python3 -m http.server` so
  the service worker, audio, and relative paths behave like production.
