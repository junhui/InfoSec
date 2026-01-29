"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";
import { PageBuilder } from "@/components/page-builder/page-builder";
import { defaultPages } from "@/lib/page-builder/mock-data";
import type { PageConfig, PluginConfig, DataSource, Variable } from "@/lib/page-builder/types";

// Mock data - in real app this would come from API
const mockPagesData: Record<string, PageConfig> = {
  default: {
    id: "default",
    name: "Security Overview",
    description: "Main security dashboard with key metrics and alerts",
    plugins: defaultPages[0].plugins as PluginConfig[],
    dataSources: [
      {
        id: "ds-example",
        name: "Example API",
        type: "api",
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts?_limit=5",
        refreshInterval: 0,
      },
    ],
    variables: [
      {
        id: "var-env",
        name: "environment",
        type: "static",
        value: "production",
        description: "Current environment",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  threats: {
    id: "threats",
    name: "Threat Analysis",
    description: "Detailed threat monitoring and analysis dashboard",
    plugins: [
      {
        id: "text-intro",
        type: "text",
        title: "Welcome",
        width: 4,
        height: 1,
        settings: {
          content:
            "# Threat Analysis Dashboard\n\nThis dashboard provides real-time threat intelligence and analysis.\n\n- Monitor active threats\n- Track threat trends over time\n- View detailed threat breakdowns",
        },
      },
      {
        id: "stat-active",
        type: "stat-card",
        title: "Active Threats",
        width: 1,
        height: 1,
        settings: { label: "Active Threats", value: "23", trend: "down", trendValue: "-8%", color: "destructive" },
      },
      {
        id: "stat-blocked",
        type: "stat-card",
        title: "Blocked Today",
        width: 1,
        height: 1,
        settings: { label: "Blocked Today", value: "156", trend: "up", trendValue: "+12%", color: "success" },
      },
      {
        id: "gauge-risk",
        type: "gauge",
        title: "Risk Level",
        width: 1,
        height: 1,
        settings: { value: 35, maxValue: 100, label: "Risk Level", thresholds: { warning: 50, critical: 75 } },
      },
      {
        id: "gauge-coverage",
        type: "gauge",
        title: "Coverage",
        width: 1,
        height: 1,
        settings: { value: 92, maxValue: 100, label: "Coverage", thresholds: { warning: 70, critical: 50 } },
      },
      {
        id: "line-threats",
        type: "line-chart",
        title: "Threat Activity (7 Days)",
        width: 2,
        height: 2,
        settings: { dataSource: "threats", timeRange: "7d" },
      },
      {
        id: "pie-types",
        type: "pie-chart",
        title: "Threat Types",
        width: 2,
        height: 2,
        settings: { dataSource: "incidents", showLegend: true },
      },
      {
        id: "alerts-critical",
        type: "alert-list",
        title: "Critical Alerts",
        width: 4,
        height: 2,
        settings: { maxItems: 6, severity: "all" },
      },
    ] as PluginConfig[],
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-19T11:00:00Z",
  },
  compliance: {
    id: "compliance",
    name: "Compliance Dashboard",
    description: "Compliance metrics and audit status",
    plugins: [
      {
        id: "gauge-overall",
        type: "gauge",
        title: "Overall Compliance",
        width: 1,
        height: 1,
        settings: { value: 87, maxValue: 100, label: "Compliance Score", thresholds: { warning: 70, critical: 50 } },
      },
      {
        id: "gauge-pci",
        type: "gauge",
        title: "PCI DSS",
        width: 1,
        height: 1,
        settings: { value: 95, maxValue: 100, label: "PCI DSS", thresholds: { warning: 80, critical: 60 } },
      },
      {
        id: "gauge-hipaa",
        type: "gauge",
        title: "HIPAA",
        width: 1,
        height: 1,
        settings: { value: 78, maxValue: 100, label: "HIPAA", thresholds: { warning: 70, critical: 50 } },
      },
      {
        id: "gauge-soc2",
        type: "gauge",
        title: "SOC 2",
        width: 1,
        height: 1,
        settings: { value: 82, maxValue: 100, label: "SOC 2", thresholds: { warning: 70, critical: 50 } },
      },
      {
        id: "bar-controls",
        type: "bar-chart",
        title: "Control Implementation Status",
        width: 2,
        height: 2,
        settings: { dataSource: "vulnerabilities", orientation: "vertical" },
      },
      {
        id: "table-audits",
        type: "table",
        title: "Recent Audit Findings",
        width: 2,
        height: 2,
        settings: { dataSource: "recent-tasks", columns: ["id", "title", "status", "priority"], pageSize: 5 },
      },
    ] as PluginConfig[],
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
};

export default function PageDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const pageId = params.id as string;
  const isEditing = searchParams.get("edit") === "true";

  const [pageData, setPageData] = React.useState<PageConfig | null>(null);

  React.useEffect(() => {
    // Simulate API fetch
    const data = mockPagesData[pageId];
    if (data) {
      setPageData(data);
    } else {
      // Create empty page for new pages
      setPageData({
        id: pageId,
        name: "New Page",
        description: "",
        plugins: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [pageId]);

  const handleSave = (
    plugins: PluginConfig[],
    name: string,
    description: string,
    dataSources: DataSource[],
    variables: Variable[]
  ) => {
    // In real app, this would save to backend
    setPageData((prev) =>
      prev
        ? {
            ...prev,
            name,
            description,
            plugins,
            dataSources,
            variables,
            updatedAt: new Date().toISOString(),
          }
        : null
    );
  };

  if (!pageData) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <TopHeader breadcrumbs={[{ label: "Pages", href: "/pages" }, { label: "Loading..." }]} />
            <main className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopHeader breadcrumbs={[{ label: "Pages", href: "/pages" }, { label: pageData.name }]} />
          <main className="flex-1">
            <PageBuilder
              initialPlugins={pageData.plugins}
              pageName={pageData.name}
              pageDescription={pageData.description}
              pageDataSources={pageData.dataSources || []}
              pageVariables={pageData.variables || []}
              isEditing={isEditing}
              onSave={handleSave}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
