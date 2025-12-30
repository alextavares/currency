# Currency Strength Meter - Especificação Técnica Completa

## 📋 Visão Geral do Projeto

### O Que É
Uma plataforma web de análise de força cambial em tempo real que permite traders visualizarem a força relativa de moedas (Forex) e criptomoedas em um único painel unificado.

### Problema que Resolve
- Traders não conseguem saber se EUR/USD subiu porque EUR está forte ou USD está fraco
- Ferramentas existentes não têm histórico navegável
- Nenhuma ferramenta integra Forex + Crypto no mesmo painel
- Ausência de alertas em tempo real
- Interfaces mobile ruins

### Proposta de Valor
"O único medidor de força cambial com histórico ilimitado, alertas em tempo real e painel híbrido Forex + Crypto"

### Modelo de Negócio
- Afiliados de corretoras Forex (CPA até $1.850/cliente)
- Afiliados de Prop Firms (10-20% do desafio)
- Freemium: alertas pagos via Telegram ($9.90/mês)
- Venda de indicador MT4/MT5 ($49 único)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        FONTES DE DADOS                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   MT4 Bridge    │  Binance WS     │    Twelve Data (backup)     │
│   (Forex)       │  (Crypto)       │    (fallback)               │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js)                           │
├─────────────────────────────────────────────────────────────────┤
│  • Data Aggregator Service (coleta e normaliza dados)           │
│  • Strength Calculator Service (calcula força de cada moeda)    │
│  • WebSocket Server (envia dados real-time para clientes)       │
│  • Alert Service (monitora thresholds e dispara alertas)        │
│  • API REST (histórico, auth, configurações)                    │
└────────┬───────────────────┬────────────────────┬───────────────┘
         │                   │                    │
         ▼                   ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│  TimescaleDB    │ │    Supabase     │ │    Telegram Bot API     │
│  (séries temp.) │ │  (users/auth)   │ │    (alertas)            │
└─────────────────┘ └─────────────────┘ └─────────────────────────┘
         │                   │                    
         └─────────┬─────────┘                    
                   ▼                              
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────┤
│  • Dashboard principal (medidor de força)                       │
│  • Gráficos históricos interativos                              │
│  • Painel de alertas                                            │
│  • Páginas SEO programático                                     │
│  • PWA para mobile                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas do Projeto

```
currency-strength-meter/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Conexões DB
│   │   │   ├── constants.js         # Pares, moedas, configs
│   │   │   └── env.js               # Variáveis de ambiente
│   │   │
│   │   ├── services/
│   │   │   ├── dataAggregator/
│   │   │   │   ├── mt4Bridge.js     # Recebe dados do MT4
│   │   │   │   ├── binanceWs.js     # WebSocket Binance
│   │   │   │   └── fallback.js      # API backup (Twelve Data)
│   │   │   │
│   │   │   ├── strengthCalculator/
│   │   │   │   ├── calculator.js    # Lógica de cálculo
│   │   │   │   ├── methods.js       # RSI, ROC, Média Ponderada
│   │   │   │   └── weights.js       # Pesos por liquidez
│   │   │   │
│   │   │   ├── alertService/
│   │   │   │   ├── monitor.js       # Monitora thresholds
│   │   │   │   ├── telegram.js      # Envia para Telegram
│   │   │   │   └── push.js          # Web Push notifications
│   │   │   │
│   │   │   └── websocket/
│   │   │       ├── server.js        # Socket.io server
│   │   │       └── handlers.js      # Event handlers
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── strength.js      # GET /api/strength
│   │   │   │   ├── history.js       # GET /api/history/:currency
│   │   │   │   ├── alerts.js        # CRUD alertas do usuário
│   │   │   │   └── auth.js          # Login, registro
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── auth.js          # JWT validation
│   │   │       └── rateLimit.js     # Rate limiting
│   │   │
│   │   ├── models/
│   │   │   ├── StrengthHistory.js   # Modelo TimescaleDB
│   │   │   ├── User.js              # Modelo usuário
│   │   │   ├── Alert.js             # Modelo alerta
│   │   │   └── Subscription.js      # Modelo assinatura
│   │   │
│   │   ├── jobs/
│   │   │   ├── cleanupOldData.js    # Limpa dados antigos
│   │   │   └── dailyReport.js       # Relatório diário
│   │   │
│   │   └── index.js                 # Entry point
│   │
│   ├── mt4-bridge/
│   │   └── CurrencyStrengthEA.mq4   # Expert Advisor MT4
│   │
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── StrengthMeter.jsx      # Medidor principal
│   │   │   │   ├── StrengthBar.jsx        # Barra individual
│   │   │   │   ├── CurrencyCard.jsx       # Card de moeda
│   │   │   │   └── TrendIndicator.jsx     # Seta de tendência
│   │   │   │
│   │   │   ├── Charts/
│   │   │   │   ├── HistoryChart.jsx       # Gráfico histórico
│   │   │   │   ├── ComparisonChart.jsx    # Comparar moedas
│   │   │   │   └── HeatmapMatrix.jsx      # Matriz de força
│   │   │   │
│   │   │   ├── Alerts/
│   │   │   │   ├── AlertPanel.jsx         # Painel de alertas
│   │   │   │   ├── AlertForm.jsx          # Criar alerta
│   │   │   │   └── AlertHistory.jsx       # Histórico
│   │   │   │
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   │
│   │   │   └── SEO/
│   │   │       ├── CurrencyPage.jsx       # /strength/[currency]
│   │   │       └── PairPage.jsx           # /pair/[pair]
│   │   │
│   │   ├── hooks/
│   │   │   ├── useStrengthData.js         # Hook WebSocket
│   │   │   ├── useHistory.js              # Hook histórico
│   │   │   └── useAlerts.js               # Hook alertas
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── StrengthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── index.jsx                  # Home/Dashboard
│   │   │   ├── history.jsx                # Página histórico
│   │   │   ├── alerts.jsx                 # Página alertas
│   │   │   ├── strength/[currency].jsx    # SEO programático
│   │   │   └── pricing.jsx                # Planos
│   │   │
│   │   ├── lib/
│   │   │   ├── socket.js                  # Cliente Socket.io
│   │   │   ├── api.js                     # Cliente API REST
│   │   │   └── calculations.js            # Helpers cálculo
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── public/
│   │   ├── manifest.json                  # PWA manifest
│   │   └── sw.js                          # Service Worker
│   │
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── MT4-SETUP.md
```

