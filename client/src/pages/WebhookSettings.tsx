import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — select and copy manually");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 border font-mono text-xs tracking-wider transition-all duration-150 shrink-0 ${
        copied
          ? "border-[var(--green)] text-[var(--green)] bg-[rgba(0,255,65,0.08)]"
          : "border-[var(--border-bright)] text-[var(--gray)] hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
      }`}
    >
      {copied ? "[ COPIED ✓ ]" : "[ COPY ]"}
    </button>
  );
}

export default function WebhookSettings() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.webhook.getSettings.useQuery();
  const regenerateMutation = trpc.webhook.regenerateSecret.useMutation({
    onSuccess: () => {
      utils.webhook.getSettings.invalidate();
      toast.success("Webhook secret regenerated. Update your TradingView alerts.");
    },
    onError: (err) => {
      toast.error(`Failed to regenerate secret: ${err.message}`);
    },
  });

  const webhookUrl = settings
    ? `${window.location.origin}/api/webhooks/tradingview`
    : "";

  return (
    <div className="min-h-screen bg-[var(--deep-black)] p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="error-code">CFG::WEBHOOK_0x004</div>
        <h1
          className="font-display text-2xl text-white tracking-widest"
          style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}
        >
          WEBHOOK SETTINGS
        </h1>
        <p className="font-mono text-xs text-[var(--gray)]">
          Configure TradingView alerts to POST to your private webhook endpoint
        </p>
      </div>

      <div className="neon-divider" />

      {isLoading && (
        <div className="py-12 text-center">
          <div className="font-mono text-xs text-[var(--cyan)] animate-pulse tracking-widest">
            LOADING CONFIGURATION...
          </div>
        </div>
      )}

      {settings && (
        <div className="space-y-6 max-w-2xl">
          {/* Webhook URL */}
          <div className="retro-panel-bright p-5 space-y-3 bracket-corner">
            <div className="error-code">WEBHOOK ENDPOINT URL</div>
            <p className="font-mono text-xs text-[var(--gray)] leading-relaxed">
              Paste this URL into the "Webhook URL" field when creating a TradingView alert.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--surface-2)] border border-[var(--border-bright)] px-3 py-2 font-mono text-xs text-[var(--cyan)] break-all">
                {webhookUrl}
              </div>
              <CopyButton text={webhookUrl} label="Webhook URL" />
            </div>
          </div>

          {/* Secret Token */}
          <div className="retro-panel-bright p-5 space-y-3 bracket-corner">
            <div className="error-code">SHARED SECRET TOKEN</div>
            <p className="font-mono text-xs text-[var(--gray)] leading-relaxed">
              Include this secret in every TradingView alert JSON payload as{" "}
              <span className="text-[var(--cyan)]">"secret": "..."</span>. The server
              rejects any request without a matching secret.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--surface-2)] border border-[var(--border-bright)] px-3 py-2 font-mono text-xs text-[var(--magenta)] break-all">
                {settings.secret}
              </div>
              <CopyButton text={settings.secret} label="Secret token" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => regenerateMutation.mutate()}
                disabled={regenerateMutation.isPending}
                className="px-4 py-2 border border-[var(--red)] text-[var(--red)] font-mono text-xs tracking-wider hover:bg-[rgba(255,0,64,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {regenerateMutation.isPending ? "[ REGENERATING... ]" : "[ REGENERATE SECRET ]"}
              </button>
              <span className="error-code text-[var(--amber)]">
                ⚠ INVALIDATES ALL EXISTING ALERTS
              </span>
            </div>
          </div>

          {/* Alert JSON template */}
          <div className="retro-panel-bright p-5 space-y-3">
            <div className="error-code">TRADINGVIEW ALERT JSON TEMPLATE</div>
            <p className="font-mono text-xs text-[var(--gray)] leading-relaxed">
              Paste the following JSON into the "Message" field of your TradingView alert.
              Customize <span className="text-[var(--cyan)]">direction</span> and{" "}
              <span className="text-[var(--cyan)]">setup_type</span> per alert.
            </p>
            <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4 overflow-x-auto">
              <pre className="font-mono text-[11px] text-[var(--off-white)] leading-relaxed whitespace-pre">{`{
  "secret": "${settings.secret}",
  "symbol": "{{ticker}}",
  "exchange": "{{exchange}}",
  "timeframe": "{{interval}}",
  "price": "{{close}}",
  "direction": "long",
  "setup_type": "btc_long_confirmation",
  "indicator": "Market Cipher B",
  "notes": "Higher TF long setup",
  "timestamp": "{{timenow}}"
}`}</pre>
            </div>
            <CopyButton
              text={`{\n  "secret": "${settings.secret}",\n  "symbol": "{{ticker}}",\n  "exchange": "{{exchange}}",\n  "timeframe": "{{interval}}",\n  "price": "{{close}}",\n  "direction": "long",\n  "setup_type": "btc_long_confirmation",\n  "indicator": "Market Cipher B",\n  "notes": "Higher TF long setup",\n  "timestamp": "{{timenow}}"\n}`}
              label="Alert JSON template"
            />
          </div>

          {/* Priority notification info */}
          <div className="retro-panel-bright p-5 space-y-3">
            <div className="error-code">PUSH NOTIFICATION PRIORITY RULES</div>
            <div className="space-y-2">
              {[
                { tf: "Monthly / Weekly", priority: "VERY HIGH", color: "var(--magenta)", note: "Priority push notification" },
                { tf: "Daily", priority: "HIGH", color: "var(--cyan)", note: "Priority push notification" },
                { tf: "4H", priority: "MED-HIGH", color: "var(--amber)", note: "Standard notification" },
                { tf: "15m", priority: "MED-LOW", color: "var(--gray)", note: "Standard notification" },
              ].map((row) => (
                <div key={row.tf} className="flex items-center gap-4 py-1.5 border-b border-[var(--border)] last:border-0">
                  <div className="w-28 font-mono text-xs text-[var(--off-white)]">{row.tf}</div>
                  <div className="w-20 font-mono text-xs" style={{ color: row.color }}>{row.priority}</div>
                  <div className="error-code">{row.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
