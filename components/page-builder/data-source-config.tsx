"use client";

import * as React from "react";
import { Plus, Trash2, Database, Globe, FileJson, ChevronDown, ChevronUp, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { type DataSource, type Variable, builtInVariables } from "@/lib/page-builder/types";
import { cn } from "@/lib/utils";

interface DataSourceConfigProps {
  dataSources: DataSource[];
  onChange: (dataSources: DataSource[]) => void;
  variables?: Variable[];
  compact?: boolean;
}

export function DataSourceConfig({
  dataSources,
  onChange,
  variables = [],
  compact = false,
}: DataSourceConfigProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const addDataSource = () => {
    const newDataSource: DataSource = {
      id: `ds-${Date.now()}`,
      name: `Data Source ${dataSources.length + 1}`,
      type: "api",
      method: "GET",
      url: "",
      refreshInterval: 0,
    };
    onChange([...dataSources, newDataSource]);
    setExpandedIds(new Set([...expandedIds, newDataSource.id]));
  };

  const updateDataSource = (id: string, updates: Partial<DataSource>) => {
    onChange(dataSources.map((ds) => (ds.id === id ? { ...ds, ...updates } : ds)));
  };

  const removeDataSource = (id: string) => {
    onChange(dataSources.filter((ds) => ds.id !== id));
    const newExpanded = new Set(expandedIds);
    newExpanded.delete(id);
    setExpandedIds(newExpanded);
  };

  const duplicateDataSource = (ds: DataSource) => {
    const newDataSource: DataSource = {
      ...ds,
      id: `ds-${Date.now()}`,
      name: `${ds.name} (copy)`,
    };
    onChange([...dataSources, newDataSource]);
    setExpandedIds(new Set([...expandedIds, newDataSource.id]));
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

  const allVariables = [...builtInVariables, ...variables];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Data Sources</span>
          <Badge variant="secondary" className="text-xs">{dataSources.length}</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 bg-transparent text-xs"
          onClick={addDataSource}
        >
          <Plus className="size-3" />
          Add
        </Button>
      </div>

      {dataSources.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">No data sources configured</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dataSources.map((ds) => (
            <Collapsible
              key={ds.id}
              open={expandedIds.has(ds.id)}
              onOpenChange={() => toggleExpanded(ds.id)}
            >
              <div className="rounded-md border border-border bg-card">
                <CollapsibleTrigger asChild>
                  <div className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {ds.type === "api" ? (
                        <Globe className="size-3.5 text-muted-foreground" />
                      ) : (
                        <FileJson className="size-3.5 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">{ds.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {ds.type === "api" ? ds.method : "Static"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateDataSource(ds);
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
                          removeDataSource(ds.id);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                      {expandedIds.has(ds.id) ? (
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
                          value={ds.name}
                          onChange={(e) => updateDataSource(ds.id, { name: e.target.value })}
                          className="h-8 text-sm"
                          placeholder="Data source name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={ds.type}
                          onValueChange={(v) =>
                            updateDataSource(ds.id, { type: v as "api" | "static" })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api">API / URL</SelectItem>
                            <SelectItem value="static">Static JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {ds.type === "api" ? (
                      <>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Method</Label>
                            <Select
                              value={ds.method || "GET"}
                              onValueChange={(v) =>
                                updateDataSource(ds.id, { method: v as "GET" | "POST" })
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3 space-y-1.5">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">URL</Label>
                              <VariableHint variables={allVariables} />
                            </div>
                            <Input
                              value={ds.url || ""}
                              onChange={(e) => updateDataSource(ds.id, { url: e.target.value })}
                              className="h-8 font-mono text-xs"
                              placeholder="https://api.example.com/data?date={{today}}"
                            />
                          </div>
                        </div>

                        {ds.method === "POST" && (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">Request Body (JSON)</Label>
                              <VariableHint variables={allVariables} />
                            </div>
                            <Textarea
                              value={ds.body || ""}
                              onChange={(e) => updateDataSource(ds.id, { body: e.target.value })}
                              className="h-24 resize-none font-mono text-xs"
                              placeholder={'{\n  "startDate": "{{today}}",\n  "limit": 100\n}'}
                            />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs">Headers (JSON)</Label>
                          <Textarea
                            value={ds.headers ? JSON.stringify(ds.headers, null, 2) : ""}
                            onChange={(e) => {
                              try {
                                const headers = e.target.value ? JSON.parse(e.target.value) : {};
                                updateDataSource(ds.id, { headers });
                              } catch {
                                // Invalid JSON, ignore
                              }
                            }}
                            className="h-16 resize-none font-mono text-xs"
                            placeholder={'{\n  "Authorization": "Bearer {{apiKey}}"\n}'}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Refresh Interval (seconds)</Label>
                          <Input
                            type="number"
                            value={ds.refreshInterval || 0}
                            onChange={(e) =>
                              updateDataSource(ds.id, { refreshInterval: Number(e.target.value) })
                            }
                            className="h-8 w-32 text-sm"
                            min={0}
                            placeholder="0 = no refresh"
                          />
                          <p className="text-[10px] text-muted-foreground">0 = no auto-refresh</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Static JSON Data</Label>
                          <VariableHint variables={allVariables} />
                        </div>
                        <Textarea
                          value={ds.staticData || ""}
                          onChange={(e) => updateDataSource(ds.id, { staticData: e.target.value })}
                          className="h-32 resize-none font-mono text-xs"
                          placeholder={'[\n  { "name": "Item 1", "value": 100 },\n  { "name": "Item 2", "value": 200 }\n]'}
                        />
                      </div>
                    )}
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

function VariableHint({ variables }: { variables: Variable[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-3 cursor-help text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="mb-2 text-xs font-medium">Available Variables:</p>
          <div className="space-y-1">
            {variables.map((v) => (
              <div key={v.id} className="flex items-center gap-2 text-xs">
                <code className="rounded bg-muted px-1">{"{{" + v.name + "}}"}</code>
                {v.description && (
                  <span className="text-muted-foreground">{v.description}</span>
                )}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
