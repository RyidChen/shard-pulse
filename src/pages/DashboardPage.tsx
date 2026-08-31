import { useMemo, useRef, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { ErrorState } from "../components/ErrorState";
import { EventFeed } from "../components/EventFeed";
import { LoadingDashboard } from "../components/LoadingDashboard";
import { ServerDrawer } from "../components/ServerDrawer";
import { ServerFilters } from "../components/ServerFilters";
import { ServerGrid } from "../components/ServerGrid";
import { SummaryCards } from "../components/SummaryCards";
import { filterServers, getMonitorSummary } from "../domain/selectors";
import { useGameMonitor } from "../hooks/useGameMonitor";
import type { ServerStatus } from "../types/server";

export function DashboardPage({
  simulateInitialLoadError = false,
}: {
  simulateInitialLoadError?: boolean;
}) {
  const monitor = useGameMonitor({ simulateInitialLoadError });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServerStatus | "all">("all");
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const filteredServers = useMemo(
    () => filterServers(monitor.servers, search, status),
    [monitor.servers, search, status],
  );
  const summary = useMemo(
    () => getMonitorSummary(monitor.servers),
    [monitor.servers],
  );

  if (monitor.loading) return <LoadingDashboard />;
  if (monitor.error) {
    return <ErrorState message={monitor.error} onRetry={monitor.retry} />;
  }

  const selectServer = (serverId: string, trigger: HTMLButtonElement) => {
    // 保留開啟 Drawer 的卡片，關閉後可把鍵盤焦點送回原位置。
    returnFocusRef.current = trigger;
    monitor.selectServer(serverId);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <a
        href="#dashboard-content"
        className="sr-only z-[60] rounded-md bg-cyan-400 px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        跳至主要監控內容
      </a>
      <DashboardHeader
        isPaused={monitor.isPaused}
        onPause={monitor.pause}
        onResume={monitor.resume}
      />

      <main
        id="dashboard-content"
        className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8"
      >
        <SummaryCards summary={summary} />
        <section aria-labelledby="server-fleet-heading" className="space-y-4">
          <div>
            <h2
              id="server-fleet-heading"
              className="text-lg font-semibold text-white"
            >
              伺服器群組
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              六個區域 · 每 1.5 秒更新一次
            </p>
          </div>
          <ServerFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
          <ServerGrid servers={filteredServers} onSelect={selectServer} />
        </section>
        <EventFeed events={monitor.events} />
      </main>

      {monitor.selectedServer && (
        <ServerDrawer
          server={monitor.selectedServer}
          events={monitor.events}
          returnFocusRef={returnFocusRef}
          onClose={monitor.closeServer}
          onSimulateIncident={monitor.simulateIncident}
          onRecover={monitor.recoverServer}
        />
      )}
    </div>
  );
}
