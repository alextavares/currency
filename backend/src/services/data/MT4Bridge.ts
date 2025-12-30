import { Router } from 'express';
import { StrengthCalculator } from '../strength/Calculator';
import { fillMissingForexPairs } from './ForexTriangulator';
import { PriceHistoryStore } from './PriceHistoryStore';

export const createMT4Bridge = (calculator: StrengthCalculator, priceStore: PriceHistoryStore) => {
    const router = Router();

    router.post('/prices', (req, res) => {
        // EA sends format: { timestamp: 123, prices: { EURUSD: 1.10, ... } }
        const { prices } = req.body;

        if (prices) {
            // Convert string values to numbers if necessary (EA sometimes sends strings)
            const numericPrices: Record<string, number> = {};
            for (const [key, value] of Object.entries(prices)) {
                numericPrices[key] = Number(value);
            }

            // If the EA sends only a subset (e.g. 7 majors vs USD), triangulate the rest.
            const filledPrices = fillMissingForexPairs(numericPrices);
            calculator.updatePrices(filledPrices);
            priceStore.addPrices(numericPrices);

            const locals = (req.app as any).locals;
            const prev = locals.lastReceivedPrices as Record<string, number> | undefined;
            const deltas: Record<string, number> = {};
            if (prev) {
                for (const [k, v] of Object.entries(numericPrices)) {
                    if (typeof prev[k] === 'number' && Number.isFinite(prev[k])) {
                        deltas[k] = v - prev[k];
                    }
                }
            }

            locals.lastReceivedPrices = numericPrices;
            locals.lastPricePush = {
                at: Date.now(),
                receivedSymbols: Object.keys(numericPrices).length,
                updatedSymbols: Object.keys(filledPrices).length,
                deltas
            };

            console.log(
                `[MT5] prices received=${Object.keys(numericPrices).length} updated=${Object.keys(filledPrices).length}`
            );

            // Calculate immediately or wait for tick? 
            // For now, let's calculate on every push for real-time responsiveness.
            const strengths = calculator.calculateStrengths();

            // We can attach this to the response or emit via WS in the main loop
            // res.json({ status: 'updated', strengths });
            res.status(200).json({ status: 'ok', strengths });
        } else {
            res.status(400).send('No prices provided');
        }
    });

    return router;
};
