import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getBackendBaseUrl } from '@/lib/backendUrl';

export type StrengthData = Record<string, number>;
export type StrengthUpdatePayload = { strengths: StrengthData; timestamp?: number };

export const useStrengthSocket = () => {
    const [strengths, setStrengths] = useState<StrengthData>({});
    const [prevStrengths, setPrevStrengths] = useState<StrengthData>({});
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);

    // Explicitly type the ref
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const SOCKET_URL = getBackendBaseUrl();
        // Initialize Socket
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 10
        });

        // Event Listeners
        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('[App] Connected to WebSocket');
            setIsConnected(true);
            socket.emit('subscribe:strength');
        });

        socket.on('disconnect', () => {
            console.log('[App] Disconnected');
            setIsConnected(false);
        });

        socket.on('strength:initial', (data: StrengthData) => {
            setStrengths(data);
            setPrevStrengths(data);
            setLastUpdateAt(Date.now());
        });

        socket.on('strength:update', (data: StrengthUpdatePayload) => {
            setStrengths(current => {
                setPrevStrengths(current); // Old strengths becomes prev
                return data.strengths;
            });
            setLastUpdateAt(data.timestamp ?? Date.now());
        });

        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array = run once

    return { strengths, prevStrengths, isConnected, lastUpdateAt };
};