---

## 💱 Moedas e Pares Suportados

### Forex (8 Moedas Principais)
```javascript
const FOREX_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];

const FOREX_PAIRS = [
  'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD',  // USD como quote
  'USDJPY', 'USDCHF', 'USDCAD',             // USD como base
  'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD',
  'GBPJPY', 'GBPCHF', 'GBPAUD', 'GBPCAD', 'GBPNZD',
  'AUDJPY', 'AUDCHF', 'AUDCAD', 'AUDNZD',
  'NZDJPY', 'NZDCHF', 'NZDCAD',
  'CADJPY', 'CADCHF',
  'CHFJPY'
];
```

### Crypto (4 Principais)
```javascript
const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'SOL', 'XRP'];

const CRYPTO_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT',  // vs USDT
  'ETHBTC', 'SOLBTC', 'XRPBTC',                 // vs BTC
  'SOLETH', 'XRPETH'                            // vs ETH
];
```

---

## 🧮 Algoritmo de Cálculo de Força

### Método Principal: Média Ponderada por Liquidez

```javascript
// backend/src/services/strengthCalculator/calculator.js

const LIQUIDITY_WEIGHTS = {
  'EURUSD': 1.0,    // Par mais líquido = peso máximo
  'USDJPY': 0.9,
  'GBPUSD': 0.85,
  'AUDUSD': 0.7,
  'USDCAD': 0.65,
  'USDCHF': 0.6,
  'NZDUSD': 0.5,
  // ... outros pares com pesos menores
};

/**
 * Calcula a força de uma moeda específica
 * @param {string} currency - Ex: 'USD'
 * @param {Object} prices - Preços atuais de todos os pares
 * @param {Object} previousPrices - Preços do período anterior
 * @returns {number} - Força entre 0 e 10
 */
function calculateCurrencyStrength(currency, prices, previousPrices) {
  const relevantPairs = getRelevantPairs(currency);
  let weightedSum = 0;
  let totalWeight = 0;

  for (const pair of relevantPairs) {
    const currentPrice = prices[pair];
    const previousPrice = previousPrices[pair];
    
    if (!currentPrice || !previousPrice) continue;

    // Calcula variação percentual
    const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    // Determina se a moeda é base ou quote no par
    const isBase = pair.startsWith(currency);
    
    // Se é base, movimento positivo = moeda forte
    // Se é quote, movimento negativo = moeda forte
    const strengthContribution = isBase ? percentChange : -percentChange;
    
    // Aplica peso de liquidez
    const weight = LIQUIDITY_WEIGHTS[pair] || 0.3;
    
    weightedSum += strengthContribution * weight;
    totalWeight += weight;
  }

  // Normaliza para escala 0-10
  const rawStrength = weightedSum / totalWeight;
  const normalizedStrength = normalizeToScale(rawStrength, 0, 10);
  
  return Math.round(normalizedStrength * 100) / 100;
}

/**
 * Normaliza valor para escala específica
 * Usa média histórica para determinar extremos
 */
function normalizeToScale(value, min, max) {
  // Assume que variações de ±2% representam extremos (0 ou 10)
  const clampedValue = Math.max(-2, Math.min(2, value));
  return ((clampedValue + 2) / 4) * (max - min) + min;
}

/**
 * Calcula força de todas as moedas
 * @returns {Object} - { USD: 7.5, EUR: 3.2, ... }
 */
function calculateAllStrengths(prices, previousPrices) {
  const allCurrencies = [...FOREX_CURRENCIES, ...CRYPTO_CURRENCIES];
  const strengths = {};
  
  for (const currency of allCurrencies) {
    strengths[currency] = calculateCurrencyStrength(currency, prices, previousPrices);
  }
  
  return strengths;
}
```

