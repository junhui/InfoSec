"use client";

import * as React from "react";
import { Plus, Trash2, Variable as VariableIcon, ChevronDown, ChevronUp, Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { type Variable, builtInVariables } from "@/lib/page-builder/types";

interface VariablesConfigProps {
  variables: Variable[];
  onChange: (variables: Variable[]) => void;
}

export function VariablesConfig({ variables, onChange }: VariablesConfigProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
  const [showBuiltIn, setShowBuiltIn] = React.useState(false);

  const addVariable = () => {
    const newVariable: Variable = {
      id: `var-${Date.now()}`,
      name: `variable${variables.length + 1}`,
      type: "static",
      value: "",
      description: "",
    };
    onChange([...variables, newVariable]);
    setExpandedIds(new Set([...expandedIds, newVariable.id]));
  };

  const updateVariable = (id: string, updates: Partial<Variable>) => {
    onChange(variables.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVariable = (id: string) => {
    onChange(variables.filter((v) => v.id !== id));
    const newExpanded = new Set(expandedIds);
    newExpanded.delete(id);
    setExpandedIds(newExpanded);
  };

  const duplicateVariable = (v: Variable) => {
    const newVariable: Variable = {
      ...v,
      id: `var-${Date.now()}`,
      name: `${v.name}_copy`,
    };
    onChange([...variables, newVariable]);
    setExpandedIds(new Set([...expandedIds, newVariable.id]));
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getTypeLabel = (type: Variable["type"]) => {
    switch (type) {
      case "static":
        return "Static";
      case "querystring":
        return "Query";
      case "timestamp":
        return "Timestamp";
      case "date":
        return "Date";
      case "datetime":
        return "DateTime";
      case "custom":
        return "Custom";
      default:
        return type;
    }
  };

  const getTypeColor = (type: Variable["type"]) => {
    switch (type) {
      case "static":
        return "bg-blue-500/10 text-blue-500";
      case "querystring":
        return "bg-amber-500/10 text-amber-500";
      case "timestamp":
      case "date":
      case "datetime":
        return "bg-emerald-500/10 text-emerald-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VariableIcon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Variables</span>
          <Badge variant="secondary" className="text-xs">
            {variables.length + builtInVariables.length}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 bg-transparent text-xs"
          onClick={addVariable}
        >
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {/* Built-in Variables */}
      <Collapsible open={showBuiltIn} onOpenChange={setShowBuiltIn}>
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 hover:bg-muted/50">
            <Lock className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Built-in Variables</span>
            <Badge variant="secondary" className="text-[10px]">{builtInVariables.length}</Badge>
            {showBuiltIn ? (
              <ChevronUp className="ml-auto size-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-1 rounded-md border border-border bg-muted/30 p-2">
            {builtInVariables.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded px-2 py-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    {"{{" + v.name + "}}"}
                  </code>
                  <Badge className={`text-[10px] ${getTypeColor(v.type)}`} variant="secondary">
                    {getTypeLabel(v.type)}
                  </Badge>
                </div>
                <span className="text-muted-foreground">{v.description}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Custom Variables */}
      {variables.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">No custom variables defined</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variables.map((v) => (
            <Collapsible
              key={v.id}
              open={expandedIds.has(v.id)}
              onOpenChange={() => toggleExpanded(v.id)}
            >
              <div className="rounded-md border border-border bg-card">
                <CollapsibleTrigger asChild>
                  <div className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {"{{" + v.name + "}}"}
                      </code>
                      <Badge className={`text-[10px] ${getTypeColor(v.type)}`} variant="secondary">
                        {getTypeLabel(v.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateVariable(v);
                        }}
                      >
                        <Copy className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVariable(v.id);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                      {expandedIds.has(v.id) ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 border-t border-border p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={v.name}
                          onChange={(e) =>
                            updateVariable(v.id, {
                              name: e.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                            })
                          }
                          className="h-8 font-mono text-sm"
                          placeholder="variableName"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={v.type}
                          onValueChange={(t) =>
                            updateVariable(v.id, { type: t as Variable["type"] })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="static">Static Value</SelectItem>
                            <SelectItem value="querystring">Query String</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="datetime">DateTime</SelectItem>
                            <SelectItem value="timestamp">Timestamp</SelectItem>
                            <SelectItem value="custom">Custom Expression</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        {v.type === "static" && "Value"}
                        {v.type === "querystring" && "Query Parameter Name"}
                        {(v.type === "date" || v.type === "datetime") && "Format (e.g. YYYY-MM-DD)"}
                        {v.type === "timestamp" && "Format (optional)"}
                        {v.type === "custom" && "Expression"}
                      </Label>
                      <Input
                        value={v.value || ""}
                        onChange={(e) => updateVariable(v.id, { value: e.target.value })}
                        className="h-8 font-mono text-sm"
                        placeholder={
                          v.type === "static"
                            ? "Enter value"
                            : v.type === "querystring"
                              ? "paramName"
                              : v.type === "date"
                                ? "YYYY-MM-DD"
                                : v.type === "datetime"
                                  ? "YYYY-MM-DD HH:mm:ss"
                                  : ""
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Description (optional)</Label>
                      <Input
                        value={v.description || ""}
                        onChange={(e) => updateVariable(v.id, { description: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="What this variable is for"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
