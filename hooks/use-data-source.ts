"use client";

import * as React from "react";
import { type DataSource, type Variable, interpolateVariables } from "@/lib/page-builder/types";

interface UseDataSourceResult {
  data: unknown;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDataSource(
  dataSource: DataSource | undefined,
  variables: Variable[] = []
): UseDataSourceResult {
  const [data, setData] = React.useState<unknown>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Get query params from URL (client-side only)
  const queryParams = React.useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, []);

  const fetchData = React.useCallback(async () => {
    if (!dataSource) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (dataSource.type === "static") {
        // Parse static JSON data
        if (dataSource.staticData) {
          const interpolated = interpolateVariables(dataSource.staticData, variables, queryParams);
          const parsed = JSON.parse(interpolated);
          setData(parsed);
        } else {
          setData(null);
        }
      } else if (dataSource.type === "api" && dataSource.url) {
        // Interpolate variables in URL
        const url = interpolateVariables(dataSource.url, variables, queryParams);

        // Prepare headers
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (dataSource.headers) {
          Object.entries(dataSource.headers).forEach(([key, value]) => {
            headers[key] = interpolateVariables(value, variables, queryParams);
          });
        }

        // Prepare request options
        const options: RequestInit = {
          method: dataSource.method || "GET",
          headers,
        };

        // Add body for POST requests
        if (dataSource.method === "POST" && dataSource.body) {
          options.body = interpolateVariables(dataSource.body, variables, queryParams);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [dataSource, variables, queryParams]);

  // Initial fetch
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh if configured
  React.useEffect(() => {
    if (!dataSource?.refreshInterval || dataSource.refreshInterval <= 0) {
      return;
    }

    const interval = setInterval(fetchData, dataSource.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [dataSource?.refreshInterval, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook to use multiple data sources
export function useMultipleDataSources(
  dataSources: DataSource[],
  variables: Variable[] = []
): Record<string, UseDataSourceResult> {
  const results: Record<string, UseDataSourceResult> = {};

  // We need to call hooks unconditionally, so we'll create individual results
  // This is a simplified approach - in production you might want a more sophisticated solution
  const results0 = useDataSource(dataSources[0], variables);
  const results1 = useDataSource(dataSources[1], variables);
  const results2 = useDataSource(dataSources[2], variables);
  const results3 = useDataSource(dataSources[3], variables);
  const results4 = useDataSource(dataSources[4], variables);

  const allResults = [results0, results1, results2, results3, results4];

  dataSources.slice(0, 5).forEach((ds, index) => {
    results[ds.id] = allResults[index];
    results[ds.name] = allResults[index];
  });

  return results;
}
