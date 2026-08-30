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

export function monitorReducer(
  state: MonitorState,
  action: MonitorAction,
): MonitorState {
  switch (action.type) {
    case "TICK": {
      if (state.isPaused) return state;

      const generatedEvents: ServerEvent[] = [];
      const servers = state.servers.map((server) => {
        const mode: SimulationMode = server.recoveryMode
          ? "recovery"
          : server.incidentMode === "overload"
            ? "overload"
            : "normal";
        const metrics = generateNextMetrics(
          server.metrics,
          mode,
          action.random,
        );
        const status =
          server.status === "offline" ? "offline" : deriveServerStatus(metrics);
        const recoveryMode = server.recoveryMode && status !== "healthy";
        const next: GameServer = {
          ...server,
          metrics,
          status,
          recoveryMode,
          history: [
            ...server.history,
            { ...metrics, timestamp: action.timestamp },
          ].slice(-20),
        };
        const event = generateServerEvent(server, next, action.timestamp);
        if (event) generatedEvents.push(event);
        return next;
      });

      return {
        ...state,
        servers,
        events: [...generatedEvents, ...state.events].slice(0, 50),
      };
    }

    case "PAUSE":
      return state.isPaused ? state : { ...state, isPaused: true };
    case "RESUME":
      return state.isPaused ? { ...state, isPaused: false } : state;
    case "SELECT_SERVER":
      return state.servers.some((server) => server.id === action.payload)
        ? { ...state, selectedServerId: action.payload }
        : state;
    case "CLOSE_SERVER_DETAIL":
      return state.selectedServerId === null
        ? state
        : { ...state, selectedServerId: null };
    case "SIMULATE_INCIDENT":
      return updateServer(state, action.payload, (server) => ({
        ...server,
        incidentMode: "overload",
        recoveryMode: false,
      }));
    case "RECOVER_SERVER":
      return updateServer(state, action.payload, (server) => ({
        ...server,
        incidentMode: null,
        recoveryMode: true,
      }));
  }
}
