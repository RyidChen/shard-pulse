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
  if (servers.length === 0) {
    return {
      totalPlayers: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      averagePing: 0,
    };
  }

  return {
    totalPlayers: servers.reduce(
      (total, server) => total + server.metrics.players,
      0,
    ),
    healthy: servers.filter((server) => server.status === "healthy").length,
    warning: servers.filter((server) => server.status === "warning").length,
    critical: servers.filter((server) => server.status === "critical").length,
    averagePing: Math.round(
      servers.reduce((total, server) => total + server.metrics.ping, 0) /
        servers.length,
    ),
  };
}

export function getServerEvents(
  events: ServerEvent[],
  serverId: string,
): ServerEvent[] {
  return events.filter((event) => event.serverId === serverId);
}
