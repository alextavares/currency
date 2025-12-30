export const FOREX_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

export const FOREX_PAIRS = [
    'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD',  // USD Quote
    'USDJPY', 'USDCHF', 'USDCAD',             // USD Base
    'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD',
    'GBPJPY', 'GBPCHF', 'GBPAUD', 'GBPCAD', 'GBPNZD',
    'AUDJPY', 'AUDCHF', 'AUDCAD', 'AUDNZD',
    'NZDJPY', 'NZDCHF', 'NZDCAD',
    'CADJPY', 'CADCHF',
    'CHFJPY'
];

export const LIQUIDITY_WEIGHTS: Record<string, number> = {
    'EURUSD': 1.0,
    'USDJPY': 0.9,
    'GBPUSD': 0.85,
    'AUDUSD': 0.7,
    'USDCAD': 0.65,
    'USDCHF': 0.6,
    'NZDUSD': 0.5,
    // Crosses default to fallback weight in calculator
};
