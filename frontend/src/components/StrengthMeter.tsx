"use client";

import { useStrengthSocket } from "@/hooks/useStrengthSocket";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

// Flags or Icons mapping (Mock for now)
const LABELS: Record<string, string> = {
    USD: "🇺🇸 USD",
    EUR: "🇪🇺 EUR",
    GBP: "🇬🇧 GBP",
    JPY: "🇯🇵 JPY",
    CHF: "🇨🇭 CHF",
    AUD: "🇦🇺 AUD",
    CAD: "🇨🇦 CAD",
    NZD: "🇳🇿 NZD"
};

export default function StrengthMeter() {
    const { strengths, prevStrengths, isConnected, lastUpdateAt } = useStrengthSocket();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // Convert to array and sort
    const sortedCurrencies = useMemo(
        () => Object.entries(strengths).sort((a, b) => b[1] - a[1]),
        [strengths]
    );

    const updatedAgo = useMemo(() => {
        if (!lastUpdateAt) return null;
        const seconds = Math.max(0, Math.floor((now - lastUpdateAt) / 1000));
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    }, [lastUpdateAt, now]);

    const statusLabel = isConnected ? "Live" : "Connecting…";
    const statusClass = isConnected ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20" : "bg-amber-500/10 text-amber-200 ring-amber-500/20";

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Currency Strength</h1>
                    <p className="text-sm text-slate-400">
                        Index relativo (0–10).{" "}
                        {updatedAgo ? <span>Atualizado há {updatedAgo}.</span> : <span>Aguardando dados…</span>}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1", statusClass)}>
                        <span className={cn("h-2 w-2 rounded-full", isConnected ? "bg-emerald-400" : "bg-amber-300 animate-pulse")} />
                        {statusLabel}
                    </span>
                </div>
            </div>

            <div className="grid gap-4">
                {sortedCurrencies.length === 0 && isConnected && (
                    <div className="text-center text-slate-500 py-10">Waiting for updates…</div>
                )}

                {sortedCurrencies.map(([currency, value], idx) => {
                    const prev = prevStrengths[currency] || value;
                    const isUp = value > prev;
                    const isDown = value < prev;
                    const delta = value - prev;

                    const clamped = Math.max(0, Math.min(10, value));
                    const hue = clamped * 12; // 0=red, 120=green
                    const barStyle = {
                        width: `${clamped * 10}%`,
                        background: `linear-gradient(90deg, hsl(${hue} 85% 55%), hsl(${hue} 85% 45%))`,
                        boxShadow: `0 0 18px hsl(${hue} 85% 55% / 0.35)`,
                    } as const;

                    return (
                        <Card
                            key={currency}
                            className="border-slate-800 bg-slate-950/60 backdrop-blur hover:bg-slate-950/75 transition-colors"
                        >
                            <div className="flex items-center gap-4 p-4">
                                <div className="w-8 text-center text-xs font-medium text-slate-500 tabular-nums">
                                    #{idx + 1}
                                </div>

                                <div className="w-24 font-semibold text-white">
                                    <div className="text-lg leading-tight">{LABELS[currency] || currency}</div>
                                    <div className="text-xs text-slate-400 tabular-nums">
                                        {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="relative h-3 w-full rounded-full bg-slate-900/70 ring-1 ring-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-[width] duration-700 ease-out"
                                            style={barStyle}
                                        />
                                    </div>
                                </div>

                                <div className="w-20 text-right font-mono text-lg font-bold text-white tabular-nums">
                                    {value.toFixed(2)}
                                </div>

                                <div className="w-6 text-center">
                                    {isUp && <span className="text-emerald-400">▲</span>}
                                    {isDown && <span className="text-rose-400">▼</span>}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
