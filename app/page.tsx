"use client";

import Link from "next/link";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Active Threats",
    value: "12",
    change: "+2",
    trend: "up",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Open Vulnerabilities",
    value: "47",
    change: "-8",
    trend: "down",
    icon: Bug,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Resolved This Week",
    value: "23",
    change: "+5",
    trend: "up",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Pending Reviews",
    value: "8",
    change: "0",
    trend: "neutral",
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

const recentTasks = [
  {
    id: "1",
    title: "Update firewall rules for production servers",
    type: "task",
    status: "in_progress",
    priority: "high",
    assignee: "John Doe",
  },
  {
    id: "2",
    title: "Q1 Security Audit Preparation",
    type: "story",
    health: "good",
    assignee: "Sarah Chen",
  },
  {
    id: "3",
    title: "Patch CVE-2025-1234 vulnerability",
    type: "task",
    status: "todo",
    priority: "high",
    assignee: "Michael Brown",
  },
  {
    id: "4",
    title: "Implement MFA for admin accounts",
    type: "task",
    status: "done",
    priority: "medium",
    assignee: "Emily Taylor",
  },
  {
    id: "5",
    title: "Cloud Infrastructure Security Review",
    type: "story",
    health: "weak",
    assignee: "David Kim",
  },
];

const recentAlerts = [
  {
    id: "1",
    title: "Suspicious login attempt detected",
    severity: "high",
    time: "5 min ago",
  },
  {
    id: "2",
    title: "Unusual outbound traffic spike",
    severity: "medium",
    time: "23 min ago",
  },
  {
    id: "3",
    title: "SSL certificate expiring soon",
    severity: "low",
    time: "1 hour ago",
  },
  {
    id: "4",
    title: "Failed backup on database server",
    severity: "medium",
    time: "2 hours ago",
  },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    backlog: "bg-muted text-muted-foreground",
    todo: "bg-secondary text-secondary-foreground",
    in_progress: "bg-blue-500/20 text-blue-400",
    done: "bg-success/20 text-success",
  };
  const labels: Record<string, string> = {
    backlog: "Backlog",
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };
  return (
    <Badge variant="secondary" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}

function getHealthBadge(health: string) {
  const styles: Record<string, string> = {
    bad: "bg-destructive/20 text-destructive",
    weak: "bg-orange-500/20 text-orange-400",
    neutral: "bg-muted text-muted-foreground",
    good: "bg-success/20 text-success",
  };
  return (
    <Badge variant="secondary" className={styles[health]}>
      {health.charAt(0).toUpperCase() + health.slice(1)}
    </Badge>
  );
}

function getPriorityBadge(priority: string) {
  const styles: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive",
  };
  return (
    <Badge variant="secondary" className={styles[priority]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

function getSeverityBadge(severity: string) {
  const styles: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive",
  };
  return (
    <Badge variant="secondary" className={styles[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopHeader breadcrumbs={[{ label: "Dashboard" }]} />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Security Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Overview of your security operations and metrics
                </p>
              </div>
              <Button asChild>
                <Link href="/tasks/create">
                  <Plus className="mr-2 size-4" />
                  Create Task
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                        <stat.icon className={`size-5 ${stat.color}`} />
                      </div>
                      {stat.trend !== "neutral" && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            stat.trend === "up"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp className="size-3" />
                          ) : (
                            <TrendingDown className="size-3" />
                          )}
                          {stat.change}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Tasks */}
              <Card className="lg:col-span-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-lg font-medium">
                    Recent Tasks
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/tasks" className="flex items-center gap-1">
                      View All
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex size-2 rounded-full ${
                                task.type === "task"
                                  ? "bg-blue-500"
                                  : "bg-success"
                              }`}
                            />
                            <p className="text-sm font-medium text-foreground truncate">
                              {task.title}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Assigned to {task.assignee}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {task.type === "task" && task.status && (
                            <>
                              {getStatusBadge(task.status)}
                              {task.priority && getPriorityBadge(task.priority)}
                            </>
                          )}
                          {task.type === "story" &&
                            task.health &&
                            getHealthBadge(task.health)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                  <CardTitle className="text-lg font-medium">
                    Recent Alerts
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/alerts" className="flex items-center gap-1">
                      View All
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {alert.title}
                          </p>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {alert.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Score */}
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                      <Shield className="size-8 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Overall Security Score
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        78
                        <span className="text-lg text-muted-foreground">
                          /100
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-md">
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all duration-500"
                        style={{ width: "78%" }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>Critical: 2 issues</span>
                      <span>High: 5 issues</span>
                      <span>Medium: 12 issues</span>
                    </div>
                  </div>
                  <Button variant="outline">View Full Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
