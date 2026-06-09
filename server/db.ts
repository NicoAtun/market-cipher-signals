import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, signals, webhookSettings, InsertSignal } from "../drizzle/schema";
import type { Direction, Priority, Timeframe } from "../shared/signals";
import { ENV } from "./_core/env";
import { nanoid } from "nanoid";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Signals ─────────────────────────────────────────────────────────────────

export async function insertSignal(data: InsertSignal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(signals).values(data);
  // @ts-ignore
  const insertId = result.insertId as number;
  const rows = await db.select().from(signals).where(eq(signals.id, insertId)).limit(1);
  return rows[0];
}

export async function getSignals(opts: {
  limit?: number;
  offset?: number;
  timeframe?: Timeframe | null;
  direction?: Direction | null;
}) {
  const db = await getDb();
  if (!db) return { rows: [], total: 0 };

  const conditions = [];
  if (opts.timeframe) conditions.push(eq(signals.timeframe, opts.timeframe));
  if (opts.direction) conditions.push(eq(signals.direction, opts.direction));

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  const [rows, countResult] = await Promise.all([
    db.select().from(signals).where(where).orderBy(desc(signals.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(signals).where(where),
  ]);

  return { rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function getSignalById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(signals).where(eq(signals.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getLatestSignals(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(signals).orderBy(desc(signals.createdAt)).limit(limit);
}

// ─── Webhook Settings ─────────────────────────────────────────────────────────

export async function getOrCreateWebhookSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(webhookSettings).limit(1);
  if (rows.length > 0) return rows[0];

  // Bootstrap with a random secret
  const secret = nanoid(48);
  await db.insert(webhookSettings).values({ secret, label: "TradingView Webhook" });
  const newRows = await db.select().from(webhookSettings).limit(1);
  return newRows[0];
}

export async function regenerateWebhookSecret() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const secret = nanoid(48);
  const rows = await db.select().from(webhookSettings).limit(1);
  if (rows.length === 0) {
    await db.insert(webhookSettings).values({ secret, label: "TradingView Webhook" });
  } else {
    await db.update(webhookSettings).set({ secret }).where(eq(webhookSettings.id, rows[0].id));
  }
  const updated = await db.select().from(webhookSettings).limit(1);
  return updated[0];
}
