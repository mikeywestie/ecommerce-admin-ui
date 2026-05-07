interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h3 className="text-slate-400 text-sm mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}