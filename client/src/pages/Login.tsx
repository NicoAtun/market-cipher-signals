import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[var(--deep-black)] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--cyan) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-16 h-16 border-l border-t border-[var(--cyan)] opacity-40" />
      <div className="absolute top-6 right-6 w-16 h-16 border-r border-t border-[var(--cyan)] opacity-40" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-l border-b border-[var(--magenta)] opacity-40" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r border-b border-[var(--magenta)] opacity-40" />

      {/* Main panel */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="error-code tracking-widest">SYS::AUTH_REQUIRED_0x001</div>
          <h1
            className="font-display text-3xl text-white tracking-widest glow-cyan"
            style={{ textShadow: "-2px 0 var(--cyan), 2px 0 var(--magenta)" }}
          >
            MKT CIPHER
          </h1>
          <div className="font-display text-[var(--gray)] text-xs tracking-widest">
            SIGNAL COMMAND // RESTRICTED ACCESS
          </div>
          <div className="neon-divider mx-auto w-48 mt-3" />
        </div>

        {/* Auth panel */}
        <div className="retro-panel-bright p-6 space-y-6 bracket-corner">
          <div className="space-y-1">
            <div className="error-code">AUTHENTICATION PROTOCOL</div>
            <p className="font-mono text-xs text-[var(--gray)] leading-relaxed">
              This terminal is restricted to authorized operators only. Unauthorized access attempts are logged and reported.
            </p>
          </div>

          <div className="neon-divider" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--cyan)] animate-pulse" />
              <span className="error-code">IDENTITY VERIFICATION REQUIRED</span>
            </div>

            <a
              href={getLoginUrl()}
              className="block w-full text-center py-3 px-4 border border-[var(--cyan)] text-[var(--cyan)] font-display text-sm tracking-widest hover:bg-[var(--cyan-muted)] transition-all duration-200 box-glow-cyan"
            >
              [ AUTHENTICATE OPERATOR ]
            </a>
          </div>

          <div className="neon-divider-magenta" />

          <div className="error-code text-center">
            MARKET CIPHER // PERSONAL SIGNAL SYSTEM
          </div>
        </div>

        {/* Bottom status */}
        <div className="mt-6 flex justify-between items-center">
          <div className="error-code">CONN::SECURE_TLS_1.3</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
            <span className="error-code text-[var(--green)]">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
