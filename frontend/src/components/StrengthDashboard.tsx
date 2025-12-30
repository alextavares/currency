"use client";

import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { DASHBOARD_TFS, DashboardTimeframe, useDashboardSocket } from "@/hooks/useDashboardSocket";

const LABELS: Record<string, { label: string; badge: string }> = {
  USD: { label: "USD", badge: "US" },
  EUR: { label: "EUR", badge: "EU" },
  GBP: { label: "GBP", badge: "GB" },
  JPY: { label: "JPY", badge: "JP" },
  CHF: { label: "CHF", badge: "CH" },
  AUD: { label: "AUD", badge: "AU" },
  CAD: { label: "CAD", badge: "CA" },
  NZD: { label: "NZD", badge: "NZ" },
};

const FLAG_FILES: Record<string, string> = {
  USD: "/flags/us.svg",
  EUR: "/flags/eu.svg",
  GBP: "/flags/gb.svg",
  JPY: "/flags/jp.svg",
  CHF: "/flags/ch.svg",
  AUD: "/flags/au.svg",
  CAD: "/flags/ca.svg",
  NZD: "/flags/nz.svg",
};

function formatAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export default function StrengthDashboard() {
  const { payload, updatedAt, isConnected, bestGuessDefaultTf } = useDashboardSocket();
  const [selectedTf, setSelectedTf] = useState<DashboardTimeframe>(bestGuessDefaultTf);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const scores = payload?.scoresByTf?.[selectedTf] ?? null;
  const updatedAgo = useMemo(() => {
    if (!updatedAt) return null;
    const seconds = Math.max(0, Math.floor((now - updatedAt) / 1000));
    return formatAgo(seconds);
  }, [now, updatedAt]);

  const statusClass = isConnected
    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
    : "bg-amber-500/10 text-amber-200 ring-amber-500/20";

  const currencies = useMemo(() => Object.keys(LABELS), []);

  const ordered = useMemo(() => {
    if (!scores) return currencies.map((c) => ({ c, v: 50 }));
    return currencies
      .map((c) => ({ c, v: scores[c] ?? 0 }))
      .sort((a, b) => b.v - a.v);
  }, [scores, currencies]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Currency Strength
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Score relativo (0–100) por timeframe
            {updatedAgo ? <span>. Atualizado há {updatedAgo}.</span> : <span>. Aguardando dados…</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1", statusClass)}>
            <span className={cn("h-2 w-2 rounded-full", isConnected ? "bg-emerald-400" : "bg-amber-300 animate-pulse")} />
            {isConnected ? "Live" : "Connecting…"}
          </span>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_80px_rgba(15,23,42,0.10)] dark:shadow-[0_18px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Live update: <span className="font-mono tabular-nums">{updatedAgo ?? "—"}</span>
            </div>

            <div className="rounded-full bg-white/55 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10 px-2 py-2 shadow-[0_10px_50px_rgba(15,23,42,0.06)] dark:shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
              <div className="flex flex-wrap justify-center gap-2">
                {DASHBOARD_TFS.map((tf) => {
                  const enabled = Boolean(payload?.scoresByTf?.[tf.key]);
                  const active = selectedTf === tf.key;
                  return (
                    <button
                      key={tf.key}
                      type="button"
                      onClick={() => enabled && setSelectedTf(tf.key)}
                      disabled={!enabled}
                      className={cn(
                        "relative rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 transition-all",
                        active
                          ? "bg-white text-slate-900 ring-slate-200 shadow-[0_12px_40px_rgba(106,34,179,0.22)] dark:bg-white dark:text-slate-900"
                          : "bg-white/60 text-slate-700 ring-slate-200 hover:bg-white dark:bg-white/10 dark:text-slate-200 dark:ring-white/15 dark:hover:bg-white/15",
                        !enabled && "opacity-45 cursor-not-allowed hover:bg-white/60 dark:hover:bg-white/10",
                        active &&
                          "after:absolute after:-inset-2 after:-z-10 after:rounded-full after:bg-[#6A22B3]/10 after:blur-xl dark:after:bg-[#6A22B3]/15"
                      )}
                      aria-pressed={active}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-0 px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
        {!scores && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-10">
            Ainda não temos histórico suficiente para <span className="font-mono">{selectedTf}</span>. Deixe rodando alguns minutos.
          </div>
        )}

        <div className="mt-8 grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 items-end">
          {ordered.map(({ c, v }, idx) => {
            const hasScores = Boolean(scores);
            // Match reference behavior: always show top half as "positive" (green) and bottom half as "negative" (red).
            const isStrong = hasScores ? idx < 4 : true;
            const isNeutral = !hasScores;
            const height = Math.max(4, Math.min(100, v)); // percent, avoid flat 0px
            const barColor = isNeutral
              ? "linear-gradient(180deg, rgba(148,163,184,0.35), rgba(148,163,184,0.18))"
              : isStrong
                ? "linear-gradient(180deg, rgba(34,197,94,0.95), rgba(16,185,129,0.75))"
                : "linear-gradient(180deg, rgba(239,68,68,0.95), rgba(244,63,94,0.75))";
            const glow = isNeutral
              ? "0 0 22px rgba(148,163,184,0.18)"
              : isStrong
                ? "0 0 26px rgba(34,197,94,0.22)"
                : "0 0 26px rgba(239,68,68,0.22)";
            const ring = isNeutral ? "ring-slate-300/70 dark:ring-white/10" : isStrong ? "ring-emerald-300/60" : "ring-rose-300/60";
            const bubbleHalo = isNeutral
              ? "0 0 0 1px rgba(148,163,184,0.35), 0 0 16px rgba(148,163,184,0.22), 0 0 40px rgba(148,163,184,0.18)"
              : isStrong
                ? "0 0 0 1px rgba(34,197,94,0.30), 0 0 18px rgba(34,197,94,0.30), 0 0 52px rgba(34,197,94,0.22)"
                : "0 0 0 1px rgba(244,63,94,0.28), 0 0 18px rgba(244,63,94,0.28), 0 0 52px rgba(244,63,94,0.20)";

            return (
              <div key={c} className="flex flex-col items-center gap-2">
                <div className="h-44 sm:h-52 w-full flex items-end justify-center">
                  <div className="relative w-full max-w-[26px] sm:max-w-[32px]">
                    <div
                      className={cn(
                        "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-3 h-[60%] w-[140%] rounded-full blur-2xl opacity-70",
                        isNeutral ? "bg-slate-300/20 dark:bg-white/5" : isStrong ? "bg-emerald-300/30" : "bg-rose-300/30"
                      )}
                    />

                    <div className="relative h-44 sm:h-52 w-full rounded-full ring-1 ring-slate-200/70 dark:ring-white/10">
                      {/* Bubble follows the bar height (like reference UI).
                          IMPORTANT: keep it OUTSIDE the clipped container so it never gets cut off. */}
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 z-20 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white/90 ring-1 shadow-sm",
                          ring
                        )}
                        style={{
                          bottom: `calc(${height}% + 10px)`,
                          boxShadow: bubbleHalo,
                        }}
                      >
                        {Math.round(v)}
                      </div>

                      {/* Clipped tube */}
                      <div className="absolute inset-0 rounded-full bg-white/35 dark:bg-white/5 overflow-hidden flex items-end">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/35 to-transparent dark:from-white/10" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_circle_at_50%_20%,rgba(106,34,179,0.10),transparent_55%)]" />
                        <div
                          className="w-full rounded-full transition-[height] duration-700 ease-out"
                          style={{ height: `${height}%`, background: barColor, boxShadow: glow }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-2xl bg-white/85 dark:bg-white/5 ring-1 ring-slate-200/80 dark:ring-white/10 px-2 py-2 text-center shadow-[0_10px_40px_rgba(15,23,42,0.08)] dark:shadow-none">
                  <div className="flex items-center justify-center">
                    <div className="relative h-7 w-7">
                      {/* Fallback badge (shows if the image fails to load) */}
                      <div className="absolute inset-0 rounded-full bg-white/90 dark:bg-white/10 ring-1 ring-slate-200/90 dark:ring-white/15 flex items-center justify-center text-[11px] font-bold tracking-wide text-slate-700 dark:text-slate-100">
                        {LABELS[c]?.badge ?? c.slice(0, 2)}
                      </div>
                      <img
                        src={FLAG_FILES[c]}
                        alt={LABELS[c]?.label ?? c}
                        className="absolute inset-0 h-7 w-7 rounded-full object-cover"
                        onError={(e) => {
                          // Keep fallback badge visible
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">{LABELS[c]?.label ?? c}</div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
