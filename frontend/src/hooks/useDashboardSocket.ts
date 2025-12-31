import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getBackendBaseUrl } from "@/lib/backendUrl";
import { DASHBOARD_TFS, type DashboardTimeframe } from "@/lib/dashboardTimeframes";

export type { DashboardTimeframe };
export type DashboardScores = Record<string, number>;
export type DashboardPayload = {
  at: number;
  scoresByTf: Record<DashboardTimeframe, DashboardScores | null>;
};

export { DASHBOARD_TFS };

export function useDashboardSocket() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const baseUrl = getBackendBaseUrl();
    socketRef.current = io(baseUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
    });

    const socket = socketRef.current;
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("subscribe:dashboard");
    });
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("dashboard:initial", (data: DashboardPayload | null) => setPayload(data));
    socket.on("dashboard:update", (data: DashboardPayload) => setPayload(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  const updatedAt = payload?.at ?? null;

  const bestGuessDefaultTf: DashboardTimeframe = useMemo(() => "5m", []);
  return { payload, updatedAt, isConnected, bestGuessDefaultTf };
}
