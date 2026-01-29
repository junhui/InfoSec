"use client";

import type { PluginType, DataSource, Variable } from "@/lib/page-builder/types";
import { StatCardPlugin } from "./stat-card-plugin";
import { LineChartPlugin } from "./line-chart-plugin";
import { BarChartPlugin } from "./bar-chart-plugin";
import { PieChartPlugin } from "./pie-chart-plugin";
import { TablePlugin } from "./table-plugin";
import { AlertListPlugin } from "./alert-list-plugin";
import { GaugePlugin } from "./gauge-plugin";
import { TextPlugin } from "./text-plugin";

interface PluginRendererProps {
  type: PluginType;
  settings: Record<string, unknown>;
  dataSources?: DataSource[];
  variables?: Variable[];
}

export function PluginRenderer({ type, settings, dataSources = [], variables = [] }: PluginRendererProps) {
  switch (type) {
    case "stat-card":
      return (
        <StatCardPlugin
          settings={settings as Parameters<typeof StatCardPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "line-chart":
      return (
        <LineChartPlugin
          settings={settings as Parameters<typeof LineChartPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "bar-chart":
      return (
        <BarChartPlugin
          settings={settings as Parameters<typeof BarChartPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "pie-chart":
      return (
        <PieChartPlugin
          settings={settings as Parameters<typeof PieChartPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "table":
      return (
        <TablePlugin
          settings={settings as Parameters<typeof TablePlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "alert-list":
      return (
        <AlertListPlugin
          settings={settings as Parameters<typeof AlertListPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "gauge":
      return (
        <GaugePlugin
          settings={settings as Parameters<typeof GaugePlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    case "text":
      return (
        <TextPlugin
          settings={settings as Parameters<typeof TextPlugin>[0]["settings"]}
          dataSources={dataSources}
          variables={variables}
        />
      );
    default:
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Unknown plugin type: {type}
        </div>
      );
  }
}
