# Recallify

A desktop study app with SM-2 spaced repetition, Pomodoro timer, rich text notes, and streak tracking.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![LOC](https://img.shields.io/badge/codebase-16.8k%20LOC-blue.svg)

</div>

---

## What it does

- **Spaced repetition** — Study logs are automatically scheduled for review using the SM-2 algorithm at 3, 7, and 14-day intervals with a calendar overview and overdue tracking.
- **Pomodoro timer** — 25/5/20-minute sessions with subject linking, auto-start transitions, state persistence across restarts, and system notifications.
- **Rich text notes** — Full-featured TipTap editor with code blocks, tables, task lists, multi-color highlights, and images.
- **Streak tracking** — Daily streak counter with a GitHub-style calendar heatmap (3/6/12-month views) and milestone recognition.

---

## Features

| Feature | Details |
|---------|---------|
| **SM-2 Spaced Repetition** | Automated revision scheduling, calendar view, overdue/pending/completed states |
| **Pomodoro Timer** | Configurable sessions, auto-start countdowns, state persistence, sound alerts |
| **Rich Text Editor** | TipTap — bold, italic, headings, code blocks, tables, task lists, highlights |
| **Streak & Heatmap** | Consecutive-day streak, longest streak, GitHub-style heatmap with daily activity |
| **Syllabus Management** | Hierarchical module/topic structure, progress bars, paste-to-import |
| **Study Analytics** | Time per subject, session history, today/week/month/all-time breakdowns |
| **Tag System** | Custom tags on study logs, tag dashboard with usage stats and filtering |
| **Dark Mode** | Full light/dark theme, WCAG AA contrast throughout |

---

## Tech Stack

**Frontend** — React 18 · TypeScript 5 · Chakra UI 2 · TipTap 2 · React Router 6 · date-fns 3

**Backend** — Tauri 1.6 · Rust · SQLite (rusqlite 0.31)

**Tooling** — Vite · Cargo · Vitest

---

## Quick Start

**Prerequisites:** Node.js 18+, Rust stable via [rustup](https://rustup.rs/)

```bash
git clone https://github.com/411sst/Recallify.git
cd Recallify
npm install
npm run tauri:dev
```

**Production build:**

```bash
npm run tauri:build
# Installers output to: src-tauri/target/release/bundle/
```

**Spotify integration (optional, requires Spotify Premium):**

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add `http://127.0.0.1:1420/spotify-callback` as a redirect URI
3. Create a `.env` file in the project root:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
```

---

## Data Storage

All study data is stored locally in SQLite — nothing is uploaded or synced externally.

| Platform | Location |
|----------|----------|
| Windows  | `%LOCALAPPDATA%\Recallify\` |

---

## License

MIT — see [LICENSE](LICENSE) for details.
