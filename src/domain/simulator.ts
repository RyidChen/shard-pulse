import type { ServerMetrics, SimulationMode } from "../types/server";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// 產生 min 到 max 之間的隨機數 random 被當成參數傳入，是為了測試時可以提供固定的隨機結果
const randomDelta = (min: number, max: number, random: () => number) =>
  min + (max - min) * random();

// 據目前數據與模擬模式，產生下一筆伺服器數據。它不會修改 current，而是回傳新的 ServerMetrics
export function generateNextMetrics(
  current: ServerMetrics,
  mode: SimulationMode = "normal",
  random: () => number = Math.random,
): ServerMetrics {
  // 各模式都從目前數值漸進變化，避免每次更新出現不自然的大幅跳動。
  // normal：Ping ±8 ms、Load ±5 個百分點、Packet Loss ±0.2 個百分點。
  // overload 讓這三項指標上升；recovery 則讓它們下降。
  let pingChange: number;
  let loadChange: number;
  let packetLossChange: number;

  switch (mode) {
    case "overload":
      pingChange = randomDelta(16, 30, random);
      loadChange = randomDelta(8, 14, random);
      packetLossChange = randomDelta(0.3, 0.8, random);
      break;
    case "recovery":
      pingChange = -randomDelta(18, 32, random);
      loadChange = -randomDelta(8, 14, random);
      packetLossChange = -randomDelta(0.4, 1, random);
      break;
    default:
      pingChange = randomDelta(-8, 8, random);
      loadChange = randomDelta(-5, 5, random);
      packetLossChange = randomDelta(-0.2, 0.2, random);
  }

  return {
    ping: Math.round(clamp(current.ping + pingChange, 0, 999)),
    serverLoad: Math.round(clamp(current.serverLoad + loadChange, 0, 100)),
    players: Math.round(
      clamp(current.players + randomDelta(-30, 30, random), 0, 100_000),
    ),
    packetLoss: Number(
      clamp(current.packetLoss + packetLossChange, 0, 100).toFixed(1),
    ),
  };
}
