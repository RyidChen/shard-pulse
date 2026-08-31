import type { ServerMetrics, SimulationMode } from "../types/server";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomDelta = (min: number, max: number, random: () => number) =>
  min + (max - min) * random();

export function generateNextMetrics(
  current: ServerMetrics,
  mode: SimulationMode = "normal",
  random: () => number = Math.random,
): ServerMetrics {
  // 各模式都從目前數值漸進變化，避免每次更新出現不自然的大幅跳動。
  const pingChange =
    mode === "overload"
      ? randomDelta(16, 30, random)
      : mode === "recovery"
        ? -randomDelta(18, 32, random)
        : randomDelta(-8, 8, random);
  const loadChange =
    mode === "overload"
      ? randomDelta(8, 14, random)
      : mode === "recovery"
        ? -randomDelta(8, 14, random)
        : randomDelta(-5, 5, random);
  const packetLossChange =
    mode === "overload"
      ? randomDelta(0.3, 0.8, random)
      : mode === "recovery"
        ? -randomDelta(0.4, 1, random)
        : randomDelta(-0.2, 0.2, random);

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
