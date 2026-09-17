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
  // 標題
  name: string;
  //副標題
  region: string;
  // 右上狀態
  status: ServerStatus;
  // 4 個指標：ping、serverLoad、players、packetLoss
  metrics: ServerMetrics;
  // 每筆歷史資料包含 4 個指標與時間戳
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
