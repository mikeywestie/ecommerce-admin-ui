const stats = [
  { title: "Total Orders", value: "1,245" },
  { title: "Payments Processed", value: "982" },
  { title: "Inventory Alerts", value: "12" },
  { title: "Kafka Events", value: "5,421" },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-slate-800 p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-slate-400 text-sm mb-2">
              {stat.title}
            </h3>

            <p className="text-3xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}