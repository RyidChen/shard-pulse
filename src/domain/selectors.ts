import type { GameServer, ServerEvent, ServerStatus } from "../types/server";

export interface MonitorSummary {
  totalPlayers: number;
  healthy: number;
  warning: number;
  critical: number;
  averagePing: number;
}

export function filterServers(
  servers: GameServer[],
  search: string,
  status: ServerStatus | "all",
): GameServer[] {
  const query = search.trim().toLocaleLowerCase();
  return servers.filter(
    (server) =>
      server.name.toLocaleLowerCase().includes(query) &&
      (status === "all" || server.status === status),
  );
}

export function getMonitorSummary(servers: GameServer[]): MonitorSummary {
  const summary: MonitorSummary = {
    totalPlayers: 0,
    healthy: 0,
    warning: 0,
    critical: 0,
    averagePing: 0,
  };
  let totalPing = 0;

  for (const server of servers) {
    summary.totalPlayers += server.metrics.players;
    totalPing += server.metrics.ping;
    if (server.status !== "offline") {
      summary[server.status] += 1;
    }
  }

  summary.averagePing = servers.length === 0
    ? 0
    : Math.round(totalPing / servers.length);
  return summary;
}

export function getServerEvents(
  events: ServerEvent[],
  serverId: string,
): ServerEvent[] {
  return events.filter((event) => event.serverId === serverId);
}