### Método Alternativo: Baseado em RSI

```javascript
// Para usuários que preferem análise de momentum

function calculateRSIStrength(currency, priceHistory, period = 14) {
  const relevantPairs = getRelevantPairs(currency);
  let rsiSum = 0;
  let count = 0;

  for (const pair of relevantPairs) {
    const prices = priceHistory[pair];
    if (!prices || prices.length < period + 1) continue;
    
    const rsi = calculateRSI(prices, period);
    const isBase = pair.startsWith(currency);
    
    // Se é base, RSI alto = moeda forte
    // Se é quote, RSI baixo = moeda forte
    const adjustedRSI = isBase ? rsi : (100 - rsi);
    
    rsiSum += adjustedRSI;
    count++;
  }

  // Normaliza RSI médio (0-100) para escala 0-10
  return count > 0 ? (rsiSum / count) / 10 : 5;
}

function calculateRSI(prices, period) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}
```

---

## 🔌 Integração de Dados

### MT4 Bridge (Expert Advisor)

```mql4
// backend/mt4-bridge/CurrencyStrengthEA.mq4

#property copyright "Currency Strength Meter"
#property version   "1.0"

// Configurações
input string ServerURL = "https://seu-servidor.com/api/mt4/prices";
input int UpdateIntervalSeconds = 1;

// Pares para monitorar
string pairs[] = {
   "EURUSD", "GBPUSD", "AUDUSD", "NZDUSD",
   "USDJPY", "USDCHF", "USDCAD",
   "EURGBP", "EURJPY", "EURCHF", "EURAUD", "EURCAD", "EURNZD",
   "GBPJPY", "GBPCHF", "GBPAUD", "GBPCAD", "GBPNZD",
   "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD",
   "NZDJPY", "NZDCHF", "NZDCAD",
   "CADJPY", "CADCHF", "CHFJPY"
};

int OnInit() {
   EventSetTimer(UpdateIntervalSeconds);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {
   EventKillTimer();
}

void OnTimer() {
   SendPrices();
}

void SendPrices() {
   string json = "{\"timestamp\":" + IntegerToString(TimeCurrent()) + ",\"prices\":{";
   
   for (int i = 0; i < ArraySize(pairs); i++) {
      double bid = MarketInfo(pairs[i], MODE_BID);
      double ask = MarketInfo(pairs[i], MODE_ASK);
      double mid = (bid + ask) / 2;
      
      if (i > 0) json += ",";
      json += "\"" + pairs[i] + "\":" + DoubleToString(mid, 5);
   }
   
   json += "}}";
   
   // Envia para o servidor
   string headers = "Content-Type: application/json\r\n";
   char post[], result[];
   StringToCharArray(json, post);
   
   int res = WebRequest(
      "POST",
      ServerURL,
      headers,
      5000,
      post,
      result,
      headers
   );
   
   if (res != 200) {
      Print("Erro ao enviar preços: ", res);
   }
}
```

### Binance WebSocket (Crypto)

```javascript
// backend/src/services/dataAggregator/binanceWs.js

const WebSocket = require('ws');
const EventEmitter = require('events');

class BinanceDataFeed extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.prices = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect() {
    const streams = [
      'btcusdt@ticker',
      'ethusdt@ticker',
      'solusdt@ticker',
      'xrpusdt@ticker',
      'ethbtc@ticker',
      'solbtc@ticker',
      'xrpbtc@ticker',
      'soleth@ticker',
      'xrpeth@ticker'
    ];

    const url = `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;
    
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('[Binance] WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        const ticker = parsed.data;
        
        if (ticker && ticker.s) {
          const symbol = ticker.s;
          const price = parseFloat(ticker.c); // Current price
          
          this.prices[symbol] = price;
          
          this.emit('price', {
            symbol,
            price,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('[Binance] Parse error:', err);
      }
    });

    this.ws.on('error', (err) => {
      console.error('[Binance] WebSocket error:', err);
    });

    this.ws.on('close', () => {
      console.log('[Binance] WebSocket closed');
      this.scheduleReconnect();
    });
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[Binance] Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('[Binance] Max reconnect attempts reached');
      this.emit('disconnected');
    }
  }

  getAllPrices() {
    return { ...this.prices };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

module.exports = BinanceDataFeed;
```

### Servidor WebSocket (para Frontend)

```javascript
// backend/src/services/websocket/server.js

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class StrengthWebSocketServer {
  constructor(httpServer, strengthCalculator) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });

    this.strengthCalculator = strengthCalculator;
    this.setupMiddleware();
    this.setupHandlers();
  }

  setupMiddleware() {
    // Autenticação opcional (usuários free podem conectar)
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.user = decoded;
          socket.isPro = decoded.subscription === 'pro';
        } catch (err) {
          socket.user = null;
          socket.isPro = false;
        }
      } else {
        socket.user = null;
        socket.isPro = false;
      }
      
      next();
    });
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`[WS] Client connected: ${socket.id} (Pro: ${socket.isPro})`);

      // Envia dados iniciais
      socket.emit('strength:initial', this.strengthCalculator.getCurrentStrengths());

      // Inscrição em atualizações
      socket.on('subscribe:strength', () => {
        socket.join('strength-updates');
      });

      // Inscrição em moeda específica
      socket.on('subscribe:currency', (currency) => {
        socket.join(`currency:${currency}`);
      });

      socket.on('disconnect', () => {
        console.log(`[WS] Client disconnected: ${socket.id}`);
      });
    });
  }

  // Chamado pelo StrengthCalculator quando há atualização
  broadcastStrengthUpdate(strengths, timestamp) {
    // Usuários free: atualização a cada 15 segundos
    // Usuários pro: atualização real-time
    
    const data = {
      strengths,
      timestamp,
      type: 'realtime'
    };

    // Broadcast para todos na sala
    this.io.to('strength-updates').emit('strength:update', data);
  }

  // Broadcast para moeda específica
  broadcastCurrencyUpdate(currency, data) {
    this.io.to(`currency:${currency}`).emit('currency:update', data);
  }
}

