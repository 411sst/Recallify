# Recallify

A desktop application designed to optimize learning through scientifically-backed spaced repetition and sleep-consolidation techniques.

## Overview

Recallify helps users systematically review study material at optimal intervals (3, 7, 14+ days) while leveraging pre-sleep review and morning recall to maximize retention. The app automates the scheduling of study revisions based on spaced repetition principles, tracks weak points through morning recall logging, and provides visual calendar and history tracking to maintain study momentum.

## Key Features

- **Automated Spaced Repetition**: Remove the burden of manually tracking when to review material
- **Subject Management**: Organize your studies by subject (e.g., Machine Learning, Data Structures)
- **Study Entry Tracking**: Log what you studied with customizable revision intervals
- **Morning Recall Notes**: Capture what you struggle to remember for focused review
- **Calendar View**: Visual calendar with color-coded status indicators for revisions
- **Activity History**: Track all your study and revision activities over time
- **Customizable Settings**: Configure default revision intervals and notifications

## Technology Stack

### Frontend
- **React 18** with **TypeScript**
- **Chakra UI** for component library and styling
- **React Router v6** for navigation
- **date-fns** for date manipulation
- **Zustand** for state management

### Backend/Desktop
- **Tauri 1.6** for desktop application framework
- **Rust** for backend logic
- **SQLite** (via rusqlite) for local database
- **Vite** for build tooling

## Project Structure

```
Recallify/
├── src/                      # React application source
│   ├── components/           # Reusable UI components
│   │   └── Sidebar.tsx
│   ├── pages/                # Page components
│   │   ├── SubjectsPage.tsx
│   │   ├── SubjectDetailPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/             # Business logic and API calls
│   │   └── database.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── styles/               # Global styles and theme
│   │   ├── theme.ts
│   │   └── global.css
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Application entry point
├── src-tauri/                # Tauri/Rust backend
│   ├── src/
│   │   └── main.rs           # Rust backend with database commands
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── build.rs
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** (latest stable) via [rustup](https://rustup.rs/)
- Platform-specific dependencies for Tauri:
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: Various development libraries (see [Tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/411sst/Recallify.git
   cd Recallify
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run tauri:dev
   ```

### Building for Production

Build the application for your platform:

```bash
npm run tauri:build
```

This will create a distributable application in `src-tauri/target/release`.

## Usage

### Creating a Subject

1. Click "+ New Subject" on the home page
2. Enter a subject name (e.g., "Machine Learning")
3. Click "Create"

### Adding a Study Entry

1. Navigate to a subject
2. Click "+ New Entry"
3. Fill in:
   - **Study Date**: When you studied the material
   - **Study Notes**: What you studied
   - **Morning Recall Notes** (optional): What you couldn't recall the next morning
   - **Revision Intervals**: When to review (default: 3, 7 days)
4. Click "Save"

### Reviewing Material

1. Check the sidebar for "X revisions due today"
2. Navigate to the subject or use the Calendar view
3. Review the material
4. Check off completed revisions

### Tracking Progress

- **Calendar**: Visual overview of all revisions by month
- **History**: Timeline of all study and revision activities
- **Settings**: Configure default intervals and notifications

## Database Schema

The application uses SQLite with the following tables:

- **subjects**: Study subjects/topics
- **entries**: Individual study session records
- **revision_intervals**: Configured intervals for each entry
- **revisions**: Scheduled revision tasks
- **settings**: Application settings
- **activity_log**: Historical activity tracking

## Design System

### Color Palette

- **Primary**: Dark Green (#005108)
- **Accent**: Teal (#1EA896)
- **Background**: Off-White (#FBFFF1)
- **Text**: Dark Navy (#0A122A)

### Status Colors

- **Success/Completed**: Teal (#1EA896)
- **Due Today**: Orange (#F59E0B)
- **Overdue**: Red (#DC2626)
- **Future**: Blue (#3B82F6)

## Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build frontend for production
- `npm run tauri:dev` - Run Tauri development mode
- `npm run tauri:build` - Build Tauri app for production

### Database Commands

The Rust backend exposes two main commands:

- `db_execute(sql, params)` - Execute SQL statements (INSERT, UPDATE, DELETE)
- `db_select(sql, params)` - Query SQL statements (SELECT)

These are called from the frontend via Tauri's `invoke` function.

## Roadmap

### Phase 2 Features (Future)
- Cloud sync & multi-device support
- Mobile apps (iOS/Android)
- Export/import functionality
- Statistics & analytics dashboard
- Flashcard mode
- Tags & categories
- Full-text search
- AI-powered study suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI components from [Chakra UI](https://chakra-ui.com/)
- Based on spaced repetition research by Ebbinghaus and others
- Inspired by the science of sleep-dependent memory consolidation

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for learners everywhere**
