"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserCombobox } from "@/components/user-combobox";
import { AreaCombobox } from "@/components/area-combobox";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Badge } from "@/components/ui/badge";

type TaskType = "task" | "story";
type TaskStatus = "backlog" | "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";
type StoryHealth = "bad" | "weak" | "neutral" | "good";

interface TaskFormData {
  type: TaskType;
  name: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  area: string;
  assigneeId: string;
  reporterId: string;
  startDate?: Date;
  endDate?: Date;
  health?: StoryHealth;
}

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: "backlog", label: "Backlog", color: "bg-muted text-muted-foreground" },
  { value: "todo", label: "To Do", color: "bg-secondary text-secondary-foreground" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-500/20 text-blue-400" },
  { value: "done", label: "Done", color: "bg-success/20 text-success" },
];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-muted text-muted-foreground" },
  { value: "medium", label: "Medium", color: "bg-warning/20 text-warning" },
  { value: "high", label: "High", color: "bg-destructive/20 text-destructive" },
];

const healthOptions: { value: StoryHealth; label: string; color: string }[] = [
  { value: "bad", label: "Bad", color: "bg-destructive/20 text-destructive" },
  { value: "weak", label: "Weak", color: "bg-orange-500/20 text-orange-400" },
  { value: "neutral", label: "Neutral", color: "bg-muted text-muted-foreground" },
  { value: "good", label: "Good", color: "bg-success/20 text-success" },
];

export function CreateTaskForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<TaskFormData>({
    type: "task",
    name: "",
    description: "",
    status: "todo",
    priority: "medium",
    area: "",
    assigneeId: "",
    reporterId: "",
    startDate: undefined,
    endDate: undefined,
    health: "neutral",
  });

  const handleTypeChange = (type: TaskType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      status: type === "task" ? "todo" : undefined,
      priority: type === "task" ? "medium" : undefined,
      startDate: type === "task" ? prev.startDate : undefined,
      endDate: type === "task" ? prev.endDate : undefined,
      health: type === "story" ? "neutral" : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Submitting task:", formData);

    setIsSubmitting(false);
    router.push("/tasks");
  };

  const isTask = formData.type === "task";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type and Name Row */}
      <div className="grid grid-cols-[140px_1fr] gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: TaskType) => handleTypeChange(value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-blue-500" />
                  Task
                </div>
              </SelectItem>
              <SelectItem value="story">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-success" />
                  Story
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">Name</Label>
          <Input
            id="name"
            placeholder="Enter task name..."
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="h-9"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <TiptapEditor
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          placeholder="Describe the task in detail..."
        />
      </div>

      {/* Task-specific fields */}
      {isTask && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TaskStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <Badge variant="secondary" className={cn("text-xs", status.color)}>
                      {status.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: TaskPriority) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <Badge variant="secondary" className={cn("text-xs", priority.color)}>
                      {priority.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 bg-transparent",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {formData.startDate ? (
                    format(formData.startDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-xs">Pick date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 bg-transparent",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {formData.endDate ? (
                    format(formData.endDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-xs">Pick date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                  initialFocus
                  disabled={(date) =>
                    formData.startDate ? date < formData.startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Story-specific: Health */}
      {!isTask && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Health</Label>
            <Select
              value={formData.health}
              onValueChange={(value: StoryHealth) =>
                setFormData((prev) => ({ ...prev, health: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {healthOptions.map((health) => (
                  <SelectItem key={health.value} value={health.value}>
                    <Badge variant="secondary" className={cn("text-xs", health.color)}>
                      {health.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Area, Assignee, Reporter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Area</Label>
          <AreaCombobox
            value={formData.area}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, area: value }))
            }
            placeholder="Select area..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Assignee</Label>
          <UserCombobox
            value={formData.assigneeId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, assigneeId: value }))
            }
            placeholder="Select assignee..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Reporter</Label>
          <UserCombobox
            value={formData.reporterId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, reporterId: value }))
            }
            placeholder="Select reporter..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
