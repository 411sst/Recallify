import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import PomodoroPage from "./pages/PomodoroPage";
import StreakPage from "./pages/StreakPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PomodoroHistoryPage from "./pages/PomodoroHistoryPage";
import TagManagementPage from "./pages/TagManagementPage";
import CalendarPage from "./pages/CalendarPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import SpotifyCallbackPage from "./pages/SpotifyCallbackPage";
import BadgesPage from "./pages/BadgesPage";
import SpotifyButton from "./components/spotify/SpotifyButton";
import { updateOverdueRevisions } from "./services/database";
import { useMythicSync } from "./hooks/useMythicSync";
import { DjinnCursorTrail } from "./components/mythic/DjinnCursorTrail";
import { PageTransition } from "./components/mythic/PageTransition";
import { KonamiCodeEasterEgg } from "./components/mythic/EasterEggs";

function App() {
  // Initialize mythic mode state syncing (tail counts, etc.)
  useMythicSync();

  useEffect(() => {
    // Update overdue revisions on app launch
    updateOverdueRevisions();

    // Update overdue revisions every hour
    const interval = setInterval(() => {
      updateOverdueRevisions();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" minH="100vh">
      <Sidebar />
      <Box flex="1" p={8} overflowY="auto">
        <PageTransition>
          <Routes>
            <Route path="/" element={<SubjectsPage />} />
            <Route path="/subjects/:id" element={<SubjectDetailPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/streaks" element={<StreakPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/pomodoro-history" element={<PomodoroHistoryPage />} />
            <Route path="/tags" element={<TagManagementPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/spotify-callback" element={<SpotifyCallbackPage />} />
          </Routes>
        </PageTransition>
      </Box>
      <SpotifyButton />

      {/* Global Mythic Components */}
      <DjinnCursorTrail />
      <KonamiCodeEasterEgg />
    </Box>
  );
}

export default App;
