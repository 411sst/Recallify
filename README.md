# Recallify v5.0

**A comprehensive study environment with spaced repetition, syllabus management, rich text editing, productivity tools, gamification, and advanced UX features - now with complete theme customization!**

<div align="center">

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

</div>

---

## 🎯 Overview

Recallify is a desktop application that combines scientifically-backed spaced repetition with modern study tools. Organize your learning with structured syllabi, take rich formatted notes, track your study time with tags and topics, build consistent study habits with streak tracking, and leverage automated revision scheduling to maximize retention.

**New in v5.0:** Complete theme system with 4 beautiful color schemes, comprehensive UI theming, optimized contrast for all themes, and seamless dark/light mode support across all themes!

**Perfect for:**
- 🎓 University students managing multiple courses
- 📚 Self-learners taking online courses
- 💼 Professionals studying for certifications
- 🔬 Graduate students organizing research

---

## 🆕 What's New in v5.0

### 🎨 Complete Theme System
- **4 Beautiful Themes**: Choose from carefully crafted color schemes
  - **🌿 Default (Green)**: Classic Recallify with teal and green accents
  - **🦊 Kitsune Autumn (Orange)**: Warm autumn tones with golden highlights
  - **🔥 Phoenix Inferno (Red)**: Bold reds and fiery accents
  - **🕷️ Anansi Twilight (Purple)**: Deep purples and mystical lavender
- **Comprehensive Color Palettes**: 40+ UI elements themed per color scheme
  - Backgrounds, cards, borders, text colors
  - Input fields, buttons, hover states
  - Sidebar, active states, navigation
  - Status indicators, heatmap colors
- **Seamless Dark/Light Mode**: All themes work perfectly in both modes
  - Separate light and dark color definitions for each theme
  - High contrast maintained across all themes
  - WCAG AA compliant text contrast in all combinations

### ✨ Theme-Aware Components
- **Sidebar Theming**: Complete sidebar transformation
  - Active section highlighting with theme primary colors
  - Optimized contrast for text on colored backgrounds
  - Hover states that match theme aesthetic
  - White text on dark backgrounds, dark text on light backgrounds
- **Calendar Theming**: Calendar adapts to selected theme
  - Calendar grid background uses theme card colors
  - Borders and hover states match theme palette
  - Selected dates highlighted with theme colors
  - Activity heatmap uses theme-specific color gradients
- **Card & Container Theming**: All UI elements respond to themes
  - Card backgrounds and hover states
  - Border colors throughout the app
  - Button styles (primary and secondary)
  - Input field styling and focus states

### 🔧 Theme System Features
- **Easy Theme Switching**: Change themes from Settings > Appearance
  - Instant theme application across entire app
  - Theme preference persists across sessions
  - Independent from dark/light mode toggle
- **CSS Variable Architecture**: Modern theming implementation
  - 30+ CSS variables for granular control
  - Dynamic color application without reloads
  - Consistent theming across all components
- **Optimized Contrast**: Enhanced readability
  - Fixed sidebar active state contrast issues
  - Dark mode uses darker saturated colors for active states
  - Light mode uses deep primary colors for active states
  - All text maintains excellent contrast ratios

### 🎮 Clash Royale Sound System (Optional)
- **Immersive Audio Cues**: Clash Royale-themed sounds for Pomodoro events
  - ⚔️ **Mega Knight**: "HUUUUUU MEGA KNIGHT" when work session starts
  - 🐗 **Hog Rider**: "HOG RIDERRRR!" when short break starts
  - ⚡ **Electro Wizard**: "ELECTRO WIZARDYYYY!" when long break starts
  - 😂 **King Laugh**: "He-He-He-Haw!" at 1 minute left in Pomodoro
  - 😠 **King Angry**: "GRRRR!" at 30 seconds before break ends
  - 😭 **Goblin Cry**: Mimicking cry when session is abandoned
