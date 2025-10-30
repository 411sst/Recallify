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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { format, subMonths } from "date-fns";
import { getDailyActivities, calculateStreaks, updateDailyActivity } from "../services/database";
import CalendarHeatmap from "../components/CalendarHeatmap";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

interface MilestoneData {
  milestone: number;
  title: string;
  message: string;
  emoji: string;
}

const MILESTONES: MilestoneData[] = [
  { milestone: 7, title: "First Week!", emoji: "🎉", message: "You've studied for 7 consecutive days! Keep up the great work!" },
  { milestone: 14, title: "Two Weeks!", emoji: "🔥", message: "14 days in a row! You're building a solid habit!" },
  { milestone: 30, title: "One Month!", emoji: "⭐", message: "30 days! You're unstoppable! This is becoming a lifestyle!" },
  { milestone: 50, title: "50 Days!", emoji: "💪", message: "50 days straight! You're in the top 5% of learners!" },
  { milestone: 100, title: "100 Days!", emoji: "🏆", message: "WOW! 100 days! You're a studying legend!" },
  { milestone: 180, title: "Half Year!", emoji: "🎊", message: "180 days! Half a year of dedication! Absolutely incredible!" },
  { milestone: 365, title: "One Year!", emoji: "👑", message: "365 days! A FULL YEAR! You've achieved mastery in consistency!" },
];

export default function StreakPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, totalActiveDays: 0 });
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [lastCelebrated, setLastCelebrated] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneData | null>(null);

  // Dark mode colors
  const bgColor = useColorModeValue("background.main", "#0f0f0f");
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("text.primary", "#ffffff");
  const secondaryTextColor = useColorModeValue("text.secondary", "#b0b0b0");
  const accentColor = useColorModeValue("primary.500", "#1EA896");
  const fireColor = useColorModeValue("orange.500", "#ff6b35");

  useEffect(() => {
    loadData();
  }, [selectedMonths]);

  async function loadData() {
    try {
      // Update today's activity
      const today = format(new Date(), "yyyy-MM-dd");
      await updateDailyActivity(today);

      // Load activities for the selected time range
      const startDate = format(subMonths(new Date(), selectedMonths), "yyyy-MM-dd");
      const endDate = format(new Date(), "yyyy-MM-dd");
      const activitiesData = await getDailyActivities(startDate, endDate);
      setActivities(activitiesData);

      // Calculate streaks
      const streaks = await calculateStreaks();
      setStreakData(streaks);

      // Check for milestone celebration
      checkMilestone(streaks.currentStreak);
    } catch (error) {
      console.error("Error loading streak data:", error);
    }
  }

  function checkMilestone(currentStreak: number) {
    // Find if current streak matches any milestone
    const milestone = MILESTONES.find(m => m.milestone === currentStreak);

    if (milestone && currentStreak > lastCelebrated) {
      setCurrentMilestone(milestone);
      setLastCelebrated(currentStreak);
      onOpen();
    }
  }

  function getStreakEmoji(streak: number): string {
    if (streak === 0) return "💤";
    if (streak < 7) return "🌱";
    if (streak < 30) return "🔥";
    if (streak < 100) return "⚡";
    return "👑";
  }

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <VStack align="stretch" spacing={8}>
        <HStack justify="space-between" align="center">
          <Heading size="xl" color={textColor}>
            Study Streaks
          </Heading>
        </HStack>

        {/* Streak Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Current Streak</StatLabel>
                <HStack>
                  <StatNumber fontSize="5xl" color={fireColor}>
                    {streakData.currentStreak}
                  </StatNumber>
                  <Text fontSize="4xl">{getStreakEmoji(streakData.currentStreak)}</Text>
                </HStack>
                <StatHelpText color={secondaryTextColor}>
                  {streakData.currentStreak === 0 ? "Start studying today!" : "consecutive days"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Longest Streak</StatLabel>
                <StatNumber fontSize="5xl" color={accentColor}>
                  {streakData.longestStreak}
                </StatNumber>
                <StatHelpText color={secondaryTextColor}>
                  {streakData.longestStreak === streakData.currentStreak ? "All-time record!" : "personal record"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color={secondaryTextColor}>Total Active Days</StatLabel>
                <StatNumber fontSize="5xl" color={textColor}>
                  {streakData.totalActiveDays}
                </StatNumber>
                <StatHelpText color={secondaryTextColor}>
                  days studied
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Milestones */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Milestones
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                {MILESTONES.map((milestone) => (
                  <Badge
                    key={milestone.milestone}
                    size="lg"
                    p={3}
                    borderRadius="lg"
                    colorScheme={streakData.currentStreak >= milestone.milestone ? "green" : "gray"}
                    fontSize="sm"
                  >
                    <VStack spacing={1}>
                      <Text fontSize="2xl">{milestone.emoji}</Text>
                      <Text fontWeight="bold">{milestone.milestone} days</Text>
                    </VStack>
                  </Badge>
                ))}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Calendar Heatmap */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Activity Calendar
                </Text>
                <Tabs
                  size="sm"
                  variant="soft-rounded"
                  colorScheme="teal"
                  index={selectedMonths === 3 ? 0 : selectedMonths === 6 ? 1 : 2}
                  onChange={(index) => setSelectedMonths(index === 0 ? 3 : index === 1 ? 6 : 12)}
                >
                  <TabList>
                    <Tab>3 months</Tab>
                    <Tab>6 months</Tab>
                    <Tab>12 months</Tab>
                  </TabList>
                </Tabs>
              </HStack>
              <Box overflowX="auto">
                <CalendarHeatmap activities={activities} monthsToShow={selectedMonths} />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Tips */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                How to Maintain Your Streak
              </Text>
              <Text color={secondaryTextColor} fontSize="sm">
                🍅 Complete at least one pomodoro session, OR
              </Text>
              <Text color={secondaryTextColor} fontSize="sm">
                📝 Create at least one study log entry
              </Text>
              <Text color={secondaryTextColor} fontSize="sm" fontStyle="italic">
                Pro tip: Study at the same time each day to build a consistent habit!
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Milestone Celebration Modal */}
      {currentMilestone && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg={cardBg}>
            <ModalHeader textAlign="center" fontSize="3xl" color={textColor}>
              🎉 {currentMilestone.title} 🎉
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Text fontSize="6xl">{currentMilestone.emoji}</Text>
                <Text fontSize="xl" textAlign="center" color={textColor}>
                  {currentMilestone.message}
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color={fireColor}>
                  {currentMilestone.milestone} Day Streak!
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button colorScheme="teal" size="lg" onClick={onClose}>
                Keep Going! 🚀
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
