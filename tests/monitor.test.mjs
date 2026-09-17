import assert from "node:assert/strict";
import test from "node:test";
import { generateNextMetrics } from "../src/domain/simulator.ts";
import { getMonitorSummary } from "../src/domain/selectors.ts";

test("各模擬模式保留固定亂數下的數值與呼叫順序", () => {
  const current = { ping: 100, serverLoad: 60, players: 1000, packetLoss: 2 };
  const expectedByMode = {
    normal: { ping: 92, serverLoad: 58, players: 1015, packetLoss: 2 },
    overload: { ping: 116, serverLoad: 70, players: 1015, packetLoss: 2.5 },
    recovery: { ping: 82, serverLoad: 51, players: 1015, packetLoss: 1.3 },
  };

  for (const [mode, expected] of Object.entries(expectedByMode)) {
    const samples = [0, 0.25, 0.5, 0.75];
    let calls = 0;
    const next = generateNextMetrics(current, mode, () => samples[calls++]);
    assert.deepEqual(next, expected, mode);
    assert.equal(calls, 4);
  }

  assert.deepEqual(current, {
    ping: 100, serverLoad: 60, players: 1000, packetLoss: 2,
  });
  assert.deepEqual(generateNextMetrics(current, undefined, () => 0.5), current);
});

test("模擬數值不超出上下限", () => {
  const minimum = { ping: 0, serverLoad: 0, players: 0, packetLoss: 0 };
  const maximum = { ping: 999, serverLoad: 100, players: 100_000, packetLoss: 100 };
  assert.deepEqual(generateNextMetrics(minimum, "recovery", () => 0), minimum);
  assert.deepEqual(generateNextMetrics(maximum, "overload", () => 1), maximum);
});

test("摘要包含所有伺服器的玩家與 Ping，狀態數量分開計算", () => {
  const servers = ["healthy", "healthy", "warning", "critical", "offline"].map(
    (status, index) => ({
      status,
      metrics: { players: (index + 1) * 100, ping: 10 + index * 10.4 },
    }),
  );

  assert.deepEqual(getMonitorSummary(servers), {
    totalPlayers: 1500, healthy: 2, warning: 1, critical: 1, averagePing: 31,
  });
  assert.deepEqual(getMonitorSummary([]), {
    totalPlayers: 0, healthy: 0, warning: 0, critical: 0, averagePing: 0,
  });
});
