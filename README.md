# Market Cipher Signals

Private dashboard for collecting, prioritizing, and reviewing TradingView Market Cipher alerts.

The app exposes a TradingView webhook endpoint, stores incoming signals in MySQL through Drizzle, sends owner notifications for higher-priority alerts, and presents a retro dashboard for recent signals, history, signal details, webhook setup, and the Market Cipher signal guide.

## Features

- TradingView webhook endpoint at `/api/webhooks/tradingview`
- Shared secret validation for incoming alerts
- Signal storage with raw payload capture
- Timeframe normalization for TradingView intervals
- Priority labels derived from timeframe
- Owner-only dashboard access through Manus OAuth
- Recent signal inbox, paginated history, detail view, webhook settings, and guide pages
- Vitest coverage for signal normalization, priority mapping, and webhook secret validation logic

## App Routes

| Route | Purpose |
| --- | --- |
| `/login` | OAuth login |
| `/` | Latest signal dashboard |
| `/history` | Filterable signal history |
| `/signals/:id` | Signal detail view |
| `/settings/webhook` | Webhook URL, secret, and TradingView JSON template |
| `/guide` | Market Cipher interpretation guide |

## Webhook

TradingView alerts should send a `POST` request to:

```text
/api/webhooks/tradingview
```

The full production URL is shown in the app under `/settings/webhook`.

Example alert message:

```json
{
  "secret": "your-webhook-secret",
  "symbol": "{{ticker}}",
  "exchange": "{{exchange}}",
  "timeframe": "{{interval}}",
  "price": "{{close}}",
  "direction": "long",
  "setup_type": "btc_long_confirmation",
  "indicator": "Market Cipher B",
  "notes": "Higher TF long setup",
  "timestamp": "{{timenow}}"
}
```

Accepted field aliases:

| Canonical field | Aliases |
| --- | --- |
| `symbol` | `ticker` |
| `timeframe` | `interval` |
| `price` | `close` |
| `setup_type` | `signal` |
| `indicator` | `source` |
| `timestamp` | `time` |

## Timeframe Priority

Incoming timeframe values are normalized before storage and notification decisions.

| Input examples | Stored timeframe | Priority |
| --- | --- | --- |
| `15`, `15m`, `15min` | `15m` | `medium_low` |
| `60`, `1h`, `4h`, `240` | `4h` | `medium_high` |
| `D`, `1D`, `daily`, `day` | `daily` | `high` |
| `W`, `1W`, `weekly`, `week` | `weekly` | `very_high` |
| `M`, `1M`, `monthly`, `month`, `30` | `monthly` | `very_high` |

Daily, weekly, and monthly signals trigger owner push notifications. Lower timeframe alerts are stored but do not trigger push notifications by default.

## Direction Normalization

| Input examples | Stored direction |
| --- | --- |
| `long`, `bull`, `bullish` | `long` |
| `short`, `bear`, `bearish` | `short` |
| anything else | `watch` |

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB
- Vitest
- Manus OAuth/runtime services

## Environment

The app expects the platform/runtime to provide:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `OWNER_OPEN_ID`
- `OWNER_NAME`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `VITE_FRONTEND_FORGE_API_KEY`
- `VITE_FRONTEND_FORGE_API_URL`

Do not commit `.env` files or hard-code secrets.

## Development

Install dependencies:

```sh
pnpm install
```

Run the dev server:

```sh
pnpm dev
```

Run type checks:

```sh
pnpm check
```

Run tests:

```sh
pnpm test
```

Build for production:

```sh
pnpm build
```

Apply database schema changes:

```sh
pnpm db:push
```

## Key Files

| File | Purpose |
| --- | --- |
| `server/webhookHandler.ts` | TradingView webhook route |
| `shared/signals.ts` | Shared normalization and priority logic |
| `server/db.ts` | Database helpers |
| `server/routers.ts` | tRPC procedures |
| `drizzle/schema.ts` | MySQL table schema |
| `server/signals.test.ts` | Signal utility and webhook validation tests |
| `client/src/App.tsx` | Route registration |
| `client/src/pages/WebhookSettings.tsx` | Webhook setup UI |
| `client/src/pages/SignalGuide.tsx` | Market Cipher reference guide |

## Notes

- Protected tRPC procedures are owner-only.
- The webhook route is public, but requests must include the saved shared secret.
- Unknown timeframes intentionally fall back to `daily` so alerts are visible and treated conservatively.
- Webhook notification failures are logged but do not block successful signal ingestion.
