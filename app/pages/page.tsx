"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, LayoutGrid, MoreHorizontal, Pencil, Trash2, Copy, Eye } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultPages } from "@/lib/page-builder/mock-data";
import type { PageConfig } from "@/lib/page-builder/types";

// Mock API - in real app this would be a backend call
const mockPages: PageConfig[] = [
  {
    id: "default",
    name: "Security Overview",
    description: "Main security dashboard with key metrics and alerts",
    plugins: defaultPages[0].plugins as PageConfig["plugins"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "threats",
    name: "Threat Analysis",
    description: "Detailed threat monitoring and analysis dashboard",
    plugins: [],
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-19T11:00:00Z",
  },
  {
    id: "compliance",
    name: "Compliance Dashboard",
    description: "Compliance metrics and audit status",
    plugins: [],
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
];

export default function PagesPage() {
  const [pages, setPages] = React.useState<PageConfig[]>(mockPages);
  const [newPageDialogOpen, setNewPageDialogOpen] = React.useState(false);
  const [newPageName, setNewPageName] = React.useState("");
  const [newPageDescription, setNewPageDescription] = React.useState("");

  const handleCreatePage = () => {
    if (!newPageName.trim()) return;

    const newPage: PageConfig = {
      id: `page-${Date.now()}`,
      name: newPageName,
      description: newPageDescription,
      plugins: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages([...pages, newPage]);
    setNewPageName("");
    setNewPageDescription("");
    setNewPageDialogOpen(false);
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const handleDuplicatePage = (page: PageConfig) => {
    const newPage: PageConfig = {
      ...page,
      id: `page-${Date.now()}`,
      name: `${page.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPages([...pages, newPage]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopHeader breadcrumbs={[{ label: "Pages" }]} />
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Pages</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create and manage custom dashboard pages with plugins
                </p>
              </div>
              <Dialog open={newPageDialogOpen} onOpenChange={setNewPageDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" />
                    New Page
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>Create a new dashboard page that you can customize with plugins</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-name">Page Name</Label>
                      <Input
                        id="page-name"
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        placeholder="My Dashboard"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="page-description">Description</Label>
                      <Textarea
                        id="page-description"
                        value={newPageDescription}
                        onChange={(e) => setNewPageDescription(e.target.value)}
                        placeholder="A brief description of this page..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewPageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePage} disabled={!newPageName.trim()}>
                      Create Page
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Card key={page.id} className="group relative transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <LayoutGrid className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">{page.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {page.plugins.length} plugin{page.plugins.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/pages/${page.id}`}>
                              <Eye className="mr-2 size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/pages/${page.id}?edit=true`}>
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicatePage(page)}>
                            <Copy className="mr-2 size-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeletePage(page.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                      {page.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Updated {formatDate(page.updatedAt)}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                        <Link href={`/pages/${page.id}`}>Open</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty state card for creating new page */}
              <Card
                className="flex cursor-pointer flex-col items-center justify-center border-dashed p-6 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
                onClick={() => setNewPageDialogOpen(true)}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="size-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">Create New Page</p>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
