import { useEffect, useState } from "react";

import StatCard from "../../components/StatCard";
import { getDashboardSummary } from "../../services/dashboardService";
import type { DashboardSummary } from "../../types/DashboardSummary";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    loadDashboardSummary();
  }, []);

  async function loadDashboardSummary() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardSummary();
      setSummary(data);
      setLastUpdated(new Date().toLocaleString());
    } catch {
      setError("Failed to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>

        <div className="h-96 bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
          {error || "Dashboard data is unavailable."}
        </div>

        <button
          onClick={loadDashboardSummary}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    { title: "Total Orders", value: summary.totalOrders.toString() },
    { title: "Paid Orders", value: summary.paidOrders.toString() },
    { title: "Pending Orders", value: summary.pendingOrders.toString() },
    { title: "Inventory Alerts", value: summary.inventoryAlerts.toString() },
  ];

  const orderStatusData = [
    { status: "Paid", count: summary.paidOrders },
    { status: "Pending", count: summary.pendingOrders },
    { status: "Cancelled", count: summary.cancelledOrders },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Admin performance overview.</p>
        </div>

        {lastUpdated && (
          <button
            onClick={loadDashboardSummary}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 md:w-auto"
          >
            <span className="block text-xs text-slate-500">Last updated</span>
            {lastUpdated}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Revenue</h2>
        <p className="text-4xl font-bold">R {summary.totalRevenue.toFixed(2)}</p>
        <p className="text-slate-400 mt-2">Revenue from paid orders</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Order Status Overview</h2>

        <div className="h-96 min-h-[384px] w-full">
          <ResponsiveContainer width="100%" height={384}>
            <BarChart data={orderStatusData}>
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#ffffff" }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
