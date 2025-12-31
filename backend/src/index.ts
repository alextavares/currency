import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { StrengthCalculator } from './services/strength/Calculator';
import { createMT4Bridge } from './services/data/MT4Bridge';
import { PersistenceService } from './services/data/PersistenceService';
import { initDb } from './config/database';
import { AlertService } from './services/alerts/AlertService';
import { OandaForexService } from './services/data/OandaForexService';
import { PriceHistoryStore } from './services/data/PriceHistoryStore';
import { DashboardCalculator } from './services/dashboard/DashboardCalculator';
import { DASHBOARD_TIMEFRAMES, type DashboardTimeframe } from './services/dashboard/DashboardCalculator';
import { fillMissingForexPairs } from './services/data/ForexTriangulator';
import { FOREX_PAIRS } from './config/constants';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Services Initialization
const calculator = new StrengthCalculator();
const persistence = new PersistenceService();
const alertService = new AlertService(io); // Initialized AlertService
const priceStore = new PriceHistoryStore();
const dashboard = new DashboardCalculator(priceStore, ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDCAD", "USDCHF", "USDJPY"]);

// Connect DB
initDb();

// Start Forex feed (optional)
let oanda: OandaForexService | null = null;
if (process.env.OANDA_API_TOKEN && process.env.OANDA_ACCOUNT_ID) {
    oanda = new OandaForexService(calculator, {
        apiToken: process.env.OANDA_API_TOKEN,
        accountId: process.env.OANDA_ACCOUNT_ID,
        env: (process.env.OANDA_ENV === 'live' ? 'live' : 'practice'),
        pollIntervalMs: parseInt(process.env.FOREX_POLL_INTERVAL_MS || '60000', 10)
    });

    oanda.start().catch((err) => console.error('[OANDA] Failed to start:', err?.message || err));
} else {
    console.log('[OANDA] Not configured (set OANDA_API_TOKEN and OANDA_ACCOUNT_ID) - using MT4 bridge only.');
}

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mt4', createMT4Bridge(calculator, priceStore));

// Dashboard JSON (latest computed snapshot)
app.get('/api/dashboard', (req, res) => {
    res.json((req.app as any).locals.lastDashboard || null);
});

// Heatmap JSON: pair moves (pips / percent) across timeframes.
app.get('/api/heatmap', (req, res) => {
    const at = priceStore.getLatestTime();
    if (!at) return res.json(null);

    const requiredSymbols = ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDCAD", "USDCHF", "USDJPY"];
    const valuesByTf: Record<DashboardTimeframe, Array<{ pair: string; pips: number; percent: number }> | null> = {
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

        const nowBase: Record<string, number> = {};
        const pastBase: Record<string, number> = {};

        let ok = true;
        for (const symbol of requiredSymbols) {
            const now = priceStore.getPriceAtOrBefore(symbol, at);
            const past = priceStore.getPriceAtOrBefore(symbol, baselineTime);
            if (!now || !past) {
                ok = false;
                break;
            }
            nowBase[symbol] = now.mid;
            pastBase[symbol] = past.mid;
        }

        if (!ok) {
            valuesByTf[tf] = null;
            continue;
        }

        const nowAll = fillMissingForexPairs(nowBase);
        const pastAll = fillMissingForexPairs(pastBase);

        valuesByTf[tf] = FOREX_PAIRS.map((pair) => {
            const now = nowAll[pair];
            const past = pastAll[pair];
            if (!now || !past) return { pair, pips: 0, percent: 0 };

            const quote = pair.slice(3, 6);
            const pipSize = quote === 'JPY' ? 0.01 : 0.0001;
            const pips = (now - past) / pipSize;
            const percent = ((now / past) - 1) * 100;

            return {
                pair,
                pips: Math.round(pips * 10) / 10,
                percent: Math.round(percent * 1000) / 1000,
            };
        });
    }

    res.json({ at, valuesByTf });
});

// Debug: shows last MT5/MT4 push (timestamp + counts)
app.get('/api/debug/mt4', (req, res) => {
    res.json((req.app as any).locals.lastPricePush || null);
});

// History API
app.get('/api/history/:currency', async (req, res) => {
    try {
        const { currency } = req.params;
        const limit = parseInt(req.query.limit as string) || 100; // Changed parsing for limit
        const data = await persistence.getHistory(currency.toUpperCase(), limit);
        res.json(data);
    } catch (err) {
        console.error(err); // Added error logging
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Alerts Endpoints
app.get('/api/alerts', (req, res) => {
    res.json(alertService.getAlerts());
});

app.post('/api/alerts', (req, res) => {
    const { currency, condition, value } = req.body;
    if (!currency || !condition || value === undefined) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const alert = alertService.addAlert({ currency, condition, value });
    res.json(alert);
});

app.delete('/api/alerts/:id', (req, res) => {
    alertService.removeAlert(req.params.id);
    res.json({ success: true });
});

app.get('/health', (req, res) => {
    res.send({ status: 'ok', timestamp: new Date() });
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send initial data
    socket.emit('strength:initial', calculator.calculateStrengths());
    const lastDashboard = (app as any).locals.lastDashboard;
    socket.emit('dashboard:initial', lastDashboard || null);

    socket.on('subscribe:strength', () => {
        socket.join('strength_updates');
    });

    socket.on('subscribe:dashboard', () => {
        socket.join('dashboard_updates');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Settings
const UPDATE_INTERVAL_MS = 1000;
const PERSIST_INTERVAL_MS = 60000; // Save to DB every minute to save space
const DASHBOARD_EMIT_INTERVAL_MS = 5000; // clients can stay fresh even if no new tick arrives

let lastPersist = 0;
let lastDashboardEmit = 0;
let lastDashboardAt = 0;

// Main Loop
setInterval(async () => {
    const strengths = calculator.calculateStrengths();
    const now = Date.now();

    // Emit Realtime
    io.to('strength_updates').emit('strength:update', {
        strengths,
        timestamp: now,
        type: 'realtime'
    });

    // Persist to DB (Throttled)
    if (now - lastPersist > PERSIST_INTERVAL_MS) {
        lastPersist = now;
        await persistence.saveStrengths(strengths, now);
    }

    // Dashboard updates: compute when new MT5 prices arrive, and emit periodically with latest snapshot.
    const locals = (app as any).locals;
    const lastPricePushAt = locals.lastPricePush?.at as number | undefined;
    if (lastPricePushAt && lastPricePushAt > lastDashboardAt) {
        const payload = dashboard.calculateAll(lastPricePushAt);
        if (payload) {
            locals.lastDashboard = payload;
            lastDashboardAt = lastPricePushAt;
        }
    }

    if (now - lastDashboardEmit > DASHBOARD_EMIT_INTERVAL_MS) {
        lastDashboardEmit = now;
        if (locals.lastDashboard) {
            io.to('dashboard_updates').emit('dashboard:update', locals.lastDashboard);
        }
    }

}, UPDATE_INTERVAL_MS);


const DEFAULT_PORT = 3001;
const configuredPort = process.env.BACKEND_PORT || process.env.PORT;
let PORT = configuredPort ? parseInt(configuredPort, 10) : DEFAULT_PORT;

// Common dev pitfall: Windows/Next.js tooling often leaves PORT=3000 in the environment.
// If BACKEND_PORT isn't set, prefer our default for local backend dev.
if (!process.env.BACKEND_PORT && process.env.NODE_ENV !== 'production' && PORT === 3000) {
    PORT = DEFAULT_PORT;
}

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    oanda?.stop();
    process.exit(0);
});
