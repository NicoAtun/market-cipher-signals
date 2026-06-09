export default function SignalGuide() {
  return (
    <div className="min-h-screen bg-[var(--deep-black)] p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="error-code">REF::SIGNAL_GUIDE_0x005</div>
        <h1
          className="font-display text-2xl text-white tracking-widest"
          style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}
        >
          SIGNAL INTERPRETATION GUIDE
        </h1>
        <p className="font-mono text-xs text-[var(--gray)]">
          Market Cipher B indicator reference — signal meanings, biases, and action context
        </p>
      </div>

      <div className="neon-divider" />

      {/* Overview */}
      <Section code="SYS::OVERVIEW_0x001" title="MARKET CIPHER B — SYSTEM OVERVIEW">
        <p className="font-mono text-xs text-[var(--off-white)] leading-relaxed max-w-2xl">
          Market Cipher B is a composite indicator suite built on TradingView. It combines Wave Trend
          momentum, Money Flow analysis, divergence detection, and multi-timeframe VWAP to identify
          high-probability long and short setups. All signals are most reliable on higher timeframes
          (Daily, Weekly, Monthly). Lower timeframes (15m, 4H) provide entry timing only — never
          standalone trade decisions.
        </p>
      </Section>

      {/* Wave Trend Oscillator */}
      <Section code="WT::WAVE_TREND_0x002" title="WAVE TREND OSCILLATOR (WT1 / WT2)">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          The primary momentum oscillator. WT1 is the fast line; WT2 is the slow signal line.
          Crossovers generate buy and sell signals. The oscillator ranges from approximately -100 to +100.
        </p>
        <Table
          headers={["Condition", "Signal", "Bias", "Action Context"]}
          rows={[
            ["WT1 crosses above WT2 in oversold zone (below -53)", "Bullish Cross", "LONG", "Primary long entry signal. Strongest when on Daily/Weekly."],
            ["WT1 crosses below WT2 in overbought zone (above +53)", "Bearish Cross", "SHORT", "Primary short entry signal. Strongest when on Daily/Weekly."],
            ["WT oscillator below -53", "Oversold", "LONG WATCH", "Approaching long setup zone. Wait for cross confirmation."],
            ["WT oscillator above +53", "Overbought", "SHORT WATCH", "Approaching short setup zone. Wait for cross confirmation."],
            ["WT1 and WT2 both trending up from mid-range", "Bullish Momentum", "LONG HOLD", "Trend continuation. Hold longs, avoid new shorts."],
            ["WT1 and WT2 both trending down from mid-range", "Bearish Momentum", "SHORT HOLD", "Trend continuation. Hold shorts, avoid new longs."],
          ]}
        />
      </Section>

      {/* Money Flow */}
      <Section code="MF::MONEY_FLOW_0x003" title="MONEY FLOW (MFI)">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          Displayed as a colored bar at the bottom of the Wave Trend panel. Measures buying vs selling
          pressure using volume-weighted price movement. Confirms or contradicts price direction.
        </p>
        <Table
          headers={["Color", "Signal", "Bias", "Action Context"]}
          rows={[
            ["Green / Bright Green", "Positive Money Flow", "LONG", "Buyers in control. Confirms long setups. Strong green = high conviction."],
            ["Red / Dark Red", "Negative Money Flow", "SHORT", "Sellers in control. Confirms short setups. Dark red = high conviction."],
            ["Green → Red flip", "Money Flow Reversal (Bearish)", "SHORT", "Momentum shift. Watch for WT bearish cross to confirm."],
            ["Red → Green flip", "Money Flow Reversal (Bullish)", "LONG", "Momentum shift. Watch for WT bullish cross to confirm."],
            ["Fading green (lighter)", "Weakening Bullish Flow", "CAUTION", "Buyers losing strength. Tighten stops on longs."],
            ["Fading red (lighter)", "Weakening Bearish Flow", "CAUTION", "Sellers losing strength. Tighten stops on shorts."],
          ]}
        />
      </Section>

      {/* Dots */}
      <Section code="DOT::SIGNAL_DOTS_0x004" title="SIGNAL DOTS (PRICE CHART OVERLAYS)">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          Colored dots and diamonds printed directly on the price chart. These are the most visually
          prominent signals and represent high-confidence setups when they align with higher timeframe context.
        </p>
        <Table
          headers={["Dot Type", "Color", "Signal", "Action Context"]}
          rows={[
            ["Small Circle", "Green", "Bullish WT Cross (oversold)", "Long entry signal. Strongest on Daily+. Use 4H for entry timing."],
            ["Small Circle", "Red", "Bearish WT Cross (overbought)", "Short entry signal. Strongest on Daily+. Use 4H for entry timing."],
            ["Diamond", "Gold / Orange", "Overbought Extreme", "Price at extended high. Potential reversal zone. Tighten long stops."],
            ["Diamond", "Purple / Magenta", "Oversold Extreme", "Price at extended low. Potential reversal zone. Watch for long setup."],
            ["Large Circle", "Cyan / Blue", "VWAP Cross Signal", "Institutional flow signal. Confirms direction when aligned with WT."],
            ["X Mark", "Yellow / Gold", "Divergence Warning", "Price and WT diverging. Potential trend exhaustion. High caution."],
          ]}
        />
      </Section>

      {/* Divergences */}
      <Section code="DIV::DIVERGENCE_0x005" title="DIVERGENCES">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          Divergences occur when price makes a new high/low but the Wave Trend oscillator does not confirm
          it. These are among the most powerful signals in Market Cipher — especially on higher timeframes.
        </p>
        <Table
          headers={["Type", "Condition", "Bias", "Action Context"]}
          rows={[
            ["Bullish Regular Divergence", "Price: lower low. WT: higher low.", "STRONG LONG", "Classic reversal signal. Highest conviction on Weekly/Daily."],
            ["Bearish Regular Divergence", "Price: higher high. WT: lower high.", "STRONG SHORT", "Classic reversal signal. Highest conviction on Weekly/Daily."],
            ["Bullish Hidden Divergence", "Price: higher low. WT: lower low.", "LONG CONTINUATION", "Trend continuation long. Price structure is bullish."],
            ["Bearish Hidden Divergence", "Price: lower high. WT: higher high.", "SHORT CONTINUATION", "Trend continuation short. Price structure is bearish."],
            ["RSI Divergence (lower panel)", "RSI and price diverging", "CONFIRMATION", "Use to confirm WT divergence. Double divergence = very high conviction."],
          ]}
        />
      </Section>

      {/* Timeframe Priority */}
      <Section code="TF::TIMEFRAME_PRIORITY_0x006" title="TIMEFRAME PRIORITY SYSTEM">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          Not all signals carry equal weight. Higher timeframe signals override lower timeframe signals.
          Always establish the higher timeframe bias before acting on a lower timeframe entry.
        </p>
        <Table
          headers={["Timeframe", "Priority", "Role", "How to Use"]}
          rows={[
            ["Monthly", "VERY HIGH", "Macro Bias", "Sets the dominant trend direction for months. Never trade against monthly bias."],
            ["Weekly", "VERY HIGH", "Swing Bias", "Defines multi-week trend. Long setups only when weekly is bullish."],
            ["Daily", "HIGH", "Trade Bias", "Primary signal timeframe. Daily WT cross + money flow = high conviction entry."],
            ["4H", "MED-HIGH", "Entry Timing", "Use to time entries after Daily/Weekly signal. Confirms intraday momentum."],
            ["15m", "MED-LOW", "Precision Entry", "Fine-tune entry price only. Never use as standalone signal."],
          ]}
        />
      </Section>

      {/* Setup Checklist */}
      <Section code="CHK::SETUP_CHECKLIST_0x007" title="HIGH-CONVICTION LONG SETUP CHECKLIST">
        <p className="font-mono text-xs text-[var(--gray)] leading-relaxed mb-4">
          All conditions should align for a maximum-conviction BTC long entry. The more boxes checked,
          the higher the probability of a successful trade.
        </p>
        <div className="space-y-2 max-w-2xl">
          {[
            { label: "Weekly WT is oversold or crossing bullish", priority: "REQUIRED" },
            { label: "Weekly Money Flow is green or turning green", priority: "REQUIRED" },
            { label: "Daily WT bullish cross confirmed", priority: "REQUIRED" },
            { label: "Daily Money Flow is green", priority: "REQUIRED" },
            { label: "Green dot printed on Daily or Weekly chart", priority: "STRONG" },
            { label: "Bullish divergence visible on Daily or Weekly", priority: "STRONG" },
            { label: "4H WT crossing bullish (entry timing)", priority: "ENTRY" },
            { label: "Price above key VWAP / support level", priority: "CONFIRMATION" },
            { label: "Monthly WT not in overbought territory", priority: "FILTER" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-1.5 border-b border-[var(--border)] last:border-0">
              <div
                className="w-24 shrink-0 font-mono text-[10px] tracking-wider px-1.5 py-0.5 border text-center"
                style={{
                  color: item.priority === "REQUIRED" ? "var(--magenta)" :
                         item.priority === "STRONG" ? "var(--cyan)" :
                         item.priority === "ENTRY" ? "var(--amber)" : "var(--gray)",
                  borderColor: item.priority === "REQUIRED" ? "var(--magenta)" :
                               item.priority === "STRONG" ? "var(--cyan)" :
                               item.priority === "ENTRY" ? "var(--amber)" : "var(--border)",
                }}
              >
                {item.priority}
              </div>
              <div className="font-mono text-xs text-[var(--off-white)]">{item.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Short Setup Checklist */}
      <Section code="CHK::SHORT_CHECKLIST_0x008" title="HIGH-CONVICTION SHORT SETUP CHECKLIST">
        <div className="space-y-2 max-w-2xl">
          {[
            { label: "Weekly WT is overbought or crossing bearish", priority: "REQUIRED" },
            { label: "Weekly Money Flow is red or turning red", priority: "REQUIRED" },
            { label: "Daily WT bearish cross confirmed", priority: "REQUIRED" },
            { label: "Daily Money Flow is red", priority: "REQUIRED" },
            { label: "Red dot or orange diamond printed on Daily or Weekly", priority: "STRONG" },
            { label: "Bearish divergence visible on Daily or Weekly", priority: "STRONG" },
            { label: "4H WT crossing bearish (entry timing)", priority: "ENTRY" },
            { label: "Price below key VWAP / resistance level", priority: "CONFIRMATION" },
            { label: "Monthly WT not in oversold territory", priority: "FILTER" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-1.5 border-b border-[var(--border)] last:border-0">
              <div
                className="w-24 shrink-0 font-mono text-[10px] tracking-wider px-1.5 py-0.5 border text-center"
                style={{
                  color: item.priority === "REQUIRED" ? "var(--magenta)" :
                         item.priority === "STRONG" ? "var(--cyan)" :
                         item.priority === "ENTRY" ? "var(--amber)" : "var(--gray)",
                  borderColor: item.priority === "REQUIRED" ? "var(--magenta)" :
                               item.priority === "STRONG" ? "var(--cyan)" :
                               item.priority === "ENTRY" ? "var(--amber)" : "var(--border)",
                }}
              >
                {item.priority}
              </div>
              <div className="font-mono text-xs text-[var(--off-white)]">{item.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Current BTC Read */}
      <Section code="LIVE::CURRENT_READ_0x009" title="CURRENT BTC WEEKLY READ (AS OF JUN 2026)">
        <div className="retro-panel-bright p-4 max-w-2xl space-y-3">
          <div className="error-code text-[var(--amber)]">⚠ MANUAL ANALYSIS — UPDATE AFTER EACH WEEKLY CLOSE</div>
          <div className="space-y-2">
            {[
              { label: "Price", value: "~$61,651", status: "NEUTRAL" },
              { label: "Weekly WT", value: "Rolling over, bearish cross forming", status: "BEARISH" },
              { label: "Weekly Money Flow", value: "Turning red / negative", status: "BEARISH" },
              { label: "Weekly Dots", value: "Orange diamonds near ATH — no green dot yet", status: "BEARISH" },
              { label: "Oversold?", value: "Not yet — WT mid-range heading down", status: "WATCH" },
              { label: "Long Setup?", value: "NOT CONFIRMED — wait for WT oversold + green dot", status: "WAIT" },
              { label: "Short Bias", value: "Active — price below May 2026 range low ($63,500)", status: "ACTIVE" },
              { label: "Key Support", value: "$55,000–$58,000 (prior consolidation zone)", status: "WATCH" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3 py-1 border-b border-[var(--border)] last:border-0">
                <div className="w-32 shrink-0 font-mono text-[10px] text-[var(--gray)] tracking-wider pt-0.5">{row.label}</div>
                <div className="flex-1 font-mono text-xs text-[var(--off-white)]">{row.value}</div>
                <div
                  className="shrink-0 font-mono text-[10px] tracking-wider"
                  style={{
                    color: row.status === "BEARISH" ? "var(--red)" :
                           row.status === "ACTIVE" ? "var(--magenta)" :
                           row.status === "WAIT" ? "var(--amber)" :
                           row.status === "WATCH" ? "var(--cyan)" : "var(--gray)",
                  }}
                >
                  {row.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="neon-divider" />
      <div className="error-code text-center pb-4">
        REF::END_OF_GUIDE — SIGNALS ARE PROBABILISTIC, NOT GUARANTEES — MANAGE RISK ACCORDINGLY
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  code,
  title,
  children,
}: {
  code: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="error-code">{code}</div>
        <h2
          className="font-display text-base text-white tracking-widest mt-0.5"
          style={{ textShadow: "-1px 0 var(--cyan), 1px 0 var(--magenta)" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto max-w-4xl">
      <table className="w-full border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-[var(--border-bright)]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2 px-3 text-[var(--cyan)] tracking-wider font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2 px-3 leading-relaxed ${
                    j === 0
                      ? "text-[var(--off-white)]"
                      : j === 1
                      ? "text-[var(--magenta)]"
                      : j === 2
                      ? getCellBiasColor(cell)
                      : "text-[var(--gray)]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getCellBiasColor(value: string): string {
  const v = value.toUpperCase();
  if (v.includes("LONG") || v.includes("BULL") || v.includes("GREEN") || v.includes("POSITIVE"))
    return "text-[var(--green)]";
  if (v.includes("SHORT") || v.includes("BEAR") || v.includes("RED") || v.includes("NEGATIVE"))
    return "text-[var(--red)]";
  if (v.includes("WATCH") || v.includes("CAUTION") || v.includes("WARN"))
    return "text-[var(--amber)]";
  if (v.includes("CONFIRM") || v.includes("FILTER") || v.includes("ENTRY"))
    return "text-[var(--cyan)]";
  return "text-[var(--off-white)]";
}
