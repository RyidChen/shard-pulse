import type { ServerMetrics, ServerStatus } from "../types/server";

export function deriveServerStatus(metrics: ServerMetrics): ServerStatus {
  if (
    metrics.ping >= 200 ||
    metrics.serverLoad >= 90 ||
    metrics.packetLoss >= 5
  ) {
    return "critical";
  }

  if (
    metrics.ping >= 100 ||
    metrics.serverLoad >= 75 ||
    metrics.packetLoss >= 1
  ) {
    return "warning";
  }

  return "healthy";
}
