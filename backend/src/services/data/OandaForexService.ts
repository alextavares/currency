import axios, { AxiosInstance } from 'axios';
import { StrengthCalculator } from '../strength/Calculator';
import { FOREX_PAIRS } from '../../config/constants';

type OandaEnv = 'practice' | 'live';

interface OandaForexServiceOptions {
    apiToken: string;
    accountId: string;
    env: OandaEnv;
    pollIntervalMs: number;
}

export class OandaForexService {
    private readonly calculator: StrengthCalculator;
    private readonly client: AxiosInstance;
    private readonly options: OandaForexServiceOptions;

    private pollTimer: NodeJS.Timeout | null = null;
    private instruments: string[] = [];

    constructor(calculator: StrengthCalculator, options: OandaForexServiceOptions) {
        this.calculator = calculator;
        this.options = options;

        const baseURL =
            options.env === 'live'
                ? 'https://api-fxtrade.oanda.com'
                : 'https://api-fxpractice.oanda.com';

        this.client = axios.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${options.apiToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
    }

    public async start(): Promise<void> {
        await this.loadSupportedInstruments();

        if (this.instruments.length === 0) {
            console.warn('[OANDA] No supported instruments found; skipping polling.');
            return;
        }

        await this.pollOnce();
        this.pollTimer = setInterval(() => this.pollOnce(), this.options.pollIntervalMs);
        console.log(`[OANDA] Polling started (${this.instruments.length} instruments, every ${this.options.pollIntervalMs}ms)`);
    }

    public stop(): void {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }

    private async loadSupportedInstruments(): Promise<void> {
        const desired = FOREX_PAIRS.map(toOandaInstrument);
        try {
            const res = await this.client.get(`/v3/accounts/${this.options.accountId}/instruments`);
            const available = new Set<string>((res.data?.instruments || []).map((i: any) => i?.name).filter(Boolean));

            this.instruments = desired.filter((name) => available.has(name));
            const missingCount = desired.length - this.instruments.length;
            console.log(`[OANDA] Instruments loaded: ${this.instruments.length}/${desired.length} supported`);
            if (missingCount > 0) {
                console.warn('[OANDA] Some instruments are not available on this account; they will be ignored.');
            }
        } catch (err: any) {
            console.error('[OANDA] Failed to load instruments:', err?.response?.data || err?.message || err);
            this.instruments = [];
        }
    }

    private async pollOnce(): Promise<void> {
        try {
            const instrumentsParam = this.instruments.join(',');
            const res = await this.client.get(
                `/v3/accounts/${this.options.accountId}/pricing`,
                { params: { instruments: instrumentsParam } }
            );

            const prices = res.data?.prices || [];
            for (const p of prices) {
                const instrument = p?.instrument as string | undefined;
                const bids = p?.bids as Array<{ price: string }> | undefined;
                const asks = p?.asks as Array<{ price: string }> | undefined;
                if (!instrument || !bids?.[0]?.price || !asks?.[0]?.price) continue;

                const bid = Number(bids[0].price);
                const ask = Number(asks[0].price);
                if (!Number.isFinite(bid) || !Number.isFinite(ask)) continue;

                const mid = (bid + ask) / 2;
                const symbol = fromOandaInstrument(instrument);
                this.calculator.updatePrice(symbol, mid);
            }
        } catch (err: any) {
            console.error('[OANDA] Pricing poll failed:', err?.response?.data || err?.message || err);
        }
    }
}

function toOandaInstrument(pair: string): string {
    // EURUSD -> EUR_USD
    if (pair.length !== 6) return pair;
    return `${pair.slice(0, 3)}_${pair.slice(3, 6)}`;
}

function fromOandaInstrument(instrument: string): string {
    // EUR_USD -> EURUSD
    return instrument.replace('_', '');
}

