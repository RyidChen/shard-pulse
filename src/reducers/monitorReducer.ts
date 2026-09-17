import { generateServerEvent } from "../domain/events";
import { generateNextMetrics } from "../domain/simulator";
import { deriveServerStatus } from "../domain/status";
import type {
  GameServer,
  MonitorAction,
  MonitorState,
  ServerEvent,
  SimulationMode,
} from "../types/server";

// 更新指定 ID 的伺服器
function updateServer(
  state: MonitorState,
  serverId: string,
  update: (server: GameServer) => GameServer,
): MonitorState {
  if (!state.servers.some((server) => server.id === serverId)) return state;
  return {
    ...state,
    servers: state.servers.map((server) =>
      server.id === serverId ? update(server) : server,
    ),
  };
}

// 根據 action.type 決定要如何修改監控狀態
export function monitorReducer(
  state: MonitorState,
  action: MonitorAction,
): MonitorState {
  switch (action.type) {
    // 推進一次模擬數據
    case "TICK": {
      if (state.isPaused) return state;

      // 每個 Tick 依目前模式推進指標，再由新指標重新推導狀態與事件。
      const generatedEvents: ServerEvent[] = [];
      const servers = state.servers.map((server) => {
        // recoveryMode === true → 恢復模式
        // incidentMode === "overload" → 過載模式
        // 都不是 → 正常模式
        const mode: SimulationMode = server.recoveryMode
          ? "recovery"
          : server.incidentMode ?? "normal";
        // 產生下一個指標
        const metrics = generateNextMetrics(
          server.metrics,
          mode,
          action.random,
        );
        const status =
          server.status === "offline" ? "offline" : deriveServerStatus(metrics);
        // 判斷恢復是否完成
        const recoveryMode = server.recoveryMode && status !== "healthy";
        const next: GameServer = {
          ...server,
          metrics,
          status,
          recoveryMode,
          history: [
            ...server.history,
            { ...metrics, timestamp: action.timestamp },
            // Sparkline 只需要最近 20 筆，避免長時間執行後資料持續增長。
          ].slice(-20),
        };
        const event = generateServerEvent(server, next, action.timestamp);
        if (event) generatedEvents.push(event);
        return next;
      });

      return {
        ...state,
        servers,
        // 新事件顯示在最前方，Feed 最多保留最近 50 筆。
        events: [...generatedEvents, ...state.events].slice(0, 50),
      };
    }

    // 暫停模擬
    case "PAUSE":
      return state.isPaused ? state : { ...state, isPaused: true };
    // 恢復模擬
    case "RESUME":
      return state.isPaused ? { ...state, isPaused: false } : state;
    // 選擇一台伺服器並顯示詳細資料
    case "SELECT_SERVER":
      return state.servers.some((server) => server.id === action.payload)
        ? { ...state, selectedServerId: action.payload }
        : state;
    // 關閉伺服器詳細資料
    case "CLOSE_SERVER_DETAIL":
      return state.selectedServerId === null
        ? state
        : { ...state, selectedServerId: null };
    // 模擬伺服器進入 overload 狀態
    case "SIMULATE_INCIDENT":
      return updateServer(state, action.payload, (server) => ({
        ...server,
        incidentMode: "overload",
        recoveryMode: false,
      }));
    // 讓指定伺服器開始恢復
    case "RECOVER_SERVER":
      return updateServer(state, action.payload, (server) => ({
        ...server,
        incidentMode: null,
        recoveryMode: true,
      }));
  }
}
