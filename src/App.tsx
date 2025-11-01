import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import PomodoroPage from "./pages/PomodoroPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PomodoroHistoryPage from "./pages/PomodoroHistoryPage";
import CalendarPage from "./pages/CalendarPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import { updateOverdueRevisions } from "./services/database";

function App() {
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
        <Routes>
          <Route path="/" element={<SubjectsPage />} />
          <Route path="/subjects/:id" element={<SubjectDetailPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/pomodoro-history" element={<PomodoroHistoryPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
