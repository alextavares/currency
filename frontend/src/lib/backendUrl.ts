export function getBackendBaseUrl(): string {
  const isDev = process.env.NODE_ENV === "development";
  const explicit = isDev ? process.env.NEXT_PUBLIC_SOCKET_URL : undefined;
  if (explicit) return explicit;

  if (typeof window !== "undefined") {
    // Default prod deployment in this project: frontend :3105, backend :3101
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const backendPort = "3101";
    return `${protocol}//${host}:${backendPort}`;
  }

  // SSR/build fallback
  return "http://localhost:3001";
}
