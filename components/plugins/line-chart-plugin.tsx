"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { threatData } from "@/lib/page-builder/mock-data";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface LineChartPluginProps {
  settings: {
    dataSource?: string;
    timeRange?: string;
    xField?: string;
    yFields?: string[];
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

const chartColors = [
  "var(--color-chart-5)",
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export function LineChartPlugin({ settings, dataSources = [], variables = [] }: LineChartPluginProps) {
  const { xField = "date", yFields = ["threats", "blocked"] } = settings;

  // Find the referenced data source
  const primaryDataSource = dataSources.find(
    (ds) => ds.id === settings.dataSource || ds.name === settings.dataSource
  );
  const { data: fetchedData, loading, error } = useDataSource(primaryDataSource, variables);

  // Use fetched data or fall back to mock data
  const data = Array.isArray(fetchedData) ? fetchedData : threatData;

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
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey={xField}
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
          />
          <Legend
            wrapperStyle={{ fontSize: 10 }}
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
          />
          {yFields.map((field, index) => (
            <Line
              key={field}
              type="monotone"
              dataKey={field}
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={false}
              name={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
