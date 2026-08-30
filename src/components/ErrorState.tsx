export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-4">
      <section
        role="alert"
        className="w-full max-w-md rounded-xl border border-red-400/20 bg-slate-900 p-8 text-center"
      >
        <p className="text-xs font-bold tracking-[0.16em] text-red-300">
          連線錯誤
        </p>
        <h1 className="mt-3 text-xl font-bold text-white">
          無法載入伺服器資料
        </h1>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <button
          type="button"
          aria-label="重新載入"
          onClick={onRetry}
          className="mt-6 min-h-11 cursor-pointer rounded-lg bg-cyan-500 px-5 font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          重試
        </button>
      </section>
    </main>
  );
}
