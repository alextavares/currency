"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    useEffect(() => {
        // Fetch existing alerts
        fetch(`${API_URL}/api/alerts`)
            .then(res => res.json())
            .then(setAlerts)
            .catch(console.error);

        // Listen for triggers
        const socket = io(API_URL);
        socket.on('alert:triggered', (data: { message: string }) => {
            toast.error(data.message, {
                duration: 10000,
                style: { background: '#ef4444', color: 'white', border: 'none' }
            });
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
        <Card className="bg-white/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 backdrop-blur">
            <CardHeader>
                <CardTitle>Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Form */}
                <div className="flex flex-wrap gap-2 mb-6 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Currency</label>
                        <select
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 rounded p-2 text-sm"
                        >
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Condition</label>
                        <select
                            value={condition}
                            onChange={e => setCondition(e.target.value as any)}
                            className="bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 rounded p-2 text-sm"
                        >
                            <option value=">">Above (&gt;)</option>
                            <option value="<">Below (&lt;)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 w-24">
                        <label className="text-xs text-slate-400">Value (0-10)</label>
                        <input
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 rounded p-2 text-sm w-full"
                            placeholder="7.5"
                            step="0.1"
                        />
                    </div>

                    <Button onClick={addAlert} className="bg-[#6A22B3] hover:bg-[#5B1E99]">
                        Add Alert
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {alerts.length === 0 && <p className="text-sm text-slate-500">No active alerts.</p>}
                    {alerts.map(alert => (
                        <div key={alert.id} className="flex items-center justify-between bg-white/70 dark:bg-slate-900/50 p-2 rounded px-4 ring-1 ring-slate-200 dark:ring-0">
                            <span className="text-sm">
                                <span className="font-bold text-yellow-400">{alert.currency}</span>
                                <span className="mx-2 text-slate-400">is {alert.condition === '>' ? 'above' : 'below'}</span>
                                <span className="font-mono font-bold">{alert.value}</span>
                            </span>
                            <button
                                onClick={() => removeAlert(alert.id)}
                                className="text-slate-500 hover:text-red-400"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