- **Full Control**: Volume slider (0-100%) and enable/disable toggle
- **Sound Testing**: Test each sound before using in settings
- **User-Provided Assets**: Bring your own sound files (see `public/sounds/clash-royale/README.md`)
- **Legal Compliance**: Not affiliated with Supercell, respects Fan Content Policy

---

## 🆕 What Was New in v3.2

### 🔥 Streak Tracking & Gamification
- **Daily Streak Counter**: Track consecutive days of study
  - Visual streak indicators with emoji progression
  - Current streak and all-time longest streak display
  - Total active study days counter
- **Calendar Heatmap**: GitHub-style contribution graph
  - Visualize study activity over time (3/6/12 month views)
  - Color intensity based on study duration
  - Interactive tooltips with date and study time
  - Dark mode support with accessible colors
- **Milestone Celebrations**: Automatic achievement recognition
  - Celebrate at 7, 14, 30, 50, 100, 180, and 365-day milestones
  - Custom messages and emojis for each achievement
  - Modal celebrations with motivational messages
  - Badge indicators for unlocked milestones
- **Activity Tracking**: Automatic study day detection
  - Counts as active if: complete 1+ pomodoro OR create 1+ study log
  - Daily activity aggregation with stats
  - Study minutes, pomodoro count, entry count tracked

### 🏷️ Tag Management Dashboard
- **Centralized Tag Overview**: View and manage all tags in one place
  - Search tags by name (real-time filtering)
  - Sort by usage, name (A-Z), or creation date
  - Filter by usage ranges (unused, 1-5 uses, 5+ uses)
- **Tag Statistics**: Comprehensive tag analytics
  - Total tags with used/unused breakdown
  - Most used tag with count
  - Active tags count
  - Average uses per tag
- **Tag Cards**: Organized grid layout
  - Tag name with colored badge
  - Usage count display
  - Clean, scannable interface
- **Dark Mode Support**: Full theme compatibility

### 🔧 Bug Fixes (v3.2)
- **Study Log Preview**: No more raw HTML in previews
  - Topics field displayed when present
  - Clean text preview using HTML stripping
  - Consistent across Subject and History pages
- **Dark Mode Text**: Improved visibility
  - All text properly readable in dark mode
  - WCAG AA compliant contrast ratios
  - Card backgrounds adapt to theme
- **Sticky Toolbar**: Editor toolbar stays visible
  - Formatting tools accessible while scrolling
  - Improved editing experience for long notes
- **PDF Import Removed**: Simplified interface
  - PDF feature removed as per design review
  - Cleaner study log creation workflow

---

## ✨ What Was New in v3.0

### 🎨 Enhanced User Experience
- **Collapsible Sidebar**: Toggle sidebar with ← button or Ctrl/Cmd + B
  - Icon-only view when collapsed (60px wide)
  - Tooltips show labels on hover
  - State persists across sessions
  - More screen space for content

### 🍅 Improved Pomodoro Timer
- **Auto-Start Sessions**: Automatic transition between study and breaks
  - 5-second countdown with cancel option
  - "Start Now" button to skip countdown
  - Visual modal with large countdown display
- **Enhanced Notifications**: Multiple notification types
  - System notifications (Windows/macOS/Linux)
  - Toast notifications (top-right corner)
  - Browser tab title flashing
  - Increased sound volume (80%)

### 🏷️ Tags System
- **Tag Your Study Logs**: Categorize entries with custom tags
  - Comma-separated tag input
  - Tags displayed as colored badges
  - Automatic tag suggestions
  - Reusable tags with usage tracking
  - Examples: #difficult, #review-needed, #practice-more

### 📝 Study Log Enhancements
- **Topics Field**: Dedicated field for quick topic identification
  - Shows in list view for easy scanning
  - Separate from detailed study notes
- **Tags Integration**: Filter and organize by tags

### 🌙 Improved Dark Mode
- **Complete Theme Coverage**: All UI elements support dark mode
  - Sidebar properly styled
  - High contrast text (WCAG AA compliant)
  - Consistent colors throughout
  - Smooth theme transitions

