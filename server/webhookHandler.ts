import type { Express, Request, Response } from "express";
import { getOrCreateWebhookSettings, insertSignal } from "./db";
import { notifyOwner } from "./_core/notification";
import {
  normalizeTimeframe,
  normalizeDirection,
  timeframeToPriority,
  isPushPriority,
  PRIORITY_LABELS,
  TIMEFRAME_LABELS,
  DIRECTION_LABELS,
} from "../shared/signals";

export function registerWebhookRoutes(app: Express) {
  /**
   * POST /api/webhooks/tradingview
   *
   * Accepts JSON payloads from TradingView alerts.
   * Expected body shape (all fields optional except secret):
   * {
   *   secret: string,          // shared secret for auth
   *   symbol?: string,         // e.g. "BTCUSD"
   *   ticker?: string,         // TradingView {{ticker}} placeholder
   *   exchange?: string,       // e.g. "BINANCE"
   *   timeframe?: string,      // e.g. "240" (4h), "D" (daily)
   *   interval?: string,       // TradingView {{interval}} placeholder
   *   price?: string | number, // close price
   *   close?: string | number, // TradingView {{close}} placeholder
   *   direction?: string,      // "long" | "short" | "watch"
   *   setup_type?: string,     // signal type label
   *   signal?: string,         // alternative signal type label
   *   indicator?: string,      // e.g. "Market Cipher B"
   *   source?: string,         // alternative indicator source
   *   notes?: string,
   *   timestamp?: number,      // epoch ms
   *   time?: string,           // TradingView {{time}} placeholder
   * }
   */
  app.post("/api/webhooks/tradingview", async (req: Request, res: Response) => {
    try {
      const body = req.body as Record<string, unknown>;

      // ── 1. Validate secret ──────────────────────────────────────────────
      const settings = await getOrCreateWebhookSettings();
      const incomingSecret = body.secret as string | undefined;

      if (!incomingSecret || incomingSecret !== settings.secret) {
        res.status(401).json({ error: "Unauthorized: invalid secret" });
        return;
      }

      // ── 2. Parse fields ─────────────────────────────────────────────────
      const symbol = String(body.symbol ?? body.ticker ?? "BTCUSD").toUpperCase();
      const exchange = String(body.exchange ?? "").toUpperCase();
      const rawTimeframe = String(body.timeframe ?? body.interval ?? "daily");
      const rawPrice = String(body.price ?? body.close ?? "0");
      const rawDirection = String(body.direction ?? "watch");
      const signalType = String(body.setup_type ?? body.signal ?? "market_cipher_alert");
      const indicatorSource = String(body.indicator ?? body.source ?? "Market Cipher");
      const notes = body.notes ? String(body.notes) : null;

      // Parse alert timestamp
      let alertTimestamp: number | null = null;
      if (body.timestamp) {
        alertTimestamp = Number(body.timestamp);
      } else if (body.time) {
        const parsed = Date.parse(String(body.time));
        if (!isNaN(parsed)) alertTimestamp = parsed;
      }

      // ── 3. Normalize & derive priority ──────────────────────────────────
      const timeframe = normalizeTimeframe(rawTimeframe);
      const direction = normalizeDirection(rawDirection);
      const priority = timeframeToPriority(timeframe);

      // ── 4. Save to database ─────────────────────────────────────────────
      const signal = await insertSignal({
        symbol,
        direction,
        timeframe,
        price: rawPrice,
        signalType,
        indicatorSource,
        exchange: exchange || "",
        notes: notes ?? undefined,
        priority,
        rawPayload: body,
        alertTimestamp: alertTimestamp ?? undefined,
      });

      // ── 5. Push notification to owner ───────────────────────────────────
      const shouldPush = isPushPriority(priority);
      const priorityLabel = PRIORITY_LABELS[priority];
      const tfLabel = TIMEFRAME_LABELS[timeframe];
      const dirLabel = DIRECTION_LABELS[direction];
      const priceFormatted = parseFloat(rawPrice).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const notifTitle = shouldPush
        ? `⚡ PRIORITY SIGNAL: ${symbol} ${dirLabel} [${tfLabel}]`
        : `Signal: ${symbol} ${dirLabel} [${tfLabel}]`;

      const notifContent = [
        `Symbol: ${symbol}`,
        `Direction: ${dirLabel}`,
        `Timeframe: ${tfLabel}`,
        `Priority: ${priorityLabel}`,
        `Price: $${priceFormatted}`,
        `Signal: ${signalType}`,
        `Source: ${indicatorSource}`,
        exchange ? `Exchange: ${exchange}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Fire-and-forget — don't let notification failure block the 200 response
      notifyOwner({ title: notifTitle, content: notifContent }).catch((err) => {
        console.error("[Webhook] Notification failed:", err);
      });

      // ── 6. Respond immediately ──────────────────────────────────────────
      res.status(200).json({ ok: true, id: signal?.id });
    } catch (err) {
      console.error("[Webhook] Error processing payload:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
