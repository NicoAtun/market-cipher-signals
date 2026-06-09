# Market Cipher Signals — Project TODO

## Phase 1: Schema & Migrations
- [x] Add `signals` table to drizzle/schema.ts (symbol, direction, timeframe, price, signalType, indicatorSource, exchange, notes, priority, rawPayload, createdAt)
- [x] Add `webhook_settings` table (secret token, label, createdAt)
- [x] Generate migration SQL and apply via webdev_execute_sql

## Phase 2: Backend
- [x] Public webhook POST endpoint at /api/webhooks/tradingview (validates secret, parses JSON, saves signal)
- [x] tRPC procedure: signals.list (paginated, filterable by timeframe + direction)
- [x] tRPC procedure: signals.getById (full detail)
- [x] tRPC procedure: signals.getLatest (for dashboard inbox)
- [x] tRPC procedure: webhookSettings.get (returns URL + secret)
- [x] tRPC procedure: webhookSettings.regenerateSecret
- [x] Push notification on new signal arrival (owner notify, priority flag for Daily/Weekly/Monthly)
- [x] Owner-only guard on all protected procedures

## Phase 3: Frontend
- [x] Global retro-futuristic design system: scanlines, chromatic aberration, monospace fonts, neon cyan/magenta palette
- [x] DashboardLayout customized with retro-futuristic sidebar nav
- [x] Dashboard / Signal Inbox page (live latest signals, priority badges)
- [x] Signal History page with filters (timeframe, direction)
- [x] Signal Detail page (full context: all fields)
- [x] Webhook Settings page (webhook URL + secret, copy buttons)
- [x] Timeframe priority label component (Very High / High / Medium-High / Medium-Low)
- [x] Direction badge component (LONG / SHORT / WATCH)
- [x] Empty states with retro-futuristic styling
- [x] Responsive layout

## Phase 4: Tests & Delivery
- [x] Vitest: webhook endpoint secret validation
- [x] Vitest: signal priority labeling logic
- [x] Vitest: signals.list filter logic
- [x] Save checkpoint
