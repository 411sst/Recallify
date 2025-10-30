import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Select,
  useColorModeValue,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";

interface PomodoroSession {
  id: number;
  session_type: string;
  duration_minutes: number;
  subject_id: number | null;
  subject_name: string | null;
  completed_at: string;
}

interface GroupedSessions {
  [date: string]: PomodoroSession[];
}

export default function PomodoroHistoryPage() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [filteredSessions, setFilteredSessions] = useState<PomodoroSession[]>([]);

  // Dark mode colors
  const bgColor = useColorModeValue("background.main", "#0f0f0f");
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("text.primary", "#ffffff");
  const secondaryTextColor = useColorModeValue("text.secondary", "#b0b0b0");
  const dateBg = useColorModeValue("gray.50", "#252525");

  useEffect(() => {
    loadSessions();
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId === null) {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(s => s.subject_id === selectedSubjectId));
    }
  }, [selectedSubjectId, sessions]);

  async function loadSessions() {
    try {
      const result = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            ps.id,
            ps.session_type,
            ps.duration_minutes,
            ps.subject_id,
            s.name as subject_name,
            ps.completed_at
          FROM pomodoro_sessions ps
          LEFT JOIN subjects s ON ps.subject_id = s.id
          ORDER BY ps.completed_at DESC
        `,
        params: [],
      });
      setSessions(result);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }

  async function loadSubjects() {
    try {
      const result = await invoke<any[]>("db_select", {
        sql: "SELECT id, name FROM subjects ORDER BY name ASC",
        params: [],
      });
      setSubjects(result);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const yesterdayOnly = yesterday.toDateString();

    if (dateOnly === todayOnly) {
      return "Today";
    } else if (dateOnly === yesterdayOnly) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function groupSessionsByDate(sessions: PomodoroSession[]): GroupedSessions {
    const grouped: GroupedSessions = {};
    sessions.forEach((session) => {
      const date = new Date(session.completed_at).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    return grouped;
  }

  function getSessionBadgeColor(sessionType: string): string {
    if (sessionType === "work") return "teal";
    if (sessionType === "short_break") return "blue";
    if (sessionType === "long_break") return "purple";
    return "gray";
  }

  function getSessionLabel(sessionType: string): string {
    if (sessionType === "work") return "Work";
    if (sessionType === "short_break") return "Short Break";
    if (sessionType === "long_break") return "Long Break";
    return sessionType;
  }

  function calculateDailyTotal(sessions: PomodoroSession[]): number {
    return sessions
      .filter(s => s.session_type === "work")
      .reduce((sum, s) => sum + s.duration_minutes, 0);
  }

  const groupedSessions = groupSessionsByDate(filteredSessions);
  const dates = Object.keys(groupedSessions);

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between" align="center">
          <Heading size="xl" color={textColor}>
            Pomodoro History
          </Heading>
          <Select
            w="250px"
            value={selectedSubjectId ?? "all"}
            onChange={(e) => setSelectedSubjectId(e.target.value === "all" ? null : Number(e.target.value))}
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>
        </HStack>

        {dates.length === 0 ? (
          <Card bg={cardBg}>
            <CardBody>
              <Text color={secondaryTextColor} textAlign="center">
                No pomodoro sessions found. Start a session to build your history!
              </Text>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={6} align="stretch">
            {dates.map((date) => {
              const daySessions = groupedSessions[date];
              const dailyTotal = calculateDailyTotal(daySessions);

              return (
                <Box key={date}>
                  <HStack
                    justify="space-between"
                    bg={dateBg}
                    p={3}
                    borderRadius="md"
                    mb={3}
                  >
                    <Text fontWeight="bold" color={textColor}>
                      {formatDate(daySessions[0].completed_at)}
                    </Text>
                    {dailyTotal > 0 && (
                      <Badge colorScheme="teal" fontSize="sm">
                        {dailyTotal} min study time
                      </Badge>
                    )}
                  </HStack>

                  <VStack spacing={2} align="stretch">
                    {daySessions.map((session) => (
                      <Card key={session.id} bg={cardBg} size="sm">
                        <CardBody>
                          <HStack justify="space-between" align="center">
                            <HStack spacing={3}>
                              <Badge colorScheme={getSessionBadgeColor(session.session_type)}>
                                {getSessionLabel(session.session_type)}
                              </Badge>
                              {session.subject_name && (
                                <Text fontSize="sm" color={textColor}>
                                  {session.subject_name}
                                </Text>
                              )}
                            </HStack>
                            <HStack spacing={4}>
                              <Text fontSize="sm" color={secondaryTextColor}>
                                {session.duration_minutes} min
                              </Text>
                              <Text fontSize="sm" color={secondaryTextColor}>
                                {formatTime(session.completed_at)}
                              </Text>
                            </HStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}

        {filteredSessions.length > 0 && (
          <Card bg={cardBg}>
            <CardBody>
              <Stack direction={{ base: "column", md: "row" }} spacing={6} justify="space-around">
                <Box textAlign="center">
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Total Sessions
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                    {filteredSessions.length}
                  </Text>
                </Box>
                <Divider orientation="vertical" />
                <Box textAlign="center">
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Work Sessions
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                    {filteredSessions.filter(s => s.session_type === "work").length}
                  </Text>
                </Box>
                <Divider orientation="vertical" />
                <Box textAlign="center">
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Total Study Time
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                    {filteredSessions
                      .filter(s => s.session_type === "work")
                      .reduce((sum, s) => sum + s.duration_minutes, 0)}{" "}
                    min
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
}
