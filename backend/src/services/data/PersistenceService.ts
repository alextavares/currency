import { db } from '../../config/database';
import { StrengthData } from '../../types';

interface HistoryEntry {
    time: Date;
    currency: string;
    strength: number;
    method: string;
}

export class PersistenceService {
    private memoryHistory: Map<string, HistoryEntry[]> = new Map();
    private readonly MAX_HISTORY_SIZE = 1440; // 24 hours of minute data

    public async saveStrengths(strengths: StrengthData, timestamp: number): Promise<void> {
        const method = 'weighted';
        const time = new Date(timestamp);
        const values: HistoryEntry[] = [];

        // Save to memory first
        Object.entries(strengths).forEach(([currency, strength]) => {
            const entry = { time, currency, strength, method };
            values.push(entry);

            if (!this.memoryHistory.has(currency)) {
                this.memoryHistory.set(currency, []);
            }
            const history = this.memoryHistory.get(currency)!;
            history.push(entry);
            if (history.length > this.MAX_HISTORY_SIZE) {
                history.shift(); // Remove oldest
            }
        });

        if (values.length === 0) return;

        // Try to save to DB
        try {
            const cs = new db.$config.pgp.helpers.ColumnSet(['time', 'currency', 'strength', 'method'], { table: 'strength_history' });
            const query = db.$config.pgp.helpers.insert(values, cs);
            await db.none(query);
        } catch (err) {
            // Log error but don't crash, rely on memory for now
            // console.error('[Persistence] DB Save failed (using memory):', (err as any).code || err);
        }
    }

    public async getHistory(currency: string, limit = 100): Promise<any[]> {
        try {
            // Try DB first
            const dbData = await db.any(
                'SELECT time, strength FROM strength_history WHERE currency = $1 ORDER BY time DESC LIMIT $2',
                [currency, limit]
            );
            return dbData;
        } catch (err) {
            console.warn(`[Persistence] DB Fetch failed for ${currency}, returning memory data.`);
            // Fallback to memory
            const history = this.memoryHistory.get(currency) || [];
            // Return copy, reversed to match DB "ORDER BY time DESC" usually expected, 
            // but actually my frontend expects "oldest first" which is ASC.
            // The existing backend query was DESC (newest first). 
            // My frontend hook does `.reverse()` which assumes newest first.
            // So we should return newest first here too.
            return [...history].reverse().slice(0, limit);
        }
    }
}
