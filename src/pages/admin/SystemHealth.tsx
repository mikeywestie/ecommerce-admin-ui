import { useEffect, useState } from "react";

import { FRONTEND_BUILD_INFO } from "@/config/frontendBuildInfo";
import type { BackendBuildInfo } from "@/types/BuildInfo";
import type { HealthStatus } from "@/types/HealthStatus";
import { getBackendBuildInfo } from "@/services/buildInfoService";
import { getSystemHealth } from "@/services/systemHealthService";

type DisplayStatus = "UP" | "DOWN" | "OUT_OF_SERVICE" | "NOT_EXPOSED";

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [backendBuildInfo, setBackendBuildInfo] = useState<BackendBuildInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSystemHealth();
  }, []);

  async function loadSystemHealth() {
    try {
      setLoading(true);
      setError("");

      const [healthData, backendBuildData] = await Promise.all([
        getSystemHealth(),
        getBackendBuildInfo().catch(() => null),
      ]);

      setHealth(healthData);
      setBackendBuildInfo(backendBuildData);
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
        <h1 className="mb-6 text-3xl font-bold">System Health</h1>

        <div className="rounded-xl border border-red-500 bg-red-500/20 p-4 text-red-400">
          {error}
        </div>

        <button
          onClick={loadSystemHealth}
          className="mt-4 rounded-xl bg-slate-700 px-4 py-2 hover:bg-slate-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">System Health</h1>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">System Health</h1>

        <div className="rounded-2xl bg-slate-800 p-6 text-slate-400">
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
            Live API availability, frontend/backend build versions, and production health
            visibility.
          </p>
        </div>

        <button
          onClick={loadSystemHealth}
          className="w-full rounded-xl bg-slate-700 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-600 md:w-auto"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-slate-800 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">Frontend</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoItem label="Version" value={FRONTEND_BUILD_INFO.version} />
            <InfoItem label="Commit" value={FRONTEND_BUILD_INFO.commitShort} mono />
            <InfoItem label="Branch" value={FRONTEND_BUILD_INFO.branch} />
            <InfoItem
              label="Build Time"
              value={new Date(FRONTEND_BUILD_INFO.buildTime).toLocaleString()}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-slate-800 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Backend</p>

          {backendBuildInfo ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoItem label="Version" value={backendBuildInfo.version} />
              <InfoItem label="Commit" value={backendBuildInfo.commitShort} mono />
              <InfoItem
                label="Branch / Env"
                value={`${backendBuildInfo.branch} / ${backendBuildInfo.environment}`}
              />
              <InfoItem
                label="Build Time"
                value={new Date(backendBuildInfo.buildTime).toLocaleString()}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Backend build information is unavailable.</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Component</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {components.map((component) => (
              <tr
                key={component.name}
                className="border-t border-slate-700 transition hover:bg-slate-700"
              >
                <td className="p-4">{component.name}</td>

                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
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
        <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
          Detailed component health is intentionally restricted in production. The public health
          endpoint confirms the application is available.
        </div>
      )}

      {health.groups && health.groups.length > 0 && (
        <div className="mt-6 rounded-2xl bg-slate-800 p-6">
          <h2 className="mb-3 text-xl font-bold">Health Groups</h2>

          <div className="flex flex-wrap gap-2">
            {health.groups.map((group) => (
              <span
                key={group}
                className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300"
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

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 truncate font-semibold text-white ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
