import { FOREX_CURRENCIES, LIQUIDITY_WEIGHTS, FOREX_PAIRS } from '../../config/constants';
import { StrengthData } from '../../types';

export class StrengthCalculator {
    private prices: Record<string, number> = {};
    private previousPrices: Record<string, number> = {};

    // Rolling window for smoothing (optional)
    private history: Record<string, number[]> = {};

    private readonly maxHistorySamples: number;
    private readonly lookbackSamples: number;
    private readonly zMultiplier: number;
    private readonly smoothingAlpha: number;

    private smoothedStrengths: StrengthData = {};

    constructor() {
        // For minute-level updates, compare against an older baseline so values move meaningfully.
        // If you push prices more frequently, lower this value.
        this.lookbackSamples = parseInt(process.env.STRENGTH_LOOKBACK_SAMPLES || '15', 10);
        this.maxHistorySamples = Math.max(this.lookbackSamples + 1, parseInt(process.env.STRENGTH_MAX_HISTORY_SAMPLES || '240', 10));

        // How aggressively to spread values away from 5.0 using z-scores.
        this.zMultiplier = Number.parseFloat(process.env.STRENGTH_Z_MULTIPLIER || '1.7');

        // Exponential smoothing for nicer UI (0 = no smoothing, 1 = never update).
        this.smoothingAlpha = Number.parseFloat(process.env.STRENGTH_SMOOTHING_ALPHA || '0.25');
    }

    public updatePrice(symbol: string, price: number): void {
        if (this.prices[symbol]) {
            this.previousPrices[symbol] = this.prices[symbol];
        }
        this.prices[symbol] = price;

        if (!this.history[symbol]) this.history[symbol] = [];
        const series = this.history[symbol];
        series.push(price);
        if (series.length > this.maxHistorySamples) {
            series.splice(0, series.length - this.maxHistorySamples);
        }
    }

    public updatePrices(prices: Record<string, number>): void {
        for (const [symbol, price] of Object.entries(prices)) {
            this.updatePrice(symbol, price);
        }
    }

    public calculateStrengths(): StrengthData {
        const currencies = [...FOREX_CURRENCIES];
        const raw: Record<string, number> = Object.fromEntries(currencies.map(c => [c, 0]));
        const weightSums: Record<string, number> = Object.fromEntries(currencies.map(c => [c, 0]));

        for (const pair of FOREX_PAIRS) {
            const currentPrice = this.prices[pair];
            const baselinePrice = this.getBaselinePrice(pair);
            if (!currentPrice || !baselinePrice) continue;

            const base = pair.slice(0, 3);
            const quote = pair.slice(3, 6);
            if (raw[base] === undefined || raw[quote] === undefined) continue;

            const weight = LIQUIDITY_WEIGHTS[pair] || 0.3;

            // Log return is symmetric and stable for cross comparisons.
            const ret = Math.log(currentPrice / baselinePrice);

            raw[base] += ret * weight;
            raw[quote] -= ret * weight;
            weightSums[base] += weight;
            weightSums[quote] += weight;
        }

        const perCurrency: Record<string, number> = {};
        for (const c of currencies) {
            perCurrency[c] = weightSums[c] > 0 ? raw[c] / weightSums[c] : 0;
        }

        const values = currencies.map(c => perCurrency[c]);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / values.length;
        const std = Math.sqrt(variance);

        const strengths: StrengthData = {};
        if (!Number.isFinite(std) || std === 0) {
            for (const c of currencies) strengths[c] = 5;
            this.smoothedStrengths = strengths;
            return strengths;
        }

        const mult = Number.isFinite(this.zMultiplier) ? this.zMultiplier : 1.7;
        const alpha = Number.isFinite(this.smoothingAlpha) ? this.smoothingAlpha : 0.25;
        const smooth = alpha > 0 && alpha < 1;

        for (const c of currencies) {
            const z = (perCurrency[c] - mean) / std;
            const target = this.clamp(5 + z * mult, 0, 10);

            if (smooth && this.smoothedStrengths[c] !== undefined) {
                strengths[c] = this.smoothedStrengths[c] * alpha + target * (1 - alpha);
            } else {
                strengths[c] = target;
            }
        }

        this.smoothedStrengths = strengths;
        return strengths;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    private getBaselinePrice(pair: string): number | undefined {
        const series = this.history[pair];
        if (series && series.length > this.lookbackSamples) {
            return series[series.length - 1 - this.lookbackSamples];
        }
        return this.previousPrices[pair];
    }

    public getPrices() {
        return this.prices;
    }
}
