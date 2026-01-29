// Mock data for plugins

export const threatData = [
  { date: "Mon", threats: 12, blocked: 10 },
  { date: "Tue", threats: 19, blocked: 17 },
  { date: "Wed", threats: 8, blocked: 8 },
  { date: "Thu", threats: 15, blocked: 14 },
  { date: "Fri", threats: 22, blocked: 20 },
  { date: "Sat", threats: 6, blocked: 6 },
  { date: "Sun", threats: 4, blocked: 4 },
];

export const vulnerabilityData = [
  { category: "Critical", count: 8, fill: "var(--color-chart-5)" },
  { category: "High", count: 23, fill: "var(--color-chart-1)" },
  { category: "Medium", count: 45, fill: "var(--color-chart-3)" },
  { category: "Low", count: 67, fill: "var(--color-chart-2)" },
];

export const incidentData = [
  { type: "Malware", value: 35, fill: "var(--color-chart-5)" },
  { type: "Phishing", value: 28, fill: "var(--color-chart-1)" },
  { type: "DDoS", value: 15, fill: "var(--color-chart-2)" },
  { type: "Data Breach", value: 12, fill: "var(--color-chart-3)" },
  { type: "Other", value: 10, fill: "var(--color-chart-4)" },
];

export const recentTasks = [
  { id: "SEC-001", title: "Review firewall rules", status: "In Progress", priority: "High" },
  { id: "SEC-002", title: "Update SSL certificates", status: "To Do", priority: "Critical" },
  { id: "SEC-003", title: "Patch vulnerable servers", status: "Done", priority: "High" },
  { id: "SEC-004", title: "Conduct security audit", status: "In Progress", priority: "Medium" },
  { id: "SEC-005", title: "Review access logs", status: "To Do", priority: "Low" },
  { id: "SEC-006", title: "Update IDS signatures", status: "Backlog", priority: "Medium" },
];

export const recentAlerts = [
  {
    id: "ALT-001",
    title: "Suspicious login attempt detected",
    severity: "critical",
    time: "2 min ago",
    source: "Auth System",
  },
  {
    id: "ALT-002",
    title: "Unusual outbound traffic pattern",
    severity: "high",
    time: "15 min ago",
    source: "Network Monitor",
  },
  {
    id: "ALT-003",
    title: "Failed SSH authentication (5 attempts)",
    severity: "medium",
    time: "32 min ago",
    source: "Server: prod-web-01",
  },
  {
    id: "ALT-004",
    title: "New device connected to network",
    severity: "low",
    time: "1 hour ago",
    source: "Network Scanner",
  },
  {
    id: "ALT-005",
    title: "Certificate expiring in 7 days",
    severity: "medium",
    time: "2 hours ago",
    source: "Certificate Monitor",
  },
];

export const defaultPages: { id: string; name: string; description: string; plugins: Array<{ id: string; type: string; title: string; width: number; height: number; settings: Record<string, unknown> }> }[] = [
  {
    id: "default",
    name: "Security Overview",
    description: "Default security dashboard",
    plugins: [
      {
        id: "stat-1",
        type: "stat-card",
        title: "Active Threats",
        width: 1,
        height: 1,
        settings: { label: "Active Threats", value: "23", trend: "down", trendValue: "-8%", color: "destructive" },
      },
      {
        id: "stat-2",
        type: "stat-card",
        title: "Open Vulnerabilities",
        width: 1,
        height: 1,
        settings: { label: "Open Vulnerabilities", value: "143", trend: "up", trendValue: "+5%", color: "warning" },
      },
      {
        id: "stat-3",
        type: "stat-card",
        title: "Resolved This Week",
        width: 1,
        height: 1,
        settings: { label: "Resolved This Week", value: "67", trend: "up", trendValue: "+23%", color: "success" },
      },
      {
        id: "gauge-1",
        type: "gauge",
        title: "Security Score",
        width: 1,
        height: 1,
        settings: { value: 78, maxValue: 100, label: "Security Score", thresholds: { warning: 60, critical: 40 } },
      },
      {
        id: "line-1",
        type: "line-chart",
        title: "Threat Activity",
        width: 2,
        height: 2,
        settings: { dataSource: "threats", timeRange: "7d" },
      },
      {
        id: "bar-1",
        type: "bar-chart",
        title: "Vulnerabilities by Severity",
        width: 2,
        height: 2,
        settings: { dataSource: "vulnerabilities", orientation: "vertical" },
      },
      {
        id: "alert-1",
        type: "alert-list",
        title: "Recent Alerts",
        width: 2,
        height: 2,
        settings: { maxItems: 5, severity: "all" },
      },
      {
        id: "table-1",
        type: "table",
        title: "Recent Tasks",
        width: 2,
        height: 2,
        settings: { dataSource: "recent-tasks", columns: ["id", "title", "status", "priority"], pageSize: 5 },
      },
    ],
  },
];
