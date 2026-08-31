import type { GameServer, ServerEvent } from "../types/server";

export function generateServerEvent(
  previous: GameServer,
  next: GameServer,
  timestamp: number,
): ServerEvent | null {
  const base = {
    id: `${next.id}-${timestamp}`,
    serverId: next.id,
    serverName: next.name,
    timestamp,
  };

  // 依嚴重度排列並立即回傳，確保同一台伺服器每次 Tick 最多新增一筆事件。
  if (previous.status !== "offline" && next.status === "offline") {
    return {
      ...base,
      id: `${base.id}-SERVER_OFFLINE`,
      type: "SERVER_OFFLINE",
      severity: "critical",
      message: `${next.name} 伺服器已離線`,
    };
  }

  if (previous.status !== "critical" && next.status === "critical") {
    return {
      ...base,
      id: `${base.id}-SERVER_CRITICAL`,
      type: "SERVER_CRITICAL",
      severity: "critical",
      message: `${next.name} 進入 Critical 狀態`,
    };
  }

  if (
    previous.recoveryMode &&
    !next.recoveryMode &&
    next.status === "healthy"
  ) {
    return {
      ...base,
      id: `${base.id}-SERVER_RECOVERED`,
      type: "SERVER_RECOVERED",
      severity: "info",
      message: `${next.name} 伺服器已恢復正常`,
    };
  }

  // 比較前後數值，只記錄第一次跨過門檻，避免每次 Tick 重複洗版。
  if (previous.metrics.packetLoss < 1 && next.metrics.packetLoss >= 1) {
    return {
      ...base,
      id: `${base.id}-PACKET_LOSS`,
      type: "PACKET_LOSS",
      severity: "warning",
      message: `${next.name} Packet Loss 超過 1%`,
    };
  }

  if (previous.metrics.serverLoad < 75 && next.metrics.serverLoad >= 75) {
    return {
      ...base,
      id: `${base.id}-HIGH_LOAD`,
      type: "HIGH_LOAD",
      severity: "warning",
      message: `${next.name} Server Load 超過 75%`,
    };
  }

  if (previous.metrics.ping < 100 && next.metrics.ping >= 100) {
    return {
      ...base,
      id: `${base.id}-HIGH_LATENCY`,
      type: "HIGH_LATENCY",
      severity: "warning",
      message: `${next.name} Ping 超過 100 ms`,
    };
  }

  return null;
}
