export function getBackendBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const { protocol, hostname, port, origin } = window.location;

    // Default deployment in this project: frontend :3105, backend :3101
    if (port === "3105") {
      return `${protocol}//${hostname}:3101`;
    }

    // If you're using a reverse proxy (nginx) and serving everything on the same domain,
    // use the site origin (nginx should proxy /socket.io and /api to the backend).
    return origin;
  }

  // SSR/build fallback
  return "http://localhost:3001";
}
