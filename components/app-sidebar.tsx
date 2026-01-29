"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  ListTodo,
  AlertTriangle,
  Bug,
  FileText,
  Users,
  Settings,
  Bell,
  Lock,
  Database,
  Network,
  KeyRound,
  Eye,
  FileSearch,
  ShieldAlert,
  Server,
  Fingerprint,
  BadgeCheck,
  ChevronDown,
  Plus,
  LayoutGrid,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Pages", icon: LayoutGrid, href: "/pages" },
      { title: "Alerts", icon: Bell, href: "/alerts", badge: 12 },
    ],
  },
  {
    title: "Task Management",
    items: [
      {
        title: "Tasks",
        icon: ListTodo,
        href: "/tasks",
        subItems: [
          { title: "All Tasks", href: "/tasks" },
          { title: "Create Task", href: "/tasks/create" },
          { title: "My Tasks", href: "/tasks/my-tasks" },
          { title: "Backlog", href: "/tasks/backlog" },
        ],
      },
    ],
  },
  {
    title: "Security Operations",
    items: [
      { title: "Vulnerabilities", icon: Bug, href: "/vulnerabilities" },
      { title: "Incidents", icon: AlertTriangle, href: "/incidents" },
      { title: "Threat Intelligence", icon: ShieldAlert, href: "/threats" },
      { title: "Risk Assessment", icon: Eye, href: "/risks" },
    ],
  },
  {
    title: "Assets & Resources",
    items: [
      { title: "Assets Inventory", icon: Server, href: "/assets" },
      { title: "Network Map", icon: Network, href: "/network" },
      { title: "Databases", icon: Database, href: "/databases" },
      { title: "Credentials", icon: KeyRound, href: "/credentials" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { title: "Policies", icon: FileText, href: "/policies" },
      { title: "Audits", icon: FileSearch, href: "/audits" },
      { title: "Certifications", icon: BadgeCheck, href: "/certifications" },
    ],
  },
  {
    title: "Access Control",
    items: [
      { title: "Users", icon: Users, href: "/users" },
      { title: "Roles & Permissions", icon: Lock, href: "/roles" },
      { title: "Authentication", icon: Fingerprint, href: "/auth-settings" },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", icon: Settings, href: "/settings" }],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-accent">
            <Shield className="size-5 text-success" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              SecureOps
            </span>
            <span className="text-xs text-muted-foreground">
              Security Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) =>
                  item.subItems ? (
                    <Collapsible
                      key={item.title}
                      defaultOpen={item.subItems.some((sub) =>
                        pathname.startsWith(sub.href)
                      )}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </span>
                            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href} className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </span>
                          {item.badge && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-sidebar-accent text-xs">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              John Doe
            </span>
            <span className="text-xs text-muted-foreground">
              Security Admin
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
