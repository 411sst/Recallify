import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Textarea,
  useToast,
  Text,
  VStack,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { createSyllabusItem } from "../services/database";

interface ImportSyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number;
  onSuccess: () => void;
}

interface ParsedItem {
  title: string;
  children: string[];
  estimatedHours?: number;
}

export default function ImportSyllabusModal({
  isOpen,
  onClose,
  subjectId,
  onSuccess,
}: ImportSyllabusModalProps) {
  const [syllabusText, setSyllabusText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ParsedItem[]>([]);
  const toast = useToast();

  function parseSyllabus(text: string): ParsedItem[] {
    if (!text.trim()) return [];

    const items: ParsedItem[] = [];

    // Split by periods to get major topic sections
    const sections = text.split(/\.\s+/).filter(s => s.trim());

    for (const section of sections) {
      // Check if section contains a main topic (ends with colon)
      const colonMatch = section.match(/^([^:]+):\s*(.+)/);

      if (colonMatch) {
        const mainTopic = colonMatch[1].trim();
        const subtopicsText = colonMatch[2].trim();

        // Extract hours if present (e.g., "Topic - 2h" or "Topic - 2.5h")
        const hoursMatch = mainTopic.match(/^(.+?)\s*-\s*([\d.]+)\s*h?$/i);
        let topicTitle = mainTopic;
        let hours: number | undefined = undefined;

        if (hoursMatch) {
          topicTitle = hoursMatch[1].trim();
          hours = parseFloat(hoursMatch[2]);
        }

        // Split subtopics by comma
        const subtopics = subtopicsText
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        items.push({
          title: topicTitle,
          children: subtopics,
          estimatedHours: hours,
        });
      } else if (section.trim()) {
        // If no colon, treat as a simple topic without children
        const hoursMatch = section.match(/^(.+?)\s*-\s*([\d.]+)\s*h?$/i);
        let topicTitle = section.trim();
        let hours: number | undefined = undefined;

        if (hoursMatch) {
          topicTitle = hoursMatch[1].trim();
          hours = parseFloat(hoursMatch[2]);
        }

        items.push({
          title: topicTitle,
          children: [],
          estimatedHours: hours,
        });
      }
    }

    return items;
  }

  function handleTextChange(text: string) {
    setSyllabusText(text);
    const parsed = parseSyllabus(text);
    setPreview(parsed);
  }

  async function handleImport() {
    if (preview.length === 0) {
      toast({
        title: "Nothing to import",
        description: "Please enter syllabus text",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      let sortOrder = 0;

      for (const item of preview) {
        // Create parent item
        const parentResult = await createSyllabusItem({
          subject_id: subjectId,
          parent_id: null,
          title: item.title,
          description: null,
          estimated_hours: item.estimatedHours || null,
          due_date: null,
          sort_order: sortOrder++,
        });

        // Create child items if any
        if (item.children.length > 0) {
          let childOrder = 0;
          for (const childTitle of item.children) {
            await createSyllabusItem({
              subject_id: subjectId,
              parent_id: parentResult.lastInsertId,
              title: childTitle,
              description: null,
              estimated_hours: null,
              due_date: null,
              sort_order: childOrder++,
            });
          }
        }
      }

      toast({
        title: "Import successful",
        description: `Imported ${preview.length} modules with ${preview.reduce((sum, p) => sum + p.children.length, 0)} subtopics`,
        status: "success",
        duration: 5000,
      });

      onSuccess();
      onClose();
      setSyllabusText("");
      setPreview([]);
    } catch (error) {
      toast({
        title: "Import failed",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  const totalModules = preview.length;
  const totalSubtopics = preview.reduce((sum, item) => sum + item.children.length, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Import Syllabus</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text mb={2} fontSize="sm" color="text.tertiary">
                Paste your syllabus below. Format:
              </Text>
              <Text fontSize="xs" color="text.tertiary" fontFamily="monospace" bg="bg.secondary" p={2} borderRadius="md">
                Main Topic: Subtopic 1, Subtopic 2, Subtopic 3. Another Topic: Sub A, Sub B.
              </Text>
              <Text fontSize="xs" color="text.tertiary" mt={1}>
                Add "- Xh" after topic names to specify estimated hours (e.g., "Topic - 2.5h")
              </Text>
            </Box>

            <Textarea
              value={syllabusText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Example: Introduction to ML: Machine Learning and its Models, Concept Learning. Decision Trees: ID3 algorithm, Overfitting."
              rows={8}
              fontFamily="monospace"
              fontSize="sm"
            />

            {preview.length > 0 && (
              <Box>
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    ✓ Detected {totalModules} module{totalModules !== 1 ? 's' : ''} with {totalSubtopics} subtopic{totalSubtopics !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>

                <Box mt={3} maxH="200px" overflowY="auto" bg="bg.secondary" p={3} borderRadius="md">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Preview:</Text>
                  <VStack align="stretch" spacing={2}>
                    {preview.map((item, idx) => (
                      <Box key={idx}>
                        <Text fontSize="sm" fontWeight="bold">
                          ▶ {item.title}
                          {item.estimatedHours && (
                            <Text as="span" ml={2} fontSize="xs" color="blue.500">
                              ({item.estimatedHours}h)
                            </Text>
                          )}
                        </Text>
                        {item.children.length > 0 && (
                          <VStack align="stretch" pl={4} mt={1} spacing={0.5}>
                            {item.children.map((child, childIdx) => (
                              <Text key={childIdx} fontSize="xs" color="text.tertiary">
                                • {child}
                              </Text>
                            ))}
                          </VStack>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="primary"
            onClick={handleImport}
            isLoading={loading}
            isDisabled={preview.length === 0}
          >
            Import {preview.length > 0 && `(${totalModules} modules)`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
