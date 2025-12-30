import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'currency_strength',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20 // max connection pool size
};

export const db = pgp(config);

export const initDb = async () => {
    const maxAttempts = parseInt(process.env.DB_CONNECT_RETRIES || '30', 10);
    const delayMs = parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS || '1000', 10);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const version = await db.one('SELECT version()');
            console.log('[DB] Connected:', version.version);
            await createSchema();
            return;
        } catch (err) {
            if (attempt === maxAttempts) {
                console.error('[DB] Connection error:', err);
                return;
            }
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }
};

const createSchema = async () => {
    // Enable TimescaleDB extension
    await db.none('CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE');

    // Strength History Table
    await db.none(`
        CREATE TABLE IF NOT EXISTS strength_history (
            time        TIMESTAMPTZ NOT NULL,
            currency    VARCHAR(10) NOT NULL,
            strength    DECIMAL(5,2) NOT NULL,
            method      VARCHAR(20) DEFAULT 'weighted',
            PRIMARY KEY (time, currency)
        );
    `);

    // Convert to Hypertable (TimescaleDB)
    // `create_hypertable` returns rows; use `any()` so pg-promise doesn't treat that as an error.
    try {
        await db.any("SELECT create_hypertable('strength_history', 'time', if_not_exists => TRUE);");
        console.log('[DB] Hypertable initialized');
    } catch (err) {
        console.log('[DB] Hypertable init skipped or failed', (err as any).message);
    }

    // Index
    await db.none('CREATE INDEX IF NOT EXISTS idx_strength_currency ON strength_history (currency, time DESC);');

    console.log('[DB] Schema initialized');
};
