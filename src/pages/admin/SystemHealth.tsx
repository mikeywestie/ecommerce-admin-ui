import { useEffect, useState } from "react";

import type { HealthStatus } from "@/types/HealthStatus";
import { getSystemHealth } from "@/services/systemHealthService";

type DisplayStatus = "UP" | "DOWN" | "OUT_OF_SERVICE" | "NOT_EXPOSED";

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSystemHealth();
  }, []);

  async function loadSystemHealth() {
    try {
      setLoading(true);
      setError("");

      const data = await getSystemHealth();
      setHealth(data);
    } catch {
      setError("Failed to load system health.");
    } finally {
      setLoading(false);
    }
  }

  function getStatusStyle(status: DisplayStatus | string) {
    if (status === "UP") return "bg-green-500/20 text-green-400";
    if (status === "NOT_EXPOSED") return "bg-slate-500/20 text-slate-300";
    return "bg-red-500/20 text-red-400";
  }

  function formatStatus(status: DisplayStatus | string) {
    if (status === "NOT_EXPOSED") return "Restricted in Production";
    return status;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">System Health</h1>

        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
          {error}
        </div>

        <button
          onClick={loadSystemHealth}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">System Health</h1>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-16 bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">System Health</h1>

        <div className="bg-slate-800 rounded-2xl p-6 text-slate-400">
          Health data is unavailable.
        </div>
      </div>
    );
  }

  const productionDetailsHidden = !health.components;

  const components = [
    { name: "Application", status: health.status ?? "NOT_EXPOSED" },
    {
      name: "Database",
      status: health.components?.db?.status ?? "NOT_EXPOSED",
    },
    {
      name: "Disk Space",
      status: health.components?.diskSpace?.status ?? "NOT_EXPOSED",
    },
    {
      name: "Liveness",
      status: health.components?.livenessState?.status ?? "NOT_EXPOSED",
    },
    {
      name: "Readiness",
      status: health.components?.readinessState?.status ?? "NOT_EXPOSED",
    },
    {
      name: "Ping",
      status: health.components?.ping?.status ?? "NOT_EXPOSED",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="mt-2 text-slate-400">
            Live API availability and production health visibility.
          </p>
        </div>

        <button
          onClick={loadSystemHealth}
          className="w-full rounded-xl bg-slate-700 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-600 md:w-auto"
        >
          Refresh
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Component</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {components.map((component) => (
              <tr
                key={component.name}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4">{component.name}</td>

                <td className="p-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      component.status
                    )}`}
                  >
                    {formatStatus(component.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productionDetailsHidden && (
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-2xl p-4 text-sm">
          Detailed component health is intentionally restricted in production.
          The public health endpoint confirms the application is available.
        </div>
      )}

      {health.groups && health.groups.length > 0 && (
        <div className="mt-6 bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3">Health Groups</h2>

          <div className="flex flex-wrap gap-2">
            {health.groups.map((group) => (
              <span
                key={group}
                className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}