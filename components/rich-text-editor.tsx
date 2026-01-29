"use client";

import * as React from "react";
import { Bold, Italic, List, ListOrdered, Link2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = React.useState<string[]>([]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("insertUnorderedList")) formats.push("ul");
    if (document.queryCommandState("insertOrderedList")) formats.push("ol");
    setActiveFormats(formats);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
    updateActiveFormats();
  };

  const handleKeyUp = () => {
    updateActiveFormats();
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", label: "Bold" },
    { icon: Italic, command: "italic", label: "Italic" },
    { icon: List, command: "insertUnorderedList", label: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List" },
    { icon: Code, command: "formatBlock", value: "pre", label: "Code Block" },
  ];

  return (
    <div className={cn("rounded-md border border-input bg-background", className)}>
      <div className="flex items-center gap-1 border-b border-input p-1">
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.command}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-7",
              activeFormats.includes(btn.command) && "bg-accent"
            )}
            onClick={() => execCommand(btn.command, btn.value)}
            title={btn.label}
          >
            <btn.icon className="size-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 text-sm focus:outline-none [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:rounded [&_pre]:my-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={updateActiveFormats}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        style={{
          minHeight: "120px",
        }}
      />
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--muted-foreground);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
