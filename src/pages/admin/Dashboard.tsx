import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  CreditCard,
  PieChart as PieChartIcon,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatCard from "../../components/StatCard";
import { getDashboardSummary } from "../../services/dashboardService";
import type { DashboardSummary } from "../../types/DashboardSummary";

const REFRESH_INTERVAL = 30;

const PIE_COLOURS = ["#3b82f6", "#f59e0b", "#ef4444"];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    color: "#ffffff",
  },
  labelStyle: { color: "#ffffff" },
};

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const countdownRef = useRef(REFRESH_INTERVAL);

  const loadDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardSummary();
      setSummary(data);
      setLastUpdated(new Date().toLocaleString());
      countdownRef.current = REFRESH_INTERVAL;
      setCountdown(REFRESH_INTERVAL);
    } catch {
      setError("Failed to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadDashboardSummary();
    }, 0);

    const tick = window.setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);

      if (countdownRef.current <= 0) {
        void loadDashboardSummary();
      }
    }, 1000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(tick);
    };
  }, [loadDashboardSummary]);

  if (loading && !summary) {
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
          onClick={() => void loadDashboardSummary()}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const fulfillmentRate =
    summary.totalOrders > 0 ? Math.round((summary.paidOrders / summary.totalOrders) * 100) : 0;

  const orderStatusData = [
    { status: "Paid", count: summary.paidOrders },
    { status: "Pending", count: summary.pendingOrders },
    { status: "Cancelled", count: summary.cancelledOrders },
  ];

  const stats = [
    {
      title: "Total Orders",
      value: summary.totalOrders.toString(),
      icon: <ShoppingCart size={20} />,
      href: "/admin/orders",
    },
    {
      title: "Paid Orders",
      value: summary.paidOrders.toString(),
      icon: <CreditCard size={20} />,
      href: "/admin/payments",
    },
    {
      title: "Pending Orders",
      value: summary.pendingOrders.toString(),
      icon: <Activity size={20} />,
      href: "/admin/orders",
    },
    {
      title: "Inventory Alerts",
      value: summary.inventoryAlerts.toString(),
      icon: <AlertTriangle size={20} />,
      href: "/admin/inventory",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Admin performance overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Auto-refresh in{" "}
            <span className={countdown <= 5 ? "text-amber-400 font-bold" : "text-slate-400"}>
              {countdown}s
            </span>
          </span>

          <button
            onClick={() => void loadDashboardSummary()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {lastUpdated ? `Updated ${lastUpdated}` : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-xl font-bold">Revenue</h2>
            <p className="text-slate-400 text-sm mt-1">From paid orders</p>
          </div>

          <p className="text-4xl font-bold text-emerald-400">
            R {summary.totalRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
          </p>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Order fulfillment rate</span>
              <span className="font-semibold">{fulfillmentRate}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${fulfillmentRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {summary.paidOrders} of {summary.totalOrders} orders paid
            </p>
          </div>
        </div>

        <div className="xl:col-span-2 bg-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Order Status Overview</h2>

            <div className="flex rounded-xl border border-slate-700 overflow-hidden text-sm">
              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-1.5 px-3 py-2 transition ${
                  chartType === "bar"
                    ? "bg-slate-600 text-white"
                    : "text-slate-400 hover:bg-slate-700"
                }`}
              >
                <BarChart2 size={14} />
                Bar
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-1.5 px-3 py-2 transition ${
                  chartType === "pie"
                    ? "bg-slate-600 text-white"
                    : "text-slate-400 hover:bg-slate-700"
                }`}
              >
                <PieChartIcon size={14} />
                Pie
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={orderStatusData}>
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLOURS[index % PIE_COLOURS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
