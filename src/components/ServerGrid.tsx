// 排列 Server Cards；沒有搜尋結果時顯示 Empty State。
import type { GameServer } from "../types/server";
import { ServerCard } from "./ServerCard";

interface ServerGridProps {
  servers: GameServer[];
  onSelect: (serverId: string, trigger: HTMLButtonElement) => void;
}

export function ServerGrid({ servers, onSelect }: ServerGridProps) {
  if (servers.length === 0) {
    return (
      <div
        role="status"
        className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-14 text-center"
      >
        <h3 className="font-semibold text-white">找不到符合條件的伺服器</h3>
        <p className="mt-2 text-sm text-slate-400">
          請調整搜尋內容或 Status 篩選條件。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} onSelect={onSelect} />
      ))}
    </div>
  );
}
