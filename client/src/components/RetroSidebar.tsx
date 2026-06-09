import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "SIGNAL INBOX", code: "SIG::LIVE", icon: "⬡" },
  { path: "/history", label: "HISTORY", code: "SIG::LOG", icon: "◈" },
  { path: "/guide", label: "SIGNAL GUIDE", code: "REF::MC_B", icon: "◧" },
  { path: "/settings/webhook", label: "WEBHOOK", code: "CFG::HOOK", icon: "◉" },
];

export default function RetroSidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => navigate("/login"),
  });

  return (
    <aside className="w-56 min-h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shrink-0 relative overflow-hidden">
      {/* Vertical scanline accent */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--cyan)] to-transparent opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--cyan)] animate-pulse" />
            <span className="font-display text-[var(--cyan)] text-xs tracking-widest glow-cyan">
              MKT CIPHER
            </span>
          </div>
          <div className="font-display text-white text-sm tracking-wider leading-tight">
            SIGNAL
            <br />
            COMMAND
          </div>
          <div className="error-code">v1.0.0 // PERSONAL</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full text-left px-3 py-2.5 transition-all duration-150 group relative",
                isActive
                  ? "bg-[var(--cyan-muted)] border border-[var(--cyan)] text-[var(--cyan)]"
                  : "border border-transparent text-[var(--gray)] hover:text-[var(--off-white)] hover:border-[var(--border-bright)] hover:bg-[var(--surface-2)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--cyan)]" />
              )}
              <div className="flex items-center gap-2">
                <span className={cn("text-base leading-none", isActive ? "text-[var(--cyan)]" : "text-[var(--gray-dim)]")}>
                  {item.icon}
                </span>
                <div>
                  <div className={cn("font-display text-xs tracking-wider", isActive && "glow-cyan")}>
                    {item.label}
                  </div>
                  <div className="error-code mt-0.5">{item.code}</div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)] space-y-2">
        <div className="px-1">
          <div className="error-code">OPERATOR</div>
          <div className="font-mono text-xs text-[var(--off-white)] truncate mt-0.5">
            {user?.name ?? user?.email ?? "OWNER"}
          </div>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full text-left px-3 py-1.5 border border-[var(--border)] text-[var(--gray)] hover:text-[var(--red)] hover:border-[var(--red)] font-mono text-xs tracking-wider transition-all duration-150"
        >
          [ DISCONNECT ]
        </button>
      </div>
    </aside>
  );
}
