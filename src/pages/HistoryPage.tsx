import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Select,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import {
  getActivityLog,
  getSubjects,
} from "../services/database";
import { ActivityLogWithDetails, Subject } from "../types";

export default function HistoryPage() {
  const [activities, setActivities] = useState<ActivityLogWithDetails[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const toast = useToast();

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [subjectFilter, activityTypeFilter, startDate, endDate]);

  async function loadSubjects() {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      toast({
        title: "Error loading subjects",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function loadActivities() {
    try {
      setLoading(true);
      const filters: any = {};

      if (subjectFilter) {
        filters.subjectId = parseInt(subjectFilter);
      }

      if (activityTypeFilter) {
        filters.activityType = activityTypeFilter;
      }

      if (startDate) {
        filters.startDate = startDate;
      }

      if (endDate) {
        filters.endDate = endDate;
      }

      const data = await getActivityLog(filters);
      setActivities(data);
    } catch (error) {
      toast({
        title: "Error loading activity history",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  // Group activities by date
  const activitiesByDate: Record<string, ActivityLogWithDetails[]> = {};
  activities.forEach((activity) => {
    if (!activitiesByDate[activity.activity_date]) {
      activitiesByDate[activity.activity_date] = [];
    }
    activitiesByDate[activity.activity_date].push(activity);
  });

  const dates = Object.keys(activitiesByDate).sort().reverse();

  function getActivityIcon(type: string) {
    switch (type) {
      case "study":
        return "📝";
      case "revision_completed":
        return "✅";
      case "entry_created":
        return "➕";
      default:
        return "•";
    }
  }

  function getActivityLabel(activity: ActivityLogWithDetails) {
    switch (activity.activity_type) {
      case "study":
        return "Studied";
      case "revision_completed":
        return `Revised (${activity.details || "completed"})`;
      case "entry_created":
        return "Created entry";
      default:
        return "Activity";
    }
  }

  return (
    <Box>
      <Heading size="xl" color="text.primary" mb={8}>
        Activity History
      </Heading>

      {/* Filters */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <Box minW="200px">
              <Text fontSize="sm" mb={2} fontWeight="semibold">
                Subject
              </Text>
              <Select
                placeholder="All subjects"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </Box>

            <Box minW="200px">
              <Text fontSize="sm" mb={2} fontWeight="semibold">
                Activity Type
              </Text>
              <Select
                placeholder="All types"
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value)}
              >
                <option value="study">Study</option>
                <option value="revision_completed">Revision Completed</option>
                <option value="entry_created">Entry Created</option>
              </Select>
            </Box>

            <Box minW="150px">
              <Text fontSize="sm" mb={2} fontWeight="semibold">
                From Date
              </Text>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>

            <Box minW="150px">
              <Text fontSize="sm" mb={2} fontWeight="semibold">
                To Date
              </Text>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>
          </HStack>
        </CardBody>
      </Card>

      {/* Activity Timeline */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="300px"
        >
          <Spinner size="xl" color="primary.500" />
        </Box>
      ) : activities.length === 0 ? (
        <Box
          textAlign="center"
          py={16}
          px={4}
          bg="white"
          borderRadius="md"
          border="2px dashed"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="text.tertiary">
            No activity found for the selected filters
          </Text>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {dates.map((date) => (
            <Box key={date}>
              <HStack mb={3}>
                <Text fontSize="lg" fontWeight="semibold" color="text.primary">
                  📅 {format(parseISO(date), "MMMM dd, yyyy")}
                </Text>
              </HStack>

              <Card>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {activitiesByDate[date].map((activity) => (
                      <HStack
                        key={activity.id}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        align="start"
                      >
                        <Text fontSize="xl">
                          {getActivityIcon(activity.activity_type)}
                        </Text>
                        <VStack align="start" spacing={1} flex="1">
                          <HStack>
                            <Text fontWeight="semibold" color="text.primary">
                              {getActivityLabel(activity)}:
                            </Text>
                            <Text color="primary.500" fontWeight="semibold">
                              {activity.subject.name}
                            </Text>
                          </HStack>
                          <Text color="text.secondary" fontSize="sm" noOfLines={2}>
                            {activity.entry.study_notes}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
