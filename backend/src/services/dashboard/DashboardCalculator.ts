import { FOREX_CURRENCIES, FOREX_PAIRS, LIQUIDITY_WEIGHTS } from "../../config/constants";
import { fillMissingForexPairs } from "../data/ForexTriangulator";
import { PriceHistoryStore } from "../data/PriceHistoryStore";

export type DashboardTimeframe =
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "4h"
  | "12h"
  | "24h"
  | "1w";

export const DASHBOARD_TIMEFRAMES: Record<DashboardTimeframe, number> = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  // "1W" displayed as a trading-week; rolling window uses 5 * 24h for now.
  "1w": 5 * 24 * 60 * 60 * 1000,
};

export type DashboardScores = Record<string, number>; // currency -> 0..100 (integer)
export type DashboardPayload = {
  at: number;
  scoresByTf: Record<DashboardTimeframe, DashboardScores | null>;
};

export class DashboardCalculator {
  private readonly store: PriceHistoryStore;
  private readonly requiredSymbols: string[];

  constructor(store: PriceHistoryStore, requiredSymbols: string[]) {
    this.store = store;
    this.requiredSymbols = requiredSymbols;
  }

  public calculateAll(nowTime?: number): DashboardPayload | null {
    const at = nowTime ?? this.store.getLatestTime();
    if (!at) return null;

    const scoresByTf: DashboardPayload["scoresByTf"] = {
      "5m": null,
      "15m": null,
      "30m": null,
      "1h": null,
      "4h": null,
      "12h": null,
      "24h": null,
      "1w": null,
    };

    for (const tf of Object.keys(DASHBOARD_TIMEFRAMES) as DashboardTimeframe[]) {
      const baselineTime = at - DASHBOARD_TIMEFRAMES[tf];
      scoresByTf[tf] = this.calculateForWindow(at, baselineTime);
    }

    return { at, scoresByTf };
  }

  private calculateForWindow(nowTime: number, baselineTime: number): DashboardScores | null {
    const nowBase: Record<string, number> = {};
    const pastBase: Record<string, number> = {};

    for (const symbol of this.requiredSymbols) {
      const now = this.store.getPriceAtOrBefore(symbol, nowTime);
      const past = this.store.getPriceAtOrBefore(symbol, baselineTime);
      if (!now || !past) return null;
      nowBase[symbol] = now.mid;
      pastBase[symbol] = past.mid;
    }

    const nowAll = fillMissingForexPairs(nowBase);
    const pastAll = fillMissingForexPairs(pastBase);

    const currencies = [...FOREX_CURRENCIES];
    const raw: Record<string, number> = Object.fromEntries(currencies.map((c) => [c, 0]));
    const weightSums: Record<string, number> = Object.fromEntries(currencies.map((c) => [c, 0]));

    for (const pair of FOREX_PAIRS) {
      const nowP = nowAll[pair];
      const pastP = pastAll[pair];
      if (!nowP || !pastP) continue;

      const base = pair.slice(0, 3);
      const quote = pair.slice(3, 6);
      if (raw[base] === undefined || raw[quote] === undefined) continue;

      const weight = LIQUIDITY_WEIGHTS[pair] || 0.3;
      const ret = Math.log(nowP / pastP);

      raw[base] += ret * weight;
      raw[quote] -= ret * weight;
      weightSums[base] += weight;
      weightSums[quote] += weight;
    }

    const perCurrency: Record<string, number> = {};
    for (const c of currencies) {
      perCurrency[c] = weightSums[c] > 0 ? raw[c] / weightSums[c] : 0;
    }

    // Relative normalization (z-score)
    const values = currencies.map((c) => perCurrency[c]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / values.length;
    const std = Math.sqrt(variance);
    const z: Record<string, number> = {};

    if (!Number.isFinite(std) || std === 0) {
      for (const c of currencies) z[c] = 0;
    } else {
      for (const c of currencies) z[c] = (perCurrency[c] - mean) / std;
    }

    // Site-like "always stretched" scaling: min..max -> 0..100
    const zVals = currencies.map((c) => z[c]);
    const min = Math.min(...zVals);
    const max = Math.max(...zVals);
    const denom = max - min;

    const scores: DashboardScores = {};
    if (!Number.isFinite(denom) || denom === 0) {
      for (const c of currencies) scores[c] = 50;
      return scores;
    }

    for (const c of currencies) {
      const scaled = ((z[c] - min) / denom) * 100;
      scores[c] = Math.round(Math.max(0, Math.min(100, scaled)));
    }

    return scores;
  }
}

