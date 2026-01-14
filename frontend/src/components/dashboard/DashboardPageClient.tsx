"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Clock, TrendingDown, TrendingUp } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import HistoryChart from "@/components/HistoryChart";
import AlertManager from "@/components/AlertManager";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DASHBOARD_TFS, type DashboardTimeframe, useDashboardSocket } from "@/hooks/useDashboardSocket";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD"] as const;

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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function scoreTone(score: number): "strong" | "weak" | "neutral" {
  if (score >= 60) return "strong";
  if (score <= 40) return "weak";
  return "neutral";
}

function toneClasses(tone: "strong" | "weak" | "neutral") {
  if (tone === "strong") return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-200 ring-emerald-400/20";
  if (tone === "weak") return "bg-rose-500/12 text-rose-700 dark:text-rose-200 ring-rose-400/20";
  return "bg-amber-500/12 text-amber-700 dark:text-amber-200 ring-amber-400/20";
}

function SegmentedTimeframe({
  value,
  onChange,
  enabledKeys,
}: {
  value: DashboardTimeframe;
  onChange: (v: DashboardTimeframe) => void;
  enabledKeys: Set<DashboardTimeframe>;
}) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusKey = (key: DashboardTimeframe) => {
    requestAnimationFrame(() => btnRefs.current[key]?.focus());
  };

  return (
    <div
      role="radiogroup"
      aria-label="Timeframe"
      className="flex flex-wrap gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/50"
      onKeyDown={(e) => {
        const keys = DASHBOARD_TFS.map((t) => t.key).filter((k) => enabledKeys.has(k));
        const i = keys.indexOf(value);
        if (i === -1) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const next = keys[(i + 1) % keys.length];
          onChange(next);
          focusKey(next);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const next = keys[(i - 1 + keys.length) % keys.length];
          onChange(next);
          focusKey(next);
        }
        if (e.key === "Home") {
          e.preventDefault();
          onChange(keys[0]);
          focusKey(keys[0]);
        }
        if (e.key === "End") {
          e.preventDefault();
          onChange(keys[keys.length - 1]);
          focusKey(keys[keys.length - 1]);
        }
      }}
    >
      {DASHBOARD_TFS.map((tf) => {
        const enabled = enabledKeys.has(tf.key);
        const active = value === tf.key;
        return (
          <button
            key={tf.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!enabled}
            onClick={() => enabled && onChange(tf.key)}
            ref={(node) => {
              btnRefs.current[tf.key] = node;
            }}
            tabIndex={active ? 0 : -1}
            className={cn(
              "h-8 select-none rounded-lg px-2.5 text-xs font-semibold tracking-wide transition-colors ring-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              active
                ? "bg-background text-foreground ring-border/50 shadow-sm"
                : "bg-transparent text-muted-foreground ring-transparent hover:bg-muted/50 hover:text-foreground",
              !enabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
            )}
          >
            {tf.label}
          </button>
        );
      })}
    </div>
  );
}

type DashboardView = "table" | "bars" | "both";

