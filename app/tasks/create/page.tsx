import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";
import { CreateTaskForm } from "@/components/create-task-form";

export default function CreateTaskPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopHeader
          breadcrumbs={[
            { label: "Tasks", href: "/tasks" },
            { label: "Create Task" },
          ]}
        />
        <main className="flex-1 p-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4">
              <h1 className="text-lg font-semibold text-foreground">Create Task</h1>
              <p className="text-xs text-muted-foreground">
                Create a new task or story for security operations
              </p>
            </div>
            <CreateTaskForm />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
