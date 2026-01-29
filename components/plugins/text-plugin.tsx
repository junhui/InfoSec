"use client";

import { type DataSource, type Variable, interpolateVariables } from "@/lib/page-builder/types";

interface TextPluginProps {
  settings: {
    content?: string;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function TextPlugin({ settings, variables = [] }: TextPluginProps) {
  const { content = "Add your content here." } = settings;

  // Interpolate variables in the content
  const interpolatedContent = interpolateVariables(content, variables);

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Heading 1
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="mb-2 text-base font-bold text-foreground">
            {line.slice(2)}
          </h1>
        );
      }
      // Heading 2
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="mb-1.5 text-sm font-semibold text-foreground">
            {line.slice(3)}
          </h2>
        );
      }
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="mb-1 text-xs font-semibold text-foreground">
            {line.slice(4)}
          </h3>
        );
      }
      // Bullet list
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="ml-4 text-[11px] text-muted-foreground">
            {line.slice(2)}
          </li>
        );
      }
      // Empty line
      if (line.trim() === "") {
        return <br key={index} />;
      }
      // Regular paragraph
      return (
        <p key={index} className="text-[11px] text-muted-foreground">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="h-full overflow-auto p-3">
      <div className="prose prose-sm max-w-none dark:prose-invert">{renderContent(interpolatedContent)}</div>
    </div>
  );
}
