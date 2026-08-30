import { useEffect, useRef, type RefObject } from "react";
import { getServerEvents } from "../domain/selectors";
import type { GameServer, ServerEvent } from "../types/server";
import { Sparkline } from "./Sparkline";
import { StatusBadge } from "./StatusBadge";

interface ServerDrawerProps {
  server: GameServer;
  events: ServerEvent[];
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSimulateIncident: (serverId: string) => void;
  onRecover: (serverId: string) => void;
}

export function ServerDrawer({
  server,
  events,
  returnFocusRef,
  onClose,
  onSimulateIncident,
  onRecover,
}: ServerDrawerProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const serverEvents = getServerEvents(events, server.id).slice(0, 5);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocusTo = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusRef]);

  const modeLabel = server.incidentMode
    ? "Overload 模式運作中"
    : server.recoveryMode
      ? "Recovery 模式運作中"
      : "正常運作";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="關閉伺服器詳細資訊"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-[2px]"
      />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-drawer-title"
        className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-slate-700 bg-slate-950 p-5 shadow-2xl shadow-black sm:max-w-lg sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-400">
              伺服器詳細資訊
            </p>
            <h2
              id="server-drawer-title"
              className="mt-2 text-2xl font-bold text-white"
            >
              {server.name} 伺服器
            </h2>
            <p className="mt-1 text-sm text-slate-400">{server.region}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="關閉伺服器詳細資訊"
            onClick={onClose}
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4">
          <StatusBadge status={server.status} />
          <span className="text-sm font-medium text-slate-300">
            {modeLabel}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3">
          <DrawerMetric label="Ping" value={`${server.metrics.ping} ms`} />
          <DrawerMetric
            label="Players"
            value={server.metrics.players.toLocaleString()}
          />
          <DrawerMetric
            label="Server Load"
            value={`${server.metrics.serverLoad}%`}
          />
          <DrawerMetric
            label="Packet Loss"
            value={`${server.metrics.packetLoss}%`}
          />
        </dl>

        <section className="mt-7" aria-labelledby="ping-trend-heading">
          <div className="flex items-center justify-between">
            <h3 id="ping-trend-heading" className="font-semibold text-white">
              Ping 趨勢
            </h3>
            <span className="text-xs text-slate-500">最近 20 筆資料</span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-cyan-400">
            <Sparkline
              history={server.history}
              serverName={server.name}
              height={76}
            />
          </div>
        </section>

        <section className="mt-7" aria-labelledby="server-events-heading">
          <h3 id="server-events-heading" className="font-semibold text-white">
            最近伺服器事件
          </h3>
          {serverEvents.length === 0 ? (
            <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
              此伺服器目前沒有重要事件。
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {serverEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300"
                >
                  {event.message}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            aria-label="模擬伺服器 Overload"
            disabled={server.incidentMode === "overload"}
            onClick={() => onSimulateIncident(server.id)}
            className="min-h-12 cursor-pointer rounded-lg bg-red-500 px-4 font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            模擬 Overload
          </button>
          <button
            type="button"
            aria-label="恢復伺服器"
            disabled={
              server.recoveryMode ||
              (server.incidentMode === null && server.status === "healthy")
            }
            onClick={() => onRecover(server.id)}
            className="min-h-12 cursor-pointer rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            恢復
          </button>
        </div>
      </aside>
    </div>
  );
}

function DrawerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold tabular-nums text-white">
        {value}
      </dd>
    </div>
  );
}
