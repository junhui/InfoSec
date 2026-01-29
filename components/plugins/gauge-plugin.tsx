"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface GaugePluginProps {
  settings: {
    value?: number;
    maxValue?: number;
    label?: string;
    thresholds?: {
      warning?: number;
      critical?: number;
    };
    valueField?: string;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function GaugePlugin({ settings, dataSources = [], variables = [] }: GaugePluginProps) {
  const {
    value: staticValue = 0,
    maxValue = 100,
    label = "Score",
    thresholds = { warning: 50, critical: 25 },
    valueField,
  } = settings;

  // Use the first data source if available
  const primaryDataSource = dataSources[0];
  const { data, loading, error } = useDataSource(primaryDataSource, variables);

  // Extract value from data source if valueField is specified
  const value = React.useMemo(() => {
    if (valueField && data) {
      try {
        const path = valueField.split(".");
        let current: unknown = data;
        for (const key of path) {
          if (current && typeof current === "object" && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return staticValue;
          }
        }
        return typeof current === "number" ? current : Number(current) || staticValue;
      } catch {
        return staticValue;
      }
    }
    return staticValue;
  }, [data, valueField, staticValue]);

  const percentage = Math.min((value / maxValue) * 100, 100);

  const getColor = () => {
    if (value <= thresholds.critical!) return "text-destructive";
    if (value <= thresholds.warning!) return "text-warning";
    return "text-success";
  };

  const getStrokeColor = () => {
    if (value <= thresholds.critical!) return "var(--color-destructive)";
    if (value <= thresholds.warning!) return "var(--color-warning)";
    return "var(--color-success)";
  };

  // SVG arc calculations
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-xs text-destructive">Error</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <div className="relative">
        <svg width={size} height={size / 2 + 8} className="-rotate-0">
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
          <span className={cn("text-lg font-bold", getColor())}>{value}</span>
        </div>
      </div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
