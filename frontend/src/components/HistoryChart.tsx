"use client";

import { useHistory } from "@/hooks/useHistory";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

export default function HistoryChart() {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const { data, isLoading } = useHistory(selectedCurrency);

    return (
        <Card className="bg-white/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>History: {selectedCurrency}</CardTitle>
                <div className="flex gap-2">
                    {CURRENCIES.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedCurrency(c)}
                            className={cn(
                                "px-3 py-1 rounded text-xs font-medium transition-colors",
                                selectedCurrency === c
                                    ? "bg-[#6A22B3] text-white"
                                    : "bg-white/70 hover:bg-white text-slate-700 ring-1 ring-slate-200 dark:ring-0 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-slate-400"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {isLoading && <div className="text-center pt-20 text-slate-500">Loading data...</div>}

                    {!isLoading && data.length === 0 && (
                        <div className="text-center pt-20 text-slate-500">No history available yet.</div>
                    )}

                    {!isLoading && data.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                                <YAxis
                                    domain={[0, 10]}
                                    stroke="#64748b"
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    labelFormatter={(label) => new Date(label).toLocaleString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="strength"
                                    stroke="#3b82f6"
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
