import React from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { DirectionBadge, PriorityBadge, TimeframeBadge } from "@/components/SignalBadges";
import type { Priority, Direction, Timeframe } from "../../../shared/signals";

function DetailRow({ label, value, accent }: { label: string; value: string | null | undefined; accent?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <div className="w-36 shrink-0 error-code pt-0.5">{label}</div>
      <div className={`font-mono text-xs flex-1 ${accent ? "text-[var(--cyan)]" : "text-[var(--off-white)]"}`}>
        {value}
      </div>
    </div>
  );
}

export default function SignalDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = parseInt(params.id ?? "0");

  const { data: signal, isLoading, error } = trpc.signals.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--deep-black)] p-6 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="font-mono text-xs text-[var(--cyan)] animate-pulse tracking-widest">LOADING SIGNAL DATA...</div>
          <div className="error-code">SYS::FETCH_0x003</div>
        </div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="min-h-screen bg-[var(--deep-black)] p-6 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="font-display text-lg text-[var(--red)] tracking-widest">[ SIGNAL NOT FOUND ]</div>
          <div className="error-code text-[var(--red)]">ERR::SIGNAL_ID_{id}_NOT_FOUND</div>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 border border-[var(--cyan)] text-[var(--cyan)] font-mono text-xs tracking-wider hover:bg-[var(--cyan-muted)] transition-all">
            ← RETURN TO INBOX
          </button>
        </div>
      </div>
    );
  }

  const createdAt = new Date(signal.createdAt);
  const alertAt = signal.alertTimestamp ? new Date(signal.alertTimestamp) : null;

  return (
    <div className="min-h-screen bg-[var(--deep-black)] p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1 as any)}
        className="font-mono text-xs text-[var(--gray)] hover:text-[var(--cyan)] tracking-wider transition-colors"
      >
        ← BACK
      </button>

      {/* Header */}
      <div className="space-y-1">
        <div className="error-code">SIG::DETAIL_0x{String(signal.id).padStart(4, "0")}</div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-2xl text-white tracking-widest" style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}>
            {signal.symbol}
          </h1>
          <DirectionBadge direction={signal.direction as Direction} />
          <TimeframeBadge timeframe={signal.timeframe as Timeframe} />
          <PriorityBadge priority={signal.priority as Priority} />
        </div>
        <p className="font-mono text-xs text-[var(--gray)]">
          {signal.signalType.replace(/_/g, " ").toUpperCase()}
        </p>
      </div>

      <div className="neon-divider" style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--cyan), transparent)", opacity: 0.4 }} />

      {/* Main detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal context */}
        <div className="retro-panel-bright p-4 space-y-0 bracket-corner">
          <div className="error-code mb-3">SIGNAL CONTEXT</div>
          <DetailRow label="SYMBOL" value={signal.symbol} accent />
          <DetailRow label="DIRECTION" value={signal.direction.toUpperCase()} />
          <DetailRow label="TIMEFRAME" value={signal.timeframe.toUpperCase()} />
          <DetailRow label="PRICE" value={`$${parseFloat(signal.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} accent />
          <DetailRow label="SIGNAL TYPE" value={signal.signalType.replace(/_/g, " ").toUpperCase()} />
          <DetailRow label="PRIORITY" value={signal.priority.replace(/_/g, " ").toUpperCase()} />
        </div>

        {/* Source metadata */}
        <div className="retro-panel-bright p-4 space-y-0 bracket-corner">
          <div className="error-code mb-3">SOURCE METADATA</div>
          <DetailRow label="INDICATOR" value={signal.indicatorSource ?? "Market Cipher"} />
          <DetailRow label="EXCHANGE" value={signal.exchange || "—"} />
          <DetailRow label="ALERT TIME" value={alertAt ? alertAt.toLocaleString("en-US", { hour12: false }) : "—"} />
          <DetailRow label="RECEIVED AT" value={createdAt.toLocaleString("en-US", { hour12: false })} />
          {signal.notes && <DetailRow label="NOTES" value={signal.notes} />}
        </div>
      </div>

      {/* Raw payload */}
      {signal.rawPayload && (
        <div className="retro-panel-bright p-4">
          <div className="error-code mb-3">RAW PAYLOAD // TRADINGVIEW WEBHOOK</div>
          <pre className="font-mono text-[10px] text-[var(--gray)] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(signal.rawPayload as object, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-[var(--border)] text-[var(--gray)] font-mono text-xs tracking-wider hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-all"
        >
          ← INBOX
        </button>
        <button
          onClick={() => navigate("/history")}
          className="px-4 py-2 border border-[var(--border)] text-[var(--gray)] font-mono text-xs tracking-wider hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-all"
        >
          HISTORY LOG
        </button>
      </div>
    </div>
  );
}
