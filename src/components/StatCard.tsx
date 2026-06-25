import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  href?: string;
}

export default function StatCard({ title, value, icon, href }: StatCardProps) {
  const inner = (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-slate-400 text-sm mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-slate-500 mt-1">{icon}</div>}
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="block bg-slate-800 p-6 rounded-2xl shadow-lg transition hover:bg-slate-700 hover:ring-1 hover:ring-slate-600"
      >
        {inner}
      </Link>
    );
  }

  return <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">{inner}</div>;
}
