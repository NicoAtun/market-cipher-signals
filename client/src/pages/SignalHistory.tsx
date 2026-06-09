import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { SignalRow } from "@/components/SignalBadges";
import type { Timeframe, Direction } from "../../../shared/signals";

const TIMEFRAMES: { value: Timeframe | null; label: string }[] = [
  { value: null, label: "ALL TF" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
  { value: "4h", label: "4H" },
  { value: "15m", label: "15m" },
];

const DIRECTIONS: { value: Direction | null; label: string }[] = [
  { value: null, label: "ALL" },
  { value: "long", label: "LONG" },
  { value: "short", label: "SHORT" },
  { value: "watch", label: "WATCH" },
];

const PAGE_SIZE = 50;

export default function SignalHistory() {
  const [, navigate] = useLocation();
  const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error } = trpc.signals.list.useQuery({
    limit: PAGE_SIZE,
    offset,
    timeframe,
    direction,
  });

  const signals = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  function handleFilterChange() {
    setOffset(0);
  }

  return (
    <div className="min-h-screen bg-[var(--deep-black)] p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="error-code">SIG::HISTORY_LOG_0x002</div>
        <h1 className="font-display text-2xl text-white tracking-widest" style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}>
          SIGNAL HISTORY
        </h1>
        <p className="font-mono text-xs text-[var(--gray)]">
          Full alert log — filter by timeframe and direction
        </p>
      </div>

      <div className="neon-divider" />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="error-code w-20">TIMEFRAME:</span>
          {TIMEFRAMES.map((tf) => (
            <button
              key={String(tf.value)}
              onClick={() => { setTimeframe(tf.value); handleFilterChange(); }}
              className={`px-3 py-1 border font-mono text-xs tracking-wider transition-all duration-150 ${
                timeframe === tf.value
                  ? "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan-muted)]"
                  : "border-[var(--border)] text-[var(--gray)] hover:border-[var(--border-bright)] hover:text-[var(--off-white)]"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="error-code w-20">DIRECTION:</span>
          {DIRECTIONS.map((d) => (
            <button
              key={String(d.value)}
              onClick={() => { setDirection(d.value); handleFilterChange(); }}
              className={`px-3 py-1 border font-mono text-xs tracking-wider transition-all duration-150 ${
                direction === d.value
                  ? "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan-muted)]"
                  : "border-[var(--border)] text-[var(--gray)] hover:border-[var(--border-bright)] hover:text-[var(--off-white)]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <div className="error-code">
          {isLoading ? "QUERYING..." : `${total} SIGNALS FOUND`}
        </div>
        {total > 0 && (
          <div className="error-code">
            PAGE {currentPage} / {totalPages}
          </div>
        )}
      </div>

      {/* Signal list */}
      <div className="retro-panel-bright overflow-hidden">
        <div className="px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
          <span className="error-code">DIRECTION // SYMBOL // SIGNAL TYPE</span>
          <span className="error-code">TF // PRIORITY // PRICE // TIME</span>
        </div>

        {isLoading && (
          <div className="px-4 py-12 text-center">
            <div className="font-mono text-xs text-[var(--cyan)] animate-pulse tracking-widest">
              QUERYING SIGNAL DATABASE...
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-8 text-center">
            <div className="font-display text-sm text-[var(--red)] tracking-wider">[ QUERY ERROR ]</div>
            <div className="error-code text-[var(--red)] mt-1">ERR::DB_QUERY_FAILED</div>
          </div>
        )}

        {!isLoading && !error && signals.length === 0 && (
          <div className="px-4 py-16 text-center space-y-3">
            <div className="font-display text-lg text-[var(--gray)] tracking-widest">NO RECORDS FOUND</div>
            <div className="error-code">ADJUST FILTERS OR AWAIT INCOMING SIGNALS</div>
          </div>
        )}

        {!isLoading && signals.map((signal) => (
          <SignalRow
            key={signal.id}
            signal={signal}
            onClick={() => navigate(`/signals/${signal.id}`)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0}
            className="px-4 py-1.5 border border-[var(--border)] font-mono text-xs tracking-wider text-[var(--gray)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← PREV
          </button>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= total}
            className="px-4 py-1.5 border border-[var(--border)] font-mono text-xs tracking-wider text-[var(--gray)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}
