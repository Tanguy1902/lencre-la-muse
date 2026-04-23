"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Avelao ny teny hikoriana...",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[512px] py-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      <div className="sticky top-24 z-40 mb-8 flex justify-center">
        <div className="glass-panel flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 shadow-sm">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-full transition-colors ${
              editor.isActive("bold") ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">format_bold</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-full transition-colors ${
              editor.isActive("italic") ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">format_italic</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-full transition-colors ${
              editor.isActive("underline") ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">format_underlined</span>
          </button>
          
          <div className="mx-1 h-4 w-px bg-outline-variant" />
          
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded-full transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">format_align_left</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded-full transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">format_align_center</span>
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
