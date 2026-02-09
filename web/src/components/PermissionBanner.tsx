import { useState } from "react";
import { useStore } from "../store.js";
import { sendToSession } from "../ws.js";
import type { PermissionRequest } from "../types.js";

export function PermissionBanner({
  permission,
  sessionId,
}: {
  permission: PermissionRequest;
  sessionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const removePermission = useStore((s) => s.removePermission);

  function handleAllow() {
    setLoading(true);
    sendToSession(sessionId, {
      type: "permission_response",
      request_id: permission.request_id,
      behavior: "allow",
    });
    removePermission(permission.request_id);
  }

  function handleDeny() {
    setLoading(true);
    sendToSession(sessionId, {
      type: "permission_response",
      request_id: permission.request_id,
      behavior: "deny",
      message: "Denied by user",
    });
    removePermission(permission.request_id);
  }

  // Format the tool input for display
  const toolInput = permission.input;
  let preview = "";
  if (permission.tool_name === "Bash" && typeof toolInput.command === "string") {
    preview = toolInput.command;
  } else if (permission.description) {
    preview = permission.description;
  } else {
    preview = JSON.stringify(toolInput).slice(0, 200);
  }

  return (
    <div className="px-4 py-3 border-b border-cc-border animate-[fadeSlideIn_0.2s_ease-out]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-cc-warning/10 border border-cc-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-cc-warning">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-cc-warning">Permission Request</span>
              <span className="text-[11px] text-cc-muted font-mono-code">{permission.tool_name}</span>
            </div>

            {preview && (
              <pre className="text-xs text-cc-fg font-mono-code bg-cc-code-bg/30 rounded-lg px-3 py-2 mb-3 max-h-24 overflow-y-auto whitespace-pre-wrap break-words">
                {permission.tool_name === "Bash" && <span className="text-cc-muted select-none">$ </span>}
                {preview}
              </pre>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cc-success/90 hover:bg-cc-success text-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <path d="M3 8.5l3.5 3.5 6.5-7" />
                </svg>
                Allow
              </button>
              <button
                onClick={handleDeny}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cc-hover hover:bg-cc-active text-cc-fg border border-cc-border disabled:opacity-50 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
                Deny
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
