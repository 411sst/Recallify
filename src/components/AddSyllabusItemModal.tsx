import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { createSyllabusItem, updateSyllabusItem } from "../services/database";
import { SyllabusItemWithChildren } from "../types";

interface AddSyllabusItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number;
  parentItem: SyllabusItemWithChildren | null;
  onSuccess: () => void;
  editItem?: SyllabusItemWithChildren;
}

export default function AddSyllabusItemModal({
  isOpen,
  onClose,
  subjectId,
  parentItem,
  onSuccess,
  editItem,
}: AddSyllabusItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setDescription(editItem.description || "");
      setEstimatedHours(editItem.estimated_hours?.toString() || "");
      setDueDate(editItem.due_date || "");
    } else {
      resetForm();
    }
  }, [editItem, isOpen]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEstimatedHours("");
    setDueDate("");
  }

  async function handleSubmit() {
    if (!title.trim()) {
      toast({
        title: "Title is required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const hours = estimatedHours ? parseFloat(estimatedHours) : null;

      if (editItem) {
        await updateSyllabusItem(editItem.id, {
          title: title.trim(),
          description: description.trim() || null,
          estimated_hours: hours,
          due_date: dueDate || null,
        });
        toast({
          title: "Item updated",
          status: "success",
          duration: 3000,
        });
      } else {
        await createSyllabusItem({
          subject_id: subjectId,
          parent_id: parentItem?.id || null,
          title: title.trim(),
          description: description.trim() || null,
          estimated_hours: hours,
          due_date: dueDate || null,
        });
        toast({
          title: "Item created",
          status: "success",
          duration: 3000,
        });
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Error saving item",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editItem ? "Edit Syllabus Item" : parentItem ? "Add Subtopic" : "Add Module"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {parentItem && (
            <FormControl mb={4}>
              <FormLabel>Parent Item</FormLabel>
              <Input value={parentItem.title} isDisabled />
            </FormControl>
          )}

          <FormControl mb={4} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to ML"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description or notes about this topic"
              rows={3}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Estimated Hours</FormLabel>
            <Input
              type="number"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g., 2.5"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Due Date (optional)</FormLabel>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="primary" onClick={handleSubmit} isLoading={loading}>
            {editItem ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
