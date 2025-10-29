import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  HStack,
  Tag,
  Text,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { getSettings, updateSetting } from "../services/database";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const [intervals, setIntervals] = useState<number[]>([3, 7]);
  const [intervalInput, setIntervalInput] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState("10:00");

  // Pomodoro settings
  const [pomodoroWorkDuration, setPomodoroWorkDuration] = useState(25);
  const [pomodoroShortBreak, setPomodoroShortBreak] = useState(5);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(20);
  const [pomodoroSoundEnabled, setPomodoroSoundEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const toast = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await getSettings();

      if (settings.default_intervals) {
        setIntervals(settings.default_intervals.split(",").map(Number));
      }

      if (settings.notification_enabled) {
        setNotificationEnabled(settings.notification_enabled === "true");
      }

      if (settings.notification_time) {
        setNotificationTime(settings.notification_time);
      }

      // Load Pomodoro settings
      if (settings.pomodoro_work_duration) {
        setPomodoroWorkDuration(parseInt(settings.pomodoro_work_duration));
      }
      if (settings.pomodoro_short_break) {
        setPomodoroShortBreak(parseInt(settings.pomodoro_short_break));
      }
      if (settings.pomodoro_long_break_default) {
        setPomodoroLongBreak(parseInt(settings.pomodoro_long_break_default));
      }
      if (settings.pomodoro_sound_enabled) {
        setPomodoroSoundEnabled(settings.pomodoro_sound_enabled === "true");
      }
    } catch (error) {
      toast({
        title: "Error loading settings",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleSaveSettings() {
    try {
      setLoading(true);

      await updateSetting("default_intervals", intervals.join(","));
      await updateSetting("notification_enabled", notificationEnabled.toString());
      await updateSetting("notification_time", notificationTime);

      // Save Pomodoro settings
      await updateSetting("pomodoro_work_duration", pomodoroWorkDuration.toString());
      await updateSetting("pomodoro_short_break", pomodoroShortBreak.toString());
      await updateSetting("pomodoro_long_break_default", pomodoroLongBreak.toString());
      await updateSetting("pomodoro_sound_enabled", pomodoroSoundEnabled.toString());

      toast({
        title: "Settings saved",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  function addInterval() {
    const interval = parseInt(intervalInput);
    if (isNaN(interval) || interval < 1 || interval > 365) {
      toast({
        title: "Invalid interval",
        description: "Interval must be between 1 and 365 days",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (intervals.includes(interval)) {
      toast({
        title: "Duplicate interval",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIntervals([...intervals, interval].sort((a, b) => a - b));
    setIntervalInput("");
  }

  function removeInterval(interval: number) {
    if (intervals.length === 1) {
      toast({
        title: "At least one interval required",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setIntervals(intervals.filter((i) => i !== interval));
  }

  return (
    <Box>
      <Heading size="xl" color="text.primary" mb={8}>
        Settings
      </Heading>

      <VStack spacing={6} align="stretch" maxW="800px">
        {/* Appearance */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Appearance
            </Heading>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" flex="1">
                Dark Mode
              </FormLabel>
              <Switch colorScheme="primary" isChecked={isDarkMode} onChange={toggleTheme} />
            </FormControl>
            <Text fontSize="sm" color="text.tertiary" mt={2}>
              Reduce eye strain in low-light environments
            </Text>
          </CardBody>
        </Card>

        {/* Revision Defaults */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Revision Defaults
            </Heading>

            <FormControl>
              <FormLabel>Default Intervals (days)</FormLabel>
              <HStack mb={3}>
                <Input
                  type="number"
                  placeholder="e.g., 14"
                  value={intervalInput}
                  onChange={(e) => setIntervalInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addInterval();
                    }
                  }}
                />
                <Button onClick={addInterval}>Add</Button>
              </HStack>

              <HStack wrap="wrap" mb={3}>
                {intervals.map((interval) => (
                  <Tag
                    key={interval}
                    size="lg"
                    colorScheme="primary"
                    cursor="pointer"
                    onClick={() => removeInterval(interval)}
                  >
                    Day {interval} ×
                  </Tag>
                ))}
              </HStack>

              <Text fontSize="sm" color="text.tertiary">
                These intervals will be used for new study entries. Click to remove.
              </Text>
            </FormControl>
          </CardBody>
        </Card>

        {/* Pomodoro Timer */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Pomodoro Timer
            </Heading>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Work Duration (minutes)</FormLabel>
                <Input
                  type="number"
                  value={pomodoroWorkDuration}
                  onChange={(e) => setPomodoroWorkDuration(parseInt(e.target.value) || 25)}
                  min={1}
                  max={60}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Short Break (minutes)</FormLabel>
                <Input
                  type="number"
                  value={pomodoroShortBreak}
                  onChange={(e) => setPomodoroShortBreak(parseInt(e.target.value) || 5)}
                  min={1}
                  max={30}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Default Long Break (minutes)</FormLabel>
                <Input
                  type="number"
                  value={pomodoroLongBreak}
                  onChange={(e) => setPomodoroLongBreak(parseInt(e.target.value) || 20)}
                  min={1}
                  max={60}
                />
                <Text fontSize="sm" color="text.tertiary" mt={1}>
                  You can customize each time
                </Text>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" flex="1">
                  Enable timer sounds
                </FormLabel>
                <Switch
                  colorScheme="primary"
                  isChecked={pomodoroSoundEnabled}
                  onChange={(e) => setPomodoroSoundEnabled(e.target.checked)}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Notifications
            </Heading>

            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" flex="1">
                  Enable daily notifications
                </FormLabel>
                <Switch
                  colorScheme="primary"
                  isChecked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                />
              </FormControl>

              <FormControl isDisabled={!notificationEnabled}>
                <FormLabel>Notification Time</FormLabel>
                <Input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                />
                <Text fontSize="sm" color="text.tertiary" mt={2}>
                  You'll receive a notification at this time if you have revisions due.
                </Text>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* About */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              About
            </Heading>

            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold" color="text.primary">
                Recallify v1.2
              </Text>
              <Text color="text.tertiary" fontSize="sm">
                A desktop application for optimized learning through spaced repetition
              </Text>
              <Divider my={2} />
              <Text fontSize="sm" color="text.tertiary">
                Built with Tauri + React + TypeScript
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Save Button */}
        <Button size="lg" onClick={handleSaveSettings} isLoading={loading} loadingText="Saving...">
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
}
