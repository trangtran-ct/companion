import { useEffect } from "react";
import { useStore } from "./store.js";
import { Sidebar } from "./components/Sidebar.js";
import { ChatView } from "./components/ChatView.js";
import { TopBar } from "./components/TopBar.js";

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const currentSessionId = useStore((s) => s.currentSessionId);
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen flex font-sans-ui bg-cc-bg text-cc-fg antialiased">
      {/* Sidebar */}
      <div
        className={`shrink-0 transition-all duration-200 ${
          sidebarOpen ? "w-[260px]" : "w-0"
        } overflow-hidden`}
      >
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-hidden">
          {currentSessionId ? (
            <ChatView sessionId={currentSessionId} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 h-full flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-cc-card border border-cc-border flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-cc-muted">
            <path d="M8 9h8M8 13h5M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 01-4.57-1.24L3 21l1.24-4.43A8.96 8.96 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-cc-fg mb-2">No session selected</h2>
        <p className="text-sm text-cc-muted leading-relaxed">
          Create a new session from the sidebar to start chatting with Claude Code.
        </p>
      </div>
    </div>
  );
}
