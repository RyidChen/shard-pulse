import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { initialServers } from "../data/initialServers";
import { monitorReducer } from "../reducers/monitorReducer";
import type { MonitorState } from "../types/server";

const INITIAL_LOAD_DELAY = 650;
const TICK_INTERVAL = 1500;

interface UseGameMonitorOptions {
  simulateInitialLoadError?: boolean;
}

const initialState: MonitorState = {
  servers: initialServers,
  events: [],
  isPaused: false,
  selectedServerId: null,
};

export function useGameMonitor({
  simulateInitialLoadError = false,
}: UseGameMonitorOptions = {}) {
  const [state, dispatch] = useReducer(monitorReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (simulateInitialLoadError && loadAttempt === 0) {
        setError("目前無法連線至監控資料來源，請稍後再試。");
      } else {
        setError(null);
      }
      setLoading(false);
    }, INITIAL_LOAD_DELAY);

    return () => window.clearTimeout(timer);
  }, [loadAttempt, simulateInitialLoadError]);

  useEffect(() => {
    if (loading || error || state.isPaused) return;

    const timer = window.setInterval(() => {
      dispatch({ type: "TICK", timestamp: Date.now() });
    }, TICK_INTERVAL);

    return () => window.clearInterval(timer);
  }, [error, loading, state.isPaused]);

  const selectedServer = useMemo(
    () =>
      state.servers.find((server) => server.id === state.selectedServerId) ??
      null,
    [state.selectedServerId, state.servers],
  );

  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const selectServer = useCallback(
    (serverId: string) =>
      dispatch({ type: "SELECT_SERVER", payload: serverId }),
    [],
  );
  const closeServer = useCallback(
    () => dispatch({ type: "CLOSE_SERVER_DETAIL" }),
    [],
  );
  const simulateIncident = useCallback(
    (serverId: string) =>
      dispatch({ type: "SIMULATE_INCIDENT", payload: serverId }),
    [],
  );
  const recoverServer = useCallback(
    (serverId: string) =>
      dispatch({ type: "RECOVER_SERVER", payload: serverId }),
    [],
  );
  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  return {
    ...state,
    selectedServer,
    loading,
    error,
    pause,
    resume,
    selectServer,
    closeServer,
    simulateIncident,
    recoverServer,
    retry,
  };
}
