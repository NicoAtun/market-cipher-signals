import { cn } from "@/lib/utils";
import type { Priority, Direction, Timeframe } from "../../../shared/signals";
import { PRIORITY_LABELS, DIRECTION_LABELS, TIMEFRAME_LABELS } from "../../../shared/signals";

// ─── Priority Badge ──────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<Priority, string> = {
  very_high: "border-[var(--magenta)] text-[var(--magenta)] bg-[var(--magenta-muted)] glow-magenta",
  high: "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan-muted)] glow-cyan",
  medium_high: "border-[var(--amber)] text-[var(--amber)] bg-[rgba(255,170,0,0.08)]",
  medium_low: "border-[var(--gray)] text-[var(--gray)] bg-transparent",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 border font-mono text-[10px] tracking-widest uppercase",
        PRIORITY_STYLES[priority]
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

// ─── Direction Badge ─────────────────────────────────────────────────────────

const DIRECTION_STYLES: Record<Direction, string> = {
  long: "border-[var(--green)] text-[var(--green)] bg-[rgba(0,255,65,0.08)] glow-green",
  short: "border-[var(--red)] text-[var(--red)] bg-[rgba(255,0,64,0.08)] glow-red",
  watch: "border-[var(--amber)] text-[var(--amber)] bg-[rgba(255,170,0,0.08)]",
};

export function DirectionBadge({ direction }: { direction: Direction }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 border font-display text-xs tracking-widest uppercase font-bold",
        DIRECTION_STYLES[direction]
      )}
    >
      {DIRECTION_LABELS[direction]}
    </span>
  );
}

// ─── Timeframe Badge ─────────────────────────────────────────────────────────

export function TimeframeBadge({ timeframe }: { timeframe: Timeframe }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 border border-[var(--border-bright)] text-[var(--off-white)] font-mono text-[10px] tracking-wider uppercase bg-[var(--surface-2)]">
      {TIMEFRAME_LABELS[timeframe]}
    </span>
  );
}

// ─── Signal Row Card ─────────────────────────────────────────────────────────

interface SignalRowProps {
  signal: {
    id: number;
    symbol: string;
    direction: string;
    timeframe: string;
    price: string;
    signalType: string;
    priority: string;
    indicatorSource?: string | null;
    createdAt: Date | string;
  };
  onClick?: () => void;
}

export function SignalRow({ signal, onClick }: SignalRowProps) {
  const ts = new Date(signal.createdAt);
  const timeStr = ts.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
  const dateStr = ts.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });

  return (
    <button
      onClick={onClick}
      className="w-full text-left retro-panel border-b border-[var(--border)] px-4 py-3 hover:bg-[var(--surface-2)] hover:border-l-2 hover:border-l-[var(--cyan)] transition-all duration-150 group"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: direction + symbol */}
        <div className="flex items-center gap-3 min-w-0">
          <DirectionBadge direction={signal.direction as Direction} />
          <div className="min-w-0">
            <div className="font-display text-sm text-white tracking-wider group-hover:text-[var(--cyan)] transition-colors">
              {signal.symbol}
            </div>
            <div className="error-code mt-0.5 truncate">{signal.signalType.replace(/_/g, " ")}</div>
          </div>
        </div>

        {/* Center: timeframe + priority */}
        <div className="flex items-center gap-2 shrink-0">
          <TimeframeBadge timeframe={signal.timeframe as Timeframe} />
          <PriorityBadge priority={signal.priority as Priority} />
        </div>

        {/* Right: price + time */}
        <div className="text-right shrink-0">
          <div className="font-mono text-xs text-[var(--off-white)]">
            ${parseFloat(signal.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
          <div className="error-code mt-0.5">{dateStr} {timeStr}</div>
        </div>
      </div>
    </button>
  );
}
