import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getSubjects, createSubject } from "../services/database";
import { SubjectWithStats } from "../types";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubjectName, setNewSubjectName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // Dark mode colors
  const textColor = useColorModeValue("#0A122A", "#ffffff");
  const tertiaryTextColor = useColorModeValue("#6B6B6B", "#b0b0b0");
  const emptyStateBg = useColorModeValue("white", "#1a1a1a");
  const emptyStateBorder = useColorModeValue("gray.200", "#333333");

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      toast({
        title: "Error loading subjects",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSubject() {
    if (!newSubjectName.trim()) {
      toast({
        title: "Subject name required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await createSubject(newSubjectName);
      toast({
        title: "Subject created",
        status: "success",
        duration: 3000,
      });
      setNewSubjectName("");
      onClose();
      loadSubjects();
    } catch (error) {
      toast({
        title: "Error creating subject",
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

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <Heading size="xl" color={textColor}>
          My Subjects
        </Heading>
        <Button onClick={onOpen} size="lg">
          + New Subject
        </Button>
      </HStack>

      {subjects.length === 0 ? (
        <Box
          textAlign="center"
          py={16}
          px={4}
          bg={emptyStateBg}
          borderRadius="md"
          border="2px dashed"
          borderColor={emptyStateBorder}
        >
          <Text fontSize="lg" color={tertiaryTextColor} mb={4}>
            No subjects yet. Create your first subject to get started!
          </Text>
          <Button onClick={onOpen}>Create Subject</Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              cursor="pointer"
              onClick={() => navigate(`/subjects/${subject.id}`)}
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
              }}
            >
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Heading size="md" color={textColor}>
                    {subject.name}
                  </Heading>
                  <Text color={tertiaryTextColor} fontSize="sm">
                    {subject.entryCount} note{subject.entryCount !== 1 ? "s" : ""}
                  </Text>
                  {subject.nextRevisionDays !== undefined && (
                    <Text
                      color={
                        subject.nextRevisionDays <= 0
                          ? "status.overdue"
                          : subject.nextRevisionDays === 0
                          ? "status.due"
                          : "status.future"
                      }
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      Next revision:{" "}
                      {subject.nextRevisionDays === 0
                        ? "Today"
                        : subject.nextRevisionDays < 0
                        ? `${Math.abs(subject.nextRevisionDays)}d overdue`
                        : `in ${subject.nextRevisionDays}d`}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Create Subject Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Subject Name</FormLabel>
              <Input
                placeholder="e.g., Machine Learning, Data Structures"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateSubject();
                  }
                }}
                autoFocus
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubject}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
