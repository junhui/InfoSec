"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { incidentData } from "@/lib/page-builder/mock-data";
import { type DataSource, type Variable } from "@/lib/page-builder/types";
import { useDataSource } from "@/hooks/use-data-source";

interface PieChartPluginProps {
  settings: {
    dataSource?: string;
    showLegend?: boolean;
    nameField?: string;
    valueField?: string;
  };
  dataSources?: DataSource[];
  variables?: Variable[];
}

const chartColors = [
  "var(--color-chart-5)",
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export function PieChartPlugin({ settings, dataSources = [], variables = [] }: PieChartPluginProps) {
  const { showLegend = true, nameField = "type", valueField = "value" } = settings;

  // Find the referenced data source
  const primaryDataSource = dataSources.find(
    (ds) => ds.id === settings.dataSource || ds.name === settings.dataSource
  );
  const { data: fetchedData, loading, error } = useDataSource(primaryDataSource, variables);

  // Use fetched data or fall back to mock data
  const data = Array.isArray(fetchedData) ? fetchedData : incidentData;

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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={60}
            paddingAngle={2}
            dataKey={valueField}
            nameKey={nameField}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={(entry as Record<string, unknown>).fill as string || chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              fontSize: 11,
            }}
          />
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 10 }}
              formatter={(value) => <span className="text-muted-foreground text-[10px]">{value}</span>}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
