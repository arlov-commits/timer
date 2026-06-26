# Still — Meditation Timer

A **bare-bones, 100% offline** meditation timer for quick launch-and-start
sits. No accounts, no tracking, no network. Spin the wheel to set a duration
and tap start.

🧘 **[Open the app](https://arlov-commits.github.io/timer/)**

## Features

- **Rolling wheel duration** — set minutes and seconds on an iOS-style scroll
  wheel. That's the whole interface.
- **Set a new timer anytime** — when a sit ends or you stop, you're back on
  the wheel; just spin and start again. No reset step.
- **Named presets** — save the current length with a name, tap a chip to load
  it back, tap × to remove. Stored locally.
- **Soft ending bell** — a singing-bowl tone synthesized with the Web Audio
  API, so there are no sound files to download. Mute everything with the bell
  icon (top right).
- **Optional start tone** — the ♪ icon (top left) toggles the opening chime on
  or off, independently of the master mute.
- **Mobile-first** — built for the phone: large touch targets, no text-select
  on long-press, clockwise countdown, and installable to the home screen.
- **Everything persists per device** — duration, both sound toggles, and your
  presets are all stored in `localStorage`.
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
| `sw.js` | Service worker that caches the shell for offline launch. |
| `manifest.webmanifest` | PWA metadata for installing to the home screen. |
| `icon.svg` | App icon. |

## Privacy

Everything stays on your device — only your last duration and mute preference
are kept in `localStorage`. Nothing is ever sent anywhere.
