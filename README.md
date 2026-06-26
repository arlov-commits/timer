# dìng （定） — Meditation Timer

A **bare-bones, 100% offline** meditation timer for quick launch-and-start
sits. No accounts, no tracking, no network. Spin the wheel to set a duration
and tap start.

🧘 **[Open the app](https://arlov-commits.github.io/timer/)**

## Features

- **Rolling wheel duration** — set minutes and seconds on an iOS-style scroll
  wheel. On a phone, flick to spin; on a PC, use the mouse wheel, click-and-drag
  to spin, or click a digit above/below the centre to roll to it.
- **Set a new timer anytime** — when a sit ends or you stop, you're back on
  the wheel; just spin and start again. No reset step.
- **Named presets** — save the current length with a name, tap a chip to load
  it back, tap × to remove. A preset also remembers the **bell tone** it was
  saved with. Stored locally.
- **Selectable bell tones** — tap the bell icon (top right) to cycle through
  the meditation bells; it plays the cycled-to tone and briefly names it. The
  cycle includes a **Silent** step, which is how you mute. The chosen tone is
  used for both the start and end bells.
- **Optional start sound** — the toggle in the bottom-right corner turns the
  opening bell on or off, independently of the tone selection.
- **Mobile-first** — built for the phone: large touch targets, no text-select
  on long-press, clockwise countdown, and installable to the home screen.
- **Everything persists per device** — duration, selected tone, start-sound
  toggle, and your presets are all stored in `localStorage`.
- **Installable PWA** — add to your home screen; works with the connection
  off entirely.
- **Keyboard** — `Space` start/pause/resume, `Esc` back to the wheel.

Theme: a dark *Pali-leaf forest / ochre / midnight* palette.

## Running it

A single static page — no build step.

- **Online:** visit the GitHub Pages link above.
- **Locally:** open `index.html`, or serve the folder
  (`python3 -m http.server`) so the service worker can register.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app — markup, styles, and logic. |
| `sw.js` | Service worker that caches the shell + assets for offline launch. |
| `manifest.webmanifest` | PWA metadata for installing to the home screen. |
| `assets/logo.svg`, `assets/logo-mark.png` | Brand logo (favicon) and the in-app ink mark. |
| `assets/icon-*.png`, `assets/apple-touch-icon.png` | Home-screen / install icons. |
| `assets/sounds/*.mp3` | The meditation bell recordings. |

## Privacy

Everything stays on your device — only your last duration, selected tone,
start-sound toggle, and presets are kept in `localStorage`. Nothing is ever
sent anywhere.
