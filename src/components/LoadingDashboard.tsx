export function LoadingDashboard() {
  return (
    <div
      role="status"
      aria-label="正在載入伺服器"
      className="min-h-dvh bg-slate-950 px-4 py-8 sm:px-6"
    >
      <span className="sr-only">正在載入伺服器資料</span>
      <div className="mx-auto max-w-7xl">
        <div className="h-16 animate-pulse rounded-xl bg-slate-900" />
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-900"
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl bg-slate-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