module.exports = StrengthWebSocketServer;
```

---

## 🗄️ Modelos de Banco de Dados

### TimescaleDB - Histórico de Força

```sql
-- Criar extensão TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Tabela de histórico de força
CREATE TABLE strength_history (
    time        TIMESTAMPTZ NOT NULL,
    currency    VARCHAR(10) NOT NULL,
    strength    DECIMAL(5,2) NOT NULL,
    method      VARCHAR(20) DEFAULT 'weighted', -- 'weighted', 'rsi', 'roc'
    
    PRIMARY KEY (time, currency)
);

-- Converter para hypertable (otimizado para séries temporais)
SELECT create_hypertable('strength_history', 'time');

-- Criar índice para consultas por moeda
CREATE INDEX idx_strength_currency ON strength_history (currency, time DESC);

-- Política de retenção: manter 90 dias de dados
SELECT add_retention_policy('strength_history', INTERVAL '90 days');

-- Agregação contínua para dados horários (otimiza consultas)
CREATE MATERIALIZED VIEW strength_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    currency,
    AVG(strength) as avg_strength,
    MAX(strength) as max_strength,
    MIN(strength) as min_strength,
    FIRST(strength, time) as open_strength,
    LAST(strength, time) as close_strength
FROM strength_history
GROUP BY bucket, currency;

-- Refresh automático
SELECT add_continuous_aggregate_policy('strength_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour'
);
```

### Supabase - Usuários e Alertas

```sql
-- Tabela de usuários (extende auth.users do Supabase)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro'
    subscription_expires_at TIMESTAMPTZ,
    telegram_chat_id TEXT,
    telegram_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de alertas
CREATE TABLE public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    currency TEXT NOT NULL,
    condition TEXT NOT NULL, -- 'above', 'below', 'crosses_above', 'crosses_below'
    threshold DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    notification_channels TEXT[] DEFAULT ARRAY['telegram'], -- 'telegram', 'push', 'email'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de alertas disparados
CREATE TABLE public.alert_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    strength_value DECIMAL(5,2),
    notification_sent BOOLEAN DEFAULT false
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can manage own alerts"
    ON public.alerts FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own alert history"
    ON public.alert_history FOR SELECT
    USING (
        alert_id IN (
            SELECT id FROM public.alerts WHERE user_id = auth.uid()
        )
    );
```

---

## 🔔 Sistema de Alertas

### Monitor de Alertas

```javascript
// backend/src/services/alertService/monitor.js

const { createClient } = require('@supabase/supabase-js');
const TelegramBot = require('./telegram');
const WebPush = require('./push');