### 📊 Study Analytics & Tracking
- **Subject Selection for Pomodoro**: Link study sessions to subjects
  - Modal popup when starting work session
  - Subject name displayed during timer
  - All work sessions linked to subjects for analytics
- **Analytics Dashboard**: Comprehensive study statistics
  - Time per subject with visual progress bars
  - Today / Week / Month / All-time stats
  - Average session time and daily averages
  - Work vs break session tracking
- **Pomodoro History**: Detailed session log
  - Timeline view grouped by date
  - Filter by subject
  - Session type badges (work/short break/long break)
  - Daily study time totals

### 🔧 Bug Fixes
- **Pomodoro Reset**: Properly resets entire session (timer + count)
- **Dark Mode Text**: All text now visible with proper contrast
- **Sidebar Theme**: Sidebar background changes in dark mode

---

## ✨ Core Features (v2.0 & Earlier)

### 📚 Syllabus Management
- **Hierarchical Structure**: Organize courses into modules, topics, and subtopics
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Smart Import**: Paste your syllabus outline and auto-parse into structured format
- **Time Estimation**: Track estimated hours per topic
- **Entry Linking**: Link study entries to specific syllabus topics

### ✍️ Rich Text Editor (TipTap)
- **Full Formatting**: Bold, italic, strikethrough, headings (H1-H3)
- **Advanced Features**:
  - Code blocks with syntax highlighting
  - Tables with add/remove rows/columns
  - Task lists with interactive checkboxes
  - Multi-color highlighting (4 colors)
  - Block quotes and lists
  - Links and images
- **Dark Mode Support**: All formatting works in dark mode
- **Auto-save Ready**: Real-time content updates

### 📄 PDF Viewer & Management
- **Upload PDFs**: Attach PDFs directly to study entries (max 50MB)
- **In-App Viewing**: Full-screen PDF viewer with navigation
- **Multiple PDFs**: Attach multiple PDFs per entry
- **File Management**: View file size, manage attachments
- **Persistent Storage**: PDFs stored locally in AppData

### 🍅 Pomodoro Timer
- **Customizable Sessions**: 25-min work, 5-min short break, 20-min long break
- **Session Tracking**: Track completed Pomodoro sessions
- **Sound Notifications**: Optional audio alerts
- **State Persistence**: Timer state saved across app restarts
- **Dark Mode UI**: Timer interface adapts to theme

### 🔁 Automated Spaced Repetition
- **Smart Scheduling**: Automated revision intervals (3, 7, 14+ days)
- **Morning Recall**: Pre-sleep review + morning recall notes
- **Status Tracking**: Pending, completed, overdue revision states
- **Calendar View**: Visual overview of all revisions
- **Flexible Intervals**: Customize revision schedules per entry

### 🌙 Dark Mode
- **Full Theme Support**: Every component respects dark/light mode
- **Persistent Setting**: Theme preference saved to database
- **Instant Toggle**: Switch themes from Settings
- **Optimized Colors**: Carefully designed dark palette

### 📊 Study Analytics (Infrastructure Ready)
- **Session Recording**: Track Pomodoro sessions with subject links
- **Time Analytics**: Database ready for time-per-subject breakdowns
- **Progress Metrics**: Foundation for study analytics dashboard

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

3. **Set up Spotify integration (Optional):**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URI: `http://127.0.0.1:1420/spotify-callback`
   - Copy your Client ID and Client Secret
   - Create a `.env` file in the project root:
     ```bash
     VITE_SPOTIFY_CLIENT_ID=your_client_id_here
     VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
     ```
   - **Note:** Spotify Premium is required for playback features

4. **Run in development mode:**
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
4. Add revision intervals (default: 3, 7 days)
5. Click **"Save"**

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

4. **Sound Events**:
   - ⚔️ **Mega Knight**: Plays when work session starts
   - 🐗 **Hog Rider**: Plays when short break starts
   - ⚡ **Electro Wizard**: Plays when long break starts
   - 😂 **King Laugh**: Plays at 1 minute remaining in Pomodoro
   - 😠 **King Angry**: Plays 30 seconds before break ends
   - 😭 **Goblin Cry**: Plays when you abandon a session

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

