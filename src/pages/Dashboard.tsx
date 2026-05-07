import StatCard from "../components/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  { title: "Orders", value: "1,245" },
  { title: "Payments", value: "982" },
  { title: "Inventory Alerts", value: "12" },
  { title: "Kafka Events", value: "5,421" },
];

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 5890 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">

        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

      <div className="bg-slate-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">
          Monthly Sales
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />

              <Bar
                dataKey="sales"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}