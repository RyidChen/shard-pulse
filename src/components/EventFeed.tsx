import type { ServerEvent } from "../types/server";

const timeFormatter = new Intl.DateTimeFormat("zh-TW", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const severityStyle = {
  info: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-red-400",
};

export function EventFeed({ events }: { events: ServerEvent[] }) {
  return (
    <section
      aria-labelledby="recent-events-heading"
      className="rounded-xl border border-slate-800 bg-slate-900/70"
    >
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 id="recent-events-heading" className="font-semibold text-white">
          最近事件
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          顯示狀態變化與指標超過門檻的紀錄
        </p>
      </div>
      {events.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-400">
          目前沒有重要的伺服器事件。
        </p>
      ) : (
        <ol className="divide-y divide-slate-800/80" aria-live="polite">
          {events.slice(0, 12).map((event) => (
            <li key={event.id} className="flex gap-3 px-5 py-3">
              <span
                className={`mt-2 size-1.5 shrink-0 rounded-full ${severityStyle[event.severity]}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-200">{event.message}</p>
                <p className="mt-1 text-xs tabular-nums text-slate-500">
                  {timeFormatter.format(event.timestamp)}
                  <span className="sr-only"> · {event.severity}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
