interface DashboardHeaderProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

export function DashboardHeader({
  isPaused,
  onPause,
  onResume,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/favicon.svg"
              alt=""
              className="size-7"
              aria-hidden="true"
            />
            <h1 className="text-xl font-bold tracking-tight text-white">
              ShardPulse
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            即時遊戲伺服器監控 Demo・資料皆為前端模擬
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] ${
              isPaused ? "text-amber-300" : "text-emerald-300"
            }`}
            aria-live="polite"
          >
            <span
              className={`size-2 rounded-full ${
                isPaused ? "bg-amber-300" : "bg-emerald-400"
              }`}
              aria-hidden="true"
            />
            {isPaused ? "PAUSED" : "LIVE"}
          </span>
          <button
            type="button"
            aria-label={isPaused ? "恢復即時更新" : "暫停即時更新"}
            onClick={isPaused ? onResume : onPause}
            className="min-h-11 cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-100 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {isPaused ? "繼續" : "暫停"}
          </button>
        </div>
      </div>
    </header>
  );
}
