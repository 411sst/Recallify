import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useToast,
  Progress,
  Checkbox,
  IconButton,
  Collapse,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Subject, SyllabusItemWithChildren } from "../types";
import {
  getSyllabusItems,
  deleteSyllabusItem,
  toggleSyllabusCompletion,
} from "../services/database";
import AddSyllabusItemModal from "./AddSyllabusItemModal";
import ImportSyllabusModal from "./ImportSyllabusModal";

interface SyllabusTabProps {
  subject: Subject;
  onUpdate: () => void;
}

export default function SyllabusTab({ subject, onUpdate }: SyllabusTabProps) {
  const [syllabusItems, setSyllabusItems] = useState<SyllabusItemWithChildren[]>([]);
  const [selectedItem, setSelectedItem] = useState<SyllabusItemWithChildren | null>(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadSyllabus();
  }, [subject.id]);

  async function loadSyllabus() {
    try {
      const items = await getSyllabusItems(subject.id);
      setSyllabusItems(items);
    } catch (error) {
      toast({
        title: "Error loading syllabus",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleToggleComplete(item: SyllabusItemWithChildren) {
    try {
      await toggleSyllabusCompletion(item.id, item.is_completed === 1 ? 0 : 1);
      loadSyllabus();
      // Don't call onUpdate() here - it reloads the entire page and switches tabs
      // Just reload the syllabus data locally
    } catch (error) {
      toast({
        title: "Error updating item",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleDelete(itemId: number) {
    try {
      await deleteSyllabusItem(itemId);
      toast({
        title: "Item deleted",
        status: "success",
        duration: 3000,
      });
      loadSyllabus();
      onUpdate();
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  const totalItems = syllabusItems.reduce((sum, item) => sum + countItems(item), 0);
  const completedItems = syllabusItems.reduce((sum, item) => sum + countCompleted(item), 0);
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const totalHours = syllabusItems.reduce((sum, item) => sum + sumHours(item), 0);
  const completedHours = syllabusItems.reduce((sum, item) => sum + sumCompletedHours(item), 0);
  const remainingHours = Math.max(0, totalHours - completedHours);

  function countItems(item: SyllabusItemWithChildren): number {
    return 1 + item.children.reduce((sum, child) => sum + countItems(child), 0);
  }

  function countCompleted(item: SyllabusItemWithChildren): number {
    const selfCount = item.is_completed === 1 ? 1 : 0;
    const childCount = item.children.reduce((sum, child) => sum + countCompleted(child), 0);
    return selfCount + childCount;
  }

  function sumHours(item: SyllabusItemWithChildren): number {
    const selfHours = item.estimated_hours || 0;
    const childHours = item.children.reduce((sum, child) => sum + sumHours(child), 0);
    return selfHours + childHours;
  }

  function sumCompletedHours(item: SyllabusItemWithChildren): number {
    const selfHours = (item.is_completed === 1 && item.estimated_hours) ? item.estimated_hours : 0;
    const childHours = item.children.reduce((sum, child) => sum + sumCompletedHours(child), 0);
    return selfHours + childHours;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">📚 Course Syllabus</Heading>
        <HStack>
          <Button size="sm" onClick={onImportOpen} colorScheme="blue" variant="outline">
            📥 Import
          </Button>
          <Button size="sm" onClick={() => { setSelectedItem(null); onAddOpen(); }} colorScheme="primary">
            + Add Module
          </Button>
        </HStack>
      </HStack>

      {totalItems > 0 && (
        <Box mb={6} p={4} bg="bg.secondary" borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold">Progress</Text>
            <Text fontSize="sm" color="text.tertiary">
              {completedItems}/{totalItems} topics ({progressPercentage}%)
            </Text>
          </HStack>
          <Progress
            value={progressPercentage}
            colorScheme="primary"
            size="lg"
            borderRadius="md"
            mb={2}
          />
          <HStack justify="space-between" fontSize="sm" color="text.tertiary">
            <Text>Estimated Time Remaining: {remainingHours.toFixed(1)} hours</Text>
            <Text>Total: {totalHours.toFixed(1)} hours</Text>
          </HStack>
        </Box>
      )}

      {syllabusItems.length === 0 ? (
        <Box textAlign="center" py={12} bg="bg.secondary" borderRadius="md">
          <Text fontSize="lg" color="text.tertiary" mb={4}>
            No syllabus items yet
          </Text>
          <Text fontSize="sm" color="text.tertiary" mb={6}>
            Add modules and topics to organize your study material
          </Text>
          <HStack justify="center" spacing={4}>
            <Button onClick={() => { setSelectedItem(null); onAddOpen(); }} colorScheme="primary">
              + Add Module
            </Button>
            <Button onClick={onImportOpen} colorScheme="blue" variant="outline">
              📥 Import from Text
            </Button>
          </HStack>
        </Box>
      ) : (
        <VStack align="stretch" spacing={2}>
          {syllabusItems.map((item) => (
            <SyllabusItemView
              key={item.id}
              item={item}
              level={0}
              onToggle={handleToggleComplete}
              onDelete={handleDelete}
              onAddChild={(parentItem) => { setSelectedItem(parentItem); onAddOpen(); }}
            />
          ))}
        </VStack>
      )}

      <AddSyllabusItemModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        subjectId={subject.id}
        parentItem={selectedItem}
        onSuccess={() => {
          loadSyllabus();
          onUpdate();
        }}
      />

      <ImportSyllabusModal
        isOpen={isImportOpen}
        onClose={onImportClose}
        subjectId={subject.id}
        onSuccess={() => {
          loadSyllabus();
          onUpdate();
        }}
      />
    </Box>
  );
}

interface SyllabusItemViewProps {
  item: SyllabusItemWithChildren;
  level: number;
  onToggle: (item: SyllabusItemWithChildren) => void;
  onDelete: (itemId: number) => void;
  onAddChild: (item: SyllabusItemWithChildren) => void;
}

function SyllabusItemView({ item, level, onToggle, onDelete, onAddChild }: SyllabusItemViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children.length > 0;
  const indent = level * 24;

  return (
    <Box>
      <HStack
        py={2}
        px={3}
        bg={level === 0 ? "bg.secondary" : "transparent"}
        borderRadius="md"
        borderLeft={level > 0 ? "2px solid" : "none"}
        borderColor="border.primary"
        ml={`${indent}px`}
        _hover={{ bg: "bg.tertiary" }}
      >
        {hasChildren && (
          <IconButton
            aria-label="Toggle"
            icon={<Text>{isExpanded ? "▼" : "▶"}</Text>}
            size="xs"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
        {!hasChildren && <Box w="24px" />}

        <Checkbox
          isChecked={item.is_completed === 1}
          onChange={() => onToggle(item)}
          colorScheme="primary"
        />

        <Box flex={1}>
          <HStack spacing={2}>
            <Text
              fontWeight={level === 0 ? "bold" : "normal"}
              textDecoration={item.is_completed === 1 ? "line-through" : "none"}
              color={item.is_completed === 1 ? "text.tertiary" : "text.primary"}
            >
              {item.title}
            </Text>
            {item.estimated_hours && (
              <Badge colorScheme="blue" fontSize="xs">
                {item.estimated_hours}h
              </Badge>
            )}
            {item.entry_count > 0 && (
              <Badge colorScheme="green" fontSize="xs">
                {item.entry_count} entries
              </Badge>
            )}
          </HStack>
          {item.description && (
            <Text fontSize="sm" color="text.tertiary" mt={1}>
              {item.description}
            </Text>
          )}
        </Box>

        {item.progress_percentage !== undefined && item.children.length > 0 && (
          <Badge colorScheme={item.progress_percentage === 100 ? "green" : "orange"}>
            {Math.round(item.progress_percentage)}%
          </Badge>
        )}

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<Text>⋮</Text>}
            size="sm"
            variant="ghost"
          />
          <MenuList>
            <MenuItem onClick={() => onAddChild(item)}>➕ Add Subtopic</MenuItem>
            <MenuItem onClick={() => onToggle(item)}>
              {item.is_completed === 1 ? "☐ Mark Incomplete" : "☑️ Mark Complete"}
            </MenuItem>
            <MenuItem color="red.500" onClick={() => onDelete(item.id)}>
              🗑️ Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {hasChildren && (
        <Collapse in={isExpanded} animateOpacity>
          <VStack align="stretch" spacing={1} mt={1}>
            {item.children.map((child) => (
              <SyllabusItemView
                key={child.id}
                item={child}
                level={level + 1}
                onToggle={onToggle}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            ))}
          </VStack>
        </Collapse>
      )}
    </Box>
  );
}
