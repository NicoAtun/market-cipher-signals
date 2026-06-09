import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import SignalHistory from "./pages/SignalHistory";
import SignalDetail from "./pages/SignalDetail";
import WebhookSettings from "./pages/WebhookSettings";
import SignalGuide from "./pages/SignalGuide";
import Login from "./pages/Login";
import ProtectedLayout from "./components/ProtectedLayout";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/history" component={() => <ProtectedLayout><SignalHistory /></ProtectedLayout>} />
      <Route path="/signals/:id" component={() => <ProtectedLayout><SignalDetail /></ProtectedLayout>} />
      <Route path="/settings/webhook" component={() => <ProtectedLayout><WebhookSettings /></ProtectedLayout>} />
      <Route path="/guide" component={() => <ProtectedLayout><SignalGuide /></ProtectedLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                border: "1px solid var(--border-bright)",
                color: "var(--off-white)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
