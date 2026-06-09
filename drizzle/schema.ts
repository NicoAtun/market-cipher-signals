import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Signals ────────────────────────────────────────────────────────────────

export const signals = mysqlTable("signals", {
  id: int("id").autoincrement().primaryKey(),
  /** e.g. BTCUSD, BTCUSDT */
  symbol: varchar("symbol", { length: 32 }).notNull(),
  /** long | short | watch */
  direction: mysqlEnum("direction", ["long", "short", "watch"]).notNull(),
  /** 15m | 4h | daily | weekly | monthly */
  timeframe: mysqlEnum("timeframe", ["15m", "4h", "daily", "weekly", "monthly"]).notNull(),
  /** Numeric price at time of alert */
  price: varchar("price", { length: 32 }).notNull(),
  /** e.g. btc_long_confirmation, btc_short_watch, higher_tf_bias */
  signalType: varchar("signalType", { length: 64 }).notNull(),
  /** e.g. Market Cipher B, Market Cipher A */
  indicatorSource: varchar("indicatorSource", { length: 64 }).default("Market Cipher"),
  /** e.g. BINANCE, COINBASE */
  exchange: varchar("exchange", { length: 32 }).default(""),
  /** Optional human-readable notes from the alert */
  notes: text("notes"),
  /** Computed priority: very_high | high | medium_high | medium_low */
  priority: mysqlEnum("priority", ["very_high", "high", "medium_high", "medium_low"]).notNull(),
  /** Full raw JSON payload from TradingView */
  rawPayload: json("rawPayload").$type<Record<string, unknown>>(),
  /** UTC epoch ms when TradingView fired the alert */
  alertTimestamp: bigint("alertTimestamp", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Signal = typeof signals.$inferSelect;
export type InsertSignal = typeof signals.$inferInsert;

// ─── Webhook Settings ────────────────────────────────────────────────────────

export const webhookSettings = mysqlTable("webhook_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Human label for the webhook */
  label: varchar("label", { length: 64 }).default("TradingView Webhook"),
  /** Shared secret used to authenticate incoming payloads */
  secret: varchar("secret", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WebhookSetting = typeof webhookSettings.$inferSelect;
export type InsertWebhookSetting = typeof webhookSettings.$inferInsert;
