"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface TopHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
}

export function TopHeader({ breadcrumbs }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.label}>
                {index > 0 && <BreadcrumbSeparator />}
                {crumb.href ? (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-secondary border-0"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="size-4" />
        </Button>
      </div>
    </header>
  );
}
