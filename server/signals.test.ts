import { describe, expect, it } from "vitest";
import {
  normalizeTimeframe,
  normalizeDirection,
  timeframeToPriority,
  isPushPriority,
} from "../shared/signals";

// ─── Timeframe normalization ──────────────────────────────────────────────────

describe("normalizeTimeframe", () => {
  it("maps TradingView 240 (minutes) to 4h", () => {
    expect(normalizeTimeframe("240")).toBe("4h");
  });

  it("maps '4h' to 4h", () => {
    expect(normalizeTimeframe("4h")).toBe("4h");
  });

  it("maps TradingView 60 (minutes) to the intraday 4h bucket", () => {
    expect(normalizeTimeframe("60")).toBe("4h");
  });

  it("maps '1h' to the intraday 4h bucket", () => {
    expect(normalizeTimeframe("1h")).toBe("4h");
  });

  it("maps '15m' to 15m", () => {
    expect(normalizeTimeframe("15m")).toBe("15m");
  });

  it("maps '15' to 15m", () => {
    expect(normalizeTimeframe("15")).toBe("15m");
  });

  it("maps 'D' to daily", () => {
    expect(normalizeTimeframe("D")).toBe("daily");
  });

  it("maps 'daily' to daily", () => {
    expect(normalizeTimeframe("daily")).toBe("daily");
  });

  it("maps 'W' to weekly", () => {
    expect(normalizeTimeframe("W")).toBe("weekly");
  });

  it("maps 'weekly' to weekly", () => {
    expect(normalizeTimeframe("weekly")).toBe("weekly");
  });

  it("maps 'M' to monthly", () => {
    expect(normalizeTimeframe("M")).toBe("monthly");
  });

  it("maps 'monthly' to monthly", () => {
    expect(normalizeTimeframe("monthly")).toBe("monthly");
  });

  it("falls back to daily for unknown values", () => {
    expect(normalizeTimeframe("unknown_tf")).toBe("daily");
  });
});

// ─── Direction normalization ──────────────────────────────────────────────────

describe("normalizeDirection", () => {
  it("maps 'long' to long", () => {
    expect(normalizeDirection("long")).toBe("long");
  });

  it("maps 'bull' to long", () => {
    expect(normalizeDirection("bull")).toBe("long");
  });

  it("maps 'bullish' to long", () => {
    expect(normalizeDirection("bullish")).toBe("long");
  });

  it("maps 'short' to short", () => {
    expect(normalizeDirection("short")).toBe("short");
  });

  it("maps 'bear' to short", () => {
    expect(normalizeDirection("bear")).toBe("short");
  });

  it("maps 'bearish' to short", () => {
    expect(normalizeDirection("bearish")).toBe("short");
  });

  it("maps unknown values to watch", () => {
    expect(normalizeDirection("neutral")).toBe("watch");
  });
});

// ─── Priority mapping ─────────────────────────────────────────────────────────

describe("timeframeToPriority", () => {
  it("maps monthly to very_high", () => {
    expect(timeframeToPriority("monthly")).toBe("very_high");
  });

  it("maps weekly to very_high", () => {
    expect(timeframeToPriority("weekly")).toBe("very_high");
  });

  it("maps daily to high", () => {
    expect(timeframeToPriority("daily")).toBe("high");
  });

  it("maps 4h to medium_high", () => {
    expect(timeframeToPriority("4h")).toBe("medium_high");
  });

  it("maps 15m to medium_low", () => {
    expect(timeframeToPriority("15m")).toBe("medium_low");
  });
});

// ─── Push notification eligibility ───────────────────────────────────────────

describe("isPushPriority", () => {
  it("returns true for very_high (monthly/weekly)", () => {
    expect(isPushPriority("very_high")).toBe(true);
  });

  it("returns true for high (daily)", () => {
    expect(isPushPriority("high")).toBe(true);
  });

  it("returns false for medium_high (4h)", () => {
    expect(isPushPriority("medium_high")).toBe(false);
  });

  it("returns false for medium_low (15m)", () => {
    expect(isPushPriority("medium_low")).toBe(false);
  });
});

// ─── Webhook secret validation (unit logic) ───────────────────────────────────

describe("webhook secret validation logic", () => {
  const validSecret = "test-secret-abc123";

  function validateSecret(incoming: unknown, stored: string): boolean {
    if (!incoming || typeof incoming !== "string") return false;
    return incoming === stored;
  }

  it("accepts matching secret", () => {
    expect(validateSecret(validSecret, validSecret)).toBe(true);
  });

  it("rejects mismatched secret", () => {
    expect(validateSecret("wrong-secret", validSecret)).toBe(false);
  });

  it("rejects missing secret", () => {
    expect(validateSecret(undefined, validSecret)).toBe(false);
  });

  it("rejects empty string secret", () => {
    expect(validateSecret("", validSecret)).toBe(false);
  });

  it("rejects non-string secret", () => {
    expect(validateSecret(12345, validSecret)).toBe(false);
  });
});
