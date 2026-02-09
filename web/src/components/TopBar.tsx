import { useStore } from "../store.js";

export function TopBar() {
  const currentSessionId = useStore((s) => s.currentSessionId);
  const sessions = useStore((s) => s.sessions);
  const cliConnected = useStore((s) => s.cliConnected);
  const sessionStatus = useStore((s) => s.sessionStatus);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);

  const session = currentSessionId ? sessions.get(currentSessionId) : null;
  const isConnected = currentSessionId ? (cliConnected.get(currentSessionId) ?? false) : false;
  const status = currentSessionId ? (sessionStatus.get(currentSessionId) ?? null) : null;

  return (
    <header className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-cc-card border-b border-cc-border">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-cc-muted hover:text-cc-fg hover:bg-cc-hover transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Connection status */}
        {currentSessionId && (
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? "bg-cc-success" : "bg-cc-muted opacity-40"
              }`}
            />
            <span className="text-[11px] text-cc-muted">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        )}
      </div>

      {/* Session info */}
      {session && (
        <div className="flex items-center gap-4 text-[12px] text-cc-muted">
          {session.model && (
            <div className="flex items-center gap-1.5">
              <span className="text-cc-muted/60">Model</span>
              <span className="font-medium text-cc-fg font-mono-code text-[11px]">{session.model}</span>
            </div>
          )}

          {session.total_cost_usd > 0 && (
            <>
              <span className="text-cc-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cc-muted/60">Cost</span>
                <span className="font-medium text-cc-fg tabular-nums">${session.total_cost_usd.toFixed(4)}</span>
              </div>
            </>
          )}

          {session.context_used_percent > 0 && (
            <>
              <span className="text-cc-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cc-muted/60">Context</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-cc-hover overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        session.context_used_percent > 80
                          ? "bg-cc-error"
                          : session.context_used_percent > 50
                          ? "bg-cc-warning"
                          : "bg-cc-primary"
                      }`}
                      style={{ width: `${Math.min(session.context_used_percent, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-cc-fg tabular-nums">{session.context_used_percent}%</span>
                </div>
              </div>
            </>
          )}

          {status === "compacting" && (
            <>
              <span className="text-cc-border">|</span>
              <span className="text-cc-warning font-medium animate-pulse">Compacting...</span>
            </>
          )}

          {status === "running" && (
            <>
              <span className="text-cc-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cc-primary animate-[pulse-dot_1s_ease-in-out_infinite]" />
                <span className="text-cc-primary font-medium">Thinking</span>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
