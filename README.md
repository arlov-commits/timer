# Still — Meditation Timer

A simple, **100% offline** meditation timer for quick launch-and-start sits.
No accounts, no tracking, no network — just open it and begin. Inspired by
apps like Insight Timer, pared down to the essentials.

🧘 **[Open the app](https://arlov-commits.github.io/timer/)**

## Features

- **Launch and start** — a big dial, one tap to begin.
- **Makeable presets** — create, edit, and delete your own presets (name,
  duration, interval bell, start/end bells). Saved locally in your browser.
- **Interval bells** — optional chime every *n* minutes during a sit.
- **Soft synthesized bells** — singing-bowl-style tones generated with the
  Web Audio API, so there are no sound files to download. Truly offline.
- **Installable PWA** — add to your home screen and it works with the
  connection off entirely.
- **Keyboard shortcuts** — `Space` start/pause, `R` reset.

## Running it

It's a single static page — no build step.

- **Online:** visit the GitHub Pages link above.
- **Locally:** open `index.html` in a browser, or serve the folder
  (`python3 -m http.server`) so the service worker can register.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app — markup, styles, and logic. |
| `sw.js` | Service worker that caches the shell for offline launch. |
| `manifest.webmanifest` | PWA metadata for installing to the home screen. |
| `icon.svg` | App icon. |

## Privacy

Everything stays on your device. Presets live in `localStorage`; nothing is
ever sent anywhere.
