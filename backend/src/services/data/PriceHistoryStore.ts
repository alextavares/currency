export type PriceSample = { t: number; mid: number };

export class PriceHistoryStore {
  private readonly maxSamplesPerSymbol: number;
  private readonly series: Record<string, PriceSample[]> = {};
  private lastTime: number | null = null;

  constructor() {
    const max = Number.parseInt(process.env.PRICE_HISTORY_MAX_SAMPLES || "10080", 10); // 7d @ 1/min
    this.maxSamplesPerSymbol = Number.isFinite(max) && max > 10 ? max : 10080;
  }

  public addPrices(prices: Record<string, number>, at: number = Date.now()): void {
    this.lastTime = at;
    for (const [symbol, mid] of Object.entries(prices)) {
      const price = Number(mid);
      if (!Number.isFinite(price) || price <= 0) continue;

      if (!this.series[symbol]) this.series[symbol] = [];
      const arr = this.series[symbol];
      arr.push({ t: at, mid: price });

      if (arr.length > this.maxSamplesPerSymbol) {
        arr.splice(0, arr.length - this.maxSamplesPerSymbol);
      }
    }
  }

  public getLatestTime(): number | null {
    return this.lastTime;
  }

  public getPriceAtOrBefore(symbol: string, targetTime: number): PriceSample | null {
    const arr = this.series[symbol];
    if (!arr || arr.length === 0) return null;

    // Quick bounds
    if (targetTime < arr[0].t) return null;
    if (targetTime >= arr[arr.length - 1].t) return arr[arr.length - 1];

    // Binary search: last sample with t <= targetTime
    let lo = 0;
    let hi = arr.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const t = arr[mid].t;
      if (t === targetTime) return arr[mid];
      if (t < targetTime) lo = mid + 1;
      else hi = mid - 1;
    }
    return hi >= 0 ? arr[hi] : null;
  }
}

