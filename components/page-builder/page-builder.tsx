"use client";

import * as React from "react";
import {
  Plus,
  Settings,
  Trash2,
  Hash,
  TrendingUp,
  BarChart3,
  PieChart,
  Table,
  Bell,
  Gauge,
  Type,
  ChevronDown,
  ChevronUp,
  Save,
  Database,
  Variable,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PluginRenderer } from "@/components/plugins";
import { DataSourceConfig } from "./data-source-config";
import { VariablesConfig } from "./variables-config";
import {
  type PluginConfig,
  type PluginType,
  type DataSource,
  type Variable as VariableType,
  pluginDefinitions,
  builtInVariables,
} from "@/lib/page-builder/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Hash> = {
  Hash,
  TrendingUp,
  BarChart3,
  PieChart,
  Table,
  Bell,
  Gauge,
  Type,
};

interface PageBuilderProps {
  initialPlugins?: PluginConfig[];
  pageName?: string;
  pageDescription?: string;
  pageDataSources?: DataSource[];
  pageVariables?: VariableType[];
  isEditing?: boolean;
  onSave?: (
    plugins: PluginConfig[],
    name: string,
    description: string,
    dataSources: DataSource[],
    variables: VariableType[]
  ) => void;
}

export function PageBuilder({
  initialPlugins = [],
  pageName = "New Page",
  pageDescription = "",
  pageDataSources = [],
  pageVariables = [],
  isEditing: initialIsEditing = false,
  onSave,
}: PageBuilderProps) {
  const [plugins, setPlugins] = React.useState<PluginConfig[]>(initialPlugins);
  const [isEditing, setIsEditing] = React.useState(initialIsEditing);
  const [name, setName] = React.useState(pageName);
  const [description, setDescription] = React.useState(pageDescription);
  const [dataSources, setDataSources] = React.useState<DataSource[]>(pageDataSources);
  const [variables, setVariables] = React.useState<VariableType[]>(pageVariables);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [pageSettingsOpen, setPageSettingsOpen] = React.useState(false);
  const [selectedPlugin, setSelectedPlugin] = React.useState<PluginConfig | null>(null);

  const handleAddPlugin = (type: PluginType) => {
    const definition = pluginDefinitions.find((p) => p.type === type);
    if (!definition) return;

    const newPlugin: PluginConfig = {
      id: `plugin-${Date.now()}`,
      type,
      title: definition.name,
      width: definition.defaultWidth,
      height: definition.defaultHeight,
      settings: { ...definition.defaultSettings },
      dataSources: [],
    };

    setPlugins([...plugins, newPlugin]);
    setAddDialogOpen(false);
  };

  const handleRemovePlugin = (id: string) => {
    setPlugins(plugins.filter((p) => p.id !== id));
  };

  const handleUpdatePlugin = (id: string, updates: Partial<PluginConfig>) => {
    setPlugins(plugins.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleMovePlugin = (id: string, direction: "up" | "down") => {
    const index = plugins.findIndex((p) => p.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === plugins.length - 1) return;

    const newPlugins = [...plugins];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newPlugins[index], newPlugins[swapIndex]] = [newPlugins[swapIndex], newPlugins[index]];
    setPlugins(newPlugins);
  };

  const handleSave = () => {
    onSave?.(plugins, name, description, dataSources, variables);
    setIsEditing(false);
  };

  const openSettings = (plugin: PluginConfig) => {
    setSelectedPlugin(plugin);
    setSettingsDialogOpen(true);
  };

  const allVariables = [...builtInVariables, ...variables];
  const allDataSources = [...dataSources, ...plugins.flatMap((p) => p.dataSources || [])];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-7 w-48 text-sm font-semibold"
              placeholder="Page name"
            />
          ) : (
            <h1 className="text-sm font-semibold text-foreground">{name}</h1>
          )}
          {!isEditing && description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              {/* Page Settings */}
              <Dialog open={pageSettingsOpen} onOpenChange={setPageSettingsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 bg-transparent text-xs">
                    <Layers className="size-3" />
                    Page Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Page Settings</DialogTitle>
                    <DialogDescription>
                      Configure page-level data sources and variables
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="datasources" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="datasources" className="gap-1.5 text-xs">
                        <Database className="size-3" />
                        Data Sources
                      </TabsTrigger>
                      <TabsTrigger value="variables" className="gap-1.5 text-xs">
                        <Variable className="size-3" />
                        Variables
                      </TabsTrigger>
                      <TabsTrigger value="general" className="gap-1.5 text-xs">
                        <Settings className="size-3" />
                        General
                      </TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[400px] pr-4">
                      <TabsContent value="datasources" className="mt-4">
                        <DataSourceConfig
                          dataSources={dataSources}
                          onChange={setDataSources}
                          variables={variables}
                        />
                      </TabsContent>
                      <TabsContent value="variables" className="mt-4">
                        <VariablesConfig variables={variables} onChange={setVariables} />
                      </TabsContent>
                      <TabsContent value="general" className="mt-4 space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Page Name</Label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-20 resize-none"
                            placeholder="Page description..."
                          />
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* Add Plugin */}
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 bg-transparent text-xs">
                    <Plus className="size-3" />
                    Add Plugin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Plugin</DialogTitle>
                    <DialogDescription>Select a plugin to add to your page</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 py-4">
                    {pluginDefinitions.map((plugin) => {
                      const Icon = iconMap[plugin.icon] || Hash;
                      return (
                        <button
                          key={plugin.type}
                          onClick={() => handleAddPlugin(plugin.type)}
                          className="flex items-start gap-2.5 rounded-lg border border-border p-2.5 text-left transition-colors hover:bg-muted"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                            <Icon className="size-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground">{plugin.name}</p>
                            <p className="text-[10px] text-muted-foreground">{plugin.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={handleSave}>
                <Save className="size-3" />
                Save
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 bg-transparent text-xs"
              onClick={() => setIsEditing(true)}
            >
              <Settings className="size-3" />
              Edit Page
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {plugins.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Plus className="size-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-foreground">No plugins yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {isEditing
                ? 'Click "Add Plugin" to start building your page'
                : 'Click "Edit Page" to add plugins'}
            </p>
          </div>
        ) : (
          <div className="grid auto-rows-[160px] grid-cols-4 gap-3">
            {plugins.map((plugin) => (
              <Card
                key={plugin.id}
                className={cn(
                  "relative overflow-hidden transition-shadow",
                  isEditing && "ring-1 ring-border hover:ring-muted-foreground/50",
                  plugin.width === 1 && "col-span-1",
                  plugin.width === 2 && "col-span-2",
                  plugin.width === 3 && "col-span-3",
                  plugin.width === 4 && "col-span-4",
                  plugin.height === 2 && "row-span-2"
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-xs font-medium text-foreground">
                      {plugin.title}
                    </CardTitle>
                    {plugin.dataSources && plugin.dataSources.length > 0 && (
                      <Database className="size-3 text-muted-foreground" />
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        onClick={() => handleMovePlugin(plugin.id, "up")}
                      >
                        <ChevronUp className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        onClick={() => handleMovePlugin(plugin.id, "down")}
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        onClick={() => openSettings(plugin)}
                      >
                        <Settings className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5 text-destructive hover:text-destructive"
                        onClick={() => handleRemovePlugin(plugin.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="h-[calc(100%-32px)] p-0">
                  <PluginRenderer
                    type={plugin.type}
                    settings={plugin.settings}
                    dataSources={[...dataSources, ...(plugin.dataSources || [])]}
                    variables={allVariables}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Plugin Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Plugin Settings</DialogTitle>
            <DialogDescription>Configure the plugin settings and data sources</DialogDescription>
          </DialogHeader>
          {selectedPlugin && (
            <Tabs defaultValue="general" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general" className="gap-1.5 text-xs">
                  <Settings className="size-3" />
                  General
                </TabsTrigger>
                <TabsTrigger value="datasources" className="gap-1.5 text-xs">
                  <Database className="size-3" />
                  Data Sources
                </TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[400px] pr-4">
                <TabsContent value="general" className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={selectedPlugin.title}
                      onChange={(e) => {
                        setSelectedPlugin({ ...selectedPlugin, title: e.target.value });
                        handleUpdatePlugin(selectedPlugin.id, { title: e.target.value });
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Width</Label>
                      <Select
                        value={String(selectedPlugin.width)}
                        onValueChange={(v) => {
                          const width = Number(v) as 1 | 2 | 3 | 4;
                          setSelectedPlugin({ ...selectedPlugin, width });
                          handleUpdatePlugin(selectedPlugin.id, { width });
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Height</Label>
                      <Select
                        value={String(selectedPlugin.height)}
                        onValueChange={(v) => {
                          const height = Number(v) as 1 | 2;
                          setSelectedPlugin({ ...selectedPlugin, height });
                          handleUpdatePlugin(selectedPlugin.id, { height });
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Row</SelectItem>
                          <SelectItem value="2">2 Rows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Plugin-specific settings */}
                  {selectedPlugin.type === "stat-card" && (
                    <StatCardSettings
                      settings={
                        selectedPlugin.settings as {
                          label?: string;
                          value?: string;
                          trend?: string;
                          trendValue?: string;
                          color?: string;
                          valueField?: string;
                        }
                      }
                      onChange={(settings) => {
                        setSelectedPlugin({ ...selectedPlugin, settings });
                        handleUpdatePlugin(selectedPlugin.id, { settings });
                      }}
                      dataSources={[...dataSources, ...(selectedPlugin.dataSources || [])]}
                    />
                  )}
                  {selectedPlugin.type === "text" && (
                    <TextSettings
                      settings={selectedPlugin.settings as { content?: string }}
                      onChange={(settings) => {
                        setSelectedPlugin({ ...selectedPlugin, settings });
                        handleUpdatePlugin(selectedPlugin.id, { settings });
                      }}
                    />
                  )}
                  {selectedPlugin.type === "gauge" && (
                    <GaugeSettings
                      settings={
                        selectedPlugin.settings as {
                          value?: number;
                          maxValue?: number;
                          label?: string;
                          valueField?: string;
                        }
                      }
                      onChange={(settings) => {
                        setSelectedPlugin({ ...selectedPlugin, settings });
                        handleUpdatePlugin(selectedPlugin.id, { settings });
                      }}
                      dataSources={[...dataSources, ...(selectedPlugin.dataSources || [])]}
                    />
                  )}
                  {(selectedPlugin.type === "line-chart" ||
                    selectedPlugin.type === "bar-chart" ||
                    selectedPlugin.type === "pie-chart") && (
                    <ChartSettings
                      type={selectedPlugin.type}
                      settings={selectedPlugin.settings}
                      onChange={(settings) => {
                        setSelectedPlugin({ ...selectedPlugin, settings });
                        handleUpdatePlugin(selectedPlugin.id, { settings });
                      }}
                      dataSources={[...dataSources, ...(selectedPlugin.dataSources || [])]}
                    />
                  )}
                  {selectedPlugin.type === "table" && (
                    <TableSettings
                      settings={
                        selectedPlugin.settings as {
                          dataSource?: string;
                          columns?: string[];
                          pageSize?: number;
                        }
                      }
                      onChange={(settings) => {
                        setSelectedPlugin({ ...selectedPlugin, settings });
                        handleUpdatePlugin(selectedPlugin.id, { settings });
                      }}
                      dataSources={[...dataSources, ...(selectedPlugin.dataSources || [])]}
                    />
                  )}
                </TabsContent>
                <TabsContent value="datasources" className="mt-4">
                  <DataSourceConfig
                    dataSources={selectedPlugin.dataSources || []}
                    onChange={(ds) => {
                      setSelectedPlugin({ ...selectedPlugin, dataSources: ds });
                      handleUpdatePlugin(selectedPlugin.id, { dataSources: ds });
                    }}
                    variables={variables}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Plugin-specific settings components
function StatCardSettings({
  settings,
  onChange,
  dataSources,
}: {
  settings: {
    label?: string;
    value?: string;
    trend?: string;
    trendValue?: string;
    color?: string;
    valueField?: string;
  };
  onChange: (settings: Record<string, unknown>) => void;
  dataSources: DataSource[];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Label</Label>
          <Input
            value={settings.label || ""}
            onChange={(e) => onChange({ ...settings, label: e.target.value })}
            className="h-8"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Static Value</Label>
          <Input
            value={settings.value || ""}
            onChange={(e) => onChange({ ...settings, value: e.target.value })}
            className="h-8"
          />
        </div>
      </div>
      {dataSources.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Value from Data Source (field path)</Label>
          <Input
            value={settings.valueField || ""}
            onChange={(e) => onChange({ ...settings, valueField: e.target.value })}
            className="h-8 font-mono text-xs"
            placeholder="e.g., data.count or result[0].value"
          />
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Trend</Label>
          <Select
            value={settings.trend || "neutral"}
            onValueChange={(v) => onChange({ ...settings, trend: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="down">Down</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Trend Value</Label>
          <Input
            value={settings.trendValue || ""}
            onChange={(e) => onChange({ ...settings, trendValue: e.target.value })}
            className="h-8"
            placeholder="+12%"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <Select
            value={settings.color || "default"}
            onValueChange={(v) => onChange({ ...settings, color: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

function TextSettings({
  settings,
  onChange,
}: {
  settings: { content?: string };
  onChange: (settings: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Content (Markdown supported)</Label>
      <Textarea
        value={settings.content || ""}
        onChange={(e) => onChange({ ...settings, content: e.target.value })}
        rows={6}
        className="font-mono text-xs"
      />
    </div>
  );
}

function GaugeSettings({
  settings,
  onChange,
  dataSources,
}: {
  settings: { value?: number; maxValue?: number; label?: string; valueField?: string };
  onChange: (settings: Record<string, unknown>) => void;
  dataSources: DataSource[];
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs">Label</Label>
        <Input
          value={settings.label || ""}
          onChange={(e) => onChange({ ...settings, label: e.target.value })}
          className="h-8"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Value</Label>
          <Input
            type="number"
            value={settings.value || 0}
            onChange={(e) => onChange({ ...settings, value: Number(e.target.value) })}
            className="h-8"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Max Value</Label>
          <Input
            type="number"
            value={settings.maxValue || 100}
            onChange={(e) => onChange({ ...settings, maxValue: Number(e.target.value) })}
            className="h-8"
          />
        </div>
      </div>
      {dataSources.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Value from Data Source (field path)</Label>
          <Input
            value={settings.valueField || ""}
            onChange={(e) => onChange({ ...settings, valueField: e.target.value })}
            className="h-8 font-mono text-xs"
            placeholder="e.g., data.score or result.percentage"
          />
        </div>
      )}
    </>
  );
}

function ChartSettings({
  type,
  settings,
  onChange,
  dataSources,
}: {
  type: "line-chart" | "bar-chart" | "pie-chart";
  settings: Record<string, unknown>;
  onChange: (settings: Record<string, unknown>) => void;
  dataSources: DataSource[];
}) {
  const dataSourceOptions = [
    { value: "threats", label: "Threat Data (mock)" },
    { value: "vulnerabilities", label: "Vulnerability Data (mock)" },
    { value: "incidents", label: "Incident Data (mock)" },
    ...dataSources.map((ds) => ({ value: ds.id, label: ds.name })),
  ];

  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs">Data Source</Label>
        <Select
          value={(settings.dataSource as string) || ""}
          onValueChange={(v) => onChange({ ...settings, dataSource: v })}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            {dataSourceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {type === "line-chart" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">X-Axis Field</Label>
            <Input
              value={(settings.xField as string) || ""}
              onChange={(e) => onChange({ ...settings, xField: e.target.value })}
              className="h-8 font-mono text-xs"
              placeholder="date"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Y-Axis Fields (comma-separated)</Label>
            <Input
              value={((settings.yFields as string[]) || []).join(", ")}
              onChange={(e) =>
                onChange({
                  ...settings,
                  yFields: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="h-8 font-mono text-xs"
              placeholder="threats, blocked"
            />
          </div>
        </div>
      )}
      {type === "bar-chart" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Category Field</Label>
            <Input
              value={(settings.categoryField as string) || ""}
              onChange={(e) => onChange({ ...settings, categoryField: e.target.value })}
              className="h-8 font-mono text-xs"
              placeholder="category"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Value Field</Label>
            <Input
              value={(settings.valueField as string) || ""}
              onChange={(e) => onChange({ ...settings, valueField: e.target.value })}
              className="h-8 font-mono text-xs"
              placeholder="count"
            />
          </div>
        </div>
      )}
      {type === "pie-chart" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Name Field</Label>
            <Input
              value={(settings.nameField as string) || ""}
              onChange={(e) => onChange({ ...settings, nameField: e.target.value })}
              className="h-8 font-mono text-xs"
              placeholder="type"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Value Field</Label>
            <Input
              value={(settings.valueField as string) || ""}
              onChange={(e) => onChange({ ...settings, valueField: e.target.value })}
              className="h-8 font-mono text-xs"
              placeholder="value"
            />
          </div>
        </div>
      )}
    </>
  );
}

function TableSettings({
  settings,
  onChange,
  dataSources,
}: {
  settings: { dataSource?: string; columns?: string[]; pageSize?: number };
  onChange: (settings: Record<string, unknown>) => void;
  dataSources: DataSource[];
}) {
  const dataSourceOptions = [
    { value: "recent-tasks", label: "Recent Tasks (mock)" },
    ...dataSources.map((ds) => ({ value: ds.id, label: ds.name })),
  ];

  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs">Data Source</Label>
        <Select
          value={settings.dataSource || ""}
          onValueChange={(v) => onChange({ ...settings, dataSource: v })}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            {dataSourceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Columns (comma-separated)</Label>
        <Input
          value={(settings.columns || []).join(", ")}
          onChange={(e) =>
            onChange({
              ...settings,
              columns: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          className="h-8 font-mono text-xs"
          placeholder="id, title, status, priority"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Page Size</Label>
        <Input
          type="number"
          value={settings.pageSize || 5}
          onChange={(e) => onChange({ ...settings, pageSize: Number(e.target.value) })}
          className="h-8 w-24"
          min={1}
          max={50}
        />
      </div>
    </>
  );
}