### Viewing Pomodoro History

1. Go to **🕐 Sessions** in sidebar
2. View chronological log of all completed sessions
3. Filter by subject using dropdown
4. See daily study time totals
5. Session types shown with color-coded badges

### Tracking Progress

- **Syllabus Tab**: Check completion percentage and progress bars
- **Analytics Dashboard**: View detailed study time statistics and subject breakdowns
- **Sessions Log**: See complete history of all pomodoro sessions
- **Calendar View**: See all revisions by month with color-coded status
- **History**: Timeline of all study and revision activities

---

## 🗂️ Project Structure

```
Recallify/
├── src/                          # React frontend
│   ├── components/               # UI components
│   │   ├── Sidebar.tsx
│   │   ├── RichTextEditor.tsx   # TipTap editor
│   │   ├── PdfManager.tsx       # PDF upload/view
│   │   ├── SyllabusTab.tsx      # Syllabus management
│   │   ├── AddSyllabusItemModal.tsx
│   │   └── ImportSyllabusModal.tsx
│   ├── pages/                    # Page components
│   │   ├── SubjectsPage.tsx
│   │   ├── SubjectDetailPage.tsx
│   │   ├── PomodoroPage.tsx     # Timer with subject selection
│   │   ├── AnalyticsPage.tsx    # Study analytics dashboard
│   │   ├── PomodoroHistoryPage.tsx  # Session history log
│   │   ├── CalendarPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   └── database.ts           # All database operations
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Dark mode provider
│   ├── utils/
│   │   └── richTextUtils.ts      # HTML processing
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── styles/
│   │   ├── theme.ts              # Chakra UI theme
│   │   └── global.css            # Global styles
│   └── main.tsx                  # App entry point
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   └── main.rs               # Database + file operations
│   ├── Cargo.toml
│   └── tauri.conf.json
└── public/                       # Static assets
    └── timer-complete.mp3        # Timer sound (optional)
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
```

**Linux:**
```
~/.local/share/Recallify/
```

### Data Persistence

✅ **100% Safe Across Updates**
- Database always stored in standard AppData location
- PDFs stored alongside database
- Rebuilding/updating app **NEVER deletes your data**
- Same database used across all versions

### Manual Backup

**Recommended:** Periodically copy these folders:
1. The entire `Recallify` folder from AppData
2. Contains both database and PDFs
3. Restore by copying back to AppData location

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI framework |
| **TypeScript** | 5.2 | Type safety |
| **Chakra UI** | 2.8 | Component library |
| **TipTap** | 2.2 | Rich text editor |
| **React Router** | 6.22 | Navigation |
| **date-fns** | 3.3 | Date utilities |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tauri** | 1.6 | Desktop framework |
| **Rust** | Latest | Backend logic |
| **SQLite** | 0.31 (rusqlite) | Local database |
| **directories** | 5.0 | AppData paths |

### Development
| Tool | Purpose |
|------|---------|
| **Vite** | Build tooling |
| **Cargo** | Rust package manager |

---

## 📊 Database Schema

### Core Tables

- **subjects** - Study subjects/courses
- **entries** - Study session records with rich text notes
- **revision_intervals** - Configured intervals per entry
- **revisions** - Scheduled revision tasks
- **activity_log** - Historical tracking

### v2.0 Tables

- **syllabus_items** - Hierarchical course structure
- **entry_syllabus_links** - Many-to-many entry ↔ topic
- **pdf_attachments** - PDF file metadata
- **pomodoro_sessions** - Timer session history
- **pomodoro_state** - Current timer state
- **export_history** - Export tracking (for v2.1)
- **settings** - App configuration

---

## 🎨 Design System

### Color Palettes

