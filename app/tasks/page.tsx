import Link from "next/link";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Filter } from "lucide-react";

const tasks = [
  {
    id: "SEC-001",
    title: "Update firewall rules for production servers",
    type: "task",
    status: "in_progress",
    priority: "high",
    area: "Network Security",
    assignee: { name: "John Doe", initials: "JD" },
    reporter: { name: "Sarah Chen", initials: "SC" },
    startDate: "2026-01-20",
    endDate: "2026-01-30",
  },
  {
    id: "SEC-002",
    title: "Q1 Security Audit Preparation",
    type: "story",
    health: "good",
    area: "Compliance",
    assignee: { name: "Sarah Chen", initials: "SC" },
    reporter: { name: "Michael Brown", initials: "MB" },
  },
  {
    id: "SEC-003",
    title: "Patch CVE-2025-1234 vulnerability",
    type: "task",
    status: "todo",
    priority: "high",
    area: "Vulnerability Management",
    assignee: { name: "Michael Brown", initials: "MB" },
    reporter: { name: "John Doe", initials: "JD" },
    startDate: "2026-01-25",
    endDate: "2026-01-28",
  },
  {
    id: "SEC-004",
    title: "Implement MFA for admin accounts",
    type: "task",
    status: "done",
    priority: "medium",
    area: "Access Control",
    assignee: { name: "Emily Taylor", initials: "ET" },
    reporter: { name: "David Kim", initials: "DK" },
    startDate: "2026-01-10",
    endDate: "2026-01-18",
  },
  {
    id: "SEC-005",
    title: "Cloud Infrastructure Security Review",
    type: "story",
    health: "weak",
    area: "Cloud Security",
    assignee: { name: "David Kim", initials: "DK" },
    reporter: { name: "Lisa Wang", initials: "LW" },
  },
  {
    id: "SEC-006",
    title: "Review and update incident response playbook",
    type: "task",
    status: "backlog",
    priority: "low",
    area: "Incident Response",
    assignee: { name: "Lisa Wang", initials: "LW" },
    reporter: { name: "James Wilson", initials: "JW" },
    startDate: "2026-02-01",
    endDate: "2026-02-15",
  },
  {
    id: "SEC-007",
    title: "Zero Trust Architecture Implementation",
    type: "story",
    health: "neutral",
    area: "Network Security",
    assignee: { name: "James Wilson", initials: "JW" },
    reporter: { name: "Maria Garcia", initials: "MG" },
  },
  {
    id: "SEC-008",
    title: "Database encryption audit",
    type: "task",
    status: "in_progress",
    priority: "medium",
    area: "Data Protection",
    assignee: { name: "Maria Garcia", initials: "MG" },
    reporter: { name: "Emily Taylor", initials: "ET" },
    startDate: "2026-01-22",
    endDate: "2026-02-05",
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

export default function TasksPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopHeader breadcrumbs={[{ label: "Tasks" }]} />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage and track security tasks and stories
                </p>
              </div>
              <Button asChild>
                <Link href="/tasks/create">
                  <Plus className="mr-2 size-4" />
                  Create Task
                </Link>
              </Button>
            </div>

            {/* Filters */}
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-9 bg-background"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Table */}
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status / Health</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="border-border cursor-pointer hover:bg-accent/50"
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {task.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex size-2 shrink-0 rounded-full ${
                                task.type === "task"
                                  ? "bg-blue-500"
                                  : "bg-success"
                              }`}
                            />
                            <span className="font-medium text-foreground">
                              {task.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {task.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.type === "task" && task.status
                            ? getStatusBadge(task.status)
                            : task.health && getHealthBadge(task.health)}
                        </TableCell>
                        <TableCell>
                          {task.type === "task" && task.priority
                            ? getPriorityBadge(task.priority)
                            : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {task.area}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-[10px] bg-secondary">
                                {task.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing 8 of 8 tasks</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