class AlertMonitor {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    this.webPush = new WebPush();
    this.previousStrengths = {};
  }

  async checkAlerts(currentStrengths) {
    // Busca alertas ativos
    const { data: alerts, error } = await this.supabase
      .from('alerts')
      .select(`
        *,
        profiles:user_id (
          telegram_chat_id,
          telegram_verified,
          subscription_tier
        )
      `)
      .eq('is_active', true);

    if (error) {
      console.error('[AlertMonitor] Error fetching alerts:', error);
      return;
    }

    for (const alert of alerts) {
      const currentValue = currentStrengths[alert.currency];
      const previousValue = this.previousStrengths[alert.currency];

      if (currentValue === undefined) continue;

      const shouldTrigger = this.evaluateCondition(
        alert.condition,
        alert.threshold,
        currentValue,
        previousValue
      );

      if (shouldTrigger) {
        await this.triggerAlert(alert, currentValue);
      }
    }

    // Atualiza valores anteriores
    this.previousStrengths = { ...currentStrengths };
  }

  evaluateCondition(condition, threshold, current, previous) {
    switch (condition) {
      case 'above':
        return current > threshold;
      
      case 'below':
        return current < threshold;
      
      case 'crosses_above':
        return previous !== undefined && 
               previous <= threshold && 
               current > threshold;
      
      case 'crosses_below':
        return previous !== undefined && 
               previous >= threshold && 
               current < threshold;
      
      default:
        return false;
    }
  }

  async triggerAlert(alert, currentValue) {
    const { profiles: user } = alert;

    // Verifica cooldown (não disparar mesmo alerta em menos de 5 minutos)
    if (alert.last_triggered_at) {
      const lastTrigger = new Date(alert.last_triggered_at);
      const cooldown = 5 * 60 * 1000; // 5 minutos
      if (Date.now() - lastTrigger.getTime() < cooldown) {
        return;
      }
    }

    const message = this.formatAlertMessage(alert, currentValue);

    // Envia notificações
    for (const channel of alert.notification_channels) {
      try {
        switch (channel) {
          case 'telegram':
            if (user.telegram_chat_id && user.telegram_verified) {
              await this.telegram.sendMessage(user.telegram_chat_id, message);
            }
            break;
          
          case 'push':
            // Implementar web push
            break;
        }
      } catch (err) {
        console.error(`[AlertMonitor] Failed to send ${channel}:`, err);
      }
    }

    // Atualiza último disparo
    await this.supabase
      .from('alerts')
      .update({ last_triggered_at: new Date().toISOString() })
      .eq('id', alert.id);

    // Registra no histórico
    await this.supabase
      .from('alert_history')
      .insert({
        alert_id: alert.id,
        strength_value: currentValue,
        notification_sent: true
      });
  }

  formatAlertMessage(alert, currentValue) {
    const conditionText = {
      'above': 'está acima de',
      'below': 'está abaixo de',
      'crosses_above': 'cruzou acima de',
      'crosses_below': 'cruzou abaixo de'
    };

    return `🚨 *Alerta de Força Cambial*

💱 *${alert.currency}* ${conditionText[alert.condition]} ${alert.threshold}

📊 Valor atual: *${currentValue.toFixed(2)}*
⏰ ${new Date().toLocaleString('pt-BR')}

[Ver Dashboard](${process.env.FRONTEND_URL})`;
  }
}

module.exports = AlertMonitor;
```

### Bot Telegram

```javascript
// backend/src/services/alertService/telegram.js

const TelegramBotAPI = require('node-telegram-bot-api');

class TelegramBot {
  constructor(token) {
    this.bot = new TelegramBotAPI(token, { polling: true });
    this.setupCommands();
  }

