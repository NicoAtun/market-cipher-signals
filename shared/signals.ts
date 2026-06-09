// Shared signal utilities — used by both server and client

export type Timeframe = "15m" | "4h" | "daily" | "weekly" | "monthly";
export type Direction = "long" | "short" | "watch";
export type Priority = "very_high" | "high" | "medium_high" | "medium_low";

/** Maps a timeframe string (case-insensitive) to a canonical Timeframe enum value */
export function normalizeTimeframe(raw: string): Timeframe {
  const t = raw.toLowerCase().trim();
  if (t === "15" || t === "15m" || t === "15min") return "15m";
  if (t === "60" || t === "1h" || t === "4h" || t === "240") {
    // TradingView sends interval as minutes: 240 = 4h
    if (t === "240" || t === "4h") return "4h";
  }
  if (t === "d" || t === "1d" || t === "daily" || t === "day") return "daily";
  if (t === "w" || t === "1w" || t === "weekly" || t === "week") return "weekly";
  if (t === "m" || t === "1m" || t === "monthly" || t === "month" || t === "30") return "monthly";
  // TradingView numeric intervals
  if (t === "15") return "15m";
  if (t === "240") return "4h";
  return "daily"; // safe fallback
}

/** Derives priority from timeframe */
export function timeframeToPriority(tf: Timeframe): Priority {
  switch (tf) {
    case "monthly":
    case "weekly":
      return "very_high";
    case "daily":
      return "high";
    case "4h":
      return "medium_high";
    case "15m":
    default:
      return "medium_low";
  }
}

/** Returns true if the priority level should trigger a push notification */
export function isPushPriority(priority: Priority): boolean {
  return priority === "very_high" || priority === "high";
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  very_high: "VERY HIGH",
  high: "HIGH",
  medium_high: "MED-HIGH",
  medium_low: "MED-LOW",
};

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  daily: "Daily",
  "4h": "4H",
  "15m": "15m",
};

export const DIRECTION_LABELS: Record<Direction, string> = {
  long: "LONG",
  short: "SHORT",
  watch: "WATCH",
};

/** Validates and normalizes a direction string */
export function normalizeDirection(raw: string): Direction {
  const d = raw.toLowerCase().trim();
  if (d === "long" || d === "bull" || d === "bullish") return "long";
  if (d === "short" || d === "bear" || d === "bearish") return "short";
  return "watch";
}
