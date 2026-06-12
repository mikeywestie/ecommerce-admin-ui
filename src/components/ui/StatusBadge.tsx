type StatusTone = "green" | "yellow" | "red" | "blue" | "slate" | "purple";

type StatusBadgeProps = {
  children: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  yellow: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  red: "bg-red-500/15 text-red-300 border-red-500/20",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  slate: "bg-slate-700/60 text-slate-300 border-slate-600",
  purple: "bg-violet-500/15 text-violet-300 border-violet-500/20",
};

export default function StatusBadge({
  children,
  tone = "slate",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
