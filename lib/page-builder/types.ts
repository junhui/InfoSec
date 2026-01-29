export type PluginType =
  | "stat-card"
  | "line-chart"
  | "bar-chart"
  | "pie-chart"
  | "table"
  | "alert-list"
  | "gauge"
  | "text";

// Data Source Types
export type DataSourceType = "api" | "static";
export type HttpMethod = "GET" | "POST";

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  // For API type
  url?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string; // JSON string for POST body
  // For static type
  staticData?: string; // JSON string
  // Refresh interval in seconds (0 = no refresh)
  refreshInterval?: number;
}

export interface Variable {
  id: string;
  name: string;
  type: "static" | "querystring" | "timestamp" | "date" | "datetime" | "custom";
  value?: string; // Default value for static, param name for querystring, format for date types
  description?: string;
}

// Built-in variables that are always available
export const builtInVariables: Variable[] = [
  { id: "now", name: "now", type: "timestamp", description: "Current Unix timestamp" },
  { id: "today", name: "today", type: "date", value: "YYYY-MM-DD", description: "Today's date" },
  { id: "datetime", name: "datetime", type: "datetime", value: "YYYY-MM-DD HH:mm:ss", description: "Current date and time" },
];

export interface PluginConfig {
  id: string;
  type: PluginType;
  title: string;
  width: 1 | 2 | 3 | 4; // Grid columns (out of 4)
  height: 1 | 2; // Grid rows
  settings: Record<string, unknown>;
  // Plugin-level data sources
  dataSources?: DataSource[];
}

export interface PageConfig {
  id: string;
  name: string;
  description: string;
  plugins: PluginConfig[];
  // Page-level data sources (shared across plugins)
  dataSources?: DataSource[];
  // Page-level variables
  variables?: Variable[];
  createdAt: string;
  updatedAt: string;
}

export interface PluginDefinition {
  type: PluginType;
  name: string;
  description: string;
  icon: string;
  defaultWidth: 1 | 2 | 3 | 4;
  defaultHeight: 1 | 2;
  defaultSettings: Record<string, unknown>;
}

// Plugin registry
export const pluginDefinitions: PluginDefinition[] = [
  {
    type: "stat-card",
    name: "Stat Card",
    description: "Display a single metric with optional trend",
    icon: "Hash",
    defaultWidth: 1,
    defaultHeight: 1,
    defaultSettings: {
      label: "Metric",
      value: "0",
      trend: "up",
      trendValue: "+12%",
      color: "default",
      valueField: "", // Field path to extract value from data source
    },
  },
  {
    type: "line-chart",
    name: "Line Chart",
    description: "Time series visualization",
    icon: "TrendingUp",
    defaultWidth: 2,
    defaultHeight: 2,
    defaultSettings: {
      dataSource: "threats",
      timeRange: "7d",
      xField: "date",
      yFields: ["value"],
    },
  },
  {
    type: "bar-chart",
    name: "Bar Chart",
    description: "Categorical data comparison",
    icon: "BarChart3",
    defaultWidth: 2,
    defaultHeight: 2,
    defaultSettings: {
      dataSource: "vulnerabilities",
      orientation: "vertical",
      categoryField: "category",
      valueField: "count",
    },
  },
  {
    type: "pie-chart",
    name: "Pie Chart",
    description: "Distribution visualization",
    icon: "PieChart",
    defaultWidth: 2,
    defaultHeight: 2,
    defaultSettings: {
      dataSource: "incidents",
      showLegend: true,
      nameField: "type",
      valueField: "value",
    },
  },
  {
    type: "table",
    name: "Data Table",
    description: "Tabular data display",
    icon: "Table",
    defaultWidth: 2,
    defaultHeight: 2,
    defaultSettings: {
      dataSource: "recent-tasks",
      columns: ["id", "title", "status", "priority"],
      pageSize: 5,
    },
  },
  {
    type: "alert-list",
    name: "Alert List",
    description: "Recent security alerts",
    icon: "Bell",
    defaultWidth: 2,
    defaultHeight: 2,
    defaultSettings: {
      maxItems: 5,
      severity: "all",
    },
  },
  {
    type: "gauge",
    name: "Gauge",
    description: "Progress or score indicator",
    icon: "Gauge",
    defaultWidth: 1,
    defaultHeight: 1,
    defaultSettings: {
      value: 75,
      maxValue: 100,
      label: "Score",
      thresholds: { warning: 50, critical: 25 },
      valueField: "", // Field path to extract value from data source
    },
  },
  {
    type: "text",
    name: "Text / Markdown",
    description: "Custom text or instructions",
    icon: "Type",
    defaultWidth: 2,
    defaultHeight: 1,
    defaultSettings: {
      content: "# Welcome\n\nAdd your custom content here.",
    },
  },
];

// Helper function to interpolate variables in a string
export function interpolateVariables(
  template: string,
  variables: Variable[],
  queryParams: Record<string, string> = {}
): string {
  let result = template;

  // Process all variables
  for (const variable of [...builtInVariables, ...variables]) {
    const placeholder = `{{${variable.name}}}`;
    let value = "";

    switch (variable.type) {
      case "static":
        value = variable.value || "";
        break;
      case "querystring":
        value = queryParams[variable.value || variable.name] || variable.value || "";
        break;
      case "timestamp":
        value = String(Date.now());
        break;
      case "date":
        value = formatDate(new Date(), variable.value || "YYYY-MM-DD");
        break;
      case "datetime":
        value = formatDate(new Date(), variable.value || "YYYY-MM-DD HH:mm:ss");
        break;
      case "custom":
        value = variable.value || "";
        break;
    }

    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), value);
  }

  return result;
}

// Simple date formatter
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}
