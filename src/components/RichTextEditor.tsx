import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Box,
  ButtonGroup,
  IconButton,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Tooltip,
  Text,
} from "@chakra-ui/react";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing or press '/' for commands...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const { colorMode } = useColorMode();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "image",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
        style: `min-height: ${minHeight}; padding: 1rem;`,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <Box
      border="1px solid"
      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
      borderRadius="md"
      bg={colorMode === "dark" ? "gray.800" : "white"}
    >
      {/* Toolbar */}
      <Box
        p={2}
        borderBottom="1px solid"
        borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
        bg={colorMode === "dark" ? "gray.700" : "gray.50"}
      >
        <HStack spacing={2} flexWrap="wrap">
          {/* Text Formatting */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Bold (Ctrl+B)">
              <IconButton
                aria-label="Bold"
                icon={<Text fontWeight="bold">B</Text>}
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                colorScheme={editor.isActive("bold") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Italic (Ctrl+I)">
              <IconButton
                aria-label="Italic"
                icon={<Text fontStyle="italic">I</Text>}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                colorScheme={editor.isActive("italic") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Underline">
              <IconButton
                aria-label="Underline"
                icon={<Text textDecoration="underline">U</Text>}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                colorScheme={editor.isActive("underline") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Strikethrough">
              <IconButton
                aria-label="Strike"
                icon={<Text textDecoration="line-through">S</Text>}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                colorScheme={editor.isActive("strike") ? "blue" : "gray"}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          {/* Headings */}
          <Menu>
            <Tooltip label="Headings">
              <MenuButton
                as={IconButton}
                aria-label="Headings"
                icon={<Text fontWeight="bold">H</Text>}
                size="sm"
                variant="outline"
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                fontWeight={editor.isActive("heading", { level: 1 }) ? "bold" : "normal"}
              >
                Heading 1
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                fontWeight={editor.isActive("heading", { level: 2 }) ? "bold" : "normal"}
              >
                Heading 2
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                fontWeight={editor.isActive("heading", { level: 3 }) ? "bold" : "normal"}
              >
                Heading 3
              </MenuItem>
              <MenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                Normal Text
              </MenuItem>
            </MenuList>
          </Menu>

          <Divider orientation="vertical" h="24px" />

          {/* Lists */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Bullet List">
              <IconButton
                aria-label="Bullet List"
                icon={<Text>•</Text>}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                colorScheme={editor.isActive("bulletList") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Numbered List">
              <IconButton
                aria-label="Ordered List"
                icon={<Text>1.</Text>}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                colorScheme={editor.isActive("orderedList") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Checkbox List">
              <IconButton
                aria-label="Task List"
                icon={<Text>☑</Text>}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive("taskList")}
                colorScheme={editor.isActive("taskList") ? "blue" : "gray"}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          {/* Highlight */}
          <Menu>
            <Tooltip label="Highlight">
              <MenuButton
                as={IconButton}
                aria-label="Highlight"
                icon={<Text bg="yellow.300" px={1}>H</Text>}
                size="sm"
                variant="outline"
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHighlight({ color: "#fff59d" }).run()}
              >
                <Box w="full" bg="#fff59d" p={2} borderRadius="md">
                  Yellow
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHighlight({ color: "#f48fb1" }).run()}
              >
                <Box w="full" bg="#f48fb1" p={2} borderRadius="md">
                  Pink
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHighlight({ color: "#80cbc4" }).run()}
              >
                <Box w="full" bg="#80cbc4" p={2} borderRadius="md">
                  Teal
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().toggleHighlight({ color: "#ce93d8" }).run()}
              >
                <Box w="full" bg="#ce93d8" p={2} borderRadius="md">
                  Purple
                </Box>
              </MenuItem>
              <MenuItem onClick={() => editor.chain().focus().unsetHighlight().run()}>
                Remove Highlight
              </MenuItem>
            </MenuList>
          </Menu>

          <Divider orientation="vertical" h="24px" />

          {/* Code & Quote */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Code Block">
              <IconButton
                aria-label="Code Block"
                icon={<Text fontFamily="monospace">&lt;/&gt;</Text>}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                colorScheme={editor.isActive("codeBlock") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Inline Code">
              <IconButton
                aria-label="Code"
                icon={<Text fontFamily="monospace" fontSize="xs">code</Text>}
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                colorScheme={editor.isActive("code") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Blockquote">
              <IconButton
                aria-label="Blockquote"
                icon={<Text>"</Text>}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                colorScheme={editor.isActive("blockquote") ? "blue" : "gray"}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          {/* Insert */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Insert Link">
              <IconButton
                aria-label="Link"
                icon={<Text>🔗</Text>}
                onClick={addLink}
                isActive={editor.isActive("link")}
                colorScheme={editor.isActive("link") ? "blue" : "gray"}
              />
            </Tooltip>
            <Tooltip label="Insert Image">
              <IconButton
                aria-label="Image"
                icon={<Text>🖼️</Text>}
                onClick={addImage}
              />
            </Tooltip>
            <Tooltip label="Insert Table">
              <IconButton
                aria-label="Table"
                icon={<Text>📊</Text>}
                onClick={addTable}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" />

          {/* Undo/Redo */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Undo (Ctrl+Z)">
              <IconButton
                aria-label="Undo"
                icon={<Text>↶</Text>}
                onClick={() => editor.chain().focus().undo().run()}
                isDisabled={!editor.can().undo()}
              />
            </Tooltip>
            <Tooltip label="Redo (Ctrl+Y)">
              <IconButton
                aria-label="Redo"
                icon={<Text>↷</Text>}
                onClick={() => editor.chain().focus().redo().run()}
                isDisabled={!editor.can().redo()}
              />
            </Tooltip>
          </ButtonGroup>
        </HStack>
      </Box>

      {/* Editor Content */}
      <Box
        className="editor-content"
        sx={{
          ".ProseMirror": {
            minHeight: minHeight,
            outline: "none",
            p: 4,
            color: colorMode === "dark" ? "white" : "black",
          },
          ".ProseMirror p.is-editor-empty:first-of-type::before": {
            content: `"${placeholder}"`,
            color: colorMode === "dark" ? "gray.500" : "gray.400",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
          ".ProseMirror h1": {
            fontSize: "2em",
            fontWeight: "bold",
            marginTop: "0.5em",
            marginBottom: "0.5em",
          },
          ".ProseMirror h2": {
            fontSize: "1.5em",
            fontWeight: "bold",
            marginTop: "0.5em",
            marginBottom: "0.5em",
          },
          ".ProseMirror h3": {
            fontSize: "1.25em",
            fontWeight: "bold",
            marginTop: "0.5em",
            marginBottom: "0.5em",
          },
          ".ProseMirror ul, .ProseMirror ol": {
            padding: "0 1rem",
            margin: "0.5rem 0",
          },
          ".ProseMirror code": {
            backgroundColor: colorMode === "dark" ? "gray.700" : "gray.100",
            borderRadius: "0.25rem",
            padding: "0.2rem 0.4rem",
            fontSize: "0.9em",
            fontFamily: "monospace",
          },
          ".ProseMirror pre": {
            backgroundColor: colorMode === "dark" ? "#1e1e1e" : "#f5f5f5",
            borderRadius: "0.5rem",
            padding: "1rem",
            margin: "0.5rem 0",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.9em",
          },
          ".ProseMirror blockquote": {
            borderLeft: "3px solid",
            borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
            paddingLeft: "1rem",
            marginLeft: "0",
            fontStyle: "italic",
            color: colorMode === "dark" ? "gray.400" : "gray.600",
          },
          ".ProseMirror table": {
            borderCollapse: "collapse",
            margin: "1rem 0",
            overflow: "hidden",
            width: "100%",
          },
          ".ProseMirror table td, .ProseMirror table th": {
            border: "1px solid",
            borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
            padding: "0.5rem",
            position: "relative",
          },
          ".ProseMirror table th": {
            backgroundColor: colorMode === "dark" ? "gray.700" : "gray.100",
            fontWeight: "bold",
            textAlign: "left",
          },
          ".ProseMirror ul[data-type='taskList']": {
            listStyle: "none",
            padding: 0,
          },
          ".ProseMirror ul[data-type='taskList'] li": {
            display: "flex",
            alignItems: "center",
          },
          ".ProseMirror ul[data-type='taskList'] li > label": {
            marginRight: "0.5rem",
          },
          ".ProseMirror img": {
            maxWidth: "100%",
            height: "auto",
            borderRadius: "0.5rem",
            margin: "0.5rem 0",
          },
          ".ProseMirror a": {
            color: "blue.500",
            textDecoration: "underline",
            cursor: "pointer",
          },
          ".ProseMirror mark": {
            borderRadius: "0.25rem",
            padding: "0.1rem 0.2rem",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Character Count */}
      <Box
        p={2}
        borderTop="1px solid"
        borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
        bg={colorMode === "dark" ? "gray.700" : "gray.50"}
        fontSize="xs"
        color="text.tertiary"
        textAlign="right"
      >
        {editor.storage.characterCount?.characters() || 0} characters
        {" · "}
        {editor.storage.characterCount?.words() || 0} words
      </Box>
    </Box>
  );
}
