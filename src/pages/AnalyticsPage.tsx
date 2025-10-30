import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Progress,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";

interface SubjectStats {
  subject_id: number;
  subject_name: string;
  total_minutes: number;
  session_count: number;
}

interface TimeRange {
  total_sessions: number;
  total_minutes: number;
  work_sessions: number;
  break_sessions: number;
}

export default function AnalyticsPage() {
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [todayStats, setTodayStats] = useState<TimeRange>({ total_sessions: 0, total_minutes: 0, work_sessions: 0, break_sessions: 0 });
  const [weekStats, setWeekStats] = useState<TimeRange>({ total_sessions: 0, total_minutes: 0, work_sessions: 0, break_sessions: 0 });
  const [monthStats, setMonthStats] = useState<TimeRange>({ total_sessions: 0, total_minutes: 0, work_sessions: 0, break_sessions: 0 });
  const [allTimeStats, setAllTimeStats] = useState<TimeRange>({ total_sessions: 0, total_minutes: 0, work_sessions: 0, break_sessions: 0 });

  // Dark mode colors
  const bgColor = useColorModeValue("background.main", "#0f0f0f");
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("text.primary", "#ffffff");
  const secondaryTextColor = useColorModeValue("text.secondary", "#b0b0b0");
  const accentColor = useColorModeValue("primary.500", "#1EA896");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    await loadSubjectStats();
    await loadTimeRangeStats();
  }

  async function loadSubjectStats() {
    try {
      const result = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            s.id as subject_id,
            s.name as subject_name,
            SUM(ps.duration_minutes) as total_minutes,
            COUNT(ps.id) as session_count
          FROM pomodoro_sessions ps
          INNER JOIN subjects s ON ps.subject_id = s.id
          WHERE ps.session_type = 'work'
          GROUP BY s.id, s.name
          ORDER BY total_minutes DESC
        `,
        params: [],
      });
      setSubjectStats(result);
    } catch (error) {
      console.error("Error loading subject stats:", error);
    }
  }

  async function loadTimeRangeStats() {
    try {
      // Today
      const today = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            COUNT(*) as total_sessions,
            SUM(duration_minutes) as total_minutes,
            SUM(CASE WHEN session_type = 'work' THEN 1 ELSE 0 END) as work_sessions,
            SUM(CASE WHEN session_type != 'work' THEN 1 ELSE 0 END) as break_sessions
          FROM pomodoro_sessions
          WHERE DATE(completed_at) = DATE('now')
        `,
        params: [],
      });
      if (today.length > 0) {
        setTodayStats({
          total_sessions: today[0].total_sessions || 0,
          total_minutes: today[0].total_minutes || 0,
          work_sessions: today[0].work_sessions || 0,
          break_sessions: today[0].break_sessions || 0,
        });
      }

      // This Week
      const week = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            COUNT(*) as total_sessions,
            SUM(duration_minutes) as total_minutes,
            SUM(CASE WHEN session_type = 'work' THEN 1 ELSE 0 END) as work_sessions,
            SUM(CASE WHEN session_type != 'work' THEN 1 ELSE 0 END) as break_sessions
          FROM pomodoro_sessions
          WHERE DATE(completed_at) >= DATE('now', '-7 days')
        `,
        params: [],
      });
      if (week.length > 0) {
        setWeekStats({
          total_sessions: week[0].total_sessions || 0,
          total_minutes: week[0].total_minutes || 0,
          work_sessions: week[0].work_sessions || 0,
          break_sessions: week[0].break_sessions || 0,
        });
      }

      // This Month
      const month = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            COUNT(*) as total_sessions,
            SUM(duration_minutes) as total_minutes,
            SUM(CASE WHEN session_type = 'work' THEN 1 ELSE 0 END) as work_sessions,
            SUM(CASE WHEN session_type != 'work' THEN 1 ELSE 0 END) as break_sessions
          FROM pomodoro_sessions
          WHERE DATE(completed_at) >= DATE('now', '-30 days')
        `,
        params: [],
      });
      if (month.length > 0) {
        setMonthStats({
          total_sessions: month[0].total_sessions || 0,
          total_minutes: month[0].total_minutes || 0,
          work_sessions: month[0].work_sessions || 0,
          break_sessions: month[0].break_sessions || 0,
        });
      }

      // All Time
      const allTime = await invoke<any[]>("db_select", {
        sql: `
          SELECT
            COUNT(*) as total_sessions,
            SUM(duration_minutes) as total_minutes,
            SUM(CASE WHEN session_type = 'work' THEN 1 ELSE 0 END) as work_sessions,
            SUM(CASE WHEN session_type != 'work' THEN 1 ELSE 0 END) as break_sessions
          FROM pomodoro_sessions
        `,
        params: [],
      });
      if (allTime.length > 0) {
        setAllTimeStats({
          total_sessions: allTime[0].total_sessions || 0,
          total_minutes: allTime[0].total_minutes || 0,
          work_sessions: allTime[0].work_sessions || 0,
          break_sessions: allTime[0].break_sessions || 0,
        });
      }
    } catch (error) {
      console.error("Error loading time range stats:", error);
    }
  }

  function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  function renderStatsCard(title: string, stats: TimeRange) {
    return (
      <Card bg={cardBg}>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {title}
            </Text>
            <SimpleGrid columns={2} spacing={4}>
              <Stat>
                <StatLabel color={secondaryTextColor}>Total Time</StatLabel>
                <StatNumber color={accentColor}>{formatTime(stats.total_minutes)}</StatNumber>
                <StatHelpText>{stats.total_sessions} sessions</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel color={secondaryTextColor}>Sessions</StatLabel>
                <StatNumber color={textColor}>{stats.work_sessions}</StatNumber>
                <StatHelpText>work / {stats.break_sessions} breaks</StatHelpText>
              </Stat>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const maxMinutes = Math.max(...subjectStats.map(s => s.total_minutes), 1);

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <Heading size="xl" color={textColor} mb={8}>
        Study Analytics
      </Heading>

      <Tabs colorScheme="teal" variant="soft-rounded">
        <TabList mb={6}>
          <Tab>Overview</Tab>
          <Tab>By Subject</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {renderStatsCard("Today", todayStats)}
                {renderStatsCard("This Week", weekStats)}
                {renderStatsCard("This Month", monthStats)}
                {renderStatsCard("All Time", allTimeStats)}
              </SimpleGrid>

              {allTimeStats.total_sessions > 0 && (
                <Card bg={cardBg}>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Quick Stats
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color={secondaryTextColor}>Average Session Time</Text>
                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            {formatTime(Math.round(allTimeStats.total_minutes / allTimeStats.total_sessions))}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color={secondaryTextColor}>Daily Average (Last 7 days)</Text>
                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            {formatTime(Math.round(weekStats.total_minutes / 7))}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color={secondaryTextColor}>Total Subjects Studied</Text>
                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            {subjectStats.length}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>

          {/* By Subject Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {subjectStats.length === 0 ? (
                <Card bg={cardBg}>
                  <CardBody>
                    <Text color={secondaryTextColor} textAlign="center">
                      No study sessions recorded yet. Start a pomodoro session to see analytics!
                    </Text>
                  </CardBody>
                </Card>
              ) : (
                subjectStats.map((subject) => (
                  <Card key={subject.subject_id} bg={cardBg}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                            {subject.subject_name}
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                            {formatTime(subject.total_minutes)}
                          </Text>
                        </HStack>
                        <Progress
                          value={(subject.total_minutes / maxMinutes) * 100}
                          colorScheme="teal"
                          size="sm"
                          borderRadius="full"
                        />
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={secondaryTextColor}>
                            {subject.session_count} pomodoro{subject.session_count !== 1 ? "s" : ""}
                          </Text>
                          <Text fontSize="sm" color={secondaryTextColor}>
                            Avg: {formatTime(Math.round(subject.total_minutes / subject.session_count))} per session
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
