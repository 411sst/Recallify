import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Checkbox,
  Tag,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  getSubjectById,
  getEntriesBySubject,
  createEntry,
  updateEntry,
  deleteEntry,
  deleteSubject,
  updateSubject,
  completeRevision,
  uncompleteRevision,
  getSettings,
} from "../services/database";
import { Subject, EntryWithDetails } from "../types";
import { useRef } from "react";
import SyllabusTab from "../components/SyllabusTab";
import RichTextEditor from "../components/RichTextEditor";
import PdfManager from "../components/PdfManager";
import { getPreviewText } from "../utils/richTextUtils";

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [entries, setEntries] = useState<EntryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<EntryWithDetails | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState("");

  // Form state
  const [studyDate, setStudyDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [topics, setTopics] = useState("");
  const [studyNotes, setStudyNotes] = useState("");
  const [morningRecallNotes, setMorningRecallNotes] = useState("");
  const [intervals, setIntervals] = useState<number[]>([3, 7]);
  const [intervalInput, setIntervalInput] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteSubjectOpen,
    onOpen: onDeleteSubjectOpen,
    onClose: onDeleteSubjectClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const toast = useToast();

  useEffect(() => {
    if (id) {
      loadSubjectData();
    }
  }, [id]);

  async function loadSubjectData() {
    try {
      setLoading(true);
      const subjectData = await getSubjectById(Number(id));
      setSubject(subjectData);
      setSubjectName(subjectData.name);

      const entriesData = await getEntriesBySubject(Number(id));
      setEntries(entriesData);

      // Load default intervals
      const settings = await getSettings();
      if (settings.default_intervals) {
        setIntervals(settings.default_intervals.split(",").map(Number));
      }
    } catch (error) {
      toast({
        title: "Error loading subject",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  function openNewEntryModal() {
    setSelectedEntry(null);
    setIsEditing(false);
    setStudyDate(format(new Date(), "yyyy-MM-dd"));
    setTopics("");
    setStudyNotes("");
    setMorningRecallNotes("");
    // Reset to default intervals
    getSettings().then((settings) => {
      if (settings.default_intervals) {
        setIntervals(settings.default_intervals.split(",").map(Number));
      }
    });
    onOpen();
  }

  function openEditEntryModal(entry: EntryWithDetails) {
    setSelectedEntry(entry);
    setIsEditing(true);
    setStudyDate(entry.study_date);
    setTopics((entry as any).topics || "");
    setStudyNotes(entry.study_notes);
    setMorningRecallNotes(entry.morning_recall_notes || "");
    setIntervals(entry.intervals.map((i) => i.interval_days));
    onOpen();
  }

  async function handleSaveEntry() {
    if (!studyNotes.trim()) {
      toast({
        title: "Study notes required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (intervals.length === 0) {
      toast({
        title: "At least one interval required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      if (isEditing && selectedEntry) {
        await updateEntry(
          selectedEntry.id,
          studyNotes,
          morningRecallNotes || null,
          intervals,
          topics
        );
        toast({
          title: "Entry updated",
          status: "success",
          duration: 3000,
        });
      } else {
        await createEntry(Number(id), studyDate, studyNotes, intervals, topics);
        toast({
          title: "Entry created",
          status: "success",
          duration: 3000,
        });
      }
      onClose();
      loadSubjectData();
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleDeleteEntry() {
    if (!selectedEntry) return;

    try {
      await deleteEntry(selectedEntry.id);
      toast({
        title: "Entry deleted",
        status: "success",
        duration: 3000,
      });
      onDeleteClose();
      onClose();
      loadSubjectData();
    } catch (error) {
      toast({
        title: "Error deleting entry",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleDeleteSubject() {
    try {
      await deleteSubject(Number(id));
      toast({
        title: "Subject deleted",
        status: "success",
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error deleting subject",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleUpdateSubject() {
    if (!subjectName.trim()) {
      toast({
        title: "Subject name required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await updateSubject(Number(id), subjectName);
      toast({
        title: "Subject updated",
        status: "success",
        duration: 3000,
      });
      setEditingSubject(false);
      loadSubjectData();
    } catch (error) {
      toast({
        title: "Error updating subject",
        description: String(error),
        status: "error",
        duration: 5000,
      });
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
    setIntervals(intervals.filter((i) => i !== interval));
  }

  async function toggleRevision(revisionId: number, isCompleted: boolean) {
    try {
      if (isCompleted) {
        await uncompleteRevision(revisionId);
      } else {
        await completeRevision(revisionId);
      }
      loadSubjectData();
    } catch (error) {
      toast({
        title: "Error updating revision",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

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

  if (!subject) {
    return (
      <Box textAlign="center" py={16}>
        <Text fontSize="lg" color="text.tertiary">
          Subject not found
        </Text>
        <Button mt={4} onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    );
  }

  const dueRevisions = entries
    .flatMap((entry) =>
      entry.revisions
        .filter(
          (r) =>
            r.status === "pending" || r.status === "overdue"
        )
        .map((r) => ({ ...r, entry }))
    )
    .filter((r) => new Date(r.due_date) <= new Date());

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <HStack spacing={4}>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            color="text.tertiary"
          >
            ← Back
          </Button>
          {editingSubject ? (
            <HStack>
              <Input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                size="lg"
                fontWeight="bold"
              />
              <Button onClick={handleUpdateSubject} size="sm">
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingSubject(false);
                  setSubjectName(subject.name);
                }}
                size="sm"
              >
                Cancel
              </Button>
            </HStack>
          ) : (
            <HStack>
              <Heading size="xl" color="text.primary">
                {subject.name}
              </Heading>
              <IconButton
                aria-label="Edit subject"
                icon={<Text>✏️</Text>}
                size="sm"
                variant="ghost"
                onClick={() => setEditingSubject(true)}
              />
            </HStack>
          )}
        </HStack>
        <HStack>
          <Button colorScheme="red" variant="outline" onClick={onDeleteSubjectOpen}>
            Delete Subject
          </Button>
          <Button onClick={openNewEntryModal} size="lg">
            + New Entry
          </Button>
        </HStack>
      </HStack>

      <Tabs>
        <TabList>
          <Tab>
            Study Entries
            <Badge ml={2} colorScheme="gray">
              {entries.length}
            </Badge>
          </Tab>
          <Tab>📚 Syllabus</Tab>
          <Tab>
            Due Revisions
            <Badge ml={2} colorScheme={dueRevisions.length > 0 ? "orange" : "gray"}>
              {dueRevisions.length}
            </Badge>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {entries.length === 0 ? (
              <Box
                textAlign="center"
                py={16}
                px={4}
                bg="white"
                borderRadius="md"
                border="2px dashed"
                borderColor="gray.200"
              >
                <Text fontSize="lg" color="text.tertiary" mb={4}>
                  No study entries yet. Add your first entry!
                </Text>
                <Button onClick={openNewEntryModal}>Create Entry</Button>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    cursor="pointer"
                    onClick={() => openEditEntryModal(entry)}
                  >
                    <CardBody>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="semibold" color="text.primary">
                          {format(new Date(entry.study_date), "MMM dd, yyyy")}
                        </Text>
                        <HStack>
                          {entry.revisions.map((revision) => {
                            let color = "gray";
                            if (revision.status === "completed")
                              color = "green";
                            else if (revision.status === "overdue")
                              color = "red";
                            else if (
                              revision.status === "pending" &&
                              new Date(revision.due_date) <= new Date()
                            )
                              color = "orange";

                            return (
                              <Tag key={revision.id} size="sm" colorScheme={color}>
                                Day {revision.interval_days}
                              </Tag>
                            );
                          })}
                        </HStack>
                      </HStack>
                      {(entry as any).topics ? (
                        <Text color="text.secondary" noOfLines={2} fontWeight="medium">
                          Topics: {(entry as any).topics}
                        </Text>
                      ) : (
                        <Text color="text.tertiary" noOfLines={2} fontSize="sm" fontStyle="italic">
                          No topics specified
                        </Text>
                      )}
                      {entry.morning_recall_notes && (
                        <Text
                          mt={2}
                          fontSize="sm"
                          color="text.tertiary"
                          fontStyle="italic"
                        >
                          Morning recall: {getPreviewText(entry.morning_recall_notes, 100)}
                        </Text>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            <SyllabusTab subject={subject} onUpdate={loadSubjectData} />
          </TabPanel>

          <TabPanel px={0}>
            {dueRevisions.length === 0 ? (
              <Box
                textAlign="center"
                py={16}
                px={4}
                bg="white"
                borderRadius="md"
              >
                <Text fontSize="lg" color="text.tertiary">
                  No revisions due today. Great job! 🎉
                </Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {dueRevisions.map((revision) => (
                  <Card key={revision.id}>
                    <CardBody>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" flex="1" spacing={2}>
                          <HStack>
                            <Text fontWeight="semibold" color="text.primary">
                              Day {revision.interval_days} Revision
                            </Text>
                            <Badge
                              colorScheme={
                                revision.status === "overdue" ? "red" : "orange"
                              }
                            >
                              {revision.status === "overdue"
                                ? `Overdue (${format(
                                    new Date(revision.due_date),
                                    "MMM dd"
                                  )})`
                                : "Due Today"}
                            </Badge>
                          </HStack>
                          <Text color="text.secondary">
                            {getPreviewText(revision.entry.study_notes, 200)}
                          </Text>
                          {revision.entry.morning_recall_notes && (
                            <Box
                              mt={2}
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                              w="100%"
                            >
                              <Text fontSize="sm" fontWeight="semibold" mb={1}>
                                Morning Recall Notes:
                              </Text>
                              <Text fontSize="sm" color="text.tertiary">
                                {getPreviewText(revision.entry.morning_recall_notes, 300)}
                              </Text>
                            </Box>
                          )}
                        </VStack>
                        <Checkbox
                          size="lg"
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
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Entry Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {isEditing ? "Edit Entry" : "New Study Entry"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Study Date</FormLabel>
                <Input
                  type="date"
                  value={studyDate}
                  onChange={(e) => setStudyDate(e.target.value)}
                  isDisabled={isEditing}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Topics Covered *</FormLabel>
                <Input
                  placeholder="Arrays, Two Pointers, Sliding Window"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                />
                <Text fontSize="xs" color="text.tertiary" mt={1}>
                  💡 Enter topics separated by commas or line breaks
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>What I Studied Today</FormLabel>
                <RichTextEditor
                  content={studyNotes}
                  onChange={setStudyNotes}
                  placeholder="Describe what you studied... (Press '/' for formatting options)"
                  minHeight="300px"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Morning Recall Notes (Optional)</FormLabel>
                <RichTextEditor
                  content={morningRecallNotes}
                  onChange={setMorningRecallNotes}
                  placeholder="What couldn't you recall this morning?"
                  minHeight="200px"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Revision Intervals (days)</FormLabel>
                <HStack mb={2}>
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
                <HStack wrap="wrap">
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
              </FormControl>

              {isEditing && selectedEntry && (
                <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                  <PdfManager
                    entryId={selectedEntry.id}
                    onUpdate={loadSubjectData}
                  />
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {isEditing && (
              <Button colorScheme="red" variant="ghost" mr="auto" onClick={onDeleteOpen}>
                Delete Entry
              </Button>
            )}
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntry}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Entry Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Entry</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This will delete the entry and all its revisions.
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteEntry} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Subject Confirmation */}
      <AlertDialog
        isOpen={isDeleteSubjectOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteSubjectClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Subject</AlertDialogHeader>
            <AlertDialogBody>
              Delete "{subject.name}"? This will permanently delete{" "}
              {entries.length} entries and all revisions. This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteSubjectClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteSubject} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
