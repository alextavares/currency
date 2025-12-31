export const DASHBOARD_TIMEFRAMES = ['5m', '15m', '30m', '1h', '4h', '12h', '24h', '1w'] as const;
export type DashboardTimeframe = (typeof DASHBOARD_TIMEFRAMES)[number];

export const DASHBOARD_TFS: Array<{ key: DashboardTimeframe; label: string }> = [
  { key: '5m', label: '5m' },
  { key: '15m', label: '15m' },
  { key: '30m', label: '30m' },
  { key: '1h', label: '1h' },
  { key: '4h', label: '4h' },
  { key: '12h', label: '12h' },
  { key: '24h', label: '24h' },
  { key: '1w', label: '1W' },
];

export function isDashboardTimeframe(value: string | undefined | null): value is DashboardTimeframe {
  if (!value) return false;
  return (DASHBOARD_TIMEFRAMES as readonly string[]).includes(value);
}

