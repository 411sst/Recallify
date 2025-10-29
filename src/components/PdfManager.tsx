import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  Card,
  CardBody,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import {
  getPdfAttachments,
  createPdfAttachment,
  deletePdfAttachment,
} from "../services/database";
import { PdfAttachment } from "../types";

interface PdfManagerProps {
  entryId: number;
  onUpdate?: () => void;
}

export default function PdfManager({ entryId, onUpdate }: PdfManagerProps) {
  const [pdfs, setPdfs] = useState<PdfAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PdfAttachment | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPdfs();
  }, [entryId]);

  async function loadPdfs() {
    try {
      const attachments = await getPdfAttachments(entryId);
      setPdfs(attachments);
    } catch (error) {
      toast({
        title: "Error loading PDFs",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  async function handleUpload() {
    try {
      setLoading(true);

      // Open file dialog
      const selected = await open({
        filters: [
          {
            name: "PDF",
            extensions: ["pdf"],
          },
        ],
        multiple: false,
      });

      if (!selected || Array.isArray(selected)) {
        setLoading(false);
        return;
      }

      // Read file
      const fileData: number[] = await invoke("read_pdf_file", {
        filePath: selected,
      });

      // Get file name from path
      const fileName = selected.split(/[/\\]/).pop() || "document.pdf";

      // Save file
      const savedPath: string = await invoke("save_pdf_file", {
        fileName: `${Date.now()}_${fileName}`,
        fileData,
      });

      // Create database record
      await createPdfAttachment({
        entry_id: entryId,
        file_name: fileName,
        file_path: savedPath,
        file_size: fileData.length,
        page_count: null, // We'll calculate this later if needed
      });

      toast({
        title: "PDF uploaded successfully",
        status: "success",
        duration: 3000,
      });

      loadPdfs();
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error uploading PDF",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pdfId: number, filePath: string) {
    try {
      // Delete file
      await invoke("delete_pdf_file", { filePath });

      // Delete database record
      await deletePdfAttachment(pdfId);

      toast({
        title: "PDF deleted",
        status: "success",
        duration: 3000,
      });

      loadPdfs();
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error deleting PDF",
        description: String(error),
        status: "error",
        duration: 5000,
      });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function openPdf(pdf: PdfAttachment) {
    setSelectedPdf(pdf);
    onOpen();
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="semibold">📄 Attached PDFs</Text>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleUpload}
          isLoading={loading}
        >
          + Upload PDF
        </Button>
      </HStack>

      {pdfs.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
          px={4}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          bg="gray.50"
        >
          <Text fontSize="sm" color="text.tertiary" mb={3}>
            No PDFs attached yet
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={handleUpload}
            isLoading={loading}
          >
            Upload your first PDF
          </Button>
        </Box>
      ) : (
        <VStack align="stretch" spacing={2}>
          {pdfs.map((pdf) => (
            <Card key={pdf.id} size="sm">
              <CardBody>
                <HStack justify="space-between">
                  <HStack flex={1} spacing={3}>
                    <Text fontSize="2xl">📕</Text>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {pdf.file_name}
                      </Text>
                      <HStack fontSize="xs" color="text.tertiary">
                        <Text>{formatFileSize(pdf.file_size)}</Text>
                        {pdf.page_count && (
                          <>
                            <Text>·</Text>
                            <Text>{pdf.page_count} pages</Text>
                          </>
                        )}
                        {pdf.last_viewed_page > 1 && (
                          <>
                            <Text>·</Text>
                            <Badge colorScheme="blue" fontSize="xs">
                              Page {pdf.last_viewed_page}
                            </Badge>
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => openPdf(pdf)}
                    >
                      View
                    </Button>
                    <IconButton
                      aria-label="Delete PDF"
                      icon={<Text>🗑️</Text>}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(pdf.id, pdf.file_path)}
                    />
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {/* PDF Viewer Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPdf?.file_name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPdf && (
              <Box h="calc(100vh - 120px)" w="100%">
                <iframe
                  ref={iframeRef}
                  src={`file://${selectedPdf.file_path}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  title={selectedPdf.file_name}
                />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
