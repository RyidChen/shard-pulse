// 將 Server Status 對應成文字與顏色。
import type { ServerStatus } from "../types/server";

const styles: Record<ServerStatus, { label: string; className: string }> = {
  healthy: {
    label: "Healthy",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  warning: {
    label: "Warning",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  critical: {
    label: "Critical",
    className: "border-red-400/20 bg-red-400/10 text-red-300",
  },
  offline: {
    label: "Offline",
    className: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  },
};

export function StatusBadge({ status }: { status: ServerStatus }) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {style.label}
    </span>
  );
}
