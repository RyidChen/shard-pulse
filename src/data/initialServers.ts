import { deriveServerStatus } from "../domain/status";
import type { GameServer, ServerMetrics } from "../types/server";

const definitions: Array<{
  id: string;
  name: string;
  region: string;
  metrics: ServerMetrics;
}> = [
  {
    id: "tokyo",
    name: "東京",
    region: "亞太地區 · 日本",
    metrics: { ping: 42, serverLoad: 62, players: 28421, packetLoss: 0.2 },
  },
  {
    id: "singapore",
    name: "新加坡",
    region: "亞太地區 · 新加坡",
    metrics: { ping: 78, serverLoad: 69, players: 21903, packetLoss: 0.5 },
  },
  {
    id: "seoul",
    name: "首爾",
    region: "亞太地區 · 韓國",
    metrics: { ping: 36, serverLoad: 58, players: 24680, packetLoss: 0.1 },
  },
  {
    id: "sydney",
    name: "雪梨",
    region: "大洋洲 · 澳洲",
    metrics: { ping: 83, serverLoad: 64, players: 12745, packetLoss: 0.6 },
  },
  {
    id: "us-west",
    name: "美國西部",
    region: "北美洲 · 美國",
    metrics: { ping: 68, serverLoad: 71, players: 31942, packetLoss: 0.4 },
  },
  {
    id: "frankfurt",
    name: "法蘭克福",
    region: "歐洲 · 德國",
    metrics: { ping: 74, serverLoad: 66, players: 18736, packetLoss: 0.3 },
  },
];

export const initialServers: GameServer[] = definitions.map((server) => ({
  ...server,
  status: deriveServerStatus(server.metrics),
  history: [{ ...server.metrics, timestamp: 0 }],
  incidentMode: null,
  recoveryMode: false,
}));
