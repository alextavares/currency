# MT5 price pusher

This EA posts a small set of FX prices to the backend so the Currency Strength Meter updates without needing OANDA/other data APIs.

## Backend URL

- Backend API: `http://161.97.106.190:3101`
- POST endpoint: `http://161.97.106.190:3101/api/mt4/prices`
- Frontend: `http://161.97.106.190:3105`

## Install

1. Open MT5 → `File` → `Open Data Folder`
2. Copy `CurrencyStrengthPusher.mq5` into `MQL5/Experts/`
3. In MT5, open `Navigator` → `Expert Advisors` → right-click → `Refresh`
4. Open `Tools` → `Options` → `Expert Advisors`
   - Enable `Allow WebRequest for listed URL`
   - Add: `http://161.97.106.190:3101`
5. Attach the EA to any chart.

## Troubleshooting

- If you see `HTTP 400` in the Experts log, re-download/recompile the EA: it strips the null-terminator so the backend can parse JSON.
- You can confirm the backend is receiving pushes here:
  - `http://161.97.106.190:3101/api/debug/mt4`

## What it sends

By default it posts these 7 symbols every 60 seconds:

`EURUSD, GBPUSD, AUDUSD, NZDUSD, USDCAD, USDCHF, USDJPY`

The backend triangulates the remaining crosses internally.
