import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { SignalRow } from "@/components/SignalBadges";
import { PriorityBadge } from "@/components/SignalBadges";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { data: signals, isLoading, error } = trpc.signals.latest.useQuery({ limit: 20 });

  return (
    <div className="min-h-screen bg-[var(--deep-black)] p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="error-code">SIG::LIVE_FEED_0x001</div>
          <h1 className="font-display text-2xl text-white tracking-widest" style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}>
            SIGNAL INBOX
          </h1>
          <p className="font-mono text-xs text-[var(--gray)]">
            Live Market Cipher alerts — BTC focus — manual trading only
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse" />
          <span className="error-code text-[var(--green)]">RECEIVING</span>
        </div>
      </div>

      <div className="neon-divider" />

      {/* Priority legend */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="error-code">PRIORITY KEY:</span>
        {(["very_high", "high", "medium_high", "medium_low"] as const).map((p) => (
          <PriorityBadge key={p} priority={p} />
        ))}
      </div>

      {/* Signal list */}
      <div className="retro-panel-bright overflow-hidden">
        {/* Table header */}
        <div className="px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
          <span className="error-code">DIRECTION // SYMBOL // SIGNAL TYPE</span>
          <span className="error-code">TF // PRIORITY // PRICE // TIME</span>
        </div>

        {isLoading && (
          <div className="px-4 py-12 text-center space-y-3">
            <div className="font-mono text-xs text-[var(--cyan)] animate-pulse tracking-widest">
              LOADING SIGNAL FEED...
            </div>
            <div className="error-code">SYS::FETCH_0x002</div>
          </div>
        )}

        {error && (
          <div className="px-4 py-8 text-center space-y-2">
            <div className="font-display text-sm text-[var(--red)] tracking-wider">
              [ FEED ERROR ]
            </div>
            <div className="error-code text-[var(--red)]">ERR::FETCH_FAILED_{error.message.slice(0, 20).toUpperCase()}</div>
          </div>
        )}

        {!isLoading && !error && signals && signals.length === 0 && (
          <div className="px-4 py-16 text-center space-y-4">
            <div className="font-display text-lg text-[var(--gray)] tracking-widest">
              NO SIGNALS DETECTED
            </div>
            <div className="error-code">AWAITING TRADINGVIEW WEBHOOK PAYLOAD</div>
            <div className="neon-divider mx-auto w-32 mt-2" />
            <p className="font-mono text-xs text-[var(--gray)] max-w-xs mx-auto leading-relaxed">
              Configure your TradingView alerts to POST to your webhook URL. Navigate to Webhook Settings to get your URL and secret.
            </p>
            <button
              onClick={() => navigate("/settings/webhook")}
              className="mt-2 px-4 py-2 border border-[var(--cyan)] text-[var(--cyan)] font-mono text-xs tracking-widest hover:bg-[var(--cyan-muted)] transition-all"
            >
              [ VIEW WEBHOOK SETTINGS ]
            </button>
          </div>
        )}

        {!isLoading && signals && signals.map((signal) => (
          <SignalRow
            key={signal.id}
            signal={signal}
            onClick={() => navigate(`/signals/${signal.id}`)}
          />
        ))}
      </div>

      {/* Footer */}
      {signals && signals.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="error-code">SHOWING LATEST {signals.length} SIGNALS</div>
          <button
            onClick={() => navigate("/history")}
            className="font-mono text-xs text-[var(--cyan)] hover:glow-cyan tracking-wider transition-all"
          >
            VIEW FULL HISTORY →
          </button>
        </div>
      )}
    </div>
  );
}
