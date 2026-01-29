"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type DataSource, type Variable, interpolateVariables } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface StatCardPluginProps {
  settings: {
    label?: string;
    value?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    color?: "default" | "success" | "warning" | "destructive";
    valueField?: string;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function StatCardPlugin({ settings, dataSources = [], variables = [] }: StatCardPluginProps) {
  const {
    label = "Metric",
    value = "0",
    trend = "neutral",
    trendValue = "",
    color = "default",
    valueField,
  } = settings;

  // Use the first data source if available
  const primaryDataSource = dataSources[0];
  const { data, loading, error } = useDataSource(primaryDataSource, variables);

  // Extract value from data source if valueField is specified
  const displayValue = React.useMemo(() => {
    if (valueField && data) {
      try {
        const path = valueField.split(".");
        let current: unknown = data;
        for (const key of path) {
          if (current && typeof current === "object" && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return value;
          }
        }
        return String(current);
      } catch {
        return value;
      }
    }
    return value;
  }, [data, valueField, value]);

  const colorClasses = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  const trendColorClasses = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
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
      <div className="flex h-full flex-col justify-between p-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xs text-destructive">Error loading data</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between p-3">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between">
        <p className={cn("text-xl font-bold", colorClasses[color])}>{displayValue}</p>
        {trendValue && (
          <div className={cn("flex items-center gap-1 text-[10px] font-medium", trendColorClasses[trend])}>
            {trend === "up" && <TrendingUp className="size-3" />}
            {trend === "down" && <TrendingDown className="size-3" />}
            {trend === "neutral" && <Minus className="size-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
