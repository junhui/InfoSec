"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading2,
  Quote,
  Undo,
  Redo,
  Strikethrough,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:absolute before:pointer-events-none",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-invert max-w-none focus:outline-none min-h-[80px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-0.5 p-1 border-b border-border bg-muted/30">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className="size-7 p-0"
        >
          <Bold className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className="size-7 p-0"
        >
          <Italic className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          className="size-7 p-0"
        >
          <Strikethrough className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Code"
          className="size-7 p-0"
        >
          <Code className="size-3.5" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading"
          className="size-7 p-0"
        >
          <Heading2 className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
          className="size-7 p-0"
        >
          <List className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
          className="size-7 p-0"
        >
          <ListOrdered className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          aria-label="Quote"
          className="size-7 p-0"
        >
          <Quote className="size-3.5" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
          className="size-7 p-0"
        >
          <Undo className="size-3.5" />
        </Toggle>
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
          className="size-7 p-0"
        >
          <Redo className="size-3.5" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
