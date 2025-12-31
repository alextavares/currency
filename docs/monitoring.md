# Monitoring (recommended)

This project exposes a simple health endpoint and can be monitored with free tools.

## Health check

- `GET /health` (proxied to the backend)
- Example: `https://liveforexstrength.com/health`

Expected response: JSON with `{ status: "ok" }`.

## UptimeRobot (free)

1. Create a monitor of type **HTTPS** for `https://liveforexstrength.com/health`
2. Interval: 5 minutes
3. Alert contacts: email / Telegram / Slack (optional)

## Error monitoring (optional)

- Backend: Sentry (Node) or any log shipper (Vector / Loki / Datadog)
- Frontend: Sentry (Next.js)

Start simple: uptime first. Add error tracking once traffic grows.

