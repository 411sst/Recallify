# Recallify v2.0

**A comprehensive study environment with spaced repetition, syllabus management, rich text editing, and productivity tools.**

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

</div>

---

## 🎯 Overview

Recallify is a desktop application that combines scientifically-backed spaced repetition with modern study tools. Organize your learning with structured syllabi, take rich formatted notes, attach PDFs, track your study time, and leverage automated revision scheduling to maximize retention.

**Perfect for:**
- 🎓 University students managing multiple courses
- 📚 Self-learners taking online courses
- 💼 Professionals studying for certifications
- 🔬 Graduate students organizing research

---

## ✨ Key Features

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
├── nsis/Recallify_2.0.0_x64-setup.exe  (Windows)
└── msi/Recallify_2.0.0_x64_en-US.msi   (Windows)
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

### Using the Pomodoro Timer

1. Go to **🍅 Pomodoro** in sidebar
2. Click **"Start"**
3. Timer runs for 25 minutes (work session)
4. After completion: 5-min short break (or 20-min long break after 4 sessions)
5. System notification + optional sound alert
6. Sessions logged for analytics

### Tracking Progress

- **Syllabus Tab**: Check completion percentage and progress bars
- **Calendar View**: See all revisions by month with color-coded status
- **History**: Timeline of all study and revision activities
- **Settings**: View study analytics (coming soon)

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
│   │   ├── PomodoroPage.tsx     # Timer
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

### Color Palette

**Light Mode:**
- Primary: Dark Green (#005108)
- Accent: Teal (#1EA896)
- Background: Off-White (#FBFFF1)
- Text: Dark Navy (#0A122A)

**Dark Mode:**
- Primary: Teal (#1EA896)
- Accent: Light Teal (#2DD4BF)
- Background: Dark Navy (#0A122A)
- Text: Off-White (#FBFFF1)

### Status Colors
- ✅ Completed: Teal (#1EA896)
- ⏰ Due Today: Orange (#F59E0B)
- ⚠️ Overdue: Red (#DC2626)
- 📅 Future: Blue (#3B82F6)

---

## 🚧 Roadmap

### v2.1 (Next Release)
- [ ] Subject selection when starting Pomodoro timer
- [ ] Study analytics dashboard (time per subject, charts)
- [ ] Export system (PDF, Markdown, HTML, JSON)
- [ ] Automated backup/restore
- [ ] Export history tracking

### v2.2 (Future)
- [ ] Search across all notes
- [ ] Tags and filtering
- [ ] Custom themes
- [ ] PDF annotations
- [ ] Flashcard mode from notes

### v3.0 (Long-term)
- [ ] Cloud sync & multi-device
- [ ] Mobile apps (iOS/Android)
- [ ] Collaboration features
- [ ] AI-powered study suggestions
- [ ] Web clipper extension

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
