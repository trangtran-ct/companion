import { useStore } from "../store.js";

/** Strips the date suffix from a model ID, e.g. "claude-sonnet-4-5-20250929" → "claude-sonnet-4-5" */
function formatModelName(model: string): string {
  return model.replace(/-\d{8}$/, "");
}

/** Returns a Tailwind text color based on context usage percentage */
function contextColor(pct: number): string {
  if (pct >= 90) return "text-cc-error";
  if (pct >= 70) return "text-cc-warning";
  return "text-cc-muted";
}

export function SessionStatusLine({ sessionId }: { sessionId: string }) {
  const sessionData = useStore((s) => s.sessions.get(sessionId));

  // Hidden for Codex sessions and when there's no session data yet
  if (!sessionData || sessionData.backend_type === "codex") return null;

  const model = sessionData.model ? formatModelName(sessionData.model) : null;
  const contextPct = sessionData.context_used_percent ?? 0;

  // Nothing to show until at least one turn has completed
  if (!model && contextPct === 0) return null;

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-1 border-t border-cc-border/50 bg-cc-card text-[11px] select-none">
      {model && (
        <span className="text-cc-muted font-mono truncate max-w-[200px]" title={sessionData.model}>
          {model}
        </span>
      )}
      {contextPct > 0 && (
        <span className={`flex items-center gap-1.5 ${contextColor(contextPct)}`} title="Context window usage">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 shrink-0">
            <rect x="2" y="2" width="12" height="12" rx="1.5" />
            <path d="M2 8h12" strokeOpacity="0.4" />
            <path d={`M2 8 H${2 + (12 * Math.min(contextPct, 100)) / 100}`} strokeWidth="2" />
          </svg>
          <span>{Math.round(contextPct)}% ctx</span>
        </span>
      )}
    </div>
  );
}
