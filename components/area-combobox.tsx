"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Shield,
  AlertTriangle,
  FileCheck,
  Lock,
  Network,
  Code,
  Cloud,
  Database,
  Radio,
  Target,
} from "lucide-react";

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

export interface AreaOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const areas: AreaOption[] = [
  {
    id: "vulnerability",
    name: "Vulnerability Management",
    description: "Scan, assess and remediate vulnerabilities",
    icon: AlertTriangle,
  },
  {
    id: "incident",
    name: "Incident Response",
    description: "Handle and resolve security incidents",
    icon: Shield,
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Regulatory and policy compliance",
    icon: FileCheck,
  },
  {
    id: "access",
    name: "Access Control",
    description: "Identity and access management",
    icon: Lock,
  },
  {
    id: "network",
    name: "Network Security",
    description: "Firewalls, IDS/IPS, network monitoring",
    icon: Network,
  },
  {
    id: "application",
    name: "Application Security",
    description: "Secure SDLC and app testing",
    icon: Code,
  },
  {
    id: "cloud",
    name: "Cloud Security",
    description: "Cloud infrastructure security",
    icon: Cloud,
  },
  {
    id: "data",
    name: "Data Protection",
    description: "Encryption and data security",
    icon: Database,
  },
  {
    id: "secops",
    name: "Security Operations",
    description: "SOC and security monitoring",
    icon: Radio,
  },
  {
    id: "risk",
    name: "Risk Management",
    description: "Risk assessment and mitigation",
    icon: Target,
  },
];

interface AreaComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function AreaCombobox({
  value,
  onValueChange,
  placeholder = "Select area...",
}: AreaComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selectedArea = areas.find((area) => area.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 font-normal bg-transparent"
        >
          {selectedArea ? (
            <div className="flex items-center gap-2">
              <selectedArea.icon className="size-4 text-muted-foreground" />
              <span>{selectedArea.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search areas..." />
          <CommandList>
            <CommandEmpty>No area found.</CommandEmpty>
            <CommandGroup>
              {areas.map((area) => (
                <CommandItem
                  key={area.id}
                  value={area.name}
                  onSelect={() => {
                    onValueChange(area.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="flex size-7 items-center justify-center rounded bg-muted">
                    <area.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">{area.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {area.description}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === area.id ? "opacity-100" : "opacity-0"
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

export { areas };
