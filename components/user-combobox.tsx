"use client";

import * as React from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface UserOption {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  role: string;
}

const users: UserOption[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@secureops.com",
    initials: "JD",
    role: "Security Admin",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@secureops.com",
    initials: "SC",
    role: "SOC Analyst",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@secureops.com",
    initials: "MB",
    role: "Security Engineer",
  },
  {
    id: "4",
    name: "Emily Taylor",
    email: "emily.taylor@secureops.com",
    initials: "ET",
    role: "Compliance Officer",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@secureops.com",
    initials: "DK",
    role: "Incident Responder",
  },
  {
    id: "6",
    name: "Lisa Wang",
    email: "lisa.wang@secureops.com",
    initials: "LW",
    role: "Penetration Tester",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james.wilson@secureops.com",
    initials: "JW",
    role: "Security Architect",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria.garcia@secureops.com",
    initials: "MG",
    role: "Risk Analyst",
  },
];

interface UserComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function UserCombobox({
  value,
  onValueChange,
  placeholder = "Select user...",
}: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selectedUser = users.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 font-normal bg-transparent"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-[10px] bg-secondary">
                  {selectedUser.initials}
                </AvatarFallback>
              </Avatar>
              <span>{selectedUser.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onValueChange(user.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  <Avatar className="size-7">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-[10px] bg-secondary">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { users };
