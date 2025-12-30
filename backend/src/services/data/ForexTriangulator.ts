import { FOREX_PAIRS } from '../../config/constants';

export function fillMissingForexPairs(rawPrices: Record<string, number>): Record<string, number> {
    const prices: Record<string, number> = { ...rawPrices };

    for (const pair of FOREX_PAIRS) {
        if (isFinitePositive(prices[pair])) continue;

        const base = pair.slice(0, 3);
        const quote = pair.slice(3, 6);
        const rate = deriveRate(base, quote, prices);
        if (rate !== null) prices[pair] = rate;
    }

    return prices;
}

function deriveRate(base: string, quote: string, prices: Record<string, number>): number | null {
    const direct = getRate(base, quote, prices);
    if (direct !== null) return direct;

    if (base === 'USD' || quote === 'USD') return null;

    const baseUsd = getRate(base, 'USD', prices);
    const usdQuote = getRate('USD', quote, prices);
    if (baseUsd === null || usdQuote === null) return null;

    return baseUsd * usdQuote;
}

function getRate(base: string, quote: string, prices: Record<string, number>): number | null {
    const directPair = `${base}${quote}`;
    if (isFinitePositive(prices[directPair])) return prices[directPair];

    const inversePair = `${quote}${base}`;
    if (isFinitePositive(prices[inversePair])) return 1 / prices[inversePair];

    return null;
}

function isFinitePositive(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

