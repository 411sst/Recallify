# Recallify v5.0

<div align="center">

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Framework](https://img.shields.io/badge/framework-Tauri%201.6-orange.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)

**A comprehensive desktop study environment combining scientifically-backed spaced repetition with modern productivity tools, rich note-taking, gamification, and complete theme customization.**

[Features](#-features) • [Getting Started](#-getting-started) • [User Guide](#-user-guide) • [Version History](#-version-history) • [Tech Stack](#-technology-stack)

</div>

---

## 🎯 What is Recallify?

Recallify is a powerful desktop application designed for students, professionals, and lifelong learners who want to maximize their learning retention and productivity. Built on the principles of spaced repetition and cognitive science, Recallify transforms the way you study by automating revision schedules, tracking your progress, and providing a distraction-free environment optimized for deep learning.

### Why Recallify?

**🧠 Science-Backed Learning**
- Automated spaced repetition based on Ebbinghaus forgetting curve
- Morning recall notes to leverage sleep consolidation
- Proven revision intervals (3, 7, 14+ days)

**📚 Comprehensive Study Tools**
- Rich text editor with formatting, code blocks, tables, and more
- Hierarchical syllabus management with progress tracking
- PDF attachments and viewing
- Pomodoro timer with analytics

**🎨 Beautiful & Customizable**
- 4 stunning theme color schemes
- Full dark/light mode support
- Modern, intuitive interface

**🎮 Gamification & Motivation**
- Streak tracking with GitHub-style heatmaps
- Milestone celebrations (7, 14, 30, 50, 100+ days)
- Study analytics and time tracking
- Optional Clash Royale sound system

**🔒 Privacy First**
- 100% offline - all data stored locally
- No cloud, no tracking, no subscriptions
- Complete ownership of your study data

---

## ✨ Features

### 📝 Rich Note-Taking
- **TipTap Editor**: Professional WYSIWYG editor with:
  - Text formatting (bold, italic, underline, strikethrough)
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered, task lists with checkboxes)
  - Code blocks with syntax highlighting
  - Tables with row/column management
  - 4-color highlighting system
  - Links and images
  - Block quotes
  - Undo/redo with full history
- **Study Notes + Morning Recall**: Separate sections optimized for learning
- **HTML Storage**: Future-proof rich content storage

### 📚 Syllabus Management
- **Hierarchical Structure**: Organize courses → modules → topics → subtopics
- **Smart Import**: Paste syllabus text and auto-parse into structure
- **Progress Tracking**: Visual progress bars and completion percentages
- **Time Estimation**: Track estimated hours per topic
- **Entry Linking**: Link study notes to specific syllabus topics

### 🔁 Automated Spaced Repetition
- **Smart Scheduling**: Automated revision at optimal intervals
- **Morning Recall**: Evening study + morning recall for memory consolidation
- **Revision Calendar**: Visual calendar view of all upcoming revisions
- **Flexible Intervals**: Customize revision schedules per entry
- **Status Tracking**: Pending, completed, overdue states

### 🍅 Pomodoro Timer
- **Standard Sessions**: 25-min work, 5-min short break, 15-min long break
- **Subject Tracking**: Link Pomodoro sessions to subjects for analytics
- **Auto-Start**: Automatic countdown between sessions (5 seconds)
- **Skip Break**: Option to skip break and continue working
- **Multiple Notifications**:
  - System notifications (Windows/macOS/Linux)
  - Toast notifications
  - Browser tab title flashing
  - Audio alerts
  - Optional Clash Royale sounds
- **Session Summary**: Daily Pomodoro count display
- **State Persistence**: Timer survives app restarts
- **Accurate Timing**: Timestamp-based calculation prevents drift when window is minimized

### 🎮 Clash Royale Sound System (Optional)
Immersive audio experience for Pomodoro sessions with Clash Royale-themed sounds:
- ⚔️ **Mega Knight**: Work session starts
- 🐗 **Hog Rider**: Short break starts
- ⚡ **Electro Wizard**: Long break starts
- 😂 **King Laugh**: 1 minute remaining warning
- 😠 **King Angry**: 30 seconds before break ends
- 😭 **Goblin Cry**: Session abandoned

**Features:**
- Volume control (0-100%)
- Enable/disable toggle
- Individual sound testing
- User-provided sound files (legal compliance)

### 📊 Study Analytics
- **Time Tracking**: Automatic tracking of all Pomodoro sessions
- **By Subject**: Time breakdown per subject with visual progress bars
- **Time Periods**: Today, week, month, all-time statistics
- **Session Counts**: Track work vs break sessions
- **Averages**: Average session time and daily averages
- **History Log**: Complete chronological session history with filtering

### 🔥 Streak Tracking & Gamification
- **Daily Streaks**: Track consecutive days of study activity
- **Calendar Heatmap**: GitHub-style contribution graph
  - 3, 6, and 12-month views
  - Color intensity based on study duration
  - Interactive tooltips with date and time
- **Milestone Celebrations**: Automatic achievements at 7, 14, 30, 50, 100, 180, and 365 days
- **Activity Detection**: Counts as active if you complete 1+ Pomodoro OR create 1+ study log
- **Motivational Messages**: Custom messages for each milestone

### 🏷️ Tags System
- **Tag Your Notes**: Categorize study entries with custom tags
- **Comma-Separated Input**: Easy tag creation
- **Colored Badges**: Visual tag display
- **Tag Management Dashboard**:
  - Search tags by name
  - Sort by usage, name, or creation date
  - Filter by usage ranges
  - Tag statistics (total, most used, averages)
- **Reusable Tags**: Automatic tag suggestions from previous entries

### 📄 PDF Management
- **Upload PDFs**: Attach PDFs directly to study entries (max 50MB)
- **In-App Viewing**: Full-screen PDF viewer
- **Multiple PDFs**: Attach multiple PDFs per entry
- **File Management**: View file sizes, manage attachments
- **Persistent Storage**: PDFs stored locally in AppData

### 🎨 Complete Theme System
Choose from 4 beautiful color schemes, each with full dark/light mode support:

**🌿 Default (Green)**
- Light: Dark Green (#005108) & Teal (#1EA896) on Off-White (#FBFFF1)
- Dark: Teal (#1EA896) on Dark Navy (#0A122A)
- Classic Recallify aesthetic

**🦊 Kitsune Autumn (Orange)**
- Light: Burnt Sienna (#B45309) & Amber (#F59E0B) on Cream (#FDF4F3)
- Dark: Amber (#D97706) on Dark Brown (#1F1A14)
- Warm autumn tones with golden highlights

**🔥 Phoenix Inferno (Red)**
- Light: Crimson (#B91C1C) & Red (#EF4444) on Light Rose (#FEF7F6)
- Dark: Red (#DC2626) on Dark Burgundy (#1E1818)
- Bold reds and fiery accents

**🕷️ Anansi Twilight (Purple)**
- Light: Deep Purple (#6D28D9) & Violet (#8B5CF6) on Lavender (#FCFCFF)
- Dark: Purple (#7C3AED) on Dark Indigo (#1E1B2A)
- Deep purples and mystical lavender

**Theme Features:**
- 40+ themed UI elements per color scheme
- Optimized contrast for all themes (WCAG AA compliant)
- Theme-aware sidebar with dynamic active states
- Theme-aware calendar and heatmap colors
- Instant theme switching from Settings
- Independent from dark/light mode toggle

### 🌙 Dark Mode
- **Full Theme Support**: All 4 color schemes work perfectly in dark mode
- **Persistent Setting**: Theme preference saved to database
- **Instant Toggle**: Switch from Settings
- **High Contrast**: WCAG AA compliant text contrast throughout
- **Optimized Colors**: Carefully designed dark palette per theme

### 🔧 User Experience
- **Collapsible Sidebar**: Toggle sidebar with ← button or Ctrl/Cmd + B
  - Icon-only view when collapsed (60px)
  - Tooltips on hover
  - State persists across sessions
- **Responsive Design**: Adapts to different window sizes
- **Sticky Toolbar**: Rich text editor toolbar stays visible while scrolling
- **Keyboard Shortcuts**: Quick access to common actions
- **State Persistence**: App remembers your position and settings

---

## 🚀 Getting Started

### Prerequisites

**Required:**
- **Node.js** 18+ and npm
- **Rust** (latest stable) via [rustup](https://rustup.rs/)

**Platform-Specific:**
- **Windows**: Microsoft Visual Studio C++ Build Tools
- **macOS**: Xcode Command Line Tools
- **Linux**: See [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/411sst/Recallify.git
   cd Recallify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run tauri:dev
   ```

### Building for Production

```bash
npm run tauri:build
```

**Installers will be created in:**
```
src-tauri/target/release/bundle/
├── nsis/Recallify_5.0.0_x64-setup.exe  (Windows)
└── msi/Recallify_5.0.0_x64_en-US.msi   (Windows)
```

---

## 📖 User Guide

### Creating Your First Subject

1. Click **"+ New Subject"** on home page
2. Enter subject name (e.g., "Machine Learning")
3. Click **"Create"**

### Setting Up a Syllabus

**Option 1: Manual Entry**
1. Go to subject → **Syllabus** tab
2. Click **"+ Add Module"**
3. Fill in title, description, estimated hours
4. Add subtopics by clicking menu (⋮) → "Add Subtopic"

**Option 2: Import from Text**
1. Go to subject → **Syllabus** tab
2. Click **"📥 Import"**
3. Paste your syllabus in format:
   ```
   Introduction to ML: Machine Learning Basics, Concept Learning.
   Decision Trees: ID3 Algorithm, Overfitting Solutions.
   ```
4. Click **"Import"** - auto-parses into structure!

### Taking Rich Text Notes

1. Navigate to subject → **"+ New Entry"**
2. Use the formatting toolbar:
   - **B** = Bold, **I** = Italic, **S** = Strikethrough
   - **H** = Headings dropdown
   - **•** = Lists (bullet, numbered, tasks)
   - **`</>** = Code blocks with syntax highlighting
   - **🎨** = Highlight colors
   - **🔗** = Links, **🖼️** = Images, **📊** = Tables
3. Fill in both "Study Notes" and "Morning Recall Notes"
4. Add tags (comma-separated): #difficult, #review-needed
5. Add revision intervals (default: 3, 7 days)
6. Click **"Save"**

### Attaching PDFs to Entries

**Important:** PDFs can only be added to **existing entries** (not new ones)

1. **Edit an existing entry** (click on it from study entries list)
2. Scroll to bottom → **"📄 Attached PDFs"** section
3. Click **"+ Upload PDF"**
4. Select PDF file (max 50MB)
5. Click **"View"** to open in full-screen viewer
6. Delete anytime with 🗑️ button

### Changing Themes

1. Go to **⚙️ Settings** in sidebar
2. Navigate to **Appearance** section
3. Under **Color Theme**, select from dropdown:
   - **Default (Green)** - Classic Recallify
   - **🦊 Kitsune Autumn (Orange)** - Warm autumn tones
   - **🔥 Phoenix Inferno (Red)** - Bold fiery colors
   - **🕷️ Anansi Twilight (Purple)** - Mystical purples
4. Theme applies instantly across entire app
5. Works with both Light and Dark modes

### Using the Pomodoro Timer

1. Go to **🍅 Pomodoro** in sidebar
2. Click **"Start"**
3. **Select a subject** from the modal (for work sessions)
4. Timer runs for 25 minutes (work session)
5. After completion: 5-second auto-start countdown for break
   - Click "Start Now" to skip countdown
   - Click "Cancel" to stay on completion screen
   - Or "Skip Break" to start next work session immediately
6. System notification + toast + tab flashing + sound alert
7. Sessions automatically logged for analytics

### Setting Up Clash Royale Sounds (Optional)

**Note**: Sound files are **not included** due to copyright. You must obtain them yourself.

1. **Obtain Sound Files**:
   - Extract from Clash Royale game files (if permitted)
   - Record from gameplay (ensure compliance with Supercell's Fan Content Policy)
   - Use licensed sound effect libraries

2. **Place Sound Files**:
   - Navigate to `public/sounds/clash-royale/` directory
   - Add these **6 files** (names must match exactly):
     - `mega-knight.mp3` - Work session start sound
     - `hog-rider.mp3` - Short break start sound
     - `electro-wizard.mp3` - Long break start sound
     - `king-laugh.mp3` - 1 minute warning sound
     - `king-angry.mp3` - 30 second warning sound
     - `goblin-cry.mp3` - Session abandoned sound
   - See `public/sounds/clash-royale/README.md` for detailed requirements

3. **Enable in Settings**:
   - Go to **⚙️ Settings** → **Pomodoro Timer**
   - Scroll to **"🎮 Clash Royale Sounds"** section
   - Toggle **"Enable Clash Royale sounds"** to ON
   - Adjust **volume slider** (0-100%)
   - Use **"Test Sound"** buttons to verify each sound works

**Legal Notice**: Clash Royale is © Supercell. Recallify is not affiliated with, endorsed by, or sponsored by Supercell. Use of game assets must comply with [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).

### Viewing Study Analytics

1. Go to **📊 Analytics** in sidebar
2. **Overview tab**: See today/week/month/all-time statistics
   - Total study time and session counts
   - Average session time
   - Daily averages
3. **By Subject tab**: Time breakdown per subject
   - Visual progress bars
   - Pomodoro count per subject
   - Average time per session

### Tracking Your Streak

1. Go to **🔥 Streak** in sidebar
2. View your current streak and longest streak
3. See total active study days
4. Explore calendar heatmap (3/6/12 month views)
5. Celebrate milestones automatically as you reach them!

### Managing Tags

1. Go to **🏷️ Tags** in sidebar
2. View all tags with usage statistics
3. Search tags by name
4. Sort by usage, name, or creation date
5. Filter by usage ranges (unused, 1-5 uses, 5+ uses)

---

## 📚 Version History

### 🎉 v5.0.0 - Complete Theme System (Current Release)

**Released:** January 2025

**Major Features:**

**🎨 4 Beautiful Color Schemes**
- Default (Green), Kitsune Autumn (Orange), Phoenix Inferno (Red), Anansi Twilight (Purple)
- 40+ themed UI elements per color scheme
- Comprehensive color palettes for backgrounds, cards, borders, text, inputs, buttons, sidebar, navigation, status indicators, heatmaps
- Seamless dark/light mode support for all themes
- Separate light and dark color definitions for each theme

**✨ Theme-Aware Components**
- Complete sidebar transformation with theme primary colors
- Optimized contrast for text on colored backgrounds (white on dark, dark on light)
- Calendar adaptation with theme card colors and gradients
- Activity heatmap with theme-specific color gradients
- Card, container, button, and input field theming

**🔧 Theme System Architecture**
- Easy theme switching from Settings → Appearance
- CSS variable architecture (30+ variables for granular control)
- Dynamic color application without reloads
- Theme preference persistence across sessions
- Enhanced readability (WCAG AA compliant contrast ratios)

**🎮 Clash Royale Sound System (Optional)**
- 6 immersive audio cues for Pomodoro events
- Volume control (0-100%) and enable/disable toggle
- Sound testing buttons
- User-provided assets for legal compliance
- Countdown warnings: 1 minute (work) and 30 seconds (break)

**🐛 Bug Fixes**
- Fixed timer pausing when Anansi riddle appears while window is minimized
- Changed tick() function to timestamp-based calculation
- Prevents browser tab throttling from affecting timer accuracy
- Sidebar contrast optimization in all themes

---

### ⚡ v4.0.0 - Mythic Mode & Gamification

**Released:** December 2024

**Major Features:**
- 🦊 **Kitsune Folklore**: Fox spirit sidebar integration with animated tails
- 🔥 **Phoenix Animations**: Rebirth effects and loading animations
- 🕷️ **Anansi's Web**: Spider riddles during Pomodoro sessions
- 👻 **Banshee Warnings**: Mystical revision reminders
- 🧞 **Djinn Wishlists**: Feature request system with folklore theme
- 🎨 **Mythic Themes**: Folklore-inspired color palettes
- 🎵 **Kitsune Haikus**: Tooltip wisdom system
- 🥚 **Easter Eggs**: Hidden konami code and folklore discoveries
- 🏆 **Badge System**: Mythic achievement tracking
- 🎊 **Confetti Celebrations**: Victory animations

**Technical:**
- Zustand state management for mythic features
- Framer Motion animations
- SQLite storage for mythic progress
- React Icons integration

---

### 🏃 v3.2.0 - Streak Tracking & Tag Management

**Released:** November 2024

**New Features:**

**🔥 Streak Tracking System**
- Daily streak counter with emoji progression
- Current streak and all-time longest streak
- Total active study days counter
- GitHub-style calendar heatmap (3/6/12 month views)
- Color intensity based on study duration
- Interactive tooltips with date and time
- Dark mode support

**🎖️ Milestone Celebrations**
- Automatic achievement recognition at 7, 14, 30, 50, 100, 180, 365 days
- Custom messages and emojis for each milestone
- Modal celebrations with motivational messages
- Badge indicators for unlocked milestones

**🏷️ Tag Management Dashboard**
- Centralized tag overview
- Search tags by name (real-time filtering)
- Sort by usage, name (A-Z), or creation date
- Filter by usage ranges
- Tag statistics (total, most used, average uses)
- Tag cards in organized grid layout

**🐛 Bug Fixes**
- Fixed raw HTML showing in study log previews
- Improved dark mode text visibility
- Made editor toolbar sticky (stays visible while scrolling)
- Removed PDF import feature (simplified workflow)

---

### 🚀 v3.0.0 - Enhanced UX & Analytics

**Released:** October 2024

**New Features:**

**🎨 Enhanced User Experience**
- Collapsible sidebar with ← button or Ctrl/Cmd + B
- Icon-only view when collapsed (60px wide)
- Tooltips on hover
- State persists across sessions
- More screen space for content

**🍅 Improved Pomodoro Timer**
- Auto-start sessions with 5-second countdown
- Cancel or "Start Now" options
- Visual modal with large countdown display
- Enhanced notifications:
  - System notifications (Windows/macOS/Linux)
  - Toast notifications (top-right corner)
  - Browser tab title flashing
  - Increased sound volume (80%)

**🏷️ Tags System**
- Tag study logs with custom tags
- Comma-separated tag input
- Colored badge display
- Automatic tag suggestions
- Reusable tags with usage tracking
- Examples: #difficult, #review-needed, #practice-more

**📝 Study Log Enhancements**
- Topics field for quick topic identification
- Shows in list view for easy scanning
- Separate from detailed study notes
- Tags integration for filtering

**🌙 Improved Dark Mode**
- Complete theme coverage for all UI elements
- High contrast text (WCAG AA compliant)
- Consistent colors throughout
- Smooth theme transitions

**📊 Study Analytics & Tracking**
- Subject selection when starting Pomodoro
- Modal popup for work sessions
- Subject name displayed during timer
- Analytics dashboard with time per subject
- Visual progress bars
- Today/Week/Month/All-time stats
- Average session time and daily averages
- Work vs break session tracking

**📜 Pomodoro History**
- Detailed session log
- Timeline view grouped by date
- Filter by subject
- Session type badges (work/short break/long break)
- Daily study time totals

**🐛 Bug Fixes**
- Pomodoro reset now properly resets entire session (timer + count)
- Fixed dark mode text visibility
- Fixed sidebar background in dark mode

---

### 📚 v2.0.0 - Syllabus & Rich Content

**Released:** September 2024

**Major Features:**

**📖 Syllabus Management System**
- Hierarchical structure: courses → modules → topics → subtopics
- Visual progress bars showing completion percentage
- Smart import: paste syllabus outline and auto-parse
- Time estimation tracking per topic
- Entry linking to specific syllabus topics
- Add/edit/delete modules and subtopics
- Collapse/expand navigation

**✍️ Rich Text Editor (TipTap)**
- Professional WYSIWYG editor
- Full formatting: bold, italic, strikethrough, headings (H1-H3)
- Advanced features:
  - Code blocks with syntax highlighting
  - Tables with add/remove rows/columns
  - Task lists with interactive checkboxes
  - Multi-color highlighting (4 colors)
  - Block quotes and lists
  - Links and images
- Dark mode support
- Auto-save ready with real-time updates
- Character and word count display
- Undo/redo with full history

**📄 PDF Viewer & Management**
- Upload PDFs directly to study entries (max 50MB)
- In-app full-screen PDF viewer
- Multiple PDFs per entry
- File size display and management
- Persistent storage in AppData
- View/delete PDFs anytime

**🔧 Technical Improvements**
- Added TipTap editor dependencies
- Created RichTextEditor component (400+ lines)
- Created PdfManager component (250+ lines)
- HTML storage for future-proof rich content
- Tauri file commands for PDF operations
- Database functions for PDF metadata
- Utility functions for HTML processing

**📦 Database Schema Updates**
- `syllabus_items` table for course structure
- `entry_syllabus_links` table for many-to-many entry ↔ topic
- `pdf_attachments` table for PDF metadata
- `pomodoro_sessions` table for timer history
- `export_history` table (for future export feature)

---

### ⏱️ v1.2.0 - Pomodoro Timer & Dark Mode

**Released:** August 2024

**New Features:**
- 🍅 **Pomodoro Timer**: 25-min work, 5-min short break, 15-min long break
- ⏰ **Session Tracking**: Track completed Pomodoro sessions
- 🔔 **Sound Notifications**: Optional audio alerts (timer-complete.mp3)
- 💾 **State Persistence**: Timer state saved across app restarts
- 🌙 **Dark Mode**: Full dark theme support
  - Every component respects dark/light mode
  - Persistent setting saved to database
  - Instant toggle from Settings
  - Optimized dark color palette
- 🎨 **Dark Mode UI**: Timer interface adapts to theme

**Technical:**
- Added `pomodoro_state` table to database
- Added `settings` table for theme preferences
- Created PomodoroPage component
- Created ThemeContext for dark mode management
- Chakra UI color mode integration

---

### 🎓 v1.0.0 - Foundation Release

**Released:** July 2024

**Core Features:**

**🔁 Spaced Repetition System**
- Automated revision scheduling based on Ebbinghaus forgetting curve
- Configurable revision intervals (default: 3, 7, 14+ days)
- Morning recall notes for sleep consolidation
- Status tracking: pending, completed, overdue
- Calendar view of all revisions
- Revision history timeline

**📝 Basic Note-Taking**
- Create study entries linked to subjects
- Study notes field
- Morning recall notes field
- Plain text storage
- Entry editing and deletion

**🗂️ Subject Management**
- Create and organize subjects/courses
- Subject detail pages
- Study entries list per subject
- Subject editing and deletion

**📅 Calendar & History**
- Monthly calendar view of revisions
- Color-coded status indicators:
  - ✅ Completed: Teal
  - ⏰ Due Today: Orange
  - ⚠️ Overdue: Red
  - 📅 Future: Blue
- History timeline of all activities
- Activity log with timestamps

**💾 Data Management**
- SQLite local database
- Persistent storage in AppData
- Database schema with core tables:
  - `subjects` - Study subjects/courses
  - `entries` - Study session records
  - `revision_intervals` - Configured intervals per entry
  - `revisions` - Scheduled revision tasks
  - `activity_log` - Historical tracking

**🖥️ User Interface**
- Clean, modern UI with Chakra UI
- Responsive design
- Sidebar navigation
- React Router for navigation
- TypeScript for type safety

**🔧 Technical Foundation**
- Tauri 1.6 desktop framework
- React 18.2 frontend
- Rust backend for database operations
- Cross-platform support (Windows, macOS, Linux)
- Local-first architecture (100% offline)

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI framework for building component-based interfaces |
| **TypeScript** | 5.2 | Static type checking for improved code quality |
| **Chakra UI** | 2.8 | Component library with built-in accessibility |
| **TipTap** | 2.2 | Headless rich text editor framework |
| **React Router** | 6.22 | Client-side routing and navigation |
| **Framer Motion** | 11.0 | Animation library for smooth transitions |
| **date-fns** | 3.3 | Modern date utility library |
| **React Icons** | 5.5 | Icon library with multiple icon sets |
| **Zustand** | 4.5 | Lightweight state management |
| **Lowlight** | 3.1 | Syntax highlighting for code blocks |
| **React PDF** | 7.7 | PDF rendering in React |
| **pdfjs-dist** | 3.11 | PDF parsing and rendering |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tauri** | 1.6 | Rust-powered desktop application framework |
| **Rust** | Latest Stable | Systems programming language for backend |
| **rusqlite** | 0.31 | SQLite bindings for Rust |
| **directories** | 5.0 | Cross-platform AppData path resolution |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Vite** | Fast build tooling and dev server |
| **Cargo** | Rust package manager and build system |
| **npm** | Node package manager |
| **Vitest** | Unit testing framework for Vite |
| **ESLint** | Code linting for TypeScript/React |
| **TypeScript ESLint** | TypeScript-specific linting rules |

### Testing

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing with Vite integration |
| **@testing-library/react** | React component testing utilities |
| **@testing-library/user-event** | User interaction simulation |
| **jsdom** | DOM implementation for Node.js testing |

---

## 🗂️ Project Structure

```
Recallify/
├── src/                              # React frontend
│   ├── components/                   # Reusable UI components
│   │   ├── Sidebar.tsx               # Main navigation sidebar
│   │   ├── RichTextEditor.tsx        # TipTap editor wrapper
│   │   ├── PdfManager.tsx            # PDF upload/view component
│   │   ├── SyllabusTab.tsx           # Syllabus management
│   │   ├── AddSyllabusItemModal.tsx  # Add module/topic modal
│   │   ├── ImportSyllabusModal.tsx   # Smart syllabus import
│   │   ├── CelebrationModal.tsx      # Milestone celebrations
│   │   └── mythic/                   # Mythic Mode components
│   │       ├── KitsuneTails.tsx      # Fox spirit animation
│   │       ├── PhoenixLoader.tsx     # Phoenix rebirth loader
│   │       ├── AnansiRiddleModal.tsx # Spider riddles
│   │       ├── KitsuneHaikuTooltip.tsx # Wisdom tooltips
│   │       └── ...                   # Other mythic components
│   ├── pages/                        # Page components (routes)
│   │   ├── SubjectsPage.tsx          # Home page with subject list
│   │   ├── SubjectDetailPage.tsx     # Subject detail with tabs
│   │   ├── PomodoroPage.tsx          # Pomodoro timer
│   │   ├── AnalyticsPage.tsx         # Study analytics dashboard
│   │   ├── PomodoroHistoryPage.tsx   # Session history log
│   │   ├── CalendarPage.tsx          # Revision calendar
│   │   ├── HistoryPage.tsx           # Activity timeline
│   │   ├── StreakPage.tsx            # Streak tracking & heatmap
│   │   ├── TagManagementPage.tsx     # Tag management dashboard
│   │   └── SettingsPage.tsx          # App settings
│   ├── services/                     # Business logic services
│   │   ├── database.ts               # All database operations
│   │   └── clashRoyaleSound.ts       # Sound management service
│   ├── contexts/                     # React contexts
│   │   └── ThemeContext.tsx          # Theme provider (dark/light + color schemes)
│   ├── stores/                       # Zustand state stores
│   │   └── mythicStore.ts            # Mythic Mode state management
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAnansiYarn.ts          # Anansi riddle timing
│   │   ├── useFolklore.ts            # Folklore message generation
│   │   └── useMythicSync.ts          # Mythic data synchronization
│   ├── utils/                        # Utility functions
│   │   └── richTextUtils.ts          # HTML processing utilities
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts                  # Main types
│   │   └── mythic.ts                 # Mythic Mode types
│   ├── styles/                       # Global styles and themes
│   │   ├── theme.ts                  # Chakra UI theme config
│   │   └── global.css                # Global CSS (theme variables)
│   ├── App.tsx                       # Main app component with routing
│   └── main.tsx                      # App entry point
├── src-tauri/                        # Rust backend
│   ├── src/
│   │   └── main.rs                   # Tauri commands & database logic
│   ├── Cargo.toml                    # Rust dependencies
│   ├── tauri.conf.json               # Tauri configuration
│   └── icons/                        # App icons for each platform
├── public/                           # Static assets
│   ├── timer-complete.mp3            # Default timer sound
│   └── sounds/clash-royale/          # Optional Clash Royale sounds
│       ├── README.md                 # Sound setup guide
│       └── (user-provided MP3s)      # Not included - user must add
├── package.json                      # Node dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
└── README.md                         # This file
```

---

## 💾 Data Storage

### Database Location

**Windows:**
```
C:\Users\YourName\AppData\Local\Recallify\
├── recallify.db    # SQLite database
└── pdfs/           # Uploaded PDF files
```

**macOS:**
```
~/Library/Application Support/Recallify/
├── recallify.db
└── pdfs/
```

**Linux:**
```
~/.local/share/Recallify/
├── recallify.db
└── pdfs/
```

### Database Schema

**Core Tables (v1.0):**
- `subjects` - Study subjects/courses
- `entries` - Study session records with rich text notes
- `revision_intervals` - Configured intervals per entry
- `revisions` - Scheduled revision tasks
- `activity_log` - Historical tracking

**v2.0 Tables:**
- `syllabus_items` - Hierarchical course structure (parent_id for nesting)
- `entry_syllabus_links` - Many-to-many entry ↔ topic relationships
- `pdf_attachments` - PDF file metadata with file paths
- `export_history` - Export tracking (for future use)

**v1.2 Tables:**
- `pomodoro_sessions` - Timer session history with subject links
- `pomodoro_state` - Current timer state (duration, remaining, running status)
- `settings` - App configuration (theme, preferences)

**v3.0 Tables:**
- `tags` - Reusable tags with usage tracking
- `entry_tags` - Many-to-many entry ↔ tag relationships

**v3.2 Tables:**
- `daily_activity` - Daily study activity aggregation
- `streaks` - Streak tracking (current, longest)
- `milestones` - Milestone achievements

**v4.0 Tables:**
- `mythic_progress` - Mythic Mode feature unlocks and progress
- `kitsune_tails` - Fox spirit tail collection
- `anansi_yarns` - Completed spider riddles
- `phoenix_rebirths` - Phoenix revival count
- `djinn_wishes` - Feature requests with folklore theme

### Data Persistence

✅ **100% Safe Across Updates**
- Database always stored in standard AppData location
- PDFs stored alongside database
- Rebuilding/updating app **NEVER deletes your data**
- Same database used across all versions
- Automatic schema migrations when needed

### Manual Backup

**Recommended:** Periodically copy these folders:
1. The entire `Recallify` folder from AppData
2. Contains both database and PDFs
3. Restore by copying back to AppData location

**Backup Command (Windows):**
```powershell
xcopy "%LOCALAPPDATA%\Recallify" "D:\Backups\Recallify" /E /I /H /Y
```

---

## 🎨 Design System

### Color Palettes

**🌿 Default Theme (Green):**
- Primary (Light): Dark Green (#005108)
- Secondary (Light): Teal (#1EA896)
- Background (Light): Off-White (#FBFFF1)
- Primary (Dark): Teal (#1EA896)
- Background (Dark): Dark Navy (#0A122A)

**🦊 Kitsune Autumn (Orange):**
- Primary (Light): Burnt Sienna (#B45309)
- Secondary (Light): Amber (#F59E0B)
- Background (Light): Cream (#FDF4F3)
- Primary (Dark): Amber (#D97706)
- Background (Dark): Dark Brown (#1F1A14)

**🔥 Phoenix Inferno (Red):**
- Primary (Light): Crimson (#B91C1C)
- Secondary (Light): Red (#EF4444)
- Background (Light): Light Rose (#FEF7F6)
- Primary (Dark): Red (#DC2626)
- Background (Dark): Dark Burgundy (#1E1818)

**🕷️ Anansi Twilight (Purple):**
- Primary (Light): Deep Purple (#6D28D9)
- Secondary (Light): Violet (#8B5CF6)
- Background (Light): Lavender (#FCFCFF)
- Primary (Dark): Purple (#7C3AED)
- Background (Dark): Dark Indigo (#1E1B2A)

### Status Colors
- ✅ Completed: Teal (#1EA896)
- ⏰ Due Today: Orange (#F59E0B)
- ⚠️ Overdue: Red (#DC2626)
- 📅 Future: Blue (#3B82F6)

### Typography
- **Headings**: System font stack with fallbacks
- **Body**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
- **Monospace**: 'Courier New', Courier, monospace (code blocks)

---

## 🚧 Roadmap

### v5.1 (Next Release) - Enhanced Search & Export
- [ ] Global search across all notes and subjects
- [ ] Export individual notes to PDF/Markdown
- [ ] Tag editing and merging capabilities
- [ ] Custom streak goals and reminders
- [ ] Import/export settings and preferences

### v5.2 (Future) - Customization & Flexibility
- [ ] Custom theme creator (user-defined color schemes)
- [ ] Automated backup/restore system
- [ ] Flashcard mode generated from notes
- [ ] Custom revision interval presets
- [ ] Note templates

### v6.0 (Long-term Vision) - Cloud & Collaboration
- [ ] Optional cloud sync & multi-device support
- [ ] Mobile apps (iOS/Android)
- [ ] Collaboration features (shared subjects)
- [ ] AI-powered study suggestions
- [ ] Web clipper browser extension
- [ ] Advanced Mythic Mode features
- [ ] Social study groups

---

## 🐛 Troubleshooting

### Build Issues

**Error: "Cannot find module '@tiptap/react'"**
```bash
npm install  # Make sure all dependencies installed
```

**Error: "Failed to open database"**
- Check AppData folder exists: `%LOCALAPPDATA%\Recallify`
- Ensure write permissions
- Try running as administrator (Windows)

**TypeScript errors during build:**
```bash
npm run build  # Run build first to check errors
tsc --noEmit    # Check TypeScript without building
```

**Rust compilation errors:**
```bash
rustup update   # Update Rust to latest stable
cargo clean     # Clean build cache
cargo build     # Test Rust build
```

### Runtime Issues

**PDFs not uploading:**
- Check file size < 50MB
- Ensure you're editing an *existing* entry (not creating new)
- Verify write permissions to AppData folder

**Dark mode not working:**
- Check Settings → Appearance → "Use Dark Mode" toggle
- Try toggling off and on again
- Restart the app

**Timer not accurate when window minimized:**
- Update to v5.0.0+ (fixed in this version)
- Timer now uses timestamp-based calculation

**Sound not playing:**
- Check system volume
- For Clash Royale sounds: verify files are placed correctly
- Check Settings → Pomodoro → Enable sounds

**Data appears "lost" after rebuild:**
- Check database location: `%LOCALAPPDATA%\Recallify\recallify.db`
- Database persists across rebuilds - may need to restart app
- Check if data is in old location (one-time migration may be needed)

**Theme colors not applying:**
- Clear browser cache (Ctrl + Shift + R)
- Restart the app
- Check Settings → Appearance → Color Theme

---

## 🤝 Contributing

Contributions are welcome! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Run tests** (`npm run test`)
5. **Build the app** (`npm run build`)
6. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
7. **Push to branch** (`git push origin feature/AmazingFeature`)
8. **Open a Pull Request**

### Coding Guidelines

- **TypeScript**: Use strict type checking
- **React**: Use functional components and hooks
- **Formatting**: Follow existing code style
- **Comments**: Add comments for complex logic
- **Testing**: Add tests for new features
- **Commits**: Use conventional commit messages

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌍 Internationalization (i18n)
- ♿ Accessibility improvements

---

## 📄 License

MIT License

Copyright (c) 2024 Recallify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- **Tauri Team** - For the amazing desktop framework that makes cross-platform Rust+Web apps possible
- **Chakra UI** - For the beautiful, accessible component library
- **TipTap** - For the powerful and extensible rich text editor
- **Hermann Ebbinghaus** - For the foundational research on the forgetting curve and spaced repetition
- **Sleep Science Researchers** - For studies on memory consolidation during sleep
- **Open Source Community** - For the countless libraries and tools that make Recallify possible

---

## 💬 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/411sst/Recallify/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/411sst/Recallify/discussions)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/411sst/Recallify/wiki)
- 📧 **Contact**: Open an issue for questions or email [your-email]

---

## 🌟 Show Your Support

If Recallify helps you learn better, consider:
- ⭐ Starring the repository
- 🐦 Sharing on social media
- 📝 Writing a blog post or review
- 🤝 Contributing code or documentation
- ☕ Buying the maintainer a coffee

---

<div align="center">

**Made with ❤️ for learners everywhere**

*"The beautiful thing about learning is that nobody can take it away from you." - B.B. King*

[⬆ Back to Top](#recallify-v50)

</div>
