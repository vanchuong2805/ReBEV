import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

// Component con ToolbarButton
const ToolbarButton = ({ onClick, disabled, isActive, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? "bg-gray-800 text-white hover:bg-gray-700"
        : "hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

// Thanh công cụ (Toolbar)
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-b-0 border-gray-300 rounded-t-md">
      {/* Các nút chính */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <Strikethrough className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
      >
        <Pilcrow className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.chain().focus().toggleBulletList().run(),
            console.log(editor.getHTML());
        }}
        isActive={editor.isActive("bulletList")}
      >
        <List className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered className="w-5 h-5" />
      </ToolbarButton>
      {/* 4.Các nút căn lề  */}
      <div className="w-px h-6 mx-1 bg-gray-300"></div> {/* Dải phân cách */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight className="w-5 h-5" />
      </ToolbarButton>
    </div>
  );
};

// Component Tiptap chính
export default function TiptapEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
      }),
      // 3. Cấu hình extension Text Align
      TextAlign.configure({
        types: ["heading", "paragraph"], // Cho phép căn lề cho cả tiêu đề và đoạn văn
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ProseMirror max-w-none focus:outline-none",
      },
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="border border-gray-300 rounded-b-md p-2 min-h-[150px] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_li::marker]:text-gray-700">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
