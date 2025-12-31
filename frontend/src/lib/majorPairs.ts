export type MajorCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'NZD';
export type MajorPair =
  | 'EURUSD'
  | 'GBPUSD'
  | 'USDJPY'
  | 'USDCHF'
  | 'USDCAD'
  | 'AUDUSD'
  | 'NZDUSD'
  | 'EURGBP'
  | 'EURJPY'
  | 'EURCHF'
  | 'EURCAD'
  | 'EURAUD'
  | 'EURNZD'
  | 'GBPJPY'
  | 'GBPCHF'
  | 'GBPCAD'
  | 'GBPAUD'
  | 'GBPNZD'
  | 'AUDJPY'
  | 'AUDCHF'
  | 'AUDCAD'
  | 'AUDNZD'
  | 'NZDJPY'
  | 'NZDCHF'
  | 'NZDCAD'
  | 'CADJPY'
  | 'CADCHF'
  | 'CHFJPY';

export const MAJOR_CURRENCIES: readonly MajorCurrency[] = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CHF',
  'CAD',
  'AUD',
  'NZD',
];

export const MAJOR_PAIRS: readonly MajorPair[] = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'USDCHF',
  'USDCAD',
  'AUDUSD',
  'NZDUSD',
  'EURGBP',
  'EURJPY',
  'EURCHF',
  'EURCAD',
  'EURAUD',
  'EURNZD',
  'GBPJPY',
  'GBPCHF',
  'GBPCAD',
  'GBPAUD',
  'GBPNZD',
  'AUDJPY',
  'AUDCHF',
  'AUDCAD',
  'AUDNZD',
  'NZDJPY',
  'NZDCHF',
  'NZDCAD',
  'CADJPY',
  'CADCHF',
  'CHFJPY',
];

export function normalizeMajorPair(raw: string): MajorPair | null {
  const v = raw.trim().toUpperCase();
  return (MAJOR_PAIRS as readonly string[]).includes(v) ? (v as MajorPair) : null;
}

export function getPairParts(pair: MajorPair): { base: MajorCurrency; quote: MajorCurrency } {
  const base = pair.slice(0, 3) as MajorCurrency;
  const quote = pair.slice(3, 6) as MajorCurrency;
  return { base, quote };
}

export function getPairPageSlug(pair: MajorPair): string {
  return pair.toLowerCase();
}

