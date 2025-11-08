import { Box, Text, HStack, VStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { format, eachDayOfInterval, subMonths } from "date-fns";

interface DailyActivity {
  activity_date: string;
  study_minutes: number;
  pomodoro_count: number;
  entry_count: number;
}

interface CalendarHeatmapProps {
  activities: DailyActivity[];
  monthsToShow?: number;
}

export default function CalendarHeatmap({ activities, monthsToShow = 6 }: CalendarHeatmapProps) {
  const cellSize = 12;
  const cellGap = 3;

  // Use theme CSS variables for heatmap colors
  const emptyColor = "var(--theme-heatmap-none)";
  const level0Color = "var(--theme-heatmap-low)";
  const level1Color = "var(--theme-heatmap-medium)";
  const level2Color = "var(--theme-heatmap-medium)";
  const level3Color = "var(--theme-heatmap-high)";
  const textColor = "var(--theme-text-tertiary)";
  const tooltipBg = useColorModeValue("gray.700", "gray.100");
  const tooltipColor = useColorModeValue("white", "gray.800");

  // Create a map of activity_date -> study_minutes
  const activityMap = new Map<string, number>();
  activities.forEach(activity => {
    activityMap.set(activity.activity_date, activity.study_minutes);
  });

  // Get the date range
  const endDate = new Date();
  const startDate = subMonths(endDate, monthsToShow);

  // Get all days in range
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Group by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || index === allDays.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    if (day.getDay() === 6 && index < allDays.length - 1) {
      // Start new week on Sunday
    }
  });

  function getColorForMinutes(minutes: number): string {
    if (minutes === 0) return emptyColor;
    if (minutes < 30) return level0Color;
    if (minutes < 60) return level1Color;
    if (minutes < 120) return level2Color;
    return level3Color;
  }

  function formatTooltip(day: Date, minutes: number): string {
    const dateStr = format(day, "MMMM d, yyyy");
    if (minutes === 0) {
      return `${dateStr}\nNo activity`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    return `${dateStr}\n${timeStr} studied`;
  }

  return (
    <Box>
      <HStack spacing={`${cellGap}px`} align="start" overflowX="auto" pb={4}>
        {weeks.map((week, weekIndex) => (
          <VStack key={weekIndex} spacing={`${cellGap}px`} align="start">
            {week.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const minutes = activityMap.get(dateStr) || 0;
              const color = getColorForMinutes(minutes);

              return (
                <Tooltip
                  key={dateStr}
                  label={formatTooltip(day, minutes)}
                  placement="top"
                  bg={tooltipBg}
                  color={tooltipColor}
                  hasArrow
                >
                  <Box
                    width={`${cellSize}px`}
                    height={`${cellSize}px`}
                    bg={color}
                    borderRadius="2px"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  />
                </Tooltip>
              );
            })}
          </VStack>
        ))}
      </HStack>

      {/* Legend */}
      <HStack spacing={2} mt={4} fontSize="xs" color={textColor}>
        <Text>Less</Text>
        <Box width={`${cellSize}px`} height={`${cellSize}px`} bg={emptyColor} borderRadius="2px" />
        <Box width={`${cellSize}px`} height={`${cellSize}px`} bg={level0Color} borderRadius="2px" />
        <Box width={`${cellSize}px`} height={`${cellSize}px`} bg={level1Color} borderRadius="2px" />
        <Box width={`${cellSize}px`} height={`${cellSize}px`} bg={level2Color} borderRadius="2px" />
        <Box width={`${cellSize}px`} height={`${cellSize}px`} bg={level3Color} borderRadius="2px" />
        <Text>More</Text>
      </HStack>
    </Box>
  );
}