**🌿 Default Theme (Green):**
- Light: Dark Green (#005108) & Teal (#1EA896) on Off-White (#FBFFF1)
- Dark: Teal (#1EA896) on Dark Navy (#0A122A)

**🦊 Kitsune Autumn (Orange):**
- Light: Burnt Sienna (#B45309) & Amber (#F59E0B) on Cream (#FDF4F3)
- Dark: Amber (#D97706) on Dark Brown (#1F1A14)

**🔥 Phoenix Inferno (Red):**
- Light: Crimson (#B91C1C) & Red (#EF4444) on Light Rose (#FEF7F6)
- Dark: Red (#DC2626) on Dark Burgundy (#1E1818)

**🕷️ Anansi Twilight (Purple):**
- Light: Deep Purple (#6D28D9) & Violet (#8B5CF6) on Lavender (#FCFCFF)
- Dark: Purple (#7C3AED) on Dark Indigo (#1E1B2A)

### Status Colors
- ✅ Completed: Teal (#1EA896)
- ⏰ Due Today: Orange (#F59E0B)
- ⚠️ Overdue: Red (#DC2626)
- 📅 Future: Blue (#3B82F6)

---

## 🚧 Roadmap

### ✅ v5.0 (Current Release - Complete!)
- [x] Complete theme system with 4 color schemes
- [x] Comprehensive UI theming (40+ CSS variables)
- [x] Theme-aware sidebar with optimized contrast
- [x] Theme-aware calendar and heatmap colors
- [x] Seamless dark/light mode support for all themes
- [x] Theme preference persistence
- [x] Enhanced contrast for accessibility (WCAG AA compliant)

### ✅ v3.2 (Released)
- [x] Streak tracking with calendar heatmap
- [x] Milestone celebrations (7, 14, 30, 50, 100, 180, 365 days)
- [x] Tag management dashboard with filtering
- [x] Study log preview bug fixes
- [x] Dark mode text visibility improvements
- [x] Sticky editor toolbar
- [x] PDF import feature removal

### ✅ v3.0 (Released)
- [x] Collapsible sidebar with keyboard shortcut
- [x] Auto-start pomodoro sessions
- [x] Tags system for study logs
- [x] Enhanced notifications (system + toast + tab flash)
- [x] Topics field for study entries
- [x] Improved dark mode (WCAG AA compliant)
- [x] Pomodoro reset bug fix
- [x] Subject selection when starting Pomodoro timer
- [x] Study analytics dashboard (time per subject, charts)
- [x] Pomodoro history log page

### v5.1 (Next Release)
- [ ] Search across all notes and subjects
- [ ] Export individual notes to PDF/Markdown
- [ ] Tag editing and merging capabilities
- [ ] Custom streak goals and reminders

### v5.2 (Future)
- [ ] Export system (PDF, Markdown, HTML, JSON)
- [ ] Automated backup/restore
- [ ] Custom theme creator (user-defined color schemes)
- [ ] Flashcard mode from notes

### v6.0 (Long-term)
- [ ] Cloud sync & multi-device
- [ ] Mobile apps (iOS/Android)
- [ ] Collaboration features
- [ ] AI-powered study suggestions
- [ ] Web clipper extension
- [ ] Mythic Mode with gamification features

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

**TypeScript errors during build:**
```bash
npm run build  # Run build first to check errors
```

### Runtime Issues

**PDFs not uploading:**
- Check file size < 50MB
- Ensure you're editing an *existing* entry (not creating new)

**Dark mode not working:**
- Pull latest changes with dark mode fix
- Rebuild app

**Data appears "lost" after rebuild:**
- Check database location: `%LOCALAPPDATA%\Recallify\recallify.db`
- May need to copy from old location (one-time migration)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Tauri Team** - Amazing desktop framework
- **Chakra UI** - Beautiful component library
- **TipTap** - Powerful rich text editor
- **Ebbinghaus** - Spaced repetition research
- **Sleep Science** - Memory consolidation studies

---

## 💬 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/411sst/Recallify/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/411sst/Recallify/discussions)
- 📧 **Contact**: Open an issue for questions

---

<div align="center">

**Made with ❤️ for learners everywhere**

[⬆ Back to Top](#recallify-v20)

</div>
