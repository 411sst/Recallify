import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  Grid,
  GridItem,
  VStack,
  Card,
  CardBody,
  Badge,
  Spinner,
  useToast,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import {
  getCalendarData,
  getRevisionsByDate,
  getEntryById,
  getSubjectById,
  completeRevision,
  uncompleteRevision,
} from "../services/database";
import { CalendarDay, Revision, EntryWithDetails, Subject } from "../types";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRevisions, setSelectedRevisions] = useState<
    (Revision & { entry: EntryWithDetails; subject: Subject })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  async function loadCalendarData() {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await getCalendarData(month, year);
      setCalendarDays(data);
    } catch (error) {
      toast({
        title: "Error loading calendar",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDateClick(date: string) {
    setSelectedDate(date);
    try {
      const revisions = await getRevisionsByDate(date);

      const revisionsWithDetails = await Promise.all(
        revisions.map(async (revision) => {
          const entry = await getEntryById(revision.entry_id);
          const subject = await getSubjectById(entry.subject_id);
          return { ...revision, entry, subject };
        })
      );

      setSelectedRevisions(revisionsWithDetails);
    } catch (error) {
      toast({
        title: "Error loading revisions",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function toggleRevision(revisionId: number, isCompleted: boolean) {
    try {
      if (isCompleted) {
        await uncompleteRevision(revisionId);
      } else {
        await completeRevision(revisionId);
      }
      // Reload calendar and selected date
      loadCalendarData();
      if (selectedDate) {
        handleDateClick(selectedDate);
      }
    } catch (error) {
      toast({
        title: "Error updating revision",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  function previousMonth() {
    setCurrentDate(subMonths(currentDate, 1));
  }

  function nextMonth() {
    setCurrentDate(addMonths(currentDate, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
    handleDateClick(format(new Date(), "yyyy-MM-dd"));
  }

  // Generate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate empty cells before first day
  const firstDayOfWeek = getDay(monthStart);
  const emptyCells = Array(firstDayOfWeek).fill(null);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="400px"
      >
        <Spinner size="xl" color="primary.500" />
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <Heading size="xl" color="text.primary">
          Calendar
        </Heading>
        <HStack>
          <IconButton
            aria-label="Previous month"
            icon={<Text fontSize="xl">←</Text>}
            onClick={previousMonth}
          />
          <Text fontWeight="semibold" minW="150px" textAlign="center">
            {format(currentDate, "MMMM yyyy")}
          </Text>
          <IconButton
            aria-label="Next month"
            icon={<Text fontSize="xl">→</Text>}
            onClick={nextMonth}
          />
          <Button onClick={goToToday} variant="outline" ml={4}>
            Today
          </Button>
        </HStack>
      </HStack>

      <Grid templateColumns="3fr 1fr" gap={6}>
        <Box>
          {/* Calendar Grid */}
          <Grid
            templateColumns="repeat(7, 1fr)"
            gap={2}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="sm"
          >
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <GridItem key={day} textAlign="center" fontWeight="semibold" pb={2}>
                <Text color="text.tertiary" fontSize="sm">
                  {day}
                </Text>
              </GridItem>
            ))}

            {/* Empty cells before first day */}
            {emptyCells.map((_, index) => (
              <GridItem key={`empty-${index}`} />
            ))}

            {/* Calendar days */}
            {daysInMonth.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const calendarDay = calendarDays.find((cd) => cd.date === dateStr);
              const isToday = dateStr === format(new Date(), "yyyy-MM-dd");
              const isSelected = dateStr === selectedDate;

              let dotColor = "transparent";
              if (calendarDay) {
                if (calendarDay.status === "completed") dotColor = "status.success";
                else if (calendarDay.status === "due") dotColor = "status.due";
                else if (calendarDay.status === "overdue") dotColor = "status.overdue";
                else if (calendarDay.status === "future") dotColor = "status.future";
              }

              return (
                <GridItem key={dateStr}>
                  <VStack
                    p={2}
                    h="80px"
                    bg={isSelected ? "primary.50" : "transparent"}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={
                      isToday
                        ? "primary.500"
                        : isSelected
                        ? "primary.300"
                        : "gray.100"
                    }
                    cursor="pointer"
                    onClick={() => handleDateClick(dateStr)}
                    _hover={{
                      bg: isSelected ? "primary.50" : "gray.50",
                    }}
                    spacing={1}
                  >
                    <Text
                      fontWeight={isToday ? "bold" : "normal"}
                      color={isToday ? "primary.500" : "text.primary"}
                    >
                      {format(day, "d")}
                    </Text>
                    {dotColor !== "transparent" && (
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={dotColor}
                      />
                    )}
                  </VStack>
                </GridItem>
              );
            })}
          </Grid>
        </Box>

        {/* Selected Date Details */}
        <Box>
          {selectedDate && (
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>
                  {format(new Date(selectedDate), "MMM dd, yyyy")}
                </Heading>

                {selectedRevisions.length === 0 ? (
                  <Text color="text.tertiary" fontSize="sm">
                    No revisions for this day
                  </Text>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {selectedRevisions.map((revision) => (
                      <Box
                        key={revision.id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <HStack justify="space-between" align="start" mb={2}>
                          <VStack align="start" spacing={0} flex="1">
                            <Text fontWeight="semibold" fontSize="sm">
                              {revision.subject.name}
                            </Text>
                            <Text fontSize="xs" color="text.tertiary">
                              Day {revision.interval_days}
                            </Text>
                          </VStack>
                          <Checkbox
                            colorScheme="green"
                            isChecked={revision.status === "completed"}
                            onChange={() =>
                              toggleRevision(
                                revision.id,
                                revision.status === "completed"
                              )
                            }
                          />
                        </HStack>
                        <Text fontSize="sm" color="text.secondary" noOfLines={2}>
                          {revision.entry.study_notes}
                        </Text>
                        <Badge
                          mt={2}
                          colorScheme={
                            revision.status === "completed"
                              ? "green"
                              : revision.status === "overdue"
                              ? "red"
                              : revision.status === "pending" &&
                                new Date(revision.due_date) <= new Date()
                              ? "orange"
                              : "blue"
                          }
                          fontSize="xs"
                        >
                          {revision.status}
                        </Badge>
                      </Box>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
