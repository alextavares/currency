import WebSocket from 'ws';
import { StrengthCalculator } from '../strength/Calculator';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/stream';

export class BinanceService {
    private ws: WebSocket | null = null;
    private calculator: StrengthCalculator;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;

    constructor(calculator: StrengthCalculator) {
        this.calculator = calculator;
    }

    public connect(): void {
        const streams = [
            'btcusdt@ticker',
            'ethusdt@ticker',
            'solusdt@ticker',
            'xrpusdt@ticker',
            'ethbtc@ticker',
            'solbtc@ticker',
            'xrpbtc@ticker'
        ];

        const url = `${BINANCE_WS_URL}?streams=${streams.join('/')}`;

        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('[Binance] WebSocket connected');
            this.reconnectAttempts = 0;
        });

        this.ws.on('message', (data: WebSocket.Data) => {
            try {
                const message = JSON.parse(data.toString());
                // Binance Stream Format: { stream: "btcusdt@ticker", data: { s: "BTCUSDT", c: "45000.00", ... } }

                if (message.data && message.data.s && message.data.c) {
                    const symbol = message.data.s; // e.g., BTCUSDT
                    const price = parseFloat(message.data.c);

                    // Update calculator directly
                    this.calculator.updatePrice(symbol, price);
                }
            } catch (err) {
                console.error('[Binance] Parse error', err);
            }
        });

        this.ws.on('error', (err) => {
            console.error('[Binance] WS Error:', err.message);
        });

        this.ws.on('close', () => {
            console.log('[Binance] WS Closed, reconnecting...');
            this.scheduleReconnect();
        });
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            setTimeout(() => this.connect(), delay);
        }
    }
}
