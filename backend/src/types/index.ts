export interface PriceData {
    symbol: string;
    price: number;
    timestamp: number;
}

export interface StrengthData {
    [currency: string]: number;
}

export interface StrengthUpdate {
    strengths: StrengthData;
    timestamp: number;
    type: 'realtime' | 'historical';
}

export interface Alert {
    id: string;
    currency: string;
    condition: '>' | '<';
    value: number;
    createdAt: number;
    lastTriggered?: number;
}
