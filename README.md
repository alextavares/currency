# Currency Strength

Dashboard de força relativa (0–100) por timeframe, alimentado por preços via MT5 (EA pusher) ou via API (opcional).

## Rodando com Docker (produção/local)

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

- Frontend: `http://localhost:3105`
- Backend: `http://localhost:3101`

## MT5 EA (pusher)

Veja `mt5/README.md`.

## Deploy no Contabo (1 comando)

Veja `docs/deploy-contabo.md`.

## Monitoring (recomendado)

Veja `docs/monitoring.md`.
