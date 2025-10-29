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
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { sendNotification } from "@tauri-apps/api/notification";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadPomodoroState();
  }, []);

  useEffect(() => {
    if (state.is_running) {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.is_running]);

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
      const duration = state.session_type === "work" ? 1500 : state.session_type === "short_break" ? 300 : longBreakDuration * 60;
      await invoke("db_execute", {
        sql: "UPDATE pomodoro_state SET remaining_seconds = ?, is_running = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        params: [duration],
      });
      setState((prev) => ({ ...prev, remaining_seconds: duration, is_running: 0 }));
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
      // Play sound (simplified)
      playSound();

      // Save completed session
      const durationMinutes = state.session_type === "work" ? 25 : state.session_type === "short_break" ? 5 : longBreakDuration;
      await invoke("db_execute", {
        sql: "INSERT INTO pomodoro_sessions (session_type, duration_minutes) VALUES (?, ?)",
        params: [state.session_type, durationMinutes],
      });

      // Send notification
      await sendNotification({
        title: state.session_type === "work" ? "Pomodoro Complete!" : "Break Over!",
        body: state.session_type === "work" ? "Time for a break!" : "Ready to focus?",
      });

      // Determine next session
      if (state.session_type === "work") {
        const newCount = state.pomodoro_count + 1;
        if (newCount === 4) {
          // Show long break modal
          onOpen();
        } else {
          await transitionToBreak("short_break", newCount);
        }
      } else {
        await transitionToWork();
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
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
      audio.volume = 0.5;
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

  const bgColor = state.session_type === "work" ? "transparent" : "teal.50";

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <Heading size="xl" color="text.primary" mb={8}>
        🍅 Pomodoro Timer
      </Heading>

      <VStack spacing={8} maxW="600px" mx="auto">
        <Circle size="300px" bg="white" boxShadow="lg" border="8px solid" borderColor={state.session_type === "work" ? "primary.500" : "teal.500"}>
          <VStack>
            <Text fontSize="6xl" fontWeight="bold" fontFamily="monospace" color="text.primary">
              {displayTime}
            </Text>
            <Text fontSize="xl" color="text.secondary">
              {sessionLabel}
            </Text>
          </VStack>
        </Circle>

        <HStack spacing={4}>
          {state.is_running === 0 ? (
            <Button onClick={startTimer} size="lg" px={12}>
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

        <Text fontSize="md" color="text.tertiary">
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
    </Box>
  );
}
