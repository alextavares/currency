"use client";

import { useHistory } from "@/hooks/useHistory";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

export default function HistoryChart() {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const { data, isLoading, error } = useHistory(selectedCurrency);

    return (
        <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold tracking-tight">History</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">Strength over time (0–10).</div>
                    </div>
                    <div className="w-full max-w-[420px] overflow-x-auto">
                        <div className="flex gap-1 rounded-xl bg-muted/40 p-1 ring-1 ring-border/50">
                            {CURRENCIES.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedCurrency(c)}
                                    className={cn(
                                        "h-8 shrink-0 rounded-lg px-2.5 text-xs font-semibold tracking-wide ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                        selectedCurrency === c
                                            ? "bg-background text-foreground ring-border/50 shadow-sm"
                                            : "bg-transparent text-muted-foreground ring-transparent hover:bg-muted/50 hover:text-foreground"
                                    )}
                                    aria-pressed={selectedCurrency === c}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="h-[300px] w-full">
                    {isLoading && (
                        <div className="h-full w-full rounded-2xl border border-border/60 bg-card/40 p-4">
                            <Skeleton className="h-full w-full" />
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
                            <div>
                                <div className="text-sm font-semibold">Couldn’t load history</div>
                                <div className="mt-2 text-sm text-muted-foreground">{error}</div>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && data.length === 0 && (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
                            <div>
                                <div className="text-sm font-semibold">No history yet</div>
                                <div className="mt-2 text-sm text-muted-foreground">Keep the dashboard open for a few minutes and it will populate.</div>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && data.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.35)" />
                                <XAxis
                                    dataKey="time"
                                    stroke="hsl(var(--muted-foreground) / 0.9)"
                                    fontSize={12}
                                    tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                                <YAxis
                                    domain={[0, 10]}
                                    stroke="hsl(var(--muted-foreground) / 0.9)"
                                    fontSize={12}
                                />
                                <Tooltip
                                    cursor={{ stroke: "hsl(var(--border) / 0.6)" }}
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;
                                        const raw = payload[0]?.value;
                                        const v = typeof raw === "number" ? raw : Number(raw);
                                        return (
                                            <div className="rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-sm">
                                                <div className="text-muted-foreground">{new Date(label as string).toLocaleString()}</div>
                                                <div className="mt-1 flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">Strength</span>
                                                    <span className="font-mono tabular-nums text-foreground">
                                                      {Number.isFinite(v) ? v.toFixed(2) : "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="strength"
                                    stroke="hsl(var(--primary) / 0.95)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
