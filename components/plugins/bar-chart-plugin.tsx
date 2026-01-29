"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { vulnerabilityData } from "@/lib/page-builder/mock-data";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface BarChartPluginProps {
  settings: {
    dataSource?: string;
    orientation?: "vertical" | "horizontal";
    categoryField?: string;
    valueField?: string;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

const chartColors = [
  "var(--color-chart-5)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-2)",
  "var(--color-chart-4)",
];

export function BarChartPlugin({ settings, dataSources = [], variables = [] }: BarChartPluginProps) {
  const { categoryField = "category", valueField = "count" } = settings;

  // Find the referenced data source
  const primaryDataSource = dataSources.find(
    (ds) => ds.id === settings.dataSource || ds.name === settings.dataSource
  );
  const { data: fetchedData, loading, error } = useDataSource(primaryDataSource, variables);

  // Use fetched data or fall back to mock data
  const data = Array.isArray(fetchedData) ? fetchedData : vulnerabilityData;

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
    <div className="flex h-full flex-col p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey={categoryField}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={{ stroke: "var(--color-border)" }}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={{ stroke: "var(--color-border)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              fontSize: 11,
            }}
            labelStyle={{ color: "var(--color-foreground)" }}
            cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
          />
          <Bar dataKey={valueField} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={(entry as Record<string, unknown>).fill as string || chartColors[index % chartColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
