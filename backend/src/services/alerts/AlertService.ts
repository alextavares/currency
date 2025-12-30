import { StrengthData, Alert } from '../../types';
import { Server } from 'socket.io';

export class AlertService {
    private alerts: Alert[] = [];
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public addAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Alert {
        const newAlert: Alert = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: Date.now(),
            ...alert
        };
        this.alerts.push(newAlert);
        console.log(`[Alerts] Added alert: ${newAlert.currency} ${newAlert.condition} ${newAlert.value}`);
        return newAlert;
    }

    public removeAlert(id: string): void {
        this.alerts = this.alerts.filter(a => a.id !== id);
        console.log(`[Alerts] Removed alert: ${id}`);
    }

    public getAlerts(): Alert[] {
        return this.alerts;
    }

    public checkAlerts(strengths: StrengthData): void {
        this.alerts.forEach(alert => {
            const currentStrength = strengths[alert.currency];

            if (currentStrength === undefined) return;

            // Simple threshold check
            // To avoid spamming, a real system would need "cooldown" or "triggeredAt" state.
            // For this MVP, we will only emit if it wasn't triggered recently? 
            // Or easier: Let the frontend handle the "toast" spam deduplication, 
            // OR we add a `lastTriggered` to the Alert object.

            let triggered = false;
            if (alert.condition === '>' && currentStrength > alert.value) triggered = true;
            if (alert.condition === '<' && currentStrength < alert.value) triggered = true;

            if (triggered) {
                // Throttle: Only trigger once every minute per alert
                const now = Date.now();
                if (!alert.lastTriggered || now - alert.lastTriggered > 60000) {
                    alert.lastTriggered = now;
                    this.io.emit('alert:triggered', {
                        alert,
                        currentValue: currentStrength,
                        message: `${alert.currency} is now ${alert.condition === '>' ? 'above' : 'below'} ${alert.value} (Current: ${currentStrength.toFixed(2)})`
                    });
                    console.log(`[Alerts] Triggered: ${alert.currency} ${currentStrength}`);
                }
            }
        });
    }
}
