import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import RetroSidebar from "./RetroSidebar";

interface Props {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--deep-black)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-[var(--cyan)] font-mono text-xs tracking-widest animate-pulse">
            AUTHENTICATING...
          </div>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent" />
          <div className="error-code">SYS::AUTH_CHECK_0x001</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--deep-black)] flex">
      <RetroSidebar />
      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
