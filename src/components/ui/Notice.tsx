type NoticeTone = "success" | "error" | "info";

type NoticeProps = {
  tone: NoticeTone;
  children: string;
};

const toneClasses: Record<NoticeTone, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

export default function Notice({ tone, children }: NoticeProps) {
  return (
    <div className={`rounded-2xl border p-4 text-sm ${toneClasses[tone]}`}>
      {children}
    </div>
  );
}