function ViewToggle({ value, onChange }: { value: DashboardView; onChange: (v: DashboardView) => void }) {
  const items: Array<{ key: DashboardView; label: string }> = [
    { key: "table", label: "Table" },
    { key: "bars", label: "Bars" },
    { key: "both", label: "Both" },
  ];

  return (
    <div role="tablist" aria-label="Dashboard view" className="flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/50">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className={cn(
              "h-8 rounded-lg px-2.5 text-xs font-semibold tracking-wide ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-background text-foreground ring-border/50 shadow-sm"
                : "bg-transparent text-muted-foreground ring-transparent hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function StrengthBars({
  scores,
  isLoading,
}: {
  scores: Record<string, number> | null;
  isLoading: boolean;
}) {
  const ordered = useMemo(() => {
    if (!scores) return null;
    return CURRENCIES.map((c) => ({ currency: c, score: scores[c] ?? 0 })).sort((a, b) => b.score - a.score);
  }, [scores]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-4">
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
        {(isLoading ? CURRENCIES.map((c) => ({ currency: c, score: 50 })) : ordered ?? []).map((row, idx) => {
          const isNeutral = isLoading || !scores;
          const isStrong = isNeutral ? true : idx < 4;
          const v = row.score;
          const height = clamp(v, 0, 100);
          const fill = isNeutral
            ? "bg-gradient-to-b from-foreground/20 to-foreground/10"
            : isStrong
              ? "bg-gradient-to-b from-emerald-500 to-emerald-300"
              : "bg-gradient-to-b from-rose-500 to-rose-300";

          return (
            <div key={row.currency} className="flex flex-col items-center gap-3">
              <div className="relative h-44 w-full max-w-[34px]">
                <div className="absolute inset-0 rounded-full bg-muted/40 ring-1 ring-border/60 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background/50 to-transparent" />
                  <div className={cn("absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-700 ease-out", fill)} style={{ height: `${Math.max(4, height)}%` }} />
                </div>
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 shadow-sm",
                    "bg-background/90 text-foreground ring-border/70"
                  )}
                  style={{ bottom: `calc(${Math.max(4, height)}% + 6px)` }}
                >
                  {isLoading ? "—" : Math.round(v)}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="relative h-9 w-9 overflow-hidden rounded-2xl ring-1 ring-border/60 bg-muted/30">
                  <img
                    src={FLAG_FILES[row.currency]}
                    alt={row.currency}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground/80">
                    {row.currency.slice(0, 2)}
                  </div>
                </div>
                <div className="text-xs font-semibold text-foreground">{row.currency}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrengthTable({
  scores,
  isLoading,
}: {
  scores: Record<string, number> | null;
  isLoading: boolean;
}) {
  const rows = useMemo(() => {
    if (!scores) return null;
    return CURRENCIES.map((c) => ({ currency: c, score: scores[c] ?? 0 }))
      .sort((a, b) => b.score - a.score)
      .map((row, idx) => ({ ...row, rank: idx + 1 }));
  }, [scores]);

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border/70">
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[540px] text-sm">
          <thead className="sticky top-0 z-10 bg-card/90 backdrop-blur">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium text-right">Score</th>
              <th className="px-4 py-3 font-medium">Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="bg-card/30">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="ml-auto h-4 w-14" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-3 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              rows?.map((row) => {
                const tone = scoreTone(row.score);
                const width = clamp(row.score, 0, 100);
                return (
                  <tr
                    key={row.currency}
                    className="odd:bg-card/30 even:bg-card/20 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{row.rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-border/50 bg-muted/30">
                          <img
                            src={FLAG_FILES[row.currency]}
                            alt={row.currency}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-foreground/80">
                            {row.currency.slice(0, 2)}
                          </div>
                        </div>
                        <div className="font-semibold tracking-wide text-foreground">{row.currency}</div>
                        <span className={cn("ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1", toneClasses(tone))}>
                          {tone === "strong" ? "Strong" : tone === "weak" ? "Weak" : "Neutral"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                      {Math.round(row.score)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2 w-full rounded-full bg-muted/40 ring-1 ring-border/50 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            tone === "strong"
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-200"
                              : tone === "weak"
                                ? "bg-gradient-to-r from-rose-400 to-rose-200"
                                : "bg-gradient-to-r from-amber-400 to-amber-200"
                          )}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{description}</div>
      {actionHref && actionLabel && (
        <div className="mt-4">
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DashboardPageClient({ initialTf }: { initialTf?: DashboardTimeframe }) {
  const { payload, updatedAt, isConnected, bestGuessDefaultTf } = useDashboardSocket();
  const [selectedTf, setSelectedTf] = useState<DashboardTimeframe>(initialTf ?? bestGuessDefaultTf);
  const [view, setView] = useState<DashboardView>("table");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!initialTf) setSelectedTf(bestGuessDefaultTf);
  }, [bestGuessDefaultTf, initialTf]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("dashboard_view");
      const initial: DashboardView = stored === "bars" || stored === "both" || stored === "table" ? stored : "table";
      setView(initial);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const enabledKeys = useMemo(() => {
    const set = new Set<DashboardTimeframe>();
    for (const tf of DASHBOARD_TFS) {
      if (payload?.scoresByTf?.[tf.key]) set.add(tf.key);
    }
    return set;
  }, [payload]);

  const isBooting = !payload;
  const scores = payload?.scoresByTf?.[selectedTf] ?? null;

  const updatedAgo = useMemo(() => {
    if (!updatedAt) return null;
    const seconds = Math.max(0, Math.floor((now - updatedAt) / 1000));
    return formatAgo(seconds);
  }, [now, updatedAt]);

  const ordered = useMemo(() => {
    if (!scores) return null;
    return CURRENCIES.map((c) => ({ c, v: scores[c] ?? 0 })).sort((a, b) => b.v - a.v);
  }, [scores]);

  const strongest = ordered?.[0] ?? null;
  const weakest = ordered?.[ordered.length - 1] ?? null;
  const spread = strongest && weakest ? Math.round(strongest.v - weakest.v) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(1000px_circle_at_10%_0%,rgba(139,92,246,0.20),transparent_55%),radial-gradient(900px_circle_at_90%_12%,rgba(56,189,248,0.12),transparent_55%),linear-gradient(to_bottom,rgba(3,6,20,1),rgba(0,0,0,1))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 dark:hidden bg-[radial-gradient(900px_circle_at_15%_10%,rgba(139,92,246,0.14),transparent_60%),radial-gradient(800px_circle_at_80%_20%,rgba(56,189,248,0.10),transparent_55%),linear-gradient(to_bottom,rgba(247,248,252,1),rgba(247,248,252,1))]" />

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-card/40 ring-1 ring-border/60">
                <Activity className="h-4 w-4 text-foreground" />
              </span>
              <span>LiveForexStrength</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/heatmap", label: "Heatmap" },
                { href: "/pairs", label: "Pairs" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono tabular-nums">{updatedAgo ? `Updated ${updatedAgo} ago` : "Waiting for data…"}</span>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1",
                isConnected
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 ring-emerald-400/20"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-200 ring-amber-400/20"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", isConnected ? "bg-emerald-300" : "bg-amber-300 animate-pulse")} />
              {isConnected ? "Live" : "Connecting…"}
            </span>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">Strongest</div>
                <TrendingUp className="h-4 w-4 text-emerald-300/80" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isBooting ? (
                <Skeleton className="h-7 w-28" />
              ) : strongest ? (
                <div className="text-2xl font-semibold tracking-tight">
                  {strongest.c} <span className="font-mono tabular-nums text-foreground/70">{Math.round(strongest.v)}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">Top-ranked currency in this timeframe.</div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">Weakest</div>
                <TrendingDown className="h-4 w-4 text-rose-300/80" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isBooting ? (
                <Skeleton className="h-7 w-28" />
              ) : weakest ? (
                <div className="text-2xl font-semibold tracking-tight">
                  {weakest.c} <span className="font-mono tabular-nums text-foreground/70">{Math.round(weakest.v)}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">Bottom-ranked currency in this timeframe.</div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">Spread</div>
                <div className="text-xs text-muted-foreground/70 font-mono">0–100</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isBooting ? (
                <Skeleton className="h-7 w-20" />
              ) : spread != null ? (
                <div className="text-2xl font-semibold tracking-tight font-mono tabular-nums">{spread}</div>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">Strong-vs-weak separation.</div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">Timeframe</div>
                <div className="text-xs text-muted-foreground/70">Live</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-semibold tracking-tight">{selectedTf.toUpperCase()}</div>
              <div className="mt-1 text-xs text-muted-foreground">Use bias (4h/12h/1w) → timing (15m/30m).</div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="border-border/70 bg-card/50 shadow-none lg:col-span-8">
            <CardHeader className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold tracking-tight">Currency Strength</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Ranked (0–100) for the 8 major currencies.</div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <ViewToggle
                    value={view}
                    onChange={(v) => {
                      setView(v);
                      try {
                        window.localStorage.setItem("dashboard_view", v);
                      } catch {}
                    }}
                  />
                  <SegmentedTimeframe
                    value={selectedTf}
                    onChange={setSelectedTf}
                    enabledKeys={enabledKeys.size ? enabledKeys : new Set(DASHBOARD_TFS.map((t) => t.key))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isBooting ? (
                view === "table" ? (
                  <StrengthTable scores={null} isLoading />
                ) : view === "bars" ? (
                  <StrengthBars scores={null} isLoading />
                ) : (
                  <div className="space-y-4">
                    <StrengthBars scores={null} isLoading />
                    <StrengthTable scores={null} isLoading />
                  </div>
                )
              ) : !scores ? (
                <EmptyState
                  title="Waiting for enough history"
                  description={`No scores available yet for ${selectedTf.toUpperCase()}. Keep it open for a few minutes, or switch to a faster timeframe.`}
                  actionHref="/?tf=5m"
                  actionLabel="Switch to 5m"
                />
              ) : (
                view === "table" ? (
                  <StrengthTable scores={scores} isLoading={false} />
                ) : view === "bars" ? (
                  <StrengthBars scores={scores} isLoading={false} />
                ) : (
                  <div className="space-y-4">
                    <StrengthBars scores={scores} isLoading={false} />
                    <StrengthTable scores={scores} isLoading={false} />
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-4">
            <HistoryChart />
            <AlertManager />
          </div>
        </section>
      </div>
    </main>
  );
}
