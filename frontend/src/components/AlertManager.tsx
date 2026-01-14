"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { io } from "socket.io-client";
import { getBackendBaseUrl } from "@/lib/backendUrl";

interface Alert {
    id: string;
    currency: string;
    condition: '>' | '<';
    value: number;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

export default function AlertManager() {
    const API_URL = getBackendBaseUrl();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [currency, setCurrency] = useState('USD');
    const [condition, setCondition] = useState<'>' | '<'>('>');
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch existing alerts
        setIsLoading(true);
        fetch(`${API_URL}/api/alerts`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch alerts');
                return res.json();
            })
            .then(setAlerts)
            .catch((e) => {
                console.error(e);
                setError('Failed to load alerts');
            })
            .finally(() => setIsLoading(false));

        // Listen for triggers
        const socket = io(API_URL);
        socket.on('alert:triggered', (data: { message: string }) => {
            toast.error(data.message, { duration: 10000 });
            // Also play sound?
            new Audio('/alert.mp3').play().catch(() => { });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const addAlert = async () => {
        if (!value) return;
        try {
            const res = await fetch(`${API_URL}/api/alerts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currency,
                    condition,
                    value: parseFloat(value)
                })
            });
            if (!res.ok) throw new Error('Failed to create alert');
            const newAlert = await res.json();
            setAlerts([...alerts, newAlert]);
            setValue('');
            toast.success("Alert created");
        } catch (err) {
            toast.error("Failed to create alert");
        }
    };

    const removeAlert = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/alerts/${id}`, { method: 'DELETE' });
            setAlerts(alerts.filter(a => a.id !== id));
            toast.info("Alert removed");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="border-border/70 bg-card/50 shadow-none">
            <CardHeader>
                <CardTitle className="text-sm font-semibold tracking-tight">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Form */}
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Currency</label>
                        <select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="h-9 rounded-lg border border-border/70 bg-background/40 px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Condition</label>
                        <select
                            value={condition}
                            onChange={e => setCondition(e.target.value as any)}
                            className="h-9 rounded-lg border border-border/70 bg-background/40 px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value=">">Above (&gt;)</option>
                            <option value="<">Below (&lt;)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Value (0–10)</label>
                        <input
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border/70 bg-background/40 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="7.5"
                            step="0.1"
                        />
                    </div>

                    <div className="sm:col-span-3">
                      <Button onClick={addAlert} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add alert
                    </Button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {isLoading && (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    )}

                    {!isLoading && error && (
                      <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
                        {error}
                      </div>
                    )}

                    {!isLoading && !error && alerts.length === 0 && (
                      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 ring-1 ring-border/60">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="mt-3 text-sm font-semibold">No alerts yet</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Create one to get notified when a currency crosses a threshold.
                        </div>
                      </div>
                    )}

                    {alerts.map(alert => (
                        <div key={alert.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/40 px-4 py-3">
                            <span className="text-sm">
                                <span className="font-semibold">{alert.currency}</span>
                                <span className="mx-2 text-muted-foreground">is {alert.condition === '>' ? 'above' : 'below'}</span>
                                <span className="font-mono font-semibold tabular-nums">{alert.value}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => removeAlert(alert.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label={`Remove alert for ${alert.currency}`}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