  setupCommands() {
    // Comando /start - vincula conta
    this.bot.onText(/\/start (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const linkToken = match[1];

      try {
        // Valida token e vincula conta
        const result = await this.linkAccount(linkToken, chatId);
        
        if (result.success) {
          this.bot.sendMessage(chatId, 
            `✅ Conta vinculada com sucesso!\n\nVocê receberá alertas de força cambial aqui.\n\nComandos disponíveis:\n/status - Ver sua assinatura\n/strength - Ver força atual das moedas\n/help - Ajuda`
          );
        } else {
          this.bot.sendMessage(chatId, '❌ Token inválido ou expirado.');
        }
      } catch (err) {
        this.bot.sendMessage(chatId, '❌ Erro ao vincular conta.');
      }
    });

    // Comando /strength - mostra força atual
    this.bot.onText(/\/strength/, async (msg) => {
      const chatId = msg.chat.id;
      
      // Busca força atual do cache/banco
      const strengths = await this.getCurrentStrengths();
      
      const message = this.formatStrengthMessage(strengths);
      this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });

    // Comando /status
    this.bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.getUserByChatId(chatId);
      
      if (user) {
        const tier = user.subscription_tier === 'pro' ? '⭐ Pro' : '🆓 Free';
        this.bot.sendMessage(chatId, 
          `📊 *Status da Conta*\n\nPlano: ${tier}\nAlertas ativos: ${user.alertCount}\n\n[Gerenciar Alertas](${process.env.FRONTEND_URL}/alerts)`
        );
      } else {
        this.bot.sendMessage(chatId, '❌ Conta não vinculada. Use o link do site para vincular.');
      }
    });
  }

  formatStrengthMessage(strengths) {
    const sorted = Object.entries(strengths)
      .sort((a, b) => b[1] - a[1]);

    let message = '💪 *Força das Moedas*\n\n';
    
    for (const [currency, strength] of sorted) {
      const bar = this.getStrengthBar(strength);
      const emoji = strength > 6 ? '🟢' : strength < 4 ? '🔴' : '🟡';
      message += `${emoji} *${currency}*: ${strength.toFixed(1)} ${bar}\n`;
    }

    message += `\n⏰ ${new Date().toLocaleTimeString('pt-BR')}`;
    return message;
  }

  getStrengthBar(strength) {
    const filled = Math.round(strength);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  async sendMessage(chatId, message) {
    return this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

module.exports = TelegramBot;
```

---

## 🎨 Frontend - Componentes Principais

### Dashboard Principal

```jsx
// frontend/src/components/Dashboard/StrengthMeter.jsx

import React, { useEffect, useState } from 'react';
import { useStrengthData } from '../../hooks/useStrengthData';
import StrengthBar from './StrengthBar';
import TrendIndicator from './TrendIndicator';

const CURRENCY_FLAGS = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
  CHF: '🇨🇭', AUD: '🇦🇺', CAD: '🇨🇦', NZD: '🇳🇿',
  BTC: '₿', ETH: 'Ξ', SOL: '◎', XRP: '✕'
};

export default function StrengthMeter() {
  const { strengths, previousStrengths, isConnected, lastUpdate } = useStrengthData();
  const [sortBy, setSortBy] = useState('strength'); // 'strength' | 'name' | 'change'
  const [filter, setFilter] = useState('all'); // 'all' | 'forex' | 'crypto'

  const sortedCurrencies = React.useMemo(() => {
    let entries = Object.entries(strengths);

    // Filtra
    if (filter === 'forex') {
      entries = entries.filter(([c]) => !['BTC', 'ETH', 'SOL', 'XRP'].includes(c));
    } else if (filter === 'crypto') {
      entries = entries.filter(([c]) => ['BTC', 'ETH', 'SOL', 'XRP'].includes(c));
    }

    // Ordena
    switch (sortBy) {
      case 'strength':
        return entries.sort((a, b) => b[1] - a[1]);
      case 'name':
        return entries.sort((a, b) => a[0].localeCompare(b[0]));
      case 'change':
        return entries.sort((a, b) => {
          const changeA = a[1] - (previousStrengths[a[0]] || a[1]);
          const changeB = b[1] - (previousStrengths[b[0]] || b[1]);
          return changeB - changeA;
        });
      default:
        return entries;
    }
  }, [strengths, previousStrengths, sortBy, filter]);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Currency Strength</h2>
          <p className="text-slate-400 text-sm">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live - Updated {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Reconnecting...
              </span>
            )}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="forex">Forex Only</option>
            <option value="crypto">Crypto Only</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="strength">Sort by Strength</option>
            <option value="name">Sort by Name</option>
            <option value="change">Sort by Change</option>
          </select>
        </div>
      </div>

      {/* Lista de Moedas */}
      <div className="space-y-3">
        {sortedCurrencies.map(([currency, strength]) => {
          const prevStrength = previousStrengths[currency] || strength;
          const change = strength - prevStrength;

          return (
            <div
              key={currency}
              className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => window.location.href = `/strength/${currency.toLowerCase()}`}
            >
              {/* Flag/Icon */}
              <span className="text-2xl w-10 text-center">
                {CURRENCY_FLAGS[currency]}
              </span>

              {/* Nome */}
              <span className="text-white font-semibold w-12">
                {currency}
              </span>

              {/* Barra de Força */}
              <div className="flex-1">
                <StrengthBar value={strength} />
              </div>

              {/* Valor */}
              <span className={`text-lg font-mono w-16 text-right ${
                strength > 6 ? 'text-green-400' :
                strength < 4 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {strength.toFixed(1)}
              </span>

              {/* Tendência */}
              <TrendIndicator change={change} />
            </div>
          );
        })}
      </div>

      {/* Call to Action - Afiliado */}
      {sortedCurrencies.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
          <p className="text-white text-sm">
            <span className="font-semibold">
              {sortedCurrencies[0][0]} está forte!
            </span>{' '}
            Opere {sortedCurrencies[0][0]}/{sortedCurrencies[sortedCurrencies.length - 1][0]} com spreads zero.
          </p>
          <a
            href="https://exness.com/partner-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Abrir Conta na Exness →
          </a>
        </div>
      )}
    </div>
  );
}
```

### Gráfico Histórico

```jsx
// frontend/src/components/Charts/HistoryChart.jsx

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useHistory } from '../../hooks/useHistory';

const TIMEFRAMES = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' }
];

const CURRENCY_COLORS = {
  USD: '#22c55e', EUR: '#3b82f6', GBP: '#a855f7', JPY: '#ef4444',
  CHF: '#f97316', AUD: '#eab308', CAD: '#ec4899', NZD: '#14b8a6',
  BTC: '#f7931a', ETH: '#627eea', SOL: '#9945ff', XRP: '#23292f'
};

export default function HistoryChart({ currencies = ['USD', 'EUR', 'JPY'] }) {
  const [timeframe, setTimeframe] = useState('4h');
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies);
  
  const { data, isLoading, error } = useHistory(selectedCurrencies, timeframe);

  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Transforma dados para formato do Recharts
    const timeMap = new Map();
    
    for (const currency of selectedCurrencies) {
      const currencyData = data[currency] || [];
      for (const point of currencyData) {
        const time = new Date(point.time).getTime();
        if (!timeMap.has(time)) {
          timeMap.set(time, { time });
        }
        timeMap.get(time)[currency] = point.strength;
      }
    }
    
    return Array.from(timeMap.values()).sort((a, b) => a.time - b.time);
  }, [data, selectedCurrencies]);

  const toggleCurrency = (currency) => {
    setSelectedCurrencies(prev => 
      prev.includes(currency)
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Histórico de Força</h3>
        
        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeframe === tf.value
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(CURRENCY_COLORS).map(currency => (
          <button
            key={currency}
            onClick={() => toggleCurrency(currency)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCurrencies.includes(currency)
                ? 'text-white'
                : 'text-slate-500 opacity-50'
            }`}
            style={{
              backgroundColor: selectedCurrencies.includes(currency)
                ? CURRENCY_COLORS[currency] + '33'
                : 'transparent',
              borderColor: CURRENCY_COLORS[currency],
              borderWidth: '1px'
            }}
          >
            {currency}
          </button>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center text-red-400">
          Erro ao carregar dados
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tickFormatter={(t) => new Date(t).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#64748b"
              tickCount={6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px'
              }}
              labelFormatter={(t) => new Date(t).toLocaleString('pt-BR')}
            />
            
            {/* Linha de referência no meio (5) */}
            <ReferenceLine y={5} stroke="#475569" strokeDasharray="5 5" />
            
            {/* Linhas das moedas */}
            {selectedCurrencies.map(currency => (
              <Line
                key={currency}
                type="monotone"
                dataKey={currency}
                stroke={CURRENCY_COLORS[currency]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

### Hook de WebSocket

```javascript
// frontend/src/hooks/useStrengthData.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useStrengthData() {
  const [strengths, setStrengths] = useState({});
  const [previousStrengths, setPreviousStrengths] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    // Pega token de auth se existir
    const token = localStorage.getItem('auth_token');

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      console.log('[WS] Connected');
      setIsConnected(true);
      
      // Inscreve para receber atualizações
      socketRef.current.emit('subscribe:strength');
    });

    socketRef.current.on('disconnect', () => {
      console.log('[WS] Disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('strength:initial', (data) => {
      console.log('[WS] Initial data received');
      setStrengths(data);
      setLastUpdate(Date.now());
    });

    socketRef.current.on('strength:update', (data) => {
      setPreviousStrengths(prev => ({ ...prev, ...strengths }));
      setStrengths(data.strengths);
      setLastUpdate(data.timestamp);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('[WS] Connection error:', err);
    });
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);

  return {
    strengths,
    previousStrengths,
    isConnected,
    lastUpdate
  };
}
```

---

## 📄 Páginas SEO Programático

### Página Dinâmica por Moeda

```jsx
// frontend/src/pages/strength/[currency].jsx

import { useRouter } from 'next/router';
import Head from 'next/head';
import StrengthMeter from '../../components/Dashboard/StrengthMeter';
import HistoryChart from '../../components/Charts/HistoryChart';

const CURRENCY_INFO = {
  usd: {
    name: 'Dólar Americano',
    fullName: 'United States Dollar',
    symbol: '$',
    country: 'Estados Unidos',
    centralBank: 'Federal Reserve (Fed)',
    pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD', 'NZD/USD']
  },
  eur: {
    name: 'Euro',
    fullName: 'Euro',
    symbol: '€',
    country: 'União Europeia',
    centralBank: 'Banco Central Europeu (BCE)',
    pairs: ['EUR/USD', 'EUR/GBP', 'EUR/JPY', 'EUR/CHF', 'EUR/AUD', 'EUR/CAD', 'EUR/NZD']
  },
  // ... outras moedas
};

export default function CurrencyStrengthPage({ currency, info }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const title = `${info.name} (${currency.toUpperCase()}) Força em Tempo Real | Currency Strength Meter`;
  const description = `Análise de força do ${info.name} hoje. Veja o medidor de força ${currency.toUpperCase()} ao vivo contra EUR, GBP, JPY e outras moedas. Gráficos históricos e alertas.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={`https://seusite.com/strength/${currency}`} />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "mainEntity": {
              "@type": "Thing",
              "name": info.fullName,
              "description": `${info.fullName} - currency traded in forex markets`
            }
          })}
        </script>
      </Head>

      <main className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-6">
            <a href="/" className="hover:text-white">Home</a>
            {' > '}
            <a href="/strength" className="hover:text-white">Strength</a>
            {' > '}
            <span className="text-white">{currency.toUpperCase()}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {info.symbol} Força do {info.name} ({currency.toUpperCase()}) Hoje
            </h1>
            <p className="text-slate-400 text-lg">
              Medidor de força {currency.toUpperCase()} em tempo real. 
              Veja como o {info.name} está performando contra outras moedas principais.
            </p>
          </header>

          {/* Dashboard */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <HistoryChart currencies={[currency.toUpperCase()]} />
            </div>
            <div>
              <StrengthMeter highlight={currency.toUpperCase()} />
            </div>
          </div>

          {/* Conteúdo SEO */}
          <article className="prose prose-invert max-w-none">
            <h2>O que é o Medidor de Força do {info.name}?</h2>
            <p>
              O medidor de força do {info.name} ({currency.toUpperCase()}) mostra a força relativa 
              desta moeda comparada com outras moedas principais do mercado Forex. 
              Um valor acima de 5 indica força, enquanto abaixo de 5 indica fraqueza.
            </p>

            <h2>Pares de Moedas com {currency.toUpperCase()}</h2>
            <p>
              O {info.name} é negociado nos seguintes pares principais:
            </p>
            <ul>
              {info.pairs.map(pair => (
                <li key={pair}>{pair}</li>
              ))}
            </ul>

            <h2>Sobre o {info.name}</h2>
            <p>
              O {info.fullName} é a moeda oficial de {info.country}. 
              É regulado pelo {info.centralBank}.
            </p>

            <h2>Como Usar Este Medidor</h2>
            <p>
              Traders usam medidores de força para identificar:
            </p>
            <ul>
              <li>Moedas mais fortes para comprar</li>
              <li>Moedas mais fracas para vender</li>
              <li>Divergências entre força e preço</li>
              <li>Momentos de reversão de tendência</li>
            </ul>
          </article>

          {/* CTA Afiliado */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <h3 className="text-2xl font-bold mb-2">
              Pronto para operar {currency.toUpperCase()}?
            </h3>
            <p className="text-blue-100 mb-4">
              Abra uma conta na Exness e opere com spreads ultra-baixos.
            </p>
            <a
              href="https://exness.com/partner-link"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Criar Conta Grátis →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const currencies = Object.keys(CURRENCY_INFO);
  
  return {
    paths: currencies.map(currency => ({
      params: { currency }
    })),
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const currency = params.currency.toLowerCase();
  const info = CURRENCY_INFO[currency];
  
  if (!info) {
    return { notFound: true };
  }

  return {
    props: {
      currency,
      info
    },
    revalidate: 60 // ISR: regenera a cada 60 segundos
  };
}
```

---

## 🚀 Deploy e Infraestrutura

### Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@timescaledb:5432/currency_strength
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - timescaledb
    restart: unless-stopped

  timescaledb:
    image: timescale/timescaledb:latest-pg14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=currency_strength
    volumes:
      - timescale_data:/var/lib/postgresql/data
    restart: unless-stopped

  # MT4 Bridge roda em VPS separado com MetaTrader

volumes:
  timescale_data:
```

### Variáveis de Ambiente

```bash
# backend/.env.example

# Server
NODE_ENV=development
PORT=3001

# Database (TimescaleDB)
DATABASE_URL=postgresql://user:pass@localhost:5432/currency_strength

# Supabase (Auth e Users)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# JWT
JWT_SECRET=sua-chave-secreta-muito-longa

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...

# Frontend URL (para CORS e links)
FRONTEND_URL=https://seusite.com

# APIs de Dados (backup)
TWELVE_DATA_API_KEY=xxx

# MT4 Bridge
MT4_BRIDGE_SECRET=chave-para-validar-requisicoes-do-mt4
```

---

## 📋 Checklist de Implementação

### Fase 1: Foundation (Semana 1)
- [ ] Setup repositório Git
- [ ] Configurar backend Node.js base
- [ ] Configurar TimescaleDB
- [ ] Configurar Supabase (auth + profiles)
- [ ] Criar schema do banco de dados
- [ ] Implementar estrutura básica de pastas

### Fase 2: Data Pipeline (Semana 2)
- [ ] Criar EA do MT4 Bridge
- [ ] Implementar endpoint para receber dados MT4
- [ ] Integrar Binance WebSocket
- [ ] Implementar StrengthCalculator
- [ ] Configurar jobs de salvamento no TimescaleDB
- [ ] Testar fluxo completo de dados

### Fase 3: API & WebSocket (Semana 3)
- [ ] API REST: GET /api/strength (atual)
- [ ] API REST: GET /api/history/:currency
- [ ] API REST: CRUD /api/alerts
- [ ] WebSocket server com Socket.io
- [ ] Broadcast de atualizações
- [ ] Rate limiting e auth middleware

### Fase 4: Frontend Base (Semana 4)
- [ ] Setup Next.js + Tailwind
- [ ] Componente StrengthMeter
- [ ] Componente StrengthBar
- [ ] Hook useStrengthData (WebSocket)
- [ ] Layout responsivo
- [ ] PWA manifest + service worker

### Fase 5: Features Avançadas (Semana 5)
- [ ] Gráficos históricos (Recharts)
- [ ] Sistema de alertas (UI)
- [ ] Bot Telegram
- [ ] Páginas SEO programático
- [ ] Integração Telegram <-> App

### Fase 6: Monetização (Semana 6)
- [ ] Aplicar para programas de afiliados
- [ ] Implementar CTAs contextuais
- [ ] Página de pricing (Stripe)
- [ ] Sistema de assinaturas
- [ ] Analytics (Plausible/Umami)

---

## 🎯 Métricas de Sucesso

| Métrica | Meta 30 dias | Meta 90 dias | Meta 6 meses |
|---------|-------------|--------------|--------------|
| Usuários únicos/mês | 500 | 5.000 | 20.000 |
| Usuários registrados | 50 | 500 | 2.000 |
| Conversões afiliado | 2 | 20 | 100 |
| Receita mensal | $200 | $2.000 | $10.000 |
| Assinantes Pro | 0 | 50 | 200 |

---

## 📚 Recursos e Referências

- [TimescaleDB Docs](https://docs.timescale.com/)
- [Socket.io Docs](https://socket.io/docs/v4/)
- [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [MQL4 Reference](https://docs.mql4.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Recharts](https://recharts.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
