import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  HStack,
  VStack,
  Text,
  Circle,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { sendNotification } from "@tauri-apps/api/notification";
import { format } from "date-fns";
import { updateDailyActivity, calculateStreaks, checkAndRecordMilestone, markMilestoneShown } from "../services/database";
import CelebrationModal from "../components/CelebrationModal";

interface PomodoroState {
  session_type: "work" | "short_break" | "long_break";
  remaining_seconds: number;
  is_running: number;
  pomodoro_count: number;
}

export default function PomodoroPage() {
  const [state, setState] = useState<PomodoroState>({
    session_type: "work",
    remaining_seconds: 1500,
    is_running: 0,
    pomodoro_count: 0,
  });
  const [longBreakDuration, setLongBreakDuration] = useState(20);
  const [autoStartCountdown, setAutoStartCountdown] = useState(0);
  const [nextSessionType, setNextSessionType] = useState<"work" | "short_break" | "long_break" | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAutoStartOpen,
    onOpen: onAutoStartOpen,
    onClose: onAutoStartClose,
  } = useDisclosure();
  const {
    isOpen: isSubjectSelectOpen,
    onOpen: onSubjectSelectOpen,
    onClose: onSubjectSelectClose,
  } = useDisclosure();
  const {
    isOpen: isCelebrationOpen,
    onOpen: onCelebrationOpen,
    onClose: onCelebrationClose,
  } = useDisclosure();
  const [celebrationMilestone, setCelebrationMilestone] = useState<number | null>(null);
  const toast = useToast();

  // Dark mode colors
  const circleBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("#0A122A", "#ffffff");
  const secondaryTextColor = useColorModeValue("#2F2F2F", "#b0b0b0");
  const workBorderColor = useColorModeValue("primary.500", "#1EA896");
  const breakBorderColor = useColorModeValue("teal.500", "#2DD4BF");
  const pageBg = useColorModeValue("transparent", "#0f0f0f");
  const breakPageBg = useColorModeValue("teal.50", "#1a2f2c");
  const hoverBg = useColorModeValue("gray.50", "#252525");

  useEffect(() => {
    loadPomodoroState();
    loadSubjects();
  }, []);

  useEffect(() => {
    if (state.is_running) {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.is_running]);

  // Auto-start countdown effect
  useEffect(() => {
    if (autoStartCountdown > 0) {
      const timeout = setTimeout(() => {
        setAutoStartCountdown(autoStartCountdown - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (autoStartCountdown === 0 && nextSessionType && isAutoStartOpen) {
      // Countdown finished, start next session
      handleAutoStart();
    }
  }, [autoStartCountdown, nextSessionType, isAutoStartOpen]);

  async function loadPomodoroState() {
    try {
      const result = await invoke<any[]>("db_select", {
        sql: "SELECT * FROM pomodoro_state WHERE id = 1",
        params: [],
      });
      if (result.length > 0) {
        const dbState = result[0];
        setState({
          session_type: dbState.session_type,
          remaining_seconds: dbState.remaining_seconds,
          is_running: dbState.is_running,
          pomodoro_count: dbState.pomodoro_count,
        });
      }
    } catch (error) {
      console.error("Error loading pomodoro state:", error);
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

  async function tick() {
    try {
      const result = await invoke<any[]>("db_select", {
        sql: "SELECT remaining_seconds FROM pomodoro_state WHERE id = 1",
        params: [],
      });

      const remaining = result[0].remaining_seconds - 1;

      if (remaining <= 0) {
        await completeSession();
      } else {
        await invoke("db_execute", {
          sql: "UPDATE pomodoro_state SET remaining_seconds = ? WHERE id = 1",
          params: [remaining],
        });
        setState((prev) => ({ ...prev, remaining_seconds: remaining }));
      }
    } catch (error) {
      console.error("Error ticking timer:", error);
    }
  }

  function handleStartTimer() {
    // If starting a work session, require subject selection
    if (state.session_type === "work" && !selectedSubjectId) {
      onSubjectSelectOpen();
    } else {
      startTimer();
    }
  }

  async function startTimer() {
    try {
      await invoke("db_execute", {
        sql: "UPDATE pomodoro_state SET is_running = 1, start_timestamp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        params: [Date.now()],
      });
      setState((prev) => ({ ...prev, is_running: 1 }));
    } catch (error) {
      toast({
        title: "Error starting timer",
        status: "error",
        duration: 3000,
      });
    }
  }

  function handleSubjectSelect(subjectId: number, subjectName: string) {
    setSelectedSubjectId(subjectId);
    setSelectedSubjectName(subjectName);
    onSubjectSelectClose();
    startTimer();
  }

  async function pauseTimer() {
    try {
      await invoke("db_execute", {
        sql: "UPDATE pomodoro_state SET is_running = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        params: [],
      });
      setState((prev) => ({ ...prev, is_running: 0 }));
    } catch (error) {
      toast({
        title: "Error pausing timer",
        status: "error",
        duration: 3000,
      });
    }
  }

  async function resetTimer() {
    try {
      // Reset entire session: back to work mode with 25 minutes and reset counter
      await invoke("db_execute", {
        sql: "UPDATE pomodoro_state SET session_type = 'work', remaining_seconds = 1500, duration_seconds = 1500, is_running = 0, pomodoro_count = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        params: [],
      });
      setState({
        session_type: "work",
        remaining_seconds: 1500,
        is_running: 0,
        pomodoro_count: 0,
      });
      // Clear selected subject when resetting
      setSelectedSubjectId(null);
      setSelectedSubjectName("");
      toast({
        title: "Session reset",
        description: "Timer reset to beginning. Ready to start fresh!",
        status: "info",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error resetting timer",
        status: "error",
        duration: 3000,
      });
    }
  }

  async function completeSession() {
    try {
      // CRITICAL: Stop the timer immediately to prevent infinite loop
      // This prevents tick() from calling completeSession() again and again
      await invoke("db_execute", {
        sql: "UPDATE pomodoro_state SET is_running = 0 WHERE id = 1",
        params: [],
      });
      setState((prev) => ({ ...prev, is_running: 0 }));

      // Play sound (simplified)
      playSound();

      // Save completed session
      const durationMinutes = state.session_type === "work" ? 25 : state.session_type === "short_break" ? 5 : longBreakDuration;
      await invoke("db_execute", {
        sql: "INSERT INTO pomodoro_sessions (session_type, duration_minutes, subject_id) VALUES (?, ?, ?)",
        params: [state.session_type, durationMinutes, state.session_type === "work" ? selectedSubjectId : null],
      });

      const isWorkComplete = state.session_type === "work";

      // Check for milestone celebration after work session
      if (isWorkComplete) {
        const today = format(new Date(), "yyyy-MM-dd");
        await updateDailyActivity(today);
        const streaks = await calculateStreaks();
        const milestoneCheck = await checkAndRecordMilestone(streaks.currentStreak);

        if (milestoneCheck && milestoneCheck.shouldCelebrate) {
          // Show celebration modal
          setCelebrationMilestone(milestoneCheck.milestone);
          onCelebrationOpen();
        }
      }

      const title = isWorkComplete ? "🎉 Pomodoro Complete!" : "☕ Break Over!";
      const body = isWorkComplete ? "Time for a break!" : "Ready to focus?";

      // Send system notification
      await sendNotification({ title, body });

      // Flash browser tab title
      flashTabTitle(title);

      // Show toast notification
      toast({
        title,
        description: body,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      // Determine next session and trigger auto-start
      if (state.session_type === "work") {
        const newCount = state.pomodoro_count + 1;
        if (newCount === 4) {
          // Show long break modal (user must choose)
          onOpen();
        } else {
          // Trigger auto-start for short break
          setNextSessionType("short_break");
          setAutoStartCountdown(5);
          onAutoStartOpen();
        }
      } else {
        // Trigger auto-start for work session
        setNextSessionType("work");
        setAutoStartCountdown(5);
        onAutoStartOpen();
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }

  function flashTabTitle(message: string) {
    const originalTitle = document.title;
    let flashCount = 0;
    const maxFlashes = 6;

    const interval = setInterval(() => {
      document.title = flashCount % 2 === 0 ? message : originalTitle;
      flashCount++;

      if (flashCount >= maxFlashes) {
        clearInterval(interval);
        document.title = originalTitle;
      }
    }, 1000);
  }

  async function handleAutoStart() {
    onAutoStartClose();
    if (nextSessionType === "work") {
      await transitionToWork();
      await startTimer();
    } else if (nextSessionType === "short_break") {
      const newCount = state.pomodoro_count + 1;
      await transitionToBreak("short_break", newCount);
      await startTimer();
    }
    setNextSessionType(null);
  }

  function handleCancelAutoStart() {
    setAutoStartCountdown(0);
    setNextSessionType(null);
    onAutoStartClose();
  }

  async function transitionToBreak(breakType: "short_break" | "long_break", count: number) {
    const duration = breakType === "short_break" ? 300 : longBreakDuration * 60;
    await invoke("db_execute", {
      sql: "UPDATE pomodoro_state SET session_type = ?, remaining_seconds = ?, duration_seconds = ?, is_running = 0, pomodoro_count = ? WHERE id = 1",
      params: [breakType, duration, duration, count],
    });
    setState({
      session_type: breakType,
      remaining_seconds: duration,
      is_running: 0,
      pomodoro_count: count,
    });
  }

  async function transitionToWork() {
    await invoke("db_execute", {
      sql: "UPDATE pomodoro_state SET session_type = 'work', remaining_seconds = 1500, duration_seconds = 1500, is_running = 0 WHERE id = 1",
      params: [],
    });
    setState({
      session_type: "work",
      remaining_seconds: 1500,
      is_running: 0,
      pomodoro_count: state.session_type === "long_break" ? 0 : state.pomodoro_count,
    });
  }

  async function handleLongBreak() {
    await transitionToBreak("long_break", 4);
    onClose();
  }

  async function skipLongBreak() {
    await transitionToWork();
    onClose();
  }

  function playSound() {
    try {
      const audio = new Audio("/timer-complete.mp3");
      // Increased volume to 80% (from 50%) for better audibility
      // Loud enough to hear from across the room but not jarring
      audio.volume = 0.8;
      audio.play().catch(() => console.log("Sound play failed"));
    } catch (error) {
      console.log("Sound not available");
    }
  }

  const minutes = Math.floor(state.remaining_seconds / 60);
  const seconds = state.remaining_seconds % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const sessionLabel =
    state.session_type === "work"
      ? `Pomodoro ${state.pomodoro_count}/4`
      : state.session_type === "short_break"
      ? "Short Break"
      : "Long Break";

  const bgColor = state.session_type === "work" ? pageBg : breakPageBg;

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <Heading size="xl" color={textColor} mb={8}>
        🍅 Pomodoro Timer
      </Heading>

      <VStack spacing={8} maxW="600px" mx="auto">
        <Circle size="300px" bg={circleBg} boxShadow="lg" border="8px solid" borderColor={state.session_type === "work" ? workBorderColor : breakBorderColor}>
          <VStack>
            <Text fontSize="6xl" fontWeight="bold" fontFamily="monospace" color={textColor}>
              {displayTime}
            </Text>
            <Text fontSize="xl" color={secondaryTextColor}>
              {sessionLabel}
            </Text>
          </VStack>
        </Circle>

        {selectedSubjectName && state.session_type === "work" && (
          <Text fontSize="lg" color={textColor} fontWeight="semibold">
            📖 {selectedSubjectName}
          </Text>
        )}

        <HStack spacing={4}>
          {state.is_running === 0 ? (
            <Button onClick={handleStartTimer} size="lg" px={12}>
              {state.remaining_seconds === (state.session_type === "work" ? 1500 : state.session_type === "short_break" ? 300 : longBreakDuration * 60) ? "Start" : "Resume"}
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="lg" px={12} colorScheme="orange">
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" size="lg">
            Reset
          </Button>
        </HStack>

        <Text fontSize="md" color={secondaryTextColor}>
          Completed: {state.pomodoro_count}/4 Pomodoros
        </Text>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🎉 Great Work!</ModalHeader>
          <ModalBody>
            <Text mb={4}>You've completed 4 Pomodoros! Time for a well-deserved long break.</Text>
            <FormControl>
              <FormLabel>Break Duration (minutes)</FormLabel>
              <Input type="number" value={longBreakDuration} onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 20)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={skipLongBreak}>
              Skip Break
            </Button>
            <Button onClick={handleLongBreak}>Start Break</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Auto-Start Modal */}
      <Modal isOpen={isAutoStartOpen} onClose={handleCancelAutoStart} isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent>
          <ModalHeader textAlign="center">
            {state.session_type === "work" ? "✓ Study Session Complete!" : "☕ Break Over!"}
          </ModalHeader>
          <ModalBody>
            <VStack spacing={6}>
              <Text fontSize="lg" textAlign="center">
                {state.session_type === "work"
                  ? "🎉 Great work! You completed 25 minutes."
                  : "Ready to focus?"}
              </Text>

              <Box textAlign="center">
                <Text fontSize="6xl" fontWeight="bold" color="primary.500">
                  {autoStartCountdown}
                </Text>
                <Text fontSize="md" color="text.tertiary">
                  {nextSessionType === "work"
                    ? "Study session starting in..."
                    : "5-minute break starting in..."}
                </Text>
              </Box>

              <Text fontSize="sm" color="text.secondary" textAlign="center">
                {nextSessionType === "work"
                  ? "Get ready to focus on your next study session"
                  : "Time for a well-deserved break!"}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center" gap={3}>
            <Button
              variant="outline"
              onClick={handleCancelAutoStart}
              size="lg"
            >
              Cancel Auto-Start
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                setAutoStartCountdown(0);
              }}
              size="lg"
            >
              {nextSessionType === "work" ? "Start Now" : "Start Break Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Subject Selection Modal */}
      <Modal isOpen={isSubjectSelectOpen} onClose={onSubjectSelectClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Subject</ModalHeader>
          <ModalBody>
            <Text mb={4} color={secondaryTextColor}>
              Choose the subject you'll be studying during this pomodoro session:
            </Text>
            <VStack spacing={2} align="stretch">
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id, subject.name)}
                  variant="outline"
                  justifyContent="flex-start"
                  _hover={{ bg: hoverBg }}
                >
                  📖 {subject.name}
                </Button>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onSubjectSelectClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Milestone Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        milestone={celebrationMilestone}
        onClose={async () => {
          if (celebrationMilestone) {
            await markMilestoneShown(celebrationMilestone);
          }
          setCelebrationMilestone(null);
          onCelebrationClose();
        }}
      />
    </Box>
  );
}
