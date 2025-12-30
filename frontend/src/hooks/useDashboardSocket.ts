import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getBackendBaseUrl } from "@/lib/backendUrl";

export type DashboardTimeframe = "5m" | "15m" | "30m" | "1h" | "4h" | "12h" | "24h" | "1w";
export type DashboardScores = Record<string, number>;
export type DashboardPayload = {
  at: number;
  scoresByTf: Record<DashboardTimeframe, DashboardScores | null>;
};

export const DASHBOARD_TFS: { key: DashboardTimeframe; label: string }[] = [
  { key: "5m", label: "5m" },
  { key: "15m", label: "15m" },
  { key: "30m", label: "30m" },
  { key: "1h", label: "1h" },
  { key: "4h", label: "4h" },
  { key: "12h", label: "12h" },
  { key: "24h", label: "24h" },
  { key: "1w", label: "1W" },
];

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
