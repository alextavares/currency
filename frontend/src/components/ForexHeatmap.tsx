"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBackendBaseUrl } from "@/lib/backendUrl";
import { DASHBOARD_TFS, type DashboardTimeframe } from "@/lib/dashboardTimeframes";
import { MAJOR_PAIRS, type MajorPair } from "@/lib/majorPairs";

type HeatmapRow = { pair: string; pips: number; percent: number };
type HeatmapPayload = { at: number; valuesByTf: Record<DashboardTimeframe, HeatmapRow[] | null> };

type Mode = "pips" | "percent";

function formatAgoMs(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

function colorFor(value: number) {
  if (value === 0) return "bg-slate-100/40 text-slate-500 dark:bg-white/5 dark:text-white/60";
  if (value > 0) return "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200";
  return "bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200";
}

function fmt(mode: Mode, v: number): string {
  if (mode === "percent") return `${v.toFixed(3)}%`;
  const abs = Math.abs(v);
  const decimals = abs >= 100 ? 0 : abs >= 10 ? 1 : 1;
  return `${v.toFixed(decimals)}`;
}

export default function ForexHeatmap({ initial }: { initial: HeatmapPayload | null }) {
  const [mode, setMode] = useState<Mode>("pips");
  const [payload, setPayload] = useState<HeatmapPayload | null>(initial);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const baseUrl = getBackendBaseUrl();
        const res = await fetch(`${baseUrl}/api/heatmap`, { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as HeatmapPayload | null;
        if (json) setPayload(json);
      } catch {
        // ignore
      }
    };

    poll();
    const id = setInterval(poll, 60_000);
    return () => clearInterval(id);
  }, []);

  const lastAt = payload?.at ?? null;
  const updatedAgo = useMemo(() => {
    if (!lastAt) return null;
    return formatAgoMs(now - lastAt);
  }, [now, lastAt]);

  const tfKeys = DASHBOARD_TFS.map((t) => t.key);

  const table = useMemo(() => {
    const valuesByTf = payload?.valuesByTf;
    if (!valuesByTf) return null;

    const byTfPair = new Map<DashboardTimeframe, Map<string, HeatmapRow>>();
    for (const tf of tfKeys) {
      const rows = valuesByTf[tf];
      if (!rows) continue;
      byTfPair.set(tf, new Map(rows.map((r) => [r.pair.toUpperCase(), r])));
    }
    return byTfPair;
  }, [payload, tfKeys]);

  const pairs = useMemo(() => MAJOR_PAIRS as readonly MajorPair[], []);

  return (
    <section className="rounded-[28px] border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_80px_rgba(15,23,42,0.10)] dark:shadow-[0_18px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 dark:border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="text-sm text-slate-600 dark:text-white/70">
          Updated: <span className="font-mono tabular-nums">{updatedAgo ?? "…"}</span>
          <span className="mx-2 text-slate-400 dark:text-white/30">•</span>
          <Link href="/pairs" className="font-semibold text-blue-600 hover:underline dark:text-blue-300">
            Browse pairs
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-white/60">Show:</span>
          <div className="inline-flex rounded-full bg-white/70 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10 p-1">
            <button
              type="button"
              onClick={() => setMode("pips")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                mode === "pips"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
              )}
            >
              Pips
            </button>
            <button
              type="button"
              onClick={() => setMode("percent")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                mode === "percent"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
              )}
            >
              Percent
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse">
          <thead className="sticky top-[52px] z-10 bg-white/85 dark:bg-slate-950/70 backdrop-blur">
            <tr className="text-left text-xs font-semibold text-slate-500 dark:text-white/60">
              <th className="px-4 py-3 sm:px-6">Pair</th>
              {DASHBOARD_TFS.map((t) => (
                <th key={t.key} className="px-3 py-3 text-center">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr key={pair} className="border-t border-slate-200/50 dark:border-white/10">
                <td className="px-4 py-3 sm:px-6">
                  <Link
                    href={`/pairs/${pair.toLowerCase()}`}
                    className="font-semibold text-slate-900 hover:underline dark:text-white"
                  >
                    {pair}
                  </Link>
                </td>
                {DASHBOARD_TFS.map((t) => {
                  const row = table?.get(t.key)?.get(pair);
                  const raw = row ? (mode === "pips" ? row.pips : row.percent) : null;
                  const cls = raw == null ? colorFor(0) : colorFor(raw);
                  const label = raw == null ? "—" : fmt(mode, raw);
                  return (
                    <td key={t.key} className="px-3 py-2 text-center">
                      <span
                        className={cn(
                          "inline-flex min-w-[76px] justify-center rounded-lg px-2.5 py-1 text-xs font-semibold tabular-nums",
                          cls
                        )}
                        title={raw == null ? "Waiting for history…" : undefined}
                      >
                        {label}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-4 sm:px-6 text-xs text-slate-500 dark:text-white/60">
        Values are computed from the last received prices (MT5/bridge) using rolling windows per timeframe.
      </div>
    </section>
  );
}
