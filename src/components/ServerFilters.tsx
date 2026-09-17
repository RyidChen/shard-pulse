// 受控的搜尋框及狀態下拉選單。
import type { ServerStatus } from "../types/server";

interface ServerFiltersProps {
  search: string;
  status: ServerStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ServerStatus | "all") => void;
}

export function ServerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ServerFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <label className="block flex-1">
        <span className="mb-2 block text-sm font-medium text-slate-300">
          搜尋伺服器
        </span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="輸入伺服器名稱..."
          className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:max-w-md"
        />
      </label>
      <label className="block sm:w-48">
        <span className="mb-2 block text-sm font-medium text-slate-300">
          Status
        </span>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ServerStatus | "all")
          }
          className="min-h-11 w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <option value="all">全部狀態</option>
          <option value="healthy">Healthy</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="offline">Offline</option>
        </select>
      </label>
    </div>
  );
}
