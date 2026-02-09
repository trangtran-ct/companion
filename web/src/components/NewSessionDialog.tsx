import { useState } from "react";

const MODELS = [
  { value: "", label: "Default" },
  { value: "claude-opus-4-6", label: "Claude Opus 4.6" },
  { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5" },
  { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
];

const PERMISSION_MODES = [
  { value: "", label: "Default" },
  { value: "bypassPermissions", label: "Bypass (auto-approve all)" },
  { value: "default", label: "Prompt (ask in UI)" },
  { value: "plan", label: "Plan mode" },
];

export function NewSessionDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (opts: { model?: string; permissionMode?: string; cwd?: string }) => Promise<void>;
}) {
  const [model, setModel] = useState("");
  const [permissionMode, setPermissionMode] = useState("");
  const [cwd, setCwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      await onCreate({
        model: model || undefined,
        permissionMode: permissionMode || undefined,
        cwd: cwd || undefined,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-cc-card rounded-[14px] border border-cc-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cc-border">
          <h2 className="text-base font-semibold text-cc-fg">New Session</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-cc-muted hover:text-cc-fg hover:bg-cc-hover transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-cc-muted mb-1.5">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-cc-input-bg border border-cc-border rounded-[10px] text-cc-fg focus:outline-none focus:border-cc-primary/50 transition-colors cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-cc-muted mb-1.5">Permission Mode</label>
            <select
              value={permissionMode}
              onChange={(e) => setPermissionMode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-cc-input-bg border border-cc-border rounded-[10px] text-cc-fg focus:outline-none focus:border-cc-primary/50 transition-colors cursor-pointer"
            >
              {PERMISSION_MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-cc-muted mb-1.5">
              Working Directory <span className="text-cc-muted/50">(optional)</span>
            </label>
            <input
              type="text"
              value={cwd}
              onChange={(e) => setCwd(e.target.value)}
              placeholder="/path/to/project"
              className="w-full px-3 py-2 text-sm bg-cc-input-bg border border-cc-border rounded-[10px] text-cc-fg font-mono-code placeholder:text-cc-muted focus:outline-none focus:border-cc-primary/50 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cc-error/5 border border-cc-error/20">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-cc-error shrink-0">
                <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm1-3a1 1 0 11-2 0 1 1 0 012 0zM7.5 5.5a.5.5 0 011 0v3a.5.5 0 01-1 0v-3z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-cc-error">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-cc-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-cc-muted hover:text-cc-fg rounded-[10px] hover:bg-cc-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium rounded-[10px] bg-cc-primary hover:bg-cc-primary-hover text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
