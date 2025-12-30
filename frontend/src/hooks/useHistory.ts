import { useState, useEffect } from 'react';
import { getBackendBaseUrl } from '@/lib/backendUrl';

export interface HistoryPoint {
    time: string;
    strength: number;
}

export function useHistory(currency: string, limit: number = 50) {
    const [data, setData] = useState<HistoryPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currency) return;
        const API_URL = getBackendBaseUrl();

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/history/${currency}?limit=${limit}`);
                if (!res.ok) throw new Error('Failed to fetch history');
                const json = await res.json();

                // Backend returns { time: string, strength: number, ... }
                // We ensure it matches our interface and sort if needed
                setData(json.reverse()); // Usually DB returns newest first, charts want oldest first
            } catch (err) {
                console.error(err);
                setError('Failed to load history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Optional: Poll for updates every minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);

    }, [currency, limit]);

    return { data, isLoading, error };
}
