import { useState } from "react";
import type { ChatMessage, ContentBlock } from "../types.js";
import { ToolBlock } from "./ToolBlock.js";

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-cc-border" />
        <span className="text-[11px] text-cc-muted italic font-mono-code shrink-0 px-1">
          {message.content}
        </span>
        <div className="flex-1 h-px bg-cc-border" />
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-[fadeSlideIn_0.2s_ease-out]">
        <div className="max-w-[80%] px-4 py-2.5 rounded-[14px] rounded-br-[4px] bg-cc-user-bubble text-cc-fg">
          <pre className="text-[14px] whitespace-pre-wrap break-words font-sans-ui leading-relaxed">
            {message.content}
          </pre>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="animate-[fadeSlideIn_0.2s_ease-out]">
      <AssistantMessage message={message} />
    </div>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  const blocks = message.contentBlocks || [];

  if (blocks.length === 0 && message.content) {
    return (
      <div className="flex items-start gap-3">
        <AssistantAvatar />
        <div className="flex-1 min-w-0">
          <pre className="font-serif-assistant text-[15px] text-cc-fg whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />
      <div className="flex-1 min-w-0 space-y-3">
        {blocks.map((block, i) => (
          <ContentBlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="w-6 h-6 rounded-full bg-cc-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-cc-primary">
        <circle cx="8" cy="8" r="3" />
      </svg>
    </div>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === "text") {
    return (
      <div className="font-serif-assistant text-[15px] text-cc-fg whitespace-pre-wrap break-words leading-relaxed">
        {renderTextWithCodeBlocks(block.text)}
      </div>
    );
  }

  if (block.type === "thinking") {
    return <ThinkingBlock text={block.thinking} />;
  }

  if (block.type === "tool_use") {
    return <ToolBlock name={block.name} input={block.input} toolUseId={block.id} />;
  }

  if (block.type === "tool_result") {
    const content = typeof block.content === "string" ? block.content : JSON.stringify(block.content);
    const isError = block.is_error;
    return (
      <div className={`text-xs font-mono-code rounded-lg px-3 py-2 border ${
        isError
          ? "bg-cc-error/5 border-cc-error/20 text-cc-error"
          : "bg-cc-card border-cc-border text-cc-muted"
      } max-h-40 overflow-y-auto whitespace-pre-wrap`}>
        {content}
      </div>
    );
  }

  return null;
}

function ThinkingBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-cc-border rounded-[10px] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-cc-muted hover:bg-cc-hover transition-colors cursor-pointer"
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
        <span className="font-medium">Thinking</span>
        <span className="text-cc-muted/60">{text.length} chars</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0">
          <pre className="text-xs text-cc-muted font-mono-code whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}

function renderTextWithCodeBlocks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Text before code block
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {renderInlineCode(text.slice(lastIndex, match.index))}
        </span>
      );
    }

    const lang = match[1];
    const code = match[2].trimEnd();
    parts.push(
      <div key={`code-${match.index}`} className="my-2 rounded-lg overflow-hidden border border-cc-border">
        {lang && (
          <div className="px-3 py-1.5 bg-cc-code-bg/80 border-b border-cc-border text-[10px] text-cc-muted font-mono-code uppercase tracking-wider">
            {lang}
          </div>
        )}
        <pre className="px-3 py-2.5 bg-cc-code-bg text-cc-code-fg text-[13px] font-mono-code leading-relaxed overflow-x-auto">
          {code}
        </pre>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {renderInlineCode(text.slice(lastIndex))}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key="full">{text}</span>];
}

function renderInlineCode(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const inlineRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <code
        key={`inline-${match.index}`}
        className="px-1 py-0.5 rounded bg-cc-code-bg/30 text-[13px] font-mono-code text-cc-primary"
      >
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
