"use client";

import { AlertTriangle, AlertCircle, Info, AlertOctagon, Loader2 } from "lucide-react";
import { recentAlerts } from "@/lib/page-builder/mock-data";
import { cn } from "@/lib/utils";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface AlertListPluginProps {
  settings: {
    maxItems?: number;
    severity?: "all" | "critical" | "high" | "medium" | "low";
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function AlertListPlugin({ settings, dataSources = [], variables = [] }: AlertListPluginProps) {
  const { maxItems = 5, severity = "all" } = settings;

  // Use the first data source if available
  const primaryDataSource = dataSources[0];
  const { data: fetchedData, loading, error } = useDataSource(primaryDataSource, variables);

  // Use fetched data or fall back to mock data
  let alerts = Array.isArray(fetchedData)
    ? (fetchedData as Array<{ id: string; title: string; severity: string; source: string; time: string }>)
    : recentAlerts;

  if (severity !== "all") {
    alerts = alerts.filter((a) => a.severity === severity);
  }
  alerts = alerts.slice(0, maxItems);

  const severityConfig: Record<string, { icon: typeof AlertTriangle; className: string }> = {
    critical: { icon: AlertOctagon, className: "text-destructive" },
    high: { icon: AlertTriangle, className: "text-chart-5" },
    medium: { icon: AlertCircle, className: "text-chart-3" },
    low: { icon: Info, className: "text-muted-foreground" },
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
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
      <div className="space-y-1 overflow-auto">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.low;
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 p-2 hover:bg-muted/50"
            >
              <Icon className={cn("mt-0.5 size-3 shrink-0", config.className)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-foreground">{alert.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{alert.source}</span>
                  <span>•</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
