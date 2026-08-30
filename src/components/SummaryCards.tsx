import type { MonitorSummary } from "../domain/selectors";

const numberFormatter = new Intl.NumberFormat("zh-TW");

export function SummaryCards({ summary }: { summary: MonitorSummary }) {
  const items = [
    { label: "總玩家數", value: numberFormatter.format(summary.totalPlayers) },
    { label: "Healthy 伺服器", value: summary.healthy },
    { label: "Warning 伺服器", value: summary.warning },
    { label: "Critical 伺服器", value: summary.critical },
    { label: "平均 Ping", value: `${summary.averagePing} ms` },
  ];

  return (
    <section
      aria-label="伺服器群組摘要"
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
    >
      {items.map((item, index) => (
        <article
          key={item.label}
          className={`rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/10 ${
            index === items.length - 1 ? "col-span-2 lg:col-span-1" : ""
          }`}
        >
          <p className="text-xs font-medium text-slate-400">{item.label}</p>
          <p className="mt-2 text-xl font-bold tabular-nums text-white">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
