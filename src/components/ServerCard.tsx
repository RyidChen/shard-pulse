import type { MouseEvent } from "react";
import type { GameServer } from "../types/server";
import { Sparkline } from "./Sparkline";
import { StatusBadge } from "./StatusBadge";

const numberFormatter = new Intl.NumberFormat("zh-TW");

interface ServerCardProps {
  server: GameServer;
  onSelect: (serverId: string, trigger: HTMLButtonElement) => void;
}

export function ServerCard({ server, onSelect }: ServerCardProps) {
  const select = (event: MouseEvent<HTMLButtonElement>) =>
    onSelect(server.id, event.currentTarget);

  return (
    <button
      type="button"
      aria-label={`開啟 ${server.name} 伺服器詳細資訊`}
      onClick={select}
      className="group min-h-44 w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-left shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{server.name}</h3>
          <p className="mt-1 text-xs text-slate-400">{server.region}</p>
        </div>
        <StatusBadge status={server.status} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        <Metric label="Ping" value={`${server.metrics.ping} ms`} />
        <Metric
          label="Players"
          value={numberFormatter.format(server.metrics.players)}
        />
        <Metric label="Server Load" value={`${server.metrics.serverLoad}%`} />
        <Metric label="Packet Loss" value={`${server.metrics.packetLoss}%`} />
      </dl>

      <div className="mt-4 text-cyan-400">
        <Sparkline history={server.history} serverName={server.name} />
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-100">
        {value}
      </dd>
    </div>
  );
}
