"use client";

import { Loader2 } from "lucide-react";
import { recentTasks } from "@/lib/page-builder/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface TablePluginProps {
  settings: {
    dataSource?: string;
    columns?: string[];
    pageSize?: number;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function TablePlugin({ settings, dataSources = [], variables = [] }: TablePluginProps) {
  const { columns = ["id", "title", "status", "priority"], pageSize = 5 } = settings;

  // Find the referenced data source
  const primaryDataSource = dataSources.find(
    (ds) => ds.id === settings.dataSource || ds.name === settings.dataSource
  );
  const { data: fetchedData, loading, error } = useDataSource(primaryDataSource, variables);

  // Use fetched data or fall back to mock data
  const rawData = Array.isArray(fetchedData) ? fetchedData : recentTasks;
  const data = rawData.slice(0, pageSize);

  const statusColors: Record<string, string> = {
    "In Progress": "bg-chart-2/20 text-chart-2 border-chart-2/30",
    "To Do": "bg-muted text-muted-foreground border-muted",
    Done: "bg-success/20 text-success border-success/30",
    Backlog: "bg-muted text-muted-foreground border-muted",
  };

  const priorityColors: Record<string, string> = {
    Critical: "bg-destructive/20 text-destructive border-destructive/30",
    High: "bg-chart-5/20 text-chart-5 border-chart-5/30",
    Medium: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Low: "bg-muted text-muted-foreground border-muted",
  };

  const getCellContent = (row: Record<string, unknown>, column: string) => {
    const value = row[column];
    if (value === undefined || value === null) return "-";

    const stringValue = String(value);

    // Special rendering for known columns
    if (column === "status" && statusColors[stringValue]) {
      return (
        <Badge variant="outline" className={cn("text-[10px]", statusColors[stringValue])}>
          {stringValue}
        </Badge>
      );
    }
    if (column === "priority" && priorityColors[stringValue]) {
      return (
        <Badge variant="outline" className={cn("text-[10px]", priorityColors[stringValue])}>
          {stringValue}
        </Badge>
      );
    }

    return stringValue;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-destructive">Error loading data</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden p-2">
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-left">
              {columns.map((col) => (
                <th key={col} className="px-2 py-1.5 font-medium text-muted-foreground capitalize">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                {columns.map((col) => (
                  <td key={col} className="px-2 py-1.5">
                    {getCellContent(row as Record<string, unknown>, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
