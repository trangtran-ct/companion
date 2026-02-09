import { useState, useRef } from "react";
import { useStore } from "../store.js";
import { sendToSession } from "../ws.js";

let idCounter = 0;

export function Composer({ sessionId }: { sessionId: string }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cliConnected = useStore((s) => s.cliConnected);

  const isConnected = cliConnected.get(sessionId) ?? false;

  function handleSend() {
    const msg = text.trim();
    if (!msg || !isConnected) return;

    // Send via WebSocket
    sendToSession(sessionId, {
      type: "user_message",
      content: msg,
      session_id: sessionId,
    });

    // Add user message to local store
    useStore.getState().appendMessage(sessionId, {
      id: `user-${Date.now()}-${++idCounter}`,
      role: "user",
      content: msg,
      timestamp: Date.now(),
    });

    setText("");

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    // Auto-resize textarea
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }

  function handleInterrupt() {
    sendToSession(sessionId, { type: "interrupt" });
  }

  const sessionStatus = useStore((s) => s.sessionStatus);
  const isRunning = sessionStatus.get(sessionId) === "running";
  const canSend = text.trim().length > 0 && isConnected;

  return (
    <div className="shrink-0 border-t border-cc-border bg-cc-card px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? "Type a message..." : "Waiting for CLI connection..."}
              disabled={!isConnected}
              rows={1}
              className="w-full px-3.5 py-2.5 text-sm bg-cc-input-bg border border-cc-border rounded-[10px] resize-none focus:outline-none focus:border-cc-primary/50 focus:ring-1 focus:ring-cc-primary/20 text-cc-fg font-sans-ui placeholder:text-cc-muted disabled:opacity-50 transition-all"
              style={{ minHeight: "40px", maxHeight: "200px" }}
            />
          </div>

          {isRunning ? (
            <button
              onClick={handleInterrupt}
              className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-cc-error/10 hover:bg-cc-error/20 text-cc-error transition-colors cursor-pointer shrink-0"
              title="Stop generation"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <rect x="3" y="3" width="10" height="10" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors shrink-0 ${
                canSend
                  ? "bg-cc-primary hover:bg-cc-primary-hover text-white cursor-pointer"
                  : "bg-cc-hover text-cc-muted cursor-not-allowed"
              }`}
              title="Send message"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M3 3l10 5-10 5V9l6-1-6-1V3z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5 px-1">
          <span className="text-[10px] text-cc-muted">
            Enter to send, Shift+Enter for newline
          </span>
        </div>
      </div>
    </div>
  );
}
