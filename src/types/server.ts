export type ServerStatus = "healthy" | "warning" | "critical" | "offline";
export type SimulationMode = "normal" | "overload" | "recovery";

export interface ServerMetrics {
  ping: number;
  serverLoad: number;
  players: number;
  packetLoss: number;
}

export interface MetricSnapshot extends ServerMetrics {
  timestamp: number;
}

export interface GameServer {
  id: string;
  name: string;
  region: string;
  status: ServerStatus;
  metrics: ServerMetrics;
  history: MetricSnapshot[];
  incidentMode: "overload" | null;
  recoveryMode: boolean;
}

export type EventSeverity = "info" | "warning" | "critical";

export type ServerEventType =
  | "HIGH_LATENCY"
  | "HIGH_LOAD"
  | "PACKET_LOSS"
  | "SERVER_CRITICAL"
  | "SERVER_RECOVERED"
  | "SERVER_OFFLINE";

export interface ServerEvent {
  id: string;
  serverId: string;
  serverName: string;
  type: ServerEventType;
  severity: EventSeverity;
  message: string;
  timestamp: number;
}

export interface MonitorState {
  servers: GameServer[];
  events: ServerEvent[];
  isPaused: boolean;
  selectedServerId: string | null;
}

export type MonitorAction =
  | { type: "TICK"; timestamp: number; random?: () => number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SELECT_SERVER"; payload: string }
  | { type: "CLOSE_SERVER_DETAIL" }
  | { type: "SIMULATE_INCIDENT"; payload: string }
  | { type: "RECOVER_SERVER"; payload: string };
